/**
 * Category Helpers - Centralized category utilities
 *
 * Provides consistent category colors, gradients, and labels across the platform.
 * Used by: RecursosClient, ResourceDetailClient, and other resource-related components.
 */

export type ResourceCategory =
  | 'wallet'
  | 'exchange'
  | 'defi-protocol'
  | 'explorers'
  | 'browsers'
  | 'analytics'
  | 'portfolio-tracker'
  | 'development-tools'
  | 'news'
  | 'education'
  | 'wallets'
  | 'exchanges'
  | 'defi'
  | 'tools';

/**
 * Get category gradient (for backgrounds and buttons)
 * Used for: Card backgrounds with subtle gradients
 */
export function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    // List view gradients (subtle, 8% opacity)
    'wallet': 'rgba(246, 133, 27, 0.08)',          // Laranja (MetaMask) 8%
    'exchange': 'rgba(243, 186, 47, 0.08)',        // Dourado (Binance) 8%
    'defi-protocol': 'rgba(255, 0, 122, 0.08)',    // Rosa (Uniswap) 8%
    'explorers': 'rgba(59, 130, 246, 0.08)',       // Azul 8%
    'browsers': 'rgba(139, 92, 246, 0.08)',        // Roxo-azul 8%
    'analytics': 'rgba(16, 185, 129, 0.08)',       // Verde 8%
    'portfolio-tracker': 'rgba(236, 72, 153, 0.08)', // Rosa-vivo 8%
    'development-tools': 'rgba(156, 163, 175, 0.08)', // Cinza 8%
    'news': 'rgba(239, 68, 68, 0.08)',             // Vermelho 8%
    'education': 'rgba(34, 197, 94, 0.08)',        // Verde-educação 8%

    // Detail view gradients (solid, for buttons)
    'wallets': 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)', // Laranja (MetaMask)
    'exchanges': 'linear-gradient(135deg, #F3BA2F 0%, #EAA42D 100%)', // Dourado (Binance)
    'defi': 'linear-gradient(135deg, #FF007A 0%, #E6006E 100%)', // Rosa (Uniswap)
    'tools': 'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Verde
  };

  return gradients[category] || 'rgba(99, 102, 241, 0.05)'; // Roxo padrão 5%
}

/**
 * Get solid category color (for badges, borders, text)
 * Used for: Category badges, icons, accent colors
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'wallet': '#F6851B',          // Laranja (MetaMask)
    'wallets': '#8B5CF6',         // Roxo (detail view)
    'exchange': '#F3BA2F',        // Dourado (Binance)
    'exchanges': '#3B82F6',       // Azul (detail view)
    'defi-protocol': '#FF007A',   // Rosa (Uniswap)
    'defi': '#FF007A',            // Rosa
    'explorers': '#3B82F6',       // Azul
    'browsers': '#8B5CF6',        // Roxo-azul
    'analytics': '#10B981',       // Verde
    'portfolio-tracker': '#EC4899', // Rosa-vivo
    'development-tools': '#9CA3AF', // Cinza
    'tools': '#6B7280',           // Cinza (detail view)
    'news': '#EF4444',            // Vermelho
    'education': '#22C55E',       // Verde-educação
  };

  return colors[category] || '#6366F1'; // Roxo padrão
}

/**
 * Get human-readable category label (Portuguese)
 * Used for: UI display, badges, filters
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'wallet': 'Wallets',
    'wallets': 'Carteiras',
    'exchange': 'Exchanges',
    'exchanges': 'Exchanges',
    'defi-protocol': 'DeFi',
    'defi': 'DeFi',
    'explorers': 'Exploradores',
    'browsers': 'Navegadores',
    'analytics': 'Analytics',
    'portfolio-tracker': 'Portfolio',
    'development-tools': 'Dev Tools',
    'tools': 'Ferramentas',
    'news': 'Notícias',
    'education': 'Educação',
  };

  return labels[category] || category;
}

/**
 * Get all available categories for filters
 * Used for: Filter dropdowns, category selection
 */
export function getAllCategories() {
  return [
    { id: 'all', label: 'Todos' },
    { id: 'wallet', label: 'Wallets' },
    { id: 'exchange', label: 'Exchanges' },
    { id: 'defi-protocol', label: 'DeFi' },
    { id: 'explorers', label: 'Exploradores' },
    { id: 'browsers', label: 'Navegadores' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'portfolio-tracker', label: 'Portfolio' },
    { id: 'development-tools', label: 'Dev Tools' },
    { id: 'news', label: 'Notícias' },
    { id: 'education', label: 'Educação' },
  ];
}
