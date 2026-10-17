import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchThreadsHistory } from './threadsHistory.ts'

test('公開mainの履歴を毎回キャッシュなしで取得する', async (t) => {
  const original = globalThis.fetch
  t.after(() => { globalThis.fetch = original })
  const urls = []
  globalThis.fetch = async (url, options) => {
    urls.push(url)
    assert.equal(options.cache, 'no-store')
    return { ok: true, text: async () => JSON.stringify([{ slug: 'sample', title: '例', postedAt: '2026-10-17T20:00:00+09:00', slot: 'night', text: '例' }]) }
  }
  assert.equal((await fetchThreadsHistory()).ok, true)
  assert.equal((await fetchThreadsHistory()).ok, true)
  assert.match(urls[0], /^https:\/\/raw\.githubusercontent\.com\/Kumagorou-0222\/bousai-lab\/main\/data\/x-post-history\.json\?at=/)
})

test('取得失敗と不正な形式は空の履歴と偽装しない', async (t) => {
  const original = globalThis.fetch
  t.after(() => { globalThis.fetch = original })
  globalThis.fetch = async () => { throw new Error('network') }
  assert.deepEqual(await fetchThreadsHistory(), { ok: false })
  globalThis.fetch = async () => ({ ok: true, text: async () => '[{}]' })
  assert.deepEqual(await fetchThreadsHistory(), { ok: false })
  globalThis.fetch = async () => ({ ok: false })
  assert.deepEqual(await fetchThreadsHistory(), { ok: false })
})
