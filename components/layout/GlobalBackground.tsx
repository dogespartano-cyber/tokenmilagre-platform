'use client';

import React from 'react';
import { useTheme } from '@/lib/core/theme';

/**
 * GlobalBackground - Zenith Prosper Edition
 * 
 * @agi-module: layout
 * @description 
 *  - Light Mode: Clean, minimalistic, no effects.
 *  - Dark Mode: "Zenith Prosper" - Exchange-grade technical aesthetics.
 *               Deep obsidian background with subtle hexagonal grids and 
 *               rising golden data streams.
 */
export default function GlobalBackground() {
    const { theme, mounted } = useTheme();

    if (!mounted) {
        return (
            <div
                className="fixed inset-0 z-[-1] bg-[var(--bg-primary)]"
                aria-hidden="true"
            />
        );
    }

    // Light Mode: Clean Pure Background
    if (theme === 'light') {
        return (
            <div
                className="fixed inset-0 z-[-1] bg-[var(--bg-primary)] transition-colors duration-500"
                aria-hidden="true"
            />
        );
    }

    // Dark Mode: Zenith Prosper
    return (
        <div
            className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[var(--bg-primary)]"
            aria-hidden="true"
            style={{
                background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))', // Theme compliant gradient
            }}
        >
            {/* 1. Hexagonal Data Mesh - The Foundation */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='104' viewBox='0 0 60 104' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' stroke='%23FCD535' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
                    maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)'
                }}
            />

            {/* 2. Rising Prosperity Curves - Golden Accents */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[60vh] opacity-[0.05]"
                style={{
                    background: 'radial-gradient(ellipse at bottom, var(--brand-primary) 0%, transparent 70%)',
                    filter: 'blur(120px)',
                    transform: 'scaleY(0.7)',
                }}
            />

            {/* 3. Ascending Data Streams - Subtle vertical movement */}
            <div className="absolute inset-0 overflow-hidden opacity-[0.05]">
                <div
                    className="absolute top-[-50%] left-[-20%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent"
                    style={{
                        transform: 'rotate(45deg)',
                        filter: 'blur(100px)',
                        opacity: 0.3
                    }}
                />
            </div>

            {/* 4. Vignette for Focus */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, transparent 40%, var(--bg-primary) 100%)'
                }}
            />
        </div>
    );
}
