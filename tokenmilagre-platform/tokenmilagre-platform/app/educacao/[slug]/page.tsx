import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import EducacaoClient from './EducacaoClient';

// Cache ISR: Revalida a cada 1 hora (conteúdo educacional é mais estático)
export const revalidate = 3600;

interface EducationalContent {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  category: string[];
  keywords: string[];
  level: 'iniciante' | 'intermediario' | 'avancado';
  contentType: string;
  readTime: string;
  publishedAt: string;
  lastVerified?: string;
  citations?: string[]; // URLs das fontes
  coverImage?: string;
  coverImageAlt?: string;
}

async function getEducationalArticle(slug: string): Promise<EducationalContent | null> {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!article || article.type !== 'educational') {
      return null;
    }

    // Parse citations do factCheckSources
    let citations: string[] | undefined;
    if (article.factCheckSources) {
      try {
        citations = JSON.parse(article.factCheckSources);
      } catch (e) {
        console.error('Erro ao parsear factCheckSources:', e);
        citations = undefined;
      }
    }

    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.excerpt || '',
      content: article.content,
      url: `/educacao/${article.slug}`,
      category: [article.category.charAt(0).toUpperCase() + article.category.slice(1)],
      keywords: JSON.parse(article.tags || '[]'),
      level: (article.level || 'iniciante') as 'iniciante' | 'intermediario' | 'avancado',
      contentType: article.contentType || 'Artigo',
      readTime: article.readTime || '5 min',
      publishedAt: article.createdAt.toISOString(),
      lastVerified: article.updatedAt.toISOString(),
      citations,
      coverImage: article.coverImage || undefined,
      coverImageAlt: article.coverImageAlt || undefined,
    };
  } catch (error) {
    console.error('Erro ao buscar artigo educacional:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getEducationalArticle(slug);

  if (!article) {
    return {
      title: 'Artigo não encontrado | TokenMilagre',
      description: 'O artigo solicitado não foi encontrado.',
    };
  }

  const baseUrl = 'https://tokenmilagre.xyz';
  const articleUrl = `${baseUrl}/educacao/${article.slug || article.id}`;

  return {
    title: `${article.title} | Educação TokenMilagre`,
    description: article.summary.substring(0, 160),
    keywords: article.keywords.join(', '),
    openGraph: {
      title: article.title,
      description: article.summary.substring(0, 160),
      type: 'article',
      publishedTime: article.publishedAt,
      tags: article.keywords,
      url: articleUrl,
      siteName: '$MILAGRE - TokenMilagre',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary.substring(0, 160),
      creator: '@TokenMilagre',
    },
  };
}

export default async function EducacaoArtigoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getEducationalArticle(slug);

  // Buscar artigos relacionados
  let relatedArticles: EducationalContent[] = [];

  if (article) {
    try {
      const articles = await prisma.article.findMany({
        where: {
          published: true,
          type: 'educational',
          id: { not: article.id }
        },
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
        take: 4
      });

      relatedArticles = articles.map(a => {
        let citations: string[] | undefined;
        if (a.factCheckSources) {
          try {
            citations = JSON.parse(a.factCheckSources);
          } catch (e) {
            citations = undefined;
          }
        }

        return {
          id: a.id,
          slug: a.slug,
          title: a.title,
          summary: a.excerpt || '',
          content: a.content,
          url: `/educacao/${a.slug}`,
          category: [a.category.charAt(0).toUpperCase() + a.category.slice(1)],
          keywords: JSON.parse(a.tags || '[]'),
          level: (a.level || 'iniciante') as 'iniciante' | 'intermediario' | 'avancado',
          contentType: a.contentType || 'Artigo',
          readTime: a.readTime || '5 min',
          publishedAt: a.createdAt.toISOString(),
          lastVerified: a.updatedAt.toISOString(),
          citations,
          coverImage: a.coverImage || undefined,
          coverImageAlt: a.coverImageAlt || undefined,
        };
      });
    } catch (error) {
      console.error('Erro ao buscar artigos relacionados:', error);
    }
  }

  return <EducacaoClient article={article} relatedArticles={relatedArticles} />;
}
