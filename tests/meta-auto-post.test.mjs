import test from 'node:test'
import assert from 'node:assert/strict'
import { approvedContentSha256, selectApprovedMetaPosts } from '../lib/metaApprovedPosts.ts'
import { runApprovedMetaPosts } from '../lib/metaAutoPost.ts'

const dateJst = '2026-10-21'
const at = (hour, minute = 0) => new Date(`2026-10-21T${String(hour - 9).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`)

function approved(channel = 'threads', overrides = {}) {
  const content = {
    channel, dateJst, slug: 'emergency-toilet', campaign: 'daily-20261021',
    text: '災害に備えて水と携帯トイレを確認しましょう。',
    accountId: '12345', classification: 'noncommercial-education',
    reviewedBy: 'editor-one', reviewedAt: '2026-10-21T08:00:00Z',
    expiresAt: '2026-10-21T13:00:00Z',
    ...(channel === 'instagram' ? { imageUrl: 'https://bousai-lab.vercel.app/manga/test.jpg', imageSha256: 'a'.repeat(64) } : {}),
    ...overrides,
  }
  return { ...content, approved: true, approvedAt: '2026-10-21T08:30:00Z',
    contentSha256: approvedContentSha256(content) }
}

const manifest = (...posts) => ({ version: 2, posts })

test('18時以上22時未満の当日だけ選ぶ', () => {
  const post = approved()
  assert.equal(selectApprovedMetaPosts(manifest(post), at(17, 59)).length, 0)
  assert.equal(selectApprovedMetaPosts(manifest(post), at(18)).length, 1)
  assert.equal(selectApprovedMetaPosts(manifest(post), at(21, 59)).length, 1)
  assert.equal(selectApprovedMetaPosts(manifest(post), at(22)).length, 0)
  assert.equal(selectApprovedMetaPosts(manifest(post), new Date('2026-10-22T09:00:00Z')).length, 0)
})

test('承認変更、商業性、URL、画像形式、重複を拒否する', () => {
  const post = approved()
  assert.throws(() => selectApprovedMetaPosts(manifest({ ...post, text: '改変' }), at(18)), /ハッシュ/)
  assert.throws(() => selectApprovedMetaPosts(manifest(post, post), at(18)), /重複/)
  assert.throws(() => selectApprovedMetaPosts(manifest(approved('threads', { classification: 'commercial' })), at(18)), /商業/)
  assert.throws(() => selectApprovedMetaPosts(manifest(approved('threads', { text: '詳細 https://bousai-lab.vercel.app/checklist' })), at(18)), /商業/)
  assert.throws(() => selectApprovedMetaPosts(manifest(approved('instagram', { imageUrl: 'https://bousai-lab.vercel.app/manga/test.png' })), at(18)), /画像/)
  assert.equal(selectApprovedMetaPosts(manifest(approved('threads', { imageUrl: 'https://bousai-lab.vercel.app/manga/test.jpg', imageSha256: 'a'.repeat(64) })), at(18)).length, 1)
})

test('無効化既定値では送信しない', async () => {
  let calls = 0
  const post = approved()
  const publish = async () => { calls++; return 'id' }
  assert.equal((await runApprovedMetaPosts(manifest(post), at(18), {}, publish)).sentCount, 0)
  assert.equal((await runApprovedMetaPosts(manifest(post), at(18), {
    META_DRY_RUN: 'false', SOCIAL_PUBLISH_ENABLED: 'true',
  }, publish)).sentCount, 0)
  assert.equal(calls, 0)
})
