/**
 * X (Twitter) API 投稿インターフェース
 *
 * 現在は手動投稿モード（X_AUTO_POST_ENABLED=false）。
 * 将来 X API に課金して自動投稿する場合は X_AUTO_POST_ENABLED=true にし、
 * postToX 内に Twitter API v2 の実装を追加してください。
 */

export type XPostPayload = {
  text: string
  mediaPaths?: string[]  // 将来: アップロードする画像のローカルパス
}

export type XPostResult =
  | { ok: true;  tweetId: string }
  | { ok: false; error: 'manual_mode' | 'not_implemented' | 'api_error' | string }

/**
 * X に投稿する。
 * X_AUTO_POST_ENABLED=false（デフォルト）の場合は何もせず manual_mode を返す。
 */
export async function postToX(payload: XPostPayload): Promise<XPostResult> {
  const enabled = process.env.X_AUTO_POST_ENABLED === 'true'

  if (!enabled) {
    return { ok: false, error: 'manual_mode' }
  }

  // ── 将来の実装ポイント ──────────────────────────
  // import { TwitterApi } from 'twitter-api-v2'
  // const client = new TwitterApi({
  //   appKey:    process.env.X_API_KEY!,
  //   appSecret: process.env.X_API_SECRET!,
  //   accessToken:       process.env.X_ACCESS_TOKEN!,
  //   accessSecret:      process.env.X_ACCESS_TOKEN_SECRET!,
  // })
  // const { data } = await client.v2.tweet(payload.text)
  // return { ok: true, tweetId: data.id }
  // ────────────────────────────────────────────────

  console.warn('[xApi] X_AUTO_POST_ENABLED=true だが実装未完了')
  return { ok: false, error: 'not_implemented' }
}

/** 現在の投稿モードを返す */
export function getPostMode(): 'auto' | 'manual' {
  return process.env.X_AUTO_POST_ENABLED === 'true' ? 'auto' : 'manual'
}
