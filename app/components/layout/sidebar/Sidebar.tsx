/**
 * Sidebar Component (Refactored)
 * Container principal que orquestra modos especializados
 * 
 * @agi-domain: layout/sidebar
 * @refactored: 1199 linhas → ~80 linhas (container)
 * @follows: fractal structure, power law (80/20)
 */

'use client';

import { useState, useEffect } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';

// Shared Components
import SidebarHeader from './components/SidebarHeader';
import SidebarOverlay from './components/SidebarOverlay';
import SidebarWrapper from './components/SidebarWrapper';

// Mode Components
import DefaultMode from './modes/DefaultMode';
import TrilhaMode from './modes/TrilhaMode';
import EducacaoMode from './modes/EducacaoMode';
import GraficosMode from './modes/GraficosMode';
import RecursosMode from './modes/RecursosMode';
import RecursoDetalheMode from './modes/RecursoDetalheMode';
import ComeceAquiMode from './modes/ComeceAquiMode';

// Types
import type { SidebarProps } from './types';

/**
 * Mapeamento de modos para componentes
 * Cada modo tem seu próprio componente especializado
 */
const MODE_COMPONENTS: Record<string, React.ComponentType<any>> = {
    default: DefaultMode,
    trilha: TrilhaMode,
    educacao: EducacaoMode,
    graficos: GraficosMode,
    recursos: RecursosMode,
    'recurso-detalhe': RecursoDetalheMode,
    'comece-aqui': ComeceAquiMode,
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { mode, config } = useSidebar();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Seleciona o componente de modo apropriado
    const ModeComponent = MODE_COMPONENTS[mode] || DefaultMode;

    return (
        <>
            <SidebarOverlay isOpen={isOpen} onClose={onClose} />

            <SidebarWrapper isOpen={isOpen}>
                <SidebarHeader onClose={onClose} />
                <ModeComponent config={config} onClose={onClose} />
            </SidebarWrapper>
        </>
    );
}
