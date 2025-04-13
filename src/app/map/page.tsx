import Map from './Map'

export default async function MapPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/photo`, {
    cache: 'no-store'
  })
  const photos = await res.json()

  return <Map photos={photos}/>
}
