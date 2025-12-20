'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faLightbulb, faShieldAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';

import ZenithCard from '@/components/ui/ZenithCard';

/**
 * @module crypto/CryptoEducator
 * @description Seção educativa com design premium "Zenith".
 *              Apresenta estruturas de mercado, limitações e regras de ouro.
 */
export default function CryptoEducator() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coluna Esquerda: Estruturas de Mercado (Visual) */}
                <div className="space-y-6">
                    <div className="flex flex-col gap-6 h-full">
                        {/* Tendência de Alta */}
                        <ZenithCard variant="default" hoverEffect={false} className="p-6 relative overflow-hidden group flex-1 flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                            <div className="flex flex-col lg:flex-row items-center gap-6 relative z-10 w-full h-full">
                                <svg viewBox="0 0 200 100" className="w-[180px] h-24 drop-shadow-md shrink-0">
                                    <defs>
                                        <linearGradient id="bullGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
                                            <stop offset="100%" stopColor="#22c55e" stopOpacity="1" />
                                        </linearGradient>
                                        <filter id="neonGreen">
                                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    <path
                                        d="M 20 80 L 50 60 L 80 70 L 110 45 L 140 55 L 170 25"
                                        fill="none"
                                        stroke="url(#bullGradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                                    />
                                    <circle cx="50" cy="60" r="3" fill="#22c55e" className="animate-pulse" />
                                    <circle cx="110" cy="45" r="3" fill="#22c55e" className="animate-pulse delay-75" />
                                    <circle cx="170" cy="25" r="3" fill="#22c55e" className="animate-pulse delay-150" />
                                </svg>

                                <div className="flex-1 text-center lg:text-left">
                                    <p className="text-lg font-bold text-green-500 mb-1">Tendência de Alta</p>
                                    <p className="text-sm text-[var(--text-secondary)] font-medium">Topos e fundos ascendentes (Higher Highs & Higher Lows)</p>
                                    <div className="mt-3 flex gap-2 justify-center lg:justify-start">
                                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-md">Bullish</span>
                                    </div>
                                </div>
                            </div>
                        </ZenithCard>

                        {/* Tendência de Baixa */}
                        <ZenithCard variant="default" hoverEffect={false} className="p-6 relative overflow-hidden group flex-1 flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                            <div className="flex flex-col lg:flex-row items-center gap-6 relative z-10 w-full h-full">
                                <svg viewBox="0 0 200 100" className="w-[180px] h-24 drop-shadow-md shrink-0">
                                    <defs>
                                        <linearGradient id="bearGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                                            <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M 20 25 L 50 45 L 80 35 L 110 65 L 140 55 L 170 85"
                                        fill="none"
                                        stroke="url(#bearGradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                    />
                                    <circle cx="50" cy="45" r="3" fill="#ef4444" className="animate-pulse" />
                                    <circle cx="110" cy="65" r="3" fill="#ef4444" className="animate-pulse delay-75" />
                                    <circle cx="170" cy="85" r="3" fill="#ef4444" className="animate-pulse delay-150" />
                                </svg>

                                <div className="flex-1 text-center lg:text-left">
                                    <p className="text-lg font-bold text-red-500 mb-1">Tendência de Baixa</p>
                                    <p className="text-sm text-[var(--text-secondary)] font-medium">Topos e fundos descendentes (Lower Highs & Lower Lows)</p>
                                    <div className="mt-3 flex gap-2 justify-center lg:justify-start">
                                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-md">Bearish</span>
                                    </div>
                                </div>
                            </div>
                        </ZenithCard>
                    </div>
                </div>

                {/* Coluna Direita: Limitações e Regras */}
                <div className="space-y-6">
                    {/* Limitações */}
                    <ZenithCard variant="default" hoverEffect={false} className="p-6 relative overflow-hidden group flex-1 flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                        <div className="relative z-10">
                            <p className="text-lg font-bold text-amber-500 mb-4">Entenda o que os indicadores não fazem</p>

                            <ul className="space-y-3">
                                {[
                                    { title: 'Não é conselho', desc: 'Estes indicadores são ferramentas estritamente educacionais.' },
                                    { title: 'Timeframe', desc: '15m é volátil (ruído). 1D é mais confiável para tendências.' },
                                    { title: 'Falsos Sinais', desc: 'RSI pode ficar "sobrevendido" por semanas em Bear Markets.' },
                                    { title: 'Macroeconomia', desc: 'Gráficos não prevêem hacks, regulação ou guerras.' }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-1.5 group-hover:bg-amber-500 transition-colors"></span>
                                        <p className="text-[var(--text-secondary)]">
                                            <strong className="text-[var(--text-primary)]">{item.title}</strong> — {item.desc}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ZenithCard>

                    {/* Regra de Ouro */}
                    <ZenithCard variant="default" hoverEffect={false} className="p-6 relative overflow-hidden group flex-1 flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                        <div className="relative z-10">
                            <p className="text-lg font-bold text-[var(--brand-primary)] mb-4">Princípio de Investimento Contrário</p>

                            <blockquote className="text-xl font-medium text-[var(--text-primary)] italic leading-relaxed">
                                "Compre quando todos estão com medo, venda quando todos estão eufóricos."
                            </blockquote>
                        </div>
                    </ZenithCard>
                </div>
            </div>
        </div>
    );
}
