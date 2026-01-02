/**
 * @module home
 * @description Exports centralizados para componentes da Home Page
 * @agi-purpose Ponto de entrada único seguindo padrão fractal
 */

// Types
export * from './types';

// Hooks
export { useHomeData } from './hooks/useHomeData';
export { useFearGreed } from './hooks/useFearGreed';

// Components
export { MarketDataCards } from './MarketDataCards';

export { DailyAnalysisCard } from './DailyAnalysisCard';
export { QuickStartGrid } from './QuickStartGrid';
export { LatestNewsGrid } from './LatestNewsGrid';
export { LearnCryptoSection } from './LearnCryptoSection';
export { PriceChartSection } from './PriceChartSection';
export { TopCryptosSection } from './TopCryptosSection';
export { LoadingSkeleton } from './LoadingSkeleton';
export { ZenithHeroHUD, ZenithMarketTicker, FearGreedGauge } from '@/components/zenith';
export { FeaturedResourcesSection } from './FeaturedResourcesSection';
export { CryptoCuriosities } from './CryptoCuriosities';


