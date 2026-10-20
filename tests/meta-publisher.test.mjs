import test from 'node:test'
import assert from 'node:assert/strict'
import { publishMetaPost, PostRecordError, checkMetaContainerStatus, waitForContainerReady, inspectPostReservation } from '../lib/metaPublisher.ts'
import { campaignUrl } from '../lib/socialCampaign.ts'
import { GithubSocialPostLedger } from '../lib/socialPostLedger.ts'
import { spawnSync } from 'node:child_process'

const ready = { checkStatus: async () => 'FINISHED', wait: async () => {} }

process.env.META_DRY_RUN = 'false'
process.env.THREADS_PUBLISH_ENABLED = 'true'
process.env.INSTAGRAM_PUBLISH_ENABLED = 'true'
process.env.THREADS_TOKEN_EXPIRES_AT = '2099-01-01T00:00:00Z'
process.env.INSTAGRAM_TOKEN_EXPIRES_AT = '2099-01-01T00:00:00Z'

const input = { channel: 'threads', slug: 'typhoon-prep-goods', campaign: 'article', approved: true,
  text: `備えを確認\n${campaignUrl('typhoon-prep-goods', 'threads')}` }

function memoryLedger() {
  const records = new Map()
  return {
    records,
    async reserve(key) {
      const id = JSON.stringify(key)
      if (records.has(id)) throw new Error('予約済みのため再送しません')
      records.set(id, { status: 'reserved' })
    },
    async markContainer(key, containerId) {
      records.set(JSON.stringify(key), { status: 'container_ready', containerId })
    },
    async markPublished(key, postId) {
      records.set(JSON.stringify(key), { ...records.get(JSON.stringify(key)), status: 'published', postId })
    },
  }
}

test('ドライランと媒体別停止、期限不足なら台帳もAPIも使わない', async () => {
  const ledger = memoryLedger()
  let sends = 0
  const transport = async () => { sends++; return '123' }
  process.env.SOCIAL_PUBLISH_ENABLED = 'true'
  process.env.META_DRY_RUN = 'true'
  await assert.rejects(publishMetaPost(input, { ledger, transport, ...ready }), /ドライラン/)
  process.env.META_DRY_RUN = 'false'
  process.env.THREADS_PUBLISH_ENABLED = 'false'
  await assert.rejects(publishMetaPost(input, { ledger, transport, ...ready }), /媒体別/)
  process.env.THREADS_PUBLISH_ENABLED = 'true'
  process.env.THREADS_TOKEN_EXPIRES_AT = '2026-10-20T00:00:00Z'
  await assert.rejects(publishMetaPost(input, { ledger, transport, ...ready }), /期限/)
  process.env.THREADS_TOKEN_EXPIRES_AT = '2099-01-01T00:00:00Z'
  assert.equal(ledger.records.size, 0)
  assert.equal(sends, 0)
})

test('未有効化と未認証では台帳を予約せず送信しない', async () => {
  const ledger = memoryLedger()
  let sends = 0
  const transport = async () => { sends++; return '123' }
  process.env.SOCIAL_PUBLISH_ENABLED = 'false'
  await assert.rejects(publishMetaPost(input, { ledger, transport, ...ready }), /無効/)
  process.env.SOCIAL_PUBLISH_ENABLED = 'true'
  delete process.env.THREADS_ACCOUNT_ID
  delete process.env.THREADS_ACCESS_TOKEN
  await assert.rejects(publishMetaPost(input, { ledger, transport, ...ready }), /認証/)
  assert.equal(ledger.records.size, 0)
  assert.equal(sends, 0)
})

test('並行送信で同一キーを二重予約できない', async () => {
  process.env.SOCIAL_PUBLISH_ENABLED = 'true'
  process.env.THREADS_ACCOUNT_ID = '12345'
  process.env.THREADS_ACCESS_TOKEN = 'mock-token'
  const ledger = memoryLedger()
  let sends = 0
  const transport = async () => { sends++; return String(sends) }
  const results = await Promise.allSettled([
    publishMetaPost(input, { ledger, transport, ...ready }), publishMetaPost(input, { ledger, transport, ...ready }),
  ])
  assert.deepEqual(results.map((result) => result.status).sort(), ['fulfilled', 'rejected'])
  assert.equal(sends, 2)
  assert.equal([...ledger.records.values()][0].status, 'published')
})

test('公開結果不明ならコンテナIDを残し、盲目的な再送を止める', async () => {
  const ledger = memoryLedger()
  let sends = 0
  const transport = async () => {
    sends++
    if (sends === 2) throw new Error('応答不明')
    return '67890'
  }
  await assert.rejects(publishMetaPost(input, { ledger, transport, ...ready }), /応答不明/)
  assert.deepEqual([...ledger.records.values()][0], { status: 'container_ready', containerId: '67890' })
  await assert.rejects(publishMetaPost(input, { ledger, transport, ...ready }), /予約済み/)
  assert.equal(sends, 2)
})

test('コンテナ作成の応答が不明でも予約を残して再作成しない', async () => {
  const ledger = memoryLedger()
  let sends = 0
  const transport = async () => { sends++; throw new Error('作成応答不明') }
  await assert.rejects(publishMetaPost(input, { ledger, transport, ...ready }), /作成応答不明/)
  assert.equal([...ledger.records.values()][0].status, 'reserved')
  await assert.rejects(publishMetaPost(input, { ledger, transport, ...ready }), /予約済み/)
  assert.equal(sends, 1)
})

