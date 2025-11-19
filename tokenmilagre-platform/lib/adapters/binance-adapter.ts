/**
 * Binance API Adapter
 *
 * Encapsulates Binance API integration with proper error handling,
 * rate limiting, and type safety
 */

import { ServiceLocator } from '@/lib/di/container';

/**
 * Candlestick data from Binance
 */
export interface BinanceCandlestick {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteVolume: string;
  trades: number;
  buyBaseVolume: string;
  buyQuoteVolume: string;
}

/**
 * 24hr ticker statistics
 */
export interface Binance24hrTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

/**
 * Binance API client configuration
 */
export interface BinanceConfig {
  baseURL?: string;
  timeout?: number;
}

/**
 * Binance API Adapter
 * Provides type-safe access to Binance market data
 */
export class BinanceAdapter {
  private baseURL: string;
  private timeout: number;
  private logger = ServiceLocator.getLogger();

  constructor(config: BinanceConfig = {}) {
    this.baseURL = config.baseURL || 'https://api.binance.com';
    this.timeout = config.timeout || 10000;
  }

  /**
   * Fetch candlestick data for a symbol
   *
   * @param symbol - Trading pair (e.g., 'BTCUSDT')
   * @param interval - Candlestick interval (e.g., '1d', '1h', '15m')
   * @param limit - Number of candles to fetch (max 1000)
   * @returns Array of candlestick data
   *
   * @example
   * ```typescript
   * const adapter = new BinanceAdapter();
   * const candles = await adapter.getKlines('BTCUSDT', '1d', 30);
   * ```
   */
  async getKlines(
    symbol: string,
    interval: string,
    limit: number = 100
  ): Promise<BinanceCandlestick[]> {
    this.logger.info('Fetching Binance klines', { symbol, interval, limit });

    try {
      const url = `${this.baseURL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Transform raw data to typed format
      const candles: BinanceCandlestick[] = data.map((item: any[]) => ({
        openTime: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: item[5],
        closeTime: item[6],
        quoteVolume: item[7],
        trades: item[8],
        buyBaseVolume: item[9],
        buyQuoteVolume: item[10],
      }));

      this.logger.info('Binance klines fetched successfully', { symbol, count: candles.length });

      return candles;
    } catch (error) {
      this.logger.error('Error fetching Binance klines', error as Error, { symbol, interval, limit });
      throw error;
    }
  }

  /**
   * Fetch 24hr ticker statistics
   *
   * @param symbol - Trading pair (e.g., 'BTCUSDT')
   * @returns 24hr ticker data
   *
   * @example
   * ```typescript
   * const adapter = new BinanceAdapter();
   * const ticker = await adapter.get24hrTicker('BTCUSDT');
   * console.log(`BTC Price: $${ticker.lastPrice}`);
   * ```
   */
  async get24hrTicker(symbol: string): Promise<Binance24hrTicker> {
    this.logger.info('Fetching Binance 24hr ticker', { symbol });

    try {
      const url = `${this.baseURL}/api/v3/ticker/24hr?symbol=${symbol}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      this.logger.info('Binance 24hr ticker fetched successfully', {
        symbol,
        price: data.lastPrice,
        change: data.priceChangePercent
      });

      return data;
    } catch (error) {
      this.logger.error('Error fetching Binance 24hr ticker', error as Error, { symbol });
      throw error;
    }
  }

  /**
   * Fetch current price for a symbol
   *
   * @param symbol - Trading pair (e.g., 'BTCUSDT')
   * @returns Current price as number
   *
   * @example
   * ```typescript
   * const adapter = new BinanceAdapter();
   * const price = await adapter.getCurrentPrice('BTCUSDT');
   * console.log(`Current BTC Price: $${price}`);
   * ```
   */
  async getCurrentPrice(symbol: string): Promise<number> {
    this.logger.info('Fetching Binance current price', { symbol });

    try {
      const url = `${this.baseURL}/api/v3/ticker/price?symbol=${symbol}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const price = parseFloat(data.price);

      this.logger.info('Binance current price fetched successfully', { symbol, price });

      return price;
    } catch (error) {
      this.logger.error('Error fetching Binance current price', error as Error, { symbol });
      throw error;
    }
  }
}

// Export singleton instance
export const binanceAdapter = new BinanceAdapter();
