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
    <div className="copilot-chat">
      {/* Header */}
      <div className="chat-header">
        <div className="header-info">
          <FontAwesomeIcon icon={faRobot} className="header-icon" />
          <div>
            <h3>Chat com Gemini 2.5 Pro</h3>
            <p className="header-subtitle">Assistente Administrativo Inteligente</p>
          </div>
        </div>
        <button onClick={clearMessages} className="clear-button" title="Limpar conversa">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <FontAwesomeIcon icon={faRobot} size="3x" />
            <h4>Olá! Sou seu Copiloto Gemini 2.5 Pro</h4>
            <p>Posso ajudá-lo a gerenciar artigos, analisar conteúdo, gerar relatórios e muito mais.</p>
            <div className="suggestions">
              <p className="suggestions-title">Experimente:</p>
              <button onClick={() => sendMessage('Me mostre os últimos 5 artigos publicados')}>
                Últimos 5 artigos
              </button>
              <button onClick={() => sendMessage('Quais artigos têm score de qualidade baixo?')}>
                Artigos com baixa qualidade
              </button>
              <button onClick={() => sendMessage('Me dê um resumo do status do sistema')}>
                Status do sistema
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role}`}>
                <div className="message-icon">
                  <FontAwesomeIcon icon={msg.role === 'user' ? faUser : faRobot} />
                </div>
                <div className="message-content">
                  <div className="message-text">{msg.content}</div>
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="tool-calls">
                      <p className="tool-calls-title">
                        <FontAwesomeIcon icon={faCog} /> Ferramentas usadas:
                      </p>
                      {msg.toolCalls.map((tc, i) => (
                        <div key={i} className="tool-call-item">
                          <span className="tool-name">{tc.name}</span>
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
          <div className="confirmation-card">
            <div className="confirmation-header">
              <FontAwesomeIcon icon={faCheckCircle} />
              <h4>Confirmação Necessária</h4>
            </div>
            <p className="confirmation-message">{pendingConfirmation.message}</p>
            <div className="confirmation-details">
              <div className="detail-row">
                <span className="detail-label">Ferramenta:</span>
                <span className="detail-value">{pendingConfirmation.toolName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Permissão:</span>
                <span className="detail-value permission-badge">{pendingConfirmation.permissionLevel}</span>
              </div>
            </div>
            <div className="confirmation-actions">
              <button onClick={approveAction} className="approve-button" disabled={loading}>
                <FontAwesomeIcon icon={faCheckCircle} />
                Aprovar
              </button>
              <button onClick={rejectAction} className="reject-button" disabled={loading}>
                <FontAwesomeIcon icon={faTimesCircle} />
                Rejeitar
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-message">
            <FontAwesomeIcon icon={faTimesCircle} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-indicator">
            <FontAwesomeIcon icon={faSpinner} spin />
            <span>Processando...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={loading}
          className="chat-input"
        />
        <button type="submit" disabled={!input.trim() || loading} className="send-button">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>

      <style jsx>{`
        .copilot-chat {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--card-background);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--card-shadow);
          overflow: hidden;
        }

        .chat-header {
          padding: var(--spacing-lg);
          background: var(--gradient-primary);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .header-icon {
          font-size: 2rem;
        }

        .chat-header h3 {
          margin: 0;
          font-size: 1.25rem;
        }

        .header-subtitle {
          margin: 4px 0 0 0;
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .clear-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius-md);
          color: white;
          cursor: pointer;
          transition: var(--transition-normal);
        }

        .clear-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .welcome-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: var(--spacing-md);
          padding: var(--spacing-xl);
          color: var(--text-secondary);
          height: 100%;
        }

        .welcome-message h4 {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.5rem;
        }

        .welcome-message p {
          margin: 0;
          max-width: 400px;
        }

        .suggestions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-md);
          width: 100%;
          max-width: 400px;
        }

        .suggestions-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin: 0 0 var(--spacing-xs) 0;
        }

        .suggestions button {
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--background-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition-normal);
          text-align: left;
          font-size: 0.875rem;
        }

        .suggestions button:hover {
          background: var(--background-tertiary);
          border-color: var(--color-primary);
        }

        .message {
          display: flex;
          gap: var(--spacing-sm);
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1rem;
        }

        .message.user .message-icon {
          background: var(--gradient-secondary);
          color: white;
        }

        .message.assistant .message-icon {
          background: var(--gradient-primary);
          color: white;
        }

        .message-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .message-text {
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius-md);
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .message.user .message-text {
          background: var(--background-secondary);
          color: var(--text-primary);
        }

        .message.assistant .message-text {
          background: var(--background-tertiary);
          color: var(--text-primary);
        }

        .tool-calls {
          padding: var(--spacing-sm);
          background: var(--background-secondary);
          border-radius: var(--border-radius-sm);
          border-left: 3px solid var(--color-primary);
          margin-top: var(--spacing-xs);
        }

        .tool-calls-title {
          margin: 0 0 var(--spacing-xs) 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .tool-call-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.875rem;
        }

        .tool-name {
          font-family: monospace;
          background: var(--background-primary);
          padding: 2px 8px;
          border-radius: 4px;
          color: var(--color-primary);
        }

        .confirmation-card {
          background: var(--card-background);
          border: 2px solid var(--color-warning);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          animation: slideIn 0.3s ease;
        }

        .confirmation-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
          color: var(--color-warning);
        }

        .confirmation-header h4 {
          margin: 0;
          font-size: 1rem;
        }

        .confirmation-message {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--text-primary);
          line-height: 1.6;
        }

        .confirmation-details {
          background: var(--background-secondary);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius-md);
          margin-bottom: var(--spacing-md);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 0.875rem;
        }

        .detail-label {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .detail-value {
          color: var(--text-primary);
        }

        .permission-badge {
          background: var(--gradient-warning);
          color: white;
          padding: 2px 8px;
          border-radius: var(--border-radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .confirmation-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .approve-button,
        .reject-button {
          flex: 1;
          padding: var(--spacing-sm) var(--spacing-md);
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          transition: var(--transition-normal);
        }

        .approve-button {
          background: var(--gradient-success);
          color: white;
        }

        .approve-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--card-shadow);
        }

        .reject-button {
          background: var(--background-tertiary);
          color: var(--text-primary);
        }

        .reject-button:hover:not(:disabled) {
          background: var(--background-secondary);
        }

        .approve-button:disabled,
        .reject-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--color-error);
          border-radius: var(--border-radius-md);
          color: var(--color-error);
          font-size: 0.875rem;
        }

        .loading-indicator {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--background-secondary);
          border-radius: var(--border-radius-md);
          color: var(--text-secondary);
          font-size: 0.875rem;
          align-self: flex-start;
        }

        .chat-input-form {
          display: flex;
          gap: var(--spacing-sm);
          padding: var(--spacing-lg);
          background: var(--background-secondary);
          border-top: 1px solid var(--border-color);
        }

        .chat-input {
          flex: 1;
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--background-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: var(--transition-normal);
        }

        .chat-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
        }

        .chat-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .send-button {
          padding: var(--spacing-sm) var(--spacing-lg);
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-normal);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--card-shadow);
        }

        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
