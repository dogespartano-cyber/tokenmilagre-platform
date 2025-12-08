import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    threshold?: number; // Distância do bottom em px para disparar load (default: 300px)
}

/**
 * Hook customizado para implementar infinite scroll
 *
 * @param hasMore - Se há mais dados para carregar
 * @param isLoading - Se está carregando dados atualmente
 * @param onLoadMore - Callback para carregar mais dados
 * @param threshold - Distância do bottom para disparar (padrão: 300px)
 *
 * @returns sentinelRef - Ref para colocar em um elemento sentinela (observador)
 *
 * @example
 * ```tsx
 * const { sentinelRef } = useInfiniteScroll({
 *   hasMore,
 *   isLoading,
 *   onLoadMore: loadMoreArticles,
 *   threshold: 300
 * });
 *
 * return (
 *   <div>
 *     {articles.map(article => <ArticleCard key={article.id} {...article} />)}
 *     <div ref={sentinelRef} />
 *     {isLoading && <Loader />}
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore,
    threshold = 300
}: UseInfiniteScrollOptions) {
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Callback ref que é chamado quando o elemento é montado/desmontado
    const sentinelRef = useCallback((node: HTMLDivElement | null) => {
        // Desconectar observer anterior se existir
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }

        // Se não há elemento ou não há mais dados, não criar observer
        if (!node || !hasMore) {
            return;
        }

        // Criar novo observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && hasMore && !isLoading) {
                    onLoadMore();
                }
            },
            {
                rootMargin: `${threshold}px`,
                threshold: 0.1
            }
        );

        observerRef.current.observe(node);
    }, [hasMore, isLoading, onLoadMore, threshold]);

    // Cleanup quando o componente desmontar
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return { sentinelRef };
}
