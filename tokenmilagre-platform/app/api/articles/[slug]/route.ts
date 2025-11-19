import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { articleService } from '@/lib/services/article-service';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';

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
    const article = await prisma.article.findFirst({
      where: {
        slug,
        deletedAt: null, // Nunca retornar artigos deletados
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        citations: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (article) {
      // Retornar artigo do banco (manter compatibilidade de API)
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
        category: article.category ? [article.category.name] : ['Sem Categoria'],
        sentiment: 'neutral', // Valor padrão (campo removido do schema v2)
        keywords: article.tags.map((at) => at.tag.slug),
        factChecked: true,
        lastVerified: article.updatedAt.toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: formattedArticle,
      });
    }

    // 2. Se não encontrou no banco, tentar buscar em news.json (fallback para dados antigos)
    try {
      const newsFilePath = path.join(process.cwd(), 'data', 'news.json');
      const fileContent = await fs.readFile(newsFilePath, 'utf-8');
      const news: NewsItem[] = JSON.parse(fileContent);

      const newsArticle = news.find((item) => item.slug === slug || item.id === slug);

      if (newsArticle) {
        return NextResponse.json({
          success: true,
          data: newsArticle,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar em news.json:', error);
    }

    // 3. Não encontrado em nenhum lugar
    return NextResponse.json(
      {
        success: false,
        error: 'Artigo não encontrado',
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar artigo',
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

    // Buscar artigo por slug
    const article = await prisma.article.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Artigo não encontrado' },
        { status: 404 }
      );
    }

    // Soft delete usando articleService
    await articleService.delete(article.id, session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Artigo deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar artigo:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao deletar artigo',
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

    // Buscar artigo por slug
    const article = await prisma.article.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Artigo não encontrado' },
        { status: 404 }
      );
    }

    // Parse do body
    const body = await request.json();

    // Preparar dados de atualização
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.readTime !== undefined) updateData.readTime = body.readTime;

    // Converter published (boolean) para status
    if (body.published !== undefined) {
      updateData.status = body.published ? 'published' : 'draft';
      if (body.published) {

      }
    }

    // Converter category (string slug) para categoryId
    if (body.category !== undefined) {
      const categorySlug = Array.isArray(body.category) ? body.category[0] : body.category;
      if (categorySlug) {
        const categoryRecord = await prisma.category.findUnique({
          where: { slug: categorySlug },
          select: { id: true },
        });

        if (!categoryRecord) {
          return NextResponse.json(
            { success: false, error: `Categoria '${categorySlug}' não encontrada` },
            { status: 400 }
          );
        }

        updateData.categoryId = categoryRecord.id;
      }
    }

    // Converter tags (array de slugs) para tagIds
    if (body.tags !== undefined && Array.isArray(body.tags)) {
      const tagRecords = await prisma.tag.findMany({
        where: { slug: { in: body.tags } },
        select: { id: true, slug: true },
      });

      if (tagRecords.length !== body.tags.length) {
        const foundSlugs = tagRecords.map((t) => t.slug);
        const missingSlugs = body.tags.filter((slug: string) => !foundSlugs.includes(slug));
        return NextResponse.json(
          { success: false, error: `Tags não encontradas: ${missingSlugs.join(', ')}` },
          { status: 400 }
        );
      }

      updateData.tagIds = tagRecords.map((t) => t.id);
    }

    // Converter coverImage (string) para objeto
    if (body.coverImage !== undefined) {
      updateData.coverImage = body.coverImage
        ? { url: body.coverImage, alt: body.coverImageAlt || '' }
        : null;
    }

    // Atualizar usando articleService
    const updatedArticle = await articleService.update(article.id, updateData, session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        ...updatedArticle,
        // Manter compatibilidade de API
        published: updatedArticle.status === 'published',
        category: updatedArticle.category?.slug || null,
        tags: updatedArticle.tags?.map((at) => at.tag.slug) || [],
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar artigo:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar artigo',
      },
      { status: 500 }
    );
  }
}
