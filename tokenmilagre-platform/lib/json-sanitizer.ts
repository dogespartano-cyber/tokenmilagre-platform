/**
 * JSON Sanitizer
 * Utilitário para limpar e parsear JSON que pode conter caracteres de controle inválidos
 */

/**
 * Sanitiza string JSON removendo quebras de linha literais e caracteres de controle
 */
export function sanitizeJSON(jsonString: string): string {
  return jsonString
    .replace(/\r\n/g, ' ')  // Windows line breaks
    .replace(/\n/g, ' ')    // Unix line breaks
    .replace(/\r/g, ' ')    // Old Mac line breaks
    .replace(/\t/g, ' ')    // Tabs por espaços
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')  // Remove caracteres de controle ASCII
    .trim();
}

/**
 * Extrai JSON de uma string que pode conter markdown code blocks ou texto adicional
 */
export function extractJSON(text: string): string | null {
  // Estratégia 1: Markdown code blocks
  let jsonMatch = text.match(/```json\n?([\s\S]*?)```/);
  if (jsonMatch) {
    return jsonMatch[1];
  }

  // Estratégia 2: Extrair do primeiro { ao último }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1);
  }

  return null;
}

/**
 * Parse JSON com sanitização automática
 * Retorna objeto parseado ou null se falhar
 */
export function parseJSONSafely<T = any>(text: string): T | null {
  try {
    // Tentar extrair JSON
    const extracted = extractJSON(text);
    if (!extracted) {
      // Se não encontrar JSON, tentar parsear direto
      return JSON.parse(text);
    }

    // Sanitizar e parsear
    const sanitized = sanitizeJSON(extracted);
    return JSON.parse(sanitized);
  } catch (error) {
    console.error('Erro ao parsear JSON:', error);
    return null;
  }
}

/**
 * Parse JSON com múltiplas tentativas (robusto)
 * Retorna objeto parseado ou lança erro com mensagem clara
 */
export function parseJSONRobust<T = any>(text: string, context?: string): T {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev && context) {
    console.log(`🔍 [${context}] Tentando parsear JSON...`);
  }

  // Tentativa 1: Parse direto
  try {
    const result = JSON.parse(text);
    if (isDev && context) console.log(`✅ [${context}] Parse direto bem-sucedido`);
    return result;
  } catch (e) {
    if (isDev && context) console.log(`❌ [${context}] Parse direto falhou, tentando extrair...`);
  }

  // Tentativa 2: Extrair e sanitizar
  try {
    const extracted = extractJSON(text);
    if (!extracted) {
      throw new Error('Nenhum JSON encontrado no texto');
    }

    const sanitized = sanitizeJSON(extracted);
    if (isDev && context) {
      console.log(`🧹 [${context}] JSON sanitizado (primeiros 200 chars):`, sanitized.substring(0, 200));
    }

    const result = JSON.parse(sanitized);
    if (isDev && context) console.log(`✅ [${context}] Parse após sanitização bem-sucedido`);
    return result;
  } catch (e) {
    if (isDev && context) console.error(`❌ [${context}] Todas as tentativas falharam:`, e);
    throw new Error(`Falha ao parsear JSON${context ? ` (${context})` : ''}: ${e instanceof Error ? e.message : 'erro desconhecido'}`);
  }
}
