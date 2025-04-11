'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Photo } from '@prisma/client'
import type { FeatureCollection, Point } from 'geojson'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

export default function PhotoMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    const fetchThumbnails = async () => {
      const res = await fetch('/api/photo')
      const photos: Photo[] = await res.json()

      if (!mapContainer.current) return

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        // center: [-79.39, 43.65],
        center: [2, 48],
        zoom: 3
      })

      mapRef.current = map

      // const geojson = {
      //   type: 'FeatureCollection',
      //   features: photos
      //     .filter((p) => p.photoLocation)
      //     .map((p) => {
      //       const loc = p.photoLocation as { latitude: number; longitude: number }
      //
      //       return {
      //         type: 'Feature',
      //         properties: {
      //           id: p.id,
      //           photoName: p.photoName,
      //           photoUrl: p.thumbnailUrl
      //         },
      //         geometry: {
      //           type: 'Point',
      //           coordinates: [loc.longitude, loc.latitude]
      //         }
      //       }
      //     })
      // }

      const geojson: FeatureCollection<Point, { id: number; photoName: string; photoUrl: string }> = {
        type: 'FeatureCollection',
        features: photos
          .filter((p) => p.photoLocation)
          .map((p) => {
            const loc = p.photoLocation as { latitude: number; longitude: number }

            return {
              type: 'Feature',
              properties: {
                id: p.id,
                photoName: p.photoName,
                photoUrl: p.thumbnailUrl
              },
              geometry: {
                type: 'Point',
                coordinates: [loc.longitude, loc.latitude]
              }
            }
          })
      }

      map.on('load', () => {
        map.addSource('photos', {
          type: 'geojson',
          data: geojson,
          cluster: true,
          clusterRadius: 60,
          clusterMaxZoom: 14
        })

        map.addLayer({
          id: 'photo-cluster-dummy',
          type: 'circle',
          source: 'photos',
          filter: ['has', 'point_count'],
          paint: {
            'circle-opacity': 0,
            'circle-radius': 0
          }
        })

        const source = map.getSource('photos') as mapboxgl.GeoJSONSource
        let markers: mapboxgl.Marker[] = []

        const renderClusters = async () => {
          markers.forEach((m) => m.remove())
          markers = []

          const clusterFeatures = map.queryRenderedFeatures({
            layers: ['photo-cluster-dummy']
          })
          const clusterIds = clusterFeatures.map((f) => f.properties!.cluster_id)

          const clusteredIdSet = new Set<string>()
          const clusterMap = new Map<number, mapboxgl.MapboxGeoJSONFeature>()

          // Step 1: get cluster leaves
          await Promise.all(
            clusterIds.map(
              (clusterId) =>
                new Promise<void>((resolve) => {
                  source.getClusterLeaves(clusterId, 100, 0, (err, leaves) => {
                    if (!err && Array.isArray(leaves) && leaves.length > 0) {
                      leaves.forEach((leaf) => {
                        if (leaf.properties && 'id' in leaf.properties) {
                          clusteredIdSet.add(leaf.properties.id)
                        }
                      })
                      clusterMap.set(clusterId, leaves[0] as mapboxgl.MapboxGeoJSONFeature)
                    }
                    resolve()
                  })
                })
            )
          )

          // Step 2: render cluster markers
          clusterFeatures.forEach((f) => {
            const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number]
            const clusterId = f.properties!.cluster_id
            const clusterCount = f.properties!.point_count

            const sample = clusterMap.get(clusterId)
            if (!sample || !sample.properties) return
            const sampleUrl = sample.properties.photoUrl

            const el = document.createElement('div')
            el.className =
              'relative w-[72px] h-[72px] rounded-xl overflow-hidden border-2 border-white shadow-md bg-cover bg-center'
            el.style.backgroundImage = `url(${sampleUrl})`

            const badge = document.createElement('div')
            badge.className =
              'absolute bottom-0 left-0 text-xs px-2 py-0.5 bg-white/90 text-black rounded-tr-md font-semibold'
            badge.textContent = String(clusterCount)

            el.appendChild(badge)

            el.addEventListener('click', () => {
              source.getClusterExpansionZoom(clusterId, (err) => {
                if (err) return

                map.once('moveend', () => {
                  renderClusters()
                })

                // Wait for the map to finish moving before zooming in
                map.once('moveend', () => {
                  // second moveend event is triggered after zooming in
                  renderClusters()
                })
              })
            })


            const marker = new mapboxgl.Marker(el)
              .setLngLat(coords)
              .addTo(map)
            markers.push(marker)
          })

          // Step 3: render individual markers
          geojson.features.forEach((feature) => {
            if (clusteredIdSet.has(String(feature.properties.id))) return

            const el = document.createElement('div')
            el.className =
              'w-[72px] h-[72px] rounded-xl overflow-hidden border-2 border-white shadow-md bg-cover bg-center cursor-pointer'
            el.style.backgroundImage = `url(${feature.properties.photoUrl})`

            el.addEventListener('click', () => {
              alert(`📸 ${feature.properties.photoName}`)
            })

            const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number]
            const marker = new mapboxgl.Marker(el)
              .setLngLat(coords)
              .addTo(map)
            markers.push(marker)
          })
        }

        map.on('moveend', renderClusters)
        map.on('zoomend', renderClusters)

        map.once('idle', () => {
          renderClusters()
        })
      })
    }

    fetchThumbnails()

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  return <div ref={mapContainer} className='w-full h-screen'/>
}
