import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

// Tópicos para gerar artigos
const CRYPTO_TOPICS = [
  'Bitcoin price analysis and market trends',
  'Ethereum latest updates and upgrades',
  'Solana ecosystem developments',
  'DeFi protocols and innovations',
  'NFT market trends and sales',
  'Crypto regulation news',
  'Blockchain technology advances',
  'Altcoin market analysis'
];

export async function POST(request: Request) {
  try {
    const { count = 6 } = await request.json();

    console.log(`🤖 Gerando ${count} novos artigos com IA...`);

    const newArticles: NewsItem[] = [];

    // Selecionar tópicos aleatórios
    const selectedTopics = CRYPTO_TOPICS.sort(() => 0.5 - Math.random()).slice(0, count);

    for (const topic of selectedTopics) {
      // Aqui vamos usar o Gemini MCP para gerar artigos reais
      // Por enquanto, vou criar uma estrutura que você pode integrar com MCP

      const article = await generateArticleWithAI(topic);
      if (article) {
        newArticles.push(article);
      }
    }

    // Ler artigos existentes
    const newsFilePath = path.join(process.cwd(), 'data', 'news.json');
    let existingNews: NewsItem[] = [];

    try {
      const fileContent = await fs.readFile(newsFilePath, 'utf-8');
      existingNews = JSON.parse(fileContent);
    } catch (error) {
      console.log('Criando novo arquivo de notícias...');
    }

    // Adicionar novos artigos no início
    const updatedNews = [...newArticles, ...existingNews].slice(0, 50); // Manter apenas 50 artigos

    // Salvar artigos atualizados
    await fs.writeFile(newsFilePath, JSON.stringify(updatedNews, null, 2), 'utf-8');

    console.log(`✅ ${newArticles.length} artigos gerados e salvos com sucesso!`);

    return NextResponse.json({
      success: true,
      message: `${newArticles.length} artigos gerados com sucesso`,
      articles: newArticles,
      total: updatedNews.length
    });

  } catch (error) {
    console.error('Erro ao gerar artigos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar artigos' },
      { status: 500 }
    );
  }
}

