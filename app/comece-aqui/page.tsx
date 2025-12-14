/**
 * @module comece-aqui
 * @description Página de introdução à plataforma $MILAGRE
 */

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
    ArrowRight,
    Users,
    Shield,
    Code,
    CheckCircle,
    XCircle,
    ChevronDown
} from 'lucide-react';

export const metadata = {
    title: 'Comece Aqui: Seu Guia para o Mundo Cripto | $MILAGRE',
    description: 'Novo no mundo cripto? Este é seu ponto de partida. Aprenda, explore recursos, acompanhe notícias e entenda como construir patrimônio com segurança.',
};

// Cards de navegação
const navigationCards = [
    { href: '/educacao', icon: BookOpen, title: 'Educação', description: 'Aprenda do zero ao avançado', gradient: 'from-teal-500/20 to-emerald-500/10' },
    { href: '/noticias', icon: Newspaper, title: 'Notícias', description: 'Fact-checking do mercado', gradient: 'from-blue-500/20 to-cyan-500/10' },
    { href: '/recursos', icon: Wrench, title: 'Recursos', description: 'Ferramentas seguras', gradient: 'from-purple-500/20 to-violet-500/10' },
    { href: '/graficos', icon: LineChart, title: 'Gráficos', description: 'Análise de preços', gradient: 'from-amber-500/20 to-orange-500/10' },
];

// Trilha do iniciante
const trailSteps = [
    { step: 1, title: 'Leia o Manifesto', desc: 'Entenda nossos valores', href: '/manifesto', icon: Scroll },
    { step: 2, title: 'Faça o curso básico', desc: 'Cripto do Zero (gratuito)', href: '/educacao', icon: BookOpen },
    { step: 3, title: 'Explore os Recursos', desc: 'Wallets e exchanges seguras', href: '/recursos', icon: Wrench },
    { step: 4, title: 'Acompanhe Notícias', desc: 'Com fact-checking', href: '/noticias', icon: Newspaper },
    { step: 5, title: 'Entre na Comunidade', desc: 'Telegram e Discord', href: '#', icon: Users },
];

// FAQ
const faqs = [
    { q: 'O $MILAGRE é uma criptomoeda?', a: 'Sim, mas somos mais uma comunidade educacional. O token existe, mas o foco é conhecimento.' },
    { q: 'Preciso comprar o token para usar a plataforma?', a: 'Não! Todo o conteúdo educacional é gratuito e aberto.' },
    { q: 'Vocês dão conselhos de investimento?', a: 'Nunca. Educamos para você tomar suas próprias decisões informadas.' },
    { q: 'Por que mencionam Deus/fé?', a: 'É parte dos valores fundadores da comunidade, mas respeitamos todas as crenças.' },
];

