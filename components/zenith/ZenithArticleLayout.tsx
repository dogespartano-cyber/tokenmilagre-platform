'use client';

import React, { useEffect, useState } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import { useSidebar } from '@/contexts/SidebarContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faX } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import LikeDislikeButton from '@/components/shared/LikeDislikeButton';
import CommentCountButton from '@/components/engagement/CommentCountButton';
import { SentimentIndicator } from '@/app/components/news/SentimentIndicator';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/shared/PageHeader';

// Tipos para props do layout
export interface TableOfContentsItem {
    id: string;
    text: string;
    level: number;
}

export interface SocialLinks {
    twitter?: string;
    telegram?: string;
    whatsapp?: string;
    shareText?: string;
}

export interface ArticleHeader {
    title: string;
    category: string;
    summary?: string;
    publishedAt: string;
    readTime?: string;
    level?: 'iniciante' | 'intermediario' | 'avancado';
    sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface InteractionProps {
    id: string;
    type: 'article' | 'curiosity';
    onCommentClick?: () => void;
}

export interface ZenithArticleLayoutProps {
    variant?: 'editorial' | 'focused';
    header: ArticleHeader;
    coverImage?: {
        src: string;
        alt?: string;
        caption?: string;
    };
    toc?: TableOfContentsItem[];
    social?: SocialLinks;
    interaction?: InteractionProps;
    backLink?: {
        href: string;
        label: string;
    };
    children: React.ReactNode;
    rightSidebar?: React.ReactNode;
    activeSection?: string;
    onSectionClick?: (id: string) => void;
}

// Helpers de formatação
const formatEditorialDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    });
};

const getLevelColor = (level?: string) => {
    switch (level) {
        case 'iniciante': return '#22c55e';
        case 'intermediario': return '#3b82f6';
        case 'avancado': return '#a855f7';
        default: return 'var(--brand-primary)';
    }
};

const getLevelLabel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
};

