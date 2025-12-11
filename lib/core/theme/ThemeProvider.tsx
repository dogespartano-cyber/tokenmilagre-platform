/**
 * ThemeProvider - Provider Unificado de Tema
 * 
 * @agi-module: core/theme
 * @description Provider central que gerencia o estado do tema,
 *              sincroniza data-theme E .dark class,
 *              e fornece toast de feedback.
 * 
 * @philosophy Seguindo Lei de Potência: este é o ÚNICO provider de tema.
 *             Todos os componentes devem usar useTheme() deste módulo.
 */

'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { Theme, ThemeContextType } from './types';
import {
    THEME_STORAGE_KEY,
    DEFAULT_THEME,
    THEME_TRANSITION_DURATION,
    THEME_LABELS,
    THEME_EMOJIS
} from './constants';

// Context com valores padrão
const ThemeContext = createContext<ThemeContextType>({
    theme: DEFAULT_THEME,
    toggleTheme: () => { },
    mounted: false,
    setTheme: () => { },
});

/**
 * Aplica o tema no documento HTML
 * Sincroniza AMBOS: data-theme attribute E .dark class
 * Isso garante compatibilidade com:
 * - CSS Variables via [data-theme="dark"]
 * - Tailwind dark: prefix via .dark class
 */
function applyThemeToDocument(theme: Theme): void {
    const root = document.documentElement;

    // Data attribute (para CSS Variables)
    root.setAttribute('data-theme', theme);

    // Class (para Tailwind dark:)
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

/**
 * Adiciona classe de transição suave
 */
function enableThemeTransition(): void {
    document.documentElement.classList.add('theme-transition');
}

/**
 * Remove classe de transição após animação
 */
function disableThemeTransition(): void {
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
    }, THEME_TRANSITION_DURATION);
}

interface ThemeProviderProps {
    children: ReactNode;
    /** Tema inicial (override do localStorage/system preference) */
    defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme || DEFAULT_THEME);
    const [mounted, setMounted] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Inicialização: ler tema do localStorage
    useEffect(() => {
        setMounted(true);

        try {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
            const initialTheme = savedTheme || defaultTheme || DEFAULT_THEME;

            setThemeState(initialTheme);
            applyThemeToDocument(initialTheme);
        } catch (e) {
            // localStorage não disponível (SSR, private mode, etc)
            console.warn('[ThemeProvider] Could not access localStorage:', e);
        }
    }, [defaultTheme]);

    // Sincronizar tema quando mudar
    useEffect(() => {
        if (mounted) {
            applyThemeToDocument(theme);
        }
    }, [theme, mounted]);

    const setTheme = useCallback((newTheme: Theme) => {
        enableThemeTransition();

        setThemeState(newTheme);

        try {
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (e) {
            console.warn('[ThemeProvider] Could not save to localStorage:', e);
        }

        // Toast feedback
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);

        disableThemeTransition();
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }, [theme, setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, mounted, setTheme }}>
            {children}

            {/* Theme Change Toast */}
            {showToast && mounted && (
                <div
                    className="fixed bottom-20 right-8 z-[9999] px-6 py-3 rounded-xl shadow-2xl border-2 flex items-center gap-3 animate-fade-in-up backdrop-blur-lg"
                    style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--brand-primary)',
                        color: 'var(--text-primary)'
                    }}
                    role="status"
                    aria-live="polite"
                >
                    <span className="text-2xl">{THEME_EMOJIS[theme]}</span>
                    <span className="font-semibold">
                        Tema {THEME_LABELS[theme]} ativado
                    </span>
                </div>
            )}
        </ThemeContext.Provider>
    );
}

/**
 * Hook para acessar o contexto de tema
 * 
 * @example
 * const { theme, toggleTheme, mounted } = useTheme();
 * 
 * if (!mounted) return <Skeleton />;
 * 
 * return (
 *   <button onClick={toggleTheme}>
 *     {theme === 'light' ? 'Escuro' : 'Claro'}
 *   </button>
 * );
 */
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
