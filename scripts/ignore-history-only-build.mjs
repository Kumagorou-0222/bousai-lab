import { spawnSync } from 'node:child_process'

const historyPath = 'data/x-post-history.json'
const shaPattern = /^[0-9a-f]{40}$/i
const previous = process.env.VERCEL_GIT_PREVIOUS_SHA
const current = process.env.VERCEL_GIT_COMMIT_SHA

function git(...args) {
  return spawnSync('git', args, { encoding: 'utf8', maxBuffer: 1024 * 1024 })
}

function build(reason) {
  console.log(`ビルドを実行します: ${reason}`)
  process.exit(1)
}

if (!shaPattern.test(previous ?? '') || !shaPattern.test(current ?? '')) {
  build('比較するデプロイのSHAがありません')
}

const head = git('rev-parse', 'HEAD')
if (head.status !== 0 || head.stdout.trim() !== current) {
  build('現在のコミットを確認できません')
}

for (const sha of [previous, current]) {
  const found = git('cat-file', '-e', `${sha}^{commit}`)
  if (found.status !== 0) build('比較対象のコミットを取得できません')
}

if (git('merge-base', '--is-ancestor', previous, current).status !== 0) {
  build('前回のデプロイとの変更範囲を確認できません')
}

const diff = git('diff', '--no-renames', '--name-only', '-z', previous, current)
if (diff.status !== 0) build('変更ファイルを確認できません')

const changed = diff.stdout.split('\0').filter(Boolean)
if (changed.length === 1 && changed[0] === historyPath) {
  console.log('投稿履歴だけの変更のためビルドを省略します')
  process.exit(0)
}

build(changed.length === 0 ? '変更範囲が空です' : '投稿履歴以外にも変更があります')
