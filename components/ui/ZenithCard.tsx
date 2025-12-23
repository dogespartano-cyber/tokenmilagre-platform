import React from 'react';

type CardVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'orange' | 'indigo' | 'teal' | 'violet' | 'slate' | 'glass';

interface ZenithCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    hoverEffect?: boolean;
    isActive?: boolean;
    as?: React.ElementType;
    children: React.ReactNode;
    href?: string;
    [key: string]: any;
}

export default function ZenithCard({
    variant = 'default',
    hoverEffect = true,
    isActive = false,
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
    // Applying shadow only in light mode if we have neon for dark
    const hoverStyles = (hoverEffect || isActive)
        ? `${isActive ? 'shadow-xl' : 'hover:shadow-xl'} cursor-default`
        : '';

    // Variant Colors Map
    // Adapting the styles from ZenithMarketTicker to be reusable
    const variantStyles = {
        default: `bg-white dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800 ${isActive ? 'border-[var(--brand-primary)]/50 dark:border-[var(--brand-primary)]/50' : 'group-hover:border-[var(--brand-primary)]/30'}`,

        success: `
            bg-white
            dark:bg-transparent dark:bg-gradient-to-br dark:from-green-500/10 dark:to-emerald-500/5 
            border-green-300 dark:border-green-500/20 group-hover:border-green-400 dark:group-hover:border-green-500/40
        `,

        danger: `
            bg-white
            dark:bg-transparent dark:bg-gradient-to-br dark:from-red-500/10 dark:to-rose-500/5 
            border-red-300 dark:border-red-500/20 group-hover:border-red-400 dark:group-hover:border-red-500/40
        `,

        warning: `
            bg-white
            dark:bg-transparent dark:bg-gradient-to-br dark:from-yellow-500/10 dark:to-amber-500/5 
            border-yellow-300 dark:border-yellow-500/20 group-hover:border-yellow-400 dark:group-hover:border-yellow-500/40
        `,

        info: `
            bg-white
            dark:bg-transparent dark:bg-gradient-to-br dark:from-cyan-500/10 dark:to-blue-500/5
            border-cyan-300 dark:border-cyan-500/20 group-hover:border-cyan-400 dark:group-hover:border-cyan-500/40
        `,

        orange: `
            bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-orange-500/10 dark:to-amber-500/5 
            border-orange-300 dark:border-orange-500/20 group-hover:border-orange-400 dark:group-hover:border-orange-500/40
        `,

        indigo: `
            bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-indigo-500/10 dark:to-purple-500/5 
            border-indigo-300 dark:border-indigo-500/20 group-hover:border-indigo-400 dark:group-hover:border-indigo-400/40
        `,

        teal: `
            bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-teal-500/10 dark:to-emerald-500/5 
            border-teal-200 dark:border-teal-500/20 group-hover:border-teal-400 dark:group-hover:border-teal-500/40
        `,

        violet: `
            bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-violet-500/10 dark:to-fuchsia-500/5 
            border-violet-300 dark:border-violet-500/20 group-hover:border-violet-400 dark:group-hover:border-violet-500/40
        `,

        slate: `
            bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-slate-500/10 dark:to-zinc-500/5 
            border-slate-300 dark:border-slate-500/20 group-hover:border-slate-400 dark:group-hover:border-slate-500/40
        `,

        glass: `
            bg-white/80 dark:bg-zinc-900/40 backdrop-blur-lg
            border-zinc-300/50 dark:border-white/10
        `
    };

    // Full static strings for Tailwind JIT to detect neon shadows
    // Adjusted to be directional (bottom/sides) instead of global spread
    const neonActiveStyles = {
        default: 'dark:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)]',
        success: 'dark:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.45)]',
        danger: 'dark:shadow-[0_15px_30px_-5px_rgba(239,68,68,0.35)]',
        warning: 'dark:shadow-[0_15px_30px_-5px_rgba(234,179,8,0.35)]',
        info: 'dark:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.35)]',
        orange: 'dark:shadow-[0_15px_30px_-5px_rgba(249,115,22,0.35)]',
        indigo: 'dark:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.35)]',
        teal: 'dark:shadow-[0_15px_30px_-5px_rgba(20,184,166,0.4)]',
        violet: 'dark:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.35)]',
        slate: 'dark:shadow-[0_15px_30px_-5px_rgba(100,116,139,0.3)]',
        glass: 'dark:shadow-[0_15px_30px_-5px_rgba(255,255,255,0.08)]'
    };

    const neonHoverStyles = {
        default: 'dark:hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)]',
        success: 'dark:hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.45)]',
        danger: 'dark:hover:shadow-[0_15px_30px_-5px_rgba(239,68,68,0.35)]',
        warning: 'dark:hover:shadow-[0_15px_30px_-5px_rgba(234,179,8,0.35)]',
        info: 'dark:hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.35)]',
        orange: 'dark:hover:shadow-[0_15px_30px_-5px_rgba(249,115,22,0.35)]',
        indigo: 'dark:hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.35)]',
        teal: 'dark:hover:shadow-[0_15px_30px_-5px_rgba(20,184,166,0.4)]',
        violet: 'dark:hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.35)]',
        slate: 'dark:hover:shadow-[0_15px_30px_-5px_rgba(100,116,139,0.3)]',
        glass: 'dark:hover:shadow-[0_15px_30px_-5px_rgba(255,255,255,0.08)]'
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
        isActive ? neonActiveStyles[variant] : (hoverEffect ? neonHoverStyles[variant] : ''),
        variantStyles[variant],
        className
    ].filter(Boolean).join(' ');

    return (
        <Component
            className={containerClasses}
            {...props}
        >
            {/* Ambient Hover Glow (Replaces Top Line) */}
            {(hoverEffect || isActive) && variant !== 'default' && (
                <div
                    className={`absolute inset-0 ${isActive ? 'opacity-100' : 'opacity-100 dark:opacity-0 dark:group-hover:opacity-100'} transition-opacity duration-500 bg-gradient-to-br pointer-events-none ${ambientGradients[variant]}`}
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
