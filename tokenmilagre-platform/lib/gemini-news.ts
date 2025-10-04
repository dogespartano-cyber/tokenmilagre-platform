import { exec } from 'child_process';
import { promisify } from 'util';
import {
  factCheckArticle,
  fetchMultipleSources,
  validateCriticalData,
  extractCriticalData,
  generateDisclaimer
} from './fact-checker';

const execAsync = promisify(exec);

interface GeminiNewsResponse {
  title: string;
  summary: string;
  source: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

export interface EnhancedNewsResponse extends GeminiNewsResponse {
  sources: string[]; // Múltiplas fontes
  factChecked: boolean;
  factCheckIssues: string[];
  lastVerified: Date;
}

export async function fetchNewsWithGemini(topic: string): Promise<GeminiNewsResponse | null> {
  try {
    const prompt = `Busque uma notícia importante do mercado de criptomoedas de hoje sobre: ${topic}

Formato de resposta (IMPORTANTE: retorne APENAS no formato JSON puro, sem markdown):
{
  "title": "título da notícia",
  "summary": "resumo em 2-3 parágrafos",
  "source": "nome da fonte",
  "category": "categoria (Bitcoin, Ethereum, Solana, DeFi, NFTs, ou Regulação)",
  "sentiment": "positivo, neutro ou negativo",
  "keywords": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5"]
}`;

    // Escapar o prompt para uso no shell
    const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, ' ');

    // Chamar Gemini CLI com timeout de 30 segundos
    const { stdout } = await execAsync(
      `gemini -m gemini-2.5-pro -p "${escapedPrompt}"`,
      { timeout: 30000 }
    );

    // Tentar extrair JSON da resposta
    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Resposta do Gemini não contém JSON válido:', stdout);
      return null;
    }

    const response: GeminiNewsResponse = JSON.parse(jsonMatch[0]);

    // Validar resposta
    if (!response.title || !response.summary || !response.category) {
      console.error('Resposta do Gemini incompleta:', response);
      return null;
    }

    // Normalizar sentimento
    const sentimentMap: Record<string, 'positive' | 'neutral' | 'negative'> = {
      'positivo': 'positive',
      'positive': 'positive',
      'neutro': 'neutral',
      'neutral': 'neutral',
      'negativo': 'negative',
      'negative': 'negative'
    };

    response.sentiment = sentimentMap[response.sentiment.toLowerCase()] || 'neutral';

    return response;
  } catch (error) {
    console.error('Erro ao buscar notícia com Gemini:', error);
    return null;
  }
}

export async function generateFullArticle(
  title: string,
  summary: string,
  category: string,
  sentiment: string
): Promise<string> {
  try {
    const prompt = `Você é um jornalista especializado em criptomoedas. Expanda o seguinte resumo em um artigo completo e detalhado em markdown:

TÍTULO: ${title}
RESUMO: ${summary}
CATEGORIA: ${category}

Crie um artigo com:
- Introdução contextualizada
- Análise técnica/fundamentalista
- Impacto no mercado
- Perspectivas futuras
- Conclusão

Use markdown com ## para subtítulos. Seja técnico mas acessível.`;

    const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, ' ');

    const { stdout } = await execAsync(
      `gemini -m gemini-2.5-pro -p "${escapedPrompt}"`,
      { timeout: 30000 }
    );

    return stdout.trim();
  } catch (error) {
    console.error('Erro ao gerar artigo completo:', error);
    // Fallback: retornar template básico
    return generateFallbackContent(title, summary, category);
  }
}

function generateFallbackContent(title: string, summary: string, category: string): string {
  return `## ${title}

${summary}

### Análise de Mercado

Esta notícia representa um desenvolvimento importante no setor de ${category}. O mercado de criptomoedas continua demonstrando evolução constante, com movimentos significativos que impactam investidores e entusiastas.

### Perspectivas

Analistas acompanham de perto esses desenvolvimentos, que podem ter implicações importantes para o futuro do mercado cripto.

*Análise fornecida pela equipe $MILAGRE Research*
`;
}

/**
 * VERSÃO APRIMORADA: Fetch com fact-checking e múltiplas fontes
 */
export async function fetchNewsWithFactCheck(topic: string): Promise<EnhancedNewsResponse | null> {
  try {
    console.log(`🔍 Buscando notícia verificada sobre: ${topic}`);

    // 1. Buscar notícia inicial
    const newsResponse = await fetchNewsWithGemini(topic);
    if (!newsResponse) return null;

    // 2. Buscar múltiplas fontes
    const sources = await fetchMultipleSources(topic);
    console.log(`📰 Fontes identificadas: ${sources.join(', ')}`);

    // 3. Gerar artigo completo
    const fullArticle = await generateFullArticle(
      newsResponse.title,
      newsResponse.summary,
      newsResponse.category,
      newsResponse.sentiment
    );

    // 4. Extrair dados críticos
    const criticalData = extractCriticalData(fullArticle);

    // 5. Validar dados críticos
    const validation = await validateCriticalData(criticalData);
    console.log(`✓ Validação: ${validation.valid ? 'OK' : 'Correções necessárias'}`);

    // 6. Fact-check completo
    const factCheck = await factCheckArticle(
      newsResponse.title,
      fullArticle,
      newsResponse.category
    );

    const enhancedResponse: EnhancedNewsResponse = {
      ...newsResponse,
      sources: sources,
      factChecked: factCheck.isValid && validation.valid,
      factCheckIssues: [...factCheck.issues, ...validation.corrections],
      lastVerified: new Date()
    };

    return enhancedResponse;

  } catch (error) {
    console.error('Erro no fetch com fact-check:', error);
    return null;
  }
}

/**
 * Gera artigo completo com disclaimer
 */
export async function generateFullArticleWithDisclaimer(
  title: string,
  summary: string,
  category: string,
  sentiment: string,
  sources: string[]
): Promise<string> {
  const baseArticle = await generateFullArticle(title, summary, category, sentiment);
  const disclaimer = generateDisclaimer(sources, new Date());

  return baseArticle + '\n' + disclaimer;
}
