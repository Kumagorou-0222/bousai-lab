const HISTORY_URL = 'https://api.github.com/repos/Kumagorou-0222/bousai-lab/contents/data/x-post-history.json'

function decodeUtf8(base64) {
  const binary = atob(base64.replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function encodeUtf8(value) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
  }
  return btoa(binary)
}

export function githubHistoryStore({ token, fetchImpl = fetch }) {
  if (typeof token !== 'string' || !token.trim()) throw new Error('履歴更新用の認証情報が未設定です')
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }
  return {
    async read() {
      const response = await fetchImpl(HISTORY_URL, { headers, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000) })
      if (response.status !== 200) throw new Error(`投稿履歴の取得に失敗しました (HTTP ${response.status})`)
      const data = await response.json()
      if (!data?.sha || typeof data.content !== 'string') throw new Error('投稿履歴の形式が不正です')
      const records = JSON.parse(decodeUtf8(data.content))
      if (!Array.isArray(records)) throw new Error('投稿履歴の形式が不正です')
      return { sha: data.sha, records }
    },
    async write(sha, records) {
      if (!sha || !Array.isArray(records)) throw new Error('投稿履歴の更新形式が不正です')
      const response = await fetchImpl(HISTORY_URL, {
        method: 'PUT', redirect: 'error', cache: 'no-store',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'chore: X投稿予約と結果を更新 [skip ci]', branch: 'main', sha,
          content: encodeUtf8(JSON.stringify(records.slice(-1000), null, 2) + '\n') }),
        signal: AbortSignal.timeout(10000),
      })
      if (response.status === 409 || response.status === 422) return false
      if (response.status !== 200) throw new Error(`投稿履歴の更新に失敗しました (HTTP ${response.status})`)
      return true
    },
  }
}
