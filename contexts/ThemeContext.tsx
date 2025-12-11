/**
 * ThemeContext - Compatibilidade Retroativa
 * 
 * @deprecated Use `import { ThemeProvider, useTheme } from '@/lib/core/theme'` diretamente.
 * 
 * Este arquivo existe apenas para manter compatibilidade com imports existentes.
 * Todos os novos componentes devem importar de '@/lib/core/theme'.
 * 
 * @agi-migration: Este arquivo será removido após migração completa.
 */

'use client';

// Re-export tudo do novo módulo centralizado
export { ThemeProvider, useTheme } from '@/lib/core/theme';

// Re-export types para compatibilidade
export type { Theme, ThemeContextType } from '@/lib/core/theme';
