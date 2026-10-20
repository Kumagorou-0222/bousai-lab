import { createHash } from 'node:crypto'
import { campaignUrl } from './socialCampaign.ts'

export type ApprovedMetaPost = {
  channel: 'threads' | 'instagram'
  dateJst: string
  slug: string
  campaign: string
  text: string
  imageUrl?: string
  approved: true
  approvedAt: string
  expiresAt: string
  contentSha256: string
}

const idPattern = /^[a-z0-9-]+$/
const timestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/

function jstDate(date: Date) {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export function approvedContentSha256(post: Pick<ApprovedMetaPost,
  'channel' | 'dateJst' | 'slug' | 'campaign' | 'text' | 'imageUrl' | 'expiresAt'>) {
  return createHash('sha256').update(JSON.stringify({
    channel: post.channel, dateJst: post.dateJst, slug: post.slug,
    campaign: post.campaign, text: post.text, imageUrl: post.imageUrl ?? null,
    expiresAt: post.expiresAt,
  })).digest('hex')
}

function validTimestamp(value: unknown): value is string {
  return typeof value === 'string' && timestampPattern.test(value) && Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().replace('.000Z', 'Z') === value
}

export function selectApprovedMetaPosts(raw: unknown, now = new Date()): ApprovedMetaPost[] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Meta承認台帳の形式が不正です')
  const manifest = raw as { version?: unknown; posts?: unknown }
  if (manifest.version !== 1 || !Array.isArray(manifest.posts) || manifest.posts.length > 2) {
    throw new Error('Meta承認台帳の件数または版が不正です')
  }
  const seen = new Set<string>()
  const posts = manifest.posts.map((value): ApprovedMetaPost => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Meta承認済み投稿の形式が不正です')
    const post = value as ApprovedMetaPost
    if (!['threads', 'instagram'].includes(post.channel) || !idPattern.test(post.slug) ||
        !idPattern.test(post.campaign) || post.approved !== true ||
        !/^\d{4}-\d{2}-\d{2}$/.test(post.dateJst) ||
        typeof post.text !== 'string' || !post.text.trim() ||
        post.text.length > (post.channel === 'threads' ? 500 : 2200) ||
        !validTimestamp(post.approvedAt) || !validTimestamp(post.expiresAt) ||
        jstDate(new Date(post.expiresAt)) !== post.dateJst ||
        Date.parse(post.approvedAt) >= Date.parse(post.expiresAt) ||
        post.contentSha256 !== approvedContentSha256(post)) {
      throw new Error('Meta承認済み投稿の内容またはハッシュが不正です')
    }
    if (post.channel === 'instagram') {
      let validImage = false
      try {
        const image = typeof post.imageUrl === 'string' ? new URL(post.imageUrl) : null
        validImage = Boolean(image && image.origin === 'https://bousai-lab.vercel.app' &&
          /\.(?:png|jpe?g|webp)$/i.test(image.pathname))
      } catch { /* URL不正 */ }
      if (!validImage) throw new Error('Instagramの承認画像URLが不正です')
    } else if (post.imageUrl) {
      throw new Error('Threadsのテキスト投稿に画像URLは指定できません')
    } else if (!post.text.includes(campaignUrl(post.slug, 'threads', post.campaign))) {
      throw new Error('Threadsの承認文に記事への計測リンクがありません')
    }
    const key = `${post.channel}:${post.dateJst}`
    if (seen.has(key)) throw new Error('同じ媒体・日付の承認投稿が重複しています')
    seen.add(key)
    return post
  })
  if (!Number.isFinite(now.getTime())) throw new Error('現在時刻が不正です')
  const jstHour = (now.getUTCHours() + 9) % 24
  if (jstHour < 20 || jstHour >= 22) return []
  return posts.filter((post) => post.dateJst === jstDate(now) &&
    Date.parse(post.approvedAt) <= now.getTime() && now.getTime() < Date.parse(post.expiresAt))
}
