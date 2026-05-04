import type { ReasonItem } from '@/lib/articles'

type Props = {
  reasons: ReasonItem[]
  color?: string
}

const DEFAULT_EMOJIS = ['①', '②', '③', '④', '⑤']

export default function ReasonsList({ reasons, color = '#DC2626' }: Props) {
  if (!reasons || reasons.length === 0) return null

  return (
    <div style={{
      background: 'white',
      border: `1.5px solid ${color}30`,
      borderRadius: 16,
      padding: '22px 24px',
      marginBottom: 32,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 18,
      }}>
        <span style={{
          background: color, color: 'white',
          fontSize: 11, fontWeight: 800, borderRadius: 20,
          padding: '3px 12px', letterSpacing: '0.05em',
        }}>
          理由 {reasons.length}つ
        </span>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
          なぜそうすべきなのか
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {reasons.map((r, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14,
            background: `${color}06`,
            borderRadius: 12,
            padding: '14px 16px',
            border: `1px solid ${color}18`,
          }}>
            <div style={{
              width: 34, height: 34,
              background: color,
              borderRadius: '50%',
              color: 'white',
              fontWeight: 900,
              fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {r.emoji ?? DEFAULT_EMOJIS[i] ?? `${i + 1}`}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 800,
                fontSize: r.body ? 14 : 15,
                color: '#0F172A',
                marginBottom: r.body ? 4 : 0,
                lineHeight: 1.6,
              }}>
                {r.title}
              </div>
              {r.body && (
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.75 }}>
                  {r.body}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
