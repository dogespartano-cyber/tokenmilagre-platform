'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';

interface CryptoData {
  currentPrice: number;
}

interface CryptoPriceWidgetProps {
  symbol: 'BTC' | 'ETH' | 'SOL';
  coingeckoId: string;
}

// Componente SVG para Solana
const SolanaIcon = () => (
  <svg viewBox="0 0 397.7 311.7" className="w-full h-full">
    <defs>
      <linearGradient id="solana-gradient" x1="360.9" y1="351.9" x2="141.2" y2="132.2" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#00ffa3"/>
        <stop offset="1" stopColor="#dc1fff"/>
      </linearGradient>
    </defs>
    <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#solana-gradient)"/>
    <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#solana-gradient)"/>
    <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#solana-gradient)"/>
  </svg>
);

const cryptoConfig = {
  BTC: {
    icon: () => <FontAwesomeIcon icon={faBitcoin} className="w-full h-full" style={{ color: '#f7931a' }} />,
    color: '#f7931a'
  },
  ETH: {
    icon: () => <FontAwesomeIcon icon={faEthereum} className="w-full h-full" style={{ color: '#627eea' }} />,
    color: '#627eea'
  },
  SOL: {
    icon: SolanaIcon,
    color: '#14f195'
  },
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
          <Icon />
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
        <Icon />
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
