import React from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Newspaper,
    Wrench,
    LineChart,
    Heart,
    Eye,
    Scroll,
    Coins,
    ArrowRight,
    Sparkles
} from 'lucide-react';

export const metadata = {
    title: 'Comece Aqui: Seu Guia para o Mundo Cripto | $MILAGRE',
    description: 'Novo no mundo cripto? Este é seu ponto de partida. Aprenda, explore recursos, acompanhe notícias e entenda como construir patrimônio com segurança.',
};

const navigationCards = [
    {
        href: '/educacao',
        icon: BookOpen,
        title: 'Educação',
        description: 'Aprenda do zero ao avançado, sem promessas falsas',
        color: 'teal',
    },
    {
        href: '/noticias',
        icon: Newspaper,
        title: 'Notícias',
        description: 'Acompanhe o mercado com fact-checking',
        color: 'blue',
    },
    {
        href: '/recursos',
        icon: Wrench,
        title: 'Recursos',
        description: 'Ferramentas, reviews e comparativos',
        color: 'purple',
    },
    {
        href: '/graficos',
        icon: LineChart,
        title: 'Gráficos',
        description: 'Análise de preços e indicadores',
        color: 'amber',
    },
    {
        href: '/criptomoedas',
        icon: Coins,
        title: 'Criptomoedas',
        description: 'Explore o mercado de ativos digitais',
        color: 'orange',
    },
    {
        href: '/recuperacao',
        icon: Heart,
        title: 'Recuperação',
        description: 'Perdeu dinheiro? Temos apoio para recomeçar',
        color: 'rose',
    },
    {
        href: '/transparencia',
        icon: Eye,
        title: 'Transparência',
        description: 'Código aberto, métricas públicas',
        color: 'cyan',
    },
    {
        href: '/manifesto',
        icon: Scroll,
        title: 'Manifesto',
        description: 'Entenda nossa missão e valores',
        color: 'emerald',
    },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    teal: {
        bg: 'bg-teal-500/10',
        text: 'text-teal-600 dark:text-teal-400',
        border: 'border-teal-500/20 hover:border-teal-500/40',
        glow: 'group-hover:shadow-teal-500/20',
    },
    blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-500/20 hover:border-blue-500/40',
        glow: 'group-hover:shadow-blue-500/20',
    },
    purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-500/20 hover:border-purple-500/40',
        glow: 'group-hover:shadow-purple-500/20',
    },
    amber: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/20 hover:border-amber-500/40',
        glow: 'group-hover:shadow-amber-500/20',
    },
    orange: {
        bg: 'bg-orange-500/10',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-500/20 hover:border-orange-500/40',
        glow: 'group-hover:shadow-orange-500/20',
    },
    rose: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/20 hover:border-rose-500/40',
        glow: 'group-hover:shadow-rose-500/20',
    },
    cyan: {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-600 dark:text-cyan-400',
        border: 'border-cyan-500/20 hover:border-cyan-500/40',
        glow: 'group-hover:shadow-cyan-500/20',
    },
    emerald: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/20 hover:border-emerald-500/40',
        glow: 'group-hover:shadow-emerald-500/20',
    },
};

export default function ComeceAquiPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--brand-primary)]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-16">

                {/* Hero Section */}
                <section className="text-left space-y-6 animate-fade-in pt-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-sm text-[var(--brand-primary)]">
                        <Sparkles className="w-4 h-4" />
                        <span>Seu ponto de partida</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] leading-tight tracking-tight">
                        Bem-vindo ao <span className="text-[var(--brand-primary)]">$MILAGRE</span>
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                        Educação cripto <strong>sem promessas falsas</strong>.
                        Aqui você aprende a construir patrimônio com <strong>conhecimento real</strong>,
                        não com apostas.
                    </p>
                </section>

                {/* Arquitetura 80/20 - O Essencial Primeiro */}
                <section className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                        🎯 O que você precisa saber primeiro
                    </h2>
                    <div className="space-y-3 text-[var(--text-secondary)]">
                        <p><strong>1.</strong> Criptomoedas são <strong>voláteis</strong> — nunca invista o que não pode perder.</p>
                        <p><strong>2.</strong> A maioria das "oportunidades" são <strong>golpes</strong> — aprenda a identificar.</p>
                        <p><strong>3.</strong> Conhecimento &gt; Sinais de compra — <strong>educação</strong> é o único caminho sustentável.</p>
                        <p><strong>4.</strong> O $MILAGRE não dá conselhos financeiros — você <strong>toma suas próprias decisões</strong>.</p>
                    </div>
                </section>

                {/* Navigation Grid */}
                <section className="space-y-8">
                    <div className="text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                            Explore a Plataforma
                        </h2>
                        <p className="text-[var(--text-secondary)] mt-2">
                            Escolha por onde começar sua jornada
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {navigationCards.map((card) => {
                            const colors = colorMap[card.color];
                            const Icon = card.icon;

                            return (
                                <Link
                                    key={card.href}
                                    href={card.href}
                                    className={`
                                        group relative overflow-hidden rounded-2xl
                                        p-6 border transition-all duration-300
                                        bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)]
                                        ${colors.border}
                                        hover:shadow-xl ${colors.glow}
                                        hover:-translate-y-1
                                    `}
                                >
                                    <div className={`
                                        w-12 h-12 rounded-xl flex items-center justify-center mb-4
                                        ${colors.bg} ${colors.text}
                                    `}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <h3 className="font-bold text-lg text-[var(--text-primary)] mb-1 flex items-center gap-2">
                                        {card.title}
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        {card.description}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* CTA Final */}
                <section className="text-left space-y-6 pt-8">
                    <p className="text-[var(--text-secondary)] max-w-xl">
                        Não sabe por onde começar? Recomendamos a <strong>Educação</strong> —
                        é a base para tudo.
                    </p>
                    <Link
                        href="/educacao"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg hover:shadow-teal-500/25 transition-all hover:scale-105"
                    >
                        Começar pela Educação
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </section>

                {/* Footer Note */}
                <div className="text-left text-sm text-[var(--text-tertiary)] max-w-2xl italic border-t border-[var(--border-light)] pt-8">
                    "Por isso digo-vos: Não andeis ansiosos pela vossa vida... Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas." — Mateus 6:25,33
                </div>

            </div>
        </main>
    );
}
