import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { default as NextAuthMiddleware } from 'next-auth/middleware'

/**
 * Global Middleware - Feature Flags e Controle de Rotas
 *
 * IMPORTANTE: Este middleware controla acesso a features experimentais
 * e rotas que dependem de migrações de schema.
 */

// Feature Flags - Controle centralizado
const FEATURE_FLAGS = {
  // API v2 depende do schema-v2.prisma
  // ⚠️ DESABILITADO até migração do banco ser concluída
  API_V2_ENABLED: process.env.ENABLE_API_V2 === 'true' || false,

  // Playwright E2E tests (dependem de API v2)
  E2E_TESTS_ENABLED: process.env.ENABLE_E2E_TESTS === 'true' || false,
} as const

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ============================================================================
  // FEATURE FLAG: API v2
  // ============================================================================

  if (pathname.startsWith('/api/v2/')) {
    if (!FEATURE_FLAGS.API_V2_ENABLED) {
      return NextResponse.json(
        {
          error: 'API v2 Temporarily Disabled',
          message: 'API v2 is currently undergoing database migration. Please use API v1 endpoints or check back later.',
          status: 503,
          details: {
            reason: 'Schema migration in progress',
            eta: 'TBD - Waiting for staging validation',
            fallback: 'Use /api/v1/* endpoints',
            documentation: '/docs/API_V2_SPECIFICATION.md',
          },
          timestamp: new Date().toISOString(),
        },
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '3600', // Retry after 1 hour
            'X-Feature-Status': 'disabled',
            'X-Migration-Status': 'pending',
          },
        }
      )
    }
  }

  // ============================================================================
  // NEXTAUTH: Proteção de rotas admin
  // ============================================================================

  if (pathname.startsWith('/admin/')) {
    return NextAuthMiddleware(request as any)
  }

  // ============================================================================
  // FUTURE: Outras feature flags podem ser adicionadas aqui
  // ============================================================================

  // Exemplo: Rate limiting global
  // Exemplo: Maintenance mode
  // Exemplo: A/B testing

  // Continuar com a requisição normalmente
  return NextResponse.next()
}

// ============================================================================
// MATCHER CONFIG
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
