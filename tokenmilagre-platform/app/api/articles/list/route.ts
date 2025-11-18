import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/articles/list - Listar apenas títulos e slugs (otimizado para verificação de duplicatas)
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: 'published', // published: true → status: 'published'
        deletedAt: null, // Nunca retornar artigos deletados
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Últimos 100 artigos
    });

    // Transformar para manter compatibilidade de API (category como string)
    const formattedArticles = articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: article.category?.slug || 'sem-categoria', // Retorna slug da categoria
      createdAt: article.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedArticles,
      count: formattedArticles.length,
    });
  } catch (error) {
    console.error('Erro ao listar artigos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao listar artigos' },
      { status: 500 }
    );
  }
}
