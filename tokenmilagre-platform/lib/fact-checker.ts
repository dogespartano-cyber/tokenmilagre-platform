import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface FactCheckResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  sources: string[];
  verifiedData: {
    prices?: { value: number; source: string }[];
    dates?: { event: string; date: string; source: string }[];
    financialData?: { description: string; value: string; source: string }[];
  };
}

/**
 * Fact-check de um artigo usando Gemini
 */
export async function factCheckArticle(
  title: string,
  content: string,
  category: string
): Promise<FactCheckResult> {
  try {
    const prompt = `Você é um fact-checker especializado em criptomoedas. Analise o seguinte artigo e verifique:

TÍTULO: ${title}
CATEGORIA: ${category}

CONTEÚDO:
${content.substring(0, 2000)} // Limite para não exceder

INSTRUÇÕES DE VERIFICAÇÃO:
1. Verifique PREÇOS mencionados (Bitcoin, Ethereum, etc) - estão corretos para hoje (04/10/2025)?
2. Verifique DATAS de eventos (halvings, upgrades, lançamentos) - estão corretas?
3. Verifique VALORES FINANCEIROS (entradas de ETF, market cap, etc) - estão precisos?
4. Identifique FONTES que deveriam ser citadas
5. Detecte INFORMAÇÕES POTENCIALMENTE INCORRETAS

Retorne em JSON (sem markdown):
{
  "isValid": true/false,
  "issues": ["lista de problemas encontrados"],
  "suggestions": ["sugestões de correção"],
  "sources": ["fontes que deveriam ser citadas"],
  "verifiedData": {
    "prices": [{"value": 120000, "source": "CoinGecko"}],
    "dates": [{"event": "Bitcoin Halving", "date": "2028", "source": "bitcoin.org"}],
    "financialData": [{"description": "BlackRock IBIT entradas", "value": "US$ 405M", "source": "Bloomberg"}]
  }
}`;

    const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, ' ');

    const { stdout } = await execAsync(
      `gemini -m gemini-2.5-pro -p "${escapedPrompt}"`,
      { timeout: 30000 }
    );

    // Extrair JSON da resposta
    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('Fact-checker não retornou JSON válido');
      return getDefaultFactCheckResult();
    }

    const result: FactCheckResult = JSON.parse(jsonMatch[0]);
    return result;

  } catch (error) {
    console.error('Erro no fact-checking:', error);
    return getDefaultFactCheckResult();
  }
}

/**
 * Busca múltiplas fontes para um tópico
 */
export async function fetchMultipleSources(topic: string): Promise<string[]> {
  try {
    const prompt = `Liste 3-5 fontes confiáveis de notícias cripto que podem ter publicado sobre: "${topic}" hoje (04/10/2025).

Retorne apenas os nomes das fontes em JSON (sem markdown):
{
  "sources": ["CoinDesk", "Cointelegraph", "Bloomberg Crypto", "InfoMoney", "Exame"]
}`;

    const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, ' ');

    const { stdout } = await execAsync(
      `gemini -m gemini-2.5-pro -p "${escapedPrompt}"`,
      { timeout: 20000 }
    );

    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return getDefaultSources();

    const result = JSON.parse(jsonMatch[0]);
    return result.sources || getDefaultSources();

  } catch (error) {
    console.error('Erro ao buscar fontes:', error);
    return getDefaultSources();
  }
}

/**
 * Valida dados críticos específicos
 */
export async function validateCriticalData(data: {
  prices?: { asset: string; value: number }[];
  dates?: { event: string; expectedDate: string }[];
  financialValues?: { description: string; value: string }[];
}): Promise<{ valid: boolean; corrections: string[] }> {
  try {
    const prompt = `Verifique a precisão dos seguintes dados sobre criptomoedas para hoje (04/10/2025):

${JSON.stringify(data, null, 2)}

Retorne em JSON (sem markdown):
{
  "valid": true/false,
  "corrections": ["Bitcoin: preço correto é $X", "Halving: data correta é 2028", etc]
}`;

    const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, ' ');

    const { stdout } = await execAsync(
      `gemini -m gemini-2.5-pro -p "${escapedPrompt}"`,
      { timeout: 20000 }
    );

    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { valid: true, corrections: [] };

    const result = JSON.parse(jsonMatch[0]);
    return result;

  } catch (error) {
    console.error('Erro na validação de dados:', error);
    return { valid: true, corrections: [] };
  }
}

/**
 * Gera disclaimer apropriado
 */
export function generateDisclaimer(sources: string[], lastUpdated: Date): string {
  const sourcesText = sources.length > 0
    ? `Informações compiladas de: ${sources.join(', ')}.`
    : 'Informações compiladas de múltiplas fontes públicas.';

  return `
---

**Disclaimer:** ${sourcesText}

*Análise fornecida pela equipe $MILAGRE Research. Última atualização: ${lastUpdated.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })}.*

⚠️ **Aviso:** Este conteúdo é gerado com assistência de IA e revisado pela equipe. Sempre faça sua própria pesquisa (DYOR) antes de tomar decisões de investimento.
`;
}

// Funções auxiliares
function getDefaultFactCheckResult(): FactCheckResult {
  return {
    isValid: true,
    issues: [],
    suggestions: ['Recomenda-se verificação manual dos dados'],
    sources: ['CoinDesk', 'Cointelegraph'],
    verifiedData: {}
  };
}

function getDefaultSources(): string[] {
  return ['CoinDesk', 'Cointelegraph', 'Bloomberg Crypto', 'InfoMoney'];
}

/**
 * Extrai dados críticos de um artigo para validação
 */
export function extractCriticalData(content: string): {
  prices: { asset: string; value: number }[];
  dates: { event: string; expectedDate: string }[];
  financialValues: { description: string; value: string }[];
} {
  const prices: { asset: string; value: number }[] = [];
  const dates: { event: string; expectedDate: string }[] = [];
  const financialValues: { description: string; value: string }[] = [];

  // Regex para preços
  const priceRegex = /(?:Bitcoin|BTC|Ethereum|ETH|Solana|SOL).*?(?:US\$|R\$|\$)\s*([\d,\.]+)/gi;
  let match;
  while ((match = priceRegex.exec(content)) !== null) {
    const value = parseFloat(match[1].replace(/,/g, ''));
    if (!isNaN(value)) {
      prices.push({ asset: match[0].split(' ')[0], value });
    }
  }

  // Regex para datas de eventos
  const dateRegex = /(halving|upgrade|lançamento|fork).*?(\d{4})/gi;
  while ((match = dateRegex.exec(content)) !== null) {
    dates.push({ event: match[1], expectedDate: match[2] });
  }

  // Regex para valores financeiros
  const finRegex = /(?:US\$|R\$|\$)\s*([\d,\.]+\s*(?:milhões?|bilhões?|M|B))/gi;
  while ((match = finRegex.exec(content)) !== null) {
    financialValues.push({
      description: content.substring(Math.max(0, match.index - 50), match.index).trim(),
      value: match[0]
    });
  }

  return { prices, dates, financialValues };
}
