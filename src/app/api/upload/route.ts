import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

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

  const urls: string[] = []

  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    //TODO

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    for (const file of files) {
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      const key = `uploads/${Date.now()}-${file.name}`

      const command = new PutObjectCommand({
        Bucket: process.env.SPACES_BUCKET, // next-app-files
        Key: key,
        Body: fileBuffer,
        ACL: 'public-read',
        ContentType: file.type || 'application/octet-stream'
      })

      await s3Client.send(command)
      const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${key}`

      //TODO

      urls.push(url)
    }
    return NextResponse.json({ urls }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}