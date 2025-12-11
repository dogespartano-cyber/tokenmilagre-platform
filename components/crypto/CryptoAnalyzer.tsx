'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';
import { TokenSOL } from '@token-icons/react';

const AdvancedChart = dynamic(() => import('./AdvancedChart'), {
    ssr: false,
});

const TrendMeter = dynamic(() => import('./TrendMeter'), {
    ssr: false,
});

type Asset = 'BTC' | 'ETH' | 'SOL';

export default function CryptoAnalyzer() {
    const [activeAsset, setActiveAsset] = useState<Asset>('BTC');
    const [timeframe, setTimeframe] = useState<any>('4h');
    const [trendColor, setTrendColor] = useState<string | undefined>(undefined);

    const assets = {
        BTC: {
            symbol: 'BTCUSDT',
            taSymbol: 'BINANCE:BTCUSDT',
            name: 'Bitcoin',
            icon: <FontAwesomeIcon icon={faBitcoin} className="text-[#F7931A] w-6 h-6" />,
            color: 'text-[#F7931A]',
            bg: 'bg-[#F7931A]/10',
            border: 'border-[#F7931A]/20'
        },
        ETH: {
            symbol: 'ETHUSDT',
            taSymbol: 'BINANCE:ETHUSDT',
            name: 'Ethereum',
            icon: <FontAwesomeIcon icon={faEthereum} className="text-[#627EEA] w-6 h-6" />,
            color: 'text-[#627EEA]',
            bg: 'bg-[#627EEA]/10',
            border: 'border-[#627EEA]/20'
        },
        SOL: {
            symbol: 'SOLUSDT',
            taSymbol: 'BINANCE:SOLUSDT',
            name: 'Solana',
            icon: <TokenSOL size={24} variant="branded" />,
            color: 'text-[#14F195]',
            bg: 'bg-[#14F195]/10',
            border: 'border-[#14F195]/20'
        }
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-nowrap overflow-x-auto no-scrollbar w-full md:w-fit gap-2 md:gap-4 p-1 bg-gray-100/50 dark:bg-white/5 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-white/10">
                {(Object.keys(assets) as Asset[]).map((asset) => (
                    <button
                        key={asset}
                        onClick={() => {
                            setActiveAsset(asset);
                            setTrendColor(undefined); // Reset color on asset change
                        }}
                        className={`
              flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-semibold transition-all duration-300 flex-1 md:flex-none whitespace-nowrap
              ${activeAsset === asset
                                ? 'bg-white dark:bg-white/10 shadow-md scale-105 ' + assets[asset].color
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                            }
            `}
                    >
                        <span className="shrink-0 hidden md:flex items-center">{assets[asset].icon}</span>
                        <span className="md:hidden">{asset}</span>
                        <span className="hidden md:inline">{assets[asset].name}</span>
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 animate-fade-in-up">
                {/* Main Chart - Spans 2 columns */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="p-1 rounded-2xl overflow-hidden">
                        <div className="h-auto min-h-[600px] w-full">
                            <AdvancedChart
                                symbol={assets[activeAsset].symbol}
                                name={`${assets[activeAsset].name} / Tether US`}
                                timeframe={timeframe}
                                onTimeframeChange={setTimeframe}
                                trendColor={trendColor}
                            />
                        </div>
                    </div>
                </div>

                {/* Technical Analysis - Spans 1 column */}
                <div className="space-y-4">
                    <div className="p-4 rounded-2xl h-full flex flex-col transition-colors duration-500">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                <span>Análise Técnica ({timeframe.toUpperCase()})</span>
                            </h3>

                            {/* Timeframe Selector */}
                            <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                                {['15m', '4h', '1d', '1w', '1M'].map((tf) => {
                                    const displayLabel: Record<string, string> = {
                                        '15m': '15M',
                                        '4h': '4H',
                                        '1d': '1D',
                                        '1w': '1S',
                                        '1M': '1M',
                                    };
                                    return (
                                        <button
                                            key={tf}
                                            onClick={() => setTimeframe(tf)}
                                            className={`px-2 py-1 text-xs font-bold rounded transition-all ${timeframe === tf
                                                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            {displayLabel[tf]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex-1 min-h-[500px] rounded-xl p-2">
                            <TrendMeter
                                key={`${assets[activeAsset].symbol}-${timeframe}`}
                                symbol={assets[activeAsset].symbol}
                                interval={timeframe}
                                onColorChange={setTrendColor}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção Educativa - Duas Colunas */}
            <div className="mt-8">
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    Observe a Estrutura do Gráfico
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Coluna Esquerda: SVGs de Estrutura */}
                    <div className="flex flex-col gap-4">
                        {/* Tendência de Alta */}
                        <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-green-50/50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/20">
                            <svg viewBox="0 0 200 100" className="w-full max-w-[200px] h-24">
                                {/* Linha de tendência de alta */}
                                <path
                                    d="M 10 80 L 40 60 L 70 70 L 100 45 L 130 55 L 160 30 L 190 40"
                                    fill="none"
                                    stroke="#22C55E"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                {/* Pontos de topo */}
                                <circle cx="40" cy="60" r="4" fill="#22C55E" />
                                <circle cx="100" cy="45" r="4" fill="#22C55E" />
                                <circle cx="160" cy="30" r="4" fill="#22C55E" />
                                {/* Pontos de fundo */}
                                <circle cx="70" cy="70" r="4" fill="#16A34A" />
                                <circle cx="130" cy="55" r="4" fill="#16A34A" />
                                {/* Labels */}
                                <text x="40" y="52" fontSize="8" fill="#22C55E" textAnchor="middle">T1</text>
                                <text x="100" y="37" fontSize="8" fill="#22C55E" textAnchor="middle">T2</text>
                                <text x="160" y="22" fontSize="8" fill="#22C55E" textAnchor="middle">T3</text>
                                <text x="70" y="82" fontSize="8" fill="#16A34A" textAnchor="middle">F1</text>
                                <text x="130" y="67" fontSize="8" fill="#16A34A" textAnchor="middle">F2</text>
                                {/* Seta de direção */}
                                <path d="M 175 35 L 185 25 L 185 32" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="text-center">
                                <p className="text-sm font-bold text-green-600 dark:text-green-400">Tendência de Alta</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Topos e fundos ascendentes</p>
                            </div>
                        </div>

                        {/* Tendência de Baixa */}
                        <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-red-50/50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20">
                            <svg viewBox="0 0 200 100" className="w-full max-w-[200px] h-24">
                                {/* Linha de tendência de baixa */}
                                <path
                                    d="M 10 20 L 40 35 L 70 25 L 100 50 L 130 40 L 160 65 L 190 55"
                                    fill="none"
                                    stroke="#EF4444"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                {/* Pontos de topo */}
                                <circle cx="40" cy="35" r="4" fill="#EF4444" />
                                <circle cx="100" cy="50" r="4" fill="#EF4444" />
                                <circle cx="160" cy="65" r="4" fill="#EF4444" />
                                {/* Pontos de fundo */}
                                <circle cx="70" cy="25" r="4" fill="#DC2626" />
                                <circle cx="130" cy="40" r="4" fill="#DC2626" />
                                {/* Labels */}
                                <text x="40" y="48" fontSize="8" fill="#EF4444" textAnchor="middle">T1</text>
                                <text x="100" y="63" fontSize="8" fill="#EF4444" textAnchor="middle">T2</text>
                                <text x="160" y="78" fontSize="8" fill="#EF4444" textAnchor="middle">T3</text>
                                <text x="70" y="18" fontSize="8" fill="#DC2626" textAnchor="middle">F1</text>
                                <text x="130" y="33" fontSize="8" fill="#DC2626" textAnchor="middle">F2</text>
                                {/* Seta de direção */}
                                <path d="M 175 60 L 185 70 L 185 63" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="text-center">
                                <p className="text-sm font-bold text-red-500 dark:text-red-400">Tendência de Baixa</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Topos e fundos descendentes</p>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita: Limitações e Avisos */}
                    <div className="flex flex-col justify-center p-5 rounded-xl bg-amber-50/30 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20">
                        <p className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
                            ⚠️ Limitações e Avisos
                        </p>
                        <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span><strong>Não é conselho de investimento</strong> — Os indicadores são ferramentas educacionais</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span><strong>Timeframe importa</strong> — 15m é muito volátil, 1D é mais confiável</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span><strong>Falsos sinais existem</strong> — RSI pode ficar sobrevendido por semanas em bear markets</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span><strong>Contexto macro</strong> — Eventos externos (regulação, hacks) não são capturados</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Regra de Ouro - Card Separado */}
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 dark:from-amber-500/5 dark:to-yellow-500/5 border border-amber-200 dark:border-amber-500/20">
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    💡 Regra de Ouro
                </p>
                <p className="text-base text-gray-600 dark:text-gray-300 italic">
                    "Compre quando todos estão com medo, venda quando todos estão eufóricos."
                </p>
            </div>
        </div>
    );
}