// Função para gerar artigo com IA (integrar com Gemini MCP)
async function generateArticleWithAI(topic: string): Promise<NewsItem | null> {
  try {
    // TODO: Integrar com Gemini MCP aqui
    // const geminiResponse = await callGeminiMCP(topic);

    // Por enquanto, gerar baseado em padrões
    const templates = {
      'Bitcoin': {
        titles: [
          'Bitcoin ultrapassa marca histórica de ${price} com aumento de volume',
          'Análise técnica: Bitcoin forma padrão de alta para próxima semana',
          'Instituições aumentam posições em Bitcoin em ${percent}%',
        ],
        sources: ['CoinDesk', 'Cointelegraph', 'Bitcoin Magazine'],
        url: 'https://cointelegraph.com',
        category: ['Bitcoin', 'Análise'],
        sentiment: 'positive' as const,
      },
      'Ethereum': {
        titles: [
          'Ethereum: Próxima atualização promete reduzir taxas de gas em ${percent}%',
          'DApps na Ethereum crescem ${percent}% em volume de transações',
          'Desenvolvedores anunciam roadmap atualizado para Ethereum 2.0',
        ],
        sources: ['Ethereum Foundation', 'The Block', 'Decrypt'],
        url: 'https://ethereum.org',
        category: ['Ethereum', 'Tecnologia'],
        sentiment: 'positive' as const,
      },
      'Solana': {
        titles: [
          'Solana DeFi TVL atinge novo recorde de ${amount} bilhões',
          'Novos protocolos escolhem Solana pela velocidade e baixo custo',
          'Ecossistema Solana cresce ${percent}% em desenvolvedores ativos',
        ],
        sources: ['Solana Foundation', 'DeFi Llama', 'CoinDesk'],
        url: 'https://solana.com',
        category: ['Solana', 'DeFi'],
        sentiment: 'positive' as const,
      },
      'DeFi': {
        titles: [
          'Protocolos DeFi registram ${amount} bilhões em valor bloqueado',
          'Nova plataforma DeFi oferece ${percent}% de APY em staking',
          'Análise: DeFi está moldando o futuro das finanças',
        ],
        sources: ['DeFi Pulse', 'The Block', 'CryptoQuant'],
        url: 'https://defillama.com',
        category: ['DeFi', 'Análise'],
        sentiment: 'positive' as const,
      },
      'NFT': {
        titles: [
          'Coleção de NFTs bate recorde com venda de ${amount} milhões',
          'Mercado de NFTs mostra sinais de recuperação com volume crescente',
          'Artista digital revoluciona mercado com nova coleção NFT',
        ],
        sources: ['OpenSea', 'Nifty Gateway', 'SuperRare'],
        url: 'https://opensea.io',
        category: ['NFTs', 'Arte'],
        sentiment: 'positive' as const,
      },
      'Regulação': {
        titles: [
          'SEC anuncia novas diretrizes para exchanges de criptomoedas',
          'Europa avança com framework regulatório MiCA para crypto',
          'Banco Central estuda regulamentação de stablecoins',
        ],
        sources: ['SEC', 'Reuters', 'Bloomberg Crypto'],
        url: 'https://sec.gov',
        category: ['Regulação', 'Política'],
        sentiment: 'neutral' as const,
      }
    };

    // Detectar categoria do tópico
    let selectedTemplate = templates['Bitcoin'];
    if (topic.toLowerCase().includes('ethereum')) selectedTemplate = templates['Ethereum'];
    else if (topic.toLowerCase().includes('solana')) selectedTemplate = templates['Solana'];
    else if (topic.toLowerCase().includes('defi')) selectedTemplate = templates['DeFi'];
    else if (topic.toLowerCase().includes('nft')) selectedTemplate = templates['NFT'];
    else if (topic.toLowerCase().includes('regulation')) selectedTemplate = templates['Regulação'];

    // Gerar valores aleatórios
    const price = (Math.random() * 50000 + 50000).toFixed(0);
    const percent = (Math.random() * 30 + 10).toFixed(1);
    const amount = (Math.random() * 20 + 5).toFixed(1);

    // Selecionar título aleatório e substituir variáveis
    const titleTemplate = selectedTemplate.titles[Math.floor(Math.random() * selectedTemplate.titles.length)];
    const title = titleTemplate
      .replace('${price}', price)
      .replace('${percent}', percent)
      .replace('${amount}', amount);

    // Gerar resumo
    const summary = `Análise completa sobre ${topic}. Especialistas apontam tendências positivas no mercado, com crescimento consistente nos últimos dias. Investidores institucionais demonstram interesse renovado.`;

    const article: NewsItem = {
      title,
      summary: summary.substring(0, 200),
      url: selectedTemplate.url,
      source: selectedTemplate.sources[Math.floor(Math.random() * selectedTemplate.sources.length)],
      publishedAt: new Date().toISOString(),
      category: selectedTemplate.category,
      sentiment: selectedTemplate.sentiment,
      keywords: extractKeywords(title + ' ' + summary)
    };

    return article;

  } catch (error) {
    console.error('Erro ao gerar artigo:', error);
    return null;
  }
}

function extractKeywords(text: string): string[] {
  const keywords = new Set<string>();
  const commonWords = ['bitcoin', 'ethereum', 'solana', 'defi', 'nft', 'sec', 'regulação', 'análise', 'mercado', 'crypto'];

  const words = text.toLowerCase().split(/\s+/);

  for (const word of words) {
    for (const keyword of commonWords) {
      if (word.includes(keyword)) {
        keywords.add(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    }
  }

  // Adicionar keywords específicas
  if (text.includes('ETF')) keywords.add('ETF');
  if (text.includes('TVL')) keywords.add('TVL');
  if (text.includes('APY')) keywords.add('APY');
  if (text.includes('staking')) keywords.add('Staking');
  if (text.includes('upgrade')) keywords.add('Upgrade');

  return Array.from(keywords).slice(0, 5);
}
