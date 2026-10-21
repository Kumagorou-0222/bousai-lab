import assert from 'node:assert/strict'
import test from 'node:test'
import { githubHistoryStore } from '../cloudflare/direct-x/github-store.mjs'

test('GitHub Contents API��SHA�t���X�V�������g���A�������͑��M����false��Ԃ�', async () => {
  const token = 'test-secret-do-not-log'
  const records = [{ slot: 'night', text: '���{��', success: false }]
  const calls = []
  const fetchImpl = async (url, init) => {
    calls.push({ url, init })
    if (!init.method) return new Response(JSON.stringify({ sha: 'blob-1', content: btoa(unescape(encodeURIComponent(JSON.stringify(records)))) }), { status: 200 })
    return new Response('', { status: 409 })
  }
  const store = githubHistoryStore({ token, fetchImpl })
  assert.deepEqual(await store.read(), { sha: 'blob-1', records })
  assert.equal(await store.write('blob-1', records), false)
  assert.equal(calls.length, 2)
  assert.equal(calls[0].url, 'https://api.github.com/repos/Kumagorou-0222/bousai-lab/contents/data/x-post-history.json')
  assert.equal(calls[0].init.headers.Authorization, `Bearer ${token}`)
  const body = JSON.parse(calls[1].init.body)
  assert.equal(body.branch, 'main')
  assert.equal(body.sha, 'blob-1')
  assert.equal(JSON.parse(decodeURIComponent(escape(atob(body.content))))[0].text, '���{��')
  assert.equal(JSON.stringify(body).includes(token), false)
})

test('�F�؏�񂪂Ȃ���ΒʐM������~����', () => {
  assert.throws(() => githubHistoryStore({ token: '' }), /���ݒ�/)
})

