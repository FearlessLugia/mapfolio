import { db } from '@/lib/prisma'
import Image from 'next/image'

export default async function PhotosPage() {
  const photos = await db.photo.findMany({
    orderBy: { id: 'asc' }
  })

  return (
    <main className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>All Photos</h1>
      <ul className='space-y-4'>
        {photos.map((photo) => (
          <li key={photo.id}>
            <h2 className='font-semibold'>{photo.photoName}</h2>
            <p>{photo.photoCity}, {photo.photoCountry}</p>
            <p>{photo.photoLocation.lat} {photo.photoLocation.lng}</p>
            {/*<Image*/}
            {/*  src={photo.s3ThumbnailUrl}*/}
            {/*  alt={photo.photoName}*/}
            {/*  fill*/}
            {/*  style={{ objectFit: 'cover' }}*/}
            {/*/>*/}
          </li>
        ))}
      </ul>
    </main>
  )
}
