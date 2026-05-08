'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/category/earthquake', label: '地震',   emoji: '🌋' },
  { href: '/category/typhoon',    label: '台風',   emoji: '🌀' },
  { href: '/category/blackout',   label: '停電',   emoji: '⚡' },
  { href: '/category/evacuation', label: '避難',   emoji: '🚨' },
  { href: '/checklist',           label: 'チェック', emoji: '📋' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{ background: 'linear-gradient(135deg, #1A1A2E, #0F3460)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        {/* ロゴ */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 1 }} onClick={() => setOpen(false)}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 18, fontFamily: 'Kaisei Decol, serif', lineHeight: 1.2 }}>
            🛡️ 防災Lab
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600, letterSpacing: '0.03em' }}>
            在宅避難のための実践ガイド
          </span>
        </Link>

        {/* PCナビ */}
        <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }} className="pc-nav">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
          <Link href="/musashino" style={{ color: '#FFD000', fontSize: 12, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,208,0,0.5)', borderRadius: 20, padding: '3px 10px' }}>
            📍 武蔵野市
          </Link>
        </nav>

        {/* ハンバーガーボタン（モバイルのみ） */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="hamburger-btn"
          aria-label="メニュー"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
          }}
        >
          <span style={{ display: 'block', width: 22, height: 2, background: open ? 'transparent' : 'white', transition: 'all 0.2s', transform: open ? 'none' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'white', transition: 'all 0.2s', transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'white', transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* モバイルドロワー */}
      {open && (
        <div style={{
          background: '#0F1A2E',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '12px 0 20px',
        }}>
          {NAV_LINKS.map(({ href, label, emoji }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 24px',
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'none', fontSize: 15, fontWeight: 700,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{emoji}</span>
              {label}
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
            </Link>
          ))}
          <Link
            href="/best-disaster-items"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 24px',
              color: '#4ADE80', textDecoration: 'none', fontSize: 15, fontWeight: 700,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>🎒</span>
            おすすめ防災グッズ
            <span style={{ marginLeft: 'auto', color: 'rgba(74,222,128,0.6)', fontSize: 18 }}>›</span>
          </Link>
          <Link
            href="/musashino"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 24px',
              color: '#FFD000', textDecoration: 'none', fontSize: 15, fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>📍</span>
            武蔵野市の防災
            <span style={{ marginLeft: 'auto', color: '#FFD00060', fontSize: 18 }}>›</span>
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .pc-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
