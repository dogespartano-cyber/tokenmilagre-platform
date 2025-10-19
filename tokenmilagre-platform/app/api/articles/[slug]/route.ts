import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

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

// GET /api/articles/[slug] - Buscar artigo por slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 1. Tentar buscar no banco de dados (artigos curados)
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (article) {
      // Retornar artigo do banco
      const formattedArticle: NewsItem = {
        id: article.id,
        slug: article.slug,
        title: article.title,
        summary: article.excerpt || '',
        content: article.content,
        url: `/dashboard/noticias/${article.slug}`,
        source: '$MILAGRE Research',
        sources: ['$MILAGRE Research'],
        publishedAt: article.createdAt.toISOString(),
        category: [article.category.charAt(0).toUpperCase() + article.category.slice(1)],
        sentiment: article.sentiment as 'positive' | 'neutral' | 'negative',
        keywords: JSON.parse(article.tags || '[]'),
        factChecked: true,
        lastVerified: article.updatedAt.toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: formattedArticle
      });
    }

    // 2. Se não encontrou no banco, tentar buscar em news.json
    try {
      const newsFilePath = path.join(process.cwd(), 'data', 'news.json');
      const fileContent = await fs.readFile(newsFilePath, 'utf-8');
      const news: NewsItem[] = JSON.parse(fileContent);

      const newsArticle = news.find(item => item.slug === slug || item.id === slug);

      if (newsArticle) {
        return NextResponse.json({
          success: true,
          data: newsArticle
        });
      }
    } catch (error) {
      console.error('Erro ao buscar em news.json:', error);
    }

    // 3. Não encontrado em nenhum lugar
    return NextResponse.json(
      {
        success: false,
        error: 'Artigo não encontrado'
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar artigo'
      },
      { status: 500 }
    );
  }
}
