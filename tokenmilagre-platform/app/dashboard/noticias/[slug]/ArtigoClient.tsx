'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  source: string;
  sources?: string[];
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  factChecked?: boolean;
  factCheckIssues?: string[];
  lastVerified?: string;
}

interface ArtigoClientProps {
  article: NewsItem | null;
  relatedArticles?: NewsItem[];
  previousArticle?: NewsItem | null;
  nextArticle?: NewsItem | null;
}

interface TableOfContentsItem {
  id: string;
  text: string;
}

export default function ArtigoClient({ article, relatedArticles = [], previousArticle = null, nextArticle = null }: ArtigoClientProps) {
  const router = useRouter();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
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
  };

  // Extrair fontes do markdown
  const extractSourcesFromMarkdown = (content: string): { name: string; url: string }[] => {
    const sources: { name: string; url: string }[] = [];
    const markdownRegex = /^-\s+\[(.+?)\]\((https?:\/\/[^\)]+)\)/gm;
    let match;

    while ((match = markdownRegex.exec(content)) !== null) {
      sources.push({
        name: match[1].trim(),
        url: match[2].trim()
      });
    }

    const oldFormatRegex = /^-\s+([^\[\(]+?)\s+\((https?:\/\/[^\)]+)\)/gm;
    while ((match = oldFormatRegex.exec(content)) !== null) {
      sources.push({
        name: match[1].trim(),
        url: match[2].trim()
      });
    }

    return sources;
  };

  // Remover H1 do início do conteúdo (título já aparece no header)
  const removeH1FromContent = (content: string): string => {
    // Remove H1 do início (# Título)
    const h1Regex = /^#\s+.+?\n+/;
    return content.replace(h1Regex, '').trim();
  };

  // Remover seção de fontes do conteúdo
  const removeSourcesSection = (content: string): string => {
    const sourcesIndex = content.search(/\*\*Fontes:\*\*|---\s*\n\s*\*\*Fontes:\*\*/);
    if (sourcesIndex !== -1) {
      return content.substring(0, sourcesIndex).trim();
    }
    return content;
  };

  // Calcular tempo de leitura (250 palavras por minuto)
  const calculateReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 250);
    return minutes;
  };

  // Extrai headings do conteúdo para criar índice (apenas H2)
  useEffect(() => {
    if (!article || !article.content) return;

    // Remove H1 antes de extrair headings
    const contentWithoutH1 = removeH1FromContent(article.content);
    const headings: TableOfContentsItem[] = [];
    const lines = contentWithoutH1.split('\n');

    lines.forEach((line) => {
      const h2Match = line.match(/^## (.+)$/);
      if (h2Match) {
        const text = h2Match[1].trim();
        headings.push({
          id: createSlug(text),
          text
        });
      }
    });

    setTableOfContents(headings);
  }, [article]);

  // Calcula progresso de leitura e rastreia seção ativa
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
      setShowScrollTop(window.scrollY > 400);

      // Encontra a seção ativa
      const headingElements = tableOfContents.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(item => item.element);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i].element;
        if (element && element.getBoundingClientRect().top <= 150) {
          setActiveSection(headingElements[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffMs = now.getTime() - published.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `Há ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Há ${diffDays}d`;
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positivo';
      case 'negative': return 'Negativo';
      default: return 'Neutro';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#22c55e';
      case 'negative': return '#ef4444';
      default: return '#eab308';
    }
  };

  const shareOnX = () => {
    const url = window.location.href;
    const text = `${article?.title} via @TokenMilagre`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `${article?.title} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnTelegram = () => {
    const url = window.location.href;
    const text = article?.title || '';
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Artigo não encontrado
  if (!article) {
    return (
      <div className="py-8 max-w-4xl" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        <div className="space-y-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📰</div>
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Notícia não encontrada
            </h1>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
              A notícia que você procura não existe ou foi removida.
            </p>
            <button
              onClick={() => router.push('/dashboard/noticias')}
              className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--text-inverse)'
              }}
            >
              ← Voltar para Notícias
            </button>
          </div>
        </div>
      </div>
    );
  }

  const markdownSources = extractSourcesFromMarkdown(article.content || '');
  // Remove H1 primeiro, depois remove seção de fontes
  const contentWithoutH1 = removeH1FromContent(article.content || '');
  const cleanContent = removeSourcesSection(contentWithoutH1);
  const readingTime = calculateReadingTime(cleanContent);

  return (
    <>
      {/* Barra de progresso de leitura */}
      <div
        className="fixed top-0 left-0 h-1 z-50 transition-all"
        style={{
          width: `${readingProgress}%`,
          backgroundColor: 'var(--brand-primary)'
        }}
      />

      <div className="py-8">
        <div className="flex gap-8" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
          <div className="flex-1 max-w-4xl space-y-8">
            {/* Voltar */}
            <button
              onClick={() => router.push('/dashboard/noticias')}
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--brand-primary)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para Notícias
            </button>

            {/* Header do Artigo */}
            <div className="space-y-6">
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: getSentimentColor(article.sentiment),
                    color: 'white'
                  }}
                >
                  {getSentimentLabel(article.sentiment)}
                </span>
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {article.source}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  📖 {readingTime} min de leitura
                </span>
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {getTimeAgo(article.publishedAt)}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                {article.title}
              </h1>

              {/* Data de Publicação */}
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  Publicado em: {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Sao_Paulo'
                  })} BRT
                </span>
              </div>

              {/* Resumo */}
              <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {article.summary}
              </p>

              {/* Keywords/Tags */}
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword, idx) => (
                  <button
                    key={idx}
                    onClick={() => router.push(`/dashboard/noticias?search=${encodeURIComponent(keyword)}`)}
                    className="px-3 py-1 rounded-lg text-sm transition-all hover:opacity-80 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-tertiary)'
                    }}
                    title={`Buscar artigos sobre: ${keyword}`}
                  >
                    #{keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Conteúdo do Artigo */}
            <article
              className="prose prose-lg max-w-none"
              style={{
                color: 'var(--text-primary)',
              }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = createSlug(text);
                    return (
                      <h2 id={id} className="text-2xl font-bold mt-8 mb-4 font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => {
                    const text = String(children);
                    const id = createSlug(text);
                    return (
                      <h3 id={id} className="text-xl font-bold mt-6 mb-3 font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
                        {children}
                      </h3>
                    );
                  },
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 space-y-2 list-disc list-inside" style={{ color: 'var(--text-primary)' }}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 space-y-2 list-decimal list-inside" style={{ color: 'var(--text-primary)' }}>
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="ml-4" style={{ color: 'var(--text-primary)' }}>
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic" style={{ color: 'var(--text-secondary)' }}>
                      {children}
                    </em>
                  ),
                  code: ({ children }) => (
                    <code
                      className="px-2 py-1 rounded text-sm font-mono"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--brand-primary)'
                      }}
                    >
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      className="pl-4 border-l-4 italic my-4"
                      style={{
                        borderColor: 'var(--brand-primary)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:opacity-80"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {cleanContent || 'Conteúdo não disponível.'}
              </ReactMarkdown>
            </article>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Nota de Transparência */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">📊</div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    Nota de Transparência
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Publicado por $MILAGRE Research | Última atualização: {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Este conteúdo é educacional e informativo, baseado em fontes verificadas do mercado cripto. Não constitui aconselhamento financeiro ou recomendação de investimento. Criptomoedas envolvem riscos - sempre conduza sua própria pesquisa (DYOR).
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Compartilhar */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Compartilhe esta notícia
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={shareOnX}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                  style={{ backgroundColor: '#000000', color: 'white' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X (Twitter)
                </button>
                <button
                  onClick={shareOnTelegram}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                  style={{ backgroundColor: '#0088cc', color: 'white' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  Telegram
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                  style={{ backgroundColor: '#25D366', color: 'white' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Artigos Relacionados */}
            {relatedArticles.length > 0 && (
              <>
                <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Notícias Relacionadas
                  </h3>
                  <div className="grid gap-4">
                    {relatedArticles.slice(0, 3).map((related) => (
                      <Link
                        key={related.id}
                        href={`/dashboard/noticias/${related.slug || related.id}`}
                        className="block p-6 rounded-xl border transition-all hover:shadow-lg"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-light)'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={{
                              backgroundColor: getSentimentColor(related.sentiment),
                              color: 'white'
                            }}
                          >
                            {getSentimentLabel(related.sentiment)}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {related.category[0]}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                          {related.title}
                        </h4>
                        <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {related.summary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar - Índice (Desktop) */}
          <div className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Índice */}
              {tableOfContents.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Neste Artigo
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToSection(item.id)}
                        className={`block text-sm text-left transition-all hover:pl-2 py-1 ${
                          activeSection === item.id ? 'pl-2 font-semibold' : ''
                        }`}
                        style={{
                          color: activeSection === item.id ? 'var(--brand-primary)' : 'var(--text-secondary)'
                        }}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Navegação Anterior/Próximo */}
              {(previousArticle || nextArticle) && (
                <>
                  <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>
                  <div>
                    <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Navegação
                    </h3>
                    <div className="space-y-3">
                      {previousArticle && (
                        <Link
                          href={`/dashboard/noticias/${previousArticle.slug || previousArticle.id}`}
                          className="block p-3 rounded-lg border transition-all hover:shadow-md"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-light)'
                          }}
                        >
                          <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                            ← Anterior
                          </div>
                          <div className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                            {previousArticle.title}
                          </div>
                        </Link>
                      )}
                      {nextArticle && (
                        <Link
                          href={`/dashboard/noticias/${nextArticle.slug || nextArticle.id}`}
                          className="block p-3 rounded-lg border transition-all hover:shadow-md"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-light)'
                          }}
                        >
                          <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                            Próxima →
                          </div>
                          <div className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                            {nextArticle.title}
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'var(--text-inverse)'
          }}
          aria-label="Voltar ao topo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
}
