// 既存の記事・投稿文生成関数を使い、Worker用の朝昼候補を生成する。
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { getAllArticlesMeta } from '../lib/articles'
import { buildPriorityCandidates } from '../lib/xPostQueue'
import { generateHashtags, applyHashtags, applySlotLabel } from '../lib/xHashtags'

const articles = getAllArticlesMeta()
const candidates = buildPriorityCandidates(new Map(articles.map(a => [a.slug, a])))
if (candidates.length !== 24) throw new Error('朝昼の候補記事数が想定と異なります')

const output = candidates.map(candidate => {
  const text = (slot: 'morning' | 'noon') => applyHashtags(
    applySlotLabel(candidate.text, slot, candidate.xSeries),
    generateHashtags({ slug: candidate.slug, category: candidate.category,
      slot, xSeries: candidate.xSeries, hasRegion: candidate.hasRegion }),
  )
  const imagePath = candidate.mangaImages.find(img => {
    if (!/^\/manga\/[a-z0-9/_-]+\.png$/.test(img) || img.includes('..')) return false
    return fs.existsSync(path.join(process.cwd(), 'public', img.slice(1)))
  }) ?? null
  const image = imagePath ? fs.readFileSync(path.join(process.cwd(), 'public', imagePath.slice(1))) : null
  if (image && (image.length < 24 || image.toString('ascii', 12, 16) !== 'IHDR')) {
    throw new Error('朝昼の候補画像がPNGではありません')
  }
  return { slug: candidate.slug, rank: candidate.rank, title: candidate.title,
    morningText: text('morning'), noonText: text('noon'), imagePath,
    imageSha256: image ? createHash('sha256').update(image).digest('hex') : null,
    width: image?.readUInt32BE(16) ?? null, height: image?.readUInt32BE(20) ?? null }
})

const target = path.join(process.cwd(), 'data', 'x-day-candidates.json')
fs.writeFileSync(target, JSON.stringify(output, null, 2) + '\n', 'utf8')
console.log(`朝昼候補 ${output.length} 件を生成しました`)

