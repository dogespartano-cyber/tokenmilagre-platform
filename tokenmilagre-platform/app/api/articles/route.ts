import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/articles - Listar artigos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    const where: any = {};

    // Filtrar por categoria
    if (category && category !== 'all') {
      where.category = category;
    }

    // Filtrar por publicados/rascunhos
    if (published !== null) {
      where.published = published === 'true';
    } else {
      // Por padrão, mostrar apenas publicados
      where.published = true;
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
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
      }
    });

    // Transformar para formato compatível com NewsItem
    const formattedArticles = articles.map((article) => ({
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
      author: article.author.name || article.author.email
    }));

    return NextResponse.json({
      success: true,
      data: formattedArticles,
      count: formattedArticles.length
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
    const { title, slug, content, excerpt, category, tags, published } = body;

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
        tags: JSON.stringify(tags || []),
        published: published ?? false,
        authorId: session.user.id
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
