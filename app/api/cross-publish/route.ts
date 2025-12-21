/**
 * Cross Publish API
 * 
 * Endpoint para publicar artigos com verificação automática (Modo Cross)
 * Combina Perplexity (criação) + Gemini (verificação) em um único fluxo
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/core/prisma';
import { validateArticleContent } from '@/lib/shared/ai/gemini-validator';

interface CrossPublishRequest {
    article: {
        title: string;
        slug: string;
        excerpt?: string;
        content: string;
        category: string;
        tags?: string[];
        sentiment?: 'positive' | 'neutral' | 'negative';
        level?: string;
        citations?: string[]; // Fontes do Perplexity
        coverImage?: string;
        coverImageAlt?: string;
        readTime?: string;
    };
    articleType: 'news' | 'educational';
    userId: string;
}

interface ConsolidatedSource {
    url: string;
    title?: string;
    origin: 'perplexity' | 'gemini';
}

export async function POST(request: NextRequest) {
    try {
        // 1. Verificar autenticação
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json(
                { success: false, error: 'Faça login para publicar' },
                { status: 401 }
            );
        }

        // 2. Buscar usuário no banco
        const user = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true, role: true }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        // 3. Verificar permissão (admin ou editor)
        if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
            return NextResponse.json(
                { success: false, error: 'Sem permissão para publicar' },
                { status: 403 }
            );
        }

        // 4. Validar API Key do Gemini
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return NextResponse.json(
                { success: false, error: 'Serviço de verificação indisponível' },
                { status: 503 }
            );
        }

        // 5. Parse body
        const { article, articleType, userId }: CrossPublishRequest = await request.json();

        if (!article || !articleType || !userId) {
            return NextResponse.json(
                { success: false, error: 'Dados incompletos' },
                { status: 400 }
            );
        }

        console.log('[cross-publish] ⚡ Iniciando modo Cross para:', article.title);

        // 6. Verificar com Gemini
        console.log('[cross-publish] 🔍 Verificando com Gemini...');
        const verificationResult = await validateArticleContent(
            {
                title: article.title,
                content: article.content,
                excerpt: article.excerpt,
                articleType: articleType
            },
            GEMINI_API_KEY
        );

        // 7. Consolidar fontes (Perplexity + Gemini)
        const consolidatedSources: ConsolidatedSource[] = [];

        // Adicionar fontes do Perplexity (citations)
        if (article.citations && Array.isArray(article.citations)) {
            for (const url of article.citations) {
                consolidatedSources.push({
                    url,
                    title: undefined,
                    origin: 'perplexity'
                });
            }
        }

        // Adicionar fontes do Gemini (grounding)
        if (verificationResult.additionalSources) {
            for (const source of verificationResult.additionalSources) {
                // Evitar duplicatas
                const exists = consolidatedSources.some(s => s.url === source.url);
                if (!exists) {
                    consolidatedSources.push({
                        url: source.url,
                        title: source.title,
                        origin: 'gemini'
                    });
                }
            }
        }

        // Adicionar fontes dos claims verificados
        if (verificationResult.verifiedClaims) {
            for (const claim of verificationResult.verifiedClaims) {
                if (claim.sources) {
                    for (const source of claim.sources) {
                        const exists = consolidatedSources.some(s => s.url === source.url);
                        if (!exists) {
                            consolidatedSources.push({
                                url: source.url,
                                title: source.title,
                                origin: 'gemini'
                            });
                        }
                    }
                }
            }
        }

        console.log('[cross-publish] 📚 Fontes consolidadas:', consolidatedSources.length);

        // 8. Preparar log de verificação
        const verificationLog = {
            claims: verificationResult.verifiedClaims.map(c => ({
                text: c.claim,
                status: c.verified ? 'verified' : 'refuted',
                confidence: c.confidence,
                sources: c.sources
            })),
            unverifiedClaims: verificationResult.unverifiedClaims,
            additionalSources: verificationResult.additionalSources,
            suggestions: verificationResult.suggestions,
            consolidatedSources: consolidatedSources,
            crossMode: true,
            timestamp: new Date().toISOString()
        };

        // 9. Publicar artigo com dados de verificação
        const publishedArticle = await prisma.article.create({
            data: {
                title: article.title,
                slug: article.slug,
                excerpt: article.excerpt || '',
                content: article.content,
                category: article.category,
                tags: JSON.stringify(article.tags || []),
                sentiment: article.sentiment,
                type: articleType,
                coverImage: article.coverImage,
                coverImageAlt: article.coverImageAlt,
                readTime: article.readTime,
                factCheckScore: verificationResult.score,
                factCheckStatus: verificationResult.status,
                factCheckDate: new Date(),
                factCheckClicks: 1, // Já conta a verificação automática
                consolidatedSources: JSON.stringify(consolidatedSources),
                authorId: userId
            }
        });

        // 10. Criar entrada no cache de fact-check
        await prisma.articleFactCheck.create({
            data: {
                articleId: publishedArticle.id,
                userId: user.id,
                score: verificationResult.score,
                status: verificationResult.status,
                summary: verificationResult.summary,
                verificationLog: JSON.stringify(verificationLog)
            }
        });

        console.log('[cross-publish] ✅ Artigo publicado com verificação:', publishedArticle.id);

        return NextResponse.json({
            success: true,
            crossMode: true,
            data: {
                articleId: publishedArticle.id,
                slug: publishedArticle.slug,
                factCheck: {
                    score: verificationResult.score,
                    status: verificationResult.status,
                    summary: verificationResult.summary
                },
                sourcesCount: consolidatedSources.length
            }
        });

    } catch (error) {
        console.error('[cross-publish] Erro:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao publicar artigo' },
            { status: 500 }
        );
    }
}
