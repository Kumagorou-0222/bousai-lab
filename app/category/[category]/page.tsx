import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticlesByCategory, CATEGORY_MAP, type ArticleCategory } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import Breadcrumb from '@/components/Breadcrumb'

const VALID_CATEGORIES = Object.keys(CATEGORY_MAP) as ArticleCategory[]

type Props = { params: Promise<{ category: string }> }

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  if (!VALID_CATEGORIES.includes(category as ArticleCategory)) return {}
  const cat = CATEGORY_MAP[category as ArticleCategory]
  return {
    title: `${cat.label}の記事一覧`,
    description: cat.description,
    alternates: { canonical: `https://bousai-lab.vercel.app/category/${category}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  if (!VALID_CATEGORIES.includes(category as ArticleCategory)) notFound()

  const cat = CATEGORY_MAP[category as ArticleCategory]
  const articles = getArticlesByCategory(category as ArticleCategory)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 80px' }}>
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: cat.label },
      ]} />

      <div style={{ textAlign: 'center', padding: '40px 0 48px' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{cat.emoji}</div>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: '#1A1A1A', fontFamily: 'Kaisei Decol, serif', marginBottom: 12 }}>
          {cat.label}
        </h1>
        <p style={{ color: '#666', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>{cat.description}</p>
      </div>

      {articles.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>記事を準備中です。</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
