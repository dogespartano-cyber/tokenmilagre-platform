import React from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ZenithButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    as?: React.ElementType; // Polymorphism
    href?: string; // For Link support
    glow?: boolean; // Neon glow effect
}

export const ZenithButton = React.forwardRef<HTMLButtonElement, ZenithButtonProps>(
    ({ className, variant = 'primary', size = 'md', as, glow = false, children, ...props }, ref) => {
        const Component = as || 'button';

        // Base Styles (Zenith System)
        // Rounded-xl for buttons (distinct from rounded-2xl cards)
        // Inter font, font-bold
        const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl';

        const variants = {
            primary: 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--brand-primary)] hover:text-white dark:hover:text-black',
            secondary: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-medium)]',
            glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
            ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
            danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-5 py-2.5 text-sm',
            lg: 'px-8 py-4 text-base',
        };

        const glows = {
            primary: 'shadow-[0_0_15px_rgba(255,255,255,0.3)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(var(--brand-primary-rgb),0.5)]',
            glass: 'shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]',
        };

        const classes = twMerge(
            baseStyles,
            variants[variant],
            sizes[size],
            glow && (variant === 'primary' ? glows.primary : glows.glass),
            // Hover lift effect
            'hover:-translate-y-0.5',
            className
        );

        return (
            <Component
                ref={ref}
                className={classes}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

ZenithButton.displayName = 'ZenithButton';
