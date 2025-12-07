/**
 * 🔌 Prisma Client Instance
 * 
 * @agi-purpose: Single database connection for the entire application
 * @agi-pattern: singleton
 * @agi-trust: HIGH
 * 
 * Provides a global Prisma client instance with connection pooling.
 * Following power-law: this is a core module used in 80%+ of the codebase.
 */

import { PrismaClient } from '@/lib/generated/prisma';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
