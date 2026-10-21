import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { jstDate, nightPostingWindow, nightPostingWindowForDate, selectNightPost, uploadNightImage, xTextLength } from '../lib/xNightPost.ts'

test('夜枠はJST18:00以上22:00未満だけ許可し、翌朝に持ち越さない', () => {
  const date = '2026-10-13'
  for (const [utc, allowed] of [
    ['2026-10-13T08:59:59Z', false], // 17:59:59 JST
    ['2026-10-13T09:00:00Z', true],  // 18:00 JST
    ['2026-10-13T12:59:59Z', true],  // 21:59:59 JST
    ['2026-10-13T13:00:00Z', false], // 22:00 JST
    ['2026-10-13T15:00:00Z', false], // 翌日00:00 JST
    ['2026-10-12T20:53:00Z', false], // 当日朝05:53 JST
  ]) {
    const now = new Date(utc)
    assert.equal(nightPostingWindow(now), allowed, utc)
    assert.equal(nightPostingWindowForDate(date, now), allowed, utc)
  }
  assert.equal(jstDate(new Date('2026-10-13T15:00:00Z')), '2026-10-14')
  assert.equal(nightPostingWindowForDate(date, new Date('2026-10-14T09:00:00Z')), false)
})

test('workflowの初回18:00、再試行、最終21:55はすべて夜枠内', () => {
  const workflow = fs.readFileSync(fileURLToPath(new URL('../.github/workflows/x-auto-post.yml', import.meta.url)), 'utf8')
  assert.match(workflow, /cron: "\\*\\/15 9-12 \\* \\* \\*"/)
  assert.match(workflow, /cron: "55 12 \\* \\* \\*"/)
  assert.match(workflow, /\\$SCHEDULE" = "\\*\\/15 9-12 \\* \\* \\*"/)
  const planned = []
  for (let utcHour = 9; utcHour <= 12; utcHour++) {
    for (let minute = 0; minute < 60; minute += 15) planned.push(new Date(Date.UTC(2026, 9, 13, utcHour, minute)))
  }
  planned.push(new Date('2026-10-13T12:55:00Z'))
  assert.equal(planned.length, 17)
  assert.equal(planned[0].toISOString(), '2026-10-13T09:00:00.000Z')
  assert.equal(planned.at(-1).toISOString(), '2026-10-13T12:55:00.000Z')
  for (const now of planned) assert.equal(nightPostingWindowForDate('2026-10-13', now), true)
})

test('X公式ライブラリの重み付き文字数で確認する', () => {
  assert.equal(xTextLength('防災A'), 5)
  const reviewedDraft = '停電後は、復旧時の「通電火災」に注意。\n安全にできる範囲で電源を切り、プラグを抜く。避難で家を離れる際は、安全と時間に余裕があればブレーカーを切る。\n再使用前に機器・コード・周囲を確認。濡れた機器や傷んだコードは使わない。\n危険なら操作せず避難を。\n#防災 #通電火災'
  assert.equal(xTextLength(reviewedDraft), 261)
})

test('画像を投稿する前にALT metadataを設定し、失敗時は先へ進めない', async () => {
  const events = []
  const client = { v1: {
    uploadMedia: async () => { events.push('upload'); return 'media-1' },
    createMediaMetadata: async (id, metadata) => { events.push(['alt', id, metadata.alt_text.text]) },
  } }
  assert.equal(await uploadNightImage(client, Buffer.from('image'), '4コマのALT'), 'media-1')
  assert.deepEqual(events, ['upload', ['alt', 'media-1', '4コマのALT']])
  client.v1.createMediaMetadata = async () => { throw new Error('ALT登録失敗') }
  await assert.rejects(uploadNightImage(client, Buffer.from('image'), 'ALT'), /ALT登録失敗/)
})

test('対象日のレビュー済み新作のみ選び、旧画像や重複投稿を拒否する', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'x-night-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const manifest = path.join(root, 'data/x-night-approved.json')
  const imagePath = path.join(root, 'public/manga/daily/2026-10-13.png')
  fs.mkdirSync(path.dirname(manifest), { recursive: true })
  fs.mkdirSync(path.dirname(imagePath), { recursive: true })
  fs.writeFileSync(manifest, '[]')
  const check = (history = []) => selectNightPost(history, root, '2026-10-13')
  assert.match(JSON.stringify(check()), /未承認/)
  const image = Buffer.alloc(24)
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(image)
  image.write('IHDR', 12)
  image.writeUInt32BE(1086, 16)
  image.writeUInt32BE(1448, 20)
  fs.writeFileSync(imagePath, image)
  const entry = {
    imageId: 'example-reviewed-id', libraryFileId: 'libfile_example', slotDate: '2026-10-13',
    theme: '停電後の通電火災', text: '確認済みの投稿文', imagePath: '/manga/daily/2026-10-13.png',
    imageSha256: createHash('sha256').update(image).digest('hex'), width: 1086, height: 1448,
    reviewedAt: '2026-10-13', reviewer: '編集者', altText: '4コマのALT',
  }
  fs.writeFileSync(manifest, JSON.stringify([entry]))
  assert.equal(check().ok, true)
  fs.writeFileSync(manifest, JSON.stringify([{ ...entry, text: '防'.repeat(141) }]))
  assert.match(JSON.stringify(check()), /長すぎます/)
  fs.writeFileSync(manifest, JSON.stringify([entry]))
  assert.match(JSON.stringify(check([{ success: true, nightImageId: entry.imageId }])), /投稿済み/)
  assert.match(JSON.stringify(check([{ success: true, slug: 'night-2026-10-13' }])), /投稿済み/)
  assert.match(JSON.stringify(check([{ success: false, slug: 'night-2026-10-13', nightAttemptId: '123', nightStatus: 'reserved' }])), /未確定/)
  assert.match(JSON.stringify(check([{ success: false, nightImageId: entry.imageId, nightAttemptId: '123', nightStatus: 'unknown' }])), /未確定/)
  assert.equal(check([{ success: false, nightImageId: entry.imageId, nightAttemptId: '123', nightStatus: 'failed_before_send' }]).ok, true)
  fs.writeFileSync(imagePath, Buffer.concat([image, Buffer.from('変更')]))
  assert.match(JSON.stringify(check()), /変更されています/)
  fs.writeFileSync(imagePath, image)
  fs.writeFileSync(manifest, JSON.stringify([{ ...entry, slotDate: '2026-10-12' }]))
  assert.match(JSON.stringify(check()), /未承認/)
})

test('10月13日の原本と承認台帳を実ファイルで照合する', () => {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
  const history = JSON.parse(fs.readFileSync(path.join(root, 'data/x-post-history.json'), 'utf8'))
  const selected = selectNightPost(history, root, '2026-10-13')
  assert.equal(selected.ok, true)
  assert.equal(selected.entry.libraryFileId, 'libfile_c4a3d93adae48191aea41185827d9a22')
  assert.equal(selected.entry.imageSha256, 'dc0a13210ffc0f42d3a9651076364e4ae1d6c3dc70bf18fe21d22ebdaa3eb586')
  assert.equal(selected.entry.width, 1086)
  assert.equal(selected.entry.height, 1448)
  assert.equal(xTextLength(selected.entry.text), 261)
  assert.equal(selectNightPost([{ success: true, nightImageId: selected.entry.imageId }], root, '2026-10-13').ok, false)
  assert.equal(selectNightPost(history, root, '2026-10-16').ok, false)
})
