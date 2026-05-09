import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { PRODUCTS } from '@/lib/products'

export const metadata: Metadata = {
  title: '防災グッズ完全ガイド｜何を・いくつ・どれを買う？｜防災Lab',
  description: '携帯トイレ・モバイルバッテリー・LEDランタン・水…何をいくつ準備すればいい？漫画で理解して数字で納得できる防災グッズ選びガイド。医師監修。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/items' },
  openGraph: {
    title: '防災グッズ完全ガイド｜何を・いくつ・どれを買う？',
    description: '携帯トイレ・モバイルバッテリー・LEDランタンなど10品目の選び方を漫画で解説',
    url: 'https://bousai-lab.vercel.app/items',
  },
}

const PRIORITY_SLUGS = [
  'product-portable-toilet',
  'product-water-storage',
  'product-mobile-battery',
  'product-led-lantern',
  'product-cassette-stove',
]

const RANK: Record<string, string> = {
  'product-portable-toilet': 'S',
  'product-mobile-battery': 'S',
  'product-liquid-milk': 'S',
  'product-led-lantern': 'S',
  'product-water-storage': 'A',
  'product-cassette-stove': 'A',
  'product-preserved-food': 'A',
  'product-odor-bag': 'A',
  'product-cooler-box': 'A',
  'product-portable-power': 'A',
}

