/**
 * @module home/FearGreedDesktop
 * @description Velocímetro Fear & Greed EXCLUSIVO para DESKTOP
 */

'use client';

import type { FearGreedProps } from './types';

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
 * Retorna cor do texto baseado no valor
 */
const getTextColor = (value: number): string => {
  if (value <= 25) return '#EF4444';
  if (value <= 45) return '#F59E0B';
  if (value <= 55) return '#EAB308';
  if (value <= 75) return '#22C55E';
  return '#10B981';
};

export function FearGreedDesktop({ fearGreed, gaugeValue }: FearGreedProps) {
  if (!fearGreed) return null;

  const gaugeColor = getGaugeColor(gaugeValue);

  return (
    // DESKTOP ONLY - hidden lg:block
    <div className="hidden lg:block">
      <div className="flex items-center justify-between">
        {/* Gauge */}
        <div className="relative flex items-center justify-center" style={{ width: '130px', height: '75px' }}>
          <svg viewBox="20 30 140 85" className="w-full h-full" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="rainbowDesktop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="20%" stopColor="#EA580C" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="60%" stopColor="#84CC16" />
                <stop offset="80%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            {/* Track */}
            <path d="M 30 100 A 60 60 0 0 1 150 100" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" className="text-zinc-200 dark:text-zinc-800" />
            {/* Colored Arc */}
            <path d="M 30 100 A 60 60 0 0 1 150 100" fill="none" stroke="url(#rainbowDesktop)" strokeWidth="16" strokeLinecap="round" />

            {/* Needle */}
            <g style={{ transform: `rotate(${(gaugeValue * 1.8) - 90}deg)`, transformOrigin: '90px 100px' }}>
              <circle cx="90" cy="100" r="8" fill={gaugeColor} />
              <path d="M 90 100 L 86 96 L 90 45 L 94 96 Z" fill={gaugeColor} />
            </g>

            {/* Value inside gauge */}
            <text x="90" y="85" fill="var(--text-primary)" fontSize="28" fontWeight="800" textAnchor="middle" dominantBaseline="middle" className="font-inter">
              {gaugeValue}
            </text>
          </svg>
        </div>

        {/* Text Info */}
        <div className="flex flex-col items-start text-left pl-4">
          <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mb-1">
            Fear & Greed Index <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          </span>
<span className="text-2xl title-newtab leading-none mb-1" style={{
            color: getTextColor(parseInt(fearGreed.value))
          }}>
            {translateClassification(fearGreed.value_classification)}
          </span>
          <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
            Sentimento do Mercado
          </span>
        </div>
      </div>
    </div>
  );
}
