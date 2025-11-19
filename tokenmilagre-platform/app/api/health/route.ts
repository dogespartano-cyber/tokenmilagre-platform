import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test 1: Check if DATABASE_URL is accessible
    const dbUrlExists = !!process.env.DATABASE_URL;

    // Test 2: Try to connect to database
    const dbTest = await prisma.$queryRaw`SELECT 1 as result`;

    // Test 3: Count articles
    const articleCount = await prisma.article.count();

    // Test 4: Check schema file content
    const schemaPath = path.join(process.cwd(), 'lib', 'generated', 'prisma', 'schema.prisma');
    const schemaExists = fs.existsSync(schemaPath);
    let hasPublishedAt = false;
    if (schemaExists) {
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      hasPublishedAt = schemaContent.includes('publishedAt DateTime');
    }

    return NextResponse.json({
      success: true,
      checks: {
        databaseUrlConfigured: dbUrlExists,
        databaseConnection: 'OK',
        articleCount,
        prismaClientPath: require.resolve('@/lib/generated/prisma'),
        schemaPath,
        schemaExists,
        schemaHasPublishedAt: hasPublishedAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      checks: {
        databaseUrlConfigured: !!process.env.DATABASE_URL,
        databaseUrlValue: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 20)}...` : 'NOT SET',
      },
    }, { status: 500 });
  }
}
