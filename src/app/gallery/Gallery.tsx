'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Photo } from '@prisma/client'

export default function Gallery({ photos }: { photos: Photo[] }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const openPhotoDetail = (photo: Photo) => {
    setSelectedPhoto(photo)
    setDetailOpen(true)
  }

  return (
    <>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className='relative w-full aspect-[4/3] rounded overflow-hidden shadow cursor-pointer'
            onClick={() => openPhotoDetail(photo)}
          >
            <Image
              src={photo.thumbnailUrl}
              alt={`a photo in ${photo.photoCountry ?? 'Mysterious Place...'}`}
              fill
              className='object-cover'
              loading='lazy'
            />

            <div className='absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2'>
              <p className='truncate'>
                {photo.photoCity || photo.photoCountry
                  ? `${photo.photoCity ?? ''}${
                    photo.photoCity && photo.photoCountry ? ', ' : ''
                  }${photo.photoCountry ?? ''}`
                  : 'Mysterious Place...'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog for the big/full image */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className='max-w-2xl md:max-w-4xl lg:max-w-6xl'>
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedPhoto.photoCity || selectedPhoto.photoCountry
                    ? `${selectedPhoto.photoCity ?? ''}${
                      selectedPhoto.photoCity && selectedPhoto.photoCountry ? ', ' : ''
                    }${selectedPhoto.photoCountry ?? ''}`
                    : 'Mysterious Place...'}
                </DialogTitle>
              </DialogHeader>
              <div className='relative w-full aspect-video overflow-hidden rounded'>
                <Image
                  src={selectedPhoto.url}
                  alt={`a photo in ${selectedPhoto.photoCountry ?? 'Mysterious Place...'}`}
                  fill
                  className='object-contain'
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
