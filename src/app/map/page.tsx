'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

export default function PhotoMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [-79.39, 43.65], // starting position [lng, lat]
      zoom: 3 // starting zoom
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  return (
    <main className='h-screen'>
      <div ref={mapContainer} className='w-full h-full'/>
    </main>
  )
}
