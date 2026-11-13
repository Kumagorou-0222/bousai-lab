import test from 'node:test'
import assert from 'node:assert/strict'
import { webcrypto } from 'node:crypto'
import { createXApi } from '../cloudflare/direct-x/x-api.mjs'

globalThis.crypto ??= webcrypto

test('モックAPIで画像・ALT・投稿を順に処理する', async () => {
  const calls = []
  const client = createXApi({ consumerKey: 'test-key', consumerSecret: 'test-secret',
    accessToken: 'test-token', accessSecret: 'test-access',
    fetchImpl: async (url, options) => {
      assert.equal(options.method, 'POST')
      assert.match(options.headers.Authorization, /^OAuth /)
      calls.push(url)
      if (url.includes('media/upload')) return new Response(JSON.stringify({ media_id_string: '123' }))
      if (url.includes('metadata/create')) return new Response('', { status: 200 })
      assert.deepEqual(JSON.parse(options.body), { text: '本文', media: { media_ids: ['123'] } })
      return new Response(JSON.stringify({ data: { id: '456' } }))
    } })
  const media = await client.uploadPng(new Uint8Array([1, 2, 3]))
  await client.setAltText(media, '説明')
  assert.deepEqual(await client.sendTweet('本文', media), { id: '456' })
  assert.deepEqual(calls.map(url => new URL(url).pathname),
    ['/1.1/media/upload.json', '/1.1/media/metadata/create.json', '/2/tweets'])
})

test('投稿結果不明とHTTP失敗は成功扱いしない', async () => {
  const base = { consumerKey: 'a', consumerSecret: 'b', accessToken: 'c', accessSecret: 'd' }
  await assert.rejects(createXApi({ ...base, fetchImpl: async () => new Response('{}') }).sendTweet('本文'), /不明/)
  await assert.rejects(createXApi({ ...base, fetchImpl: async () => new Response('{}', { status: 403 }) }).sendTweet('本文'), /403/)
})

