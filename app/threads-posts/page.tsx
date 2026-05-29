import type { Metadata } from 'next'
import { readHistory } from '@/lib/xAutoPost'
import { generateThreadsPost } from '@/lib/threadsPost'
import { MANGA_LIST } from '@/lib/manga'
import ThreadsPostCard from '@/components/ThreadsPostCard'

export const metadata: Metadata = {
  title: 'Threads投稿管理 | 防災Lab',
  robots: { index: false, follow: false },
}

const BASE_URL = 'https://bousai-lab.vercel.app'

// MANGA_LIST から articleSlug → 最初の mangaImage を引く
function getMangaImageBySlug(slug: string): string | undefined {
  const manga = MANGA_LIST.find((m) => m.articleSlug === slug)
  return manga?.mangaImages?.[0]
}

export default function ThreadsPostsPage() {
  const history = readHistory()
  // 直近30件（新しい順）
  const recent = [...history].reverse().slice(0, 30)

  const posts = recent.map((record) => {
    const threadsText = generateThreadsPost(record.text)
    const articleUrl = `${BASE_URL}/articles/${record.slug}`
    const mangaImageUrl = getMangaImageBySlug(record.slug)

    return {
      slug: record.slug,
      title: record.title,
      postedAt: record.postedAt,
      slot: record.slot,
      xText: record.text,
      threadsText,
      articleUrl,
      mangaImageUrl,
    }
  })

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      {/* ヘッダー */}
      <div style={{
        background: 'linear-gradient(160deg, #0D0D1A 0%, #1E1B4B 100%)',
        borderRadius: 20, padding: '32px 24px', margin: '24px 0 32px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)',
          color: '#A78BFA', padding: '5px 14px', borderRadius: 50,
          fontWeight: 700, fontSize: 12, marginBottom: 16,
        }}>
          🧵 Threads管理ページ
        </div>
        <h1 style={{
          color: 'white', fontSize: 22, fontWeight: 900,
          marginBottom: 10, fontFamily: 'Kaisei Decol, serif',
        }}>
          Threads投稿案
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.7 }}>
          X投稿をもとに自動生成したThreads用テキストです。<br />
          コピーして投稿するか、Threadsボタンで直接下書きを開けます。
        </p>
        <div style={{
          marginTop: 16, display: 'flex', gap: 16, justifyContent: 'center',
          fontSize: 12, color: 'rgba(255,255,255,0.5)',
        }}>
          <span>✅ URL末尾に1つ</span>
          <span>✅ ハッシュタグ最大2個</span>
          <span>✅ やわらかい語り口</span>
        </div>
      </div>

      {/* 件数 */}
      <div style={{
        fontSize: 13, color: '#64748B', marginBottom: 20, fontWeight: 600,
      }}>
        直近 {posts.length} 件のX投稿から生成
      </div>

      {posts.length === 0 ? (
        <div style={{
          background: '#F8FAFC', border: '1.5px dashed #CBD5E1',
          borderRadius: 16, padding: '40px 24px', textAlign: 'center',
          color: '#94A3B8', fontSize: 14,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>X投稿履歴がありません</div>
          <div>GitHub Actions でX自動投稿が実行されると、ここにThreads転用案が表示されます。</div>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <ThreadsPostCard key={`${post.slug}-${post.postedAt}`} {...post} />
          ))}
        </div>
      )}

      {/* フッター説明 */}
      <div style={{
        background: '#F8FAFC', border: '1px solid #E2E8F0',
        borderRadius: 14, padding: '16px 20px', marginTop: 32,
      }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#475569', marginBottom: 8 }}>
          📋 使い方
        </div>
        <ol style={{ fontSize: 12, color: '#64748B', lineHeight: 2, margin: 0, paddingLeft: 16 }}>
          <li>「テキストをコピー」ボタンでThreads投稿文をコピー</li>
          <li>「Threadsで投稿」ボタンでThreadsの投稿画面を開く（テキストが自動入力される場合あり）</li>
          <li>画像は別途アップロード。上記の漫画サムネイルを使用推奨</li>
        </ol>
      </div>

      <div style={{ fontSize: 10, color: '#CBD5E1', textAlign: 'center', marginTop: 24 }}>
        このページは検索エンジンにインデックスされません
      </div>
    </div>
  )
}
