/**
 * Likes API
 * 
 * POST: Dar/remover like (toggle)
 * GET: Status do like do usuário atual
 * 
 * Requer autenticação
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/core/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json(
                { success: false, error: 'Faça login para curtir' },
                { status: 401 }
            );
        }

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

        const { articleId, resourceId } = await request.json();

        if (!articleId && !resourceId) {
            return NextResponse.json(
                { success: false, error: 'articleId ou resourceId é obrigatório' },
                { status: 400 }
            );
        }

        // Verificar se já existe like
        const existingLike = await prisma.like.findFirst({
            where: {
                userId: user.id,
                ...(articleId ? { articleId } : { resourceId })
            }
        });

        if (existingLike) {
            // Remover like (toggle off)
            await prisma.$transaction([
                prisma.like.delete({ where: { id: existingLike.id } }),
                articleId
                    ? prisma.article.update({
                        where: { id: articleId },
                        data: { likeCount: { decrement: 1 } }
                    })
                    : prisma.resource.update({
                        where: { id: resourceId! },
                        data: { likeCount: { decrement: 1 } }
                    })
            ]);

            const updated = articleId
                ? await prisma.article.findUnique({ where: { id: articleId }, select: { likeCount: true } })
                : await prisma.resource.findUnique({ where: { id: resourceId! }, select: { likeCount: true } });

            return NextResponse.json({
                success: true,
                liked: false,
                likeCount: updated?.likeCount || 0
            });
        } else {
            // Adicionar like (toggle on)
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        userId: user.id,
                        ...(articleId ? { articleId } : { resourceId })
                    }
                }),
                articleId
                    ? prisma.article.update({
                        where: { id: articleId },
                        data: { likeCount: { increment: 1 } }
                    })
                    : prisma.resource.update({
                        where: { id: resourceId! },
                        data: { likeCount: { increment: 1 } }
                    })
            ]);

            const updated = articleId
                ? await prisma.article.findUnique({ where: { id: articleId }, select: { likeCount: true } })
                : await prisma.resource.findUnique({ where: { id: resourceId! }, select: { likeCount: true } });

            return NextResponse.json({
                success: true,
                liked: true,
                likeCount: updated?.likeCount || 0
            });
        }
    } catch (error: any) {
        console.error('[likes] Erro:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao processar like' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const articleId = searchParams.get('articleId');
        const resourceId = searchParams.get('resourceId');

        if (!articleId && !resourceId) {
            return NextResponse.json(
                { success: false, error: 'articleId ou resourceId é obrigatório' },
                { status: 400 }
            );
        }

        // Buscar contagem total
        const item = articleId
            ? await prisma.article.findUnique({ where: { id: articleId }, select: { likeCount: true } })
            : await prisma.resource.findUnique({ where: { id: resourceId! }, select: { likeCount: true } });

        // Verificar se usuário atual deu like
        let userLiked = false;
        const { userId: clerkId } = await auth();

        if (clerkId) {
            const user = await prisma.user.findUnique({
                where: { clerkId },
                select: { id: true }
            });

            if (user) {
                const existingLike = await prisma.like.findFirst({
                    where: {
                        userId: user.id,
                        ...(articleId ? { articleId } : { resourceId })
                    }
                });
                userLiked = !!existingLike;
            }
        }

        return NextResponse.json({
            success: true,
            liked: userLiked,
            likeCount: item?.likeCount || 0
        });
    } catch (error: any) {
        console.error('[likes] Erro GET:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar likes' },
            { status: 500 }
        );
    }
}
