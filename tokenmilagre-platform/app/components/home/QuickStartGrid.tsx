/**
 * @module home/QuickStartGrid
 * @description Grid "Comece por Aqui" com design estilo Dashboard/Stats
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faShieldAlt, faGraduationCap, faNewspaper, faLightbulb, faArrowRight, faCoins, faTools } from '@fortawesome/free-solid-svg-icons';

const cards = [
    {
        href: '/comece-aqui',
        icon: faGraduationCap,
        title: 'Como Investir',
        description: 'Guia passo a passo para iniciantes',
        bgImage: '/assets/zenith/card-invest.webp',
        theme: 'success'
    },
    {
        href: '/noticias',
        icon: faNewspaper,
        title: 'Notícias do Mercado',
        description: 'Atualizações em tempo real',
        bgImage: '/assets/zenith/card-news.webp',
        theme: 'yellow'
    },
    {
        href: '/graficos',
        icon: faChartLine,
        title: 'Gráficos Avançados',
        description: 'Análise técnica profissional',
        bgImage: '/assets/zenith/card-charts.webp',
        theme: 'red'
    },
    {
        href: '/ferramentas',
        icon: faTools,
        title: 'Ferramentas',
        description: 'Calculadoras e recursos',
        bgImage: '/assets/zenith/card-tools.webp',
        theme: 'cyan'
    },
    {
        href: '/criptomoedas',
        icon: faCoins,
        title: 'Criptomoedas',
        description: 'Explore o mercado',
        theme: 'success'
    }
];

// Theme mapping for individual cards
const themeMap = {
    success: {
        bg: 'bg-[var(--success-bg)]', // Using CSS variables from globals.css
        text: 'text-[var(--success)]',
        icon: 'text-[var(--success)] bg-[var(--success)]/10',
        border: 'border-[var(--success)]/20'
    },
    yellow: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-500',
        icon: 'text-yellow-500 bg-yellow-500/10',
        border: 'border-yellow-500/20'
    },
    red: {
        bg: 'bg-red-500/10',
        text: 'text-red-500',
        icon: 'text-red-500 bg-red-500/10',
        border: 'border-red-500/20'
    },
    cyan: {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-500',
        icon: 'text-cyan-500 bg-cyan-500/10',
        border: 'border-cyan-500/20'
    }
};

export function QuickStartGrid() {
    return (
        <section className="py-8">
            <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                    Comece por Aqui
                </h2>
                <div className="h-1 flex-1 bg-[var(--border-light)] rounded-full opacity-20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {cards.map((card, index) => {
                    const themeStyles = themeMap[card.theme as keyof typeof themeMap] || themeMap.cyan;

                    return (
                        <Link
                            key={index}
                            href={card.href}
                            className={`
                group relative overflow-hidden rounded-3xl
                zenith-card
                p-6 flex flex-col justify-between
                col-span-1 min-h-[220px]
              `}
                        >
                            {/* Content Layer (z-10 to stay above bg) */}
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center
                    text-xl transition-all duration-300
                    ${themeStyles.icon}
                    shadow-lg
                  `}>
                                        <FontAwesomeIcon icon={card.icon} />
                                    </div>

                                    <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    border opacity-0 group-hover:opacity-100
                    transition-all duration-300 transform translate-x-4 group-hover:translate-x-0
                    ${themeStyles.icon.replace('bg-', 'border-').replace('text-', 'text-')}
                  `}>
                                        <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-1 text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)] font-medium">
                                        {card.description}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Gradient Glow */}
                            <div className={`
                absolute -bottom-20 -right-20 w-40 h-40 blur-[60px] rounded-full
                opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none
                ${themeStyles.bg.replace('bg-', 'bg-')}
              `} />
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