export default function ComeceAquiPage() {
    return (
        <div className="min-h-screen relative">
            <div className="container mx-auto px-6 md:px-10 py-8 relative z-10">
                <div className="space-y-16 pb-20">

                    {/* SEÇÃO 1: O que você precisa saber */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">O Essencial Primeiro</h2>
                            <div className="h-1 flex-1 bg-[var(--border-light)] rounded-full opacity-20" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { num: '1', text: 'Criptomoedas são voláteis', sub: 'Nunca invista o que não pode perder' },
                                { num: '2', text: 'Maioria das "oportunidades" são golpes', sub: 'Aprenda a identificar' },
                                { num: '3', text: 'Conhecimento é maior que sinais de compra', sub: 'Educação é o único caminho' },
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

                    {/* SEÇÃO 2: Quem Somos */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">O que é o $MILAGRE?</h2>
                            <div className="h-1 flex-1 bg-[var(--border-light)] rounded-full opacity-20" />
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                { icon: Shield, title: 'Comunidade Educacional', desc: 'Conhecimento real sobre cripto', color: 'teal' },
                                { icon: Code, title: 'Código Aberto', desc: 'Transparência total', color: 'blue' },
                                { icon: Eye, title: 'Sem Promessas', desc: 'Você decide seus investimentos', color: 'purple' },
                                { icon: Heart, title: 'Valores Éticos', desc: 'Fé, amor e propósito', color: 'rose' },
                            ].map((item, idx) => (
                                <div key={idx} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-500/10 to-slate-500/5 border border-gray-500/20 p-6 hover:shadow-xl transition-all">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${item.color}-500/10 text-${item.color}-500 mb-4`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-[var(--text-primary)] mb-1">{item.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SEÇÃO 3: Para Quem É / Não É */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Para quem é?</h2>
                            <div className="h-1 flex-1 bg-[var(--border-light)] rounded-full opacity-20" />
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

                    {/* SEÇÃO 4: Explore a Plataforma */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Explore a Plataforma</h2>
                            <div className="h-1 flex-1 bg-[var(--border-light)] rounded-full opacity-20" />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {navigationCards.map((card) => {
                                const Icon = card.icon;
                                return (
                                    <Link
                                        key={card.href}
                                        href={card.href}
                                        className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient} border border-gray-500/20 p-6 flex flex-col justify-between min-h-[180px] hover:shadow-xl hover:shadow-gray-500/10 transition-all`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-500/10 text-gray-400">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-500/20 text-gray-400 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">{card.title}</h3>
                                            <p className="text-sm text-[var(--text-secondary)]">{card.description}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {/* SEÇÃO 5: Trilha do Iniciante */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Sua Trilha de Iniciante</h2>
                            <div className="h-1 flex-1 bg-[var(--border-light)] rounded-full opacity-20" />
                        </div>
                        <div className="space-y-3">
                            {trailSteps.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.step}
                                        href={item.href}
                                        className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-gray-500/5 to-slate-500/5 border border-gray-500/10 hover:border-[var(--brand-primary)]/30 hover:bg-gray-500/10 transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold text-lg">
                                            {item.step}
                                        </div>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-500/10 text-gray-400">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">{item.title}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:translate-x-1 group-hover:text-[var(--brand-primary)] transition-all" />
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {/* SEÇÃO 6: Por que somos diferentes */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Por que $MILAGRE é diferente?</h2>
                            <div className="h-1 flex-1 bg-[var(--border-light)] rounded-full opacity-20" />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { icon: Code, title: 'Código 100% Aberto', desc: 'Tudo no GitHub público' },
                                { icon: Shield, title: 'Fact-checking', desc: 'Todo conteúdo verificado' },
                                { icon: Eye, title: 'Métricas Públicas', desc: 'Transparência total' },
                            ].map((item, idx) => (
                                <div key={idx} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20 p-6 hover:shadow-xl transition-all">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] mb-4">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">{item.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SEÇÃO 7: FAQ */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Perguntas Frequentes</h2>
                            <div className="h-1 flex-1 bg-[var(--border-light)] rounded-full opacity-20" />
                        </div>
                        <div className="space-y-3">
                            {faqs.map((faq, idx) => (
                                <details
                                    key={idx}
                                    className="group rounded-2xl bg-gradient-to-br from-gray-500/5 to-slate-500/5 border border-gray-500/10 overflow-hidden"
                                >
                                    <summary className="flex items-center justify-between cursor-pointer p-5 font-medium text-[var(--text-primary)] hover:bg-gray-500/5 transition-colors">
                                        {faq.q}
                                        <ChevronDown className="w-5 h-5 text-[var(--text-tertiary)] group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-5 pb-5 text-[var(--text-secondary)]">{faq.a}</div>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/* CTA Final */}
                    <section className="text-left space-y-6">
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
                    <div className="text-left text-sm text-[var(--text-tertiary)] max-w-2xl italic border-t border-[var(--border-light)] pt-8">
                        "Por isso digo-vos: Não andeis ansiosos pela vossa vida... Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas." — Mateus 6:25,33
                    </div>

                </div>
            </div>
        </div>
    );
}
