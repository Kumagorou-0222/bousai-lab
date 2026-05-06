import type { ArticleMeta } from './articles'

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
  ngAction?: string
  correctAction?: string
  reason?: string
}

export function generateXPost(params: XPostParams): { short: string; normal: string } {
  const { title, slug, conclusion, category, ngAction, correctAction, reason } = params
  const url = `${BASE_URL}/articles/${slug}`
  const hashtags = CATEGORY_HASHTAGS[category] ?? '#防災'

  // 短縮版（140字以内）
  const shortTitle = title.length > 15 ? title.slice(0, 14) + '…' : title
  const shortConclusion = conclusion.length > 45 ? conclusion.slice(0, 42) + '…' : conclusion
  const short = [
    `【${shortTitle}】`,
    ``,
    shortConclusion,
    ``,
    `👉 ${url}`,
    hashtags,
  ]
    .join('\n')
    .slice(0, 140)

  // 通常版
  const lines: string[] = []
  const summary = title.length > 20 ? title.slice(0, 19) + '…' : title
  lines.push(`【${summary}】`)
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

export function buildXPostFromArticle(article: ArticleMeta & { xPost?: { short: string; normal: string } }): { short: string; normal: string } {
  if (article.xPost) return article.xPost
  return generateXPost({
    title: article.title,
    slug: article.slug,
    conclusion: article.conclusion ?? article.description,
    category: article.category,
  })
}

// 全記事のX投稿文を一括取得（X投稿スケジュール管理用）
export function getAllXPosts(): Array<{ slug: string; title: string; category: string; short: string; normal: string }> {
  // 動的importを避けるため、実行時に articles を参照
  const { getAllArticlesMeta } = require('./articles') as typeof import('./articles')
  return getAllArticlesMeta().map((article) => {
    const xPost = buildXPostFromArticle(article)
    return {
      slug: article.slug,
      title: article.title,
      category: article.category,
      short: xPost.short,
      normal: xPost.normal,
    }
  })
}
