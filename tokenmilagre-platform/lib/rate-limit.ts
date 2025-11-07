/**
 * Sistema de Rate Limiting para API Routes
 *
 * Implementação simples usando Map em memória.
 * Para produção com múltiplas instâncias, migre para Redis/Upstash.
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  /**
   * Número máximo de requisições permitidas
   */
  max: number;

  /**
   * Janela de tempo em segundos
   */
  windowSeconds: number;

  /**
   * Mensagem de erro customizada
   */
  message?: string;
}

interface RequestLog {
  count: number;
  resetTime: number;
}

/**
 * Armazenamento em memória (simples, funciona em single instance)
 * Para multi-instance/serverless, use Redis/Upstash
 */
const requestLogs = new Map<string, RequestLog>();

/**
 * Limpa entradas expiradas (rodado periodicamente)
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, log] of requestLogs.entries()) {
    if (now > log.resetTime) {
      requestLogs.delete(key);
    }
  }
}

// Limpar a cada 5 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Obtém identificador único do cliente (IP ou user ID)
 */
function getClientIdentifier(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;

  // Tentar obter IP real (considerando proxies/CDN)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] :
             request.headers.get('x-real-ip') ||
             'unknown';

  return `ip:${ip}`;
}

/**
 * Middleware de rate limiting
 *
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const limitResult = await rateLimit(request, {
 *     max: 10,
 *     windowSeconds: 60
 *   });
 *
 *   if (limitResult) return limitResult; // Retorna 429 se excedido
 *
 *   // Continue com a lógica da API
 * }
 * ```
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  userId?: string
): Promise<NextResponse | null> {
  const identifier = getClientIdentifier(request, userId);
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  const log = requestLogs.get(identifier);

  if (!log || now > log.resetTime) {
    // Primeira requisição ou janela expirada
    requestLogs.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return null; // Permitir
  }

  if (log.count >= config.max) {
    // Limite excedido
    const retryAfter = Math.ceil((log.resetTime - now) / 1000);

    return NextResponse.json(
      {
        error: config.message || 'Too many requests',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': log.resetTime.toString(),
        },
      }
    );
  }

  // Incrementar contador
  log.count++;
  requestLogs.set(identifier, log);

  return null; // Permitir
}

/**
 * Rate limit presets comuns
 */
export const RateLimitPresets = {
  /**
   * Strict: 5 req/min - Para endpoints sensíveis (admin, auth)
   */
  STRICT: {
    max: 5,
    windowSeconds: 60,
    message: 'Too many requests. Please wait before trying again.',
  },

  /**
   * Normal: 30 req/min - Para APIs normais
   */
  NORMAL: {
    max: 30,
    windowSeconds: 60,
    message: 'Rate limit exceeded. Please slow down.',
  },

  /**
   * Relaxed: 100 req/min - Para endpoints de leitura
   */
  RELAXED: {
    max: 100,
    windowSeconds: 60,
    message: 'Too many requests.',
  },

  /**
   * AI: 10 req/hour - Para chamadas de IA (Gemini, Perplexity)
   */
  AI: {
    max: 10,
    windowSeconds: 3600,
    message: 'AI quota exceeded. Please try again in an hour.',
  },
} as const;

/**
 * Helper para obter informações de rate limit sem aplicar
 */
export function getRateLimitInfo(
  request: NextRequest,
  userId?: string
): {
  identifier: string;
  count: number;
  resetTime: number;
} | null {
  const identifier = getClientIdentifier(request, userId);
  const log = requestLogs.get(identifier);

  if (!log) return null;

  return {
    identifier,
    count: log.count,
    resetTime: log.resetTime,
  };
}
