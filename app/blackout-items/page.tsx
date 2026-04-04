import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

const BASE_URL = 'https://bousai-lab.vercel.app'
const ACCENT = '#D97706'
const ACCENT_BG = '#FFFBEB'
const ACCENT_LIGHT = '#FDE68A'

export const metadata: Metadata = {
  title: '停電対策グッズ3点セット【これだけ揃えればOK】',
  description:
    '停電したときに本当に必要なグッズは3つだけ。モバイルバッテリー・懐中電灯・ポータブル電源。選び方と最低限の揃え方を現役医師が解説。',
  alternates: { canonical: `${BASE_URL}/blackout-items` },
  openGraph: {
    title: '停電対策グッズ3点セット【これだけ揃えればOK】',
    description: '停電対策はこの3つだけ。モバイルバッテリー・懐中電灯・ポータブル電源。',
    url: `${BASE_URL}/blackout-items`,
    images: [{ url: `${BASE_URL}/ogp.svg`, width: 1200, height: 630 }],
  },
}

const PRODUCTS = [
  {
    step: 1,
    priority: '最優先',
    name: 'モバイルバッテリー（大容量）',
    emoji: '🔋',
    reason: 'スマホが死ぬと情報が途絶える。充電できる状態を維持するのが最優先。',
    spec: '容量20,000mAh以上・USB-C対応',
    price: '3,000〜6,000円',
    url: `https://www.amazon.co.jp/s?k=モバイルバッテリー+20000mAh+USB-C&tag=bousailab0c-22`,
    badgeText: '第1優先',
  },
  {
    step: 2,
    priority: '必須',
    name: 'LEDランタン',
    emoji: '🔦',
    reason: '暗闇での移動・生活に必須。懐中電灯より両手が使えるランタン型が実用的。',
    spec: '充電式・防水・明るさ調整付き',
    price: '2,000〜5,000円',
    url: `https://www.amazon.co.jp/s?k=LEDランタン+充電式+防水+防災&tag=bousailab0c-22`,
    badgeText: '第2優先',
  },
  {
    step: 3,
    priority: '長期停電対策',
    name: 'ポータブル電源',
    emoji: '⚡',
    reason: '3日以上の停電で冷蔵庫・医療機器・スマホ複数台の充電に対応できる。',
    spec: '容量500Wh以上・AC出力付き',
    price: '30,000〜70,000円',
    url: `https://www.amazon.co.jp/s?k=ポータブル電源+500Wh+AC出力&tag=bousailab0c-22`,
    badgeText: '長期備え',
  },
]

