import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface Claim {
  text: string;
  category: 'fact' | 'opinion' | 'prediction';
  importance: 'high' | 'medium' | 'low';
  searchQuery: string; // Query otimizada para busca
}

export interface ClaimsExtractionResult {
  claims: Claim[];
  totalClaims: number;
  factualClaims: number;
}

/**
 * Extrai claims verificáveis de um artigo usando Gemini CLI
 */
export async function extractClaims(articleContent: string, articleTitle: string): Promise<ClaimsExtractionResult> {
  try {
    const prompt = `Analise o seguinte artigo sobre criptomoedas e extraia APENAS afirmações FACTUAIS que podem ser verificadas.

TÍTULO: ${articleTitle}

CONTEÚDO:
${articleContent}

INSTRUÇÕES:
1. Identifique afirmações factuais (preços, datas, eventos, estatísticas, anúncios oficiais)
2. Ignore opiniões, previsões incertas e análises subjetivas
3. Priorize informações críticas (HIGH) sobre secundárias (LOW)
4. Para cada claim, crie uma query de busca otimizada

RESPONDA NO FORMATO JSON EXATO (sem markdown, sem explicações):
{
  "claims": [
    {
      "text": "Bitcoin atingiu $100k em 15 de março de 2024",
      "category": "fact",
      "importance": "high",
      "searchQuery": "Bitcoin price $100k March 2024"
    }
  ]
}

IMPORTANTE: Retorne apenas o JSON puro, sem \`\`\`json ou qualquer texto adicional.`;

    // Usar Gemini CLI para extrair claims
    const { stdout } = await execAsync(`gemini "${prompt.replace(/"/g, '\\"')}"`);

    // Limpar output (remover possíveis markdown wrappers)
    let cleanOutput = stdout.trim();
    cleanOutput = cleanOutput.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');

    const result = JSON.parse(cleanOutput);

    const claims: Claim[] = result.claims || [];
    const factualClaims = claims.filter(c => c.category === 'fact');

    return {
      claims: factualClaims, // Retorna apenas claims factuais
      totalClaims: claims.length,
      factualClaims: factualClaims.length
    };
  } catch (error) {
    console.error('Erro ao extrair claims:', error);

    // Fallback: retornar estrutura vazia em caso de erro
    return {
      claims: [],
      totalClaims: 0,
      factualClaims: 0
    };
  }
}

/**
 * Valida se um artigo tem claims suficientes para fact-checking
 */
export function hasEnoughClaims(result: ClaimsExtractionResult): boolean {
  return result.factualClaims > 0;
}
