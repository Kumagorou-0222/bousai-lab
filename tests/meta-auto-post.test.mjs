import test from 'node:test'
import assert from 'node:assert/strict'
import { approvedContentSha256, selectApprovedMetaPosts } from '../lib/metaApprovedPosts.ts'
import { runApprovedMetaPosts } from '../lib/metaAutoPost.ts'
import { checkMetaConnection } from '../lib/metaPublisher.ts'
import { campaignUrl } from '../lib/socialCampaign.ts'

const now = new Date('2026-10-21T11:15:00Z')

function approved(channel) {
  const content = {
    channel, dateJst: '2026-10-21', slug: 'emergency-toilet',
    campaign: 'daily-20261021',
    text: channel === 'threads'
      ? `当日の備えを確認\n${campaignUrl('emergency-toilet', 'threads', 'daily-20261021')}`
      : '当日の備えを確認。詳しくはプロフィールから。',
    ...(channel === 'instagram' ? { imageUrl: 'https://bousai-lab.vercel.app/manga/test.png' } : {}),
    expiresAt: '2026-10-21T13:00:00Z',
  }
  return { ...content, approved: true, approvedAt: '2026-10-21T10:00:00Z', contentSha256: approvedContentSha256(content) }
}

test('空台帳と期限切れの承認は投稿対象にならない', () => {
  assert.deepEqual(selectApprovedMetaPosts({ version: 1, posts: [] }, now), [])
  assert.deepEqual(selectApprovedMetaPosts({ version: 1, posts: [approved('threads')] }, new Date('2026-10-21T13:00:00Z')), [])
  assert.deepEqual(selectApprovedMetaPosts({ version: 1, posts: [approved('threads')] }, new Date('2026-10-22T11:15:00Z')), [])
})

test('承認内容の改変、同日重複、外部画像、計測リンク欠落を拒否する', () => {
  const post = approved('threads')
  assert.throws(() => selectApprovedMetaPosts({ version: 1, posts: [{ ...post, text: '変更後' }] }, now), /ハッシュ/)
  assert.throws(() => selectApprovedMetaPosts({ version: 1, posts: [post, post] }, now), /重複/)
  const image = approved('instagram')
  assert.throws(() => selectApprovedMetaPosts({ version: 1, posts: [{ ...image, imageUrl: 'https://example.com/a.png' }] }, now), /ハッシュ|画像/)
  const noLink = { ...post, text: 'リンクなし' }
  noLink.contentSha256 = approvedContentSha256(noLink)
  assert.throws(() => selectApprovedMetaPosts({ version: 1, posts: [noLink] }, now), /計測リンク/)
  const longText = { ...post, text: `${'防災'.repeat(250)}${campaignUrl(post.slug, 'threads', post.campaign)}` }
  longText.contentSha256 = approvedContentSha256(longText)
  assert.throws(() => selectApprovedMetaPosts({ version: 1, posts: [longText] }, now), /内容/)
})

test('既定ドライランと媒体別停止では送信関数を呼ばない', async () => {
  const manifest = { version: 1, posts: [approved('threads'), approved('instagram')] }
  let calls = 0
  const publish = async () => { calls++; return 'id' }
  assert.deepEqual(await runApprovedMetaPosts(manifest, now, {}, publish), { status: 'dry_run', approvedCount: 2, sentCount: 0 })
  assert.deepEqual(await runApprovedMetaPosts(manifest, now, { META_DRY_RUN: 'false', SOCIAL_PUBLISH_ENABLED: 'true' }, publish),
    { status: 'completed', approvedCount: 2, sentCount: 0 })
  assert.equal(calls, 0)
})

test('全フラグが有効でも空台帳と期限切れ投稿は送信しない', async () => {
  let calls = 0
  const publish = async () => { calls++; return 'id' }
  const enabled = { META_DRY_RUN: 'false', SOCIAL_PUBLISH_ENABLED: 'true', THREADS_PUBLISH_ENABLED: 'true' }
  assert.equal((await runApprovedMetaPosts({ version: 1, posts: [] }, now, enabled, publish)).sentCount, 0)
  assert.equal((await runApprovedMetaPosts({ version: 1, posts: [approved('threads')] },
    new Date('2026-10-21T13:00:00Z'), enabled, publish)).sentCount, 0)
  assert.equal(calls, 0)
})

test('有効化した媒体だけを別キーで一度送る', async () => {
  const manifest = { version: 1, posts: [approved('threads'), approved('instagram')] }
  const calls = []
  const env = { META_DRY_RUN: 'false', SOCIAL_PUBLISH_ENABLED: 'true', THREADS_PUBLISH_ENABLED: 'true' }
  const result = await runApprovedMetaPosts(manifest, now, env, async (post) => { calls.push(post); return 'id' })
  assert.equal(result.sentCount, 1)
  assert.deepEqual(calls.map((post) => post.channel), ['threads'])
  assert.equal(calls[0].approved, true)
})

test('認証の照合はGETだけを使い、投稿フラグを参照しない', async () => {
  process.env.THREADS_ACCOUNT_ID = '12345'
  process.env.THREADS_ACCESS_TOKEN = 'mock-token'
  process.env.SOCIAL_PUBLISH_ENABLED = 'false'
  const calls = []
  const fetchImpl = async (url, options) => {
    calls.push({ url: String(url), method: options.method, authorization: options.headers.Authorization })
    return { ok: true, json: async () => ({ id: '12345' }) }
  }
  assert.equal(await checkMetaConnection('threads', fetchImpl), true)
  assert.deepEqual(calls.map((call) => call.method), ['GET'])
  assert.match(calls[0].url, /graph\.threads\.net\/v1\.0\/me/)
  assert.equal(calls[0].url.includes('mock-token'), false)
  assert.equal(calls[0].authorization, 'Bearer mock-token')
})
