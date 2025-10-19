import { Metadata } from 'next';
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
    // Buscar via API que verifica banco + news.json
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles/${slug}`, {
      cache: 'no-store' // Sempre buscar dados frescos
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
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
      // Buscar todos os artigos via API
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      const articlesRes = await fetch(`${baseUrl}/api/articles?category=all`, { cache: 'no-store' });
      const articlesData = await articlesRes.json();

      // Ordenar por data
      const allNews: NewsItem[] = (articlesData.success ? articlesData.data : [])
        .sort((a: NewsItem, b: NewsItem) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

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
