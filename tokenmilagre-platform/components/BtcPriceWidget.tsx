'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoinSign } from '@fortawesome/free-solid-svg-icons';

interface BtcData {
  currentPrice: number;
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

  return (
    <div className="flex items-center gap-3 px-2 transition-all duration-300 hover:scale-105">
      {/* Bitcoin Icon */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:rotate-12" style={{
        background: 'linear-gradient(135deg, #f7931a, #ffb74d)',
      }}>
        <FontAwesomeIcon icon={faBitcoinSign} className="w-4 h-4 text-white" />
      </div>

      {/* Price */}
      <div className="flex-1 min-w-0">
        <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          ${btcData.currentPrice.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}
        </div>
      </div>
    </div>
  );
}
