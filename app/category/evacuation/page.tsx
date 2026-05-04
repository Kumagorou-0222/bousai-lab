import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/articles'
import Breadcrumb from '@/components/Breadcrumb'
import CategoryHero from '@/components/CategoryHero'

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
    title: '【重要】避難のタイミング判断',
    desc: '警戒レベル4で即避難——迷わない判断基準',
    href: '/articles/evacuation-timing',
    emoji: '⏰',
  },
  {
    title: '【完全版】非常持ち出し袋の中身',
    desc: '医師が選ぶ優先順位と量の目安',
    href: '/articles/evacuation-bag',
    emoji: '🎒',
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

      {/* ① CategoryHero */}
      <CategoryHero
        category="evacuation"
        title="避難所を学ぼう"
        rissMessage="ひなんじょって、こわそう…何を持っていけばいいの？"
        robotMessage="避難所の基本・持ち物・タイミング・高齢者対応——準備すれば怖くない"
        subtitle="避難指示が出たら迷わず行動できる"
      />

      {/* ② 漫画導線 */}
      <section style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: '#94A3B8',
          letterSpacing: '0.08em', marginBottom: 10,
        }}>
          🎨 まず漫画で理解する
        </div>
        <Link href="/manga/evacuation-basics" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0A1A0A, #0D3320)',
            border: `2px solid ${accentLight}`,
            borderRadius: 16,
            padding: '20px 22px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
          }}>
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF8C00, #FFA500)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>🐿️</div>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>🤖</div>
                <span style={{ color: '#4ADE80', fontWeight: 700, fontSize: 13 }}>
                  4コマ漫画で学ぶ避難
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
                👉 子どもでもわかるやさしい防災
              </div>
            </div>
            <div style={{
              background: accent, color: 'white',
              borderRadius: 10, padding: '10px 18px',
              fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              マンガを見る →
            </div>
          </div>
        </Link>
      </section>

      {/* ③ 記事一覧（はじめての人向け） */}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>
          📚 まず読む記事
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GUIDE_CARDS.map((card, i) => (
            <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                border: `1.5px solid ${i === 0 ? accentLight : '#E2E8F0'}`,
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: i === 0 ? '0 2px 12px rgba(0,0,0,0.07)' : 'none',
                position: 'relative',
              }}>
                {i === 0 && (
                  <span style={{
                    position: 'absolute', top: -1, left: 14,
                    background: accent, color: 'white',
                    fontSize: 10, fontWeight: 700,
                    borderRadius: '0 0 6px 6px', padding: '2px 8px',
                  }}>
                    まずはこれ
                  </span>
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: accentBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, flexShrink: 0, marginTop: i === 0 ? 6 : 0,
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

      {/* ③ 全記事一覧（動的） */}
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
                    width: 42, height: 42, borderRadius: 10, background: accentBg,
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

      {/* CTA（収益導線） */}
      <section style={{
        background: 'linear-gradient(160deg, #0D0D1A, #0A1A3A)',
        borderRadius: 20, padding: '28px 24px', marginBottom: 28, textAlign: 'center',
      }}>
        <h2 style={{ color: '#FFD000', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          👇 今すぐ準備する
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {['防災リュック', 'ポータブル電源', '飲料水', '携帯トイレ'].map((item) => (
            <span key={item} style={{
              background: 'rgba(255,208,0,0.12)',
              border: '1px solid rgba(255,208,0,0.3)',
              color: '#FFD000', borderRadius: 50, padding: '6px 14px',
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

      {/* 他カテゴリ */}
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
            { key: 'typhoon',    emoji: '🌀', label: '台風が来る前' },
            { key: 'blackout',   emoji: '🔦', label: '停電したとき' },
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
