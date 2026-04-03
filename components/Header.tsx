import Link from 'next/link'

export default function Header() {
  return (
    <header style={{ background: 'linear-gradient(135deg, #1A1A2E, #0F3460)', padding: '0 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 18, fontFamily: 'Kaisei Decol, serif', lineHeight: 1.2 }}>
            🛡️ 防災Lab
          </span>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 600, letterSpacing: '0.03em' }}>
            在宅避難のための実践ガイド
          </span>
        </Link>
        <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/category/earthquake" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>地震</Link>
          <Link href="/category/typhoon" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>台風</Link>
          <Link href="/category/blackout" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>停電</Link>
          <Link href="/category/evacuation" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>避難</Link>
          <Link href="/musashino-bousai" style={{ color: '#FFD000', fontSize: 12, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,208,0,0.5)', borderRadius: 20, padding: '3px 10px' }}>
            📍 武蔵野市
          </Link>
        </nav>
      </div>
    </header>
  )
}
