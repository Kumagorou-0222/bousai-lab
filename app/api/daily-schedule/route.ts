export const runtime = 'nodejs'

import { getAllArticlesMeta } from '@/lib/articles'
import { buildPriorityCandidates } from '@/lib/xPostQueue'
import { generateDailySchedule, getTodayJST } from '@/lib/xScheduler'

export async function GET(request: Request) {
  // シークレット認証
  const { searchParams } = new URL(request.url)
  const secret = process.env.NOTIFY_SECRET
  if (!secret || searchParams.get('secret') !== secret) {
    return Response.json({ error: '認証失敗' }, { status: 401 })
  }

  const dateStr = getTodayJST()
  const allMeta = getAllArticlesMeta()
  const articleMap = new Map(allMeta.map((a) => [a.slug, a]))
  const candidates = buildPriorityCandidates(articleMap)
  const schedule = generateDailySchedule(candidates, dateStr)

  const result: Record<string, { slug: string; title: string; text: string }> = {}
  for (const post of schedule) {
    result[post.slot] = { slug: post.slug, title: post.title, text: post.text }
  }

  return Response.json({ date: dateStr, schedule: result })
}
