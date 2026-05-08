import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#F8FAFC',
      borderTop: '1px solid #E2E8F0',
      padding: '40px 20px 32px',
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* ブランド */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6,
          }}>
            <span style={{
              background: '#2563EB', color: 'white',
              width: 28, height: 28, borderRadius: 8,
              display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 14,
            }}>🛡️</span>
            <span style={{ fontWeight: 900, color: '#0F172A', fontSize: 16, fontFamily: 'Kaisei Decol, serif' }}>
              防災Lab
            </span>
          </div>
          <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>
            在宅避難のための実践ガイド
          </p>
        </div>

        {/* ナビ */}
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: 24,
        }}>
          {[
            { href: '/category/earthquake', label: '地震対策' },
            { href: '/category/typhoon',    label: '台風対策' },
            { href: '/category/blackout',   label: '停電対策' },
            { href: '/category/evacuation', label: '避難' },
            { href: '/checklist',           label: '📋 防災チェックリスト', highlight: true },
            { href: '/best-disaster-items', label: '🎒 おすすめ防災グッズ', highlight: true },
            { href: '/earthquake-items',    label: '地震グッズ' },
            { href: '/blackout-items',      label: '停電グッズ' },
            { href: '/typhoon-items',       label: '台風グッズ' },
            { href: '/musashino',           label: '📍 武蔵野市の防災', highlight: true },
            { href: '/musashino-bousai',    label: '武蔵野市 避難所一覧' },
            { href: '/about',               label: '著者について' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{
              color: item.highlight ? '#2563EB' : '#64748B',
              textDecoration: 'none', fontSize: 12, fontWeight: item.highlight ? 700 : 500,
            }}>
              {item.highlight ? '📍 ' : ''}{item.label}
            </Link>
          ))}
        </div>

        {/* 区切り */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, lineHeight: 1.7 }}>
            ※本サイトの情報は医師の監修のもと作成していますが、緊急時は必ず行政機関・医療機関の情報を優先してください。
          </p>
          <p style={{ fontSize: 11, color: '#CBD5E1' }}>
            © 2026 防災Lab — くまごろう（武蔵野市）
          </p>
        </div>
      </div>
    </footer>
  )
}
