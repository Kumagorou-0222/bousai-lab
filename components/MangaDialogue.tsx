import Link from 'next/link'
import type { MangaPanel } from '@/lib/articles'

type MangaDialogueProps = {
  panels: MangaPanel[]
  articleSlug?: string
  articleTitle?: string
}

// 感情ごとの吹き出しスタイル
const EMOTION_STYLE: Record<string, { bg: string; border: string; badge: string }> = {
  worried:   { bg: '#FFFBEB', border: '#F59E0B', badge: '😟' },
  surprised: { bg: '#FEF2F2', border: '#F87171', badge: '😱' },
  serious:   { bg: '#EFF6FF', border: '#3B82F6', badge: '🔍' },
  normal:    { bg: '#F8FAFC', border: '#CBD5E1', badge: ''   },
  relieved:  { bg: '#F0FDF4', border: '#4ADE80', badge: '😌' },
  happy:     { bg: '#F0FDF4', border: '#86EFAC', badge: '😊' },
  scared:    { bg: '#FFF1F2', border: '#FDA4AF', badge: '😨' },
}

const CHAR_BASE = {
  riss: {
    emoji: '🐿️',
    name: '防災リス',
    charBg: 'linear-gradient(135deg, #FF8C00, #FFA500)',
    charRadius: '50%',
    textColor: '#78350F',
    fontWeight: '400' as const,
  },
  robot: {
    emoji: '🤖',
    name: 'レスQロボ',
    charBg: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
    charRadius: '10px',
    textColor: '#1E3A8A',
    fontWeight: '700' as const,
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
        background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
        padding: '12px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF8C00, #FFA500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
          }}>🐿️</div>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
          }}>🤖</div>
        </div>
        <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>4コマ漫画</span>
        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginLeft: 'auto' }}>
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
              background: 'white',
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
                width: 22, height: 22, borderRadius: '50%',
                background: '#1E40AF', color: 'white',
                fontSize: 12, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {i + 1}
              </div>

              {/* キャラクターアイコン（感情バッジ付き） */}
              <div style={{ position: 'relative', marginTop: 6 }}>
                <div style={{
                  width: 54, height: 54, borderRadius: char.charRadius,
                  background: char.charBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, boxShadow: '0 3px 12px rgba(0,0,0,0.18)',
                }}>
                  {char.emoji}
                </div>
                {emo.badge && (
                  <div style={{
                    position: 'absolute', bottom: -4,
                    right: isRobot ? 'auto' : -4,
                    left: isRobot ? -4 : 'auto',
                    fontSize: 16, lineHeight: 1,
                    background: 'white',
                    borderRadius: '50%',
                    width: 22, height: 22,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  }}>
                    {emo.badge}
                  </div>
                )}
              </div>

              {/* 名前ラベル */}
              <span style={{
                fontSize: 10, color: '#94A3B8', fontWeight: 700,
                letterSpacing: '0.02em',
              }}>
                {char.name}
              </span>

              {/* 吹き出し */}
              <div style={{
                background: emo.bg,
                border: `2px solid ${emo.border}`,
                borderRadius: isRobot ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                padding: '10px 14px',
                fontSize: 13, lineHeight: 1.65,
                fontWeight: char.fontWeight,
                color: char.textColor,
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
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
          background: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12,
        }}>
          <div>
            <span style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 2 }}>
              🤖 レスQロボより
            </span>
            <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
              詳しく知りたい方はこちら
            </span>
          </div>
          <Link href={`/articles/${articleSlug}`} style={{
            background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
            color: 'white',
            borderRadius: 10, padding: '10px 16px',
            textDecoration: 'none', fontSize: 13, fontWeight: 700,
            whiteSpace: 'nowrap', flexShrink: 0,
            boxShadow: '0 3px 12px rgba(59,130,246,0.35)',
          }}>
            {articleTitle ?? '記事を読む'} →
          </Link>
        </div>
      )}
    </div>
  )
}
