'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const TradingViewWidget = dynamic(() => import('@/components/TradingViewWidget'), {
  ssr: false,
});

interface MarketData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
}

interface FearGreedData {
  value: string;
  value_classification: string;
}

export default function MercadoPage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
    fetchFearGreed();

    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      fetchMarketData();
      fetchFearGreed();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/global'
      );
      const data = await response.json();

      setMarketData({
        totalMarketCap: data.data.total_market_cap.usd,
        totalVolume: data.data.total_volume.usd,
        btcDominance: data.data.market_cap_percentage.btc,
        ethDominance: data.data.market_cap_percentage.eth,
        marketCapChange24h: data.data.market_cap_change_percentage_24h_usd,
      });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados do mercado:', error);
      setLoading(false);
    }
  };

  const fetchFearGreed = async () => {
    try {
      const response = await fetch('https://api.alternative.me/fng/');
      const data = await response.json();
      setFearGreed(data.data[0]);
    } catch (error) {
      console.error('Erro ao buscar Fear & Greed Index:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString('pt-BR')}`;
  };

  const getFearGreedColor = (value: number) => {
    if (value <= 25) return 'from-red-500 to-red-600';
    if (value <= 45) return 'from-orange-500 to-orange-600';
    if (value <= 55) return 'from-yellow-500 to-yellow-600';
    if (value <= 75) return 'from-green-500 to-green-600';
    return 'from-emerald-500 to-emerald-600';
  };

  const getFearGreedEmoji = (classification: string) => {
    const map: { [key: string]: string } = {
      'Extreme Fear': '😱',
      'Fear': '😰',
      'Neutral': '😐',
      'Greed': '🤑',
      'Extreme Greed': '🚀'
    };
    return map[classification] || '📊';
  };

  return (
    <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-pulse">📊</div>
            <p className="text-white text-xl">Carregando dados do mercado...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Market Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Market Cap */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/80 text-sm">Market Cap Total</p>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-white font-bold text-3xl mb-1">
                  {marketData && formatNumber(marketData.totalMarketCap)}
                </p>
                <p className={`text-sm font-semibold ${
                  marketData && marketData.marketCapChange24h >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {marketData && marketData.marketCapChange24h >= 0 ? '▲' : '▼'}
                  {marketData && Math.abs(marketData.marketCapChange24h).toFixed(2)}% (24h)
                </p>
              </div>

              {/* 24h Volume */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/80 text-sm">Volume 24h</p>
                  <span className="text-2xl">📈</span>
                </div>
                <p className="text-white font-bold text-3xl mb-1">
                  {marketData && formatNumber(marketData.totalVolume)}
                </p>
                <p className="text-white/70 text-sm">Trading global</p>
              </div>

              {/* BTC Dominance */}
              <div className="bg-gradient-to-br from-orange-400/20 to-yellow-400/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-orange-300/40 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/80 text-sm">BTC Dominance</p>
                  <span className="text-2xl">₿</span>
                </div>
                <p className="text-white font-bold text-3xl mb-1">
                  {marketData && marketData.btcDominance.toFixed(2)}%
                </p>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-yellow-500 h-full rounded-full transition-all"
                    style={{ width: `${marketData?.btcDominance}%` }}
                  />
                </div>
              </div>

              {/* ETH Dominance */}
              <div className="bg-gradient-to-br from-purple-400/20 to-blue-400/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-purple-300/40 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/80 text-sm">ETH Dominance</p>
                  <span className="text-2xl">Ξ</span>
                </div>
                <p className="text-white font-bold text-3xl mb-1">
                  {marketData && marketData.ethDominance.toFixed(2)}%
                </p>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${marketData?.ethDominance}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Market Insights - Card Unificado */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fear & Greed + Altcoin Season */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
                <h3 className="text-white font-bold text-xl mb-4 font-[family-name:var(--font-poppins)]">
                  📊 Market Insights
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Fear & Greed Index */}
                  {fearGreed && (
                    <div className="flex flex-col items-center">
                      <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getFearGreedColor(parseInt(fearGreed.value))} flex items-center justify-center shadow-lg mb-2`}>
                        <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-full flex flex-col items-center justify-center">
                          <span className="text-3xl">{getFearGreedEmoji(fearGreed.value_classification)}</span>
                          <span className="text-white font-bold text-lg">{fearGreed.value}</span>
                        </div>
                      </div>
                      <p className="text-white font-bold text-sm text-center">
                        {fearGreed.value_classification}
                      </p>
                      <p className="text-white/60 text-xs text-center">Fear & Greed</p>
                    </div>
                  )}

                  {/* Altcoin Season */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-4xl mb-2">
                      {marketData && marketData.btcDominance < 40 ? '🚀' : '📊'}
                    </div>
                    <p className="text-white font-bold text-sm text-center">
                      {marketData && marketData.btcDominance < 40
                        ? 'Altcoin Season'
                        : 'BTC Dominante'}
                    </p>
                    <p className="text-white/60 text-xs text-center">Baseado BTC/ETH</p>
                  </div>
                </div>
              </div>

              {/* Links Úteis */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
                <h3 className="text-white font-bold text-xl mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2">
                  <span>🔗</span>
                  <span>Links Úteis</span>
                </h3>
                <div className="space-y-2">
                  <a
                    href="https://www.coingecko.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 transition-all"
                  >
                    <p className="text-white font-semibold text-sm">📊 CoinGecko</p>
                    <p className="text-white/70 text-xs">Dados de mercado</p>
                  </a>
                  <a
                    href="https://coinmarketcap.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 transition-all"
                  >
                    <p className="text-white font-semibold text-sm">💹 CoinMarketCap</p>
                    <p className="text-white/70 text-xs">Rankings e preços</p>
                  </a>
                  <a
                    href="https://br.tradingview.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 transition-all"
                  >
                    <p className="text-white font-semibold text-sm">📈 TradingView</p>
                    <p className="text-white/70 text-xs">Análise técnica</p>
                  </a>
                </div>
              </div>
            </div>

            {/* TradingView Charts */}
            <div className="space-y-6">
              <h2 className="text-white font-bold text-2xl font-[family-name:var(--font-poppins)] text-center">
                📈 Gráficos ao Vivo
              </h2>

              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {/* BTC Chart */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>₿</span>
                    <span>Bitcoin (BTC/USD)</span>
                  </h3>
                  <TradingViewWidget symbol="BINANCE:BTCUSD" symbolName="BTCUSD" />
                </div>

                {/* ETH Chart */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>Ξ</span>
                    <span>Ethereum (ETH/USD)</span>
                  </h3>
                  <TradingViewWidget symbol="BINANCE:ETHUSD" symbolName="ETHUSD" />
                </div>

                {/* SOL Chart */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>◎</span>
                    <span>Solana (SOL/USDT)</span>
                  </h3>
                  <TradingViewWidget symbol="BINANCE:SOLUSDT" symbolName="SOLUSDT" />
                </div>
              </div>
            </div>

            {/* Token $MILAGRE CTA */}
            <div className="bg-gradient-to-r from-yellow-400/20 to-amber-400/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-yellow-300/40 shadow-xl text-center">
              <h3 className="text-white font-bold text-2xl mb-4 font-[family-name:var(--font-poppins)]">
                🌟 Acompanhe $MILAGRE
              </h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                O token da educação financeira descentralizada. Monitore o mercado e aprenda a investir com sabedoria.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white font-bold rounded-full transition-all shadow-xl"
                >
                  📊 Meu Dashboard
                </Link>
                <a
                  href="https://pump.fun/coin/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-full transition-all shadow-xl"
                >
                  🚀 Comprar $MILAGRE
                </a>
              </div>
            </div>

            {/* Atualização */}
            <p className="text-center text-white/60 text-sm">
              🔄 Dados atualizados automaticamente a cada 30 segundos
            </p>
          </div>
        )}
      </div>
  );
}
