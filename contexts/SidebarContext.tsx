'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Tipos de modos suportados
export type SidebarMode = 'default' | 'trilha' | 'educacao' | 'graficos' | 'recursos' | 'recurso-detalhe' | 'comece-aqui' | 'sobre' | 'custom';

// Config para modo educacao
export interface SidebarEducacaoConfig {
    showFilters: boolean;
    sections: { id: string; title: string; icon?: string }[];
}

// Tipos de configuração para cada modo
export interface SidebarTrilhaConfig {
    steps: { slug: string; title: string; duration: string }[];
    currentSlug: string;
    title?: string;
    progress?: number;
}

export interface SidebarCustomConfig {
    component?: React.ReactNode;
}

interface SidebarContextType {
    mode: SidebarMode;
    config: any;
    dynamicTitle: string;
    shortTitle: string;
    setSidebarMode: (mode: SidebarMode, config?: any) => void;
    setDynamicTitle: (title: string) => void;
    setShortTitle: (title: string) => void;
    updateConfig: (updates: Partial<any>) => void;
    resetSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<SidebarMode>('default');
    const [config, setConfig] = useState<any>(null);
    const [dynamicTitle, setDynamicTitleState] = useState<string>('');
    const [shortTitle, setShortTitleState] = useState<string>('');

    const setSidebarMode = useCallback((newMode: SidebarMode, newConfig?: any) => {
        setMode(newMode);
        setConfig(newConfig || null);
    }, []);

    const setDynamicTitle = useCallback((title: string) => {
        setDynamicTitleState(title);
    }, []);

    const setShortTitle = useCallback((title: string) => {
        setShortTitleState(title);
    }, []);

    const updateConfig = useCallback((updates: Partial<any>) => {
        setConfig((prev: any) => ({ ...prev, ...updates }));
    }, []);

    const resetSidebar = useCallback(() => {
        setMode('default');
        setConfig(null);
        setDynamicTitleState('');
        setShortTitleState('');
    }, []);

    return (
        <SidebarContext.Provider value={{
            mode,
            config,
            dynamicTitle,
            shortTitle,
            setSidebarMode,
            setDynamicTitle,
            setShortTitle,
            updateConfig,
            resetSidebar
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
