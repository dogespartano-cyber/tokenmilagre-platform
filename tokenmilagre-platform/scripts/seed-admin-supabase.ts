/**
 * Script para criar usuário admin inicial no Supabase
 *
 * Uso:
 *   npx tsx scripts/seed-admin-supabase.ts
 */

import { PrismaClient, Role } from '../lib/generated/prisma'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedAdmin() {
  console.log('🔄 Criando usuário admin inicial...\n')

  try {
    await prisma.$connect()
    console.log('✅ Conectado ao Supabase\n')

    // Verificar se já existe admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: Role.ADMIN }
    })

    if (existingAdmin) {
      console.log('⚠️  Já existe um usuário admin:')
      console.log(`   Email: ${existingAdmin.email}`)
      console.log(`   Nome: ${existingAdmin.name}`)
      console.log('\n✅ Seed não necessário.')
      return
    }

    // Criar usuário admin
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

    console.log('✅ Usuário admin criado com sucesso!\n')
    console.log('╔════════════════════════════════════════╗')
    console.log('║ CREDENCIAIS DO ADMIN                   ║')
    console.log('╠════════════════════════════════════════╣')
    console.log('║ Email:    admin@tokenmilagre.com       ║')
    console.log('║ Senha:    admin123                     ║')
    console.log('╚════════════════════════════════════════╝\n')

    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n')

    // Criar usuário editor também
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

    console.log('✅ Usuário editor criado com sucesso!\n')
    console.log('╔════════════════════════════════════════╗')
    console.log('║ CREDENCIAIS DO EDITOR                  ║')
    console.log('╠════════════════════════════════════════╣')
    console.log('║ Email:    editor@tokenmilagre.com      ║')
    console.log('║ Senha:    editor123                    ║')
    console.log('╚════════════════════════════════════════╝\n')

    console.log('📊 Resumo:')
    console.log(`   - Usuários criados: 2`)
    console.log(`   - Admin ID: ${admin.id}`)
    console.log(`   - Editor ID: ${editor.id}\n`)

    console.log('✅ Seed concluído!')

  } catch (error: any) {
    console.error('❌ Erro ao criar admin:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedAdmin()
  .then(() => {
    console.log('\n✨ Processo finalizado!')
    console.log('\n📋 PRÓXIMOS PASSOS:')
    console.log('   1. Fazer login com admin@tokenmilagre.com')
    console.log('   2. Alterar senha no dashboard')
    console.log('   3. Criar artigos via chat IA (/dashboard/criar-artigo)')
    console.log('   4. Importar recursos e criptomoedas (se necessário)\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Falha no seed:', error)
    process.exit(1)
  })
