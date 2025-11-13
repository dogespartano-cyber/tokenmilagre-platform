/**
 * Script para aplicar schema no Supabase via SQL
 * (Alternativa ao prisma db push que pode travar)
 */

import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient({
  datasources: {
    db: {
      // Usar DIRECT_URL (sem pgbouncer)
      url: "postgres://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
    }
  },
  log: ['query', 'info', 'warn', 'error']
})

async function testConnection() {
  console.log('🔄 Testando conexão com Supabase...\n')

  try {
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conectado ao Supabase!\n')

    // Testar query simples
    const result = await prisma.$queryRaw`SELECT version() as version`
    console.log('📊 PostgreSQL version:', result)
    console.log('')

    // Verificar se há tabelas
    const tables: any = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `

    console.log(`📋 Tabelas existentes: ${tables.length}\n`)

    if (tables.length > 0) {
      console.log('╔════════════════════════════╗')
      console.log('║ Tabelas no banco           ║')
      console.log('╠════════════════════════════╣')
      tables.forEach((t: any) => {
        console.log(`║ ${t.table_name.padEnd(26)} ║`)
      })
      console.log('╚════════════════════════════╝\n')
    }

    console.log('✅ Conexão validada!')
    console.log('\n💡 Para aplicar o schema, execute:')
    console.log('   npx prisma db push --accept-data-loss\n')

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
