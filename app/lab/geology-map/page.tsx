'use client'

import dynamic from 'next/dynamic'

const GeologyMap = dynamic(() => import('./GeologyMap'), { ssr: false })

export default function GeologyMapPage() {
  return <GeologyMap />
}
