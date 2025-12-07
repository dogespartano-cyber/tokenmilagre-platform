import React from 'react';
import { Shield, BookOpen, Heart, Eye, Users, Globe, Scale } from 'lucide-react';

export default function ManifestoPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-5xl mx-auto relative z-10 space-y-20">

                {/* Header */}
                <div className="text-center space-y-8 pt-10 animate-fade-in">
                    <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] via-teal-500 to-emerald-500 tracking-tight">
                        Manifesto $MILAGRE
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-light">
                        Acreditamos que o conhecimento deve ser livre, mas a integridade deve ser protegida.
                        Este é o nosso compromisso com a <span className="font-bold text-teal-600 dark:text-teal-400">transparência radical</span> e a prosperidade real.
                    </p>
                </div>

                {/* Core Values Grid - Expandido */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
                        <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                            <Heart className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Propósito Divino</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            Nossa missão transcende o lucro. Somos um farol de esperança guiando as pessoas para longe da ganância e em direção à mordomia fiel dos recursos.
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
                        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Conhecimento Livre</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            Todo o nosso material educacional é licenciado sob <strong>Creative Commons (CC-BY-SA)</strong>. O saber não pertence a ninguém, ele flui livremente para quem busca.
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
                        <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                            <Shield className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Proteção Ativa</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            Nosso código é 100% aberto sob licença <strong>MIT</strong>. Quando você vê a marca $MILAGRE, sabe que está em um porto seguro e auditável.
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
                        <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Comunidade Horizontal</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            Não há "VIPs" ou "Insiders". Todos somos Testemunhas. O conhecimento e as oportunidades são distribuídos igualmente.
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
                        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                            <Globe className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Descentralização Real</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            Acreditamos na soberania do indivíduo. Ensinamos auto-custódia e DeFi para que você nunca dependa de terceiros para gerir seu patrimônio.
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg shadow-sm hover:border-teal-500/30 transition-all group">
                        <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                            <Scale className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Justiça Econômica</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            Combatemos a cultura de "Pump and Dump". Construímos valor sustentável através de utilidade real e educação contínua.
                        </p>
                    </div>
                </div>

                {/* Transparência Radical Section */}
                <div className="glass-card p-8 md:p-12 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-xl space-y-10 shadow-sm relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Eye className="w-64 h-64 text-teal-500" />
                    </div>

                    <div className="space-y-6 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">Transparência Radical: Nossa Filosofia</h2>
                        <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-3xl">
                            Em um mercado cheio de projetos secretos e promessas vazias, escolhemos o caminho oposto:
                            <span className="text-teal-600 dark:text-teal-400 font-bold"> abertura total</span>.
                            Nosso código, nossas decisões e nossas finanças são públicas. Não temos nada a esconder.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-6 p-6 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-light)]">
                            <div className="flex items-center gap-4 text-emerald-600 dark:text-emerald-400 mb-2">
                                <div className="p-3 bg-emerald-500/10 rounded-xl">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-xl">100% Open Source</h3>
                            </div>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                Todo o código fonte está no GitHub para qualquer pessoa auditar. Contratos inteligentes, plataforma, tudo. Sem backdoors, sem taxas ocultas, sem surpresas. <br /><br /><strong>A verdade não teme a luz.</strong>
                            </p>
                        </div>

                        <div className="space-y-6 p-6 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-light)]">
                            <div className="flex items-center gap-4 text-emerald-600 dark:text-emerald-400 mb-2">
                                <div className="p-3 bg-emerald-500/10 rounded-xl">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-xl">Licença MIT - Liberdade Total</h3>
                            </div>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                Usamos a licença <strong>MIT</strong>, uma das mais permissivas do mundo. Qualquer pessoa pode estudar, modificar, usar comercialmente ou criar projetos derivados. <br /><br /><strong>Acreditamos que o conhecimento livre gera mais valor do que muros.</strong>
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[var(--border-light)] relative z-10">
                        <p className="text-center text-[var(--text-tertiary)] italic text-lg font-serif">
                            "Conhecereis a verdade, e a verdade vos libertará." — João 8:32
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
}
