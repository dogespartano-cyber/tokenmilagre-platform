import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { articleService } from '@/lib/services/article-service';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';

// GET /api/articles - Listar artigos com paginação
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('category');
    const published = searchParams.get('published');
    const type = searchParams.get('type');
    const query = searchParams.get('query'); // Busca por texto

    // Paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Prisma.ArticleWhereInput = {
      deletedAt: null, // Nunca mostrar artigos deletados
    };

    // Filtrar por busca de texto (título, excerpt, conteúdo)
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Filtrar por tipo (news ou educational)
    if (type) {
      where.type = type.toLowerCase();
    }

    // Filtrar por categoria (precisa buscar Category por slug)
    if (categorySlug && categorySlug !== 'all') {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      });

      if (category) {
        where.categoryId = category.id;
      }
    }

    // Filtrar por publicados/rascunhos
    if (published === 'all') {
      // Não filtrar - mostrar todos
    } else if (published === 'true') {
      where.status = 'published';
    } else if (published === 'false') {
      where.status = 'draft';
    } else if (!published) {
      // Por padrão, mostrar apenas publicados
      where.status = 'published';
    }

    // Buscar total de artigos (para calcular hasMore)
    const total = await prisma.article.count({ where });

    // Buscar artigos com paginação
    const articles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        type: true,
        status: true,
        readTime: true,
        coverImage: true,
        coverImageAlt: true,
        // publishedAt: true, // TEMP: Coluna não existe no DB
        createdAt: true,
        updatedAt: true,
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
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Transformar para formato compatível com NewsItem ou EducationItem (mantém compatibilidade de API)
    const formattedArticles = articles.map((article) => {
      const baseData = {
        id: article.id,
        slug: article.slug,
        title: article.title,
        summary: article.excerpt || '',
        content: article.content,
        publishedAt: article.createdAt.toISOString(), // TEMP: publishedAt não existe no DB
        author: article.author.name || article.author.email,
        coverImage: article.coverImage || undefined,
        coverImageAlt: article.coverImageAlt || undefined,
        // Manter compatibilidade com API antiga
        published: article.status === 'published',
        category: article.category?.slug || 'sem-categoria',
        tags: article.tags.map((at) => at.tag.slug),
      };

      // Se for artigo educacional, incluir campos específicos
      if (article.type === 'educational') {
        return {
          ...baseData,
          type: article.type,
          level: 'iniciante', // Valor padrão (campo removido do schema v2)
          contentType: 'Artigo', // Valor padrão (campo removido do schema v2)
          readTime: article.readTime || '5 min',
        };
      }

      // Se for notícia, incluir campos específicos
      return {
        ...baseData,
        type: article.type,
        url: `/dashboard/noticias/${article.slug}`,
        source: '$MILAGRE Research',
        sources: ['$MILAGRE Research'],
        category: article.category ? [article.category.name] : ['Sem Categoria'],
        sentiment: 'neutral', // Valor padrão (campo removido do schema v2)
        keywords: article.tags.map((at) => at.tag.slug),
        factChecked: true,
        lastVerified: article.updatedAt.toISOString(),
      };
    });

    // Calcular metadados de paginação
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      data: formattedArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
        count: formattedArticles.length,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar artigos' },
      { status: 500 }
    );
  }
}

// POST /api/articles - Criar novo artigo (autenticado)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verificar se é ADMIN ou EDITOR
    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json(
        { success: false, error: 'Sem permissão' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      category, // category slug (string)
      tags, // array de tag slugs
      published, // boolean
      type,
      readTime,
      authorId,
      coverImage, // string URL
      coverImageAlt,
      citations, // array de URLs (Perplexity citations)
    } = body;

    // Validação
    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios faltando (title, slug, content)' },
        { status: 400 }
      );
    }

    // Verificar se slug já existe
    const existing = await prisma.article.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug já existe' },
        { status: 400 }
      );
    }

    // Buscar categoryId por slug
    let categoryId: string | undefined;
    if (category) {
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
        select: { id: true },
      });
      categoryId = categoryRecord?.id;

      if (!categoryId) {
        return NextResponse.json(
          { success: false, error: `Categoria '${category}' não encontrada` },
          { status: 400 }
        );
      }
    }

    // Buscar tagIds por slugs
    let tagIds: string[] = [];
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagRecords = await prisma.tag.findMany({
        where: { slug: { in: tags } },
        select: { id: true, slug: true },
      });

      tagIds = tagRecords.map((t) => t.id);

      // Verificar se todos os tags foram encontrados
      if (tagRecords.length !== tags.length) {
        const foundSlugs = tagRecords.map((t) => t.slug);
        const missingSlugs = tags.filter((slug: string) => !foundSlugs.includes(slug));
        return NextResponse.json(
          { success: false, error: `Tags não encontradas: ${missingSlugs.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Converter published (boolean) para status
    const status = published ? 'published' : 'draft';

    // Preparar coverImage
    const coverImageData = coverImage
      ? { url: coverImage, alt: coverImageAlt || '' }
      : undefined;

    // Preparar citations (converter array de strings para formato Citation)
    const citationsData =
      citations && Array.isArray(citations)
        ? citations.map((url: string, index: number) => ({
            url,
            order: index,
            verified: false
          }))
        : undefined;

    // Usar articleService para criar
    const article = await articleService.create(
      {
        title,
        slug,
        content,
        excerpt: excerpt || '',
        type: type || 'news',
        status,
        authorId: authorId || session.user.id,
        categoryId,
        tagIds,
        readTime: readTime ? parseInt(readTime) : undefined,
        coverImage: coverImageData,
        citations: citationsData,
        publishedAt: published ? new Date() : undefined,
      },
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: {
        ...article,
        // Manter compatibilidade de API
        published: article.status === 'published',
        category: article.category?.slug || null,
        tags: article.tags?.map((at) => at.tag.slug) || [],
      },
    });
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao criar artigo',
      },
      { status: 500 }
    );
  }
}
