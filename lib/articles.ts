import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ArticleCategory } from './categories'
export type { ArticleCategory }
export { CATEGORY_MAP } from './categories'

// =====================================================
// 型定義
// =====================================================

export type FaqItem = {
  question: string
  answer: string
}

export type ArticleFrontmatter = {
  title: string
  description: string
  category: ArticleCategory
  date: string
  emoji: string
  faqs: FaqItem[]
  relatedSlugs?: string[]
}

export type Article = ArticleFrontmatter & {
  slug: string
  content: string
}

export type ArticleMeta = Omit<Article, 'content'>

// =====================================================
// ファイル読み込みロジック
// =====================================================

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

export function getAllSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getArticleBySlug(slug: string): Article {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title ?? '',
    description: data.description ?? '',
    category: data.category ?? 'disaster-prep',
    date: data.date ?? '',
    emoji: data.emoji ?? '📄',
    faqs: data.faqs ?? [],
    relatedSlugs: data.relatedSlugs,
    content,
  }
}

export function getAllArticlesMeta(): ArticleMeta[] {
  return getAllSlugs()
    .map((slug) => {
      const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(raw)
      return {
        slug,
        title: data.title ?? '',
        description: data.description ?? '',
        category: (data.category ?? 'disaster-prep') as ArticleCategory,
        date: data.date ?? '',
        emoji: data.emoji ?? '📄',
        faqs: data.faqs ?? [],
        relatedSlugs: data.relatedSlugs,
      } satisfies ArticleMeta
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getArticlesByCategory(category: ArticleCategory): ArticleMeta[] {
  return getAllArticlesMeta().filter((a) => a.category === category)
}

export function getRelatedArticles(article: Article, maxCount = 5): ArticleMeta[] {
  const all = getAllArticlesMeta()
  if (article.relatedSlugs && article.relatedSlugs.length > 0) {
    return article.relatedSlugs
      .map((s) => all.find((a) => a.slug === s))
      .filter((a): a is ArticleMeta => a !== undefined)
      .slice(0, maxCount)
  }
  return all
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, maxCount)
}
