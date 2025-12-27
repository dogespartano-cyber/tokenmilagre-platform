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
export { FearGreedGauge } from './FearGreedGauge';
export { DailyAnalysisCard } from './DailyAnalysisCard';
export { QuickStartGrid } from './QuickStartGrid';
export { LatestNewsGrid } from './LatestNewsGrid';
export { LearnCryptoSection } from './LearnCryptoSection';
export { PriceChartSection } from './PriceChartSection';
export { TopCryptosSection } from './TopCryptosSection';
export { LoadingSkeleton } from './LoadingSkeleton';
export { ZenithHeroHUD } from './ZenithHeroHUD';
export { ZenithMarketTicker } from './ZenithMarketTicker';
export { FeaturedResourcesSection } from './FeaturedResourcesSection';
export { CryptoCuriosities } from './CryptoCuriosities';


