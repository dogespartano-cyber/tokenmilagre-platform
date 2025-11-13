/**
 * Script para debugar login em produção
 * Testa EXATAMENTE o mesmo fluxo que o NextAuth usa
 */

import { PrismaClient } from '../lib/generated/prisma'
import * as bcrypt from 'bcryptjs'

// Conectar no Supabase de produção (mesma URL que Vercel usa)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
    }
  }
})

async function debugLogin() {
  console.log('🔍 DEBUG: Testando login EXATO em produção\n')

  const testEmail = 'admin@tokenmilagre.com'
  const testPassword = 'admin123'

  try {
    // Passo 1: Conectar
    console.log('1️⃣ Conectando ao banco...')
    await prisma.$connect()
    console.log('   ✅ Conectado\n')

    // Passo 2: Buscar usuário
    console.log(`2️⃣ Buscando usuário: ${testEmail}`)
    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    })

    if (!user) {
      console.log('   ❌ ERRO: Usuário NÃO encontrado!')
      console.log('   Solução: npx tsx scripts/seed-production.ts\n')
      return
    }

    console.log('   ✅ Usuário encontrado')
    console.log(`   ID: ${user.id}`)
    console.log(`   Nome: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Hash senha: ${user.password.substring(0, 30)}...\n`)

    // Passo 3: Testar senha
    console.log(`3️⃣ Testando senha: "${testPassword}"`)
    console.log('   Comparando com bcrypt.compare()...')

    const startTime = Date.now()
    const isValid = await bcrypt.compare(testPassword, user.password)
    const duration = Date.now() - startTime

    console.log(`   Tempo: ${duration}ms`)

    if (isValid) {
      console.log('   ✅ SENHA VÁLIDA!\n')

      console.log('╔════════════════════════════════════════╗')
      console.log('║ ✅ LOGIN DEVE FUNCIONAR                ║')
      console.log('╠════════════════════════════════════════╣')
      console.log('║ Email:    admin@tokenmilagre.com       ║')
      console.log('║ Senha:    admin123                     ║')
      console.log('║                                        ║')
      console.log('║ Se ainda falha com 401:                ║')
      console.log('║ → NEXTAUTH_SECRET não configurada      ║')
      console.log('║ → Ver docs/CONFIGURAR-VERCEL-NEXTAUTH  ║')
      console.log('╚════════════════════════════════════════╝\n')

    } else {
      console.log('   ❌ SENHA INVÁLIDA!\n')

      console.log('🔧 CORRIGINDO: Recriando usuário admin...\n')

      // Deletar e recriar com senha correta
      await prisma.user.delete({ where: { id: user.id } })

      const newHash = await bcrypt.hash(testPassword, 10)
      const newUser = await prisma.user.create({
        data: {
          email: testEmail,
          name: 'Admin',
          password: newHash,
          role: 'ADMIN',
          emailVerified: new Date()
        }
      })

      console.log('✅ Usuário recriado!')
      console.log(`   Novo ID: ${newUser.id}`)
      console.log(`   Nova senha: ${testPassword}\n`)

      console.log('🔄 Testando novamente...')
      const isValidNow = await bcrypt.compare(testPassword, newUser.password)

      if (isValidNow) {
        console.log('✅ AGORA FUNCIONA! Tente fazer login novamente.\n')
      } else {
        console.log('❌ AINDA FALHA! Problema mais profundo.\n')
      }
    }

  } catch (error: any) {
    console.error('\n💥 ERRO:', error.message)

    if (error.message.includes('connect')) {
      console.log('\n🔧 Problema de conexão com Supabase')
      console.log('   Verificar credenciais DATABASE_URL\n')
    }

    throw error
  } finally {
    await prisma.$disconnect()
  }
}

debugLogin()
  .then(() => {
    console.log('✨ Debug concluído!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Falha:', error)
    process.exit(1)
  })
