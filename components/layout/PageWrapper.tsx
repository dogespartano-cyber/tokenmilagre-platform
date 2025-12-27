/**
 * PageWrapper - Componente de layout para páginas com header dinâmico
 * 
 * @agi-purpose: Centraliza header da página no mesmo arquivo
 * @agi-pattern: composition
 */

'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';

export interface PageHeaderConfig {
    title: string;
    description: string;
    shortTitle?: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
}


interface PageWrapperProps {
    children: React.ReactNode;
    /** 
     * Configuração do header da página.
     * Se fornecido, renderiza PageHeader automaticamente.
     * Se omitido, página não terá header (ex: páginas de detalhe).
     */
    header?: PageHeaderConfig;
    /** Classe CSS adicional para o container */
    className?: string;
}

export default function PageWrapper({
    children,
    header,
    className = ''
}: PageWrapperProps) {
    return (
        <div className={`min-h-screen relative ${className}`}>
            {/* Header dinâmico */}
            {header && (
                <div className="container mx-auto px-4 pt-8 pb-1 lg:pt-16 lg:pb-8 relative z-10">
                    <PageHeader
                        title={header.title}
                        description={header.description}
                        shortTitle={header.shortTitle}
                        sentiment={header.sentiment}
                    />
                </div>
            )}

            {/* Conteúdo da página */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
