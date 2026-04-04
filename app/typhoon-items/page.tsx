import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

const BASE_URL = 'https://bousai-lab.vercel.app'
const ACCENT = '#2563EB'
const ACCENT_BG = '#EFF6FF'
const ACCENT_LIGHT = '#BFDBFE'

export const metadata: Metadata = {
  title: '台風対策グッズ3点セット【これだけ揃えればOK】',
  description:
    '台風対策グッズはこの3点だけ。保存水・非常食・養生テープ。台風が来る前日までに揃える方法を現役医師が解説。',
  alternates: { canonical: `${BASE_URL}/typhoon-items` },
  openGraph: {
    title: '台風対策グッズ3点セット【これだけ揃えればOK】',
    description: '台風対策はこの3つだけ。保存水・非常食・養生テープ。',
    url: `${BASE_URL}/typhoon-items`,
    images: [{ url: `${BASE_URL}/ogp.svg`, width: 1200, height: 630 }],
  },
}

const PRODUCTS = [
  {
    step: 1,
    priority: '最優先',
    name: '保存水（2Lペットボトル）',
    emoji: '💧',
    reason: '台風通過後の断水は数日続くことがある。1人1日3Lが目安。家族3人なら最低9L（3日分）を確保。',
    spec: '保存期間5年以上・2Lペット×6本以上',
    price: '1,500〜3,500円（12本ケース）',
    url: `https://www.amazon.co.jp/s?k=保存水+2L+5年+ケース&tag=bousailab0c-22`,
    badgeText: '第1優先',
  },
  {
    step: 2,
    priority: '必須',
    name: '非常食（5日分セット）',
    emoji: '🍱',
    reason: '台風後のスーパーは即座に棚が空になる。最低5日分あれば落ち着いて行動できる。カロリーと食べやすさで選ぶ。',
    spec: '5年以上保存・加熱不要・1人5日分',
    price: '3,000〜8,000円',
    url: `https://www.amazon.co.jp/s?k=非常食+セット+5日分+加熱不要&tag=bousailab0c-22`,
    badgeText: '第2優先',
  },
  {
    step: 3,
    priority: '窓ガラス対策',
    name: '養生テープ・飛散防止フィルム',
    emoji: '🪟',
    reason: '台風の強風で窓ガラスが割れると室内に破片が飛び散る。養生テープを×字に貼るだけで飛散を大幅に抑えられる。',
    spec: '養生テープ（幅50mm）＋窓ガラス飛散防止フィルム',
    price: '1,000〜3,000円',
    url: `https://www.amazon.co.jp/s?k=養生テープ+窓ガラス飛散防止&tag=bousailab0c-22`,
    badgeText: '窓対策必須',
  },
]

