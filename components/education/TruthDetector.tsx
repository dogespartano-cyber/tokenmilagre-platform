import React from 'react';
import { AlertTriangle, Search, ShieldCheck, XCircle } from 'lucide-react';

import Link from 'next/link';

interface TruthDetectorProps {
    frameless?: boolean;
}

export default function TruthDetector({ frameless = false }: TruthDetectorProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6 p-2">
            {/* Card 1: Red Flags */}
            <div className={`p-6 rounded-2xl h-full ${frameless ? 'bg-red-500/5 border border-red-500/10' : 'glass-card'}`}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500 shrink-0">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight">
                        Sinais de Perigo (Cuidado!)
                    </h3>
                </div>
                <ul className="space-y-3">
                    {[
                        'Promessas de lucro rápido e garantido.',
                        'O criador pode sacar toda a liquidez.',
                        'Regras do contrato mudam a qualquer hora.',
                        'Marketing só com influenciadores pagos.',
                        'Site copiado ou feito às pressas.',
                        'Você compra mas não consegue vender.'
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                            <span className="text-red-500 font-bold mt-0.5 text-base">•</span>
                            <span className="leading-snug">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Card 2: Green Flags */}
            <div className={`p-6 rounded-2xl h-full ${frameless ? 'bg-teal-500/5 border border-teal-500/10' : 'glass-card'}`}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-500/10 text-teal-500 shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight">
                        Sinais de Segurança (Bom!)
                    </h3>
                </div>
                <ul className="space-y-3">
                    {[
                        'Contrato verificado e aberto para todos.',
                        'Liquidez travada para segurança.',
                        'Distribuição justa de tokens.',
                        'Comunidade real, sem robôs.',
                        'Foco em utilidade, não só preço.',
                        'Falam a verdade sobre os riscos.'
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                            <span className="text-teal-500 font-bold mt-0.5 text-base">•</span>
                            <span className="leading-snug">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
