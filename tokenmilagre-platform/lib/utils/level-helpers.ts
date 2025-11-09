import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSeedling, faBook, faRocket, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

/**
 * Tipos de nível de dificuldade para conteúdo educacional
 */
export type Level = 'iniciante' | 'intermediario' | 'avancado';

/**
 * Configuração completa de um nível
 */
export interface LevelConfig {
  label: string;
  color: string;
  gradient: string;
  icon: IconDefinition;
  description: string;
}

/**
 * Mapeamento completo de configurações por nível
 */
const LEVEL_CONFIG: Record<Level, LevelConfig> = {
  iniciante: {
    label: 'Iniciante',
    color: '#22c55e', // green-500
    gradient: 'rgba(34, 197, 94, 0.08)',
    icon: faSeedling,
    description: 'Fundamentos e conceitos básicos'
  },
  intermediario: {
    label: 'Intermediário',
    color: '#eab308', // amber-500
    gradient: 'rgba(234, 179, 8, 0.08)',
    icon: faGraduationCap,
    description: 'Conhecimento aplicado e estratégias'
  },
  avancado: {
    label: 'Avançado',
    color: '#ef4444', // red-500
    gradient: 'rgba(239, 68, 68, 0.08)',
    icon: faRocket,
    description: 'Técnicas avançadas e desenvolvimento'
  }
};

/**
 * Nível padrão para fallback
 */
const DEFAULT_LEVEL_CONFIG: LevelConfig = {
  label: 'Geral',
  color: '#64748b', // slate-500
  gradient: 'rgba(100, 116, 139, 0.05)',
  icon: faBook,
  description: 'Conteúdo geral'
};

/**
 * Retorna o label de um nível
 */
export function getLevelLabel(level: string | null): string {
  if (!level || !(level in LEVEL_CONFIG)) return DEFAULT_LEVEL_CONFIG.label;
  return LEVEL_CONFIG[level as Level].label;
}

/**
 * Retorna a cor principal de um nível
 */
export function getLevelColor(level: string | null): string {
  if (!level || !(level in LEVEL_CONFIG)) return DEFAULT_LEVEL_CONFIG.color;
  return LEVEL_CONFIG[level as Level].color;
}

/**
 * Retorna o gradiente de fundo de um nível (rgba)
 */
export function getLevelGradient(level: string | null): string {
  if (!level || !(level in LEVEL_CONFIG)) return DEFAULT_LEVEL_CONFIG.gradient;
  return LEVEL_CONFIG[level as Level].gradient;
}

/**
 * Retorna o ícone FontAwesome de um nível
 */
export function getLevelIcon(level: string | null): IconDefinition {
  if (!level || !(level in LEVEL_CONFIG)) return DEFAULT_LEVEL_CONFIG.icon;
  return LEVEL_CONFIG[level as Level].icon;
}

/**
 * Retorna a descrição de um nível
 */
export function getLevelDescription(level: string | null): string {
  if (!level || !(level in LEVEL_CONFIG)) return DEFAULT_LEVEL_CONFIG.description;
  return LEVEL_CONFIG[level as Level].description;
}

/**
 * Retorna a configuração completa de um nível
 */
export function getLevelConfig(level: string | null): LevelConfig {
  if (!level || !(level in LEVEL_CONFIG)) return DEFAULT_LEVEL_CONFIG;
  return LEVEL_CONFIG[level as Level];
}

/**
 * Retorna todos os níveis disponíveis
 */
export function getAllLevels(): Level[] {
  return Object.keys(LEVEL_CONFIG) as Level[];
}

/**
 * Valida se uma string é um nível válido
 */
export function isValidLevel(level: string): level is Level {
  return level in LEVEL_CONFIG;
}
