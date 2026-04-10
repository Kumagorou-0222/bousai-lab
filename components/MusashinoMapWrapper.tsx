'use client'

import dynamic from 'next/dynamic'
import type { MapPin } from './MusashinoMap'

const MusashinoMap = dynamic(() => import('./MusashinoMap'), { ssr: false })

export default function MusashinoMapWrapper({ pins }: { pins: MapPin[] }) {
  return <MusashinoMap pins={pins} />
}
