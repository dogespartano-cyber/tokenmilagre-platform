/**
 * MSW Mock Handlers for Binance API
 *
 * Mocks Binance API endpoints for testing without external dependencies
 */

import { http, HttpResponse } from 'msw';

/**
 * Mock candlestick data
 * Format: [openTime, open, high, low, close, volume, closeTime, quoteVolume, trades, buyBaseVolume, buyQuoteVolume]
 */
const mockKlines = [
  [1699920000000, '43500.00', '43800.00', '43200.00', '43650.00', '1234.56', 1699923600000, '53750000.00', 12500, '617.28', '26875000.00'],
  [1699923600000, '43650.00', '44000.00', '43500.00', '43900.00', '1456.78', 1699927200000, '63890000.00', 14200, '728.39', '31945000.00'],
  [1699927200000, '43900.00', '44200.00', '43750.00', '44100.00', '1567.89', 1699930800000, '69180000.00', 15800, '783.95', '34590000.00'],
];

/**
 * Mock 24hr ticker data
 */
const mock24hrTicker = {
  symbol: 'BTCUSDT',
  priceChange: '850.00',
  priceChangePercent: '1.97',
  weightedAvgPrice: '43245.67',
  prevClosePrice: '43150.00',
  lastPrice: '44000.00',
  lastQty: '0.025',
  bidPrice: '43995.00',
  bidQty: '1.234',
  askPrice: '44005.00',
  askQty: '0.987',
  openPrice: '43150.00',
  highPrice: '44500.00',
  lowPrice: '42800.00',
  volume: '12345.67',
  quoteVolume: '534567890.12',
  openTime: 1699920000000,
  closeTime: 1700006400000,
  firstId: 1234567890,
  lastId: 1234667890,
  count: 100000,
};

/**
 * Mock price data
 */
const mockPrice = {
  symbol: 'BTCUSDT',
  price: '44000.00',
};

/**
 * Binance API mock handlers
 */
export const binanceHandlers = [
  // GET /api/v3/klines - Candlestick data
  http.get('https://api.binance.com/api/v3/klines', ({ request }) => {
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol');
    const interval = url.searchParams.get('interval');
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);

    // Simulate error for invalid symbol
    if (symbol === 'INVALID') {
      return new HttpResponse(
        JSON.stringify({ code: -1121, msg: 'Invalid symbol.' }),
        { status: 400 }
      );
    }

    // Return limited number of candles
    const candles = mockKlines.slice(0, Math.min(limit, mockKlines.length));

    return HttpResponse.json(candles);
  }),

  // GET /api/v3/ticker/24hr - 24hr ticker statistics
  http.get('https://api.binance.com/api/v3/ticker/24hr', ({ request }) => {
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol');

    // Simulate error for invalid symbol
    if (symbol === 'INVALID') {
      return new HttpResponse(
        JSON.stringify({ code: -1121, msg: 'Invalid symbol.' }),
        { status: 400 }
      );
    }

    return HttpResponse.json({
      ...mock24hrTicker,
      symbol: symbol || 'BTCUSDT',
    });
  }),

  // GET /api/v3/ticker/price - Current price
  http.get('https://api.binance.com/api/v3/ticker/price', ({ request }) => {
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol');

    // Simulate error for invalid symbol
    if (symbol === 'INVALID') {
      return new HttpResponse(
        JSON.stringify({ code: -1121, msg: 'Invalid symbol.' }),
        { status: 400 }
      );
    }

    // Return different prices for different symbols
    const prices: Record<string, string> = {
      BTCUSDT: '44000.00',
      ETHUSDT: '2300.00',
      SOLUSDT: '95.50',
      BNBUSDT: '310.25',
    };

    return HttpResponse.json({
      symbol: symbol || 'BTCUSDT',
      price: prices[symbol || 'BTCUSDT'] || '1.00',
    });
  }),
];

/**
 * Mock data generators for custom test scenarios
 */
export const binanceMockData = {
  /**
   * Generate custom candlestick data
   */
  generateKlines(count: number, basePrice: number = 44000) {
    const klines = [];
    let currentTime = Date.now() - count * 3600000; // 1 hour intervals
    let price = basePrice;

    for (let i = 0; i < count; i++) {
      const open = price;
      const close = price + (Math.random() - 0.5) * 1000;
      const high = Math.max(open, close) + Math.random() * 500;
      const low = Math.min(open, close) - Math.random() * 500;
      const volume = (Math.random() * 2000).toFixed(2);

      klines.push([
        currentTime,
        open.toFixed(2),
        high.toFixed(2),
        low.toFixed(2),
        close.toFixed(2),
        volume,
        currentTime + 3600000,
        (parseFloat(volume) * ((high + low) / 2)).toFixed(2),
        Math.floor(Math.random() * 20000),
        (parseFloat(volume) * 0.5).toFixed(2),
        (parseFloat(volume) * ((high + low) / 2) * 0.5).toFixed(2),
      ]);

      currentTime += 3600000;
      price = close;
    }

    return klines;
  },

  /**
   * Generate custom ticker data
   */
  generateTicker(symbol: string, price: number) {
    return {
      symbol,
      priceChange: (price * 0.02).toFixed(2),
      priceChangePercent: '2.00',
      weightedAvgPrice: (price * 0.99).toFixed(2),
      prevClosePrice: (price * 0.98).toFixed(2),
      lastPrice: price.toFixed(2),
      lastQty: '0.025',
      bidPrice: (price - 5).toFixed(2),
      bidQty: '1.234',
      askPrice: (price + 5).toFixed(2),
      askQty: '0.987',
      openPrice: (price * 0.98).toFixed(2),
      highPrice: (price * 1.05).toFixed(2),
      lowPrice: (price * 0.95).toFixed(2),
      volume: '12345.67',
      quoteVolume: '534567890.12',
      openTime: Date.now() - 86400000,
      closeTime: Date.now(),
      firstId: 1234567890,
      lastId: 1234667890,
      count: 100000,
    };
  },
};
