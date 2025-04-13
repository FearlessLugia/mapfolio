import { db } from '@/lib/prisma'
import Image from 'next/image'

export default async function GalleryPage() {
  const photos = await db.photo.findMany({
    orderBy: { id: 'asc' }
  })

  return (
    <main className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>All Photos</h1>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className='relative w-full aspect-[4/3] rounded overflow-hidden shadow'
          >
            <Image
              src={photo.thumbnailUrl}
              alt={photo.photoName}
              fill
              className='object-cover'
              loading='lazy'
            />

            <div className='absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2'>
              {/*<p className='font-semibold truncate'>{photo.photoName}</p>*/}
              {(photo.photoCity || photo.photoCountry) && (
                <p className='truncate'>
                  {photo.photoCity ?? ''}
                  {photo.photoCity && photo.photoCountry ? ', ' : ''}
                  {photo.photoCountry ?? ''}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}