import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';
import { apiSuccess, withErrorHandler, UnauthorizedError, ForbiddenError } from '@/lib/api-response';

// GET /api/admin/articles - Listar artigos para área admin (formato bruto)
export const GET = withErrorHandler(async (request: NextRequest) => {
  // Verificar autenticação
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new UnauthorizedError();
  }

  // Verificar se é ADMIN ou EDITOR
  if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
    throw new ForbiddenError();
  }

  // Rate limiting
  const rateLimitResult = await rateLimit(request, RateLimitPresets.NORMAL, session.user.id);
  if (rateLimitResult) return rateLimitResult;

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

  // Buscar artigos (formato bruto para admin) com eager loading do autor
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

  return apiSuccess(formattedArticles, 'Artigos carregados com sucesso');
});
