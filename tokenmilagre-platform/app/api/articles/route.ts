import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/articles - Listar artigos com paginação
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    const query = searchParams.get('query'); // Busca por texto

    // Paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Prisma.ArticleWhereInput = {};

    // Filtrar por busca de texto (título, excerpt, conteúdo, tags)
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { tags: { contains: query } }
      ];
    }

    // Filtrar por tipo (news ou educational)
    if (type) {
      where.type = type;
    }

    // Filtrar por categoria
    if (category && category !== 'all') {
      where.category = category;
    }

    // Filtrar por nível (para artigos educacionais)
    if (level && level !== 'all') {
      where.level = level;
    }

    // Filtrar por publicados/rascunhos
    if (published === 'all') {
      // Não filtrar - mostrar todos
    } else if (published === 'true') {
      where.published = true;
    } else if (published === 'false') {
      where.published = false;
    } else if (!published) {
      // Por padrão, mostrar apenas publicados
      where.published = true;
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
        category: true,
        tags: true,
        sentiment: true,
        level: true,
        contentType: true,
        readTime: true,
        status: 'published',
        factCheckSources: true,
        coverImage: true,
        coverImageAlt: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Transformar para formato compatível com NewsItem ou EducationItem
    const formattedArticles = articles.map((article: any) => {
      // Parse citations from factCheckSources
      let citations: string[] | undefined;
      if (article.factCheckSources) {
        try {
          citations = JSON.parse(article.factCheckSources);
        } catch {
          citations = undefined;
        }
      }

      const baseData = {
        id: article.id,
        slug: article.slug,
        title: article.title,
        summary: article.excerpt || '',
        content: article.content,
        publishedAt: article.createdAt.toISOString(),
        author: article.author.name || article.author.email,
        citations, // Add citations to base data
        coverImage: article.coverImage || undefined,
        coverImageAlt: article.coverImageAlt || undefined
      };

      // Se for artigo educacional, incluir campos específicos
      if (article.type === 'educational') {
        return {
          ...baseData,
          type: article.type,
          level: article.level || 'iniciante',
          contentType: article.contentType || 'Artigo',
          readTime: article.readTime || '5 min',
          category: article.category
        };
      }

      // Se for notícia, incluir campos específicos
      return {
        ...baseData,
        type: article.type,
        url: `/dashboard/noticias/${article.slug}`,
        source: '$MILAGRE Research',
        sources: ['$MILAGRE Research'],
        category: [article.category.charAt(0).toUpperCase() + article.category.slice(1)],
        sentiment: article.sentiment as 'positive' | 'neutral' | 'negative',
        keywords: JSON.parse(article.tags || '[]'),
        factChecked: true,
        lastVerified: article.updatedAt.toISOString()
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
        count: formattedArticles.length
      }
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
      category,
      tags,
      published,
      type,
      level,
      sentiment,
      readTime,
      authorId, // Permite passar authorId explicitamente (para geração por IA)
      factCheckSources, // Citations do Perplexity (JSON array de URLs)
      coverImage,
      coverImageAlt
    } = body;

    // Validação
    if (!title || !slug || !content || !category) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Verificar se slug já existe
    const existing = await prisma.article.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug já existe' },
        { status: 400 }
      );
    }

    // Criar artigo
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || '',
        category,
        tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
        published: published ?? false,
        type: type || 'news',
        level: level || null,
        sentiment: sentiment || 'neutral',
        readTime: readTime || null,
        authorId: authorId || session.user.id, // Usa authorId passado ou do session
        factCheckSources: factCheckSources || null, // Citations do Perplexity
        coverImage: coverImage || null,
        coverImageAlt: coverImageAlt || null
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
      data: article
    });
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar artigo' },
      { status: 500 }
    );
  }
}
