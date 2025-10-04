import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface NewsAnalysis {
  summary: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

export async function POST(request: Request) {
  try {
    const { title, content, source } = await request.json();

    const prompt = `Analise esta notícia de criptomoeda e retorne APENAS um objeto JSON válido:

TÍTULO: ${title}
FONTE: ${source}
CONTEÚDO: ${content}

Formato da resposta (JSON puro, sem markdown):
{
  "summary": "Resumo conciso em português brasileiro (máximo 200 caracteres)",
  "category": ["escolha 1-3 categorias: Bitcoin, Ethereum, Solana, DeFi, NFTs, Regulação, Tecnologia, Análise, Exchanges, Altcoins"],
  "sentiment": "positive, neutral ou negative",
  "keywords": ["3-5 palavras-chave principais"]
}`;

    // Simular processamento (em produção, chamar Gemini MCP aqui)
    const analysis: NewsAnalysis = {
      summary: content.substring(0, 200),
      category: detectCategories(title + ' ' + content),
      sentiment: detectSentiment(title + ' ' + content),
      keywords: extractKeywords(title + ' ' + content)
    };

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Erro ao processar notícia:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar notícia' },
      { status: 500 }
    );
  }
}

// Funções auxiliares para análise básica (fallback)
function detectCategories(text: string): string[] {
  const categories = [];
  const lower = text.toLowerCase();

  if (lower.includes('bitcoin') || lower.includes('btc')) categories.push('Bitcoin');
  if (lower.includes('ethereum') || lower.includes('eth')) categories.push('Ethereum');
  if (lower.includes('solana') || lower.includes('sol')) categories.push('Solana');
  if (lower.includes('defi') || lower.includes('descentralizada')) categories.push('DeFi');
  if (lower.includes('nft')) categories.push('NFTs');
  if (lower.includes('sec') || lower.includes('regulação') || lower.includes('regulamentação')) categories.push('Regulação');
  if (lower.includes('upgrade') || lower.includes('tecnologia') || lower.includes('blockchain')) categories.push('Tecnologia');
  if (lower.includes('análise') || lower.includes('previsão')) categories.push('Análise');
  if (lower.includes('exchange') || lower.includes('binance') || lower.includes('coinbase')) categories.push('Exchanges');
  if (lower.includes('altcoin')) categories.push('Altcoins');

  return categories.length > 0 ? categories.slice(0, 3) : ['Geral'];
}

function detectSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const lower = text.toLowerCase();
  const positiveWords = ['alta', 'crescimento', 'aprovação', 'sucesso', 'recorde', 'otimista', 'aumento', 'valorização'];
  const negativeWords = ['queda', 'multa', 'hack', 'perda', 'fraude', 'problema', 'crise', 'redução'];

  const positiveCount = positiveWords.filter(word => lower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lower.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const importantWords = ['bitcoin', 'ethereum', 'solana', 'defi', 'nft', 'sec', 'etf', 'upgrade', 'tvl', 'altcoin', 'regulação'];

  const found = importantWords.filter(word =>
    words.some(w => w.includes(word))
  );

  return found.slice(0, 5).map(w => w.charAt(0).toUpperCase() + w.slice(1));
}
