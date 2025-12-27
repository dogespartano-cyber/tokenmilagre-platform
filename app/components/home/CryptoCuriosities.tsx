'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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

export function CryptoCuriosities() {
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
                        // Use fallback if empty
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

    // Show nothing during initial load, then show at least fallback
    if (loading && curiosities.length === 0) return (
        <div className="py-12 animate-pulse bg-zinc-100/50 dark:bg-zinc-900/50 h-32 rounded-3xl mx-4 mb-20" />
    );

    const displayItems = curiosities.length > 0 ? curiosities : fallbackCuriosities.map((c, i) => ({ id: `fallback-${i}`, content: c }));
    const midPoint = Math.ceil(displayItems.length / 2);
    const firstRow = displayItems.slice(0, midPoint);
    const secondRow = displayItems.slice(midPoint);

    return (
        <section className="py-12 overflow-hidden select-none">
            <div className="mb-8">
                <Link
                    href="/curiosidades"
                    className="group inline-flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
                >
                    <h2 className="title-newtab text-2xl text-left transition-colors group-hover:text-[var(--brand-primary)]">
                        Curiosidades do Mundo Cripto
                    </h2>
                </Link>
            </div>

            <div className="space-y-12">
                {/* Primeira Linha - Rola para a Esquerda */}
                <div className="flex mask-fade">
                    <div className="flex animate-marquee whitespace-nowrap gap-8">
                        {[...firstRow, ...firstRow].map((item, i) => (
                            <div key={`${item.id}-${i}`} className="inline-block">
                                <span className="text-xl md:text-2xl font-black font-inter px-3 py-1 bg-[var(--brand-primary)]/20 dark:bg-[var(--brand-primary)]/10 text-[var(--text-primary)] rounded-md border-b-4 border-[var(--brand-primary)]/40 italic transition-transform hover:scale-105 inline-block">
                                    {item.content}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Segunda Linha - Rola para a Direita */}
                <div className="flex mask-fade">
                    <div className="flex animate-marquee-reverse whitespace-nowrap gap-8">
                        {[...secondRow, ...secondRow].map((item, i) => (
                            <div key={`${item.id}-${i}`} className="inline-block">
                                <span className="text-xl md:text-2xl font-black font-inter px-3 py-1 bg-zinc-200 dark:bg-zinc-800/50 text-[var(--text-primary)] rounded-md border-b-4 border-zinc-400/30 italic transition-transform hover:scale-105 inline-block">
                                    {item.content}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .animate-marquee {
          animation: marquee 300s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 250s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .mask-fade {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
        </section>
    );
}
