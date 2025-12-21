/**
 * Public Fact-Check API
 * 
 * Permite usuários logados verificarem a veracidade de artigos
 * Limita a 1 verificação por artigo por usuário
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/core/prisma';
import { validateArticleContent } from '@/lib/shared/ai/gemini-validator';

export async function POST(request: NextRequest) {
    try {
        // 1. Verificar autenticação
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json(
                { success: false, error: 'Faça login para verificar artigos' },
                { status: 401 }
            );
        }

        // 2. Buscar usuário no banco
        const user = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        // 3. Validar API Key
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return NextResponse.json(
                { success: false, error: 'Serviço temporariamente indisponível' },
                { status: 503 }
            );
        }

        // 4. Parse body
        const { articleId } = await request.json();

        if (!articleId) {
            return NextResponse.json(
                { success: false, error: 'ID do artigo é obrigatório' },
                { status: 400 }
            );
        }

        // 5. Buscar artigo
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            select: {
                id: true,
                title: true,
                content: true,
                excerpt: true,
                type: true,
                factCheckClicks: true
            }
        });

        if (!article) {
            return NextResponse.json(
                { success: false, error: 'Artigo não encontrado' },
                { status: 404 }
            );
        }

        // 6. CACHE GLOBAL: Buscar verificação recente de QUALQUER usuário (últimos 3 dias)
        const THREE_DAYS_AGO = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

        const globalCache = await prisma.articleFactCheck.findFirst({
            where: {
                articleId: article.id,
                createdAt: { gte: THREE_DAYS_AGO }
            },
            orderBy: { createdAt: 'desc' }
        });

        // 7. Verificar se ESTE usuário já fez fact-check deste artigo
        const existingCheck = await prisma.articleFactCheck.findUnique({
            where: {
                articleId_userId: {
                    articleId: article.id,
                    userId: user.id
                }
            }
        });

        // Se usuário já verificou, retornar resultado dele
        if (existingCheck) {
            let parsedLog = null;
            try {
                if (existingCheck.verificationLog) {
                    parsedLog = JSON.parse(existingCheck.verificationLog);
                }
            } catch (e) {
                console.error('[public-fact-check] Erro ao parsear log salvo');
            }

            return NextResponse.json({
                success: true,
                alreadyChecked: true,
                fromCache: false,
                data: {
                    score: existingCheck.score,
                    status: existingCheck.status,
                    summary: existingCheck.summary,
                    totalChecks: article.factCheckClicks,
                    verificationLog: parsedLog
                }
            });
        }

        // Se existe cache global válido, usar ele (economiza chamada ao Gemini)
        if (globalCache) {
            console.log('[public-fact-check] ♻️ Usando cache global de', globalCache.createdAt);

            let parsedLog = null;
            try {
                if (globalCache.verificationLog) {
                    parsedLog = JSON.parse(globalCache.verificationLog);
                }
            } catch (e) {
                console.error('[public-fact-check] Erro ao parsear log do cache');
            }

            // Salvar registro para este usuário (baseado no cache)
            await prisma.$transaction([
                prisma.articleFactCheck.create({
                    data: {
                        articleId: article.id,
                        userId: user.id,
                        score: globalCache.score,
                        status: globalCache.status,
                        summary: globalCache.summary,
                        verificationLog: globalCache.verificationLog
                    }
                }),
                prisma.article.update({
                    where: { id: article.id },
                    data: { factCheckClicks: { increment: 1 } }
                })
            ]);

            return NextResponse.json({
                success: true,
                alreadyChecked: false,
                fromCache: true,
                cacheAge: Math.floor((Date.now() - globalCache.createdAt.getTime()) / 3600000) + 'h',
                data: {
                    score: globalCache.score,
                    status: globalCache.status,
                    summary: globalCache.summary,
                    totalChecks: article.factCheckClicks + 1,
                    verificationLog: parsedLog
                }
            });
        }

        // 8. Nenhum cache disponível - Fazer verificação com Gemini
        console.log('[public-fact-check] Iniciando verificação para:', article.title);

        const result = await validateArticleContent(
            {
                title: article.title,
                content: article.content,
                excerpt: article.excerpt || undefined,
                articleType: article.type as 'news' | 'educational'
            },
            GEMINI_API_KEY
        );

        // 8. Preparar log de verificação para salvar
        const verificationLog = {
            claims: result.verifiedClaims.map(c => ({
                text: c.claim,
                status: c.verified ? 'verified' : 'refuted',
                confidence: c.confidence,
                sources: c.sources
            })),
            unverifiedClaims: result.unverifiedClaims,
            additionalSources: result.additionalSources,
            suggestions: result.suggestions,
            timestamp: new Date().toISOString()
        };

        // 9. Salvar resultado e incrementar contador
        await prisma.$transaction([
            prisma.articleFactCheck.create({
                data: {
                    articleId: article.id,
                    userId: user.id,
                    score: result.score,
                    status: result.status,
                    summary: result.summary,
                    verificationLog: JSON.stringify(verificationLog)
                }
            }),
            prisma.article.update({
                where: { id: article.id },
                data: {
                    factCheckClicks: { increment: 1 },
                    factCheckScore: result.score,
                    factCheckStatus: result.status,
                    factCheckDate: new Date()
                }
            })
        ]);

        console.log('[public-fact-check] Verificação concluída:', {
            score: result.score,
            status: result.status
        });

        return NextResponse.json({
            success: true,
            alreadyChecked: false,
            data: {
                score: result.score,
                status: result.status,
                summary: result.summary,
                totalChecks: article.factCheckClicks + 1,
                verificationLog: verificationLog
            }
        });

    } catch (error: any) {
        console.error('[public-fact-check] Erro:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao verificar artigo' },
            { status: 500 }
        );
    }
}

// GET para buscar status de verificação
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const articleId = searchParams.get('articleId');

        if (!articleId) {
            return NextResponse.json(
                { success: false, error: 'articleId é obrigatório' },
                { status: 400 }
            );
        }

        // Buscar artigo com dados de fact-check
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            select: {
                factCheckScore: true,
                factCheckStatus: true,
                factCheckClicks: true,
                factCheckDate: true
            }
        });

        if (!article) {
            return NextResponse.json(
                { success: false, error: 'Artigo não encontrado' },
                { status: 404 }
            );
        }

        // Verificar se usuário atual já verificou
        const { userId: clerkId } = await auth();
        let userHasChecked = false;

        if (clerkId) {
            const user = await prisma.user.findUnique({
                where: { clerkId },
                select: { id: true }
            });

            if (user) {
                const existingCheck = await prisma.articleFactCheck.findUnique({
                    where: {
                        articleId_userId: {
                            articleId,
                            userId: user.id
                        }
                    }
                });
                userHasChecked = !!existingCheck;
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                score: article.factCheckScore,
                status: article.factCheckStatus,
                totalChecks: article.factCheckClicks,
                lastChecked: article.factCheckDate,
                userHasChecked
            }
        });

    } catch (error: any) {
        console.error('[public-fact-check] Erro GET:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar status' },
            { status: 500 }
        );
    }
}