export default function TyphoonItemsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: '台風対策', href: '/category/typhoon' },
        { label: '台風対策グッズ' },
      ]} />

      {/* ヘッダー */}
      <div style={{
        background: ACCENT_BG, border: `1.5px solid ${ACCENT_LIGHT}`,
        borderRadius: 18, padding: '28px 22px', marginBottom: 28, textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🌀</div>
        <div style={{
          display: 'inline-block', background: ACCENT, color: 'white',
          fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '4px 14px', marginBottom: 14,
        }}>
          台風対策グッズ — 厳選3点
        </div>
        <h1 style={{
          fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 900,
          color: '#0F172A', marginBottom: 8, fontFamily: 'Kaisei Decol, serif', lineHeight: 1.3,
        }}>
          台風が来る前に<br />これだけ揃えればOK
        </h1>
        <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          上陸前日までに揃えれば間に合う。3点だけ。
        </p>
      </div>

      {/* ① 結論 */}
      <section style={{ marginBottom: 32 }}>
        <div style={{
          background: `linear-gradient(135deg, #1E40AF 0%, ${ACCENT} 100%)`,
          borderRadius: 14, padding: '20px 20px',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>
            ✅ 結論 — これだけでOK
          </div>
          {['💧 保存水（2L×6本以上）', '🍱 非常食（5日分セット）', '🪟 養生テープ＋飛散防止フィルム'].map((item, i) => (
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
          なぜ台風前の準備が必要か
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { emoji: '🛒', text: '台風情報が出た瞬間、スーパーから水・食料が消える' },
            { emoji: '💧', text: '浸水・停電で断水が数日〜1週間続くことがある' },
            { emoji: '🪟', text: '強風で窓ガラスが割れると室内が危険地帯になる' },
            { emoji: '🚧', text: '台風通過中は外に出られず、不足しても調達できない' },
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
          <h2 style={{ fontSize: 15, fontWeight: 900, color: '#1E3A8A', marginBottom: 14 }}>
            🛒 最低限セット — 合計5,500〜14,500円
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { item: '保存水 2L×12本（ケース）', price: '1,500〜3,500円', must: true },
              { item: '非常食セット（5日分）', price: '3,000〜8,000円', must: true },
              { item: '養生テープ＋飛散防止フィルム', price: '1,000〜3,000円', must: true },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'white', borderRadius: 8, padding: '10px 14px',
                border: `1.5px solid ${ACCENT}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    background: ACCENT, color: 'white', fontSize: 9, fontWeight: 700,
                    borderRadius: 4, padding: '2px 6px', flexShrink: 0,
                  }}>必須</span>
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
                  background: ACCENT_BG, color: '#1E40AF',
                  fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '3px 10px',
                }}>推奨: {p.spec}</span>
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
            { q: '水はどのくらい買えばいい？', a: '1人1日3L×家族の人数×7日分。2Lペット×3本×人数が目安。重いので分けて保管してもいい。' },
            { q: '非常食は何を選ぶ？', a: 'アルファ米・缶詰・レトルト米を組み合わせる。「加熱不要で食べられるもの」を最低1割入れる。' },
            { q: '養生テープはどこに貼る？', a: '窓の全面に×字または格子状。端まで貼る。粘着が残るので終わったらすぐ剥がす。' },
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
          <p style={{ fontSize: 13, color: '#1E3A8A', fontWeight: 700, lineHeight: 1.7, margin: 0 }}>
            台風対策は「前日に揃える」が最低ライン。<br />
            当日になってからでは遅い。スーパーから水と食料は消えている。<br />
            台風情報を見た今、この瞬間に注文するのが正解です。
          </p>
        </div>
      </section>

      {/* ⑦ CTA */}
      <section>
        <div style={{
          background: `linear-gradient(135deg, #1E40AF 0%, ${ACCENT} 100%)`,
          borderRadius: 16, padding: '28px 22px', textAlign: 'center',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 20, fontWeight: 600 }}>
            🌀 台風が来てから準備しても間に合わない。<br />今すぐ揃えて、あとは何も心配しない。
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400, margin: '0 auto' }}>
            <a href={`https://www.amazon.co.jp/s?k=保存水+2L+5年+ケース&tag=bousailab0c-22`}
              target="_blank" rel="noopener noreferrer sponsored"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#FF9900', color: '#111',
                padding: '14px 24px', borderRadius: 50,
                textDecoration: 'none', fontWeight: 900, fontSize: 14,
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}>
              💧 まず保存水を買う →
            </a>
            <a href={`https://www.amazon.co.jp/s?k=非常食+セット+5日分&tag=bousailab0c-22`}
              target="_blank" rel="noopener noreferrer sponsored"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'rgba(255,255,255,0.2)', color: 'white',
                padding: '12px 24px', borderRadius: 50,
                textDecoration: 'none', fontWeight: 700, fontSize: 13,
                border: '1px solid rgba(255,255,255,0.4)',
              }}>
              🍱 非常食セットを見る →
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
          <Link href="/category/typhoon" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#475569', fontSize: 12, fontWeight: 600 }}>
            🌀 台風の行動ガイドを見る
          </Link>
          <Link href="/earthquake-items" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#475569', fontSize: 12, fontWeight: 600 }}>
            🏚️ 地震対策グッズ
          </Link>
          <Link href="/blackout-items" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#475569', fontSize: 12, fontWeight: 600 }}>
            🔦 停電対策グッズ
          </Link>
        </div>
      </section>
    </div>
  )
}
