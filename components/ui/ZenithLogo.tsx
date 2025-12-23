import React from 'react';

interface ZenithLogoProps {
    className?: string;
    showTagline?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function ZenithLogo({
    className = '',
    showTagline = false,
    size = 'md'
}: ZenithLogoProps) {
    const sizeClasses = {
        sm: {
            symbol: 'text-xl',
            text: 'text-base tracking-[0.15em]',
            tagline: 'text-[10px]'
        },
        md: {
            symbol: 'text-2xl',
            text: 'text-lg tracking-[0.2em]',
            tagline: 'text-[11px]'
        },
        lg: {
            symbol: 'text-4xl',
            text: 'text-2xl tracking-[0.25em]',
            tagline: 'text-xs'
        }
    };

    const currentSize = sizeClasses[size];

    return (
        <div className={`flex flex-col ${className} select-none group`}>
            <div className="flex items-center gap-1">
                {/* O Símbolo $ com gradiente solar */}
                <span className={`
                    ${currentSize.symbol} 
                    font-black 
                    bg-clip-text text-transparent 
                    bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-light)] to-[var(--brand-primary)]
                    drop-shadow-[0_0_12px_rgba(var(--brand-primary-rgb),0.5)]
                    transition-all duration-500
                    group-hover:scale-110 group-hover:rotate-12
                    font-space
                `}>
                    $
                </span>

                {/* O Nome MILAGRE em Space Grotesk */}
                <span className={`
                    ${currentSize.text} 
                    font-bold 
                    text-[var(--text-primary)] 
                    dark:text-white
                    uppercase 
                    font-space
                    transition-colors duration-300
                `}>
                    MILAGRE
                </span>
            </div>

            {showTagline && (
                <span className={`
                    ${currentSize.tagline}
                    font-bold
                    tracking-[0.35em] 
                    uppercase 
                    text-[var(--text-secondary)] 
                    -mt-1
                    opacity-60
                    transition-all duration-300
                    group-hover:opacity-100
                    font-space
                `}>
                    Comunidade Web3
                </span>
            )}
        </div>
    );
}
