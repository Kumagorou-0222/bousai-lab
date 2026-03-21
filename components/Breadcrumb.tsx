import Link from 'next/link'

type BreadcrumbItem = { label: string; href?: string }

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://bousai-lab.vercel.app${item.href}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="パンくずリスト" style={{ fontSize: 12, color: '#888', padding: '12px 0', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span style={{ color: '#ccc' }}>›</span>}
            {item.href ? (
              <Link href={item.href} style={{ color: '#FF6B00', textDecoration: 'none' }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: '#555' }}>{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
