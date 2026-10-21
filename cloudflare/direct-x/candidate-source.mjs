import { chooseDayCandidate } from './core.mjs'

const BASE = 'https://raw.githubusercontent.com/Kumagorou-0222/bousai-lab/main/'

async function jsonFile(path, fetchImpl) {
  const response = await fetchImpl(BASE + path, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000) })
  if (response.status !== 200) throw new Error('投稿素材を取得できません')
  return response.json()
}

function validPath(path) {
  return typeof path === 'string' && /^\/manga\/[a-z0-9/_-]+\.png$/.test(path) && !path.includes('..')
}

export async function loadDayCandidates(fetchImpl = fetch) {
  const data = await jsonFile('data/x-day-candidates.json', fetchImpl)
  if (!Array.isArray(data) || data.length !== 24 || data.some(c =>
    !/^[a-z0-9-]+$/.test(c?.slug || '') || !['S', 'A', 'B'].includes(c.rank) ||
    !c.title?.trim() || !c.morningText?.trim() || !c.noonText?.trim() ||
    (c.imagePath !== null && (!validPath(c.imagePath) || !/^[a-f0-9]{64}$/.test(c.imageSha256 || '') ||
      !Number.isInteger(c.width) || !Number.isInteger(c.height))) ||
    (c.imagePath === null && (c.imageSha256 !== null || c.width !== null || c.height !== null)))) {
    throw new Error('朝昼の候補台帳が不完全です')
  }
  return data
}

export async function loadNightApproval(slotDate, fetchImpl = fetch) {
  const records = await jsonFile('data/x-night-approved.json', fetchImpl)
  if (!Array.isArray(records)) throw new Error('夜枠の承認台帳が不正です')
  const matching = records.filter(r => r?.slotDate === slotDate)
  if (matching.length !== 1) throw new Error('当日夜枠の承認素材を一意に確認できません')
  const entry = matching[0]
  if (!entry.imageId || !entry.libraryFileId?.startsWith('libfile_') || !entry.theme?.trim() ||
      !entry.reviewer?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewedAt || '') ||
      !entry.text?.trim() || !entry.altText?.trim() || entry.altText.length > 1000 ||
      !/^[a-f0-9]{64}$/.test(entry.imageSha256 || '') ||
      entry.imagePath !== `/manga/daily/${slotDate}.png` ||
      !Number.isInteger(entry.width) || !Number.isInteger(entry.height) ||
      entry.width < 800 || entry.height < 1200 || entry.height <= entry.width) {
    throw new Error('夜枠の承認情報が不完全です')
  }
  return entry
}

export async function getCandidateForEvent(event, history, fetchImpl = fetch, random = Math.random) {
  if (event.slot === 'night') {
    const approval = await loadNightApproval(event.slotDate, fetchImpl)
    if (history.some(record => (record.success ||
      (record.nightAttemptId && record.nightStatus !== 'failed_before_send')) &&
      (record.nightImageId === approval.imageId || record.slug === `night-${event.slotDate}`))) {
      throw new Error('夜枠の画像は投稿済み、または送信結果が未確定です')
    }
    return { slug: `night-${event.slotDate}`, title: approval.theme || '今日の防災4コマ',
      text: approval.text, slotDate: event.slotDate, imagePath: approval.imagePath,
      imageSha256: approval.imageSha256, width: approval.width, height: approval.height,
      altText: approval.altText, nightImageId: approval.imageId }
  }
  if (event.slot !== 'morning' && event.slot !== 'noon') throw new Error('投稿枠が不正です')
  const chosen = chooseDayCandidate(await loadDayCandidates(fetchImpl), history, random)
  if (!chosen) throw new Error('朝昼の候補がありません')
  return { slug: chosen.slug, title: chosen.title, text: chosen[`${event.slot}Text`],
    imagePath: chosen.imagePath, imageSha256: chosen.imageSha256,
    width: chosen.width, height: chosen.height }
}

export async function verifiedPng(path, sha256, width, height, fetchImpl = fetch) {
  if (!validPath(path) || !/^[a-f0-9]{64}$/.test(sha256 || '')) throw new Error('画像の承認情報が不正です')
  const response = await fetchImpl(BASE + 'public' + path, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000) })
  if (response.status !== 200) throw new Error('承認画像を取得できません')
  const bytes = new Uint8Array(await response.arrayBuffer())
  const signature = [137, 80, 78, 71, 13, 10, 26, 10]
  if (bytes.length < 24 || signature.some((n, i) => bytes[i] !== n) ||
      String.fromCharCode(...bytes.subarray(12, 16)) !== 'IHDR') throw new Error('画像がPNGではありません')
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (view.getUint32(16) !== width || view.getUint32(20) !== height) throw new Error('画像寸法が承認時と異なります')
  const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
    .map(n => n.toString(16).padStart(2, '0')).join('')
  if (digest !== sha256) throw new Error('画像が承認時から変更されています')
  return bytes
}

