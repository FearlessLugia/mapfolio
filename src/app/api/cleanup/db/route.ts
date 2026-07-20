import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const s3Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
  }
})

const STALE_THRESHOLD_MS = 30 * 60 * 1000 // 30 minutes

/**
 * Clean up DB zombie records:
 * - Uploading/Waiting status older than 30 minutes (server crashed mid-upload)
 * - Error status (explicitly failed)
 * - Uploaded status with empty URLs (should never happen)
 *
 * Also attempts to delete associated R2 files for each zombie.
 */
export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    deleted: 0,
    errors: [] as string[]
  }

  try {
    const staleThreshold = new Date(Date.now() - STALE_THRESHOLD_MS)

    const staleRecords = await db.photo.findMany({
      where: {
        OR: [
          {
            status: { in: ['Uploading', 'Waiting'] },
            uploadedTimestamp: { lt: staleThreshold }
          },
          {
            status: 'Error'
          },
          {
            status: 'Uploaded',
            OR: [
              { url: '' },
              { thumbnailUrl: '' }
            ]
          }
        ]
      }
    })

    for (const record of staleRecords) {
      // Try to delete associated R2 files
      if (record.url) {
        const key = record.url.replace(`${process.env.R2_PUBLIC_URL}/`, '')
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME, Key: key
        })).catch((e) => {
          results.errors.push(`Failed to delete R2 key ${key}: ${e}`)
        })
      }
      if (record.thumbnailUrl) {
        const thumbKey = record.thumbnailUrl.replace(`${process.env.R2_PUBLIC_URL}/`, '')
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME, Key: thumbKey
        })).catch((e) => {
          results.errors.push(`Failed to delete R2 thumb ${thumbKey}: ${e}`)
        })
      }

      await db.photo.delete({ where: { id: record.id } })
      results.deleted++
    }

    return NextResponse.json({
      message: 'DB cleanup complete',
      ...results
    })
  } catch (error) {
    console.error('DB cleanup error:', error)
    return NextResponse.json(
      { error: 'DB cleanup failed', details: String(error) },
      { status: 500 }
    )
  }
}
