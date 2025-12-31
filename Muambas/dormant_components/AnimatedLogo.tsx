'use client';

import Image from 'next/image';

interface AnimatedLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function AnimatedLogo({ size = 'lg', className = '' }: AnimatedLogoProps) {
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-32 h-32',
        lg: 'w-48 h-48',
        xl: 'w-64 h-64'
    };

    const imageSizes = {
        sm: 64,
        md: 128,
        lg: 192,
        xl: 256
    };

    return (
        <div className={`relative ${sizeClasses[size]} ${className}`}>
            {/* Animated rings */}
            <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-500/30 dark:border-yellow-400/20"></div>
            </div>
            <div className="absolute inset-4 animate-spin-reverse">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30 dark:border-purple-400/20"></div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-pink-300/20 to-purple-300/20 blur-3xl animate-pulse"></div>

            {/* Image */}
            <div className="relative z-10 w-full h-full transform hover:scale-105 transition-all duration-700">
                <Image
                    src="/images/TOKEN-MILAGRE-Hero.webp"
                    alt="$MILAGRE"
                    fill
                    className="object-cover rounded-full drop-shadow-2xl"
                    priority
                />
            </div>
        </div>
    );
}
