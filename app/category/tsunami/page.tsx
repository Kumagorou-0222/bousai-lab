import type { Metadata } from 'next'
import ExtendedCategoryPage from '@/components/ExtendedCategoryPage'

export const metadata: Metadata = {
  title: '津波【警報が出たら今すぐやること・逃げ方】',
  description:
    '津波警報・注意報が出たら今すぐやること。何mで危険か・海辺での地震対応・津波避難ビルの使い方。「様子を見る」が命取りになる理由を解説。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/category/tsunami' },
  openGraph: {
    title: '津波【警報が出たら今すぐやること】｜防災Lab',
    description: '津波警報・注意報の違いと行動マニュアル。海辺での地震対応・避難ビルの使い方。',
    url: 'https://bousai-lab.vercel.app/category/tsunami',
  },
}

export default function TsunamiCategoryPage() {
  return (
    <ExtendedCategoryPage
      category="tsunami"
      heroTitle="津波から命を守ろう"
      rissMessage="地震の後、海の様子を見に行ってもいい？"
      robotMessage="絶対にダメだ。揺れを感じたら警報を待たず即座に海から離れ高台へ走れ。「様子を見る」は命取りだ"
      heroSubtitle="津波は「見てから逃げる」では間に合わない"
      ctaProducts={['防災リュック', 'ヘルメット', 'モバイルバッテリー', '非常食']}
    />
  )
}
