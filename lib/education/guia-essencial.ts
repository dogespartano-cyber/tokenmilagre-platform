import {
    BookOpen, Shield, FileQuestion, Search, Wallet, Coins, AlertTriangle, TrendingUp,
    LucideIcon
} from 'lucide-react';

/**
 * Trilha "Comece por Aqui" — 8 artigos iniciais para iniciantes
 * Usado tanto no server component (page.tsx) quanto no client component (GuiaEssencialClient.tsx)
 */

export interface TrilhaItem {
    slug: string;
    title: string;
    icon: LucideIcon;
}

export const GUIA_ESSENCIAL_TRILHA: TrilhaItem[] = [
    { slug: 'fundamentos-cripto', title: 'Comece pelo Básico', icon: BookOpen },
    { slug: 'seguranca-primeiro', title: 'Segurança Primeiro', icon: Shield },
    { slug: 'glossario-essencial', title: 'Glossário Essencial', icon: FileQuestion },
    { slug: 'como-pesquisar-projeto', title: 'Como Pesquisar um Projeto', icon: Search },
    { slug: 'carteiras-e-custodia', title: 'Carteiras e Custódia', icon: Wallet },
    { slug: 'taxas-gas-e-redes', title: 'Taxas e Redes', icon: Coins },
    { slug: 'golpes-comuns-cripto', title: 'Golpes Comuns', icon: AlertTriangle },
    { slug: 'trilhas-por-nivel', title: 'Trilhas por Nível', icon: TrendingUp },
];

// Lista de slugs para verificação rápida
export const GUIA_ESSENCIAL_SLUGS = GUIA_ESSENCIAL_TRILHA.map(t => t.slug);

// Função helper para verificar se slug pertence à trilha
export function isGuiaEssencialSlug(slug: string): boolean {
    return GUIA_ESSENCIAL_SLUGS.includes(slug);
}
