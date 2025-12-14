'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos de modos suportados
export type SidebarMode = 'default' | 'trilha' | 'custom';

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
    config: any; // Pode ser tipado melhor com Generics ou Union Types
    setSidebarMode: (mode: SidebarMode, config?: any) => void;
    resetSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<SidebarMode>('default');
    const [config, setConfig] = useState<any>(null);

    const setSidebarMode = (newMode: SidebarMode, newConfig?: any) => {
        setMode(newMode);
        setConfig(newConfig || null);
    };

    const resetSidebar = () => {
        setMode('default');
        setConfig(null);
    };

    return (
        <SidebarContext.Provider value={{ mode, config, setSidebarMode, resetSidebar }}>
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
