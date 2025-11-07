/**
 * Copilot Chat API
 * Handles chat with Gemini 2.5 Pro Copilot with function calling support
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendMessageToGemini, sendFunctionResultsToGemini } from '@/lib/copilot/gemini-copilot';
import { executeTool, createPendingActivity } from '@/lib/copilot/tool-executor';
import { CopilotMessage, ToolExecutionContext } from '@/lib/copilot/types';
import { getToolByName } from '@/lib/copilot/tools';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // 2. Authorization (only ADMIN)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Apenas ADMIN pode usar o Copilot' }, { status: 403 });
    }

    // 3. Rate limiting - AI preset (10 req/hour)
    const rateLimitResult = await rateLimit(request, RateLimitPresets.AI, session.user.id);
    if (rateLimitResult) return rateLimitResult;

    // 4. Parse body
    const body = await request.json();
    const { messages, executeTools } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
    }

    // Validate last message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'Última mensagem deve ser do usuário' }, { status: 400 });
    }

    // 5. Build execution context
    const context: ToolExecutionContext = {
      userId: session.user.id,
      userName: session.user.name || session.user.email,
      userRole: session.user.role,
      sessionId: `session_${Date.now()}`,
      timestamp: new Date()
    };

    // 6. Send to Gemini
    const geminiResponse = await sendMessageToGemini(messages, true);

    // 7. Check if Gemini wants to call functions
    if (geminiResponse.toolCalls && geminiResponse.toolCalls.length > 0) {
      console.log('[Copilot API] Gemini requested function calls:', geminiResponse.toolCalls.map(tc => tc.name));

      // Process each tool call
      const toolResults = [];

      for (const toolCall of geminiResponse.toolCalls) {
        const tool = getToolByName(toolCall.name);

        if (!tool) {
          toolResults.push({
            toolCallId: toolCall.id,
            name: toolCall.name,
            result: {
              success: false,
              error: `Ferramenta "${toolCall.name}" não encontrada`
            }
          });
          continue;
        }

        // Execute tool with permission check
        const result = await executeTool(
          toolCall.name,
          toolCall.parameters,
          context
        );

        // Check if requires confirmation
        if (result.requiresConfirmation) {
          // Create pending activity
          const { activityId, confirmationMessage } = await createPendingActivity(
            toolCall.name,
            toolCall.parameters,
            context
          );

          // Return to frontend for user confirmation
          return NextResponse.json({
            success: true,
            requiresConfirmation: true,
            confirmationData: {
              activityId,
              toolName: toolCall.name,
              parameters: toolCall.parameters,
              message: confirmationMessage,
              permissionLevel: tool.permission
            }
          });
        }

        // Tool executed successfully (AUTO permission)
        toolResults.push({
          toolCallId: toolCall.id,
          name: toolCall.name,
          result
        });
      }

      // If executeTools is false, return tool calls for frontend to handle
      if (executeTools === false) {
        return NextResponse.json({
          success: true,
          toolCalls: geminiResponse.toolCalls,
          usage: geminiResponse.usage
        });
      }

      // Send tool results back to Gemini for summary
      const functionResults = toolResults.map(tr => ({
        name: tr.name,
        response: tr.result
      }));

      const finalResponse = await sendFunctionResultsToGemini(messages, functionResults);

      return NextResponse.json({
        success: true,
        message: finalResponse.response,
        toolCalls: geminiResponse.toolCalls,
        toolResults,
        usage: {
          initial: geminiResponse.usage,
          summary: finalResponse.usage
        }
      });
    }

    // 8. Regular text response (no function calls)
    return NextResponse.json({
      success: true,
      message: geminiResponse.response,
      usage: geminiResponse.usage
    });

  } catch (error: any) {
    console.error('[Copilot API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar chat' },
      { status: 500 }
    );
  }
}
