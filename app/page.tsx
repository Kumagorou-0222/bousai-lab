import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORY_MAP, MAIN_CATEGORIES, CATEGORY_URGENT_ACTIONS } from '@/lib/categories'

export const metadata: Metadata = {
  title: '防災Lab｜災害が起きたとき今すぐやること',
  description:
    '地震・台風・停電・避難——「今どうする？」がすぐわかる防災行動サイト。武蔵野市在住の現役医師が監修。スマホで今すぐ確認できる行動ガイド。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/' },
  openGraph: {
    title: '防災Lab｜災害が起きたとき今すぐやること',
    description: '地震・台風・停電・避難——「今どうする？」がすぐわかる防災行動サイト。',
    url: 'https://bousai-lab.vercel.app/',
    images: [{ url: 'https://bousai-lab.vercel.app/ogp.svg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '防災Lab｜災害が起きたとき今すぐやること',
    description: '地震・台風・停電・避難——今すぐやることがわかる防災行動サイト',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://bousai-lab.vercel.app/#website',
  url: 'https://bousai-lab.vercel.app/',
  name: '防災Lab',
  description: '災害が起きたとき「今どうする？」がすぐわかる防災行動サイト。',
  inLanguage: 'ja',
  publisher: {
    '@type': 'Person',
    name: 'くまごろう',
    jobTitle: '医師',
    url: 'https://bousai-lab.vercel.app/about',
  },
}

// カテゴリごとのカラー設定
const CATEGORY_COLORS: Record<string, { bg: string; border: string; accent: string; badge: string }> = {
  earthquake: { bg: '#FFF8F0', border: '#FF6B00', accent: '#FF6B00', badge: '#FFF3E0' },
  typhoon: { bg: '#F0F4FF', border: '#4A6FFF', accent: '#4A6FFF', badge: '#EBF0FF' },
  blackout: { bg: '#FFFBF0', border: '#F5A623', accent: '#F5A623', badge: '#FFF8E1' },
  evacuation: { bg: '#F0FFF4', border: '#27AE60', accent: '#27AE60', badge: '#E8F8EE' },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* HERO — コンパクト、スマホ最優先 */}
      <section style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%)',
        padding: '32px 20px 28px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,107,0,0.2)', border: '1px solid rgba(255,107,0,0.4)',
            color: '#FF9500', padding: '5px 14px', borderRadius: 50,
            fontWeight: 700, fontSize: 12, marginBottom: 16,
          }}>
            🩺 現役医師監修
          </div>
          <h1 style={{
            color: 'white', fontSize: 'clamp(22px, 5.5vw, 36px)',
            fontWeight: 900, lineHeight: 1.25, marginBottom: 10,
            fontFamily: 'Kaisei Decol, serif',
          }}>
            災害が起きたとき<br />
            <span style={{ color: '#FFD000' }}>「今すぐやること」</span>がわかるサイト
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.7, marginBottom: 0,
          }}>
            地震・台風・停電・避難——気になった瞬間に開いてすぐ行動できる
          </p>
        </div>
      </section>

      {/* 4カテゴリ大カード — ファーストビューの核心 */}
      <section style={{
        maxWidth: 900, margin: '0 auto', padding: '24px 16px 16px',
      }}>
        <p style={{
          textAlign: 'center', fontSize: 13, color: '#888',
          marginBottom: 16, fontWeight: 600, letterSpacing: '0.05em',
        }}>
          ▼ 今の状況を選んでください
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}>
          {MAIN_CATEGORIES.map((key) => {
            const cat = CATEGORY_MAP[key]
            const colors = CATEGORY_COLORS[key]
            const urgentActions = CATEGORY_URGENT_ACTIONS[key]
            return (
              <Link key={key} href={`/category/${key}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: colors.bg,
                  borderRadius: 16,
                  padding: '20px 16px',
                  border: `2px solid ${colors.border}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 32 }}>{cat.emoji}</span>
                    <div>
                      <div style={{
                        fontSize: 'clamp(13px, 3.5vw, 16px)',
                        fontWeight: 900, color: '#1A1A1A', lineHeight: 1.3,
                      }}>
                        {cat.label}
                      </div>
                      <div style={{
                        fontSize: 11, color: colors.accent, fontWeight: 700, marginTop: 2,
                      }}>
                        今すぐ確認 →
                      </div>
                    </div>
                  </div>
                  {/* 今すぐやること3つ（プレビュー） */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {urgentActions.slice(0, 3).map((action, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 6,
                        background: 'rgba(255,255,255,0.7)', borderRadius: 8,
                        padding: '6px 8px',
                      }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>{action.icon}</span>
                        <span style={{
                          fontSize: 'clamp(10px, 2.8vw, 12px)',
                          color: '#333', lineHeight: 1.4, fontWeight: 600,
                        }}>
                          {action.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 'auto',
                    background: colors.accent, color: 'white',
                    borderRadius: 8, padding: '8px 12px',
                    textAlign: 'center', fontSize: 12, fontWeight: 700,
                  }}>
                    詳しい行動ガイドを見る →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 備蓄・準備カテゴリ（サブ） */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '8px 16px 24px' }}>
        <Link href="/category/disaster-prep" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white', borderRadius: 12, padding: '14px 20px',
            border: '2px solid #E0E0E0', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>🎒</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>備蓄・防災準備</div>
                <div style={{ fontSize: 12, color: '#888' }}>防災グッズ・食料・薬の備え方</div>
              </div>
            </div>
            <span style={{ color: '#888', fontSize: 18 }}>›</span>
          </div>
        </Link>
      </section>

      {/* 医師監修バッジ */}
      <section style={{
        background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
        padding: '24px 20px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🐻</div>
          <div style={{ color: '#FFD000', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
            このサイトの監修者
          </div>
          <div style={{ color: 'white', fontWeight: 900, fontSize: 17, marginBottom: 8 }}>
            くまごろう（現役勤務医師）
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>
            武蔵野市在住の現役勤務医師・大家さん。<br />
            医師の視点から「命を守る防災知識」をわかりやすく発信。
          </p>
          <Link href="/about" style={{
            background: 'rgba(255,255,255,0.15)', color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '8px 20px', borderRadius: 50,
            textDecoration: 'none', fontSize: 12, fontWeight: 700,
          }}>
            プロフィールを見る
          </Link>
        </div>
      </section>
    </>
  )
}
