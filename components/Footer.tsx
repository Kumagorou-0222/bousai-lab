import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A1A', color: '#aaa', padding: '40px 20px', marginTop: 80, textAlign: 'center', fontSize: 13 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ fontWeight: 700, color: 'white', fontSize: 16, marginBottom: 12 }}>🏠 在宅避難ラボ</p>
        <p style={{ marginBottom: 16 }}>武蔵野市在住の現役勤務医師・大家さんが作った防災情報サイト</p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <Link href="/category/earthquake" style={{ color: '#aaa', textDecoration: 'none' }}>地震対策</Link>
          <Link href="/category/blackout" style={{ color: '#aaa', textDecoration: 'none' }}>停電対策</Link>
          <Link href="/category/evacuation" style={{ color: '#aaa', textDecoration: 'none' }}>避難所</Link>
          <Link href="/category/disaster-prep" style={{ color: '#aaa', textDecoration: 'none' }}>備蓄・準備</Link>
          <Link href="/about" style={{ color: '#aaa', textDecoration: 'none' }}>著者について</Link>
        </div>
        <p style={{ fontSize: 11, marginBottom: 8 }}>
          ※本サイトの情報は医師の監修のもと作成していますが、緊急時は必ず行政機関・医療機関の情報を優先してください。
        </p>
        <p style={{ fontSize: 11 }}>© 2026 在宅避難ラボ | くまごろう（武蔵野市）</p>
      </div>
    </footer>
  )
}
