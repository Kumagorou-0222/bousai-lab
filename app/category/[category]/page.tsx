import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticlesByCategory, CATEGORY_MAP, type ArticleCategory } from '@/lib/articles'
import { MAIN_CATEGORIES, CATEGORY_URGENT_ACTIONS } from '@/lib/categories'
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

// 新パレット準拠
const CATEGORY_STYLES: Record<string, {
  accent: string; accentBg: string; accentLight: string
  urgentBg: string; dangerText: string
}> = {
  earthquake: {
    accent: '#DC2626', accentBg: '#FEF2F2', accentLight: '#FECACA',
    urgentBg: 'linear-gradient(135deg, #991B1B 0%, #DC2626 100%)',
    dangerText: '今すぐ身の安全を確保してください',
  },
  typhoon: {
    accent: '#2563EB', accentBg: '#EFF6FF', accentLight: '#BFDBFE',
    urgentBg: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
    dangerText: '上陸前に全ての準備を完了させてください',
  },
  blackout: {
    accent: '#D97706', accentBg: '#FFFBEB', accentLight: '#FDE68A',
    urgentBg: 'linear-gradient(135deg, #92400E 0%, #D97706 100%)',
    dangerText: '停電直後の行動が食料・機器を守ります',
  },
  evacuation: {
    accent: '#16A34A', accentBg: '#F0FDF4', accentLight: '#BBF7D0',
    urgentBg: 'linear-gradient(135deg, #14532D 0%, #16A34A 100%)',
    dangerText: '避難指示が出たら迷わず今すぐ行動',
  },
  'disaster-prep': {
    accent: '#475569', accentBg: '#F8FAFC', accentLight: '#CBD5E1',
    urgentBg: 'linear-gradient(135deg, #1E293B 0%, #475569 100%)',
    dangerText: '今日から少しずつ準備を始めましょう',
  },
  'heavy-rain': {
    accent: '#0EA5E9', accentBg: '#F0F9FF', accentLight: '#BAE6FD',
    urgentBg: 'linear-gradient(135deg, #075985 0%, #0EA5E9 100%)',
    dangerText: 'アンダーパス・冠水道路には絶対に入らないでください',
  },
  flood: {
    accent: '#1D4ED8', accentBg: '#EFF6FF', accentLight: '#BFDBFE',
    urgentBg: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
    dangerText: '浸水30cmを超えたら徒歩避難を断念し上層階へ',
  },
  tsunami: {
    accent: '#0891B2', accentBg: '#ECFEFF', accentLight: '#A5F3FC',
    urgentBg: 'linear-gradient(135deg, #155E75 0%, #0891B2 100%)',
    dangerText: '揺れを感じたら今すぐ海から離れ高台へ逃げてください',
  },
  landslide: {
    accent: '#B45309', accentBg: '#FFF7ED', accentLight: '#FED7AA',
    urgentBg: 'linear-gradient(135deg, #7C2D12 0%, #B45309 100%)',
    dangerText: '崖・川の様子を見に行かず今すぐ避難してください',
  },
  volcano: {
    accent: '#B91C1C', accentBg: '#FEF2F2', accentLight: '#FECACA',
    urgentBg: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 100%)',
    dangerText: 'マスクを着用し外出を最小限にしてください',
  },
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  if (!VALID_CATEGORIES.includes(category as ArticleCategory)) notFound()

  const cat = CATEGORY_MAP[category as ArticleCategory]
  const articles = getArticlesByCategory(category as ArticleCategory)
  const styles = CATEGORY_STYLES[category] ?? CATEGORY_STYLES['disaster-prep']
  const urgentActions = (CATEGORY_URGENT_ACTIONS as Record<string, { icon: string; text: string }[]>)[category] ?? null

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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://bousai-lab.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: cat.label, item: `https://bousai-lab.vercel.app/category/${category}` },
    ],
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: cat.label },
      ]} />

      {/* カテゴリヘッダー */}
      <div style={{ padding: '20px 0 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: styles.accentBg, border: `1.5px solid ${styles.accentLight}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, flexShrink: 0,
        }}>
          {cat.emoji}
        </div>
        <div>
          <h1 style={{
            fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 900,
            color: '#0F172A', fontFamily: 'Kaisei Decol, serif',
            marginBottom: 4, lineHeight: 1.2,
          }}>
            {cat.label}
          </h1>
          <p style={{ color: '#64748B', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
            {cat.description}
          </p>
        </div>
      </div>

      {/* 武蔵野市バナー（上部） */}
      <Link href="/musashino" style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
        border: '1.5px solid #FCD34D',
        borderRadius: 12, padding: '12px 16px',
        textDecoration: 'none', marginBottom: 20,
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>📍</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, color: '#92400E', fontWeight: 700 }}>
            武蔵野市在住の方へ ―
          </span>
          <span style={{ fontSize: 13, color: '#78350F', fontWeight: 800, marginLeft: 6 }}>
            武蔵野市の場合を見る →
          </span>
        </div>
        <span style={{ color: '#D97706', fontSize: 16, flexShrink: 0 }}>›</span>
      </Link>

      {/* 今すぐやること3つ — 最上部強調 */}
      {urgentActions && (
        <section style={{ marginBottom: 28 }}>
          {/* 緊急メッセージ */}
          <div style={{
            background: styles.accentBg,
            border: `1.5px solid ${styles.accentLight}`,
            borderLeft: `4px solid ${styles.accent}`,
            borderRadius: 10, padding: '10px 16px',
            marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 15 }}>⚠️</span>
            <span style={{ fontSize: 12, color: styles.accent, fontWeight: 700 }}>
              {styles.dangerText}
            </span>
          </div>

          {/* 3ステップ */}
          <div style={{
            background: styles.urgentBg,
            borderRadius: 16, padding: '20px 18px',
            boxShadow: `0 4px 20px rgba(0,0,0,0.15)`,
          }}>
            <div style={{
              color: 'rgba(255,255,255,0.7)', fontSize: 10,
              fontWeight: 700, letterSpacing: '0.1em',
              marginBottom: 14, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 13 }}>⚡</span>
              今すぐやること — 3ステップ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {urgentActions.map((action, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: 12, padding: '13px 15px',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}>
                  <div style={{
                    width: 30, height: 30,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 8,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900, fontSize: 14, color: 'white', flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{action.icon}</span>
                  <span style={{
                    color: 'white', fontWeight: 700,
                    fontSize: 'clamp(13px, 3.8vw, 15px)', lineHeight: 1.4,
                  }}>
                    {action.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 記事一覧 */}
      <section>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 14,
        }}>
          <h2 style={{
            fontSize: 14, fontWeight: 700, color: '#64748B',
            margin: 0, letterSpacing: '0.05em',
          }}>
            詳しい行動ガイド
          </h2>
          <span style={{
            background: styles.accentBg, color: styles.accent,
            border: `1px solid ${styles.accentLight}`,
            borderRadius: 20, padding: '1px 8px',
            fontSize: 11, fontWeight: 700,
          }}>
            {articles.length}本
          </span>
        </div>

        {articles.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            background: '#F8FAFC', borderRadius: 16,
            border: '1px solid #E2E8F0', color: '#94A3B8',
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📝</div>
            <p style={{ fontSize: 13 }}>記事を準備中です。もうしばらくお待ちください。</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {articles.map((article, i) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'white', borderRadius: 14, padding: '16px 18px',
                  border: `1.5px solid ${i === 0 ? styles.accentLight : '#E2E8F0'}`,
                  boxShadow: i === 0 ? `0 2px 12px rgba(0,0,0,0.08)` : 'none',
                  position: 'relative',
                }}>
                  {i === 0 && (
                    <span style={{
                      position: 'absolute', top: -1, left: 14,
                      background: styles.accent, color: 'white',
                      fontSize: 10, fontWeight: 700,
                      borderRadius: '0 0 6px 6px',
                      padding: '2px 8px',
                    }}>
                      まずはこれ
                    </span>
                  )}
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: styles.accentBg,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 22, flexShrink: 0,
                    marginTop: i === 0 ? 6 : 0,
                  }}>
                    {article.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, marginTop: i === 0 ? 6 : 0 }}>
                    <div style={{
                      fontWeight: 700, fontSize: 14, color: '#0F172A',
                      lineHeight: 1.4, marginBottom: 4,
                    }}>
                      {article.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.4 }}>
                      {article.description.slice(0, 55)}…
                    </div>
                  </div>
                  <span style={{ color: styles.accent, fontSize: 18, flexShrink: 0 }}>›</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 武蔵野市バナー */}
      <section style={{ marginTop: 32 }}>
        <Link href="/musashino" style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)',
          borderRadius: 16, padding: '16px 20px',
          textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(15,52,96,0.3)',
        }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>📍</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#FFD000', fontWeight: 700, marginBottom: 3, letterSpacing: '0.05em' }}>
              武蔵野市在住の方へ
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'white', lineHeight: 1.4 }}>
              武蔵野市の地域情報・避難所・在宅避難ガイド
            </div>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20, flexShrink: 0 }}>›</span>
        </Link>
      </section>

      {/* 他のカテゴリ */}
      <section style={{ marginTop: 48 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: '#94A3B8',
          letterSpacing: '0.08em', marginBottom: 12,
        }}>
          他の状況を確認する
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(Object.entries(CATEGORY_MAP) as [string, typeof CATEGORY_MAP[keyof typeof CATEGORY_MAP]][])
            .filter(([key]) => key !== category)
            .map(([key, c]) => (
              <Link key={key} href={`/category/${key}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'white', border: '1.5px solid #E2E8F0',
                borderRadius: 50, padding: '8px 16px',
                textDecoration: 'none', color: '#475569',
                fontSize: 12, fontWeight: 600,
              }}>
                {c.emoji} {c.label}
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
