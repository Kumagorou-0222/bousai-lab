import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/articles'
import type { ArticleCategory, ArticleMeta } from '@/lib/articles'
import { CATEGORY_MAP } from '@/lib/categories'
import Breadcrumb from '@/components/Breadcrumb'
import CategoryHero from '@/components/CategoryHero'

type CategoryStyle = { accent: string; accentBg: string; accentLight: string; darkBg: string }

const STYLES: Record<string, CategoryStyle> = {
  'heavy-rain': { accent: '#0EA5E9', accentBg: '#F0F9FF', accentLight: '#BAE6FD', darkBg: 'linear-gradient(135deg, #061525, #0C2D4A)' },
  typhoon:      { accent: '#2563EB', accentBg: '#EFF6FF', accentLight: '#BFDBFE', darkBg: 'linear-gradient(135deg, #0A0A1A, #0C1A3D)' },
  flood:        { accent: '#1D4ED8', accentBg: '#EFF6FF', accentLight: '#BFDBFE', darkBg: 'linear-gradient(135deg, #06172A, #0C2040)' },
  tsunami:      { accent: '#0891B2', accentBg: '#ECFEFF', accentLight: '#A5F3FC', darkBg: 'linear-gradient(135deg, #04111F, #082535)' },
  landslide:    { accent: '#B45309', accentBg: '#FFF7ED', accentLight: '#FED7AA', darkBg: 'linear-gradient(135deg, #1A0E08, #3D2010)' },
  volcano:      { accent: '#B91C1C', accentBg: '#FEF2F2', accentLight: '#FECACA', darkBg: 'linear-gradient(135deg, #1A0800, #3D1500)' },
}

const DEFAULT_STYLE: CategoryStyle = {
  accent: '#475569', accentBg: '#F8FAFC', accentLight: '#CBD5E1',
  darkBg: 'linear-gradient(135deg, #0F1117, #1E2235)',
}

function ArticleCard({ article, styles, isFirst, badge }: {
  article: ArticleMeta
  styles: CategoryStyle
  isFirst: boolean
  badge?: string
}) {
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        background: 'white', borderRadius: 14, padding: '16px 18px',
        border: `1.5px solid ${isFirst ? styles.accentLight : '#E2E8F0'}`,
        boxShadow: isFirst ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
        position: 'relative',
      }}>
        {isFirst && (
          <span style={{
            position: 'absolute', top: -1, left: 14,
            background: styles.accent, color: 'white',
            fontSize: 10, fontWeight: 700,
            borderRadius: '0 0 6px 6px', padding: '2px 8px',
          }}>
            {badge ?? 'まずはこれ'}
          </span>
        )}
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: styles.accentBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0, marginTop: isFirst ? 6 : 0,
        }}>
          {article.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0, marginTop: isFirst ? 6 : 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', lineHeight: 1.4, marginBottom: 4 }}>
            {article.title}
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.4 }}>
            {article.description.slice(0, 55)}…
          </div>
        </div>
        <span style={{ color: styles.accent, fontSize: 18, flexShrink: 0 }}>›</span>
      </div>
    </Link>
  )
}

type Props = {
  category: ArticleCategory
  heroTitle: string
  rissMessage: string
  robotMessage: string
  heroSubtitle?: string
  mangaHref?: string
  ctaProducts: string[]
}

