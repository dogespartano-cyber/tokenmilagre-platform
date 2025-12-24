'use client';

import React from 'react';
import Link from 'next/link';
import { useFearGreed } from '@/app/components/home/hooks/useFearGreed';
import ZenithCard from '@/components/ui/ZenithCard';

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

export default function SidebarFearGreed() {
    const { fearGreed, gaugeValue } = useFearGreed();

    if (!fearGreed) return null;

    // Cores baseadas no valor para o label de classificação
    const getLabelColor = (val: number, isHex = false) => {
        if (val <= 25) return isHex ? '#EF4444' : 'text-red-500';
        if (val <= 45) return isHex ? '#F97316' : 'text-orange-500';
        if (val <= 55) return isHex ? '#EAB308' : 'text-yellow-500';
        if (val <= 75) return isHex ? '#10B981' : 'text-emerald-500';
        return isHex ? '#22C55E' : 'text-green-500';
    };

    const needleColor = getLabelColor(gaugeValue, true);

    return (
        <Link
            href="/sentimento"
            className="group px-4 py-1 border-b border-[#e6f4f3] dark:border-white/5 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-transparent to-white/[0.02] dark:to-white/[0.01] hover:bg-white/5 transition-colors cursor-pointer"
        >
            <div className="flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                <svg viewBox="25 40 130 65" className="w-full max-w-[110px] md:max-w-[130px] overflow-visible drop-shadow-xl">
                    <defs>
                        <linearGradient id="sidebarRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#EF4444" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                        <filter id="glowSidebar" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Track Background */}
                    <path
                        d="M 30 100 A 60 60 0 0 1 150 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="text-zinc-200 dark:text-zinc-800/30"
                    />

                    {/* Colored Arc */}
                    <path
                        d="M 30 100 A 60 60 0 0 1 150 100"
                        fill="none"
                        stroke="url(#sidebarRainbow)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="188.5"
                        strokeDashoffset={188.5 - (188.5 * gaugeValue) / 100}
                        className="transition-all duration-1000 ease-out"
                    />

                    {/* Needle */}
                    <g
                        style={{
                            transform: `rotate(${(gaugeValue * 1.8) - 90}deg)`,
                            transformOrigin: '90px 100px'
                        }}
                        className="transition-all duration-1000 ease-out"
                    >
                        <path d="M 90 100 L 87 97 L 90 45 L 93 97 Z" fill={needleColor} filter="url(#glowSidebar)" />
                        <circle cx="90" cy="100" r="4" fill={needleColor} />
                    </g>

                    {/* Central Value */}
                    <text
                        x="90"
                        y="94"
                        fill="var(--text-primary)"
                        fontSize="36"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-[family-name:var(--font-poppins)] tracking-tighter drop-shadow-sm opacity-90"
                    >
                        {gaugeValue}
                    </text>
                </svg>
            </div>

            {/* Centralized Labels Below */}
            <div className="mt-1 mb-2 flex flex-col items-center gap-0 group-hover:opacity-80 transition-opacity">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)] opacity-60 font-[family-name:var(--font-poppins)]">
                    Sentimento
                </span>
                <span className={`text-[10px] font-black uppercase tracking-wider ${getLabelColor(gaugeValue)} font-[family-name:var(--font-poppins)] transition-colors duration-1000`}>
                    {translateClassification(fearGreed.value_classification)}
                </span>
            </div>
        </Link>
    );
}
