/**
 * @module home/QuickStartGrid
 * @description Grid "Comece por Aqui" com 4 cards de navegação
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChartLine, faShieldAlt, faGraduationCap, faNewspaper } from '@fortawesome/free-solid-svg-icons';

const quickStartItems = [
    {
        href: '/educacao',
        icon: faGraduationCap,
        iconColor: 'green',
        title: 'Como Investir',
        description: 'Guia completo para começar a investir',
        badge: 'Intermediário',
    },
    {
        href: '/noticias',
        icon: faNewspaper,
        iconColor: 'red',
        title: 'Notícias do Mercado',
        description: 'Fique por dentro do que move o mercado',
        badge: 'Em tempo real',
    },
    {
        href: '/graficos',
        icon: faChartLine,
        iconColor: 'purple',
        title: 'Gráficos Avançados',
        description: 'Análise técnica profissional em tempo real',
        badge: 'TradingView',
    },
    {
        href: '/recursos',
        icon: faShieldAlt,
        iconColor: 'blue',
        title: 'Ferramentas & Recursos',
        description: 'Plataformas e ferramentas essenciais',
        badge: 'Links seguros',
    },
];

const colorMap: Record<string, { bg: string; text: string }> = {
    green: { bg: 'bg-green-500/10', text: 'text-green-500' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
};

export function QuickStartGrid() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] mb-3" style={{ color: 'var(--text-primary)' }}>
                    Comece por Aqui
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Tudo o que você precisa para iniciar sua jornada no mercado cripto
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStartItems.map((item) => {
                    const colors = colorMap[item.iconColor];
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="glass-card group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colors.bg} ${colors.text} mb-4`}>
                                        <FontAwesomeIcon icon={item.icon} />
                                    </div>
                                    <h4 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                                        {item.description}
                                    </p>
                                </div>
                                <div className={`flex items-center justify-between ${colors.text} text-sm font-semibold`}>
                                    <span>{item.badge}</span>
                                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
