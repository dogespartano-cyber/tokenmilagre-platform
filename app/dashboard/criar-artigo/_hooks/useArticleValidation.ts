/**
 * useArticleValidation Hook
 * 
 * Gerencia validação de artigos com Gemini 3 Flash + Google Search Grounding
 */

import { useState, useCallback } from 'react';
import type { FactCheckResult } from '@/lib/shared/ai/gemini-validator';

export interface UseArticleValidationReturn {
    validating: boolean;
    validationResult: FactCheckResult | null;
    error: string | null;
    validateArticle: (article: ValidateArticleParams) => Promise<FactCheckResult | null>;
    clearValidation: () => void;
}

export interface ValidateArticleParams {
    title: string;
    content: string;
    excerpt?: string;
    citations?: string[];
    articleType: 'news' | 'educational' | 'resource';
}

export function useArticleValidation(): UseArticleValidationReturn {
    const [validating, setValidating] = useState(false);
    const [validationResult, setValidationResult] = useState<FactCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validateArticle = useCallback(async (article: ValidateArticleParams): Promise<FactCheckResult | null> => {
        setValidating(true);
        setError(null);

        try {
            const response = await fetch('/api/validate-article', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: article.title,
                    content: article.content,
                    excerpt: article.excerpt,
                    citations: article.citations,
                    articleType: article.articleType
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao validar artigo');
            }

            if (data.success && data.data) {
                setValidationResult(data.data);
                return data.data;
            } else {
                throw new Error(data.error || 'Resposta inválida da API');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Erro desconhecido ao validar';
            setError(errorMessage);
            console.error('[useArticleValidation] Erro:', err);
            return null;
        } finally {
            setValidating(false);
        }
    }, []);

    const clearValidation = useCallback(() => {
        setValidationResult(null);
        setError(null);
    }, []);

    return {
        validating,
        validationResult,
        error,
        validateArticle,
        clearValidation
    };
}
