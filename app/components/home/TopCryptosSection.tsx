/**
 * @module home/TopCryptosSection
 * @description Seção Top 10 Criptomoedas - Design "Floating Rows" (Linhas Flutuantes)
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowUp, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useCryptoData } from '@/lib/domains/crypto/hooks/useCryptoData';

export function TopCryptosSection() {
    const { data, loading } = useCryptoData();

    // Top 10 apenas
    const top10 = data.slice(0, 10);

    if (loading && data.length === 0) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-primary)]">
                    Top 10 Criptomoedas
                </h2>
                <div className="flex items-center justify-center p-12 rounded-3xl bg-white dark:zenith-glass">
                    <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-primary)]">
                    Top 10 Criptomoedas
                </h2>
            </div>

            {/* Grid Header labels (Desktop only, subtle) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] select-none">
                <div className="col-span-1">#</div>
                <div className="col-span-4 lg:col-span-3">Nome</div>
                <div className="col-span-3 lg:col-span-2 text-right">Preço</div>
                <div className="col-span-2 text-right">24h %</div>
                <div className="col-span-2 text-right hidden lg:block">Market Cap</div>
                <div className="col-span-2 text-right hidden lg:block">Volume 24h</div>
            </div>

            {/* Rows Stack */}
            <div className="space-y-3">
                {top10.map((crypto) => (
                    <Link
                        key={crypto.id}
                        href={`/criptomoedas/${crypto.id}`}
                        className="
                            group block
                            relative overflow-hidden rounded-2xl
                            bg-white dark:bg-zinc-900/40 dark:backdrop-blur-md
                            border border-zinc-100 dark:border-white/5
                            transition-all duration-300
                            hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20
                            hover:border-zinc-200 dark:hover:border-white/10
                        "
                    >
                        {/* Interactive row content */}
                        <div className="grid grid-cols-12 gap-4 items-center p-4">

                            {/* Rank */}
                            <div className="col-span-2 md:col-span-1 font-mono text-sm text-[var(--text-tertiary)] group-hover:text-[var(--brand-primary)] transition-colors">
                                {crypto.market_cap_rank}
                            </div>

                            {/* Name & Icon */}
                            <div className="col-span-6 md:col-span-4 lg:col-span-3 flex items-center gap-3">
                                <div className="w-8 h-8 relative flex-shrink-0 transition-transform group-hover:scale-110">
                                    <Image
                                        src={crypto.image}
                                        alt={crypto.name}
                                        fill
                                        className="object-contain rounded-full"
                                        sizes="32px"
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[var(--text-primary)] leading-tight">
                                        {crypto.name}
                                    </p>
                                    <p className="text-xs text-[var(--text-tertiary)] uppercase font-medium">
                                        {crypto.symbol}
                                    </p>
                                </div>
                            </div>

                            {/* Price (Right aligned on mobile to match expected reading pattern) */}
                            <div className="col-span-4 md:col-span-3 lg:col-span-2 text-right">
                                <span className="font-bold font-mono text-sm text-[var(--text-primary)]">
                                    ${crypto.current_price.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: crypto.current_price < 1 ? 6 : 2
                                    })}
                                </span>
                            </div>

                            {/* 24h Change */}
                            <div className="col-span-4 md:col-span-2 text-right hidden md:block">
                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${crypto.price_change_percentage_24h >= 0
                                    ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                                    : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                                    }`}>
                                    <FontAwesomeIcon
                                        icon={crypto.price_change_percentage_24h >= 0 ? faArrowUp : faArrowDown}
                                        className="w-3 h-3"
                                    />
                                    <span className="font-bold font-mono text-xs">
                                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                                    </span>
                                </div>
                            </div>

                            {/* Mobile 24h Change (Visible only on small screens, below price maybe? or absolute? 
                                Actually, in the grid above, mobile takes 2+6+4=12 cols. 
                                Rank(2) + Name(6) + Price(4). 
                                Where does 24h go on mobile?
                                Let's put it under price or name? 
                                Usually separate col is best.
                                Let's adjust mobile grid: Rank(1) Name(5) Price(3) 24h(3)?
                             */}
                            <div className="col-span-12 md:hidden flex justify-end mt-2 gap-4 border-t border-zinc-50 dark:border-white/5 pt-2">
                                <span className="text-xs text-[var(--text-tertiary)]">24h:</span>
                                <div className={`flex items-center gap-1 ${crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    <FontAwesomeIcon
                                        icon={crypto.price_change_percentage_24h >= 0 ? faArrowUp : faArrowDown}
                                        className="w-3 h-3"
                                    />
                                    <span className="font-bold font-mono text-xs">
                                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                                    </span>
                                </div>
                            </div>


                            {/* Market Cap */}
                            <div className="col-span-2 text-right hidden lg:block">
                                <span className="font-mono text-sm text-[var(--text-secondary)]">
                                    ${(crypto.market_cap / 1e9).toFixed(2)}B
                                </span>
                            </div>

                            {/* Volume */}
                            <div className="col-span-2 text-right hidden lg:block">
                                <span className="font-mono text-sm text-[var(--text-secondary)]">
                                    ${(crypto.total_volume / 1e9).toFixed(2)}B
                                </span>
                            </div>

                        </div>
                    </Link>
                ))}
            </div>


        </div>
    );
}
