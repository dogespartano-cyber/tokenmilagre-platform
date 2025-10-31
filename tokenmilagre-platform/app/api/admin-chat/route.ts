import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  callPerplexityStreaming,
  parsePerplexityStream,
  type PerplexityMessage,
  type PerplexityRequestOptions
} from '@/lib/perplexity-client';
import { extractPageContext, formatArticleContext } from '@/lib/admin-chat-context';
import { validateArticleContent } from '@/lib/content-validator';
import { detectIntent } from '@/lib/intent-detector';

/**
 * Decide configuração do modelo Perplexity baseado na intenção
 */
function selectOptimalModel(
  userMessage: string,
  intent?: ReturnType<typeof detectIntent>
): { model: 'sonar'; search_recency_filter?: 'day' | 'week' | 'month' } {
  const message = userMessage.toLowerCase();

  // Se está criando notícia, usar sonar com filtro de recência
  const isCreatingNews = intent && intent.action === 'CREATE' && intent.subtype === 'news';

  if (isCreatingNews) {
    return {
      model: 'sonar',
      search_recency_filter: 'day' // Apenas últimas 24h para notícias
    };
  }

  // Pesquisas precisam de busca web recente
  const needsRecentData =
    message.includes('preço') ||
    message.includes('valor') ||
    message.includes('cotação') ||
    message.includes('hoje') ||
    message.includes('atual') ||
    message.includes('recente') ||
    message.includes('últim') ||
    message.includes('pesquis') ||
    (intent && intent.action === 'RESEARCH');

  if (needsRecentData) {
    return {
      model: 'sonar',
      search_recency_filter: 'week'
    };
  }

  // Sempre usar sonar (modelo único disponível)
  return { model: 'sonar' };
}

// Rate limiting simples (em memória)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

interface AdminChatRequest {
  messages: PerplexityMessage[];
  pathname?: string;
  pageData?: Record<string, any>;
  model?: 'sonar' | 'sonar-pro';
}

/**
 * Detecta intenção em linguagem natural e executa ações
 * Retorna null se for conversa normal (deixa IA responder)
 * Retorna string se for validação (resposta pronta)
 * Retorna objeto se for ação que precisa ser executada
 */
function processIntent(
  userMessage: string,
  pageData?: Record<string, any>
): string | { action: string; data: any } | null {
  // Detectar intenção em linguagem natural
  const intent = detectIntent(userMessage);

  // Se confiança baixa, deixar IA responder normalmente
  if (intent.confidence < 0.5) {
    return null;
  }

  // Processar cada tipo de intenção
  switch (intent.action) {
    case 'CREATE':
      if (intent.parameters?.topic && intent.subtype) {
        return {
          action: 'generate-article',
          data: {
            type: intent.subtype,
            topic: intent.parameters.topic,
            model: 'sonar'
          }
        };
      }
      return `Para criar um artigo, especifique o tipo e o tópico.\n\n**Exemplos**:\n- "Crie uma notícia sobre Bitcoin"\n- "Faça um artigo educacional sobre DeFi"`;

    case 'LIST':
      return {
        action: 'list-articles',
        data: { limit: intent.parameters?.limit || 10 }
      };

    case 'SEARCH':
      if (intent.parameters?.query) {
        return {
          action: 'search-articles',
          data: { query: intent.parameters.query, limit: 10 }
        };
      }
      return `Para buscar artigos, especifique o termo. Exemplo: "Busque artigos sobre Ethereum"`;

    case 'DELETE':
      if (intent.parameters?.query) {
        return {
          action: 'delete-article',
          data: { query: intent.parameters.query }
        };
      }
      return `Para deletar um artigo, especifique qual. Exemplo: "Delete o artigo sobre Solana"`;

    case 'VALIDATE':
      if (!pageData?.content) {
        return 'Nenhum artigo para validar. Crie um artigo primeiro.';
      }
      const type = pageData.type === 'educational' ? 'educational' : 'news';
      const validation = validateArticleContent(pageData.content, type);

      let response = `## Validação de Conteúdo\n\n**Score**: ${validation.score}/100\n\n`;
      if (validation.errors.length > 0) {
        response += `**Erros Críticos**:\n`;
        validation.errors.forEach((err: string) => response += `- ${err}\n`);
        response += `\n`;
      }
      if (validation.warnings.length > 0) {
        response += `**Avisos**:\n`;
        validation.warnings.forEach((warn: string) => response += `- ${warn}\n`);
        response += `\n`;
      }
      response += validation.isValid ? `✅ Conteúdo aprovado!` : `❌ Precisa de ajustes.`;
      return response;

    case 'PUBLISH':
      if (!pageData?.title || !pageData?.content) {
        return 'Nenhum artigo para publicar. Crie um artigo primeiro.';
      }
      return {
        action: 'publish-article',
        data: pageData
      };

    case 'REGENERATE':
      if (!pageData?.title) {
        return 'Nenhum artigo para regenerar.';
      }
      return {
        action: 'generate-article',
        data: {
          type: pageData.sentiment ? 'news' : (pageData.level ? 'educational' : 'news'),
          topic: pageData.title,
          model: 'sonar'
        }
      };

    case 'STATS':
      return {
        action: 'show-stats',
        data: {}
      };

    case 'EDIT':
      if (!intent.parameters?.instruction) {
        return `Para editar um artigo, especifique o que deseja fazer.\n\n**Exemplos**:\n- "Remova as referências [1][2] do artigo sobre Bitcoin"\n- "Corrija os erros de gramática do artigo X"`;
      }
      return {
        action: 'edit-article',
        data: {
          query: intent.parameters.query,
          instruction: intent.parameters.instruction,
          articleNumber: intent.parameters.articleNumber
        }
      };

    default:
      return null;
  }
}

