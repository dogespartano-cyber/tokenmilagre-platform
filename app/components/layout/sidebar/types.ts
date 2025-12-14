/**
 * Sidebar Types
 * Tipos compartilhados para o sistema de sidebar modular
 * 
 * @agi-domain: layout/sidebar
 * @follows: fractal structure
 */

import { ReactNode } from 'react';

// ============================================================
// CORE TYPES
// ============================================================

/** Props base para todos os modos */
export interface SidebarModeProps {
    onClose: () => void;
    config?: any;
}

/** Props do container principal */
export interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

// ============================================================
// MODE-SPECIFIC TYPES
// ============================================================

/** Seção de navegação genérica */
export interface SidebarSection {
    id: string;
    title: string;
    icon?: string;
}

/** Config para modo trilha */
export interface TrilhaModeConfig {
    steps: { slug: string; title: string; duration: string }[];
    currentSlug: string;
    title?: string;
    subtitle?: string;
    progress?: number;
}

/** Config para modo educacao */
export interface EducacaoModeConfig {
    showFilters: boolean;
    sections: SidebarSection[];
    artigosExpanded?: boolean;
}

/** Config para modo graficos */
export interface GraficosModeConfig {
    sections: SidebarSection[];
}

/** Config para modo recursos */
export interface RecursosModeConfig {
    categories: { id: string; label: string }[];
    selectedCategory: string;
    setSelectedCategory: (cat: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

/** Config para modo recurso-detalhe */
export interface RecursoDetalheModeConfig {
    currentResource: { slug: string; name: string } | null;
    relatedResources: { slug: string; name: string }[];
    categoryLabel: string;
}

/** Config para modo comece-aqui */
export interface ComeceAquiModeConfig {
    sections: SidebarSection[];
}

// ============================================================
// MENU ITEM TYPES
// ============================================================

/** Item do menu principal */
export interface MenuItem {
    id: string;
    href: string;
    label: string;
    icon: any; // FontAwesome IconDefinition
}

/** Items do menu padrão */
export const INITIAL_MENU_ITEMS: MenuItem[] = [
    { id: 'home', href: '/', label: 'Início', icon: 'faHome' },
    { id: 'news', href: '/noticias', label: 'Notícias', icon: 'faNewspaper' },
    { id: 'charts', href: '/graficos', label: 'Gráficos', icon: 'faChartLine' },
    { id: 'crypto', href: '/criptomoedas', label: 'Criptomoedas', icon: 'faBitcoinSign' },
    { id: 'edu', href: '/educacao', label: 'Educação', icon: 'faGraduationCap' },
    { id: 'resources', href: '/recursos', label: 'Recursos', icon: 'faStore' },
    { id: 'token', href: '/token', label: 'Token', icon: 'faCoins' },
    { id: 'about', href: '/sobre', label: 'Sobre', icon: 'faInfoCircle' },
];
