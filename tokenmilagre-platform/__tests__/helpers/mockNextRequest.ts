import { NextRequest } from 'next/server'

/**
 * Cria um mock de NextRequest para testes
 */
export function createMockNextRequest(options: {
  method?: string
  body?: any
  headers?: Record<string, string>
  url?: string
}): NextRequest {
  const { method = 'POST', body, headers = {}, url = 'http://localhost:3000/api/test' } = options

  const request = new NextRequest(url, {
    method,
    headers: new Headers(headers),
    body: body ? JSON.stringify(body) : undefined,
  })

  return request
}

/**
 * Mock de getServerSession para testes
 */
export function mockGetServerSession(session: any) {
  const mockSession = session
  jest.mock('next-auth', () => ({
    getServerSession: jest.fn().mockResolvedValue(mockSession),
  }))
  return mockSession
}

/**
 * Mock do Prisma Client para testes
 */
export function createMockPrismaClient() {
  return {
    article: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  }
}
