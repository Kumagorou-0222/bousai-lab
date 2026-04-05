type Props = {
  name: string
  price: string
  description: string
  emoji: string
  amazonUrl?: string
  rakutenUrl?: string
  badge?: string
  accent?: string
  trustText?: string
  /** @deprecated use amazonUrl instead */
  url?: string
}

export default function ProductCard({
  name, price, description, emoji,
  amazonUrl, rakutenUrl, badge, accent = '#2563EB', trustText,
  url,
}: Props) {
  const resolvedAmazonUrl = amazonUrl ?? url ?? ''
  const lightBg = accent === '#DC2626' ? '#FEF2F2'
    : accent === '#D97706' ? '#FFFBEB'
    : accent === '#16A34A' ? '#F0FDF4'
    : accent === '#0EA5E9' ? '#F0F9FF'
    : '#EFF6FF'

  return (
    <div style={{
      background: 'white',
      border: `2px solid ${accent}55`,
      borderRadius: 16,
      padding: '18px 18px 14px',
      marginBottom: 14,
      boxShadow: '0 4px 16px rgba(15,23,42,0.08)',
    }}>
      {/* 上段：アイコン＋テキスト */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
        <div style={{
          width: 60, height: 60,
          background: lightBg,
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, flexShrink: 0,
        }}>
          {emoji}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {badge && (
            <span style={{
              display: 'inline-block',
              background: accent, color: 'white',
              fontSize: 11, fontWeight: 800,
              borderRadius: 20, padding: '3px 10px', marginBottom: 6,
              letterSpacing: '0.02em',
            }}>
              {badge}
            </span>
          )}
          <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A', lineHeight: 1.4, marginBottom: 4 }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
            {description}
          </div>
          <div style={{ fontSize: 15, color: accent, fontWeight: 900, marginTop: 6 }}>
            {price}
          </div>
        </div>
      </div>

      {/* 信頼性バッジ */}
      {trustText && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: '#F0FDF4', border: '1px solid #BBF7D0',
          borderRadius: 20, padding: '4px 12px', marginBottom: 12,
          fontSize: 12, color: '#15803D', fontWeight: 700,
        }}>
          ✅ {trustText}
        </div>
      )}

      {/* ボタン群 */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {resolvedAmazonUrl && (
          <a
            href={resolvedAmazonUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              flex: '1 1 130px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: '#FF9900',
              color: '#111',
              fontSize: 14, fontWeight: 900,
              borderRadius: 10, padding: '13px 16px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(255,153,0,0.35)',
              letterSpacing: '0.01em',
            }}
          >
            🛒 Amazonで見る
          </a>
        )}
        {rakutenUrl && (
          <a
            href={rakutenUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              flex: '1 1 130px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: '#BF0000', color: 'white',
              fontSize: 14, fontWeight: 900,
              borderRadius: 10, padding: '13px 16px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(191,0,0,0.25)',
              letterSpacing: '0.01em',
            }}
          >
            🛍️ 楽天で見る
          </a>
        )}
      </div>
    </div>
  )
}
