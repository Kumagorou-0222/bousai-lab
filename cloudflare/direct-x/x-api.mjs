import { oauth1Header } from './oauth1.mjs'

const UPLOAD = 'https://upload.twitter.com/1.1/media/upload.json'
const METADATA = 'https://upload.twitter.com/1.1/media/metadata/create.json'
const POST = 'https://api.x.com/2/tweets'

export function createXApi({ consumerKey, consumerSecret, accessToken, accessSecret,
  fetchImpl = fetch }) {
  const credentials = { consumerKey, consumerSecret, accessToken, accessSecret }
  const request = async (url, body, contentType) => {
    const authorization = await oauth1Header({ method: 'POST', url, ...credentials })
    const response = await fetchImpl(url, { method: 'POST', redirect: 'error',
      headers: { Authorization: authorization, ...(contentType ? { 'Content-Type': contentType } : {}) },
      body, signal: AbortSignal.timeout(15000) })
    if (!response.ok) throw new Error(`X APIがHTTP ${response.status}を返しました`)
    const raw = await response.text()
    const result = raw ? JSON.parse(raw) : {}
    if (result?.errors?.length) throw new Error('X APIの応答にエラーが含まれています')
    return result
  }
  return {
    async uploadPng(bytes) {
      const form = new FormData()
      form.set('media', new Blob([bytes], { type: 'image/png' }), 'image.png')
      const result = await request(UPLOAD, form)
      const id = result?.media_id_string
      if (!/^\d+$/.test(id || '')) throw new Error('画像アップロードの結果が不明です')
      return id
    },
    async setAltText(mediaId, altText) {
      if (!/^\d+$/.test(mediaId || '') || !altText?.trim() || altText.length > 1000) {
        throw new Error('画像説明の入力が不正です')
      }
      await request(METADATA, JSON.stringify({ media_id: mediaId, alt_text: { text: altText } }),
        'application/json')
    },
    async sendTweet(text, mediaId) {
      if (!text?.trim()) throw new Error('投稿文が空です')
      const payload = { text, ...(mediaId ? { media: { media_ids: [mediaId] } } : {}) }
      const result = await request(POST, JSON.stringify(payload), 'application/json')
      const id = result?.data?.id
      if (!/^\d+$/.test(id || '')) throw new Error('投稿結果が不明です')
      return { id }
    },
  }
}

