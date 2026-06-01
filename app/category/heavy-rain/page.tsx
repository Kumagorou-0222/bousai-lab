import type { Metadata } from 'next'
import ExtendedCategoryPage from '@/components/ExtendedCategoryPage'

export const metadata: Metadata = {
  title: '豪雨・線状降水帯【大雨警報が出たら今すぐやること】',
  description:
    '線状降水帯・大雨警報発令時の行動ガイド。冠水道路・アンダーパス・車中の危険を回避する方法を医師が解説。警戒レベルの見方と早期避難のポイント。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/category/heavy-rain' },
  openGraph: {
    title: '豪雨・線状降水帯【今すぐやること】｜防災Lab',
    description: '大雨警報・線状降水帯の行動マニュアル。アンダーパス・冠水道路の危険を回避。',
    url: 'https://bousai-lab.vercel.app/category/heavy-rain',
  },
}

export default function HeavyRainCategoryPage() {
  return (
    <ExtendedCategoryPage
      category="heavy-rain"
      heroTitle="豪雨・線状降水帯から身を守ろう"
      rissMessage="大雨注意報が出てるんだけど、どこまで準備すればいいの？"
      robotMessage="警戒レベルと気象情報を今すぐ確認。アンダーパス・冠水道路には絶対入るな。レベル3以上なら高台か上層階へ移動せよ"
      heroSubtitle="大雨警報が出たら「待つ」より「動く」が正解"
      ctaProducts={['懐中電灯', 'モバイルバッテリー', '非常食', '防災リュック']}
    />
  )
}
