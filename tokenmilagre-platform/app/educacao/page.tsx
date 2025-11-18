import EducacaoClient from './EducacaoClient';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Educação | $MILAGRE',
  description: 'Artigos e tutoriais gratuitos criados e curados pela comunidade $MILAGRE. Conhecimento livre, acessível a todos.',
};

// OTIMIZAÇÃO: Force dynamic rendering para evitar queries no build (Neon free tier quota)
export const dynamic = 'force-dynamic';

// Cache ISR: Revalida a cada 1 hora (artigos educacionais mudam raramente)
export const revalidate = 3600;

async function getEducationalArticles() {
  // Buscar apenas primeira página (12 artigos) para SSR (schema v2)
  const articles = await prisma.article.findMany({
    where: {
      type: 'educational',
      status: 'published',
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      readTime: true,
      category: {
        select: {
          name: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true
            }
          }
        }
      }
    },
    take: 12, // Primeira página
  });

  // Adaptar para schema v2
  return articles.map((article: any) => ({
    ...article,
    description: article.excerpt || '',
    category: article.category?.name || 'Educação',
    level: 'iniciante', // TODO: schema v2 removeu level
    type: 'Artigo', // TODO: schema v2 removeu contentType
    readTime: article.readTime ? `${article.readTime} min` : '10 min',
    tags: article.tags?.map((t: any) => t.tag.name) || [],
  }));
}

export default async function EducacaoPage() {
  const resources = await getEducationalArticles();

  return <EducacaoClient resources={resources} />;
}
