import twitterText from 'twitter-text'

export type SocialChannel = 'x' | 'threads' | 'instagram'
export const SITE_URL = 'https://bousai-lab.vercel.app'

export function campaignUrl(slug: string, channel: SocialChannel, campaign = 'article') {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('記事IDが不正です')
  if (!['article', 'profile'].includes(campaign)) throw new Error('キャンペーンIDが不正です')
  const url = new URL(`/articles/${slug}`, SITE_URL)
  url.searchParams.set('utm_source', channel)
  url.searchParams.set('utm_medium', 'social')
  url.searchParams.set('utm_campaign', campaign)
  return url.toString()
}

export function socialDrafts(article: { slug: string; title: string; description: string }, campaign = 'article') {
  const lead = article.description.replace(/\s+/g, ' ').trim().slice(0, 130)
  const xUrl = campaignUrl(article.slug, 'x', campaign)
  const threadsUrl = campaignUrl(article.slug, 'threads', campaign)
  let title = article.title.trim()
  let xLead = lead
  while (xLead && !twitterText.parseTweet(`${title}\n${xLead}\n${xUrl}`).valid) {
    xLead = Array.from(xLead).slice(0, -1).join('')
  }
  while (!twitterText.parseTweet(`${title}\n${xLead ? `${xLead}\n` : ''}${xUrl}`).valid && title) {
    title = Array.from(title).slice(0, -1).join('')
  }
  if (!title) throw new Error('X投稿案を文字数内に収められません')
  return {
    x: `${title}\n${xLead ? `${xLead}\n` : ''}${xUrl}`,
    threads: `${article.title}\n\n${lead}\n\n詳しい備えと、必要なものの選び方はこちら。\n${threadsUrl}`,
    instagram: `${article.title}\n\n${lead}\n\n詳しい備えと、必要なものの選び方はプロフィールのリンクから「${article.title}」へ。\n#防災 #備え`,
    instagramProfileUrl: `${SITE_URL}/from/instagram`,
  }
}
