import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A2E', color: '#aaa', padding: '40px 20px', marginTop: 80, textAlign: 'center', fontSize: 13 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ fontWeight: 900, color: 'white', fontSize: 18, marginBottom: 4, fontFamily: 'Kaisei Decol, serif' }}>🛡️ 防災Lab</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>在宅避難のための実践ガイド</p>
        <p style={{ marginBottom: 20, fontSize: 12 }}>武蔵野市在住の現役勤務医師・大家さんが作った防災情報サイト</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <Link href="/category/earthquake" style={{ color: '#aaa', textDecoration: 'none', fontSize: 12 }}>地震対策</Link>
          <Link href="/category/typhoon" style={{ color: '#aaa', textDecoration: 'none', fontSize: 12 }}>台風対策</Link>
          <Link href="/category/blackout" style={{ color: '#aaa', textDecoration: 'none', fontSize: 12 }}>停電対策</Link>
          <Link href="/category/evacuation" style={{ color: '#aaa', textDecoration: 'none', fontSize: 12 }}>避難</Link>
          <Link href="/category/disaster-prep" style={{ color: '#aaa', textDecoration: 'none', fontSize: 12 }}>備蓄・準備</Link>
          <Link href="/musashino-bousai" style={{ color: '#FFD000', textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>📍 武蔵野市の防災</Link>
          <Link href="/about" style={{ color: '#aaa', textDecoration: 'none', fontSize: 12 }}>著者について</Link>
        </div>
        <p style={{ fontSize: 11, marginBottom: 8 }}>
          ※本サイトの情報は医師の監修のもと作成していますが、緊急時は必ず行政機関・医療機関の情報を優先してください。
        </p>
        <p style={{ fontSize: 11 }}>© 2026 防災Lab | くまごろう（武蔵野市）</p>
      </div>
    </footer>
  )
}
