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

export type MangaEmotion =
  | 'worried'
  | 'surprised'
  | 'serious'
  | 'normal'
  | 'relieved'
  | 'happy'
  | 'scared'

export type MangaPanel = {
  character: 'riss' | 'robot'
  emotion: MangaEmotion
  message: string
}

export type ArticleManga = {
  panels: MangaPanel[]
}

export type ReasonItem = {
  title: string
  body: string
  emoji?: string
}

export type XPost = {
  short: string
  normal: string
}

export type MonetizeItem = {
  label: string
  href: string
  emoji: string
  description?: string
}

export type RegionBlock = {
  name: string
  content: string
}

export type ArticleFrontmatter = {
  title: string
  description: string
  category: ArticleCategory
  date: string
  updatedDate?: string
  emoji: string
  faqs: FaqItem[]
  relatedSlugs?: string[]
  conclusion?: string
  manga?: ArticleManga
  mangaImages?: string[]
  mangaSlug?: string
  reasons?: ReasonItem[]
  xPost?: XPost
  monetizeItems?: MonetizeItem[]
  region?: RegionBlock
}

// =====================================================
// 製品名→MonetizeItem マップ
// =====================================================

const PRODUCT_MAP: Record<string, MonetizeItem> = {
  '保冷バッグ':         { emoji: '🧊', label: '保冷バッグを準備する',         href: '/best-disaster-items', description: '停電時に冷蔵庫の食品を守る' },
  '保冷剤':            { emoji: '🧊', label: '保冷剤をストックする',          href: '/best-disaster-items', description: '冷凍庫に常備しておくと安心' },
  'ポータブル電源':     { emoji: '⚡', label: 'ポータブル電源を見る',          href: '/best-disaster-items', description: '長期停電に備えるならこれ' },
  'モバイルバッテリー': { emoji: '🔋', label: 'モバイルバッテリーを準備する', href: '/best-disaster-items', description: '20,000mAh以上が防災の基準' },
  '非常食':            { emoji: '🍱', label: '非常食を揃える',               href: '/best-disaster-items', description: 'アルファ米・缶詰・7日分以上' },
  '携帯トイレ':         { emoji: '🚽', label: '携帯トイレを揃える',           href: '/best-disaster-items', description: '50回分以上を事前に準備' },
  'ランタン':          { emoji: '🔦', label: 'LEDランタンを準備する',         href: '/best-disaster-items', description: '乾電池式・200lm以上が目安' },
  '懐中電灯':          { emoji: '🔦', label: '懐中電灯を準備する',            href: '/best-disaster-items', description: '防水・長寿命LEDタイプを選ぼう' },
  'カセットコンロ':     { emoji: '🔥', label: 'カセットコンロを確認する',      href: '/best-disaster-items', description: 'ボンベ12本以上とセットで' },
  '水':               { emoji: '💧', label: '保存水を備蓄する',              href: '/best-disaster-items', description: '1人1日2〜3L×7日分が目安' },
  '防災リュック':       { emoji: '🎒', label: '防災リュックを確認する',        href: '/best-disaster-items', description: '医師監修の中身リストあり' },
  'チェックリスト':     { emoji: '📋', label: '防災チェックリストを確認する',  href: '/checklist',           description: '何が足りていないか今すぐ確認' },
}

// =====================================================
// 正規化ヘルパー
// =====================================================

function normalizeReasons(raw: unknown): ReasonItem[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined
  return raw.map((r) => {
    if (typeof r === 'string') return { title: r, body: '' }
    return r as ReasonItem
  })
}

function normalizeMonetizeItems(raw: unknown): MonetizeItem[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined
  return raw.map((item) => {
    if (typeof item === 'string') {
      return (
        PRODUCT_MAP[item] ?? {
          emoji: '🛒',
          label: item,
          href: '/best-disaster-items',
          description: undefined,
        }
      )
    }
    return item as MonetizeItem
  })
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
    updatedDate: data.updatedDate,
    emoji: data.emoji ?? '📄',
    faqs: data.faqs ?? [],
    relatedSlugs: data.relatedSlugs,
    conclusion: data.conclusion,
    manga: data.manga,
    mangaImages: data.mangaImages,
    mangaSlug: data.mangaSlug,
    reasons: normalizeReasons(data.reasons),
    xPost: data.xPost,
    monetizeItems: normalizeMonetizeItems(data.monetizeItems),
    region: data.region,
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
        updatedDate: data.updatedDate,
        emoji: data.emoji ?? '📄',
        faqs: data.faqs ?? [],
        relatedSlugs: data.relatedSlugs,
        conclusion: data.conclusion,
        manga: data.manga,
        mangaImages: data.mangaImages,
        mangaSlug: data.mangaSlug,
        reasons: normalizeReasons(data.reasons),
        xPost: data.xPost,
        monetizeItems: normalizeMonetizeItems(data.monetizeItems),
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
