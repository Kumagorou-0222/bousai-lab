import type { Metadata } from 'next'
import ExtendedCategoryPage from '@/components/ExtendedCategoryPage'

export const metadata: Metadata = {
  title: '土砂災害・がけ崩れ【前兆・警戒情報・避難判断】',
  description:
    '土砂災害警戒情報が出たら今すぐ避難。崖崩れ・土石流の前兆サイン・山沿い住宅の注意点・夜間避難の判断基準を解説。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/category/landslide' },
  openGraph: {
    title: '土砂災害・がけ崩れ【前兆・避難判断】｜防災Lab',
    description: '土砂災害警戒情報・崖崩れの前兆・夜間避難の判断基準を解説。',
    url: 'https://bousai-lab.vercel.app/category/landslide',
  },
}

export default function LandslideCategoryPage() {
  return (
    <ExtendedCategoryPage
      category="landslide"
      heroTitle="土砂災害から命を守ろう"
      rissMessage="大雨の後、崖の様子が気になる…見に行ってもいい？"
      robotMessage="絶対に行くな。警戒情報が出た時点で即避難。崩れる前兆を把握して、躊躇なく動くことが命を救う"
      heroSubtitle="崖・川の様子を見に行かないことが最優先"
      ctaProducts={['防災リュック', '懐中電灯', 'モバイルバッテリー', '非常食']}
    />
  )
}
