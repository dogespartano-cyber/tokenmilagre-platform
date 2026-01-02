import { NextResponse } from 'next/server';
import { prisma } from '@/lib/core/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const start = Date.now();

        // 1. Check basic connection
        const count = await prisma.article.count();

        // 2. Check query with relation (suspect)
        const article = await prisma.article.findFirst({
            include: { citations: true }
        });

        const duration = Date.now() - start;

        return NextResponse.json({
            status: 'ok',
            duration: `${duration}ms`,
            data: {
                count,
                sample: article ? {
                    id: article.id,
                    title: article.title,
                    citationsCount: article.citations.length,
                    citations: article.citations
                } : 'no articles'
            },
            env: {
                // Safe env check
                hasDbUrl: !!process.env.DATABASE_URL
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack,
            name: error.name
        }, { status: 500 });
    }
}
