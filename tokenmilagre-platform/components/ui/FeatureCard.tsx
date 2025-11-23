'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface FeatureCardProps {
    title: string;
    description: string;
    icon?: IconDefinition;
    href: string;
    gradient: string;
    stats?: string;
    badge?: string;
    minHeight?: string;
}

export default function FeatureCard({
    title,
    description,
    icon,
    href,
    gradient,
    stats,
    badge,
    minHeight = '180px'
}: FeatureCardProps) {
    return (
        <Link
            href={href}
            className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl block"
            style={{
                background: gradient,
                minHeight: minHeight
            }}
        >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>

            {/* Glow effect on hover */}
            <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: 'rgba(255,255,255,0.5)',
                    boxShadow: '0 0 20px rgba(255,255,255,0.5)'
                }}
            />

            <div className="relative z-10 h-full flex flex-col justify-between text-white">
                <div>
                    {badge && (
                        <div className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm">
                            {badge}
                        </div>
                    )}

                    <div className="flex items-center gap-3 mb-2">
                        {icon && (
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                <FontAwesomeIcon icon={icon} className="w-4 h-4 text-white" />
                            </div>
                        )}
                        <h4 className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left">
                            {title}
                        </h4>
                    </div>

                    <p className="text-sm opacity-90 mb-3 leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-xs font-semibold opacity-90">{stats}</span>
                    <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
                        Acessar
                        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
