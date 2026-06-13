/**
 * X自動投稿 コアロジック
 * GitHub Actions から scripts/postToX.ts 経由で呼ばれる。
 * Next.js 非依存 — Node.js で直接実行可能。
 */

import fs from 'fs'
import path from 'path'
import type { XPostCandidate, XRank } from './xPostQueue'

// =====================================================
// 型
// =====================================================

export type PostRecord = {
  postedAt: string        // ISO 8601 JST e.g. "2026-05-26T07:01:23+09:00"
  slug: string
  title: string
  slot: string            // morning | noon | night
  tweetId?: string
  tweetUrl?: string
  text: string
  hasImage: boolean
  imageLocalPath: string | null
  success: boolean
  error?: string
  fallbackUrl?: string
}

// =====================================================
// 定数
// =====================================================

const HISTORY_PATH = path.join(process.cwd(), 'data', 'x-post-history.json')
const DUPLICATE_WINDOW_HOURS = 48  // 直近 48 時間以内に投稿したスラッグは避ける
const RANK_WEIGHTS: Record<XRank, number> = { S: 5, A: 3, B: 1 }

// =====================================================
// 投稿履歴 CRUD
// =====================================================

export function readHistory(): PostRecord[] {
  try {
    if (!fs.existsSync(HISTORY_PATH)) return []
    const raw = fs.readFileSync(HISTORY_PATH, 'utf-8')
    return JSON.parse(raw) as PostRecord[]
  } catch {
    return []
  }
}

export function writeHistory(records: PostRecord[]): void {
  const dir = path.dirname(HISTORY_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  // 最大 500 件保持
  const trimmed = records.slice(-500)
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(trimmed, null, 2) + '\n', 'utf-8')
}

export function appendHistory(record: PostRecord): void {
  const history = readHistory()
  history.push(record)
  writeHistory(history)
}

// =====================================================
// 記事選択（重複防止 + 重み付きランダム）
// =====================================================

export function selectCandidate(
  candidates: XPostCandidate[],
): XPostCandidate | null {
  const history = readHistory()
  const cutoffMs = Date.now() - DUPLICATE_WINDOW_HOURS * 3_600_000
  const recentSlugs = new Set(
    history
      .filter((r) => new Date(r.postedAt).getTime() >= cutoffMs)
      .map((r) => r.slug),
  )

  // 直近 48h を除外。除外後が空なら全候補から選ぶ
  let pool = candidates.filter((c) => !recentSlugs.has(c.slug))
  if (pool.length === 0) pool = [...candidates]

  // 重み付き候補プール展開
  const weighted: XPostCandidate[] = []
  for (const c of pool) {
    const w = RANK_WEIGHTS[c.rank] ?? 1
    for (let i = 0; i < w; i++) weighted.push(c)
  }

  if (weighted.length === 0) return null
  return weighted[Math.floor(Math.random() * weighted.length)]
}

// =====================================================
// 画像パス解決
// public/manga/{slug}/panel-01.png を探す
// =====================================================

export function resolveMangaImagePath(mangaImages: string[]): string | null {
  for (const imgPath of mangaImages) {
    // "/manga/slug/panel-01.png" → "<cwd>/public/manga/slug/panel-01.png"
    const localPath = path.join(
      process.cwd(),
      'public',
      imgPath.replace(/^\//, ''),
    )
    if (fs.existsSync(localPath)) return localPath
  }
  return null
}

// =====================================================
// Telegram エラー通知
// =====================================================

export async function sendTelegramAlert(message: string): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('[Telegram] 環境変数未設定 — 通知スキップ')
    return
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🚨 <b>X投稿エラー</b>\n\n${message}`,
          parse_mode: 'HTML',
        }),
      },
    )
    if (!res.ok) {
      console.error('[Telegram] 通知失敗:', res.status, await res.text())
    }
  } catch (e) {
    console.error('[Telegram] fetch エラー:', e)
  }
}

// =====================================================
// 現在の JST 時刻から slot を判定
// =====================================================

export function detectSlot(): 'morning' | 'noon' | 'night' {
  const env = process.env.POST_SLOT
  if (env === 'morning' || env === 'noon' || env === 'night') return env

  const jstHour = (new Date().getUTCHours() + 9) % 24
  if (jstHour < 10) return 'morning'
  if (jstHour < 17) return 'noon'
  return 'night'
}

// =====================================================
// JST 現在時刻を ISO 8601 で返す
// =====================================================

export function nowJST(): string {
  return new Date(Date.now() + 9 * 3600 * 1000)
    .toISOString()
    .replace('Z', '+09:00')
}
