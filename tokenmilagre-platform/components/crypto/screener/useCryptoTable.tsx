'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    createColumnHelper,
    SortingState,
    ColumnFiltersState,
    flexRender,
} from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { CryptoData } from '@/lib/domains/crypto/hooks/useCryptoData';

const columnHelper = createColumnHelper<CryptoData>();

export function useCryptoTable(data: CryptoData[]) {
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'market_cap_rank', desc: false }
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const columns = useMemo(
        () => [
            columnHelper.accessor('market_cap_rank', {
                header: '#',
                cell: info => (
                    <span className="font-mono text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {info.getValue()}
                    </span>
                ),
                size: 50,
            }),
            columnHelper.accessor('name', {
                header: 'Nome',
                cell: info => {
                    const slug = info.row.original.id; // CoinGecko ID
                    return (
                        <Link
                            href={`/criptomoedas/${slug}`}
                            className="flex items-center gap-3 hover:opacity-70 transition-opacity"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={info.row.original.image}
                                alt={info.getValue()}
                                className="w-6 h-6 rounded-full"
                            />
                            <div>
                                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                    {info.getValue()}
                                </p>
                                <p className="text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                                    {info.row.original.symbol}
                                </p>
                            </div>
                        </Link>
                    );
                },
                size: 200,
            }),
            columnHelper.accessor('current_price', {
                header: 'Preço',
                cell: info => (
                    <span className="font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
                        ${info.getValue().toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: info.getValue() < 1 ? 6 : 2
                        })}
                    </span>
                ),
                size: 120,
            }),
            columnHelper.accessor('price_change_percentage_24h', {
                header: '24h %',
                cell: info => {
                    const value = info.getValue();
                    const isPositive = value >= 0;
                    return (
                        <div className="flex items-center gap-1">
                            <FontAwesomeIcon
                                icon={isPositive ? faArrowUp : faArrowDown}
                                className={`w-3 h-3 ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
                            />
                            <span className={`font-semibold font-mono ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
                                }`}>
                                {Math.abs(value).toFixed(2)}%
                            </span>
                        </div>
                    );
                },
                size: 100,
            }),
            columnHelper.accessor('market_cap', {
                header: 'Market Cap',
                cell: info => (
                    <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                        ${(info.getValue() / 1e9).toFixed(2)}B
                    </span>
                ),
                size: 130,
            }),
            columnHelper.accessor('total_volume', {
                header: 'Volume 24h',
                cell: info => (
                    <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                        ${(info.getValue() / 1e9).toFixed(2)}B
                    </span>
                ),
                size: 130,
            }),
            columnHelper.accessor('sparkline_in_7d.price', {
                header: '7 Dias',
                cell: info => {
                    const prices = info.getValue() || [];
                    if (prices.length === 0) return <span style={{ color: 'var(--text-tertiary)' }}>—</span>;

                    const firstPrice = prices[0];
                    const lastPrice = prices[prices.length - 1];
                    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
                    const isPositive = change >= 0;

                    return (
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-8 relative">
                                <svg width="100" height="32" className="overflow-visible">
                                    <polyline
                                        fill="none"
                                        stroke={isPositive ? '#10B981' : '#EF4444'}
                                        strokeWidth="1.5"
                                        points={prices.map((price, i) => {
                                            const x = (i / (prices.length - 1)) * 100;
                                            const minPrice = Math.min(...prices);
                                            const maxPrice = Math.max(...prices);
                                            const y = 28 - ((price - minPrice) / (maxPrice - minPrice)) * 24;
                                            return `${x},${y}`;
                                        }).join(' ')}
                                    />
                                </svg>
                            </div>
                        </div>
                    );
                },
                size: 120,
            }),
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
    });

    return {
        table,
        globalFilter,
        setGlobalFilter,
    };
}
