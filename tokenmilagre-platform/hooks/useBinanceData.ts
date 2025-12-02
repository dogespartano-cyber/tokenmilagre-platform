import { useState, useEffect } from 'react';
import {
    calculateSMA,
    calculateRSI,
    calculateMACD,
    calculateBollingerBands,
    calculateTrendSignal,
    TrendSignal
} from '@/lib/utils/technical-analysis';

export interface BinanceData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface TechnicalIndicators {
    rsi: number | null;
    macd: {
        macdLine: number | null;
        signalLine: number | null;
        histogram: number | null;
    };
    sma50: number | null;
    sma200: number | null;
    bollinger: {
        upper: number | null;
        middle: number | null;
        lower: number | null;
    };
    trend: {
        score: number;
        exactScore: number;
        label: TrendSignal;
        breakdown?: {
            rsiScore: number;
            macdScore: number;
            sma50Score: number;
            sma200Score: number;
            crossScore: number;
        };
    };
}

export const useBinanceData = (symbol: string, interval: string = '4h') => {
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
                    sma200Values
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
                setError(err instanceof Error ? err.message : 'Unknown error');
                console.error('Error fetching Binance data:', err);
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
