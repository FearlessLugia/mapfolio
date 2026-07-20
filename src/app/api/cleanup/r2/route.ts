import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
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

/**
 * Clean up R2 orphan files:
 * Lists all objects under uploads/ in R2 and deletes any
 * that are not referenced by a DB record's url or thumbnailUrl.
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
    // Collect all URLs from DB
    const allPhotos = await db.photo.findMany({
      select: { url: true, thumbnailUrl: true }
    })
    const dbUrls = new Set(
      allPhotos.flatMap((p) => [p.url, p.thumbnailUrl]).filter(Boolean)
    )

    // List all R2 objects under uploads/ and delete orphans
    let continuationToken: string | undefined
    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        Prefix: 'uploads/',
        ContinuationToken: continuationToken
      })

      const listResponse = await s3Client.send(listCommand)

      for (const obj of listResponse.Contents ?? []) {
        if (!obj.Key) continue

        const fullUrl = `${process.env.R2_PUBLIC_URL}/${obj.Key}`

        if (!dbUrls.has(fullUrl)) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME, Key: obj.Key
          })).catch((e) => {
            results.errors.push(`Failed to delete orphan ${obj.Key}: ${e}`)
          })
          results.deleted++
        }
      }

      continuationToken = listResponse.IsTruncated
        ? listResponse.NextContinuationToken
        : undefined
    } while (continuationToken)

    return NextResponse.json({
      message: 'R2 cleanup complete',
      ...results
    })
  } catch (error) {
    console.error('R2 cleanup error:', error)
    return NextResponse.json(
      { error: 'R2 cleanup failed', details: String(error) },
      { status: 500 }
    )
  }
}
