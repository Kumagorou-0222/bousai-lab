import { affiliateDisclosureText } from '@/lib/affiliateDisclosure'

export default function AffiliateDisclosure() {
  return (
    <p style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', margin: '12px 0 20px' }}>
      <strong>広告・アフィリエイトについて：</strong>{affiliateDisclosureText()}
    </p>
  )
}
