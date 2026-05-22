/**
 * アフィリエイト設定
 *
 * 環境変数:
 *   NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG  … Amazonアソシエイトタグ (例: bousailab0c-22)
 *   NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID  … 楽天アフィリエイトID (例: 1400711)
 *
 * 楽天リンクは、楽天アフィリエイトポータルで生成した完全URLを
 * products.ts の rakutenUrl フィールドに直接貼ってください。
 * NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID が設定されている場合、
 * 通常の search.rakuten.co.jp URLを自動的にアフィリエイトURLへ変換します。
 */

export const affiliateConfig = {
  amazonTag: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? '',
  rakutenAffiliateId: process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? '',
}

/**
 * AmazonのURLにtag=を付与して返す。
 * - URLにすでにtag=があればそのまま返す
 * - 環境変数未設定のときは元のURLをそのまま返す
 * - undefinedのときはundefinedを返す（準備中扱い）
 */
export function buildAmazonUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  const tag = affiliateConfig.amazonTag
  if (!tag) return url
  try {
    const u = new URL(url)
    if (!u.searchParams.get('tag')) u.searchParams.set('tag', tag)
    return u.toString()
  } catch {
    return url
  }
}

/**
 * 楽天URLをアフィリエイトURL形式に変換して返す。
 * - すでに hb.afl.rakuten.co.jp のURLならそのまま返す（ポータル生成済みURL）
 * - NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID が設定されていれば自動変換
 * - undefinedのときはundefinedを返す（準備中扱い）
 */
export function buildRakutenUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  if (url.includes('hb.afl.rakuten.co.jp')) return url
  const id = affiliateConfig.rakutenAffiliateId
  if (!id) return url
  return `https://hb.afl.rakuten.co.jp/hgc/${id}/?pc=${encodeURIComponent(url)}`
}

/**
 * AmazonURLのタグ状態を返す（監査用）
 */
export function getAmazonTagStatus(url: string | undefined): {
  tag: string | null
  source: 'url' | 'env' | null
} {
  if (!url) return { tag: null, source: null }
  try {
    const tagInUrl = new URL(url).searchParams.get('tag')
    if (tagInUrl) return { tag: tagInUrl, source: 'url' }
  } catch { /* ignore */ }
  const envTag = affiliateConfig.amazonTag
  if (envTag) return { tag: envTag, source: 'env' }
  return { tag: null, source: null }
}

/**
 * 楽天URLのアフィリエイトID状態を返す（監査用）
 * TagStatus と共通形式: { tag, source } の tag にアフィリエイトIDが入る
 */
export function getRakutenAffStatus(url: string | undefined): {
  tag: string | null
  source: 'url' | 'env' | null
} {
  if (!url) return { tag: null, source: null }
  // hb.afl.rakuten.co.jp/hgc/{ID}/ 形式から抽出
  const matchPath = url.match(/hb\.afl\.rakuten\.co\.jp\/hgc\/([^/?]+)/)
  if (matchPath) return { tag: matchPath[1], source: 'url' }
  // クエリパラメータ形式
  try {
    const u = new URL(url)
    const paramId = u.searchParams.get('a_id') ?? u.searchParams.get('af_id') ?? u.searchParams.get('rmid') ?? u.searchParams.get('aff_id')
    if (paramId) return { tag: paramId, source: 'url' }
  } catch { /* ignore */ }
  const envId = affiliateConfig.rakutenAffiliateId
  if (envId) return { tag: envId, source: 'env' }
  return { tag: null, source: null }
}
