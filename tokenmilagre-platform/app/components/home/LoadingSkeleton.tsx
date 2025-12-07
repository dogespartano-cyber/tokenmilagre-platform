/**
 * @module home/LoadingSkeleton
 * @description Skeleton loading para a Home Page
 */

'use client';

import { Skeleton } from '@/components/shared/SkeletonLoader';

export function LoadingSkeleton() {
    return (
        <div className="space-y-12 animate-fade-in">
            {/* Market Data Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card rounded-2xl p-6 h-32 flex flex-col justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>

            {/* Daily Analysis Skeleton */}
            <div className="glass-card rounded-2xl p-6 border-l-4 border-[var(--border-medium)]">
                <div className="flex justify-between mb-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-48 rounded-lg" />
            </div>
        </div>
    );
}
