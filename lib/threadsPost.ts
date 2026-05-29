/**
 * Threads転用ロジック
 * X投稿テキストをThreads向けのやわらかい文体に変換する。
 * UIから分離された純粋関数 + ファイルI/O。
 */

import fs from 'fs'
import path from 'path'

const THREADS_HISTORY_PATH = path.join(process.cwd(), 'data', 'threads-post-history.json')

// =====================================================
// 型
// =====================================================

export type ThreadsRecord = {
  generatedAt: string   // ISO 8601 JST
  slug: string
  title: string
  xText: string
  threadsText: string
  articleUrl: string
  mangaImageUrl?: string
  postedAt?: string     // undefined = 未投稿
}

// =====================================================
// 履歴 CRUD
// =====================================================

export function readThreadsHistory(): ThreadsRecord[] {
  try {
    if (!fs.existsSync(THREADS_HISTORY_PATH)) return []
    const raw = fs.readFileSync(THREADS_HISTORY_PATH, 'utf-8')
    return JSON.parse(raw) as ThreadsRecord[]
  } catch {
    return []
  }
}

export function writeThreadsHistory(records: ThreadsRecord[]): void {
  const dir = path.dirname(THREADS_HISTORY_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const trimmed = records.slice(-500)
  fs.writeFileSync(THREADS_HISTORY_PATH, JSON.stringify(trimmed, null, 2) + '\n', 'utf-8')
}

export function appendThreadsHistory(record: ThreadsRecord): void {
  const history = readThreadsHistory()
  history.push(record)
  writeThreadsHistory(history)
}

// =====================================================
// X投稿パーサー
// =====================================================

interface ParsedXPost {
  labels: string[]   // 【...】内のラベル群
  title: string      // ラベル除去後の最初の文
  ngAction: string
  okAction: string
  reason: string
  url: string
  hashtags: string[]
  rawBody: string    // ❌⭕CTA URL hashtag を除いた残り
}

function parseXPost(xText: string): ParsedXPost {
  let text = xText.trim()

  // 1. 【...】ラベルをすべて抽出・除去
  const labels: string[] = []
  text = text.replace(/【([^】]*)】/g, (_, inner) => {
    labels.push(inner.trim())
    return ' '
  }).replace(/\s{2,}/g, ' ').trim()

  // 2. URL抽出
  const urlMatch = text.match(/https?:\/\/[^\s]+/)
  const url = urlMatch ? urlMatch[0] : ''
  text = text.replace(/https?:\/\/[^\s]+/g, '').trim()

  // 3. ハッシュタグ抽出・除去
  const hashtags: string[] = []
  text = text.replace(/#\S+/g, (tag) => {
    hashtags.push(tag)
    return ''
  }).trim()

  // 4. CTA除去
  text = text.replace(/[保存クリック参照]して確認👇?/g, '').trim()
  text = text.replace(/4コマで確認👇?/g, '').trim()
  text = text.replace(/詳しくは→?/g, '').trim()

  // 5. ❌/⭕ 抽出（同一行の可能性あり）
  const ngMatch = text.match(/❌\s*([^⭕#\n→]+)/)
  const okMatch = text.match(/⭕\s*([^❌#\n→]+)/)
  const ngAction = ngMatch ? ngMatch[1].trim().replace(/\s*→\s*$/, '') : ''
  const okAction = okMatch ? okMatch[1].trim().replace(/\s*→\s*$/, '') : ''
  text = text.replace(/❌[^⭕#\n→]*/g, '').replace(/⭕[^❌#\n→]*/g, '').trim()

  // 6. 「理由：」行の後の1文を抽出
  const reasonMatch = text.match(/理由[:：]\s*([^\n。]+)/)
  const reason = reasonMatch ? reasonMatch[1].trim() : ''
  text = text.replace(/理由[:：][^\n]*/g, '').trim()

  // 7. 残りのテキストをtitleとbodyに分割
  const lines = text.split(/[\n。]/).map(l => l.trim()).filter(Boolean)
  const title = lines[0] ?? ''
  const rawBody = lines.slice(1).join('\n')

  return { labels, title, ngAction, okAction, reason, url, hashtags, rawBody }
}

// =====================================================
// Threads投稿文生成（主要エクスポート）
// =====================================================

/**
 * X投稿テキストをThreads向けに変換する。
 * - 【】ラベルを除去してやわらかい語り口に
 * - ❌/⭕ 形式を「ついやってしまうのが…」体験談スタイルに
 * - ハッシュタグは最大2個
 * - URLは末尾に「詳しくはこちら：」で添付
 */
export function generateThreadsPost(xText: string): string {
  const p = parseXPost(xText)
  const parts: string[] = []

  if (p.ngAction && p.okAction) {
    if (p.title) {
      parts.push(p.title)
      parts.push('')
    }
    parts.push(`ついやってしまうのが\n「${p.ngAction}」です。`)
    parts.push('')
    if (p.reason) {
      parts.push(p.reason + (p.reason.endsWith('。') ? '' : '。'))
      parts.push('')
    } else if (p.rawBody) {
      parts.push(p.rawBody)
      parts.push('')
    }
    parts.push(`正しくは「${p.okAction}」。`)
    parts.push('ちょっとした知識が、いざというときの安心につながります。')
  } else if (p.title) {
    parts.push(p.title)
    if (p.reason) {
      parts.push('')
      parts.push(p.reason + (p.reason.endsWith('。') ? '' : '。'))
    } else if (p.rawBody) {
      parts.push('')
      parts.push(p.rawBody)
    }
    parts.push('')
    parts.push('準備しておくと、いざというときに焦らなくて済みます。')
  }

  // URL
  if (p.url) {
    parts.push('')
    parts.push(`詳しくはこちら：\n${p.url}`)
  }

  // ハッシュタグ最大2個
  const keptTags = p.hashtags.slice(0, 2).join(' ')
  if (keptTags) {
    parts.push('')
    parts.push(keptTags)
  }

  return parts.join('\n').trim()
}

// =====================================================
// Threads投稿URLビルダー
// =====================================================

export function buildThreadsIntentUrl(text: string): string {
  return `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`
}
