/**
 * ThemeProvider - Provider Unificado de Tema (Enhanced v2.0)
 * 
 * @agi-module: core/theme
 * @description Provider central que gerencia o estado do tema,
 *              sincroniza data-theme E .dark class,
 *              e fornece toast de feedback.
 * 
 * @philosophy Seguindo Lei de Potência: este é o ÚNICO provider de tema.
 *             Todos os componentes devem usar useTheme() deste módulo.
 * 
 * @enhancements v2.0:
 * - Detecção de preferência do sistema (prefers-color-scheme)
 * - Listener para mudanças do sistema operacional
 * - Toast configurável via props
 * - Focus management para acessibilidade
 * - Fallbacks CSS para maior robustez
 */

'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import type { Theme, ThemeContextType } from './types';
import {
    THEME_STORAGE_KEY,
    DEFAULT_THEME,
    THEME_TRANSITION_DURATION,
    THEME_LABELS,
    THEME_EMOJIS,
    TOAST_DURATION,
    TOAST_POSITION,
} from './constants';

// Context com valores padrão
const ThemeContext = createContext<ThemeContextType>({
    theme: DEFAULT_THEME,
    toggleTheme: () => { },
    mounted: false,
    setTheme: () => { },
});

/**
 * Aplica o tema no documento HTML de forma sincronizada
 * 
 * Sincroniza AMBOS os mecanismos de theming:
 * 1. Data attribute `[data-theme]` para CSS Variables
 * 2. Class `.dark` para Tailwind `dark:` prefix
 * 
 * Isso garante que todos os estilos (CSS Variables E Tailwind)
 * respondam corretamente à mudança de tema.
 * 
 * @param theme - O tema a ser aplicado ('light' | 'dark')
 * 
 * @example
 * ```typescript
 * applyThemeToDocument('dark');
 * // Aplica:
 * // - document.documentElement.setAttribute('data-theme', 'dark')
 * // - document.documentElement.classList.add('dark')
 * ```
 * 
 * @internal
 * @see {@link ThemeProvider}
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
 * Habilita transições CSS temporárias durante mudança de tema
 * 
 * Adiciona a classe `.theme-transition` que aplica transitions CSS
 * suaves em `background-color`, `color` e `border-color` de todos
 * os elementos.
 * 
 * A classe deve ser removida após a animação via {@link disableThemeTransition}.
 * 
 * @see {@link disableThemeTransition}
 * @see {@link THEME_TRANSITION_DURATION}
 * @internal
 */
function enableThemeTransition(): void {
    document.documentElement.classList.add('theme-transition');
}

/**
 * Remove classe de transição CSS após completar animação
 * 
 * Remove a classe `.theme-transition` depois de {@link THEME_TRANSITION_DURATION}ms,
 * permitindo que a transição de tema seja animada suavemente e depois
 * retorne ao estado normal (sem overhead de performance de transitions).
 * 
 * @see {@link enableThemeTransition}
 * @see {@link THEME_TRANSITION_DURATION}
 * @internal
 */
function disableThemeTransition(): void {
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
    }, THEME_TRANSITION_DURATION);
}

/**
 * Detecta a preferência de tema do sistema operacional
 * 
 * @returns {Theme} - 'dark' se o OS está em dark mode, 'light' caso contrário
 * @internal
 */
function getSystemPreference(): Theme {
    if (typeof window === 'undefined') return DEFAULT_THEME;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
}

interface ThemeProviderProps {
    children: ReactNode;
    /** Tema inicial (override do localStorage/system preference) */
    defaultTheme?: Theme;
    /** Mostrar toast de feedback ao mudar tema */
    showToast?: boolean;
    /** Posição do toast (classes Tailwind) */
    toastPosition?: string;
    /** Duração do toast em ms */
    toastDuration?: number;
    /** Detectar e seguir preferência do sistema */
    followSystemPreference?: boolean;
}

export function ThemeProvider({
    children,
    defaultTheme,
    showToast = true,
    toastPosition = TOAST_POSITION,
    toastDuration = TOAST_DURATION,
    followSystemPreference = false,
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme || DEFAULT_THEME);
    const [mounted, setMounted] = useState(false);
    const [showToastState, setShowToastState] = useState(false);
    const toastRef = useRef<HTMLDivElement>(null);

    // 🎯 Inicialização: ler tema do localStorage ou sistema
    useEffect(() => {
        setMounted(true);

        try {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

            // Prioridade: savedTheme > defaultTheme > systemPreference > DEFAULT_THEME
            let initialTheme: Theme;
            if (savedTheme) {
                initialTheme = savedTheme;
            } else if (defaultTheme) {
                initialTheme = defaultTheme;
            } else if (followSystemPreference) {
                initialTheme = getSystemPreference();
            } else {
                initialTheme = DEFAULT_THEME;
            }

            setThemeState(initialTheme);
            applyThemeToDocument(initialTheme);
        } catch (e) {
            // localStorage não disponível (SSR, private mode, etc)
            console.warn('[ThemeProvider] Could not access localStorage:', e);
        }
    }, [defaultTheme, followSystemPreference]);

    // 🎧 Listener para mudanças no tema do sistema operacional
    useEffect(() => {
        if (!followSystemPreference || !mounted) return;

        // Só monitora mudanças do sistema se não houver preferência manual salva
        const hasManualPreference = localStorage.getItem(THEME_STORAGE_KEY);
        if (hasManualPreference) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? 'dark' : 'light';
            setThemeState(newTheme);
            applyThemeToDocument(newTheme);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [followSystemPreference, mounted]);

    // 🔄 Sincronizar tema quando mudar
    useEffect(() => {
        if (mounted) {
            applyThemeToDocument(theme);
        }
    }, [theme, mounted]);

    // ♿ Focus management para Toast (acessibilidade)
    useEffect(() => {
        if (showToastState && toastRef.current) {
            // Anunciar mudança para screen readers sem roubar foco
            toastRef.current.setAttribute('aria-label', `Tema ${THEME_LABELS[theme]} ativado`);
        }
    }, [showToastState, theme]);

    const setTheme = useCallback((newTheme: Theme) => {
        enableThemeTransition();

        setThemeState(newTheme);

        try {
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (e) {
            console.warn('[ThemeProvider] Could not save to localStorage:', e);
        }

        // Toast feedback
        if (showToast) {
            setShowToastState(true);
            setTimeout(() => setShowToastState(false), toastDuration);
        }

        disableThemeTransition();
    }, [showToast, toastDuration]);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }, [theme, setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, mounted, setTheme }}>
            {children}

            {/* Theme Change Toast */}
            {showToast && showToastState && mounted && (
                <div
                    ref={toastRef}
                    className={`fixed ${toastPosition} z-[9999] px-6 py-3 rounded-xl shadow-2xl border-2 flex items-center gap-3 animate-fade-in-up backdrop-blur-lg`}
                    style={{
                        backgroundColor: 'var(--bg-elevated, #1F2937)',
                        borderColor: 'var(--brand-primary, #FFD700)',
                        color: 'var(--text-primary, #FFFFFF)'
                    }}
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <span className="text-2xl" aria-hidden="true">{THEME_EMOJIS[theme]}</span>
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
