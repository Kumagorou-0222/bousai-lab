'use client'
import Link from 'next/link'
import type { ArticleMeta } from '@/lib/articles'
import { CATEGORY_MAP } from '@/lib/categories'

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  const cat = CATEGORY_MAP[article.category]
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 4px 20px rgba(255,107,0,0.12)',
        border: '2px solid transparent',
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#FF6B00'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 8 }}>{article.emoji}</div>
        <div style={{ display: 'inline-block', background: '#FFF3E0', color: '#FF6B00', fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '2px 10px', marginBottom: 10 }}>
          {cat.emoji} {cat.label}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, marginBottom: 8, color: '#1A1A1A', flex: 1 }}>
          {article.title}
        </h3>
        <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6, marginBottom: 8 }}>
          {article.description.slice(0, 60)}…
        </p>
        <div style={{ fontSize: 11, color: '#bbb' }}>{article.date}</div>
      </div>
    </Link>
  )
}
