/**
 * @module home/PriceChartSection
 * @description Seção de gráfico de preços com seletor de crypto
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const LightweightChart = dynamic(() => import('@/components/crypto/LightweightChart'), {
    ssr: false,
});

const cryptoOptions = [
    { symbol: 'BTCUSDT', label: 'BTC', color: 'bg-orange-500' },
    { symbol: 'ETHUSDT', label: 'ETH', color: 'bg-blue-500' },
    { symbol: 'SOLUSDT', label: 'SOL', color: 'bg-purple-500' },
];

export function PriceChartSection() {
    const [chartSymbol, setChartSymbol] = useState('BTCUSDT');

    return (
        <section className="py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Gráfico de Preços</h2>
            </div>

            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-2xl p-6 overflow-hidden border border-gray-200 dark:border-white/5">
                <div className="flex items-center justify-end mb-6">
                    <div className="flex gap-2">
                        {cryptoOptions.map((option) => (
                            <button
                                key={option.symbol}
                                onClick={() => setChartSymbol(option.symbol)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${chartSymbol === option.symbol
                                    ? `${option.color} text-white`
                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full">
                    <LightweightChart symbol={chartSymbol} />
                </div>

                <div className="mt-6 flex justify-center lg:justify-end">
                    <Link
                        href="/graficos"
                        className="bg-white dark:bg-transparent dark:glass-card border border-gray-200 dark:border-transparent inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[var(--text-primary)] font-semibold transition-all duration-300 hover:scale-105 hover:border-[var(--brand-primary)] group"
                    >
                        Ver Análise Técnica Completa
                        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[var(--brand-primary)]" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
