/**
 * LINE Messaging API プッシュ通知
 * 環境変数:
 *   LINE_CHANNEL_ACCESS_TOKEN — LINE Developers で発行した長期アクセストークン
 *   LINE_USER_ID              — 通知先の LINE ユーザーID（U から始まる）
 */

export async function sendLineMessage(text: string): Promise<void> {
  const token  = process.env.LINE_CHANNEL_ACCESS_TOKEN
  const userId = process.env.LINE_USER_ID

  if (!token || !userId) {
    throw new Error('LINE_CHANNEL_ACCESS_TOKEN または LINE_USER_ID が未設定です')
  }

  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: 'text', text }],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`LINE API エラー: ${res.status} ${body}`)
  }
}
