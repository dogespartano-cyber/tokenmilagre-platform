/**
 * @module home/TopCryptosSection
 * @description Seção Top 10 Criptomoedas para a Home - Design harmonioso
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
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
                <div className="flex items-center justify-center p-12 rounded-3xl bg-gradient-to-br from-gray-500/10 to-slate-500/5 border border-gray-500/20">
                    <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-primary)]">
                    Top 10 Criptomoedas
                </h2>
                <Link
                    href="/criptomoedas"
                    className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                >
                    Ver Todas <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {top10.map((crypto) => (
                    <Link
                        key={crypto.id}
                        href={`/criptomoedas?search=${crypto.symbol}`}
                        className={`
                            group relative overflow-hidden rounded-3xl
                            bg-gradient-to-br from-gray-500/10 to-slate-500/5 border border-gray-500/20 
                            hover:shadow-xl hover:shadow-gray-500/10
                            p-4 flex flex-col items-center justify-center gap-3
                            min-h-[140px]
                            transition-all duration-300
                        `}
                    >
                        {/* Rank Badge */}
                        <div className="absolute top-2 left-2 text-xs font-bold text-[var(--text-tertiary)]">
                            #{crypto.market_cap_rank}
                        </div>

                        {/* Logo */}
                        <div className="w-10 h-10 relative">
                            <Image
                                src={crypto.image}
                                alt={crypto.name}
                                fill
                                className="object-contain"
                                sizes="40px"
                            />
                        </div>

                        {/* Info */}
                        <div className="text-center">
                            <p className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                                {crypto.symbol.toUpperCase()}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">
                                ${crypto.current_price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Price Change */}
                        <div className={`text-xs font-bold ${crypto.price_change_percentage_24h >= 0
                                ? 'text-emerald-500'
                                : 'text-red-500'
                            }`}>
                            {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                            {crypto.price_change_percentage_24h?.toFixed(2)}%
                        </div>

                        {/* Decorative Gradient */}
                        <div className={`
                            absolute -bottom-10 -right-10 w-20 h-20 blur-[40px] rounded-full
                            opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none
                            bg-gray-500/10
                        `} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
