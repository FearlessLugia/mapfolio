import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'
import * as exifr from 'exifr'
import { db } from '@/lib/prisma'
import { Photo } from '@prisma/client'
import sharp from 'sharp'

const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT,
  region: process.env.SPACES_REGION,
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!
  }
})

async function reverseGeocodeWithMapbox(lat: number, lon: number) {
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN
  const url = `https://api.mapbox.com/search/geocode/v6/reverse?types=region&language=en&longitude=${lon}&latitude=${lat}&access_token=${accessToken}`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Mapbox reverse geocoding failed with status ${res.status}`)
  }

  const mapboxResponse = await res.json()

  const feature = mapboxResponse.features?.[0]
  if (!feature || !feature.properties || !feature.properties.context) {
    return { city: null, country: null }
  }

  const city = feature.properties.context.region?.name || null
  const country = feature.properties.context.country?.name || null

  return { city, country }
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type')
  if (!contentType || !contentType.includes('multipart/form-data')) {
    return NextResponse.json(
      { error: 'Invalid content type' },
      { status: 400 }
    )
  }

  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const dbRecords: Photo[] = []

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      let latitude: number | null = null
      let longitude: number | null = null
      let takenAt: Date | null = null
      let photoCity: string | null = null
      let photoCountry: string | null = null

      try {
        const exif = await exifr.parse(buffer, { gps: true })

        function roundTo6(num: number | null, digits = 6): number | null {
          return num !== null ? parseFloat(num.toFixed(digits)) : null
        }

        if (exif?.latitude && exif?.longitude) {
          latitude = roundTo6(exif.latitude)
          longitude = roundTo6(exif.longitude)

          const location = await reverseGeocodeWithMapbox(latitude, longitude)
          photoCity = location.city
          photoCountry = location.country
        }

        if (exif?.DateTimeOriginal) {
          takenAt = exif.DateTimeOriginal
        }
        console.log('latitude, longitude, takenAt', file.name, latitude, longitude, takenAt)
        console.log('photoCity, photoCountry', photoCity, photoCountry)
      } catch (exifErr) {
        console.warn(`Failed to parse EXIF for ${file.name}:`, exifErr)
      }

      // Step 1: write metadata
      const dbRecord = await db.photo.create({
        data: {
          photoName: file.name,
          url: '',
          thumbnailUrl: '',
          photoCountry,
          photoCity,
          photoTimestamp: takenAt,
          photoLocation: latitude && longitude ? { latitude, longitude } : null,
          status: 'pending'
        }
      })

      // Step 2: upload original image to S3
      const key = `uploads/${Date.now()}-${file.name}`

      const command = new PutObjectCommand({
        Bucket: process.env.SPACES_BUCKET,
        Key: key,
        Body: buffer,
        ACL: 'public-read',
        ContentType: file.type || 'application/octet-stream'
      })

      await s3Client.send(command)

      // Step 3: generate thumbnail
      let thumbnailBuffer: Buffer
      try {
        thumbnailBuffer = await sharp(buffer)
          .resize({ width: 300 })
          .toBuffer()
      } catch (sharpErr) {
        console.error('Failed to generate thumbnail:', sharpErr)
        continue
      }

      // Step 4: upload thumbnail to S3
      const thumbKey = `uploads/thumbnails/${Date.now()}-${file.name.replace(/\.[^.]+$/, '')}.jpg`
      const thumbCommand = new PutObjectCommand({
        Bucket: process.env.SPACES_BUCKET,
        Key: thumbKey,
        Body: thumbnailBuffer,
        ACL: 'public-read',
        ContentType: 'image/jpeg'
      })

      await s3Client.send(thumbCommand)


      // Step 5: update metadata with S3 URL
      const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.cdn.digitaloceanspaces.com/${key}`
      const thumbnailUrl = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.cdn.digitaloceanspaces.com/${thumbKey}`

      const updatedRecord = await db.photo.update({
        where: { id: dbRecord.id },
        data: {
          url,
          thumbnailUrl,
          status: 'uploaded'
        }
      })

      dbRecords.push(updatedRecord)
    }

    return NextResponse.json({ dbRecords }, { status: 200 })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}