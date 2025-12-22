/**
 * API de Reações (Like/Dislike)
 * 
 * GET: Buscar estado atual para um item
 * POST: Criar/atualizar/remover reação
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/core/prisma';

// GET - Buscar estado atual
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') as 'article' | 'resource';
        const id = searchParams.get('id');

        if (!type || !id) {
            return NextResponse.json(
                { success: false, error: 'Parâmetros type e id são obrigatórios' },
                { status: 400 }
            );
        }

        // Buscar contadores do item
        let item: { likeCount: number; dislikeCount: number } | null = null;

        if (type === 'article') {
            item = await prisma.article.findUnique({
                where: { id },
                select: { likeCount: true, dislikeCount: true }
            });
        } else {
            item = await prisma.resource.findUnique({
                where: { id },
                select: { likeCount: true, dislikeCount: true }
            });
        }

        if (!item) {
            return NextResponse.json(
                { success: false, error: 'Item não encontrado' },
                { status: 404 }
            );
        }

        // Verificar se usuário já reagiu
        const { userId: clerkId } = await auth();
        let userReaction: 'like' | 'dislike' | null = null;

        if (clerkId) {
            const user = await prisma.user.findUnique({
                where: { clerkId },
                select: { id: true }
            });

            if (user) {
                const like = await prisma.like.findFirst({
                    where: type === 'article'
                        ? { userId: user.id, articleId: id }
                        : { userId: user.id, resourceId: id }
                });

                if (like) {
                    userReaction = like.isDislike ? 'dislike' : 'like';
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                likeCount: item.likeCount,
                dislikeCount: item.dislikeCount,
                userReaction
            }
        });

    } catch (error) {
        console.error('[reactions] GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar reações' },
            { status: 500 }
        );
    }
}

// POST - Criar/atualizar reação
export async function POST(request: NextRequest) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json(
                { success: false, error: 'Faça login para reagir' },
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

        const body = await request.json();
        const { type, id, reaction } = body as {
            type: 'article' | 'resource';
            id: string;
            reaction: 'like' | 'dislike' | 'none';
        };

        if (!type || !id || !reaction) {
            return NextResponse.json(
                { success: false, error: 'Parâmetros type, id e reaction são obrigatórios' },
                { status: 400 }
            );
        }

        // Buscar reação existente
        const existingLike = await prisma.like.findFirst({
            where: type === 'article'
                ? { userId: user.id, articleId: id }
                : { userId: user.id, resourceId: id }
        });

        const isArticle = type === 'article';

        // Calcular deltas para contadores
        let likeDelta = 0;
        let dislikeDelta = 0;

        if (reaction === 'none') {
            // Remover reação
            if (existingLike) {
                if (existingLike.isDislike) {
                    dislikeDelta = -1;
                } else {
                    likeDelta = -1;
                }
                await prisma.like.delete({ where: { id: existingLike.id } });
            }
        } else if (reaction === 'like') {
            if (existingLike) {
                if (existingLike.isDislike) {
                    // Mudando de dislike para like
                    dislikeDelta = -1;
                    likeDelta = 1;
                    await prisma.like.update({
                        where: { id: existingLike.id },
                        data: { isDislike: false }
                    });
                }
                // Se já é like, não faz nada
            } else {
                // Novo like
                likeDelta = 1;
                await prisma.like.create({
                    data: {
                        userId: user.id,
                        ...(isArticle ? { articleId: id } : { resourceId: id }),
                        isDislike: false
                    }
                });
            }
        } else if (reaction === 'dislike') {
            if (existingLike) {
                if (!existingLike.isDislike) {
                    // Mudando de like para dislike
                    likeDelta = -1;
                    dislikeDelta = 1;
                    await prisma.like.update({
                        where: { id: existingLike.id },
                        data: { isDislike: true }
                    });
                }
                // Se já é dislike, não faz nada
            } else {
                // Novo dislike
                dislikeDelta = 1;
                await prisma.like.create({
                    data: {
                        userId: user.id,
                        ...(isArticle ? { articleId: id } : { resourceId: id }),
                        isDislike: true
                    }
                });
            }
        }

        // Atualizar contadores no item
        if (likeDelta !== 0 || dislikeDelta !== 0) {
            if (isArticle) {
                await prisma.article.update({
                    where: { id },
                    data: {
                        likeCount: { increment: likeDelta },
                        dislikeCount: { increment: dislikeDelta }
                    }
                });
            } else {
                await prisma.resource.update({
                    where: { id },
                    data: {
                        likeCount: { increment: likeDelta },
                        dislikeCount: { increment: dislikeDelta }
                    }
                });
            }
        }

        // Buscar contadores atualizados
        let updatedItem: { likeCount: number; dislikeCount: number } | null = null;

        if (isArticle) {
            updatedItem = await prisma.article.findUnique({
                where: { id },
                select: { likeCount: true, dislikeCount: true }
            });
        } else {
            updatedItem = await prisma.resource.findUnique({
                where: { id },
                select: { likeCount: true, dislikeCount: true }
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                likeCount: updatedItem?.likeCount ?? 0,
                dislikeCount: updatedItem?.dislikeCount ?? 0,
                userReaction: reaction === 'none' ? null : reaction
            }
        });

    } catch (error) {
        console.error('[reactions] POST error:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao processar reação' },
            { status: 500 }
        );
    }
}
