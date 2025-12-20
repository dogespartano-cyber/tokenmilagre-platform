/**
 * ValidationResultPanel Component
 * 
 * Exibe resultado do fact-checking com Gemini
 * Inclui chat para perguntas de follow-up
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faExclamationTriangle,
    faTimesCircle,
    faChevronDown,
    faChevronUp,
    faExternalLink,
    faLightbulb,
    faComments,
    faPaperPlane,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect } from 'react';
import type { FactCheckResult, VerifiedClaim, Source } from '@/lib/shared/ai/gemini-validator';

interface ValidationResultPanelProps {
    result: FactCheckResult;
    articleTitle?: string;
    articleContent?: string;
    onDismiss?: () => void;
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default function ValidationResultPanel({
    result,
    articleTitle = '',
    articleContent = '',
    onDismiss
}: ValidationResultPanelProps) {
    const [expanded, setExpanded] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Scroll para última mensagem
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Determinar cor e ícone baseado no status
    const statusConfig = {
        verified: {
            icon: faCheckCircle,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/30',
            label: 'Verificado'
        },
        partially_verified: {
            icon: faExclamationTriangle,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/30',
            label: 'Parcialmente Verificado'
        },
        unverified: {
            icon: faTimesCircle,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/30',
            label: 'Não Verificado'
        },
        error: {
            icon: faTimesCircle,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/10',
            borderColor: 'border-gray-500/30',
            label: 'Erro'
        }
    };

    const config = statusConfig[result.status];

    // Função para enviar pergunta ao chat
    const handleSendMessage = async () => {
        if (!chatInput.trim() || chatLoading) return;

        const userMessage = chatInput.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setChatLoading(true);

        try {
            const response = await fetch('/api/validation-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: userMessage,
                    validationContext: {
                        articleTitle,
                        articleContent: articleContent.substring(0, 2000), // Limitar tamanho
                        validationResult: {
                            score: result.score,
                            status: result.status,
                            summary: result.summary,
                            verifiedClaims: result.verifiedClaims,
                            unverifiedClaims: result.unverifiedClaims,
                            suggestions: result.suggestions
                        }
                    },
                    conversationHistory: chatMessages
                })
            });

            const data = await response.json();

            if (data.success && data.answer) {
                setChatMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
            } else {
                setChatMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Erro: ${data.error || 'Não foi possível processar sua pergunta'}`
                }]);
            }
        } catch (error) {
            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Erro ao conectar com o servidor. Tente novamente.'
            }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className={`rounded-xl border ${config.borderColor} ${config.bgColor} p-4 mb-4`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}>
                        <FontAwesomeIcon icon={config.icon} className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`font-bold ${config.color}`}>{config.label}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Score: {result.score}/100
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {result.summary}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Botão Chat */}
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className={`p-2 rounded-lg transition-colors ${showChat
                            ? 'bg-purple-500/20 text-purple-500'
                            : 'hover:bg-white/10 text-gray-500'}`}
                        title="Perguntas sobre a validação"
                    >
                        <FontAwesomeIcon icon={faComments} className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <FontAwesomeIcon
                            icon={expanded ? faChevronUp : faChevronDown}
                            className="w-4 h-4 text-gray-500"
                        />
                    </button>
                </div>
            </div>

            {/* Score bar */}
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <div
                    className={`h-full transition-all duration-500 ${result.score >= 80 ? 'bg-emerald-500' :
                        result.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                    style={{ width: `${result.score}%` }}
                />
            </div>

            {/* Stats resumidos */}
            <div className="flex gap-4 text-sm">
                <span className="text-emerald-600 dark:text-emerald-400">
                    ✓ {result.verifiedClaims.filter(c => c.verified).length} claims verificados
                </span>
                <span className="text-amber-600 dark:text-amber-400">
                    ? {result.unverifiedClaims.length} não verificados
                </span>
                <span className="text-blue-600 dark:text-blue-400">
                    📚 {result.additionalSources.length} fontes encontradas
                </span>
            </div>

            {/* Área de Chat */}
            {showChat && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <FontAwesomeIcon icon={faComments} className="w-4 h-4 text-purple-500" />
                        Perguntas sobre a Validação
                    </h4>

                    {/* Mensagens */}
                    <div className="max-h-64 overflow-y-auto space-y-3 mb-3 pr-2">
                        {chatMessages.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                Faça perguntas sobre a verificação dos fatos, claims não verificados, ou peça mais detalhes.
                            </p>
                        )}
                        {chatMessages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg text-sm ${msg.role === 'user'
                                        ? 'bg-purple-500/10 text-gray-900 dark:text-white ml-8'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 mr-8'
                                    }`}
                            >
                                <span className="font-semibold text-xs block mb-1 opacity-60">
                                    {msg.role === 'user' ? 'Você' : '🤖 Assistente'}
                                </span>
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 p-3">
                                <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4" />
                                Pensando...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                            placeholder="Ex: Por que esse claim não foi verificado?"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            disabled={chatLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim() || chatLoading}
                            className="px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold text-sm disabled:opacity-50 hover:bg-purple-600 transition-colors flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}

            {/* Conteúdo expandido */}
            {expanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-4">
                    {/* Claims Verificados */}
                    {result.verifiedClaims.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Claims Verificados
                            </h4>
                            <div className="space-y-2">
                                {result.verifiedClaims.map((claim, idx) => (
                                    <ClaimItem key={idx} claim={claim} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Claims Não Verificados */}
                    {result.unverifiedClaims.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">
                                ⚠️ Claims Não Verificados
                            </h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                {result.unverifiedClaims.map((claim, idx) => (
                                    <li key={idx}>{claim}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Fontes Adicionais */}
                    {result.additionalSources.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                📚 Fontes Encontradas
                            </h4>
                            <div className="space-y-1">
                                {result.additionalSources.slice(0, 5).map((source, idx) => (
                                    <SourceItem key={idx} source={source} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sugestões */}
                    {result.suggestions.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                                <FontAwesomeIcon icon={faLightbulb} className="w-4 h-4" />
                                Sugestões de Melhoria
                            </h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                {result.suggestions.map((suggestion, idx) => (
                                    <li key={idx}>{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Dismiss button */}
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="mt-3 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    Limpar resultado
                </button>
            )}
        </div>
    );
}

// Sub-componente para cada claim
function ClaimItem({ claim }: { claim: VerifiedClaim }) {
    const [showSources, setShowSources] = useState(false);

    return (
        <div className={`p-3 rounded-lg ${claim.verified ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                    <FontAwesomeIcon
                        icon={claim.verified ? faCheckCircle : faTimesCircle}
                        className={`w-4 h-4 mt-0.5 ${claim.verified ? 'text-emerald-500' : 'text-red-500'}`}
                    />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{claim.claim}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {claim.confidence}% confiança
                </span>
            </div>

            {claim.sources.length > 0 && (
                <button
                    onClick={() => setShowSources(!showSources)}
                    className="mt-2 text-xs text-blue-500 hover:underline"
                >
                    {showSources ? 'Ocultar' : 'Ver'} {claim.sources.length} fonte(s)
                </button>
            )}

            {showSources && claim.sources.length > 0 && (
                <div className="mt-2 space-y-1">
                    {claim.sources.map((source, idx) => (
                        <SourceItem key={idx} source={source} compact />
                    ))}
                </div>
            )}
        </div>
    );
}

// Sub-componente para cada fonte
function SourceItem({ source, compact }: { source: Source; compact?: boolean }) {
    return (
        <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 group ${compact ? 'text-xs' : 'text-sm'} text-blue-600 dark:text-blue-400 hover:underline`}
        >
            <FontAwesomeIcon icon={faExternalLink} className="w-3 h-3 opacity-50 group-hover:opacity-100" />
            <span className="truncate">{source.title || source.url}</span>
        </a>
    );
}
