import Link from 'next/link'
import type { MangaPanel } from '@/lib/articles'

type MangaDialogueProps = {
  panels: MangaPanel[]
  articleSlug?: string
  articleTitle?: string
}

const EMOTION_STYLE: Record<string, { bg: string; border: string; badge: string }> = {
  worried:   { bg: '#FFFBEB', border: '#F59E0B', badge: '😟' },
  surprised: { bg: '#FEF2F2', border: '#F87171', badge: '😱' },
  serious:   { bg: '#EFF6FF', border: '#3B82F6', badge: '🔍' },
  normal:    { bg: '#F8FAFC', border: '#CBD5E1', badge: ''   },
  relieved:  { bg: '#F0FDF4', border: '#4ADE80', badge: '😌' },
  happy:     { bg: '#FFF0F9', border: '#F9A8D4', badge: '😊' },
  scared:    { bg: '#FFF1F2', border: '#FDA4AF', badge: '😨' },
}

const CHAR_BASE = {
  riss: {
    img: '/img/riss.png',
    name: '防災リス',
    charBg: 'linear-gradient(160deg, #FFF9E6, #FFF0D6)',
    charShadow: '0 4px 16px rgba(255,180,0,0.25)',
    textColor: '#92400E',
    fontWeight: '500' as const,
    panelBg: 'linear-gradient(160deg, #FFFDF5 0%, #FFF8EC 100%)',
    bubbleRadius: '4px 20px 20px 20px',
    nameBadgeBg: 'rgba(255,180,0,0.15)',
    nameBadgeColor: '#92400E',
    numBg: 'linear-gradient(135deg, #FF8C00, #FFD000)',
    numShadow: '0 2px 8px rgba(255,140,0,0.4)',
    numRadius: '50%',
    glowShadow: '0 2px 10px rgba(255,180,0,0.15)',
  },
  robot: {
    img: '/img/robot.png',
    name: 'レスQロボ',
    charBg: 'linear-gradient(160deg, #EFF6FF, #DBEAFE)',
    charShadow: '0 4px 20px rgba(6,182,212,0.3)',
    textColor: '#0C4A6E',
    fontWeight: '700' as const,
    panelBg: 'linear-gradient(160deg, #F0F9FF 0%, #EFF6FF 100%)',
    bubbleRadius: '20px 4px 20px 20px',
    nameBadgeBg: 'rgba(6,182,212,0.15)',
    nameBadgeColor: '#0C4A6E',
    numBg: 'linear-gradient(135deg, #1E3A8A, #06B6D4)',
    numShadow: '0 2px 8px rgba(6,182,212,0.4)',
    numRadius: '5px',
    glowShadow: '0 2px 10px rgba(6,182,212,0.12)',
  },
}

