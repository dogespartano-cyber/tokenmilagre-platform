'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Curiosity {
    id: string;
    slug: string;
    content: string;
}

const fallbackCuriosities = [
    { slug: "primeira-transacao-bitcoin-pizza", content: "A primeira transação de Bitcoin foi 10.000 BTC por duas pizzas em 2010." },
    { slug: "fortuna-satoshi-nakamoto", content: "Satoshi Nakamoto, o criador do Bitcoin, possui cerca de 1.1 milhão de BTC." },
    { slug: "bitcoin-perdido-sempre", content: "Estima-se que cerca de 20% de todo o Bitcoin existente esteja perdido para sempre." },
    { slug: "ultimo-bitcoin-minerado-2140", content: "O último Bitcoin será minerado por volta do ano 2140." },
    { slug: "poder-rede-bitcoin-supercomputadores", content: "A rede Bitcoin é mais poderosa do que os 500 maiores supercomputadores do mundo juntos." },
    { slug: "erro-digitacao-hodl-2013", content: "O termo 'HODL' surgiu de um erro de digitação em um fórum em 2013." },
    { slug: "criacao-dogecoin-3-horas", content: "A Dogecoin foi criada em apenas 3 horas como uma piada." },
    { slug: "vitalik-buterin-19-anos-ethereum", content: "Vitalik Buterin tinha apenas 19 anos quando escreveu o whitepaper do Ethereum." }
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
                        setCuriosities(fallbackCuriosities.map((c, i) => ({ id: `fallback-${i}`, ...c })));
                    }
                } else {
                    setCuriosities(fallbackCuriosities.map((c, i) => ({ id: `fallback-${i}`, ...c })));
                }
            } catch (error) {
                console.error('Error fetching curiosities:', error);
                setCuriosities(fallbackCuriosities.map((c, i) => ({ id: `fallback-${i}`, ...c })));
            } finally {
                setLoading(false);
            }
        };

        fetchCuriosities();
    }, []);

    if (loading && curiosities.length === 0) return (
        <div className="py-12 animate-pulse bg-zinc-100/50 dark:bg-zinc-900/50 h-32 rounded-3xl mx-4 mb-20" />
    );

    const displayItems = curiosities.length > 0 ? curiosities : fallbackCuriosities.map((c, i) => ({ id: `fallback-${i}`, ...c }));
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
                            <Link key={`${item.id}-${i}`} href={`/curiosidades/${item.slug}`} className="inline-block">
                                <span className="text-xl md:text-2xl font-black font-inter px-3 py-1 bg-[var(--brand-primary)]/20 dark:bg-[var(--brand-primary)]/10 text-[var(--text-primary)] rounded-md border-b-4 border-[var(--brand-primary)]/40 italic transition-all hover:scale-105 hover:bg-[var(--brand-primary)]/30 inline-block">
                                    {item.content}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Segunda Linha - Rola para a Direita */}
                <div className="flex mask-fade">
                    <div className="flex animate-marquee-reverse whitespace-nowrap gap-8">
                        {[...secondRow, ...secondRow].map((item, i) => (
                            <Link key={`${item.id}-${i}`} href={`/curiosidades/${item.slug}`} className="inline-block">
                                <span className="text-xl md:text-2xl font-black font-inter px-3 py-1 bg-zinc-200 dark:bg-zinc-800/50 text-[var(--text-primary)] rounded-md border-b-4 border-zinc-400/30 italic transition-all hover:scale-105 hover:bg-zinc-300 dark:hover:bg-zinc-700/50 inline-block">
                                    {item.content}
                                </span>
                            </Link>
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
