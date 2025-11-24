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
 * CORES MAXIMAMENTE DISTINTAS - distribuídas pelo círculo cromático
 */
export function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    // List view gradients (subtle, 8% opacity) - cada categoria BEM distinta
    'wallet': 'rgba(255, 107, 0, 0.08)',           // 🟠 Laranja forte
    'exchange': 'rgba(255, 193, 7, 0.08)',         // 🟡 Âmbar/Amarelo-ouro
    'defi-protocol': 'rgba(233, 30, 99, 0.08)',    // 💗 Magenta
    'explorers': 'rgba(33, 150, 243, 0.08)',       // 🔵 Azul royal
    'browsers': 'rgba(156, 39, 176, 0.08)',        // 🟣 Roxo profundo
    'analytics': 'rgba(0, 200, 83, 0.08)',         // 🟢 Verde esmeralda
    'portfolio-tracker': 'rgba(0, 188, 212, 0.08)', // 🌊 Ciano puro
    'development-tools': 'rgba(96, 125, 139, 0.08)', // ⚫ Cinza-azulado
    'news': 'rgba(244, 67, 54, 0.08)',             // 🔴 Vermelho vivo
    'education': 'rgba(205, 220, 57, 0.08)',       // 🟨 Verde-lima/Amarelo-esverdeado

    // Detail view gradients (solid, for buttons)
    'wallets': 'linear-gradient(135deg, #FF6B00 0%, #E65100 100%)', // Laranja
    'exchanges': 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)', // Amarelo-ouro
    'defi': 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)', // Magenta
    'tools': 'linear-gradient(135deg, #00C853 0%, #00A844 100%)', // Verde
  };

  return gradients[category] || 'rgba(99, 102, 241, 0.05)'; // Roxo padrão
}

/**
 * Get solid category color (for badges, borders, text)
 * Used for: Category badges, icons, accent colors
 * ESQUEMA DE CORES MAXIMAMENTE DISTINTAS
 * Distribuição pelo círculo cromático para máxima diferenciação visual
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    // Cores primárias - maximamente distintas entre si
    'wallet': '#FF6B00',          // 🟠 Laranja forte (0° + offset)
    'exchange': '#FFC107',        // � Âmbar/Amarelo-ouro (45°)
    'defi-protocol': '#E91E63',   // 💗 Magenta (330°)
    'explorers': '#2196F3',       // 🔵 Azul royal (210°)
    'browsers': '#9C27B0',        // 🟣 Roxo profundo (270°)
    'analytics': '#00C853',       // 🟢 Verde esmeralda (140°)
    'portfolio-tracker': '#00BCD4', // 🌊 Ciano puro (180°)
    'development-tools': '#607D8B', // ⚫ Cinza-azulado (neutro)
    'news': '#F44336',            // 🔴 Vermelho vivo (0°)
    'education': '#CDDC39',       // � Verde-lima (70°)

    // Detail view (aliases)
    'wallets': '#FF6B00',         // 🟠 Laranja
    'exchanges': '#FFC107',       // � Âmbar
    'defi': '#E91E63',            // 💗 Magenta
    'tools': '#607D8B',           // ⚫ Cinza
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
