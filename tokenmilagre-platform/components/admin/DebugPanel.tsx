'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faChevronDown, faChevronUp, faCopy } from '@fortawesome/free-solid-svg-icons';

interface DebugLog {
  timestamp: Date;
  type: 'context-sent' | 'response-received' | 'apply-clicked' | 'validation-warning';
  data: any;
}

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Escutar eventos de debug
    const handleDebug = (event: CustomEvent) => {
      const newLog: DebugLog = {
        timestamp: new Date(),
        type: event.detail.type,
        data: event.detail.data
      };

      setLogs(prev => [...prev, newLog]);

      // Auto-scroll quando adicionar novo log
      setTimeout(() => {
        const container = document.getElementById('debug-logs-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    };

    window.addEventListener('admin-chat-debug' as any, handleDebug);

    return () => {
      window.removeEventListener('admin-chat-debug' as any, handleDebug);
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const copyToClipboard = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const copyAllLogs = async () => {
    try {
      // Formatar todos os logs em um único texto
      const allLogsText = logs.map((log, index) => {
        const typeInfo = getTypeLabel(log.type);
        const timestamp = log.timestamp.toLocaleString('pt-BR');
        const data = formatData(log.data);

        return `${'='.repeat(80)}
${typeInfo.emoji} ${typeInfo.label.toUpperCase()}
Timestamp: ${timestamp}
${'='.repeat(80)}

${data}

`;
      }).join('\n');

      await navigator.clipboard.writeText(allLogsText);

      // Feedback visual
      const button = document.getElementById('copy-all-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✅ Copiado!';
        setTimeout(() => {
          button.textContent = originalText || 'Copiar Tudo';
        }, 2000);
      }
    } catch (err) {
      console.error('Erro ao copiar todos os logs:', err);
      alert('Erro ao copiar logs');
    }
  };

  const formatData = (data: any): string => {
    if (typeof data === 'string') return data;
    return JSON.stringify(data, null, 2);
  };

  const getTypeLabel = (type: string): { label: string; color: string; emoji: string } => {
    switch (type) {
      case 'context-sent':
        return { label: 'Contexto Enviado', color: '#3b82f6', emoji: '📤' };
      case 'response-received':
        return { label: 'Resposta Recebida', color: '#10b981', emoji: '📥' };
      case 'apply-clicked':
        return { label: 'Aplicar Clicado', color: '#f59e0b', emoji: '✏️' };
      case 'validation-warning':
        return { label: 'Aviso de Validação', color: '#ef4444', emoji: '⚠️' };
      default:
        return { label: type, color: '#6b7280', emoji: '📝' };
    }
  };

  return (
    <>
      {/* Toggle Button (fixed no canto inferior esquerdo) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 bottom-4 z-50 px-4 py-2 rounded-lg shadow-lg font-semibold transition-all hover:scale-105 flex items-center gap-2"
          style={{
            backgroundColor: '#ef4444',
            color: 'white'
          }}
          title="Abrir Debug Panel"
        >
          <FontAwesomeIcon icon={faBug} />
          Debug
        </button>
      )}

      {/* Debug Panel */}
      {isOpen && (
        <div
          className="fixed left-0 bottom-0 z-50 border-t border-r shadow-2xl"
          style={{
            width: '600px',
            height: '400px',
            maxWidth: '100vw',
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-medium)'
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-3 border-b"
            style={{ borderColor: 'var(--border-light)', backgroundColor: '#1f2937' }}
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBug} className="text-red-500" />
              <h3 className="font-bold text-white">Debug Panel - Admin Chat</h3>
              <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#374151', color: '#9ca3af' }}>
                {logs.length} logs
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="copy-all-btn"
                onClick={copyAllLogs}
                disabled={logs.length === 0}
                className="text-xs px-3 py-1 rounded hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                style={{ backgroundColor: '#10b981', color: 'white' }}
                title="Copiar todos os logs"
              >
                <FontAwesomeIcon icon={faCopy} />
                Copiar Tudo
              </button>
              <button
                onClick={clearLogs}
                disabled={logs.length === 0}
                className="text-xs px-3 py-1 rounded hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#374151', color: 'white' }}
                title="Limpar todos os logs"
              >
                Limpar
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs px-3 py-1 rounded hover:opacity-80"
                style={{ backgroundColor: '#374151', color: 'white' }}
                title="Minimizar Debug Panel"
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>
          </div>

          {/* Logs Container */}
          <div
            id="debug-logs-container"
            className="overflow-y-auto p-3 space-y-3"
            style={{
              height: 'calc(100% - 56px)',
              backgroundColor: '#111827'
            }}
          >
            {logs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FontAwesomeIcon icon={faBug} className="text-4xl mb-2" />
                <p>Nenhum log ainda. Interaja com o chat para ver os logs.</p>
              </div>
            ) : (
              logs.map((log, index) => {
                const typeInfo = getTypeLabel(log.type);
                return (
                  <div
                    key={index}
                    className="rounded-lg p-3 border"
                    style={{
                      backgroundColor: '#1f2937',
                      borderColor: typeInfo.color
                    }}
                  >
                    {/* Log Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{typeInfo.emoji}</span>
                        <span
                          className="text-xs font-bold px-2 py-1 rounded"
                          style={{ backgroundColor: typeInfo.color, color: 'white' }}
                        >
                          {typeInfo.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {log.timestamp.toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(formatData(log.data), index)}
                        className="text-xs px-2 py-1 rounded hover:opacity-80"
                        style={{ backgroundColor: '#374151', color: 'white' }}
                      >
                        <FontAwesomeIcon icon={faCopy} className="mr-1" />
                        {copiedIndex === index ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>

                    {/* Log Data */}
                    <div
                      className="text-xs font-mono p-2 rounded overflow-x-auto"
                      style={{
                        backgroundColor: '#0f172a',
                        color: '#e5e7eb',
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}
                    >
                      <pre className="whitespace-pre-wrap break-all">
                        {formatData(log.data)}
                      </pre>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}
