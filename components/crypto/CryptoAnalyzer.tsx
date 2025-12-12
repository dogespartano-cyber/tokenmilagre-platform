'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';
import { TokenSOL } from '@token-icons/react';
import { BinanceDataProvider, useBinanceContext } from '@/contexts/BinanceDataContext';

const AdvancedChart = dynamic(() => import('./AdvancedChart'), {
    ssr: false,
});

const TrendMeter = dynamic(() => import('./TrendMeter'), {
    ssr: false,
});

const CryptoEducator = dynamic(() => import('./CryptoEducator'), {
    ssr: false,
});

type Asset = 'BTC' | 'ETH' | 'SOL';
type Timeframe = '15m' | '4h' | '1d' | '1w' | '1M';

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

export default function CryptoAnalyzer() {
    const [activeAsset, setActiveAsset] = useState<Asset>('BTC');
    const [timeframe, setTimeframe] = useState<Timeframe>('4h');
    const [trendColor, setTrendColor] = useState<string | undefined>(undefined);

    return (
        <BinanceDataProvider
            key={`${assets[activeAsset].symbol}-${timeframe}`}
            initialSymbol={assets[activeAsset].symbol}
            initialInterval={timeframe}
        >
            <CryptoAnalyzerContent
                activeAsset={activeAsset}
                setActiveAsset={setActiveAsset}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                trendColor={trendColor}
                setTrendColor={setTrendColor}
            />
        </BinanceDataProvider>
    );
}

interface CryptoAnalyzerContentProps {
    activeAsset: Asset;
    setActiveAsset: (asset: Asset) => void;
    timeframe: Timeframe;
    setTimeframe: (tf: Timeframe) => void;
    trendColor: string | undefined;
    setTrendColor: (color: string | undefined) => void;
}

function CryptoAnalyzerContent({
    activeAsset,
    setActiveAsset,
    timeframe,
    setTimeframe,
    trendColor,
    setTrendColor,
}: CryptoAnalyzerContentProps) {
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
                                key={`${assets[activeAsset].symbol}-${timeframe}`}
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
                                            onClick={() => setTimeframe(tf as Timeframe)}
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

            {/* Seção Educativa Modularizada */}
            <div className="mt-12">
                <CryptoEducator />
            </div>
        </div>
    );
}
