/**
 * X自動投稿スクリプト
 * GitHub Actions から tsx で実行される。
 *
 * 必須環境変数:
 *   X_API_KEY          — Twitter/X API Key (Consumer Key)
 *   X_API_SECRET       — Twitter/X API Secret (Consumer Secret)
 *   X_ACCESS_TOKEN     — Access Token (ユーザーアクセストークン)
 *   X_ACCESS_SECRET    — Access Token Secret
 *
 * オプション環境変数:
 *   POST_SLOT          — morning | noon | night（省略時は UTC 時刻から自動判定）
 *   TELEGRAM_BOT_TOKEN — エラー通知用 Bot Token
 *   TELEGRAM_CHAT_ID   — エラー通知先 Chat ID
 *
 * 実行例:
 *   POST_SLOT=morning npx tsx scripts/postToX.ts
 */

import fs from 'fs'
import path from 'path'
import { TwitterApi } from 'twitter-api-v2'
import {
  selectCandidate,
  resolveMangaImagePath,
  appendHistory,
  detectSlot,
  nowJST,
} from '../lib/xAutoPost'
import { buildPriorityCandidates } from '../lib/xPostQueue'
import { getAllArticlesMeta } from '../lib/articles'
import { generateHashtags, applyHashtags } from '../lib/xHashtags'

// =====================================================
// X クライアント初期化
// =====================================================

function initXClient(): TwitterApi {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } = process.env
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    throw new Error(
      'X API 環境変数が未設定です。X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN / X_ACCESS_SECRET を確認してください。',
    )
  }
  return new TwitterApi({
    appKey:      X_API_KEY,
    appSecret:   X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_SECRET,
  })
}

// =====================================================
// メイン
// =====================================================

async function main(): Promise<void> {
  const slot = detectSlot()
  console.log(`\n=== [postToX] 開始 ${nowJST()} slot=${slot} ===`)

  // ── 1. X クライアント
  const client = initXClient()

  // ── 2. 候補記事リスト（全記事から Priority 記事だけ抽出）
  const allMeta = getAllArticlesMeta()
  const articleMap = new Map(allMeta.map((a) => [a.slug, a]))
  const candidates = buildPriorityCandidates(articleMap)

  console.log(`[postToX] 候補 ${candidates.length} 記事`)

  // ── 3. 投稿記事を選択（重複防止）
  const selected = selectCandidate(candidates)
  if (!selected) {
    throw new Error('投稿候補が見つかりませんでした')
  }

  console.log(`[postToX] 選択: ${selected.slug}  rank=${selected.rank}  hasManga=${selected.hasManga}`)
  console.log(`[postToX] タイトル: ${selected.title}`)

  // ── 4. 投稿テキスト + ハッシュタグ自動付与
  const hashtags = generateHashtags({
    slug:      selected.slug,
    category:  selected.category,
    slot,
    xSeries:   selected.xSeries,
    hasRegion: selected.hasRegion,
  })
  const postText = applyHashtags(selected.text, hashtags)
  console.log(`[postToX] ハッシュタグ: ${hashtags.join(' ')}`)
  console.log(`[postToX] 投稿文 (${postText.length}文字):\n${postText}\n`)

  // ── 5. 画像アップロード（mangaImages の先頭 PNG）
  let mediaId: string | undefined
  const imagePath = resolveMangaImagePath(selected.mangaImages)

  if (imagePath) {
    console.log(`[postToX] 画像: ${path.relative(process.cwd(), imagePath)}`)
    const imageBuffer = fs.readFileSync(imagePath)
    mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType: 'image/png' })
    console.log(`[postToX] media_id: ${mediaId}`)
  } else {
    console.log('[postToX] 画像なし — テキストのみ投稿')
  }

  // ── 6. ツイート投稿
  const tweetPayload: Parameters<typeof client.v2.tweet>[0] = { text: postText }
  if (mediaId) {
    tweetPayload.media = { media_ids: [mediaId] }
  }

  const { data: tweet } = await client.v2.tweet(tweetPayload)
  console.log(`[postToX] ✅ 投稿成功  tweet_id=${tweet.id}`)

  // ── 7. 投稿履歴を更新
  appendHistory({
    postedAt:       nowJST(),
    slug:           selected.slug,
    title:          selected.title,
    slot,
    tweetId:        tweet.id,
    text:           postText,
    imageLocalPath: imagePath
      ? path.relative(process.cwd(), imagePath)
      : null,
  })

  console.log(`=== [postToX] 完了 ===\n`)
}

// =====================================================
// エントリーポイント
// =====================================================

main().catch((err: unknown) => {
  console.error('[postToX] ❌ エラー:', err)
  process.exit(1)
})
