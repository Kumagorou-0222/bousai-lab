'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { XScheduledPost } from '@/lib/xScheduler'
import { generateDailySchedule, dateToSeed } from '@/lib/xScheduler'
import type { XPostCandidate, XRank } from '@/lib/xPostQueue'
import { RANK_WEIGHTS } from '@/lib/xPostQueue'

// ─── 定数 ────────────────────────────────────────────

const SLOT_STYLES = {
  morning: { bg: '#FFFBEB', border: '#FCD34D', accent: '#B45309', header: '#FEF3C7', emoji: '🌅' },
  noon:    { bg: '#EFF6FF', border: '#93C5FD', accent: '#1D4ED8', header: '#DBEAFE', emoji: '☀️' },
  night:   { bg: '#F5F3FF', border: '#C4B5FD', accent: '#6D28D9', header: '#EDE9FE', emoji: '🌙' },
}

const RANK_COLORS: Record<XRank, { bg: string; text: string; border: string }> = {
  S: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  A: { bg: '#DBEAFE', text: '#1E3A8A', border: '#3B82F6' },
  B: { bg: '#F1F5F9', text: '#475569', border: '#94A3B8' },
}

// ─── サブコンポーネント ───────────────────────────────

function CopyButton({ text, label = '投稿文コピー' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  async function handle() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }
  return (
    <button
      onClick={handle}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '9px 16px', borderRadius: 8, border: 'none',
        background: copied ? '#16A34A' : '#0F172A',
        color: 'white', fontSize: 13, fontWeight: 700,
        cursor: 'pointer', transition: 'background 0.2s',
      }}
    >
      {copied ? '✅ コピー済み！' : `📋 ${label}`}
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
      {rank}ランク weight:{RANK_WEIGHTS[rank]}
    </span>
  )
}

function SlotCard({ post }: { post: XScheduledPost }) {
  const s = SLOT_STYLES[post.slot]
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.text)}`
  const [imgIdx, setImgIdx] = useState(0)

  return (
    <div style={{
      background: s.bg,
      border: `2px solid ${s.border}`,
      borderRadius: 18,
      overflow: 'hidden',
    }}>
      {/* スロットヘッダー */}
      <div style={{
        background: s.header,
        padding: '12px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `1px solid ${s.border}`,
      }}>
        <span style={{ fontSize: 22 }}>{s.emoji}</span>
        <div>
          <span style={{ fontSize: 16, fontWeight: 900, color: s.accent }}>
            {post.label} {post.time}
          </span>
          <span style={{
            fontSize: 11, color: s.accent, opacity: 0.7,
            marginLeft: 8, fontWeight: 600,
          }}>
            ｜{post.theme}
          </span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <RankBadge rank={post.rank} />
        </div>
      </div>

      {/* コンテンツ */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* 記事タイトル */}
        <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
          {post.title}
        </div>

        {/* 漫画画像プレビュー */}
        {post.mangaImages.length > 0 ? (
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              🎨 漫画画像（{post.mangaImages.length}枚）
              <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 400 }}>
                ※ 画像を保存してからXに添付してください
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {post.mangaImages.map((src, i) => (
                <div
                  key={i}
                  style={{
                    position: 'relative', width: 90, height: 90,
                    borderRadius: 8, overflow: 'hidden',
                    border: imgIdx === i ? `2px solid ${s.accent}` : '2px solid #E2E8F0',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                  onClick={() => setImgIdx(i)}
                >
                  <Image
                    src={src}
                    alt={`漫画パネル${i + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="90px"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {post.mangaImages.map((src, i) => (
                <a
                  key={i}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 10, color: s.accent, fontWeight: 700,
                    background: 'white', border: `1px solid ${s.border}`,
                    borderRadius: 6, padding: '3px 8px', textDecoration: 'none',
                  }}
                >
                  🖼️ 画像{i + 1}を開く
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            fontSize: 11, color: '#94A3B8', padding: '10px 14px',
            background: 'white', borderRadius: 8, border: '1px solid #E2E8F0',
          }}>
            🖼️ 漫画画像なし — 記事ページから画像を保存してください
          </div>
        )}

        {/* 投稿文 */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>
            📝 投稿文（{post.text.length}文字）
          </div>
          <div style={{
            background: 'white',
            border: `1px solid ${s.border}`,
            borderRadius: 10,
            padding: '14px 16px',
            fontSize: 13,
            lineHeight: 1.85,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            color: '#0F172A',
          }}>
            {post.text}
          </div>
        </div>

        {/* アクションボタン */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <CopyButton text={post.text} />

          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 8,
              background: '#000', color: 'white',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
            }}
          >
            𝕏 Xを開く
          </a>

          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 8,
              background: 'white', color: '#0F172A',
              border: `1.5px solid ${s.border}`,
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
            }}
          >
            📖 記事を見る
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── メインコンポーネント ─────────────────────────────

export default function DailySchedule({
  initialSchedule,
  candidates,
  dateStr,
}: {
  initialSchedule: XScheduledPost[]
  candidates: XPostCandidate[]
  dateStr: string
}) {
  const [schedule, setSchedule] = useState(initialSchedule)
  const [regenCount, setRegenCount] = useState(0)
  const isRegenerated = regenCount > 0

  function handleRegenerate() {
    const newSeed = (Math.random() * 0xffffffff) | 0
    const next = generateDailySchedule(candidates, dateStr, newSeed)
    setSchedule(next)
    setRegenCount((c) => c + 1)
  }

  function handleReset() {
    const defaultSeed = dateToSeed(dateStr)
    const next = generateDailySchedule(candidates, dateStr, defaultSeed)
    setSchedule(next)
    setRegenCount(0)
  }

  return (
    <div style={{ marginBottom: 48 }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 20, flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
            📅 今日のX投稿案
          </h2>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            {dateStr}（朝・昼・夜の3枠）
          </div>
        </div>

        {/* 手動投稿モードバッジ */}
        <div style={{
          fontSize: 11, fontWeight: 700, padding: '4px 12px',
          borderRadius: 20, background: '#F0FDF4',
          border: '1.5px solid #86EFAC', color: '#15803D',
        }}>
          ✅ 現在：手動投稿モード
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {isRegenerated && (
            <button
              onClick={handleReset}
              style={{
                fontSize: 12, fontWeight: 700, padding: '7px 14px',
                borderRadius: 8, border: '1.5px solid #CBD5E1',
                background: 'white', color: '#475569', cursor: 'pointer',
              }}
            >
              ↩️ 今日の標準に戻す
            </button>
          )}
          <button
            onClick={handleRegenerate}
            style={{
              fontSize: 12, fontWeight: 700, padding: '7px 14px',
              borderRadius: 8, border: 'none',
              background: '#6D28D9', color: 'white', cursor: 'pointer',
            }}
          >
            🔀 別の記事に再生成
          </button>
        </div>
      </div>

      {/* Telegram分離説明 */}
      <div style={{
        fontSize: 11, color: '#7C3AED', marginBottom: 16,
        padding: '6px 12px', background: '#FAF5FF',
        border: '1px solid #DDD6FE', borderRadius: 8,
        display: 'inline-block',
      }}>
        🔀 このセクションはTelegram通知とは完全に別系統です
      </div>

      {/* 3スロット */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {schedule.map((post) => (
          <SlotCard key={post.slot} post={post} />
        ))}
      </div>
    </div>
  )
}
