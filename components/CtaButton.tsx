import type { ArticleCategory } from '@/lib/categories'

// カテゴリ別のデフォルトCTA設定
const CATEGORY_CTA: Record<ArticleCategory, { text: string; emoji: string }> = {
  earthquake: { text: '地震対策グッズ（家具固定・防災リュック）を見る', emoji: '🏚️' },
  typhoon: { text: '台風対策グッズ（養生テープ・保存水）を見る', emoji: '🌀' },
  blackout: { text: '停電対策グッズ（懐中電灯・モバイルバッテリー）を見る', emoji: '🔦' },
  evacuation: { text: '避難に必要な防災グッズを見る', emoji: '🏃' },
  'disaster-prep': { text: '今のうちに防災グッズを準備する', emoji: '🎒' },
}

/**
 * CtaButton — 記事内に設置するCTAボタン
 * category を渡すとカテゴリ別の文言に自動切替
 * text/emoji を直接渡した場合はそちらを優先
 * href にアフィリエイトリンクを後から差し込める構造
 */
export default function CtaButton({
  text,
  href = '/articles/disaster-prep-goods',
  emoji,
  category,
}: {
  text?: string
  href?: string
  emoji?: string
  category?: ArticleCategory
}) {
  const defaults = category ? CATEGORY_CTA[category] : CATEGORY_CTA['disaster-prep']
  const label = text ?? defaults.text
  const icon = emoji ?? defaults.emoji

  return (
    <div style={{
      margin: '32px 0',
      padding: '20px',
      background: 'linear-gradient(135deg, #FFF3E0, #FFFDE7)',
      borderRadius: 16,
      border: '2px solid #FF6B00',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 12, color: '#888', marginBottom: 12, fontWeight: 600 }}>
        ⚠️ 災害はいつ来るかわかりません——今のうちに準備を
      </p>
      <a
        href={href}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#FF6B00', color: 'white',
          padding: '14px 28px', borderRadius: 50,
          textDecoration: 'none', fontWeight: 700,
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          boxShadow: '0 4px 16px rgba(255,107,0,0.35)',
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
        {label}
      </a>
    </div>
  )
}
