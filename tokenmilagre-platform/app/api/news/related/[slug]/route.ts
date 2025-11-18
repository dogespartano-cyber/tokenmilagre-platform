import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

type ArticleWithIncludes = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  sentiment: string | null;
  createdAt: Date;
  category: {
    name: string;
  } | null;
  tags: Array<{
    tag: {
      slug: string;
    };
  }>;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar a criptomoeda no banco para obter nome e símbolo
    const crypto = await prisma.cryptocurrency.findUnique({
      where: { coingeckoId: slug },
      select: {
        name: true,
        symbol: true,
        coingeckoId: true,
      },
    });

    if (!crypto) {
      return NextResponse.json({
        success: true,
        data: [],
        timestamp: new Date().toISOString(),
      });
    }

    // Criar lista de termos de busca (nome, símbolo, coingeckoId)
    const searchTerms = [
      crypto.name.toLowerCase(),
      crypto.symbol.toLowerCase(),
      crypto.coingeckoId.toLowerCase(),
    ];

    // Buscar artigos de notícias publicados (schema v2)
    const articles = await prisma.article.findMany({
      where: {
        status: 'published',
        deletedAt: null,
        type: 'news',
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            slug: true,
            name: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                slug: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Pegar mais para filtrar depois
    });

    // Filtrar artigos que contenham algum dos termos nas tags
    const relatedArticles = (articles as ArticleWithIncludes[]).filter((article) => {
      try {
        // Tags agora vêm do relacionamento M:N
        const tagsLower = article.tags.map((at) => at.tag.slug.toLowerCase());

        // Verificar se algum termo de busca está nas tags
        return searchTerms.some((term) =>
          tagsLower.some((tag: string) => tag.includes(term) || term.includes(tag))
        );
      } catch {
        return false;
      }
    });

    // Limitar a 6 notícias mais recentes
    const limitedArticles = relatedArticles.slice(0, 6);

    // Mapear para o formato NewsItem
    const newsItems: NewsItem[] = limitedArticles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.excerpt || '',
      url: `/dashboard/noticias/${article.slug}`,
      source: '$MILAGRE Research',
      publishedAt: article.createdAt.toISOString(),
      category: article.category ? [article.category.name] : ['Sem Categoria'],
      sentiment: article.sentiment as 'positive' | 'neutral' | 'negative',
      keywords: article.tags?.map((at) => at.tag.slug) || [],
    }));

    return NextResponse.json({
      success: true,
      data: newsItems,
      cryptoName: crypto.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao buscar notícias relacionadas:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar notícias relacionadas' },
      { status: 500 }
    );
  }
}
