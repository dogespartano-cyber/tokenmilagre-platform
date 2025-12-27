/**
 * CommentsSection Component
 * 
 * Seção de comentários estilo Reddit
 * Com respostas aninhadas (1 nível)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faReply,
  faSpinner,
  faPaperPlane,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  image?: string | null;
}

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  replies: Reply[];
}

interface CommentsSectionProps {
  id: string;
  type: 'article' | 'resource';
  isOpen?: boolean;
}

export default function CommentsSection({ id, type, isOpen = false }: CommentsSectionProps) {
  const { isSignedIn, user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const idParam = type === 'article' ? 'articleId' : 'resourceId';

  // Carregar comentários
  useEffect(() => {
    if (!isOpen) return;

    async function loadComments() {
      try {
        setLoading(true);
        const res = await fetch(`/api/comments?${idParam}=${id}`);
        const data = await res.json();

        if (data.success) {
          setComments(data.comments);
        }
      } catch (e) {
        console.error('Erro ao carregar comentários:', e);
      } finally {
        setLoading(false);
      }
    }
    loadComments();

    // Scroll para a seção de comentários quando abrir
    setTimeout(() => {
      const section = document.getElementById('comments-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [id, idParam, isOpen]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      setError('Faça login para comentar');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          [idParam]: id
        })
      });

      const data = await res.json();

      if (data.success) {
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
      } else {
        setError(data.error || 'Erro ao comentar');
        setTimeout(() => setError(null), 3000);
      }
    } catch (e) {
      setError('Erro de conexão');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!isSignedIn || !replyContent.trim()) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          [idParam]: id,
          parentId
        })
      });

      const data = await res.json();

      if (data.success) {
        // Adicionar reply ao comentário pai
        setComments(prev => prev.map(c => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...c.replies, data.comment]
            };
          }
          return c;
        }));
        setReplyContent('');
        setReplyingTo(null);
        // Expandir replies do comentário
        setExpandedReplies(prev => new Set(prev).add(parentId));
      } else {
        setError(data.error || 'Erro ao responder');
        setTimeout(() => setError(null), 3000);
      }
    } catch (e) {
      setError('Erro de conexão');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  if (!isOpen) return null;

  return (
    <div id="comments-section" className="border-t border-gray-200 dark:border-white/10 pt-6 mt-8 scroll-mt-24">
<h3 className="title-newtab text-lg mb-6">
        Comentários
      </h3>

      {/* Novo comentário */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Seu avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                👤
              </div>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isSignedIn ? "Adicione um comentário..." : "Faça login para comentar"}
              disabled={!isSignedIn || submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-[var(--text-primary)] placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 disabled:opacity-50"
              rows={3}
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {newComment.length}/2000
              </span>
              <button
                type="submit"
                disabled={!isSignedIn || !newComment.trim() || submitting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white font-medium text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {submitting ? (
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                )}
                Comentar
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <FontAwesomeIcon icon={faSpinner} className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* Lista de comentários */}
      {!loading && comments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Seja o primeiro a comentar!
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="group">
            {/* Comentário principal */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                {comment.user.image ? (
                  <Image
                    src={comment.user.image}
                    alt={comment.user.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[var(--text-primary)] text-sm">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    · {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => {
                      if (!isSignedIn) {
                        setError('Faça login para responder');
                        setTimeout(() => setError(null), 3000);
                        return;
                      }
                      setReplyingTo(replyingTo === comment.id ? null : comment.id);
                      setReplyContent('');
                    }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-[var(--brand-primary)] transition-colors"
                  >
                    <FontAwesomeIcon icon={faReply} className="w-3 h-3" />
                    Responder
                  </button>
                  {comment.replies.length > 0 && (
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-[var(--brand-primary)] transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={expandedReplies.has(comment.id) ? faChevronUp : faChevronDown}
                        className="w-3 h-3"
                      />
                      {comment.replies.length} {comment.replies.length === 1 ? 'resposta' : 'respostas'}
                    </button>
                  )}
                </div>

                {/* Reply form */}
                {replyingTo === comment.id && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Escreva uma resposta..."
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50"
                      maxLength={1000}
                    />
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim() || submitting}
                      className="px-3 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-sm disabled:opacity-50"
                    >
                      {submitting ? (
                        <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                      ) : (
                        <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}

                {/* Replies */}
                {expandedReplies.has(comment.id) && comment.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-white/10 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                          {reply.user.image ? (
                            <Image
                              src={reply.user.image}
                              alt={reply.user.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              {reply.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[var(--text-primary)] text-sm">
                              {reply.user.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              · {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
