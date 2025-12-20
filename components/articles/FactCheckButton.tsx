/**
 * FactCheckButton Component
 * 
 * Botão público para verificar veracidade de artigos
 * Exibe resultado em tooltip/balão com contador de verificações
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
    faUsers
} from '@fortawesome/free-solid-svg-icons';

interface FactCheckButtonProps {
    articleId: string;
    className?: string;
}

interface FactCheckResult {
    score: number;
    status: 'verified' | 'partially_verified' | 'unverified' | 'error';
    summary: string;
    totalChecks: number;
    verifiedClaims?: { claim: string; verified: boolean }[];
    unverifiedClaims?: string[];
}

export default function FactCheckButton({ articleId, className = '' }: FactCheckButtonProps) {
    const { isSignedIn, isLoaded } = useUser();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<FactCheckResult | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialStatus, setInitialStatus] = useState<{
        score: number | null;
        totalChecks: number;
        userHasChecked: boolean;
    } | null>(null);

    // Carregar status inicial
    useEffect(() => {
        async function loadStatus() {
            try {
                const res = await fetch(`/api/public-fact-check?articleId=${articleId}`);
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
    }, [articleId]);

    const handleCheck = async () => {
        if (!isSignedIn) {
            setError('Faça login para verificar');
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/public-fact-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleId })
            });

            const data = await res.json();

            if (data.success) {
                setResult(data.data);
                setShowTooltip(true);
                // Atualizar status inicial
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

    // Determinar cor baseada no score
    const getScoreColor = (score: number | null) => {
        if (score === null) return 'text-gray-500';
        if (score >= 80) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
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

    const displayScore = result?.score ?? initialStatus?.score;
    const displayChecks = result?.totalChecks ?? initialStatus?.totalChecks ?? 0;
    const hasBeenChecked = displayScore !== null && displayScore !== undefined;

    return (
        <div className={`relative inline-block ${className}`}>
            {/* Botão Principal */}
            <button
                onClick={handleCheck}
                disabled={loading || (initialStatus?.userHasChecked && !result)}
                onMouseEnter={() => result && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
          transition-all duration-200 border
          ${hasBeenChecked
                        ? `${getScoreColor(displayScore)} border-current/30 bg-current/10`
                        : 'text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-purple-500/50 hover:text-purple-500'
                    }
          ${loading ? 'opacity-50 cursor-wait' : ''}
          ${initialStatus?.userHasChecked && !result ? 'cursor-default' : 'cursor-pointer hover:scale-105'}
        `}
                title={initialStatus?.userHasChecked ? 'Você já verificou este artigo' : 'Verificar veracidade do artigo'}
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

                {/* Contador de verificações */}
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

            {/* Tooltip de Resultado */}
            {showTooltip && result && (
                <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 rounded-xl shadow-xl border z-50 animate-fade-in"
                    style={{
                        backgroundColor: 'var(--bg-modal)',
                        borderColor: 'var(--border-modal)'
                    }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                        <FontAwesomeIcon
                            icon={getStatusIcon(result.status)}
                            className={`w-5 h-5 ${getScoreColor(result.score)}`}
                        />
                        <div>
                            <p className={`font-bold ${getScoreColor(result.score)}`}>
                                {getStatusLabel(result.status)}
                            </p>
                            <p className="text-xs text-gray-500">Score: {result.score}/100</p>
                        </div>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {result.summary}
                    </p>

                    {/* Claims verificados */}
                    {result.verifiedClaims && result.verifiedClaims.length > 0 && (
                        <div className="mb-2">
                            <p className="text-xs font-semibold text-emerald-500 mb-1">✓ Verificados:</p>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                {result.verifiedClaims.slice(0, 2).map((c, i) => (
                                    <li key={i} className="truncate">• {c.claim}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Claims não verificados */}
                    {result.unverifiedClaims && result.unverifiedClaims.length > 0 && (
                        <div className="mb-2">
                            <p className="text-xs font-semibold text-amber-500 mb-1">⚠ Não verificados:</p>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                {result.unverifiedClaims.slice(0, 2).map((c, i) => (
                                    <li key={i} className="truncate">• {c}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200 dark:border-white/10">
                        <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faUsers} className="w-3 h-3" />
                            {result.totalChecks} verificações
                        </span>
                        <span>Powered by Gemini 3</span>
                    </div>

                    {/* Seta do tooltip */}
                    <div
                        className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent"
                        style={{ borderTopColor: 'var(--bg-modal)' }}
                    />
                </div>
            )}
        </div>
    );
}
