import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const dbSsl = process.env.DB_SSL?.toLowerCase();
  const shouldUseSslFromEnv = dbSsl === 'true' ? true : dbSsl === 'false' ? false : undefined;

  let shouldUseSslFromUrl = false;
  try {
    const sslMode = new URL(connectionString).searchParams.get('sslmode')?.toLowerCase();
    shouldUseSslFromUrl =
      sslMode === 'require' || sslMode === 'verify-ca' || sslMode === 'verify-full';
  } catch {
    // Ignore malformed URLs here; Prisma/pg will surface connection string errors later.
  }

  const shouldUseSsl = shouldUseSslFromEnv ?? shouldUseSslFromUrl;

  const pool = new pg.Pool({
    connectionString,
    ssl: shouldUseSsl
      ? {
          // For managed DBs (for example AWS RDS), custom CA chains can fail strict validation.
          rejectUnauthorized: false,
        }
      : false,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
}
const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
