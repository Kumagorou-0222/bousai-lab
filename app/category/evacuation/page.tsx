import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/articles'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: '避難ってどうすればいい？完全ガイド｜防災Lab',
  description:
    'どこに逃げる？何を持っていく？家にいた方が安全？避難の基本・持ち物リスト・タイミングをわかりやすく解説。在宅避難のための実践ガイド。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/category/evacuation' },
  openGraph: {
    title: '避難ってどうすればいい？完全ガイド｜防災Lab',
    description: '避難の基本・持ち物・タイミング・在宅避難まで全部わかる。',
    url: 'https://bousai-lab.vercel.app/category/evacuation',
  },
}

const GUIDE_CARDS = [
  {
    title: '【結論】在宅避難が最強な理由',
    desc: '避難所に行くべき人・行かない方がいい人がわかる',
    href: '/home-evacuation',
    emoji: '🏠',
  },
  {
    title: '【完全版】避難持ち物リスト',
    desc: 'これだけ準備すればOK',
    href: '/evacuation-items',
    emoji: '🎒',
  },
  {
    title: '【重要】避難のタイミング',
    desc: '遅れると命に関わる判断基準',
    href: '/evacuation-timing',
    emoji: '⏰',
  },
]

const accent = '#16A34A'
const accentBg = '#F0FDF4'
const accentLight = '#BBF7D0'

