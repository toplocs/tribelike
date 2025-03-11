import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

// Reuse PrismaClient across hot reloads (Next.js, Vite, etc.)
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

// Create a PostgreSQL pool using Prisma’s database URL
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export { prisma, pgPool };
