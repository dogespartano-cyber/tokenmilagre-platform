'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminRoute } from '@/lib/domains/users';

// Components from /criar-artigo for manual mode
import { usePerplexityChat } from '../criar-artigo/_hooks/usePerplexityChat';
import { useArticleState } from '../criar-artigo/_hooks/useArticleState';
import { useArticleValidation } from '../criar-artigo/_hooks/useArticleValidation';
import ArticleTypeSelector from '../criar-artigo/_components/ArticleTypeSelector';
import ChatInterface from '../criar-artigo/_components/ChatInterface';
import ArticlePreviewPanel from '../criar-artigo/_components/ArticlePreviewPanel';
import RefinementInput from '../criar-artigo/_components/RefinementInput';
import {
    type ArticleType,
    MESSAGES,
    API_ENDPOINTS,
    ANIMATION_DELAYS,
    getArticleRoute,
    getApiEndpoint,
    normalizeCategoryWithFallback
} from '../criar-artigo/_lib/constants';
import { validateArticle } from '../criar-artigo/_lib/validation';

// Component for mass mode
import UnifiedArticleGenerator from '../criar-artigo/_components/UnifiedArticleGenerator';

// Cache manager
import CacheManager from './_components/CacheManager';

const isDev = process.env.NODE_ENV === 'development';

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

// Manual Mode Content (same as /criar-artigo)
function ManualModeContent() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const refineSectionRef = useRef<HTMLDivElement>(null);

    // Fetch user ID on mount
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUserId(data.id);
                }
            } catch (e) {
                console.error('Error fetching user:', e);
            }
        }
        fetchUser();
    }, []);

    const [prompt, setPrompt] = useState('');
    const [selectedType, setSelectedType] = useState<ArticleType | null>(null);

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

    const { conversation, loading, processing, sendMessage, addMessage } = usePerplexityChat({
        selectedType,
        onArticleGenerated: (article) => {
            setGeneratedArticle(article);
            // Limpar validação anterior quando novo artigo é gerado
            clearValidation();
        },
        onError: (error) => {
            console.error('Erro no chat:', error);
        }
    });

    // Hook de validação com Gemini
    const {
        validating,
        validationResult,
        validateArticle: runValidation,
        clearValidation
    } = useArticleValidation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSendMessage = async () => {
        if (!prompt.trim()) return;
        const userMessage = prompt.trim();
        setPrompt('');
        await sendMessage(userMessage);
    };

    const handleProcessWithGemini = async () => {
        if (!generatedArticle) return;
        try {
            addMessage({ role: 'assistant', content: MESSAGES.article.processing });
            const geminiResponse = await fetch(API_ENDPOINTS.processGemini, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ article: generatedArticle, articleType: selectedType })
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
            addMessage({ role: 'assistant', content: MESSAGES.article.refined });
        } catch (error: unknown) {
            console.error('Erro ao processar com Gemini:', error);
            addMessage({ role: 'assistant', content: MESSAGES.errors.refine(getErrorMessage(error)) });
        }
    };

    const handleCopyArticle = async () => {
        if (!generatedArticle) return;
        try {
            let textToCopy;
            if (selectedType === 'resource') {
                textToCopy = JSON.stringify(generatedArticle, null, 2);
            } else {
                textToCopy = `# ${generatedArticle.title || generatedArticle.name}\n\n${generatedArticle.excerpt || ''}\n\n${generatedArticle.content || ''}`;
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
                body: JSON.stringify({ article: generatedArticle, refinementPrompt: refinementRequest, articleType: selectedType })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao refinar artigo');
            }
            const { article: refinedArticle } = await response.json();
            setGeneratedArticle({ ...refinedArticle, type: selectedType });
            addMessage({ role: 'user', content: `🎨 Refinar: ${refinementRequest}` });
            addMessage({ role: 'assistant', content: MESSAGES.article.refinedManual });
        } catch (error: unknown) {
            console.error('Erro ao refinar:', error);
            addMessage({ role: 'assistant', content: MESSAGES.errors.refine(getErrorMessage(error)) });
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
                body: JSON.stringify({ article: generatedArticle, articleType: selectedType })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao gerar capa');
            }
            const { article } = await response.json();
            setGeneratedArticle({ ...article, type: selectedType });
            addMessage({ role: 'assistant', content: MESSAGES.article.coverGenerated });
        } catch (error: unknown) {
            console.error('Erro ao gerar capa:', error);
            addMessage({ role: 'assistant', content: MESSAGES.errors.cover(getErrorMessage(error)) });
        } finally {
            stopGeneratingCover();
        }
    };

    const handlePublish = async () => {
        if (!generatedArticle || !userId || !selectedType) return;
        let articleToValidate = { ...generatedArticle };
        let rawCategory = generatedArticle.category;
        if (typeof rawCategory === 'object' && rawCategory !== null) {
            rawCategory = (rawCategory as any).category || (rawCategory as any).name || undefined;
        }
        const { category: normalizedCategory, hadFallback } = normalizeCategoryWithFallback(rawCategory, selectedType);
        articleToValidate.category = normalizedCategory;
        if (hadFallback) {
            addMessage({ role: 'assistant', content: `ℹ️ A categoria foi ajustada para "${normalizedCategory}".` });
        }
        // Auto-truncate excerpt se necessário (SEO max 160)
        if (articleToValidate.excerpt && articleToValidate.excerpt.length > 160) {
            const originalLength = articleToValidate.excerpt.length;
            articleToValidate.excerpt = articleToValidate.excerpt.substring(0, 157) + '...';
            console.log(`✂️ Excerpt truncado automaticamente: ${originalLength} → 160 chars`);
        }
        const validation = validateArticle(articleToValidate, selectedType);
        if (!validation.success) {
            alert(`❌ Erros de validação:\n\n${validation.errors.join('\n')}`);
            addMessage({ role: 'assistant', content: MESSAGES.article.validationWarning(validation.errors) });
            return;
        }
        if (articleToValidate.category !== generatedArticle.category) {
            setGeneratedArticle(articleToValidate);
        }
        try {
            const apiEndpoint = getApiEndpoint(selectedType);
            const tagsToSend = typeof articleToValidate.tags === 'string' ? [articleToValidate.tags] : (articleToValidate.tags || []);
            const citations = articleToValidate.citations || [];
            const citationsToSend = citations.length > 0
                ? citations.map((url: string, index: number) => ({ url, title: url, order: index, verified: false }))
                : undefined;
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...articleToValidate,
                    published: selectedType !== 'resource' ? true : undefined,
                    authorId: selectedType !== 'resource' ? userId : undefined,
                    tags: tagsToSend,
                    citations: selectedType !== 'resource' ? citationsToSend : undefined,
                    factCheckSources: selectedType !== 'resource' ? articleToValidate.citations : undefined,
                    quizData: articleToValidate.quiz
                })
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'Erro ao publicar');
            const url = getArticleRoute(selectedType, generatedArticle.slug);
            router.push(url);
        } catch (error: unknown) {
            alert(MESSAGES.errors.publish(getErrorMessage(error)));
        }
    };

    return (
        <div className="space-y-6">
            <ChatInterface
                conversation={conversation}
                loading={loading}
                processing={processing}
                prompt={prompt}
                selectedType={selectedType}
                onPromptChange={setPrompt}
                onSendMessage={handleSendMessage}
            />
            <ArticleTypeSelector selectedType={selectedType} onTypeChange={setSelectedType} />
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
                    validating={validating}
                    validationResult={validationResult}
                    onValidate={async () => {
                        if (!generatedArticle || !selectedType) return;
                        await runValidation({
                            title: generatedArticle.title || generatedArticle.name || '',
                            content: generatedArticle.content || '',
                            excerpt: generatedArticle.excerpt,
                            citations: generatedArticle.citations,
                            articleType: selectedType
                        });
                    }}
                    onClearValidation={clearValidation}
                />
            )}
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
    );
}

