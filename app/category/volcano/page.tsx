import type { Metadata } from 'next'
import ExtendedCategoryPage from '@/components/ExtendedCategoryPage'

export const metadata: Metadata = {
  title: '火山・降灰【火山灰の危険性と対策完全ガイド】',
  description:
    '火山灰の健康被害・車への影響・停電・水道への影響を解説。降灰時のマスク選び・外出判断・ワイパーを動かしてはいけない理由。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/category/volcano' },
  openGraph: {
    title: '火山・降灰【危険性と正しい対策】｜防災Lab',
    description: '火山灰の危険性・車への影響・マスク選び・停電対策を解説。',
    url: 'https://bousai-lab.vercel.app/category/volcano',
  },
}

export default function VolcanoCategoryPage() {
  return (
    <ExtendedCategoryPage
      category="volcano"
      heroTitle="火山・降灰から身を守ろう"
      rissMessage="火山灰って少しくらい吸っても大丈夫でしょ？"
      robotMessage="非常に危険だ。肺や気道を傷つける。N95マスクを着用し、車のワイパーは絶対動かすな。窓を閉め外出を最小限にせよ"
      heroSubtitle="火山灰は見た目より数倍危険"
      ctaProducts={['マスク', 'ゴーグル', '防災リュック', '非常食']}
    />
  )
}
