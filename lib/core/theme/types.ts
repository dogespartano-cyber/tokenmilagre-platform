/**
 * Theme Types (v2.0 - Scalable)
 * 
 * @agi-module: core/theme
 * @description Types e interfaces para o sistema de tema unificado.
 *              Preparado para suportar múltiplas variantes de tema.
 */

/** Temas base disponíveis (light/dark) */
export type Theme = 'light' | 'dark';

/** Variantes de acento para temas alternativos (futuro) */
export type ThemeAccent = 'default' | 'ocean' | 'forest' | 'sunset';

/** Configuração completa de tema */
export interface ThemeConfig {
    /** Modo base (light/dark) */
    mode: Theme;
    /** Variante de acento (opcional, para temas customizados) */
    accent?: ThemeAccent;
}

export interface ThemeContextType {
    /** Tema atual */
    theme: Theme;
    /** Alternar entre light/dark */
    toggleTheme: () => void;
    /** Se o componente já foi montado (evita hydration mismatch) */
    mounted: boolean;
    /** Define um tema específico */
    setTheme: (theme: Theme) => void;
    /** Variante de acento atual (futuro) */
    accent?: ThemeAccent;
    /** Define variante de acento (futuro) */
    setAccent?: (accent: ThemeAccent) => void;
}
