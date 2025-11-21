'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoinSign } from '@fortawesome/free-solid-svg-icons';
import { TokenETH, TokenXRP, TokenSOL, TokenBNB } from '@token-icons/react';

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

    // Se for símbolo ($ ou , ou .), renderizar estático com mesma altura dos números
    if (digit === '$' || digit === ',' || digit === '.') {
        return (
            <span
                className="inline-block text-center"
                style={{
                    width: digit === '$' ? '0.6em' : '0.3em',
                    height: '1.2em',
                    lineHeight: '1.2em',
                }}
            >
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
          vertical-align: middle;
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
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
        </span>
    );
}

// ============================================================================
// NavbarCryptoTicker - Main Component
// ============================================================================

interface CryptoData {
    id: string;
    symbol: string;
    currentPrice: number;
    priceChange24h: number;
}

export default function NavbarCryptoTicker() {
    const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // SINCRONIZAÇÃO ABSOLUTA: Usar o MESMO cache que CustomCryptoScreener
    const CACHE_KEY = 'coingecko_crypto_data';
    const CACHE_TIMESTAMP_KEY = 'coingecko_cache_timestamp';
    const CACHE_EXPIRATION_MS = 2 * 60 * 1000; // 2 minutos

    const TARGET_COINS = ['bitcoin', 'ethereum', 'ripple', 'binancecoin', 'solana'];

    useEffect(() => {
        const loadCryptoPrices = async () => {
            try {
                // STEP 1: Tentar carregar do cache
                const cachedData = localStorage.getItem(CACHE_KEY);
                const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

                // STEP 2: Validar se cache existe e é recente (< 2 min)
                const isCacheValid =
                    cachedData &&
                    cachedTimestamp &&
                    Date.now() - parseInt(cachedTimestamp) < CACHE_EXPIRATION_MS;

                let cryptoList = [];

                if (isCacheValid) {
                    // Cache válido: Usar
                    cryptoList = JSON.parse(cachedData!);
                } else {
                    // STEP 3: Cold Start ou cache expirado - Fazer fetch
                    // Se não tiver cache válido, tentamos fazer fetch, mas se falhar usamos o cache antigo se existir
                    try {
                        console.log('🚀 [NavbarCryptoTicker] Cold Start: Fazendo fetch na CoinGecko...');
                        const response = await fetch(
                            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h'
                        );

                        if (response.ok) {
                            cryptoList = await response.json();
                            // STEP 4: Salvar no cache compartilhado
                            localStorage.setItem(CACHE_KEY, JSON.stringify(cryptoList));
                            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
                        } else if (cachedData) {
                            // Fallback para cache antigo se API falhar
                            console.warn('API falhou, usando cache antigo');
                            cryptoList = JSON.parse(cachedData);
                        }
                    } catch (err) {
                        console.error('Erro no fetch:', err);
                        if (cachedData) cryptoList = JSON.parse(cachedData);
                    }
                }

                // STEP 5: Filtrar e processar dados
                if (cryptoList && cryptoList.length > 0) {
                    const filteredData = cryptoList
                        .filter((coin: any) => TARGET_COINS.includes(coin.id))
                        .map((coin: any) => ({
                            id: coin.id,
                            symbol: coin.symbol.toUpperCase(),
                            currentPrice: coin.current_price,
                            priceChange24h: coin.price_change_percentage_24h
                        }))
                        .sort((a: CryptoData, b: CryptoData) => {
                            return TARGET_COINS.indexOf(a.id) - TARGET_COINS.indexOf(b.id);
                        });

                    setCryptoData(filteredData);
                    setLoading(false);

                    if (isInitialLoad) {
                        setTimeout(() => setIsInitialLoad(false), 2000);
                    }
                }
            } catch (error) {
                console.error('❌ [NavbarCryptoTicker] Erro ao carregar preços:', error);
            }
        };

        // Carregar imediatamente
        loadCryptoPrices();

        // Monitorar mudanças no localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === CACHE_KEY) {
                loadCryptoPrices();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(loadCryptoPrices, 5000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [isInitialLoad]);

    const getIcon = (symbol: string) => {
        switch (symbol) {
            case 'BTC': return <FontAwesomeIcon icon={faBitcoinSign} className="w-5 h-5 text-[#F7931A]" />;
            case 'ETH': return <TokenETH size={20} variant="branded" />;
            case 'XRP': return <TokenXRP size={20} variant="branded" />;
            case 'BNB': return <TokenBNB size={20} variant="branded" />;
            case 'SOL': return <TokenSOL size={20} variant="branded" />;
            default: return null;
        }
    };

    const getCoinSlug = (id: string) => {
        const slugMap: Record<string, string> = {
            'bitcoin': 'bitcoin',
            'ethereum': 'ethereum',
            'ripple': 'xrp',
            'binancecoin': 'bnb',
            'solana': 'solana'
        };
        return slugMap[id] || id;
    };

    if (loading && cryptoData.length === 0) {
        return (
            <div className="flex items-center justify-center gap-8 w-full animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-24 bg-gray-200/20 rounded"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-8 w-full">
            {cryptoData.map((coin) => {
                // Formatar preço
                const priceStr = coin.currentPrice < 10
                    ? `$${coin.currentPrice.toFixed(2)}`
                    : `$${Math.round(coin.currentPrice).toLocaleString('en-US')}`;

                const priceDigits = priceStr.split('');

                return (
                    <Link
                        key={coin.id}
                        href={`/criptomoedas/${getCoinSlug(coin.id)}`}
                        className="flex items-center gap-3 shrink-0 group cursor-pointer transition-transform hover:scale-105"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors shadow-sm">
                            {getIcon(coin.symbol)}
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{coin.symbol}</span>
                                <div
                                    className="flex items-center text-lg font-bold font-mono leading-none"
                                    style={{ color: 'var(--text-primary)', letterSpacing: '0.02em' }}
                                >
                                    {priceDigits.map((digit, index) => (
                                        <RollingDigit
                                            key={`${coin.id}-${index}-${digit}`}
                                            digit={digit}
                                            isInitialLoad={isInitialLoad}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
