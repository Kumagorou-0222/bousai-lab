'use client'
import Link from 'next/link'
import type { ArticleMeta } from '@/lib/articles'
import { CATEGORY_MAP } from '@/lib/categories'

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  earthquake:     { bg: '#FEF2F2', text: '#DC2626' },
  typhoon:        { bg: '#EFF6FF', text: '#2563EB' },
  blackout:       { bg: '#FFFBEB', text: '#D97706' },
  evacuation:     { bg: '#F0FDF4', text: '#16A34A' },
  'disaster-prep':{ bg: '#F8FAFC', text: '#475569' },
}

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  const cat = CATEGORY_MAP[article.category]
  const colors = CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS['disaster-prep']
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'white',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 2px 10px rgba(15,23,42,0.06)',
        border: '1.5px solid #E2E8F0',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#2563EB'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(37,99,235,0.12)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#E2E8F0'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 10px rgba(15,23,42,0.06)'
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>{article.emoji}</div>
        <div style={{
          display: 'inline-block',
          background: colors.bg, color: colors.text,
          fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '2px 10px', marginBottom: 10,
        }}>
          {cat.emoji} {cat.label}
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5, marginBottom: 8, color: '#0F172A', flex: 1 }}>
          {article.title}
        </h3>
        <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6, marginBottom: 8 }}>
          {article.description.slice(0, 60)}…
        </p>
        <div style={{ fontSize: 11, color: '#CBD5E1' }}>{article.date}</div>
      </div>
    </Link>
  )
}
