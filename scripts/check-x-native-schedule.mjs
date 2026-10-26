import fs from 'node:fs'

const path = process.argv[2] ?? new URL('../data/x-native-schedule.json', import.meta.url)
const entries = JSON.parse(fs.readFileSync(path, 'utf8'))
if (!Array.isArray(entries)) throw new Error('X直接予約台帳は配列にしてください')

const times = { morning: '07:00:00', noon: '12:00:00' }
const seen = new Set()
for (const entry of entries) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.dateJst ?? '') || !['morning', 'noon', 'night'].includes(entry.slot)) {
    throw new Error('X直接予約の日付または枠が不正です')
  }
  const key = `${entry.dateJst}:${entry.slot}`
  if (seen.has(key)) throw new Error(`X直接予約が重複しています: ${key}`)
  seen.add(key)
  const expected = entry.slot === 'night'
    ? new RegExp(`^${entry.dateJst}T(?:18|19|20|21):[0-5]\\d:[0-5]\\d\\+09:00$`).test(entry.scheduledForJst ?? '')
    : entry.scheduledForJst === `${entry.dateJst}T${times[entry.slot]}+09:00`
  if (!expected) {
    throw new Error(`X直接予約の時刻が違います: ${key}`)
  }
  if (!['scheduled', 'posted', 'unknown'].includes(entry.status) ||
      !entry.slug?.trim() || !entry.text?.trim() || !entry.scheduleConfirmation?.trim()) {
    throw new Error(`X直接予約の確認情報が不足しています: ${key}`)
  }
  if (entry.slot === 'night' && !entry.imageId?.trim()) {
    throw new Error(`夜枠の画像IDがありません: ${key}`)
  }
  if (entry.imagePath && !entry.altText?.trim()) {
    throw new Error(`画像のALTがありません: ${key}`)
  }
  if (entry.status === 'posted' && !/^https:\/\/x\.com\/(?:i\/web|[A-Za-z0-9_]+)\/status\/\d+$/.test(entry.postUrl ?? '')) {
    throw new Error(`投稿URLを確認できません: ${key}`)
  }
  if (entry.postedAtJst != null &&
      !new RegExp(`^${entry.dateJst}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\+09:00$`).test(entry.postedAtJst)) {
    throw new Error(`実際の公開時刻が不正です: ${key}`)
  }
  if (entry.status !== 'posted' && entry.postedAtJst != null) {
    throw new Error(`公開前に実際の公開時刻が記録されています: ${key}`)
  }
  if (entry.status !== 'posted' && entry.postUrl) {
    throw new Error(`公開前に投稿URLが記録されています: ${key}`)
  }
}
console.log(`X直接予約台帳: ${entries.length}件を確認しました`)