export default function ZenithArticleLayout({
    variant = 'editorial',
    header,
    coverImage,
    toc = [],
    social,
    interaction,
    backLink,
    children,
    rightSidebar,
    activeSection,
    onSectionClick
}: ZenithArticleLayoutProps) {
    const router = useRouter();
    const { setDynamicTitle, setShortTitle } = useSidebar();

    // Atualizar título da sidebar dinamicamente
    useEffect(() => {
        setDynamicTitle(header.title);
        if (backLink) {
            setShortTitle(backLink.label);
        }
    }, [header.title, backLink, setDynamicTitle, setShortTitle]);

    // Funções de compartilhamento padrão se não forem passadas
    const handleShare = (platform: 'twitter' | 'telegram' | 'whatsapp') => {
        const url = window.location.href;
        const text = social?.shareText || header.title;

        let shareUrl = '';
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' - ' + url)}`;
                break;
        }
        window.open(shareUrl, '_blank');
    };

    const handleScrollTo = (id: string) => {
        if (onSectionClick) {
            onSectionClick(id);
        } else {
            const element = document.getElementById(id);
            if (element) {
                const offset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    return (
        <PageWrapper>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

                    {/* Desktop Only Page Header */}
                    <div className="hidden lg:block pt-16 pb-8 -mx-4 md:-mx-8 lg:-mx-12">
                        <PageHeader
                            title={backLink?.label || "Artigo"}
                            description=""
                        />
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">

                        {/* ========== LEFT SIDEBAR (TOC & Share) ========== */}
                        <aside className="hidden lg:block lg:col-span-2 xl:col-span-2">
                            <div className="sticky top-24 pt-8 space-y-8">

                                {/* Back Button Desktop */}
                                {backLink && (
                                    <button
                                        onClick={() => router.push(backLink.href)}
                                        className="flex items-center gap-2 text-sm text-[var(--text-article-muted)] hover:text-[var(--text-article-title)] transition-colors group mb-6"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                                        <span>Voltar</span>
                                    </button>
                                )}

                                {/* Table of Contents */}
                                {toc.length > 0 && (
                                    <nav className="space-y-1">
                                        <h3 className="title-newtab text-[10px] uppercase tracking-[0.2em] text-[var(--text-article-muted)] mb-3">
                                            Neste artigo
                                        </h3>
                                        {toc.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleScrollTo(item.id)}
                                                className={`block text-left text-sm py-1.5 w-full transition-all leading-snug truncate ${item.level === 3 ? 'pl-3' : ''
                                                    } ${activeSection === item.id
                                                        ? 'text-[var(--brand-primary)] font-medium'
                                                        : 'text-[var(--text-article-muted)] hover:text-[var(--text-article-title)]'
                                                    }`}
                                                title={item.text}
                                            >
                                                {item.text}
                                            </button>
                                        ))}
                                    </nav>
                                )}

                                {/* Divider if TOC exists */}
                                {toc.length > 0 && <div className="h-px bg-[var(--border-article)]" />}

                                {/* Share Buttons */}
                                <div className="space-y-3">
                                    <h3 className="title-newtab text-[10px] uppercase tracking-[0.2em] text-[var(--text-article-muted)]">
                                        Compartilhar
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleShare('twitter')}
                                            className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)] hover:border-[var(--text-article-title)] hover:text-[var(--text-article-title)] transition-colors"
                                            aria-label="Compartilhar no X"
                                        >
                                            <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleShare('telegram')}
                                            className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)] hover:border-[#0088cc] hover:text-[#0088cc] transition-colors"
                                            aria-label="Compartilhar no Telegram"
                                        >
                                            <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleShare('whatsapp')}
                                            className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)] hover:border-[#25D366] hover:text-[#25D366] transition-colors"
                                            aria-label="Compartilhar no WhatsApp"
                                        >
                                            <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* ========== MAIN CONTENT ========== */}
                        <main className="lg:col-span-7 xl:col-span-7 pt-6 md:pt-12 lg:pt-8 w-full max-w-full overflow-hidden">

                            {/* Mobile Back Button */}
                            {backLink && (
                                <div className="lg:hidden mb-6">
                                    <button
                                        onClick={() => router.push(backLink.href)}
                                        className="inline-flex items-center gap-2 text-sm text-[var(--text-article-muted)]"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
                                        Voltar
                                    </button>
                                </div>
                            )}

                            {/* Header */}
                            <header className="mb-10 md:mb-14">

                                {/* Meta Top: Level & Category */}
                                <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                                    {header.level && (
                                        <>
                                            <span
                                                className="text-xs md:text-sm font-bold uppercase tracking-[0.1em]"
                                                style={{ color: getLevelColor(header.level) }}
                                            >
                                                {getLevelLabel(header.level)}
                                            </span>
                                            <span className="text-[var(--border-article)]">•</span>
                                        </>
                                    )}
                                    <span className={`text-[var(--brand-primary)] text-xs md:text-sm font-semibold uppercase tracking-[0.15em]`}>
                                        {header.category}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1
                                    className="title-newtab text-[1.75rem] md:text-[2.5rem] lg:text-[2.75rem] mb-6 md:mb-8 text-pretty"
                                    style={{
                                        lineHeight: '1.05',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    {header.title}
                                </h1>

                                {/* Summary */}
                                {header.summary && (
                                    <p
                                        className="text-lg md:text-xl lg:text-[1.375rem] text-[var(--text-article-body)] font-light italic mb-6 md:mb-8 text-pretty"
                                        style={{ lineHeight: '1.4' }}
                                    >
                                        {header.summary}
                                    </p>
                                )}

                                {/* Meta Bottom */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-article-muted)] pb-6 md:pb-8 border-b border-[var(--border-article)]">
                                    <time dateTime={header.publishedAt} className="capitalize">
                                        {formatEditorialDate(header.publishedAt)}
                                    </time>

                                    {header.readTime && (
                                        <>
                                            <span className="hidden md:inline">•</span>
                                            <span>{header.readTime}</span>
                                        </>
                                    )}

                                    {interaction && (
                                        <>
                                            <span className="hidden md:inline">•</span>
                                            <LikeDislikeButton id={interaction.id} type={interaction.type} />
                                            {interaction.onCommentClick && (
                                                <CommentCountButton id={interaction.id} type={interaction.type} onClick={interaction.onCommentClick} />
                                            )}
                                        </>
                                    )}

                                    {header.sentiment && (
                                        <div className="lg:hidden ml-auto">
                                            <SentimentIndicator sentiment={header.sentiment} variant="compact" />
                                        </div>
                                    )}
                                </div>
                            </header>

                            {/* Cover Image */}
                            {coverImage && (
                                <figure className="mb-10 md:mb-14 -mx-4 md:mx-0">
                                    <img
                                        src={coverImage.src}
                                        alt={coverImage.alt || header.title}
                                        className="w-full h-auto md:rounded-lg"
                                        loading="eager"
                                    />
                                    {coverImage.caption && (
                                        <figcaption className="mt-3 px-4 md:px-0 text-sm text-[var(--text-article-muted)] italic">
                                            {coverImage.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            )}

                            {/* Content Body */}
                            <div className="article-content">
                                {children}
                            </div>

                            {/* Mobile Share */}
                            <div className="mt-12 pt-8 border-t border-[var(--border-article)] lg:hidden">
                                <h3 className="title-newtab text-[10px] uppercase tracking-[0.2em] text-[var(--text-article-muted)] mb-4">
                                    Compartilhar
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={() => handleShare('twitter')} className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)]">
                                        <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleShare('telegram')} className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[#0088cc]">
                                        <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleShare('whatsapp')} className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[#25D366]">
                                        <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Bottom Spacer */}
                            <div className="h-16 md:h-24" />
                        </main>

                        {/* ========== RIGHT SIDEBAR (Desktop) ========== */}
                        <aside className="hidden lg:block lg:col-span-3 xl:col-span-3">
                            <div className="sticky top-24 pt-8 space-y-6">
                                {/* Sentiment Indicator if present */}
                                {header.sentiment && (
                                    <div className="pt-4">
                                        <SentimentIndicator sentiment={header.sentiment} />
                                    </div>
                                )}
                                {/* Slot for extra widgets */}
                                {rightSidebar}
                            </div>
                        </aside>

                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
