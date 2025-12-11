'use client';

import React from 'react';
import { useTheme } from '@/lib/core/theme';

/**
 * GlobalBackground - Background Global Responsivo ao Tema
 * 
 * @agi-module: layout
 * @description Background global que usa CSS Variables para responder
 *              automaticamente ao tema sem precisar de dark: prefix.
 * 
 * @philosophy Usa var(--bg-primary) como fonte única de verdade,
 *             eliminando conflitos entre dark: class e data-theme.
 */
export default function GlobalBackground() {
    const { theme, mounted } = useTheme();

    // Evitar hydration mismatch - renderizar versão neutra até montar
    if (!mounted) {
        return (
            <div
                className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
                style={{ backgroundColor: 'var(--bg-primary)' }}
            />
        );
    }

    const isDark = theme === 'dark';

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            {isDark ? (
                // DARK MODE: Glows sutis estilo Binance/Zenith
                <>
                    {/* Solar Gold Blob (Top Left) */}
                    <div
                        className="absolute top-0 left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] mix-blend-screen opacity-10 animate-blob"
                        style={{ backgroundColor: '#FCD535' }}
                    />

                    {/* Secondary Tech Blob (Bottom Right) - Legacy Color Restored */}
                    <div
                        className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] mix-blend-overlay opacity-50 animate-blob animation-delay-2000"
                        style={{ backgroundColor: '#1E2329' }}
                    />

                    {/* Deep Blue Blob (Bottom Right) - Removed to restore original look */}
                </>
            ) : (
                // LIGHT MODE: Clean e minimalista - sem glows
                <div className="absolute inset-0 bg-[#FAFAFA]" />
            )}
        </div>
    );
}
