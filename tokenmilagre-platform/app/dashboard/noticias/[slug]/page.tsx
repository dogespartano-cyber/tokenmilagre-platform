import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ArtigoClient from './ArtigoClient';

interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  source: string;
  sources?: string[];
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  factChecked?: boolean;
  factCheckIssues?: string[];
  lastVerified?: string;
}

async function getArticle(slug: string): Promise<NewsItem | null> {
  try {
    // Buscar direto no banco de dados
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

    if (!article) {
      return null;
    }

    // Formatar para NewsItem
    return {
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
    };
  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Artigo não encontrado | TokenMilagre',
      description: 'O artigo solicitado não foi encontrado.',
    };
  }

  const baseUrl = 'https://tokenmilagre.xyz';
  const articleUrl = `${baseUrl}/dashboard/noticias/${article.slug || article.id}`;

  return {
    title: `${article.title} | TokenMilagre`,
    description: article.summary.substring(0, 160),
    keywords: article.keywords.join(', '),
    authors: [{ name: article.source }],
    openGraph: {
      title: article.title,
      description: article.summary.substring(0, 160),
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.source],
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

export default async function ArtigoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  // Buscar artigos relacionados, anterior e próximo
  let relatedArticles: NewsItem[] = [];
  let previousArticle: NewsItem | null = null;
  let nextArticle: NewsItem | null = null;

  if (article) {
    try {
      // Buscar todos os artigos direto do banco
      const articles = await prisma.article.findMany({
        where: { published: true },
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
        }
      });

      // Formatar para NewsItem
      const allNews: NewsItem[] = articles.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        summary: a.excerpt || '',
        content: a.content,
        url: `/dashboard/noticias/${a.slug}`,
        source: '$MILAGRE Research',
        sources: ['$MILAGRE Research'],
        publishedAt: a.createdAt.toISOString(),
        category: [a.category.charAt(0).toUpperCase() + a.category.slice(1)],
        sentiment: a.sentiment as 'positive' | 'neutral' | 'negative',
        keywords: JSON.parse(a.tags || '[]'),
        factChecked: true,
        lastVerified: a.updatedAt.toISOString(),
      }));

      // Encontrar índice do artigo atual
      const currentIndex = allNews.findIndex(item =>
        item.id === article.id || item.slug === article.slug
      );

      // Artigo anterior (mais novo)
      if (currentIndex > 0) {
        previousArticle = allNews[currentIndex - 1];
      }

      // Próximo artigo (mais antigo)
      if (currentIndex < allNews.length - 1) {
        nextArticle = allNews[currentIndex + 1];
      }

      // Artigos relacionados (mesma categoria, excluindo atual)
      relatedArticles = allNews
        .filter(item =>
          item.id !== article.id &&
          item.category.some(cat => article.category.includes(cat))
        )
        .slice(0, 4);
    } catch (error) {
      console.error('Erro ao buscar artigos relacionados:', error);
    }
  }

  return <ArtigoClient article={article} relatedArticles={relatedArticles} previousArticle={previousArticle} nextArticle={nextArticle} />;
}
