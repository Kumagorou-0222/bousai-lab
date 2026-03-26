import Link from 'next/link'

export default function Header() {
  return (
    <header style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9500)', padding: '0 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link href="/" style={{ color: 'white', fontWeight: 900, fontSize: 20, textDecoration: 'none', fontFamily: 'Kaisei Decol, serif' }}>
          🏠 在宅避難ラボ
        </Link>
        <nav style={{ display: 'flex', gap: 20 }}>
          <Link href="/category/earthquake" style={{ color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>地震</Link>
          <Link href="/category/blackout" style={{ color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>停電</Link>
          <Link href="/category/evacuation" style={{ color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>避難所</Link>
          <Link href="/category/disaster-prep" style={{ color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>備蓄</Link>
          <Link href="/about" style={{ color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>著者</Link>
          <a
            href="https://room.rakuten.co.jp/room_e510207d9c/items"
            target="_blank"
            rel="nofollow noopener noreferrer"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ color: '#FFD000', fontSize: 13, fontWeight: 700, textDecoration: 'none', border: '1px solid #FFD000', borderRadius: 20, padding: '3px 10px' }}
          >
            🛍️ 楽天ルーム
          </a>
        </nav>
      </div>
    </header>
  )
}
