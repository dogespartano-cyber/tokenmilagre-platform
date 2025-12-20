/**
 * Comments API
 * 
 * POST: Criar comentário
 * GET: Buscar comentários de um artigo/recurso
 * 
 * Requer autenticação para POST
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/core/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json(
                { success: false, error: 'Faça login para comentar' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true, name: true, image: true }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        const { content, articleId, resourceId, parentId } = await request.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Conteúdo do comentário é obrigatório' },
                { status: 400 }
            );
        }

        if (!articleId && !resourceId) {
            return NextResponse.json(
                { success: false, error: 'articleId ou resourceId é obrigatório' },
                { status: 400 }
            );
        }

        // Limitar tamanho do comentário
        if (content.length > 2000) {
            return NextResponse.json(
                { success: false, error: 'Comentário muito longo (máx 2000 caracteres)' },
                { status: 400 }
            );
        }

        // Criar comentário e incrementar contador
        const [comment] = await prisma.$transaction([
            prisma.comment.create({
                data: {
                    content: content.trim(),
                    userId: user.id,
                    ...(articleId ? { articleId } : { resourceId }),
                    ...(parentId ? { parentId } : {})
                },
                include: {
                    user: {
                        select: { id: true, name: true, image: true }
                    }
                }
            }),
            // Só incrementar se não for reply (para não contar replies no total)
            !parentId
                ? (articleId
                    ? prisma.article.update({
                        where: { id: articleId },
                        data: { commentCount: { increment: 1 } }
                    })
                    : prisma.resource.update({
                        where: { id: resourceId },
                        data: { commentCount: { increment: 1 } }
                    }))
                : prisma.comment.findFirst({ where: { id: parentId } }) // dummy para manter array
        ]);

        return NextResponse.json({
            success: true,
            comment: {
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                user: {
                    id: comment.user.id,
                    name: comment.user.name || 'Anônimo',
                    image: comment.user.image
                },
                replies: []
            }
        });
    } catch (error: any) {
        console.error('[comments] Erro POST:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao criar comentário' },
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

        // Buscar comentários com respostas (1 nível)
        const comments = await prisma.comment.findMany({
            where: {
                ...(articleId ? { articleId } : { resourceId }),
                parentId: null // Apenas comentários raiz
            },
            include: {
                user: {
                    select: { id: true, name: true, image: true }
                },
                replies: {
                    include: {
                        user: {
                            select: { id: true, name: true, image: true }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Buscar contagem total
        const item = articleId
            ? await prisma.article.findUnique({ where: { id: articleId }, select: { commentCount: true } })
            : await prisma.resource.findUnique({ where: { id: resourceId! }, select: { commentCount: true } });

        return NextResponse.json({
            success: true,
            comments: comments.map(c => ({
                id: c.id,
                content: c.content,
                createdAt: c.createdAt,
                user: {
                    id: c.user.id,
                    name: c.user.name || 'Anônimo',
                    image: c.user.image
                },
                replies: c.replies.map(r => ({
                    id: r.id,
                    content: r.content,
                    createdAt: r.createdAt,
                    user: {
                        id: r.user.id,
                        name: r.user.name || 'Anônimo',
                        image: r.user.image
                    }
                }))
            })),
            commentCount: item?.commentCount || 0
        });
    } catch (error: any) {
        console.error('[comments] Erro GET:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar comentários' },
            { status: 500 }
        );
    }
}
