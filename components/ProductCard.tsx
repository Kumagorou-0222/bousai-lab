type Props = {
  name: string
  price: string
  description: string
  emoji: string
  url: string
  badge?: string
  accent?: string
}

export default function ProductCard({ name, price, description, emoji, url, badge, accent = '#2563EB' }: Props) {
  const lightBg = accent === '#DC2626' ? '#FEF2F2'
    : accent === '#D97706' ? '#FFFBEB'
    : accent === '#16A34A' ? '#F0FDF4'
    : '#EFF6FF'

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'white',
        border: `1.5px solid ${accent}44`,
        borderRadius: 14,
        padding: '14px 16px',
        marginBottom: 10,
        textDecoration: 'none',
        boxShadow: '0 2px 10px rgba(15,23,42,0.06)',
      }}
    >
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

      <div style={{
        background: '#FF9900', color: 'white',
        fontSize: 11, fontWeight: 700,
        borderRadius: 8, padding: '7px 12px',
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>
        Amazonで見る
      </div>
    </a>
  )
}
