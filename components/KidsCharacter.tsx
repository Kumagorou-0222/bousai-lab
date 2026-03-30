'use client'

import { useEffect, useState } from 'react'

const MESSAGES = [
  'いっしょに学ぼう！',
  'そなえは大切だよ！',
  'きけんをしっておこう！',
  'かぞくと話し合おう！',
  'ひなんの場所を確認しよう！',
  '水と食べ物のたくわえを！',
]

export default function KidsCharacter() {
  const [visible, setVisible] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)
  const [showBubble, setShowBubble] = useState(true)

  useEffect(() => {
    // 初期チェック
    setVisible(document.body.classList.contains('kids-mode'))

    const observer = new MutationObserver(() => {
      setVisible(document.body.classList.contains('kids-mode'))
    })
    observer.observe(document.body, { attributes: true })
    return () => observer.disconnect()
  }, [])

  // メッセージをローテーション
  useEffect(() => {
    if (!visible) return
    const interval = setInterval(() => {
      setShowBubble(false)
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length)
        setShowBubble(true)
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [visible])

  if (!visible) return null

  return (
    <div
      className="kids-character-root"
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        pointerEvents: 'none',
      }}
    >
      {/* 吹き出し */}
      <div
        style={{
          background: 'white',
          border: '3px solid #FF6B00',
          borderRadius: 16,
          padding: '8px 14px',
          fontSize: 13,
          fontWeight: 700,
          color: '#FF6B00',
          boxShadow: '0 4px 16px rgba(255,107,0,0.2)',
          whiteSpace: 'nowrap',
          marginBottom: 6,
          transition: 'opacity 0.3s',
          opacity: showBubble ? 1 : 0,
          fontFamily: "'Noto Sans JP', sans-serif",
          position: 'relative',
        }}
      >
        {MESSAGES[msgIndex]}
        {/* 吹き出しの矢印 */}
        <span
          style={{
            position: 'absolute',
            bottom: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '12px solid #FF6B00',
            display: 'block',
          }}
        />
      </div>

      {/* くまごろうキャラクター */}
      <div
        className="kids-bear-bounce"
        style={{
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #FF6B00, #FFD000)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: '0 6px 24px rgba(255,107,0,0.35)',
          border: '3px solid white',
          cursor: 'default',
        }}
      >
        🐻
      </div>
    </div>
  )
}
