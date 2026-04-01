type Props = {
  name: string
  price: string
  description: string
  emoji: string
  url: string
  badge?: string
}

export default function ProductCard({ name, price, description, emoji, url, badge }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'white',
        border: '1.5px solid #FFE0B2',
        borderRadius: 16,
        padding: '16px 20px',
        marginBottom: 12,
        textDecoration: 'none',
        boxShadow: '0 2px 8px rgba(255,107,0,0.08)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      {/* 左：絵文字アイコン */}
      <div style={{
        width: 64,
        height: 64,
        background: 'linear-gradient(135deg, #FFF3E0, #FFFDE7)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 32,
        flexShrink: 0,
      }}>
        {emoji}
      </div>

      {/* 中央：テキスト */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {badge && (
          <span style={{
            display: 'inline-block',
            background: '#FF6B00',
            color: 'white',
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 20,
            padding: '2px 8px',
            marginBottom: 4,
          }}>
            {badge}
          </span>
        )}
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', lineHeight: 1.4, marginBottom: 4 }}>
          {name}
        </div>
        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
          {description}
        </div>
        <div style={{ fontSize: 13, color: '#FF6B00', fontWeight: 700, marginTop: 4 }}>
          {price}
        </div>
      </div>

      {/* 右：ボタン */}
      <div style={{
        background: '#FF9900',
        color: 'white',
        fontSize: 12,
        fontWeight: 700,
        borderRadius: 8,
        padding: '8px 14px',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}>
        Amazonで見る
      </div>
    </a>
  )
}
