export const runtime = 'nodejs'

import { getAllArticlesMeta } from '@/lib/articles'
import { buildPriorityCandidates } from '@/lib/xPostQueue'
import { generateDailySchedule, getTodayJST, type SlotKey } from '@/lib/xScheduler'
import { sendLineMessage } from '@/lib/lineNotify'

const SLOT_LABELS: Record<SlotKey, string> = {
  morning: '🌅 朝 07:00 ｜今日の備え',
  noon:    '☀️ 昼 12:00 ｜1分防災',
  night:   '🌙 夜 21:00 ｜家族で確認',
}

export async function POST(request: Request) {
  let body: { slot?: string; secret?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'リクエスト形式が不正です' }, { status: 400 })
  }

  // シークレット認証
  const secret = process.env.NOTIFY_SECRET
  if (!secret || body.secret !== secret) {
    return Response.json({ error: '認証失敗' }, { status: 401 })
  }

  // スロット検証
  const validSlots: SlotKey[] = ['morning', 'noon', 'night']
  const slot = body.slot as SlotKey
  if (!validSlots.includes(slot)) {
    return Response.json({ error: 'slot は morning / noon / night のいずれかです' }, { status: 400 })
  }

  // 今日のスケジュール生成
  const dateStr = getTodayJST()
  const allMeta = getAllArticlesMeta()
  const articleMap = new Map(allMeta.map((a) => [a.slug, a]))
  const candidates = buildPriorityCandidates(articleMap)
  const schedule = generateDailySchedule(candidates, dateStr)

  const post = schedule.find((p) => p.slot === slot)
  if (!post) {
    return Response.json({ error: 'スケジュール生成失敗' }, { status: 500 })
  }

  // LINEメッセージ組み立て
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.text)}`

  const lines: string[] = [
    SLOT_LABELS[slot],
    '',
    `📰 ${post.title}`,
    '',
    '─────────────',
    post.text,
    '─────────────',
  ]

  if (post.mangaImages.length > 0) {
    lines.push('')
    lines.push(`🎨 漫画画像 ${post.mangaImages.length}枚：`)
    post.mangaImages.forEach((url, i) => {
      lines.push(`${i + 1}. ${url}`)
    })
  }

  lines.push('')
  lines.push(`𝕏 投稿する：${tweetUrl}`)

  const message = lines.join('\n')

  try {
    await sendLineMessage(message)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return Response.json({ error: `LINE送信失敗: ${msg}` }, { status: 500 })
  }

  return Response.json({ ok: true, slot, slug: post.slug, date: dateStr })
}
