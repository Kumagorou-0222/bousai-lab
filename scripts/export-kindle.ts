import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createCanvas, loadImage } from 'canvas'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')
const OUTPUT_DIR = path.join(process.cwd(), 'kindle-export')
const MANGA_OUT_DIR = path.join(OUTPUT_DIR, 'manga-merged')

// ディレクトリ作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}
if (!fs.existsSync(MANGA_OUT_DIR)) {
  fs.mkdirSync(MANGA_OUT_DIR, { recursive: true })
}

/**
 * 4つの画像を縦長（2x2）に結合してJPGで保存する
 */
async function mergeMangaPanels(images: string[], outFileName: string) {
  if (images.length !== 4) return null

  try {
    const loadedImages = await Promise.all(
      images.map((imgPath) => loadImage(path.join(process.cwd(), 'public', imgPath)))
    )

    // 全画像の幅・高さを取得（全て同じサイズと仮定）
    const width = loadedImages[0].width
    const height = loadedImages[0].height

    // 2x2で配置するためのキャンバス作成
    const canvas = createCanvas(width * 2, height * 2)
    const ctx = canvas.getContext('2d')

    // 背景を白に塗る（JPGなので透過を防止）
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width * 2, height * 2)

    // 画像を描画
    ctx.drawImage(loadedImages[0], 0, 0, width, height)       // 左上
    ctx.drawImage(loadedImages[1], width, 0, width, height)   // 右上
    ctx.drawImage(loadedImages[2], 0, height, width, height)  // 左下
    ctx.drawImage(loadedImages[3], width, height, width, height) // 右下

    const outPath = path.join(MANGA_OUT_DIR, outFileName)
    const outBuffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
    fs.writeFileSync(outPath, outBuffer)

    return outPath
  } catch (error) {
    console.error(`Error merging manga panels: ${error}`)
    return null
  }
}

/**
 * 本文のクレンジング（Kindleで使えないコンポーネントの除去・置換）
 */
function cleanContent(content: string, slug: string) {
  let cleaned = content

  // 1. <Dialogue>の置換
  // <Dialogue riss="こんにちは" robot="やあ" /> -> **リス**: こんにちは \n\n **ロボット**: やあ
  cleaned = cleaned.replace(/<Dialogue\s+riss="([^"]+)"\s+robot="([^"]+)"\s*\/>/g, '**リス**: $1\n\n**ロボット**: $2\n')
  cleaned = cleaned.replace(/<Dialogue\s+robot="([^"]+)"\s+riss="([^"]+)"\s*\/>/g, '**ロボット**: $1\n\n**リス**: $2\n')

  // 2. <ProductCard>の置換（アフィリエイト対策）
  cleaned = cleaned.replace(/<ProductCard\s+id="([^"]+)"\s*\/>/g, `👉 関連グッズの詳細はこちら： https://bousai-lab.vercel.app/articles/${slug}`)

  // 3. <CtaButton>の置換
  cleaned = cleaned.replace(/<CtaButton\s+href="([^"]+)".*?>(.*?)<\/CtaButton>/s, `👉 $2： $1`)

  // 4. その他の不要なタグを除去
  cleaned = cleaned.replace(/<Card>.*?<\/Card>/gs, '')

  return cleaned
}

/**
 * 記事を処理してMarkdownテキストを生成
 */
async function processArticle(slug: string, index: number): Promise<string> {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    console.warn(`Article not found: ${filePath}`)
    return ''
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  let markdown = `\n\n# 第${index + 1}章：${data.title}\n\n`
  
  if (data.description) {
    markdown += `*${data.description}*\n\n`
  }

  // マンガ画像があれば結合処理
  if (data.mangaImages && data.mangaImages.length === 4) {
    const mergedFileName = `${slug}-manga.jpg`
    const mergedPath = await mergeMangaPanels(data.mangaImages, mergedFileName)
    if (mergedPath) {
      markdown += `![マンガ](manga-merged/${mergedFileName})\n\n`
    }
  }

  // 本文をクレンジングして追加
  markdown += cleanContent(content, slug)

  // まとめ・結論があれば追加
  if (data.conclusion) {
    markdown += `\n\n## まとめ\n${data.conclusion}\n`
  }

  return markdown
}

async function main() {
  console.log('Kindle export started...')

  // 目次に沿った対象記事リスト（一部抜粋）
  const chapters = [
    'earthquake-indoor',
    'earthquake-furniture',
    'disaster-insurance',
    'hazard-map',
    'disaster-prep-goods',
    'blackout-refrigerator',
    'blackout-heat-elderly',
    'disaster-recovery'
  ]

  let completeMarkdown = '# 防災完全ガイド\n\n'

  for (let i = 0; i < chapters.length; i++) {
    console.log(`Processing ${chapters[i]}...`)
    const chapterContent = await processArticle(chapters[i], i)
    completeMarkdown += chapterContent
  }

  // 完全版出力
  fs.writeFileSync(path.join(OUTPUT_DIR, 'complete-edition.md'), completeMarkdown)
  console.log('complete-edition.md created.')

  // 地域版出力（武蔵野市版）
  const musashinoPath = path.join(process.cwd(), 'content', 'musashino')
  let musashinoMarkdown = completeMarkdown
  musashinoMarkdown += '\n\n# 付録：武蔵野市 地域の防災情報\n\n'
  
  // 地域版記事があれば追加（ダミー例）
  musashinoMarkdown += '武蔵野市の避難所リストなどの地域情報がここに入ります。\n'
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'musashino-edition.md'), musashinoMarkdown)
  console.log('musashino-edition.md created.')

  console.log('Export finished successfully.')
}

main().catch(console.error)
