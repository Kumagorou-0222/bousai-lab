import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

const BASE_URL = 'https://bousai-lab.vercel.app'
const ACCENT = '#DC2626'
const ACCENT_BG = '#FEF2F2'
const ACCENT_LIGHT = '#FECACA'

export const metadata: Metadata = {
  title: '地震対策グッズ3点セット【これだけ揃えればOK】',
  description:
    '地震対策グッズはこの3点だけ。防災リュック・ヘルメット・家具固定。選び方と最低限の揃え方を武蔵野市在住の現役医師が解説。',
  alternates: { canonical: `${BASE_URL}/earthquake-items` },
  openGraph: {
    title: '地震対策グッズ3点セット【これだけ揃えればOK】',
    description: '地震対策はこの3つだけ。防災リュック・ヘルメット・家具固定。',
    url: `${BASE_URL}/earthquake-items`,
    images: [{ url: `${BASE_URL}/ogp.svg`, width: 1200, height: 630 }],
  },
}

const PRODUCTS = [
  {
    step: 1,
    priority: '最優先',
    name: '防災リュック（セット）',
    emoji: '🎒',
    reason: '何か1つだけ買うなら防災リュックセット。水・食料・ライト・救急用品が揃っている。中身を揃える手間がない。',
    spec: '15L以上・防水・反射材付き・中身入りセット',
    price: '5,000〜15,000円',
    url: `https://www.amazon.co.jp/s?k=防災リュック+セット+中身入り&tag=bousailab0c-22`,
    badgeText: '第1優先',
  },
  {
    step: 2,
    priority: '必須',
    name: '防災ヘルメット（折りたたみ式）',
    emoji: '⛑️',
    reason: '地震で一番多い死因は「家屋倒壊による圧死」と「落下物による頭部外傷」。ヘルメット1つで生存率が変わる。',
    spec: '折りたたみ式・軽量・防災規格適合',
    price: '3,000〜8,000円',
    url: `https://www.amazon.co.jp/s?k=防災ヘルメット+折りたたみ+軽量&tag=bousailab0c-22`,
    badgeText: '第2優先',
  },
  {
    step: 3,
    priority: '自宅の命綱',
    name: '家具転倒防止グッズ',
    emoji: '🪛',
    reason: 'ほとんどの怪我は避難中ではなく「自宅内での倒壊物による」もの。本棚・タンス・冷蔵庫を固定するだけで命を守れる。',
    spec: '突っ張り棒＋転倒防止板のセット',
    price: '1,500〜4,000円',
    url: `https://www.amazon.co.jp/s?k=家具転倒防止+突っ張り棒+セット&tag=bousailab0c-22`,
    badgeText: '在宅必須',
  },
]

