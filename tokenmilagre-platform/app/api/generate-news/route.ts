import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { fetchNewsWithGemini, generateFullArticle } from '@/lib/gemini-news';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string; // Artigo completo em markdown
  url: string;
  source: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

// Tópicos para gerar artigos
const CRYPTO_TOPICS = [
  'Bitcoin: últimas análises de preço e tendências de mercado',
  'Ethereum: atualizações recentes e próximos upgrades',
  'Solana: desenvolvimentos no ecossistema e DeFi',
  'DeFi: protocolos e inovações em finanças descentralizadas',
  'NFTs: tendências de mercado e vendas importantes',
  'Regulação cripto: novidades regulatórias globais',
  'Tecnologia blockchain: avanços e inovações',
  'Altcoins: análise de mercado e oportunidades'
];

export async function POST(request: Request) {
  try {
    const { count = 6 } = await request.json();

    console.log(`🤖 Gerando ${count} novos artigos com IA...`);

    const newArticles: NewsItem[] = [];

    // Selecionar tópicos aleatórios
    const selectedTopics = CRYPTO_TOPICS.sort(() => 0.5 - Math.random()).slice(0, count);

    for (const topic of selectedTopics) {
      console.log(`📰 Buscando notícia sobre: ${topic}`);

      // Buscar notícia com Gemini
      const geminiResponse = await fetchNewsWithGemini(topic);

      if (geminiResponse) {
        // Gerar artigo completo
        const fullContent = await generateFullArticle(
          geminiResponse.title,
          geminiResponse.summary,
          geminiResponse.category,
          geminiResponse.sentiment
        );

        const article: NewsItem = {
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          title: geminiResponse.title,
          summary: geminiResponse.summary,
          content: fullContent,
          url: getSourceUrl(geminiResponse.source),
          source: geminiResponse.source,
          publishedAt: new Date().toISOString(),
          category: [geminiResponse.category],
          sentiment: geminiResponse.sentiment,
          keywords: geminiResponse.keywords
        };

        newArticles.push(article);
        console.log(`✅ Artigo gerado: ${article.title}`);
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

// Função helper para obter URL da fonte
function getSourceUrl(source: string): string {
  const sourceMap: Record<string, string> = {
    'CoinDesk': 'https://coindesk.com',
    'Cointelegraph': 'https://cointelegraph.com',
    'Exame': 'https://exame.com/future-of-money/',
    'InfoMoney': 'https://infomoney.com.br',
    'The Block': 'https://theblock.co',
    'Decrypt': 'https://decrypt.co',
    'Bitcoin Magazine': 'https://bitcoinmagazine.com',
    'DeFi Llama': 'https://defillama.com',
    'OpenSea': 'https://opensea.io',
    'SEC': 'https://sec.gov',
    'Binance': 'https://binance.com'
  };

  return sourceMap[source] || 'https://cointelegraph.com';
}

// Função antiga removida - agora usamos Gemini diretamente
async function generateArticleWithAI_OLD(topic: string): Promise<NewsItem | null> {
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
    let selectedTemplate: typeof templates[keyof typeof templates] = templates['Bitcoin'];
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

    // Gerar conteúdo completo em markdown
    const content = generateFullContent(title, selectedTemplate.category, selectedTemplate.sentiment);

    // Gerar ID único
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);

    const article: NewsItem = {
      id,
      title,
      summary: summary.substring(0, 200),
      content,
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

function generateFullContent(title: string, categories: string[], sentiment: string): string {
  const category = categories[0];

  // Templates de conteúdo por categoria
  const contentTemplates = {
    'Bitcoin': `
## Análise de Mercado

${title}

O mercado de Bitcoin continua demonstrando forte movimento ${sentiment === 'positive' ? 'de alta' : 'de consolidação'}, com investidores atentos às principais métricas on-chain e indicadores técnicos.

### Principais Pontos

**Análise Técnica:**
- Padrões de candlestick indicam ${sentiment === 'positive' ? 'continuidade da tendência de alta' : 'movimento lateral'}
- Volumes crescentes sugerem participação institucional
- Indicadores como RSI e MACD mostram sinais ${sentiment === 'positive' ? 'positivos' : 'neutros'}

**Fundamentos:**
- Adoção institucional continua crescendo
- Hash rate da rede em novos patamares históricos
- Reservas em exchanges demonstram ${sentiment === 'positive' ? 'saída' : 'estabilidade'} de Bitcoin

### Perspectivas

Analistas do mercado apontam que o Bitcoin mantém sua posição como reserva de valor digital. A crescente adoção por instituições financeiras tradicionais reforça a tese de longo prazo.

**Próximos Catalisadores:**
- Decisões regulatórias sobre ETFs de Bitcoin
- Atualizações de protocolos e melhorias de rede
- Adoção por empresas do S&P 500

### Conclusão

O Bitcoin continua solidificando sua posição no mercado financeiro global, com fundamentos sólidos e crescente interesse institucional.

*Análise fornecida pela equipe $MILAGRE Research*
`,
    'Ethereum': `
## Atualização do Ecossistema Ethereum

${title}

A rede Ethereum continua evoluindo, com desenvolvimentos significativos em escalabilidade e eficiência energética.

### Destaques Técnicos

**Desenvolvimentos Recentes:**
- Implementação de melhorias no mecanismo de consenso
- Redução significativa nas taxas de gas
- Crescimento no número de validadores ativos

**Ecossistema DeFi:**
- TVL (Total Value Locked) em crescimento constante
- Novos protocolos DeFi lançados semanalmente
- Integração com soluções Layer 2

### Impacto no Mercado

A evolução contínua do Ethereum fortalece sua posição como principal plataforma para contratos inteligentes e aplicações descentralizadas.

**Métricas Importantes:**
- Número de transações diárias crescente
- Queima de ETH através do EIP-1559
- Atividade de desenvolvedores em alta histórica

### Próximos Passos

A comunidade Ethereum segue focada em escalabilidade, segurança e descentralização, com várias atualizações importantes no roadmap.

*Análise fornecida pela equipe $MILAGRE Research*
`,
    'Solana': `
## Ecossistema Solana em Expansão

${title}

A blockchain Solana continua atraindo desenvolvedores e projetos devido à sua alta velocidade e baixos custos de transação.

### Crescimento do Ecossistema

**Métricas de Performance:**
- Capacidade de processamento: 50.000+ TPS
- Custo médio de transação: $0.00025
- Tempo de finalização: ~400ms

**Projetos em Destaque:**
- Novos protocolos DeFi lançados
- NFTs e marketplaces em crescimento
- Integração com exchanges e wallets

### Análise Técnica

A arquitetura única da Solana permite escalabilidade sem sacrificar descentralização, atraindo desenvolvedores do mundo todo.

**Vantagens Competitivas:**
- Proof of History (PoH) + Proof of Stake (PoS)
- Paralelização de transações
- Custos extremamente baixos

### Perspectivas Futuras

O ecossistema Solana está posicionado para crescimento contínuo, com foco em DeFi, NFTs, e aplicações Web3.

*Análise fornecida pela equipe $MILAGRE Research*
`,
    'DeFi': `
## Finanças Descentralizadas em Foco

${title}

O setor de DeFi continua revolucionando o sistema financeiro tradicional, oferecendo serviços bancários sem intermediários.

### Principais Desenvolvimentos

**Protocolos em Destaque:**
- Lending/Borrowing: Crescimento em TVL
- DEXs: Volume recorde de negociações
- Yield Farming: Novas oportunidades surgindo

**Inovações Recentes:**
- Cross-chain bridges facilitando interoperabilidade
- Agregadores de yield otimizando retornos
- Seguros DeFi protegendo investidores

### Análise de Mercado

O Total Value Locked (TVL) em protocolos DeFi continua crescendo, demonstrando confiança dos usuários em finanças descentralizadas.

**Tendências Observadas:**
- Migração de capital institucional para DeFi
- Regulamentação mais clara em diversos países
- Integração com finanças tradicionais (TradFi)

### Oportunidades e Riscos

Enquanto o DeFi oferece oportunidades sem precedentes, é essencial entender os riscos de smart contracts e volatilidade.

*Análise fornecida pela equipe $MILAGRE Research*
`,
    'NFTs': `
## Mercado de NFTs em Movimento

${title}

O mercado de NFTs continua evoluindo, expandindo além da arte digital para casos de uso práticos em diversos setores.

### Análise de Mercado

**Volume e Atividade:**
- Marketplaces registrando volumes ${sentiment === 'positive' ? 'crescentes' : 'estáveis'}
- Novas coleções atraindo colecionadores
- Utilidade real além de especulação

**Casos de Uso Emergentes:**
- Gaming: Play-to-earn e metaversos
- Identidade Digital: PFPs e credenciais
- Música e Entretenimento: Royalties on-chain

### Tendências Tecnológicas

NFTs estão evoluindo com padrões mais sofisticados, incluindo NFTs dinâmicos e interoperáveis.

**Inovações Recentes:**
- NFTs com utilidade real (tickets, certificados)
- Integração com realidade aumentada (AR/VR)
- Fracionamento de NFTs de alto valor

### Perspectivas

O mercado de NFTs amadurece focando em utilidade real e casos de uso práticos além da especulação.

*Análise fornecida pela equipe $MILAGRE Research*
`,
    'Regulação': `
## Desenvolvimentos Regulatórios

${title}

O cenário regulatório de criptomoedas continua evoluindo, com governos ao redor do mundo definindo frameworks para o setor.

### Principais Atualizações

**Desenvolvimentos Recentes:**
- Novas diretrizes para exchanges e custódia
- Regulamentação de stablecoins avançando
- Clareza sobre tributação de criptoativos

**Impacto no Mercado:**
- Maior segurança jurídica para investidores
- Entrada facilitada de capital institucional
- Proteção ao consumidor aprimorada

### Análise Global

Diferentes jurisdições adotam abordagens variadas, desde regulamentação progressiva até restrições mais rígidas.

**Regiões em Destaque:**
- Europa: Framework MiCA em implementação
- Estados Unidos: Discussões sobre classificação de ativos
- Ásia-Pacífico: Adoção seletiva de inovações

### Implicações Futuras

Regulamentação clara tende a acelerar adoção institucional e mainstream de criptomoedas.

*Análise fornecida pela equipe $MILAGRE Research*
`
  };

  // Retornar template apropriado ou genérico
  return contentTemplates[category as keyof typeof contentTemplates] || contentTemplates['Bitcoin'];
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
