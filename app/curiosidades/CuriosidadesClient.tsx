'use client';

import React, { useEffect, useState } from 'react';
import ZenithCard from '@/components/ui/ZenithCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Curiosity {
    id: string;
    content: string;
}

const fallbackCuriosities = [
    "A primeira transação de Bitcoin foi 10.000 BTC por duas pizzas em 2010.",
    "Satoshi Nakamoto, o criador do Bitcoin, possui cerca de 1.1 milhão de BTC.",
    "Estima-se que cerca de 20% de todo o Bitcoin existente esteja perdido para sempre.",
    "O último Bitcoin será minerado por volta do ano 2140.",
    "A rede Bitcoin é mais poderosa do que os 500 maiores supercomputadores do mundo juntos.",
    "O termo 'HODL' surgiu de um erro de digitação em um fórum em 2013.",
    "A Dogecoin foi criada em apenas 3 horas como uma piada.",
    "Ethereum não é apenas uma moeda, mas uma plataforma para contratos inteligentes.",
    "El Salvador foi o primeiro país a adotar o Bitcoin como moeda legal.",
    "Vitalik Buterin tinha apenas 19 anos quando escreveu o whitepaper do Ethereum."
];

export default function CuriosidadesClient() {
    const [curiosities, setCuriosities] = useState<Curiosity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCuriosities = async () => {
            try {
                const response = await fetch('/api/curiosities');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setCuriosities(data);
                    } else {
                        setCuriosities(fallbackCuriosities.map((c, i) => ({ id: `fallback-${i}`, content: c })));
                    }
                } else {
                    setCuriosities(fallbackCuriosities.map((c, i) => ({ id: `fallback-${i}`, content: c })));
                }
            } catch (error) {
                console.error('Error fetching curiosities:', error);
                setCuriosities(fallbackCuriosities.map((c, i) => ({ id: `fallback-${i}`, content: c })));
            } finally {
                setLoading(false);
            }
        };

        fetchCuriosities();
    }, []);

    if (loading && curiosities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
                <p className="text-[var(--text-secondary)] font-medium">Carregando fatos fascinantes...</p>
            </div>
        );
    }

    const items = curiosities.length > 0 ? curiosities : fallbackCuriosities.map((c, i) => ({ id: `fallback-${i}`, content: c }));

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                    <ZenithCard
                        key={item.id}
                        variant="glass"
                        className="group hover:scale-[1.02] transition-all duration-300"
                    >
                        <div className="relative p-2">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors duration-300 border border-[var(--brand-primary)]/20">
                                    <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5" />
                                </div>
                                <span className="text-4xl font-black text-[var(--text-tertiary)] opacity-10 absolute right-0 top-0 select-none">
                                    #{index + 1}
                                </span>
                            </div>

                            <p className="text-lg md:text-xl font-bold leading-relaxed text-[var(--text-primary)]">
                                <span className="bg-[var(--brand-primary)]/20 dark:bg-[var(--brand-primary)]/10 px-1 rounded-sm decoration-clone">
                                    {item.content}
                                </span>
                            </p>
                        </div>
                    </ZenithCard>
                ))}
            </div>

            {/* Decorative Background Glows */}
            <div className="fixed top-1/4 -left-20 w-96 h-96 bg-[var(--brand-primary)]/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
            <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-zinc-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </div>
    );
}
