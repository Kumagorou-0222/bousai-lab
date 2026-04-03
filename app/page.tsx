import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORY_MAP, MAIN_CATEGORIES, CATEGORY_URGENT_ACTIONS } from '@/lib/categories'

export const metadata: Metadata = {
  title: '防災Lab｜災害が起きたとき今すぐやることチェックリスト',
  description:
    '地震・台風・停電・避難——「今どうする？」が今すぐわかるチェックリストと行動ガイド。在宅避難のための実践ガイドを武蔵野市在住の現役医師が監修。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/' },
  openGraph: {
    title: '防災Lab｜災害が起きたとき今すぐやることチェックリスト',
    description: '地震・台風・停電・避難——今すぐできるチェックリストと行動ガイド。在宅避難の実践ガイド。',
    url: 'https://bousai-lab.vercel.app/',
    images: [{ url: 'https://bousai-lab.vercel.app/ogp.svg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '防災Lab｜災害が起きたとき今すぐやることチェックリスト',
    description: '地震・台風・停電・避難——今すぐできるチェックリストと行動ガイド',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://bousai-lab.vercel.app/#website',
  url: 'https://bousai-lab.vercel.app/',
  name: '防災Lab',
  description: '災害が起きたとき「今どうする？」がすぐわかる防災行動サイト。在宅避難のための実践ガイド。',
  inLanguage: 'ja',
  publisher: {
    '@type': 'Person',
    name: 'くまごろう',
    jobTitle: '医師',
    url: 'https://bousai-lab.vercel.app/about',
  },
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; accent: string }> = {
  earthquake: { bg: '#FFF8F0', border: '#FF6B00', accent: '#FF6B00' },
  typhoon:    { bg: '#F0F4FF', border: '#4A6FFF', accent: '#4A6FFF' },
  blackout:   { bg: '#FFFBF0', border: '#F5A623', accent: '#F5A623' },
  evacuation: { bg: '#F0FFF4', border: '#27AE60', accent: '#27AE60' },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%)',
        padding: '36px 20px 32px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,107,0,0.2)', border: '1px solid rgba(255,107,0,0.4)',
            color: '#FF9500', padding: '5px 14px', borderRadius: 50,
            fontWeight: 700, fontSize: 12, marginBottom: 18,
          }}>
            🩺 武蔵野市在住の現役医師監修
          </div>
          <h1 style={{
            color: 'white', fontSize: 'clamp(22px, 5.5vw, 36px)',
            fontWeight: 900, lineHeight: 1.3, marginBottom: 12,
            fontFamily: 'Kaisei Decol, serif',
          }}>
            災害が起きたとき<br />
            <span style={{ color: '#FFD000' }}>「今すぐやること」</span>がわかるサイト
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.7, marginBottom: 20,
          }}>
            在宅避難のための実践ガイド——気になった瞬間に開いてすぐ行動できる
          </p>
          {/* 武蔵野市リンク */}
          <Link href="/musashino-bousai" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,208,0,0.15)', border: '1px solid rgba(255,208,0,0.5)',
            color: '#FFD000', padding: '8px 18px', borderRadius: 50,
            textDecoration: 'none', fontSize: 13, fontWeight: 700,
          }}>
            📍 武蔵野市にお住まいの方はこちら →
          </Link>
        </div>
      </section>

      {/* 4カテゴリ大カード */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '28px 16px 12px' }}>
        <p style={{
          textAlign: 'center', fontSize: 12, color: '#999',
          marginBottom: 18, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          ▼ 今の状況を選んでください
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 14,
        }}>
          {MAIN_CATEGORIES.map((key) => {
            const cat = CATEGORY_MAP[key]
            const colors = CATEGORY_COLORS[key]
            const urgentActions = CATEGORY_URGENT_ACTIONS[key]
            return (
              <Link key={key} href={`/category/${key}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: colors.bg,
                  borderRadius: 18,
                  padding: '20px 16px 16px',
                  border: `2px solid ${colors.border}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}>
                  {/* タイトル行 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 30, flexShrink: 0 }}>{cat.emoji}</span>
                    <div style={{
                      fontSize: 'clamp(14px, 3.8vw, 17px)',
                      fontWeight: 900, color: '#1A1A1A', lineHeight: 1.25,
                    }}>
                      {cat.label}
                    </div>
                  </div>
                  {/* やること3つ（1行ずつシンプルに） */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {urgentActions.slice(0, 3).map((action, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        fontSize: 'clamp(11px, 3vw, 13px)',
                        color: '#444', lineHeight: 1.4, fontWeight: 600,
                      }}>
                        <span style={{ color: colors.accent, fontWeight: 900, fontSize: 13, flexShrink: 0 }}>
                          {i + 1}.
                        </span>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>{action.icon}</span>
                        <span>{action.text}</span>
                      </div>
                    ))}
                  </div>
                  {/* CTA */}
                  <div style={{
                    marginTop: 'auto',
                    background: colors.accent, color: 'white',
                    borderRadius: 10, padding: '9px 12px',
                    textAlign: 'center', fontSize: 12, fontWeight: 700,
                  }}>
                    行動ガイドを見る →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* サブリンク行：備蓄 + 武蔵野市 */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '8px 16px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Link href="/category/disaster-prep" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white', borderRadius: 12, padding: '14px 16px',
              border: '2px solid #E0E0E0', display: 'flex',
              alignItems: 'center', gap: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <span style={{ fontSize: 22 }}>🎒</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1A1A1A' }}>備蓄・防災準備</div>
                <div style={{ fontSize: 11, color: '#888' }}>グッズ・食料・薬</div>
              </div>
              <span style={{ color: '#bbb', fontSize: 16, marginLeft: 'auto' }}>›</span>
            </div>
          </Link>
          <Link href="/musashino-bousai" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
              borderRadius: 12, padding: '14px 16px',
              border: '2px solid #4A6FFF', display: 'flex',
              alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 22 }}>📍</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'white' }}>武蔵野市の防災</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>避難所・ハザードマップ</div>
              </div>
              <span style={{ color: '#FFD000', fontSize: 16, marginLeft: 'auto' }}>›</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 監修者 */}
      <section style={{
        background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
        padding: '28px 20px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>🐻</div>
          <div style={{ color: '#FFD000', fontWeight: 700, fontSize: 12, marginBottom: 6 }}>監修者</div>
          <div style={{ color: 'white', fontWeight: 900, fontSize: 16, marginBottom: 8 }}>
            くまごろう（現役勤務医師）
          </div>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>
            武蔵野市在住の現役勤務医師・大家さん。<br />
            医師の視点から「命を守る防災知識」を発信。
          </p>
          <Link href="/about" style={{
            background: 'rgba(255,255,255,0.12)', color: 'white',
            border: '1px solid rgba(255,255,255,0.25)',
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
