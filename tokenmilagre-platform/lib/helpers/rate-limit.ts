/**
 * Rate Limiting Helper
 *
 * Proteção contra abuso de APIs usando @upstash/ratelimit
 * Requer UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Cache do cliente Redis e Rate Limiters
let redis: Redis | null = null;
let aiRateLimiter: Ratelimit | null = null;
let generalRateLimiter: Ratelimit | null = null;

/**
 * Obtém o cliente Redis configurado
 * Retorna null se as variáveis de ambiente não estiverem configuradas
 */
function getRedisClient(): Redis | null {
    if (redis) return redis;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        console.warn('[RateLimit] UPSTASH_REDIS_REST_URL ou UPSTASH_REDIS_REST_TOKEN não configurados. Rate limiting desabilitado.');
        return null;
    }

    redis = new Redis({ url, token });
    return redis;
}

/**
 * Rate limiter para APIs de IA (custo alto)
 * 10 requisições por minuto por usuário
 */
function getAIRateLimiter(): Ratelimit | null {
    if (aiRateLimiter) return aiRateLimiter;

    const client = getRedisClient();
    if (!client) return null;

    aiRateLimiter = new Ratelimit({
        redis: client,
        limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 req/min
        analytics: true,
        prefix: 'ratelimit:ai',
    });

    return aiRateLimiter;
}

/**
 * Rate limiter geral (mais permissivo)
 * 100 requisições por minuto por IP
 */
function getGeneralRateLimiter(): Ratelimit | null {
    if (generalRateLimiter) return generalRateLimiter;

    const client = getRedisClient();
    if (!client) return null;

    generalRateLimiter = new Ratelimit({
        redis: client,
        limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 req/min
        analytics: true,
        prefix: 'ratelimit:general',
    });

    return generalRateLimiter;
}

/**
 * Resultado da verificação de rate limit
 */
export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
    response?: NextResponse;
}

/**
 * Verifica rate limit para APIs de IA
 * Identificador deve ser o userId do usuário autenticado
 *
 * @param identifier - ID único do usuário (userId)
 * @returns RateLimitResult
 */
export async function checkAIRateLimit(identifier: string): Promise<RateLimitResult> {
    const limiter = getAIRateLimiter();

    // Se rate limiting não está configurado, permite todas as requisições
    if (!limiter) {
        return {
            success: true,
            limit: 10,
            remaining: 10,
            reset: 0,
        };
    }

    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    if (!success) {
        return {
            success: false,
            limit,
            remaining,
            reset,
            response: NextResponse.json(
                {
                    error: 'Rate limit exceeded',
                    message: 'Você atingiu o limite de requisições. Tente novamente em alguns segundos.',
                    limit,
                    remaining,
                    resetIn: Math.ceil((reset - Date.now()) / 1000),
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString(),
                        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
                    },
                }
            ),
        };
    }

    return { success: true, limit, remaining, reset };
}

/**
 * Verifica rate limit geral (por IP)
 *
 * @param ip - Endereço IP do cliente
 * @returns RateLimitResult
 */
export async function checkGeneralRateLimit(ip: string): Promise<RateLimitResult> {
    const limiter = getGeneralRateLimiter();

    if (!limiter) {
        return {
            success: true,
            limit: 100,
            remaining: 100,
            reset: 0,
        };
    }

    const { success, limit, remaining, reset } = await limiter.limit(ip);

    if (!success) {
        return {
            success: false,
            limit,
            remaining,
            reset,
            response: NextResponse.json(
                {
                    error: 'Rate limit exceeded',
                    message: 'Muitas requisições. Tente novamente mais tarde.',
                    limit,
                    remaining,
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString(),
                        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
                    },
                }
            ),
        };
    }

    return { success: true, limit, remaining, reset };
}

/**
 * Extrai IP do request (funciona com Vercel e proxies)
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfIp = request.headers.get('cf-connecting-ip');

    if (cfIp) return cfIp;
    if (realIp) return realIp;
    if (forwarded) return forwarded.split(',')[0].trim();

    return 'unknown';
}
