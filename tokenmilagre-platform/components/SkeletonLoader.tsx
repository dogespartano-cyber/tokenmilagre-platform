'use client';

import { memo, useMemo } from 'react';

/**
 * Props for the base Skeleton component
 */
export interface SkeletonProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for components that render multiple skeleton instances
 */
export interface SkeletonCountProps {
  /** Number of skeleton items to render */
  count?: number;
}

/**
 * Skeleton Component
 *
 * Base skeleton loader component for placeholder content while data is loading.
 * Provides a pulsing animation effect using CSS.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-32" />
 * ```
 *
 * Accessibility features:
 * - ARIA role="status" for screen readers
 * - ARIA label indicating loading state
 *
 * @param props - Component props
 * @returns Skeleton placeholder element
 */
export const Skeleton = memo<SkeletonProps>(({ className = '' }) => {
  return (
    <div
      role="status"
      aria-label="Carregando conteúdo"
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    />
  );
});

Skeleton.displayName = 'Skeleton';

/**
 * NewsCardSkeleton Component
 *
 * Skeleton loader specifically designed for news card layouts.
 * Mimics the structure of a news card with header, title, summary, keywords, and categories.
 *
 * @example
 * ```tsx
 * <NewsCardSkeleton />
 * ```
 *
 * @returns News card skeleton placeholder
 */
export const NewsCardSkeleton = memo(() => {
  return (
    <div
      role="status"
      aria-label="Carregando notícia"
      className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl"
      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}
    >
      <div className="animate-pulse space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />

        {/* Summary */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Keywords */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Categories */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Read more */}
        <div className="pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
});

NewsCardSkeleton.displayName = 'NewsCardSkeleton';

/**
 * ArticleSkeleton Component
 *
 * Full-page skeleton loader for article detail pages.
 * Includes breadcrumb, header with metadata, content sections, and keywords.
 *
 * @example
 * ```tsx
 * <ArticleSkeleton />
 * ```
 *
 * @returns Article skeleton placeholder
 */
export const ArticleSkeleton = memo(() => {
  return (
    <div className="container mx-auto px-4 py-8" role="status" aria-label="Carregando artigo">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-8 w-48" />
        </div>

        {/* Header */}
        <div
          className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-xl"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}
        >
          <div className="animate-pulse space-y-6">
            {/* Sentiment */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-4/5" />
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-xl"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}
        >
          <div className="animate-pulse space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="py-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="py-4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Keywords */}
        <div
          className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}
        >
          <div className="animate-pulse space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ArticleSkeleton.displayName = 'ArticleSkeleton';

/**
 * NewsGridSkeleton Component
 *
 * Grid layout of news card skeletons for news listing pages.
 *
 * @example
 * ```tsx
 * <NewsGridSkeleton count={6} />
 * ```
 *
 * @param props - Component props
 * @returns Grid of news card skeletons
 */
export const NewsGridSkeleton = memo<SkeletonCountProps>(({ count = 6 }) => {
  // Memoize the array to avoid recreating on each render
  const items = useMemo(() => Array.from({ length: count }), [count]);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label={`Carregando ${count} notícias`}>
      {items.map((_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  );
});

NewsGridSkeleton.displayName = 'NewsGridSkeleton';

/**
 * ListSkeleton Component
 *
 * Vertical list of skeleton items with avatar and text layout.
 * Suitable for user lists, comment threads, or similar list-based content.
 *
 * @example
 * ```tsx
 * <ListSkeleton count={5} />
 * ```
 *
 * @param props - Component props
 * @returns List of skeleton items
 */
export const ListSkeleton = memo<SkeletonCountProps>(({ count = 5 }) => {
  // Memoize the array to avoid recreating on each render
  const items = useMemo(() => Array.from({ length: count }), [count]);

  return (
    <div className="space-y-4" role="status" aria-label={`Carregando ${count} itens`}>
      {items.map((_, index) => (
        <div
          key={index}
          className="backdrop-blur-lg rounded-xl p-4 border-2"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}
        >
          <div className="animate-pulse flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

ListSkeleton.displayName = 'ListSkeleton';

// Default export for backward compatibility
export default Skeleton;
