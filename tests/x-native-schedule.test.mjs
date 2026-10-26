import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const checker = fileURLToPath(new URL('../scripts/check-x-native-schedule.mjs', import.meta.url))

test('X直接予約は同日同枠を一件だけ記録し、投稿URLとALTを確認する', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'x-native-schedule-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const ledger = path.join(dir, 'records.json')
  const entry = {
    dateJst: '2026-10-27', slot: 'morning', scheduledForJst: '2026-10-27T07:00:00+09:00',
    status: 'scheduled', slug: 'example', imageId: null, text: '投稿文',
    imagePath: '/manga/example.png', altText: '画像の説明', scheduleConfirmation: 'X予約一覧で確認', postUrl: null,
  }
  const check = (records) => {
    fs.writeFileSync(ledger, JSON.stringify(records))
    return spawnSync(process.execPath, [checker, ledger], { encoding: 'utf8' })
  }
  assert.equal(check([entry]).status, 0)
  assert.match(check([entry, entry]).stderr, /重複/)
  assert.match(check([{ ...entry, altText: '' }]).stderr, /ALT/)
  assert.match(check([{ ...entry, status: 'posted' }]).stderr, /投稿URL/)
  assert.equal(check([{ ...entry, status: 'posted', postUrl: 'https://x.com/example/status/123' }]).status, 0)
  assert.match(check([{ ...entry, slot: 'night', scheduledForJst: '2026-10-27T18:00:00+09:00' }]).stderr, /画像ID/)
})
