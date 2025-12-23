import { useState, useEffect, useCallback } from 'react';
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
    price_change_percentage_1h_in_currency?: number;
    price_change_percentage_7d_in_currency?: number;
    circulating_supply: number;
    sparkline_in_7d?: {
        price: number[];
    };
}

const CACHE_KEY = 'coingecko_crypto_data';
const CACHE_TIMESTAMP_KEY = 'coingecko_cache_timestamp';
const FETCH_INTERVAL = 60000; // 1 minute

// Global State
interface GlobalState {
    data: CryptoData[];
    loading: boolean;
    usingCache: boolean;
    lastUpdate: Date | null;
    error: Error | null;
}

let globalState: GlobalState = {
    data: [],
    loading: true,
    usingCache: false,
    lastUpdate: null,
    error: null,
};

let activePromise: Promise<void> | null = null;
let lastFetchTime = 0;
const listeners = new Set<() => void>();

// Helper to notify all hooks
const notifyListeners = () => {
    listeners.forEach((listener) => listener());
};

// Internal function to load cache
const loadCacheInternal = () => {
    try {
        if (typeof window === 'undefined') return;
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

        if (cachedData && cachedTimestamp) {
            globalState.data = JSON.parse(cachedData);
            globalState.lastUpdate = new Date(parseInt(cachedTimestamp));
            globalState.usingCache = true;
            globalState.loading = false;
        }
    } catch (error) {
        console.warn('Error loading cache:', error);
    }
};

// Initial cache load
loadCacheInternal();

// Shared Fetch Function
const fetchGlobalData = async (forceString?: string) => {
    // Prevent multiple simultaneous requests
    if (activePromise) return activePromise;

    // Throttle requests (unless forced, but even then be careful)
    const now = Date.now();
    if (!forceString && now - lastFetchTime < FETCH_INTERVAL && globalState.data.length > 0) {
        return Promise.resolve();
    }

    lastFetchTime = now;
    globalState.loading = true;
    notifyListeners();

    activePromise = (async () => {
        try {
            const response = await fetch('/api/crypto/markets');

            if (!response.ok) {
                const statusError = new Error(`CoinGecko API returned status ${response.status}`);

                // Handle 429 Too Many Requests simply by using cache
                if (response.status === 429) {
                    console.warn('CoinGecko API Rate Limit (429). Using cached data.');
                    globalState.usingCache = true;
                } else {
                    Sentry.captureException(statusError, {
                        tags: { component: 'useCryptoData', api: 'coingecko', status: response.status.toString() },
                        level: 'warning',
                    });
                }

                // Fallback to cache if request fails
                if (globalState.data.length === 0) {
                    loadCacheInternal();
                }

                globalState.loading = false;
                notifyListeners();
                return;
            }

            const json = await response.json();
            globalState.data = json;
            globalState.lastUpdate = new Date();
            globalState.usingCache = false;
            globalState.loading = false;
            globalState.error = null;

            // Save to cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(json));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (error) {
            console.warn('Error fetching crypto data:', error);
            globalState.error = error as Error;
            globalState.loading = false;

            // Fallback to cache
            if (globalState.data.length === 0) {
                loadCacheInternal();
            }
            globalState.usingCache = true;

            Sentry.captureException(error, {
                tags: { component: 'useCryptoData', api: 'coingecko' },
                level: 'error',
            });
        } finally {
            activePromise = null;
            notifyListeners();
        }
    })();

    return activePromise;
};

export function useCryptoData() {
    const [state, setState] = useState(globalState);

    useEffect(() => {
        const listener = () => setState({ ...globalState });
        listeners.add(listener);

        // Trigger initial fetch if needed
        if (Date.now() - lastFetchTime > FETCH_INTERVAL) {
            fetchGlobalData();
        } else {
            // Even if we don't fetch, we might need to sync local state if the component mounted after a fetch completed but before a re-render
            setState({ ...globalState });
        }

        // Setup interval for this component (it will just call fetchGlobalData which handles throttling)
        const interval = setInterval(() => {
            fetchGlobalData();
        }, FETCH_INTERVAL);

        return () => {
            listeners.delete(listener);
            clearInterval(interval);
        };
    }, []);

    const getTimeAgo = useCallback((date: Date | null) => {
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
    }, []);

    return {
        ...state,
        refresh: () => fetchGlobalData('force'),
        getTimeAgo
    };
}
