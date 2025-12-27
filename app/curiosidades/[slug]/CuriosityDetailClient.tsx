'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import PageWrapper from '@/components/layout/PageWrapper';
import { useSidebar } from '@/contexts/SidebarContext';
import LikeDislikeButton from '@/components/shared/LikeDislikeButton';

interface Curiosity {
    id: string;
    slug: string;
    content: string;
    description: string | null;
    fullContent: string | null;
    category: string | null;
    keywords: string[];
    publishedAt: string;
    createdAt: string;
}

interface CuriosityDetailClientProps {
    curiosity: Curiosity | null;
}

export default function CuriosityDetailClient({ curiosity }: CuriosityDetailClientProps) {
    const router = useRouter();
    const { setDynamicTitle, setShortTitle } = useSidebar();

    useEffect(() => {
        if (curiosity) {
            setDynamicTitle(curiosity.content);
            setShortTitle('Curiosidades');
        }
    }, [curiosity, setDynamicTitle, setShortTitle]);

    if (!curiosity) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">💡</div>
                    <h1 className="title-newtab text-2xl md:text-3xl mb-4">Curiosidade não encontrada</h1>
                    <button
                        onClick={() => router.push('/curiosidades')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-[var(--brand-primary)] text-white hover:opacity-90"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                        Voltar para Curiosidades
                    </button>
                </div>
            </div>
        );
    }

    const shareOnX = () => {
        const url = window.location.href;
        const text = `Sabia disso? ${curiosity.content} via @TokenMilagre`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    const shareOnWhatsApp = () => {
        const url = window.location.href;
        const text = `Sabia disso? ${curiosity.content} - ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareOnTelegram = () => {
        const url = window.location.href;
        const text = curiosity.content;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <PageWrapper
            header={{
                title: "Curiosidades Cripto",
                description: "Fatos fascinantes sobre a revolução financeira"
            }}
        >
            <div className="min-h-screen pt-8 pb-20">
                <div className="max-w-4xl mx-auto px-4 md:px-8">

                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/curiosidades')}
                        className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--text-article-muted)] hover:text-[var(--brand-primary)] transition-colors group"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Todas as Curiosidades
                    </button>

                    {/* Header Section */}
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)]">
                                <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5" />
                            </div>
                            <span className="text-[var(--brand-primary)] text-xs md:text-sm font-semibold uppercase tracking-[0.15em]">
                                {curiosity.category || 'Geral'}
                            </span>
                        </div>

                        <h1 className="title-newtab text-2xl md:text-4xl lg:text-5xl mb-8 leading-[1.15] tracking-tight">
                            {curiosity.content}
                        </h1>

                        {curiosity.description && (
                            <p className="text-xl md:text-2xl text-[var(--text-article-body)] font-light italic mb-8 leading-relaxed opacity-80">
                                {curiosity.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between py-6 border-y border-[var(--border-article)]">
                            <div className="flex items-center gap-4 text-sm text-[var(--text-article-muted)]">
                                <LikeDislikeButton id={curiosity.id} type="curiosity" />
                                <span>•</span>
                                <time className="capitalize">
                                    {new Date(curiosity.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                </time>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={shareOnX}
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)] hover:border-[var(--text-article-title)] hover:text-[var(--text-article-title)] transition-colors"
                                    aria-label="Compartilhar no X"
                                >
                                    <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={shareOnTelegram}
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)] hover:border-[#0088cc] hover:text-[#0088cc] transition-colors"
                                    aria-label="Compartilhar no Telegram"
                                >
                                    <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Content Section */}
                    <article className="prose prose-lg max-w-none mb-16">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => <h1 className="title-newtab text-2xl md:text-3xl mt-12 mb-6">{children}</h1>,
                                h2: ({ children }) => <h2 className="title-newtab text-xl md:text-2xl mt-12 mb-5 border-t border-[var(--border-article)] pt-8">{children}</h2>,
                                p: ({ children }) => (
                                    <p className="text-[var(--text-article-body)] mb-7 leading-[1.85]" style={{ fontSize: '1.125rem' }}>
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => <ul className="mb-8 space-y-3 list-disc pl-6 text-[var(--text-article-body)]">{children}</ul>,
                                li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
                                blockquote: ({ children }) => (
                                    <blockquote className="pl-6 border-l-4 border-[var(--brand-primary)] my-10 py-2 italic text-xl text-[var(--text-article-body)] opacity-90">
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {curiosity.fullContent || ''}
                        </ReactMarkdown>
                    </article>

                    {/* Keywords */}
                    {curiosity.keywords && curiosity.keywords.length > 0 && (
                        <div className="pt-8 border-t border-[var(--border-article)]">
                            <div className="flex flex-wrap gap-2">
                                {curiosity.keywords.map((keyword, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 rounded-full text-xs transition-colors bg-[var(--bg-article-tag)] text-[var(--text-article-muted)]"
                                    >
                                        #{keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