export default function ExtendedCategoryPage({
  category, heroTitle, rissMessage, robotMessage, heroSubtitle, mangaHref, ctaProducts,
}: Props) {
  const cat = CATEGORY_MAP[category]
  const styles = STYLES[category] ?? DEFAULT_STYLE

  const allArticles = getArticlesByCategory(category)
  const savedArticles = allArticles.filter(a => a.xSeries === '保存版')
  const regularArticles = allArticles.filter(a => a.xSeries !== '保存版')

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[{ label: 'ホーム', href: '/' }, { label: cat.label }]} />

      {/* ① CategoryHero */}
      <CategoryHero
        category={category}
        title={heroTitle}
        rissMessage={rissMessage}
        robotMessage={robotMessage}
        subtitle={heroSubtitle}
      />

      {/* 武蔵野市バナー（上部） */}
      <Link href="/musashino" style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
        border: '1.5px solid #FCD34D',
        borderRadius: 12, padding: '12px 16px',
        textDecoration: 'none', marginBottom: 24,
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>📍</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, color: '#92400E', fontWeight: 700 }}>武蔵野市在住の方へ ―</span>
          <span style={{ fontSize: 13, color: '#78350F', fontWeight: 800, marginLeft: 6 }}>武蔵野市の場合を見る →</span>
        </div>
        <span style={{ color: '#D97706', fontSize: 16, flexShrink: 0 }}>›</span>
      </Link>

      {/* ② まず漫画で学ぶ */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: 10 }}>
          🎨 まず漫画で理解する
        </div>
        {mangaHref ? (
          <Link href={mangaHref} style={{ textDecoration: 'none' }}>
            <div style={{
              background: styles.darkBg,
              border: `2px solid ${styles.accentLight}`,
              borderRadius: 16, padding: '20px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(160deg, #FFF9E6, #FFF0D6)', overflow: 'hidden' }}>
                    <img src="/img/riss.png" alt="防災リス" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(160deg, #EFF6FF, #DBEAFE)', overflow: 'hidden' }}>
                    <img src="/img/robot.png" alt="レスQロボ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <span style={{ color: styles.accentLight, fontWeight: 700, fontSize: 13 }}>
                    4コマ漫画で学ぶ {cat.label}
                  </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
                  👉 子どもでもわかるやさしい防災
                </div>
              </div>
              <div style={{
                background: styles.accent, color: 'white',
                borderRadius: 10, padding: '10px 18px',
                fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                マンガを見る →
              </div>
            </div>
          </Link>
        ) : (
          <div style={{
            background: '#0F172A', border: '1.5px solid #1E293B',
            borderRadius: 16, padding: '20px 22px',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(160deg, #FFF9E6, #FFF0D6)', overflow: 'hidden' }}>
                <img src="/img/riss.png" alt="防災リス" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(160deg, #EFF6FF, #DBEAFE)', overflow: 'hidden' }}>
                <img src="/img/robot.png" alt="レスQロボ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </div>
            <div>
              <div style={{ color: styles.accentLight, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                4コマ漫画 — 近日公開
              </div>
              <div style={{ color: '#475569', fontSize: 12 }}>
                {cat.label}の危険を4コマで学べる漫画を制作中
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ③ 保存版記事 */}
      {savedArticles.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <h2 style={{
            fontSize: 15, fontWeight: 700, color: '#0F172A',
            marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              background: styles.accent, color: 'white',
              fontSize: 10, fontWeight: 700,
              borderRadius: 4, padding: '2px 8px',
            }}>
              保存版
            </span>
            必読記事
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {savedArticles.map((article, i) => (
              <ArticleCard key={article.slug} article={article} styles={styles} isFirst={i === 0} badge="保存版" />
            ))}
          </div>
        </section>
      )}

      {/* ④ 通常記事 */}
      <section style={{ marginBottom: 32 }}>
        {allArticles.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            background: '#F8FAFC', borderRadius: 16,
            border: '1px solid #E2E8F0', color: '#94A3B8',
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📝</div>
            <p style={{ fontSize: 13 }}>記事を準備中です。もうしばらくお待ちください。</p>
          </div>
        ) : regularArticles.length > 0 ? (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#64748B', margin: 0, letterSpacing: '0.05em' }}>
                詳しい行動ガイド
              </h2>
              <span style={{
                background: styles.accentBg, color: styles.accent,
                border: `1px solid ${styles.accentLight}`,
                borderRadius: 20, padding: '1px 8px',
                fontSize: 11, fontWeight: 700,
              }}>
                {regularArticles.length}本
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {regularArticles.map((article, i) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  styles={styles}
                  isFirst={i === 0 && savedArticles.length === 0}
                />
              ))}
            </div>
          </>
        ) : null}
      </section>

      {/* X導線 */}
      <section style={{ marginBottom: 28 }}>
        <a
          href="https://x.com/zaitaku_bousai"
          target="_blank" rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #0F172A, #1E293B)',
            border: '1.5px solid #334155',
            borderRadius: 16, padding: '18px 22px',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, background: 'black',
              borderRadius: 12, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22, flexShrink: 0,
            }}>
              𝕏
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'white', marginBottom: 4 }}>
                防災ラボ｜在宅避難 @zaitaku_bousai
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                速報＋実用情報を毎日発信。災害当日の行動指針はXで確認。
              </div>
            </div>
            <div style={{
              background: 'white', color: '#0F172A',
              borderRadius: 20, padding: '7px 14px',
              fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              フォローする
            </div>
          </div>
        </a>
      </section>

      {/* 収益CTA */}
      <section style={{
        background: 'linear-gradient(160deg, #0D0D1A, #0A1A3A)',
        borderRadius: 20, padding: '28px 24px', marginBottom: 28, textAlign: 'center',
      }}>
        <h2 style={{ color: '#FFD000', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
          👇 今すぐ準備する
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginBottom: 16 }}>
          備えた人だけが落ち着いて動ける
        </p>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8,
          flexWrap: 'wrap', marginBottom: 20,
        }}>
          {ctaProducts.map((item) => (
            <span key={item} style={{
              background: 'rgba(255,208,0,0.12)',
              border: '1px solid rgba(255,208,0,0.3)',
              color: '#FFD000', borderRadius: 50, padding: '6px 14px',
              fontSize: 12, fontWeight: 700,
            }}>
              ✓ {item}
            </span>
          ))}
        </div>
        <Link href="/goods" style={{
          display: 'inline-block',
          background: '#FF6B00', color: 'white',
          borderRadius: 12, padding: '14px 32px',
          textDecoration: 'none', fontSize: 15, fontWeight: 700,
          boxShadow: '0 4px 16px rgba(255,107,0,0.4)',
        }}>
          おすすめを見る →
        </Link>
      </section>

      {/* 武蔵野市バナー */}
      <section style={{ marginBottom: 28 }}>
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
      <section>
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
