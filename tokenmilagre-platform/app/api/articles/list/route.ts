import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/articles/list - Listar apenas títulos e slugs (otimizado para verificação de duplicatas)
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: 'published'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Últimos 100 artigos
    });

    return NextResponse.json({
      success: true,
      data: articles,
      count: articles.length
    });
  } catch (error) {
    console.error('Erro ao listar artigos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao listar artigos' },
      { status: 500 }
    );
  }
}
