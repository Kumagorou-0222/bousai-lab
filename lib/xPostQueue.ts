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
  { slug: 'earthquake-elevator',    rank: 'S' },
  { slug: 'blackout-refrigerator',  rank: 'S' },
  { slug: 'earthquake-toilet',      rank: 'S' },
  { slug: 'evacuation-illness',     rank: 'S' },
  // ── Aランク（weight 3）
  { slug: 'blackout-toilet',        rank: 'A' },
  { slug: 'disaster-backpack',      rank: 'A' },
  { slug: 'emergency-toilet',       rank: 'A' },
  { slug: 'mobile-battery',         rank: 'A' },
  { slug: 'evacuation-items',       rank: 'A' },
  { slug: 'earthquake-bath',        rank: 'A' },
  { slug: 'earthquake-cooking',     rank: 'A' },
  { slug: 'blackout-smartphone',    rank: 'A' },
  // ── Bランク（weight 1）
  { slug: 'blackout-water',             rank: 'B' },
  { slug: 'disaster-water',             rank: 'B' },
  { slug: 'emergency-food',             rank: 'B' },
  { slug: 'lantern',                    rank: 'B' },
  { slug: 'cassette-stove',             rank: 'B' },
  { slug: 'portable-power-station',     rank: 'B' },
  { slug: 'evacuation-shelter-basics',  rank: 'B' },
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
      '詳しく👇',
      `${BASE_URL}/musashino`,
      '',
      '#武蔵野市 #防災',
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
}

// =====================================================
// 投稿文生成（article データを受け取るユーティリティ）
// =====================================================

const CATEGORY_HASHTAGS: Record<string, string> = {
  earthquake:    '#防災 #地震',
  blackout:      '#防災 #停電',
  evacuation:    '#防災 #避難所',
  'disaster-prep': '#防災 #備蓄',
  typhoon:       '#防災 #台風',
}

export function buildXPostText(params: {
  title: string
  slug: string
  conclusion?: string
  category: string
  reasons?: Array<{ title: string; body?: string } | string>
  xPostNormal?: string
  xPostShort?: string
}): string {
  if (params.xPostNormal) return params.xPostNormal
  if (params.xPostShort) return params.xPostShort

  const url = `${BASE_URL}/articles/${params.slug}`
  const hashtags = CATEGORY_HASHTAGS[params.category] ?? '#防災'
  const conclusion = params.conclusion ?? ''

  const lines: string[] = [
    `【${params.title}】`,
    '',
    '結論：',
    conclusion,
  ]

  if (params.reasons && params.reasons.length > 0) {
    lines.push('')
    lines.push('理由：')
    params.reasons.slice(0, 2).forEach((r) => {
      const text = typeof r === 'string' ? r : r.title
      lines.push(`・${text}`)
    })
  }

  lines.push('', '詳しく👇', url, '', hashtags)

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
  manga?: unknown
  mangaImages?: string[]
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
      }),
      hasManga: !!(article.manga || images.length > 0),
      mangaImages: images,
    }
  })
}
