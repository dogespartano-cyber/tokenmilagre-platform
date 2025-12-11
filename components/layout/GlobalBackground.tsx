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
                className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
                style={{ backgroundColor: 'var(--bg-primary)' }}
            />
        );
    }

    const isDark = theme === 'dark';

    return (
        <div
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            {isDark ? (
                // DARK MODE: Glows sutis estilo Binance/Zenith
                <>
                    {/* Solar Gold Glow (Top Left) */}
                    <div
                        className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] rounded-full blur-[140px] animate-pulse-slow"
                        style={{
                            backgroundColor: '#FCD535',
                            opacity: 0.08,
                            animationDuration: '10s',
                            mixBlendMode: 'screen'
                        }}
                    />

                    {/* Secondary Tech Beam (Bottom Right) */}
                    <div
                        className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] animate-pulse-slow"
                        style={{
                            backgroundColor: '#1E2329',
                            opacity: 0.6,
                            animationDelay: '2s',
                            mixBlendMode: 'overlay'
                        }}
                    />

                    {/* Central Gold Haze */}
                    <div
                        className="absolute top-[30%] left-[20%] w-[600px] h-[600px] rounded-full blur-[100px] animate-pulse-slow"
                        style={{
                            backgroundColor: '#FCD535',
                            opacity: 0.03,
                            animationDelay: '5s'
                        }}
                    />
                </>
            ) : (
                // LIGHT MODE: Clean e minimalista - sem glows
                <div className="absolute inset-0 bg-[#FAFAFA]" />
            )}
        </div>
    );
}
