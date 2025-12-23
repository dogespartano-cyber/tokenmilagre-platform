/**
 * @module comece-aqui
 * @description Página de onboarding - guia para iniciantes no mundo cripto
 * @page-header Título/descrição renderizados via PageWrapper inline
 */

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Newspaper,
    Wrench,
    LineChart,
    Scroll,
    ArrowRight,
    Users,
    CheckCircle,
    XCircle,
    ChevronDown,
    Shield,
    Code,
    Eye,
    HelpCircle
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { useSidebar } from '@/contexts/SidebarContext';

// Header config - inline para IA reconhecer
const pageHeader = {
    title: 'Comece Aqui',
    description: 'Seu ponto de partida no mundo cripto. Educação sem promessas falsas, conhecimento real.',
    shortTitle: 'Começar'
};

// Cards de navegação com cores neon (teal unificado)
const navigationCards = [
    {
        href: '/educacao',
        icon: BookOpen,
        title: 'Educação',
        description: 'Aprenda do zero ao avançado',
        gradient: 'from-teal-500/10 to-emerald-500/5',
        borderColor: 'border-teal-500/20 hover:border-teal-500/40',
        textColor: 'text-teal-600 dark:text-teal-400',
        glowColor: '#14b8a6'
    },
    {
        href: '/noticias',
        icon: Newspaper,
        title: 'Notícias',
        description: 'Fact-checking do mercado',
        gradient: 'from-teal-500/10 to-emerald-500/5',
        borderColor: 'border-teal-500/20 hover:border-teal-500/40',
        textColor: 'text-teal-600 dark:text-teal-400',
        glowColor: '#14b8a6'
    },
    {
        href: '/recursos',
        icon: Wrench,
        title: 'Recursos',
        description: 'Ferramentas seguras',
        gradient: 'from-teal-500/10 to-emerald-500/5',
        borderColor: 'border-teal-500/20 hover:border-teal-500/40',
        textColor: 'text-teal-600 dark:text-teal-400',
        glowColor: '#14b8a6'
    },
    {
        href: '/graficos',
        icon: LineChart,
        title: 'Gráficos',
        description: 'Análise de preços',
        gradient: 'from-teal-500/10 to-emerald-500/5',
        borderColor: 'border-teal-500/20 hover:border-teal-500/40',
        textColor: 'text-teal-600 dark:text-teal-400',
        glowColor: '#14b8a6'
    },
];

// Trilha do iniciante
const trailSteps = [
    { step: 1, title: 'Leia o Manifesto', desc: 'Entenda nossos valores', href: '/manifesto', icon: Scroll },
    { step: 2, title: 'Faça o curso básico', desc: 'Cripto do Zero (gratuito)', href: '/educacao', icon: BookOpen },
    { step: 3, title: 'Explore os Recursos', desc: 'Wallets e exchanges seguras', href: '/recursos', icon: Wrench },
    { step: 4, title: 'Acompanhe Notícias', desc: 'Com fact-checking', href: '/noticias', icon: Newspaper },
    { step: 5, title: 'Analise Gráficos', desc: 'Aprenda análise técnica', href: '/graficos', icon: LineChart },
    { step: 6, title: 'Entre na Comunidade', desc: 'Telegram e Discord', href: '/sobre', icon: Users },
];

// FAQ
const faqs = [
    { q: 'O $MILAGRE é uma criptomoeda?', a: 'Sim, mas somos mais uma comunidade educacional. O token existe, mas o foco é conhecimento.' },
    { q: 'Preciso comprar o token para usar a plataforma?', a: 'Não! Todo o conteúdo educacional é gratuito e aberto.' },
    { q: 'Vocês dão conselhos de investimento?', a: 'Nunca. Educamos para você tomar suas próprias decisões informadas.' },
    { q: 'Por que mencionam Deus/fé?', a: 'É parte dos valores fundadores da comunidade, mas respeitamos todas as crenças.' },
];

