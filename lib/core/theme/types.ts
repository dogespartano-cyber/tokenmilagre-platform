/**
 * Theme Types
 * 
 * @agi-module: core/theme
 * @description Types e interfaces para o sistema de tema unificado
 */

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
    /** Tema atual */
    theme: Theme;
    /** Alternar entre light/dark */
    toggleTheme: () => void;
    /** Se o componente já foi montado (evita hydration mismatch) */
    mounted: boolean;
    /** Define um tema específico */
    setTheme: (theme: Theme) => void;
}
