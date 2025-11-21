/**
 * Constants and Enums for Article Creation
 * Centralizes hardcoded strings, magic numbers, and configuration
 */

// ============================================================================
// Types
// ============================================================================

export type ArticleType = 'news' | 'educational' | 'resource';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type Level = 'iniciante' | 'intermediario' | 'avancado';

// ============================================================================
// Article Types Configuration
// ============================================================================

export const ARTICLE_TYPE_CONFIG = {
  news: {
    icon: 'faNewspaper',
    label: 'Notícia',
    description: 'Agora você pode pedir para criar uma notícia estruturada com padrão jornalístico completo.',
    ariaLabel: 'Criar notícia'
  },
  educational: {
    icon: 'faGraduationCap',
    label: 'Educação',
    description: 'Agora você pode pedir para criar artigos educacionais (iniciante, intermediário ou avançado).',
    ariaLabel: 'Criar artigo educacional'
  },
  resource: {
    icon: 'faBox',
    label: 'Recurso',
    description: 'Agora você pode pedir para criar guias completos de ferramentas e serviços.',
    ariaLabel: 'Criar recurso'
  }
} as const;

// ============================================================================
// Categories
// ============================================================================

export const NEWS_CATEGORIES = [
  'bitcoin',
  'ethereum',
  'defi',
  'politica',
  'nfts',
  'altcoins',
  'regulacao',
  'adocao',
  'tecnologia'
] as const;

export const EDUCATIONAL_CATEGORIES = [
  'blockchain',
  'trading',
  'defi',
  'nfts',
  'seguranca',
  'desenvolvimento',
  'wallets',
  'exchanges'
] as const;

// Alinhado com backend (lib/schemas/resource-schemas.ts)
// Backend é a fonte da verdade - usar exatamente os mesmos valores
export const RESOURCE_CATEGORIES = [
  'wallets',      // Carteiras cripto
  'exchanges',    // Corretoras
  'browsers',     // Navegadores Web3
  'defi',         // Protocolos DeFi
  'explorers',    // Exploradores de blockchain
  'tools'         // Ferramentas (analytics, portfolio-tracker, development-tools)
] as const;

export const CATEGORIES_BY_TYPE = {
  news: NEWS_CATEGORIES,
  educational: EDUCATIONAL_CATEGORIES,
  resource: RESOURCE_CATEGORIES
} as const;

// ============================================================================
// Sentiments and Levels
// ============================================================================

export const SENTIMENTS: Sentiment[] = ['positive', 'neutral', 'negative'];

export const LEVELS: Level[] = ['iniciante', 'intermediario', 'avancado'];

export const LEVEL_LABELS = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado'
} as const;

// ============================================================================
// Validation Rules
// ============================================================================

export const VALIDATION_RULES = {
  title: {
    minLength: 10,
    maxLength: 200
  },
  excerpt: {
    minLength: 100,
    maxLength: 300
  },
  content: {
    minLength: 500
  },
  tags: {
    min: 3,
    max: 8
  },
  slug: {
    pattern: /^[a-z0-9-]+$/
  }
} as const;

// ============================================================================
// UI Constants
// ============================================================================

export const CHAT_CONFIG = {
  // Auto-scroll threshold in pixels
  scrollThreshold: 100,

  // Max height for chat container
  maxHeight: '500px',

  // Debounce delay for streaming updates (ms)
  streamingDebounce: 150,

  // Words per minute for read time calculation
  wordsPerMinute: 250
} as const;

export const ANIMATION_DELAYS = {
  bounce1: '0ms',
  bounce2: '150ms',
  bounce3: '300ms',
  copiedFeedback: 2000 // ms
} as const;

// ============================================================================
// Prompt Suggestions
// ============================================================================

export interface PromptSuggestion {
  emoji: string;
  label: string;
  prompt: string;
}