export default function ComeceAquiPage() {
    const { setSidebarMode, resetSidebar } = useSidebar();

    // Configurar sidebar com as seções da página
    useEffect(() => {
        setSidebarMode('comece-aqui', {
            sections: [
                { id: 'essencial', title: 'O Essencial Primeiro', icon: 'shield' },
                { id: 'para-quem', title: 'Para Quem É', icon: 'users' },
                { id: 'trilha', title: 'Sua Trilha', icon: 'graduation' },
                { id: 'explore', title: 'Explore a Plataforma', icon: 'compass' },
                { id: 'faq', title: 'FAQ', icon: 'question' },
                { id: 'sobre', title: 'Sobre o Projeto', icon: 'heart' },
            ]
        });

        return () => resetSidebar();
    }, [setSidebarMode, resetSidebar]);

    return (
        <PageWrapper header={pageHeader}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-4 lg:py-8 relative z-10">
                <div className="space-y-16 pb-20">

                    {/* SEÇÃO 1: O Essencial Primeiro */}
                    <section id="essencial" className="scroll-mt-24">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">O Essencial Primeiro</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { num: '1', text: 'Criptomoedas são voláteis', sub: 'Nunca invista o que não pode perder' },
                                { num: '2', text: 'Maioria das "oportunidades" são golpes', sub: 'Aprenda a identificar' },
                                { num: '3', text: 'Conhecimento é maior que indicação e sinais de compra e venda', sub: 'Educação é o único caminho' },
                                { num: '4', text: 'Não damos conselhos financeiros', sub: 'Você toma suas decisões' },
                            ].map((item, idx) => (
                                <div key={idx} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-500/10 to-slate-500/5 border border-gray-500/20 p-6 hover:shadow-xl hover:shadow-gray-500/10 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold text-lg">
                                            {item.num}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--text-primary)]">{item.text}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">{item.sub}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SEÇÃO 3: Para Quem É / Não É */}
                    <section id="para-quem" className="scroll-mt-24">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Para quem é?</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Para Quem É */}
                            <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                                    <h3 className="font-bold text-emerald-400 text-lg">Para Você Se...</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        'Quer aprender do zero sobre cripto',
                                        'Busca investimentos de longo prazo',
                                        'Já perdeu dinheiro e quer recomeçar',
                                        'É cético e quer filtrar golpes'
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="text-emerald-500 mt-0.5">✓</span>
                                            <span className="text-[var(--text-secondary)]">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Para Quem NÃO É */}
                            <div className="rounded-3xl bg-gradient-to-br from-rose-500/10 to-red-500/5 border border-rose-500/20 p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <XCircle className="w-6 h-6 text-rose-500" />
                                    <h3 className="font-bold text-rose-400 text-lg">Não é Para Você Se...</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        'Busca "sinais de compra" e trades rápidos',
                                        'Quer ficar rico rápido',
                                        'Não aceita que há riscos',
                                        'Espera investimento garantido'
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="text-rose-500 mt-0.5">✗</span>
                                            <span className="text-[var(--text-secondary)]">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* SEÇÃO 4: Trilha do Iniciante */}
                    <section id="trilha" className="scroll-mt-24">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Sua Trilha de Iniciante</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {trailSteps.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.step}
                                        href={item.href}
                                        className="group flex flex-col p-5 rounded-3xl bg-gradient-to-br from-gray-500/10 to-slate-500/5 border border-gray-500/20 hover:border-[var(--brand-primary)]/30 hover:shadow-xl hover:shadow-gray-500/10 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] mb-3">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <p className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors mb-1">{item.title}</p>
                                        <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {/* SEÇÃO 5: Explore a Plataforma */}
                    <section id="explore" className="scroll-mt-24">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Explore a Plataforma</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {navigationCards.map((card) => {
                                const Icon = card.icon;
                                return (
                                    <Link
                                        key={card.href}
                                        href={card.href}
                                        className={`group relative p-6 rounded-2xl bg-gradient-to-br ${card.gradient} ${card.borderColor} backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-pointer h-full flex flex-col justify-center min-h-[140px]`}
                                        style={{ '--card-glow': card.glowColor } as React.CSSProperties}
                                    >
                                        {/* Glow no topo */}
                                        <div
                                            className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{
                                                backgroundColor: card.glowColor,
                                                boxShadow: `0 0 20px ${card.glowColor}40`
                                            }}
                                        />

                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`p-2 rounded-xl bg-gray-500/10 transition-transform duration-300 group-hover:scale-110`}>
                                                <Icon className={`w-5 h-5 ${card.textColor} transition-colors`} />
                                            </div>
                                            <h3 className={`font-bold ${card.textColor} text-sm lg:text-base transition-colors`}>{card.title}</h3>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-[var(--text-secondary)] mb-2">{card.description}</p>

                                        {/* Arrow indicator */}
                                        <div className={`flex items-center gap-1 text-xs ${card.textColor} opacity-60 group-hover:opacity-100 transition-all`}>
                                            <span>Acessar</span>
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {/* SEÇÃO 6: FAQ */}
                    <section id="faq" className="scroll-mt-24">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Perguntas Frequentes</h2>
                        </div>
                        <div className="space-y-3">
                            {faqs.map((faq, idx) => (
                                <details
                                    key={idx}
                                    className="group rounded-2xl bg-gradient-to-br from-gray-500/5 to-slate-500/5 border border-gray-500/10 overflow-hidden"
                                >
                                    <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-[var(--text-primary)] hover:bg-gray-500/5 transition-colors">
                                        {faq.q}
                                        <ChevronDown className="w-5 h-5 text-[var(--text-tertiary)] group-open:rotate-180 transition-transform flex-shrink-0" />
                                    </summary>
                                    <div className="px-5 pb-5 pt-4 border-t border-gray-500/10 text-[var(--text-secondary)] text-sm leading-relaxed">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/* SEÇÃO 7: Card Compacto - Sobre o Projeto */}
                    <section id="sobre" className="scroll-mt-24">
                        <div className="rounded-3xl bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent border border-[var(--brand-primary)]/10 p-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Quer saber mais sobre o projeto?</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Código 100% aberto, fact-checking em todo conteúdo, métricas públicas e uma comunidade ética.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-500/10 text-gray-400">
                                            <Code className="w-4 h-4" />
                                        </div>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-500/10 text-gray-400">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-500/10 text-gray-400">
                                            <Eye className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <Link
                                        href="/sobre"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-medium text-sm hover:bg-[var(--brand-primary)]/20 transition-colors"
                                    >
                                        Conheça
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Final */}
                    <section className="space-y-6 py-8">
                        <p className="text-[var(--text-secondary)] text-lg">
                            Pronto para começar? A <strong className="text-[var(--text-primary)]">Educação</strong> é o melhor primeiro passo.
                        </p>
                        <Link
                            href="/educacao"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-hover)] hover:opacity-90 shadow-xl shadow-[var(--brand-primary)]/20 transition-all hover:scale-105"
                        >
                            Começar pela Educação
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </section>

                    {/* Footer Note */}
                    <div className="text-sm text-[var(--text-tertiary)] max-w-2xl italic border-t border-[var(--border-light)] pt-8">
                        "Por isso digo-vos: Não andeis ansiosos pela vossa vida... Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas." — Mateus 6:25,33
                    </div>

                </div>
            </div >
        </PageWrapper >
    );
}
