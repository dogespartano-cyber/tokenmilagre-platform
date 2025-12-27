/**
 * ChatInterface Component
 * Interface de chat com IA para criação de artigos
 */

import { useRef, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { faPaperPlane, faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { type ArticleType, MESSAGES, PROMPT_SUGGESTIONS, ANIMATION_DELAYS, CHAT_CONFIG } from '../_lib/constants';
import type { Message } from '../_hooks/usePerplexityChat';

interface ChatInterfaceProps {
 conversation: Message[];
 loading: boolean;
 processing: boolean;
 prompt: string;
 selectedType: ArticleType | null;
 onPromptChange: (value: string) => void;
 onSendMessage: () => void;
}

// Tipos para componentes ReactMarkdown
interface MarkdownComponentProps {
 children?: React.ReactNode;
}

interface MarkdownLinkProps extends MarkdownComponentProps {
 href?: string;
}

interface MarkdownCodeProps extends MarkdownComponentProps {
 inline?: boolean;
}

export default function ChatInterface({
 conversation,
 loading,
 processing,
 prompt,
 selectedType,
 onPromptChange,
 onSendMessage
}: ChatInterfaceProps) {
 const chatContainerRef = useRef<HTMLDivElement>(null);

 // Auto-scroll ao adicionar mensagens
 useEffect(() => {
  if (conversation.length > 0 && chatContainerRef.current) {
   const container = chatContainerRef.current;
   container.scrollTop = container.scrollHeight;
  }
 }, [conversation]);

 // Auto-scroll durante streaming
 useEffect(() => {
  const container = chatContainerRef.current;
  if (!container) return;

  const shouldAutoScroll = () => {
   const threshold = CHAT_CONFIG.scrollThreshold;
   const position = container.scrollTop + container.clientHeight;
   const bottom = container.scrollHeight;
   return bottom - position < threshold;
  };

  const scrollToBottom = () => {
   if (shouldAutoScroll()) {
    container.scrollTop = container.scrollHeight;
   }
  };

  let observer: MutationObserver | null = null;

  if (loading && conversation.length > 0) {
   observer = new MutationObserver(scrollToBottom);
   observer.observe(container, {
    childList: true,
    subtree: true,
    characterData: true
   });
  }

  return () => {
   if (observer) {
    observer.disconnect();
   }
  };
 }, [loading, conversation.length]);

 // Componentes do ReactMarkdown
 const markdownComponents = useMemo(() => ({
  p: ({ children }: MarkdownComponentProps) => (
   <p className="mb-3 last:mb-0 break-words" style={{ color: 'inherit' }}>
    {children}
   </p>
  ),
  h1: ({ children }: MarkdownComponentProps) => (
<h1 className="title-newtab text-2xl mb-3 mt-4" style={{ color: 'inherit' }}>
    {children}
   </h1>
  ),
  h2: ({ children }: MarkdownComponentProps) => (
<h2 className="title-newtab text-xl mb-2 mt-4" style={{ color: 'inherit' }}>
    {children}
   </h2>
  ),
  h3: ({ children }: MarkdownComponentProps) => (
<h3 className="title-newtab text-lg mb-2 mt-3" style={{ color: 'inherit' }}>
    {children}
   </h3>
  ),
  strong: ({ children }: MarkdownComponentProps) => (
   <strong className="font-bold" style={{ color: 'inherit' }}>
    {children}
   </strong>
  ),
  em: ({ children }: MarkdownComponentProps) => (
   <em className="italic" style={{ color: 'inherit' }}>
    {children}
   </em>
  ),
  ul: ({ children }: MarkdownComponentProps) => (
   <ul className="list-disc list-inside mb-3 space-y-1" style={{ color: 'inherit' }}>
    {children}
   </ul>
  ),
  ol: ({ children }: MarkdownComponentProps) => (
   <ol className="list-decimal list-inside mb-3 space-y-1" style={{ color: 'inherit' }}>
    {children}
   </ol>
  ),
  li: ({ children }: MarkdownComponentProps) => (
   <li className="mb-1" style={{ color: 'inherit' }}>
    {children}
   </li>
  ),
  a: ({ children, href }: MarkdownLinkProps) => (
   <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="underline hover:opacity-80"
    style={{ color: 'var(--brand-primary)' }}
   >
    {children}
   </a>
  ),
  code: ({ inline, children }: MarkdownCodeProps) => {
   if (inline) {
    return (
     <code
      className="px-1.5 py-0.5 rounded text-sm font-mono"
      style={{
       backgroundColor: 'var(--bg-secondary)',
       color: 'var(--text-primary)'
      }}
     >
      {children}
     </code>
    );
   }
   return (
    <code className="block break-all whitespace-pre-wrap overflow-x-auto max-w-full text-sm font-mono">
     {children}
    </code>
   );
  },
  pre: ({ children }: MarkdownComponentProps) => (
   <pre
    className="break-all whitespace-pre-wrap overflow-x-auto max-w-full p-3 rounded mb-3 text-sm font-mono"
    style={{
     backgroundColor: 'var(--bg-secondary)',
     color: 'var(--text-primary)'
    }}
   >
    {children}
   </pre>
  ),
  blockquote: ({ children }: MarkdownComponentProps) => (
   <blockquote
    className="border-l-4 pl-4 py-2 mb-3 italic"
    style={{
     borderColor: 'var(--border-medium)',
     color: 'var(--text-secondary)'
    }}
   >
    {children}
   </blockquote>
  ),
  hr: () => (
   <hr className="my-4" style={{ borderColor: 'var(--border-light)' }} />
  ),
 }), []);

 const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
   e.preventDefault();
   onSendMessage();
  }
 };

 return (
  <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl overflow-hidden shadow-xl">
   {/* Mensagens */}
   <div
    ref={chatContainerRef}
    className="p-6 pt-12 space-y-4 relative"
   >
    {/* Back Link inside Card */}
    <div className="absolute top-4 right-6 z-10">
     <Link
      href="/dashboard"
      className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
     >
      <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
      Voltar ao Dashboard
     </Link>
    </div>

    {conversation.length === 0 && (
     <div className="py-12">
      {/* Sugestões de Prompts */}
      {!selectedType && (
       <div className="space-y-3">
        <p className="text-sm font-semibold text-left mb-3 text-gray-500 dark:text-gray-400">
         {MESSAGES.chat.suggestions}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
         {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
          <button
           key={idx}
           onClick={() => onPromptChange(suggestion.prompt)}
           className="text-left px-4 py-3 rounded-xl transition-all hover:brightness-110 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
          >
           <div className="text-2xl mb-1">{suggestion.emoji}</div>
           <span className="font-medium text-sm">{suggestion.label}</span>
          </button>
         ))}
        </div>
       </div>
      )}
     </div>
    )}

    {conversation.map((msg, idx) => (
     <div
      key={idx}
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
     >
      <div
       className={`max-w-[80%] p-4 rounded-xl break-words overflow-wrap-anywhere ${msg.role === 'user'
        ? 'bg-teal-600 text-white rounded-br-none'
        : 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-100 rounded-bl-none'
        }`}
      >
       <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown components={markdownComponents}>
         {msg.content}
        </ReactMarkdown>
       </div>
      </div>
     </div>
    ))}

    {loading && (
     <div className="flex justify-start">
      <div className="p-4 rounded-xl rounded-bl-none bg-gray-100 dark:bg-white/5">
       <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full animate-bounce bg-teal-500" style={{ animationDelay: ANIMATION_DELAYS.bounce1 }}></div>
        <div className="w-2 h-2 rounded-full animate-bounce bg-teal-500" style={{ animationDelay: ANIMATION_DELAYS.bounce2 }}></div>
        <div className="w-2 h-2 rounded-full animate-bounce bg-teal-500" style={{ animationDelay: ANIMATION_DELAYS.bounce3 }}></div>
       </div>
      </div>
     </div>
    )}

    {processing && (
     <div className="flex justify-start">
      <div className="p-4 rounded-xl rounded-bl-none flex items-center gap-2 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white">
       <FontAwesomeIcon icon={faSpinner} spin />
       Processando com Gemini...
      </div>
     </div>
    )}
   </div>

   {/* Input */}
   <div className="p-4 border-t border-gray-200 dark:border-white/10">
    <div className="flex gap-3">
     <input
      type="text"
      value={prompt}
      onChange={(e) => onPromptChange(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder="Digite sua mensagem..."
      disabled={loading || processing}
      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder-gray-400"
      aria-label="Campo de entrada para conversar com a IA"
     />
     <button
      onClick={onSendMessage}
      disabled={!prompt.trim() || loading || processing}
      className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-teal-600 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"
      aria-label={loading ? 'Aguardando resposta da IA' : 'Enviar mensagem'}
     >
      <FontAwesomeIcon icon={faPaperPlane} />
     </button>
    </div>
   </div>
  </div>
 );
}
