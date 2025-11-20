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

// Helper para parse seguro de JSON
function safeJSONParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('Erro ao fazer parse de JSON:', e);
    return fallback;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Buscar artigos publicados do banco de dados
    const articles = await prisma.article.findMany({
      where: {
        published: true,
        ...(category && category !== 'all' ? {
          category: {
            equals: category.toLowerCase()
          }
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
      sources: safeJSONParse<string[]>(article.factCheckSources, []),
      publishedAt: article.createdAt.toISOString(),
      category: [article.category.charAt(0).toUpperCase() + article.category.slice(1)],
      sentiment: article.sentiment as 'positive' | 'neutral' | 'negative',
      keywords: safeJSONParse<string[]>(article.tags, []),
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
