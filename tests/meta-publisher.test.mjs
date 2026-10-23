import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createCanvas, loadImage } from 'canvas'
import { PostRecordError, publishMetaPost, waitForContainerReady } from '../lib/metaPublisher.ts'
import { ledgerPath } from '../lib/socialPostLedger.ts'

const at = (hour, minute = 0) => new Date(`2026-10-21T${String(hour - 9).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`)
const comic = await loadImage(execFileSync('git', ['show', 'HEAD:public/manga/blackout-basics/panel-01.png']))
function makeJpeg(width, height) {
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')
  context.fillStyle = 'white'
  context.fillRect(0, 0, width, height)
  const scale = Math.min(width / comic.width, height / comic.height)
  context.drawImage(comic, (width - comic.width * scale) / 2, (height - comic.height * scale) / 2,
    comic.width * scale, comic.height * scale)
  return canvas.toBuffer('image/jpeg')
}
const jpeg = makeJpeg(1080, 1350)
const imageSha256 = createHash('sha256').update(jpeg).digest('hex')
const input = {
  channel: 'threads', dateJst: '2026-10-21', slug: 'emergency-toilet',
  campaign: 'daily-20261021', accountId: '12345', classification: 'noncommercial-education',
  approved: true, text: '備蓄品を確認しましょう。', expiresAt: '2026-10-21T13:00:00Z',
}
function ledger() {
  const records = new Map()
  return {
    records,
    async reserve(key) {
      const path = ledgerPath(key)
      if (records.has(path)) throw new Error('予約済み')
      records.set(path, { status: 'reserved' })
    },
    async markContainer(key, containerId) { records.set(ledgerPath(key), { status: 'container_ready', containerId }) },
    async markPublished(key, postId) { records.set(ledgerPath(key), { status: 'published', postId }) },
  }
}
const common = { checkConnection: async () => true, checkStatus: async () => 'FINISHED', wait: async () => {}, now: () => at(18) }
process.env.META_DRY_RUN = 'false'
process.env.SOCIAL_PUBLISH_ENABLED = 'true'
process.env.THREADS_PUBLISH_ENABLED = 'true'
process.env.INSTAGRAM_PUBLISH_ENABLED = 'true'
process.env.THREADS_ACCOUNT_ID = '12345'
process.env.INSTAGRAM_ACCOUNT_ID = '12345'
process.env.THREADS_ACCESS_TOKEN = 'mock-token'
process.env.INSTAGRAM_ACCESS_TOKEN = 'mock-token'
process.env.THREADS_TOKEN_EXPIRES_AT = '2099-01-01T00:00:00Z'
process.env.INSTAGRAM_TOKEN_EXPIRES_AT = '2099-01-01T00:00:00Z'
process.env.META_GRAPH_VERSION = 'v24.0'

test('公開結果不明では予約を保持して再送を拒否する', async () => {
  const store = ledger()
  let sends = 0
  const transport = async () => {
    sends++
    if (sends === 2) throw new DOMException('結果不明', 'TimeoutError')
    return '67890'
  }
  await assert.rejects(publishMetaPost(input, { ...common, ledger: store, transport }), /結果不明/)
  await assert.rejects(publishMetaPost(input, { ...common, ledger: store, transport }), /予約済み/)
  assert.equal(sends, 2)
})

test('同日同アカウントは記事やcampaignが異なっても一回', async () => {
  const store = ledger()
  let sends = 0
  const options = { ...common, ledger: store, transport: async () => String(++sends) }
  await publishMetaPost(input, options)
  await assert.rejects(publishMetaPost({ ...input, slug: 'water', campaign: 'different' }, options), /予約済み/)
  assert.equal(sends, 2)
})

test('時間外、翌日、商業、アカウント不一致は予約前に停止', async () => {
  const store = ledger()
  const transport = async () => { throw new Error('呼び出してはいけない') }
  for (const now of [at(17, 59), at(22), new Date('2026-10-22T09:00:00Z')]) {
    await assert.rejects(publishMetaPost(input, { ...common, now: () => now, ledger: store, transport }), /枠外/)
  }
  await assert.rejects(publishMetaPost({ ...input, classification: 'commercial' }, { ...common, ledger: store, transport }), /商業/)
  await assert.rejects(publishMetaPost({ ...input, accountId: '99999' }, { ...common, ledger: store, transport }), /アカウント/)
  assert.equal(store.records.size, 0)
})

