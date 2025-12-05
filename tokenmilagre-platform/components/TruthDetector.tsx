import React from 'react';
import { AlertTriangle, Search, ShieldCheck, XCircle } from 'lucide-react';

export default function TruthDetector() {
    return (
        <div className="glass-card p-8 rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent relative overflow-hidden my-12">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Search className="w-48 h-48 text-red-500" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Detector de Mentiras</h3>
                        <p className="text-sm text-gray-400">Aprenda a identificar um golpe antes de perder dinheiro.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Red Flags */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-red-400 flex items-center gap-2">
                            <XCircle className="w-5 h-5" />
                            Sinais de Perigo (Red Flags)
                        </h4>
                        <ul className="space-y-3">
                            {[
                                'Promessas de lucro fixo ou garantido (ex: "1% ao dia")',
                                'Liquidez não travada (Dev pode sacar tudo)',
                                'Contrato não renunciado (Dev pode mudar as regras)',
                                'Influenciadores pagos fazendo "shill" agressivo',
                                'Site genérico copiado de outros projetos',
                                'Impossível vender o token (Honeypot)'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-400 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                    <span className="text-red-500 font-bold">✕</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Green Flags */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-teal-400 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            Sinais de Segurança (Green Flags)
                        </h4>
                        <ul className="space-y-3">
                            {[
                                'Código aberto e verificado no explorador',
                                'Liquidez queimada ou travada por longo prazo',
                                'Distribuição justa (sem carteiras gigantes de Dev)',
                                'Comunidade orgânica e ativa (não bots)',
                                'Foco em construção e utilidade, não só preço',
                                'Transparência total sobre riscos'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-400 bg-teal-500/5 p-3 rounded-lg border border-teal-500/10">
                                    <span className="text-teal-500 font-bold">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-sm text-gray-500">
                        Na dúvida? Use nosso <span className="text-teal-400 font-bold">Verificador de URL</span> ou pergunte na comunidade.
                    </p>
                </div>
            </div>
        </div>
    );
}
