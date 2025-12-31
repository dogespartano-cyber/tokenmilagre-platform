/**
 * 🧪 Crypto Domain Tests
 * 
 * Tests for crypto domain hooks and utilities.
 * Tests use mocked fetch calls to avoid external API dependencies.
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useBinanceData } from '../hooks/useBinanceData';
import { useHolderCount } from '../hooks/useHolderCount';

// Mock fetch globally
global.fetch = jest.fn();

// Mock technical analysis functions
jest.mock('@/lib/shared/utils/technical-analysis', () => ({
    calculateSMA: jest.fn(() => Array(500).fill(50000)),
    calculateRSI: jest.fn(() => Array(500).fill(55)),
    calculateMACD: jest.fn(() => ({
        macdLine: Array(500).fill(100),
        signalLine: Array(500).fill(80),
        histogram: Array(500).fill(20),
    })),
    calculateBollingerBands: jest.fn(() => ({
        upper: Array(500).fill(52000),
        middle: Array(500).fill(50000),
        lower: Array(500).fill(48000),
    })),
    calculateTrendSignal: jest.fn(() => ({
        score: 3,
        exactScore: 65,
        label: 'BUY',
    })),
}));

// Sample Binance API response (OHLCV format)
const mockBinanceResponse = Array(500).fill(null).map((_, i) => [
    Date.now() - (500 - i) * 3600000, // time
    '50000.00', // open
    '50500.00', // high
    '49500.00', // low
    '50200.00', // close
    '1000.00',  // volume
    Date.now() - (500 - i) * 3600000 + 3599999, // close time
    '50000000.00', // quote volume
    100,        // trades
    '500.00',   // taker buy base
    '25000000.00', // taker buy quote
    '0'         // ignore
]);

describe('Crypto Domain', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('useBinanceData', () => {
        it('should fetch data and calculate indicators on mount', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockBinanceResponse,
            });

            const { result } = renderHook(() => useBinanceData('BTCUSDT', '4h'));

            // Initial state should be loading
            expect(result.current.loading).toBe(true);
            expect(result.current.data).toEqual([]);
            expect(result.current.indicators).toBeNull();

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Should have data and indicators after loading
            expect(result.current.data).toHaveLength(500);
            expect(result.current.indicators).not.toBeNull();
            expect(result.current.error).toBeNull();
        });

        it('should handle fetch errors gracefully', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            const { result } = renderHook(() => useBinanceData('BTCUSDT'));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.error).toBe('Failed to fetch data from Binance');
            expect(result.current.data).toEqual([]);
        });

        it('should handle network errors', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(
                new Error('Network error')
            );

            const { result } = renderHook(() => useBinanceData('BTCUSDT'));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.error).toBe('Network error');
        });

        it('should call Binance API with correct parameters', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockBinanceResponse,
            });

            renderHook(() => useBinanceData('ETHUSDT', '1d'));

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.stringContaining('symbol=ETHUSDT')
                );
            });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('interval=1d')
            );
        });
    });

    describe('useHolderCount', () => {
        it('should start with loading state', () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ result: { value: [{ account: 'test' }] } }),
            });

            const { result } = renderHook(() => useHolderCount());

            expect(result.current.loading).toBe(true);
            expect(result.current.count).toBeNull();
        });

        // Note: Full error handling test requires mocking @solana/web3.js
        // which is complex due to class-based SDK
    });

    describe('Types', () => {
        it('should export correct constants', () => {
            const { TOKEN_ADDRESS, SOLANA_RPC_URL, TOKEN_PROGRAM_ID } = require('../types');

            expect(TOKEN_ADDRESS).toBeDefined();
            expect(SOLANA_RPC_URL).toBe('https://api.mainnet-beta.solana.com');
            expect(TOKEN_PROGRAM_ID).toBe('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
        });
    });
});
