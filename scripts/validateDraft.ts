/**
 * 下書き品質チェックスクリプト
 * build fail にはしない — warning のみ出力する
 *
 * 実行例:
 *   npx tsx scripts/validateDraft.ts
 *   npx tsx scripts/validateDraft.ts --slug blackout-smartphone-battery
 */

import { getAllDraftSlugs, getDraftBySlug, validateDraftQuality } from '../lib/draftUtils'

const RESET  = '\x1b[0m'
const YELLOW = '\x1b[33m'
const GREEN  = '\x1b[32m'
const RED    = '\x1b[31m'
const BOLD   = '\x1b[1m'

function main(): void {
  const args = process.argv.slice(2)
  const slugIndex = args.indexOf('--slug')
  const targetSlug = slugIndex >= 0 ? args[slugIndex + 1] : null

  const slugs = targetSlug ? [targetSlug] : getAllDraftSlugs()

  if (slugs.length === 0) {
    console.log('下書きがありません。generateArticleDraft.ts を先に実行してください。')
    return
  }

  console.log(`\n${BOLD}=== 下書きバリデーション (${slugs.length} 件) ===${RESET}\n`)

  let okCount = 0
  let warnCount = 0

  for (const slug of slugs) {
    const draft = getDraftBySlug(slug)
    if (!draft) {
      console.log(`${RED}[ERROR]${RESET} ${slug} — ファイルが読めません`)
      continue
    }

    const { valid, warnings } = validateDraftQuality(draft)

    if (valid) {
      console.log(`${GREEN}[OK]${RESET} ${slug}`)
      console.log(`     "${draft.title}"`)
      okCount++
    } else {
      console.log(`${YELLOW}[WARN]${RESET} ${slug}`)
      console.log(`     "${draft.title}"`)
      for (const w of warnings) {
        console.log(`     ${YELLOW}⚠${RESET}  [${w.field}] ${w.message}`)
      }
      warnCount++
    }

    console.log()
  }

  console.log(`${BOLD}結果: OK ${okCount} 件 / WARN ${warnCount} 件${RESET}`)
  if (warnCount > 0) {
    console.log(`${YELLOW}※ ビルドはブロックしません。公開前に内容を確認してください。${RESET}`)
  }
  console.log()
}

main()
