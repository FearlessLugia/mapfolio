import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'
import * as exifr from 'exifr'

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

    const urls: string[] = []

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      let latitude: number | null = null
      let longitude: number | null = null
      let takenAt: Date | null = null

      try {
        const exif = await exifr.parse(buffer, { gps: true })

        function roundTo6(num: number | null, digits = 6): number | null {
          return num !== null ? parseFloat(num.toFixed(digits)) : null;
        }

        if (exif?.latitude && exif?.longitude) {
          latitude = roundTo6(exif.latitude)
          longitude = roundTo6(exif.longitude)
        }

        if (exif?.DateTimeOriginal) {
          takenAt = exif.DateTimeOriginal
        }
      } catch (exifErr) {
        console.warn(`Failed to parse EXIF for ${file.name}:`, exifErr)
      }

      console.log('latitude,longitude, takenAt', latitude, longitude, takenAt)





      const key = `uploads/${Date.now()}-${file.name}`

      const command = new PutObjectCommand({
        Bucket: process.env.SPACES_BUCKET, // next-app-files
        Key: key,
        Body: buffer,
        ACL: 'public-read',
        ContentType: file.type || 'application/octet-stream'
      })

      await s3Client.send(command)
      const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${key}`
      urls.push(url)

      //TODO
      // Save the photo metadata to the database

    }
    return NextResponse.json({ urls }, { status: 200 })
    // return NextResponse.json({ urls }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}