import { amazonProductUrl, RAKUTEN_ROOM_URL } from '@/lib/affiliateLinks'

type Props = {
  title?: string
  description?: string
  amazonQuery?: string
}

export default function RakutenBanner({
  title = '🛍️ 大家さんが選んだ防災グッズ',
  description = '実際に使えるものだけをピックアップ。楽天市場でカンタンに購入できます！',
  amazonQuery = '防災グッズ',
}: Props) {
  const amazonUrl = amazonProductUrl(amazonQuery)
  const rakutenUrl = RAKUTEN_ROOM_URL

  return (
    <div style={{
      background: 'linear-gradient(135deg, #BF0000, #E60000)',
      borderRadius: 16,
      padding: 30,
      textAlign: 'center',
      margin: '40px 0',
      color: 'white',
    }}>
      <h3 style={{ fontFamily: 'Kaisei Decol, serif', fontSize: 22, marginBottom: 10 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 20 }}>
        {description}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href={rakutenUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#FFD000',
            color: '#BF0000',
            fontWeight: 900,
            fontSize: 16,
            padding: '14px 32px',
            borderRadius: 50,
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
        >
          🛍️ 楽天ROOMで見る
        </a>
        <a
          href={amazonUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#FF9900',
            color: '#111',
            fontWeight: 700,
            fontSize: 15,
            padding: '14px 28px',
            borderRadius: 50,
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
        >
          🛒 Amazonで見る
        </a>
      </div>
    </div>
  )
}

