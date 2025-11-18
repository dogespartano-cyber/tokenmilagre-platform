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

type ArticleWithIncludes = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  sentiment: string | null;
  factCheckStatus: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    name: string;
  } | null;
  tags: Array<{
    tag: {
      slug: string;
    };
  }>;
  citations: Array<{
    url: string;
  }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');

    // Buscar artigos publicados do banco de dados (schema v2)
    const articles = await prisma.article.findMany({
      where: {
        status: 'published',
        deletedAt: null,
        type: 'news',
        ...(categorySlug && categorySlug !== 'all' ? {
          category: {
            slug: categorySlug.toLowerCase()
          }
        } : {})
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        category: {
          select: {
            slug: true,
            name: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                slug: true,
                name: true
              }
            }
          }
        },
        citations: {
          select: {
            url: true,
            domain: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Mapear para o formato NewsItem
    const newsItems: NewsItem[] = (articles as ArticleWithIncludes[]).map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.excerpt || '',
      content: article.content,
      url: `/dashboard/noticias/${article.slug}`,
      source: '$MILAGRE Research',
      sources: article.citations?.map((c) => c.url) || [],
      publishedAt: article.createdAt.toISOString(),
      category: article.category ? [article.category.name] : ['Sem Categoria'],
      sentiment: article.sentiment as 'positive' | 'neutral' | 'negative',
      keywords: article.tags?.map((at) => at.tag.slug) || [],
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
