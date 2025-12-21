/**
 * VerifyButton Component (Unificado)
 * 
 * Botão público para verificar veracidade de artigos e recursos
 * Usa endpoint correto baseado no type
 * Exibe modal/popup centralizado com todas as informações
 */

'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShieldAlt,
    faSpinner,
    faCheckCircle,
    faExclamationTriangle,
    faTimesCircle,
    faUsers,
    faTimes,
    faExternalLinkAlt,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

interface VerifyButtonProps {
    id: string;
    type: 'article' | 'resource';
    className?: string;
}

interface ClaimSource {
    url: string;
    title: string;
    snippet?: string;
}

interface DetailedClaim {
    text: string;
    status: 'verified' | 'refuted' | 'partial';
    confidence: number;
    sources: ClaimSource[];
}

interface VerificationLog {
    claims: DetailedClaim[];
    unverifiedClaims: string[];
    additionalSources: ClaimSource[];
    suggestions: string[];
    timestamp: string;
}

interface FactCheckResult {
    score: number;
    status: 'verified' | 'partially_verified' | 'unverified' | 'error';
    summary: string;
    totalChecks: number;
    verificationLog?: VerificationLog;
    // Legado (para compatibilidade)
    verifiedClaims?: { claim: string; verified: boolean; source?: string }[];
    unverifiedClaims?: string[];
    sources?: { name: string; url: string }[];
    suggestions?: string[];
}

type TabType = 'summary' | 'claims' | 'log';

