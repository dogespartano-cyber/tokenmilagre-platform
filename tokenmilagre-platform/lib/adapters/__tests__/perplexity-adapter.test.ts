/**
 * Unit Tests for Perplexity Adapter
 *
 * Tests Perplexity AI API integration with mocked HTTP responses
 */

import { PerplexityAdapter } from '../perplexity-adapter';
import { server } from '@/__tests__/setup-msw';
import { http, HttpResponse } from 'msw';

// Mock the logger
jest.mock('@/lib/di/container', () => ({
  ServiceLocator: {
    getLogger: () => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    }),
  },
}));

// Mock the pricing calculator
jest.mock('@/lib/constants/pricing', () => ({
  calculateAPICost: jest.fn((input: number, output: number) => {
    // Simple mock: $0.001 per token
    return (input + output) * 0.001;
  }),
}));

describe('PerplexityAdapter', () => {
  const TEST_API_KEY = 'test_api_key_123';
  let adapter: PerplexityAdapter;

  beforeEach(() => {
    adapter = new PerplexityAdapter({ apiKey: TEST_API_KEY });
  });

  describe('constructor', () => {
    it('should create instance with required apiKey', () => {
      expect(adapter).toBeInstanceOf(PerplexityAdapter);
    });

    it('should accept custom model', () => {
      const customAdapter = new PerplexityAdapter({
        apiKey: TEST_API_KEY,
        model: 'llama-3.1-sonar-small-128k-online',
      });
      expect(customAdapter).toBeInstanceOf(PerplexityAdapter);
    });

    it('should accept custom baseURL', () => {
      const customAdapter = new PerplexityAdapter({
        apiKey: TEST_API_KEY,
        baseURL: 'https://custom-perplexity.com',
      });
      expect(customAdapter).toBeInstanceOf(PerplexityAdapter);
    });

    it('should accept custom timeout', () => {
      const customAdapter = new PerplexityAdapter({
        apiKey: TEST_API_KEY,
        timeout: 30000,
      });
      expect(customAdapter).toBeInstanceOf(PerplexityAdapter);
    });
  });

  describe('chat', () => {
    it('should send chat request successfully', async () => {
      const messages = [
        { role: 'system' as const, content: 'You are a crypto expert' },
        { role: 'user' as const, content: 'What is Bitcoin?' },
      ];

      const response = await adapter.chat(messages);

      expect(response).toBeDefined();
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('model');
      expect(response).toHaveProperty('choices');
      expect(response.choices).toHaveLength(1);
      expect(response.choices[0]).toHaveProperty('message');
      expect(response.choices[0].message).toHaveProperty('content');
    });

    it('should include citations when requested', async () => {
      const messages = [
        { role: 'user' as const, content: 'Explain Bitcoin with sources' },
      ];

      const response = await adapter.chat(messages);

      expect(response).toHaveProperty('citations');
      expect(Array.isArray(response.citations)).toBe(true);
      expect(response.citations?.length).toBeGreaterThan(0);
    });

    it('should include usage statistics', async () => {
      const messages = [
        { role: 'user' as const, content: 'What is Ethereum?' },
      ];

      const response = await adapter.chat(messages);

      expect(response).toHaveProperty('usage');
      expect(response.usage).toHaveProperty('prompt_tokens');
      expect(response.usage).toHaveProperty('completion_tokens');
      expect(response.usage).toHaveProperty('total_tokens');
      expect(typeof response.usage.prompt_tokens).toBe('number');
      expect(typeof response.usage.completion_tokens).toBe('number');
    });

    it('should customize response based on user message', async () => {
      const messages = [
        { role: 'user' as const, content: 'Tell me about Ethereum' },
      ];

      const response = await adapter.chat(messages);

      expect(response.choices[0].message.content.toLowerCase()).toContain('ethereum');
    });

    it('should handle authentication errors', async () => {
      const invalidAdapter = new PerplexityAdapter({ apiKey: 'invalid_key' });

      const messages = [
        { role: 'user' as const, content: 'What is Bitcoin?' },
      ];

      await expect(invalidAdapter.chat(messages)).rejects.toThrow('Invalid API key');
    });

    it('should handle rate limit errors', async () => {
      const messages = [
        { role: 'user' as const, content: 'trigger error in rate limit' },
      ];

      await expect(adapter.chat(messages)).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      server.use(
        http.post('https://api.perplexity.ai/chat/completions', () => {
          return HttpResponse.error();
        })
      );

      const messages = [
        { role: 'user' as const, content: 'What is Bitcoin?' },
      ];

      await expect(adapter.chat(messages)).rejects.toThrow();
    });

    it('should handle timeout', async () => {
      const timeoutAdapter = new PerplexityAdapter({
        apiKey: TEST_API_KEY,
        timeout: 1,
      });

      server.use(
        http.post('https://api.perplexity.ai/chat/completions', async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json({});
        })
      );

      const messages = [
        { role: 'user' as const, content: 'What is Bitcoin?' },
      ];

      await expect(timeoutAdapter.chat(messages)).rejects.toThrow();
    });
  });

  describe('chatStream', () => {
    it('should stream chat response successfully', async () => {
      const messages = [
        { role: 'user' as const, content: 'Explain Bitcoin' },
      ];

      const chunks: any[] = [];
      const usage = await adapter.chatStream(messages, (chunk) => {
        chunks.push(chunk);
      });

      expect(chunks.length).toBeGreaterThan(0);
      expect(usage).toBeDefined();
      expect(usage).toHaveProperty('inputTokens');
      expect(usage).toHaveProperty('outputTokens');
      expect(usage).toHaveProperty('cost');
      expect(usage).toHaveProperty('model');
    });

    it('should receive delta content in chunks', async () => {
      const messages = [
        { role: 'user' as const, content: 'What is DeFi?' },
      ];

      let receivedContent = false;
      await adapter.chatStream(messages, (chunk) => {
        if (chunk.choices[0]?.delta?.content) {
          receivedContent = true;
        }
      });

      expect(receivedContent).toBe(true);
    });

    it('should handle role in first chunk', async () => {
      const messages = [
        { role: 'user' as const, content: 'Explain blockchain' },
      ];

      let receivedRole = false;
      await adapter.chatStream(messages, (chunk) => {
        if (chunk.choices[0]?.delta?.role === 'assistant') {
          receivedRole = true;
        }
      });

      expect(receivedRole).toBe(true);
    });

    it('should handle finish reason', async () => {
      const messages = [
        { role: 'user' as const, content: 'What is a smart contract?' },
      ];

      let hasFinishReason = false;
      await adapter.chatStream(messages, (chunk) => {
        if (chunk.choices[0]?.finish_reason === 'stop') {
          hasFinishReason = true;
        }
      });

      expect(hasFinishReason).toBe(true);
    });

    it('should handle authentication errors', async () => {
      const invalidAdapter = new PerplexityAdapter({ apiKey: 'invalid_key' });

      const messages = [
        { role: 'user' as const, content: 'What is Bitcoin?' },
      ];

      await expect(
        invalidAdapter.chatStream(messages, () => {})
      ).rejects.toThrow('Invalid API key');
    });

    it('should estimate token usage', async () => {
      const messages = [
        { role: 'user' as const, content: 'Short question?' },
      ];

      const usage = await adapter.chatStream(messages, () => {});

      expect(usage.inputTokens).toBeGreaterThan(0);
      expect(usage.totalTokens).toBeGreaterThan(0);
      expect(usage.cost).toBeGreaterThan(0);
    });

    it('should handle network errors during streaming', async () => {
      server.use(
        http.post('https://api.perplexity.ai/chat/completions', () => {
          return HttpResponse.error();
        })
      );

      const messages = [
        { role: 'user' as const, content: 'What is Bitcoin?' },
      ];

      await expect(
        adapter.chatStream(messages, () => {})
      ).rejects.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle empty messages array', async () => {
      const messages: any[] = [];

      const response = await adapter.chat(messages);
      expect(response).toBeDefined();
    });

    it('should handle very long messages', async () => {
      const longContent = 'Bitcoin '.repeat(1000);
      const messages = [
        { role: 'user' as const, content: longContent },
      ];

      const response = await adapter.chat(messages);
      expect(response).toBeDefined();
    });

    it('should handle multiple messages', async () => {
      const messages = [
        { role: 'system' as const, content: 'You are a helpful assistant' },
        { role: 'user' as const, content: 'What is Bitcoin?' },
        { role: 'assistant' as const, content: 'Bitcoin is a cryptocurrency.' },
        { role: 'user' as const, content: 'Tell me more' },
      ];

      const response = await adapter.chat(messages);
      expect(response).toBeDefined();
      expect(response.choices).toHaveLength(1);
    });

    it('should handle special characters in content', async () => {
      const messages = [
        { role: 'user' as const, content: 'What is Bitcoin? 🚀 💰 #crypto @user' },
      ];

      const response = await adapter.chat(messages);
      expect(response).toBeDefined();
    });
  });

  describe('response validation', () => {
    it('should have valid response structure', async () => {
      const messages = [
        { role: 'user' as const, content: 'What is Bitcoin?' },
      ];

      const response = await adapter.chat(messages);

      expect(response).toMatchObject({
        id: expect.any(String),
        model: expect.any(String),
        created: expect.any(Number),
        choices: expect.arrayContaining([
          expect.objectContaining({
            index: expect.any(Number),
            message: expect.objectContaining({
              role: expect.any(String),
              content: expect.any(String),
            }),
            finish_reason: expect.any(String),
          }),
        ]),
        usage: expect.objectContaining({
          prompt_tokens: expect.any(Number),
          completion_tokens: expect.any(Number),
          total_tokens: expect.any(Number),
        }),
      });
    });

    it('should have consistent token counts', async () => {
      const messages = [
        { role: 'user' as const, content: 'What is Bitcoin?' },
      ];

      const response = await adapter.chat(messages);

      const { prompt_tokens, completion_tokens, total_tokens } = response.usage;

      expect(total_tokens).toBe(prompt_tokens + completion_tokens);
    });
  });
});
