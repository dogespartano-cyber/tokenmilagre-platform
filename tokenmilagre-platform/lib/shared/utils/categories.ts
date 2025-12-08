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
 * COR NEUTRA para todas as categorias
 */
export function getCategoryGradient(category: string): string {
  // Cor neutra única para todas as categorias
  return 'rgba(100, 116, 139, 0.06)';
}

/**
 * Get solid category color (for badges, borders, text)
 * Used for: Category badges, icons, accent colors
 * COR NEUTRA para todas as categorias
 */
export function getCategoryColor(category: string): string {
  // Cor neutra única para todas as categorias
  return '#64748B'; // Slate 500
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
