/**
 * Script para verificar usuários no banco
 */

import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function checkUsers() {
  console.log('🔍 Verificando usuários no banco...\n')

  try {
    await prisma.$connect()
    console.log('✅ Conectado ao banco\n')

    // Listar todos usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        emailVerified: true,
        createdAt: true
      }
    })

    console.log(`📊 Total de usuários: ${users.length}\n`)

    if (users.length === 0) {
      console.log('⚠️  NENHUM usuário encontrado no banco!')
      console.log('   Execute: npx tsx scripts/seed-admin-supabase.ts\n')
      return
    }

    console.log('╔════════════════════════════════════════════════════════╗')
    console.log('║ USUÁRIOS NO BANCO                                      ║')
    console.log('╠════════════════════════════════════════════════════════╣')

    users.forEach((user: any, idx: number) => {
      console.log(`║ ${idx + 1}. ${user.name} (${user.role})`.padEnd(56) + '║')
      console.log(`║    Email: ${user.email}`.padEnd(56) + '║')
      console.log(`║    ID: ${user.id}`.padEnd(56) + '║')
      console.log(`║    Verificado: ${user.emailVerified ? 'Sim' : 'Não'}`.padEnd(56) + '║')
      console.log(`║    Senha hash: ${user.password.substring(0, 20)}...`.padEnd(56) + '║')
      console.log('╠════════════════════════════════════════════════════════╣')
    })

    console.log('╚════════════════════════════════════════════════════════╝\n')

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
