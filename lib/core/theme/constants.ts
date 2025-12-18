/**
 * Theme Constants (Enhanced v2.0)
 * 
 * @agi-module: core/theme
 * @description Constantes centralizadas do sistema de tema
 */

import type { Theme } from './types';

/**
 * Chave usada no localStorage para persistir a preferência de tema do usuário
 * 
 * @constant
 * @type {string}
 * @default 'theme'
 */
export const THEME_STORAGE_KEY = 'theme';

/**
 * Tema padrão quando não há preferência salva no localStorage
 * 
 * Usado como fallback quando:
 * - Usuário nunca escolheu um tema
 * - localStorage está indisponível
 * - Erro ao ler do localStorage
 * 
 * @constant
 * @type {Theme}
 * @default 'dark'
 */
export const DEFAULT_THEME: Theme = 'dark';

/**
 * Chave usada no localStorage para persistir a profundidade do tema
 * 
 * @constant
 * @type {string}
 * @default 'theme-depth'
 */
export const DEPTH_STORAGE_KEY = 'theme-depth';

/**
 * Profundidade padrão (0%)
 * 
 * @constant
 * @type {number}
 * @default 0
 */
export const DEFAULT_DEPTH = 0;

/**
 * Duração da animação de transição de tema em milissegundos
 * 
 * Controla quanto tempo a classe `.theme-transition` permanece ativa
 * durante a mudança de tema.
 * 
 * @constant
 * @type {number}
 * @default 300
 * @see {@link enableThemeTransition}
 * @see {@link disableThemeTransition}
 */
export const THEME_TRANSITION_DURATION = 500;

/**
 * Lista de todos os temas disponíveis no sistema
 * 
 * @constant
 * @type {Theme[]}
 * @default ['light', 'dark']
 */
export const AVAILABLE_THEMES: Theme[] = ['light', 'dark'];

/**
 * Labels localizados para exibição de temas na UI
 * 
 * @constant
 * @type {Record<Theme, string>}
 */
export const THEME_LABELS: Record<Theme, string> = {
    light: 'Claro',
    dark: 'Escuro',
};

/**
 * Emojis para feedback visual no Toast de mudança de tema
 * 
 * @constant
 * @type {Record<Theme, string>}
 */
export const THEME_EMOJIS: Record<Theme, string> = {
    light: '☀️',
    dark: '🌙',
};

/**
 * Duração do toast de confirmação em milissegundos
 * 
 * @constant
 * @type {number}
 * @default 2000
 */
export const TOAST_DURATION = 2000;

/**
 * Posição do toast na tela (Tailwind classes)
 * 
 * @constant
 * @type {string}
 * @default 'bottom-20 right-8'
 */
export const TOAST_POSITION = 'bottom-20 right-8';

/**
 * Classe de animação do toast
 * 
 * @constant
 * @type {string}
 * @default 'animate-fade-in-up'
 */
export const TOAST_ANIMATION = 'animate-fade-in-up';

/**
 * Z-index do toast
 * 
 * @constant
 * @type {number}
 * @default 9999
 */
export const TOAST_Z_INDEX = 9999;
