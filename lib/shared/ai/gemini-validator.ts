/**
 * Cliente Gemini para Validação de Artigos com Grounding
 * 
 * Usa Gemini 3 Flash com Google Search para fact-checking
 * de artigos gerados pela Perplexity.
 * 
 * @see https://ai.google.dev/gemini-api/docs/grounding
 */

// ============================================================================
// TYPES
// ============================================================================

export interface Source {
    url: string;
    title: string;
    snippet?: string;
}

export interface VerifiedClaim {
    claim: string;
    verified: boolean;
    confidence: number; // 0-100
    sources: Source[];
}

export interface FactCheckResult {
    score: number; // 0-100
    status: 'verified' | 'partially_verified' | 'unverified' | 'error';
    verifiedClaims: VerifiedClaim[];
    unverifiedClaims: string[];
    additionalSources: Source[];
    suggestions: string[];
    summary: string;
}

export interface ValidateArticleOptions {
    title: string;
    content: string;
    excerpt?: string;
    citations?: string[];
    articleType: 'news' | 'educational' | 'resource';
}

// ============================================================================
// CONSTANTS
// ============================================================================

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL_NAME = 'gemini-3-flash-preview';

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Valida artigo usando Gemini 3 Flash com Google Search Grounding
 */
export async function validateArticleContent(
    options: ValidateArticleOptions,
    apiKey: string
): Promise<FactCheckResult> {
    try {
        const { title, content, excerpt, citations, articleType } = options;

        console.log('[validateArticle] 🔍 Iniciando validação...');
        console.log('[validateArticle] Título:', title.substring(0, 50) + '...');

        // Construir prompt de fact-checking
        const prompt = buildFactCheckPrompt(title, content, excerpt, citations, articleType);

        // Chamar Gemini com Google Search grounding
        const response = await fetch(
            `${GEMINI_API_URL}/${MODEL_NAME}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ],
                    tools: [
                        {
                            google_search: {} // Habilita grounding com Google Search
                        }
                    ],
                    generationConfig: {
                        temperature: 0.3, // Baixa para mais precisão
                        topK: 20,
                        topP: 0.8,
                        maxOutputTokens: 4096,
                    }
                })
            }
        );

        console.log('[validateArticle] 📊 Status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[validateArticle] ❌ Erro:', errorData);
            throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown'}`);
        }

        const data = await response.json();

        // Extrair resposta e grounding metadata
        const textContent = data.candidates?.[0]?.content?.parts?.find(
            (part: any) => part.text
        )?.text;

        const groundingMetadata = data.candidates?.[0]?.groundingMetadata;

        console.log('[validateArticle] ✅ Resposta recebida');
        console.log('[validateArticle] Grounding sources:', groundingMetadata?.groundingChunks?.length || 0);

        // Parsear resultado
        return parseFactCheckResult(textContent, groundingMetadata);

    } catch (error: any) {
        console.error('[validateArticle] ❌❌❌ ERRO:', error);
        return {
            score: 0,
            status: 'error',
            verifiedClaims: [],
            unverifiedClaims: [],
            additionalSources: [],
            suggestions: [],
            summary: `Erro ao validar: ${error.message}`
        };
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Constrói prompt para fact-checking
 */
function buildFactCheckPrompt(
    title: string,
    content: string,
    excerpt?: string,
    citations?: string[],
    articleType?: string
): string {
    const citationsText = citations?.length
        ? `\n\n**Fontes já citadas no artigo:**\n${citations.map((c, i) => `${i + 1}. ${c}`).join('\n')}`
        : '';

    return `# TAREFA: Validação de Veracidade de Artigo

Você é um fact-checker especializado. Analise o artigo abaixo e valide a veracidade das informações usando pesquisa na web.

## ARTIGO PARA VALIDAR

**Tipo:** ${articleType || 'news'}
**Título:** ${title}
${excerpt ? `**Resumo:** ${excerpt}` : ''}

**Conteúdo:**
${content.substring(0, 8000)}
${citationsText}

## INSTRUÇÕES

1. **Identifique claims principais** - Extraia as 5-8 afirmações verificáveis mais importantes
2. **Verifique cada claim** - Use busca na web para confirmar ou refutar
3. **Atribua confiança** - Score de 0-100 para cada verificação
4. **Encontre fontes adicionais** - Liste fontes que corroboram ou contradizem
5. **Sugira correções** - Se encontrar erros ou informações desatualizadas

## FORMATO DE RESPOSTA (JSON)

Responda APENAS com JSON válido:

{
  "score": 85,
  "status": "verified",
  "summary": "Resumo de 1-2 linhas sobre a veracidade geral",
  "verifiedClaims": [
    {
      "claim": "Texto do claim verificado",
      "verified": true,
      "confidence": 95,
      "sources": [
        {"url": "https://...", "title": "Título da fonte", "snippet": "Trecho relevante"}
      ]
    }
  ],
  "unverifiedClaims": [
    "Claim que não pôde ser verificado"
  ],
  "additionalSources": [
    {"url": "https://...", "title": "Fonte adicional relevante"}
  ],
  "suggestions": [
    "Sugestão de correção ou melhoria"
  ]
}

**REGRAS:**
- score 80-100 = verified
- score 50-79 = partially_verified  
- score 0-49 = unverified
- Retorne APENAS o JSON, sem markdown code blocks`;
}

/**
 * Parseia resultado do fact-check
 */
function parseFactCheckResult(
    textContent: string | undefined,
    groundingMetadata: any
): FactCheckResult {
    // Default result
    const defaultResult: FactCheckResult = {
        score: 0,
        status: 'error',
        verifiedClaims: [],
        unverifiedClaims: [],
        additionalSources: [],
        suggestions: [],
        summary: 'Não foi possível processar a validação'
    };

    if (!textContent) {
        return defaultResult;
    }

    try {
        // Limpar e parsear JSON
        let cleanedText = textContent.trim();

        // Remover markdown code blocks se existirem
        if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```(?:json)?\\n?/, '').replace(/\\n?```$/, '').trim();
        }

        // Extrair JSON
        const firstBrace = cleanedText.indexOf('{');
        const lastBrace = cleanedText.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
            cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
        }

        const parsed = JSON.parse(cleanedText);

        // Adicionar fontes do grounding se disponíveis
        const groundingSources: Source[] = [];
        if (groundingMetadata?.groundingChunks) {
            for (const chunk of groundingMetadata.groundingChunks) {
                if (chunk.web?.uri) {
                    groundingSources.push({
                        url: chunk.web.uri,
                        title: chunk.web.title || 'Fonte verificada',
                        snippet: chunk.web.snippet
                    });
                }
            }
        }

        // Combinar fontes do grounding com as do resultado
        const allSources = [
            ...(parsed.additionalSources || []),
            ...groundingSources
        ];

        // Determinar status baseado no score
        let status: FactCheckResult['status'] = 'unverified';
        if (parsed.score >= 80) status = 'verified';
        else if (parsed.score >= 50) status = 'partially_verified';

        return {
            score: parsed.score || 0,
            status: parsed.status || status,
            verifiedClaims: parsed.verifiedClaims || [],
            unverifiedClaims: parsed.unverifiedClaims || [],
            additionalSources: allSources,
            suggestions: parsed.suggestions || [],
            summary: parsed.summary || 'Validação concluída'
        };

    } catch (parseError) {
        console.error('[parseFactCheckResult] Erro ao parsear:', parseError);
        console.error('[parseFactCheckResult] Texto recebido:', textContent.substring(0, 200));
        return defaultResult;
    }
}

/**
 * Calcula custo estimado da validação
 * Grounding com Google Search: $35/1000 queries
 */
export function estimateValidationCost(queriesCount: number = 1): number {
    return (queriesCount / 1000) * 35;
}
