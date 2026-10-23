import { checkMetaConnection } from '../lib/metaPublisher.ts'

async function main() {
  if (process.env.META_CONNECTION_CHECK_ENABLED !== 'true') {
    throw new Error('Meta認証の読み取り確認は無効です')
  }
  const channel = process.argv[2]
  if (channel !== 'threads' && channel !== 'instagram') throw new Error('確認媒体を指定してください')
  await checkMetaConnection(channel)
  console.log(`${channel}の認証先アカウントIDを読み取り確認しました`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Meta認証の確認に失敗しました')
  process.exitCode = 1
})
