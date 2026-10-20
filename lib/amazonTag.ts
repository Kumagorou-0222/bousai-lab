const STOPPED_TAG = 'bousailab0c-22'

export function activeAmazonTag(
  value = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG,
  usable = process.env.NEXT_PUBLIC_AMAZON_TAG_USABLE === 'true',
): string | null {
  const tag = value?.trim()
  return usable && tag && tag !== STOPPED_TAG && /^[a-zA-Z0-9-]{4,64}$/.test(tag) ? tag : null
}

export function sanitizeAmazonUrl(raw: string, tag = activeAmazonTag()): string {
  try {
    const url = new URL(raw)
    if (url.hostname !== 'www.amazon.co.jp' && url.hostname !== 'amazon.co.jp') return raw
    url.searchParams.delete('tag')
    if (tag) url.searchParams.set('tag', tag)
    return url.toString()
  } catch {
    return raw
  }
}
