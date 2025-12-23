'use client';

import React from 'react';

interface SentimentIndicatorProps {
    sentiment: 'positive' | 'neutral' | 'negative';
    variant?: 'default' | 'compact';
}

/**
 * Indicador de Tom Editorial Zenith
 * Focado em simplicidade extrema e elegância.
 */
export function SentimentIndicator({ sentiment, variant = 'default' }: SentimentIndicatorProps) {
    const tones = [
        { key: 'negative', label: 'Pessimista', color: '#EF4444' },
        { key: 'neutral', label: 'Neutro', color: '#F59E0B' },
        { key: 'positive', label: 'Otimista', color: '#10B981' }
    ];

    const currentTone = tones.find(t => t.key === sentiment) || tones[1];

    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-3">
                <div className="flex gap-1 h-1.5">
                    {tones.map((t) => (
                        <div
                            key={t.key}
                            className={`h-full w-4 rounded-[1px] transition-all duration-700 ${t.key === sentiment ? 'opacity-100 scale-y-125' : 'opacity-20'
                                }`}
                            style={{
                                backgroundColor: t.color,
                                boxShadow: t.key === sentiment ? `0 0 8px ${t.color}66` : 'none'
                            }}
                        />
                    ))}
                </div>
                <span
                    className="text-[10px] font-black uppercase tracking-[0.1em] transition-colors duration-700 whitespace-nowrap"
                    style={{ color: currentTone.color }}
                >
                    {currentTone.label}
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-2 py-2">
            {/* Header Simples - Centralizado */}
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)] opacity-60">
                    Tom da Notícia
                </span>
                <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: currentTone.color }} />
            </div>

            {/* Barra de Segmentos - Compacta */}
            <div className="flex gap-1.5 h-2">
                {tones.map((t) => (
                    <div
                        key={t.key}
                        className={`h-full w-10 rounded-[2px] transition-all duration-700 ${t.key === sentiment ? 'opacity-100 scale-y-110' : 'opacity-10 pb-0.5'
                            }`}
                        style={{
                            backgroundColor: t.color,
                            boxShadow: t.key === sentiment ? `0 0 10px ${t.color}66` : 'none'
                        }}
                    />
                ))}
            </div>

            {/* Label de Impacto - Centralizado */}
            <span
                className="text-[11px] font-black uppercase tracking-[0.2em] mt-1 transition-colors duration-700"
                style={{ color: currentTone.color }}
            >
                {currentTone.label}
            </span>
        </div>
    );
}
