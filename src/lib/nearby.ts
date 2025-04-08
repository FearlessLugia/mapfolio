import { db } from '@/lib/prisma'

export function getNearbyPhotos(lat: number, lng: number, radiusKm = 5) {
  return db.$queryRawUnsafe(`
    SELECT *
    FROM "Photo"
    WHERE (
              ("photoLocation" ->>'lat')::float8 IS NOT NULL AND
              ("photoLocation"->>'lng')::float8 IS NOT NULL
          )
    AND (
      6371 * acos(
        cos(radians($1)) * cos(radians(("photoLocation"->>'lat')::float8)) *
          cos(radians(("photoLocation"->>'lng')::float8) - radians($2)) +
          sin(radians($1)) * sin(radians(("photoLocation"->>'lat')::float8))
          )
          ) <= $3
  `, lat, lng, radiusKm)
}

