import React from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, Heart, ArrowRight, CheckCircle, BookOpen, Users, Search } from 'lucide-react';

export const metadata = {
    title: 'Comece Aqui: O Fim da Sua Perda | $MILAGRE',
    description: 'Cansado de perder dinheiro em golpes e promessas falsas? Descubra a verdade sobre o mercado cripto e como construir prosperidade real com segurança.',
};

export default function ComeceAquiPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements - Calming Green/Teal */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-20">

                {/* Hero Section: A Empatia */}
                <section className="text-center space-y-8 animate-fade-in pt-10">


                    <h1 className="text-4xl md:text-7xl font-bold text-[var(--text-primary)] leading-tight tracking-tight">
                        Cansado de ser a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                            liquidez de saída
                        </span> dos outros?
                    </h1>

                    <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-light">
                        Se você chegou aqui sentindo que o mercado cripto é um cassino viciado contra você...
                        <span className="font-bold text-teal-600 dark:text-teal-400"> você não está louco.</span> Mentiram para você.
                    </p>
                </section>

                {/* A Realidade vs A Mentira */}
                <section className="grid md:grid-cols-2 gap-8">
                    {/* O que venderam */}
                    <div className="glass-card p-8 rounded-3xl border border-red-500/20 bg-red-500/5 relative overflow-hidden hover:border-red-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <AlertTriangle className="w-32 h-32 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-sm">✕</span>
                            O que te venderam
                        </h3>
                        <ul className="space-y-4 text-[var(--text-secondary)]">
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-1 font-bold">•</span>
                                <span>"Fique rico da noite para o dia com essa memecoin."</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-1 font-bold">•</span>
                                <span>"Grupo VIP de sinais com 100% de acerto."</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-1 font-bold">•</span>
                                <span>"Confie no influenciador, ele quer te ajudar."</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-1 font-bold">•</span>
                                <span>Projetos sem código auditado e donos anônimos.</span>
                            </li>
                        </ul>
                    </div>

                    {/* A Realidade $MILAGRE */}
                    <div className="glass-card p-8 rounded-3xl border border-teal-500/20 bg-teal-500/5 relative overflow-hidden hover:border-teal-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield className="w-32 h-32 text-teal-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-sm">✓</span>
                            A Realidade Aqui
                        </h3>
                        <ul className="space-y-4 text-[var(--text-secondary)]">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                                <span>A riqueza vem da construção e do conhecimento real.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                                <span>Educação gratuita para você tomar suas próprias decisões.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                                <span>Comunidade horizontal: todos somos testemunhas.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                                <span>Código aberto, auditável e protegido (BSL).</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Os 3 Pilares da Recuperação */}
                <section className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">Os 3 Pilares da Sua Recuperação</h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Para sair do ciclo de perdas, você precisa de uma base sólida. O $MILAGRE oferece essa estrutura gratuitamente.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-[var(--bg-elevated)]/30 border border-[var(--border-light)] hover:border-teal-500/30 transition-all group">
                            <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Educação Profunda</h3>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                Esqueça "sinais de compra". Ensinamos análise fundamentalista, leitura de contratos e segurança DeFi. O conhecimento é a única vacina contra golpes.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[var(--bg-elevated)]/30 border border-[var(--border-light)] hover:border-teal-500/30 transition-all group">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Comunidade Real</h3>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                Um ambiente onde dúvidas são bem-vindas e ninguém é deixado para trás. Nossos "Guardiões" estão aqui para ajudar, não para usar você como liquidez.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[var(--bg-elevated)]/30 border border-[var(--border-light)] hover:border-teal-500/30 transition-all group">
                            <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                                <Search className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Transparência Radical</h3>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                Ferramentas como o "Verificador de URL" e nosso código aberto garantem que você saiba exatamente onde está pisando. Sem caixas pretas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Passo a Passo Prático */}
                <section className="glass-card p-8 md:p-12 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-8 text-center">Seus Primeiros Passos Seguros</h2>
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">1</div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Pare de Operar Agora</h4>
                                <p className="text-[var(--text-secondary)] text-sm mt-1">Se você acabou de perder dinheiro, sua mente está vulnerável. Não tente "recuperar" rápido. Respire.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">2</div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Entenda o que Aconteceu</h4>
                                <p className="text-[var(--text-secondary)] text-sm mt-1">
                                    Acesse nossa <Link href="/educacao" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">central de educação</Link> para entender como identificar golpes e proteger seu patrimônio.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">3</div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Junte-se ao Santuário</h4>
                                <p className="text-[var(--text-secondary)] text-sm mt-1">Entre no nosso Discord. Não para pedir dinheiro, mas para ganhar perspectiva e apoio.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* O Resgate Começa Agora - Refatorado sem Card */}
                <section className="text-center space-y-8 pt-8 pb-12">
                    <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto text-teal-600 dark:text-teal-400 mb-6 animate-pulse-slow">
                        <Heart className="w-10 h-10" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">O Resgate Começa Agora</h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        O $MILAGRE não é uma promessa de lucro fácil. É uma promessa de <strong>nunca mais ser enganado</strong>.
                        Construímos um ecossistema focado em distribuir a verdadeira prosperidade: o conhecimento.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                        <Link
                            href="/manifesto"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-[var(--text-primary)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-light)] transition-all flex items-center justify-center gap-2 hover:scale-105"
                        >
                            Ler o Manifesto
                        </Link>
                        <Link
                            href="/educacao"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2 group hover:scale-105"
                        >
                            Começar a Aprender
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>

                {/* Disclaimer Ético */}
                <div className="text-center text-sm text-[var(--text-tertiary)] max-w-2xl mx-auto italic border-t border-[var(--border-light)] pt-8">
                    "E conhecereis a verdade, e a verdade vos libertará." — João 8:32
                </div>

            </div>
        </main>
    );
}
