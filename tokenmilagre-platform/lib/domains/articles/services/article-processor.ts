/**
 * Funções para processar conteúdo de artigos gerados
 * Seguindo regras da skill article-creation
 */

/**
 * Remove título H1 do início do conteúdo
 * REGRA: O título já aparece no header da página
 */
export function removeH1FromContent(content: string): string {
  // Remove H1 do início (# Título)
  return content.replace(/^#\s+[^\n]+\n+/, '');
}

/**
 * Remove seção de fontes/referências do final
 * REGRA: Fontes não devem aparecer no conteúdo final
 */
export function removeSourcesSection(content: string): string {
  // Padrões comuns de seções de fontes
  const patterns = [
    /\n##?\s*Fontes?:?\s*\n[\s\S]*$/i,
    /\n##?\s*Referências?:?\s*\n[\s\S]*$/i,
    /\n##?\s*Sources?:?\s*\n[\s\S]*$/i,
    /\n##?\s*References?:?\s*\n[\s\S]*$/i,
    /\n\[[\d\]]+.*$/gm, // Remove [1], [2], etc
  ];

  let processed = content;
  patterns.forEach(pattern => {
    processed = processed.replace(pattern, '');
  });

  return processed.trim();
}

/**
 * Remove nota de transparência do final
 * REGRA: Template adiciona automaticamente
 */
export function removeTransparencyNote(content: string): string {
  const patterns = [
    /\n##?\s*📊\s*Nota de Transparência[\s\S]*$/i,
    /\n##?\s*Nota de Transparência[\s\S]*$/i,
    /\n##?\s*Transparency Note[\s\S]*$/i,
  ];

  let processed = content;
  patterns.forEach(pattern => {
    processed = processed.replace(pattern, '');
  });

  return processed.trim();
}

/**
 * Garante que o conteúdo começa com ## (H2), não com parágrafo
 * REGRA: Para notícias, excerpt já aparece como resumo, content deve começar com seções
 */
export function ensureStartsWithH2(content: string): string {
  const trimmed = content.trim();

  // Se já começa com ##, está ok
  if (trimmed.startsWith('##')) {
    return content;
  }

  // Se começa com #, converter para ##
  if (trimmed.startsWith('#')) {
    return content.replace(/^#\s+/, '## ');
  }

  // Se começa com texto, adicionar seção genérica
  return `## Contexto\n\n${content}`;
}

/**
 * Processa conteúdo completo seguindo todas as regras
 */
export function processArticleContent(content: string, type: 'news' | 'educational'): string {
  let processed = content;

  // 1. Remove H1 do início
  processed = removeH1FromContent(processed);

  // 2. Remove fontes/referências
  processed = removeSourcesSection(processed);

  // 3. Remove nota de transparência
  processed = removeTransparencyNote(processed);

  // 4. Para notícias, garante início com H2
  if (type === 'news') {
    processed = ensureStartsWithH2(processed);
  }

  return processed.trim();
}

/**
 * Extrai excerpt/resumo do conteúdo gerado
 * Pega o primeiro parágrafo significativo
 */
export function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove markdown headers
  const withoutHeaders = content.replace(/^#+\s+.+$/gm, '');

  // Pega primeiro parágrafo não vazio
  const paragraphs = withoutHeaders
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 20);

  if (paragraphs.length === 0) return '';

  let excerpt = paragraphs[0];

  // Trunca se necessário
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength).trim() + '...';
  }

  return excerpt;
}

/**
 * Gera slug a partir do título
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-+|-+$/g, ''); // Remove hífens do início/fim
}

/**
 * Adiciona data ao slug (formato YYYYMMDD)
 */
export function slugWithDate(title: string): string {
  const baseSlug = titleToSlug(title);
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  return `${baseSlug}-${dateStr}`;
}

/**
 * Calcula tempo estimado de leitura
 * Baseado em 200 palavras por minuto
 */
export function calculateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
}

/**
 * Extrai e valida tags do conteúdo ou sugestões
 */
export function extractTags(content: string, suggestions: string[] = []): string[] {
  const tags = new Set<string>();

  // Adiciona sugestões fornecidas
  suggestions.forEach(tag => tags.add(tag.toLowerCase()));

  // Extrai palavras-chave do conteúdo (opcional)
  const keywords = content.match(/\*\*([^*]+)\*\*/g);
  if (keywords) {
    keywords.slice(0, 5).forEach(kw => {
      const clean = kw.replace(/\*\*/g, '').toLowerCase();
      tags.add(clean);
    });
  }

  return Array.from(tags).slice(0, 7); // Máximo 7 tags
}
