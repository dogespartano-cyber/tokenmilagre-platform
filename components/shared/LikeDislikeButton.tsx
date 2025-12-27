/**
 * LikeDislikeButton Component
 * 
 * Botões de like/dislike estilo YouTube
 * Substitui o VerifyButton (que usava Gemini - custoso)
 */

'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

interface LikeDislikeButtonProps {
    id: string;
    type: 'article' | 'resource' | 'curiosity';
    className?: string;
    initialLikeCount?: number;
    initialDislikeCount?: number;
}

type Reaction = 'like' | 'dislike' | null;

export default function LikeDislikeButton({
    id,
    type,
    className = '',
    initialLikeCount = 0,
    initialDislikeCount = 0
}: LikeDislikeButtonProps) {
    const { isSignedIn } = useUser();
    const [loading, setLoading] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
    const [userReaction, setUserReaction] = useState<Reaction>(null);
    const [error, setError] = useState<string | null>(null);

    // Carregar estado inicial
    useEffect(() => {
        async function loadState() {
            try {
                const res = await fetch(`/api/reactions?type=${type}&id=${id}`);
                const data = await res.json();
                if (data.success) {
                    setLikeCount(data.data.likeCount);
                    setDislikeCount(data.data.dislikeCount);
                    setUserReaction(data.data.userReaction);
                }
            } catch (e) {
                console.error('Erro ao carregar reações:', e);
            }
        }
        loadState();
    }, [id, type]);

    const handleReaction = async (reaction: 'like' | 'dislike') => {
        if (!isSignedIn) {
            setError('Faça login para reagir');
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (loading) return;

        // Determinar nova reação
        const newReaction: 'like' | 'dislike' | 'none' =
            userReaction === reaction ? 'none' : reaction;

        setLoading(true);

        try {
            const res = await fetch('/api/reactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, id, reaction: newReaction })
            });

            const data = await res.json();

            if (data.success) {
                setLikeCount(data.data.likeCount);
                setDislikeCount(data.data.dislikeCount);
                setUserReaction(data.data.userReaction);
            } else {
                setError(data.error || 'Erro ao processar');
                setTimeout(() => setError(null), 3000);
            }
        } catch (e) {
            setError('Erro de conexão');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const formatCount = (count: number): string => {
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
        return count.toString();
    };

    return (
        <div className={`relative inline-flex items-center ${className}`}>
            {/* Container dos botões com borda arredondada */}
            <div
                className="flex items-center rounded-full overflow-hidden border transition-colors"
                style={{
                    borderColor: 'var(--border-article, rgba(0,0,0,0.1))',
                    backgroundColor: 'var(--bg-secondary, rgba(0,0,0,0.05))'
                }}
            >
                {/* Botão Like */}
                <button
                    onClick={() => handleReaction('like')}
                    disabled={loading}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                        transition-all duration-200
                        ${userReaction === 'like'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                        }
                        ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                    `}
                    title="Gostei"
                    aria-label={`Like - ${likeCount} curtidas`}
                >
                    <FontAwesomeIcon
                        icon={faThumbsUp}
                        className={`w-4 h-4 ${userReaction !== 'like' ? 'opacity-60' : ''}`}
                    />
                    {likeCount > 0 && (
                        <span>{formatCount(likeCount)}</span>
                    )}
                </button>

                {/* Divisor */}
                <div
                    className="w-px h-5"
                    style={{ backgroundColor: 'var(--border-article, rgba(0,0,0,0.1))' }}
                />

                {/* Botão Dislike */}
                <button
                    onClick={() => handleReaction('dislike')}
                    disabled={loading}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                        transition-all duration-200
                        ${userReaction === 'dislike'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                        }
                        ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                    `}
                    title="Não gostei"
                    aria-label={`Dislike - ${dislikeCount} não gostaram`}
                >
                    <FontAwesomeIcon
                        icon={faThumbsDown}
                        className={`w-4 h-4 ${userReaction !== 'dislike' ? 'opacity-60' : ''}`}
                    />
                    {dislikeCount > 0 && (
                        <span>{formatCount(dislikeCount)}</span>
                    )}
                </button>
            </div>

            {/* Tooltip de Erro */}
            {error && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs whitespace-nowrap z-50 animate-fade-in">
                    {error}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-500" />
                </div>
            )}
        </div>
    );
}
