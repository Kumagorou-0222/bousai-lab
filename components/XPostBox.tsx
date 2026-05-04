'use client'

import { useState } from 'react'

type Props = {
  short: string
  normal: string
}

export default function XPostBox({ short, normal }: Props) {
  const [mode, setMode] = useState<'short' | 'normal'>('normal')
  const [copied, setCopied] = useState(false)

  const text = mode === 'short' ? short : normal

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`

  return (
    <div style={{
      background: '#F0F9FF',
      border: '1.5px solid #BAE6FD',
      borderRadius: 16,
      padding: '20px 22px',
      marginTop: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#000', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 16, flexShrink: 0,
        }}>
          𝕏
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>X（Twitter）投稿文</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>コピーしてそのまま投稿できます</div>
        </div>
        {/* タブ切り替え */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {(['normal', 'short'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                fontSize: 11, fontWeight: 700,
                padding: '4px 10px', borderRadius: 20, cursor: 'pointer',
                border: '1.5px solid',
                borderColor: mode === m ? '#0369A1' : '#CBD5E1',
                background: mode === m ? '#0369A1' : 'white',
                color: mode === m ? 'white' : '#475569',
                transition: 'all 0.15s',
              }}
            >
              {m === 'normal' ? '通常版' : '短縮版'}
            </button>
          ))}
        </div>
      </div>

      {/* 投稿文本体 */}
      <div style={{
        background: 'white',
        border: '1px solid #E0F2FE',
        borderRadius: 10,
        padding: '14px 16px',
        fontSize: 13,
        lineHeight: 1.75,
        color: '#0F172A',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        marginBottom: 14,
        minHeight: 80,
      }}>
        {text}
      </div>

      {/* 文字数 */}
      <div style={{ fontSize: 11, color: text.length > 140 ? '#DC2626' : '#64748B', marginBottom: 12 }}>
        {text.length} 文字 {mode === 'short' && text.length > 140 ? '（140字超え）' : ''}
      </div>

      {/* ボタン */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={handleCopy}
          style={{
            padding: '10px 20px', borderRadius: 10, cursor: 'pointer',
            border: 'none',
            background: copied ? '#16A34A' : '#0369A1',
            color: 'white', fontWeight: 700, fontSize: 13,
            transition: 'background 0.2s',
          }}
        >
          {copied ? '✅ コピーしました' : '📋 テキストをコピー'}
        </button>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 20px', borderRadius: 10,
            border: '1.5px solid #000',
            background: 'white', color: '#0F172A',
            fontWeight: 700, fontSize: 13,
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          𝕏 Xで投稿する
        </a>
      </div>
    </div>
  )
}
