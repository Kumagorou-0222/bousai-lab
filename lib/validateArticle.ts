import type { ArticleFrontmatter } from './articles'

export function validateArticle(slug: string, article: ArticleFrontmatter): void {
  const warn = (msg: string) => console.warn(`[manga-validate] ${slug}: ${msg}`)

  if (!article.conclusion) warn('conclusion が未設定')
  if (!article.reasons || article.reasons.length === 0) warn('reasons が未設定')
  if (!article.xPost) warn('xPost が未設定')
  if (!article.monetizeItems || article.monetizeItems.length === 0) warn('monetizeItems が未設定')

  const hasImages = (article.mangaImages?.length ?? 0) > 0
  const hasPanels = (article.manga?.panels?.length ?? 0) > 0

  if (!hasImages && !hasPanels) {
    warn('mangaImages も manga.panels も未設定 → デフォルト4コマを使用')
  } else if (hasPanels && (article.manga!.panels.length < 4)) {
    warn(`manga.panels が ${article.manga!.panels.length} 枚 → 残り ${4 - article.manga!.panels.length} 枚を自動補完`)
  }
}
