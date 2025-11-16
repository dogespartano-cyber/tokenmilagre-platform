import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArtigoEducacionalClient from './ArtigoEducacionalClient';
import { prisma } from '@/lib/prisma';

// Cache ISR: Revalida a cada 1 hora (artigos educacionais mudam raramente)
export const revalidate = 3600;

// Permite gerar páginas dinamicamente para slugs não pré-gerados
export const dynamicParams = true;

// TEMPORARIAMENTE DESABILITADO para reduzir consumo de dados do banco
// Páginas serão geradas sob demanda (dynamic rendering)
// export async function generateStaticParams() {
//   const articles = await prisma.article.findMany({
//     where: {
//       type: 'educational',
//       published: true,
//     },
//     select: {
//       slug: true,
//     },
//   });

//   return articles.map((article) => ({
//     slug: article.slug,
//   }));
// }

interface EducationalArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  level: 'iniciante' | 'intermediario' | 'avancado';
  type: 'Artigo' | 'Tutorial';
  readTime: string;
  tags: string[];
  author?: string;
  publishedAt: string;
}

// **DEPRECATED** - Array mantido apenas para referência histórica
// Os dados agora vêm do banco de dados PostgreSQL

async function getArticle(slug: string): Promise<EducationalArticle | null> {
  const article = await prisma.article.findFirst({
    where: {
      slug: slug,
      type: 'educational',
      published: true,
    },
  });

  if (!article) return null;

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.excerpt || '',
    content: article.content,
    category: article.category,
    level: (article.level || 'iniciante') as 'iniciante' | 'intermediario' | 'avancado',
    type: (article.contentType || 'Artigo') as 'Artigo' | 'Tutorial',
    readTime: article.readTime || '10 min',
    tags: JSON.parse(article.tags || '[]'),
    author: 'Comunidade $MILAGRE',
    publishedAt: article.createdAt.toISOString().split('T')[0],
  };
}

async function getRelatedArticles(category: string, currentSlug: string): Promise<EducationalArticle[]> {
  const articles = await prisma.article.findMany({
    where: {
      type: 'educational',
      published: true,
      category: category,
      slug: {
        not: currentSlug,
      },
    },
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return articles.map((article: any) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.excerpt || '',
    content: article.content,
    category: article.category,
    level: (article.level || 'iniciante') as 'iniciante' | 'intermediario' | 'avancado',
    type: (article.contentType || 'Artigo') as 'Artigo' | 'Tutorial',
    readTime: article.readTime || '10 min',
    tags: JSON.parse(article.tags || '[]'),
    author: 'Comunidade $MILAGRE',
    publishedAt: article.createdAt.toISOString().split('T')[0],
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Artigo não encontrado | $MILAGRE Education',
      description: 'O artigo solicitado não foi encontrado.',
    };
  }

  return {
    title: `${article.title} | $MILAGRE Education`,
    description: article.description,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags,
    },
  };
}

export default async function ArtigoEducacionalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.category, slug);

  return (
    <ArtigoEducacionalClient
      article={article}
      relatedArticles={relatedArticles}
    />
  );
}
