'use client'
import { useState } from 'react'

export default function ShareButton({
  title,
  url,
  shareText,
}: {
  title: string
  url: string
  shareText?: string
}) {
  const [copied, setCopied] = useState(false)
  const text = shareText ?? `${title}\n→ 今すぐ確認`
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text + '\n' + url)}`

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{
      margin: '32px 0',
      background: '#F8FAFC',
      border: '1.5px solid #E2E8F0',
      borderRadius: 16,
      padding: '20px',
    }}>
      <p style={{
        fontSize: 14, fontWeight: 800, color: '#0F172A',
        margin: '0 0 4px', textAlign: 'center',
      }}>
        📲 家族・友人にも伝えてください
      </p>
      <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px', textAlign: 'center' }}>
        あとで見返せるよう保存・シェアしておきましょう
      </p>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#000', color: 'white',
            padding: '10px 18px', borderRadius: 50,
            textDecoration: 'none', fontWeight: 700, fontSize: 13,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
          Xでシェア
        </a>

        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#06C755', color: 'white',
            padding: '10px 18px', borderRadius: 50,
            textDecoration: 'none', fontWeight: 700, fontSize: 13,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.02 2 11c0 3.08 1.56 5.8 3.97 7.55L5 22l3.62-1.9C9.68 20.34 10.82 20.5 12 20.5c5.52 0 10-4.02 10-9S17.52 2 12 2zm5.08 11.57l-1.27.89c-.17.12-.39.14-.58.04l-1.61-.88c-.2-.11-.44-.08-.62.07L11 15.5c-.32.27-.77-.1-.55-.44l1.34-2.04c.12-.18.1-.42-.04-.59l-.9-1.08c-.14-.16-.14-.4 0-.56l1.27-.89c.17-.12.39-.14.58-.04l1.61.88c.2.11.44.08.62-.07L17 9.5c.32-.27.77.1.55.44l-1.34 2.04c-.12.18-.1.42.04.59l.9 1.08c.14.16.14.4-.07.92z" />
          </svg>
          LINEで送る
        </a>

        <button
          onClick={handleCopy}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: copied ? '#10B981' : '#F1F5F9',
            color: copied ? 'white' : '#475569',
            padding: '10px 18px', borderRadius: 50,
            border: `1.5px solid ${copied ? '#10B981' : '#CBD5E1'}`,
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {copied ? '✓ コピー済み' : '🔗 リンクをコピー'}
        </button>
      </div>
    </div>
  )
}
