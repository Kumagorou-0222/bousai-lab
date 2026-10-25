const encode = value => encodeURIComponent(String(value)).replace(/[!'()*]/g,
  char => '%' + char.charCodeAt(0).toString(16).toUpperCase())

export async function oauth1Header({ method, url, consumerKey, consumerSecret, accessToken,
  accessSecret, nonce = crypto.randomUUID().replaceAll('-', ''), timestamp = Math.floor(Date.now() / 1000) }) {
  if (![consumerKey, consumerSecret, accessToken, accessSecret].every(value => typeof value === 'string' && value)) {
    throw new Error('X認証情報が不足しています')
  }
  const parsed = new URL(url)
  const baseUrl = parsed.origin + parsed.pathname
  const oauth = { oauth_consumer_key: consumerKey, oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1', oauth_timestamp: String(timestamp),
    oauth_token: accessToken, oauth_version: '1.0' }
  const params = [...parsed.searchParams.entries(), ...Object.entries(oauth)]
    .map(([key, value]) => [encode(key), encode(value)])
    .sort(([a, av], [b, bv]) => a < b ? -1 : a > b ? 1 : av < bv ? -1 : av > bv ? 1 : 0)
    .map(pair => pair.join('=')).join('&')
  const base = [method.toUpperCase(), encode(baseUrl), encode(params)].join('&')
  const secret = [encode(consumerSecret), encode(accessSecret)].join('&')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  const signature = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC', key,
    new TextEncoder().encode(base)))))
  return 'OAuth ' + Object.entries({ ...oauth, oauth_signature: signature })
    .map(([key, value]) => `${encode(key)}="${encode(value)}"`).join(', ')
}