export default function EarthquakeItemsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: '地震対策', href: '/category/earthquake' },
        { label: '地震対策グッズ' },
      ]} />

      {/* ヘッダー */}
      <div style={{
        background: ACCENT_BG, border: `1.5px solid ${ACCENT_LIGHT}`,
        borderRadius: 18, padding: '28px 22px', marginBottom: 28, textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🏚️</div>
        <div style={{
          display: 'inline-block', background: ACCENT, color: 'white',
          fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '4px 14px', marginBottom: 14,
        }}>
          地震対策グッズ — 厳選3点
        </div>
        <h1 style={{
          fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 900,
          color: '#0F172A', marginBottom: 8, fontFamily: 'Kaisei Decol, serif', lineHeight: 1.3,
        }}>
          地震が来る前に<br />これだけ揃えればOK
        </h1>
        <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          選択肢は3つだけ。迷わず今日注文できる。
        </p>
      </div>

      {/* ① 結論 */}
      <section style={{ marginBottom: 32 }}>
        <div style={{
          background: `linear-gradient(135deg, #991B1B 0%, ${ACCENT} 100%)`,
          borderRadius: 14, padding: '20px 20px',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>
            ✅ 結論 — これだけでOK
          </div>
          {['🎒 防災リュック（中身入りセット）', '⛑️ 折りたたみ式防災ヘルメット', '🪛 家具転倒防止グッズ'].map((item, i) => (
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
          なぜ地震対策が必要か
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { emoji: '🏠', text: '家屋倒壊・家具の落下で死亡するケースが最も多い' },
            { emoji: '📦', text: '食料・水は停電・断水で数時間で入手不可能になる' },
            { emoji: '🚗', text: '道路損壊で救急車が来るまで数時間〜数日かかることも' },
            { emoji: '😰', text: '準備なしに避難すると情報・食料・寒さに対応できない' },
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
          <h2 style={{ fontSize: 15, fontWeight: 900, color: '#7F1D1D', marginBottom: 14 }}>
            🛒 最低限セット — 合計10,000〜27,000円
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { item: '防災リュック（中身入りセット）', price: '5,000〜15,000円', must: true },
              { item: '折りたたみ式防災ヘルメット', price: '3,000〜8,000円', must: true },
              { item: '家具転倒防止グッズ（突っ張り棒セット）', price: '1,500〜4,000円', must: true },
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
                  background: ACCENT_BG, color: '#7F1D1D',
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
            { q: '防災リュックは中身入りと空きどちらがいい？', a: '中身入り一択。自分で揃えると必ず何かが抜ける。最初から入っているセットが確実。' },
            { q: 'ヘルメットは普通の自転車用でいい？', a: 'ダメ。防災規格は落下物への耐性が別物。折りたたみ式の防災専用を1つ買う。' },
            { q: '家具固定は何から始める？', a: '寝室の本棚・タンスから。寝ている間に倒れると逃げられない。優先順位はここ。' },
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
          <p style={{ fontSize: 13, color: '#7F1D1D', fontWeight: 700, lineHeight: 1.7, margin: 0 }}>
            地震対策は「揃える」ではなく「置く場所を決める」ことが大事。<br />
            リュックは玄関に、ヘルメットは枕元に。<br />
            今日注文して、届いたらその場所に置くだけで完了です。
          </p>
        </div>
      </section>

      {/* ⑦ CTA */}
      <section>
        <div style={{
          background: `linear-gradient(135deg, #991B1B 0%, ${ACCENT} 100%)`,
          borderRadius: 16, padding: '28px 22px', textAlign: 'center',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 20, fontWeight: 600 }}>
            🏚️ 地震はいつ来るかわからない。<br />今すぐ揃えて、あとは何も心配しない。
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400, margin: '0 auto' }}>
            <a href={`https://www.amazon.co.jp/s?k=防災リュック+セット+中身入り&tag=bousailab0c-22`}
              target="_blank" rel="noopener noreferrer sponsored"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#FF9900', color: '#111',
                padding: '14px 24px', borderRadius: 50,
                textDecoration: 'none', fontWeight: 900, fontSize: 14,
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}>
              🎒 まず防災リュックを買う →
            </a>
            <a href={`https://www.amazon.co.jp/s?k=防災ヘルメット+折りたたみ&tag=bousailab0c-22`}
              target="_blank" rel="noopener noreferrer sponsored"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'rgba(255,255,255,0.2)', color: 'white',
                padding: '12px 24px', borderRadius: 50,
                textDecoration: 'none', fontWeight: 700, fontSize: 13,
                border: '1px solid rgba(255,255,255,0.4)',
              }}>
              ⛑️ 防災ヘルメットを見る →
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
          <Link href="/category/earthquake" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#475569', fontSize: 12, fontWeight: 600 }}>
            🏚️ 地震の行動ガイドを見る
          </Link>
          <Link href="/blackout-items" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#475569', fontSize: 12, fontWeight: 600 }}>
            🔦 停電対策グッズ
          </Link>
          <Link href="/typhoon-items" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#475569', fontSize: 12, fontWeight: 600 }}>
            🌀 台風対策グッズ
          </Link>
        </div>
      </section>
    </div>
  )
}
