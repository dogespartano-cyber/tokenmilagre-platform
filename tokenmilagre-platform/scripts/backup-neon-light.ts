/**
 * Backup Leve do Neon - Apenas dados críticos
 * (Para quando há limite de transferência)
 */

import { PrismaClient } from '../lib/generated/prisma'
import * as fs from 'fs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      // Usar URL DIRETA (não pooler) - pode ter limites diferentes
      url: "postgresql://neondb_owner:npg_W0awYJLdgUV1@ep-rapid-paper-adrzxy4v.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
})

async function lightBackup() {
  console.log('🔄 Backup leve (apenas dados críticos)...\n')

  try {
    await prisma.$connect()
    console.log('✅ Conectado\n')

    const backup: any = {
      timestamp: new Date().toISOString(),
      tables: {}
    }

    // Tentar apenas tabelas críticas
    console.log('→ Users...')
    backup.tables.users = await prisma.user.findMany({ take: 10 })
    console.log(`  ${backup.tables.users.length} registros\n`)

    console.log('→ Articles...')
    backup.tables.articles = await prisma.article.findMany({ take: 20 })
    console.log(`  ${backup.tables.articles.length} registros\n`)

    const filename = `backup-neon-light-${Date.now()}.json`
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2))
    console.log(`✅ Salvo: ${filename}`)

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

lightBackup()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
