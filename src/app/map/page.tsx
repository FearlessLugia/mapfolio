'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Photo } from '@prisma/client'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

export default function PhotoMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await fetch('/api/photo') // 我们下一步会建这个接口
      const photos: Photo[] = await res.json()

      if (!mapContainer.current) return

      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        center: [-79.39, 43.65], // starting position [lng, lat]
        zoom: 3 // starting zoom
      })

      // // Add markers
      // for (const photo of photos) {
      //   if (!photo.photoLocation) continue
      //
      //   const marker = new mapboxgl.Marker()
      //     .setLngLat([
      //       photo.photoLocation.longitude,
      //       photo.photoLocation.latitude
      //     ])
      //     .setPopup(
      //       new mapboxgl.Popup().setHTML(`
      //         <div class="max-w-[200px]">
      //           <Image src="${photo.url}" alt="${photo.photoName}" class="w-full rounded-md"/>
      //           <p class="text-sm">
      //             ${photo.photoCity ?? ''}${photo.photoCity && photo.photoCountry ? ', ' : ''}${photo.photoCountry ?? ''}
      //           </p>
      //         </div>
      //       `)
      //     )
      //     .addTo(map.current)
      // }

      for (const photo of photos) {
        if (!photo.photoLocation) continue

        // console.log('photo', photo)
        const el = document.createElement('div')
        // const [width, height] = photo.properties.iconSize
        el.className = 'bg-cover bg-center round cursor-pointer block'
        el.style.backgroundImage = `url(${photo.url})`
        el.style.width = `200px`
        el.style.height = `200px`

        el.addEventListener('click', () => {
          window.alert('hello')
        })

        new mapboxgl.Marker(el)
          .setLngLat([
            photo.photoLocation.longitude,
            photo.photoLocation.latitude
          ])
          .addTo(mapRef.current!)
      }
    }

    fetchPhotos()

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  return (
    <main className='h-screen'>
      <div ref={mapContainer} className='w-full h-full'/>
    </main>
  )
}
