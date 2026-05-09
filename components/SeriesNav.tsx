import Link from 'next/link'
import { getSeriesForArticle } from '@/lib/series'
import { getArticleBySlug } from '@/lib/articles'

interface Props {
  slug: string
}

export default function SeriesNav({ slug }: Props) {
  const result = getSeriesForArticle(slug)
  if (!result) return null

  const { series, index } = result

  const articles = series.articles.map((s) => {
    try {
      const a = getArticleBySlug(s)
      return { slug: s, title: a.title, emoji: a.emoji }
    } catch {
      return null
    }
  }).filter(Boolean) as { slug: string; title: string; emoji: string }[]

  const nextArticle = index + 1 < articles.length ? articles[index + 1] : null

  return (
    <div style={{
      background: '#F0F9FF',
      border: '2px solid #BFDBFE',
      borderRadius: 16,
      padding: '20px',
      marginTop: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>{series.emoji}</span>
        <span style={{ fontWeight: 800, fontSize: 14, color: '#1E40AF' }}>{series.label}</span>
        <span style={{
          marginLeft: 'auto',
          background: '#DBEAFE', color: '#1E40AF',
          borderRadius: 20, padding: '2px 10px',
          fontSize: 11, fontWeight: 700,
        }}>
          {index + 1} / {series.articles.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: nextArticle ? 14 : 0 }}>
        {articles.map((a, i) => (
          <Link key={a.slug} href={`/articles/${a.slug}`} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 10,
            textDecoration: 'none',
            background: a.slug === slug ? '#DBEAFE' : 'white',
            border: `1.5px solid ${a.slug === slug ? '#93C5FD' : '#E2E8F0'}`,
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: '50%',
              background: a.slug === slug ? '#1E40AF' : '#CBD5E1',
              color: 'white', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {i + 1}
            </span>
            <span style={{
              fontSize: 12, flex: 1, lineHeight: 1.4,
              color: a.slug === slug ? '#1E40AF' : '#64748B',
              fontWeight: a.slug === slug ? 700 : 500,
            }}>
              {a.emoji} {a.title}
            </span>
            {a.slug === slug && (
              <span style={{ fontSize: 10, color: '#3B82F6', fontWeight: 700, flexShrink: 0 }}>今ここ</span>
            )}
          </Link>
        ))}
      </div>

      {nextArticle && (
        <Link href={`/articles/${nextArticle.slug}`} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
          borderRadius: 12, padding: '14px 16px',
          textDecoration: 'none', color: 'white',
        }}>
          <span style={{ fontSize: 20 }}>{nextArticle.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>次に読む →</div>
            <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.4 }}>{nextArticle.title}</div>
          </div>
          <span style={{ fontSize: 22, opacity: 0.8 }}>›</span>
        </Link>
      )}
    </div>
  )
}
