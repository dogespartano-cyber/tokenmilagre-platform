import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@/lib/generated/prisma';

// GET /api/admin/articles - Listar artigos para área admin (formato bruto)
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
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

    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '100');

    const where: Prisma.ArticleWhereInput = {
      deletedAt: null, // Nunca mostrar artigos deletados (mesmo no admin)
    };

    // Filtrar por tipo
    if (type && type !== 'all') {
      where.type = type as 'news' | 'educational';
    }

    // Filtrar por publicados/rascunhos usando status
    if (published === 'all') {
      // Não filtrar - mostrar todos
    } else if (published === 'true') {
      where.status = 'published';
    } else if (published === 'false') {
      where.status = 'draft';
    }

    // Buscar artigos (formato bruto para admin)
    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Retornar no formato esperado pela página admin (mantém compatibilidade)
    const formattedArticles = articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || '',
      category: article.category?.slug || 'sem-categoria', // Retorna slug
      type: article.type,
      status: article.status, // Incluir status original
      published: article.status === 'published', // Manter compatibilidade
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      author: {
        id: article.author.id,
        name: article.author.name,
        email: article.author.email,
      },
      tags: article.tags.map((at) => at.tag.slug), // Retorna slugs das tags
      // Campos removidos do schema v2 (valores padrão para compatibilidade)
      level: null,
      sentiment: 'neutral',
    }));

    return NextResponse.json({
      success: true,
      data: formattedArticles,
    });
  } catch (error) {
    console.error('Erro ao buscar artigos (admin):', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar artigos' },
      { status: 500 }
    );
  }
}
