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
        background: 'linear-gradient(180deg, #4FC3F7 0%, #81D4FA 18%, #B3E5FC 48%, #E1F5FE 72%, #F5FBFF 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 太陽 */}
        <div style={{
          position: 'absolute', top: 20, right: '13%',
          width: 58, height: 58,
          background: 'radial-gradient(circle, #FFE082 30%, #FFD54F 65%, rgba(255,213,79,0) 100%)',
          borderRadius: '50%',
          boxShadow: '0 0 32px rgba(255,213,79,0.5)',
          pointerEvents: 'none',
        }} />

        {/* 雲1（左） */}
        <div style={{ position: 'absolute', top: 20, left: '2%', pointerEvents: 'none' }}>
          <div style={{ position: 'relative', width: 112, height: 50 }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, background: 'rgba(255,255,255,0.93)', borderRadius: 30 }} />
            <div style={{ position: 'absolute', bottom: 12, left: 10, width: 38, height: 38, background: 'rgba(255,255,255,0.93)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: 15, left: 36, width: 48, height: 48, background: 'rgba(255,255,255,0.93)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: 8, left: 70, width: 32, height: 32, background: 'rgba(255,255,255,0.93)', borderRadius: '50%' }} />
          </div>
        </div>

        {/* 雲2（中央） */}
        <div style={{ position: 'absolute', top: 8, left: '42%', pointerEvents: 'none' }}>
          <div style={{ position: 'relative', width: 82, height: 38 }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 22, background: 'rgba(255,255,255,0.85)', borderRadius: 20 }} />
            <div style={{ position: 'absolute', bottom: 8, left: 8, width: 28, height: 28, background: 'rgba(255,255,255,0.85)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: 10, left: 28, width: 36, height: 36, background: 'rgba(255,255,255,0.85)', borderRadius: '50%' }} />
          </div>
        </div>

        {/* 雲3（右） */}
        <div style={{ position: 'absolute', top: 30, right: '1%', pointerEvents: 'none' }}>
          <div style={{ position: 'relative', width: 128, height: 56 }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, background: 'rgba(255,255,255,0.88)', borderRadius: 30 }} />
            <div style={{ position: 'absolute', bottom: 14, left: 12, width: 42, height: 42, background: 'rgba(255,255,255,0.88)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: 18, left: 40, width: 52, height: 52, background: 'rgba(255,255,255,0.88)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: 10, left: 78, width: 36, height: 36, background: 'rgba(255,255,255,0.88)', borderRadius: '50%' }} />
          </div>
        </div>

        {/* テキストコンテンツ */}
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '46px 20px 20px', textAlign: 'center', position: 'relative' }}>
          {/* バッジ */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(255,255,255,0.95)',
            color: '#1565C0', padding: '5px 16px', borderRadius: 50,
            fontWeight: 700, fontSize: 12, marginBottom: 18,
            boxShadow: '0 2px 10px rgba(0,0,0,0.09)',
          }}>
            🏥 武蔵野市在住の現役医師が監修
          </div>

          <h1 style={{
            color: '#0D2B4E', fontSize: 'clamp(20px, 5vw, 34px)',
            fontWeight: 900, lineHeight: 1.3, marginBottom: 12,
            fontFamily: 'Kaisei Decol, serif',
            textShadow: '0 1px 4px rgba(255,255,255,0.8)',
          }}>
            こわがるためではなく、<br />
            <span style={{ color: '#1565C0' }}>守るための防災</span>
          </h1>

          <p style={{
            color: '#1A3A5C', fontSize: 14, lineHeight: 1.85, marginBottom: 26,
            textShadow: '0 1px 3px rgba(255,255,255,0.7)',
          }}>
            地震・停電・避難所を、まんがとやさしい解説で学ぼう。
          </p>

          {/* CTAボタン */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/musashino" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#1565C0', color: 'white',
              padding: '12px 22px', borderRadius: 50,
              textDecoration: 'none', fontSize: 13, fontWeight: 700,
              boxShadow: '0 4px 14px rgba(21,101,192,0.38)',
            }}>
              📍 武蔵野市の防災
            </Link>
            <Link href="/manga" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#2E7D32', color: 'white',
              padding: '12px 22px', borderRadius: 50,
              textDecoration: 'none', fontSize: 13, fontWeight: 700,
              boxShadow: '0 4px 14px rgba(46,125,50,0.38)',
            }}>
              📖 まんがで学ぶ
            </Link>
            <Link href="/checklist" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.92)', color: '#1565C0',
              border: '2px solid #1565C0',
              padding: '11px 22px', borderRadius: 50,
              textDecoration: 'none', fontSize: 13, fontWeight: 700,
              boxShadow: '0 2px 10px rgba(0,0,0,0.09)',
            }}>
              📋 防災チェックリスト
            </Link>
          </div>
        </div>

        {/* キャラクター＋街並みゾーン */}
        <div style={{ position: 'relative', height: 300, maxWidth: 680, margin: '0 auto' }}>
          {/* 防災リス（左） */}
          <div style={{
            position: 'absolute', bottom: 68, left: '4%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              background: 'white', border: '2.5px solid #FCD34D',
              borderRadius: '14px 14px 14px 4px',
              padding: '8px 12px', maxWidth: 132,
              fontSize: 12, color: '#78350F', fontWeight: 700,
              lineHeight: 1.55, boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
            }}>
              じしんや停電って、ちょっとこわいな…
            </div>
            <div style={{
              width: 88, height: 88,
              background: 'linear-gradient(135deg, #FEF9C3, #FFFBEB)',
              borderRadius: '50%', overflow: 'hidden',
              border: '3px solid #FCD34D',
              boxShadow: '0 4px 18px rgba(252,211,77,0.42)',
            }}>
              <img src="/img/riss.png" alt="防災リス" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ fontSize: 11, color: '#92400E', fontWeight: 800, textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>防災リス 🐿️</div>
          </div>

          {/* レスQロボ（右） */}
          <div style={{
            position: 'absolute', bottom: 68, right: '4%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              background: 'white', border: '2.5px solid #60A5FA',
              borderRadius: '14px 14px 4px 14px',
              padding: '8px 12px', maxWidth: 148,
              fontSize: 12, color: '#1E3A5F', fontWeight: 700,
              lineHeight: 1.55, boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
            }}>
              大丈夫。先に知って、少しずつ備えれば安心だ。
            </div>
            <div style={{
              width: 88, height: 88,
              background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
              borderRadius: 18, overflow: 'hidden',
              border: '3px solid #60A5FA',
              boxShadow: '0 4px 18px rgba(96,165,250,0.42)',
            }}>
              <img src="/img/robot.png" alt="レスQロボ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ fontSize: 11, color: '#1E40AF', fontWeight: 800, textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>レスQロボ 🤖</div>
          </div>

          {/* 街並みSVG */}
          <svg
            viewBox="0 0 800 90"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMax slice"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 90, display: 'block' }}
          >
            {/* 地面 */}
            <rect x="0" y="76" width="800" height="14" fill="#C8E6C9" />

            {/* 家1（水色） */}
            <rect x="4" y="52" width="56" height="26" fill="#BBDEFB" />
            <polygon points="4,52 60,52 32,33" fill="#90CAF9" />

            {/* 木1 */}
            <rect x="69" y="62" width="6" height="15" fill="#A1887F" />
            <ellipse cx="72" cy="57" rx="13" ry="14" fill="#66BB6A" />

            {/* 家2（黄色） */}
            <rect x="88" y="42" width="66" height="36" fill="#FFF9C4" />
            <polygon points="88,42 154,42 121,21" fill="#FFF176" />

            {/* 木2 */}
            <rect x="162" y="60" width="6" height="17" fill="#A1887F" />
            <ellipse cx="165" cy="54" rx="14" ry="15" fill="#81C784" />

            {/* 学校・コミュニティセンター（大きい・オレンジ） */}
            <rect x="183" y="26" width="106" height="52" fill="#FFE0B2" />
            <polygon points="183,26 289,26 236,4" fill="#FFCC80" />
            {/* 旗ポール */}
            <line x1="286" y1="2" x2="286" y2="26" stroke="#90A4AE" strokeWidth="1.5" />
            <rect x="286" y="2" width="16" height="10" fill="#EF9A9A" />

            {/* 木3 */}
            <rect x="298" y="57" width="6" height="20" fill="#A1887F" />
            <ellipse cx="301" cy="51" rx="15" ry="16" fill="#66BB6A" />

            {/* ===キャラゾーン 318〜482=== */}

            {/* 木4 */}
            <rect x="480" y="59" width="6" height="18" fill="#A1887F" />
            <ellipse cx="483" cy="53" rx="14" ry="15" fill="#81C784" />

            {/* マンション（紫） */}
            <rect x="497" y="32" width="80" height="46" fill="#E1BEE7" />
            <rect x="497" y="28" width="80" height="7" fill="#CE93D8" />

            {/* 木5 */}
            <rect x="585" y="62" width="6" height="15" fill="#A1887F" />
            <ellipse cx="588" cy="57" rx="13" ry="14" fill="#66BB6A" />

            {/* 家3（水色） */}
            <rect x="600" y="47" width="57" height="31" fill="#BBDEFB" />
            <polygon points="600,47 657,47 628,28" fill="#90CAF9" />

            {/* 木6 */}
            <rect x="663" y="63" width="5" height="14" fill="#A1887F" />
            <ellipse cx="665" cy="58" rx="12" ry="13" fill="#81C784" />

            {/* 家4（黄色） */}
            <rect x="677" y="51" width="58" height="27" fill="#FFF9C4" />
            <polygon points="677,51 735,51 706,33" fill="#FFF176" />

            {/* 右端（オレンジ） */}
            <rect x="750" y="57" width="50" height="21" fill="#FFE0B2" />
            <polygon points="750,57 800,57 775,41" fill="#FFCC80" />
          </svg>
        </div>
      </section>

      {/* ── まずは4コマで学ぶ ── */}
      <section style={{
        background: 'linear-gradient(135deg, #FFFDE7, #FFF8E1)',
        borderBottom: '3px solid #FFD54F',
        padding: '16px 20px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 10,
          }}>
            <span style={{ fontSize: 20 }}>📖</span>
            <span style={{ fontWeight: 900, fontSize: 15, color: '#5D4037' }}>まずは4コマで学ぶ</span>
            <span style={{ fontSize: 12, color: '#A1887F', fontWeight: 600 }}>— 防災リスとレスQロボが案内</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {MANGA_LIST.slice(0, 3).map((manga) => (
              <Link key={manga.slug} href={`/manga/${manga.slug}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'white', border: '1.5px solid #FFD54F',
                borderRadius: 50, padding: '7px 14px',
                textDecoration: 'none', fontSize: 12, fontWeight: 700,
                color: '#5D4037', boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
              }}>
                <span>{manga.emoji}</span>
                <span>{manga.title}</span>
              </Link>
            ))}
            <Link href="/manga" style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: '#FFD54F', border: '1.5px solid #FFB300',
              borderRadius: 50, padding: '7px 16px',
              textDecoration: 'none', fontSize: 12, fontWeight: 800,
              color: '#3E2723',
            }}>
              すべて見る →
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
