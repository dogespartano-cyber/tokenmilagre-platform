import React from 'react';
import { Shield, BookOpen, Heart, Lock, Eye } from 'lucide-react';

export default function ManifestoPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 space-y-12">

                {/* Header */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">
                        Manifesto $MILAGRE
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Acreditamos que o conhecimento deve ser livre, mas a integridade deve ser protegida.
                        Este é o nosso compromisso com a transparência, a educação e a segurança.
                    </p>
                </div>

                {/* Core Values Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-300">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Propósito Divino</h3>
                        <p className="text-gray-400 text-sm">
                            Nossa missão é ser um farol de esperança e educação, guiando as pessoas para longe de golpes e em direção à prosperidade real.
                        </p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-300">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Conhecimento Livre</h3>
                        <p className="text-gray-400 text-sm">
                            Todo o nosso material educacional é livre (Creative Commons). O saber não pertence a ninguém, ele flui para quem busca.
                        </p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 text-green-300">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Proteção Ativa</h3>
                        <p className="text-gray-400 text-sm">
                            Protegemos nossa plataforma contra cópias maliciosas para garantir que, quando você vir a marca $MILAGRE, saiba que é seguro.
                        </p>
                    </div>
                </div>

                {/* The "Middle Path" Section */}
                <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-white">O Caminho do Meio</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Vivemos em um mundo onde a confiança é rara, especialmente em cripto. Por isso, adotamos uma postura radical de
                            <span className="text-purple-300 font-semibold"> Transparência Seletiva</span>.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-green-400 mb-2">
                                <Eye className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Código Aberto para Auditoria</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Nosso código fonte está disponível publicamente. Qualquer desenvolvedor pode auditar nossos contratos e nossa plataforma para verificar que não há "backdoors" ou intenções ocultas. A verdade não teme a luz.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-red-400 mb-2">
                                <Lock className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Protegido Contra Cópias</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Embora o código seja visível, ele é protegido pela licença <strong>BSL 1.1</strong>. Isso significa que golpistas não podem legalmente copiar nosso site para criar clones falsos ("phishing"). Protegemos nosso trabalho para proteger você.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <p className="text-center text-gray-500 text-sm italic">
                            "Sede prudentes como as serpentes e simples como as pombas." — Mateus 10:16
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
}
