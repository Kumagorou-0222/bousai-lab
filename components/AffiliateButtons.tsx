import { amazonProductUrl, rakutenRoomUrl } from '@/lib/affiliateLinks'

type Props = {
  amazonUrl: string
  rakutenUrl: string
  amazonLabel?: string
  rakutenLabel?: string
  trustText?: string
}

export default function AffiliateButtons({
  amazonUrl,
  rakutenUrl,
  amazonLabel = 'Amazonで見る',
  rakutenLabel = '楽天で見る',
  trustText,
}: Props) {
  const resolvedAmazonUrl = amazonProductUrl(amazonUrl)
  const resolvedRakutenUrl = rakutenRoomUrl(rakutenUrl)

  return (
    <div>
      {trustText && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 20,
          padding: '4px 12px',
          marginBottom: 10,
          fontSize: 11,
          color: '#15803D',
          fontWeight: 700,
        }}>
          ✅ {trustText}
        </div>
      )}
      <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        <a
          href={resolvedAmazonUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            flex: '1 1 140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: '#FF9900',
            color: '#111',
            fontWeight: 900,
            fontSize: 14,
            padding: '14px 16px',
            borderRadius: 10,
            textDecoration: 'none',
            boxShadow: '0 3px 10px rgba(255,153,0,0.35)',
            minHeight: 48,
          }}
        >
          🛒 {amazonLabel}
        </a>
        <a
          href={resolvedRakutenUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            flex: '1 1 140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: '#BF0000',
            color: 'white',
            fontWeight: 900,
            fontSize: 14,
            padding: '14px 16px',
            borderRadius: 10,
            textDecoration: 'none',
            boxShadow: '0 3px 10px rgba(191,0,0,0.25)',
            minHeight: 48,
          }}
        >
          🛍️ {rakutenLabel.replace('楽天で見る', '楽天ROOMで見る')}
        </a>
      </div>
    </div>
  )
}
