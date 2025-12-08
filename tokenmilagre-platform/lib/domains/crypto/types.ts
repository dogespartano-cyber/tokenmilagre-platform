/**
 * 🌀 Crypto Domain - Types
 * 
 * @agi-domain: crypto
 * @agi-pattern: fractal auto-similar
 * 
 * Shared types for crypto-related hooks and components.
 */

import type { TrendSignal } from '@/lib/shared/utils/technical-analysis';

// ============================================
// BINANCE DATA TYPES
// ============================================

/**
 * Candlestick data from Binance API
 */
export interface BinanceData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

/**
 * Technical indicators calculated from price data
 */
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

/**
 * Result from useBinanceData hook
 */
export interface UseBinanceDataResult {
    data: BinanceData[];
    indicators: TechnicalIndicators | null;
    loading: boolean;
    error: string | null;
}

// ============================================
// HOLDER COUNT TYPES
// ============================================

/**
 * Result from useHolderCount hook
 */
export interface UseHolderCountResult {
    count: number | null;
    loading: boolean;
    error: string | null;
}

// ============================================
// CONSTANTS
// ============================================

/**
 * $MILAGRE token address on Solana
 */
export const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

/**
 * Solana RPC URL
 */
export const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';

/**
 * Solana Token Program ID
 */
export const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
