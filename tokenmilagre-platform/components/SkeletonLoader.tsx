'use client';

// Skeleton genérico
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    />
  );
}

// Skeleton para card de notícia
export function NewsCardSkeleton() {
  return (
    <div
      className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl"
      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}
    >
      <div className="animate-pulse space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Título */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />

        {/* Resumo */}
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

        {/* Categorias */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Leia mais */}
        <div className="pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

// Skeleton para artigo completo
export function ArticleSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
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
            {/* Sentimento */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>

            {/* Título */}
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

            {/* Resumo */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Conteúdo */}
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
}

// Skeleton para grid de notícias
export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Skeleton para lista
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="backdrop-blur-lg rounded-xl p-4 border-2"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}
        >
          <div className="animate-pulse flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
