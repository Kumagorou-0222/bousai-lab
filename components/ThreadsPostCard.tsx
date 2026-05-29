'use client'

import { useState } from 'react'
import { buildThreadsIntentUrl } from '@/lib/threadsPost'

type Props = {
  slug: string
  title: string
  postedAt: string
  slot: string
  xText: string
  threadsText: string
  articleUrl: string
  mangaImageUrl?: string
}

const SLOT_LABELS: Record<string, string> = {
  morning: '☀️ 朝',
  noon: '🌤️ 昼',
  night: '🌙 夜',
}

export default function ThreadsPostCard({
  title,
  postedAt,
  slot,
  xText,
  threadsText,
  articleUrl,
  mangaImageUrl,
}: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(threadsText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // フォールバック: textarea select
      const el = document.createElement('textarea')
      el.value = threadsText
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const threadsUrl = buildThreadsIntentUrl(threadsText)
  const date = new Date(postedAt).toLocaleDateString('ja-JP', {
    month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div style={{
      background: 'white',
      border: '1.5px solid #E2E8F0',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: 20,
    }}>
      {/* ヘッダー */}
      <div style={{
        background: 'linear-gradient(135deg, #0D0D1A 0%, #1E1B4B 100%)',
        padding: '12px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ color: '#A5B4FC', fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
            {SLOT_LABELS[slot] ?? slot} · {date}
          </div>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 14, lineHeight: 1.3 }}>
            {title}
          </div>
        </div>
        {mangaImageUrl && (
          <img
            src={mangaImageUrl}
            alt=""
            style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
          />
        )}
      </div>

      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* X投稿 */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
          }}>
            <span style={{
              background: '#1DA1F2', color: 'white',
              fontSize: 10, fontWeight: 800, borderRadius: 50,
              padding: '2px 10px',
            }}>X (もと)</span>
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 11, color: '#64748B', textDecoration: 'none' }}
            >
              記事を開く →
            </a>
          </div>
          <pre style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 11,
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
            color: '#475569',
            maxHeight: 120,
            overflow: 'auto',
          }}>
            {xText}
          </pre>
        </div>

        {/* Threads投稿 */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #E040FB, #FF4081)',
              color: 'white',
              fontSize: 10, fontWeight: 800, borderRadius: 50,
              padding: '2px 10px',
            }}>Threads（転用）</span>
          </div>
          <pre style={{
            background: '#FDF4FF',
            border: '1px solid #E9D5FF',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 12,
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
            color: '#1E1B4B',
          }}>
            {threadsText}
          </pre>
        </div>

        {/* アクションボタン */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleCopy}
            style={{
              background: copied ? '#16A34A' : '#6D28D9',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {copied ? '✅ コピー済み' : '📋 テキストをコピー'}
          </button>
          <a
            href={threadsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #E040FB, #FF4081)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: 13,
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            🧵 Threadsで投稿
          </a>
        </div>
      </div>
    </div>
  )
}