export default function CriarPage() {
    const [mode, setMode] = useState<'manual' | 'mass'>('manual');
    const [showCache, setShowCache] = useState(false);

    return (
        <AdminRoute allowEditor={true}>
            <div className="min-h-screen relative">
                <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">

                    {/* Mode Switcher + Cache Button */}
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <div className="bg-black/40 backdrop-blur-xl p-1.5 rounded-xl border border-white/10 flex gap-1 shadow-xl">
                            <button
                                onClick={() => setMode('manual')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'manual'
                                    ? 'bg-teal-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Manual
                            </button>
                            <button
                                onClick={() => setMode('mass')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'mass'
                                    ? 'bg-teal-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Massa
                            </button>
                        </div>
                        <button
                            onClick={() => setShowCache(!showCache)}
                            className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border ${showCache
                                ? 'bg-teal-600 text-white border-teal-500'
                                : 'bg-black/40 backdrop-blur-xl text-gray-400 border-white/10 hover:text-white hover:bg-white/5'
                                }`}
                            title="Gerenciar Cache"
                        >
                            📦 Cache
                        </button>
                    </div>

                    {/* Cache Manager */}
                    {showCache && (
                        <div className="mb-8 animate-fade-in-up">
                            <CacheManager onClose={() => setShowCache(false)} />
                        </div>
                    )}

                    {/* Content based on mode */}
                    <div className="animate-fade-in-up">
                        {mode === 'manual' ? <ManualModeContent /> : <UnifiedArticleGenerator mode="mass" />}
                    </div>

                </div>
            </div>
        </AdminRoute>
    );
}
