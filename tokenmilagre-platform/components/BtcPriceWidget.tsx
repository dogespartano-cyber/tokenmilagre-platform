'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoinSign } from '@fortawesome/free-solid-svg-icons';

interface BtcData {
  currentPrice: number;
  priceChangePercentage24h: number;
}

export default function BtcPriceWidget() {
  const [btcData, setBtcData] = useState<BtcData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBtcPrice = async () => {
      const CACHE_KEY = 'btc_price_widget';

      // 1. Carregar do cache imediatamente
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          setBtcData(cachedData);
          setLoading(false);
        } catch (error) {
          console.error('Erro ao carregar cache do BTC:', error);
        }
      }

      // 2. Buscar dados atualizados em background
      try {
        const response = await fetch('/api/crypto/top');
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          // Buscar Bitcoin (geralmente é o primeiro, mas vamos garantir)
          const btc = result.data.find((crypto: any) =>
            crypto.symbol.toLowerCase() === 'btc' ||
            crypto.coingeckoId === 'bitcoin'
          ) || result.data[0]; // Fallback para o primeiro se não encontrar

          if (btc) {
            const btcInfo = {
              currentPrice: btc.currentPrice,
              priceChangePercentage24h: btc.priceChangePercentage24h,
            };
            setBtcData(btcInfo);
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(btcInfo));
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar preço do BTC:', error);
        // Manter dados em cache se houver erro
        setLoading(false);
      }
    };

    fetchBtcPrice();

    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchBtcPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !btcData) {
    return (
      <div className="px-4 py-3 rounded-xl" style={{
        backgroundColor: 'var(--bg-secondary)',
      }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #f7931a, #ffb74d)',
          }}>
            <FontAwesomeIcon icon={faBitcoinSign} className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded animate-pulse mb-1" style={{ width: '60%' }}></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!btcData) {
    return null;
  }

  const priceChange = btcData.priceChangePercentage24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105" style={{
      backgroundColor: 'var(--bg-secondary)',
    }}>
      <div className="flex items-center gap-3">
        {/* Bitcoin Icon */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:rotate-12" style={{
          background: 'linear-gradient(135deg, #f7931a, #ffb74d)',
        }}>
          <FontAwesomeIcon icon={faBitcoinSign} className="w-5 h-5 text-white" />
        </div>

        {/* Price Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              BTC
            </span>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              ${btcData.currentPrice.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </span>
          </div>

          {/* 24h Change */}
          <div className="flex items-center gap-1">
            <span
              className="text-xs font-semibold"
              style={{
                color: isPositive ? '#10b981' : '#ef4444'
              }}
            >
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              24h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
