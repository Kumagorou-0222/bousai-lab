/**
 * X投稿スケジューラー
 * Telegram とは完全に分離した X 専用の朝昼夜3枠スケジュール管理
 */
import fs from 'fs'
import path from 'path'
import type { XPostCandidate, XRank } from './xPostQueue'
import { RANK_WEIGHTS } from './xPostQueue'

// =====================================================
// 定数: 1日3枠
// =====================================================

export type SlotKey = 'morning' | 'noon' | 'night'

export const DAILY_SLOTS = [
  { slot: 'morning' as SlotKey, label: '朝' as const, time: '07:00' as const, theme: '今日の備え' },
  { slot: 'noon'    as SlotKey, label: '昼' as const, time: '12:00' as const, theme: '1分防災'   },
  { slot: 'night'   as SlotKey, label: '夜' as const, time: '21:00' as const, theme: '家族で確認' },
]

// =====================================================
// スケジュール済み投稿の型
// =====================================================

export type XScheduledPost = {
  slot: SlotKey
  label: '朝' | '昼' | '夜'
  time: '07:00' | '12:00' | '21:00'
  theme: string
  slug: string
  rank: XRank
  title: string
  url: string
  text: string
  mangaImages: string[]
}

// =====================================================
// シードベース擬似乱数（Mulberry32）
// 同一日付 → 同一結果を保証するため
// =====================================================

function mulberry32(seed: number): () => number {
  let s = seed
  return () => {
    s += 0x6d2b79f5
    let t = Math.imul(s ^ (s >>> 15), s | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * 日付文字列 + extra から整数シードを生成
 * dateStr='2026-05-22', extra=0 → 毎日同じ値
 * extra に Math.random() 由来の値を渡すと「再生成」になる
 */
export function dateToSeed(dateStr: string, extra = 0): number {
  let hash = 5381 + extra
  for (let i = 0; i < dateStr.length; i++) {
    hash = (Math.imul(hash, 33) ^ dateStr.charCodeAt(i)) >>> 0
  }
  return (hash >>> 0) || 1
}

// =====================================================
// 重み付きランダム選出（シード使用・重複なし）
// =====================================================

function pickWithSeed(
  candidates: XPostCandidate[],
  rng: () => number,
  exclude: string[],
): XPostCandidate | null {
  // 履歴の読み込み（重複防止のため）
  let recentSlugs: string[] = []
  try {
    const historyPath = path.join(process.cwd(), 'data', 'x-post-history.json')
    if (fs.existsSync(historyPath)) {
      const history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'))
      // 直近100件の成功した投稿を取得
      recentSlugs = history
        .filter((r: any) => r.success)
        .slice(-100)
        .map((r: any) => r.slug)
    }
  } catch (e) {
    console.error('[pickWithSeed] 履歴読み込み失敗:', e)
  }

  // 1. 履歴 + 今回のセッションでの除外
  const allExclude = [...new Set([...exclude, ...recentSlugs])]
  let pool = candidates.filter((c) => !allExclude.includes(c.slug))
  
  // 2. もし候補が空になったら、今回のセッションでの除外のみにする
  if (pool.length === 0) {
    pool = candidates.filter((c) => !exclude.includes(c.slug))
  }
  
  // 3. それでも空なら全候補から
  if (pool.length === 0) {
    pool = [...candidates]
  }

  const expanded: XPostCandidate[] = []
  for (const c of pool) {
    const w = RANK_WEIGHTS[c.rank]
    for (let i = 0; i < w; i++) expanded.push(c)
  }
  if (expanded.length === 0) return null

  return expanded[Math.floor(rng() * expanded.length)]
}

// =====================================================
// 1日分スケジュール生成
// =====================================================

/**
 * 日付 + オプションシードから朝昼夜3投稿を生成する。
 * seed が undefined の場合は dateStr から自動生成（再読み込みしても同じ結果）。
 * seed に整数を渡すと再生成（ランダム再生成ボタン用）。
 */
export function generateDailySchedule(
  candidates: XPostCandidate[],
  dateStr: string,
  seed?: number,
): XScheduledPost[] {
  const effectiveSeed = seed ?? dateToSeed(dateStr)
  const rng = mulberry32(effectiveSeed)

  const result: XScheduledPost[] = []
  const usedSlugs: string[] = []

  for (const slot of DAILY_SLOTS) {
    const picked = pickWithSeed(candidates, rng, usedSlugs)
    if (!picked) break

    usedSlugs.push(picked.slug)
    result.push({
      slot: slot.slot,
      label: slot.label,
      time: slot.time,
      theme: slot.theme,
      slug: picked.slug,
      rank: picked.rank,
      title: picked.title,
      url: picked.url,
      text: picked.text,
      mangaImages: picked.mangaImages,
    })
  }

  return result
}

// =====================================================
// 今日の日付を JST で取得（サーバーサイド用）
// =====================================================

export function getTodayJST(): string {
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().slice(0, 10)
}
