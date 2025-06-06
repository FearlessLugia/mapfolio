import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as typeof global & { prisma?: PrismaClient }
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
