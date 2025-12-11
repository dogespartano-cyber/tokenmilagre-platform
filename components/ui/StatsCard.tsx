'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon?: IconDefinition;
    gradient?: string;
    subtext?: string;
    loading?: boolean;
}

export default function StatsCard({
    title,
    value,
    change,
    changeLabel = '(24h)',
    icon,
    gradient,
    subtext,
    loading = false
}: StatsCardProps) {
    if (loading) {
        return (
            <div className="backdrop-blur-lg rounded-2xl p-6 border shadow-md border-theme-light bg-gradient-to-br from-theme-secondary to-theme-tertiary animate-pulse">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    return (
        <div
            className="backdrop-blur-lg rounded-2xl p-6 border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all border-theme-light bg-gradient-to-br from-theme-secondary to-theme-tertiary"
        >
            <div className="mb-2 flex justify-between items-start">
                <p className="text-sm text-theme-tertiary">{title}</p>
                {icon && (
                    <div className="p-2 rounded-lg bg-white/10">
                        <FontAwesomeIcon icon={icon} className="text-theme-tertiary w-4 h-4" />
                    </div>
                )}
            </div>

            <p className="font-bold text-3xl mb-1 text-theme-primary">
                {value}
            </p>

            {(change !== undefined) && (
                <p className={`text-sm font-semibold ${change >= 0 ? 'text-success' : 'text-error'}`}>
                    {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}% {changeLabel}
                </p>
            )}

            {subtext && (
                <p className="text-sm text-theme-muted">{subtext}</p>
            )}

            {/* Progress bar for dominance if needed, can be extended later */}
        </div>
    );
}
