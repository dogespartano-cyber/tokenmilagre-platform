'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faFireFlameSimple,
    faSnowflake,
    faScaleBalanced,
    faTriangleExclamation,
    faLightbulb,
    faBook,
    faCalculator,
    faArrowTrendUp,
    faArrowTrendDown,
    faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import PageWrapper from '@/components/layout/PageWrapper';
import ZenithCard from '@/components/ui/ZenithCard';
import { useFearGreed } from '@/app/components/home/hooks/useFearGreed';

/**
 * Traduz classificação para português
 */
const translateClassification = (classification: string): string => {
    const map: Record<string, string> = {
        'Extreme Fear': 'Medo Extremo',
        'Fear': 'Medo',
        'Neutral': 'Neutro',
        'Greed': 'Ganância',
        'Extreme Greed': 'Ganância Extrema',
    };
    return map[classification] || classification;
};

/**
 * Componente do Velocímetro Grande
 */
function FearGreedGaugeLarge({ value, classification }: { value: number; classification: string }) {
    const getLabelColor = (val: number, isHex = false) => {
        if (val <= 25) return isHex ? '#EF4444' : 'text-red-500';
        if (val <= 45) return isHex ? '#F97316' : 'text-orange-500';
        if (val <= 55) return isHex ? '#EAB308' : 'text-yellow-500';
        if (val <= 75) return isHex ? '#10B981' : 'text-emerald-500';
        return isHex ? '#22C55E' : 'text-green-500';
    };

    const needleColor = getLabelColor(value, true);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
                <svg viewBox="20 20 140 100" className="w-full max-w-[280px] md:max-w-[360px] overflow-visible drop-shadow-2xl">
                    <defs>
                        <linearGradient id="gaugeRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#EF4444" />
                            <stop offset="25%" stopColor="#F97316" />
                            <stop offset="50%" stopColor="#EAB308" />
                            <stop offset="75%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#22C55E" />
                        </linearGradient>
                        <filter id="glowGauge" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Track Background */}
                    <path
                        d="M 30 100 A 60 60 0 0 1 150 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="14"
                        strokeLinecap="round"
                        className="text-zinc-200 dark:text-zinc-800/40"
                    />

                    {/* Colored Arc */}
                    <path
                        d="M 30 100 A 60 60 0 0 1 150 100"
                        fill="none"
                        stroke="url(#gaugeRainbow)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray="188.5"
                        strokeDashoffset={188.5 - (188.5 * value) / 100}
                        className="transition-all duration-1000 ease-out"
                    />

                    {/* Scale Markers */}
                    {[0, 25, 50, 75, 100].map((mark, i) => {
                        const angle = (mark * 1.8) - 90;
                        const rad = (angle * Math.PI) / 180;
                        const x1 = 90 + 48 * Math.cos(rad);
                        const y1 = 100 + 48 * Math.sin(rad);
                        const x2 = 90 + 55 * Math.cos(rad);
                        const y2 = 100 + 55 * Math.sin(rad);
                        return (
                            <line
                                key={mark}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-zinc-400 dark:text-zinc-600"
                            />
                        );
                    })}

                    {/* Needle */}
                    <g
                        style={{
                            transform: `rotate(${(value * 1.8) - 90}deg)`,
                            transformOrigin: '90px 100px'
                        }}
                        className="transition-all duration-1000 ease-out"
                    >
                        <path d="M 90 100 L 86 95 L 90 35 L 94 95 Z" fill={needleColor} />
                        <circle cx="90" cy="100" r="6" fill={needleColor} />
                    </g>

                    {/* Central Value */}
                    <text
                        x="90"
                        y="90"
                        fill="var(--text-primary)"
                        fontSize="42"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-[family-name:var(--font-poppins)] tracking-tighter drop-shadow-sm"
                    >
                        {value}
                    </text>
                </svg>
            </div>

            <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                    Sentimento Atual
                </span>
                <span className={`text-2xl font-black uppercase tracking-wider ${getLabelColor(value)} transition-colors duration-1000`}>
                    {translateClassification(classification)}
                </span>
            </div>
        </div>
    );
}

/**
 * Card de Metodologia
 */
