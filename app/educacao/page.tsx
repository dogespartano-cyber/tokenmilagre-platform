/**
 * "O temor do Senhor é o princípio da sabedoria, e o conhecimento do Santo a prudência." - Provérbios 9:10
 * Que este conhecimento liberte e edifique.
 */
import EducacaoClient from './EducacaoClient';
import { prisma } from '@/lib/core/prisma';

export const metadata = {
  title: 'Educação | $MILAGRE',
  description: 'Artigos e tutoriais gratuitos criados e curados pela comunidade $MILAGRE. Conhecimento livre, acessível a todos.',
};

// OTIMIZAÇÃO: Force dynamic rendering para evitar queries no build (Neon free tier quota)
export const dynamic = 'force-dynamic';

// Cache ISR: Revalida a cada 1 hora (artigos educacionais mudam raramente)
export const revalidate = 3600;

async function getEducationalArticles() {
  // Buscar apenas primeira página (12 artigos) para SSR
  const articles = await prisma.article.findMany({
    where: {
      type: 'educational',
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      level: true,
      contentType: true,
      readTime: true,
      tags: true,
    },
    take: 12, // Primeira página
  });

  // Transformar tags de JSON string para array
  return articles.map((article: any) => ({
    ...article,
    description: article.excerpt || '',
    type: article.contentType || 'Artigo',
    tags: JSON.parse(article.tags || '[]'),
  }));
}

async function getEducationalStats() {
  // Buscar estatísticas reais do banco (não muda com scroll)
  const [totalArticles, categoriesData] = await Promise.all([
    // Total de artigos educacionais publicados
    prisma.article.count({
      where: {
        type: 'educational',
        published: true,
      },
    }),
    // Categorias únicas
    prisma.article.findMany({
      where: {
        type: 'educational',
        published: true,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    }),
  ]);

  return {
    totalArticles,
    totalCategories: categoriesData.length,
  };
}

export default async function EducacaoPage() {
  const [resources, stats] = await Promise.all([
    getEducationalArticles(),
    getEducationalStats(),
  ]);

  return <EducacaoClient resources={resources} stats={stats} />;
}
