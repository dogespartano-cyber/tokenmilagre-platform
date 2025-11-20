/**
 * MSW Mock Handlers for Perplexity AI API
 *
 * Mocks Perplexity API endpoints including streaming support
 */

import { http, HttpResponse } from 'msw';

/**
 * Mock Perplexity chat response
 */
const mockChatResponse = {
  id: 'chat_mock_123456789',
  model: 'llama-3.1-sonar-large-128k-online',
  created: Math.floor(Date.now() / 1000),
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content:
          'Bitcoin is a decentralized digital currency that operates on a peer-to-peer network. It was created in 2009 by an unknown person or group using the pseudonym Satoshi Nakamoto. Bitcoin transactions are verified by network nodes through cryptography and recorded on a public distributed ledger called a blockchain.',
      },
      finish_reason: 'stop',
    },
  ],
  usage: {
    prompt_tokens: 45,
    completion_tokens: 78,
    total_tokens: 123,
  },
  citations: [
    'https://bitcoin.org/en/how-it-works',
    'https://www.investopedia.com/terms/b/bitcoin.asp',
    'https://en.wikipedia.org/wiki/Bitcoin',
  ],
};

/**
 * Generate streaming response
 *
 * Simulates Server-Sent Events (SSE) format
 */
function createStreamingResponse(content: string, citations?: string[]) {
  const words = content.split(' ');
  const chunks: string[] = [];

  // First chunk with role
  chunks.push(
    'data: ' +
      JSON.stringify({
        id: 'chat_stream_mock_123',
        model: 'llama-3.1-sonar-large-128k-online',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            delta: { role: 'assistant' },
            finish_reason: null,
          },
        ],
      }) +
      '\n\n'
  );

  // Content chunks (word by word)
  words.forEach((word, index) => {
    chunks.push(
      'data: ' +
        JSON.stringify({
          id: 'chat_stream_mock_123',
          model: 'llama-3.1-sonar-large-128k-online',
          created: Math.floor(Date.now() / 1000),
          choices: [
            {
              index: 0,
              delta: { content: index === 0 ? word : ' ' + word },
              finish_reason: null,
            },
          ],
        }) +
        '\n\n'
    );
  });

  // Final chunk with citations
  if (citations && citations.length > 0) {
    chunks.push(
      'data: ' +
        JSON.stringify({
          id: 'chat_stream_mock_123',
          model: 'llama-3.1-sonar-large-128k-online',
          created: Math.floor(Date.now() / 1000),
          choices: [
            {
              index: 0,
              delta: {},
              finish_reason: 'stop',
            },
          ],
          citations,
        }) +
        '\n\n'
    );
  } else {
    chunks.push(
      'data: ' +
        JSON.stringify({
          id: 'chat_stream_mock_123',
          model: 'llama-3.1-sonar-large-128k-online',
          created: Math.floor(Date.now() / 1000),
          choices: [
            {
              index: 0,
              delta: {},
              finish_reason: 'stop',
            },
          ],
        }) +
        '\n\n'
    );
  }

  // End marker
  chunks.push('data: [DONE]\n\n');

  return chunks.join('');
}

/**
 * Perplexity API mock handlers
 */
export const perplexityHandlers = [
  // POST /chat/completions - Chat completion
  http.post('https://api.perplexity.ai/chat/completions', async ({ request }) => {
    const body = (await request.json()) as any;
    const { messages, stream, return_citations } = body;

    // Simulate error for invalid API key
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader === 'Bearer invalid_key') {
      return new HttpResponse(
        JSON.stringify({
          error: {
            message: 'Invalid API key',
            type: 'invalid_request_error',
            code: 'invalid_api_key',
          },
        }),
        { status: 401 }
      );
    }

    // Streaming response
    if (stream) {
      const lastMessage = messages[messages.length - 1];
      const content =
        lastMessage.role === 'user'
          ? `This is a streaming response to: "${lastMessage.content}". Bitcoin is a revolutionary technology.`
          : 'This is a streaming response.';

      const citations = return_citations
        ? ['https://bitcoin.org', 'https://ethereum.org']
        : undefined;

      const streamBody = createStreamingResponse(content, citations);

      return new HttpResponse(streamBody, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Regular response
    const lastMessage = messages[messages.length - 1];

    // Customize response based on user message
    let responseContent = mockChatResponse.choices[0].message.content;
    if (lastMessage.role === 'user') {
      if (lastMessage.content.toLowerCase().includes('ethereum')) {
        responseContent =
          'Ethereum is a decentralized platform that runs smart contracts. It was proposed in 2013 by Vitalik Buterin and went live in 2015.';
      } else if (lastMessage.content.toLowerCase().includes('error')) {
        // Simulate an error scenario for testing
        return new HttpResponse(
          JSON.stringify({
            error: {
              message: 'Rate limit exceeded',
              type: 'rate_limit_error',
              code: 'rate_limit',
            },
          }),
          { status: 429 }
        );
      }
    }

    const response = {
      ...mockChatResponse,
      created: Math.floor(Date.now() / 1000),
      choices: [
        {
          ...mockChatResponse.choices[0],
          message: {
            ...mockChatResponse.choices[0].message,
            content: responseContent,
          },
        },
      ],
      citations: return_citations ? mockChatResponse.citations : undefined,
    };

    return HttpResponse.json(response);
  }),
];

/**
 * Mock data generators for custom test scenarios
 */
export const perplexityMockData = {
  /**
   * Generate custom chat response
   */
  generateChatResponse(content: string, citations?: string[]) {
    return {
      id: `chat_custom_${Date.now()}`,
      model: 'llama-3.1-sonar-large-128k-online',
      created: Math.floor(Date.now() / 1000),
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: Math.floor(content.length / 4),
        completion_tokens: Math.floor(content.length / 3),
        total_tokens: Math.floor((content.length / 4) + (content.length / 3)),
      },
      citations: citations || [],
    };
  },

  /**
   * Generate error response
   */
  generateErrorResponse(message: string, code: string = 'api_error', status: number = 500) {
    return {
      error: {
        message,
        type: 'api_error',
        code,
      },
      status,
    };
  },

  /**
   * Calculate expected usage
   */
  calculateUsage(messages: any[]) {
    const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    const promptTokens = Math.floor(totalChars / 4);
    const completionTokens = Math.floor(mockChatResponse.choices[0].message.content.length / 4);

    return {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens,
    };
  },
};
