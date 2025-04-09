import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'
import * as exifr from 'exifr'
import { db } from '@/lib/prisma'
import { Photo } from '@prisma/client'

const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT,
  region: process.env.SPACES_REGION,
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!
  }
})

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

      try {
        const exif = await exifr.parse(buffer, { gps: true })

        function roundTo6(num: number | null, digits = 6): number | null {
          return num !== null ? parseFloat(num.toFixed(digits)) : null
        }

        if (exif?.latitude && exif?.longitude) {
          latitude = roundTo6(exif.latitude)
          longitude = roundTo6(exif.longitude)
        }

        if (exif?.DateTimeOriginal) {
          takenAt = exif.DateTimeOriginal
        }
        console.log('latitude,longitude, takenAt', latitude, longitude, takenAt)
      } catch (exifErr) {
        console.warn(`Failed to parse EXIF for ${file.name}:`, exifErr)
      }

      // Use transaction to ensure atomicity
      const record = await db.$transaction(async (tx) => {
        // Step 1: write metadata
        const dbRecord = await tx.photo.create({
          data: {
            photoName: file.name,
            s3Url: '',
            s3ThumbnailUrl: '',
            // photoCountry: data.photoCountry,
            // photoCity: data.photoCity,
            photoTimestamp: takenAt,
            photoLocation: latitude && longitude ? { latitude, longitude } : null,
            status: 'pending'
          }
        })

        // Step 2: upload file to S3
        const key = `uploads/${Date.now()}-${file.name}`

        const command = new PutObjectCommand({
          Bucket: process.env.SPACES_BUCKET, // next-app-files
          Key: key,
          Body: buffer,
          ACL: 'public-read',
          ContentType: file.type || 'application/octet-stream'
        })

        await s3Client.send(command)

        // Step 3: update metadata with S3 URL
        const s3Url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${key}`

        const updatedRecord = await tx.photo.update({
          where: { id: dbRecord.id },
          data: {
            s3Url,
            status: 'uploaded'
          }
        })

        return updatedRecord
      })

      dbRecords.push(record)
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