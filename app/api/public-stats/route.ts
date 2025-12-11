/**
 * Public Stats API Route
 *
 * Retorna estatísticas públicas da plataforma
 * Não requer autenticação - apenas dados públicos
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/core/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Buscar contagens públicas (sem dados sensíveis)
        const [totalArticles, totalNews, totalEducational, totalResources] = await Promise.all([
            prisma.article.count({ where: { published: true } }),
            prisma.article.count({ where: { published: true, type: 'news' } }),
            prisma.article.count({ where: { published: true, type: 'educational' } }),
            prisma.resource.count(),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                articles: {
                    total: totalArticles,
                    news: totalNews,
                    educational: totalEducational,
                },
                resources: totalResources,
                // Timestamp para cache-busting
                updatedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas públicas:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar estatísticas' },
            { status: 500 }
        );
    }
}
