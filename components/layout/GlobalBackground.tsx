'use client';

import React from 'react';

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
    return (
        <div
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            {/* Gradient overlays usando CSS Variables */}
            <div
                className="absolute inset-0 opacity-100"
                style={{
                    background: `
                        radial-gradient(
                            ellipse 80% 50% at 50% -20%,
                            var(--brand-bg, rgba(252, 213, 53, 0.1)) 0%,
                            transparent 50%
                        )
                    `
                }}
            />

            {/* Ambient glow - Solar Gold (Top Left) */}
            <div
                className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] rounded-full blur-[140px] animate-pulse-slow"
                style={{
                    backgroundColor: 'var(--brand-primary)',
                    opacity: 0.08,
                    animationDuration: '10s',
                    mixBlendMode: 'screen'
                }}
            />

            {/* Secondary glow (Bottom Right) */}
            <div
                className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] animate-pulse-slow"
                style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    opacity: 0.5,
                    animationDelay: '2s',
                    mixBlendMode: 'overlay'
                }}
            />

            {/* Central subtle haze */}
            <div
                className="absolute top-[30%] left-[20%] w-[600px] h-[600px] rounded-full blur-[100px] animate-pulse-slow"
                style={{
                    backgroundColor: 'var(--brand-primary)',
                    opacity: 0.03,
                    animationDelay: '5s'
                }}
            />
        </div>
    );
}
