/**
 * Admin Chat API Route
 *
 * Handles AI-powered chat for admin/editor users with:
 * - Service layer integration (partial - Phase 2)
 * - Zod validation for request body
 * - Structured logging with context
 * - Auth helpers for role-based access (EDITOR/ADMIN)
 * - Rate limiting utility
 * - Perplexity AI streaming (preserved for Phase 3)
 * - Intent detection (preserved for Phase 3)
 * - Action handlers (preserved for Phase 3)
 *
 * @see docs/PHASE2_DEBT.md for Phase 3 migration plan
 */

import { NextRequest, NextResponse } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { requireEditor } from '@/lib/helpers/auth-helpers'
import { errorResponse } from '@/lib/helpers/response-helpers'
import { chatRequestSchema } from '@/lib/schemas/chat-schemas'
import { checkRateLimit } from '@/lib/shared/utils/rate-limit'
import {
  callPerplexityStreaming,
  parsePerplexityStream,
  type PerplexityMessage,
  type PerplexityRequestOptions
} from '@/lib/shared/ai/perplexity-client'
import { extractPageContext, formatArticleContext } from '@/lib/domains/admin-chat/context'
import { validateArticleContent } from '@/lib/domains/articles/utils/content-validator'
import { detectIntent } from '@/lib/shared/ai/intent-detector'

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

// Rate limit configuration
const RATE_LIMIT = 10 // 10 requests
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

interface AdminChatRequest {
  messages: PerplexityMessage[]
  pathname?: string
  pageData?: Record<string, any>
  model?: 'sonar' | 'sonar-pro'
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
 * POST /api/admin-chat - AI-powered chat with Perplexity streaming
 *
 * Protected: ADMIN or EDITOR role
 * Rate Limited: 10 requests per minute per user
 *
 * Body params:
 * - messages: Array of chat messages (role + content)
 * - pathname: Optional current page path for context
 * - pageData: Optional page data for context enrichment
 * - model: Perplexity model (sonar/sonar-pro, default: sonar)
 *
 * Returns: Server-Sent Events (SSE) stream with AI responses
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const auth = await requireEditor(request)
  if (!auth.success) return auth.response

  const logger = ServiceLocator.getLogger()
  logger.setContext({ endpoint: '/api/admin-chat', method: 'POST', userId: auth.user.id })

  try {
    // Rate limiting
    if (!checkRateLimit(auth.user.id, RATE_LIMIT, RATE_LIMIT_WINDOW)) {
      logger.warn('Rate limit exceeded', {
        userId: auth.user.id,
        limit: RATE_LIMIT,
        windowMs: RATE_LIMIT_WINDOW
      })
      return NextResponse.json(
        { success: false, error: 'Limite de requisições excedido. Tente novamente em 1 minuto.' },
        { status: 429 }
      )
    }

    // Verify API key
    const apiKey = process.env.PERPLEXITY_API_KEY
    if (!apiKey) {
      logger.error('Perplexity API key not configured')
      return NextResponse.json(
        { success: false, error: 'API key não configurada' },
        { status: 500 }
      )
    }

    // Parse and validate request body
    const body = await request.json()

    const validation = ServiceLocator.getValidation()
    const validated = validation.validate(chatRequestSchema, body)

    const { messages, pathname = '/dashboard', pageData, model = 'sonar' } = validated

    // Get last message for intent detection and logging
    const lastMessage = messages[messages.length - 1]

    logger.info('Chat request received', {
      messageCount: messages.length,
      lastMessageLength: lastMessage.content.length,
      pathname,
      model,
      hasPageData: !!pageData
    })

    // Processar intenção em linguagem natural (preserved for Phase 3 - IntentService)
    const intentResult = processIntent(lastMessage.content, pageData)

    if (intentResult) {
      // Se for string, retornar diretamente (resposta pronta como validação)
      if (typeof intentResult === 'string') {
        logger.info('Direct response from intent processing', {
          intentType: 'validation',
          responseLength: intentResult.length
        })
        return NextResponse.json({
          success: true,
          content: intentResult,
          isDirectResponse: true
        })
      }

      // Se for ação especial, processar (preserved for Phase 3 - ActionService)
      if (typeof intentResult === 'object' && intentResult.action) {
        logger.info('Action detected from intent', {
          action: intentResult.action,
          hasData: !!intentResult.data
        })

        if (intentResult.action === 'generate-article') {
          // Retornar instrução para o frontend fazer a requisição
          return NextResponse.json({
            success: true,
            action: 'generate-article-request',
            data: intentResult.data
          })
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

    // 🎯 SOLUÇÃO DEFINITIVA: Se estiver no editor e tiver conteúdo, enriquecer a última mensagem
    if (context.pageType === 'editor' && pageData?.content && validatedMessages.length > 0) {
      const lastIndex = validatedMessages.length - 1;
      const lastUserMessage = validatedMessages[lastIndex];

      // Enriquecer a mensagem do usuário com o artigo completo
      const enrichedContent = `${lastUserMessage.content}\n\n---\n\n**ARTIGO COMPLETO ATUAL** (você DEVE retornar este artigo completo com suas edições):\n\n\`\`\`markdown\n${pageData.content}\n\`\`\`\n\n**LEMBRE-SE**: Retorne o artigo COMPLETO dentro de um bloco markdown, com TODAS as seções, incluindo as que não mudaram. Apenas a parte mencionada deve ter a edição, o resto fica igual.`;

      validatedMessages[lastIndex] = {
        ...lastUserMessage,
        content: enrichedContent
      };

      console.log('🎯 [API] Mensagem enriquecida com artigo completo. Tamanho:', enrichedContent.length);
    }

    const contextualizedMessages: PerplexityMessage[] = [
      { role: 'system', content: String(contextualizedSystemPrompt || '') },
      ...validatedMessages
    ];

    // 🎯 Selecionar modelo otimizado baseado no contexto (preserved for Phase 3)
    const intent = detectIntent(lastMessage.content)
    const modelConfig = selectOptimalModel(lastMessage.content, intent)

    logger.info('Calling Perplexity API', {
      model: modelConfig.model,
      searchRecency: modelConfig.search_recency_filter,
      intentAction: intent.action,
      intentConfidence: intent.confidence,
      contextualizedMessageCount: contextualizedMessages.length
    })

    // Chamar Perplexity com streaming (preserved for Phase 3 - ChatService)
    const stream = await callPerplexityStreaming(
      {
        model: modelConfig.model,
        messages: contextualizedMessages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2000,
        search_recency_filter: modelConfig.search_recency_filter,
        return_related_questions: true, // Sempre retornar perguntas relacionadas
        return_citations: false // Desativa referências [1][2][3]
      },
      apiKey
    )

    // Processar stream SSE
    const parsedStream = parsePerplexityStream(stream)

    const responseTime = Date.now() - startTime

    logger.info('Perplexity stream initiated', {
      responseTime,
      userId: auth.user.id
    })

    // Note: Context is not cleared here because streaming response continues after return
    // For SSE streams, context cleanup happens on connection close

    // Retornar stream para o cliente
    return new Response(parsedStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    logger.error('Error in admin chat', error as Error, {
      userId: auth.user.id,
      endpoint: '/api/admin-chat'
    })

    logger.clearContext()

    return errorResponse(error as Error)
  }
}
