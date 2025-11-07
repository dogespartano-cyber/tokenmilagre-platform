'use client';

import { useState, useRef, useEffect } from 'react';
import { useCopilot } from '@/hooks/useCopilot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faRobot,
  faUser,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faCog,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

export default function CopilotChat() {
  const {
    messages,
    loading,
    error,
    pendingConfirmation,
    sendMessage,
    approveAction,
    rejectAction,
    clearMessages
  } = useCopilot();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    sendMessage(input.trim());
    setInput('');
  };

  const suggestedPrompts = [
    'Me mostre os últimos 5 artigos publicados',
    'Quais artigos têm score de qualidade baixo?',
    'Me dê um resumo do status do sistema',
    'Analise as métricas de engajamento',
    'Liste as tarefas agendadas ativas'
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faRobot} className="text-2xl text-white" />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Olá! Sou seu Copiloto IA
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Posso ajudá-lo a gerenciar artigos, analisar conteúdo e muito mais.
              </p>
            </div>

            <div className="w-full max-w-sm space-y-2 mt-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-3">
                Experimente:
              </p>
              {suggestedPrompts.slice(0, 3).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(prompt)}
                  className="w-full p-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg text-left text-xs text-gray-700 dark:text-gray-300 transition-all hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3 animate-fade-in">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600'
                  } text-white shadow-lg`}
                >
                  <FontAwesomeIcon icon={msg.role === 'user' ? faUser : faRobot} className="text-sm" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div
                    className={`p-3 rounded-xl whitespace-pre-wrap leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700'
                        : 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-gray-900 dark:text-white border border-purple-200 dark:border-purple-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-purple-500">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                        <FontAwesomeIcon icon={faCog} className="mr-1" /> Ferramentas usadas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.toolCalls.map((tc, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-1 bg-white dark:bg-gray-900 rounded text-xs font-mono text-purple-600 dark:text-purple-400"
                          >
                            {tc.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}

        {/* Pending Confirmation */}
        {pendingConfirmation && (
          <div className="bg-white dark:bg-gray-800 border-2 border-yellow-500 rounded-xl p-4 animate-fade-in shadow-xl">
            <div className="flex items-center gap-2 mb-3 text-yellow-600 dark:text-yellow-400">
              <FontAwesomeIcon icon={faCheckCircle} />
              <h4 className="font-bold text-sm">Confirmação Necessária</h4>
            </div>
            <p className="text-gray-900 dark:text-white mb-3 leading-relaxed text-sm">
              {pendingConfirmation.message}
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mb-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-600 dark:text-gray-400">Ferramenta:</span>
                <span className="text-gray-900 dark:text-white">{pendingConfirmation.toolName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-600 dark:text-gray-400">Permissão:</span>
                <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                  {pendingConfirmation.permissionLevel}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={approveAction}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                Aprovar
              </button>
              <button
                onClick={rejectAction}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faTimesCircle} />
                Rejeitar
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-500 rounded-lg text-red-600 dark:text-red-400 text-sm animate-fade-in">
            <FontAwesomeIcon icon={faTimesCircle} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg text-gray-700 dark:text-gray-300 text-sm">
            <FontAwesomeIcon icon={faSpinner} spin className="text-purple-600 dark:text-purple-400" />
            <span>Processando com Gemini 2.5 Pro...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="mb-3 text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2"
            title="Limpar conversa"
          >
            <FontAwesomeIcon icon={faTrash} />
            Limpar conversa
          </button>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease;
        }
      `}</style>
    </div>
  );
}
