import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticlesByCategory, CATEGORY_MAP, type ArticleCategory } from '@/lib/articles'
import { MAIN_CATEGORIES, CATEGORY_URGENT_ACTIONS } from '@/lib/categories'
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
    title: `${cat.label}【今すぐやること】`,
    description: `${cat.label}のとき今すぐやること。${cat.description}`,
    alternates: { canonical: `https://bousai-lab.vercel.app/category/${category}` },
    openGraph: {
      title: `${cat.label}【今すぐやること】`,
      description: cat.description,
    },
  }
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; accent: string; urgentBg: string }> = {
  earthquake: { bg: '#FFF8F0', border: '#FF6B00', accent: '#FF6B00', urgentBg: 'linear-gradient(135deg, #FF6B00, #FF9500)' },
  typhoon: { bg: '#F0F4FF', border: '#4A6FFF', accent: '#4A6FFF', urgentBg: 'linear-gradient(135deg, #4A6FFF, #6A8FFF)' },
  blackout: { bg: '#FFFBF0', border: '#F5A623', accent: '#F5A623', urgentBg: 'linear-gradient(135deg, #F5A623, #FFD000)' },
  evacuation: { bg: '#F0FFF4', border: '#27AE60', accent: '#27AE60', urgentBg: 'linear-gradient(135deg, #27AE60, #2ECC71)' },
  'disaster-prep': { bg: '#F8F8F8', border: '#888', accent: '#666', urgentBg: 'linear-gradient(135deg, #666, #888)' },
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  if (!VALID_CATEGORIES.includes(category as ArticleCategory)) notFound()

  const cat = CATEGORY_MAP[category as ArticleCategory]
  const articles = getArticlesByCategory(category as ArticleCategory)
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['disaster-prep']
  const urgentActions = MAIN_CATEGORIES.includes(category as (typeof MAIN_CATEGORIES)[number])
    ? CATEGORY_URGENT_ACTIONS[category as (typeof MAIN_CATEGORIES)[number]]
    : null

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.label}の行動ガイド一覧`,
    description: cat.description,
    url: `https://bousai-lab.vercel.app/category/${category}`,
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://bousai-lab.vercel.app/articles/${a.slug}`,
      name: a.title,
    })),
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 80px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: cat.label },
      ]} />

      {/* カテゴリヘッダー */}
      <div style={{ textAlign: 'center', padding: '28px 0 24px' }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{cat.emoji}</div>
        <h1 style={{
          fontSize: 'clamp(20px, 5vw, 30px)', fontWeight: 900, color: '#1A1A1A',
          fontFamily: 'Kaisei Decol, serif', marginBottom: 8,
        }}>
          {cat.label}
        </h1>
        <p style={{ color: '#666', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>{cat.description}</p>
      </div>

      {/* 今すぐやること3つ（最上部に大きく） */}
      {urgentActions && (
        <section style={{
          background: colors.urgentBg, borderRadius: 20, padding: '24px 20px',
          marginBottom: 32, boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
        }}>
          <div style={{
            color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', marginBottom: 12, textAlign: 'center',
          }}>
            ⚡ 今すぐやること
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {urgentActions.map((action, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'rgba(255,255,255,0.2)', borderRadius: 12,
                padding: '14px 16px',
              }}>
                <div style={{
                  width: 32, height: 32, background: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 16, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{action.icon}</span>
                  <span style={{
                    color: 'white', fontWeight: 700,
                    fontSize: 'clamp(13px, 3.5vw, 16px)', lineHeight: 1.4,
                  }}>
                    {action.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 記事一覧 */}
      <section>
        <h2 style={{
          fontSize: 16, fontWeight: 700, color: '#1A1A1A',
          marginBottom: 16, paddingBottom: 8,
          borderBottom: `3px solid ${colors.accent}`,
        }}>
          📋 詳しい行動ガイド
        </h2>
        {articles.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            background: '#F8F9FA', borderRadius: 16, color: '#888',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <p>記事を準備中です。もうしばらくお待ちください。</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* 他のカテゴリへ */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#888', marginBottom: 12 }}>
          他の状況を確認する
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(Object.entries(CATEGORY_MAP) as [string, typeof CATEGORY_MAP[keyof typeof CATEGORY_MAP]][])
            .filter(([key]) => key !== category)
            .map(([key, c]) => (
              <Link key={key} href={`/category/${key}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'white', border: '1px solid #E0E0E0',
                borderRadius: 50, padding: '8px 16px',
                textDecoration: 'none', color: '#1A1A1A',
                fontSize: 13, fontWeight: 600,
              }}>
                {c.emoji} {c.label}
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
