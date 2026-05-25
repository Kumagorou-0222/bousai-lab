'use client'

import { useState, useCallback } from 'react'
import type { XPostCandidate, XRank } from '@/lib/xPostQueue'
import { getRandomXPost, RANK_LABELS, RANK_WEIGHTS } from '@/lib/xPostQueue'
import type { XPostListItem } from '@/lib/xpost'

// =====================================================
// 型
// =====================================================

type XPostItem = XPostListItem

// =====================================================
// 定数
// =====================================================

const CATEGORY_LABELS: Record<string, string> = {
  earthquake:      '🌋 地震',
  typhoon:         '🌀 台風',
  blackout:        '⚡ 停電',
  evacuation:      '🏃 避難',
  'disaster-prep': '🎒 防災準備',
}

const RANK_COLORS: Record<XRank, { bg: string; text: string; border: string }> = {
  S: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  A: { bg: '#DBEAFE', text: '#1E3A8A', border: '#3B82F6' },
  B: { bg: '#F1F5F9', text: '#475569', border: '#94A3B8' },
}

// =====================================================
// サブコンポーネント
// =====================================================

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        fontSize: 11, fontWeight: 700, padding: '4px 10px',
        borderRadius: 8, cursor: 'pointer', border: 'none',
        background: copied ? '#16A34A' : '#0369A1',
        color: 'white', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      {copied ? '✅ コピー済' : `📋 ${label}`}
    </button>
  )
}

function RankBadge({ rank }: { rank: XRank }) {
  const c = RANK_COLORS[rank]
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, padding: '2px 8px',
      borderRadius: 10, border: `1.5px solid ${c.border}`,
      background: c.bg, color: c.text, letterSpacing: '0.05em',
    }}>
      {rank} weight:{RANK_WEIGHTS[rank]}
    </span>
  )
}

function RandomPostPanel({
  candidates,
  recentSlugs,
  onUsed,
}: {
  candidates: XPostCandidate[]
  recentSlugs: string[]
  onUsed: (slug: string) => void
}) {
  const [current, setCurrent] = useState<XPostCandidate | null>(null)
  const [copied, setCopied] = useState(false)

  const handleRandom = useCallback(() => {
    const pick = getRandomXPost(candidates, recentSlugs)
    setCurrent(pick)
    setCopied(false)
  }, [candidates, recentSlugs])

  async function handleCopy() {
    if (!current) return
    await navigator.clipboard.writeText(current.text)
    setCopied(true)
    onUsed(current.slug)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      borderRadius: 16,
      padding: '20px 22px',
      marginBottom: 28,
      color: 'white',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>🎲</span>
        <span style={{ fontSize: 15, fontWeight: 900 }}>ランダム投稿</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginLeft: 'auto' }}>
          Sランク優先（weight S:5 / A:3 / B:1）
        </span>
      </div>

      <button
        onClick={handleRandom}
        style={{
          width: '100%',
          padding: '12px 0',
          borderRadius: 10,
          border: '1.5px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.08)',
          color: 'white',
          fontSize: 14,
          fontWeight: 800,
          cursor: 'pointer',
          marginBottom: current ? 14 : 0,
          transition: 'background 0.15s',
        }}
      >
        🎲 ランダムに1件を選ぶ
      </button>

      {current && (
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12,
          padding: '14px 16px',
        }}>
          {/* メタ情報 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            <RankBadge rank={current.rank} />
            {current.hasManga && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px',
                borderRadius: 10, background: '#7C3AED', color: 'white',
              }}>
                🎨 漫画あり
              </span>
            )}
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginLeft: 'auto' }}>
              {current.slug}
            </span>
          </div>

          {/* タイトル */}
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: 'rgba(255,255,255,0.95)' }}>
            {current.title}
          </div>

          {/* URL */}
          <div style={{ marginBottom: 10 }}>
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 11, color: '#93C5FD', wordBreak: 'break-all' }}
            >
              🔗 {current.url}
            </a>
          </div>

          {/* 投稿文 */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '12px 14px',
            fontSize: 12,
            lineHeight: 1.85,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 12,
          }}>
            {current.text}
          </div>

          {/* コピーボタン */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 8,
                border: 'none',
                background: copied ? '#16A34A' : '#2563EB',
                color: 'white',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {copied ? '✅ コピーしてXへ！' : '📋 コピーする'}
            </button>
            <button
              onClick={handleRandom}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              次の記事 →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PriorityCard({ candidate }: { candidate: XPostCandidate }) {
  const c = RANK_COLORS[candidate.rank]
  return (
    <div
      style={{
        background: 'white',
        border: `1.5px solid ${c.border}`,
        borderRadius: 16,
        padding: '18px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* ヘッダー行 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <RankBadge rank={candidate.rank} />
        {candidate.hasManga && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px',
            borderRadius: 10, background: '#EDE9FE', color: '#7C3AED',
            border: '1px solid #DDD6FE',
          }}>
            🎨 漫画あり
          </span>
        )}
        <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 'auto' }}>
          {candidate.slug}
        </span>
      </div>

      {/* タイトル */}
      <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
        {candidate.title}
      </div>

      {/* URL */}
      <div style={{ marginBottom: 12 }}>
        <a
          href={candidate.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color: '#0369A1', wordBreak: 'break-all' }}
        >
          🔗 {candidate.url}
        </a>
      </div>

      {/* 投稿文 */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED' }}>投稿文</span>
          <span style={{ fontSize: 10, color: '#94A3B8' }}>{candidate.text.length}文字</span>
          <CopyButton text={candidate.text} label="コピー" />
        </div>
        <div style={{
          background: '#FAF5FF',
          border: '1px solid #DDD6FE',
          borderRadius: 10,
          padding: '12px 14px',
          fontSize: 12,
          lineHeight: 1.75,
          color: '#0F172A',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}>
          {candidate.text}
        </div>
      </div>
    </div>
  )
}

