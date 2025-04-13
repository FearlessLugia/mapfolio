'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Photo } from '@prisma/client'
import type { FeatureCollection, Point } from 'geojson'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

type PhotoFeatureProps = {
  id: number
  photoName: string
  photoUrl: string
}

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
        center: [2, 48],
        zoom: 3
      })

      mapRef.current = map

      const geojson: FeatureCollection<Point, PhotoFeatureProps> = {
        type: 'FeatureCollection',
        features: photos
          .filter((p) => p.photoLocation)
          .map((p) => {
            // Force the type so TypeScript stops complaining about optional location
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
          // Clear existing markers first
          markers.forEach((m) => m.remove())
          markers = []

          // Query all cluster features
          const clusterFeatures = map.queryRenderedFeatures({
            layers: ['photo-cluster-dummy']
          })

          // Extract cluster IDs from the features we got
          const clusterIds = clusterFeatures.map((f) => f.properties?.cluster_id) as number[]

          // Keep track of all photo IDs that belong to any cluster
          const clusteredIdSet = new Set<number>()
          // Keep track of one “sample” feature for each cluster (for cluster icon)
          const clusterMap = new Map<number, mapboxgl.MapboxGeoJSONFeature>()

          // Step 1: Retrieve leaves for each cluster so we know which photos are in it
          await Promise.all(
            clusterIds.map(
              (clusterId) =>
                new Promise<void>((resolve) => {
                  source.getClusterLeaves(clusterId, 100, 0, (err, leaves) => {
                    if (!err && Array.isArray(leaves) && leaves.length > 0) {
                      leaves.forEach((leaf) => {
                        if (leaf.properties && 'id' in leaf.properties) {
                          clusteredIdSet.add(leaf.properties.id as number)
                        }
                      })
                      // Use the first leaf as the sample for the cluster marker
                      clusterMap.set(clusterId, leaves[0] as mapboxgl.MapboxGeoJSONFeature)
                    }
                    resolve()
                  })
                })
            )
          )

          // Step 2: Render the cluster markers
          clusterFeatures.forEach((f) => {
            const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number]
            const clusterId = f.properties?.cluster_id
            const clusterCount = f.properties?.point_count

            const sample = clusterMap.get(clusterId)
            if (!sample || !sample.properties) return
            const sampleUrl = sample.properties.photoUrl as string

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
              source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err || typeof zoom !== 'number') return

                // Zoom in on the cluster
                map.easeTo({ center: coords, zoom })

                // Re‐render after the map stops moving
                map.once('moveend', () => {
                  renderClusters()
                })
                // Another re‐render after the zoom finishes
                map.once('moveend', () => {
                  renderClusters()
                })
              })
            })

            const marker = new mapboxgl.Marker(el).setLngLat(coords).addTo(map)
            markers.push(marker)
          })

          // Step 3: Render individual (non‐clustered) markers
          geojson.features.forEach((feature) => {
            // If this feature’s ID is in a cluster, skip rendering an individual marker
            if (clusteredIdSet.has(feature.properties.id)) return

            const coords = feature.geometry.coordinates
            const el = document.createElement('div')
            el.className =
              'w-[72px] h-[72px] rounded-xl overflow-hidden border-2 border-white shadow-md bg-cover bg-center cursor-pointer'
            el.style.backgroundImage = `url(${feature.properties.photoUrl})`

            el.addEventListener('click', () => {
              alert(`📸 ${feature.properties.photoName}`)
            })

            const marker = new mapboxgl.Marker(el).setLngLat(coords).addTo(map)
            markers.push(marker)
          })
        }

        map.on('moveend', renderClusters)
        map.on('zoomend', renderClusters)
        map.once('idle', renderClusters)
      })
    }

    fetchThumbnails()

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  return <div ref={mapContainer} className='w-full h-screen'/>
}
