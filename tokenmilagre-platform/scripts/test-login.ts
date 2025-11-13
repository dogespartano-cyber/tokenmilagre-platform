/**
 * Script para testar login (verificar hash de senha)
 */

import { PrismaClient } from '../lib/generated/prisma'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testLogin() {
  console.log('🔐 Testando login...\n')

  try {
    await prisma.$connect()

    const email = 'admin@tokenmilagre.com'
    const password = 'admin123'

    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Senha: ${password}\n`)

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ Usuário não encontrado!')
      return
    }

    console.log('✅ Usuário encontrado!')
    console.log(`   Nome: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Email verificado: ${user.emailVerified ? 'Sim' : 'Não'}\n`)

    // Testar senha
    console.log('🔍 Testando senha...')
    const isValid = await bcrypt.compare(password, user.password)

    if (isValid) {
      console.log('✅ SENHA CORRETA! Login deve funcionar.\n')
      console.log('🎯 Credenciais válidas:')
      console.log(`   Email: ${email}`)
      console.log(`   Senha: ${password}\n`)
    } else {
      console.log('❌ SENHA INCORRETA! Hash não bate.\n')
      console.log('🔧 Recriando usuário admin com senha correta...\n')

      // Deletar e recriar
      await prisma.user.delete({ where: { email } })

      const newHash = await bcrypt.hash(password, 10)
      await prisma.user.create({
        data: {
          email,
          name: 'Admin',
          password: newHash,
          role: 'ADMIN',
          emailVerified: new Date()
        }
      })

      console.log('✅ Usuário admin recriado com senha: admin123\n')
    }

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()
  .then(() => {
    console.log('✨ Teste concluído!')
    process.exit(0)
  })
  .catch(() => process.exit(1))
