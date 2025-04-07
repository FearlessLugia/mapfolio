import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function POST(req: Request) {
  const data = await req.json()

  const newPhoto = await db.photo.create({
    data: {
      photoName: data.photoName,
      s3Url: data.s3Url,
      s3ThumbnailUrl: data.s3ThumbnailUrl,
      photoCountry: data.photoCountry,
      photoCity: data.photoCity,
      photoTimestamp: new Date(data.photoTimestamp),
      photoLocation: data.photoLocation,
    }
  })

  return NextResponse.json(newPhoto)
}
