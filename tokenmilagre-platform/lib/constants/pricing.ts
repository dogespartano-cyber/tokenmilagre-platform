/**
 * AI API Pricing Constants
 *
 * Centralized pricing configuration for AI services
 * Prices are in USD per million tokens
 */

export const PERPLEXITY_PRICING = {
  /** Input token cost per million tokens (USD) */
  INPUT_COST_PER_MILLION: 3,

  /** Output token cost per million tokens (USD) */
  OUTPUT_COST_PER_MILLION: 15,

  /** Base request cost (USD) */
  BASE_REQUEST_COST: 0.005,
} as const;

export const OPENAI_PRICING = {
  /** GPT-4 input cost per million tokens (USD) */
  GPT4_INPUT_COST_PER_MILLION: 30,

  /** GPT-4 output cost per million tokens (USD) */
  GPT4_OUTPUT_COST_PER_MILLION: 60,

  /** GPT-3.5-turbo input cost per million tokens (USD) */
  GPT35_INPUT_COST_PER_MILLION: 0.5,

  /** GPT-3.5-turbo output cost per million tokens (USD) */
  GPT35_OUTPUT_COST_PER_MILLION: 1.5,
} as const;

export const GEMINI_PRICING = {
  /** Gemini Pro input cost per million tokens (USD) */
  PRO_INPUT_COST_PER_MILLION: 0.2,

  /** Gemini Pro output cost per million tokens (USD) */
  PRO_OUTPUT_COST_PER_MILLION: 0.4,
} as const;

/**
 * Calculate API usage cost
 *
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of output tokens
 * @param service - AI service ('perplexity' | 'openai-gpt4' | 'openai-gpt35' | 'gemini')
 * @returns Cost in USD
 */
export function calculateAPICost(
  inputTokens: number,
  outputTokens: number,
  service: 'perplexity' | 'openai-gpt4' | 'openai-gpt35' | 'gemini'
): number {
  let inputCost = 0;
  let outputCost = 0;
  let baseCost = 0;

  switch (service) {
    case 'perplexity':
      inputCost = (inputTokens / 1000000) * PERPLEXITY_PRICING.INPUT_COST_PER_MILLION;
      outputCost = (outputTokens / 1000000) * PERPLEXITY_PRICING.OUTPUT_COST_PER_MILLION;
      baseCost = PERPLEXITY_PRICING.BASE_REQUEST_COST;
      break;

    case 'openai-gpt4':
      inputCost = (inputTokens / 1000000) * OPENAI_PRICING.GPT4_INPUT_COST_PER_MILLION;
      outputCost = (outputTokens / 1000000) * OPENAI_PRICING.GPT4_OUTPUT_COST_PER_MILLION;
      break;

    case 'openai-gpt35':
      inputCost = (inputTokens / 1000000) * OPENAI_PRICING.GPT35_INPUT_COST_PER_MILLION;
      outputCost = (outputTokens / 1000000) * OPENAI_PRICING.GPT35_OUTPUT_COST_PER_MILLION;
      break;

    case 'gemini':
      inputCost = (inputTokens / 1000000) * GEMINI_PRICING.PRO_INPUT_COST_PER_MILLION;
      outputCost = (inputTokens / 1000000) * GEMINI_PRICING.PRO_OUTPUT_COST_PER_MILLION;
      break;
  }

  return inputCost + outputCost + baseCost;
}
