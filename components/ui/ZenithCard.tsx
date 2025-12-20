import React from 'react';

type CardVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'orange' | 'indigo' | 'teal' | 'violet' | 'slate' | 'glass';

interface ZenithCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    hoverEffect?: boolean;
    as?: React.ElementType;
    children: React.ReactNode;
    href?: string;
    [key: string]: any;
}

export default function ZenithCard({
    variant = 'default',
    hoverEffect = true,
    as: Component = 'div',
    className = '',
    children,
    ...props
}: ZenithCardProps) {

    // Base Design: 
    // - Rounded-2xl (Standardized)
    // - Glassmorphism in dark mode (backdrop-blur-md)
    // - Border styling with specific opacity
    // - Smooth transitions

    const baseStyles = 'relative p-6 rounded-2xl border dark:backdrop-blur-md overflow-hidden transition-all duration-500';

    // Hover Effects (Optional but default)
    const hoverStyles = hoverEffect
        ? 'hover:shadow-xl cursor-default'
        : '';

    // Variant Colors Map
    // Adapting the styles from ZenithMarketTicker to be reusable
    const variantStyles = {
        default: 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800',

        success: `
            bg-white
            dark:bg-transparent dark:bg-gradient-to-br dark:from-green-500/10 dark:to-emerald-500/5 
            border-green-200 dark:border-green-500/20 group-hover:border-green-300 dark:group-hover:border-green-500/40
            hover:shadow-green-500/10
        `,

        danger: `
            bg-white
            dark:bg-transparent dark:bg-gradient-to-br dark:from-red-500/10 dark:to-rose-500/5 
            border-red-200 dark:border-red-500/20 group-hover:border-red-300 dark:group-hover:border-red-500/40
            hover:shadow-red-500/10
        `,

        warning: `
            bg-white
            dark:bg-transparent dark:bg-gradient-to-br dark:from-yellow-500/10 dark:to-amber-500/5 
            border-yellow-200 dark:border-yellow-500/20 group-hover:border-yellow-300 dark:group-hover:border-yellow-500/40
            hover:shadow-yellow-500/10
        `,

        info: `
            bg-white
            dark:bg-transparent dark:bg-gradient-to-br dark:from-cyan-500/10 dark:to-blue-500/5
            border-cyan-200 dark:border-cyan-500/20 group-hover:border-cyan-300 dark:group-hover:border-cyan-500/40
            hover:shadow-cyan-500/10
        `,

        orange: `
            bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-orange-500/10 dark:to-amber-500/5 
            border-orange-200 dark:border-orange-500/20 group-hover:border-orange-300 dark:group-hover:border-orange-500/40
            hover:shadow-orange-500/10
        `,

        indigo: `
            bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-indigo-500/10 dark:to-purple-500/5 
            border-indigo-200 dark:border-indigo-500/20 group-hover:border-indigo-300 dark:group-hover:border-indigo-500/40
            hover:shadow-indigo-500/10
        `,

        teal: `
            bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-teal-500/10 dark:to-emerald-500/5 
            border-[#e6f4f3] dark:border-teal-500/20 group-hover:border-teal-300 dark:group-hover:border-teal-500/40
            hover:shadow-teal-500/10
        `,

        violet: `
            bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-violet-500/10 dark:to-fuchsia-500/5 
            border-violet-200 dark:border-violet-500/20 group-hover:border-violet-300 dark:group-hover:border-violet-500/40
            hover:shadow-violet-500/10
        `,

        slate: `
            bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-slate-500/10 dark:to-zinc-500/5 
            border-slate-200 dark:border-slate-500/20 group-hover:border-slate-300 dark:group-hover:border-slate-500/40
            hover:shadow-slate-500/10
        `,

        glass: `
            bg-white/80 dark:bg-zinc-900/40 backdrop-blur-lg
            border-white/20 dark:border-white/10
            hover:shadow-lg
        `
    };

    // Ambient Effect Gradients (Replaces Top Line with Soft Fill)
    const ambientGradients = {
        default: '',
        success: 'from-green-500/10 to-transparent',
        danger: 'from-red-500/10 to-transparent',
        warning: 'from-yellow-500/10 to-transparent',
        info: 'from-cyan-500/10 to-transparent',
        orange: 'from-orange-500/10 to-transparent',
        indigo: 'from-indigo-500/10 to-transparent',
        teal: 'from-teal-500/10 to-transparent',
        violet: 'from-violet-500/10 to-transparent',
        slate: 'from-slate-500/10 to-transparent',
        glass: ''
    };

    const containerClasses = [
        baseStyles,
        hoverEffect ? 'group' : '',
        hoverStyles,
        variantStyles[variant],
        className
    ].filter(Boolean).join(' ');

    return (
        <Component
            className={containerClasses}
            {...props}
        >
            {/* Ambient Hover Glow (Replaces Top Line) */}
            {hoverEffect && variant !== 'default' && (
                <div
                    className={`absolute inset-0 opacity-100 dark:opacity-0 dark:group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br pointer-events-none ${ambientGradients[variant]}`}
                />
            )}

            {/* Content Container */}
            <div className="relative z-10 h-full">
                {children}
            </div>

            {/* Background Glow Blob (Optional decoration for some variants, adapted from QuickStart) */}
            {/* Can be added as a sub-component if needed, keeping it simple for now */}
        </Component>
    );
}
