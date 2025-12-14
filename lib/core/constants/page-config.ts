/**
 * 📄 Page Configuration
 * 
 * @agi-purpose: Centralized config for page headers (title + description)
 * @agi-pattern: constants
 * @agi-trust: HIGH
 * 
 * Defines header content for each route. Following power-law:
 * this is a core config used across all pages.
 */

export interface PageConfig {
    title: string;
    description: string;
}

/**
 * Page header configuration by pathname
 * Used by PageHeader component in layout-root.tsx
 */
export const PAGE_HEADER_CONFIG: Record<string, PageConfig> = {
    '/': {
        title: '$MILAGRE',
        description: 'Em busca de uma comunidade com prosperidade.'
    },
    '/graficos': {
        title: 'Gráficos e Análises de Mercado',
        description: 'Acompanhe o mercado em tempo real com gráficos avançados, análise técnica e indicadores profissionais'
    },
    '/criptomoedas': {
        title: 'Cotações em Tempo Real',
        description: 'Acompanhe o preço, volume e tendências das principais criptomoedas do mercado.'
    },
    '/noticias': {
        title: 'Notícias Cripto',
        description: 'Resumos inteligentes das principais notícias do mercado'
    },
    '/educacao': {
        title: 'Aprenda Cripto do Zero ao Avançado',
        description: 'Artigos e tutoriais gratuitos criados pela comunidade. Sem promessas falsas, apenas conhecimento real.'
    },
    '/recursos': {
        title: 'Ferramentas e Links Seguros',
        description: 'Acesse exchanges, carteiras e sites oficiais com tranquilidade.'
    },
    '/dashboard': {
        title: 'Painel Administrativo',
        description: 'Gerencie todo o conteúdo e configurações da plataforma'
    },
    '/comece-aqui': {
        title: 'Comece Aqui',
        description: 'Seu ponto de partida no mundo cripto. Educação sem promessas falsas, conhecimento real.'
    }
};

/**
 * Get page config for a given pathname
 * @param pathname - The current route pathname
 * @returns PageConfig or undefined if not configured
 */
export function getPageConfig(pathname: string): PageConfig | undefined {
    return PAGE_HEADER_CONFIG[pathname];
}
