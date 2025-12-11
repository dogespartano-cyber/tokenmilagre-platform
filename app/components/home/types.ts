/**
 * @module home/types
 * @description Tipos compartilhados para os componentes da Home Page
 * @agi-purpose Centralizar interfaces para reutilização fractal
 */

export interface MarketData {
    totalMarketCap: number;
    totalVolume: number;
    btcDominance: number;
    ethDominance: number;
    marketCapChange24h: number;
    volumeChange24h: number; // Nova propriedade
}

export interface FearGreedData {
    value: string;
    value_classification: string;
}

export interface NewsItem {
    id: string;
    slug?: string;
    title: string;
    summary: string;
    publishedAt: string;
    category: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    keywords?: string[];
}

export interface EducationItem {
    id: string;
    slug: string;
    title: string;
    summary: string;
    level: string;
    readTime: string;
}

export interface ResourceItem {
    name: string;
    category: string;
    description: string;
    gradient: string;
    stats: string;
    verified: boolean;
    url: string;
}

/**
 * Props para componentes que recebem dados de mercado
 */
export interface MarketDataProps {
    marketData: MarketData | null;
    loading?: boolean;
    fearGreed?: FearGreedData | null;
    gaugeValue?: number;
}

/**
 * Props para componentes que recebem Fear & Greed
 */
export interface FearGreedProps {
    fearGreed: FearGreedData | null;
    gaugeValue: number;
}

/**
 * Props para Daily Analysis
 */
export interface DailyAnalysisProps {
    dailyAnalysis: NewsItem | null;
    marketData: MarketData | null;
}

/**
 * Props para seções de conteúdo
 */
export interface ContentSectionProps {
    items: NewsItem[] | EducationItem[];
}
