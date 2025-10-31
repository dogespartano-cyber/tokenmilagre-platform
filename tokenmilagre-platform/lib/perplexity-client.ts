/**
 * Cliente Perplexity API - Configuração Compartilhada
 * Usado por: generate-article, admin-chat
 */

export interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface PerplexityRequestOptions {
  model?: 'sonar' | 'sonar-pro';
  messages: PerplexityMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  search_recency_filter?: 'day' | 'week' | 'month';
  return_related_questions?: boolean;
}

export interface PerplexityUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  usage: PerplexityUsage;
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }[];
  related_questions?: string[];
}

/**
 * Calcula custo estimado da requisição
 */
export function calculatePerplexityCost(
  inputTokens: number,
  outputTokens: number,
  model: 'sonar' | 'sonar-pro'
): number {
  let inputCost: number;
  let outputCost: number;

  if (model === 'sonar-pro') {
    inputCost = (inputTokens / 1000000) * 3;
    outputCost = (outputTokens / 1000000) * 15;
  } else {
    // sonar (online)
    inputCost = (inputTokens / 1000000) * 1;
    outputCost = (outputTokens / 1000000) * 1;
  }

  const requestCost = 0.005; // Taxa de requisição
  return inputCost + outputCost + requestCost;
}

/**
 * Chama Perplexity API (sem streaming)
 */
export async function callPerplexity(
  options: PerplexityRequestOptions,
  apiKey: string
): Promise<PerplexityResponse> {
  const {
    model = 'sonar',
    messages,
    temperature = 0.7,
    top_p = 0.9,
    max_tokens = 2000,
    search_recency_filter,
    return_related_questions = false
  } = options;

  // Validar que todas as mensagens têm content como string
  const validatedMessages = messages.map(msg => ({
    role: msg.role,
    content: typeof msg.content === 'string' ? msg.content : String(msg.content || '')
  }));

  const body: any = {
    model,
    messages: validatedMessages,
    temperature,
    top_p,
    max_tokens,
  };

  // Adicionar parâmetros opcionais apenas se fornecidos
  if (search_recency_filter) {
    body.search_recency_filter = search_recency_filter;
  }

  if (return_related_questions) {
    body.return_related_questions = true;
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Perplexity pode retornar erros em formatos diferentes
    const errorMessage = errorData.error?.message || errorData.detail || JSON.stringify(errorData);
    throw new Error(`Perplexity API error: ${errorMessage}`);
  }

  return await response.json();
}

/**
 * Chama Perplexity API com streaming
 * Retorna ReadableStream para processar chunks
 */
export async function callPerplexityStreaming(
  options: PerplexityRequestOptions,
  apiKey: string
): Promise<ReadableStream> {
  const {
    model = 'sonar',
    messages,
    temperature = 0.7,
    top_p = 0.9,
    max_tokens = 2000,
    search_recency_filter,
    return_related_questions = false
  } = options;

  // Validar que todas as mensagens têm content como string
  const validatedMessages = messages.map(msg => ({
    role: msg.role,
    content: typeof msg.content === 'string' ? msg.content : String(msg.content || '')
  }));

  const body: any = {
    model,
    messages: validatedMessages,
    temperature,
    top_p,
    max_tokens,
    stream: true, // Habilita streaming
  };

  // Adicionar parâmetros opcionais apenas se fornecidos
  if (search_recency_filter) {
    body.search_recency_filter = search_recency_filter;
  }

  if (return_related_questions) {
    body.return_related_questions = true;
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Perplexity pode retornar erros em formatos diferentes
    const errorMessage = errorData.error?.message || errorData.detail || JSON.stringify(errorData);
    throw new Error(`Perplexity API error: ${errorMessage}`);
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  return response.body;
}

/**
 * Processa stream SSE (Server-Sent Events) do Perplexity
 */
export function parsePerplexityStream(stream: ReadableStream): ReadableStream {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  return new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            controller.close();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim() || !line.startsWith('data: ')) continue;

            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              controller.close();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(new TextEncoder().encode(content));
              }
            } catch (err) {
              // Ignorar erros de parsing silenciosamente
            }
          }
        }
      } catch (error) {
        controller.error(error);
      }
    }
  });
}
