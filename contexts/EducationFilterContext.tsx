/**
 * Education Filter Context
 * Gerencia estado de busca e filtros para a página /educacao
 * Compartilhado entre Sidebar e EducacaoClient
 */

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface EducationFilterContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedLevel: string;
    setSelectedLevel: (level: string) => void;
    clearAllFilters: () => void;
    getActiveFiltersCount: () => number;
}

const EducationFilterContext = createContext<EducationFilterContextType | undefined>(undefined);

export const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'fundamentos', label: 'Fundamentos' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'trading', label: 'Trading' },
    { id: 'defi', label: 'DeFi' },
    { id: 'nfts', label: 'NFTs' },
    { id: 'seguranca', label: 'Segurança' },
    { id: 'desenvolvimento', label: 'Dev Web3' },
];

export const levels = [
    { id: 'all', label: 'Todos' },
    { id: 'iniciante', label: 'Iniciante' },
    { id: 'intermediario', label: 'Intermediário' },
    { id: 'avancado', label: 'Avançado' },
];

export function EducationFilterProvider({ children }: { children: ReactNode }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedLevel('all');
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (searchTerm) count++;
        if (selectedCategory !== 'all') count++;
        if (selectedLevel !== 'all') count++;
        return count;
    };

    return (
        <EducationFilterContext.Provider
            value={{
                searchTerm,
                setSearchTerm,
                selectedCategory,
                setSelectedCategory,
                selectedLevel,
                setSelectedLevel,
                clearAllFilters,
                getActiveFiltersCount,
            }}
        >
            {children}
        </EducationFilterContext.Provider>
    );
}

export function useEducationFilters() {
    const context = useContext(EducationFilterContext);
    if (context === undefined) {
        throw new Error('useEducationFilters must be used within EducationFilterProvider');
    }
    return context;
}

// Hook opcional que não lança erro se estiver fora do Provider
export function useEducationFiltersOptional() {
    return useContext(EducationFilterContext);
}
