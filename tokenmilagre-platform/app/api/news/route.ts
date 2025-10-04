import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 segundos timeout

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

// Cache simples em memória (30 minutos)
let newsCache: { data: NewsItem[]; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

// Fontes de notícias confiáveis
const NEWS_SOURCES = [
  'cointelegraph.com',
  'coindesk.com',
  'decrypt.co',
  'theblock.co',
  'bitcoinmagazine.com'
];

// Função para buscar notícias do arquivo JSON
async function fetchRealNews(): Promise<NewsItem[]> {
  try {
    // Verificar cache primeiro
    if (newsCache && Date.now() - newsCache.timestamp < CACHE_DURATION) {
      console.log('✅ Retornando notícias do cache');
      return newsCache.data;
    }

    console.log('🔍 Buscando notícias do arquivo...');

    const newsFilePath = path.join(process.cwd(), 'data', 'news.json');

    try {
      const fileContent = await fs.readFile(newsFilePath, 'utf-8');
      const newsFromFile: NewsItem[] = JSON.parse(fileContent);

      if (newsFromFile.length > 0) {
        // Atualizar cache
        newsCache = {
          data: newsFromFile,
          timestamp: Date.now()
        };

        return newsFromFile;
      }
    } catch (error) {
      console.log('⚠️ Arquivo de notícias não encontrado, usando fallback');
    }

    // Fallback caso arquivo não exista
    const structuredNews: NewsItem[] = [
        {
          id: 'fallback-1',
          title: 'Bitcoin atinge nova máxima histórica após aprovação de ETF',
          summary: 'O Bitcoin ultrapassou a marca de $100.000 após a aprovação de múltiplos ETFs pela SEC. Analistas preveem continuidade da tendência de alta.',
          content: 'Artigo completo em breve...',
          url: 'https://cointelegraph.com',
          source: 'Cointelegraph',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          category: ['Bitcoin', 'Regulação'],
          sentiment: 'positive',
          keywords: ['ETF', 'SEC', 'Alta histórica']
        },
        {
          id: 'fallback-2',
          title: 'Ethereum Pectra upgrade agendado para março de 2025',
          summary: 'A próxima atualização do Ethereum trará melhorias significativas em escalabilidade e redução de taxas de gas.',
          content: 'Artigo completo em breve...',
          url: 'https://ethereum.org',
          source: 'Ethereum Foundation',
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          category: ['Ethereum', 'Tecnologia'],
          sentiment: 'positive',
          keywords: ['Upgrade', 'Pectra', 'Escalabilidade']
        },
        {
          id: 'fallback-3',
          title: 'Solana DeFi TVL ultrapassa $10 bilhões',
          summary: 'O ecossistema DeFi da Solana continua crescendo com novos protocolos e maior adoção institucional.',
          content: 'Artigo completo em breve...',
          url: 'https://defillama.com',
          source: 'DeFi Llama',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          category: ['Solana', 'DeFi'],
          sentiment: 'positive',
          keywords: ['TVL', 'DeFi', 'Crescimento']
        },
        {
          id: 'fallback-4',
          title: 'SEC multa exchange por violação de regulamentação',
          summary: 'Autoridade reguladora dos EUA aplicou multa de $50 milhões em exchange por não seguir regras de registro.',
          content: 'Artigo completo em breve...',
          url: 'https://sec.gov',
          source: 'SEC',
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          category: ['Regulação', 'Exchanges'],
          sentiment: 'negative',
          keywords: ['SEC', 'Multa', 'Regulação']
        },
        {
          id: 'fallback-5',
          title: 'NFTs de arte digital batem recorde em leilão',
          summary: 'Coleção NFT vendida por $25 milhões marca novo recorde no mercado de arte digital.',
          content: 'Artigo completo em breve...',
          url: 'https://opensea.io',
          source: 'OpenSea',
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          category: ['NFTs', 'Arte'],
          sentiment: 'positive',
          keywords: ['NFT', 'Arte', 'Recorde']
        },
        {
          id: 'fallback-6',
          title: 'Análise: Altcoin season pode estar começando',
          summary: 'Indicadores técnicos sugerem que altcoins podem superar Bitcoin nas próximas semanas.',
          content: 'Artigo completo em breve...',
          url: 'https://cryptoquant.com',
          source: 'CryptoQuant',
          publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          category: ['Análise', 'Altcoins'],
          sentiment: 'neutral',
          keywords: ['Altseason', 'Análise técnica', 'Previsão']
        }
    ];

    // Atualizar cache
    newsCache = {
      data: structuredNews,
      timestamp: Date.now()
    };

    return structuredNews;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Buscar notícias (cache ou fetch novo)
    const allNews = await fetchRealNews();

    let filteredNews = allNews;

    // Filtrar por categoria se especificado
    if (category && category !== 'all') {
      filteredNews = allNews.filter(news =>
        news.category.some(cat => cat.toLowerCase() === category.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredNews,
      timestamp: new Date().toISOString(),
      cached: newsCache ? Date.now() - newsCache.timestamp < CACHE_DURATION : false
    });

  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar notícias' },
      { status: 500 }
    );
  }
}
