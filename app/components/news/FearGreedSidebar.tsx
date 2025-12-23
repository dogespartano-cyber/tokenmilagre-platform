/**
 * @module news/FearGreedSidebar
 * @description Velocímetro Fear & Greed para sidebar de artigos
 * Layout vertical, autônomo (busca própria data) com skeleton fallback
 */

'use client';

import { useState, useEffect, useId } from 'react';
import { useAnimatedGauge } from '@/hooks/useAnimatedGauge';

interface FearGreedData {
    value: string;
    value_classification: string;
}

/**
 * Retorna cor baseada no valor do gauge
 */
const getGaugeColor = (value: number): string => {
    if (value <= 20) return '#DC2626';
    if (value <= 40) return '#F59E0B';
    if (value <= 60) return '#84CC16';
    if (value <= 80) return '#22C55E';
    return '#10B981';
};

/**
 * Traduz classificação para português
 */
const translateClassification = (classification: string): string => {
    const map: Record<string, string> = {
        'Extreme Fear': 'Medo Extremo',
        'Fear': 'Medo',
        'Neutral': 'Neutro',
        'Greed': 'Ganância',
        'Extreme Greed': 'Ganância Extrema',
    };
    return map[classification] || classification;
};

/**
 * Skeleton para loading state
 */
function GaugeSkeleton() {
    return (
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-[130px] h-[75px] rounded-lg bg-[var(--bg-hover)]" />
            <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-2 rounded bg-[var(--bg-hover)]" />
                <div className="w-32 h-4 rounded bg-[var(--bg-hover)]" />
                <div className="w-16 h-2 rounded bg-[var(--bg-hover)]" />
            </div>
        </div>
    );
}

export function FearGreedSidebar() {
    const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
    const gradientId = useId();

    // Usa hook com valor 0 enquanto não tem dados, depois anima para o valor real
    const targetValue = fearGreed ? parseInt(fearGreed.value) : 0;
    const gaugeValue = useAnimatedGauge(targetValue);

    // Buscar Fear & Greed Index
    useEffect(() => {
        const CACHE_KEY = 'fear_greed_index';

        // Carregar do cache imediatamente
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const cachedData = JSON.parse(cached);
                setFearGreed(cachedData);
            } catch (error) {
                console.error('Erro ao carregar cache:', error);
            }
        }

        // Buscar dados atualizados
        const fetchFearGreed = async () => {
            try {
                const response = await fetch('/api/fear-greed');
                const result = await response.json();

                if (result.success && result.data) {
                    setFearGreed(result.data);
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
                }
            } catch (error) {
                console.error('Erro ao buscar Fear & Greed Index:', error);
            }
        };

        fetchFearGreed();
    }, []);

    // Skeleton enquanto carrega
    if (!fearGreed) {
        return <GaugeSkeleton />;
    }

    const gaugeColor = getGaugeColor(gaugeValue);

    return (
        <div>
            <div className="flex flex-col items-center gap-4">
                {/* Gauge */}
                <div className="relative flex items-center justify-center" style={{ width: '130px', height: '75px' }}>
                    <svg viewBox="20 30 140 85" className="w-full h-full" style={{ overflow: 'visible' }}>
                        <defs>
                            <linearGradient id={`fearGreedGradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#DC2626" />
                                <stop offset="20%" stopColor="#EA580C" />
                                <stop offset="40%" stopColor="#F59E0B" />
                                <stop offset="60%" stopColor="#84CC16" />
                                <stop offset="80%" stopColor="#22C55E" />
                                <stop offset="100%" stopColor="#10B981" />
                            </linearGradient>
                        </defs>
                        {/* Track */}
                        <path d="M 30 100 A 60 60 0 0 1 150 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="16" strokeLinecap="round" />
                        {/* Colored Arc */}
                        <path d="M 30 100 A 60 60 0 0 1 150 100" fill="none" stroke={`url(#fearGreedGradient-${gradientId})`} strokeWidth="16" strokeLinecap="round" />

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
                        Fear & Greed Index
                    </span>
                    <span
                        className="text-sm lg:text-xl font-bold font-[family-name:var(--font-poppins)] leading-none mb-1"
                        style={{ color: gaugeColor }}
                    >
                        Sentimento do Mercado
                    </span>
                    <span className="text-[10px] lg:text-xs text-[var(--text-secondary)] flex items-center gap-1">
                        {translateClassification(fearGreed.value_classification)} <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: gaugeColor }}></span>
                    </span>
                </div>
            </div>
        </div>
    );
}
