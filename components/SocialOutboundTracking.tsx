'use client'

import { useEffect } from 'react'
import { readSocialAttribution } from '@/lib/socialAttribution'

const STORAGE_KEY = 'bousai_social_attribution'

function saveAttribution(search: string) {
  const data = readSocialAttribution(search)
  if (data) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function currentAttribution() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const value = JSON.parse(saved) as { source?: string; campaign?: string; content?: string }
    return readSocialAttribution(new URLSearchParams({
      utm_source: value.source ?? '', utm_campaign: value.campaign ?? '', utm_content: value.content ?? '',
    }).toString())
  } catch { return null }
}

export default function SocialOutboundTracking() {
  useEffect(() => {
    try { saveAttribution(location.search) } catch { /* 保存できない環境では計測のみ行う */ }
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement)) return
      try {
        const url = new URL(link.href)
        if (url.origin === location.origin) saveAttribution(url.search)
        const merchant = ['amazon.co.jp', 'www.amazon.co.jp'].includes(url.hostname) ? 'amazon'
          : url.hostname === 'room.rakuten.co.jp' ? 'rakuten' : null
        if (!merchant) return
        const attribution = currentAttribution()
        const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
        gtag?.('event', 'affiliate_click', {
          merchant,
          article_path: location.pathname,
          traffic_source: attribution?.source ?? 'direct',
          traffic_campaign: attribution?.campaign ?? 'none',
          traffic_content: attribution?.content ?? 'none',
        })
      } catch { /* 計測の失敗でリンク遷移は止めない */ }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}