export default function VerifyButton({ id, type, className = '' }: VerifyButtonProps) {
    const { isSignedIn } = useUser();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<FactCheckResult | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('summary');
    const [initialStatus, setInitialStatus] = useState<{
        score: number | null;
        totalChecks: number;
        userHasChecked: boolean;
    } | null>(null);

    // Endpoints baseados no tipo
    const endpoint = type === 'article' ? '/api/public-fact-check' : '/api/public-resource-check';
    const idParam = type === 'article' ? 'articleId' : 'resourceId';
    const itemLabel = type === 'article' ? 'artigo' : 'recurso';

    // Bloquear scroll do body quando modal está aberto
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModal]);

    // Carregar status inicial
    useEffect(() => {
        async function loadStatus() {
            try {
                const res = await fetch(`${endpoint}?${idParam}=${id}`);
                const data = await res.json();
                if (data.success) {
                    setInitialStatus({
                        score: data.data.score,
                        totalChecks: data.data.totalChecks || 0,
                        userHasChecked: data.data.userHasChecked || false
                    });
                }
            } catch (e) {
                console.error('Erro ao carregar status:', e);
            }
        }
        loadStatus();
    }, [id, endpoint, idParam]);

    const handleCheck = async () => {
        if (!isSignedIn) {
            setError('Faça login para verificar');
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (loading) return;

        // Se já tem resultado em memória, apenas mostrar o modal
        if (result) {
            setShowModal(true);
            return;
        }

        // Buscar resultado (novo ou existente)
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [idParam]: id })
            });

            const data = await res.json();

            if (data.success) {
                setResult(data.data);
                setShowModal(true);
                setInitialStatus(prev => ({
                    ...prev!,
                    score: data.data.score,
                    totalChecks: data.data.totalChecks,
                    userHasChecked: true
                }));
            } else {
                setError(data.error || 'Erro ao verificar');
                setTimeout(() => setError(null), 3000);
            }
        } catch (e) {
            setError('Erro de conexão');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number | null) => {
        if (score === null) return 'text-gray-500';
        if (score >= 80) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const getScoreBgColor = (score: number | null) => {
        if (score === null) return 'bg-gray-100 dark:bg-gray-800';
        if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-950/30';
        if (score >= 50) return 'bg-amber-50 dark:bg-amber-950/30';
        return 'bg-red-50 dark:bg-red-950/30';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified': return faCheckCircle;
            case 'partially_verified': return faExclamationTriangle;
            default: return faTimesCircle;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'verified': return 'Verificado';
            case 'partially_verified': return 'Parcialmente Verificado';
            case 'unverified': return 'Não Verificado';
            default: return 'Erro';
        }
    };

    const getStatusDescription = (status: string) => {
        switch (status) {
            case 'verified': return 'As informações foram confirmadas por múltiplas fontes confiáveis.';
            case 'partially_verified': return 'Algumas informações precisam de verificação adicional.';
            case 'unverified': return 'Não foi possível confirmar as principais alegações.';
            default: return 'Ocorreu um erro durante a verificação.';
        }
    };

    const displayScore = result?.score ?? initialStatus?.score;
    const displayChecks = result?.totalChecks ?? initialStatus?.totalChecks ?? 0;
    const hasBeenChecked = displayScore !== null && displayScore !== undefined;

    return (
        <>
            {/* Botão Principal */}
            <div className={`relative inline-block ${className}`}>
                <button
                    onClick={handleCheck}
                    disabled={loading}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                        transition-all duration-200 border
                        ${hasBeenChecked
                            ? `${getScoreColor(displayScore)} border-current/30 bg-current/10`
                            : 'text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-purple-500/50 hover:text-purple-500'
                        }
                        ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:scale-105'}
                    `}
                    title={hasBeenChecked ? `Ver detalhes da verificação` : `Verificar veracidade do ${itemLabel}`}
                >
                    <FontAwesomeIcon
                        icon={loading ? faSpinner : faShieldAlt}
                        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                    />

                    {hasBeenChecked ? (
                        <span>{displayScore}%</span>
                    ) : (
                        <span>Verificar</span>
                    )}

                    {displayChecks > 0 && (
                        <span className="flex items-center gap-1 text-xs opacity-70">
                            <FontAwesomeIcon icon={faUsers} className="w-3 h-3" />
                            {displayChecks}
                        </span>
                    )}
                </button>

                {/* Tooltip de Erro */}
                {error && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs whitespace-nowrap z-50 animate-fade-in">
                        {error}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-500" />
                    </div>
                )}
            </div>

            {/* Modal/Popup Centralizado */}
            {showModal && result && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Modal */}
                    <div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[450px] max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl border z-[101]"
                        style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--border-article)'
                        }}
                    >
                        {/* Header com Score */}
                        <div className={`p-6 rounded-t-2xl ${getScoreBgColor(result.score)}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Score Circle */}
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${getScoreColor(result.score)} border-current bg-white dark:bg-gray-900 shadow-lg`}>
                                        <span className="text-3xl font-bold">{result.score}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon
                                                icon={getStatusIcon(result.status)}
                                                className={`w-6 h-6 ${getScoreColor(result.score)}`}
                                            />
                                            <p className={`text-xl font-bold ${getScoreColor(result.score)}`}>
                                                {getStatusLabel(result.status)}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Score de Veracidade
                                        </p>
                                    </div>
                                </div>

                                {/* Botão Fechar */}
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Descrição do Status */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                                {getStatusDescription(result.status)}
                            </p>
                        </div>

                        {/* Abas */}
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            {[
                                { id: 'summary' as TabType, label: 'Resumo' },
                                { id: 'claims' as TabType, label: 'Claims' },
                                { id: 'log' as TabType, label: 'Log Técnico' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Conteúdo das Abas */}
                        <div className="p-6 space-y-6 max-h-[40vh] overflow-y-auto">

                            {/* === ABA RESUMO === */}
                            {activeTab === 'summary' && (
                                <>
                                    {/* Resumo da Análise */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faInfoCircle} className="w-3.5 h-3.5" />
                                            Resumo da Análise
                                        </h4>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {result.summary}
                                        </p>
                                    </div>

                                    {/* Sugestões de Melhoria */}
                                    {(result.verificationLog?.suggestions || result.suggestions)?.length! > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                                                💡 Sugestões
                                            </h4>
                                            <ul className="space-y-2">
                                                {(result.verificationLog?.suggestions || result.suggestions)?.map((suggestion, i) => (
                                                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                                                        {suggestion}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* === ABA CLAIMS === */}
                            {activeTab === 'claims' && (
                                <>
                                    {/* Claims do verificationLog */}
                                    {result.verificationLog?.claims && result.verificationLog.claims.length > 0 ? (
                                        <div className="space-y-4">
                                            {result.verificationLog.claims.map((claim, i) => (
                                                <div key={i} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                                    <div className="flex items-start gap-3">
                                                        <span className={`mt-1 ${claim.status === 'verified' ? 'text-emerald-500' :
                                                                claim.status === 'refuted' ? 'text-red-500' : 'text-amber-500'
                                                            }`}>
                                                            {claim.status === 'verified' ? '✓' : claim.status === 'refuted' ? '✗' : '⚠'}
                                                        </span>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                                {claim.text}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className={`text-xs px-2 py-0.5 rounded ${claim.status === 'verified' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                                                                        claim.status === 'refuted' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                                                                            'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                                                                    }`}>
                                                                    {claim.confidence}% confiança
                                                                </span>
                                                            </div>
                                                            {/* Fontes do claim */}
                                                            {claim.sources && claim.sources.length > 0 && (
                                                                <div className="mt-3 space-y-2">
                                                                    {claim.sources.map((source, j) => (
                                                                        <a
                                                                            key={j}
                                                                            href={source.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="block p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors"
                                                                        >
                                                                            <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
                                                                                <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
                                                                                {source.title || new URL(source.url).hostname}
                                                                            </div>
                                                                            {source.snippet && (
                                                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                                                    "{source.snippet}"
                                                                                </p>
                                                                            )}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* Fallback para formato legado */
                                        <>
                                            {result.verifiedClaims && result.verifiedClaims.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                                                        ✓ Verificados ({result.verifiedClaims.length})
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {result.verifiedClaims.map((claim, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                                <span className="text-emerald-500 mt-0.5">✓</span>
                                                                <span className="text-gray-700 dark:text-gray-300">{claim.claim}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {result.unverifiedClaims && result.unverifiedClaims.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
                                                        ⚠ Requer Atenção ({result.unverifiedClaims.length})
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {result.unverifiedClaims.map((claim, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                                <span className="text-amber-500 mt-0.5">⚠</span>
                                                                <span className="text-gray-700 dark:text-gray-300">{claim}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                            {/* === ABA LOG TÉCNICO === */}
                            {activeTab === 'log' && (
                                <>
                                    {result.verificationLog ? (
                                        <div className="space-y-4">
                                            {/* Timestamp */}
                                            <div className="text-xs text-gray-500">
                                                Verificado em: {new Date(result.verificationLog.timestamp).toLocaleString('pt-BR')}
                                            </div>

                                            {/* Fontes Adicionais */}
                                            {result.verificationLog.additionalSources.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                                        📚 Fontes Consultadas ({result.verificationLog.additionalSources.length})
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {result.verificationLog.additionalSources.map((source, i) => (
                                                            <a
                                                                key={i}
                                                                href={source.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors"
                                                            >
                                                                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                                                                    <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
                                                                    {source.title || source.url}
                                                                </div>
                                                                {source.snippet && (
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {source.snippet}
                                                                    </p>
                                                                )}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Claims não verificados */}
                                            {result.verificationLog.unverifiedClaims.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                                                        ⚠ Claims Sem Verificação
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {result.verificationLog.unverifiedClaims.map((claim, i) => (
                                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                                                                • {claim}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Log técnico não disponível para esta verificação.</p>
                                            <p className="text-xs mt-2">Verificações anteriores não incluem log detalhado.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5" />
                                {result.totalChecks} {result.totalChecks === 1 ? 'pessoa verificou' : 'pessoas verificaram'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                                Gemini 3 Flash
                            </span>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
