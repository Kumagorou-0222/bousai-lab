import type { Metadata } from 'next'
import { getAllXPosts } from '@/lib/xpost'
import XPostList from './XPostList'

export const metadata: Metadata = {
  title: 'X投稿一覧 | 防災Lab',
  description: '防災Labの全記事のX（Twitter）投稿文一覧。コピーしてそのまま投稿できます。',
  robots: { index: false },
}

export default function XPostsPage() {
  const posts = getAllXPosts()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      {/* ヘッダー */}
      <div style={{
        background: 'linear-gradient(135deg, #000 0%, #1A1A2E 100%)',
        borderRadius: 20,
        padding: '28px 24px',
        marginBottom: 32,
        color: 'white',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>𝕏</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 8px' }}>
          X投稿文 一覧
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>
          全{posts.length}記事の投稿文（Short / Normal）をカテゴリ別に表示。<br />
          コピーボタンでそのまま投稿できます。
        </p>
      </div>

      <XPostList posts={posts} />
    </div>
  )
}
