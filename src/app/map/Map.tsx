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
  /** The original image URL for large display. */
  originalUrl: string
  /** The thumbnail URL (for markers, cluster gallery). */
  thumbnailUrl: string
}

/**
 * Shows a map with cluster markers. Clicking:
 * - A cluster marker => open main Dialog with a grid of thumbnails.
 * - A single marker => open main Dialog showing one photo (now using originalUrl).
 *
 * Inside the main Dialog:
 * - If there's only one photo, we show its originalUrl at decent size.
 *   Clicking that image again opens a second (photo detail) Dialog with the same full image.
 * - If multiple photos (cluster), we show a grid of thumbnails. Clicking any thumbnail
 *   opens the second Dialog with the large original image.
 */
export default function MapPage({ photos }: { photos: Photo[] }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  // Main dialog: either shows single or cluster gallery
  const [dialogOpen, setDialogOpen] = useState(false)
  // The array of photos (1 or more) displayed in the main dialog
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoFeatureProps[]>([])

  // Photo detail dialog (the big/lightbox version)
  const [photoDetailOpen, setPhotoDetailOpen] = useState(false)
  // The single photo currently shown in large format
  const [photoDetail, setPhotoDetail] = useState<PhotoFeatureProps | null>(null)

  /**
   * If the user closes the main dialog, also close the photo detail
   */
  const handleMainDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      // Close the big photo if the user closes the cluster/single dialog
      setPhotoDetailOpen(false)
      setPhotoDetail(null)
    }
  }

  /**
   * Helper: open the big-photo dialog for a single photo
   */
  const showPhotoDetail = (photo: PhotoFeatureProps) => {
    setPhotoDetail(photo)
    setPhotoDetailOpen(true)
  }

  useEffect(() => {
    const fetchThumbnails = async () => {
      if (!mapContainer.current) return

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        center: [2, 48],
        zoom: 3
      })
      mapRef.current = map

      // Build the GeoJSON with both originalUrl & thumbnailUrl in properties.
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
                originalUrl: p.url,       // Make sure p.url is your "large" image
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

        // Create a dummy layer to detect cluster features
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

        // Render cluster markers & single photo markers
        const renderClusters = async () => {
          // Remove old markers
          markers.forEach((m) => m.remove())
          markers = []

          // Find all cluster features
          const clusterFeatures = map.queryRenderedFeatures({
            layers: ['photo-cluster-dummy']
          })
          const clusterIds = clusterFeatures.map((f) => f.properties?.cluster_id) as number[]

          // Keep track of all photos that belong to any cluster
          const clusteredIdSet = new Set<number>()
          // Map from clusterId => array of photos inside that cluster
          const clusterPhotosMap = new Map<number, PhotoFeatureProps[]>()

          // 1. Gather cluster leaves
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

          // 2. Render cluster markers
          clusterFeatures.forEach((f) => {
            const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number]
            const clusterId = f.properties?.cluster_id
            const clusterCount = f.properties?.point_count
            if (typeof clusterId !== 'number') return

            const clusterPhotos = clusterPhotosMap.get(clusterId)
            if (!clusterPhotos || clusterPhotos.length === 0) return

            // Use the first photo's thumbnail as the marker background
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

            // Clicking the cluster => open a gallery with these photos
            el.addEventListener('click', () => {
              setSelectedPhotos(clusterPhotos)
              setDialogOpen(true)
            })

            const marker = new mapboxgl.Marker(el).setLngLat(coords).addTo(map)
            markers.push(marker)
          })

          // 3. Render individual (non-clustered) markers
          geojson.features.forEach((feature) => {
            const { id, photoName, originalUrl, thumbnailUrl } = feature.properties
            if (clusteredIdSet.has(id)) return

            const coords = feature.geometry.coordinates
            const el = document.createElement('div')
            el.className =
              'w-[72px] h-[72px] rounded-xl overflow-hidden border-2 border-white shadow-md bg-cover bg-center cursor-pointer'
            el.style.backgroundImage = `url(${thumbnailUrl})`

            // Clicking a single marker => show the single photo in the main dialog (but large!)
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

      {/* --- MAIN DIALOG (Cluster Gallery or Single Photo) --- */}
      <Dialog open={dialogOpen} onOpenChange={handleMainDialogOpenChange}>
        <DialogContent className='max-w-xl md:max-w-3xl lg:max-w-4xl'>
          <DialogHeader>
            {selectedPhotos.length === 1 ? (
              <DialogTitle>{selectedPhotos[0].photoName}</DialogTitle>
            ) : (
              <DialogTitle>Cluster Gallery</DialogTitle>
            )}
          </DialogHeader>

          {/*
            If only 1 photo => show its ORIGINAL URL right away
            (instead of the thumbnail).
            Clicking it can still open the photoDetail dialog if desired.
          */}
          {selectedPhotos.length === 1 ? (
            <div
              className='relative w-full aspect-video overflow-hidden rounded cursor-pointer'
              onClick={() => showPhotoDetail(selectedPhotos[0])}
            >
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
                  className='relative w-full aspect-[4/3] overflow-hidden rounded shadow cursor-pointer'
                  onClick={() => showPhotoDetail(photo)}
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

      {/* --- PHOTO DETAIL DIALOG (Large/Original Image) --- */}
      <Dialog open={photoDetailOpen} onOpenChange={setPhotoDetailOpen}>
        <DialogContent className='max-w-2xl md:max-w-3xl lg:max-w-4xl'>
          {photoDetail && (
            <>
              <DialogHeader>
                <DialogTitle>{photoDetail.photoName}</DialogTitle>
              </DialogHeader>
              <div className='relative w-full aspect-video overflow-hidden rounded'>
                <Image
                  src={photoDetail.originalUrl}
                  alt={photoDetail.photoName}
                  fill
                  className='object-contain'
                  priority
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
