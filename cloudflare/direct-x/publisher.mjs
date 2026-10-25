import { verifiedPng } from './candidate-source.mjs'

// X APIの接続口。副作用を注入し、資格情報なしのテストで送信順序を確認する。
export function createPublisher({ uploadPng, setAltText, sendTweet, fetchImpl = fetch }) {
  if (![uploadPng, setAltText, sendTweet].every(fn => typeof fn === 'function')) {
    throw new Error('X投稿APIの接続が未設定です')
  }
  return {
    async prepare(candidate) {
      if (!candidate.imagePath) return null
      if (!candidate.imageSha256 || !candidate.width || !candidate.height) throw new Error('画像の検証情報がありません')
      const image = await verifiedPng(candidate.imagePath, candidate.imageSha256,
        candidate.width, candidate.height, fetchImpl)
      const mediaId = await uploadPng(image)
      if (!mediaId) throw new Error('画像アップロードの結果が不明です')
      if (candidate.altText) await setAltText(mediaId, candidate.altText)
      return mediaId
    },
    async send(candidate, mediaId) {
      if (!candidate.text?.trim()) throw new Error('投稿文が空です')
      const result = await sendTweet(candidate.text, mediaId)
      if (!result?.id) throw new Error('投稿結果が不明です')
      return result
    },
  }
}

