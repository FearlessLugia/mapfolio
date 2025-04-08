import { NextResponse } from 'next/server'
import { getNearbyPhotos } from '@/lib/nearby'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  const radius = parseFloat(searchParams.get('radius') || '5')

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Invalid lat/lng' }, { status: 400 })
  }

  const photos = await getNearbyPhotos(lat, lng, radius)
  return NextResponse.json(photos)
}
