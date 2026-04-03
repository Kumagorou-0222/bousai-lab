import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORY_MAP, MAIN_CATEGORIES } from '@/lib/categories'

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

// カテゴリごとのビジュアル設定
const CARD_CONFIG: Record<string, {
  bg: string; border: string; accent: string; badgeBg: string; badgeText: string; desc: string
}> = {
  earthquake: {
    bg: '#FFF8F0', border: '#FF6B00', accent: '#FF6B00',
    badgeBg: '#FF6B00', badgeText: 'white',
    desc: '揺れを感じたら今すぐ確認',
  },
  typhoon: {
    bg: '#F0F4FF', border: '#3A5FFF', accent: '#3A5FFF',
    badgeBg: '#3A5FFF', badgeText: 'white',
    desc: '上陸前日に準備を完了させる',
  },
  blackout: {
    bg: '#FFFBF0', border: '#E69500', accent: '#E69500',
    badgeBg: '#E69500', badgeText: 'white',
    desc: '停電直後の3つの行動',
  },
  evacuation: {
    bg: '#F0FFF4', border: '#1E9E50', accent: '#1E9E50',
    badgeBg: '#1E9E50', badgeText: 'white',
    desc: '避難指示が出たら即行動',
  },
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
        background: 'linear-gradient(160deg, #0D0D1A 0%, #141428 50%, #0A1A3A 100%)',
        padding: '40px 20px 36px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          {/* 緊急感バッジ */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,60,60,0.15)', border: '1px solid rgba(255,60,60,0.45)',
            color: '#FF6060', padding: '5px 14px', borderRadius: 50,
            fontWeight: 700, fontSize: 12, marginBottom: 20,
            letterSpacing: '0.04em',
          }}>
            ⚡ 災害はいつ起きるかわかりません
          </div>
          <h1 style={{
            color: 'white', fontSize: 'clamp(24px, 6vw, 38px)',
            fontWeight: 900, lineHeight: 1.25, marginBottom: 14,
            fontFamily: 'Kaisei Decol, serif',
          }}>
            災害が起きたとき<br />
            <span style={{ color: '#FFD000' }}>今すぐやること</span>がわかるサイト
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 24,
          }}>
            在宅避難のための実践ガイド
            <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 8px' }}>|</span>
            武蔵野市在住の現役医師監修
          </p>
          {/* 武蔵野市リンク */}
          <Link href="/musashino-bousai" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,208,0,0.12)', border: '1px solid rgba(255,208,0,0.45)',
            color: '#FFD000', padding: '9px 20px', borderRadius: 50,
            textDecoration: 'none', fontSize: 13, fontWeight: 700,
          }}>
            📍 武蔵野市にお住まいの方はこちら →
          </Link>
        </div>
      </section>

      {/* 状況選択ラベル */}
      <div style={{
        textAlign: 'center', padding: '22px 16px 0',
        fontSize: 11, color: '#999', fontWeight: 700,
        letterSpacing: '0.1em',
      }}>
        ▼ 今の状況を選んでください
      </div>

      {/* 4カテゴリカード — シンプル版 */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '12px 16px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}>
          {MAIN_CATEGORIES.map((key) => {
            const cat = CATEGORY_MAP[key]
            const cfg = CARD_CONFIG[key]
            return (
              <Link key={key} href={`/category/${key}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: cfg.bg,
                  borderRadius: 18,
                  padding: '22px 18px',
                  border: `2px solid ${cfg.border}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  boxShadow: `0 2px 16px ${cfg.accent}18`,
                }}>
                  {/* タイトル */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 32, flexShrink: 0 }}>{cat.emoji}</span>
                    <span style={{
                      fontSize: 'clamp(15px, 4vw, 18px)',
                      fontWeight: 900, color: '#1A1A1A', lineHeight: 1.25,
                    }}>
                      {cat.label}
                    </span>
                  </div>
                  {/* 1行説明 */}
                  <p style={{
                    fontSize: 12, color: '#555', lineHeight: 1.5,
                    margin: 0, fontWeight: 600,
                  }}>
                    {cfg.desc}
                  </p>
                  {/* CTA */}
                  <div style={{
                    marginTop: 'auto',
                    background: cfg.accent, color: 'white',
                    borderRadius: 10, padding: '11px 14px',
                    textAlign: 'center', fontSize: 13, fontWeight: 700,
                  }}>
                    今すぐ確認する →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 緊急感メッセージ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '16px 16px 0' }}>
        <div className="alert-box" style={{
          background: '#FFF3CD', borderRadius: 12, padding: '14px 18px',
          border: '2px solid #F5A623',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: 13, color: '#7A4F00', lineHeight: 1.7, margin: 0, fontWeight: 600 }}>
            <strong>今この瞬間も災害は起きています。</strong>備えは「今すぐ」が正解です。
            カテゴリを選んで、今日できることを1つだけ確認しましょう。
          </p>
        </div>
      </section>

      {/* サブリンク */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '12px 16px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Link href="/category/disaster-prep" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white', borderRadius: 12, padding: '14px 16px',
              border: '2px solid #E0E0E0', display: 'flex',
              alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 22 }}>🎒</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1A1A1A' }}>備蓄・防災準備</div>
                <div style={{ fontSize: 11, color: '#888' }}>グッズ・食料・薬</div>
              </div>
              <span style={{ color: '#bbb', fontSize: 18, marginLeft: 'auto' }}>›</span>
            </div>
          </Link>
          <Link href="/musashino-bousai" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
              borderRadius: 12, padding: '14px 16px',
              border: '2px solid #3A5FFF', display: 'flex',
              alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 22 }}>📍</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'white' }}>武蔵野市の防災</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>避難所・ハザードマップ</div>
              </div>
              <span style={{ color: '#FFD000', fontSize: 18, marginLeft: 'auto' }}>›</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 監修者 */}
      <section style={{
        background: 'linear-gradient(160deg, #0D0D1A, #0A1A3A)',
        padding: '32px 20px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🐻</div>
          <div style={{ color: '#FFD000', fontWeight: 700, fontSize: 11, marginBottom: 8, letterSpacing: '0.08em' }}>
            SUPERVISED BY
          </div>
          <div style={{ color: 'white', fontWeight: 900, fontSize: 17, marginBottom: 10 }}>
            くまごろう（現役勤務医師）
          </div>
          {/* 信頼性を高める一言 */}
          <div style={{
            background: 'rgba(255,208,0,0.1)', border: '1px solid rgba(255,208,0,0.3)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 16,
          }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
              「武蔵野市に実際に住んで感じるのは、日常の延長に災害があるということ。
              医師として、大家として、住民として——本当に役立つ情報だけを届けます。」
            </p>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.6, marginBottom: 18 }}>
            武蔵野市在住の現役勤務医師・マンションオーナー
          </p>
          <Link href="/about" style={{
            background: 'rgba(255,255,255,0.1)', color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '9px 22px', borderRadius: 50,
            textDecoration: 'none', fontSize: 12, fontWeight: 700,
          }}>
            プロフィールを見る
          </Link>
        </div>
      </section>
    </>
  )
}
