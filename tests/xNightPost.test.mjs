import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { jstDate, nightPostingWindow, selectNightPost, xTextLength } from '../lib/xNightPost.ts'

test('夜枠はJST21:00以上22:00未満だけ許可し、翌朝に持ち越さない', () => {
  assert.equal(nightPostingWindow(new Date('2026-10-13T11:59:59Z')), false)
  assert.equal(nightPostingWindow(new Date('2026-10-13T12:00:00Z')), true)
  assert.equal(nightPostingWindow(new Date('2026-10-13T12:59:59Z')), true)
  assert.equal(nightPostingWindow(new Date('2026-10-13T13:00:00Z')), false)
  assert.equal(nightPostingWindow(new Date('2026-10-12T20:53:00Z')), false)
  assert.equal(jstDate(new Date('2026-10-12T20:53:00Z')), '2026-10-13')
})

test('X公式ライブラリの重み付き文字数で確認する', () => {
  assert.equal(xTextLength('防災A'), 5)
  const reviewedDraft = '停電後は、復旧時の「通電火災」に注意。\n安全にできる範囲で電源を切り、プラグを抜く。避難で家を離れる際は、安全と時間に余裕があればブレーカーを切る。\n再使用前に機器・コード・周囲を確認。濡れた機器や傷んだコードは使わない。\n危険なら操作せず避難を。\n#防災 #通電火災'
  assert.equal(xTextLength(reviewedDraft), 261)
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
    reviewedAt: '2026-10-13', reviewer: '編集者',
  }
  fs.writeFileSync(manifest, JSON.stringify([entry]))
  assert.equal(check().ok, true)
  fs.writeFileSync(manifest, JSON.stringify([{ ...entry, text: '防'.repeat(141) }]))
  assert.match(JSON.stringify(check()), /長すぎます/)
  fs.writeFileSync(manifest, JSON.stringify([entry]))
  assert.match(JSON.stringify(check([{ success: true, nightImageId: entry.imageId }])), /投稿済み/)
  assert.match(JSON.stringify(check([{ success: true, slug: 'night-2026-10-13' }])), /投稿済み/)
  fs.writeFileSync(imagePath, Buffer.concat([image, Buffer.from('変更')]))
  assert.match(JSON.stringify(check()), /変更されています/)
  fs.writeFileSync(imagePath, image)
  fs.writeFileSync(manifest, JSON.stringify([{ ...entry, slotDate: '2026-10-12' }]))
  assert.match(JSON.stringify(check()), /未承認/)
})
