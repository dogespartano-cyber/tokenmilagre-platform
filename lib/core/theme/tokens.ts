/**
 * Theme Tokens - Sistema de Design Escalável
 * 
 * @agi-module: core/theme
 * @description Tokens semânticos centralizados para o sistema de temas.
 *              Preparado para suportar múltiplas variantes de tema.
 * 
 * @usage
 * ```tsx
 * import { tokens, cssVar } from '@/lib/core/theme';
 * 
 * // Em estilos inline
 * style={{ backgroundColor: cssVar('bg.primary') }}
 * 
 * // Ou diretamente
 * className={`bg-[${tokens.bg.primary}]`}
 * ```
 * 
 * @version 2.0.0
 * @date 2024-12-12
 */

/**
 * Tokens CSS Variables do sistema de tema
 * 
 * Organizados hierarquicamente por categoria:
 * - bg: Backgrounds
 * - text: Cores de texto
 * - border: Bordas e divisores
 * - brand: Cores da marca
 * - accent: Cores de destaque (preparado para temas alternativos)
 * - states: Estados funcionais (success, error, warning, info)
 * - shadow: Sombras
 * - icon: Ícones
 */
export const tokens = {
    // === BACKGROUNDS ===
    bg: {
        /** Background principal da página */
        primary: 'var(--bg-primary)',
        /** Background de cards e seções */
        secondary: 'var(--bg-secondary)',
        /** Background terciário sutil */
        tertiary: 'var(--bg-tertiary)',
        /** Cards elevados com destaque */
        elevated: 'var(--bg-elevated)',
        /** Background de modal overlay */
        modal: 'var(--modal-overlay)',
    },

    // === TEXTOS ===
    text: {
        /** Texto principal (títulos, conteúdo importante) */
        primary: 'var(--text-primary)',
        /** Texto secundário (descrições) */
        secondary: 'var(--text-secondary)',
        /** Texto terciário (labels, captions) */
        tertiary: 'var(--text-tertiary)',
        /** Texto muito sutil (hints, placeholders) */
        muted: 'var(--text-muted)',
        /** Texto invertido (sobre fundos escuros) */
        inverse: 'var(--text-inverse)',
        /** Texto de links */
        link: 'var(--text-link)',
    },

    // === BORDAS ===
    border: {
        /** Borda sutil */
        light: 'var(--border-light)',
        /** Borda padrão */
        medium: 'var(--border-medium)',
        /** Borda forte */
        strong: 'var(--border-strong)',
        /** Borda de foco */
        focus: 'var(--border-focus)',
    },

    // === MARCA (Brand Colors) ===
    brand: {
        /** Cor primária da marca */
        primary: 'var(--brand-primary)',
        /** Cor de hover da marca */
        hover: 'var(--brand-hover)',
        /** Versão clara da marca */
        light: 'var(--brand-light)',
        /** Background da marca */
        bg: 'var(--brand-bg)',
    },

    // === ACCENT (Para temas alternativos - Ocean, Forest, etc.) ===
    accent: {
        /** Cor de acento primária */
        primary: 'var(--accent-primary)',
        /** Cor de acento hover */
        hover: 'var(--accent-hover)',
        /** Cor de acento leve */
        light: 'var(--accent-light)',
        /** Gradiente de acento */
        gradient: {
            start: 'var(--gradient-start)',
            end: 'var(--gradient-end)',
        },
    },

    // === ESTADOS FUNCIONAIS ===
    states: {
        success: {
            base: 'var(--success)',
            light: 'var(--success-light)',
            bg: 'var(--success-bg)',
            border: 'var(--success-border)',
        },
        error: {
            base: 'var(--error)',
            light: 'var(--error-light)',
            bg: 'var(--error-bg)',
            border: 'var(--error-border)',
        },
        warning: {
            base: 'var(--warning)',
            light: 'var(--warning-light)',
            bg: 'var(--warning-bg)',
            border: 'var(--warning-border)',
        },
        info: {
            base: 'var(--info)',
            light: 'var(--info-light)',
            bg: 'var(--info-bg)',
            border: 'var(--info-border)',
        },
    },

    // === SOMBRAS ===
    shadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
    },

    // === ÍCONES ===
    icon: {
        default: 'var(--icon)',
        muted: 'var(--icon-muted)',
        inverse: 'var(--icon-inverse)',
    },
} as const;

/**
 * Tipo para paths de tokens (ex: 'bg.primary', 'text.secondary')
 */
export type TokenPath =
    | `bg.${keyof typeof tokens.bg}`
    | `text.${keyof typeof tokens.text}`
    | `border.${keyof typeof tokens.border}`
    | `brand.${keyof typeof tokens.brand}`
    | `accent.${keyof typeof tokens.accent}`
    | `icon.${keyof typeof tokens.icon}`;

/**
 * Helper para acessar tokens via path string
 * 
 * @param path - Caminho do token (ex: 'bg.primary')
 * @returns Valor CSS variable
 * 
 * @example
 * cssVar('bg.primary') // => 'var(--bg-primary)'
 * cssVar('text.secondary') // => 'var(--text-secondary)'
 */
export function cssVar(path: string): string {
    const parts = path.split('.');
    let current: unknown = tokens;

    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = (current as Record<string, unknown>)[part];
        } else {
            console.warn(`[Theme] Token não encontrado: ${path}`);
            return `var(--${path.replace('.', '-')})`;
        }
    }

    return typeof current === 'string' ? current : `var(--${path.replace('.', '-')})`;
}

/**
 * Configuração de temas disponíveis para expansão futura
 * 
 * @description Quando novos temas forem adicionados, definir aqui
 *              as cores de acento que sobrescrevem os defaults.
 */
export const themeAccents = {
    // Tema padrão - usa brand colors
    default: {
        primary: '#8B5CF6',
        hover: '#7C3AED',
        light: '#A78BFA',
        gradientStart: '#8B5CF6',
        gradientEnd: '#EC4899',
    },

    // Preparado para temas futuros
    // ocean: {
    //   primary: '#0EA5E9',
    //   hover: '#0284C7',
    //   light: '#38BDF8',
    //   gradientStart: '#0EA5E9',
    //   gradientEnd: '#06B6D4',
    // },

    // forest: {
    //   primary: '#10B981',
    //   hover: '#059669',
    //   light: '#34D399',
    //   gradientStart: '#10B981',
    //   gradientEnd: '#14B8A6',
    // },
} as const;

export type ThemeAccent = keyof typeof themeAccents;
