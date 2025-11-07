'use client';

import { useState, useRef, useEffect } from 'react';
import { useCopilot } from '@/hooks/useCopilot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faRobot,
  faUser,
  faSpinner,
  faTrash,
  faCheckCircle,
  faTimesCircle,
  faCog
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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 lg:p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4">
          <FontAwesomeIcon icon={faRobot} className="text-3xl" />
          <div>
            <h3 className="text-lg font-bold">Chat com Gemini 2.5 Pro</h3>
            <p className="text-sm opacity-90 mt-1">Assistente Administrativo Inteligente</p>
          </div>
        </div>
        <button
          onClick={clearMessages}
          className="p-2 lg:px-4 lg:py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          title="Limpar conversa"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-4 p-8 h-full">
            <FontAwesomeIcon icon={faRobot} size="3x" className="text-purple-500" />
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              Olá! Sou seu Copiloto Gemini 2.5 Pro
            </h4>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Posso ajudá-lo a gerenciar artigos, analisar conteúdo, gerar relatórios e muito mais.
            </p>
            <div className="flex flex-col gap-2 mt-4 w-full max-w-md">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Experimente:
              </p>
              <button
                onClick={() => sendMessage('Me mostre os últimos 5 artigos publicados')}
                className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-sm text-gray-900 dark:text-white transition-colors"
              >
                Últimos 5 artigos
              </button>
              <button
                onClick={() => sendMessage('Quais artigos têm score de qualidade baixo?')}
                className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-sm text-gray-900 dark:text-white transition-colors"
              >
                Artigos com baixa qualidade
              </button>
              <button
                onClick={() => sendMessage('Me dê um resumo do status do sistema')}
                className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-sm text-gray-900 dark:text-white transition-colors"
              >
                Status do sistema
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3 animate-fade-in">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600'
                  } text-white`}
                >
                  <FontAwesomeIcon icon={msg.role === 'user' ? faUser : faRobot} />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div
                    className={`p-3 lg:p-4 rounded-lg whitespace-pre-wrap leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'bg-gray-50 dark:bg-gray-750 text-gray-900 dark:text-white'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-purple-500 mt-1">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                        <FontAwesomeIcon icon={faCog} /> Ferramentas usadas:
                      </p>
                      {msg.toolCalls.map((tc, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded text-purple-600 dark:text-purple-400">
                            {tc.name}
                          </span>
                        </div>
                      ))}
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
          <div className="bg-white dark:bg-gray-800 border-2 border-yellow-500 rounded-xl p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4 text-yellow-600 dark:text-yellow-400">
              <FontAwesomeIcon icon={faCheckCircle} />
              <h4 className="font-bold">Confirmação Necessária</h4>
            </div>
            <p className="text-gray-900 dark:text-white mb-4 leading-relaxed">
              {pendingConfirmation.message}
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <div className="flex justify-between py-1 text-sm">
                <span className="font-semibold text-gray-600 dark:text-gray-400">Ferramenta:</span>
                <span className="text-gray-900 dark:text-white">{pendingConfirmation.toolName}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="font-semibold text-gray-600 dark:text-gray-400">Permissão:</span>
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                  {pendingConfirmation.permissionLevel}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={approveAction}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                Aprovar
              </button>
              <button
                onClick={rejectAction}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faTimesCircle} />
                Rejeitar
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 lg:p-4 bg-red-50 dark:bg-red-900/20 border border-red-500 rounded-lg text-red-600 dark:text-red-400 text-sm">
            <FontAwesomeIcon icon={faTimesCircle} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 p-3 lg:p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 text-sm self-start">
            <FontAwesomeIcon icon={faSpinner} spin />
            <span>Processando...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 lg:p-6 bg-gray-100 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={loading}
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>

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
