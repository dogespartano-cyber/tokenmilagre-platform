/**
 * Validate Article API Route
 *
 * Valida veracidade de artigos usando Gemini 3 Flash com Google Search Grounding
 * 
 * POST /api/validate-article
 * Protegido: Apenas ADMIN e EDITOR
 * Rate Limit: 5 req/min (custo elevado do grounding)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/shared/helpers/auth-helpers';
import { validateArticleContent, FactCheckResult } from '@/lib/shared/ai/gemini-validator';

// Rate limiting simples em memória
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests
const RATE_WINDOW = 60000; // 1 minuto

function checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = rateLimitMap.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
        rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
        return true;
    }

    if (userLimit.count >= RATE_LIMIT) {
        return false;
    }

    userLimit.count++;
    return true;
}

// Request body type
interface ValidateArticleRequest {
    title: string;
    content: string;
    excerpt?: string;
    citations?: string[];
    articleType: 'news' | 'educational' | 'resource';
}

export async function POST(request: NextRequest) {
    try {
        // 1. Autenticação
        const auth = await requireEditor(request);
        if (!auth.success) return auth.response;

        // 2. Rate limiting
        if (!checkRateLimit(auth.user.id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Rate limit excedido. Aguarde 1 minuto.',
                    retryAfter: 60
                },
                { status: 429 }
            );
        }

        // 3. Validar API Key
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return NextResponse.json(
                { success: false, error: 'GEMINI_API_KEY não configurada' },
                { status: 500 }
            );
        }

        // 4. Parse body
        const body: ValidateArticleRequest = await request.json();

        // Validação básica
        if (!body.title || !body.content) {
            return NextResponse.json(
                { success: false, error: 'Título e conteúdo são obrigatórios' },
                { status: 400 }
            );
        }

        if (!body.articleType || !['news', 'educational', 'resource'].includes(body.articleType)) {
            return NextResponse.json(
                { success: false, error: 'Tipo de artigo inválido' },
                { status: 400 }
            );
        }

        console.log('[validate-article] 🔍 Iniciando validação para:', body.title.substring(0, 50));

        // 5. Chamar validador Gemini
        const result: FactCheckResult = await validateArticleContent(
            {
                title: body.title,
                content: body.content,
                excerpt: body.excerpt,
                citations: body.citations,
                articleType: body.articleType
            },
            GEMINI_API_KEY
        );

        console.log('[validate-article] ✅ Validação concluída:', {
            score: result.score,
            status: result.status,
            claimsVerified: result.verifiedClaims.length,
            sourcesFound: result.additionalSources.length
        });

        // 6. Retornar resultado
        return NextResponse.json({
            success: true,
            data: result,
            usage: {
                estimatedCost: 0.035 // $35/1000 queries
            }
        });

    } catch (error: any) {
        console.error('[validate-article] ❌ Erro:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Erro interno ao validar artigo'
            },
            { status: 500 }
        );
    }
}

// GET não permitido
export async function GET() {
    return NextResponse.json(
        { error: 'Método não permitido. Use POST.' },
        { status: 405 }
    );
}