export default function ItemsPage() {
  const priorityProducts = PRIORITY_SLUGS.map((slug) => PRODUCTS.find((p) => p.mangaSlug === slug)!).filter(Boolean)
  const otherProducts = PRODUCTS.filter((p) => !PRIORITY_SLUGS.includes(p.mangaSlug))

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: '防災グッズガイド' },
      ]} />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: 20, padding: '32px 20px 28px', marginBottom: 32, textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)',
          color: '#FCD34D', padding: '5px 14px', borderRadius: 50,
          fontWeight: 700, fontSize: 12, marginBottom: 18,
        }}>
          🛒 防災グッズ完全ガイド
        </div>
        <h1 style={{
          color: 'white', fontSize: 'clamp(20px, 5vw, 30px)',
          fontWeight: 900, lineHeight: 1.35, marginBottom: 12,
          fontFamily: 'Kaisei Decol, serif',
        }}>
          何を・いくつ・どれを買えばいい？
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          漫画で「なぜ必要か」を理解してから、<br />
          数字で「いくつ必要か」を確認して準備しよう。
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/manga" style={{
            background: '#3B82F6', color: 'white',
            borderRadius: 50, padding: '10px 22px',
            textDecoration: 'none', fontSize: 13, fontWeight: 700,
          }}>
            🎨 漫画で学ぶ →
          </Link>
          <Link href="/checklist" style={{
            background: 'rgba(255,255,255,0.12)', color: 'white',
            borderRadius: 50, padding: '10px 22px',
            textDecoration: 'none', fontSize: 13, fontWeight: 700,
            border: '1px solid rgba(255,255,255,0.25)',
          }}>
            📋 チェックリスト →
          </Link>
        </div>
      </section>

      {/* まず揃える5つ */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0,
            fontFamily: 'Kaisei Decol, serif',
          }}>
            🏆 まず揃える5つ
          </h2>
        </div>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
          何から買うか迷ったらこの5つ。これだけで生存確率が大きく上がる。
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {priorityProducts.map((product, i) => (
            <Link key={product.mangaSlug} href={`/manga/${product.mangaSlug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white', borderRadius: 16, border: '2px solid #E2E8F0',
                padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: i === 0 ? '#FEF9C3' : '#F1F5F9',
                  color: i === 0 ? '#92400E' : '#475569',
                  fontSize: 15, fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{product.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A', marginBottom: 2 }}>{product.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{product.featured.trustText}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                  <span style={{
                    background: '#1E40AF', color: 'white',
                    borderRadius: 8, padding: '6px 12px',
                    fontSize: 11, fontWeight: 700,
                  }}>
                    漫画で学ぶ →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 全商品ランキング */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', marginBottom: 6, fontFamily: 'Kaisei Decol, serif' }}>
          📊 全グッズ一覧
        </h2>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
          重要度ランク別。各カードをタップすると漫画・比較表・商品が見られます。
        </p>

        {/* Sランク */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#FEF3C7', color: '#92400E',
            borderRadius: 50, padding: '4px 14px',
            fontSize: 12, fontWeight: 800, marginBottom: 12,
          }}>
            S ランク — 最優先で揃える
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {PRODUCTS.filter((p) => RANK[p.mangaSlug] === 'S').map((product) => (
              <Link key={product.mangaSlug} href={`/manga/${product.mangaSlug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: 14, border: '2px solid #FCD34D',
                  padding: '14px', textAlign: 'center',
                  boxShadow: '0 2px 10px rgba(251,191,36,0.15)',
                }}>
                  <div style={{ fontSize: 30, marginBottom: 6 }}>{product.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: '#0F172A', lineHeight: 1.4, marginBottom: 4 }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748B', lineHeight: 1.4, marginBottom: 8 }}>
                    {product.featured.price}
                  </div>
                  <div style={{
                    background: '#1E40AF', color: 'white',
                    borderRadius: 8, padding: '5px 0',
                    fontSize: 11, fontWeight: 700,
                  }}>
                    詳しく見る →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Aランク */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#F0F9FF', color: '#0369A1',
            borderRadius: 50, padding: '4px 14px',
            fontSize: 12, fontWeight: 800, marginBottom: 12,
          }}>
            A ランク — できれば揃える
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {PRODUCTS.filter((p) => RANK[p.mangaSlug] === 'A').map((product) => (
              <Link key={product.mangaSlug} href={`/manga/${product.mangaSlug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: 14, border: '1.5px solid #E2E8F0',
                  padding: '14px', textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{product.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', lineHeight: 1.4, marginBottom: 4 }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.4, marginBottom: 8 }}>
                    {product.featured.price}
                  </div>
                  <div style={{
                    background: '#F1F5F9', color: '#475569',
                    borderRadius: 8, padding: '5px 0',
                    fontSize: 11, fontWeight: 600,
                  }}>
                    詳しく見る →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 今すぐやること */}
      <section style={{
        background: '#F0FDF4', border: '2px solid #86EFAC',
        borderRadius: 16, padding: '24px', marginBottom: 32,
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#15803D', marginBottom: 16 }}>
          ✅ 今週中にやること
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { n: 1, text: '携帯トイレを数える（50回分×家族人数が目標）' },
            { n: 2, text: 'モバイルバッテリーを満充電にする（今すぐ）' },
            { n: 3, text: '水を数える（1人21本×家族人数）' },
            { n: 4, text: 'LEDランタンの電池を確認する' },
            { n: 5, text: 'カセットコンロのガス缶を数える（12本以上が目標）' },
          ].map((item) => (
            <div key={item.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                background: '#16A34A', color: 'white',
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{item.n}</span>
              <span style={{ fontSize: 14, color: '#166534', lineHeight: 1.7 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 著者メモ */}
      <div style={{
        background: '#FFFBEB', border: '1.5px solid #FCD34D',
        borderRadius: 14, padding: '18px 20px', marginBottom: 32,
        display: 'flex', gap: 14, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>🩺</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#92400E', marginBottom: 4 }}>
            医師・くまごろうからひとこと
          </div>
          <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.75, margin: 0 }}>
            「全部一度に揃えなくていい。まず携帯トイレとモバイルバッテリーだけ買えば、
            今日から格段に安心できる。少しずつ、確実に備えていきましょう。」
          </p>
        </div>
      </div>

      {/* ナビ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { href: '/manga', emoji: '🎨', label: '漫画で学ぶ防災', desc: '13作品すべて無料で読める' },
          { href: '/checklist', emoji: '📋', label: '防災チェックリスト', desc: '今の備えを確認しよう' },
          { href: '/category/blackout', emoji: '🔦', label: '停電対策記事一覧', desc: '詳しい解説記事' },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'white', border: '1.5px solid #E2E8F0',
            borderRadius: 12, padding: '14px 16px', textDecoration: 'none',
          }}>
            <span style={{ fontSize: 22 }}>{item.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{item.label}</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>{item.desc}</div>
            </div>
            <span style={{ color: '#94A3B8', fontSize: 18 }}>›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
