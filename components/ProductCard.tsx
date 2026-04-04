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
    : '#EFF6FF'

  return (
    <div style={{
      background: 'white',
      border: `1.5px solid ${accent}44`,
      borderRadius: 14,
      padding: '14px 16px',
      marginBottom: 10,
      boxShadow: '0 2px 10px rgba(15,23,42,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
        <div style={{
          width: 56, height: 56,
          background: lightBg,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, flexShrink: 0,
        }}>
          {emoji}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {badge && (
            <span style={{
              display: 'inline-block',
              background: accent, color: 'white',
              fontSize: 10, fontWeight: 700,
              borderRadius: 20, padding: '2px 8px', marginBottom: 4,
            }}>
              {badge}
            </span>
          )}
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', lineHeight: 1.4, marginBottom: 3 }}>
            {name}
          </div>
          <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>
            {description}
          </div>
          <div style={{ fontSize: 13, color: accent, fontWeight: 700, marginTop: 4 }}>
            {price}
          </div>
        </div>
      </div>

      {trustText && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: '#F0FDF4', border: '1px solid #BBF7D0',
          borderRadius: 20, padding: '3px 10px', marginBottom: 8,
          fontSize: 11, color: '#15803D', fontWeight: 700,
        }}>
          ✅ {trustText}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <a
          href={resolvedAmazonUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            flex: '1 1 100px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            background: '#FF9900', color: '#111',
            fontSize: 12, fontWeight: 900,
            borderRadius: 8, padding: '9px 12px',
            textDecoration: 'none', whiteSpace: 'nowrap', minHeight: 40,
          }}
        >
          🛒 Amazonで見る
        </a>
        {rakutenUrl && (
          <a
            href={rakutenUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              flex: '1 1 100px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              background: '#BF0000', color: 'white',
              fontSize: 12, fontWeight: 900,
              borderRadius: 8, padding: '9px 12px',
              textDecoration: 'none', whiteSpace: 'nowrap', minHeight: 40,
            }}
          >
            🛍️ 楽天で見る
          </a>
        )}
      </div>
    </div>
  )
}
