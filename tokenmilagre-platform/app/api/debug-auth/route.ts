/**
 * Endpoint de DEBUG para testar autenticação
 * REMOVER ANTES DE IR PARA PRODUÇÃO FINAL
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('[DEBUG-AUTH] Iniciando teste de login')
    console.log('[DEBUG-AUTH] Email:', email)

    // 1. Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('[DEBUG-AUTH] Usuário não encontrado')
      return NextResponse.json({
        success: false,
        error: 'Usuário não encontrado',
        step: 'find_user'
      }, { status: 404 })
    }

    console.log('[DEBUG-AUTH] Usuário encontrado:', {
      id: user.id,
      name: user.name,
      role: user.role,
      hashPrefix: user.password.substring(0, 20)
    })

    // 2. Testar senha
    console.log('[DEBUG-AUTH] Testando senha...')
    const startTime = Date.now()
    const isValid = await bcrypt.compare(password, user.password)
    const duration = Date.now() - startTime

    console.log('[DEBUG-AUTH] Resultado:', isValid ? 'VÁLIDO' : 'INVÁLIDO')
    console.log('[DEBUG-AUTH] Tempo:', duration, 'ms')

    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: 'Senha incorreta',
        step: 'verify_password',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }, { status: 401 })
    }

    // 3. Verificar NEXTAUTH_SECRET
    const hasSecret = !!process.env.NEXTAUTH_SECRET
    const secretLength = process.env.NEXTAUTH_SECRET?.length || 0

    console.log('[DEBUG-AUTH] NEXTAUTH_SECRET:', hasSecret ? 'DEFINIDA' : 'UNDEFINED')
    console.log('[DEBUG-AUTH] Secret length:', secretLength)

    return NextResponse.json({
      success: true,
      message: 'Autenticação válida!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      config: {
        hasNextAuthSecret: hasSecret,
        secretLength: secretLength,
        databaseConnected: true,
        bcryptWorking: true,
        testDuration: duration
      }
    })

  } catch (error: any) {
    console.error('[DEBUG-AUTH] ERRO:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      step: 'unknown_error'
    }, { status: 500 })
  }
}

// GET para teste rápido
export async function GET() {
  try {
    // Testar conexão com banco
    const userCount = await prisma.user.count()

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      userCount,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message
    }, { status: 500 })
  }
}
