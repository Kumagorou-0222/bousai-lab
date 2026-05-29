const BASE_URL = 'https://bousai-lab.vercel.app'

export type XRank = 'S' | 'A' | 'B'

export const RANK_WEIGHTS: Record<XRank, number> = {
  S: 5,
  A: 3,
  B: 1,
}

export const RANK_LABELS: Record<XRank, string> = {
  S: 'Sランク',
  A: 'Aランク',
  B: 'Bランク',
}

type PriorityConfig = {
  slug: string
  rank: XRank
  isFixedPage?: true
  fixedUrl?: string
  fixedText?: string
  fixedTitle?: string
}

export const PRIORITY_ARTICLES: PriorityConfig[] = [
  // ── Sランク（weight 5）
  { slug: 'blackout-refrigerator',  rank: 'S' },
  { slug: 'earthquake-toilet',      rank: 'S' },
  { slug: 'earthquake-elevator',    rank: 'S' },
  { slug: 'blackout-smartphone',    rank: 'S' },
  { slug: 'emergency-toilet',       rank: 'S' },
  // ── Aランク（weight 3）
  { slug: 'disaster-backpack',      rank: 'A' },
  { slug: 'mobile-battery',         rank: 'A' },
  { slug: 'evacuation-illness',     rank: 'A' },
  { slug: 'evacuation-items',       rank: 'A' },
  { slug: 'earthquake-bath',        rank: 'A' },
  // ── Bランク（weight 1）
  { slug: 'blackout-toilet',        rank: 'B' },
  { slug: 'earthquake-cooking',     rank: 'B' },
  { slug: 'blackout-water',         rank: 'B' },
  { slug: 'disaster-water',         rank: 'B' },
  { slug: 'emergency-food',         rank: 'B' },
  { slug: 'lantern',                rank: 'B' },
  { slug: 'cassette-stove',         rank: 'B' },
  { slug: 'portable-power-station', rank: 'B' },
  { slug: 'evacuation-shelter-basics', rank: 'B' },
  { slug: 'mansion-disaster-prep',    rank: 'B' },
  { slug: 'family-children-disaster', rank: 'B' },
  { slug: 'family-elderly-disaster',  rank: 'B' },
  { slug: 'evacuation-health-checklist', rank: 'B' },
  {
    slug: 'musashino',
    rank: 'B',
    isFixedPage: true,
    fixedTitle: '武蔵野市の防災',
    fixedUrl: `${BASE_URL}/musashino`,
    fixedText: [
      '【武蔵野市の防災】',
      '',
      '避難所に行く？',
      '在宅避難する？',
      '',
      '状況で選ぶことが大切です。',
      '',
      '保存して確認👇',
      `${BASE_URL}/musashino`,
    ].join('\n'),
  },
]

// =====================================================
// 公開型
// =====================================================

export type XPostCandidate = {
  slug: string
  rank: XRank
  title: string
  url: string
  text: string
  hasManga: boolean
  mangaImages: string[]   // スケジューラー・プレビュー用
  category: string
  xSeries?: string
  hasRegion: boolean
}

// =====================================================
// 投稿文生成（article データを受け取るユーティリティ）
// =====================================================

// CTA パターン（hasManga の有無で使い分け）
const CTA_WITH_MANGA    = '4コマで確認👇'
const CTA_SAVE          = '保存して確認👇'
const CTA_FAMILY        = '家族で共有👇'

export function buildXPostText(params: {
  title: string
  slug: string
  conclusion?: string
  category: string
  reasons?: Array<{ title: string; body?: string } | string>
  xPostNormal?: string
  xPostShort?: string
  hasManga?: boolean
}): string {
  if (params.xPostNormal) return params.xPostNormal
  if (params.xPostShort) return params.xPostShort

  const url     = `${BASE_URL}/articles/${params.slug}`
  const cta     = params.hasManga ? CTA_WITH_MANGA : CTA_SAVE
  const conclusion = params.conclusion ?? params.title

  const lines: string[] = [conclusion, '']

  const reasons = params.reasons ?? []
  if (reasons.length >= 2) {
    const ng = typeof reasons[0] === 'string' ? reasons[0] : reasons[0].title
    const ok = typeof reasons[1] === 'string' ? reasons[1] : reasons[1].title
    lines.push(`❌ ${ng}`, `⭕ ${ok}`, '')
  }

  if (reasons.length >= 3) {
    const r3 = typeof reasons[2] === 'string' ? reasons[2] : reasons[2].title
    lines.push('理由：', r3, '')
  }

  lines.push(cta, url)

  return lines.join('\n')
}

// =====================================================
// ランダム選択（純粋関数 — クライアントでも使用可能）
// =====================================================

export function getRandomXPost(
  candidates: XPostCandidate[],
  recentSlugs: string[] = [],
): XPostCandidate | null {
  let pool = candidates.filter((c) => !recentSlugs.includes(c.slug))
  if (pool.length === 0) pool = [...candidates]

  const weighted: XPostCandidate[] = []
  for (const c of pool) {
    const w = RANK_WEIGHTS[c.rank]
    for (let i = 0; i < w; i++) weighted.push(c)
  }

  if (weighted.length === 0) return null
  return weighted[Math.floor(Math.random() * weighted.length)]
}

// =====================================================
// サーバーサイド用：候補リスト生成ヘルパー
// （page.tsx から呼ばれる想定 — fs を使う関数は別ファイルに置かず、
//   呼び出し元で記事データを渡す設計にする）
// =====================================================

export type ArticleInput = {
  slug: string
  title: string
  category: string
  conclusion?: string
  reasons?: Array<{ title: string; body?: string } | string>
  xPost?: { short: string; normal: string }
  xSeries?: string
  manga?: unknown
  mangaImages?: string[]
  region?: { name: string; content: string }
}

export function buildPriorityCandidates(
  articleMap: Map<string, ArticleInput>,
): XPostCandidate[] {
  return PRIORITY_ARTICLES.map((config) => {
    if (config.isFixedPage) {
      return {
        slug: config.slug,
        rank: config.rank,
        title: config.fixedTitle ?? config.slug,
        url: config.fixedUrl!,
        text: config.fixedText!,
        hasManga: false,
        mangaImages: [],
        category: 'disaster-prep',
        xSeries: undefined,
        hasRegion: config.slug === 'musashino',
      }
    }

    const article = articleMap.get(config.slug)
    if (!article) {
      return {
        slug: config.slug,
        rank: config.rank,
        title: config.slug,
        url: `${BASE_URL}/articles/${config.slug}`,
        text: `${BASE_URL}/articles/${config.slug}\n#防災`,
        hasManga: false,
        mangaImages: [],
        category: 'disaster-prep',
        xSeries: undefined,
        hasRegion: false,
      }
    }

    const images = (article.mangaImages as string[] | undefined) ?? []
    return {
      slug: config.slug,
      rank: config.rank,
      title: article.title,
      url: `${BASE_URL}/articles/${config.slug}`,
      text: buildXPostText({
        title: article.title,
        slug: article.slug,
        conclusion: article.conclusion,
        category: article.category,
        reasons: article.reasons,
        xPostNormal: article.xPost?.normal,
        xPostShort: article.xPost?.short,
        hasManga: !!(article.manga || ((article.mangaImages as string[] | undefined)?.length ?? 0) > 0),
      }),
      hasManga: !!(article.manga || images.length > 0),
      mangaImages: images,
      category: article.category,
      xSeries: article.xSeries,
      hasRegion: !!article.region,
    }
  })
}
