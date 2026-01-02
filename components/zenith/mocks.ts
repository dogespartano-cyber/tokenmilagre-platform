import type { MarketData, FearGreedData, NewsItem } from '@/app/components/home/types';

export const mockMarketData: MarketData = {
    totalMarketCap: 2540000000000,
    totalVolume: 85000000000,
    btcDominance: 52.4,
    ethDominance: 16.8,
    marketCapChange24h: 2.5,
    volumeChange24h: 15.2,
};

export const mockFearGreed: FearGreedData = {
    value: "75",
    value_classification: "Greed",
};

export const mockDailyAnalysis: NewsItem = {
    id: "1",
    slug: "bitcoin-rompe-resistencia-100k",
    title: "Bitcoin Rompe Resistência Histórica e Almeja $100k",
    summary: "Análise técnica detalhada mostra que o Bitcoin superou a média móvel de 200 dias com volume institucional recorde. O cenário macroeconômico favorece ativos de risco.",
    publishedAt: new Date().toISOString(),
    category: ["Análise", "Bitcoin"],
    sentiment: "positive",
    keywords: ["BTC", "Bull Run", "ETF"],
};

export const mockMarketDataNegative: MarketData = {
    ...mockMarketData,
    marketCapChange24h: -5.2,
    volumeChange24h: -10.5,
    btcDominance: 48.0,
};

export const mockFearGreedExtreme: FearGreedData = {
    value: "15",
    value_classification: "Extreme Fear",
};
