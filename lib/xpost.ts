import type { ArticleMeta, XSeriesLabel, CarouselData } from './articles'

const BASE_URL = 'https://bousai-lab.vercel.app'

const UNIFIED_HASHTAGS = '#防災 #地震 #停電 #避難'

const CATEGORY_HASHTAGS: Record<string, string> = {
  earthquake: UNIFIED_HASHTAGS,
  typhoon: UNIFIED_HASHTAGS,
  blackout: UNIFIED_HASHTAGS,
  evacuation: UNIFIED_HASHTAGS,
  'disaster-prep': UNIFIED_HASHTAGS,
}

export type XPostParams = {
  title: string
  slug: string
  conclusion: string
  category: string
  xSeries?: XSeriesLabel
  ngAction?: string
  correctAction?: string
  reason?: string
}

export function generateXPost(params: XPostParams): { short: string; normal: string } {
  const { title, slug, conclusion, category, xSeries, ngAction, correctAction, reason } = params
  const url = `${BASE_URL}/articles/${slug}`
  const hashtags = CATEGORY_HASHTAGS[category] ?? '#防災'
  const seriesPrefix = xSeries ? `【${xSeries}】` : ''

  // 短縮版（140字以内）
  const shortTitle = title.length > 15 ? title.slice(0, 14) + '…' : title
  const shortConclusion = conclusion.length > 45 ? conclusion.slice(0, 42) + '…' : conclusion
  const short = [
    `${seriesPrefix}【${shortTitle}】`,
    ``,
    shortConclusion,
    ``,
    `👉 ${url}`,
    hashtags,
  ]
    .join('\n')
    .slice(0, 280)

  // 通常版
  const lines: string[] = []
  const summary = title.length > 20 ? title.slice(0, 19) + '…' : title
  lines.push(`${seriesPrefix}【${summary}】`)
  lines.push(``)
  if (ngAction && correctAction) {
    lines.push(`❌ ${ngAction}`)
    lines.push(`⭕ ${correctAction}`)
    if (reason) {
      lines.push(``)
      lines.push(`理由：`)
      lines.push(reason.length > 50 ? reason.slice(0, 47) + '…' : reason)
    }
  } else {
    lines.push(conclusion.length > 80 ? conclusion.slice(0, 77) + '…' : conclusion)
  }
  lines.push(``)
  lines.push(`👉 ${url}`)
  lines.push(``)
  lines.push(hashtags)

  const normal = lines.join('\n').slice(0, 280)

  return { short, normal }
}

// カルーセル投稿（5スライド分のテキストを生成）
export function generateCarouselPosts(params: {
  title: string
  slug: string
  conclusion: string
  carousel: CarouselData
}): string[] {
  const { title, slug, conclusion, carousel } = params
  const url = `${BASE_URL}/articles/${slug}`
  const slides: string[] = []

  // スライド1: 結論
  slides.push([
    `【${title.length > 18 ? title.slice(0, 17) + '…' : title}】`,
    ``,
    `📌 結論`,
    conclusion,
    ``,
    `🧵 続きを見る↓（全5枚）`,
  ].join('\n'))

  // スライド2〜4: 理由
  const reasons = carousel.reasons.slice(0, 3)
  reasons.forEach((reason, i) => {
    slides.push([
      `理由${i + 1}/${reasons.length}`,
      ``,
      reason,
      ``,
      `${i + 2}/5`,
    ].join('\n'))
  })
  // 理由が3つ未満でも5枚になるよう調整（不足分はスキップ）

  // スライド5: チェックリスト
  const checks = carousel.checklist.slice(0, 5).map((c) => `✅ ${c}`)
  slides.push([
    `📋 今すぐ確認チェックリスト`,
    ``,
    ...checks,
    ``,
    `💾 保存して使ってね！`,
    `👉 ${url}`,
    `#防災 #地震 #停電`,
  ].join('\n'))

  return slides
}

export function buildXPostFromArticle(article: ArticleMeta): { short: string; normal: string } {
  if (article.xPost) return article.xPost
  return generateXPost({
    title: article.title,
    slug: article.slug,
    conclusion: article.conclusion ?? article.description,
    category: article.category,
    xSeries: article.xSeries,
  })
}

export type XPostListItem = {
  slug: string
  title: string
  category: string
  short: string
  normal: string
  xSeries?: XSeriesLabel
  carouselSlides?: string[]
}

// 全記事のX投稿文を一括取得（X投稿スケジュール管理用）
export function getAllXPosts(): XPostListItem[] {
  const { getAllArticlesMeta } = require('./articles') as typeof import('./articles')
  return getAllArticlesMeta().map((article) => {
    const xPost = buildXPostFromArticle(article)
    const carouselSlides =
      article.carousel && article.conclusion
        ? generateCarouselPosts({
            title: article.title,
            slug: article.slug,
            conclusion: article.conclusion,
            carousel: article.carousel,
          })
        : undefined
    return {
      slug: article.slug,
      title: article.title,
      category: article.category,
      short: xPost.short,
      normal: xPost.normal,
      xSeries: article.xSeries,
      carouselSlides,
    }
  })
}
