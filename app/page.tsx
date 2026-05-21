import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORY_MAP, MAIN_CATEGORIES } from '@/lib/categories'
import { MANGA_LIST } from '@/lib/manga'
import { getAllArticlesMeta } from '@/lib/articles'

export const metadata: Metadata = {
  title: '防災Lab｜まんがで学ぶ在宅避難ガイド【武蔵野市対応】',
  description:
    '備えれば、家でも地域でも安心できる。防災リスとレスQロボが地震・停電・避難所の備えをやさしく案内。武蔵野市在住の現役医師監修。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/' },
  openGraph: {
    title: '防災Lab｜まんがで学ぶ在宅避難ガイド【武蔵野市対応】',
    description: '備えれば、家でも地域でも安心できる。まんがで学ぶ防災。武蔵野市対応。',
    url: 'https://bousai-lab.vercel.app/',
    images: [{ url: 'https://bousai-lab.vercel.app/ogp.svg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '防災Lab｜まんがで学ぶ在宅避難ガイド【武蔵野市対応】',
    description: '備えれば、家でも地域でも安心できる。まんがで学ぶ防災ガイド',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://bousai-lab.vercel.app/#website',
  url: 'https://bousai-lab.vercel.app/',
  name: '防災Lab',
  description: '備えれば安心できる。まんがで学ぶ在宅避難ガイド。防災リスとレスQロボが案内。',
  inLanguage: 'ja',
  publisher: {
    '@type': 'Person',
    name: 'くまごろう',
    jobTitle: '医師',
    url: 'https://bousai-lab.vercel.app/about',
  },
}

const CARD_CONFIG: Record<string, {
  bg: string; border: string; accent: string; desc: string
}> = {
  earthquake: { bg: '#FFF8F0', border: '#FF6B00', accent: '#FF6B00', desc: '揺れを感じたら今すぐ確認' },
  typhoon:    { bg: '#F0F4FF', border: '#3A5FFF', accent: '#3A5FFF', desc: '上陸前日に準備を完了させる' },
  blackout:   { bg: '#FFFBF0', border: '#E69500', accent: '#E69500', desc: '停電直後の3つの行動' },
  evacuation: { bg: '#F0FFF4', border: '#1E9E50', accent: '#1E9E50', desc: '避難指示が出たら即行動' },
}

export default function HomePage() {
  const recentArticles = getAllArticlesMeta().slice(0, 10)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(180deg, #C8E8FF 0%, #EAF6FF 35%, #FFFFFF 65%, #FFF7E6 100%)',
        padding: '36px 20px 44px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 雲の装飾 */}
        <div style={{
          position: 'absolute', top: 14, left: '4%',
          width: 90, height: 32, background: 'rgba(255,255,255,0.75)',
          borderRadius: 50, filter: 'blur(5px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 24, right: '8%',
          width: 130, height: 44, background: 'rgba(255,255,255,0.75)',
          borderRadius: 50, filter: 'blur(5px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 8, left: '35%',
          width: 60, height: 22, background: 'rgba(255,255,255,0.65)',
          borderRadius: 50, filter: 'blur(4px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          {/* 安心感バッジ */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.5)',
            color: '#15803D', padding: '5px 14px', borderRadius: 50,
            fontWeight: 700, fontSize: 12, marginBottom: 16, letterSpacing: '0.04em',
          }}>
            🌿 知って備えれば、きっと大丈夫
          </div>

          <h1 style={{
            color: '#1A3A5C', fontSize: 'clamp(22px, 5.5vw, 36px)',
            fontWeight: 900, lineHeight: 1.3, marginBottom: 10,
            fontFamily: 'Kaisei Decol, serif',
          }}>
            備えれば、<br />
            <span style={{ color: '#2563EB' }}>家でも地域でも安心できる</span>
          </h1>

          <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.75, marginBottom: 28 }}>
            防災リスとレスQロボが、地震・停電・避難所の<br />
            備えをやさしく案内します。
          </p>

          {/* キャラクター */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
            gap: 20, marginBottom: 28,
          }}>
            {/* 防災リス（左） */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: 'white', border: '2px solid #FCD34D',
                borderRadius: '16px 16px 16px 4px',
                padding: '8px 12px', maxWidth: 150,
                fontSize: 12, color: '#78350F', fontWeight: 600,
                lineHeight: 1.5, textAlign: 'left',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              }}>
                じしんや停電って、ちょっとこわいな…
              </div>
              <div style={{
                width: 76, height: 76,
                background: 'linear-gradient(135deg, #FEF9C3, #FFFBEB)',
                borderRadius: '50%', overflow: 'hidden',
                border: '3px solid #FCD34D',
                boxShadow: '0 4px 14px rgba(252,211,77,0.35)',
                flexShrink: 0,
              }}>
                <img src="/img/riss.png" alt="防災リス" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ fontSize: 11, color: '#92400E', fontWeight: 700 }}>防災リス 🐿️</div>
            </div>

            {/* レスQロボ（右） */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: 'white', border: '2px solid #60A5FA',
                borderRadius: '16px 16px 4px 16px',
                padding: '8px 12px', maxWidth: 160,
                fontSize: 12, color: '#1E3A5F', fontWeight: 600,
                lineHeight: 1.5, textAlign: 'left',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              }}>
                大丈夫。先に知って、少しずつ備えれば安心だ。
              </div>
              <div style={{
                width: 76, height: 76,
                background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
                borderRadius: 16, overflow: 'hidden',
                border: '3px solid #60A5FA',
                boxShadow: '0 4px 14px rgba(96,165,250,0.35)',
                flexShrink: 0,
              }}>
                <img src="/img/robot.png" alt="レスQロボ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ fontSize: 11, color: '#1E40AF', fontWeight: 700 }}>レスQロボ 🤖</div>
            </div>
          </div>

          {/* CTAボタン */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/musashino" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#1E40AF', color: 'white',
              padding: '11px 20px', borderRadius: 50,
              textDecoration: 'none', fontSize: 13, fontWeight: 700,
              boxShadow: '0 4px 12px rgba(30,64,175,0.3)',
            }}>
              📍 武蔵野市の防災を見る
            </Link>
            <Link href="/manga" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#15803D', color: 'white',
              padding: '11px 20px', borderRadius: 50,
              textDecoration: 'none', fontSize: 13, fontWeight: 700,
              boxShadow: '0 4px 12px rgba(21,128,61,0.3)',
            }}>
              📖 まんがで学ぶ
            </Link>
            <Link href="/checklist" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'white', color: '#1E40AF',
              border: '2px solid #1E40AF',
              padding: '10px 20px', borderRadius: 50,
              textDecoration: 'none', fontSize: 13, fontWeight: 700,
            }}>
              📋 チェックリスト
            </Link>
          </div>
        </div>
      </section>

      {/* ── まず何を知りたい？ ── */}
      <div style={{
        textAlign: 'center', padding: '24px 16px 6px',
        fontSize: 15, color: '#1A3A5C', fontWeight: 800,
      }}>
        まず何を知りたい？
      </div>

      {/* ── 4カテゴリカード ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '10px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {MAIN_CATEGORIES.map((key) => {
            const cat = CATEGORY_MAP[key]
            const cfg = CARD_CONFIG[key]
            return (
              <Link key={key} href={`/category/${key}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: cfg.bg, borderRadius: 18, padding: '22px 18px',
                  border: `2px solid ${cfg.border}`, height: '100%',
                  display: 'flex', flexDirection: 'column', gap: 14,
                  boxShadow: `0 2px 16px ${cfg.accent}18`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 32, flexShrink: 0 }}>{cat.emoji}</span>
                    <span style={{ fontSize: 'clamp(15px, 4vw, 18px)', fontWeight: 900, color: '#1A1A1A', lineHeight: 1.25 }}>
                      {cat.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#555', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                    {cfg.desc}
                  </p>
                  <div style={{
                    marginTop: 'auto', background: cfg.accent, color: 'white',
                    borderRadius: 10, padding: '11px 14px',
                    textAlign: 'center', fontSize: 13, fontWeight: 700,
                  }}>
                    確認する →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── 武蔵野市 大型CTA ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '16px 16px 0' }}>
        <Link href="/musashino" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
            borderRadius: 18, padding: '20px 22px',
            border: '2px solid #3B82F6',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 4px 24px rgba(59,130,246,0.12)',
          }}>
            <span style={{ fontSize: 40, flexShrink: 0 }}>📍</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#1E40AF', fontWeight: 900, fontSize: 16, marginBottom: 4 }}>
                武蔵野市在住の方へ
              </div>
              <div style={{ color: '#475569', fontSize: 13, lineHeight: 1.5 }}>
                避難所マップ・ハザードマップ・市の防災情報をまとめて確認
              </div>
            </div>
            <div style={{
              background: '#1E40AF', color: 'white',
              borderRadius: 10, padding: '10px 16px',
              fontSize: 13, fontWeight: 900, whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              見る →
            </div>
          </div>
        </Link>
      </section>

      {/* ── まんがで学ぶ防災 ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '16px 16px 0' }}>
        <div style={{
          background: 'white', borderRadius: 18, border: '2px solid #E2E8F0',
          overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
            padding: '12px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>📖</span>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>まんがで学ぶ防災</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>— 防災リス×レスQロボ</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#FFF9E6', overflow: 'hidden' }}>
                <img src="/img/riss.png" alt="防災リス" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: '#EFF6FF', overflow: 'hidden' }}>
                <img src="/img/robot.png" alt="レスQロボ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </div>
          </div>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MANGA_LIST.map((manga) => (
              <Link key={manga.slug} href={`/manga/${manga.slug}`} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#F8FAFC', borderRadius: 12, padding: '12px 14px',
                textDecoration: 'none', border: '1px solid #E2E8F0',
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{manga.emoji}</span>
                <span style={{ flex: 1, fontWeight: 700, fontSize: 13, color: '#0F172A', lineHeight: 1.4 }}>
                  {manga.title}
                </span>
                <span style={{ color: '#3B82F6', fontSize: 16, flexShrink: 0 }}>›</span>
              </Link>
            ))}
          </div>
          <div style={{
            borderTop: '1px solid #E2E8F0',
            padding: '10px 16px',
            display: 'flex', gap: 12, justifyContent: 'center',
          }}>
            <Link href="/manga" style={{
              color: '#3B82F6', fontWeight: 700, fontSize: 13,
              textDecoration: 'none',
            }}>
              すべてのまんがを見る →
            </Link>
            <Link href="/characters" style={{
              color: '#64748B', fontWeight: 600, fontSize: 13,
              textDecoration: 'none',
            }}>
              キャラクター紹介 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── よく読まれている記事 ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '16px 16px 0' }}>
        <div style={{
          background: 'white', borderRadius: 18,
          border: '2px solid #E2E8F0', overflow: 'hidden',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            background: '#F1F5F9', padding: '12px 18px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>📰</span>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>よく読まれている記事</span>
          </div>
          <div style={{
            padding: '12px 16px',
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
          }}>
            {recentArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#F8FAFC', borderRadius: 10, padding: '10px 12px',
                textDecoration: 'none', border: '1px solid #E2E8F0',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{article.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', lineHeight: 1.4 }}>
                  {article.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 希望メッセージ（レスQロボより） ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '16px 16px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
          borderRadius: 16, padding: '16px 18px',
          border: '2px solid #86EFAC',
          display: 'flex', alignItems: 'flex-start', gap: 14,
        }}>
          <div style={{
            width: 44, height: 44,
            background: 'white', overflow: 'hidden', flexShrink: 0,
            border: '2px solid #86EFAC', borderRadius: 10,
          }}>
            <img src="/img/robot.png" alt="レスQロボ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.75, margin: 0, fontWeight: 600 }}>
              <strong>「こわがるためではなく、守るための防災」</strong><br />
              このサイトでは、災害のときに家族を守る行動を、まんがと記事でやさしく学べます。少しずつ備えれば、大丈夫。
            </p>
          </div>
        </div>
      </section>

      {/* ── チェックリスト・グッズ導線 ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '12px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Link href="/checklist" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #F0FFF4, #ECFDF5)',
              borderRadius: 12, padding: '14px 16px',
              border: '2px solid #86EFAC', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 22 }}>📋</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#065F46' }}>防災チェックリスト</div>
                <div style={{ fontSize: 11, color: '#16A34A' }}>備えの確認はここから</div>
              </div>
              <span style={{ color: '#16A34A', fontSize: 18, marginLeft: 'auto' }}>›</span>
            </div>
          </Link>
          <Link href="/best-disaster-items" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #FFF7ED, #FEF9C3)',
              borderRadius: 12, padding: '14px 16px',
              border: '2px solid #FCD34D', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 22 }}>🎒</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#78350F' }}>おすすめ防災グッズ</div>
                <div style={{ fontSize: 11, color: '#B45309' }}>グッズ・食料・薬</div>
              </div>
              <span style={{ color: '#B45309', fontSize: 18, marginLeft: 'auto' }}>›</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── X導線 ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '12px 16px 28px' }}>
        <a
          href="https://x.com/zaitaku_bousai"
          target="_blank" rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #0F172A, #1E293B)',
            border: '1.5px solid #334155',
            borderRadius: 12, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, background: 'black',
              borderRadius: 10, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: 900,
              fontSize: 16, flexShrink: 0, letterSpacing: '-1px',
            }}>𝕏</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: 'white', marginBottom: 2 }}>
                防災ラボ｜在宅避難 @zaitaku_bousai
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                速報・実用情報を毎日発信。災害当日の行動指針はXで。
              </div>
            </div>
            <div style={{
              background: 'white', color: '#0F172A',
              borderRadius: 20, padding: '6px 12px',
              fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              フォロー
            </div>
          </div>
        </a>
      </section>

      {/* ── 監修者 ── */}
      <section style={{
        background: 'linear-gradient(160deg, #F0F9FF, #EFF6FF)',
        padding: '32px 20px',
        textAlign: 'center',
        borderTop: '2px solid #DBEAFE',
      }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🐻</div>
          <div style={{ color: '#1E40AF', fontWeight: 700, fontSize: 11, marginBottom: 8, letterSpacing: '0.08em' }}>
            SUPERVISED BY
          </div>
          <div style={{ color: '#1A3A5C', fontWeight: 900, fontSize: 17, marginBottom: 10 }}>
            くまごろう（現役勤務医師）
          </div>
          <div style={{
            background: 'white', border: '1px solid #BFDBFE',
            borderRadius: 12, padding: '12px 16px', marginBottom: 16,
            boxShadow: '0 2px 10px rgba(30,64,175,0.06)',
          }}>
            <p style={{ color: '#334155', fontSize: 12, lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
              「武蔵野市に実際に住んで感じるのは、日常の延長に災害があるということ。
              医師として、大家として、住民として——本当に役立つ情報だけを届けます。」
            </p>
          </div>
          <p style={{ color: '#64748B', fontSize: 12, lineHeight: 1.6, marginBottom: 18 }}>
            武蔵野市在住の現役勤務医師・マンションオーナー
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/about" style={{
              background: '#1E40AF', color: 'white',
              padding: '9px 22px', borderRadius: 50,
              textDecoration: 'none', fontSize: 12, fontWeight: 700,
            }}>
              プロフィールを見る
            </Link>
            <a href="https://x.com/zaitaku_bousai" target="_blank" rel="noopener noreferrer" style={{
              background: 'black', color: 'white',
              padding: '9px 22px', borderRadius: 50,
              textDecoration: 'none', fontSize: 12, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              𝕏 フォローする
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