function MethodologyCard({ title, percentage, description, icon }: {
    title: string;
    percentage: number;
    description: string;
    icon: typeof faChartLine;
}) {
    return (
        <ZenithCard variant="glass" className="p-5 hover:scale-[1.02] transition-transform">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={icon} className="w-5 h-5 text-[var(--brand-primary)]" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-[var(--text-primary)]">{title}</h3>
                        <span className="text-sm font-black text-[var(--brand-primary)]">{percentage}%</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
                </div>
            </div>
        </ZenithCard>
    );
}

/**
 * Card de Faixa de Classificação
 */
function ClassificationCard({ range, label, description, color, icon }: {
    range: string;
    label: string;
    description: string;
    color: string;
    icon: typeof faFireFlameSimple;
}) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-light)]">
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}20` }}
            >
                <FontAwesomeIcon icon={icon} className="w-5 h-5" style={{ color }} />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-black text-[var(--text-primary)]" style={{ color }}>{range}</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">{label}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{description}</p>
            </div>
        </div>
    );
}

const pageHeader = {
    title: 'Sentimento do Mercado',
    description: 'Índice Fear & Greed de Criptomoedas',
    shortTitle: 'Sentimento'
};

export default function SentimentoClient() {
    const { fearGreed, gaugeValue } = useFearGreed();

    const methodologyItems = [
        {
            title: 'Volatilidade',
            percentage: 25,
            description: 'Compara a volatilidade atual do Bitcoin com as médias de 30 e 90 dias. Alta volatilidade indica medo.',
            icon: faChartLine
        },
        {
            title: 'Momentum & Volume',
            percentage: 25,
            description: 'Analisa o volume de negociação e a aceleração do preço. Alto volume em alta indica ganância.',
            icon: faArrowTrendUp
        },
        {
            title: 'Redes Sociais',
            percentage: 15,
            description: 'Monitora hashtags e engajamento no Twitter/X relacionados ao Bitcoin.',
            icon: faTwitter
        },
        {
            title: 'Dominância BTC',
            percentage: 10,
            description: 'Mede a participação do Bitcoin no mercado total. Dominância subindo indica busca por segurança.',
            icon: faScaleBalanced
        },
        {
            title: 'Google Trends',
            percentage: 10,
            description: 'Analisa o volume de buscas por termos relacionados ao Bitcoin no Google.',
            icon: faLightbulb
        },
        {
            title: 'Pesquisas',
            percentage: 15,
            description: 'Enquetes de opinião com investidores. Atualmente pausado pela Alternative.me.',
            icon: faQuestionCircle
        }
    ];

    const classificationItems = [
        { range: '0-24', label: 'Medo Extremo', description: 'Investidores muito preocupados. Possível oportunidade de compra.', color: '#EF4444', icon: faSnowflake },
        { range: '25-49', label: 'Medo', description: 'Cautela geral no mercado. Fase de acumulação potencial.', color: '#F97316', icon: faArrowTrendDown },
        { range: '50', label: 'Neutro', description: 'Sentimento equilibrado. Mercado sem viés claro.', color: '#EAB308', icon: faScaleBalanced },
        { range: '51-74', label: 'Ganância', description: 'Confiança crescente. Risco de sobrevalorização.', color: '#10B981', icon: faArrowTrendUp },
        { range: '75-100', label: 'Ganância Extrema', description: 'Mercado superaquecido. Possível correção à vista.', color: '#22C55E', icon: faFireFlameSimple }
    ];

    return (
        <PageWrapper header={pageHeader}>
            <div className="max-w-6xl mx-auto px-4 pb-16 space-y-16">

                {/* Hero: Gauge + Intro */}
                <section className="grid lg:grid-cols-2 gap-8 items-center pt-4">
                    <div className="order-2 lg:order-1">
                        <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-4">
                            O que é o Índice Fear & Greed?
                        </h2>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-4">
                            O <strong>Índice de Medo e Ganância</strong> (Fear & Greed Index) é uma ferramenta que mede o sentimento emocional predominante no mercado de criptomoedas, especialmente Bitcoin.
                        </p>
                        <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                            Criado pela <strong>Alternative.me</strong> em 2018, ele converte diversas métricas de mercado em uma única pontuação de <strong>0 a 100</strong>, ajudando investidores a entender se o mercado está dominado pelo medo (pânico) ou pela ganância (euforia).
                        </p>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5 text-amber-500" />
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                <strong>Aviso:</strong> Este índice não é conselho financeiro. Use-o como ferramenta complementar à sua análise.
                            </p>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 flex justify-center">
                        <ZenithCard variant="glass" className="p-8 w-full max-w-md">
                            {!fearGreed ? (
                                <div className="h-64 flex items-center justify-center">
                                    <div className="animate-pulse text-[var(--text-tertiary)]">Carregando...</div>
                                </div>
                            ) : (
                                <FearGreedGaugeLarge
                                    value={gaugeValue}
                                    classification={fearGreed.value_classification}
                                />
                            )}
                        </ZenithCard>
                    </div>
                </section>

                {/* Por que Importa */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-6">
                        Por que o Sentimento Importa?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ZenithCard variant="glass" className="p-6">
                            <blockquote className="text-xl md:text-2xl font-bold text-[var(--text-primary)] italic mb-4">
                                "Tenha medo quando os outros estão gananciosos, e seja ganancioso quando os outros estão com medo."
                            </blockquote>
                            <p className="text-sm text-[var(--text-secondary)]">— Warren Buffett</p>
                        </ZenithCard>
                        <div className="space-y-4">
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                O mercado de criptomoedas é altamente emocional. Investidores frequentemente tomam decisões irracionais baseadas em:
                            </p>
                            <ul className="space-y-2 text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">→</span>
                                    <span><strong>FOMO</strong> (Fear of Missing Out): Comprar no topo por medo de perder a alta</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">→</span>
                                    <span><strong>Pânico</strong>: Vender no fundo por medo de mais quedas</span>
                                </li>
                            </ul>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                O índice ajuda a identificar esses extremos emocionais, permitindo decisões mais racionais.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Como é Calculado */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-6">
                        Como é Calculado?
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-8 max-w-3xl">
                        O índice combina <strong>6 fatores ponderados</strong>, cada um refletindo um aspecto diferente do comportamento do mercado:
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {methodologyItems.map((item) => (
                            <MethodologyCard key={item.title} {...item} />
                        ))}
                    </div>
                </section>

                {/* Como Interpretar */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-6">
                        Como Interpretar?
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classificationItems.map((item) => (
                            <ClassificationCard key={item.range} {...item} />
                        ))}
                    </div>
                </section>

                {/* Limitações */}
                <section>
                    <ZenithCard variant="orange" className="p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] mb-4">
                            Limitações e Riscos
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <ul className="space-y-3 text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500 font-bold">•</span>
                                    <span><strong>Indicador reativo (lagging):</strong> Reflete o passado, não prevê o futuro</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500 font-bold">•</span>
                                    <span><strong>Focado em Bitcoin:</strong> Pode não refletir o sentimento de altcoins específicas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500 font-bold">•</span>
                                    <span><strong>Não é autossuficiente:</strong> Deve ser usado com outras análises</span>
                                </li>
                            </ul>
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                    <strong>⚠️ IMPORTANTE:</strong> Este índice NÃO é conselho financeiro. Nunca invista mais do que pode perder. Criptomoedas são ativos de alta volatilidade e risco.
                                </p>
                            </div>
                        </div>
                    </ZenithCard>
                </section>

                {/* Fontes */}
                <section>
                    <h2 className="text-lg font-bold text-[var(--text-tertiary)] mb-4">Fontes e Referências</h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { name: 'Alternative.me', url: 'https://alternative.me/crypto/fear-and-greed-index/' },
                            { name: 'CoinMarketCap', url: 'https://coinmarketcap.com/charts/fear-and-greed-index/' },
                            { name: 'CoinGlass', url: 'https://www.coinglass.com/fear-greed-index' },
                            { name: 'Forbes', url: 'https://www.forbes.com/advisor/investing/cryptocurrency/crypto-fear-greed-index/' },
                        ].map((source) => (
                            <a
                                key={source.name}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] transition-colors"
                            >
                                {source.name} ↗
                            </a>
                        ))}
                    </div>
                </section>

            </div>
        </PageWrapper>
    );
}
