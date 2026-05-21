import Link from 'next/link'

export default function Footer() {
  const categoryLinks = [
    { href: '/category/earthquake', label: '地震対策' },
    { href: '/category/typhoon',    label: '台風対策' },
    { href: '/category/blackout',   label: '停電対策' },
    { href: '/category/evacuation', label: '避難' },
  ]

  const featuredLinks = [
    { href: '/musashino',           label: '📍 武蔵野市の防災' },
    { href: '/checklist',           label: '📋 防災チェックリスト' },
    { href: '/best-disaster-items', label: '🎒 おすすめ防災グッズ' },
    { href: '/manga',               label: '📖 まんがで学ぶ' },
    { href: '/characters',          label: '🐿️ キャラクター紹介' },
  ]

  const subLinks = [
    { href: '/about', label: '著者について' },
  ]

  return (
    <footer style={{
      background: '#F8FAFC',
      borderTop: '1px solid #E2E8F0',
      padding: '40px 20px 32px',
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* ブランド */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
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
            在宅避難のための実践ガイド｜武蔵野市在住の現役医師監修
          </p>
        </div>

        {/* 主要リンク */}
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: 16,
        }}>
          {featuredLinks.map((item) => (
            <Link key={item.href} href={item.href} style={{
              color: '#2563EB', textDecoration: 'none',
              fontSize: 13, fontWeight: 700,
            }}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* カテゴリリンク */}
        <div style={{
          display: 'flex', gap: 16, justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: 16,
        }}>
          {categoryLinks.map((item) => (
            <Link key={item.href} href={item.href} style={{
              color: '#64748B', textDecoration: 'none', fontSize: 12, fontWeight: 500,
            }}>
              {item.label}
            </Link>
          ))}
          {subLinks.map((item) => (
            <Link key={item.href} href={item.href} style={{
              color: '#64748B', textDecoration: 'none', fontSize: 12, fontWeight: 500,
            }}>
              {item.label}
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
