import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { affiliateDisclosureText } from '../lib/affiliateDisclosure.ts'

test('Amazonタグ未設定時はAmazonと楽天を一律に紹介リンクと表示しない', () => {
  const text = affiliateDisclosureText(null)
  assert.match(text, /Amazonリンクにはアソシエイトタグを設定していません/)
  assert.match(text, /楽天ROOM.*紹介報酬が発生する場合があります/)
  assert.doesNotMatch(text, /Amazon・楽天リンクはアフィリエイトリンク/)
})

test('Amazonタグが有効ならアソシエイトの表示を出す', () => {
  assert.match(affiliateDisclosureText('valid-tag-22'), /Amazonのアソシエイトとして/)
})

test('記事内の古い一律表示を残さない', () => {
  for (const file of ['app/best-disaster-items/page.tsx', 'components/PrepItems.tsx', 'app/compare/[product]/page.tsx']) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /Amazon・楽天リンクはアフィリエイトリンクです/, file)
  }
})
