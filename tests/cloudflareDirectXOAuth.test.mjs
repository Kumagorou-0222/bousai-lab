import test from 'node:test'
import assert from 'node:assert/strict'
import { createHmac, webcrypto } from 'node:crypto'
import { oauth1Header } from '../cloudflare/direct-x/oauth1.mjs'

globalThis.crypto ??= webcrypto

test('OAuth 1.0a署名はURLクエリを含め、秘密をヘッダーに出さない', async () => {
  const header = await oauth1Header({ method: 'POST', url: 'https://api.x.com/2/tweets?a=hello%20world',
    consumerKey: 'consumer', consumerSecret: 'secret', accessToken: 'token', accessSecret: 'access',
    nonce: 'fixed', timestamp: 1234567890 })
  const params = [
    'a=hello%20world', 'oauth_consumer_key=consumer', 'oauth_nonce=fixed',
    'oauth_signature_method=HMAC-SHA1', 'oauth_timestamp=1234567890',
    'oauth_token=token', 'oauth_version=1.0',
  ].join('&')
  const base = ['POST', encodeURIComponent('https://api.x.com/2/tweets'),
    encodeURIComponent(params)].join('&')
  const signature = createHmac('sha1', 'secret&access').update(base).digest('base64')
  assert.ok(header.includes(`oauth_signature="${encodeURIComponent(signature)}"`))
  assert.ok(!header.includes('secret'))
  assert.ok(!header.includes('access'))
})

test('X認証情報の欠損は通信前に停止', async () => {
  await assert.rejects(oauth1Header({ method: 'POST', url: 'https://api.x.com/2/tweets',
    consumerKey: '', consumerSecret: 's', accessToken: 't', accessSecret: 'a' }), /不足/)
})

