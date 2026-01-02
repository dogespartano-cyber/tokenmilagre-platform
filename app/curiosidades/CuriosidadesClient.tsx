'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

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
    { slug: "vitalik-buterin-19-anos-ethereum", content: "Vitalik Buterin tinha apenas 19 anos quando escreveu o whitepaper do Ethereum." },
    { slug: "el-salvador-bitcoin-moeda-legal", content: "El Salvador foi o primeiro país a adotar o Bitcoin como moeda legal." }
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

    if (loading && curiosities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
                <p className="text-[var(--text-secondary)] font-medium">Carregando fatos fascinantes...</p>
            </div>
        );
    }

    const items = curiosities.length > 0 ? curiosities : fallbackCuriosities.map((c, i) => ({ id: `fallback-${i}`, ...c }));

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 relative z-10">
            {/* Grid solto com gap maior para acomodar balões flutuantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                {items.map((item, index) => {
                    // Randomize animation types (simple logic based on index)
                    const animationType = index % 3 === 0 ? 'animate-float' : index % 3 === 1 ? 'animate-float-delayed' : 'animate-float-slow';

                    // Deterministic randomness for hydration safety
                    // Uses sin/cos to generate varied numbers based on index
                    const randomDuration = 4 + (Math.abs(Math.sin(index + 1)) * 4); // 4s to 8s
                    const randomDelay = Math.abs(Math.cos(index + 1)) * 3; // 0s to 3s

                    return (
                        <Link key={item.id} href={`/curiosidades/${item.slug}`} className="block group perspective-1000">
                            <div
                                className={`relative ${animationType}`}
                                style={{
                                    animationDuration: `${randomDuration}s`,
                                    animationDelay: `${randomDelay}s`
                                }}
                            >
                                {/* Thought Bubble Shape */}
                                <div className="
                                    relative bg-white dark:bg-zinc-800/80 backdrop-blur-md 
                                    border-2 border-[var(--brand-primary)]/20 dark:border-[var(--brand-primary)]/30
                                    p-12 rounded-[4rem]
                                    shadow-lg hover:shadow-[0_0_30px_rgba(var(--brand-primary-rgb),0.3)]
                                    transition-all duration-300 transform group-hover:scale-105
                                    flex flex-col h-full min-h-[350px] justify-center gap-6
                                    overflow-hidden
                                ">
                                    {/* Glass reflection effect */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none opacity-50 dark:opacity-10" />

                                    {/* Content */}
                                    <p className="text-2xl font-bold leading-relaxed text-[var(--text-primary)] font-grotesk relative z-10 text-center">
                                        "{item.content}"
                                    </p>

                                    {/* Footer: CTA */}
                                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--brand-primary)] font-bold tracking-wide uppercase opacity-70 group-hover:opacity-100 transition-opacity relative z-10">
                                        <span>Ler história</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>

                                {/* Thought Bubbles (Circles) - Decorative Tail */}
                                <div className="absolute -bottom-4 -right-2 w-6 h-6 bg-[var(--brand-primary)]/20 rounded-full animate-bounce delay-700" />
                                <div className="absolute -bottom-8 -right-6 w-4 h-4 bg-[var(--brand-primary)]/10 rounded-full animate-bounce delay-1000" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
