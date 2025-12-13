/**
 * Utilitários para categorias de conteúdo educacional e notícias
 */

/**
 * Categorias disponíveis no sistema
 */
export type Category =
  | 'blockchain'
  | 'trading'
  | 'defi'
  | 'nfts'
  | 'seguranca'
  | 'desenvolvimento'
  | 'bitcoin'
  | 'ethereum'
  | 'solana'
  | 'altcoins'
  | 'politica'
  | 'regulacao'
  | 'stablecoins'
  | 'institucional'
  | 'layer2'
  | 'memecoins'
  | 'mining'
  | 'exchanges'
  | 'adocao'
  | 'tecnologia'
  | 'ai'
  | 'web3'
  | 'gaming'
  | 'metaverse'
  | 'privacidade'
  | 'cbdc'
  | 'airdrops'
  | 'staking'
  | 'dao'
  | 'derivativos'
  | 'macroeconomia'
  | 'hacks'
  | 'wallets';

/**
 * Configuração completa de uma categoria
 */
export interface CategoryConfig {
  label: string;
  icon: string;
  color: string;
  description: string;
  type: 'educational' | 'news' | 'both';
}

/**
 * Mapeamento completo de categorias
 */
const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  // Categorias Educacionais
  blockchain: {
    label: 'Blockchain',
    icon: '⛓️',
    color: '#F7931A', // Bitcoin orange
    description: 'Fundamentos de blockchain e tecnologia distribuída',
    type: 'educational'
  },
  trading: {
    label: 'Trading',
    icon: '📈',
    color: '#26A17B', // Green
    description: 'Estratégias de negociação e análise de mercado',
    type: 'educational'
  },
  defi: {
    label: 'DeFi',
    icon: '🏦',
    color: '#627EEA', // Ethereum blue
    description: 'Finanças descentralizadas e protocolos',
    type: 'both'
  },
  nfts: {
    label: 'NFTs',
    icon: '🎨',
    color: '#8247E5', // Purple
    description: 'Tokens não-fungíveis e arte digital',
    type: 'both'
  },
  seguranca: {
    label: 'Segurança',
    icon: '🔐',
    color: '#E84142', // Red
    description: 'Proteção de ativos e boas práticas',
    type: 'educational'
  },
  desenvolvimento: {
    label: 'Desenvolvimento',
    icon: '💻',
    color: '#00D4AA', // Teal
    description: 'Smart contracts e desenvolvimento Web3',
    type: 'educational'
  },

  // Categorias de Notícias
  bitcoin: {
    label: 'Bitcoin',
    icon: '₿',
    color: '#F7931A',
    description: 'Notícias sobre Bitcoin e BTC',
    type: 'news'
  },
  ethereum: {
    label: 'Ethereum',
    icon: '◆',
    color: '#627EEA',
    description: 'Notícias sobre Ethereum e ETH',
    type: 'news'
  },
  solana: {
    label: 'Solana',
    icon: '◎',
    color: '#14F195',
    description: 'Notícias sobre Solana e SOL',
    type: 'news'
  },
  altcoins: {
    label: 'Altcoins',
    icon: '🪙',
    color: '#8247E5',
    description: 'Notícias sobre altcoins e tokens',
    type: 'news'
  },
  politica: {
    label: 'Política',
    icon: '🏛️',
    color: '#6B7280',
    description: 'Política e decisões governamentais',
    type: 'news'
  },
  regulacao: {
    label: 'Regulação',
    icon: '⚖️',
    color: '#059669',
    description: 'Regulamentações e compliance',
    type: 'news'
  },

  // === Novas categorias de notícias ===
  stablecoins: {
    label: 'Stablecoins',
    icon: '💵',
    color: '#26A17B',
    description: 'USDT, USDC, DAI e volume on-chain',
    type: 'news'
  },
  institucional: {
    label: 'Institucional',
    icon: '🏛️',
    color: '#1E3A8A',
    description: 'ETFs, fundos e adoção institucional',
    type: 'news'
  },
  layer2: {
    label: 'Layer 2',
    icon: '⚡',
    color: '#7C3AED',
    description: 'Arbitrum, Optimism, Base, zkSync',
    type: 'news'
  },
  memecoins: {
    label: 'Memecoins',
    icon: '🐸',
    color: '#F59E0B',
    description: 'DOGE, SHIB, PEPE e comunidades',
    type: 'news'
  },
  mining: {
    label: 'Mineração',
    icon: '⛏️',
    color: '#78716C',
    description: 'Mineração, hash rate e halving',
    type: 'news'
  },
  exchanges: {
    label: 'Exchanges',
    icon: '🏢',
    color: '#0EA5E9',
    description: 'Corretoras e listagens',
    type: 'both'
  },
  adocao: {
    label: 'Adoção',
    icon: '🌍',
    color: '#10B981',
    description: 'Adoção global e casos de uso',
    type: 'news'
  },
  tecnologia: {
    label: 'Tecnologia',
    icon: '💡',
    color: '#6366F1',
    description: 'Inovações e atualizações técnicas',
    type: 'both'
  },

  // === Novas categorias expandidas ===
  ai: {
    label: 'IA & Crypto',
    icon: '🤖',
    color: '#8B5CF6',
    description: 'Inteligência artificial e criptomoedas',
    type: 'news'
  },
  web3: {
    label: 'Web3',
    icon: '🌐',
    color: '#06B6D4',
    description: 'Web descentralizada e dApps',
    type: 'both'
  },
  gaming: {
    label: 'Gaming',
    icon: '🎮',
    color: '#EC4899',
    description: 'GameFi e play-to-earn',
    type: 'news'
  },
  metaverse: {
    label: 'Metaverso',
    icon: '🥽',
    color: '#A855F7',
    description: 'Mundos virtuais e realidade imersiva',
    type: 'news'
  },
  privacidade: {
    label: 'Privacidade',
    icon: '🕵️',
    color: '#374151',
    description: 'Privacy coins e anonimato',
    type: 'news'
  },
  cbdc: {
    label: 'CBDC',
    icon: '🏦',
    color: '#0284C7',
    description: 'Moedas digitais de bancos centrais',
    type: 'news'
  },
  airdrops: {
    label: 'Airdrops',
    icon: '🎁',
    color: '#22C55E',
    description: 'Distribuições gratuitas de tokens',
    type: 'news'
  },
  staking: {
    label: 'Staking',
    icon: '💰',
    color: '#14B8A6',
    description: 'Staking e rendimentos passivos',
    type: 'both'
  },
  dao: {
    label: 'DAOs',
    icon: '🗳️',
    color: '#6366F1',
    description: 'Organizações autônomas descentralizadas',
    type: 'news'
  },
  derivativos: {
    label: 'Derivativos',
    icon: '📉',
    color: '#F97316',
    description: 'Futuros, opções e perpétuos',
    type: 'news'
  },
  macroeconomia: {
    label: 'Macro',
    icon: '🌎',
    color: '#64748B',
    description: 'Fed, juros, inflação e economia global',
    type: 'news'
  },
  hacks: {
    label: 'Hacks',
    icon: '⚠️',
    color: '#DC2626',
    description: 'Incidentes de segurança e exploits',
    type: 'news'
  },
  wallets: {
    label: 'Wallets',
    icon: '👛',
    color: '#8B5CF6',
    description: 'Carteiras e custódia',
    type: 'both'
  }
};

