import { activeAmazonTag } from './amazonTag.ts'

export function affiliateDisclosureText(amazonTag = activeAmazonTag()): string {
  const rakuten = '楽天ROOMへの商品リンクを掲載しています。購入により紹介報酬が発生する場合があります。'
  const amazon = amazonTag
    ? 'Amazonのアソシエイトとして、防災Labは適格販売により収入を得ています。'
    : '現在のAmazonリンクにはアソシエイトタグを設定していません。'
  return `${rakuten}${amazon}`
}
