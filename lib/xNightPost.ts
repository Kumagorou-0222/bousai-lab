import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import twitterText from 'twitter-text'
import type { TwitterApi } from 'twitter-api-v2'

export type NightApproval = {
  imageId: string
  libraryFileId: string
  slotDate: string
  theme: string
  text: string
  imagePath: string
  imageSha256: string
  width: number
  height: number
  reviewedAt: string
  reviewer: string
  altText: string
}

export type NightSelection =
  | { ok: true; entry: NightApproval; image: Buffer }
  | { ok: false; reason: string }

export function xTextLength(text: string): number {
  return twitterText.parseTweet(text).weightedLength
}

export function jstDate(now = new Date()): string {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().slice(0, 10)
}

export function nightPostingWindow(now = new Date()): boolean {
  const jstHour = (now.getUTCHours() + 9) % 24
  return jstHour >= 18 && jstHour < 22
}

export function nightPostingWindowForDate(slotDate: string, now = new Date()): boolean {
  return nightPostingWindow(now) && jstDate(now) === slotDate
}

export async function uploadNightImage(client: TwitterApi, image: Buffer, altText: string): Promise<string> {
  const mediaId = await client.v1.uploadMedia(image, { mimeType: 'image/png' })
  await client.v1.createMediaMetadata(mediaId, { alt_text: { text: altText } })
  return mediaId
}

export function selectNightPost(
  history: Array<{ success: boolean; nightImageId?: string; slug?: string; nightAttemptId?: string; nightStatus?: string }>,
  root = process.cwd(),
  slotDate = jstDate(),
): NightSelection {
  let records: unknown
  try {
    records = JSON.parse(fs.readFileSync(path.join(root, 'data/x-night-approved.json'), 'utf8'))
  } catch {
    return { ok: false, reason: '夜枠の承認台帳を読み取れません' }
  }
  if (!Array.isArray(records)) return { ok: false, reason: '夜枠の承認台帳の形式が不正です' }
  const matching = (records as NightApproval[]).filter((record) => record?.slotDate === slotDate)
  if (matching.length !== 1) return { ok: false, reason: matching.length ? '対象日の承認投稿が重複しています' : '対象日の新作は未承認です' }
  const entry = matching[0]
  if (!entry.imageId || !entry.libraryFileId?.startsWith('libfile_') || !entry.theme?.trim() ||
      !entry.text?.trim() || !entry.reviewer?.trim() || !entry.altText?.trim() || entry.altText.length > 1000 || !/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewedAt) ||
      !/^[a-f0-9]{64}$/.test(entry.imageSha256) ||
      entry.imagePath !== `/manga/daily/${slotDate}.png`) return { ok: false, reason: '対象日の承認情報が不完全です' }
  if (!twitterText.parseTweet(entry.text).valid) return { ok: false, reason: '対象日の投稿文が長すぎます' }
  if (history.some((record) => (record.success || (record.nightAttemptId && record.nightStatus !== 'failed_before_send')) &&
      (record.nightImageId === entry.imageId || record.slug === `night-${slotDate}`))) {
    return { ok: false, reason: '対象日の新作は投稿済み、または送信結果が未確定です' }
  }
  let image: Buffer
  try {
    image = fs.readFileSync(path.join(root, 'public', entry.imagePath.slice(1)))
  } catch {
    return { ok: false, reason: '対象日の新作画像が見つかりません' }
  }
  if (createHash('sha256').update(image).digest('hex') !== entry.imageSha256) {
    return { ok: false, reason: '新作画像がレビュー時から変更されています' }
  }
  if (image.length < 24 || !image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
      image.toString('ascii', 12, 16) !== 'IHDR' ||
      image.readUInt32BE(16) !== entry.width || image.readUInt32BE(20) !== entry.height ||
      entry.width < 800 || entry.height < 1200 || entry.height <= entry.width) {
    return { ok: false, reason: '新作画像の形式または寸法が承認内容と異なります' }
  }
  return { ok: true, entry, image }
}
