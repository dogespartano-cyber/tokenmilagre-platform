'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faClock,
  faHashtag,
  faBook,
  faBookOpen,
  faLink,
  faChevronLeft,
  faChevronRight,
  faCalendar,
  faComments,
  faGraduationCap,
  faExternalLinkAlt,
  faCircle,
  faArrowUp,
  faArrowDown,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import {
  faXTwitter,
  faWhatsapp,
  faTelegram,
  faDiscord,
} from '@fortawesome/free-brands-svg-icons';

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

export default function ArtigoClient({ article, relatedArticles = [], previousArticle = null, nextArticle = null }: ArtigoClientProps) {
  const router = useRouter();
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  // Calcular tempo de leitura (250 palavras por minuto)
  const calculateReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 250);
    return minutes;
  };

  // Barra de progresso de leitura
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / documentHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extrair headings para índice
  const extractHeadings = (content: string) => {
    const headingRegex = /^##\s+(.+)$/gm;
    const headings: { text: string; id: string }[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const text = match[1];
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      headings.push({ text, id });
    }

    return headings;
  };

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

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <FontAwesomeIcon icon={faCircle} className="text-green-500" />;
      case 'negative':
        return <FontAwesomeIcon icon={faCircle} className="text-red-500" />;
      default:
        return <FontAwesomeIcon icon={faCircle} className="text-yellow-500" />;
    }
  };

  const getSentimentData = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return {
          label: 'Sentimento Positivo',
          color: 'from-green-500 to-emerald-600',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-400/40',
          textColor: 'text-green-300',
          rotation: 45, // Velocímetro aponta para direita (positivo)
          icon: faArrowUp
        };
      case 'negative':
        return {
          label: 'Sentimento Negativo',
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-400/40',
          textColor: 'text-red-300',
          rotation: -45, // Velocímetro aponta para esquerda (negativo)
          icon: faArrowDown
        };
      default:
        return {
          label: 'Sentimento Neutro',
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-400/40',
          textColor: 'text-yellow-300',
          rotation: 0, // Velocímetro aponta para centro (neutro)
          icon: faMinus
        };
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

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado para a área de transferência!');
  };

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl mb-4" style={{ color: 'var(--text-primary)' }}>Artigo não encontrado</p>
          <button
            onClick={() => router.push('/dashboard/noticias')}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold rounded-xl hover:scale-105 transition"
          >
            ← Voltar para Notícias
          </button>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(article.content || '');
  const headings = extractHeadings(article.content || '');

  // Schema Markup para SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.summary,
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "author": {
      "@type": "Organization",
      "name": article.source
    },
    "publisher": {
      "@type": "Organization",
      "name": "$MILAGRE",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tokenmilagre.xyz/logo.png"
      }
    },
    "articleSection": article.category.join(", "),
    "keywords": article.keywords.join(", "),
    "inLanguage": "pt-BR",
    "isAccessibleForFree": true
  };

  return (
    <>
      {/* Schema Markup JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* Barra de Progresso de Leitura - Cor fixa laranja/amarelo */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <button
          onClick={() => router.push('/dashboard/noticias')}
          className="mb-6 px-4 py-2 rounded-xl transition flex items-center gap-2"
          style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          Voltar para Notícias
        </button>

        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8 items-start">
            {/* Conteúdo Principal */}
            <div className="flex-1 max-w-4xl">
              {/* Header do Artigo */}
              <div className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-xl mb-6" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}>

              {/* Velocímetro de Sentimento */}
              {(() => {
                const sentimentData = getSentimentData(article.sentiment);
                return (
                  <div className="mb-6 flex items-center gap-6">
                    {/* Velocímetro Visual */}
                    <div className="relative w-24 h-16 shrink-0">
                      {/* Arco do velocímetro */}
                      <div className="absolute bottom-0 left-0 right-0 h-14">
                        <svg viewBox="0 0 200 100" className="w-full h-full">
                          {/* Fundo do arco */}
                          <path
                            d="M 20 90 A 80 80 0 0 1 180 90"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                            strokeLinecap="round"
                          />
                          {/* Arco colorido gradiente */}
                          <defs>
                            <linearGradient id={`gradient-${article.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style={{ stopColor: '#ef4444' }} />
                              <stop offset="50%" style={{ stopColor: '#eab308' }} />
                              <stop offset="100%" style={{ stopColor: '#22c55e' }} />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 20 90 A 80 80 0 0 1 180 90"
                            fill="none"
                            stroke={`url(#gradient-${article.id})`}
                            strokeWidth="8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      {/* Ponteiro do velocímetro */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-10 origin-bottom transition-transform duration-500"
                           style={{ transform: `translateX(-50%) rotate(${sentimentData.rotation}deg)` }}>
                        <div className={`w-1 h-full bg-gradient-to-t ${sentimentData.color} rounded-full shadow-lg`}></div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                      </div>
                    </div>

                    {/* Label do Sentimento */}
                    <div>
                      <span className={`${sentimentData.textColor} font-bold text-lg`}>
                        {sentimentData.label}
                      </span>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Análise de sentimento da notícia</p>
                    </div>
                  </div>
                );
              })()}

              {/* Meta Info */}
              <div className="flex items-center gap-3 mb-4 flex-wrap text-sm">
                <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Baseado em: {article.source}</span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>{getTimeAgo(article.publishedAt)}</span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                  {readingTime} min de leitura
                </span>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
                {article.title}
              </h1>

              {/* Data de Publicação */}
              <div className="mb-6 flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
                <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                <span className="text-sm font-medium">
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
              <p className="text-xl mb-6 leading-relaxed font-light" style={{ color: 'var(--text-secondary)' }}>
                {article.summary}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2 mb-4">
                {article.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                  >
                    <FontAwesomeIcon icon={faHashtag} className="w-3 h-3" />
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Botões de Compartilhamento */}
              <div className="pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <p className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>Compartilhar:</p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={shareOnX}
                    className="w-10 h-10 bg-black hover:bg-gray-900 text-white rounded-lg transition flex items-center justify-center"
                    title="Compartilhar no X"
                  >
                    <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={shareOnTelegram}
                    className="px-4 py-2 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-lg transition flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                    Telegram
                  </button>
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 rounded-lg transition flex items-center gap-2"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
                    Copiar link
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="backdrop-blur-lg rounded-2xl p-8 md:p-12 border-2 shadow-xl mb-8" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}>
              <article className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return (
                        <h2 id={id} className="text-3xl font-bold mt-12 mb-6 pb-3 border-b-2 scroll-mt-24" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => (
                      <h3 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-6 leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-6 space-y-3 text-lg" style={{ color: 'var(--text-secondary)' }}>{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-6 space-y-3 text-lg" style={{ color: 'var(--text-secondary)' }}>{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="ml-4" style={{ color: 'var(--text-secondary)' }}>{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold" style={{ color: 'var(--text-primary)' }}>{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-yellow-300 not-italic font-semibold">{children}</em>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-yellow-400 pl-6 my-6 italic py-4 rounded-r-lg" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)' }}>
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 underline decoration-yellow-400/50 hover:decoration-yellow-300 transition-colors font-medium"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {article.content || 'Conteúdo não disponível.'}
                </ReactMarkdown>
              </article>

              {/* CTA Comunitário */}
              <div className="mt-12 pt-8 border-t-2" style={{ borderColor: 'var(--border-light)' }}>
                <div className="bg-gradient-to-r from-yellow-400/10 via-amber-400/10 to-yellow-400/10 border-2 border-yellow-400/30 rounded-2xl p-8">
                  <h3 className="font-bold text-2xl mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FontAwesomeIcon icon={faComments} className="w-6 h-6" />
                    Participe da Discussão
                  </h3>
                  <p className="mb-6 text-lg" style={{ color: 'var(--text-secondary)' }}>
                    O que você acha sobre este tema? Compartilhe sua opinião com a comunidade $MILAGRE!
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://discord.gg/ybJ4Mgxu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-semibold transition flex items-center gap-2 shadow-lg"
                    >
                      <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
                      Discord $MILAGRE
                    </a>
                    <a
                      href="https://t.me/+Bop_TVFc_mg3Njlh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-xl font-semibold transition flex items-center gap-2 shadow-lg"
                    >
                      <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
                      Telegram $MILAGRE
                    </a>
                  </div>
                  <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Quer aprender mais sobre Bitcoin e reservas nacionais?</span>
                    </p>
                    <a
                      href="/educacao"
                      className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition"
                    >
                      <FontAwesomeIcon icon={faGraduationCap} className="w-5 h-5" />
                      Explore nossa Biblioteca Educacional $MILAGRE
                      <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Múltiplas Fontes */}
              {article.sources && article.sources.length > 0 && (
                <div className="mt-8 pt-8 border-t-2" style={{ borderColor: 'var(--border-light)' }}>
                  <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FontAwesomeIcon icon={faBook} className="w-5 h-5" />
                    Fontes Consultadas:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.sources.map((source, idx) => {
                      // Mapear nome da fonte para URL
                      const sourceUrls: { [key: string]: string } = {
                        'Cointelegraph': 'https://cointelegraph.com',
                        'PANews': 'https://www.panewslab.com',
                        'Bitbo.io': 'https://bitbo.io',
                        'Yahoo Finance': 'https://finance.yahoo.com',
                        'TicoTimes': 'https://ticotimes.net',
                        'Reuters': 'https://www.reuters.com',
                        'Crystal Intelligence': 'https://crystalintelligence.com',
                        'WebProNews': 'https://www.webpronews.com',
                        'Anadolu Agency': 'https://www.aa.com.tr',
                        'BBC Portuguese': 'https://www.bbc.com/portuguese',
                        'CoinDesk': 'https://www.coindesk.com',
                        'The Block': 'https://www.theblock.co',
                        'InfoMoney': 'https://www.infomoney.com.br',
                        'Bloomberg Crypto': 'https://www.bloomberg.com/crypto',
                        'Coinfomania': 'https://coinfomania.com',
                        '99Bitcoins': 'https://99bitcoins.com',
                        'Coin Central': 'https://coincentral.com',
                        'CoinGecko': 'https://www.coingecko.com',
                        'Coin Bureau': 'https://www.coinbureau.com',
                        'Standard Chartered': 'https://www.sc.com',
                        'Morningstar': 'https://www.morningstar.com',
                        'CoinMarketCap': 'https://coinmarketcap.com'
                      };

                      const url = sourceUrls[source] || '#';

                      return (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border rounded-lg text-sm hover:bg-yellow-400/20 hover:border-yellow-400/40 hover:text-yellow-300 transition flex items-center gap-2"
                          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
                        >
                          {source}
                          <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3 opacity-60" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Botão Voltar para Notícias */}
              <div className="mt-8 pt-8 border-t-2" style={{ borderColor: 'var(--border-light)' }}>
                <button
                  onClick={() => router.push('/dashboard/noticias')}
                  className="inline-flex items-center gap-2 font-semibold transition text-lg"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  <span>←</span>
                  Voltar para Notícias
                </button>
              </div>

              {/* Info de Verificação */}
              {article.lastVerified && (
                <div className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                  Última verificação: {new Date(article.lastVerified).toLocaleString('pt-BR')}
                </div>
              )}
            </div>

          </div>

            {/* Sidebar - Índice, Navegação e Artigos Relacionados (Desktop) */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Card Índice */}
                {headings.length > 0 && (
                  <div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}>
                    <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <FontAwesomeIcon icon={faBook} className="w-4 h-4" />
                      Índice
                    </h3>
                    <nav className="space-y-2">
                      {headings.map((heading, idx) => (
                        <a
                          key={idx}
                          href={`#${heading.id}`}
                          className="block text-sm transition py-1 hover:pl-2 duration-200"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {heading.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Card Navegação Anterior/Próximo */}
                {(previousArticle || nextArticle) && (
                  <div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}>
                    <h3 className="font-bold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Navegação</h3>
                    <div className="space-y-3">
                      {previousArticle && (
                        <button
                          onClick={() => router.push(`/dashboard/noticias/${previousArticle.slug || previousArticle.id}`)}
                          className="w-full text-left p-3 rounded-xl transition border group"
                          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Anterior</span>
                          </div>
                          <h4 className="font-semibold text-sm line-clamp-2 transition" style={{ color: 'var(--text-primary)' }}>{previousArticle.title}</h4>
                        </button>
                      )}

                      {nextArticle && (
                        <button
                          onClick={() => router.push(`/dashboard/noticias/${nextArticle.slug || nextArticle.id}`)}
                          className="w-full text-left p-3 rounded-xl transition border group"
                          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Próximo</span>
                          </div>
                          <h4 className="font-semibold text-sm line-clamp-2 transition" style={{ color: 'var(--text-primary)' }}>{nextArticle.title}</h4>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Continue Lendo */}
                {relatedArticles.length > 0 && (
                  <div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}>
                    <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <FontAwesomeIcon icon={faBookOpen} className="w-4 h-4" />
                      Continue Lendo
                    </h3>
                    <div className="space-y-3">
                      {relatedArticles.slice(0, 3).map((related, idx) => (
                        <button
                          key={idx}
                          onClick={() => router.push(`/dashboard/noticias/${related.slug || related.id}`)}
                          className="w-full text-left p-3 rounded-xl transition border"
                          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">{getSentimentIcon(related.sentiment)}</span>
                            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{related.category[0]}</span>
                          </div>
                          <h4 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>{related.title}</h4>
                          <p className="text-xs line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>{related.summary}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
