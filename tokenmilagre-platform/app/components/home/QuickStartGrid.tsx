/**
 * @module home/QuickStartGrid
 * @description Grid "Comece por Aqui" com design estilo Dashboard/Stats
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faShieldAlt, faGraduationCap, faNewspaper, faLightbulb, faArrowRight, faCoins } from '@fortawesome/free-solid-svg-icons';

const quickStartItems = [
    {
        href: '/como-investir',
        icon: faLightbulb,
        title: 'Como Investir',
        description: 'Guia completo para iniciantes no mundo cripto',
    },
    {
        href: '/noticias',
        icon: faNewspaper,
        title: 'Notícias do Mercado',
        description: 'Fique por dentro do que move o mercado',
    },
    {
        href: '/graficos',
        icon: faChartLine,
        title: 'Gráficos Avançados',
        description: 'Análise técnica profissional em tempo real',
    },
    {
        href: '/recursos',
        icon: faShieldAlt,
        title: 'Ferramentas',
        description: 'Recursos essenciais',
    },
    {
        href: '/criptomoedas',
        icon: faCoins,
        title: 'Criptomoedas',
        description: 'Explore o mercado',
    },
];

export function QuickStartGrid() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-primary)] pl-1 border-l-4 border-[var(--brand-primary)]">
                    Comece por Aqui
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[160px]">
                {/* 1. First Item - INVESTIR (Featured - Large) */}
                <Link
                    href={quickStartItems[0].href}
                    className="md:col-span-2 lg:col-span-2 row-span-2 zenith-card rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-between"
                >
                    <div className="absolute top-0 right-0 p-32 bg-[var(--success)]/10 blur-[100px] rounded-full group-hover:bg-[var(--success)]/20 transition-colors" />

                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--success-bg)] flex items-center justify-center mb-6 text-[var(--success)] text-2xl group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                            <FontAwesomeIcon icon={quickStartItems[0].icon} />
                        </div>
                        <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{quickStartItems[0].title}</h3>
                        <p className="text-[var(--text-secondary)] text-lg line-clamp-2">{quickStartItems[0].description}</p>
                    </div>
                    <div className="relative z-10 flex items-center gap-2 text-[var(--success)] font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                        Começar Agora <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                </Link>

                {/* 2. Smaller Items (Grid Flow) */}
                {quickStartItems.slice(1).map((item, index) => {
                    const isWide = false; // Disable wide items to fit 2 new items side by side beneath the top row
                    // Mapping specific colors based on the item index/content for visual variety within Zenith
                    // Index 0: News (Brand/Gold) | Index 1: Charts (Info/Blue)
                    // Index 2: Tools (Purple) | Index 3: Crypto (Success/Green)
                    let colorClass = 'text-[var(--text-primary)]';
                    let bgClass = 'bg-[var(--bg-tertiary)]';

                    if (index === 0) { // Notícias
                        colorClass = 'text-[var(--brand-primary)]';
                        bgClass = 'bg-[var(--brand-bg)]';
                    } else if (index === 1) { // Gráficos
                        colorClass = 'text-[var(--info)]';
                        bgClass = 'bg-[var(--info-bg)]';
                    } else if (index === 2) { // Ferramentas
                        colorClass = 'text-purple-600 dark:text-purple-400';
                        bgClass = 'bg-purple-100 dark:bg-purple-900/20';
                    } else if (index === 3) { // Criptomoedas
                        colorClass = 'text-[var(--success)]'; // Emerald
                        bgClass = 'bg-[var(--success-bg)]';
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`zenith-card rounded-3xl p-6 relative overflow-hidden group flex flex-col justify-between hover:ring-1 hover:ring-[var(--border-focus)]/50 ${isWide ? 'md:col-span-2' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center ${colorClass} text-lg group-hover:rotate-12 transition-transform`}>
                                    <FontAwesomeIcon icon={item.icon} />
                                </div>
                                <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-[var(--text-primary)]" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--brand-primary)] transition-colors">{item.title}</h3>
                                <p className="text-xs text-[var(--text-tertiary)] line-clamp-2">{item.description}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