export default function EvacuationCategoryPage() {
  const existingArticles = getArticlesByCategory('evacuation')

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: '避難が必要なとき' },
      ]} />

      {/* ===== ヒーロー ===== */}
      <section style={{
        textAlign: 'center',
        padding: '36px 20px 32px',
        background: 'linear-gradient(160deg, #0D3320 0%, #0F4D2E 100%)',
        borderRadius: 20,
        marginBottom: 24,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)',
          color: '#4ADE80', padding: '5px 14px', borderRadius: 50,
          fontWeight: 700, fontSize: 12, marginBottom: 18,
          letterSpacing: '0.04em',
        }}>
          🏃 避難完全ガイド
        </div>
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(22px, 6vw, 34px)',
          fontWeight: 900,
          lineHeight: 1.3,
          marginBottom: 16,
          fontFamily: 'Kaisei Decol, serif',
        }}>
          避難ってどうすればいい？
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: 15,
          lineHeight: 2.0,
          marginBottom: 18,
        }}>
          「どこに逃げる？」<br />
          「何を持っていく？」<br />
          「家にいた方が安全？」
        </p>
        <p style={{ color: '#4ADE80', fontWeight: 700, fontSize: 14, margin: 0 }}>
          👉 この記事を読めば全部わかります
        </p>
      </section>

      {/* ===== キャラ導入 ===== */}
      <section style={{
        background: accentBg,
        border: `1.5px solid ${accentLight}`,
        borderRadius: 14,
        padding: '18px 20px',
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.7 }}>
          🤖 <strong>レスQロボ：</strong>「避難は"早すぎる"より<strong>"遅れる"方が危険</strong>だ」
        </div>
        <div style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.7 }}>
          🐿 <strong>防災リス：</strong>「何を持って出ればいいの？」
        </div>
      </section>

      {/* ===== 読む順番 ===== */}
      <section style={{
        background: '#F8FAFC',
        border: '1.5px solid #E2E8F0',
        borderRadius: 14,
        padding: '20px 22px',
        marginBottom: 32,
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>
          👇 初めての人はここから
        </h2>
        <ol style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: '① 避難の基本', href: '/evacuation-basics' },
            { label: '② 在宅避難という選択', href: '/home-evacuation' },
            { label: '③ 持ち物リスト', href: '/evacuation-items' },
          ].map((item) => (
            <li key={item.href} style={{ fontSize: 14, color: '#334155', lineHeight: 1.5 }}>
              <Link href={item.href} style={{ color: accent, fontWeight: 700, textDecoration: 'none' }}>
                {item.label} →
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== 記事カード ===== */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>
          📚 避難を学ぶ
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GUIDE_CARDS.map((card, i) => (
            <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                border: `1.5px solid ${i === 0 ? accentLight : '#E2E8F0'}`,
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                boxShadow: i === 0 ? '0 2px 12px rgba(0,0,0,0.07)' : 'none',
                position: 'relative',
              }}>
                {i === 0 && (
                  <span style={{
                    position: 'absolute', top: -1, left: 14,
                    background: accent, color: 'white',
                    fontSize: 10, fontWeight: 700,
                    borderRadius: '0 0 6px 6px',
                    padding: '2px 8px',
                  }}>
                    まずはこれ
                  </span>
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: accentBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, flexShrink: 0,
                  marginTop: i === 0 ? 6 : 0,
                }}>
                  {card.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0, marginTop: i === 0 ? 6 : 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', lineHeight: 1.4, marginBottom: 4 }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>👉 {card.desc}</div>
                </div>
                <span style={{ color: accent, fontSize: 20, flexShrink: 0 }}>›</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 既存記事（動的） ===== */}
      {existingArticles.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#94A3B8',
            letterSpacing: '0.08em', marginBottom: 12,
          }}>
            詳しい行動ガイド — {existingArticles.length}本
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {existingArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'white', borderRadius: 14, padding: '16px 18px',
                  border: '1.5px solid #E2E8F0',
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: accentBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {article.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', lineHeight: 1.4, marginBottom: 4 }}>
                      {article.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.4 }}>
                      {article.description.slice(0, 55)}…
                    </div>
                  </div>
                  <span style={{ color: accent, fontSize: 18, flexShrink: 0 }}>›</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== マンガ導線 ===== */}
      <section style={{ marginBottom: 28 }}>
        <Link href="/manga/evacuation-basics" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
            border: `2px solid ${accentLight}`,
            borderRadius: 16,
            padding: '22px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}>
            <div>
              <div style={{ fontSize: 13, color: accent, fontWeight: 700, marginBottom: 6 }}>
                🎨 マンガで学ぶ避難
              </div>
              <div style={{ fontSize: 13, color: '#15803D' }}>
                👉 子どもでもわかるやさしい防災
              </div>
            </div>
            <div style={{
              background: accent, color: 'white',
              borderRadius: 10, padding: '10px 18px',
              fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              マンガを見る
            </div>
          </div>
        </Link>
      </section>

      {/* ===== CTA（収益導線） ===== */}
      <section style={{
        background: 'linear-gradient(160deg, #0D0D1A, #0A1A3A)',
        borderRadius: 20,
        padding: '28px 24px',
        marginBottom: 28,
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#FFD000', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          👇 今すぐ準備する
        </h2>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8,
          flexWrap: 'wrap', marginBottom: 20,
        }}>
          {['防災リュック', 'ポータブル電源', '飲料水', '携帯トイレ'].map((item) => (
            <span key={item} style={{
              background: 'rgba(255,208,0,0.12)',
              border: '1px solid rgba(255,208,0,0.3)',
              color: '#FFD000',
              borderRadius: 50, padding: '6px 14px',
              fontSize: 12, fontWeight: 700,
            }}>
              ✓ {item}
            </span>
          ))}
        </div>
        <Link href="/goods" style={{
          display: 'inline-block',
          background: '#FF6B00', color: 'white',
          borderRadius: 12, padding: '14px 32px',
          textDecoration: 'none', fontSize: 15, fontWeight: 700,
          boxShadow: '0 4px 16px rgba(255,107,0,0.4)',
        }}>
          おすすめを見る →
        </Link>
      </section>

      {/* ===== キャラ締め ===== */}
      <section style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
        <div style={{
          flex: 1,
          background: '#FFF8F0', border: '1.5px solid #FECFAA',
          padding: '16px 18px', borderRadius: 14,
          fontSize: 13, lineHeight: 1.7, color: '#1A1A1A',
        }}>
          🐿 <strong>防災リス：</strong><br />「ちゃんと準備しておけば安心だね！」
        </div>
        <div style={{
          flex: 1,
          background: accentBg, border: `1.5px solid ${accentLight}`,
          padding: '16px 18px', borderRadius: 14,
          fontSize: 13, lineHeight: 1.7, color: '#1A1A1A',
        }}>
          🤖 <strong>レスQロボ：</strong><br />「"備えた人"だけが助かる」
        </div>
      </section>

      {/* ===== 他カテゴリ ===== */}
      <section>
        <div style={{
          fontSize: 11, fontWeight: 700, color: '#94A3B8',
          letterSpacing: '0.08em', marginBottom: 12,
        }}>
          他の状況を確認する
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { key: 'earthquake', emoji: '🏚️', label: '地震が起きたとき' },
            { key: 'typhoon', emoji: '🌀', label: '台風が来る前' },
            { key: 'blackout', emoji: '🔦', label: '停電したとき' },
            { key: 'disaster-prep', emoji: '🎒', label: '備蓄・準備' },
          ].map((c) => (
            <Link key={c.key} href={`/category/${c.key}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'white', border: '1.5px solid #E2E8F0',
              borderRadius: 50, padding: '8px 16px',
              textDecoration: 'none', color: '#475569',
              fontSize: 12, fontWeight: 600,
            }}>
              {c.emoji} {c.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
