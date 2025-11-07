/**
 * Tipos centralizados para dados de mercado
 */

/**
 * Dados gerais de mercado
 */
export interface MarketData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
  fearGreedIndex?: number;
  fearGreedClassification?: string;
}

/**
 * Criptomoeda do CoinGecko
 */
export interface Cryptocurrency {
  id: string;
  coingeckoId: string;
  symbol: string;
  name: string;

  // Dados de Mercado
  currentPrice?: number | null;
  marketCap?: number | null;
  marketCapRank?: number | null;
  totalVolume?: number | null;
  high24h?: number | null;
  low24h?: number | null;
  priceChange24h?: number | null;
  priceChangePercentage24h?: number | null;
  circulatingSupply?: number | null;
  totalSupply?: number | null;
  maxSupply?: number | null;
  ath?: number | null;
  athDate?: Date | string | null;
  atl?: number | null;
  atlDate?: Date | string | null;

  // Informações Descritivas
  description?: string | null;
  homepage?: string | null;
  whitepaper?: string | null;
  blockchain?: string | null;

  // Links sociais (JSON)
  socialLinks?: string | null;

  // Imagens
  imageSmall?: string | null;
  imageLarge?: string | null;

  // Metadados
  slug?: string | null;
  lastUpdated: Date | string;
  createdAt: Date | string;
}

/**
 * OHLCV - Candlestick data
 */
export interface Candlestick {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

/**
 * Top criptomoeda (para listagens)
 */
export interface TopCrypto {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

/**
 * Fear & Greed Index response
 */
export interface FearGreedIndex {
  value: number;
  value_classification: string; // 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed'
  timestamp: string;
  time_until_update: string;
}
