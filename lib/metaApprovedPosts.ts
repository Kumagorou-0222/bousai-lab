import { createHash } from 'node:crypto'

export type ApprovedMetaPost = {
  channel: 'threads' | 'instagram'
  dateJst: string
  slug: string
  campaign: string
  text: string
  imageUrl?: string
  imageSha256?: string
  accountId: string
  classification: 'noncommercial-education' | 'commercial'
  reviewedBy: string
  reviewedAt: string
  approved: true
  approvedAt: string
  expiresAt: string
  contentSha256: string
}

const idPattern = /^[a-z0-9-]+$/
const timestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/

export function jstDate(date: Date) {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export function inMetaWindow(date: Date) {
  const hour = (date.getUTCHours() + 9) % 24
  return hour >= 18 && hour < 22
}

export function approvedContentSha256(post: Pick<ApprovedMetaPost,
  'channel' | 'dateJst' | 'slug' | 'campaign' | 'text' | 'imageUrl' | 'imageSha256' |
  'accountId' | 'classification' | 'reviewedBy' | 'reviewedAt' | 'expiresAt'>) {
  return createHash('sha256').update(JSON.stringify({
    channel: post.channel, dateJst: post.dateJst, slug: post.slug,
    campaign: post.campaign, text: post.text, imageUrl: post.imageUrl ?? null,
    imageSha256: post.imageSha256 ?? null, accountId: post.accountId,
    classification: post.classification, reviewedBy: post.reviewedBy,
    reviewedAt: post.reviewedAt, expiresAt: post.expiresAt,
  })).digest('hex')
}

function validTimestamp(value: unknown): value is string {
  return typeof value === 'string' && timestampPattern.test(value) && Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().replace('.000Z', 'Z') === value
}

function validImageUrl(value: unknown) {
  try {
    const image = typeof value === 'string' ? new URL(value) : null
    return Boolean(image && image.origin === 'https://bousai-lab.vercel.app' &&
      /\.jpe?g$/i.test(image.pathname) && !image.search && !image.hash)
  } catch { return false }
}

export function selectApprovedMetaPosts(raw: unknown, now = new Date()): ApprovedMetaPost[] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Meta承認台帳の形式が不正です')
  const manifest = raw as { version?: unknown; posts?: unknown }
  if (manifest.version !== 2 || !Array.isArray(manifest.posts) || manifest.posts.length > 2) {
    throw new Error('Meta承認台帳の件数または版が不正です')
  }
  const seen = new Set<string>()
  const posts = manifest.posts.map((value): ApprovedMetaPost => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Meta承認投稿の形式が不正です')
    const post = value as ApprovedMetaPost
    if (!['threads', 'instagram'].includes(post.channel) || !idPattern.test(post.slug) ||
        !idPattern.test(post.campaign) || post.approved !== true ||
        !/^\d{4}-\d{2}-\d{2}$/.test(post.dateJst) ||
        typeof post.text !== 'string' || !post.text.trim() ||
        post.text.length > (post.channel === 'threads' ? 500 : 2200) ||
        !/^\d+$/.test(post.accountId) || !idPattern.test(post.reviewedBy) ||
        !validTimestamp(post.reviewedAt) || !validTimestamp(post.approvedAt) ||
        !validTimestamp(post.expiresAt) ||
        Date.parse(post.reviewedAt) > Date.parse(post.approvedAt) ||
        Date.parse(post.approvedAt) >= Date.parse(post.expiresAt) ||
        jstDate(new Date(post.expiresAt)) !== post.dateJst ||
        !['noncommercial-education', 'commercial'].includes(post.classification) ||
        post.contentSha256 !== approvedContentSha256(post)) {
      throw new Error('Meta承認投稿の内容またはハッシュが不正です')
    }
    if (post.classification !== 'noncommercial-education' ||
        /https?:\/\/|(?:amazon|a8\.net|affiliate)/i.test(post.text)) {
      throw new Error('Metaの商業投稿は広告ラベル対応を確認するまで禁止です')
    }
    if (post.channel === 'instagram' && !post.imageUrl) throw new Error('InstagramのJPEG画像が必要です')
    if (post.imageUrl && !validImageUrl(post.imageUrl)) throw new Error('Metaの承認画像URLが不正です')
    if (post.imageUrl ? !/^[a-f0-9]{64}$/.test(post.imageSha256 ?? '') : post.imageSha256 !== undefined) {
      throw new Error('Metaの画像ハッシュが不正です')
    }
    const key = `${post.channel}:${post.dateJst}`
    if (seen.has(key)) throw new Error('同じ媒体・日付の承認投稿が重複しています')
    seen.add(key)
    return post
  })
  if (!Number.isFinite(now.getTime())) throw new Error('現在時刻が不正です')
  if (!inMetaWindow(now)) return []
  return posts.filter((post) => post.dateJst === jstDate(now) &&
    Date.parse(post.approvedAt) <= now.getTime() && now.getTime() < Date.parse(post.expiresAt))
}
