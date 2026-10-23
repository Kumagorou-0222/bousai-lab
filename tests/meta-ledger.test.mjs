import test from 'node:test'
import assert from 'node:assert/strict'
import { GithubSocialPostLedger } from '../lib/socialPostLedger.ts'
import { publishMetaPost } from '../lib/metaPublisher.ts'

const key = { channel: 'threads', accountId: '12345', dateJst: '2026-10-21', slug: 'emergency-toilet', campaign: 'daily-20261021' }

async function withGithub(run, failAfterCommit = () => false) {
  const originalFetch = globalThis.fetch
  const oldToken = process.env.SOCIAL_LEDGER_GITHUB_TOKEN
  const oldBranch = process.env.SOCIAL_LEDGER_BRANCH
  process.env.SOCIAL_LEDGER_GITHUB_TOKEN = 'mock-token'
  process.env.SOCIAL_LEDGER_BRANCH = 'social-ledger'
  const files = new Map()
  let revision = 0
  globalThis.fetch = async (url, init = {}) => {
    assert.match(String(url), /^https:\/\/api\.github\.com\/repos\/Kumagorou-0222\/bousai-lab\/contents\/\.social-post-ledger\//)
    assert.equal(init.headers.Authorization, 'Bearer mock-token')
    const path = new URL(url).pathname
    if ((init.method ?? 'GET') === 'GET') {
      const file = files.get(path)
      return file ? Response.json({ sha: file.sha, content: Buffer.from(JSON.stringify(file.record)).toString('base64'), encoding: 'base64' }) : new Response('', { status: 404 })
    }
    assert.equal(init.method, 'PUT')
    const payload = JSON.parse(init.body)
    assert.equal(payload.branch, 'social-ledger')
    const old = files.get(path)
    if ((old && payload.sha !== old.sha) || (!old && payload.sha)) return new Response('', { status: 409 })
    const record = JSON.parse(Buffer.from(payload.content, 'base64').toString('utf8'))
    files.set(path, { sha: String(++revision), record })
    if (failAfterCommit(record)) throw new DOMException('結果不明', 'TimeoutError')
    return Response.json({ content: { sha: String(revision) } })
  }
  try { await run({ files, ledger: new GithubSocialPostLedger() }) }
  finally {
    globalThis.fetch = originalFetch
    if (oldToken === undefined) delete process.env.SOCIAL_LEDGER_GITHUB_TOKEN
    else process.env.SOCIAL_LEDGER_GITHUB_TOKEN = oldToken
    if (oldBranch === undefined) delete process.env.SOCIAL_LEDGER_BRANCH
    else process.env.SOCIAL_LEDGER_BRANCH = oldBranch
  }
}

test('GitHub の作成409で同一アカウント・日の並行予約は一件だけ', async () => {
  await withGithub(async ({ ledger, files }) => {
    const results = await Promise.allSettled([ledger.reserve(key), ledger.reserve({ ...key, slug: 'another', campaign: 'other' })])
    assert.equal(results.filter(x => x.status === 'fulfilled').length, 1)
    assert.equal(results.filter(x => x.status === 'rejected').length, 1)
    assert.match(results.find(x => x.status === 'rejected').reason.message, /409/)
    assert.equal(files.size, 1)
  })
})

test('予約作成が成功後に通信断でも、次の予約は409で止まる', async () => {
  let failed = false
  await withGithub(async ({ ledger, files }) => {
    await assert.rejects(ledger.reserve(key), /結果不明/)
    await assert.rejects(ledger.reserve(key), /409/)
    assert.equal([...files.values()][0].record.status, 'reserved')
  }, record => record.status === 'reserved' && !failed++)
})

test('コンテナ記録の SHA 競合は更新を拒否し、元予約を保持する', async () => {
  await withGithub(async ({ ledger, files }) => {
    await ledger.reserve(key)
    const competing = new GithubSocialPostLedger()
    const results = await Promise.allSettled([ledger.markContainer(key, '100'), competing.markContainer(key, '200')])
    assert.equal(results.filter(x => x.status === 'fulfilled').length, 1)
    assert.match(results.find(x => x.status === 'rejected').reason.message, /409/)
    const record = [...files.values()][0].record
    assert.equal(record.status, 'container_ready')
    assert.ok(['100', '200'].includes(record.containerId))
    await assert.rejects(ledger.markContainer(key, '300'), /状態/)
  })
})

test('公開記録が保存後に通信断でも、新しい予約を作らず記録を読める', async () => {
  await withGithub(async ({ ledger }) => {
    await ledger.reserve(key)
    await ledger.markContainer(key, '100')
    await assert.rejects(ledger.markPublished(key, '200'), /結果不明/)
    assert.deepEqual({ status: (await ledger.read(key)).status, postId: (await ledger.read(key)).postId }, { status: 'published', postId: '200' })
    await assert.rejects(ledger.reserve(key), /409/)
  }, record => record.status === 'published')
})

test('実GitHub台帳アダプターで並行公開と公開結果不明の再送を防ぐ', async () => {
  const names = ['META_DRY_RUN', 'SOCIAL_PUBLISH_ENABLED', 'THREADS_PUBLISH_ENABLED', 'THREADS_ACCOUNT_ID', 'THREADS_ACCESS_TOKEN', 'THREADS_TOKEN_EXPIRES_AT']
  const old = Object.fromEntries(names.map(name => [name, process.env[name]]))
  Object.assign(process.env, {
    META_DRY_RUN: 'false', SOCIAL_PUBLISH_ENABLED: 'true', THREADS_PUBLISH_ENABLED: 'true',
    THREADS_ACCOUNT_ID: key.accountId, THREADS_ACCESS_TOKEN: 'mock-token',
    THREADS_TOKEN_EXPIRES_AT: '2099-01-01T00:00:00Z',
  })
  try {
    await withGithub(async ({ ledger }) => {
      let sends = 0
      const input = { ...key, text: '防災の確認', classification: 'noncommercial-education', approved: true, expiresAt: '2026-10-21T13:00:00Z' }
      const options = {
        ledger, now: () => new Date('2026-10-21T09:00:00Z'), checkConnection: async () => true,
        checkStatus: async () => 'FINISHED', wait: async () => {},
        transport: async () => { sends++; if (sends === 2) throw new DOMException('結果不明', 'TimeoutError'); return '100' },
      }
      const results = await Promise.allSettled([publishMetaPost(input, options), publishMetaPost(input, options)])
      assert.equal(results.filter(x => x.status === 'rejected').length, 2)
      assert.equal(sends, 2)
      assert.equal((await ledger.read(key)).status, 'container_ready')
      await assert.rejects(publishMetaPost(input, options), /409/)
      assert.equal(sends, 2)
    })
  } finally {
    for (const name of names) {
      if (old[name] === undefined) delete process.env[name]
      else process.env[name] = old[name]
    }
  }
})
