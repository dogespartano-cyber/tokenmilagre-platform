/**
 * Public Resource Fact-Check API
 * 
 * Permite usuários logados verificarem a veracidade de recursos
 * Limita a 1 verificação por recurso por usuário
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/core/prisma';

export async function POST(request: NextRequest) {
    try {
        // 1. Verificar autenticação
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json(
                { success: false, error: 'Faça login para verificar recursos' },
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
        const { resourceId } = await request.json();

        if (!resourceId) {
            return NextResponse.json(
                { success: false, error: 'ID do recurso é obrigatório' },
                { status: 400 }
            );
        }

        // 5. Buscar recurso
        const resource = await prisma.resource.findUnique({
            where: { id: resourceId },
            select: {
                id: true,
                name: true,
                shortDescription: true,
                heroDescription: true,
                whyGoodContent: true,
                pros: true,
                cons: true,
                factCheckClicks: true
            }
        });

        if (!resource) {
            return NextResponse.json(
                { success: false, error: 'Recurso não encontrado' },
                { status: 404 }
            );
        }

        // 6. Verificar se usuário já fez fact-check deste recurso
        const existingCheck = await prisma.resourceFactCheck.findUnique({
            where: {
                resourceId_userId: {
                    resourceId: resource.id,
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
                    totalChecks: resource.factCheckClicks
                }
            });
        }

        // 7. Fazer verificação com Gemini
        console.log('[public-resource-check] Iniciando verificação para:', resource.name);

        // Construir conteúdo para validação
        const contentToValidate = `
Recurso: ${resource.name}
Descrição: ${resource.shortDescription}
${resource.heroDescription}

${resource.whyGoodContent ? `Por que é bom: ${resource.whyGoodContent}` : ''}

${resource.pros ? `Prós: ${resource.pros}` : ''}
${resource.cons ? `Contras: ${resource.cons}` : ''}
`.trim();

        const result = await validateResourceContent(
            resource.name,
            contentToValidate,
            GEMINI_API_KEY
        );

        // 8. Salvar resultado e incrementar contador
        await prisma.$transaction([
            prisma.resourceFactCheck.create({
                data: {
                    resourceId: resource.id,
                    userId: user.id,
                    score: result.score,
                    status: result.status,
                    summary: result.summary
                }
            }),
            prisma.resource.update({
                where: { id: resource.id },
                data: {
                    factCheckClicks: { increment: 1 },
                    factCheckScore: result.score,
                    factCheckStatus: result.status,
                    factCheckDate: new Date()
                }
            })
        ]);

        console.log('[public-resource-check] Verificação concluída:', {
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
                totalChecks: resource.factCheckClicks + 1
            }
        });

    } catch (error: any) {
        console.error('[public-resource-check] Erro:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao verificar recurso' },
            { status: 500 }
        );
    }
}

// GET para buscar status de verificação
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const resourceId = searchParams.get('resourceId');

        if (!resourceId) {
            return NextResponse.json(
                { success: false, error: 'resourceId é obrigatório' },
                { status: 400 }
            );
        }

        // Buscar recurso com dados de fact-check
        const resource = await prisma.resource.findUnique({
            where: { id: resourceId },
            select: {
                factCheckScore: true,
                factCheckStatus: true,
                factCheckClicks: true,
                factCheckDate: true
            }
        });

        if (!resource) {
            return NextResponse.json(
                { success: false, error: 'Recurso não encontrado' },
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
                const existingCheck = await prisma.resourceFactCheck.findUnique({
                    where: {
                        resourceId_userId: {
                            resourceId,
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
                score: resource.factCheckScore,
                status: resource.factCheckStatus,
                totalChecks: resource.factCheckClicks,
                lastChecked: resource.factCheckDate,
                userHasChecked
            }
        });

    } catch (error: any) {
        console.error('[public-resource-check] Erro GET:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar status' },
            { status: 500 }
        );
    }
}

// Função para validar conteúdo do recurso
async function validateResourceContent(
    name: string,
    content: string,
    apiKey: string
): Promise<{ score: number; status: string; summary: string }> {
    const prompt = `Você é um verificador de recursos de criptomoedas.

Analise este recurso e verifique se as informações são precisas e confiáveis:

${content}

Responda em JSON com:
{
  "score": número de 0-100 indicando confiabilidade,
  "status": "verified" se score >= 80, "partially_verified" se >= 50, "unverified" se < 50,
  "summary": resumo curto (máx 150 caracteres) da análise
}

Use busca na web para verificar se:
1. O recurso é legítimo e existe
2. As informações sobre prós/contras são precisas
3. Não há alertas de segurança ou golpe

Responda APENAS o JSON, sem markdown.`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                tools: [{ google_search: {} }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500,
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error('Erro ao chamar Gemini API');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    try {
        // Parse JSON da resposta
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            return {
                score: Math.min(100, Math.max(0, result.score || 50)),
                status: result.status || 'partially_verified',
                summary: (result.summary || 'Verificação concluída').slice(0, 150)
            };
        }
    } catch (e) {
        console.error('Erro ao parsear resposta:', e);
    }

    // Fallback
    return {
        score: 50,
        status: 'partially_verified',
        summary: 'Não foi possível verificar completamente'
    };
}
