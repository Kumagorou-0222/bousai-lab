import 'server-only'
import fs from 'fs'
import path from 'path'
import type { ThreadsRecord } from './threadsPostUtils'

export type { ThreadsRecord } from './threadsPostUtils'
export { generateThreadsPost, buildThreadsIntentUrl } from './threadsPostUtils'

const THREADS_HISTORY_PATH = path.join(process.cwd(), 'data', 'threads-post-history.json')

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
