/**
 * EngagementBar Component
 * 
 * Barra de engajamento estilo Reddit
 * Exibe botão de like (❤️) e contador de comentários
 */

'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart as faHeartSolid,
    faComment,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';

interface EngagementBarProps {
    id: string;
    type: 'article' | 'resource';
    onCommentClick?: () => void;
    className?: string;
}

export default function EngagementBar({ id, type, onCommentClick, className = '' }: EngagementBarProps) {
    const { isSignedIn } = useUser();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const idParam = type === 'article' ? 'articleId' : 'resourceId';

    // Carregar status inicial
    useEffect(() => {
        async function loadStatus() {
            try {
                const [likesRes, commentsRes] = await Promise.all([
                    fetch(`/api/likes?${idParam}=${id}`),
                    fetch(`/api/comments?${idParam}=${id}`)
                ]);

                const likesData = await likesRes.json();
                const commentsData = await commentsRes.json();

                if (likesData.success) {
                    setLiked(likesData.liked);
                    setLikeCount(likesData.likeCount);
                }

                if (commentsData.success) {
                    setCommentCount(commentsData.commentCount);
                }
            } catch (e) {
                console.error('Erro ao carregar engagement:', e);
            }
        }
        loadStatus();
    }, [id, idParam]);

    const handleLike = async () => {
        if (!isSignedIn) {
            setError('Faça login para curtir');
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (loading) return;

        setLoading(true);

        // Optimistic update
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);

        try {
            const res = await fetch('/api/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [idParam]: id })
            });

            const data = await res.json();

            if (data.success) {
                setLiked(data.liked);
                setLikeCount(data.likeCount);
            } else {
                // Reverter optimistic update
                setLiked(liked);
                setLikeCount(prev => liked ? prev + 1 : prev - 1);
                setError(data.error || 'Erro');
                setTimeout(() => setError(null), 3000);
            }
        } catch (e) {
            // Reverter optimistic update
            setLiked(liked);
            setLikeCount(prev => liked ? prev + 1 : prev - 1);
            setError('Erro de conexão');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const formatCount = (count: number): string => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)} mi`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)} mil`;
        }
        return count.toString();
    };

    return (
        <div className={`relative ${className}`}>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/10 rounded-full p-1">
                {/* Like Button */}
                <button
                    onClick={handleLike}
                    disabled={loading}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                        transition-all duration-200
                        ${liked
                            ? 'text-red-500 bg-red-50 dark:bg-red-500/20'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                        }
                        ${loading ? 'opacity-50' : ''}
                    `}
                    title={isSignedIn ? (liked ? 'Remover curtida' : 'Curtir') : 'Faça login para curtir'}
                >
                    <FontAwesomeIcon
                        icon={loading ? faSpinner : faHeartSolid}
                        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                    />
                    <span>{formatCount(likeCount)}</span>
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-300 dark:bg-white/20" />

                {/* Comment Button */}
                <button
                    onClick={onCommentClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200"
                    title="Ver comentários"
                >
                    <FontAwesomeIcon icon={faComment} className="w-4 h-4" />
                    <span>{formatCount(commentCount)}</span>
                </button>
            </div>

            {/* Error Tooltip */}
            {error && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs whitespace-nowrap z-50">
                    {error}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-500" />
                </div>
            )}
        </div>
    );
}