function CarouselCard({ post }: { post: XPostItem }) {
  const slides = post.carouselSlides ?? []
  const SLIDE_LABELS = ['1枚目：結論', '2枚目：理由①', '3枚目：理由②', '4枚目：理由③', '5枚目：チェックリスト']
  const SLIDE_COLORS = ['#0369A1', '#7C3AED', '#7C3AED', '#7C3AED', '#16A34A']
  const SLIDE_BG    = ['#F0F9FF', '#FAF5FF', '#FAF5FF', '#FAF5FF', '#F0FDF4']
  const SLIDE_BD    = ['#BAE6FD', '#DDD6FE', '#DDD6FE', '#DDD6FE', '#BBF7D0']

  return (
    <div style={{
      background: 'white', border: '1.5px solid #0369A1',
      borderRadius: 16, padding: '20px 22px',
      boxShadow: '0 2px 12px rgba(3,105,161,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, padding: '2px 8px',
          borderRadius: 10, background: '#0369A1', color: 'white',
        }}>
          🎠 カルーセル {slides.length}枚
        </span>
        {post.xSeries && (
          <span style={{
            fontSize: 10, fontWeight: 800, padding: '2px 8px',
            borderRadius: 10, background: '#FEF3C7', color: '#92400E',
            border: '1px solid #FCD34D',
          }}>
            【{post.xSeries}】
          </span>
        )}
        <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', flex: 1 }}>
          {post.title}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {slides.map((slide, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: SLIDE_COLORS[i] ?? '#475569' }}>
                {SLIDE_LABELS[i] ?? `${i + 1}枚目`}
              </span>
              <span style={{ fontSize: 10, color: '#94A3B8' }}>{slide.length}文字</span>
              <CopyButton text={slide} label="コピー" />
            </div>
            <div style={{
              background: SLIDE_BG[i] ?? '#F8FAFC',
              border: `1px solid ${SLIDE_BD[i] ?? '#E2E8F0'}`,
              borderRadius: 10, padding: '12px 14px',
              fontSize: 12, lineHeight: 1.75, color: '#0F172A',
              whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>
              {slide}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AllPostCard({ post }: { post: XPostItem }) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: '20px 22px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px',
          borderRadius: 10, background: '#F1F5F9', color: '#64748B',
        }}>
          {CATEGORY_LABELS[post.category] ?? post.category}
        </span>
        {post.xSeries && (
          <span style={{
            fontSize: 10, fontWeight: 800, padding: '2px 8px',
            borderRadius: 10, background: '#FEF3C7', color: '#92400E',
            border: '1px solid #FCD34D',
          }}>
            【{post.xSeries}】
          </span>
        )}
        <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
          {post.title}
        </span>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0369A1' }}>Short</span>
          <span style={{ fontSize: 10, color: '#94A3B8' }}>{post.short.length}文字</span>
          <CopyButton text={post.short} label="Short" />
        </div>
        <div style={{
          background: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: 10,
          padding: '12px 14px',
          fontSize: 12,
          lineHeight: 1.75,
          color: '#0F172A',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}>
          {post.short}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED' }}>Normal</span>
          <span style={{ fontSize: 10, color: '#94A3B8' }}>{post.normal.length}文字</span>
          <CopyButton text={post.normal} label="Normal" />
        </div>
        <div style={{
          background: '#FAF5FF',
          border: '1px solid #DDD6FE',
          borderRadius: 10,
          padding: '12px 14px',
          fontSize: 12,
          lineHeight: 1.75,
          color: '#0F172A',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}>
          {post.normal}
        </div>
      </div>
    </div>
  )
}

// =====================================================
// メインコンポーネント
// =====================================================

type FilterMode = 'priority' | 'all' | string

export default function XPostList({
  posts,
  priorityCandidates,
}: {
  posts: XPostItem[]
  priorityCandidates: XPostCandidate[]
}) {
  const [filter, setFilter] = useState<FilterMode>('priority')
  const [recentSlugs, setRecentSlugs] = useState<string[]>([])

  const handleUsed = useCallback((slug: string) => {
    setRecentSlugs((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)]
      return next.slice(0, 5)
    })
  }, [])

  const allCategories = Array.from(new Set(posts.map((p) => p.category)))
  const carouselPosts = posts.filter((p) => (p.carouselSlides?.length ?? 0) > 0)

  const filteredPosts =
    filter === 'priority' || filter === 'carousel'
      ? []
      : filter === 'all'
      ? posts
      : posts.filter((p) => p.category === filter)

  const filterOptions: { key: FilterMode; label: string }[] = [
    { key: 'priority',  label: `⭐ 優先${priorityCandidates.length}記事` },
    { key: 'carousel',  label: `🎠 カルーセル（${carouselPosts.length}本）` },
    { key: 'all',       label: `全記事（${posts.length}本）` },
    ...allCategories.map((cat) => ({
      key: cat,
      label: CATEGORY_LABELS[cat] ?? cat,
    })),
  ]

  return (
    <div>
      {/* フィルター */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {filterOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              fontSize: 12, fontWeight: 700, padding: '6px 14px',
              borderRadius: 20, cursor: 'pointer',
              border: '1.5px solid',
              borderColor: filter === key ? '#0369A1' : '#CBD5E1',
              background: filter === key ? '#0369A1' : 'white',
              color: filter === key ? 'white' : '#475569',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* カルーセルビュー */}
      {filter === 'carousel' && (
        <div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>
            carousel フィールドが設定された {carouselPosts.length} 記事（5枚スライド構成）
          </div>
          {carouselPosts.length === 0 ? (
            <div style={{
              background: '#F8FAFC', border: '1px solid #E2E8F0',
              borderRadius: 12, padding: '24px', textAlign: 'center',
              color: '#94A3B8', fontSize: 13,
            }}>
              まだカルーセルデータが設定された記事がありません。<br />
              記事 MDX に <code>carousel.reasons</code> と <code>carousel.checklist</code> を追加してください。
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {carouselPosts.map((post) => (
                <CarouselCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 優先20記事ビュー */}
      {filter === 'priority' && (
        <div>
          <RandomPostPanel
            candidates={priorityCandidates}
            recentSlugs={recentSlugs}
            onUsed={handleUsed}
          />

          {recentSlugs.length > 0 && (
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 16 }}>
              最近使用：{recentSlugs.join(' → ')}
            </div>
          )}

          {/* ランク別セクション */}
          {(['S', 'A', 'B'] as XRank[]).map((rank) => {
            const group = priorityCandidates.filter((c) => c.rank === rank)
            if (group.length === 0) return null
            const c = RANK_COLORS[rank]
            return (
              <div key={rank} style={{ marginBottom: 32 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 14,
                  padding: '8px 14px',
                  borderRadius: 10,
                  background: c.bg,
                  border: `1.5px solid ${c.border}`,
                }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: c.text }}>
                    {rank}ランク
                  </span>
                  <span style={{ fontSize: 12, color: c.text, opacity: 0.7 }}>
                    weight {RANK_WEIGHTS[rank]}（{group.length}記事）
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {group.map((candidate) => (
                    <PriorityCard key={candidate.slug} candidate={candidate} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 全記事・カテゴリフィルタービュー */}
      {filter !== 'priority' && (
        <div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>
            {filteredPosts.length} 記事
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {filteredPosts.map((post) => (
              <AllPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
