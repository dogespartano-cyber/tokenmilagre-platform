/**
 * Script para criar usuários DIRETO no Supabase de produção
 * (Conecta na mesma URL que a Vercel usa)
 */

import { PrismaClient, Role } from '../lib/generated/prisma'
import * as bcrypt from 'bcryptjs'

// Conectar direto no Supabase (mesma URL que Vercel usa)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
    }
  }
})

async function seedProduction() {
  console.log('🚀 Criando usuários no SUPABASE DE PRODUÇÃO...\n')

  try {
    await prisma.$connect()
    console.log('✅ Conectado ao Supabase (produção)\n')

    // Verificar se já existem usuários
    const existingUsers = await prisma.user.count()

    if (existingUsers > 0) {
      console.log(`⚠️  Já existem ${existingUsers} usuários no banco`)

      // Listar usuários existentes
      const users = await prisma.user.findMany({
        select: { email: true, name: true, role: true }
      })

      console.log('\n📋 Usuários existentes:')
      users.forEach(u => {
        console.log(`   - ${u.name} (${u.email}) - ${u.role}`)
      })

      console.log('\n❓ Deseja continuar e criar novos usuários? (duplicatas possíveis)')
      console.log('   Cancelando por segurança...\n')
      return
    }

    console.log('📝 Criando usuário ADMIN...')
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.create({
      data: {
        email: 'admin@tokenmilagre.com',
        name: 'Admin',
        password: hashedPassword,
        role: Role.ADMIN,
        emailVerified: new Date()
      }
    })

    console.log('✅ Admin criado!\n')

    console.log('📝 Criando usuário EDITOR...')
    const hashedPasswordEditor = await bcrypt.hash('editor123', 10)

    const editor = await prisma.user.create({
      data: {
        email: 'editor@tokenmilagre.com',
        name: 'Editor',
        password: hashedPasswordEditor,
        role: Role.EDITOR,
        emailVerified: new Date()
      }
    })

    console.log('✅ Editor criado!\n')

    console.log('╔════════════════════════════════════════╗')
    console.log('║ ✅ USUÁRIOS CRIADOS EM PRODUÇÃO        ║')
    console.log('╠════════════════════════════════════════╣')
    console.log('║                                        ║')
    console.log('║ ADMIN:                                 ║')
    console.log('║   Email: admin@tokenmilagre.com        ║')
    console.log('║   Senha: admin123                      ║')
    console.log('║                                        ║')
    console.log('║ EDITOR:                                ║')
    console.log('║   Email: editor@tokenmilagre.com       ║')
    console.log('║   Senha: editor123                     ║')
    console.log('║                                        ║')
    console.log('╚════════════════════════════════════════╝\n')

    console.log('🎯 Agora você pode fazer login em PRODUÇÃO!')
    console.log('   URL: https://tokenmilagre-platform.vercel.app/login\n')

  } catch (error: any) {
    console.error('❌ Erro:', error.message)

    if (error.code === 'P2002') {
      console.log('\n⚠️  Usuários já existem! Use:')
      console.log('   npx tsx scripts/check-production-users.ts')
      console.log('   Para ver os usuários existentes.\n')
    }

    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedProduction()
  .then(() => {
    console.log('✨ Seed de produção concluído!')
    process.exit(0)
  })
  .catch(() => {
    console.log('\n💥 Falha no seed de produção')
    process.exit(1)
  })
