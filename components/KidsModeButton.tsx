'use client'

import { useEffect, useState } from 'react'

export default function KidsModeButton() {
  const [isKids, setIsKids] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('bousai_kids') === '1') {
      document.body.classList.add('kids-mode')
      setIsKids(true)
    }
  }, [])

  function toggle() {
    const next = !isKids
    document.body.classList.toggle('kids-mode', next)
    localStorage.setItem('bousai_kids', next ? '1' : '')
    setIsKids(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label="こどもモードの切り替え"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: isKids ? '#16A34A' : '#FF6B00',
        color: 'white',
        border: 'none',
        borderRadius: 50,
        padding: '12px 22px',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        transition: 'all 0.2s',
        fontFamily: "'Noto Sans JP', sans-serif",
        whiteSpace: 'nowrap',
      }}
    >
      🧒 こどもモード{isKids ? ' ON ✓' : ''}
    </button>
  )
}
