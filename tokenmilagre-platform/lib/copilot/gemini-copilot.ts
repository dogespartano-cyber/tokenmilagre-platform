/**
 * Gemini 2.5 Pro Copilot Client
 * Handles communication with Gemini API with function calling support
 */

import {
  GeminiRequest,
  GeminiResponse,
  GeminiMessage,
  GeminiPart,
  CopilotMessage,
  ToolCall,
  ToolExecutionStatus
} from './types';
import { toolsToFunctionDeclarations } from './tools';
import { buildSystemPrompt, buildContextualInfo } from './context-builder';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-pro'; // Gemini 2.5 Pro com function calling

/**
 * Send message to Gemini with function calling support
 */
export async function sendMessageToGemini(
  messages: CopilotMessage[],
  includeContext: boolean = true
): Promise<{
  response: string;
  toolCalls?: ToolCall[];
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não configurada');
  }

  try {
    // Convert messages to Gemini format
    const geminiMessages = convertToGeminiMessages(messages);

    // Build system instruction
    const systemPrompt = buildSystemPrompt();
    const contextInfo = includeContext ? buildContextualInfo() : '';

    // Build request
    const request: GeminiRequest = {
      contents: geminiMessages,
      tools: [
        {
          functionDeclarations: toolsToFunctionDeclarations()
        }
      ],
      systemInstruction: {
        parts: [
          {
            text: systemPrompt + contextInfo
          }
        ]
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    };

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: GeminiResponse = await response.json();

    // Extract response
    const candidate = data.candidates?.[0];
    if (!candidate) {
      throw new Error('Nenhuma resposta do Gemini');
    }

    const parts = candidate.content.parts;

    // Check for function calls
    const functionCalls = parts.filter(part => part.functionCall);
    if (functionCalls.length > 0) {
      // Gemini wants to call functions
      const toolCalls: ToolCall[] = functionCalls.map((part, index) => ({
        id: `call_${Date.now()}_${index}`,
        name: part.functionCall!.name,
        parameters: part.functionCall!.args,
        status: ToolExecutionStatus.PENDING,
        requiresConfirmation: false // Will be determined by tool executor
      }));

      return {
        response: '', // No text response when calling functions
        toolCalls,
        usage: {
          inputTokens: data.usageMetadata?.promptTokenCount || 0,
          outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0
        }
      };
    }

    // Regular text response
    const textParts = parts.filter(part => part.text);
    const responseText = textParts.map(part => part.text).join('\n');

    return {
      response: responseText,
      usage: {
        inputTokens: data.usageMetadata?.promptTokenCount || 0,
        outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0
      }
    };

  } catch (error: any) {
    console.error('[sendMessageToGemini] Error:', error);
    throw error;
  }
}

/**
 * Send message with function results back to Gemini
 */
export async function sendFunctionResultsToGemini(
  messages: CopilotMessage[],
  functionResults: Array<{
    name: string;
    response: any;
  }>
): Promise<{
  response: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não configurada');
  }

  try {
    // Convert messages to Gemini format
    const geminiMessages = convertToGeminiMessages(messages);

    // Add function responses to the last message
    const lastMessage = geminiMessages[geminiMessages.length - 1];

    // Add function responses as separate user message
    geminiMessages.push({
      role: 'user',
      parts: functionResults.map(result => ({
        functionResponse: {
          name: result.name,
          response: {
            content: result.response
          }
        }
      }))
    });

    // Build request (without tools this time - we just want the summary)
    const request: GeminiRequest = {
      contents: geminiMessages,
      systemInstruction: {
        parts: [
          {
            text: buildSystemPrompt()
          }
        ]
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    };

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: GeminiResponse = await response.json();

    // Extract response
    const candidate = data.candidates?.[0];
    if (!candidate) {
      throw new Error('Nenhuma resposta do Gemini');
    }

    const textParts = candidate.content.parts.filter(part => part.text);
    const responseText = textParts.map(part => part.text).join('\n');

    return {
      response: responseText,
      usage: {
        inputTokens: data.usageMetadata?.promptTokenCount || 0,
        outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0
      }
    };

  } catch (error: any) {
    console.error('[sendFunctionResultsToGemini] Error:', error);
    throw error;
  }
}

/**
 * Convert CopilotMessage[] to GeminiMessage[]
 */
function convertToGeminiMessages(messages: CopilotMessage[]): GeminiMessage[] {
  const geminiMessages: GeminiMessage[] = [];

  for (const message of messages) {
    // Skip system messages (they go in systemInstruction)
    if (message.role === 'system') {
      continue;
    }

    const parts: GeminiPart[] = [];

    // Add text content
    if (message.content) {
      parts.push({ text: message.content });
    }

    // Add tool calls if present
    if (message.toolCalls && message.toolCalls.length > 0) {
      for (const toolCall of message.toolCalls) {
        parts.push({
          functionCall: {
            name: toolCall.name,
            args: toolCall.parameters
          }
        });
      }
    }

    // Add tool results if present
    if (message.toolResults && message.toolResults.length > 0) {
      for (const toolResult of message.toolResults) {
        parts.push({
          functionResponse: {
            name: toolResult.name,
            response: {
              content: toolResult.result
            }
          }
        });
      }
    }

    geminiMessages.push({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts
    });
  }

  return geminiMessages;
}

/**
 * Stream message to Gemini (for real-time responses)
 * Note: Function calling doesn't work with streaming, so this is for text-only responses
 */
export async function streamMessageToGemini(
  messages: CopilotMessage[],
  onChunk: (chunk: string) => void,
  includeContext: boolean = true
): Promise<void> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não configurada');
  }

  try {
    // Convert messages to Gemini format
    const geminiMessages = convertToGeminiMessages(messages);

    // Build system instruction
    const systemPrompt = buildSystemPrompt();
    const contextInfo = includeContext ? buildContextualInfo() : '';

    // Build request (NO tools for streaming - function calling doesn't work with streaming)
    const request = {
      contents: geminiMessages,
      systemInstruction: {
        parts: [
          {
            text: systemPrompt + contextInfo
          }
        ]
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    };

    // Call Gemini API with streamGenerateContent
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    // Read stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          try {
            const data = JSON.parse(jsonStr);
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              onChunk(text);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

  } catch (error: any) {
    console.error('[streamMessageToGemini] Error:', error);
    throw error;
  }
}