test('Threads画像はJPEG実体を照合しIMAGEで作成する', async () => {
  const store = ledger()
  const calls = []
  const withImage = { ...input, imageUrl: 'https://bousai-lab.vercel.app/manga/test.jpg', imageSha256 }
  const options = {
    ...common, ledger: store,
    fetchImage: async () => ({ ok: true, headers: new Headers({ 'content-type': 'image/jpeg' }), arrayBuffer: async () => jpeg }),
    transport: async (url, fields) => { calls.push({ url, fields }); return String(calls.length) },
  }
  await publishMetaPost(withImage, options)
  assert.equal(calls[0].fields.media_type, 'IMAGE')
  assert.equal(calls[0].fields.image_url, withImage.imageUrl)
  assert.equal(calls.length, 2)
})

test('PNGとハッシュ不一致は送信せず、InstagramはJPEGのみ', async () => {
  const store = ledger()
  let calls = 0
  const options = {
    ...common, ledger: store,
    fetchImage: async () => ({ ok: true, headers: new Headers({ 'content-type': 'image/jpeg' }), arrayBuffer: async () => jpeg }),
    transport: async () => { calls++; return '1' },
  }
  await assert.rejects(publishMetaPost({ ...input, channel: 'instagram', imageUrl: 'https://bousai-lab.vercel.app/manga/test.png', imageSha256 }, options), /画像/)
  await assert.rejects(publishMetaPost({ ...input, channel: 'instagram', imageUrl: 'https://bousai-lab.vercel.app/manga/test.jpg', imageSha256: 'a'.repeat(64) }, options), /一致/)
  assert.equal(calls, 0)
  assert.equal(store.records.size, 0)
})

test('実漫画由来JPEGをデコードし、破損・幅・縦横比を予約前に拒否', async () => {
  const store = ledger()
  let sends = 0
  const imageUrl = 'https://bousai-lab.vercel.app/manga/test.jpg'
  const withBytes = async (bytes, channel = 'instagram') => publishMetaPost({
    ...input, channel, imageUrl, imageSha256: createHash('sha256').update(bytes).digest('hex'),
  }, {
    ...common, ledger: store,
    fetchImage: async () => ({ ok: true, headers: new Headers({ 'content-type': 'image/jpeg' }), arrayBuffer: async () => bytes }),
    transport: async () => { sends++; return '1' },
  })
  await assert.rejects(withBytes(jpeg.subarray(0, 200)), /JPEG/)
  await assert.rejects(withBytes(makeJpeg(300, 375)), /寸法/)
  await assert.rejects(withBytes(makeJpeg(1080, 1800)), /縦横比/)
  await assert.rejects(withBytes(makeJpeg(1080, 400)), /縦横比/)
  assert.equal(sends, 0)
  assert.equal(store.records.size, 0)
  await withBytes(jpeg)
  assert.equal(sends, 2)
})

test('公開後の台帳記録失敗は投稿IDを残し、再送しない', async () => {
  const store = ledger()
  store.markPublished = async () => { throw new Error('GitHub update failed') }
  let sends = 0
  const options = { ...common, ledger: store, transport: async () => String(++sends) }
  await assert.rejects(publishMetaPost(input, options), error => error instanceof PostRecordError && error.postId === '2')
  await assert.rejects(publishMetaPost(input, options), /予約済み/)
  assert.equal(sends, 2)
})

test('待機は1分間隔で最大5分、終了時は公開しない', async () => {
  const waits = []
  await assert.rejects(waitForContainerReady('threads', '1', 'mock', '', async () => 'IN_PROGRESS', async ms => { waits.push(ms) }), /制限時間/)
  assert.deepEqual(waits, [60000, 60000, 60000, 60000, 60000])
  let checks = 0
  const store = ledger()
  const calls = []
  await assert.rejects(publishMetaPost(input, {
    ...common, ledger: store,
    now: () => checks ? at(22) : at(18),
    checkStatus: async () => { checks++; return 'FINISHED' },
    transport: async (_url, fields) => { calls.push(fields); return '1' },
  }), /枠が終了/)
  assert.equal(calls.length, 1)
  assert.equal([...store.records.values()][0].status, 'container_ready')
})
