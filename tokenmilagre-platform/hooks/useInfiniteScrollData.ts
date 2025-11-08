import { useState, useCallback, useEffect } from 'react';
import { useInfiniteScroll } from './useInfiniteScroll';

interface InfiniteScrollOptions<T> {
  endpoint: string;
  filters?: Record<string, any>;
  initialData?: T[];
  pageSize?: number;
  transform?: (rawData: any) => T;
}

interface InfiniteScrollReturn<T> {
  data: T[];
  loading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  currentPage: number;
  error: Error | null;
  sentinelRef: (node: HTMLDivElement | null) => void;
  refresh: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook customizado para data fetching com infinite scroll
 *
 * Abstrai toda a lógica de paginação, fetch e infinite scroll em um único hook reutilizável.
 * Usa internamente o hook useInfiniteScroll para IntersectionObserver.
 *
 * @param endpoint - URL da API (sem query params)
 * @param filters - Filtros a serem enviados como query params
 * @param initialData - Dados iniciais (opcional)
 * @param pageSize - Itens por página (padrão: 12)
 * @param transform - Função para transformar dados brutos da API (opcional)
 *
 * @returns Objeto com data, loading states, sentinelRef e funções de controle
 *
 * @example
 * ```tsx
 * const { data, loading, sentinelRef, refresh } = useInfiniteScrollData<Resource>({
 *   endpoint: '/api/articles',
 *   filters: { category, level, type: 'educational' },
 *   transform: (raw) => ({
 *     id: raw.id,
 *     slug: raw.slug,
 *     title: raw.title,
 *     // ... outros campos
 *   })
 * });
 *
 * return (
 *   <div>
 *     {data.map(item => <Card key={item.id} {...item} />)}
 *     <div ref={sentinelRef} />
 *   </div>
 * );
 * ```
 */
export function useInfiniteScrollData<T>({
  endpoint,
  filters = {},
  initialData = [],
  pageSize = 12,
  transform
}: InfiniteScrollOptions<T>): InfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.length >= pageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  // Função principal de fetch
  const fetchData = useCallback(async (page: number, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      // Construir query params
      const params = new URLSearchParams({
        ...filters,
        page: String(page),
        limit: String(pageSize)
      });

      // Remover params com valores vazios ou 'all'
      const cleanedParams = new URLSearchParams();
      params.forEach((value, key) => {
        if (value && value !== 'all') {
          cleanedParams.append(key, value);
        }
      });

      const url = `${endpoint}?${cleanedParams.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar dados');
      }

      // Transformar dados se função foi fornecida
      const items: T[] = transform
        ? result.data.map(transform)
        : result.data;

      // Atualizar estado
      if (append) {
        setData(prev => [...prev, ...items]);
      } else {
        setData(items);
      }

      // Atualizar paginação
      setHasMore(result.pagination?.hasMore ?? false);
      setCurrentPage(page);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      console.error(`[useInfiniteScrollData] ${endpoint}:`, error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [endpoint, filters, pageSize, transform]);

  // Carregar próxima página
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchData(currentPage + 1, true);
    }
  }, [currentPage, hasMore, isLoadingMore, fetchData]);

  // Hook de infinite scroll (IntersectionObserver)
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore,
    threshold: 300
  });

  // Refresh (volta para página 1)
  const refresh = useCallback(async () => {
    await fetchData(1, false);
  }, [fetchData]);

  // Reset completo
  const reset = useCallback(() => {
    setData(initialData);
    setCurrentPage(1);
    setHasMore(initialData.length >= pageSize);
    setError(null);
  }, [initialData, pageSize]);

  // Efeito para refetch quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    setData([]);
    fetchData(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Serializar filtros para comparação
    JSON.stringify(filters)
  ]);

  return {
    data,
    loading,
    isLoadingMore,
    hasMore,
    currentPage,
    error,
    sentinelRef,
    refresh,
    reset
  };
}
