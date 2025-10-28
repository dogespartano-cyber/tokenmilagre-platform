'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
import * as Sentry from '@sentry/nextjs';

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

const CACHE_KEY = 'coingecko_crypto_data';
const CACHE_TIMESTAMP_KEY = 'coingecko_cache_timestamp';

export default function CustomCryptoScreener() {
  const [data, setData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingCache, setUsingCache] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'market_cap_rank', desc: false }
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Carregar cache do localStorage na montagem
  useEffect(() => {
    loadFromCache();
  }, []);

  // Fetch data from CoinGecko
  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadFromCache = () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (cachedData && cachedTimestamp) {
        setData(JSON.parse(cachedData));
        setLastUpdate(new Date(parseInt(cachedTimestamp)));
        setUsingCache(true);
        setLoading(false);
      }
    } catch (error) {
      console.warn('Error loading cache:', error);
    }
  };

  const saveToCache = (data: CryptoData[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      setLastUpdate(new Date());
    } catch (error) {
      console.warn('Error saving to cache:', error);
    }
  };

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h'
      );

      if (!response.ok) {
        const statusError = new Error(`CoinGecko API returned status ${response.status}`);

        // Reportar ao Sentry apenas se não for rate limit esperado
        if (response.status !== 429) {
          Sentry.captureException(statusError, {
            tags: {
              component: 'CustomCryptoScreener',
              api: 'coingecko',
              status: response.status.toString(),
            },
            level: 'warning',
          });
        }

        console.warn(`CoinGecko API returned status ${response.status}. Using cached data.`);
        // Se já temos dados em cache, apenas marca como usando cache
        if (data.length > 0) {
          setUsingCache(true);
        }
        setLoading(false);
        return;
      }

      const json = await response.json();
      setData(json);
      saveToCache(json); // Salva resposta válida no cache
      setUsingCache(false); // Dados são frescos da API
      setLoading(false);
    } catch (error) {
      console.warn('Error fetching crypto data from CoinGecko:', error);

      // Reportar erro ao Sentry com contexto
      Sentry.captureException(error, {
        tags: {
          component: 'CustomCryptoScreener',
          api: 'coingecko',
        },
        extra: {
          hasCache: data.length > 0,
          lastUpdate: lastUpdate?.toISOString(),
        },
        level: 'error',
      });

      // Se falhar, tenta usar cache se disponível
      if (data.length === 0) {
        loadFromCache();
      } else {
        setUsingCache(true);
      }
      setLoading(false);
    }
  };

  // Define columns
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
          const slug = info.row.original.id; // CoinGecko ID é usado como slug
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

  if (loading) {
    return (
      <div className="rounded-2xl p-12 border-2 shadow-xl" style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-medium)'
      }}>
        <div className="flex flex-col items-center justify-center gap-4">
          <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 animate-spin" style={{ color: 'var(--brand-primary)' }} />
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Carregando dados do mercado...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl p-12 border-2 shadow-xl" style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-medium)'
      }}>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-4xl">📊</div>
          <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Dados temporariamente indisponíveis</p>
          <p className="text-sm text-center max-w-md" style={{ color: 'var(--text-secondary)' }}>
            A API do CoinGecko pode estar com rate limit. Os dados serão atualizados automaticamente quando disponíveis.
          </p>
        </div>
      </div>
    );
  }

  // Função para formatar tempo atrás
  const getTimeAgo = (date: Date | null) => {
    if (!date) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${diffDays}d atrás`;
  };

  return (
    <div className="rounded-2xl border-2 shadow-xl overflow-hidden" style={{
      backgroundColor: 'var(--bg-elevated)',
      borderColor: 'var(--border-medium)'
    }}>
      {/* Search Bar */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Buscar criptomoeda..."
            className="w-full border rounded-lg pl-12 pr-4 py-3 focus:outline-none transition-colors"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-medium)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b" style={{ borderColor: 'var(--border-light)' }}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-80 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />,
                        desc: <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />,
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
                className="border-b transition-colors duration-200"
                style={{ borderColor: 'var(--border-light)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
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
      <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-light)' }}>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
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
            className="px-4 py-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-medium)',
              color: 'var(--text-primary)'
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
          </button>
          <span className="text-sm px-4" style={{ color: 'var(--text-secondary)' }}>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-medium)',
              color: 'var(--text-primary)'
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
