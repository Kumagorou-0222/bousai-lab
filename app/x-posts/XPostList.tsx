'use client'

import { useState } from 'react'

type XPostItem = {
  slug: string
  title: string
  category: string
  short: string
  normal: string
}

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

const CATEGORY_LABELS: Record<string, string> = {
  earthquake: '🌋 地震',
  typhoon: '🌀 台風',
  blackout: '⚡ 停電',
  evacuation: '🏃 避難',
  'disaster-prep': '🎒 防災準備',
}

export default function XPostList({ posts }: { posts: XPostItem[] }) {
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(posts.map((p) => p.category)))]
  const filtered = filter === 'all' ? posts : posts.filter((p) => p.category === filter)

  return (
    <div>
      {/* フィルター */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              fontSize: 12, fontWeight: 700, padding: '6px 14px',
              borderRadius: 20, cursor: 'pointer',
              border: '1.5px solid',
              borderColor: filter === cat ? '#0369A1' : '#CBD5E1',
              background: filter === cat ? '#0369A1' : 'white',
              color: filter === cat ? 'white' : '#475569',
            }}
          >
            {cat === 'all' ? '全記事' : (CATEGORY_LABELS[cat] ?? cat)}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>
        {filtered.length} 記事
      </div>

      {/* 記事一覧 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {filtered.map((post) => (
          <div
            key={post.slug}
            style={{
              background: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: 16,
              padding: '20px 22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {/* タイトル */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px',
                borderRadius: 10, background: '#F1F5F9', color: '#64748B',
              }}>
                {CATEGORY_LABELS[post.category] ?? post.category}
              </span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                {post.title}
              </span>
            </div>

            {/* Short */}
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

            {/* Normal */}
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
        ))}
      </div>
    </div>
  )
}
