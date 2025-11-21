'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoinSign } from '@fortawesome/free-solid-svg-icons';

interface BtcData {
  currentPrice: number;
  priceChange24h: number;
}

export default function BtcPriceWidget() {
  const [btcData, setBtcData] = useState<BtcData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevPriceRef = useRef<number>(0);

  useEffect(() => {
    const fetchBtcPrice = async () => {
      const CACHE_KEY = 'btc_price_widget';
      const CACHE_TIMESTAMP_KEY = 'btc_price_timestamp';

      // 1. Carregar do cache imediatamente (localStorage para sincronizar com CustomCryptoScreener)
      const cached = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (cached && cachedTimestamp) {
        try {
          const cachedData = JSON.parse(cached);
          const age = Date.now() - parseInt(cachedTimestamp);

          // Se cache tem menos de 2 minutos, usar
          if (age < 2 * 60 * 1000) {
            setBtcData(cachedData);
            prevPriceRef.current = cachedData.currentPrice;
            setLoading(false);
          }
        } catch (error) {
          console.error('Erro ao carregar cache do BTC:', error);
        }
      }

      // 2. Buscar dados atualizados do CoinGecko (mesma API que CustomCryptoScreener)
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&sparkline=false',
          { next: { revalidate: 60 } } // Revalidar a cada 60 segundos
        );

        if (!response.ok) {
          console.warn(`CoinGecko API returned status ${response.status}. Using cached data.`);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data && data.length > 0) {
          const btc = data[0];
          const newBtcData = {
            currentPrice: btc.current_price,
            priceChange24h: btc.price_change_percentage_24h || 0,
          };

          // Trigger animation if price changed
          if (prevPriceRef.current !== newBtcData.currentPrice && prevPriceRef.current !== 0) {
            setIsUpdating(true);
            setTimeout(() => setIsUpdating(false), 800); // Animation duration
          }

          prevPriceRef.current = newBtcData.currentPrice;
          setBtcData(newBtcData);

          // Salvar no cache
          localStorage.setItem(CACHE_KEY, JSON.stringify(newBtcData));
          localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao buscar preço do BTC:', error);
        setLoading(false);
      }
    };

    fetchBtcPrice();

    // Atualizar a cada 1 minuto (mesma frequência da página /criptomoedas)
    const interval = setInterval(fetchBtcPrice, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !btcData) {
    return (
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
          background: 'linear-gradient(135deg, #f7931a, #ffb74d)',
        }}>
          <FontAwesomeIcon icon={faBitcoinSign} className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="h-6 bg-gray-300 rounded animate-pulse" style={{ width: '80%', opacity: 0.3 }}></div>
        </div>
      </div>
    );
  }

  if (!btcData) {
    return null;
  }

  const priceChangeColor = btcData.priceChange24h >= 0 ? '#10b981' : '#ef4444';
  const priceChangeSign = btcData.priceChange24h >= 0 ? '+' : '';

  return (
    <div className="flex items-center gap-3 px-2 transition-all duration-300 hover:scale-105">
      {/* Bitcoin Icon */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isUpdating ? 'animate-pulse scale-110' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, #f7931a, #ffb74d)',
        }}
      >
        <FontAwesomeIcon icon={faBitcoinSign} className="w-4 h-4 text-white" />
      </div>

      {/* Price with Rolling Animation */}
      <div className="flex-1 min-w-0">
        <div
          className={`text-xl font-bold rolling-number ${isUpdating ? 'updating' : ''}`}
          style={{ color: 'var(--text-primary)' }}
        >
          ${btcData.currentPrice.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}
        </div>

        {/* 24h Change Indicator */}
        <div
          className="text-xs font-semibold mt-0.5"
          style={{ color: priceChangeColor }}
        >
          {priceChangeSign}{btcData.priceChange24h.toFixed(2)}%
        </div>
      </div>

      {/* CSS for Rolling Number Animation */}
      <style jsx>{`
        @keyframes rollUp {
          0% {
            transform: translateY(0px);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0px);
            opacity: 1;
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(247, 147, 26, 0.3);
          }
          50% {
            text-shadow: 0 0 15px rgba(247, 147, 26, 0.6);
          }
        }

        .rolling-number {
          transition: all 0.3s ease-in-out;
        }

        .rolling-number.updating {
          animation: rollUp 0.8s ease-in-out, glow 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
}