test('公開成功後の台帳記録失敗は投稿IDを返して再送を止める', async () => {
  const ledger = memoryLedger()
  ledger.markPublished = async () => { throw new Error('記録失敗') }
  let sends = 0
  const transport = async () => { sends++; return sends === 1 ? '67890' : '98765' }
  await assert.rejects(publishMetaPost(input, { ledger, transport, ...ready }), (error) =>
    error instanceof PostRecordError && error.postId === '98765')
  await assert.rejects(publishMetaPost(input, { ledger, transport, ...ready }), /予約済み/)
  assert.equal(sends, 2)
})

test('GitHub台帳はSHAなし作成の競合を失敗として扱う', async () => {
  process.env.SOCIAL_LEDGER_GITHUB_TOKEN = 'mock-token'
  process.env.SOCIAL_LEDGER_BRANCH = 'social-ledger'
  const originalFetch = globalThis.fetch
  let payload
  globalThis.fetch = async (_url, options) => {
    payload = JSON.parse(options.body)
    return { ok: false, status: 409 }
  }
  try {
    await assert.rejects(new GithubSocialPostLedger().reserve({ channel: 'threads', slug: 'test', campaign: 'article' }), /再送は禁止/)
    assert.equal(payload.branch, 'social-ledger')
    assert.equal('sha' in payload, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('保存済みThreadsコンテナIDの状態を読み取り照合できる', async () => {
  const originalFetch = globalThis.fetch
  let calledUrl
  globalThis.fetch = async (url) => {
    calledUrl = String(url)
    return { ok: true, json: async () => ({ id: '67890', status: 'PUBLISHED' }) }
  }
  try {
    assert.equal(await checkMetaContainerStatus('threads', '67890'), 'PUBLISHED')
    assert.match(calledUrl, /67890\?fields=id%2Cstatus%2Cerror_message/)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Instagramコンテナのstatus_codeを読み取り照合できる', async () => {
  process.env.INSTAGRAM_ACCOUNT_ID = '12345'
  process.env.INSTAGRAM_ACCESS_TOKEN = 'mock-token'
  process.env.META_GRAPH_VERSION = 'v24.0'
  const originalFetch = globalThis.fetch
  let calledUrl
  globalThis.fetch = async (url) => {
    calledUrl = String(url)
    return { ok: true, json: async () => ({ id: '67890', status_code: 'FINISHED' }) }
  }
  try {
    assert.equal(await checkMetaContainerStatus('instagram', '67890'), 'FINISHED')
    assert.match(calledUrl, /graph\.instagram\.com\/v24\.0\/67890\?fields=id%2Cstatus_code/)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('準備状態を確認してから公開し、未完了は期限付きで停止する', async () => {
  let checks = 0
  let waits = 0
  await waitForContainerReady('threads', '67890', 'mock', '', async () => ++checks === 2 ? 'FINISHED' : 'IN_PROGRESS', async () => { waits++ })
  assert.equal(checks, 2)
  assert.equal(waits, 1)
  await assert.rejects(waitForContainerReady('instagram', '67890', 'mock', 'v24.0', async () => 'IN_PROGRESS', async () => {}), /制限時間/)
  await assert.rejects(waitForContainerReady('instagram', '67890', 'mock', 'v24.0', async () => 'ERROR', async () => {}), /公開可能な状態ではありません/)
})

test('コンテナ準備が未完了なら公開APIを呼ばない', async () => {
  const ledger = memoryLedger()
  let sends = 0
  const transport = async () => { sends++; return '67890' }
  await assert.rejects(publishMetaPost(input, { ledger, transport, checkStatus: async () => 'ERROR' }), /公開可能な状態ではありません/)
  assert.equal(sends, 1)
  assert.equal([...ledger.records.values()][0].status, 'container_ready')
})

test('台帳とMetaの状態を読み取り専用で照合する', async () => {
  const originalFetch = globalThis.fetch
  const calls = []
  const record = { channel: 'threads', slug: 'typhoon-prep-goods', campaign: 'article', status: 'container_ready', reservedAt: '2026-10-19T00:00:00Z', containerId: '67890' }
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), method: options?.method ?? 'GET' })
    if (String(url).includes('api.github.com')) return { ok: true, json: async () => ({ sha: 'abc', encoding: 'base64', content: Buffer.from(JSON.stringify(record)).toString('base64') }) }
    return { ok: true, json: async () => ({ id: '67890', status: 'PUBLISHED' }) }
  }
  try {
    assert.deepEqual(await inspectPostReservation({ channel: 'threads', slug: 'typhoon-prep-goods', campaign: 'article' }), { record, remoteStatus: 'PUBLISHED' })
    assert.deepEqual(calls.map((call) => call.method), ['GET', 'GET'])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('台帳専用ブランチのVercelビルドをスキップする', () => {
  const run = (branch) => spawnSync('sh', ['scripts/skip-social-ledger-build.sh'], { env: { ...process.env, VERCEL_GIT_COMMIT_REF: branch } }).status
  assert.equal(run('social-ledger'), 0)
  assert.equal(run('main'), 1)
  assert.equal(run('feat/social-funnel'), 1)
})