export default function BlackoutItemsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: '停電対策', href: '/category/blackout' },
        { label: '停電対策グッズ' },
      ]} />

      {/* ヘッダー */}
      <div style={{
        background: ACCENT_BG, border: `1.5px solid ${ACCENT_LIGHT}`,
        borderRadius: 18, padding: '28px 22px', marginBottom: 28, textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🔦</div>
        <div style={{
          display: 'inline-block', background: ACCENT, color: 'white',
          fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '4px 14px', marginBottom: 14,
        }}>
          停電対策グッズ — 厳選3点
        </div>
        <h1 style={{
          fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 900,
          color: '#0F172A', marginBottom: 8, fontFamily: 'Kaisei Decol, serif', lineHeight: 1.3,
        }}>
          停電したら<br />これだけ揃えればOK
        </h1>
        <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          余計なものは要らない。この3点で停電を乗り切れる。
        </p>
      </div>

      {/* ① 結論 */}
      <section style={{ marginBottom: 32 }}>
        <div style={{
          background: `linear-gradient(135deg, #92400E 0%, ${ACCENT} 100%)`,
          borderRadius: 14, padding: '20px 20px',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>
            ✅ 結論 — これだけでOK
          </div>
          {['🔋 モバイルバッテリー（20,000mAh以上）', '🔦 LEDランタン（充電式・防水）', '⚡ ポータブル電源（500Wh以上）'].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
              borderRadius: 10, padding: '11px 14px', marginBottom: i < 2 ? 8 : 0,
            }}>
              <div style={{
                width: 24, height: 24, background: 'rgba(255,255,255,0.2)',
                borderRadius: 6, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 900, fontSize: 12, color: 'white', flexShrink: 0,
              }}>{i + 1}</div>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ② なぜ必要か */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          fontSize: 17, fontWeight: 900, color: '#0F172A',
          fontFamily: 'Kaisei Decol, serif', marginBottom: 14,
          paddingBottom: 8, borderBottom: `2px solid ${ACCENT}`,
        }}>
          なぜ停電が怖いのか
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { emoji: '📱', text: 'スマホが充電できないと避難情報が入らない' },
            { emoji: '🌑', text: '暗闇での転倒・けがリスクが一気に上がる' },
            { emoji: '🧊', text: '冷蔵庫が止まり食料が数時間で腐る' },
            { emoji: '💊', text: '医療機器・電動ベッドが使えなくなる' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'white', borderRadius: 10, padding: '12px 14px',
              border: '1.5px solid #E2E8F0',
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.emoji}</span>
              <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ③ 最低限セット */}
      <section style={{ marginBottom: 32 }}>
        <div style={{
          background: ACCENT_BG, border: `1.5px solid ${ACCENT_LIGHT}`,
          borderRadius: 14, padding: '18px 20px',
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, color: '#92400E', marginBottom: 14 }}>
            🛒 最低限セット — 合計5,000〜11,000円
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { item: 'モバイルバッテリー 20,000mAh', price: '3,000〜6,000円', must: true },
              { item: 'LEDランタン（充電式）', price: '2,000〜5,000円', must: true },
              { item: 'ポータブル電源（予算あれば）', price: '30,000〜70,000円', must: false },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'white', borderRadius: 8, padding: '10px 14px',
                border: row.must ? `1.5px solid ${ACCENT}` : '1.5px solid #E2E8F0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {row.must && (
                    <span style={{
                      background: ACCENT, color: 'white', fontSize: 9, fontWeight: 700,
                      borderRadius: 4, padding: '2px 6px', flexShrink: 0,
                    }}>必須</span>
                  )}
                  <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>{row.item}</span>
                </div>
                <span style={{ fontSize: 12, color: ACCENT, fontWeight: 700, flexShrink: 0 }}>{row.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ④ 商品ごとの説明 */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          fontSize: 17, fontWeight: 900, color: '#0F172A',
          fontFamily: 'Kaisei Decol, serif', marginBottom: 4,
          paddingBottom: 8, borderBottom: `2px solid ${ACCENT}`,
        }}>
          各グッズの選び方と買い場所
        </h2>
        <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 18 }}>
          ※ 価格帯・仕様は2025年時点の目安です
        </p>
        {PRODUCTS.map((p) => (
          <div key={p.step} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 28, height: 28, background: ACCENT, color: 'white',
                borderRadius: 8, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 900, fontSize: 13, flexShrink: 0,
              }}>{p.step}</div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {p.name}
              </h3>
              <span style={{
                background: ACCENT_BG, color: ACCENT,
                fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '2px 8px',
              }}>{p.priority}</span>
            </div>
            <div style={{
              background: '#F8FAFC', borderRadius: 10, padding: '12px 14px',
              border: '1px solid #E2E8F0', marginBottom: 10,
            }}>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: '0 0 8px' }}>
                {p.reason}
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{
                  background: ACCENT_BG, color: '#92400E',
                  fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '3px 10px',
                }}>推奨スペック: {p.spec}</span>
                <span style={{
                  background: '#F0FDF4', color: '#14532D',
                  fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '3px 10px',
                }}>目安: {p.price}</span>
              </div>
            </div>
            <a href={p.url} target="_blank" rel="noopener noreferrer sponsored" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'white', border: `1.5px solid ${ACCENT}44`,
              borderRadius: 12, padding: '12px 16px', textDecoration: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>{p.emoji}</span>
                <div>
                  <div style={{
                    background: ACCENT, color: 'white', fontSize: 9, fontWeight: 700,
                    borderRadius: 4, padding: '2px 6px', display: 'inline-block', marginBottom: 3,
                  }}>{p.badgeText}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{p.name}を見る</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>Amazon で検索する</div>
                </div>
              </div>
              <div style={{
                background: '#FF9900', color: 'white',
                fontSize: 11, fontWeight: 700, borderRadius: 8, padding: '7px 12px', flexShrink: 0,
              }}>
                Amazonで見る →
              </div>
            </a>
          </div>
        ))}
      </section>

      {/* ⑤ 選び方 */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          fontSize: 17, fontWeight: 900, color: '#0F172A',
          fontFamily: 'Kaisei Decol, serif', marginBottom: 14,
          paddingBottom: 8, borderBottom: `2px solid ${ACCENT}`,
        }}>
          迷ったときの選び方
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { q: 'モバイルバッテリーは何mAhがいい？', a: '20,000mAh。スマホ4〜5回充電できる。それ以上は重くなるだけ。' },
            { q: 'ランタンと懐中電灯どちらを買う？', a: 'ランタン一択。両手が使えて、テーブルに置ける。懐中電灯は2番手でいい。' },
            { q: 'ポータブル電源は今すぐ必要？', a: '1日停電ならモバイルバッテリーで十分。まずそこから始めれば今日解決できる。' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 12, padding: '14px 16px',
              border: '1.5px solid #E2E8F0',
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 6 }}>
                <span style={{ color: ACCENT, fontWeight: 900 }}>Q. </span>{item.q}
              </div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
                <span style={{ color: '#16A34A', fontWeight: 900 }}>→ </span>{item.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⑥ まとめ */}
      <section style={{ marginBottom: 32 }}>
        <div style={{
          background: ACCENT_BG, border: `1.5px solid ${ACCENT_LIGHT}`,
          borderLeft: `4px solid ${ACCENT}`,
          borderRadius: 10, padding: '14px 18px',
        }}>
          <p style={{ fontSize: 13, color: '#78350F', fontWeight: 700, lineHeight: 1.7, margin: 0 }}>
            停電対策は「スマホを生かす」ことが最優先。<br />
            モバイルバッテリーを1つ持つだけで、停電への不安は半分になります。<br />
            今日、この瞬間に注文できます。
          </p>
        </div>
      </section>

      {/* ⑦ CTA */}
      <section>
        <div style={{
          background: `linear-gradient(135deg, #92400E 0%, ${ACCENT} 100%)`,
          borderRadius: 16, padding: '28px 22px', textAlign: 'center',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 20, fontWeight: 600 }}>
            ⚡ 停電はいつ来るかわからない。<br />今すぐ揃えて、あとは何も心配しない。
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400, margin: '0 auto' }}>
            <a href={`https://www.amazon.co.jp/s?k=モバイルバッテリー+20000mAh&tag=bousailab0c-22`}
              target="_blank" rel="noopener noreferrer sponsored"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#FF9900', color: '#111',
                padding: '14px 24px', borderRadius: 50,
                textDecoration: 'none', fontWeight: 900, fontSize: 14,
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}>
              🔋 まずモバイルバッテリーを買う →
            </a>
            <a href={`https://www.amazon.co.jp/s?k=LEDランタン+充電式+防災&tag=bousailab0c-22`}
              target="_blank" rel="noopener noreferrer sponsored"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'rgba(255,255,255,0.2)', color: 'white',
                padding: '12px 24px', borderRadius: 50,
                textDecoration: 'none', fontWeight: 700, fontSize: 13,
                border: '1px solid rgba(255,255,255,0.4)',
              }}>
              🔦 LEDランタンを見る →
            </a>
          </div>
        </div>
      </section>

      {/* 関連リンク */}
      <section style={{ marginTop: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: 10 }}>
          他のカテゴリも見る
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link href="/category/blackout" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#475569', fontSize: 12, fontWeight: 600 }}>
            🔦 停電の行動ガイドを見る
          </Link>
          <Link href="/earthquake-items" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#475569', fontSize: 12, fontWeight: 600 }}>
            🏚️ 地震対策グッズ
          </Link>
          <Link href="/typhoon-items" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#475569', fontSize: 12, fontWeight: 600 }}>
            🌀 台風対策グッズ
          </Link>
        </div>
      </section>
    </div>
  )
}
