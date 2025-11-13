/**
 * Script de Backup Completo do Banco Neon
 *
 * Este script exporta TODOS os dados do banco Neon PostgreSQL
 * para um arquivo JSON, preservando relacionamentos e ordem.
 *
 * Uso:
 *   npx tsx scripts/backup-neon.ts
 *
 * Saída:
 *   backup-neon-YYYYMMDD-HHMMSS.json
 */

import { PrismaClient } from '../lib/generated/prisma'
import * as fs from 'fs'
import * as path from 'path'

// Conectar no banco NEON usando credenciais atuais
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_W0awYJLdgUV1@ep-rapid-paper-adrzxy4v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
})

interface BackupData {
  timestamp: string
  source: string
  tables: {
    [key: string]: any[]
  }
  metadata: {
    [key: string]: number
  }
}

async function backup() {
  console.log('🔄 Iniciando backup do banco Neon...\n')

  try {
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conectado ao banco Neon\n')

    const backupData: BackupData = {
      timestamp: new Date().toISOString(),
      source: 'neon',
      tables: {},
      metadata: {}
    }

    // Ordem de exportação respeitando foreign keys
    // (tabelas sem dependências primeiro)

    console.log('📊 Exportando dados...\n')

    // 1. Users (sem dependências além de Account/Session)
    console.log('  → Users...')
    const users = await prisma.user.findMany()
    backupData.tables.users = users
    backupData.metadata.users = users.length
    console.log(`    ✓ ${users.length} usuários\n`)

    // 2. Accounts
    console.log('  → Accounts...')
    const accounts = await prisma.account.findMany()
    backupData.tables.accounts = accounts
    backupData.metadata.accounts = accounts.length
    console.log(`    ✓ ${accounts.length} contas\n`)

    // 3. Sessions
    console.log('  → Sessions...')
    const sessions = await prisma.session.findMany()
    backupData.tables.sessions = sessions
    backupData.metadata.sessions = sessions.length
    console.log(`    ✓ ${sessions.length} sessões\n`)

    // 4. VerificationTokens
    console.log('  → VerificationTokens...')
    const verificationTokens = await prisma.verificationToken.findMany()
    backupData.tables.verificationTokens = verificationTokens
    backupData.metadata.verificationTokens = verificationTokens.length
    console.log(`    ✓ ${verificationTokens.length} tokens\n`)

    // 5. Articles
    console.log('  → Articles...')
    const articles = await prisma.article.findMany()
    backupData.tables.articles = articles
    backupData.metadata.articles = articles.length
    console.log(`    ✓ ${articles.length} artigos\n`)

    // 6. Resources
    console.log('  → Resources...')
    const resources = await prisma.resource.findMany()
    backupData.tables.resources = resources
    backupData.metadata.resources = resources.length
    console.log(`    ✓ ${resources.length} recursos\n`)

    // 7. Cryptocurrencies
    console.log('  → Cryptocurrencies...')
    const cryptocurrencies = await prisma.cryptocurrency.findMany()
    backupData.tables.cryptocurrencies = cryptocurrencies
    backupData.metadata.cryptocurrencies = cryptocurrencies.length
    console.log(`    ✓ ${cryptocurrencies.length} criptomoedas\n`)

    // 8. CopilotActivity
    console.log('  → CopilotActivity...')
    const copilotActivities = await prisma.copilotActivity.findMany()
    backupData.tables.copilotActivities = copilotActivities
    backupData.metadata.copilotActivities = copilotActivities.length
    console.log(`    ✓ ${copilotActivities.length} atividades\n`)

    // 9. AutomationTask
    console.log('  → AutomationTask...')
    const automationTasks = await prisma.automationTask.findMany()
    backupData.tables.automationTasks = automationTasks
    backupData.metadata.automationTasks = automationTasks.length
    console.log(`    ✓ ${automationTasks.length} tarefas\n`)

    // 10. CopilotReport
    console.log('  → CopilotReport...')
    const copilotReports = await prisma.copilotReport.findMany()
    backupData.tables.copilotReports = copilotReports
    backupData.metadata.copilotReports = copilotReports.length
    console.log(`    ✓ ${copilotReports.length} relatórios\n`)

    // 11. CommunityStory
    console.log('  → CommunityStory...')
    const communityStories = await prisma.communityStory.findMany()
    backupData.tables.communityStories = communityStories
    backupData.metadata.communityStories = communityStories.length
    console.log(`    ✓ ${communityStories.length} histórias\n`)

    // 12. SocialProject
    console.log('  → SocialProject...')
    const socialProjects = await prisma.socialProject.findMany()
    backupData.tables.socialProjects = socialProjects
    backupData.metadata.socialProjects = socialProjects.length
    console.log(`    ✓ ${socialProjects.length} projetos\n`)

    // 13. ProjectMap
    console.log('  → ProjectMap...')
    const projectMaps = await prisma.projectMap.findMany()
    backupData.tables.projectMaps = projectMaps
    backupData.metadata.projectMaps = projectMaps.length
    console.log(`    ✓ ${projectMaps.length} mapas\n`)

    // 14. UserProgress
    console.log('  → UserProgress...')
    const userProgress = await prisma.userProgress.findMany()
    backupData.tables.userProgress = userProgress
    backupData.metadata.userProgress = userProgress.length
    console.log(`    ✓ ${userProgress.length} progressos\n`)

    // Gerar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0]
    const filename = `backup-neon-${timestamp}.json`
    const filepath = path.join(process.cwd(), filename)

    // Salvar arquivo
    console.log('\n💾 Salvando backup...')
    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2))
    console.log(`✅ Backup salvo em: ${filename}\n`)

    // Resumo
    console.log('📊 RESUMO DO BACKUP:\n')
    console.log('╔════════════════════════════╦═══════════╗')
    console.log('║ Tabela                     ║ Registros ║')
    console.log('╠════════════════════════════╬═══════════╣')
    Object.entries(backupData.metadata).forEach(([table, count]) => {
      const tableName = table.padEnd(26)
      const countStr = count.toString().padStart(9)
      console.log(`║ ${tableName} ║ ${countStr} ║`)
    })
    console.log('╚════════════════════════════╩═══════════╝\n')

    const totalRecords = Object.values(backupData.metadata).reduce((a, b) => a + b, 0)
    console.log(`📦 Total de registros: ${totalRecords}`)
    console.log(`📁 Arquivo: ${filename}`)
    console.log(`⏰ Data: ${new Date().toLocaleString('pt-BR')}\n`)

    console.log('✅ Backup concluído com sucesso!')
    console.log('\n⚠️  IMPORTANTE: Guarde este arquivo em local seguro!')
    console.log('   Ele será usado para migrar os dados para o Supabase.\n')

  } catch (error) {
    console.error('❌ Erro ao fazer backup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar backup
backup()
  .then(() => {
    console.log('✨ Processo finalizado!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Falha no backup:', error)
    process.exit(1)
  })
