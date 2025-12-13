
import { useState, useCallback, useEffect } from 'react';

interface PaginationOptions<T> {
    endpoint: string;
    filters?: Record<string, string | number | boolean | undefined>;
    initialData?: T[];
    pageSize?: number;
    transform?: (rawData: unknown) => T;
}

interface PaginationReturn<T> {
    data: T[];
    loading: boolean;
    totalPages: number;
    totalItems: number;
    currentPage: number;
    error: Error | null;
    goToPage: (page: number) => Promise<void>;
    refresh: () => Promise<void>;
}

/**
 * Hook customizado para data fetching com paginação clássica
 *
 * @param endpoint - URL da API
 * @param filters - Filtros
 * @param initialData - Dados iniciais
 * @param pageSize - Itens por página
 * @param transform - Função de transformação
 */
export function usePaginationData<T>({
    endpoint,
    filters = {},
    initialData = [],
    pageSize = 12,
    transform
}: PaginationOptions<T>): PaginationReturn<T> {
    const [data, setData] = useState<T[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<Error | null>(null);

    // Função principal de fetch
    const fetchData = useCallback(async (page: number) => {
        setLoading(true);
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

            setData(items);

            // Atualizar metadados de paginação
            if (result.pagination) {
                setTotalPages(result.pagination.totalPages);
                setTotalItems(result.pagination.total);
                setCurrentPage(result.pagination.page);
            }

        } catch (err) {
            const error = err instanceof Error ? err : new Error('Erro desconhecido');
            setError(error);
            console.error(`[usePaginationData] ${endpoint}:`, error);
        } finally {
            setLoading(false);
        }
    }, [endpoint, filters, pageSize, transform]);

    // Navegar para página específica
    const goToPage = useCallback(async (page: number) => {
        if (page < 1 || page > totalPages) return;
        await fetchData(page);
        // Scroll to top of list if needed (can be handled by parent)
    }, [fetchData, totalPages]);

    // Refresh (volta para página 1)
    const refresh = useCallback(async () => {
        await fetchData(1);
    }, [fetchData]);

    // Efeito para refetch quando filtros mudarem
    useEffect(() => {
        setCurrentPage(1);
        fetchData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // Serializar filtros
        JSON.stringify(filters)
    ]);

    return {
        data,
        loading,
        totalPages,
        totalItems,
        currentPage,
        error,
        goToPage,
        refresh
    };
}
