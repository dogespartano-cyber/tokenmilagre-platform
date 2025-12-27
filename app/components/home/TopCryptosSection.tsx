/**
 * @module home/TopCryptosSection
 * @description Seção Top 10 Criptomoedas - Design "Unified Zenith Table" com Gráficos Sparkline
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowUp, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useCryptoData } from '@/lib/domains/crypto/hooks/useCryptoData';
import ZenithCard from '@/components/ui/ZenithCard';

// --- Sparkline Component ---
function SimpleSparkline({ data, isUp }: { data: number[]; isUp: boolean }) {
  if (!data || data.length === 0) return null;

  const width = 120;
  const height = 40;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  // Normalize data points to fit SVG size
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    // Invert Y because SVG 0 is top
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const color = isUp ? '#10B981' : '#EF4444'; // Green-500 : Red-500 to match Tailwind vars

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Helper for percent color
const getPercentColor = (val: number) => {
  if (val >= 0) return '';
  return '';
};

export function TopCryptosSection() {
  const { data, loading } = useCryptoData();

  // Top 10 apenas
  const top10 = data.slice(0, 10);

  // Grid Layout - New Density
  // LG Desktop (12) : # (1) | Name (2) | Price (2) | 1h (1) | 24h (1) | 7d (1) | MCap (2) | Chart (2)
  // MD Tablet (12) : # (1) | Name (3) | Price (2) | 24h (2) | 7d (2) | Chart (2)
  // Mobile (12)   : # (2) | Name (5) | Price (5)

  const gridCols = "grid grid-cols-12 gap-4 px-6 items-center";

  if (loading && data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl title-newtab ">
            Top 10 Criptomoedas
          </h2>
        </div>
        <div className="flex items-center justify-center p-20 rounded-3xl zenith-glass">
          <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <Link
          href="/criptomoedas"
          className="group inline-flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
          title="Ver Todas as Criptomoedas"
        >
          <h2 className="text-2xl title-newtab group-hover:text-[var(--brand-primary)] transition-colors">
            Top 10 Criptomoedas
          </h2>
        </Link>
      </div>

      {/* Unified Glass Table Container */}
      <ZenithCard variant="glass" hoverEffect={false} className="!p-0 flex flex-col overflow-hidden">

        {/* Table Header */}
        <div className={`${gridCols} py-4 border-b border-[var(--border-light)] bg-[var(--bg-tertiary)]/30 text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)] select-none`}>
          <div className="col-span-2 md:col-span-1 text-center md:text-left">#</div>
          <div className="col-span-5 md:col-span-3 lg:col-span-2">Nome</div>
          <div className="col-span-5 md:col-span-2 lg:col-span-2 text-right">Preço</div>

          {/* 1h - Desktop Only */}
          <div className="col-span-1 text-right hidden lg:block">1h</div>

          {/* 24h - Tablet/Desktop */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 text-right hidden md:block">24h</div>

          {/* 7d - Tablet/Desktop */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 text-right hidden md:block">7d</div>

          {/* MCap - Desktop Only */}
          <div className="col-span-2 text-right hidden lg:block">M.Cap</div>

          {/* Chart - Tablet/Desktop */}
          <div className="col-span-2 md:col-span-2 text-right hidden md:block">Últimos 7 dias</div>
        </div>

        {/* Rows Container */}
        <div className="divide-y divide-[var(--border-light)]">
          {top10.map((crypto) => {
            const priceData = crypto.sparkline_in_7d?.price || [];
            const isUp = priceData.length > 1 ? priceData[priceData.length - 1] >= priceData[0] : true;
            const change1h = crypto.price_change_percentage_1h_in_currency || 0;
            const change24h = crypto.price_change_percentage_24h || 0;
            const change7d = crypto.price_change_percentage_7d_in_currency || 0;

            return (
              <Link
                key={crypto.id}
                href={`/criptomoedas/${crypto.id}`}
                className={`
                  ${gridCols} py-4
                  group
                  hover:bg-[var(--brand-primary)]/5 
                  transition-colors duration-200
                `}
              >
                {/* Rank */}
                <div className="col-span-2 md:col-span-1 font-mono text-sm text-[var(--text-tertiary)] text-center md:text-left group-hover:text-[var(--brand-primary)] transition-colors">
                  {crypto.market_cap_rank}
                </div>

                {/* Name & Icon */}
                <div className="col-span-5 md:col-span-3 lg:col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 relative flex-shrink-0 transition-transform group-hover:scale-110">
                    <Image
                      src={crypto.image}
                      alt={crypto.name}
                      fill
                      className="object-contain rounded-full"
                      sizes="32px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm leading-tight truncate">
                      {crypto.name}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] uppercase font-medium">
                      {crypto.symbol}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-5 md:col-span-2 lg:col-span-2 text-right">
                  <span className="font-bold font-mono text-sm ">
                    ${crypto.current_price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: crypto.current_price < 1 ? 6 : 2
                    })}
                  </span>
                  {/* Mobile Only: 24h indicator below price */}
                  <div className="md:hidden flex justify-end items-center gap-1 mt-1">
                    <FontAwesomeIcon
                      icon={change24h >= 0 ? faArrowUp : faArrowDown}
                      className={`w-2 h-2 ${change24h >= 0 ? '' : ''}`}
                    />
                    <span className={`text-xs font-mono font-medium ${change24h >= 0 ? '' : ''}`}>
                      {Math.abs(change24h).toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* 1h (LG) */}
                <div className={`col-span-1 text-right hidden lg:block font-mono text-sm font-medium ${getPercentColor(change1h)}`}>
                  {change1h > 0 ? '+' : ''}{change1h.toFixed(1)}%
                </div>

                {/* 24h (MD/LG) */}
                <div className={`col-span-2 md:col-span-2 lg:col-span-1 text-right hidden md:block font-mono text-sm font-medium ${getPercentColor(change24h)}`}>
                  {change24h > 0 ? '+' : ''}{change24h.toFixed(1)}%
                </div>

                {/* 7d (MD/LG) */}
                <div className={`col-span-2 md:col-span-2 lg:col-span-1 text-right hidden md:block font-mono text-sm font-medium ${getPercentColor(change7d)}`}>
                  {change7d > 0 ? '+' : ''}{change7d.toFixed(1)}%
                </div>

                {/* Market Cap (LG) */}
                <div className="col-span-2 text-right hidden lg:block">
                  <span className="font-mono text-sm text-[var(--text-secondary)]">
                    ${(crypto.market_cap / 1e9).toFixed(2)}B
                  </span>
                </div>

                {/* Sparkline Chart */}
                <div className="col-span-2 md:col-span-2 lg:col-span-2 flex justify-end items-center hidden md:flex h-12">
                  <SimpleSparkline data={priceData} isUp={isUp} />
                </div>

              </Link>
            );
          })}
        </div>
      </ZenithCard>
    </div>
  );
}
