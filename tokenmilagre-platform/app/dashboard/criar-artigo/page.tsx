'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';
import Link from 'next/link';
import { usePerplexityChat, type ProcessedArticle } from './_hooks/usePerplexityChat';
import { useArticleState } from './_hooks/useArticleState';
import ArticleTypeSelector from './_components/ArticleTypeSelector';
import ChatInterface from './_components/ChatInterface';
import ArticlePreviewPanel from './_components/ArticlePreviewPanel';
import RefinementInput from './_components/RefinementInput';
import {
  type ArticleType,
  MESSAGES,
  API_ENDPOINTS,
  ANIMATION_DELAYS,
  getArticleRoute,
  getApiEndpoint,
  normalizeCategoryWithFallback
} from './_lib/constants';
import { validateArticle } from './_lib/validation';

const isDev = process.env.NODE_ENV === 'development';

// Helper para extrair mensagem de erro de forma type-safe
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export default function CriarArtigoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const refineSectionRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState<ArticleType | null>(null);

  // Usar hook de estado do artigo (useReducer)
  const {
    generatedArticle,
    refinePrompt,
    refining,
    copiedProcessed,
    generatingCover,
    setGeneratedArticle,
    setRefinePrompt,
    startRefining,
    stopRefining,
    setCopied,
    resetCopied,
    startGeneratingCover,
    stopGeneratingCover
  } = useArticleState();

  // Usar hook do Perplexity Chat
  const { conversation, loading, processing, sendMessage, addMessage } = usePerplexityChat({
    selectedType,
    onArticleGenerated: (article) => {
      setGeneratedArticle(article);
    },
    onError: (error) => {
      console.error('Erro no chat:', error);
    }
  });

  // Garantir que a página sempre inicie no topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // DEBUG: Monitorar mudanças na coverImage (apenas em desenvolvimento)
  useEffect(() => {
    if (isDev && generatedArticle?.coverImage) {
      console.log('🖼️ [DEBUG RENDER] generatedArticle.coverImage mudou:', {
        valor: generatedArticle.coverImage.substring(0, 100),
        tipo: typeof generatedArticle.coverImage,
        isArray: Array.isArray(generatedArticle.coverImage),
        isUrl: generatedArticle.coverImage.startsWith('/images/'),
        isBase64: generatedArticle.coverImage.startsWith('data:')
      });
    }
  }, [generatedArticle?.coverImage]);

  // Handlers
  const handleSendMessage = async () => {
    if (!prompt.trim()) return;
    const userMessage = prompt.trim();
    setPrompt('');
    await sendMessage(userMessage);
  };

  const handleProcessWithGemini = async () => {
    if (!generatedArticle) return;

    try {
      addMessage({
        role: 'assistant',
        content: MESSAGES.article.processing
      });

      const geminiResponse = await fetch(API_ENDPOINTS.processGemini, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article: generatedArticle,
          articleType: selectedType
        })
      });

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        throw new Error(errorData.error || MESSAGES.errors.gemini);
      }

      const { article: refinedArticle } = await geminiResponse.json();

      setGeneratedArticle({
        ...refinedArticle,
        coverImage: generatedArticle.coverImage || refinedArticle.coverImage,
        coverImageAlt: generatedArticle.coverImageAlt || refinedArticle.coverImageAlt,
        type: selectedType
      });

      addMessage({
        role: 'assistant',
        content: MESSAGES.article.refined
      });

    } catch (error: unknown) {
      console.error('Erro ao processar com Gemini:', error);
      addMessage({
        role: 'assistant',
        content: MESSAGES.errors.refine(getErrorMessage(error))
      });
    }
  };

  const handleCopyArticle = async () => {
    if (!generatedArticle) return;

    try {
      let textToCopy;
      if (selectedType === 'resource') {
        textToCopy = JSON.stringify(generatedArticle, null, 2);
      } else {
        textToCopy = `# ${generatedArticle.title || generatedArticle.name}\n\n${generatedArticle.excerpt || generatedArticle.description || generatedArticle.shortDescription || ''}\n\n${generatedArticle.content || ''}`;
      }
      await navigator.clipboard.writeText(textToCopy);
      setCopied();
      setTimeout(() => resetCopied(), ANIMATION_DELAYS.copiedFeedback);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const handleRefine = async () => {
    if (!refinePrompt.trim() || !generatedArticle) return;

    const refinementRequest = refinePrompt.trim();
    setRefinePrompt('');
    startRefining();

    try {
      const response = await fetch(API_ENDPOINTS.refineArticle, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article: generatedArticle,
          refinementPrompt: refinementRequest,
          articleType: selectedType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao refinar artigo');
      }

      const { article: refinedArticle } = await response.json();

      setGeneratedArticle({
        ...refinedArticle,
        type: selectedType
      });

      addMessage({ role: 'user', content: `🎨 Refinar: ${refinementRequest}` });
      addMessage({ role: 'assistant', content: MESSAGES.article.refinedManual });

    } catch (error: unknown) {
      console.error('Erro ao refinar:', error);
      addMessage({
        role: 'assistant',
        content: MESSAGES.errors.refine(getErrorMessage(error))
      });
    } finally {
      stopRefining();
    }
  };

  const handleGenerateCover = async () => {
    if (!generatedArticle || !selectedType) return;
    startGeneratingCover();

    try {
      const response = await fetch(API_ENDPOINTS.regenerateCover, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article: generatedArticle,
          articleType: selectedType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar capa');
      }

      const { article } = await response.json();
      setGeneratedArticle({ ...article, type: selectedType });
      addMessage({
        role: 'assistant',
        content: MESSAGES.article.coverGenerated
      });
    } catch (error: unknown) {
      console.error('Erro ao gerar capa:', error);
      addMessage({
        role: 'assistant',
        content: MESSAGES.errors.cover(getErrorMessage(error))
      });
    } finally {
      stopGeneratingCover();
    }
  };

  const handlePublish = async () => {
    if (!generatedArticle || !session?.user?.id || !selectedType) return;

    // STEP 1: Normalizar categoria com fallback (P0 - Blindar contra erros da IA)
    let articleToValidate = { ...generatedArticle };

    // Aplicar fallback de categoria para TODOS os tipos (News, Educational, Resource)
    const { category: normalizedCategory, hadFallback } = normalizeCategoryWithFallback(
      generatedArticle.category,
      selectedType
    );

    articleToValidate.category = normalizedCategory;

    // LOG: Informar se houve fallback
    if (hadFallback) {
      const typeLabels = {
        news: 'Notícia',
        educational: 'Educacional',
        resource: 'Recurso'
      };

      console.warn('⚠️ [FALLBACK] Categoria da IA normalizada:', {
        original: generatedArticle.category || 'undefined',
        normalizada: normalizedCategory,
        tipo: selectedType
      });

      addMessage({
        role: 'assistant',
        content: `ℹ️ A categoria "${generatedArticle.category || 'não especificada'}" foi ajustada para "${normalizedCategory}" (categoria válida para ${typeLabels[selectedType]}).`
      });
    }

    // DEBUG: Log do artigo antes da validação
    if (isDev) {
      console.log('🔍 [DEBUG] Validando artigo:', {
        type: selectedType,
        category: articleToValidate.category,
        name: articleToValidate.name || articleToValidate.title,
        fields: Object.keys(articleToValidate)
      });
    }

    // STEP 2: Validar antes de publicar
    const validation = validateArticle(articleToValidate, selectedType);
    if (!validation.success) {
      console.error('❌ Erros de validação:', validation.errors);
      alert(`❌ Erros de validação:\n\n${validation.errors.join('\n')}`);
      addMessage({
        role: 'assistant',
        content: MESSAGES.article.validationWarning(validation.errors)
      });
      return;
    }

    // STEP 3: Atualizar o artigo com a versão normalizada
    if (articleToValidate.category !== generatedArticle.category) {
      setGeneratedArticle(articleToValidate);
    }

    try {
      const apiEndpoint = getApiEndpoint(selectedType);

      // Tags: convert to array if string (remove JSON.stringify)
      const tagsToSend = typeof articleToValidate.tags === 'string'
        ? [articleToValidate.tags]
        : (articleToValidate.tags || []);

      // Citations: transform URL strings to citation objects
      const citationsToSend = articleToValidate.citations && articleToValidate.citations.length > 0
        ? articleToValidate.citations.map((url: string, index: number) => ({
            url,
            title: url, // Use URL as title placeholder
            order: index,
            verified: false
          }))
        : undefined;

      // FactCheckSources: keep as URL string array (no JSON.stringify)
      const factCheckSourcesToSend = articleToValidate.citations && articleToValidate.citations.length > 0
        ? articleToValidate.citations
        : undefined;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...articleToValidate,
          published: selectedType !== 'resource' ? true : undefined,
          authorId: selectedType !== 'resource' ? session.user.id : undefined,
          tags: tagsToSend,
          citations: selectedType !== 'resource' ? citationsToSend : undefined,
          factCheckSources: selectedType !== 'resource' ? factCheckSourcesToSend : undefined
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao publicar');
      }

      const url = getArticleRoute(selectedType, generatedArticle.slug);
      router.push(url);

    } catch (error: unknown) {
      alert(MESSAGES.errors.publish(getErrorMessage(error)));
    }
  };

  return (
    <AdminRoute allowEditor={true}>
      <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
        <div className="container mx-auto px-4 py-8 max-w-[1600px]">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Voltar ao Dashboard
            </Link>

            <h1
              className="text-4xl font-bold font-[family-name:var(--font-poppins)] mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Criar Artigo com IA
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Converse livremente com a IA para criar artigos completos
            </p>
          </div>

          <div className="space-y-6">
            {/* Chat Interface */}
            <ChatInterface
              conversation={conversation}
              loading={loading}
              processing={processing}
              prompt={prompt}
              selectedType={selectedType}
              onPromptChange={setPrompt}
              onSendMessage={handleSendMessage}
            />

            {/* Article Type Selector */}
            <ArticleTypeSelector
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />

            {/* Article Preview Panel */}
            {generatedArticle && (
              <ArticlePreviewPanel
                article={generatedArticle}
                articleType={selectedType!}
                copiedProcessed={copiedProcessed}
                generatingCover={generatingCover}
                processing={processing}
                refineSectionRef={refineSectionRef}
                onProcessWithGemini={handleProcessWithGemini}
                onCopyArticle={handleCopyArticle}
                onGenerateCover={handleGenerateCover}
                onPublish={handlePublish}
              />
            )}

            {/* Refinement Input */}
            {generatedArticle && (
              <RefinementInput
                value={refinePrompt}
                onChange={setRefinePrompt}
                onRefine={handleRefine}
                refining={refining}
                refineSectionRef={refineSectionRef}
              />
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
