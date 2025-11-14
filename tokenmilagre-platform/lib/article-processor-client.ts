/**
 * Processamento local de artigos (client-side)
 * Substitui processamento Gemini por funções JS puras
 *
 * OBJETIVO: Processar artigos do Perplexity instantaneamente sem custos de API
 */

/**
 * Remove referências numéricas do texto
 * Exemplos: [1], [2], [3], [1][5], [10], etc
 * IMPORTANTE: Preserva quebras de linha do markdown
 */
export function cleanReferences(text: string): string {
  if (!text) return '';

  return text
    // Remove referências simples [1], [2], etc
    .replace(/\[\d+\]/g, '')
    // Remove múltiplas referências consecutivas [1][2][3]
    .replace(/(?:\[\d+\])+/g, '')
    // Remove referências com espaços [ 1 ], [ 2 ]
    .replace(/\[\s*\d+\s*\]/g, '')
    // Limpa espaços HORIZONTAIS duplos (mas NÃO quebras de linha)
    // Usa [ \t] em vez de \s para não pegar \n
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/**
 * Remove colchetes com instruções dos títulos
 * Exemplos:
 * "## [Fato Central] Bitcoin atinge..." → "## Bitcoin atinge..."
 * "### [Contexto] Histórico..." → "### Histórico..."
 */
export function cleanBracketTitles(text: string): string {
  if (!text) return '';

  return text
    // Remove [Texto] de títulos H2
    .replace(/^(##\s*)\[[\w\s]+\]\s*/gm, '$1')
    // Remove [Texto] de títulos H3
    .replace(/^(###\s*)\[[\w\s]+\]\s*/gm, '$1')
    // Remove [Texto] de títulos H4
    .replace(/^(####\s*)\[[\w\s]+\]\s*/gm, '$1')
    .trim();
}

/**
 * Remove seção de fontes/referências do final do artigo
 */
export function removeSourcesSection(text: string): string {
  if (!text) return '';

  const patterns = [
    // Seções em português
    /\n##?\s*Fontes?:?\s*\n[\s\S]*$/i,
    /\n##?\s*Referências?:?\s*\n[\s\S]*$/i,
    /\n##?\s*Bibliografia:?\s*\n[\s\S]*$/i,
    // Seções em inglês
    /\n##?\s*Sources?:?\s*\n[\s\S]*$/i,
    /\n##?\s*References?:?\s*\n[\s\S]*$/i,
  ];

  let processed = text;
  patterns.forEach(pattern => {
    processed = processed.replace(pattern, '');
  });

  return processed.trim();
}

/**
 * Gera slug a partir do título
 */
export function generateSlug(title: string, addDate: boolean = false): string {
  if (!title) return '';

  let slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-+|-+$/g, ''); // Remove hífens do início/fim

  // Adiciona data se solicitado (formato YYYYMMDD)
  if (addDate) {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    slug = `${slug}-${dateStr}`;
  }

  return slug;
}

/**
 * Calcula tempo de leitura baseado em palavras
 * Assume 250 palavras por minuto
 */
export function calculateReadTime(content: string): string {
  if (!content) return '1 min';

  const words = content.split(/\s+/).filter(w => w.length > 0).length;
  const minutes = Math.ceil(words / 250);

  return `${minutes} min`;
}

/**
 * Converte gradiente Tailwind para CSS linear-gradient
 * Usado apenas para Resources
 */
export function convertTailwindGradient(gradient: string): string {
  if (!gradient) return 'linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)'; // Default

  // Se já é CSS, retornar
  if (gradient.includes('linear-gradient')) return gradient;

  // Mapeamento Tailwind → Hex
  const tailwindColors: Record<string, string> = {
    'blue-400': '#60A5FA',
    'blue-500': '#3B82F6',
    'blue-600': '#2563EB',
    'purple-400': '#C084FC',
    'purple-500': '#A855F7',
    'purple-600': '#9333EA',
    'indigo-400': '#818CF8',
    'indigo-500': '#6366F1',
    'indigo-600': '#4F46E5',
    'violet-400': '#A78BFA',
    'violet-500': '#8B5CF6',
    'violet-600': '#7C3AED',
    'pink-400': '#F472B6',
    'pink-500': '#EC4899',
    'pink-600': '#DB2777',
    'green-400': '#4ADE80',
    'green-500': '#22C55E',
    'green-600': '#16A34A',
    'orange-400': '#FB923C',
    'orange-500': '#F97316',
    'orange-600': '#EA580C',
    'red-400': '#F87171',
    'red-500': '#EF4444',
    'red-600': '#DC2626',
  };

  // Extrair "from-X to-Y"
  const match = gradient.match(/from-(\S+)\s+to-(\S+)/);
  if (match) {
    const fromColor = tailwindColors[match[1]] || '#3B82F6';
    const toColor = tailwindColors[match[2]] || '#9333EA';
    return `linear-gradient(135deg, ${fromColor} 0%, ${toColor} 100%)`;
  }

  // Fallback
  return 'linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)';
}

/**
 * Normaliza campos de Resources (estruturas aninhadas → flat)
 */
export function normalizeResourceFields(resource: any): any {
  const normalized = { ...resource };

  // Mapear hero aninhado
  if (resource.hero && typeof resource.hero === 'object') {
    normalized.heroDescription = resource.hero.description || resource.hero;
    normalized.heroTitle = resource.name;
    if (!normalized.heroGradient) {
      normalized.heroGradient = 'linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)';
    }
    delete normalized.hero;
  }

  // Mapear whyGood aninhado
  if (resource.whyGood && typeof resource.whyGood === 'object') {
    normalized.whyGoodTitle = resource.whyGood.title || `Por que ${resource.name}?`;
    normalized.whyGoodContent = resource.whyGood.content || [];
    delete normalized.whyGood;
  }

  // Mapear howToStart aninhado
  if (resource.howToStart && typeof resource.howToStart === 'object') {
    normalized.howToStartTitle = resource.howToStart.title || 'Como Começar';
    normalized.howToStartSteps = resource.howToStart.steps || [];
    delete normalized.howToStart;
  }

  // Mapear prosAndCons aninhado
  if (resource.prosAndCons && typeof resource.prosAndCons === 'object') {
    normalized.pros = resource.prosAndCons.pros || [];
    normalized.cons = resource.prosAndCons.cons || [];
    delete normalized.prosAndCons;
  }

  // Garantir arrays vazios para campos opcionais
  normalized.faq = resource.faq || [];
  normalized.securityTips = resource.securityTips || [];
  normalized.features = resource.features || [];
  normalized.relatedResources = resource.relatedResources || [];

  // Gerar slug se não existir
  if (!normalized.slug && resource.name) {
    normalized.slug = generateSlug(resource.name);
  }

  // Converter gradiente se necessário
  if (normalized.heroGradient) {
    normalized.heroGradient = convertTailwindGradient(normalized.heroGradient);
  }

  return normalized;
}

/**
 * Garante que o conteúdo tenha quebras de linha adequadas para Markdown
 * IMPORTANTE: Preserva listas, blockquotes e outros elementos markdown
 */
function ensureProperLineBreaks(content: string): string {
  if (!content) return '';

  let processed = content;

  // DEBUG
  if (typeof console !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔧 [ensureProperLineBreaks] Antes:', processed.substring(0, 300));
  }

  // 1. Normalizar quebras múltiplas (máximo 2)
  processed = processed.replace(/\n{3,}/g, '\n\n');

  // 2. Garantir espaço duplo antes de títulos (se não houver)
  processed = processed.replace(/([^\n])\n(#{2,6}\s+)/g, '$1\n\n$2');

  // 3. Garantir espaço duplo após títulos (se não houver)
  processed = processed.replace(/(#{2,6}\s+.+)\n([^\n])/g, '$1\n\n$2');

  // DEBUG
  if (typeof console !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔧 [ensureProperLineBreaks] Depois:', processed.substring(0, 300));
  }

  return processed.trim();
}

/**
 * Processa artigo completo localmente (substitui Gemini)
 *
 * ENTRADA: Artigo JSON bruto do Perplexity
 * SAÍDA: Artigo limpo e pronto para publicação
 */
export function processArticleLocally(article: any, articleType: 'news' | 'educational' | 'resource'): any {
  // 1. Clonar artigo
  const processed = { ...article };

  if (typeof console !== 'undefined') {
    console.log('🔧 [processArticleLocally] Processando artigo:', articleType);
    console.log('📄 Content original (primeiros 500 chars):', processed.content?.substring(0, 500));
  }

  // 2. Processar conteúdo (news/educational)
  if (articleType !== 'resource' && processed.content) {
    // 🔴 CRÍTICO: Converter \n literal para quebra real (caso o Perplexity retorne assim)
    if (processed.content.includes('\\n')) {
      processed.content = processed.content.replace(/\\n/g, '\n');
      if (typeof console !== 'undefined') {
        console.log('⚠️ Convertido \\n literal para quebra real');
      }
    }

    // Limpar referências [1][2][3]
    processed.content = cleanReferences(processed.content);
    if (typeof console !== 'undefined') console.log('✅ Referências removidas');

    // Limpar colchetes em títulos
    processed.content = cleanBracketTitles(processed.content);
    if (typeof console !== 'undefined') console.log('✅ Colchetes em títulos removidos');

    // Remover seção de fontes
    processed.content = removeSourcesSection(processed.content);
    if (typeof console !== 'undefined') console.log('✅ Seção de fontes removida');

    // Garantir formatação adequada
    processed.content = ensureProperLineBreaks(processed.content);
    if (typeof console !== 'undefined') console.log('✅ Quebras de linha ajustadas');

    if (typeof console !== 'undefined') {
      console.log('📄 Content processado (primeiros 500 chars):', processed.content?.substring(0, 500));
    }
  }

  // 3. Gerar slug se não existir
  if (!processed.slug && processed.title) {
    processed.slug = generateSlug(processed.title, articleType === 'news');
    console.log('✅ Slug gerado:', processed.slug);
  }

  // 4. Calcular readTime se não existir
  if (!processed.readTime && processed.content) {
    processed.readTime = calculateReadTime(processed.content);
    console.log('✅ ReadTime calculado:', processed.readTime);
  }

  // 5. Processar Resources (normalizar campos)
  if (articleType === 'resource') {
    return normalizeResourceFields(processed);
  }

  // 6. Mapear campos específicos por tipo
  if (articleType === 'educational' && processed.description) {
    // Artigos educacionais: description → excerpt (campo do banco)
    processed.excerpt = processed.description;
    delete processed.description;
  }

  console.log('✅ Processamento local concluído');
  return processed;
}

/**
 * Valida se artigo processado tem campos obrigatórios
 */
export function validateProcessedArticle(article: any, articleType: 'news' | 'educational' | 'resource'): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validação de slug (comum a todos)
  if (!article.slug) errors.push('Slug ausente');

  // Campos específicos por tipo
  if (articleType === 'news') {
    if (!article.title) errors.push('Título ausente');
    if (!article.excerpt) errors.push('Excerpt ausente');
    if (!article.content) errors.push('Conteúdo ausente');
    if (!article.category) errors.push('Categoria ausente');
    if (!article.sentiment) errors.push('Sentimento ausente');
  } else if (articleType === 'educational') {
    if (!article.title) errors.push('Título ausente');
    if (!article.excerpt) errors.push('Excerpt ausente');
    if (!article.content) errors.push('Conteúdo ausente');
    if (!article.category) errors.push('Categoria ausente');
    if (!article.level) errors.push('Nível ausente');
  } else if (articleType === 'resource') {
    if (!article.name) errors.push('Nome ausente');
    if (!article.category) errors.push('Categoria ausente');
    if (!article.officialUrl) errors.push('URL oficial ausente');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
