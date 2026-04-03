import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticlesMeta, CATEGORY_MAP } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import RakutenBanner from '@/components/RakutenBanner'

export const metadata: Metadata = {
  title: '在宅避難ラボ｜武蔵野市の防災・避難所・防災グッズ完全ガイド',
  description:
    '武蔵野市在住の現役勤務医師・大家さんが作った防災サイト。在宅避難の方法、武蔵野市の避難所一覧（20か所）・浸水ハザードマップ、防災グッズ完全ガイドを掲載。医師の視点で、命を守る防災知識をわかりやすく解説。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/' },
  openGraph: {
    title: '在宅避難ラボ｜武蔵野市の防災・避難所・防災グッズ完全ガイド',
    description: '武蔵野市在住の現役勤務医師・大家さんが作った防災サイト。医師の視点で在宅避難・避難所・防災グッズを解説。',
    url: 'https://bousai-lab.vercel.app/',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://bousai-lab.vercel.app/#website',
  url: 'https://bousai-lab.vercel.app/',
  name: '在宅避難ラボ',
  description: '武蔵野市在住の現役勤務医師・大家さんが作った防災サイト。在宅避難の方法、避難所一覧、防災グッズを医師の視点で解説。',
  inLanguage: 'ja',
  publisher: {
    '@type': 'Person',
    name: 'くまごろう',
    jobTitle: '医師',
    url: 'https://bousai-lab.vercel.app/about',
    description: '武蔵野市在住の現役勤務医師。マンション経営も行う大家さん。医師の視点から防災情報を発信。',
    knowsAbout: ['防災', '在宅避難', '災害医療', '武蔵野市', '感染症対策'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: '武蔵野市',
      addressRegion: '東京都',
      addressCountry: 'JP',
    },
  },
}

export default function HomePage() {
  const allArticles = getAllArticlesMeta()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #FF6B00 0%, #FF9500 60%, #FFD000 100%)',
        padding: '60px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'white', color: '#FF6B00', padding: '6px 20px', borderRadius: 50, fontWeight: 700, fontSize: 13, marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            🩺 武蔵野市在住の現役医師が監修
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 900, lineHeight: 1.3, marginBottom: 12, textShadow: '0 2px 8px rgba(0,0,0,0.15)', fontFamily: 'Kaisei Decol, serif' }}>
            在宅避難ラボ<br />
            <span style={{ fontSize: '0.6em', fontWeight: 700 }}>自宅を最強の避難場所にしよう</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
            武蔵野市在住の現役勤務医師・大家さんが、医師の視点で防災・在宅避難情報を発信。<br />
            武蔵野市の避難所一覧・浸水ハザードマップ・防災グッズガイドを掲載。
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/articles/earthquake-zaitaku" style={{ background: 'white', color: '#FF6B00', fontWeight: 700, padding: '12px 28px', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', fontSize: 15 }}>
              🏠 在宅避難とは？
            </Link>
            <Link href="/articles/disaster-prep-goods" style={{ background: '#FFD000', color: '#1A1A1A', fontWeight: 700, padding: '12px 28px', borderRadius: 50, textDecoration: 'none', fontSize: 15 }}>
              🎒 防災グッズリスト
            </Link>
          </div>
        </div>
      </section>

      {/* カテゴリナビ */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 20px 0' }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20, fontFamily: 'Kaisei Decol, serif', color: '#1A1A1A' }}>
          カテゴリから探す
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {(Object.entries(CATEGORY_MAP) as [string, typeof CATEGORY_MAP[keyof typeof CATEGORY_MAP]][]).map(([key, cat]) => (
            <Link key={key} href={`/category/${key}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: 16, padding: '24px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(255,107,0,0.1)', border: '2px solid transparent', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>{cat.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1A1A', marginBottom: 6 }}>{cat.label}</div>
                <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{cat.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 新着記事 */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px 80px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20, fontFamily: 'Kaisei Decol, serif', color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 12 }}>
          📰 新着記事
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {allArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* 楽天・Amazonバナー */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        <RakutenBanner />
      </section>

      {/* 著者プロフィール */}
      <section style={{ background: '#FFF3E0', padding: '48px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #FF6B00, #FFD000)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, flexShrink: 0 }}>
            🐻
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 11, color: '#FF6B00', fontWeight: 700, marginBottom: 4 }}>このサイトの監修者</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#1A1A1A' }}>くまごろう</div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>
              🩺 武蔵野市在住・現役勤務医師<br />
              🏢 武蔵野市マンションオーナー（大家さん）<br />
              医師として「命を守る防災知識」を、大家として「自宅を最強の避難場所にする備え」をわかりやすく発信しています。
            </div>
            <Link href="/about" style={{ display: 'inline-block', marginTop: 12, color: '#FF6B00', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              詳しいプロフィール →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