export const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  {
    emoji: '📰',
    label: 'Top 10 notícias cripto hoje',
    prompt: 'Liste as 10 notícias mais pesquisadas hoje sobre o mercado cripto'
  },
  {
    emoji: '📊',
    label: 'Análise de sentimento do mercado',
    prompt: 'Faça uma análise do sentimento sobre o mercado cripto no dia de hoje'
  },
  {
    emoji: '🔥',
    label: 'Tendências DeFi esta semana',
    prompt: 'Quais são as principais tendências em DeFi esta semana?'
  },
  {
    emoji: '💰',
    label: 'Bitcoin vs Ethereum',
    prompt: 'Comparar Bitcoin vs Ethereum: fundamentos e diferenças técnicas'
  },
  {
    emoji: '🚀',
    label: 'Explicar staking para iniciantes',
    prompt: 'Explicar o que é staking para iniciantes'
  },
  {
    emoji: '💎',
    label: 'Melhores altcoins 2025',
    prompt: 'Quais são as melhores altcoins para investir em 2025?'
  },
  {
    emoji: '📈',
    label: 'Análise técnica Bitcoin',
    prompt: 'Análise técnica do Bitcoin: níveis de suporte e resistência'
  },
  {
    emoji: '🏦',
    label: 'ETFs de Bitcoin explicado',
    prompt: 'O que são ETFs de Bitcoin e como funcionam?'
  },
  {
    emoji: '⚡',
    label: 'Layer 2 no Ethereum',
    prompt: 'Principais projetos de Layer 2 no Ethereum'
  },
  {
    emoji: '🛡️',
    label: 'Identificar golpes cripto',
    prompt: 'Como identificar golpes e scams no mercado cripto'
  },
  {
    emoji: '⚖️',
    label: 'Regulação cripto nos EUA',
    prompt: 'Impacto da regulação cripto nos Estados Unidos'
  },
  {
    emoji: '🎨',
    label: 'NFTs e casos de uso',
    prompt: 'Explicar o que são NFTs e seus casos de uso'
  }
];

// ============================================================================
// Messages
// ============================================================================

export const MESSAGES = {
  chat: {
    welcome: {
      withType: 'Pronto para criar conteúdo!',
      withoutType: 'Olá! Como posso ajudar?'
    },
    description: {
      withType: 'Descreva o que você quer criar e eu vou gerar o artigo completo.',
      withoutType: 'Pergunte sobre análises, notícias recentes ou qualquer tema sobre criptomoedas.'
    },
    modeInfo: {
      free: '💬 <strong>Modo Conversa Livre:</strong> Pergunte sobre análises, notícias recentes, conceitos técnicos ou qualquer coisa sobre cripto. Selecione um tipo acima para ativar o modo de criação de artigos.'
    },
    suggestions: '💡 Sugestões rápidas de pesquisa:'
  },

  article: {
    generated: (title: string, slug: string, readTime: string, citationsCount: number) =>
      `✨ **Artigo gerado e processado!**\n\n✅ Título: ${title || 'Sem título'}\n✅ Slug: ${slug || 'sem-slug'}\n✅ Tempo de leitura: ${readTime || '1 min'}${citationsCount > 0 ? `\n✅ Fontes: ${citationsCount} citações encontradas` : `\n⚠️ Fontes: Nenhuma citação retornada pela API`}\n\nO artigo está pronto para publicação! Você pode:\n- **Publicar agora** (recomendado)\n- **Refinar com Gemini** (opcional)\n- **Criar capa com IA** (experimental)`,

    processing: '✨ **Refinando artigo com Gemini...**\n\n1. Melhorando estrutura e fluidez\n2. Otimizando títulos e formatação\n3. Validando qualidade\n\nAguarde alguns segundos...',

    refined: '✅ **Artigo refinado com Gemini!**\n\nO conteúdo foi otimizado e está pronto para publicação.',

    refinedManual: '✅ Artigo refinado com sucesso!',

    coverGenerated: '🎨 Capa gerada com sucesso!',

    validationWarning: (errors: string[]) =>
      `⚠️ Artigo com erros de validação: ${errors.join(', ')}`
  },

  errors: {
    perplexity: 'Erro ao chamar Perplexity',
    gemini: 'Erro ao processar com Gemini',
    refine: (error: string) => `❌ Erro ao refinar: ${error}`,
    cover: (error: string) => `❌ Erro ao gerar capa: ${error}`,
    publish: (error: string) => `Erro ao publicar: ${error}`,
    processArticle: (error: string) => `❌ Erro ao processar artigo: ${error}\n\nPor favor, tente novamente.`,
    generic: (error: string) => `❌ Erro: ${error}`
  }
} as const;

// ============================================================================
// API Endpoints
// ============================================================================

export const API_ENDPOINTS = {
  chatPerplexity: '/api/chat-perplexity',
  processGemini: '/api/process-gemini',
  refineArticle: '/api/refine-article',
  regenerateCover: '/api/regenerate-cover',
  articles: '/api/articles',
  resources: '/api/resources'
} as const;

// ============================================================================
// Routes
// ============================================================================

