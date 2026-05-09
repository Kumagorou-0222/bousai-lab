export type Series = {
  id: string
  label: string
  emoji: string
  articles: string[]
}

export const SERIES_LIST: Series[] = [
  {
    id: 'blackout',
    label: '停電シリーズ',
    emoji: '🔦',
    articles: [
      'blackout-what-to-do',
      'blackout-refrigerator',
      'blackout-toilet',
      'blackout-smartphone',
      'blackout-night',
    ],
  },
  {
    id: 'earthquake',
    label: '地震シリーズ',
    emoji: '🏠',
    articles: [
      'earthquake-now',
      'earthquake-elevator',
      'earthquake-toilet',
      'earthquake-cooking',
      'earthquake-bath',
    ],
  },
  {
    id: 'evacuation',
    label: '避難シリーズ',
    emoji: '🏃',
    articles: [
      'evacuation-items',
      'evacuation-illness',
      'evacuation-bag',
      'evacuation-shelter-basic',
    ],
  },
]

export function getSeriesForArticle(slug: string): { series: Series; index: number } | null {
  for (const series of SERIES_LIST) {
    const index = series.articles.indexOf(slug)
    if (index !== -1) return { series, index }
  }
  return null
}
