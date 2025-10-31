import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    const where: any = {};

    // Filtrar por tipo
    if (type && type !== 'all') {
      where.type = type;
    }

    // Filtrar por publicados/rascunhos
    if (published === 'all') {
      // Não filtrar - mostrar todos
    } else if (published === 'true') {
      where.published = true;
    } else if (published === 'false') {
      where.published = false;
    }

    // Buscar artigos (formato bruto para admin)
    const articles = await prisma.article.findMany({
      where,
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
      },
      take: limit
    });

    // Retornar no formato esperado pela página admin
    const formattedArticles = articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || '',
      category: article.category,
      type: article.type,
      level: article.level,
      sentiment: article.sentiment,
      published: article.published,
      createdAt: article.createdAt.toISOString(),
      author: {
        name: article.author.name,
        email: article.author.email
      }
    }));

    return NextResponse.json({
      success: true,
      data: formattedArticles
    });
  } catch (error) {
    console.error('Erro ao buscar artigos (admin):', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar artigos' },
      { status: 500 }
    );
  }
}
