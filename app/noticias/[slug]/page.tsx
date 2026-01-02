import { Metadata } from 'next';
import { prisma } from '@/lib/core/prisma';
import ArtigoClient from './ArtigoClient';

// Cache ISR: Revalida a cada 5 minutos (notícias mudam com mais frequência)
export const revalidate = 300;

// TEMPORARIAMENTE DESABILITADO para reduzir consumo de dados do banco
// Páginas serão geradas sob demanda (dynamic rendering)
// export async function generateStaticParams() {
//   const articles = await prisma.article.findMany({
//     where: {
//       type: 'news',
//       published: true,
//     },
//     select: {
//       slug: true,
//     },
//     take: 50, // Últimas 50 notícias
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });

//   return articles.map((article) => ({
//     slug: article.slug,
//   }));
// }

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
  citations?: string[]; // URLs das fontes (Perplexity)
  coverImage?: string; // URL da imagem de capa
  coverImageAlt?: string; // Texto alternativo
  consolidatedSources?: { url: string; title?: string; origin: 'perplexity' | 'gemini' }[]; // Cross Mode
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
        },
        citations: true
      }
    });

    if (!article) {
      return null;
    }

    // Parse citations do factCheckSources
    let citations: string[] | undefined;
    if (article.citations && article.citations.length > 0) {
      citations = article.citations.map(c => c.url);
    }

    // Parse consolidatedSources se existir (Cross Mode)
    let consolidatedSources;
    if (article.consolidatedSources) {
      try {
        consolidatedSources = JSON.parse(article.consolidatedSources);
      } catch (e) {
        console.error('Erro ao parsear consolidatedSources:', e);
      }
    }

    // Formatar para NewsItem
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.excerpt || '',
      content: article.content,
      url: `/noticias/${article.slug}`,
      source: '$MILAGRE Research',
      sources: ['$MILAGRE Research'],
      publishedAt: article.createdAt.toISOString(),
      category: [article.category.charAt(0).toUpperCase() + article.category.slice(1)],
      sentiment: article.sentiment as 'positive' | 'neutral' | 'negative',
      keywords: JSON.parse(article.tags || '[]'),
      factChecked: true,
      lastVerified: article.updatedAt.toISOString(),
      citations,
      coverImage: article.coverImage || undefined,
      coverImageAlt: article.coverImageAlt || undefined,
      consolidatedSources, // ← Cross Mode
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
      title: 'Artigo não encontrado | $MILAGRE',
      description: 'O artigo solicitado não foi encontrado.',
    };
  }

  const baseUrl = 'https://tokenmilagre.xyz';
  const articleUrl = `${baseUrl}/noticias/${article.slug || article.id}`;

  return {
    title: `${article.title} | $MILAGRE`,
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
      siteName: '$MILAGRE',
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

  if (article) {
    try {
      // Buscar todos os artigos direto do banco
      const articles = await prisma.article.findMany({
        where: {
          published: true,
          type: 'news'
        },
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          },
          citations: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Formatar para NewsItem
      const allNews: NewsItem[] = articles.map((a: any) => {
        // Parse citations
        let citations: string[] | undefined;
        if (a.citations && a.citations.length > 0) {
          citations = a.citations.map((c: any) => c.url);
        }

        return {
          id: a.id,
          slug: a.slug,
          title: a.title,
          summary: a.excerpt || '',
          content: a.content,
          url: `/noticias/${a.slug}`,
          source: '$MILAGRE Research',
          sources: ['$MILAGRE Research'],
          publishedAt: a.createdAt.toISOString(),
          category: [a.category.charAt(0).toUpperCase() + a.category.slice(1)],
          sentiment: a.sentiment as 'positive' | 'neutral' | 'negative',
          keywords: JSON.parse(a.tags || '[]'),
          factChecked: true,
          lastVerified: a.updatedAt.toISOString(),
          citations,
          coverImage: a.coverImage || undefined,
          coverImageAlt: a.coverImageAlt || undefined,
        };
      });



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

  return <ArtigoClient article={article} relatedArticles={relatedArticles} />;
}
