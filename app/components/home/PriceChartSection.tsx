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
import { ZenithCard } from '../ui/ZenithCard';

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
                <Link
                    href="/graficos"
                    className="group inline-flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
                    title="Ver Análise Técnica Completa"
                >
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                        Gráfico de Preços
                    </h2>
                </Link>
            </div>

            <ZenithCard variant="teal" hoverEffect={false} className="h-[500px] flex flex-col">
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


            </ZenithCard>
        </section>
    );
}
