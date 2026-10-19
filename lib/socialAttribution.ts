export type SocialAttribution = { source: 'x' | 'threads' | 'instagram'; campaign: string; content?: string }

export function readSocialAttribution(search: string): SocialAttribution | null {
  const params = new URLSearchParams(search)
  const source = params.get('utm_source')
  const campaign = params.get('utm_campaign')
  const content = params.get('utm_content')
  if (!['x', 'threads', 'instagram'].includes(source ?? '') || !campaign || !/^[a-z0-9-]{1,64}$/.test(campaign)) return null
  if (content && !/^[a-z0-9-]{1,64}$/.test(content)) return null
  return { source: source as SocialAttribution['source'], campaign, ...(content ? { content } : {}) }
}
