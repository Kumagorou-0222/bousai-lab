'use client'

import { useEffect } from 'react'
import { applyKidsMode, restoreKidsMode } from '@/lib/kidsMode'

/**
 * body.kids-mode クラスの変化を監視し、
 * ページ内のテキストコンテンツをこどもモード用に変換する
 */
export default function KidsModeTransformer() {
  useEffect(() => {
    function getTargets(): HTMLElement[] {
      return Array.from(
        document.querySelectorAll<HTMLElement>(
          'article.prose-bousai, .faq-content, main h1, main h2, main h3, main p, main li'
        )
      )
    }

    function handleModeChange(isKids: boolean) {
      // prose-bousai article を丸ごと変換（最も効果的）
      const articles = document.querySelectorAll<HTMLElement>('article.prose-bousai')
      if (articles.length > 0) {
        articles.forEach((el) => {
          isKids ? applyKidsMode(el) : restoreKidsMode(el)
        })
      }

      // FAQ セクションも変換
      const faqs = document.querySelectorAll<HTMLElement>('details summary, details p')
      faqs.forEach((el) => {
        isKids ? applyKidsMode(el) : restoreKidsMode(el)
      })

      // ホームページなどの見出し・本文も変換
      const headings = document.querySelectorAll<HTMLElement>('main h1, main h2, main h3')
      headings.forEach((el) => {
        isKids ? applyKidsMode(el) : restoreKidsMode(el)
      })
    }

    // body の class 変化を監視
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isKids = document.body.classList.contains('kids-mode')
          handleModeChange(isKids)
        }
      }
    })

    observer.observe(document.body, { attributes: true })

    // 初期状態チェック（localStorage から復元された場合）
    if (document.body.classList.contains('kids-mode')) {
      handleModeChange(true)
    }

    return () => observer.disconnect()
  }, [])

  return null
}
