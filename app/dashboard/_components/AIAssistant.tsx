'use client';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
 faRobot,
 faPaperPlane,
 faTrash,
 faSpinner,
 faExclamationTriangle,
 faCheck,
 faCopy
} from '@fortawesome/free-solid-svg-icons';
import { useAdminChat } from '@/hooks/useAdminChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIAssistantProps {
 pageData?: Record<string, any>;
 model?: 'sonar' | 'sonar-pro';
 onApplyContent?: (content: string) => void;
}

export default function AIAssistant({
 pageData,
 model = 'sonar',
 onApplyContent
}: AIAssistantProps) {
 const [inputValue, setInputValue] = useState('');
 const [copiedId, setCopiedId] = useState<string | null>(null);
 const messagesEndRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLTextAreaElement>(null);

 const { messages, loading, error, sendMessage, clearHistory } = useAdminChat({
  pageData,
  model,
  onApply: onApplyContent
 });

 useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages]);

 const handleSend = async () => {
  if (!inputValue.trim() || loading) return;
  await sendMessage(inputValue);
  setInputValue('');
 };

 const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
   e.preventDefault();
   handleSend();
  }
 };

 const handleCopy = async (content: string, messageId: string) => {
  try {
   await navigator.clipboard.writeText(content);
   setCopiedId(messageId);
   setTimeout(() => setCopiedId(null), 2000);
  } catch (err) {
   console.error('Erro ao copiar:', err);
  }
 };

 const detectCodeBlocks = (content: string): boolean => {
  return content.includes('```');
 };

 return (
  <div
   className="h-full flex flex-col relative"
   style={{
    backgroundColor: '#232627'
   }}
  >
   {/* Messages Area */}
   <div
    className="flex-1 overflow-y-auto"
    style={{
     scrollbarWidth: 'thin',
     scrollbarColor: '#3a3d3e transparent'
    }}
   >
    {messages.length === 0 ? (
     // Empty State - Claude Style
     <div className="h-full flex items-center justify-center px-6">
      <div className="w-full max-w-3xl">
       <div className="text-center mb-16">
        <div className="mb-6">
         <span className="text-5xl">✨</span>
        </div>
        <h1 className="text-4xl font-light mb-3" style={{ color: '#e8e8e8' }}>
         Olá, como posso ajudar?
        </h1>
        <p className="text-base" style={{ color: '#9a9a9a' }}>
         Converse naturalmente sobre qualquer tarefa
        </p>
       </div>
      </div>
     </div>
    ) : (
     // Messages View - Wide Layout
     <div className="w-full max-w-5xl mx-auto px-6 py-12 pb-32">
      {messages.map((message: any) => (
       <div key={message.id} className="mb-10">
        {message.role === 'user' ? (
         // User Message - Small pill on top right
         <div className="flex justify-end mb-6">
          <div
           className="inline-block px-4 py-2 rounded-full text-sm"
           style={{
            backgroundColor: '#3a3d3e',
            color: '#e8e8e8'
           }}
          >
           {message.content}
          </div>
         </div>
        ) : (
         // Assistant Message - Full width, no bubble
         <div className="space-y-4">
          <div className="prose prose-lg max-w-none" style={{ color: '#e8e8e8' }}>
           <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
             p: ({ children }) => (
              <p className="mb-4 leading-relaxed text-base" style={{ color: '#e8e8e8' }}>
               {children}
              </p>
             ),
             h1: ({ children }) => (
<h1 className="title-newtab text-2xl mb-4 mt-6" style={{ color: '#e8e8e8' }}>
               {children}
              </h1>
             ),
             h2: ({ children }) => (
<h2 className="title-newtab text-xl mb-3 mt-5" style={{ color: '#e8e8e8' }}>
               {children}
              </h2>
             ),
             h3: ({ children }) => (
<h3 className="title-newtab text-lg mb-2 mt-4" style={{ color: '#e8e8e8' }}>
               {children}
              </h3>
             ),
             code: ({ className, children }) => {
              const isBlock = className?.includes('language-');
              return isBlock ? (
               <code
                className={`block p-4 rounded-lg text-sm font-mono overflow-x-auto my-3 ${className}`}
                style={{
                 backgroundColor: '#1a1c1d',
                 color: '#e8e8e8'
                }}
               >
                {children}
               </code>
              ) : (
               <code
                className="px-2 py-1 rounded text-sm font-mono"
                style={{
                 backgroundColor: '#3a3d3e',
                 color: '#e8e8e8'
                }}
               >
                {children}
               </code>
              );
             },
             strong: ({ children }) => (
              <strong className="font-bold" style={{ color: '#e8e8e8' }}>
               {children}
              </strong>
             ),
             ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 my-3" style={{ color: '#e8e8e8' }}>
               {children}
              </ul>
             ),
             ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 my-3" style={{ color: '#e8e8e8' }}>
               {children}
              </ol>
             ),
             blockquote: ({ children }) => (
              <blockquote
               className="border-l-4 pl-4 my-3 italic"
               style={{ borderColor: '#5a5d5e', color: '#b8b8b8' }}
              >
               {children}
              </blockquote>
             ),
            }}
           >
            {message.content}
           </ReactMarkdown>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
           <button
            onClick={() => handleCopy(message.content, message.id)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all hover:brightness-125"
            style={{
             backgroundColor: '#3a3d3e',
             color: '#9a9a9a'
            }}
           >
            <FontAwesomeIcon
             icon={copiedId === message.id ? faCheck : faCopy}
             className="mr-1.5"
            />
            {copiedId === message.id ? 'Copiado' : 'Copiar'}
           </button>

           {/* Botão Reabrir Canvas */}
           {message.metadata?.canvasArticle && (
            <button
             onClick={() => {
              // Disparar evento para reabrir canvas com o artigo
              window.dispatchEvent(new CustomEvent('open-article-canvas', {
               detail: {
                article: message.metadata?.canvasArticle,
                instruction: message.metadata?.instruction
               }
              }));
             }}
             className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all hover:brightness-110"
             style={{
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
              color: 'white'
             }}
            >
             📝 Reabrir Canvas
            </button>
           )}

           {detectCodeBlocks(message.content) && onApplyContent && (
            <button
             onClick={() => {
              const codeMatch = message.content.match(/```(?:markdown)?\n([\s\S]*?)\n```/);
              if (codeMatch) {
               onApplyContent(codeMatch[1]);
              }
             }}
             className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all hover:brightness-110"
             style={{
              backgroundColor: 'var(--success)',
              color: 'white'
             }}
            >
             <FontAwesomeIcon icon={faCheck} className="mr-1.5" />
             Aplicar
            </button>
           )}

           <span className="text-xs ml-auto" style={{ color: '#6a6d6e' }}>
            {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
           </span>
          </div>
         </div>
        )}
       </div>
      ))}

      {loading && (
       <div className="mb-10">
        <div
         className="inline-flex items-center px-4 py-2 rounded-lg text-sm"
         style={{
          backgroundColor: '#3a3d3e',
          color: '#e8e8e8'
         }}
        >
         <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
         Pensando...
        </div>
       </div>
      )}

      {error && (
       <div
        className="rounded-lg p-4 border flex items-start gap-3 mb-10"
        style={{
         backgroundColor: 'rgba(239, 68, 68, 0.1)',
         borderColor: 'rgba(239, 68, 68, 0.3)',
         color: '#ef4444'
        }}
       >
        <FontAwesomeIcon icon={faExclamationTriangle} className="mt-0.5" />
        <p className="text-sm">{error}</p>
       </div>
      )}

      <div ref={messagesEndRef} />
     </div>
    )}
   </div>

   {/* Fixed Input at Bottom */}
   <div
    className="fixed bottom-0 left-0 right-0 border-t"
    style={{
     backgroundColor: '#232627',
     borderColor: '#3a3d3e'
    }}
   >
    <div className="w-full max-w-5xl mx-auto px-6 py-4">
     {/* Clear History Button */}
     {messages.length > 0 && (
      <div className="flex justify-end mb-2">
       <button
        onClick={() => {
         if (confirm('Limpar todo o histórico?')) {
          clearHistory();
         }
        }}
        className="text-xs px-3 py-1 rounded-lg transition-all hover:brightness-125"
        style={{
         backgroundColor: '#3a3d3e',
         color: '#9a9a9a'
        }}
        title="Limpar histórico"
       >
        <FontAwesomeIcon icon={faTrash} className="mr-1.5" />
        Limpar
       </button>
      </div>
     )}

     <div className="relative">
      <textarea
       ref={inputRef}
       value={inputValue}
       onChange={(e) => setInputValue(e.target.value)}
       onKeyDown={handleKeyDown}
       placeholder="Pergunte alguma coisa..."
       rows={1}
       disabled={loading}
       className="w-full px-5 py-4 pr-14 rounded-2xl border resize-none focus:outline-none focus:ring-2 transition-all text-base"
       style={{
        backgroundColor: '#2f3233',
        borderColor: '#3a3d3e',
        color: '#e8e8e8',
        '--tw-ring-color': 'rgba(var(--brand-primary-rgb), 0.5)'
       } as React.CSSProperties}
      />
      <button
       onClick={handleSend}
       disabled={loading || !inputValue.trim()}
       className="absolute right-3 bottom-3 p-2.5 rounded-lg transition-all disabled:opacity-40 hover:brightness-110"
       style={{
        background: loading || !inputValue.trim() ? '#3a3d3e' : 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
        color: '#e8e8e8'
       }}
      >
       <FontAwesomeIcon icon={loading ? faSpinner : faPaperPlane} className={loading ? 'animate-spin' : ''} />
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}
