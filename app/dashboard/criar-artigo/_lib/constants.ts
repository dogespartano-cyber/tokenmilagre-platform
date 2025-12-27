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
  // Criptomoedas principais
  'bitcoin',
  'ethereum',
  'solana',
  'altcoins',

  // Setores/Verticais
  'defi',
  'nfts',
  'stablecoins',
  'memecoins',
  'layer2',
  'gaming',
  'metaverse',
  'dao',
  'web3',
  'ai',
  'privacidade',

  // Infraestrutura e operações
  'exchanges',
  'mining',
  'staking',
  'airdrops',
  'derivativos',
  'hacks',

  // Institucional e macro
  'institucional',
  'regulacao',
  'politica',
  'cbdc',
  'macroeconomia',

  // Geral
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
    minLength: 50,   // Flexível para permitir resumos concisos
    maxLength: 160   // SEO optimal (Google trunca em ~155-160)
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
      `✨ **Artigo gerado!**\n\n✅ Título: ${title || 'Sem título'}\n✅ Slug: ${slug || 'sem-slug'}\n✅ Tempo de leitura: ${readTime || '1 min'}${citationsCount > 0 ? `\n✅ Fontes: ${citationsCount} citações encontradas` : `\n⚠️ Fontes: Nenhuma citação retornada pela API`}\n\nO artigo está pronto para publicação!`,

    validationWarning: (errors: string[]) =>
      `⚠️ Artigo com erros de validação: ${errors.join(', ')}`
  },

  errors: {
    perplexity: 'Erro ao chamar Perplexity',
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
  articles: '/api/articles',
  resources: '/api/resources'
} as const;

// ============================================================================
// Routes
// ============================================================================

export const ROUTES = {
  dashboard: '/dashboard',
  newsArticle: (slug: string) => `/noticias/${slug}`,
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
// NOTE: CATEGORY_FALLBACK_MAP REMOVIDO em 2025-12-13
// O mapa antigo de 45 linhas foi deletado pois:
// 1. A IA Perplexity agora recebe lista completa de 27 categorias no prompt
// 2. normalizeCategoryWithFallback() foi simplificado para confiar na IA
// 3. Só usamos fallback simples se a categoria for realmente inválida
// ============================================================================


/**
 * Normaliza categoria da IA para uma categoria válida do sistema
 * Se a categoria for inválida, retorna um fallback seguro baseado no tipo de artigo
 *
 * @param category - Categoria sugerida pela IA
 * @param type - Tipo de artigo (news, educational ou resource)
 * @returns Categoria válida garantida + flag indicando se houve fallback
 */
export function normalizeCategoryWithFallback(
  category: string | undefined,
  type: 'news' | 'educational' | 'resource'
): { category: string; hadFallback: boolean } {
  if (!category) {
    // Fallback padrão por tipo
    const defaultCategories = {
      news: 'tecnologia',
      educational: 'blockchain',
      resource: 'tools'
    };
    return {
      category: defaultCategories[type],
      hadFallback: true
    };
  }

  const normalized = category.toLowerCase().trim();

  // Verificar se já é uma categoria válida
  if (isValidCategory(type, normalized)) {
    return { category: normalized, hadFallback: false };
  }

  // Para Resources: mapeamento específico
  if (type === 'resource') {
    // Mapeamento de categorias genéricas para Resources
    const resourceFallbackMap: Record<string, string> = {
      'carteira': 'wallets',
      'carteiras': 'wallets',
      'wallet': 'wallets',
      'corretora': 'exchanges',
      'corretoras': 'exchanges',
      'exchange': 'exchanges',
      'navegador': 'browsers',
      'navegadores': 'browsers',
      'browser': 'browsers',
      'explorador': 'explorers',
      'exploradores': 'explorers',
      'explorer': 'explorers',
      'blockchain-explorer': 'explorers',
      'ferramenta': 'tools',
      'ferramentas': 'tools',
      'tool': 'tools',
      'analytics': 'tools',
      'portfolio': 'tools',
      'tracker': 'tools'
    };

    const resourceCategory = resourceFallbackMap[normalized];
    if (resourceCategory) {
      return { category: resourceCategory, hadFallback: true };
    }

    // Fallback final para resources: 'tools'
    return { category: 'tools', hadFallback: true };
  }

  // ============================================================================
  // SIMPLIFIED 2025-12-13: Confiar 100% na escolha da IA
  // Se a categoria for inválida, apenas log e fallback simples
  // REMOVIDO: Uso do CATEGORY_FALLBACK_MAP (era desnecessário e causava overrides)
  // ============================================================================
  console.warn(`⚠️ Categoria inválida: "${category}" para tipo "${type}". Usando fallback.`);

  // Fallback final por tipo
  const defaultCategories = {
    news: 'tecnologia',
    educational: 'blockchain',
    resource: 'tools'
  };

  return {
    category: defaultCategories[type],
    hadFallback: true
  };
}
