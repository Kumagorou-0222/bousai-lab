import type { Metadata } from 'next'
import ExtendedCategoryPage from '@/components/ExtendedCategoryPage'

export const metadata: Metadata = {
  title: '台風【接近前・当日にやること完全ガイド】',
  description:
    '台風接近前〜上陸当日の行動ガイド。ベランダ片付け・窓の飛散防止・停電・断水の備え。マンション在住者向けの注意点も解説。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/category/typhoon' },
  openGraph: {
    title: '台風【接近前・当日にやること】｜防災Lab',
    description: '台風前日・当日の行動マニュアル。ベランダ・停電・断水・避難の準備リスト。',
    url: 'https://bousai-lab.vercel.app/category/typhoon',
  },
}

export default function TyphoonCategoryPage() {
  return (
    <ExtendedCategoryPage
      category="typhoon"
      heroTitle="台風の備えを万全にしよう"
      rissMessage="台風が来るって言ってるけど、前日に何をすればいいの？"
      robotMessage="上陸前日までに全ての準備を完了せよ。ベランダを片付け、停電・断水に備え、避難経路を確認すること"
      heroSubtitle="台風は「来る前」の準備で被害が決まる"
      ctaProducts={['ランタン', 'ポータブル電源', 'モバイルバッテリー', '非常食']}
    />
  )
}
