'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';
import { TokenSOL } from '@token-icons/react';
import { BinanceDataProvider, useBinanceContext } from '@/contexts/BinanceDataContext';
import ZenithCard from '@/components/ui/ZenithCard';

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
      {/* Header Extracted from Card */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6">
        <div>
<h2 className="title-newtab text-2xl">Análise Técnica</h2>
        </div>

        {/* Timeframe Selector */}
        <div className="flex flex-wrap gap-1 bg-white dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
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
                className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-all ${timeframe === tf
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
              >
                {displayLabel[tf]}
              </button>
            );
          })}
        </div>
      </div>

      <ZenithCard variant="default" hoverEffect={false} className="p-0 overflow-hidden">
        {/* Dashboard Grid - No internal borders */}
        <div className="grid lg:grid-cols-3">
          {/* Main Chart - Spans 2 columns */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center">
            <div className="h-auto min-h-[600px] w-full">
              <AdvancedChart
                key={`${assets[activeAsset].symbol}-${timeframe}`}
                symbol={assets[activeAsset].symbol}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                trendColor={trendColor}
                headerLeft={
                  <div className="flex flex-nowrap gap-2 p-2 justify-center sm:justify-start">
                    {(Object.keys(assets) as Asset[]).map((asset) => (
                      <button
                        key={asset}
                        onClick={() => {
                          setActiveAsset(asset);
                          setTrendColor(undefined);
                        }}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm transition-all duration-300 whitespace-nowrap border
                          ${activeAsset === asset
                            ? 'bg-white dark:bg-white/10 shadow-sm border-transparent ' + assets[asset].color
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                          }
                        `}
                      >
                        <span className="shrink-0">{assets[asset].icon}</span>
                        <span className="hidden sm:inline">{assets[asset].name}</span>
                      </button>
                    ))}
                  </div>
                }
              />
            </div>
          </div>

          {/* Trend Meter - Spans 1 column */}
          <div className="lg:col-span-1 p-2 flex flex-col items-center justify-center text-center">
            <div className="flex-1 min-h-[500px] flex items-center justify-center w-full">
              <TrendMeter
                key={`${assets[activeAsset].symbol}-${timeframe}`}
                symbol={assets[activeAsset].symbol}
                interval={timeframe}
                onColorChange={setTrendColor}
              />
            </div>
          </div>
        </div>
      </ZenithCard>

      {/* Seção Educativa Modularizada */}
      <div className="mt-12">
        <CryptoEducator />
      </div>
    </div >
  );
}
