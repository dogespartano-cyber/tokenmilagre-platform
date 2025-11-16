'use client';

import { useState, useEffect } from 'react';
import { BTC, ETH, SOL } from 'react-crypto-icons';

interface CryptoData {
  currentPrice: number;
}

interface CryptoPriceWidgetProps {
  symbol: 'BTC' | 'ETH' | 'SOL';
  coingeckoId: string;
}

const cryptoConfig = {
  BTC: { icon: BTC, color: '#f7931a' },
  ETH: { icon: ETH, color: '#627eea' },
  SOL: { icon: SOL, color: '#14f195' },
};

export default function CryptoPriceWidget({ symbol, coingeckoId }: CryptoPriceWidgetProps) {
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);

  const config = cryptoConfig[symbol];
  const Icon = config.icon;

  useEffect(() => {
    const fetchCryptoPrice = async () => {
      const CACHE_KEY = `crypto_price_${symbol.toLowerCase()}`;

      // 1. Carregar do cache imediatamente
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          setCryptoData(cachedData);
          setLoading(false);
        } catch (error) {
          console.error(`Erro ao carregar cache do ${symbol}:`, error);
        }
      }

      // 2. Buscar dados atualizados em background
      try {
        const response = await fetch('/api/crypto/top');
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          // Buscar crypto específica
          const crypto = result.data.find((c: any) =>
            c.symbol.toLowerCase() === symbol.toLowerCase() ||
            c.coingeckoId === coingeckoId
          );

          if (crypto) {
            const cryptoInfo = {
              currentPrice: crypto.currentPrice,
            };
            setCryptoData(cryptoInfo);
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cryptoInfo));
            setLoading(false);
          }
        }
      } catch (error) {
        console.error(`Erro ao buscar preço do ${symbol}:`, error);
        setLoading(false);
      }
    };

    fetchCryptoPrice();

    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchCryptoPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [symbol, coingeckoId]);

  if (loading && !cryptoData) {
    return (
      <div className="flex items-center gap-3 px-2">
        <div className="w-7 h-7">
          <Icon size={28} />
        </div>
        <div className="flex-1">
          <div className="h-5 bg-gray-300 rounded animate-pulse" style={{ width: '70%', opacity: 0.3 }}></div>
        </div>
      </div>
    );
  }

  if (!cryptoData) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 px-2 transition-all duration-300 hover:scale-105">
      {/* Crypto Icon */}
      <div className="w-7 h-7 transition-transform duration-300 hover:rotate-12">
        <Icon size={28} />
      </div>

      {/* Price */}
      <div className="flex-1 min-w-0">
        <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          ${cryptoData.currentPrice.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: symbol === 'BTC' ? 0 : 2
          })}
        </div>
      </div>
    </div>
  );
}
