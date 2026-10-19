import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { activeAmazonTag, sanitizeAmazonUrl } from '../lib/amazonTag.ts'
import { campaignUrl, socialDrafts } from '../lib/socialCampaign.ts'
import { readSocialAttribution } from '../lib/socialAttribution.ts'
import twitterText from 'twitter-text'

test('停止済みタグを再利用せず、有効な新タグだけを使う', () => {
  assert.equal(activeAmazonTag('bousailab0c-22', true), null)
  assert.equal(activeAmazonTag('new-tag-22'), null)
  assert.equal(activeAmazonTag('new-tag-22', true), 'new-tag-22')
  assert.equal(sanitizeAmazonUrl('https://www.amazon.co.jp/dp/B000000000?tag=bousailab0c-22', null), 'https://www.amazon.co.jp/dp/B000000000')
  assert.equal(sanitizeAmazonUrl('https://www.amazon.co.jp/dp/B000000000?tag=bousailab0c-22', 'new-tag-22'), 'https://www.amazon.co.jp/dp/B000000000?tag=new-tag-22')
})

test('公開される記事とレイアウトに停止済みタグが残らない', () => {
  for (const file of ['app/layout.tsx', 'content/articles/water-purifier-disaster.mdx', 'content/articles/disaster-hygiene-disinfection.mdx']) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /bousailab0c-22/, file)
  }
})

test('記事HTMLのAmazon hrefを開き方に依存せずサーバー側で確定する', () => {
  const article = readFileSync('app/articles/[slug]/page.tsx', 'utf8')
  assert.match(article, /components=\{\{ a: ArticleLink/)
  const raw = 'https://www.amazon.co.jp/dp/B0D3BHG5RR'
  assert.equal(sanitizeAmazonUrl(raw, null), raw)
  assert.equal(sanitizeAmazonUrl(raw, 'new-tag-22'), `${raw}?tag=new-tag-22`)
})

test('媒体ごとの記事URLとInstagramのプロフィール導線を作る', () => {
  const article = { slug: 'typhoon-prep-goods', title: '台風の備え', description: '必要な備えを確認する。' }
  const drafts = socialDrafts(article)
  assert.match(drafts.threads, /utm_source=threads/)
  assert.match(drafts.x, /utm_source=x/)
  assert.match(drafts.instagram, /プロフィールのリンク/)
  assert.equal(drafts.instagramProfileUrl, 'https://bousai-lab.vercel.app/from/instagram')
  assert.match(campaignUrl(article.slug, 'instagram', 'profile'), /utm_campaign=profile/)
  assert.throws(() => campaignUrl('../other', 'x'), /記事IDが不正/)
})

test('長い日本語のX投稿案が重み付き上限に収まる', () => {
  const draft = socialDrafts({ slug: 'typhoon-prep-goods', title: '防災'.repeat(180), description: '確認'.repeat(200) }).x
  assert.equal(twitterText.parseTweet(draft).valid, true)
  assert.ok(draft.includes('utm_source=x'))
})

test('入口の媒体・キャンペーン・内容だけを検証して保持できる', () => {
  assert.deepEqual(readSocialAttribution('?utm_source=threads&utm_campaign=article&utm_content=panel-2'), {
    source: 'threads', campaign: 'article', content: 'panel-2',
  })
  assert.equal(readSocialAttribution('?utm_source=external&utm_campaign=article'), null)
  assert.equal(readSocialAttribution('?utm_source=x&utm_campaign=bad%20value'), null)
})

test('Instagram入口は全記事を掲載し古い投稿からも到達できる', () => {
  const landing = readFileSync('app/from/instagram/page.tsx', 'utf8')
  assert.doesNotMatch(landing, /\.slice\(0,\s*20\)/)
  assert.match(landing, /getAllSlugs\(\)/)
})
