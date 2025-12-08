/**
 * 🌀 Shared Hooks
 * 
 * @agi-purpose: Hooks compartilhados usados em múltiplos domínios
 * @agi-pattern: fractal
 * 
 * Estes hooks são genéricos e reutilizáveis em todo o projeto.
 * Hooks específicos de domínio devem residir em lib/domains/[domain]/hooks/
 */

// Utility Hooks
export { useDebouncedValue } from './useDebouncedValue';
export { useThrottle } from './useThrottle';
export { useURLState } from './useURLState';
export { useToast } from './useToast';

// Infinite Scroll Hooks
export { useInfiniteScroll } from './useInfiniteScroll';
export { useInfiniteScrollData } from './useInfiniteScrollData';

// Re-exports for backward compatibility with article domain
export * from '@/lib/domains/articles/hooks';
