import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function POST(req: Request) {
  const data = await req.json()

  const newPhoto = await db.photo.create({
    data: {
      photoName: data.photoName,
      url: data.url,
      thumbnailUrl: data.thumbnailUrl,
      photoCountry: data.photoCountry,
      photoCity: data.photoCity,
      photoTimestamp: new Date(data.photoTimestamp),
      photoLocation: data.photoLocation
    }
  })

  return NextResponse.json(newPhoto)
}

export async function GET() {
  const photos = await db.photo.findMany({
    where: {
      photoLocation: {
        not: null
      }
    },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      photoName: true,
      url: true,
      thumbnailUrl: true,
      photoLocation: true,
      photoCity: true,
      photoCountry: true
    }
  })

  return NextResponse.json(photos)
}