export default function MangaDialogue({ panels, articleSlug, articleTitle }: MangaDialogueProps) {
  const limited = panels.slice(0, 4)

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      border: '2px solid #E2E8F0',
      overflow: 'hidden',
      margin: '28px 0',
      boxShadow: '0 6px 28px rgba(0,0,0,0.10)',
    }}>
      {/* ヘッダー */}
      <div style={{
        background: 'linear-gradient(135deg, #0A0A2E 0%, #1E3A8A 60%, #06B6D4 100%)',
        padding: '12px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {/* リスアイコン（ヘッダー） */}
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src="/img/riss.png" alt="防災リス" style={{ width: 30, height: 30, objectFit: 'contain' }} />
          </div>
          {/* ロボアイコン（ヘッダー） */}
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'rgba(255,255,255,0.15)',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src="/img/robot.png" alt="レスQロボ" style={{ width: 30, height: 30, objectFit: 'contain' }} />
          </div>
        </div>
        <span style={{ color: 'white', fontWeight: 800, fontSize: 14, letterSpacing: '0.02em' }}>4コマ漫画</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginLeft: 'auto' }}>
          防災リス＆レスQロボ
        </span>
      </div>

      {/* グリッド（PC:2×2 / スマホ:縦4コマ） */}
      <style>{`
        .manga-panels-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3px;
          background: #CBD5E1;
          padding: 3px;
        }
        @media (min-width: 640px) {
          .manga-panels-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="manga-panels-grid">
        {limited.map((panel, i) => {
          const char = CHAR_BASE[panel.character]
          const emo  = EMOTION_STYLE[panel.emotion] ?? EMOTION_STYLE.normal
          const isRobot = panel.character === 'robot'

          return (
            <div key={i} style={{
              background: char.panelBg,
              padding: '22px 16px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isRobot ? 'flex-end' : 'flex-start',
              gap: 10,
              minHeight: 180,
              position: 'relative',
            }}>
              {/* パネル番号 */}
              <div style={{
                position: 'absolute', top: 10,
                left: isRobot ? 'auto' : 10,
                right: isRobot ? 10 : 'auto',
                width: 22, height: 22, borderRadius: char.numRadius,
                background: char.numBg,
                color: 'white',
                fontSize: 12, fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: char.numShadow,
              }}>
                {i + 1}
              </div>

              {/* デコレーション（ロボのみ：コーナーライン） */}
              {isRobot && (
                <div style={{
                  position: 'absolute', bottom: 8, left: 10,
                  width: 18, height: 18, pointerEvents: 'none',
                  borderLeft: '2px solid rgba(6,182,212,0.3)',
                  borderBottom: '2px solid rgba(6,182,212,0.3)',
                }} />
              )}

              {/* キャラクター画像 */}
              <div style={{ position: 'relative', marginTop: 6 }}>
                <div style={{
                  width: 72, height: 72,
                  borderRadius: isRobot ? 12 : '50%',
                  background: char.charBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: char.charShadow,
                  overflow: 'hidden',
                  padding: 4,
                }}>
                  <img
                    src={char.img}
                    alt={char.name}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'bottom',
                    }}
                  />
                </div>

                {/* 感情バッジ */}
                {emo.badge && (
                  <div style={{
                    position: 'absolute', bottom: -4,
                    right: isRobot ? 'auto' : -4,
                    left: isRobot ? -4 : 'auto',
                    fontSize: 15, lineHeight: 1,
                    background: 'white',
                    borderRadius: '50%',
                    width: 22, height: 22,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
                  }}>
                    {emo.badge}
                  </div>
                )}
              </div>

              {/* 名前ラベル */}
              <span style={{
                fontSize: 10,
                color: char.nameBadgeColor,
                fontWeight: 800,
                letterSpacing: '0.04em',
                background: char.nameBadgeBg,
                borderRadius: 20,
                padding: '2px 8px',
              }}>
                {char.name}
              </span>

              {/* 吹き出し */}
              <div style={{
                background: emo.bg,
                border: `2px solid ${emo.border}`,
                borderRadius: char.bubbleRadius,
                padding: '10px 14px',
                fontSize: 13, lineHeight: 1.7,
                fontWeight: char.fontWeight,
                color: char.textColor,
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: char.glowShadow,
              }}>
                {panel.message}
              </div>
            </div>
          )
        })}
      </div>

      {/* 記事リンク */}
      {articleSlug && (
        <div style={{
          padding: '14px 18px',
          background: 'linear-gradient(135deg, #F0F9FF, #EFF6FF)',
          borderTop: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12,
        }}>
          <div>
            <span style={{ fontSize: 11, color: '#0C4A6E', fontWeight: 700, display: 'block', marginBottom: 2 }}>
              🤖 レスQロボより
            </span>
            <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
              詳しく知りたい方はこちら
            </span>
          </div>
          <Link href={`/articles/${articleSlug}`} style={{
            background: 'linear-gradient(135deg, #1E3A8A, #06B6D4)',
            color: 'white',
            borderRadius: 10, padding: '10px 16px',
            textDecoration: 'none', fontSize: 13, fontWeight: 800,
            whiteSpace: 'nowrap', flexShrink: 0,
            boxShadow: '0 3px 14px rgba(6,182,212,0.4)',
            letterSpacing: '0.02em',
          }}>
            {articleTitle ?? '記事を読む'} →
          </Link>
        </div>
      )}
    </div>
  )
}
