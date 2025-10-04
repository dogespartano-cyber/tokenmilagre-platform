import { Metadata } from 'next';
import ArtigoClient from './ArtigoClient';
import { promises as fs } from 'fs';
import path from 'path';

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
    const newsFilePath = path.join(process.cwd(), 'data', 'news.json');
    const fileContent = await fs.readFile(newsFilePath, 'utf-8');
    const news: NewsItem[] = JSON.parse(fileContent);

    return news.find(item => item.slug === slug || item.id === slug) || null;
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

  return {
    title: `${article.title} | TokenMilagre`,
    description: article.summary.substring(0, 160),
    keywords: article.keywords.join(', '),
    openGraph: {
      title: article.title,
      description: article.summary.substring(0, 160),
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.source],
      tags: article.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary.substring(0, 160),
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
      const newsFilePath = path.join(process.cwd(), 'data', 'news.json');
      const fileContent = await fs.readFile(newsFilePath, 'utf-8');
      const allNews: NewsItem[] = JSON.parse(fileContent);

      // Encontrar índice do artigo atual
      const currentIndex = allNews.findIndex(item => item.id === article.id);

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
