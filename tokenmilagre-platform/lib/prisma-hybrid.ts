import { PrismaClient } from '../lib/generated/prisma-hybrid';

const globalForPrisma = global as unknown as { prismaHybrid: PrismaClient };

export const prismaHybrid =
    globalForPrisma.prismaHybrid ||
    new PrismaClient({
        log: ['query'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaHybrid = prismaHybrid;
