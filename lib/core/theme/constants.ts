/**
 * Theme Constants
 * 
 * @agi-module: core/theme
 * @description Constantes centralizadas do sistema de tema
 */

import type { Theme } from './types';

/** Chave usada no localStorage para persistir o tema */
export const THEME_STORAGE_KEY = 'theme';

/** Tema padrão quando não há preferência salva */
export const DEFAULT_THEME: Theme = 'dark';

/** Duração da transição de tema em ms */
export const THEME_TRANSITION_DURATION = 300;

/** Temas disponíveis */
export const AVAILABLE_THEMES: Theme[] = ['light', 'dark'];

/** Labels para exibição */
export const THEME_LABELS: Record<Theme, string> = {
    light: 'Claro',
    dark: 'Escuro',
};

/** Emojis para feedback visual */
export const THEME_EMOJIS: Record<Theme, string> = {
    light: '☀️',
    dark: '🌙',
};
