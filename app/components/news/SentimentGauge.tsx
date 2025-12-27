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
        <div className="w-full">
            <div className="flex flex-col items-center gap-2 md:gap-4">
                {/* Gauge */}
                <div className="relative flex items-center justify-center w-full aspect-[16/9] max-w-[280px] mx-auto">
                    <svg viewBox="20 30 140 85" className="w-full h-full" style={{ overflow: 'visible' }}>
                        <defs>
                            <linearGradient id={`sentimentGradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#EF4444" />
                                <stop offset="50%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#10B981" />
                            </linearGradient>
                        </defs>
                        {/* Track */}
                        <path d="M 30 100 A 60 60 0 0 1 150 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round" />
                        {/* Colored Arc - Background indicating the full range */}
                        <path d="M 30 100 A 60 60 0 0 1 150 100" fill="none" stroke={`url(#sentimentGradient-${gradientId})`} strokeWidth="12" strokeLinecap="round" opacity="0.2" />

                        {/* Needle */}
                        <g style={{ transform: `rotate(${(gaugeValue * 1.8) - 90}deg)`, transformOrigin: '90px 100px' }} className="transition-all duration-1000 ease-out">
                            <circle cx="90" cy="100" r="4" fill={gaugeColor} />
                            <path d="M 90 100 L 87 97 L 90 45 L 93 97 Z" fill={gaugeColor} />
                        </g>

                        {/* Value inside gauge */}
                        <text x="90" y="94" fill="var(--text-primary)" fontSize="34" fontWeight="900" textAnchor="middle" dominantBaseline="middle" className="font-inter">
                            {gaugeValue}
                        </text>
                    </svg>
                </div>

                {/* Text Info */}
                <div className="flex flex-col items-center text-center -mt-2">
                    <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.2em] mb-1">
                        Análise de Sentimento
                    </span>
                    <span
                        className="text-lg font-black font-inter leading-none mb-1 uppercase tracking-wider transition-colors duration-1000"
                        style={{ color: gaugeColor }}
                    >
                        {label}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: gaugeColor }}></span>
                        IA Verificada
                    </div>
                </div>
            </div>
        </div>
    );
}
