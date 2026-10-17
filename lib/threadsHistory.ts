import type { PostRecord } from './xAutoPost'

const HISTORY_URL = 'https://raw.githubusercontent.com/Kumagorou-0222/bousai-lab/main/data/x-post-history.json'
const MAX_BYTES = 2 * 1024 * 1024

export type ThreadsHistoryResult =
  | { ok: true; records: PostRecord[]; fetchedAt: string }
  | { ok: false }

function isPostRecord(value: unknown): value is PostRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return typeof record.slug === 'string' && typeof record.title === 'string' &&
    typeof record.postedAt === 'string' && typeof record.slot === 'string' &&
    typeof record.text === 'string'
}

export async function fetchThreadsHistory(): Promise<ThreadsHistoryResult> {
  try {
    const url = `${HISTORY_URL}?at=${Date.now()}`
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
    if (!response.ok) return { ok: false }
    const raw = await response.text()
    if (Buffer.byteLength(raw, 'utf8') > MAX_BYTES) return { ok: false }
    const records: unknown = JSON.parse(raw)
    if (!Array.isArray(records) || !records.every(isPostRecord)) return { ok: false }
    return { ok: true, records, fetchedAt: new Date().toISOString() }
  } catch {
    return { ok: false }
  }
}
