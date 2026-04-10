'use client'

import { useEffect, useRef } from 'react'

export type MapPin = {
  lat: number
  lng: number
  name: string
  address: string
  type: 'shelter' | 'wide' | 'hiroba'
}

type Props = { pins: MapPin[] }

const TYPE_CONFIG = {
  shelter: { color: '#2563EB', label: 'いっとき集合場所・避難所', emoji: '🏫' },
  wide:    { color: '#DC2626', label: '広域避難場所',             emoji: '🌳' },
  hiroba:  { color: '#16A34A', label: '防災広場',                 emoji: '🌿' },
}

export default function MusashinoMap({ pins }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null)

  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return

    // Leaflet を動的 import（SSR 回避）
    import('leaflet').then((L) => {
      // デフォルトアイコン修正
      // @ts-expect-error _getIconUrl is internal
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!).setView([35.717, 139.562], 13)
      leafletRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      pins.forEach((pin) => {
        const cfg = TYPE_CONFIG[pin.type]
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            background:${cfg.color};
            color:white;
            width:28px;height:28px;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:2px solid white;
            box-shadow:0 2px 6px rgba(0,0,0,0.35);
            display:flex;align-items:center;justify-content:center;
          "><span style="transform:rotate(45deg);font-size:13px">${cfg.emoji}</span></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -30],
        })

        L.marker([pin.lat, pin.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:'Noto Sans JP',sans-serif;min-width:160px">
              <div style="font-size:11px;color:${cfg.color};font-weight:700;margin-bottom:3px">${cfg.label}</div>
              <div style="font-size:13px;font-weight:700;color:#0F172A;margin-bottom:4px">${pin.name}</div>
              <div style="font-size:11px;color:#64748B">📍 武蔵野市${pin.address}</div>
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('武蔵野市' + pin.address)}"
                target="_blank" rel="noopener noreferrer"
                style="display:inline-block;margin-top:6px;font-size:11px;color:${cfg.color};font-weight:700;text-decoration:none">
                Google マップで見る →
              </a>
            </div>
          `)
      })
    })

    return () => {
      leafletRef.current?.remove()
      leafletRef.current = null
    }
  }, [pins])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <div ref={mapRef} style={{ width: '100%', height: 420, borderRadius: 14, overflow: 'hidden' }} />
    </>
  )
}
