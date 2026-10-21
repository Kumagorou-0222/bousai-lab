import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { blocksSlot, chooseDayCandidate, resolveScheduledSlot, runPostAttempt } from '../cloudflare/direct-x/core.mjs'
import { runScheduled } from '../cloudflare/direct-x/worker.mjs'

const nightController = { cron: '*/15 9-12 * * *', scheduledTime: Date.parse('2026-10-22T09:00:00Z') }
const night = { slug: 'night-2026-10-22', title: '確認済み漫画', text: '確認済み投稿', slotDate: '2026-10-22',
  nightImageId: 'libfile_approved:v1', imageSha256: 'a'.repeat(64), imagePath: '/manga/daily/2026-10-22.png' }

test('公開設定は4個のCronとドライランのみ', () => {
  const config = JSON.parse(fs.readFileSync(new URL('../cloudflare/direct-x/wrangler.jsonc', import.meta.url), 'utf8'))
  assert.deepEqual(config.triggers.crons, [
    '0,15,30 22 * * *', '0,15,30 3 * * *', '*/15 9-12 * * *', '55 12 * * *',
  ])
  assert.equal(config.vars.DRY_RUN, 'true')
  assert.equal(config.workers_dev, false)
})

test('Workerはdry-runだけを記録し、解除しても未接続なら投稿しない', async () => {
  const logs = []
  const options = { now: new Date('2026-10-22T09:00:01Z'), log: value => logs.push(JSON.parse(value)) }
  await runScheduled(nightController, { DRY_RUN: 'true' }, options)
  assert.equal(logs[0].result, 'ドライラン')
  await assert.rejects(runScheduled(nightController, { DRY_RUN: 'false' }, options), /接続が未完了/)
  assert.equal(logs.length, 1)
})

function fakeStore(start = []) {
  let sha = 0
  let records = structuredClone(start)
  return {
    async read() { return { sha: String(sha), records: structuredClone(records) } },
    async write(expected, next) {
      if (expected !== String(sha)) return false
      records = structuredClone(next)
      sha++
      return true
    },
    records() { return structuredClone(records) },
  }
}

function fixture(overrides = {}) {
  const store = fakeStore()
  const calls = []
  const publisher = {
    async prepare() { calls.push('prepare'); return 'media-id' },
    async send() { calls.push('send'); return { id: 'tweet-1' } },
  }
  return { store, calls, publisher, controller: nightController,
    now: new Date('2026-10-22T09:00:01Z'), clock: () => new Date('2026-10-22T09:00:02Z'),
    attemptId: 'run-1', getCandidate: async () => night, dryRun: false, ...overrides }
}

test('朝07時・昼12時・夜18時と再試行だけを受け、当日窓の外と翌日は止める', () => {
  const rows = [
    [{ cron: '0,15,30 22 * * *', scheduledTime: Date.parse('2026-10-21T22:00:00Z') }, '2026-10-21T22:00:00Z', 'morning'],
    [{ cron: '0,15,30 3 * * *', scheduledTime: Date.parse('2026-10-22T03:00:00Z') }, '2026-10-22T03:00:00Z', 'noon'],
    [nightController, '2026-10-22T08:59:59Z', null],
    [nightController, '2026-10-22T09:00:00Z', 'night'],
    [nightController, '2026-10-22T12:59:59Z', 'night'],
    [nightController, '2026-10-22T13:00:00Z', null],
    [nightController, '2026-10-22T15:00:00Z', null],
    [nightController, '2026-10-23T09:00:00Z', null],
    [{ cron: '55 12 * * *', scheduledTime: Date.parse('2026-10-22T12:55:00Z') }, '2026-10-22T12:55:00Z', 'night'],
  ]
  for (const [controller, utc, expected] of rows) {
    assert.equal(resolveScheduledSlot(controller, new Date(utc))?.slot || null, expected, utc)
  }
})

test('dry-runでは予約も投稿もしない', async () => {
  const f = fixture({ dryRun: true })
  assert.equal((await runPostAttempt(f)).status, 'dry_run')
  assert.deepEqual(f.store.records(), [])
  assert.deepEqual(f.calls, [])
})

test('投稿前予約、送信、成功確定を順序どおりに行う', async () => {
  const f = fixture()
  f.publisher.send = async () => {
    assert.equal(f.store.records()[0].nightStatus, 'reserved')
    f.calls.push('send')
    return { id: 'tweet-1' }
  }
  assert.deepEqual(await runPostAttempt(f), { status: 'posted', tweetId: 'tweet-1' })
  assert.deepEqual(f.calls, ['prepare', 'send'])
  assert.equal(f.store.records()[0].nightStatus, 'posted')
  assert.equal(f.store.records()[0].success, true)
  assert.equal((await runPostAttempt(f)).status, 'already_reserved')
})

test('既存予約・成功・結果不明を同日枠の重複として拒否し、送信前失敗だけ再試行可', () => {
  for (const status of ['reserved', 'posted', 'unknown']) {
    assert.equal(blocksSlot({ slot: 'night', postedAt: '2026-10-22T18:00:00+09:00', nightStatus: status, success: status === 'posted' }, 'night', '2026-10-22'), true)
  }
  assert.equal(blocksSlot({ slot: 'night', slotDate: '2026-10-22', nightStatus: 'failed_before_send', success: false }, 'night', '2026-10-22'), false)
  assert.equal(blocksSlot({ slot: 'morning', postedAt: '2026-10-22T07:03:00+09:00', success: true }, 'morning', '2026-10-22'), true)
  assert.equal(blocksSlot({ slot: 'night', slotDate: '2026-10-21', nightStatus: 'unknown' }, 'night', '2026-10-22'), false)
})

test('投稿要求のtimeoutは結果不明として保持し、盲目的再送を防ぐ', async () => {
  const f = fixture()
  f.publisher.send = async () => { f.calls.push('send'); throw new Error('timeout') }
  await assert.rejects(runPostAttempt(f), /timeout/)
  assert.equal(f.store.records()[0].nightStatus, 'unknown')
  assert.equal((await runPostAttempt(f)).status, 'already_reserved')
  assert.deepEqual(f.calls, ['prepare', 'send'])
})

test('送信前に22時を越えたら送らず、送信前失敗として記録する', async () => {
  const f = fixture({ clock: () => new Date('2026-10-22T13:00:00Z') })
  await assert.rejects(runPostAttempt(f), /投稿時間外/)
  assert.deepEqual(f.calls, ['prepare'])
  assert.equal(f.store.records()[0].nightStatus, 'failed_before_send')
})

test('GitHub履歴のCAS競合後は再読し、他者の予約を優先する', async () => {
  const f = fixture()
  const originalWrite = f.store.write
  let first = true
  f.store.write = async (sha, records) => {
    if (first) {
      first = false
      await originalWrite(sha, [{ slot: 'night', slotDate: '2026-10-22', nightStatus: 'reserved', success: false }])
      return false
    }
    return originalWrite(sha, records)
  }
  assert.equal((await runPostAttempt(f)).status, 'already_reserved')
  assert.deepEqual(f.calls, [])
})

test('朝昼候補は既存の1週間・48時間の重複回避と重みを保つ', () => {
  const candidates = [{ slug: 'a', rank: 'S' }, { slug: 'b', rank: 'B' }]
  const recent = [{ slug: 'a', success: true, postedAt: new Date().toISOString() }]
  assert.equal(chooseDayCandidate(candidates, recent, () => 0).slug, 'b')
  assert.equal(chooseDayCandidate(candidates, [], () => 0).slug, 'a')
  assert.equal(chooseDayCandidate(candidates, [], () => 0.99).slug, 'b')
})
