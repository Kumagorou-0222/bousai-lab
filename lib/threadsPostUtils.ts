export type ThreadsRecord = {
  generatedAt: string
  slug: string
  title: string
  xText: string
  threadsText: string
  articleUrl: string
  mangaImageUrl?: string
  postedAt?: string
}

interface ParsedXPost {
  labels: string[]
  title: string
  ngAction: string
  okAction: string
  reason: string
  url: string
  hashtags: string[]
  rawBody: string
}

function parseXPost(xText: string): ParsedXPost {
  let text = xText.trim()

  const labels: string[] = []
  text = text.replace(/【([^】]*)】/g, (_, inner) => {
    labels.push(inner.trim())
    return ' '
  }).replace(/\s{2,}/g, ' ').trim()

  const urlMatch = text.match(/https?:\/\/[^\s]+/)
  const url = urlMatch ? urlMatch[0] : ''
  text = text.replace(/https?:\/\/[^\s]+/g, '').trim()

  const hashtags: string[] = []
  text = text.replace(/#\S+/g, (tag) => {
    hashtags.push(tag)
    return ''
  }).trim()

  text = text.replace(/[保存クリック参照]して確認👇?/g, '').trim()
  text = text.replace(/4コマで確認👇?/g, '').trim()
  text = text.replace(/詳しくは→?/g, '').trim()

  const ngMatch = text.match(/❌\s*([^⭕#\n→]+)/)
  const okMatch = text.match(/⭕\s*([^❌#\n→]+)/)
  const ngAction = ngMatch ? ngMatch[1].trim().replace(/\s*→\s*$/, '') : ''
  const okAction = okMatch ? okMatch[1].trim().replace(/\s*→\s*$/, '') : ''
  text = text.replace(/❌[^⭕#\n→]*/g, '').replace(/⭕[^❌#\n→]*/g, '').trim()

  const reasonMatch = text.match(/理由[:：]\s*([^\n。]+)/)
  const reason = reasonMatch ? reasonMatch[1].trim() : ''
  text = text.replace(/理由[:：][^\n]*/g, '').trim()

  const lines = text.split(/[\n。]/).map(l => l.trim()).filter(Boolean)
  const title = lines[0] ?? ''
  const rawBody = lines.slice(1).join('\n')

  return { labels, title, ngAction, okAction, reason, url, hashtags, rawBody }
}

export function generateThreadsPost(xText: string): string {
  const p = parseXPost(xText)
  const parts: string[] = []

  if (p.ngAction && p.okAction) {
    if (p.title) {
      parts.push(p.title)
      parts.push('')
    }
    parts.push(`ついやってしまうのが\n「${p.ngAction}」です。`)
    parts.push('')
    if (p.reason) {
      parts.push(p.reason + (p.reason.endsWith('。') ? '' : '。'))
      parts.push('')
    } else if (p.rawBody) {
      parts.push(p.rawBody)
      parts.push('')
    }
    parts.push(`正しくは「${p.okAction}」。`)
    parts.push('ちょっとした知識が、いざというときの安心につながります。')
  } else if (p.title) {
    parts.push(p.title)
    if (p.reason) {
      parts.push('')
      parts.push(p.reason + (p.reason.endsWith('。') ? '' : '。'))
    } else if (p.rawBody) {
      parts.push('')
      parts.push(p.rawBody)
    }
    parts.push('')
    parts.push('準備しておくと、いざというときに焦らなくて済みます。')
  }

  if (p.url) {
    parts.push('')
    parts.push(`詳しくはこちら：\n${p.url}`)
  }

  const keptTags = p.hashtags.slice(0, 2).join(' ')
  if (keptTags) {
    parts.push('')
    parts.push(keptTags)
  }

  return parts.join('\n').trim()
}

export function buildThreadsIntentUrl(text: string): string {
  return `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`
}
