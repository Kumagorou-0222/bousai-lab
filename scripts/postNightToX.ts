import { TwitterApi } from 'twitter-api-v2'
import { appendHistory, nowJST, readHistory } from '../lib/xAutoPost'
import { jstDate, nightPostingWindow, selectNightPost, uploadNightImage } from '../lib/xNightPost'

async function main(): Promise<void> {
  const date = jstDate()
  if (!nightPostingWindow()) {
    appendHistory({ postedAt: nowJST(), slug: `night-${date}`, title: '', slot: 'night', text: '', hasImage: false, imageLocalPath: null, success: false, error: '日本時間21:00〜22:00の夜枠外のため投稿を見送りました' })
    return
  }
  const selected = selectNightPost(readHistory(), process.cwd(), date)
  if (!selected.ok) {
    appendHistory({ postedAt: nowJST(), slug: `night-${date}`, title: '', slot: 'night', text: '', hasImage: false, imageLocalPath: null, success: false, error: selected.reason })
    throw new Error(selected.reason)
  }
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } = process.env
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    throw new Error('X APIの認証情報が未設定です')
  }
  const client = new TwitterApi({ appKey: X_API_KEY, appSecret: X_API_SECRET, accessToken: X_ACCESS_TOKEN, accessSecret: X_ACCESS_SECRET })
  const { entry, image } = selected
  try {
    if (!nightPostingWindow() || jstDate() !== entry.slotDate) throw new Error('夜枠外または素材日付不一致のため投稿を見送りました')
    const mediaId = await uploadNightImage(client, image, entry.altText)
    if (!nightPostingWindow() || jstDate() !== entry.slotDate) throw new Error('夜枠外または素材日付不一致のため投稿を見送りました')
    const { data: tweet } = await client.v2.tweet({ text: entry.text, media: { media_ids: [mediaId] } })
    appendHistory({ postedAt: nowJST(), slug: `night-${date}`, title: entry.theme, slot: 'night', tweetId: tweet.id, tweetUrl: `https://x.com/i/web/status/${tweet.id}`, text: entry.text, hasImage: true, imageLocalPath: `public${entry.imagePath}`, nightImageId: entry.imageId, success: true })
    console.log(`夜枠の新作を投稿しました: ${tweet.id}`)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    appendHistory({ postedAt: nowJST(), slug: `night-${date}`, title: entry.theme, slot: 'night', text: entry.text, hasImage: true, imageLocalPath: `public${entry.imagePath}`, nightImageId: entry.imageId, success: false, error: reason })
    throw error
  }
}

main().catch((error: unknown) => {
  console.error('夜枠投稿に失敗しました:', error)
  process.exitCode = 1
})
