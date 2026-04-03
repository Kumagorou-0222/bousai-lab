/**
 * CTAButton — 記事内に設置するCTAボタン
 * アフィリエイトリンクを後から href に挿入できる構造
 */
export default function CtaButton({
  text = '今のうちに防災グッズを準備する',
  href = '/articles/disaster-prep-goods',
  emoji = '🎒',
}: {
  text?: string
  href?: string
  emoji?: string
}) {
  return (
    <div style={{
      margin: '32px 0',
      padding: '20px',
      background: 'linear-gradient(135deg, #FFF3E0, #FFFDE7)',
      borderRadius: 16,
      border: '2px solid #FF6B00',
      textAlign: 'center',
    }}>
      <p style={{
        fontSize: 13, color: '#666', marginBottom: 12, fontWeight: 600,
      }}>
        ⚠️ 災害はいつ来るかわかりません
      </p>
      <a
        href={href}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#FF6B00', color: 'white',
          padding: '14px 28px', borderRadius: 50,
          textDecoration: 'none', fontWeight: 700,
          fontSize: 'clamp(14px, 3.5vw, 16px)',
          boxShadow: '0 4px 16px rgba(255,107,0,0.35)',
          transition: 'transform 0.15s',
        }}
      >
        <span style={{ fontSize: 20 }}>{emoji}</span>
        {text}
      </a>
    </div>
  )
}
