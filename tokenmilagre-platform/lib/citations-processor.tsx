/**
 * Citations Processor
 * Processa citações [1][2] no markdown e as transforma em links clicáveis
 */

import React from 'react';

export interface Citation {
  url: string;
  title?: string;
  snippet?: string;
}

/**
 * Processa texto com citações [1][2] e retorna componentes React com links
 * Usado dentro do ReactMarkdown para processar texto de parágrafos
 */
export function processCitationsInText(
  text: string | React.ReactNode,
  citations: string[]
): React.ReactNode {
  // Se não é string ou não tem citations, retorna o texto original
  if (typeof text !== 'string' || !citations || citations.length === 0) {
    return text;
  }

  // Regex para encontrar [1], [2], etc
  const citationRegex = /\[(\d+)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = citationRegex.exec(text)) !== null) {
    const fullMatch = match[0]; // [1]
    const citationNumber = parseInt(match[1], 10); // 1
    const citationIndex = citationNumber - 1; // 0-indexed

    // Adiciona texto antes da citação
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Se a citação existe no array, cria link
    if (citations[citationIndex]) {
      parts.push(
        <sup key={`citation-${citationNumber}-${match.index}`}>
          <a
            href={citations[citationIndex]}
            target="_blank"
            rel="noopener noreferrer"
            className="citation-link"
            style={{
              color: 'var(--brand-primary)',
              textDecoration: 'none',
              fontWeight: 'bold',
              marginLeft: '2px',
              marginRight: '2px',
            }}
            title={`Fonte ${citationNumber}: ${citations[citationIndex]}`}
          >
            [{citationNumber}]
          </a>
        </sup>
      );
    } else {
      // Se não existe, mantém o [1] sem link
      parts.push(fullMatch);
    }

    lastIndex = match.index + fullMatch.length;
  }

  // Adiciona texto restante após última citação
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

/**
 * Componente de seção de fontes (estilo Perplexity web)
 * Mostra botão discreto "X fontes" que expande ao clicar
 */
interface SourcesSectionProps {
  citations: string[];
}

export function SourcesSection({ citations }: SourcesSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!citations || citations.length === 0) {
    return null;
  }

  // Função para extrair domínio da URL
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="mt-6">
      {/* Botão discreto */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-light)'
        }}
      >
        <span>📚</span>
        <span>{citations.length} {citations.length === 1 ? 'fonte' : 'fontes'}</span>
        <span style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {/* Card de fontes expansível */}
      {isExpanded && (
        <div
          className="mt-3 p-4 rounded-xl border space-y-3 animate-in fade-in duration-200"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-light)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4
              className="text-sm font-bold font-[family-name:var(--font-poppins)]"
              style={{ color: 'var(--text-primary)' }}
            >
              Fontes Consultadas
            </h4>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sm hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-tertiary)' }}
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {citations.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 p-2 rounded-lg transition-all hover:brightness-95"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  textDecoration: 'none',
                }}
              >
                <span
                  className="font-bold text-xs shrink-0 mt-0.5"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  [{index + 1}]
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium hover:underline break-words"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {getDomain(url)}
                  </div>
                  <div
                    className="text-xs mt-0.5 break-all opacity-70"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {url.length > 60 ? url.substring(0, 60) + '...' : url}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Wrapper para ReactMarkdown que processa citações automaticamente
 * Retorna objeto de componentes customizados para usar no ReactMarkdown
 */
export function getCitationAwareMarkdownComponents(citations: string[]) {
  return {
    // Processa citações em parágrafos
    p: ({ children }: any) => (
      <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {React.Children.map(children, (child) =>
          processCitationsInText(child, citations)
        )}
      </p>
    ),
    // Processa citações em list items
    li: ({ children }: any) => (
      <li className="ml-4" style={{ color: 'var(--text-primary)' }}>
        {React.Children.map(children, (child) =>
          processCitationsInText(child, citations)
        )}
      </li>
    ),
    // Processa citações em strong
    strong: ({ children }: any) => (
      <strong className="font-bold" style={{ color: 'var(--text-primary)' }}>
        {React.Children.map(children, (child) =>
          processCitationsInText(child, citations)
        )}
      </strong>
    ),
  };
}
