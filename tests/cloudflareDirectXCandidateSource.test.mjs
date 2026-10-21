import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { loadDayCandidates, loadNightApproval, verifiedPng, getCandidateForEvent } from '../cloudflare/direct-x/candidate-source.mjs'
import { createPublisher } from '../cloudflare/direct-x/publisher.mjs'

const json = value => async () => new Response(JSON.stringify(value), { status: 200 })
const day = Array.from({ length: 24 }, (_, i) => ({ slug: `item-${i}`, rank: 'B', title: '記事',
  morningText: '朝', noonText: '昼', imagePath: null, imageSha256: null, width: null, height: null }))

test('朝昼候補24件を受け取り、地域記事も保持する', async () => {
  day[23].slug = 'musashino'
  assert.equal((await loadDayCandidates(json(day)))[23].slug, 'musashino')
})

test('欠損した朝昼候補は採用しない', async () => {
  await assert.rejects(loadDayCandidates(json(day.slice(1))), /不完全/)
  await assert.rejects(loadDayCandidates(json([...day.slice(0, 23), { ...day[23], imagePath: '../secret' }])), /不完全/)
})

test('夜枠は当日1件のみ、ALTと画像パスを検証する', async () => {
  const entry = { imageId: 'approved', slotDate: '2026-10-22', text: '夜', altText: '図解',
    imageSha256: 'a'.repeat(64), imagePath: '/manga/daily/2026-10-22.png', width: 1086, height: 1448 }
  assert.equal((await loadNightApproval('2026-10-22', json([entry]))).imageId, 'approved')
  await assert.rejects(loadNightApproval('2026-10-22', json([entry, entry])), /一意/)
  await assert.rejects(loadNightApproval('2026-10-23', json([entry])), /一意/)
  await assert.rejects(loadNightApproval('2026-10-22', json([{ ...entry, altText: '' }])), /不完全/)
})

test('夜画像のPNG寸法・SHAを照合する', async () => {
  const bytes = new Uint8Array(24)
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10], 0)
  bytes.set([73, 72, 68, 82], 12)
  new DataView(bytes.buffer).setUint32(16, 1086)
  new DataView(bytes.buffer).setUint32(20, 1448)
  const sha = createHash('sha256').update(bytes).digest('hex')
  const fetchPng = async () => new Response(bytes)
  assert.deepEqual(await verifiedPng('/manga/daily/2026-10-22.png', sha, 1086, 1448, fetchPng), bytes)
  await assert.rejects(verifiedPng('/manga/daily/2026-10-22.png', sha, 1086, 1200, fetchPng), /寸法/)
  await assert.rejects(verifiedPng('/manga/daily/2026-10-22.png', '0'.repeat(64), 1086, 1448, fetchPng), /変更/)
})

test('朝昼は同じ候補から枠別の投稿文を選ぶ', async () => {
  const morning = await getCandidateForEvent({ slot: 'morning' }, [], json(day), () => 0)
  const noon = await getCandidateForEvent({ slot: 'noon' }, [], json(day), () => 0)
  assert.equal(morning.slug, noon.slug)
  assert.equal(morning.text, '朝')
  assert.equal(noon.text, '昼')
})

test('投稿adapterは画像検証後にALTを設定し、送信結果を返す', async () => {
  const calls = []
  const bytes = new Uint8Array(24)
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10], 0)
  bytes.set([73, 72, 68, 82], 12)
  new DataView(bytes.buffer).setUint32(16, 1086)
  new DataView(bytes.buffer).setUint32(20, 1448)
  const publisher = createPublisher({
    fetchImpl: async () => new Response(bytes),
    uploadPng: async () => { calls.push('upload'); return 'media-id' },
    setAltText: async () => { calls.push('alt') },
    sendTweet: async () => { calls.push('send'); return { id: 'tweet-id' } },
  })
  const candidate = { text: '本文', imagePath: '/manga/daily/2026-10-22.png',
    imageSha256: createHash('sha256').update(bytes).digest('hex'), width: 1086,
    height: 1448, altText: '説明' }
  const media = await publisher.prepare(candidate)
  assert.equal(media, 'media-id')
  assert.equal((await publisher.send(candidate, media)).id, 'tweet-id')
  assert.deepEqual(calls, ['upload', 'alt', 'send'])
  await assert.rejects(publisher.prepare({ ...candidate, imageSha256: '0'.repeat(64) }), /変更/)
  assert.deepEqual(calls, ['upload', 'alt', 'send'])
})

