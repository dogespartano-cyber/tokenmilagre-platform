/**
 * CommentCountButton Component
 * 
 * Botão compacto que mostra a quantidade de comentários
 * Ao clicar, rola até a seção de comentários
 */

'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

interface CommentCountButtonProps {
    id: string;
    type: 'article' | 'resource' | 'curiosity';
    onClick?: () => void;
    className?: string;
}

export default function CommentCountButton({ id, type, onClick, className = '' }: CommentCountButtonProps) {
    const [commentCount, setCommentCount] = useState(0);

    const idParam = type === 'article' ? 'articleId' : 'resourceId';

    useEffect(() => {
        async function loadCount() {
            try {
                const res = await fetch(`/api/comments?${idParam}=${id}`);
                const data = await res.json();
                if (data.success) {
                    setCommentCount(data.commentCount);
                }
            } catch (e) {
                console.error('Erro ao carregar comentários:', e);
            }
        }
        loadCount();
    }, [id, idParam]);

    const formatCount = (count: number): string => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)} mi`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)} mil`;
        }
        return count.toString();
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            // Scroll para seção de comentários
            const commentsSection = document.getElementById('comments-section');
            if (commentsSection) {
                commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                transition-all duration-200 border cursor-pointer hover:scale-105
                text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 
                hover:border-blue-500/50 hover:text-blue-500
                ${className}
            `}
            title="Ver comentários"
        >
            <FontAwesomeIcon icon={faComment} className="w-4 h-4" />
            <span>{formatCount(commentCount)}</span>
        </button>
    );
}
