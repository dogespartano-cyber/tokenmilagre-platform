/**
 * MSW Mock Handlers for Google Gemini API
 *
 * Mocks Gemini Image Generation API for testing
 */

import { http, HttpResponse } from 'msw';

/**
 * Mock base64 image (1x1 transparent PNG)
 * This is a valid base64 encoded image for testing
 */
const MOCK_IMAGE_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/**
 * Mock Gemini image generation response
 */
const mockImageResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: 'Generated a professional crypto cover image with gradient colors',
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: MOCK_IMAGE_BASE64,
            },
          },
        ],
        role: 'model',
      },
      finishReason: 'STOP',
      index: 0,
      safetyRatings: [
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          probability: 'NEGLIGIBLE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          probability: 'NEGLIGIBLE',
        },
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          probability: 'NEGLIGIBLE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          probability: 'NEGLIGIBLE',
        },
      ],
    },
  ],
  usageMetadata: {
    promptTokenCount: 150,
    candidatesTokenCount: 50,
    totalTokenCount: 200,
  },
};

/**
 * Gemini API mock handlers
 */
export const geminiHandlers = [
  // POST /v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent
  http.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent',
    async ({ request }) => {
      const url = new URL(request.url);
      const apiKey = url.searchParams.get('key');

      // Simulate error for invalid API key
      if (!apiKey || apiKey === 'invalid_key') {
        return HttpResponse.json(
          {
            error: {
              code: 401,
              message: 'API key not valid. Please pass a valid API key.',
              status: 'UNAUTHENTICATED',
            },
          },
          { status: 401 }
        );
      }

      const body = (await request.json()) as any;
      const prompt = body.contents?.[0]?.parts?.[0]?.text || '';

      // Simulate error for empty prompt
      if (!prompt || prompt.trim() === '') {
        return HttpResponse.json(
          {
            error: {
              code: 400,
              message: 'Invalid request: prompt is required',
              status: 'INVALID_ARGUMENT',
            },
          },
          { status: 400 }
        );
      }

      // Simulate safety block for unsafe prompts
      if (prompt.toLowerCase().includes('unsafe') || prompt.toLowerCase().includes('harmful')) {
        return HttpResponse.json({
          candidates: [
            {
              content: {
                parts: [],
                role: 'model',
              },
              finishReason: 'SAFETY',
              index: 0,
              safetyRatings: [
                {
                  category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                  probability: 'HIGH',
                  blocked: true,
                },
              ],
            },
          ],
        });
      }

      // Check for response modalities
      const responseModalities = body.generationConfig?.responseModalities || [];
      const hasImageModality = responseModalities.includes('IMAGE');

      if (!hasImageModality) {
        return HttpResponse.json(
          {
            error: {
              code: 400,
              message: 'responseModalities must include IMAGE for image generation',
              status: 'INVALID_ARGUMENT',
            },
          },
          { status: 400 }
        );
      }

      // Generate custom response based on prompt content
      const customResponse = { ...mockImageResponse };

      // Customize text response based on prompt keywords
      if (prompt.toLowerCase().includes('bitcoin')) {
        customResponse.candidates[0].content.parts[0].text =
          'Generated a Bitcoin-themed cover image with golden-red gradient';
      } else if (prompt.toLowerCase().includes('ethereum')) {
        customResponse.candidates[0].content.parts[0].text =
          'Generated an Ethereum-themed cover image with blue gradient';
      } else if (prompt.toLowerCase().includes('defi')) {
        customResponse.candidates[0].content.parts[0].text =
          'Generated a DeFi-themed cover image with emerald green gradient';
      }

      return HttpResponse.json(customResponse);
    }
  ),
];

/**
 * Mock data generators for custom test scenarios
 */
export const geminiMockData = {
  /**
   * Generate custom image response
   */
  generateImageResponse(
    imageBase64: string = MOCK_IMAGE_BASE64,
    mimeType: string = 'image/png',
    textDescription?: string
  ) {
    return {
      candidates: [
        {
          content: {
            parts: [
              {
                text:
                  textDescription ||
                  'Generated a professional crypto cover image with gradient colors',
              },
              {
                inlineData: {
                  mimeType,
                  data: imageBase64,
                },
              },
            ],
            role: 'model',
          },
          finishReason: 'STOP',
          index: 0,
          safetyRatings: [
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              probability: 'NEGLIGIBLE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              probability: 'NEGLIGIBLE',
            },
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              probability: 'NEGLIGIBLE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              probability: 'NEGLIGIBLE',
            },
          ],
        },
      ],
      usageMetadata: {
        promptTokenCount: 150,
        candidatesTokenCount: 50,
        totalTokenCount: 200,
      },
    };
  },

  /**
   * Generate error response
   */
  generateErrorResponse(code: number, message: string, status: string) {
    return {
      error: {
        code,
        message,
        status,
      },
    };
  },

  /**
   * Generate safety-blocked response
   */
  generateSafetyBlockedResponse(category: string = 'HARM_CATEGORY_DANGEROUS_CONTENT') {
    return {
      candidates: [
        {
          content: {
            parts: [],
            role: 'model',
          },
          finishReason: 'SAFETY',
          index: 0,
          safetyRatings: [
            {
              category,
              probability: 'HIGH',
              blocked: true,
            },
          ],
        },
      ],
    };
  },

  /**
   * Get mock base64 image
   */
  getMockImage() {
    return MOCK_IMAGE_BASE64;
  },

  /**
   * Create larger mock image (useful for size testing)
   */
  createLargeMockImage(sizeInKB: number = 100) {
    // Base64 characters needed for desired size
    const base64Length = Math.floor((sizeInKB * 1024 * 4) / 3);
    return 'A'.repeat(base64Length);
  },
};
