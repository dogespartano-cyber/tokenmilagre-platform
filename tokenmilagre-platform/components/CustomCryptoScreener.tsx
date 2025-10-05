'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faArrowDown,
  faSearch,
  faChevronLeft,
  faChevronRight,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

const columnHelper = createColumnHelper<CryptoData>();

export default function CustomCryptoScreener() {
  const [data, setData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'market_cap_rank', desc: false }
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Fetch data from CoinGecko
  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h'
      );
      const json = await response.json();
      setData(json);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setLoading(false);
    }
  };

  // Define columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('market_cap_rank', {
        header: '#',
        cell: info => (
          <span className="text-[#64748B] font-mono text-sm">
            {info.getValue()}
          </span>
        ),
        size: 50,
      }),
      columnHelper.accessor('name', {
        header: 'Nome',
        cell: info => (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={info.row.original.image}
              alt={info.getValue()}
              className="w-6 h-6 rounded-full"
            />
            <div>
              <p className="text-[#E0E6ED] font-semibold text-sm">
                {info.getValue()}
              </p>
              <p className="text-[#64748B] text-xs uppercase">
                {info.row.original.symbol}
              </p>
            </div>
          </div>
        ),
        size: 200,
      }),
      columnHelper.accessor('current_price', {
        header: 'Preço',
        cell: info => (
          <span className="text-[#FFFFFF] font-semibold font-mono">
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
              <span className={`font-semibold font-mono ${
                isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
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
          <span className="text-[#94A3B8] font-mono">
            ${(info.getValue() / 1e9).toFixed(2)}B
          </span>
        ),
        size: 130,
      }),
      columnHelper.accessor('total_volume', {
        header: 'Volume 24h',
        cell: info => (
          <span className="text-[#94A3B8] font-mono">
            ${(info.getValue() / 1e9).toFixed(2)}B
          </span>
        ),
        size: 130,
      }),
      columnHelper.accessor('sparkline_in_7d.price', {
        header: '7 Dias',
        cell: info => {
          const prices = info.getValue() || [];
          if (prices.length === 0) return <span className="text-[#64748B]">—</span>;

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

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#142841] to-[#1E3A5F] rounded-2xl p-12 border-2 border-[#2A4A6E] shadow-xl">
        <div className="flex flex-col items-center justify-center gap-4">
          <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 text-[#10B981] animate-spin" />
          <p className="text-[#94A3B8] text-lg">Carregando dados do mercado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#142841] to-[#1E3A5F] rounded-2xl border-2 border-[#2A4A6E] shadow-xl overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-[#2A4A6E]/60">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4"
          />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Buscar criptomoeda..."
            className="w-full bg-[#0A1628] border border-[#2A4A6E] rounded-lg pl-12 pr-4 py-3 text-[#E0E6ED] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-[#2A4A6E]/60">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-[#94A3B8] text-xs font-semibold uppercase tracking-wider cursor-pointer hover:text-[#E0E6ED] transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3 text-[#10B981]" />,
                        desc: <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3 text-[#10B981]" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="border-b border-[#2A4A6E]/30 hover:bg-[#1E3A5F]/50 transition-colors duration-200"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-[#2A4A6E]/60 flex items-center justify-between">
        <div className="text-[#94A3B8] text-sm">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          de {table.getFilteredRowModel().rows.length} resultados
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 bg-[#0A1628] border border-[#2A4A6E] rounded-lg text-[#E0E6ED] hover:bg-[#1E3A5F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
          </button>
          <span className="text-[#94A3B8] text-sm px-4">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-[#0A1628] border border-[#2A4A6E] rounded-lg text-[#E0E6ED] hover:bg-[#1E3A5F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
