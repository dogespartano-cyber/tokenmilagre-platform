/**
 * Validação de variáveis de ambiente usando Zod
 *
 * Este arquivo valida todas as variáveis de ambiente críticas no startup
 * da aplicação, garantindo que a aplicação não inicie com configuração
 * incorreta ou ausente.
 */

import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),
  DIRECT_URL: z.string().url('DIRECT_URL deve ser uma URL válida').optional(),

  // NextAuth
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL deve ser uma URL válida'),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET deve ter pelo menos 32 caracteres'),

  // Solana (públicas)
  NEXT_PUBLIC_SOLANA_NETWORK: z.enum(['mainnet-beta', 'devnet', 'testnet']),
  NEXT_PUBLIC_TOKEN_ADDRESS: z
    .string()
    .min(32, 'NEXT_PUBLIC_TOKEN_ADDRESS inválido'),
  NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url().optional(),

  // APIs de IA (opcionais mas recomendadas)
  GEMINI_API_KEY: z.string().optional(),
  PERPLEXITY_API_KEY: z.string().optional(),

  // Fact-checking APIs (opcionais)
  GOOGLE_SEARCH_API_KEY: z.string().optional(),
  GOOGLE_SEARCH_ENGINE_ID: z.string().optional(),
  BRAVE_SEARCH_API_KEY: z.string().optional(),
  ENABLE_FACT_CHECK: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),

  // URLs públicas
  NEXT_PUBLIC_API_URL: z.string().url().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),

  // Sentry (opcional)
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
});

/**
 * Parse e valida as variáveis de ambiente
 *
 * @throws {ZodError} Se alguma variável obrigatória estiver faltando ou inválida
 */
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação de variáveis de ambiente:');
      console.error('');

      error.issues.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });

      console.error('');
      console.error('💡 Verifique seu arquivo .env e corrija os erros acima.');
      console.error('');

      // Em produção, falha hard. Em dev, apenas avisa.
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Configuração de ambiente inválida');
      }
    }

    throw error;
  }
}

/**
 * Variáveis de ambiente validadas e tipadas
 *
 * Use este objeto em vez de process.env para ter autocomplete e type safety
 */
export const env = validateEnv();

/**
 * Helper para verificar se estamos em produção
 */
export const isProd = env.NODE_ENV === 'production';

/**
 * Helper para verificar se estamos em desenvolvimento
 */
export const isDev = env.NODE_ENV === 'development';

/**
 * Helper para verificar se estamos em teste
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Helper para verificar se fact-checking está habilitado
 */
export const isFactCheckEnabled = env.ENABLE_FACT_CHECK === true;

/**
 * Helper para verificar se APIs de IA estão configuradas
 */
export const hasGeminiAPI = !!env.GEMINI_API_KEY;
export const hasPerplexityAPI = !!env.PERPLEXITY_API_KEY;
