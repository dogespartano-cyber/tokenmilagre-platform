/**
 * Testes para rate limiting
 */

import { NextRequest } from 'next/server';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

describe('Rate Limiting', () => {
  it('should allow requests under the limit', async () => {
    const request = new NextRequest('http://localhost:3000/api/test');
    const result = await rateLimit(request, RateLimitPresets.NORMAL, 'user-1');

    expect(result).toBeNull();
  });

  it('should block requests over the limit', async () => {
    const request = new NextRequest('http://localhost:3000/api/test');
    const config = { max: 2, windowSeconds: 60 };

    // Primeira e segunda requisição devem passar
    await rateLimit(request, config, 'user-2');
    await rateLimit(request, config, 'user-2');

    // Terceira deve ser bloqueada
    const result = await rateLimit(request, config, 'user-2');

    expect(result).not.toBeNull();
    expect(result?.status).toBe(429);
  });

  it('should use different limits for different users', async () => {
    const request = new NextRequest('http://localhost:3000/api/test');
    const config = { max: 1, windowSeconds: 60 };

    // User 1 atinge o limite
    await rateLimit(request, config, 'user-3');
    const resultUser1 = await rateLimit(request, config, 'user-3');

    // User 2 ainda pode fazer requisições
    const resultUser2 = await rateLimit(request, config, 'user-4');

    expect(resultUser1?.status).toBe(429);
    expect(resultUser2).toBeNull();
  });
});
