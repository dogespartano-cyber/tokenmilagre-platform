/**
 * Utilitários para manipulação e formatação de conteúdo
 */

/**
 * Remove referências numéricas do tipo [1], [2], [3] do conteúdo
 *
 * IMPORTANTE: Usa [ \t]{2,} em vez de \s{2,} para preservar quebras de linha (\n)
 * Consultar: .claude/skills/troubleshooting/SKILL.md - Problema 5
 */
export function cleanReferences(text: string): string {
  return text
    .replace(/\[\d+\]/g, '') // Remove [1], [2], etc
    .replace(/(?:\[\d+\])+/g, '') // Remove sequências [1][2][3]
    .replace(/\[\s*\d+\s*\]/g, '') // Remove [ 1 ], [ 2 ] com espaços
    .replace(/[ \t]{2,}/g, ' ') // ✅ Remove múltiplos espaços/tabs (preserva \n)
    .trim();
}

/**
 * Calcula tempo de leitura estimado baseado no conteúdo
 *
 * @param content - Texto em markdown ou plain text
 * @param wordsPerMinute - Palavras por minuto (padrão: 200)
 * @returns Tempo em minutos
 */
export function calculateReadTime(content: string, wordsPerMinute: number = 200): number {
  // Remove markdown syntax para contar apenas palavras reais
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove imagens
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Mantém apenas texto de links
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .trim();

  const words = plainText.split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return minutes > 0 ? minutes : 1; // Mínimo 1 minuto
}

/**
 * Trunca texto para um tamanho máximo, adicionando reticências
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text || text.length <= maxLength) return text;

  // Trunca no último espaço antes do limite
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace).trim() + '...';
  }

  return truncated.trim() + '...';
}

/**
 * Converte texto para slug URL-friendly
 *
 * @param text - Texto a ser convertido
 * @returns Slug em lowercase, sem acentos, com hífens
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-+|-+$/g, '') // Remove hífens do início e fim
    .trim();
}

/**
 * Gera slug com timestamp para garantir unicidade
 */
export function slugifyWithDate(text: string): string {
  const baseSlug = slugify(text);
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${baseSlug}-${year}${month}${day}`;
}

/**
 * Extrai primeiros N caracteres de texto como excerpt
 */
export function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove markdown e pega apenas texto
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[#*_~`]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  return truncateText(plainText, maxLength);
}

/**
 * Conta número de palavras no texto
 */
export function countWords(text: string): number {
  const plainText = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[#*_~`]/g, '')
    .trim();

  return plainText.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Formata número de visualizações de forma amigável
 * Ex: 1234 => "1,2k", 1234567 => "1,2M"
 */
export function formatViews(views: number): string {
  if (views < 1000) return views.toString();
  if (views < 1000000) return `${(views / 1000).toFixed(1).replace('.0', '')}k`;
  return `${(views / 1000000).toFixed(1).replace('.0', '')}M`;
}

/**
 * Remove H1 do início do conteúdo markdown
 * (Template já renderiza H1 a partir do título)
 */
export function removeH1FromContent(content: string): string {
  return content.replace(/^#\s+.+\n+/m, '').trim();
}

/**
 * Remove seção de fontes/referências do final do conteúdo
 * (Template processa fontes automaticamente)
 */
export function removeSourcesSection(content: string): string {
  // Remove seções como "## Fontes", "## Referências", etc
  return content
    .replace(/##\s+(Fontes|Referências|Sources|References)\s*\n[\s\S]*$/im, '')
    .trim();
}

/**
 * Valida se conteúdo tem estrutura mínima adequada
 */
export function validateContentStructure(content: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Verifica tamanho mínimo
  if (content.length < 500) {
    errors.push('Conteúdo muito curto (mínimo 500 caracteres)');
  }

  // Verifica se tem H1 no início (não deveria ter)
  if (/^#\s+/.test(content)) {
    warnings.push('Conteúdo inicia com H1 (deveria ser removido)');
  }

  // Verifica se tem seções H2
  const h2Count = (content.match(/^##\s+/gm) || []).length;
  if (h2Count < 2) {
    warnings.push('Conteúdo tem poucas seções H2 (recomendado: 4-7)');
  } else if (h2Count > 10) {
    warnings.push('Conteúdo tem muitas seções H2 (recomendado: 4-7)');
  }

  // Verifica se tem referências numéricas
  if (/\[\d+\]/.test(content)) {
    warnings.push('Conteúdo contém referências numéricas [1][2] (devem ser removidas)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Limpa e prepara conteúdo para publicação
 */
export function prepareContentForPublication(content: string): string {
  let prepared = content;

  // Remove H1 do início
  prepared = removeH1FromContent(prepared);

  // Remove seção de fontes
  prepared = removeSourcesSection(prepared);

  // Remove referências numéricas
  prepared = cleanReferences(prepared);

  // Normaliza quebras de linha (máximo 2 consecutivas)
  prepared = prepared.replace(/\n{3,}/g, '\n\n');

  return prepared.trim();
}
