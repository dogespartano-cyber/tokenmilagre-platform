import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  source: string;
  sources?: string[];
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  factChecked?: boolean;
  lastVerified?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Buscar artigos publicados do banco de dados
    const articles = await prisma.article.findMany({
      where: {
        published: true,
        type: 'news',
        ...(category && category !== 'all' ? {
          category: category.toLowerCase()
        } : {})
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Mapear para o formato NewsItem
    const newsItems: NewsItem[] = articles.map((article: any) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.excerpt || '',
      content: article.content,
      url: `/dashboard/noticias/${article.slug}`,
      source: '$MILAGRE Research',
      sources: article.factCheckSources ? JSON.parse(article.factCheckSources) : [],
      publishedAt: article.createdAt.toISOString(),
      category: article.category ? [article.category] : ['Sem Categoria'],
      sentiment: article.sentiment as 'positive' | 'neutral' | 'negative',
      keywords: article.tags ? JSON.parse(article.tags) : [],
      factChecked: article.factCheckStatus === 'verified',
      lastVerified: article.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: newsItems,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar notícias' },
      { status: 500 }
    );
  }
}
