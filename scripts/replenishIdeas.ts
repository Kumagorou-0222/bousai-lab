/**
 * 記事アイデア自動補充スクリプト
 *
 * data/article-ideas.json の「未使用アイデア」（下書きも公開記事も無いもの）が
 * しきい値を下回ったら、Claude API で新しいアイデアを生成して追記する。
 * 毎日の自動ストック生成ワークフローの先頭で実行する想定。
 *
 * 必須環境変数:
 *   ANTHROPIC_API_KEY — Claude API キー
 *
 * 実行例:
 *   npx tsx scripts/replenishIdeas.ts               # 未使用が5件未満なら10件補充
 *   npx tsx scripts/replenishIdeas.ts --min 10 --add 20
 */

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import type { ArticleIdea } from '../lib/draftUtils'
import { getAllDraftSlugs } from '../lib/draftUtils'
import { getAllSlugs } from '../lib/articles'

const IDEAS_PATH = path.join(process.cwd(), 'data', 'article-ideas.json')

const SYSTEM_PROMPT = `あなたは防災・防犯情報サイト「防災Lab」（武蔵野市在住の現役医師が監修）の編集者です。
検索ニーズがあり、読者が今すぐ行動できる実用的な記事アイデアを日本語で提案します。

守るべきルール：
- 防災（地震・台風・停電・豪雨・避難・備蓄）と防犯（空き巣・詐欺・見守り・住まいの安全）をバランスよく混ぜる
- 既存記事と重複しないテーマにする
- スラッグは英小文字とハイフンのみ
- 出力は必ず有効なJSON配列のみ。マークダウンコードブロックは使わない`

function buildUserPrompt(count: number, existingSlugs: string[], existingTitles: string[]): string {
  return `新しい記事アイデアを${count}件、JSON配列で生成してください。

## 既存スラッグ（重複禁止）
${existingSlugs.join(', ')}

## 既存タイトル（テーマの重複も避ける）
${existingTitles.slice(0, 60).join('\n')}

## 出力するJSONの構造（配列）

[
  {
    "title": "記事タイトル（40字以内・具体的な悩みに答える形）",
    "slug": "english-slug-with-hyphens",
    "category": "earthquake | blackout | evacuation | disaster-prep | typhoon | heavy-rain | flood | tsunami | landslide | volcano | crime-prevention",
    "targetKeyword": "検索キーワード（スペース区切り2〜3語）",
    "intent": "読者が知りたいこと（1文）",
    "xSeries": "保存版 | これだけでOK | 1分防災 | 家族で確認",
    "monetizeItems": ["関連する防災・防犯グッズ名（0〜3個）"]
  }
]

${count}件のうち少なくとも3件は crime-prevention（防犯）にしてください。`
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const minIndex = args.indexOf('--min')
  const addIndex = args.indexOf('--add')
  const minUnused = minIndex >= 0 ? parseInt(args[minIndex + 1], 10) : 5
  const addCount = addIndex >= 0 ? parseInt(args[addIndex + 1], 10) : 10

  const ideas: ArticleIdea[] = JSON.parse(fs.readFileSync(IDEAS_PATH, 'utf-8'))
  const used = new Set([...getAllDraftSlugs(), ...getAllSlugs()])
  const unused = ideas.filter((i) => !used.has(i.slug))

  console.log(`アイデア総数: ${ideas.length} / 未使用: ${unused.length}（しきい値: ${minUnused}）`)

  if (unused.length >= minUnused) {
    console.log('補充は不要です。')
    return
  }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY が未設定です')
  const client = new Anthropic({ apiKey: key })

  const existingSlugs = [...new Set([...ideas.map((i) => i.slug), ...used])]
  const existingTitles = ideas.map((i) => i.title)

  let newIdeas: ArticleIdea[] | null = null
  for (let attempt = 1; attempt <= 3 && !newIdeas; attempt++) {
    try {
      console.log(`Claude API 呼び出し (attempt ${attempt})...`)
      const res = await client.messages.create({
        model: 'claude-opus-4-8',
        max_tokens: 8192,
        thinking: { type: 'adaptive' },
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserPrompt(addCount, existingSlugs, existingTitles) }],
      })

      if (res.stop_reason === 'refusal') throw new Error('リクエストが拒否されました')
      const textBlock = res.content.find((b) => b.type === 'text')
      const text = textBlock?.type === 'text' ? textBlock.text : ''
      const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim()
      const parsed = JSON.parse(cleaned) as ArticleIdea[]
      // スラッグ重複・形式不正を除外
      const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/
      newIdeas = parsed.filter(
        (i) => i.title && i.slug && slugPattern.test(i.slug) && !existingSlugs.includes(i.slug),
      )
      if (newIdeas.length === 0) throw new Error('有効な新規アイデアがありません')
    } catch (e) {
      console.warn(`attempt ${attempt} 失敗:`, e instanceof Error ? e.message : e)
      if (attempt >= 3) throw e
    }
  }

  const merged = [...ideas, ...newIdeas!]
  fs.writeFileSync(IDEAS_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf-8')
  console.log(`✅ ${newIdeas!.length} 件補充（総数: ${merged.length}）`)
  for (const i of newIdeas!) console.log(`  + [${i.category}] ${i.title} (${i.slug})`)
}

main().catch((err) => {
  console.error('❌ エラー:', err)
  process.exit(1)
})
