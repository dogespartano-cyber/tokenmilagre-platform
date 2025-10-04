'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

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
}

export default function ArtigoClient({ article, relatedArticles = [] }: ArtigoClientProps) {
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
      case 'positive': return '🟢';
      case 'negative': return '🔴';
      default: return '🟡';
    }
  };

  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      'Bitcoin': 'from-orange-500 to-yellow-500',
      'Ethereum': 'from-purple-500 to-blue-500',
      'Solana': 'from-green-500 to-teal-500',
      'DeFi': 'from-pink-500 to-purple-500',
      'NFTs': 'from-indigo-500 to-purple-500',
      'Regulação': 'from-gray-500 to-slate-500',
    };
    return gradients[category] || 'from-blue-500 to-cyan-500';
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = `${article?.title} via @TokenMilagre`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
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
          <p className="text-white text-xl mb-4">Artigo não encontrado</p>
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

  return (
    <>
      {/* Barra de Progresso de Leitura */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <div
          className={`h-full bg-gradient-to-r ${getCategoryGradient(article.category[0])} transition-all duration-300`}
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8 max-w-7xl mx-auto">
          {/* Conteúdo Principal */}
          <div className="flex-1 max-w-4xl">
            {/* Botão Voltar */}
            <button
              onClick={() => router.push('/dashboard/noticias')}
              className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center gap-2"
            >
              <span>←</span> Voltar para Notícias
            </button>

            {/* Hero Image com Gradiente */}
            <div className={`w-full h-64 rounded-2xl bg-gradient-to-br ${getCategoryGradient(article.category[0])} mb-8 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">{getSentimentIcon(article.sentiment)}</div>
                  <p className="text-2xl font-bold px-8">{article.category.join(' • ')}</p>
                </div>
              </div>
            </div>

            {/* Header do Artigo */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl mb-6">
              {/* Meta Info */}
              <div className="flex items-center gap-3 mb-4 flex-wrap text-sm">
                <span className="text-white/70 font-semibold">{article.source}</span>
                <span className="text-white/50">•</span>
                <span className="text-white/50">{getTimeAgo(article.publishedAt)}</span>
                <span className="text-white/50">•</span>
                <span className="text-white/50">⏱️ {readingTime} min de leitura</span>
                {article.factChecked && (
                  <>
                    <span className="text-white/50">•</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-400/40 rounded-full text-xs text-green-300 font-semibold">
                      <span>✓</span>
                      Verificado
                    </span>
                  </>
                )}
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Resumo */}
              <p className="text-white/80 text-xl mb-6 leading-relaxed font-light">
                {article.summary}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2 mb-4">
                {article.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>

              {/* Botões de Compartilhamento */}
              <div className="pt-6 border-t border-white/10">
                <p className="text-white/60 text-sm mb-3">Compartilhar:</p>
                <div className="flex gap-3">
                  <button
                    onClick={shareOnTwitter}
                    className="px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg transition flex items-center gap-2"
                  >
                    <span>𝕏</span> Twitter
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="px-4 py-2 bg-[#0077B5] hover:bg-[#006399] text-white rounded-lg transition flex items-center gap-2"
                  >
                    <span>in</span> LinkedIn
                  </button>
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition flex items-center gap-2"
                  >
                    <span>🔗</span> Copiar link
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border-2 border-white/30 shadow-xl mb-8">
              <article className="prose prose-lg prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return (
                        <h2 id={id} className="text-3xl font-bold text-white mt-12 mb-6 pb-3 border-b-2 border-white/20 scroll-mt-24">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => (
                      <h3 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-white/80 mb-6 leading-relaxed text-lg">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-6 text-white/80 space-y-3 text-lg">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-6 text-white/80 space-y-3 text-lg">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-white/80 ml-4">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-white font-bold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-yellow-300 not-italic font-semibold">{children}</em>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-yellow-400 pl-6 my-6 italic text-white/90 bg-white/5 py-4 rounded-r-lg">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {article.content || 'Conteúdo não disponível.'}
                </ReactMarkdown>
              </article>

              {/* Múltiplas Fontes */}
              {article.sources && article.sources.length > 0 && (
                <div className="mt-12 pt-8 border-t-2 border-white/20">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span>📚</span> Fontes Consultadas:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.sources.map((source, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white/80 hover:bg-white/20 transition"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fonte Original */}
              <div className="mt-8 pt-8 border-t-2 border-white/20">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition text-lg"
                >
                  Ver fonte principal ({article.source})
                  <span>→</span>
                </a>
              </div>

              {/* Info de Verificação */}
              {article.lastVerified && (
                <div className="mt-4 text-white/50 text-sm">
                  Última verificação: {new Date(article.lastVerified).toLocaleString('pt-BR')}
                </div>
              )}
            </div>

            {/* Artigos Relacionados */}
            {relatedArticles.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-6">📰 Artigos Relacionados</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedArticles.slice(0, 4).map((related, idx) => (
                    <button
                      key={idx}
                      onClick={() => router.push(`/dashboard/noticias/${related.slug || related.id}`)}
                      className="text-left bg-white/5 hover:bg-white/10 p-4 rounded-xl transition border border-white/10 hover:border-white/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{getSentimentIcon(related.sentiment)}</span>
                        <span className="text-white/60 text-xs">{related.category[0]}</span>
                      </div>
                      <h4 className="text-white font-semibold mb-2 line-clamp-2">{related.title}</h4>
                      <p className="text-white/60 text-sm line-clamp-2">{related.summary}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Índice (Desktop) */}
          {headings.length > 0 && (
            <div className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span>📑</span> Índice
                  </h3>
                  <nav className="space-y-2">
                    {headings.map((heading, idx) => (
                      <a
                        key={idx}
                        href={`#${heading.id}`}
                        className="block text-white/70 hover:text-white text-sm transition py-1 hover:pl-2 duration-200"
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
