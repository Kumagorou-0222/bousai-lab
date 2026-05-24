import type { ArticleFrontmatter } from '@/lib/articles'
import { DEFAULT_MANGA_PANELS, completePanels } from '@/lib/defaultManga'
import MangaImageGallery from './MangaImageGallery'
import MangaDialogue from './MangaDialogue'

type Props = {
  article: Pick<ArticleFrontmatter, 'mangaImages' | 'manga'>
}

/**
 * 優先順位:
 * 1. mangaImages あり → MangaImageGallery（+ セリフ確認用 MangaDialogue）
 * 2. manga.panels あり → MangaDialogue（4枚未満は自動補完）
 * 3. どちらもなし → デフォルト4コマ
 */
export default function MangaSection({ article }: Props) {
  const hasImages = (article.mangaImages?.length ?? 0) > 0
  const rawPanels = article.manga?.panels ?? []
  const hasPanels = rawPanels.length > 0
  const panels = completePanels(hasPanels ? rawPanels : DEFAULT_MANGA_PANELS)

  if (hasImages) {
    return (
      <div style={{ marginBottom: 8 }}>
        {/* 画像4コマ（メイン表示） */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 700, color: '#1E40AF',
          background: '#EFF6FF', border: '1px solid #BFDBFE',
          borderRadius: 20, padding: '4px 12px', marginBottom: 10,
        }}>
          <span>🎨</span><span>4コマ漫画</span>
        </div>
        <MangaImageGallery images={article.mangaImages!} />
      </div>
    )
  }

  // 画像なし：テキスト4コマ（補完済み）
  const isDefault = !hasPanels
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12, fontWeight: 700, color: '#15803D',
        background: '#F0FDF4', border: '1px solid #BBF7D0',
        borderRadius: 20, padding: '4px 12px', marginBottom: 10,
      }}>
        <span>💬</span>
        <span>{isDefault ? '4コマ漫画' : 'セリフで確認'}</span>
      </div>
      <MangaDialogue panels={panels} />
    </div>
  )
}
