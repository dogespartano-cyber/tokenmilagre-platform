/**
 * @module news/SentimentGauge
 * @description Velocímetro de Sentimento para artigos de notícias
 * Usa hook useAnimatedGauge para animação com cleanup
 */

'use client';

import { useId } from 'react';
import { useAnimatedGauge } from '@/hooks/useAnimatedGauge';

interface SentimentGaugeProps {
    sentiment: 'positive' | 'neutral' | 'negative';
}

/**
 * Converte sentimento para valor do gauge (0-100)
 */
const getSentimentValue = (sentiment: string): number => {
    switch (sentiment) {
        case 'positive': return 80;
        case 'negative': return 20;
        default: return 50;
    }
};

/**
 * Retorna cor baseada no sentimento
 */
const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
        case 'positive': return '#10B981'; // emerald
        case 'negative': return '#EF4444'; // red
        default: return '#F59E0B'; // amber
    }
};

/**
 * Retorna label traduzido
 */
const getSentimentLabel = (sentiment: string): string => {
    switch (sentiment) {
        case 'positive': return 'Otimista';
        case 'negative': return 'Pessimista';
        default: return 'Informativo';
    }
};

export function SentimentGauge({ sentiment }: SentimentGaugeProps) {
    const targetValue = getSentimentValue(sentiment);
    const gaugeColor = getSentimentColor(sentiment);
    const label = getSentimentLabel(sentiment);
    const gradientId = useId();

    // Usa hook com cleanup adequado
    const gaugeValue = useAnimatedGauge(targetValue);

    return (
        <div>
            <div className="flex flex-col items-center gap-4">
                {/* Gauge */}
                <div className="relative flex items-center justify-center" style={{ width: '130px', height: '75px' }}>
                    <svg viewBox="20 30 140 85" className="w-full h-full" style={{ overflow: 'visible' }}>
                        <defs>
                            <linearGradient id={`sentimentGradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#EF4444" />
                                <stop offset="50%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#10B981" />
                            </linearGradient>
                        </defs>
                        {/* Track */}
                        <path d="M 30 100 A 60 60 0 0 1 150 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="16" strokeLinecap="round" />
                        {/* Colored Arc */}
                        <path d="M 30 100 A 60 60 0 0 1 150 100" fill="none" stroke={`url(#sentimentGradient-${gradientId})`} strokeWidth="16" strokeLinecap="round" />

                        {/* Needle */}
                        <g style={{ transform: `rotate(${(gaugeValue * 1.8) - 90}deg)`, transformOrigin: '90px 100px' }}>
                            <circle cx="90" cy="100" r="8" fill={gaugeColor} />
                            <path d="M 90 100 L 86 96 L 90 45 L 94 96 Z" fill={gaugeColor} />
                        </g>

                        {/* Value inside gauge */}
                        <text x="90" y="85" fill="var(--text-primary)" fontSize="28" fontWeight="800" textAnchor="middle" dominantBaseline="middle" className="font-[family-name:var(--font-poppins)]">
                            {gaugeValue}
                        </text>
                    </svg>
                </div>

                {/* Text Info */}
                <div className="flex flex-col items-center text-center">
                    <span className="text-[8px] lg:text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                        Análise de Sentimento
                    </span>
                    <span
                        className="text-sm lg:text-xl font-bold font-[family-name:var(--font-poppins)] leading-none mb-1"
                        style={{ color: gaugeColor }}
                    >
                        Tom da Notícia
                    </span>
                    <span className="text-[10px] lg:text-xs text-[var(--text-secondary)] flex items-center gap-1">
                        {label} <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: gaugeColor }}></span>
                    </span>
                </div>
            </div>
        </div>
    );
}
