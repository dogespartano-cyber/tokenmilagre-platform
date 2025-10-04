import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

// Mock data para demonstração - Em produção, usar WebSearch + Claude MCP
const mockNews: NewsItem[] = [
  {
    title: 'Bitcoin atinge nova máxima histórica após aprovação de ETF',
    summary: 'O Bitcoin ultrapassou a marca de $100.000 após a aprovação de múltiplos ETFs pela SEC. Analistas preveem continuidade da tendência de alta.',
    url: 'https://cointelegraph.com',
    source: 'Cointelegraph',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: ['Bitcoin', 'Regulação'],
    sentiment: 'positive',
    keywords: ['ETF', 'SEC', 'Alta histórica']
  },
  {
    title: 'Ethereum Pectra upgrade agendado para março de 2025',
    summary: 'A próxima atualização do Ethereum trará melhorias significativas em escalabilidade e redução de taxas de gas.',
    url: 'https://ethereum.org',
    source: 'Ethereum Foundation',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: ['Ethereum', 'Tecnologia'],
    sentiment: 'positive',
    keywords: ['Upgrade', 'Pectra', 'Escalabilidade']
  },
  {
    title: 'Solana DeFi TVL ultrapassa $10 bilhões',
    summary: 'O ecossistema DeFi da Solana continua crescendo com novos protocolos e maior adoção institucional.',
    url: 'https://defillama.com',
    source: 'DeFi Llama',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    category: ['Solana', 'DeFi'],
    sentiment: 'positive',
    keywords: ['TVL', 'DeFi', 'Crescimento']
  },
  {
    title: 'SEC multa exchange por violação de regulamentação',
    summary: 'Autoridade reguladora dos EUA aplicou multa de $50 milhões em exchange por não seguir regras de registro.',
    url: 'https://sec.gov',
    source: 'SEC',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    category: ['Regulação', 'Exchanges'],
    sentiment: 'negative',
    keywords: ['SEC', 'Multa', 'Regulação']
  },
  {
    title: 'NFTs de arte digital batem recorde em leilão',
    summary: 'Coleção NFT vendida por $25 milhões marca novo recorde no mercado de arte digital.',
    url: 'https://opensea.io',
    source: 'OpenSea',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: ['NFTs', 'Arte'],
    sentiment: 'positive',
    keywords: ['NFT', 'Arte', 'Recorde']
  },
  {
    title: 'Análise: Altcoin season pode estar começando',
    summary: 'Indicadores técnicos sugerem que altcoins podem superar Bitcoin nas próximas semanas.',
    url: 'https://cryptoquant.com',
    source: 'CryptoQuant',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    category: ['Análise', 'Altcoins'],
    sentiment: 'neutral',
    keywords: ['Altseason', 'Análise técnica', 'Previsão']
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let filteredNews = mockNews;

    // Filtrar por categoria se especificado
    if (category && category !== 'all') {
      filteredNews = mockNews.filter(news =>
        news.category.some(cat => cat.toLowerCase() === category.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredNews,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar notícias' },
      { status: 500 }
    );
  }
}
