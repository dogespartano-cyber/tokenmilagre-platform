import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/stats
 * Retorna estatísticas gerais da plataforma
 * Protegido: Apenas ADMIN
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verificar permissão de ADMIN
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Sem permissão' },
        { status: 403 }
      );
    }

    // Buscar estatísticas (adaptado para schema v2)
    const [
      totalArticles,
      totalNews,
      totalEducational,
      totalUsers,
      publishedThisWeek,
      articlesByCategory,
    ] = await Promise.all([
      // Total de artigos publicados (não deletados)
      prisma.article.count({
        where: {
          status: 'published', // published: true → status: 'published'
          deletedAt: null,
        },
      }),

      // Total de notícias publicadas
      prisma.article.count({
        where: {
          type: 'news',
          status: 'published',
          deletedAt: null,
        },
      }),

      // Total de artigos educacionais publicados
      prisma.article.count({
        where: {
          type: 'educational',
          status: 'published',
          deletedAt: null,
        },
      }),

      // Total de usuários
      prisma.user.count(),

      // Publicados esta semana
      prisma.article.count({
        where: {
          status: 'published',
          deletedAt: null,
          publishedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
          },
        },
      }),

      // Artigos por categoria (query simples + agrupamento manual)
      prisma.article.findMany({
        where: {
          status: 'published',
          deletedAt: null,
        },
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    // Agrupar artigos por categoria manualmente
    const categoryCounts = articlesByCategory.reduce((acc, article) => {
      const categoryName = article.category?.name || 'Sem Categoria';
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: {
        totalArticles,
        totalNews,
        totalEducational,
        totalUsers,
        publishedThisWeek,
        articlesByCategory: categoryCounts, // Agora com nomes legíveis
        // Campo educationalByLevel removido (level não existe mais no schema v2)
        educationalByLevel: {
          iniciante: 0,
          intermediario: 0,
          avancado: 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar estatísticas',
      },
      { status: 500 }
    );
  }
}
