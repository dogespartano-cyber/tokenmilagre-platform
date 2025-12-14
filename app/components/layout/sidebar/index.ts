/**
 * Sidebar Module - Public Exports
 * 
 * @agi-domain: layout/sidebar
 * @follows: fractal structure (index.ts as entry point)
 */

// Main component
export { default as Sidebar } from './Sidebar';
export { default } from './Sidebar';

// Shared components (for custom implementations)
export { default as SidebarHeader } from './components/SidebarHeader';
export { default as SidebarOverlay } from './components/SidebarOverlay';
export { default as SidebarWrapper } from './components/SidebarWrapper';

// Mode components (for direct use if needed)
export { default as DefaultMode } from './modes/DefaultMode';
export { default as TrilhaMode } from './modes/TrilhaMode';
export { default as EducacaoMode } from './modes/EducacaoMode';
export { default as GraficosMode } from './modes/GraficosMode';
export { default as RecursosMode } from './modes/RecursosMode';
export { default as RecursoDetalheMode } from './modes/RecursoDetalheMode';

// Types
export * from './types';
