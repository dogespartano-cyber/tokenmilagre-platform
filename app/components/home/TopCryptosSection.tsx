/**
 * @module home/TopCryptosSection
 * @description Seção Top 10 Criptomoedas para a Home - Design de Tabela
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faSpinner, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
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
            </div>

            <div className="rounded-3xl border border-gray-500/20 overflow-hidden bg-gradient-to-br from-gray-500/5 to-slate-500/5 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: 'var(--border-light)' }}>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>#</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Nome</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Preço</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>24h %</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>Market Cap</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>Volume 24h</th>
                            </tr>
                        </thead>
                        <tbody>
                            {top10.map((crypto) => (
                                <tr
                                    key={crypto.id}
                                    className="border-b last:border-0 transition-colors duration-200 hover:bg-white/5"
                                    style={{ borderColor: 'var(--border-light)' }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                            {crypto.market_cap_rank}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={`/criptomoedas/${crypto.id}`}
                                            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                                        >
                                            <div className="w-8 h-8 relative flex-shrink-0">
                                                <Image
                                                    src={crypto.image}
                                                    alt={crypto.name}
                                                    fill
                                                    className="object-contain rounded-full"
                                                    sizes="32px"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm group-hover:text-[var(--brand-primary)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                                                    {crypto.name}
                                                </p>
                                                <p className="text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                                                    {crypto.symbol}
                                                </p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                                            ${crypto.current_price.toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: crypto.current_price < 1 ? 6 : 2
                                            })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <FontAwesomeIcon
                                                icon={crypto.price_change_percentage_24h >= 0 ? faArrowUp : faArrowDown}
                                                className={`w-3 h-3 ${crypto.price_change_percentage_24h >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
                                            />
                                            <span className={`font-semibold font-mono text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                                                {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                        <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                                            ${(crypto.market_cap / 1e9).toFixed(2)}B
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                        <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                                            ${(crypto.total_volume / 1e9).toFixed(2)}B
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
