import EducacaoClient from './EducacaoClient';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Educação | $MILAGRE',
  description: 'Artigos e tutoriais gratuitos criados e curados pela comunidade $MILAGRE. Conhecimento livre, acessível a todos.',
};

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
  return articles.map(article => ({
    ...article,
    description: article.excerpt || '',
    type: article.contentType || 'Artigo',
    tags: JSON.parse(article.tags || '[]'),
  }));
}

export default async function EducacaoPage() {
  const resources = await getEducationalArticles();

  return <EducacaoClient resources={resources} />;
}
