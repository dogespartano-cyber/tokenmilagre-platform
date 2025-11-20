/**
 * Unit Tests for Binance Adapter
 *
 * Tests Binance API integration with mocked HTTP responses
 */

import { BinanceAdapter } from '../binance-adapter';
import { server } from '@/__tests__/setup-msw';
import { http, HttpResponse } from 'msw';

// Mock the logger to avoid console output in tests
jest.mock('@/lib/di/container', () => ({
  ServiceLocator: {
    getLogger: () => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    }),
  },
}));

describe('BinanceAdapter', () => {
  let adapter: BinanceAdapter;

  beforeEach(() => {
    adapter = new BinanceAdapter();
  });

  describe('constructor', () => {
    it('should create instance with default config', () => {
      expect(adapter).toBeInstanceOf(BinanceAdapter);
    });

    it('should accept custom baseURL', () => {
      const customAdapter = new BinanceAdapter({
        baseURL: 'https://custom.binance.com',
      });
      expect(customAdapter).toBeInstanceOf(BinanceAdapter);
    });

    it('should accept custom timeout', () => {
      const customAdapter = new BinanceAdapter({
        timeout: 5000,
      });
      expect(customAdapter).toBeInstanceOf(BinanceAdapter);
    });
  });

  describe('getKlines', () => {
    it('should fetch candlestick data successfully', async () => {
      const klines = await adapter.getKlines('BTCUSDT', '1d', 3);

      expect(klines).toHaveLength(3);
      expect(klines[0]).toHaveProperty('openTime');
      expect(klines[0]).toHaveProperty('open');
      expect(klines[0]).toHaveProperty('high');
      expect(klines[0]).toHaveProperty('low');
      expect(klines[0]).toHaveProperty('close');
      expect(klines[0]).toHaveProperty('volume');
      expect(klines[0]).toHaveProperty('closeTime');
    });

    it('should handle default limit parameter', async () => {
      const klines = await adapter.getKlines('BTCUSDT', '1h');

      expect(klines).toBeDefined();
      expect(Array.isArray(klines)).toBe(true);
    });

    it('should fetch different intervals', async () => {
      const intervals = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];

      for (const interval of intervals) {
        const klines = await adapter.getKlines('BTCUSDT', interval, 1);
        expect(klines).toBeDefined();
        expect(klines.length).toBeGreaterThan(0);
      }
    });

    it('should handle API errors gracefully', async () => {
      await expect(adapter.getKlines('INVALID', '1d', 10)).rejects.toThrow(
        'Binance API error'
      );
    });

    it('should handle timeout errors', async () => {
      // Create adapter with very short timeout
      const timeoutAdapter = new BinanceAdapter({ timeout: 1 });

      // Mock delayed response
      server.use(
        http.get('https://api.binance.com/api/v3/klines', async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json([]);
        })
      );

      await expect(timeoutAdapter.getKlines('BTCUSDT', '1d', 10)).rejects.toThrow();
    });

    it('should parse candlestick data correctly', async () => {
      const klines = await adapter.getKlines('BTCUSDT', '1d', 1);

      expect(typeof klines[0].openTime).toBe('number');
      expect(typeof klines[0].open).toBe('string');
      expect(typeof klines[0].high).toBe('string');
      expect(typeof klines[0].low).toBe('string');
      expect(typeof klines[0].close).toBe('string');
      expect(typeof klines[0].volume).toBe('string');
      expect(typeof klines[0].closeTime).toBe('number');
      expect(typeof klines[0].trades).toBe('number');
    });
  });

  describe('get24hrTicker', () => {
    it('should fetch 24hr ticker data successfully', async () => {
      const ticker = await adapter.get24hrTicker('BTCUSDT');

      expect(ticker).toHaveProperty('symbol', 'BTCUSDT');
      expect(ticker).toHaveProperty('priceChange');
      expect(ticker).toHaveProperty('priceChangePercent');
      expect(ticker).toHaveProperty('lastPrice');
      expect(ticker).toHaveProperty('volume');
      expect(ticker).toHaveProperty('highPrice');
      expect(ticker).toHaveProperty('lowPrice');
    });

    it('should fetch ticker for different symbols', async () => {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

      for (const symbol of symbols) {
        const ticker = await adapter.get24hrTicker(symbol);
        expect(ticker.symbol).toBe(symbol);
      }
    });

    it('should handle API errors gracefully', async () => {
      await expect(adapter.get24hrTicker('INVALID')).rejects.toThrow('Binance API error');
    });

    it('should parse ticker data with correct types', async () => {
      const ticker = await adapter.get24hrTicker('BTCUSDT');

      expect(typeof ticker.symbol).toBe('string');
      expect(typeof ticker.priceChange).toBe('string');
      expect(typeof ticker.priceChangePercent).toBe('string');
      expect(typeof ticker.lastPrice).toBe('string');
      expect(typeof ticker.volume).toBe('string');
      expect(typeof ticker.openTime).toBe('number');
      expect(typeof ticker.closeTime).toBe('number');
      expect(typeof ticker.count).toBe('number');
    });

    it('should include all required ticker fields', async () => {
      const ticker = await adapter.get24hrTicker('BTCUSDT');

      const requiredFields = [
        'symbol',
        'priceChange',
        'priceChangePercent',
        'weightedAvgPrice',
        'prevClosePrice',
        'lastPrice',
        'bidPrice',
        'askPrice',
        'openPrice',
        'highPrice',
        'lowPrice',
        'volume',
        'quoteVolume',
        'openTime',
        'closeTime',
      ];

      requiredFields.forEach(field => {
        expect(ticker).toHaveProperty(field);
      });
    });
  });

  describe('getCurrentPrice', () => {
    it('should fetch current price successfully', async () => {
      const price = await adapter.getCurrentPrice('BTCUSDT');

      expect(typeof price).toBe('number');
      expect(price).toBeGreaterThan(0);
    });

    it('should fetch prices for different symbols', async () => {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];

      for (const symbol of symbols) {
        const price = await adapter.getCurrentPrice(symbol);
        expect(typeof price).toBe('number');
        expect(price).toBeGreaterThan(0);
      }
    });

    it('should handle API errors gracefully', async () => {
      await expect(adapter.getCurrentPrice('INVALID')).rejects.toThrow('Binance API error');
    });

    it('should return different prices for different symbols', async () => {
      const btcPrice = await adapter.getCurrentPrice('BTCUSDT');
      const ethPrice = await adapter.getCurrentPrice('ETHUSDT');

      expect(btcPrice).not.toBe(ethPrice);
    });

    it('should parse price as number correctly', async () => {
      const price = await adapter.getCurrentPrice('BTCUSDT');

      expect(Number.isFinite(price)).toBe(true);
      expect(price).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      server.use(
        http.get('https://api.binance.com/api/v3/ticker/price', () => {
          return HttpResponse.error();
        })
      );

      await expect(adapter.getCurrentPrice('BTCUSDT')).rejects.toThrow();
    });

    it('should handle 500 server errors', async () => {
      server.use(
        http.get('https://api.binance.com/api/v3/ticker/price', () => {
          return new HttpResponse('Internal Server Error', { status: 500 });
        })
      );

      await expect(adapter.getCurrentPrice('BTCUSDT')).rejects.toThrow('Binance API error');
    });

    it('should handle 429 rate limit errors', async () => {
      server.use(
        http.get('https://api.binance.com/api/v3/klines', () => {
          return new HttpResponse('Too Many Requests', { status: 429 });
        })
      );

      await expect(adapter.getKlines('BTCUSDT', '1d')).rejects.toThrow('Binance API error');
    });
  });

  describe('edge cases', () => {
    it('should handle empty symbol', async () => {
      await expect(adapter.getCurrentPrice('')).rejects.toThrow();
    });

    it('should handle very large limit', async () => {
      const klines = await adapter.getKlines('BTCUSDT', '1d', 1000);
      expect(klines).toBeDefined();
      expect(Array.isArray(klines)).toBe(true);
    });

    it('should handle special characters in symbol', async () => {
      // This should fail validation at API level
      await expect(adapter.getCurrentPrice('BTC@#$')).rejects.toThrow();
    });
  });
});
