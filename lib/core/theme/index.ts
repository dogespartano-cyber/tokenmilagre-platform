/**
 * Theme Module - Ponto de Entrada
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
 * import { useTheme } from '@/lib/core/theme';
 * 
 * const { theme, toggleTheme } = useTheme();
 * ```
 */

// Provider e Hook
export { ThemeProvider, useTheme } from './ThemeProvider';

// Types
export type { Theme, ThemeContextType } from './types';

// Constants
export {
    THEME_STORAGE_KEY,
    DEFAULT_THEME,
    THEME_TRANSITION_DURATION,
    AVAILABLE_THEMES,
    THEME_LABELS,
    THEME_EMOJIS,
} from './constants';
