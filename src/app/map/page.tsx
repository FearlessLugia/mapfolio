'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Photo } from '@prisma/client'
import type { FeatureCollection, Point } from 'geojson'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

type PhotoFeatureProps = {
  id: number
  photoName: string
  /** The original image URL (for single-photo view). */
  originalUrl: string
  /** The thumbnail URL (for markers and for cluster gallery). */
  thumbnailUrl: string
}

export default function PhotoMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  // We'll store either a single photo or multiple photos in this array
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoFeatureProps[]>([])

  useEffect(() => {
    const fetchThumbnails = async () => {
      const res = await fetch('/api/photo')
      const photos: Photo[] = await res.json()

      // Ensure our container is rendered
      if (!mapContainer.current) return

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        center: [2, 48],
        zoom: 3
      })
      mapRef.current = map

      // Build a GeoJSON with originalUrl & thumbnailUrl in properties
      const geojson: FeatureCollection<Point, PhotoFeatureProps> = {
        type: 'FeatureCollection',
        features: photos
          .filter((p) => p.photoLocation)
          .map((p) => {
            const { latitude, longitude } = p.photoLocation!
            return {
              type: 'Feature',
              properties: {
                id: p.id,
                photoName: p.photoName,
                originalUrl: p.url,
                thumbnailUrl: p.thumbnailUrl
              },
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
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

        // A dummy layer for detecting cluster features
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

        /**
         * Render clusters and markers:
         * - If it's a cluster, open a gallery of all cluster photos (thumbnails).
         * - If it's a single marker, open a single photo in original size.
         */
        const renderClusters = async () => {
          // Clear existing markers first
          markers.forEach((m) => m.remove())
          markers = []

          // Query all features in the cluster layer
          const clusterFeatures = map.queryRenderedFeatures({
            layers: ['photo-cluster-dummy']
          })

          // The cluster IDs
          const clusterIds = clusterFeatures.map((f) => f.properties?.cluster_id) as number[]

          // Keep track of all photos that belong to a cluster
          const clusteredIdSet = new Set<number>()
          // We'll store each cluster's photos in a map, so we can show them in the gallery
          const clusterPhotosMap = new Map<number, PhotoFeatureProps[]>()

          // Step 1: get cluster leaves
          await Promise.all(
            clusterIds.map(
              (clusterId) =>
                new Promise<void>((resolve) => {
                  source.getClusterLeaves(clusterId, 100, 0, (err, leaves) => {
                    if (!err && Array.isArray(leaves) && leaves.length > 0) {
                      const photosInCluster: PhotoFeatureProps[] = []
                      leaves.forEach((leaf) => {
                        if (leaf.properties?.id) {
                          clusteredIdSet.add(leaf.properties.id)
                          photosInCluster.push(leaf.properties as PhotoFeatureProps)
                        }
                      })
                      clusterPhotosMap.set(clusterId, photosInCluster)
                    }
                    resolve()
                  })
                })
            )
          )

          // Step 2: render cluster markers
          clusterFeatures.forEach((f) => {
            const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number]
            const clusterId = f.properties?.cluster_id
            const clusterCount = f.properties?.point_count
            if (typeof clusterId !== 'number') return

            const clusterPhotos = clusterPhotosMap.get(clusterId)
            if (!clusterPhotos || clusterPhotos.length === 0) return

            // Use the first photo's thumbnail in the cluster as the marker's background
            const sampleUrl = clusterPhotos[0].thumbnailUrl

            const el = document.createElement('div')
            el.className =
              'relative w-[72px] h-[72px] rounded-xl overflow-hidden border-2 border-white shadow-md bg-cover bg-center'
            el.style.backgroundImage = `url(${sampleUrl})`

            // Show the cluster count
            const badge = document.createElement('div')
            badge.className =
              'absolute bottom-0 left-0 text-xs px-2 py-0.5 bg-white/90 text-black rounded-tr-md font-semibold'
            badge.textContent = String(clusterCount)
            el.appendChild(badge)

            // On click, open a gallery with these cluster photos (thumbnails)
            el.addEventListener('click', () => {
              setSelectedPhotos(clusterPhotos)
              setDialogOpen(true)
            })

            const marker = new mapboxgl.Marker(el).setLngLat(coords).addTo(map)
            markers.push(marker)
          })

          // Step 3: render non‐clustered markers
          geojson.features.forEach((feature) => {
            const { id, photoName, originalUrl, thumbnailUrl } = feature.properties
            // If photo is in a cluster, skip rendering individually
            if (clusteredIdSet.has(id)) return

            const coords = feature.geometry.coordinates
            const el = document.createElement('div')
            el.className =
              'w-[72px] h-[72px] rounded-xl overflow-hidden border-2 border-white shadow-md bg-cover bg-center cursor-pointer'
            el.style.backgroundImage = `url(${thumbnailUrl})`

            // On click, open a single‐photo view (original image)
            el.addEventListener('click', () => {
              setSelectedPhotos([{ id, photoName, originalUrl, thumbnailUrl }])
              setDialogOpen(true)
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

  return (
    <>
      <div ref={mapContainer} className='w-full h-screen'/>

      {/* Dialog for single photo or cluster gallery */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='max-w-xl md:max-w-3xl lg:max-w-4xl'>
          <DialogHeader>
            {selectedPhotos.length === 1 ? (
              <DialogTitle>{selectedPhotos[0].photoName}</DialogTitle>
            ) : (
              <DialogTitle>Cluster Gallery</DialogTitle>
            )}
          </DialogHeader>

          {/* Single photo => show originalUrl. Multiple => show a gallery of thumbnails */}
          {selectedPhotos.length === 1 ? (
            <div className='relative w-full aspect-video overflow-hidden rounded'>
              <Image
                src={selectedPhotos[0].originalUrl}
                alt={selectedPhotos[0].photoName}
                fill
                className='object-contain'
                priority
              />
            </div>
          ) : (
            <div className='grid gap-4 grid-cols-2 md:grid-cols-3'>
              {selectedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className='relative w-full aspect-[4/3] overflow-hidden rounded shadow'
                >
                  <Image
                    src={photo.thumbnailUrl}
                    alt={photo.photoName}
                    fill
                    className='object-cover'
                  />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
