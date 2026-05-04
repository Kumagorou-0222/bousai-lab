type CategoryHeroProps = {
  category: string
  title: string
  rissMessage: string
  robotMessage: string
  subtitle?: string
}

const HERO_COLORS: Record<string, {
  bg: string; accent: string; robotBubbleBg: string; robotBubbleBorder: string; robotTextColor: string
}> = {
  earthquake: {
    bg: 'linear-gradient(160deg, #1A0808 0%, #3D0C0C 100%)',
    accent: '#FF6B00',
    robotBubbleBg: 'rgba(255,107,0,0.15)',
    robotBubbleBorder: 'rgba(255,107,0,0.4)',
    robotTextColor: '#FFA060',
  },
  typhoon: {
    bg: 'linear-gradient(160deg, #0A0A1A 0%, #0C1A3D 100%)',
    accent: '#3A5FFF',
    robotBubbleBg: 'rgba(58,95,255,0.15)',
    robotBubbleBorder: 'rgba(58,95,255,0.4)',
    robotTextColor: '#7090FF',
  },
  blackout: {
    bg: 'linear-gradient(160deg, #1A1400 0%, #2D2000 100%)',
    accent: '#D97706',
    robotBubbleBg: 'rgba(217,119,6,0.15)',
    robotBubbleBorder: 'rgba(217,119,6,0.4)',
    robotTextColor: '#F5A623',
  },
  evacuation: {
    bg: 'linear-gradient(160deg, #0A1A0A 0%, #0D3320 100%)',
    accent: '#16A34A',
    robotBubbleBg: 'rgba(22,163,74,0.15)',
    robotBubbleBorder: 'rgba(22,163,74,0.4)',
    robotTextColor: '#4ADE80',
  },
  'disaster-prep': {
    bg: 'linear-gradient(160deg, #0F1117 0%, #1E2235 100%)',
    accent: '#475569',
    robotBubbleBg: 'rgba(71,85,105,0.15)',
    robotBubbleBorder: 'rgba(71,85,105,0.4)',
    robotTextColor: '#94A3B8',
  },
}

export default function CategoryHero({ category, title, rissMessage, robotMessage, subtitle }: CategoryHeroProps) {
  const colors = HERO_COLORS[category] ?? HERO_COLORS['disaster-prep']

  return (
    <section style={{
      background: colors.bg,
      borderRadius: 20,
      padding: '28px 20px 24px',
      marginBottom: 24,
    }}>
      <h1 style={{
        color: 'white',
        fontSize: 'clamp(20px, 5vw, 30px)',
        fontWeight: 900,
        lineHeight: 1.3,
        marginBottom: subtitle ? 6 : 20,
        fontFamily: 'Kaisei Decol, serif',
        textAlign: 'center',
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: 13, textAlign: 'center', marginBottom: 20,
        }}>
          {subtitle}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            minWidth: 52, flexShrink: 0,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF8C00, #FFA500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>🐿️</div>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 3, whiteSpace: 'nowrap' }}>
              防災リス
            </span>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px 14px 14px 14px',
            padding: '10px 14px',
            fontSize: 13, color: 'rgba(255,255,255,0.9)',
            flex: 1, lineHeight: 1.6,
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            {rissMessage}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'row-reverse', gap: 10 }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            minWidth: 52, flexShrink: 0,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>🤖</div>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 3, whiteSpace: 'nowrap' }}>
              レスQロボ
            </span>
          </div>
          <div style={{
            background: colors.robotBubbleBg,
            borderRadius: '14px 4px 14px 14px',
            padding: '10px 14px',
            fontSize: 13, color: colors.robotTextColor,
            flex: 1, lineHeight: 1.6,
            border: `1px solid ${colors.robotBubbleBorder}`,
            fontWeight: 700,
          }}>
            {robotMessage}
          </div>
        </div>
      </div>
    </section>
  )
}
