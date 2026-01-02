'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useSidebar } from '@/contexts/SidebarContext';
import ZenithArticleLayout from '@/components/zenith/ZenithArticleLayout';

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

    return (
        <ZenithArticleLayout
            variant="editorial"
            header={{
                title: curiosity.content,
                category: curiosity.category || 'Geral',
                summary: curiosity.description || undefined,
                publishedAt: curiosity.createdAt
            }}
            social={{
                shareText: `Sabia disso? ${curiosity.content}`
            }}
            interaction={{
                id: curiosity.id,
                type: 'curiosity'
            }}
            backLink={{
                href: '/curiosidades',
                label: 'Todas as Curiosidades'
            }}
        >
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
        </ZenithArticleLayout>
    );
}
