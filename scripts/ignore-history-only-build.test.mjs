import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const script = fileURLToPath(new URL('./ignore-history-only-build.mjs', import.meta.url))

test('既存のVercel Ignored Build Stepを設定ファイルで上書きしない', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
  assert.equal(Object.hasOwn(config, 'ignoreCommand'), false)
})

function git(cwd, ...args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  return result.stdout.trim()
}

function commit(cwd, file, content) {
  const target = path.join(cwd, file)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, content)
  git(cwd, 'add', '.')
  git(cwd, 'commit', '-qm', 'test')
  return git(cwd, 'rev-parse', 'HEAD')
}

function fixture(t) {
  const cwd = mkdtempSync(path.join(tmpdir(), 'bousai-ignore-'))
  t.after(() => rmSync(cwd, { recursive: true, force: true }))
  git(cwd, 'init', '-q')
  git(cwd, 'config', 'user.name', 'test')
  git(cwd, 'config', 'user.email', 'test@example.com')
  const base = commit(cwd, 'data/x-post-history.json', '[]')
  return { cwd, base }
}

function decision(cwd, previous, current) {
  return spawnSync(process.execPath, [script], {
    cwd, encoding: 'utf8', env: {
      ...process.env,
      VERCEL_GIT_PREVIOUS_SHA: previous,
      VERCEL_GIT_COMMIT_SHA: current,
    },
  }).status
}

test('投稿履歴だけの複数コミットは省略する', (t) => {
  const { cwd, base } = fixture(t)
  commit(cwd, 'data/x-post-history.json', '[1]')
  const head = commit(cwd, 'data/x-post-history.json', '[1,2]')
  assert.equal(decision(cwd, base, head), 0)
})

test('間に記事の変更があれば最新コミットが履歴だけでもビルドする', (t) => {
  const { cwd, base } = fixture(t)
  commit(cwd, 'content/article.mdx', 'article')
  const head = commit(cwd, 'data/x-post-history.json', '[1]')
  assert.equal(decision(cwd, base, head), 1)
})

test('比較元がない場合と取得できない場合はビルドする', (t) => {
  const { cwd, base } = fixture(t)
  const head = commit(cwd, 'data/x-post-history.json', '[1]')
  assert.equal(decision(cwd, '', head), 1)
  assert.equal(decision(cwd, 'a'.repeat(40), head), 1)
  assert.equal(decision(cwd, base, 'b'.repeat(40)), 1)
})

test('差分なしはビルドする', (t) => {
  const { cwd, base } = fixture(t)
  assert.equal(decision(cwd, base, base), 1)
})
