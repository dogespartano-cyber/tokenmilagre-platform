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

    // Buscar estatísticas
    const [
      totalArticles,
      totalNews,
      totalEducational,
      totalUsers,
      publishedThisWeek,
      educationalByLevel
    ] = await Promise.all([
      // Total de artigos
      prisma.article.count({
        where: { published: true }
      }),

      // Total de notícias
      prisma.article.count({
        where: { type: 'news', published: true }
      }),

      // Total de artigos educacionais
      prisma.article.count({
        where: { type: 'educational', published: true }
      }),

      // Total de usuários
      prisma.user.count(),

      // Publicados esta semana
      prisma.article.count({
        where: {
          published: true,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
          }
        }
      }),

      // Artigos educacionais por nível
      prisma.article.groupBy({
        by: ['level'],
        where: {
          type: 'educational',
          published: true,
          level: {
            not: null
          }
        },
        _count: true
      })
    ]);

    // Processar educational by level
    const levelCounts = {
      iniciante: 0,
      intermediario: 0,
      avancado: 0
    };

    educationalByLevel.forEach((item: any) => {
      if (item.level) {
        levelCounts[item.level as keyof typeof levelCounts] = item._count;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalArticles,
        totalNews,
        totalEducational,
        totalUsers,
        publishedThisWeek,
        educationalByLevel: levelCounts
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar estatísticas'
      },
      { status: 500 }
    );
  }
}
