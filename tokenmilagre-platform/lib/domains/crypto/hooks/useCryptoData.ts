import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export interface CryptoData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    price_change_percentage_24h: number;
    circulating_supply: number;
    sparkline_in_7d?: {
        price: number[];
    };
}

const CACHE_KEY = 'coingecko_crypto_data';
const CACHE_TIMESTAMP_KEY = 'coingecko_cache_timestamp';

export function useCryptoData() {
    const [data, setData] = useState<CryptoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [usingCache, setUsingCache] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    // Load cache on mount
    useEffect(() => {
        loadFromCache();
    }, []);

    // Fetch data periodically
    useEffect(() => {
        fetchCryptoData();
        const interval = setInterval(fetchCryptoData, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const loadFromCache = () => {
        try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

            if (cachedData && cachedTimestamp) {
                setData(JSON.parse(cachedData));
                setLastUpdate(new Date(parseInt(cachedTimestamp)));
                setUsingCache(true);
                setLoading(false);
            }
        } catch (error) {
            console.warn('Error loading cache:', error);
        }
    };

    const saveToCache = (data: CryptoData[]) => {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
            setLastUpdate(new Date());
        } catch (error) {
            console.warn('Error saving to cache:', error);
        }
    };

    const fetchCryptoData = async () => {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h'
            );

            if (!response.ok) {
                const statusError = new Error(`CoinGecko API returned status ${response.status}`);

                // Report to Sentry only if not expected rate limit
                if (response.status !== 429) {
                    Sentry.captureException(statusError, {
                        tags: {
                            component: 'useCryptoData',
                            api: 'coingecko',
                            status: response.status.toString(),
                        },
                        level: 'warning',
                    });
                }

                console.warn(`CoinGecko API returned status ${response.status}. Using cached data.`);
                if (data.length > 0) {
                    setUsingCache(true);
                }
                setLoading(false);
                return;
            }

            const json = await response.json();
            setData(json);
            saveToCache(json);
            setUsingCache(false);
            setLoading(false);
        } catch (error) {
            console.warn('Error fetching crypto data from CoinGecko:', error);

            Sentry.captureException(error, {
                tags: {
                    component: 'useCryptoData',
                    api: 'coingecko',
                },
                extra: {
                    hasCache: data.length > 0,
                    lastUpdate: lastUpdate?.toISOString(),
                },
                level: 'error',
            });

            if (data.length === 0) {
                loadFromCache();
            } else {
                setUsingCache(true);
            }
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        usingCache,
        lastUpdate,
        refresh: fetchCryptoData,
        getTimeAgo: (date: Date | null) => {
            if (!date) return '';
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'agora';
            if (diffMins < 60) return `${diffMins}min atrás`;
            if (diffHours < 24) return `${diffHours}h atrás`;
            return `${diffDays}d atrás`;
        }
    };
}
