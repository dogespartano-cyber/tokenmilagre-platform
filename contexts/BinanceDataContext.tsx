'use client';

/**
 * 🌀 BinanceDataContext
 * 
 * @agi-domain: crypto
 * @agi-pattern: fractal auto-similar
 * 
 * Context para compartilhar dados da Binance entre componentes,
 * evitando requisições duplicadas.
 */

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
    calculateSMA,
    calculateRSI,
    calculateMACD,
    calculateBollingerBands,
    calculateTrendSignal,
} from '@/lib/shared/utils/technical-analysis';
import type { BinanceData, TechnicalIndicators } from '@/lib/domains/crypto/types';

// ============================================
// TYPES
// ============================================

interface BinanceDataState {
    data: BinanceData[];
    indicators: TechnicalIndicators | null;
    loading: boolean;
    error: string | null;
}

interface BinanceDataContextType {
    /** Current symbol being tracked */
    symbol: string;
    /** Current interval */
    interval: string;
    /** Set the active symbol and interval */
    setSymbolAndInterval: (symbol: string, interval: string) => void;
    /** Raw candle data */
    data: BinanceData[];
    /** Calculated technical indicators */
    indicators: TechnicalIndicators | null;
    /** Loading state */
    loading: boolean;
    /** Error message if any */
    error: string | null;
}

const defaultContext: BinanceDataContextType = {
    symbol: 'BTCUSDT',
    interval: '4h',
    setSymbolAndInterval: () => { },
    data: [],
    indicators: null,
    loading: true,
    error: null,
};

const BinanceDataContext = createContext<BinanceDataContextType>(defaultContext);

// ============================================
// PROVIDER
// ============================================

interface BinanceDataProviderProps {
    children: ReactNode;
    initialSymbol?: string;
    initialInterval?: string;
}

export function BinanceDataProvider({
    children,
    initialSymbol = 'BTCUSDT',
    initialInterval = '4h'
}: BinanceDataProviderProps) {
    const [symbol, setSymbol] = useState(initialSymbol);
    const [interval, setInterval] = useState(initialInterval);
    const [state, setState] = useState<BinanceDataState>({
        data: [],
        indicators: null,
        loading: true,
        error: null,
    });

    const setSymbolAndInterval = useCallback((newSymbol: string, newInterval: string) => {
        setSymbol(newSymbol);
        setInterval(newInterval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setState(prev => ({ ...prev, loading: true, error: null }));

            try {
                const response = await fetch(
                    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=500`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch data from Binance');
                }

                const rawData: Array<Array<string | number>> = await response.json();

                const formattedData: BinanceData[] = rawData.map((candle) => ({
                    time: (candle[0] as number) / 1000,
                    open: parseFloat(candle[1] as string),
                    high: parseFloat(candle[2] as string),
                    low: parseFloat(candle[3] as string),
                    close: parseFloat(candle[4] as string),
                }));

                // Calculate Indicators
                const closes = formattedData.map((d) => d.close);

                const rsiValues = calculateRSI(closes);
                const macdValues = calculateMACD(closes);
                const sma50Values = calculateSMA(closes, 50);
                const sma200Values = calculateSMA(closes, 200);
                const bollingerValues = calculateBollingerBands(closes);

                const trend = calculateTrendSignal(
                    closes,
                    rsiValues,
                    macdValues.histogram,
                    sma50Values,
                    sma200Values,
                    { upper: bollingerValues.upper, lower: bollingerValues.lower }
                );

                const lastIndex = closes.length - 1;

                setState({
                    data: formattedData,
                    indicators: {
                        rsi: rsiValues[lastIndex],
                        macd: {
                            macdLine: macdValues.macdLine[lastIndex],
                            signalLine: macdValues.signalLine[lastIndex],
                            histogram: macdValues.histogram[lastIndex],
                        },
                        sma50: sma50Values[lastIndex],
                        sma200: sma200Values[lastIndex],
                        bollinger: {
                            upper: bollingerValues.upper[lastIndex],
                            middle: bollingerValues.middle[lastIndex],
                            lower: bollingerValues.lower[lastIndex],
                        },
                        trend
                    },
                    loading: false,
                    error: null,
                });

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: errorMessage,
                }));

                if (process.env.NODE_ENV === 'development') {
                    console.error('Error fetching Binance data:', err);
                }
            }
        };

        fetchData();

        // Refresh every minute
        const intervalId = window.setInterval(fetchData, 60000);
        return () => window.clearInterval(intervalId);

    }, [symbol, interval]);

    return (
        <BinanceDataContext.Provider
            value={{
                symbol,
                interval,
                setSymbolAndInterval,
                data: state.data,
                indicators: state.indicators,
                loading: state.loading,
                error: state.error,
            }}
        >
            {children}
        </BinanceDataContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

export function useBinanceContext() {
    const context = useContext(BinanceDataContext);
    if (!context) {
        throw new Error('useBinanceContext must be used within a BinanceDataProvider');
    }
    return context;
}

export { BinanceDataContext };
