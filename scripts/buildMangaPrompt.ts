/**
 * 4コマ漫画用 ChatGPT プロンプト生成スクリプト
 *
 * 下書き（content/drafts/*.mdx）の manga.panels から、
 * ChatGPT（GPT-4o画像生成）に貼り付けるだけで4コマ漫画が生成できる
 * 日本語プロンプトを組み立てて content/drafts/manga-prompts/<slug>.txt に保存する。
 *
 * 実行例:
 *   npx tsx scripts/buildMangaPrompt.ts                # 画像未生成の下書きすべて
 *   npx tsx scripts/buildMangaPrompt.ts --slug xxx     # 指定slugのみ（記事も可）
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DRAFTS_DIR = path.join(process.cwd(), 'content', 'drafts')
const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')
const PROMPTS_DIR = path.join(DRAFTS_DIR, 'manga-prompts')
const MANGA_DIR = path.join(process.cwd(), 'public', 'manga')

// キャラクター特徴ロック（全プロンプト共通・変更しないこと）
const CHARACTER_LOCK = `■キャラクター設定（厳守・全コマ同一デザイン）: リス（防災リス）=2頭身のオレンジ茶色の子リス、大きなふさふさ尻尾、黄色い防災ヘルメット（緑のクローバーマーク）、黄色いパーカーの胸に緑のワッペン、緑の小さなリュック、大きな茶色の目。ロボ（レスQロボ）=2頭身の白×青のロボット、丸い頭、黒いフェイススクリーンに青く光る目と笑顔、頭の両側にアンテナ、青いマント、胸に青い盾型パネル（白い十字）。`

const STYLE_LOCK = `■スタイル（厳守）: 縦長2:3の1枚画像、4コマ縦一列、各コマ左上に丸数字①〜④、明るいフラットカラーのクリーンな線画、各コマに場面に合った背景をしっかり描き込む、キャラは毎コマ動きのあるポーズで立ち姿の使い回し禁止、吹き出しの日本語セリフは指定どおり正確に読みやすく。`

type Panel = { character: string; emotion?: string; message: string }

const EMOTION_DIRECTION: Record<string, string> = {
  worried: '不安そうに首をかしげて困り顔で',
  surprised: 'のけぞって目を丸くして驚きながら',
  relieved: 'ほっとした笑顔でうなずきながら',
  serious: 'ビシッと人差し指を立てて真剣な表情で',
  normal: '落ち着いた表情で説明しながら',
  happy: '嬉しそうに飛び跳ねながら',
}

function buildPrompt(title: string, panels: Panel[]): string {
  const lines = panels.slice(0, 4).map((p, i) => {
    const name = p.character === 'robot' ? 'ロボ' : 'リス'
    const pose = EMOTION_DIRECTION[p.emotion ?? ''] ?? '記事の内容に合った動きのあるポーズで'
    const marks = ['①', '②', '③', '④'][i]
    return `${marks}${name}が${pose}話す。場面に合った背景（室内・街・災害のイメージ等）を描く。吹き出し（${name}）「${p.message}」`
  })
  return [
    `かわいい2頭身キャラの4コマ漫画を1枚の縦長画像（アスペクト比2:3）で生成してください。`,
    CHARACTER_LOCK,
    `■4コマの内容（縦一列・上から順）: タイトル帯「${title}」を画像最上部に。`,
    ...lines,
    STYLE_LOCK,
  ].join(' ')
}

function loadMdx(slug: string): { title: string; panels: Panel[] } | null {
  for (const dir of [DRAFTS_DIR, ARTICLES_DIR]) {
    const file = path.join(dir, `${slug}.mdx`)
    if (!fs.existsSync(file)) continue
    const { data } = matter(fs.readFileSync(file, 'utf-8'))
    return { title: String(data.title ?? slug), panels: data.manga?.panels ?? [] }
  }
  return null
}

function main(): void {
  const args = process.argv.slice(2)
  const slugIndex = args.indexOf('--slug')
  const targetSlug = slugIndex >= 0 ? args[slugIndex + 1] : null

  let slugs: string[] = []
  if (targetSlug) {
    slugs = [targetSlug]
  } else if (fs.existsSync(DRAFTS_DIR)) {
    slugs = fs
      .readdirSync(DRAFTS_DIR)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''))
      .filter((slug) => !fs.existsSync(path.join(MANGA_DIR, slug, 'comic.png')))
  }

  if (slugs.length === 0) {
    console.log('対象がありません（下書きなし、または全て画像生成済み）。')
    return
  }

  fs.mkdirSync(PROMPTS_DIR, { recursive: true })

  for (const slug of slugs) {
    const mdx = loadMdx(slug)
    if (!mdx) {
      console.warn(`[skip] ${slug} — MDXが見つかりません`)
      continue
    }
    if (mdx.panels.length < 4) {
      console.warn(`[skip] ${slug} — manga.panels が4コマ未満`)
      continue
    }
    const outPath = path.join(PROMPTS_DIR, `${slug}.txt`)
    fs.writeFileSync(outPath, buildPrompt(mdx.title, mdx.panels) + '\n', 'utf-8')
    console.log(`✅ content/drafts/manga-prompts/${slug}.txt`)
  }

  console.log('\nこのプロンプトを ChatGPT（画像生成）に貼り付け、生成画像を')
  console.log('node scripts/save-comic.js --slug <slug> で保存してください。')
}

main()