/**
 * Categoria padrão para fallback
 */
const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  label: 'Geral',
  icon: '📄',
  color: '#6B7280', // gray-500
  description: 'Conteúdo geral',
  type: 'both'
};

/**
 * Retorna o label de uma categoria
 */
export function getCategoryLabel(category: string | null): string {
  if (!category || !(category in CATEGORY_CONFIG)) return DEFAULT_CATEGORY_CONFIG.label;
  return CATEGORY_CONFIG[category as Category].label;
}

/**
 * Retorna o ícone emoji de uma categoria
 */
export function getCategoryIcon(category: string | null): string {
  if (!category || !(category in CATEGORY_CONFIG)) return DEFAULT_CATEGORY_CONFIG.icon;
  return CATEGORY_CONFIG[category as Category].icon;
}

/**
 * Retorna a cor principal de uma categoria
 */
export function getCategoryColor(category: string | null): string {
  if (!category || !(category in CATEGORY_CONFIG)) return DEFAULT_CATEGORY_CONFIG.color;
  return CATEGORY_CONFIG[category as Category].color;
}

/**
 * Retorna a descrição de uma categoria
 */
export function getCategoryDescription(category: string | null): string {
  if (!category || !(category in CATEGORY_CONFIG)) return DEFAULT_CATEGORY_CONFIG.description;
  return CATEGORY_CONFIG[category as Category].description;
}

/**
 * Retorna o tipo de uma categoria (educational, news, ou both)
 */
export function getCategoryType(category: string | null): 'educational' | 'news' | 'both' {
  if (!category || !(category in CATEGORY_CONFIG)) return DEFAULT_CATEGORY_CONFIG.type;
  return CATEGORY_CONFIG[category as Category].type;
}

/**
 * Retorna a configuração completa de uma categoria
 */
export function getCategoryConfig(category: string | null): CategoryConfig {
  if (!category || !(category in CATEGORY_CONFIG)) return DEFAULT_CATEGORY_CONFIG;
  return CATEGORY_CONFIG[category as Category];
}

/**
 * Retorna todas as categorias disponíveis
 */
export function getAllCategories(): Category[] {
  return Object.keys(CATEGORY_CONFIG) as Category[];
}

/**
 * Retorna categorias filtradas por tipo
 */
export function getCategoriesByType(type: 'educational' | 'news'): Category[] {
  return (Object.keys(CATEGORY_CONFIG) as Category[]).filter(
    (key) => {
      const config = CATEGORY_CONFIG[key];
      return config.type === type || config.type === 'both';
    }
  );
}

/**
 * Valida se uma string é uma categoria válida
 */
export function isValidCategory(category: string): category is Category {
  return category in CATEGORY_CONFIG;
}

/**
 * Retorna gradiente linear para uma categoria (usado em cards)
 */
export function getCategoryGradient(category: string | null): string {
  const color = getCategoryColor(category);

  // Gera gradiente baseado na cor da categoria
  return `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`;
}
