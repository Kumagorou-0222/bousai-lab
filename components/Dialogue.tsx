type DialogueProps = {
  riss?: string
  robot?: string
}

export default function Dialogue({ riss, robot }: DialogueProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #F0F9FF 0%, #FEF9EE 100%)',
      borderRadius: 16,
      padding: '20px 16px',
      margin: '24px 0',
      border: '2px solid #DBEAFE',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {riss && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              minWidth: 54, flexShrink: 0,
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF8C00, #FFA500)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, boxShadow: '0 3px 10px rgba(255,140,0,0.35)',
              }}>🐿️</div>
              <span style={{ fontSize: 9, color: '#888', marginTop: 3, whiteSpace: 'nowrap', fontWeight: 700 }}>
                防災リス
              </span>
            </div>
            <div style={{
              background: 'white',
              borderRadius: '4px 16px 16px 16px',
              padding: '10px 14px',
              fontSize: 14, lineHeight: 1.65,
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              flex: 1, color: '#1A1A1A',
              border: '1px solid #FDE68A',
            }}>
              {riss}
            </div>
          </div>
        )}
        {robot && (
          <div style={{
            display: 'flex', alignItems: 'flex-end',
            flexDirection: 'row-reverse', gap: 10,
          }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              minWidth: 54, flexShrink: 0,
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, boxShadow: '0 3px 10px rgba(59,130,246,0.35)',
              }}>🤖</div>
              <span style={{ fontSize: 9, color: '#888', marginTop: 3, whiteSpace: 'nowrap', fontWeight: 700 }}>
                レスQロボ
              </span>
            </div>
            <div style={{
              background: '#EFF6FF',
              borderRadius: '16px 4px 16px 16px',
              padding: '10px 14px',
              fontSize: 14, lineHeight: 1.65,
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              flex: 1, color: '#1E3A8A',
              fontWeight: 600,
              border: '1px solid #BFDBFE',
            }}>
              {robot}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
