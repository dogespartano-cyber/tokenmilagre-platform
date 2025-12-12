/**
 * Theme Module - Ponto de Entrada (v2.0 - Scalable)
 * 
 * @agi-module: core/theme
 * @description Sistema unificado de tema seguindo Lei de Potência.
 *              Este é o ÚNICO módulo para gerenciamento de tema.
 * 
 * @usage
 * ```tsx
 * // No layout
 * import { ThemeProvider } from '@/lib/core/theme';
 * 
 * <ThemeProvider>
 *   {children}
 * </ThemeProvider>
 * 
 * // Em componentes
 * import { useTheme, tokens, cssVar } from '@/lib/core/theme';
 * 
 * const { theme, toggleTheme } = useTheme();
 * 
 * // Usando tokens
 * <div style={{ backgroundColor: tokens.bg.primary }} />
 * <div style={{ color: cssVar('text.secondary') }} />
 * ```
 */

// Provider e Hook
export { ThemeProvider, useTheme } from './ThemeProvider';

// Types
export type { Theme, ThemeContextType, ThemeAccent, ThemeConfig } from './types';

// Tokens - Sistema de Design Escalável
export { tokens, cssVar, themeAccents } from './tokens';
export type { TokenPath } from './tokens';

// Constants
export {
    THEME_STORAGE_KEY,
    DEFAULT_THEME,
    THEME_TRANSITION_DURATION,
    AVAILABLE_THEMES,
    THEME_LABELS,
    THEME_EMOJIS,
    TOAST_DURATION,
    TOAST_POSITION,
    TOAST_ANIMATION,
    TOAST_Z_INDEX,
} from './constants';

