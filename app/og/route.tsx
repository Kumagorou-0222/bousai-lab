import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const CATEGORY_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  earthquake:     { label: '地震',   emoji: '🌋', color: '#FF6B00', bg: '#FFF3E0' },
  typhoon:        { label: '台風',   emoji: '🌀', color: '#3A5FFF', bg: '#EEF2FF' },
  blackout:       { label: '停電',   emoji: '⚡', color: '#E69500', bg: '#FFFBEB' },
  evacuation:     { label: '避難',   emoji: '🚨', color: '#1E9E50', bg: '#F0FFF4' },
  'disaster-prep':{ label: '防災準備', emoji: '🎒', color: '#475569', bg: '#F8FAFC' },
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title    = searchParams.get('title')    ?? '防災Lab'
  const category = searchParams.get('category') ?? ''
  const emoji    = searchParams.get('emoji')    ?? '🛡️'

  const cfg = CATEGORY_CONFIG[category] ?? { label: '防災', emoji: '🛡️', color: '#FF6B00', bg: '#FFF8F0' }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(160deg, #0D0D1A 0%, #141428 55%, #0A1A3A 100%)',
          padding: '60px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* カテゴリバッジ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: cfg.color + '22',
            border: `2px solid ${cfg.color}66`,
            borderRadius: 50,
            padding: '10px 24px',
            width: 'fit-content',
            marginBottom: 36,
          }}
        >
          <span style={{ fontSize: 28 }}>{cfg.emoji}</span>
          <span style={{ color: cfg.color, fontWeight: 700, fontSize: 22, letterSpacing: '0.04em' }}>
            {cfg.label}
          </span>
        </div>

        {/* メインタイトル */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flex: 1,
          }}
        >
          <span style={{ fontSize: 96, flexShrink: 0 }}>{emoji}</span>
          <div
            style={{
              color: 'white',
              fontSize: title.length > 24 ? 40 : 48,
              fontWeight: 900,
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 28,
            marginTop: 28,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>🐻</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 18 }}>
                くまごろう（現役勤務医師）監修
              </span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
                在宅避難のための実践ガイド
              </span>
            </div>
          </div>
          <div
            style={{
              color: '#FFD000',
              fontWeight: 900,
              fontSize: 24,
              letterSpacing: '0.04em',
            }}
          >
            🛡️ 防災Lab
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
