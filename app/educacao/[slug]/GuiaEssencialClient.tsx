'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, BookOpen } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTelegram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { slugify } from '@/lib/shared/utils/content-helpers';
import { GUIA_ESSENCIAL_TRILHA } from '@/lib/education/guia-essencial';

interface EducationalArticle {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    category: string;
    level: 'iniciante' | 'intermediario' | 'avancado';
    type: 'Artigo' | 'Tutorial';
    readTime: string;
    tags: string[];
    author?: string;
    publishedAt: string;
}

interface GuiaEssencialClientProps {
    article: EducationalArticle;
}

interface TableOfContentsItem {
    id: string;
    text: string;
    level: number;
}

export default function GuiaEssencialClient({ article }: GuiaEssencialClientProps) {
    const [readingProgress, setReadingProgress] = useState(0);
    const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
    const [activeSection, setActiveSection] = useState<string>('');

    // Encontrar posição atual na trilha
    const currentIndex = GUIA_ESSENCIAL_TRILHA.findIndex(t => t.slug === article.slug);
    const prevArticle = currentIndex > 0 ? GUIA_ESSENCIAL_TRILHA[currentIndex - 1] : null;
    const nextArticle = currentIndex < GUIA_ESSENCIAL_TRILHA.length - 1 ? GUIA_ESSENCIAL_TRILHA[currentIndex + 1] : null;

    // Extrai headings do conteúdo para criar índice (ToC)
    useEffect(() => {
        if (!article) return;

        const headings: TableOfContentsItem[] = [];
        const lines = article.content.split('\n');

        const usedIds = new Set<string>();

        lines.forEach((line) => {
            const h2Match = line.match(/^## (.+)$/);
            const h3Match = line.match(/^### (.+)$/);

            if (h2Match || h3Match) {
                const text = (h2Match ? h2Match[1] : h3Match![1]).trim();
                const level = h2Match ? 2 : 3;
                let id = slugify(text);

                // Ensure uniqueness
                if (usedIds.has(id)) {
                    let counter = 1;
                    while (usedIds.has(`${id}-${counter}`)) {
                        counter++;
                    }
                    id = `${id}-${counter}`;
                }

                usedIds.add(id);
                headings.push({ id, text, level });
            }
        });

        setTableOfContents(headings);
    }, [article]);

    // Calcula progresso de leitura e seção ativa
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            setReadingProgress(Math.min(scrollPercent, 100));

            // Detectar seção ativa
            const headingElements = tableOfContents.map(item => ({
                id: item.id,
                element: document.getElementById(item.id)
            })).filter(item => item.element);

            for (let i = headingElements.length - 1; i >= 0; i--) {
                const element = headingElements[i].element;
                if (element && element.getBoundingClientRect().top <= 120) {
                    setActiveSection(headingElements[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tableOfContents]);

    const handleShare = (platform: 'whatsapp' | 'telegram' | 'twitter') => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Confira este artigo: ${article.title}`);

        let shareUrl = '';
        if (platform === 'whatsapp') {
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
        } else if (platform === 'telegram') {
            shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        } else if (platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        }

        window.open(shareUrl, '_blank');
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    // Registry for unique IDs in Markdown render to match TOC generation
    const slugRegistry = new Map<string, number>();
    const getUniqueId = (text: string) => {
        const id = slugify(text);
        if (slugRegistry.has(id)) {
            const count = slugRegistry.get(id)!;
            slugRegistry.set(id, count + 1);
            return `${id}-${count}`;
        }
        slugRegistry.set(id, 1);
        return id;
    };

    return (
        <>
            {/* Barra de Progresso Fixa */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[var(--bg-tertiary)]">
                <div
                    className="h-full bg-[var(--brand-primary)] transition-all duration-150"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* Layout Principal */}
            <div className="container mx-auto px-0 lg:px-6 py-6 lg:py-16">
                <div className="flex gap-0 lg:gap-16">

                    {/* Conteúdo Principal */}
                    <main className="flex-1 min-w-0 bg-transparent backdrop-blur-2xl lg:rounded-2xl lg:border border-[var(--border-light)]/50 p-4 lg:p-12">
                        {/* Header */}
                        <header className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                                    <Shield className="w-4 h-4 text-[var(--brand-primary)]" />
                                    {article.category}
                                </div>

                                {/* Share Buttons & Badge */}
                                <div className="flex items-center gap-4">
                                    <div className="hidden lg:flex items-center gap-2">
                                        <button
                                            onClick={() => handleShare('whatsapp')}
                                            className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[#25D366]/10 text-[var(--text-tertiary)] hover:text-[#25D366] transition-colors"
                                            title="Compartilhar no WhatsApp"
                                        >
                                            <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleShare('telegram')}
                                            className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[#0088cc]/10 text-[var(--text-tertiary)] hover:text-[#0088cc] transition-colors"
                                            title="Compartilhar no Telegram"
                                        >
                                            <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleShare('twitter')}
                                            className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-tertiary)] hover:text-black dark:hover:text-white transition-colors"
                                            title="Compartilhar no X (Twitter)"
                                        >
                                            <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Badge Mobile */}
                                    <div className="lg:hidden text-right">
                                        <span className="text-xs font-bold text-[var(--brand-primary)]">
                                            {currentIndex + 1}/{GUIA_ESSENCIAL_TRILHA.length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[var(--text-primary)] mb-5 leading-[1.2] tracking-tight">
                                {article.title}
                            </h1>

                            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-6">
                                {article.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
                                <span>{article.readTime}</span>
                                <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]" />
                                <span>Nível: {article.level}</span>
                            </div>
                        </header>

                        {/* Conteúdo Markdown */}
                        <article className="
                            prose prose-lg max-w-none
                            prose-headings:text-[var(--text-primary)] prose-headings:font-bold prose-headings:tracking-tight
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pt-8 prose-h2:border-t prose-h2:border-[var(--border-light)]/30
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-[var(--text-secondary)] prose-p:leading-[1.85] prose-p:mb-5
                            prose-strong:text-[var(--text-primary)] prose-strong:font-semibold
                            prose-a:text-[var(--brand-primary)] prose-a:no-underline hover:prose-a:underline
                            prose-ul:my-5 prose-ul:pl-6 prose-li:my-1.5 prose-li:text-[var(--text-secondary)] prose-li:leading-relaxed
                            prose-ol:my-5 prose-ol:pl-6
                            prose-blockquote:border-l-4 prose-blockquote:border-[var(--brand-primary)]/60 
                            prose-blockquote:bg-[var(--bg-tertiary)]/50 prose-blockquote:py-4 prose-blockquote:px-6 
                            prose-blockquote:rounded-r-xl prose-blockquote:my-6
                            prose-blockquote:text-[var(--text-secondary)] prose-blockquote:not-italic prose-blockquote:italic
                            prose-code:text-[var(--brand-primary)] prose-code:bg-[var(--bg-tertiary)]/70 
                            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium
                            prose-pre:bg-[var(--bg-tertiary)]/50 prose-pre:border prose-pre:border-[var(--border-light)]/50 prose-pre:my-6 prose-pre:rounded-xl
                            prose-hr:border-[var(--border-light)]/30 prose-hr:my-10
                        ">
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }) => <h1 className="sr-only">{children}</h1>,
                                    h2: ({ children }) => {
                                        const text = String(children);
                                        const id = getUniqueId(text);
                                        return <h2 id={id} className="scroll-mt-28">{children}</h2>;
                                    },
                                    h3: ({ children }) => {
                                        const text = String(children);
                                        const id = getUniqueId(text);
                                        return <h3 id={id} className="scroll-mt-28">{children}</h3>;
                                    },
                                }}
                            >
                                {article.content}
                            </ReactMarkdown>
                        </article>

                        {/* Navegação Anterior/Próximo */}
                        <nav className="mt-16 pt-10 border-t border-[var(--border-light)]">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {prevArticle ? (
                                    <Link
                                        href={`/educacao/${prevArticle.slug}`}
                                        className="flex-1 group p-5 rounded-2xl border border-[var(--border-light)] hover:border-[var(--brand-primary)]/30 hover:bg-[var(--bg-tertiary)] transition-all"
                                    >
                                        <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-2">
                                            <ArrowLeft className="w-3.5 h-3.5" />
                                            Anterior
                                        </div>
                                        <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                                            {prevArticle.title}
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex-1" />
                                )}

                                {nextArticle ? (
                                    <Link
                                        href={`/educacao/${nextArticle.slug}`}
                                        className="flex-1 group p-5 rounded-2xl border-2 border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/5 hover:border-[var(--brand-primary)]/50 hover:bg-[var(--brand-primary)]/10 transition-all text-right"
                                    >
                                        <div className="flex items-center justify-end gap-2 text-xs text-[var(--brand-primary)] mb-2">
                                            Próximo
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="font-bold text-[var(--brand-primary)]">
                                            {nextArticle.title}
                                        </div>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/educacao"
                                        className="flex-1 group p-5 rounded-2xl border-2 border-green-500/20 bg-green-500/5 hover:border-green-500/50 hover:bg-green-500/10 transition-all text-right"
                                    >
                                        <div className="flex items-center justify-end gap-2 text-xs text-green-500 mb-2">
                                            Concluído!
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="font-bold text-green-500">
                                            Voltar para Educação
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </main>

                    {/* Sidebar Direita - Table of Contents (Desktop) */}
                    <aside className="hidden lg:block w-56 shrink-0">
                        <div className="sticky top-24">
                            {/* Badge da Trilha */}
                            <div className="mb-6 pb-4 border-b border-[var(--border-light)]">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1">
                                    Trilha de Aprendizado
                                </p>
                                <p className="text-lg font-bold text-[var(--brand-primary)]">
                                    {currentIndex + 1} de {GUIA_ESSENCIAL_TRILHA.length}
                                </p>
                            </div>

                            {/* Índice do Artigo */}
                            {tableOfContents.length > 0 && (
                                <nav>
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-3 flex items-center gap-2">
                                        <BookOpen className="w-3 h-3" />
                                        Neste artigo
                                    </h4>
                                    <ul className="space-y-1">
                                        {tableOfContents.map((item) => (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => scrollToSection(item.id)}
                                                    className={`
                                                        block w-full text-left text-sm py-1.5 transition-all duration-200
                                                        ${item.level === 3 ? 'pl-4' : 'pl-0'}
                                                        ${activeSection === item.id
                                                            ? 'text-[var(--brand-primary)] font-medium'
                                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                                        }
                                                    `}
                                                >
                                                    {item.text}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
