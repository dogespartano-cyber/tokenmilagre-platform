'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoinSign } from '@fortawesome/free-solid-svg-icons';

// ============================================================================
// RollingDigit Component - Odometer/Slot Machine Effect
// ============================================================================

interface RollingDigitProps {
  digit: string;
  isInitialLoad: boolean;
}

function RollingDigit({ digit, isInitialLoad }: RollingDigitProps) {
  const [currentDigit, setCurrentDigit] = useState(isInitialLoad ? '0' : digit);
  const prevDigitRef = useRef(digit);

  useEffect(() => {
    // Trigger animation when digit changes
    if (digit !== currentDigit) {
      setCurrentDigit(digit);
    }
    prevDigitRef.current = digit;
  }, [digit]);

  // Se for símbolo ($ ou ,), renderizar estático
  if (digit === '$' || digit === ',') {
    return (
      <span className="inline-block" style={{ width: digit === '$' ? '0.6em' : '0.4em' }}>
        {digit}
      </span>
    );
  }

  // Números de 0 a 9 em coluna vertical
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const targetIndex = numbers.indexOf(currentDigit);

  return (
    <span className="rolling-digit-container">
      <span
        className="rolling-digit-strip"
        style={{
          transform: `translateY(-${targetIndex * 10}%)`,
        }}
      >
        {numbers.map((num, i) => (
          <span key={i} className="rolling-digit-number">
            {num}
          </span>
        ))}
      </span>

      <style jsx>{`
        .rolling-digit-container {
          display: inline-block;
          width: 0.6em;
          height: 1.2em;
          overflow: hidden;
          position: relative;
          text-align: center;
        }

        .rolling-digit-strip {
          display: flex;
          flex-direction: column;
          transition: transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: transform;
        }

        .rolling-digit-number {
          display: block;
          height: 1.2em;
          line-height: 1.2em;
        }
      `}</style>
    </span>
  );
}

// ============================================================================
// BtcPriceWidget - Main Component
// ============================================================================

interface BtcData {
  currentPrice: number;
}

export default function BtcPriceWidget() {
  const [btcData, setBtcData] = useState<BtcData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // SINCRONIZAÇÃO ABSOLUTA: Usar o MESMO cache que CustomCryptoScreener
  const CACHE_KEY = 'coingecko_crypto_data';  // ← Mesmo cache!
  const CACHE_TIMESTAMP_KEY = 'coingecko_cache_timestamp';

  useEffect(() => {
    const loadBtcPrice = () => {
      try {
        // Carregar do cache (MESMO cache que CustomCryptoScreener)
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

        if (cachedData && cachedTimestamp) {
          const cryptoList = JSON.parse(cachedData);

          // Extrair Bitcoin do array de 100 moedas
          const btc = cryptoList.find(
            (crypto: any) =>
              crypto.id === 'bitcoin' ||
              crypto.symbol?.toLowerCase() === 'btc'
          );

          if (btc) {
            setBtcData({
              currentPrice: btc.current_price,
            });
            setLoading(false);

            // Após primeira animação, desativar isInitialLoad
            if (isInitialLoad) {
              setTimeout(() => setIsInitialLoad(false), 2000);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar preço do BTC do cache:', error);
      }
    };

    // Carregar imediatamente
    loadBtcPrice();

    // Monitorar mudanças no localStorage (quando CustomCryptoScreener atualizar)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CACHE_KEY) {
        loadBtcPrice();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Polling a cada 5 segundos para verificar cache atualizado
    // (storage event não funciona na mesma aba)
    const interval = setInterval(loadBtcPrice, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isInitialLoad]);

  if (loading && !btcData) {
    return (
      <div className="flex items-center gap-3 px-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #f7931a, #ffb74d)',
          }}
        >
          <FontAwesomeIcon icon={faBitcoinSign} className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div
            className="h-6 bg-gray-300 rounded animate-pulse"
            style={{ width: '80%', opacity: 0.3 }}
          ></div>
        </div>
      </div>
    );
  }

  if (!btcData) {
    return null;
  }

  // Formatar preço com separador de milhares
  const formattedPrice = `$${btcData.currentPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

  // Converter em array de caracteres para animação digit-by-digit
  const priceDigits = formattedPrice.split('');

  return (
    <div className="flex items-center gap-3 px-2 transition-all duration-300 hover:scale-105">
      {/* Bitcoin Icon */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:rotate-12"
        style={{
          background: 'linear-gradient(135deg, #f7931a, #ffb74d)',
        }}
      >
        <FontAwesomeIcon icon={faBitcoinSign} className="w-4 h-4 text-white" />
      </div>

      {/* Price with Odometer Animation */}
      <div className="flex-1 min-w-0">
        <div
          className="text-xl font-bold font-mono"
          style={{ color: 'var(--text-primary)', letterSpacing: '0.02em' }}
        >
          {priceDigits.map((digit, index) => (
            <RollingDigit
              key={`${index}-${digit}`}
              digit={digit}
              isInitialLoad={isInitialLoad}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
