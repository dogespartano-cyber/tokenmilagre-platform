
import React from 'react';
import { Github, Shield, Users, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import TransparencyStats from '@/components/shared/TransparencyStats';
import { SOCIAL_LINKS } from '@/lib/core/constants/social';

export const metadata = {
    title: 'Transparência | $MILAGRE',
    description: 'Acompanhe nosso desenvolvimento, métricas e código em tempo real. Sem segredos.',
};

export default function TransparenciaPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-5xl mx-auto relative z-10 space-y-16">

                {/* Header */}
                <div className="text-center space-y-6 pt-10 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] via-teal-500 to-cyan-500 tracking-tight">
                        Transparência
                    </h1>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-light">
                        A confiança não se pede, se prova. Acompanhe nossas métricas, status e desenvolvimento em tempo real.
                    </p>
                </div>

                {/* System Status - Real-time Stats */}
                <TransparencyStats />

                {/* Open Source / Git Section - Minimalist */}
                <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 relative overflow-hidden group">
                    {/* Subtle Decoration */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <Github className="w-48 h-48" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-3 text-teal-600 dark:text-teal-400">
                                <Github className="w-6 h-6" />
                                <span className="text-sm font-bold uppercase tracking-wider">Open Source</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                                100% Auditável e Público
                            </h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed max-w-lg">
                                Cada linha de código que alimenta esta plataforma está disponível para auditoria.
                                Licença MIT — use, modifique e contribua livremente.
                            </p>
                            <div className="pt-2">
                                <Link
                                    href="https://github.com/dogespartano-cyber/tokenmilagre-platform"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm border border-[var(--border-light)] hover:bg-teal-500/10 hover:border-teal-500/30 transition-all"
                                >
                                    <Github className="w-4 h-4" />
                                    Ver no GitHub
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Terminal Minimalista */}
                        <div className="w-full md:w-96 rounded-xl overflow-hidden bg-[#1e1e1e] border border-[#333] shadow-lg font-mono text-xs">
                            <div className="flex items-center gap-1.5 px-4 py-3 bg-[#252526] border-b border-[#333]">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                            </div>
                            <div className="p-4 space-y-2 text-gray-300">
                                <div className="flex gap-2">
                                    <span className="text-emerald-400">$</span>
                                    <span>git status</span>
                                </div>
                                <div className="text-gray-500">On branch main</div>
                                <div className="text-gray-500">Your branch is up to date.</div>
                                <div className="text-emerald-400 mt-2">nothing to commit, working tree clean</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics & Security - Combined Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Security Column */}
                    <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-teal-500/10 rounded-xl text-teal-600 dark:text-teal-400">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Status de Segurança</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-light)]">
                                <span className="text-sm font-medium text-[var(--text-secondary)]">Contrato Renunciado</span>
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-light)]">
                                <span className="text-sm font-medium text-[var(--text-secondary)]">Liquidez Travada</span>
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-light)] opacity-75">
                                <span className="text-sm font-medium text-[var(--text-secondary)]">Auditoria Externa</span>
                                <span className="text-xs px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 font-bold border border-yellow-500/20">
                                    Pendente
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Community Column */}
                    <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-600 dark:text-cyan-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Canais Oficiais</h3>
                        </div>

                        <div className="space-y-4">
                            <Link href={SOCIAL_LINKS.DISCORD} target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-light)] hover:bg-[#5865F2]/10 hover:border-[#5865F2]/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.176 2.419 0 1.334-.966 2.419-2.176 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.176 2.419 0 1.334-.966 2.419-2.176 2.419z" /></svg>
                                    </div>
                                    <span className="font-semibold text-[var(--text-primary)]">Discord</span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)]" />
                            </Link>

                            <Link href={SOCIAL_LINKS.TELEGRAM} target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-light)] hover:bg-[#229ED9]/10 hover:border-[#229ED9]/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#229ED9]/20 flex items-center justify-center text-[#229ED9]">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.06-.14-.04-.21-.02-.09.02-1.49.95-4.21 2.79-.4.27-.76.4-1.08.39-.35-.01-1.02-.2-1.52-.35-.62-.18-1.1-.28-1.05-.58.02-.15.24-.3.67-.46 2.64-1.15 4.39-1.91 5.27-2.28 2.51-1.06 3.03-1.24 3.37-1.24.08 0 .24.01.34.08.09.07.12.16.13.25-.01.07-.01.12-.02.16z" /></svg>
                                    </div>
                                    <span className="font-semibold text-[var(--text-primary)]">Telegram</span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)]" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quem está por trás? - Versão compacta */}
                <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
                    {/* Glow no topo no hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-500 to-blue-500" style={{ boxShadow: '0 0 20px #06b6d440' }} />

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                            Quem está por trás?
                        </h3>
                    </div>

                    <div className="space-y-4 text-[var(--text-secondary)]">
                        <p className="leading-relaxed">
                            Criado por <span className="font-semibold text-[var(--text-primary)]">dogespartano</span>,
                            um desenvolvedor anônimo que acredita em <strong className="text-cyan-600 dark:text-cyan-400">fé + educação</strong> como
                            ferramentas para transformar o mercado cripto.
                        </p>

                        <p className="text-sm text-[var(--text-tertiary)]">
                            A escolha pela privacidade é intencional — o projeto deve ser julgado pelo <strong>código</strong>, não pela pessoa.
                            O código está 100% aberto para auditoria.
                        </p>

                        <p className="text-sm">
                            <strong className="text-[var(--text-primary)]">Contato:</strong>{' '}
                            <a href="mailto:dogespartano@proton.me" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                                dogespartano@proton.me
                            </a>
                        </p>

                        <p className="text-sm text-[var(--text-tertiary)] italic border-t border-cyan-500/10 pt-4 mt-4">
                            "A falta de um rosto não significa falta de compromisso — os commits provam o trabalho."
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
}
