import type { Metadata } from 'next'
import { getAllXPosts } from '@/lib/xpost'
import { getAllArticlesMeta } from '@/lib/articles'
import { PRIORITY_ARTICLES, buildPriorityCandidates, type XPostCandidate } from '@/lib/xPostQueue'
import { generateDailySchedule, getTodayJST } from '@/lib/xScheduler'
import XPostList from './XPostList'
import DailySchedule from './DailySchedule'

// 今日の日付で毎回サーバーレンダリング（日付ベースseedのため）
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'X投稿管理 | 防災Lab',
  description: '防災Labの今日のX投稿案（朝・昼・夜）と全記事の投稿文一覧。',
  robots: { index: false },
}

export default function XPostsPage() {
  const dateStr = getTodayJST()
  const posts = getAllXPosts()
  const allMeta = getAllArticlesMeta()

  const articleMap = new Map(allMeta.map((a) => [a.slug, a]))
  const priorityCandidates: XPostCandidate[] = buildPriorityCandidates(articleMap)

  // 日付ベースseedで初期スケジュールを生成
  const initialSchedule = generateDailySchedule(priorityCandidates, dateStr)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      {/* ページヘッダー */}
      <div style={{
        background: 'linear-gradient(135deg, #000 0%, #1A1A2E 100%)',
        borderRadius: 20,
        padding: '28px 24px',
        marginBottom: 32,
        color: 'white',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>𝕏</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 8px' }}>
          X投稿管理
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>
          朝・昼・夜の3枠を自動生成。コピーしてXに投稿してください。<br />
          Telegram通知とは別系統 ／ 優先{PRIORITY_ARTICLES.length}記事 ／ S:A:Bランク重み5:3:1
        </p>
        <div style={{
          marginTop: 12, fontSize: 11, fontWeight: 700,
          display: 'inline-block', padding: '4px 12px',
          borderRadius: 20, background: 'rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.8)',
        }}>
          ✅ 手動投稿モード（X API課金なし）
        </div>
      </div>

      {/* 今日の朝昼夜スケジュール */}
      <DailySchedule
        initialSchedule={initialSchedule}
        candidates={priorityCandidates}
        dateStr={dateStr}
      />

      {/* 区切り */}
      <div style={{
        borderTop: '2px solid #E2E8F0',
        paddingTop: 32,
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
          📚 全記事の投稿文一覧
        </h2>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
          全{posts.length}記事の投稿文（Short / Normal）。カテゴリ別・優先記事別で表示。
        </p>
      </div>

      <XPostList posts={posts} priorityCandidates={priorityCandidates} />
    </div>
  )
}
