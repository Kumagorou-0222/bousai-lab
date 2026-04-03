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
    title: `${cat.label}【今すぐやること・チェックリスト】`,
    description: `${cat.label}のとき今すぐやることチェックリスト。${cat.description}`,
    alternates: { canonical: `https://bousai-lab.vercel.app/category/${category}` },
    openGraph: {
      title: `${cat.label}【今すぐやること・チェックリスト】`,
      description: cat.description,
    },
  }
}

const CATEGORY_COLORS: Record<string, {
  bg: string; border: string; accent: string
  urgentBg: string; urgentShadow: string; dangerText: string
}> = {
  earthquake: {
    bg: '#FFF8F0', border: '#FF6B00', accent: '#FF6B00',
    urgentBg: 'linear-gradient(135deg, #C0392B 0%, #E74C3C 50%, #FF6B00 100%)',
    urgentShadow: 'rgba(192,57,43,0.35)', dangerText: '今すぐ身の安全を確保してください',
  },
  typhoon: {
    bg: '#F0F4FF', border: '#3A5FFF', accent: '#3A5FFF',
    urgentBg: 'linear-gradient(135deg, #1A237E 0%, #283593 50%, #3A5FFF 100%)',
    urgentShadow: 'rgba(58,95,255,0.35)', dangerText: '上陸前に全ての準備を完了させてください',
  },
  blackout: {
    bg: '#FFFBF0', border: '#E69500', accent: '#E69500',
    urgentBg: 'linear-gradient(135deg, #7A4F00 0%, #B8720D 50%, #E69500 100%)',
    urgentShadow: 'rgba(230,149,0,0.35)', dangerText: '停電直後の行動が食料・機器を守ります',
  },
  evacuation: {
    bg: '#F0FFF4', border: '#1E9E50', accent: '#1E9E50',
    urgentBg: 'linear-gradient(135deg, #0D5C2E 0%, #166638 50%, #1E9E50 100%)',
    urgentShadow: 'rgba(30,158,80,0.35)', dangerText: '避難指示が出たら迷わず今すぐ行動',
  },
  'disaster-prep': {
    bg: '#F8F8F8', border: '#666', accent: '#555',
    urgentBg: 'linear-gradient(135deg, #333, #555)',
    urgentShadow: 'rgba(0,0,0,0.2)', dangerText: '今日から少しずつ準備を始めましょう',
  },
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
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 80px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: cat.label },
      ]} />

      {/* カテゴリヘッダー */}
      <div style={{ textAlign: 'center', padding: '24px 0 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{cat.emoji}</div>
        <h1 style={{
          fontSize: 'clamp(21px, 5.5vw, 30px)', fontWeight: 900, color: '#1A1A1A',
          fontFamily: 'Kaisei Decol, serif', marginBottom: 8,
        }}>
          {cat.label}
        </h1>
        <p style={{ color: '#666', fontSize: 13, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
          {cat.description}
        </p>
      </div>

      {/* 今すぐやること3つ — 緊急感最大化 */}
      {urgentActions && (
        <section style={{
          background: colors.urgentBg, borderRadius: 20, padding: '0 0 20px',
          marginBottom: 32, boxShadow: `0 8px 32px ${colors.urgentShadow}`,
          overflow: 'hidden',
        }}>
          {/* 緊急感ヘッダー */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{
              color: 'white', fontSize: 13, fontWeight: 900,
              letterSpacing: '0.06em',
            }}>
              今すぐやること
            </span>
            <span style={{
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)',
              fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '2px 10px',
            }}>
              3ステップ
            </span>
          </div>
          {/* 危険メッセージ */}
          <div style={{
            margin: '0 16px 14px',
            background: 'rgba(0,0,0,0.2)', borderRadius: 10,
            padding: '8px 14px',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.9)', fontSize: 12,
              fontWeight: 700, margin: 0, lineHeight: 1.5,
            }}>
              ⚠️ {colors.dangerText}
            </p>
          </div>
          {/* アクション3つ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
            {urgentActions.map((action, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'rgba(255,255,255,0.18)', borderRadius: 14,
                padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <div style={{
                  width: 34, height: 34, background: 'rgba(255,255,255,0.25)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                  fontWeight: 900, fontSize: 15, color: 'white',
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{action.icon}</span>
                <span style={{
                  color: 'white', fontWeight: 700,
                  fontSize: 'clamp(13px, 3.8vw, 16px)', lineHeight: 1.4,
                }}>
                  {action.text}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 記事一覧 */}
      <section>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 18, paddingBottom: 10,
          borderBottom: `3px solid ${colors.accent}`,
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: '#1A1A1A', margin: 0 }}>
            📋 詳しい行動ガイド
          </h2>
          <span style={{
            background: colors.bg, color: colors.accent,
            border: `1px solid ${colors.accent}`,
            borderRadius: 20, padding: '2px 10px',
            fontSize: 11, fontWeight: 700,
          }}>
            {articles.length}本
          </span>
        </div>
        {articles.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            background: '#F8F9FA', borderRadius: 16, color: '#888',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <p>記事を準備中です。もうしばらくお待ちください。</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {articles.map((article, i) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'white', borderRadius: 14, padding: '16px 18px',
                  border: `1px solid ${i === 0 ? colors.accent : '#E8E8E8'}`,
                  boxShadow: i === 0 ? `0 2px 12px ${colors.urgentShadow}` : '0 1px 6px rgba(0,0,0,0.05)',
                  position: 'relative',
                }}>
                  {i === 0 && (
                    <span style={{
                      position: 'absolute', top: -1, left: 16,
                      background: colors.accent, color: 'white',
                      fontSize: 10, fontWeight: 700, borderRadius: '0 0 6px 6px',
                      padding: '2px 8px',
                    }}>
                      まずはこれ
                    </span>
                  )}
                  <span style={{ fontSize: 30, flexShrink: 0 }}>{article.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0, marginTop: i === 0 ? 8 : 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', lineHeight: 1.4 }}>
                      {article.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 4, lineHeight: 1.4 }}>
                      {article.description.slice(0, 55)}…
                    </div>
                  </div>
                  <span style={{ color: colors.accent, fontSize: 20, flexShrink: 0 }}>›</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 他のカテゴリへ */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#999', marginBottom: 12, letterSpacing: '0.05em' }}>
          他の状況を確認する
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(Object.entries(CATEGORY_MAP) as [string, typeof CATEGORY_MAP[keyof typeof CATEGORY_MAP]][])
            .filter(([key]) => key !== category)
            .map(([key, c]) => (
              <Link key={key} href={`/category/${key}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'white', border: '1px solid #E0E0E0',
                borderRadius: 50, padding: '9px 18px',
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
