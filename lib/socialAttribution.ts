export type SocialAttribution = { source: 'x' | 'threads' | 'instagram'; campaign: string; content?: string }

const CAMPAIGNS = new Set(['article', 'profile'])
const CONTENTS = new Set(['panel-1', 'panel-2', 'panel-3', 'panel-4'])

export function readSocialAttribution(search: string): SocialAttribution | null {
  const params = new URLSearchParams(search)
  const source = params.get('utm_source')
  const medium = params.get('utm_medium')
  const campaign = params.get('utm_campaign')
  const content = params.get('utm_content')
  if (!['x', 'threads', 'instagram'].includes(source ?? '') || (medium && medium !== 'social') || !campaign || !CAMPAIGNS.has(campaign)) return null
  if (content && !CONTENTS.has(content)) return null
  return { source: source as SocialAttribution['source'], campaign, ...(content ? { content } : {}) }
}
