import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { runScheduled } from '../cloudflare/night-dispatcher/worker.mjs'

const planned = Date.parse('2026-10-14T11:00:00Z')
const controller = { cron: '0 11 * * *', scheduledTime: planned }
const token = 'test-secret-do-not-log'

test('公開設定は20:00 JSTに一度だけ起動し、初期状態で送信しない', () => {
  const configPath = fileURLToPath(new URL('../cloudflare/night-dispatcher/wrangler.jsonc', import.meta.url))
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  assert.deepEqual(config.triggers.crons, ['0 11 * * *'])
  assert.equal(config.vars.DRY_RUN, 'true')
})

function fixture({ now = '2026-10-14T11:00:05Z', env = { DRY_RUN: 'false', GITHUB_DISPATCH_TOKEN: token },
  response = { status: 204 }, controllerOverride = controller, fetchError = false } = {}) {
  const calls = []
  const logs = []
  const fetchImpl = async (...args) => {
    calls.push(args)
    if (fetchError) throw new Error(`秘密値: ${token}`)
    return response
  }
  const run = () => runScheduled(controllerOverride, env, { now: new Date(now), fetchImpl, log: (message) => logs.push(message) })
  return { run, calls, logs }
}

test('固定HTTPSの単一workflowにnightだけをdispatchし、予定時刻と実行時刻を記録する', async () => {
  const f = fixture()
  assert.equal(await f.run(), '起動要求を受理')
  assert.equal(f.calls.length, 1)
  const [url, init] = f.calls[0]
  assert.equal(url, 'https://api.github.com/repos/Kumagorou-0222/bousai-lab/actions/workflows/x-auto-post.yml/dispatches')
  assert.equal(init.method, 'POST')
  assert.equal(init.redirect, 'manual')
  assert.equal(init.cache, 'no-store')
  assert.equal(init.headers.Authorization, `Bearer ${token}`)
  assert.deepEqual(JSON.parse(init.body), { ref: 'main', inputs: { slot: 'night' } })
  assert.deepEqual(JSON.parse(f.logs[0]), {
    event: '夜枠起動', plannedAtJst: '2026-10-14T20:00:00.000+09:00',
    actualAtJst: '2026-10-14T20:00:05.000+09:00', delaySeconds: 5,
    result: '起動要求を受理', httpStatus: 204,
  })
  assert.equal(f.logs.join('').includes(token), false)
})

test('dry-runは初期値で有効、秘密値がなくても送信しない', async () => {
  const f = fixture({ env: {} })
  assert.match(await f.run(), /ドライラン/)
  assert.equal(f.calls.length, 0)
})

test('権限未設定時は安全停止する', async () => {
  const f = fixture({ env: { DRY_RUN: 'false' } })
  assert.match(await f.run(), /認証情報未設定/)
  assert.equal(f.calls.length, 0)
})

test('予定と実行の時刻・日付・cronが合わなければ送信しない', async () => {
  for (const options of [
    { now: '2026-10-14T10:59:59Z' },
    { now: '2026-10-14T13:00:00Z' },
    { now: '2026-10-15T11:00:00Z' },
    { controllerOverride: { ...controller, cron: '0 12 * * *' } },
    { controllerOverride: { ...controller, scheduledTime: 'invalid' } },
  ]) {
    const f = fixture(options)
    assert.match(await f.run(), /停止/)
    assert.equal(f.calls.length, 0)
  }
})

test('リダイレクト・API拒否を成功扱いせず、応答本文と秘密値を記録しない', async () => {
  for (const status of [301, 302, 401, 403, 500]) {
    const f = fixture({ response: { status, body: `秘密値: ${token}` } })
    await assert.rejects(f.run(), /受理されませんでした/)
    assert.equal(f.calls.length, 1)
    assert.equal(f.logs.join('').includes(token), false)
    assert.equal(JSON.parse(f.logs[0]).httpStatus, status)
  }
})

test('通信結果不明でも秘密値や例外本文をログへ出さない', async () => {
  const f = fixture({ fetchError: true })
  await assert.rejects(f.run(), /通信結果を確認できませんでした/)
  assert.equal(f.logs.join('').includes(token), false)
})