/**
 * POST /api/admin-chat
 * Chat com IA usando Perplexity API (com streaming)
 * Protegido: Apenas ADMIN e EDITOR
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verificar permissão de ADMIN ou EDITOR
    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json(
        { success: false, error: 'Sem permissão. Apenas ADMIN e EDITOR.' },
        { status: 403 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { success: false, error: 'Limite de requisições excedido. Tente novamente em 1 minuto.' },
        { status: 429 }
      );
    }

    // Obter API key
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key não configurada' },
        { status: 500 }
      );
    }

    const body: AdminChatRequest = await request.json();
    const { messages, pathname = '/dashboard', pageData, model = 'sonar' } = body;

    // Validação
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Mensagens obrigatórias' },
        { status: 400 }
      );
    }

    // Validar tamanho da última mensagem
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.content.length > 4000) {
      return NextResponse.json(
        { success: false, error: 'Mensagem muito longa (máximo 4000 caracteres)' },
        { status: 400 }
      );
    }

    // Processar intenção em linguagem natural
    const intentResult = processIntent(lastMessage.content, pageData);

    if (intentResult) {
      // Se for string, retornar diretamente (resposta pronta como validação)
      if (typeof intentResult === 'string') {
        return NextResponse.json({
          success: true,
          content: intentResult,
          isDirectResponse: true
        });
      }

      // Se for ação especial, processar
      if (typeof intentResult === 'object' && intentResult.action) {
        if (intentResult.action === 'generate-article') {
          // Retornar instrução para o frontend fazer a requisição
          return NextResponse.json({
            success: true,
            action: 'generate-article-request',
            data: intentResult.data
          });
        }

        if (intentResult.action === 'publish-article') {
          return NextResponse.json({
            success: true,
            action: 'publish-article',
            data: intentResult.data
          });
        }

        if (intentResult.action === 'list-articles') {
          return NextResponse.json({
            success: true,
            action: 'list-articles',
            data: intentResult.data
          });
        }

        if (intentResult.action === 'search-articles') {
          return NextResponse.json({
            success: true,
            action: 'search-articles',
            data: intentResult.data
          });
        }

        if (intentResult.action === 'delete-article') {
          return NextResponse.json({
            success: true,
            action: 'delete-article',
            data: intentResult.data
          });
        }

        if (intentResult.action === 'show-stats') {
          return NextResponse.json({
            success: true,
            action: 'show-stats',
            data: {}
          });
        }

        if (intentResult.action === 'confirm-delete') {
          return NextResponse.json({
            success: true,
            action: 'confirm-delete',
            data: intentResult.data
          });
        }

        if (intentResult.action === 'edit-article') {
          return NextResponse.json({
            success: true,
            action: 'edit-article',
            data: intentResult.data
          });
        }
      }
    }

    // Extrair contexto da página
    const context = extractPageContext(pathname, pageData);

    // Adicionar contexto do artigo se disponível
    let contextualizedSystemPrompt = context.systemPrompt;
    if (pageData?.content || pageData?.title) {
      contextualizedSystemPrompt += '\n\n' + formatArticleContext(pageData);
    }

    // Preparar mensagens com contexto
    // Garantir que todos os contents são strings válidas
    const validatedMessages = messages.map(msg => ({
      role: msg.role,
      content: String(msg.content || '') // Garantir que é string
    }));

    const contextualizedMessages: PerplexityMessage[] = [
      { role: 'system', content: String(contextualizedSystemPrompt || '') },
      ...validatedMessages
    ];

    // 🎯 Selecionar modelo otimizado baseado no contexto
    const intent = detectIntent(lastMessage.content);
    const modelConfig = selectOptimalModel(lastMessage.content, intent);

    // Chamar Perplexity com streaming
    const stream = await callPerplexityStreaming(
      {
        model: modelConfig.model,
        messages: contextualizedMessages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2000,
        search_recency_filter: modelConfig.search_recency_filter,
        return_related_questions: true // Sempre retornar perguntas relacionadas
      },
      apiKey
    );

    // Processar stream SSE
    const parsedStream = parsePerplexityStream(stream);

    // Retornar stream para o cliente
    return new Response(parsedStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in admin chat:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao processar chat'
      },
      { status: 500 }
    );
  }
}
