import fs from 'node:fs'
import path from 'node:path'
import { TwitterApi } from 'twitter-api-v2'
import { appendHistory, nowJST, type PostRecord, writeHistory } from '../lib/xAutoPost'
import { jstDate, nightPostingWindow, selectNightPost, uploadNightImage } from '../lib/xNightPost'

const attemptId = process.env.GITHUB_RUN_ID
const mode = process.argv[2]

function assertWindow(date: string): void {
  if (!nightPostingWindow() || jstDate() !== date) throw new Error('日本時間20:00〜22:00の夜枠外、または素材日付不一致です')
}

function readNightHistory(): PostRecord[] {
  const records: unknown = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/x-post-history.json'), 'utf8'))
  if (!Array.isArray(records)) throw new Error('投稿履歴の形式が不正です')
  return records as PostRecord[]
}

async function main(): Promise<void> {
  if (!attemptId || !/^\d+$/.test(attemptId)) throw new Error('実行IDが不正です')
  if (mode !== 'prepare' && mode !== 'send') throw new Error('夜枠の実行モードが不正です')
  const date = jstDate()
  if (mode === 'prepare' && !nightPostingWindow()) {
    console.log('夜枠外のため投稿を見送りました')
    return
  }
  assertWindow(date)
  const history = readNightHistory()
  const ownReservation = history.find((record) => record.nightAttemptId === attemptId && record.slug === `night-${date}`)
  if (mode === 'send' && (!ownReservation || ownReservation.nightStatus !== 'reserved')) {
    throw new Error('確定済みの夜枠予約がありません')
  }
  const selected = selectNightPost(
    mode === 'send' ? history.filter((record) => record !== ownReservation) : history,
    process.cwd(), date,
  )
  if (!selected.ok) throw new Error(selected.reason)
  const { entry, image } = selected
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } = process.env
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) throw new Error('X APIの認証情報が未設定です')

  if (mode === 'prepare') {
    appendHistory({ postedAt: nowJST(), slug: `night-${date}`, title: entry.theme, slot: 'night', text: entry.text,
      hasImage: true, imageLocalPath: `public${entry.imagePath}`, nightImageId: entry.imageId,
      nightAttemptId: attemptId, nightStatus: 'reserved', success: false })
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, 'ready=true\n')
    console.log('夜枠の投稿予約を記録しました')
    return
  }

  const client = new TwitterApi({ appKey: X_API_KEY, appSecret: X_API_SECRET, accessToken: X_ACCESS_TOKEN, accessSecret: X_ACCESS_SECRET })
  try {
    assertWindow(date)
    const mediaId = await uploadNightImage(client, image, entry.altText)
    assertWindow(date)
    // 送信結果が不明な場合も予約を保持し、自動再送を防ぐ。
    const { data: tweet } = await client.v2.tweet({ text: entry.text, media: { media_ids: [mediaId] } })
    ownReservation!.postedAt = nowJST()
    ownReservation!.tweetId = tweet.id
    ownReservation!.tweetUrl = `https://x.com/i/web/status/${tweet.id}`
    ownReservation!.success = true
    ownReservation!.nightStatus = 'posted'
    writeHistory(history)
    console.log(`夜枠の新作を投稿しました: ${tweet.id}`)
  } catch (error) {
    ownReservation!.nightStatus = 'unknown'
    ownReservation!.error = error instanceof Error ? error.message : String(error)
    writeHistory(history)
    throw error
  }
}

main().catch((error: unknown) => {
  console.error('夜枠投稿に失敗しました:', error)
  process.exitCode = 1
})
