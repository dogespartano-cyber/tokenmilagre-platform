/**
 * Validation Chat API Route
 * 
 * Permite fazer perguntas sobre o resultado da validação
 * Usa Gemini 3 Flash com context da validação anterior
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/shared/helpers/auth-helpers';
import { checkAIRateLimit } from '@/lib/shared/helpers/rate-limit';

interface ChatRequest {
    question: string;
    validationContext: {
        articleTitle: string;
        articleContent: string;
        validationResult: {
            score: number;
            status: string;
            summary: string;
            verifiedClaims: any[];
            unverifiedClaims: string[];
            suggestions: string[];
        };
    };
    conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
}

export async function POST(request: NextRequest) {
    try {
        // 1. Autenticação
        const auth = await requireEditor(request);
        if (!auth.success) return auth.response;

        // 2. Rate limiting
        const rateLimit = await checkAIRateLimit(auth.user.id);
        if (!rateLimit.success) return rateLimit.response!;

        // 3. Validar API Key
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return NextResponse.json(
                { success: false, error: 'GEMINI_API_KEY não configurada' },
                { status: 500 }
            );
        }

        // 4. Parse body
        const body: ChatRequest = await request.json();

        if (!body.question || !body.validationContext) {
            return NextResponse.json(
                { success: false, error: 'Pergunta e contexto são obrigatórios' },
                { status: 400 }
            );
        }

        // 5. Construir prompt com contexto
        const systemPrompt = buildChatPrompt(body);

        // 6. Chamar Gemini 3 Flash
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }],
                    tools: [{ google_search: {} }],
                    generationConfig: {
                        temperature: 0.5,
                        topK: 40,
                        topP: 0.9,
                        maxOutputTokens: 2048,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown'}`);
        }

        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!answer) {
            throw new Error('Resposta vazia do Gemini');
        }

        return NextResponse.json({
            success: true,
            answer: answer.trim()
        });

    } catch (error: any) {
        console.error('[validation-chat] Erro:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro ao processar pergunta' },
            { status: 500 }
        );
    }
}

function buildChatPrompt(body: ChatRequest): string {
    const { question, validationContext, conversationHistory } = body;
    const { articleTitle, validationResult } = validationContext;

    // Construir histórico de conversa
    let historyText = '';
    if (conversationHistory && conversationHistory.length > 0) {
        historyText = '\n\n**HISTÓRICO DA CONVERSA:**\n' +
            conversationHistory.map(msg =>
                `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`
            ).join('\n');
    }

    return `Você é um assistente especializado em fact-checking de artigos sobre criptomoedas.

**CONTEXTO DA VALIDAÇÃO:**

Artigo: "${articleTitle}"

Resultado da validação:
- Score: ${validationResult.score}/100
- Status: ${validationResult.status}
- Resumo: ${validationResult.summary}

Claims verificados: ${validationResult.verifiedClaims.length}
Claims não verificados: ${validationResult.unverifiedClaims.length}

${validationResult.unverifiedClaims.length > 0 ?
            `Claims não verificados:\n${validationResult.unverifiedClaims.map(c => `- ${c}`).join('\n')}` : ''}

${validationResult.suggestions.length > 0 ?
            `Sugestões de melhoria:\n${validationResult.suggestions.map(s => `- ${s}`).join('\n')}` : ''}
${historyText}

**PERGUNTA DO USUÁRIO:**
${question}

**INSTRUÇÕES:**
- Responda de forma clara e objetiva
- Use busca na web para complementar informações se necessário
- Se a pergunta for sobre um claim específico, explique em detalhes
- Sugira correções específicas quando apropriado
- Responda em português brasileiro`;
}

export async function GET() {
    return NextResponse.json(
        { error: 'Método não permitido. Use POST.' },
        { status: 405 }
    );
}
