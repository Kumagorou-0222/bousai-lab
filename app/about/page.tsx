import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: '著者について',
  description: '在宅避難ラボを運営するくまごろうのプロフィール。武蔵野市在住の現役勤務医師・マンションオーナー。医師の視点から防災・在宅避難情報を発信しています。',
}

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px 80px' }}>
      <Breadcrumb items={[{ label: 'ホーム', href: '/' }, { label: '著者について' }]} />

      <div style={{ textAlign: 'center', padding: '40px 0 48px' }}>
        <div style={{ width: 100, height: 100, background: 'linear-gradient(135deg, #FF6B00, #FFD000)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, margin: '0 auto 20px' }}>🐻</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Kaisei Decol, serif', color: '#1A1A1A', marginBottom: 8 }}>くまごろう</h1>
        <p style={{ color: '#666', fontSize: 14 }}>武蔵野市在住の現役勤務医師・マンションオーナー</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(255,107,0,0.1)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#FF6B00' }}>🩺 プロフィール</h2>
          <ul style={{ fontSize: 14, lineHeight: 2, color: '#555', paddingLeft: 20 }}>
            <li>武蔵野市在住の現役勤務医師</li>
            <li>武蔵野市でマンションを経営する大家さん</li>
            <li>医師として「命を守る防災知識」を発信</li>
            <li>大家として「自宅を最強の避難場所にする備え」を研究</li>
          </ul>
        </div>

        <div style={{ background: '#FFF3E0', borderRadius: 20, padding: 32, borderLeft: '4px solid #FF6B00' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#1A1A1A' }}>💡 このサイトを作った理由</h2>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: '#555' }}>
            医師として日々患者さんと接するなかで、「災害時に適切な医療が受けられない」リスクがいかに大きいかを実感しています。持病を持つ方が薬を切らす、避難所での感染症集団発生、ストレスによる持病の悪化——これらは実際に起きていることです。
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: '#555', marginTop: 12 }}>
            また、マンションオーナーとして「住んでいる方たちが地震や台風のときどうすれば安全でいられるか」もずっと考えてきました。「避難所に行く」だけが答えじゃない。医師の視点から「おうちで安全に過ごす」ための正しい知識を、多くの方に知ってほしくて、このサイトを作りました。
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(255,107,0,0.1)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🛒 防災グッズ（楽天ルーム）</h2>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 20 }}>
            実際に役立つと思う防災グッズを厳選して楽天市場にまとめています。
          </p>
          <a
            href="https://room.rakuten.co.jp/room_e510207d9c/items"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', background: '#BF0000', color: 'white', fontWeight: 700, padding: '12px 28px', borderRadius: 50, textDecoration: 'none', fontSize: 14 }}
          >
            🛍️ 楽天ルームで見る
          </a>
        </div>
      </div>
    </div>
  )
}