export const ROUTES = {
  dashboard: '/dashboard',
  newsArticle: (slug: string) => `/dashboard/noticias/${slug}`,
  educationalArticle: (slug: string) => `/educacao/${slug}`,
  resource: (slug: string) => `/recursos/${slug}`
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

export function getArticleRoute(type: ArticleType, slug: string): string {
  switch (type) {
    case 'news':
      return ROUTES.newsArticle(slug);
    case 'educational':
      return ROUTES.educationalArticle(slug);
    case 'resource':
      return ROUTES.resource(slug);
    default:
      return ROUTES.dashboard;
  }
}

export function getApiEndpoint(type: ArticleType): string {
  return type === 'resource' ? API_ENDPOINTS.resources : API_ENDPOINTS.articles;
}

export function isValidCategory(type: ArticleType, category: string): boolean {
  const categories = CATEGORIES_BY_TYPE[type];
  return (categories as unknown as string[]).indexOf(category) !== -1;
}

export function isValidSentiment(sentiment: string): sentiment is Sentiment {
  return (SENTIMENTS as unknown as string[]).indexOf(sentiment) !== -1;
}

export function isValidLevel(level: string): level is Level {
  return (LEVELS as unknown as string[]).indexOf(level) !== -1;
}

// ============================================================================
// Category Normalization & Fallback
// ============================================================================

/**
 * Mapeia categorias genéricas da IA para categorias válidas do sistema
 * Usado para blindar contra erros de validação quando a IA sugere categorias inválidas
 */
const CATEGORY_FALLBACK_MAP: Record<string, { news: string; educational: string }> = {
  // Economia e mercado
  'economia': { news: 'bitcoin', educational: 'trading' },
  'mercado': { news: 'bitcoin', educational: 'trading' },
  'investimentos': { news: 'bitcoin', educational: 'trading' },
  'financas': { news: 'defi', educational: 'defi' },

  // Tecnologia
  'tecnologia': { news: 'tecnologia', educational: 'blockchain' },
  'tech': { news: 'tecnologia', educational: 'blockchain' },
  'inovacao': { news: 'tecnologia', educational: 'blockchain' },

  // Dicas e guias
  'dicas': { news: 'adocao', educational: 'seguranca' },
  'guias': { news: 'adocao', educational: 'wallets' },
  'tutorial': { news: 'adocao', educational: 'desenvolvimento' },
  'iniciantes': { news: 'adocao', educational: 'wallets' },

  // Segurança
  'seguranca': { news: 'regulacao', educational: 'seguranca' },
  'protecao': { news: 'regulacao', educational: 'seguranca' },
  'golpes': { news: 'regulacao', educational: 'seguranca' },
  'scams': { news: 'regulacao', educational: 'seguranca' },

  // Política e regulação
  'politica': { news: 'politica', educational: 'blockchain' },
  'regulacao': { news: 'regulacao', educational: 'blockchain' },
  'governo': { news: 'politica', educational: 'blockchain' },

  // Criptomoedas específicas
  'btc': { news: 'bitcoin', educational: 'trading' },
  'eth': { news: 'ethereum', educational: 'blockchain' },
  'cripto': { news: 'altcoins', educational: 'trading' },
  'criptomoedas': { news: 'altcoins', educational: 'trading' },
  'moedas': { news: 'altcoins', educational: 'trading' },

  // DeFi e NFTs
  'defi': { news: 'defi', educational: 'defi' },
  'nft': { news: 'nfts', educational: 'nfts' },
  'nfts': { news: 'nfts', educational: 'nfts' },

  // Análise
  'analise': { news: 'bitcoin', educational: 'trading' },
  'previsoes': { news: 'bitcoin', educational: 'trading' },
  'tendencias': { news: 'altcoins', educational: 'trading' },
};

/**
 * Normaliza categoria da IA para uma categoria válida do sistema
 * Se a categoria for inválida, retorna um fallback seguro baseado no tipo de artigo
 *
 * @param category - Categoria sugerida pela IA
 * @param type - Tipo de artigo (news ou educational)
 * @returns Categoria válida garantida + flag indicando se houve fallback
 */
export function normalizeCategoryWithFallback(
  category: string | undefined,
  type: 'news' | 'educational'
): { category: string; hadFallback: boolean } {
  if (!category) {
    return {
      category: type === 'news' ? 'tecnologia' : 'blockchain',
      hadFallback: true
    };
  }

  const normalized = category.toLowerCase().trim();

  // Verificar se já é uma categoria válida
  if (isValidCategory(type, normalized)) {
    return { category: normalized, hadFallback: false };
  }

  // Tentar encontrar no mapa de fallback
  const fallbackEntry = CATEGORY_FALLBACK_MAP[normalized];
  if (fallbackEntry) {
    return {
      category: fallbackEntry[type],
      hadFallback: true
    };
  }

  // Fallback final: categoria padrão segura
  const defaultCategory = type === 'news' ? 'tecnologia' : 'blockchain';

  return {
    category: defaultCategory,
    hadFallback: true
  };
}
