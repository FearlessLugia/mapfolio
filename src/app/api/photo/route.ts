import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET() {
  const photos = await db.photo.findMany({
    where: {
      photoLocation: {
        not: Prisma.JsonNull
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