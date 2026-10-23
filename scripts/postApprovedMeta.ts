import { readFileSync } from 'node:fs'
import { runApprovedMetaPosts } from '../lib/metaAutoPost.ts'

async function main() {
  if (process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_REF !== 'refs/heads/main') {
    throw new Error('Meta自動投稿はmain以外では実行しません')
  }
  const manifest: unknown = JSON.parse(readFileSync('data/meta-approved-posts.json', 'utf8'))
  const result = await runApprovedMetaPosts(manifest)
  console.log(`Meta自動投稿: ${result.status}、承認済み${result.approvedCount}件、送信${result.sentCount}件`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Meta自動投稿の確認に失敗しました')
  process.exitCode = 1
})
