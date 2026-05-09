import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const CATEGORY_CONFIG: Record<string, { label: string; emoji: string; color: string; accent: string }> = {
  earthquake:      { label: '地震',     emoji: '🌋', color: '#FF6B00', accent: '#FFF3E0' },
  typhoon:         { label: '台風',     emoji: '🌀', color: '#3A5FFF', accent: '#EEF2FF' },
  blackout:        { label: '停電',     emoji: '⚡', color: '#E69500', accent: '#FFFBEB' },
  evacuation:      { label: '避難',     emoji: '🚨', color: '#1E9E50', accent: '#F0FFF4' },
  'disaster-prep': { label: '防災準備', emoji: '🎒', color: '#8B5CF6', accent: '#F5F3FF' },
  goods:           { label: '防災グッズ', emoji: '🛒', color: '#EA580C', accent: '#FFF7ED' },
}

const LABEL_COLOR: Record<string, { bg: string; text: string }> = {
  '保存版':    { bg: '#FEF3C7', text: '#92400E' },
  '今すぐ':    { bg: '#FEE2E2', text: '#991B1B' },
  '3つだけ':   { bg: '#DBEAFE', text: '#1E40AF' },
  'NG注意':    { bg: '#FFE4E6', text: '#BE123C' },
  '必須':      { bg: '#DCFCE7', text: '#166534' },
  '数字で納得': { bg: '#E0F2FE', text: '#0369A1' },
}

async function fetchImage(url: string): Promise<string> {
  const res = await fetch(url)
  const buf = await res.arrayBuffer()
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)))
  const mime = res.headers.get('content-type') ?? 'image/png'
  return `data:${mime};base64,${b64}`
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const title    = searchParams.get('title')    ?? '防災Lab'
  const category = searchParams.get('category') ?? ''
  const emoji    = searchParams.get('emoji')    ?? '🛡️'
  const label    = searchParams.get('label')    ?? ''

  const cfg = CATEGORY_CONFIG[category] ?? { label: '防災', emoji: '🛡️', color: '#FF6B00', accent: '#FFF8F0' }
  const labelStyle = LABEL_COLOR[label] ?? null

  let rissImg = ''
  let robotImg = ''
  try {
    ;[rissImg, robotImg] = await Promise.all([
      fetchImage(`${origin}/img/riss.png`),
      fetchImage(`${origin}/img/robot.png`),
    ])
  } catch {
    // キャラ画像取得失敗時はテキストのみ
  }

  const titleSize = title.length > 28 ? 36 : title.length > 20 ? 42 : 50

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(160deg, #0D0D1A 0%, #141428 55%, #0A1A3A 100%)',
          padding: '52px 64px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景装飾 */}
        <div style={{
          position: 'absolute', right: -80, top: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: cfg.color + '18',
          display: 'flex',
        }} />

        {/* 左コンテンツ */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, paddingRight: 24 }}>
          {/* カテゴリバッジ + ラベル */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: cfg.color + '22',
              border: `2px solid ${cfg.color}66`,
              borderRadius: 50, padding: '8px 20px',
            }}>
              <span style={{ fontSize: 22 }}>{cfg.emoji}</span>
              <span style={{ color: cfg.color, fontWeight: 700, fontSize: 20 }}>{cfg.label}</span>
            </div>
            {labelStyle && label && (
              <div style={{
                display: 'flex', alignItems: 'center',
                background: labelStyle.bg,
                borderRadius: 50, padding: '8px 18px',
              }}>
                <span style={{ color: labelStyle.text, fontWeight: 800, fontSize: 18 }}>{label}</span>
              </div>
            )}
          </div>

          {/* 記事絵文字 + タイトル */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
            <span style={{ fontSize: 80, flexShrink: 0 }}>{emoji}</span>
            <div style={{
              color: 'white',
              fontSize: titleSize,
              fontWeight: 900,
              lineHeight: 1.3,
            }}>
              {title}
            </div>
          </div>

          {/* フッター */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 22, marginTop: 22,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28 }}>🩺</span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 17 }}>
                くまごろう（現役医師）監修
              </span>
            </div>
            <span style={{ color: '#FFD000', fontWeight: 900, fontSize: 22 }}>🛡️ 防災Lab</span>
          </div>
        </div>

        {/* 右側キャラクター */}
        {rissImg && robotImg && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 12, flexShrink: 0, width: 200,
          }}>
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              background: 'linear-gradient(160deg, #FFF9E6, #FFF0D6)',
              border: '3px solid #FCD34D',
              overflow: 'hidden', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <img src={rissImg} width={100} height={100} style={{ objectFit: 'contain' }} />
            </div>
            <div style={{
              width: 110, height: 110, borderRadius: 22,
              background: 'linear-gradient(160deg, #EFF6FF, #DBEAFE)',
              border: '3px solid #93C5FD',
              overflow: 'hidden', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <img src={robotImg} width={100} height={100} style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ color: '#FFA500', fontWeight: 700, fontSize: 13 }}>防災リス</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>×</span>
              <span style={{ color: '#60A5FA', fontWeight: 700, fontSize: 13 }}>レスQロボ</span>
            </div>
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
