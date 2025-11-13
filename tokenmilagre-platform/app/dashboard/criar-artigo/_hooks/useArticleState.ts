/**
 * useArticleState Hook
 * Gerencia estados relacionados ao artigo usando useReducer
 */

import { useReducer, useCallback } from 'react';
import type { ProcessedArticle } from './usePerplexityChat';

// ============================================================================
// Types
// ============================================================================

interface ArticleState {
  generatedArticle: ProcessedArticle | null;
  refinePrompt: string;
  refining: boolean;
  copiedProcessed: boolean;
  generatingCover: boolean;
}

type ArticleAction =
  | { type: 'SET_ARTICLE'; payload: ProcessedArticle }
  | { type: 'UPDATE_ARTICLE'; payload: Partial<ProcessedArticle> }
  | { type: 'SET_REFINE_PROMPT'; payload: string }
  | { type: 'START_REFINING' }
  | { type: 'STOP_REFINING' }
  | { type: 'SET_COPIED' }
  | { type: 'RESET_COPIED' }
  | { type: 'START_GENERATING_COVER' }
  | { type: 'STOP_GENERATING_COVER' }
  | { type: 'CLEAR' };

export interface UseArticleStateReturn {
  // Estado
  generatedArticle: ProcessedArticle | null;
  refinePrompt: string;
  refining: boolean;
  copiedProcessed: boolean;
  generatingCover: boolean;

  // Actions
  setGeneratedArticle: (article: ProcessedArticle) => void;
  updateArticle: (updates: Partial<ProcessedArticle>) => void;
  setRefinePrompt: (prompt: string) => void;
  startRefining: () => void;
  stopRefining: () => void;
  setCopied: () => void;
  resetCopied: () => void;
  startGeneratingCover: () => void;
  stopGeneratingCover: () => void;
  clearArticleState: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: ArticleState = {
  generatedArticle: null,
  refinePrompt: '',
  refining: false,
  copiedProcessed: false,
  generatingCover: false
};

// ============================================================================
// Reducer
// ============================================================================

function articleReducer(state: ArticleState, action: ArticleAction): ArticleState {
  switch (action.type) {
    case 'SET_ARTICLE':
      return {
        ...state,
        generatedArticle: action.payload
      };

    case 'UPDATE_ARTICLE':
      if (!state.generatedArticle) return state;
      return {
        ...state,
        generatedArticle: {
          ...state.generatedArticle,
          ...action.payload
        }
      };

    case 'SET_REFINE_PROMPT':
      return {
        ...state,
        refinePrompt: action.payload
      };

    case 'START_REFINING':
      return {
        ...state,
        refining: true
      };

    case 'STOP_REFINING':
      return {
        ...state,
        refining: false
      };

    case 'SET_COPIED':
      return {
        ...state,
        copiedProcessed: true
      };

    case 'RESET_COPIED':
      return {
        ...state,
        copiedProcessed: false
      };

    case 'START_GENERATING_COVER':
      return {
        ...state,
        generatingCover: true
      };

    case 'STOP_GENERATING_COVER':
      return {
        ...state,
        generatingCover: false
      };

    case 'CLEAR':
      return initialState;

    default:
      return state;
  }
}

// ============================================================================
// Hook
// ============================================================================

export function useArticleState(): UseArticleStateReturn {
  const [state, dispatch] = useReducer(articleReducer, initialState);

  // Memoized action creators
  const setGeneratedArticle = useCallback((article: ProcessedArticle) => {
    dispatch({ type: 'SET_ARTICLE', payload: article });
  }, []);

  const updateArticle = useCallback((updates: Partial<ProcessedArticle>) => {
    dispatch({ type: 'UPDATE_ARTICLE', payload: updates });
  }, []);

  const setRefinePrompt = useCallback((prompt: string) => {
    dispatch({ type: 'SET_REFINE_PROMPT', payload: prompt });
  }, []);

  const startRefining = useCallback(() => {
    dispatch({ type: 'START_REFINING' });
  }, []);

  const stopRefining = useCallback(() => {
    dispatch({ type: 'STOP_REFINING' });
  }, []);

  const setCopied = useCallback(() => {
    dispatch({ type: 'SET_COPIED' });
  }, []);

  const resetCopied = useCallback(() => {
    dispatch({ type: 'RESET_COPIED' });
  }, []);

  const startGeneratingCover = useCallback(() => {
    dispatch({ type: 'START_GENERATING_COVER' });
  }, []);

  const stopGeneratingCover = useCallback(() => {
    dispatch({ type: 'STOP_GENERATING_COVER' });
  }, []);

  const clearArticleState = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return {
    // Estado
    generatedArticle: state.generatedArticle,
    refinePrompt: state.refinePrompt,
    refining: state.refining,
    copiedProcessed: state.copiedProcessed,
    generatingCover: state.generatingCover,

    // Actions
    setGeneratedArticle,
    updateArticle,
    setRefinePrompt,
    startRefining,
    stopRefining,
    setCopied,
    resetCopied,
    startGeneratingCover,
    stopGeneratingCover,
    clearArticleState
  };
}
