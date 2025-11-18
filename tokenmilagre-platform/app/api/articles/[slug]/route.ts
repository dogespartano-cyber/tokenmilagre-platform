import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
        },
        category: {
          select: {
            name: true,
            slug: true
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
        category: article.category?.name ? [article.category.name] : ['Sem Categoria'],
        sentiment: article.sentiment as 'positive' | 'neutral' | 'negative',
        keywords: [],
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

// DELETE /api/articles/[slug] - Deletar artigo (apenas ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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

    // Verificar se artigo existe
    const article = await prisma.article.findUnique({
      where: { slug }
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Artigo não encontrado' },
        { status: 404 }
      );
    }

    // Deletar artigo
    await prisma.article.delete({
      where: { slug }
    });

    return NextResponse.json({
      success: true,
      message: 'Artigo deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar artigo:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao deletar artigo'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/articles/[slug] - Atualizar artigo (apenas ADMIN e EDITOR)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Verificar autenticação
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verificar permissão de ADMIN ou EDITOR
    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json(
        { success: false, error: 'Sem permissão' },
        { status: 403 }
      );
    }

    // Verificar se artigo existe
    const article = await prisma.article.findUnique({
      where: { slug }
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Artigo não encontrado' },
        { status: 404 }
      );
    }

    // Parse do body
    const body = await request.json();

    // Converter category de array para string (Prisma espera string)
    const category = body.category !== undefined
      ? (Array.isArray(body.category) ? body.category[0] : body.category)
      : undefined;

    // Atualizar artigo (apenas campos permitidos)
    const updatedArticle = await prisma.article.update({
      where: { slug },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.content !== undefined && { content: body.content }),
        ...(category !== undefined && { category: category }),
        ...(body.tags !== undefined && { tags: typeof body.tags === 'string' ? body.tags : JSON.stringify(body.tags) }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.level !== undefined && { level: body.level }),
        ...(body.sentiment !== undefined && { sentiment: body.sentiment }),
        ...(body.readTime !== undefined && { readTime: body.readTime }),
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedArticle
    });
  } catch (error) {
    console.error('Erro ao atualizar artigo:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar artigo'
      },
      { status: 500 }
    );
  }
}
