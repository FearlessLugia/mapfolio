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
      const res = await fetch('/api/photo') // 你已有的 API
      const photos: Photo[] = await res.json()

      if (!mapContainer.current) return

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-79.39, 43.65],
        zoom: 3
      })

      mapRef.current = map

      const geojson = {
        type: 'FeatureCollection',
        features: photos
          .filter((p) => p.photoLocation)
          .map((photo) => ({
            type: 'Feature',
            properties: {
              id: photo.id,
              photoName: photo.photoName,
              photoUrl: photo.url
            },
            geometry: {
              type: 'Point',
              coordinates: [
                photo.photoLocation!.longitude,
                photo.photoLocation!.latitude
              ]
            }
          }))
      }

      map.on('load', () => {
        map.addSource('photos', {
          type: 'geojson',
          data: geojson,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        })

        // Cluster Circle
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'photos',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#2563eb',
            'circle-radius': 28,
            'circle-stroke-width': 3,
            'circle-stroke-color': '#fff'
          }
        })

        // Cluster Count
        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'photos',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 14
          },
          paint: {
            'text-color': '#ffffff'
          }
        })

        for (let i = 0; i < geojson.features.length; i++) {
          const feature = geojson.features[i]

          const container = document.createElement('div')
          container.className =
            'relative w-[128px] h-[128px] rounded-xl overflow-hidden border-2 border-white shadow-lg cursor-pointer'

          container.style.backgroundImage = `url(${feature.properties.photoUrl})`
          container.style.backgroundSize = 'cover'
          container.style.backgroundPosition = 'center'

          // 👇 添加编号元素
          const badge = document.createElement('div')
          badge.className =
            'absolute bottom-1 right-1 text-xs px-1.5 py-0.5 bg-black/70 text-white rounded-full font-medium'
          badge.textContent = `${i + 1}`

          container.appendChild(badge)

          // container.addEventListener('click', () => {
          //   alert(`📍 ${feature.properties.photoName}`)
          // })

          new mapboxgl.Marker(container)
            .setLngLat(feature.geometry.coordinates)
            .addTo(map)
        }

        // 点击 cluster 放大
        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          })
          const clusterId = features[0].properties?.cluster_id
          const source = map.getSource('photos') as mapboxgl.GeoJSONSource

          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return
            map.easeTo({
              center: (features[0].geometry as any).coordinates,
              zoom
            })
          })
        })
      })
    }

    fetchPhotos()

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  return (
    <main className="h-screen">
      <div ref={mapContainer} className="w-full h-full" />
    </main>
  )
}
