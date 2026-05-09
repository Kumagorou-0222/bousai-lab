'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
}

export default function MangaImageGallery({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  const panels = images.slice(0, 4)

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 8,
        marginBottom: 24,
      }}>
        {panels.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            style={{
              border: 'none', background: '#F8FAFC', padding: 0,
              cursor: 'zoom-in', borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
              aspectRatio: '3 / 4',
              position: 'relative',
              display: 'block',
              width: '100%',
            }}
            aria-label={`4コマ漫画 ${i + 1}コマ目を拡大`}
          >
            <Image
              src={src}
              alt={`${i + 1}コマ目`}
              fill
              sizes="(max-width: 800px) 45vw, 360px"
              style={{ objectFit: 'contain' }}
              loading="lazy"
            />
            <span style={{
              position: 'absolute', bottom: 6, right: 8,
              background: 'rgba(0,0,0,0.55)', color: 'white',
              fontSize: 10, fontWeight: 700,
              borderRadius: 6, padding: '2px 7px',
              lineHeight: 1.4, zIndex: 1,
            }}>
              {i + 1}コマ目
            </span>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'zoom-out',
            padding: '16px',
          }}
        >
          <div style={{ position: 'relative', width: '70vmin', height: '93vmin', maxWidth: '90vw', maxHeight: '90vh' }}>
            <Image
              src={images[lightboxIndex]}
              alt={`${lightboxIndex + 1}コマ目`}
              fill
              sizes="90vw"
              style={{ objectFit: 'contain', borderRadius: 12 }}
              priority
            />
          </div>
          <div style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)', fontSize: 12,
          }}>
            タップして閉じる
          </div>

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1) }}
              style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                borderRadius: '50%', width: 44, height: 44,
                fontSize: 20, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="前のコマ"
            >
              ‹
            </button>
          )}
          {lightboxIndex < panels.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1) }}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                borderRadius: '50%', width: 44, height: 44,
                fontSize: 20, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="次のコマ"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
