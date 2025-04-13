import Gallery from './Gallery'

export default async function GalleryPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/photo`, {
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch photos.')
  }

  const photos = await res.json()

  return (
    <main className='px-6'>
      <h1 className='text-2xl font-bold mb-6'>All Photos</h1>
      {/* Render the client component, pass the photos as props */}
      <Gallery photos={photos}/>
    </main>
  )
}
