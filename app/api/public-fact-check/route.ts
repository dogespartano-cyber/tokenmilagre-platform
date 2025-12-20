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

        // 6. Verificar se usuário já fez fact-check deste artigo
        const existingCheck = await prisma.articleFactCheck.findUnique({
            where: {
                articleId_userId: {
                    articleId: article.id,
                    userId: user.id
                }
            }
        });

        if (existingCheck) {
            // Retornar resultado anterior
            return NextResponse.json({
                success: true,
                alreadyChecked: true,
                data: {
                    score: existingCheck.score,
                    status: existingCheck.status,
                    summary: existingCheck.summary,
                    totalChecks: article.factCheckClicks
                }
            });
        }

        // 7. Fazer verificação com Gemini
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

        // 8. Salvar resultado e incrementar contador
        await prisma.$transaction([
            prisma.articleFactCheck.create({
                data: {
                    articleId: article.id,
                    userId: user.id,
                    score: result.score,
                    status: result.status,
                    summary: result.summary
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
                verifiedClaims: result.verifiedClaims.slice(0, 3), // Top 3
                unverifiedClaims: result.unverifiedClaims.slice(0, 2), // Top 2
                totalChecks: article.factCheckClicks + 1
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
