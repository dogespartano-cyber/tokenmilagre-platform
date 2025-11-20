/**
 * Perplexity API Adapter
 *
 * Encapsulates Perplexity AI API integration with structured logging,
 * error handling, and cost tracking
 */

import { ServiceLocator } from '@/lib/di/container';
import { calculateAPICost } from '@/lib/constants/pricing';

/**
 * Perplexity chat message
 */
export interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Perplexity API response
 */
export interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations?: string[];
}

/**
 * Perplexity streaming chunk
 */
export interface PerplexityStreamChunk {
  id: string;
  model: string;
  created: number;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }>;
  citations?: string[];
}

/**
 * Perplexity adapter configuration
 */
export interface PerplexityConfig {
  apiKey: string;
  model?: string;
  baseURL?: string;
  timeout?: number;
}

/**
 * Perplexity API usage tracking
 */
export interface PerplexityUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  model: string;
}

/**
 * Perplexity API Adapter
 * Provides type-safe access to Perplexity AI with citations
 */
export class PerplexityAdapter {
  private apiKey: string;
  private model: string;
  private baseURL: string;
  private timeout: number;
  private logger = ServiceLocator.getLogger();

  constructor(config: PerplexityConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'llama-3.1-sonar-large-128k-online';
    this.baseURL = config.baseURL || 'https://api.perplexity.ai';
    this.timeout = config.timeout || 60000; // 60s default for AI requests
  }

  /**
   * Send chat completion request
   *
   * @param messages - Array of chat messages
   * @param stream - Enable streaming (default: false)
   * @returns Completion response with citations
   *
   * @example
   * ```typescript
   * const adapter = new PerplexityAdapter({ apiKey: process.env.PERPLEXITY_API_KEY! });
   *
   * const response = await adapter.chat([
   *   { role: 'system', content: 'You are a crypto expert' },
   *   { role: 'user', content: 'What is Bitcoin?' }
   * ]);
   *
   * console.log(response.choices[0].message.content);
   * console.log(response.citations);
   * ```
   */
  async chat(
    messages: PerplexityMessage[],
    stream: boolean = false
  ): Promise<PerplexityResponse> {
    this.logger.info('Sending Perplexity chat request', {
      model: this.model,
      messageCount: messages.length,
      stream
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream,
          return_citations: true,
          return_images: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Perplexity API error: ${response.status} ${errorText}`);
      }

      const data: PerplexityResponse = await response.json();

      const usage = this.calculateUsage(data);

      this.logger.info('Perplexity chat completed successfully', {
        model: data.model,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        cost: usage.cost,
        citationCount: data.citations?.length || 0
      });

      return data;
    } catch (error) {
      this.logger.error('Error in Perplexity chat request', error as Error, {
        model: this.model,
        messageCount: messages.length
      });
      throw error;
    }
  }

  /**
   * Stream chat completion
   *
   * @param messages - Array of chat messages
   * @param onChunk - Callback for each streaming chunk
   * @returns Final usage statistics
   *
   * @example
   * ```typescript
   * const adapter = new PerplexityAdapter({ apiKey: process.env.PERPLEXITY_API_KEY! });
   *
   * const usage = await adapter.chatStream(
   *   [{ role: 'user', content: 'Explain Bitcoin' }],
   *   (chunk) => {
   *     if (chunk.choices[0]?.delta?.content) {
   *       process.stdout.write(chunk.choices[0].delta.content);
   *     }
   *   }
   * );
   *
   * console.log(`\nCost: $${usage.cost}`);
   * ```
   */
  async chatStream(
    messages: PerplexityMessage[],
    onChunk: (chunk: PerplexityStreamChunk) => void
  ): Promise<PerplexityUsage> {
    this.logger.info('Starting Perplexity streaming chat', {
      model: this.model,
      messageCount: messages.length
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: true,
          return_citations: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Perplexity API error: ${response.status} ${errorText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const totalTokens = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const chunk: PerplexityStreamChunk = JSON.parse(data);
                onChunk(chunk);
              } catch (e) {
                this.logger.warn('Failed to parse streaming chunk', { line });
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Estimate tokens (actual usage will be in final chunk, but may not be available)
      const inputTokens = messages.reduce((sum, msg) => sum + msg.content.length / 4, 0);
      const outputTokens = totalTokens;
      const cost = calculateAPICost(inputTokens, outputTokens, 'perplexity');

      this.logger.info('Perplexity streaming completed', {
        model: this.model,
        estimatedCost: cost
      });

      return {
        inputTokens: Math.round(inputTokens),
        outputTokens,
        totalTokens: Math.round(inputTokens + outputTokens),
        cost,
        model: this.model,
      };
    } catch (error) {
      this.logger.error('Error in Perplexity streaming', error as Error);
      throw error;
    }
  }

  /**
   * Calculate usage statistics from response
   */
  private calculateUsage(response: PerplexityResponse): PerplexityUsage {
    const inputTokens = response.usage.prompt_tokens;
    const outputTokens = response.usage.completion_tokens;
    const totalTokens = response.usage.total_tokens;
    const cost = calculateAPICost(inputTokens, outputTokens, 'perplexity');

    return {
      inputTokens,
      outputTokens,
      totalTokens,
      cost,
      model: response.model,
    };
  }
}
