import { NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/shared/helpers/auth-helpers';
import { callPerplexityStreaming, parsePerplexityStream, type PerplexityMessage } from '@/lib/shared/ai/perplexity-client';
import { loadPromptSync, getCurrentTimeFormatted, type PromptType } from '@/lib/prompts/prompt-loader';

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticação via Clerk
    const auth = await requireEditor(request);
    if (!auth.success) return auth.response;


    // 2. Validar API Key
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json({ error: 'PERPLEXITY_API_KEY não configurada' }, { status: 500 });
    }

    // 3. Parse body
    const body = await request.json();
    const { messages, articleType } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
    }

    // 4. Load system prompt based on type
    let systemPrompt: string;

    try {
      if (!articleType) {
        // MODO PESQUISA DE TRENDS
        systemPrompt = loadPromptSync('trends');
      } else if (articleType === 'news') {
        // MODO CRIAÇÃO DE NOTÍCIA
        systemPrompt = loadPromptSync('news');
      } else if (articleType === 'educational') {
        // MODO CRIAÇÃO DE ARTIGO EDUCACIONAL
        systemPrompt = loadPromptSync('educational');
      } else if (articleType === 'resource') {
        // MODO CRIAÇÃO DE GUIA DE RECURSO
        systemPrompt = loadPromptSync('resource');
      } else {
        // Fallback: modo conversa livre
        const currentTime = getCurrentTimeFormatted();
        systemPrompt = `Você é um assistente especializado em criptomoedas e blockchain.

**IMPORTANTE:** A data e hora atual é: ${currentTime}. Use sempre este horário como referência para "hoje", "ontem", "esta semana", etc.

Converse livremente com o usuário sobre qualquer assunto relacionado ao mundo cripto.`;
      }
    } catch (error) {
      console.error('[chat-perplexity] Error loading prompt, using fallback:', error);
      // Fallback inline prompt if file loading fails
      const currentTime = getCurrentTimeFormatted();
      systemPrompt = `Você é um assistente especializado em criptomoedas e blockchain.

**IMPORTANTE:** A data e hora atual é: ${currentTime}. Use sempre este horário como referência.

Converse livremente com o usuário sobre qualquer assunto relacionado ao mundo cripto.`;
    }

    const systemMessage: PerplexityMessage = {
      role: 'system',
      content: systemPrompt
    };

    // 5. Validar e normalizar mensagens para garantir alternância user/assistant
    const normalizedMessages: PerplexityMessage[] = [];
    let lastRole: 'user' | 'assistant' | null = null;

    for (const msg of messages) {
      const currentRole = msg.role;

      // Se a mensagem atual tem o mesmo role que a anterior, mesclar conteúdos
      if (lastRole === currentRole && normalizedMessages.length > 0) {
        const lastMessage = normalizedMessages[normalizedMessages.length - 1];
        lastMessage.content += '\n\n' + msg.content;
      } else {
        normalizedMessages.push({
          role: currentRole,
          content: msg.content
        });
        lastRole = currentRole;
      }
    }

    // Construir array final com system message
    const perplexityMessages: PerplexityMessage[] = [
      systemMessage,
      ...normalizedMessages
    ];

    // Se está gerando artigo, usar não-streaming para capturar citations
    if (articleType) {
      const { callPerplexity } = require('@/lib/shared/ai/perplexity-client');

      const response = await callPerplexity(
        {
          model: 'sonar',
          messages: perplexityMessages,
          temperature: 0.7,
          max_tokens: 4000,
          search_recency_filter: articleType === 'news' ? 'day' : 'week',
          return_citations: true, // Habilita citações com URLs
        },
        PERPLEXITY_API_KEY
      );

      const content = response.choices[0].message.content;
      const citations = response.citations || [];

      // DEBUG: Logs apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [DEV] Resposta Perplexity:', {
          citations: citations.length,
          hasContent: !!content
        });
      }

      // Retornar JSON com content e citations
      return NextResponse.json({
        content,
        citations
      });
    }

    // Modo conversa: usar streaming
    const stream = await callPerplexityStreaming(
      {
        model: 'sonar',
        messages: perplexityMessages,
        temperature: 0.7,
        max_tokens: 4000,
        search_recency_filter: 'week',
        return_citations: false, // Em streaming, citations não funcionam
      },
      PERPLEXITY_API_KEY
    );

    // 6. Retornar stream
    const parsedStream = parsePerplexityStream(stream);

    return new Response(parsedStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Erro em /api/chat-perplexity:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
