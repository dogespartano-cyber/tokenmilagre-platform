/**
 * 🌀 Crypto Domain - useBinanceData Hook
 * 
 * @agi-domain: crypto
 * @agi-pattern: fractal auto-similar
 * 
 * Hook for fetching and processing Binance market data with technical indicators.
 */

import { useState, useEffect } from 'react';
import {
    calculateSMA,
    calculateRSI,
    calculateMACD,
    calculateBollingerBands,
    calculateTrendSignal,
} from '@/lib/shared/utils/technical-analysis';
import type { BinanceData, TechnicalIndicators, UseBinanceDataResult } from '../types';

/**
 * Fetch Binance candle data and calculate technical indicators
 * 
 * @param symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @param interval - Candle interval (e.g., '4h', '1d')
 * @returns Data, indicators, loading state, and error
 */
export const useBinanceData = (symbol: string, interval: string = '4h'): UseBinanceDataResult => {
    const [data, setData] = useState<BinanceData[]>([]);
    const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch 500 candles (enough for SMA200)
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

                setData(formattedData);

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

                setIndicators({
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
                });

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                // Only log in development
                if (process.env.NODE_ENV === 'development') {
                    console.error('Error fetching Binance data:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Refresh every minute
        const intervalId = setInterval(fetchData, 60000);
        return () => clearInterval(intervalId);

    }, [symbol, interval]);

    return { data, indicators, loading, error };
};
