/**
 * Script de Migração Neon → Supabase
 *
 * Este script:
 * 1. Lê o backup JSON do Neon
 * 2. Conecta no banco Supabase
 * 3. Insere todos os dados respeitando foreign keys
 * 4. Valida se contagem de registros bate
 *
 * IMPORTANTE: Execute primeiro:
 *   npx prisma db push  (para criar schema no Supabase)
 *
 * Uso:
 *   npx tsx scripts/migrate-to-supabase.ts [arquivo-backup.json]
 */

import { PrismaClient } from '../lib/generated/prisma'
import * as fs from 'fs'
import * as path from 'path'

// Conectar no banco SUPABASE usando credenciais novas
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
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

async function migrate(backupFile: string) {
  console.log('🔄 Iniciando migração para Supabase...\n')

  try {
    // Verificar se arquivo existe
    if (!fs.existsSync(backupFile)) {
      throw new Error(`❌ Arquivo não encontrado: ${backupFile}`)
    }

    // Ler backup
    console.log(`📂 Lendo backup: ${path.basename(backupFile)}...`)
    const backupContent = fs.readFileSync(backupFile, 'utf-8')
    const backupData: BackupData = JSON.parse(backupContent)
    console.log(`✅ Backup carregado (${backupData.timestamp})\n`)

    // Testar conexão Supabase
    await prisma.$connect()
    console.log('✅ Conectado ao Supabase\n')

    // Verificar se banco está vazio
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      console.warn('⚠️  ATENÇÃO: O banco Supabase JÁ contém dados!')
      console.warn(`   Encontrados ${existingUsers} usuários existentes.\n`)
      console.warn('   Este script vai ADICIONAR dados, não substituir.')
      console.warn('   Para começar limpo, rode: npx prisma db push --force-reset\n')

      // Aguardar confirmação (5 segundos)
      console.log('⏱️  Continuando em 5 segundos... (Ctrl+C para cancelar)\n')
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    console.log('📊 Migrando dados...\n')

    // Contadores
    const inserted: { [key: string]: number } = {}

    // ORDEM DE INSERÇÃO (respeitando foreign keys)

    // 1. Users
    if (backupData.tables.users?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.users.length} usuários...`)
      for (const user of backupData.tables.users) {
        await prisma.user.create({ data: user })
      }
      inserted.users = backupData.tables.users.length
      console.log(`    ✓ ${inserted.users} inseridos\n`)
    }

    // 2. Accounts
    if (backupData.tables.accounts?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.accounts.length} contas...`)
      for (const account of backupData.tables.accounts) {
        await prisma.account.create({ data: account })
      }
      inserted.accounts = backupData.tables.accounts.length
      console.log(`    ✓ ${inserted.accounts} inseridas\n`)
    }

    // 3. Sessions
    if (backupData.tables.sessions?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.sessions.length} sessões...`)
      for (const session of backupData.tables.sessions) {
        await prisma.session.create({ data: session })
      }
      inserted.sessions = backupData.tables.sessions.length
      console.log(`    ✓ ${inserted.sessions} inseridas\n`)
    }

    // 4. VerificationTokens
    if (backupData.tables.verificationTokens?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.verificationTokens.length} tokens...`)
      for (const token of backupData.tables.verificationTokens) {
        await prisma.verificationToken.create({ data: token })
      }
      inserted.verificationTokens = backupData.tables.verificationTokens.length
      console.log(`    ✓ ${inserted.verificationTokens} inseridos\n`)
    }

    // 5. Articles
    if (backupData.tables.articles?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.articles.length} artigos...`)
      for (const article of backupData.tables.articles) {
        await prisma.article.create({ data: article })
      }
      inserted.articles = backupData.tables.articles.length
      console.log(`    ✓ ${inserted.articles} inseridos\n`)
    }

    // 6. Resources
    if (backupData.tables.resources?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.resources.length} recursos...`)
      for (const resource of backupData.tables.resources) {
        await prisma.resource.create({ data: resource })
      }
      inserted.resources = backupData.tables.resources.length
      console.log(`    ✓ ${inserted.resources} inseridos\n`)
    }

    // 7. Cryptocurrencies
    if (backupData.tables.cryptocurrencies?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.cryptocurrencies.length} criptomoedas...`)
      for (const crypto of backupData.tables.cryptocurrencies) {
        await prisma.cryptocurrency.create({ data: crypto })
      }
      inserted.cryptocurrencies = backupData.tables.cryptocurrencies.length
      console.log(`    ✓ ${inserted.cryptocurrencies} inseridas\n`)
    }

    // 8. CopilotActivity
    if (backupData.tables.copilotActivities?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.copilotActivities.length} atividades...`)
      for (const activity of backupData.tables.copilotActivities) {
        await prisma.copilotActivity.create({ data: activity })
      }
      inserted.copilotActivities = backupData.tables.copilotActivities.length
      console.log(`    ✓ ${inserted.copilotActivities} inseridas\n`)
    }

    // 9. AutomationTask
    if (backupData.tables.automationTasks?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.automationTasks.length} tarefas...`)
      for (const task of backupData.tables.automationTasks) {
        await prisma.automationTask.create({ data: task })
      }
      inserted.automationTasks = backupData.tables.automationTasks.length
      console.log(`    ✓ ${inserted.automationTasks} inseridas\n`)
    }

    // 10. CopilotReport
    if (backupData.tables.copilotReports?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.copilotReports.length} relatórios...`)
      for (const report of backupData.tables.copilotReports) {
        await prisma.copilotReport.create({ data: report })
      }
      inserted.copilotReports = backupData.tables.copilotReports.length
      console.log(`    ✓ ${inserted.copilotReports} inseridos\n`)
    }

    // 11. CommunityStory
    if (backupData.tables.communityStories?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.communityStories.length} histórias...`)
      for (const story of backupData.tables.communityStories) {
        await prisma.communityStory.create({ data: story })
      }
      inserted.communityStories = backupData.tables.communityStories.length
      console.log(`    ✓ ${inserted.communityStories} inseridas\n`)
    }

    // 12. SocialProject
    if (backupData.tables.socialProjects?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.socialProjects.length} projetos...`)
      for (const project of backupData.tables.socialProjects) {
        await prisma.socialProject.create({ data: project })
      }
      inserted.socialProjects = backupData.tables.socialProjects.length
      console.log(`    ✓ ${inserted.socialProjects} inseridos\n`)
    }

    // 13. ProjectMap
    if (backupData.tables.projectMaps?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.projectMaps.length} mapas...`)
      for (const map of backupData.tables.projectMaps) {
        await prisma.projectMap.create({ data: map })
      }
      inserted.projectMaps = backupData.tables.projectMaps.length
      console.log(`    ✓ ${inserted.projectMaps} inseridos\n`)
    }

    // 14. UserProgress
    if (backupData.tables.userProgress?.length > 0) {
      console.log(`  → Migrando ${backupData.tables.userProgress.length} progressos...`)
      for (const progress of backupData.tables.userProgress) {
        await prisma.userProgress.create({ data: progress })
      }
      inserted.userProgress = backupData.tables.userProgress.length
      console.log(`    ✓ ${inserted.userProgress} inseridos\n`)
    }

    // Validação
    console.log('\n✅ Validando migração...\n')

    const validation: { [key: string]: { expected: number, actual: number, ok: boolean } } = {}

    validation.users = {
      expected: backupData.metadata.users || 0,
      actual: await prisma.user.count(),
      ok: false
    }
    validation.users.ok = validation.users.expected === validation.users.actual

    validation.articles = {
      expected: backupData.metadata.articles || 0,
      actual: await prisma.article.count(),
      ok: false
    }
    validation.articles.ok = validation.articles.expected === validation.articles.actual

    validation.resources = {
      expected: backupData.metadata.resources || 0,
      actual: await prisma.resource.count(),
      ok: false
    }
    validation.resources.ok = validation.resources.expected === validation.resources.actual

    validation.cryptocurrencies = {
      expected: backupData.metadata.cryptocurrencies || 0,
      actual: await prisma.cryptocurrency.count(),
      ok: false
    }
    validation.cryptocurrencies.ok = validation.cryptocurrencies.expected === validation.cryptocurrencies.actual

    // Resumo da validação
    console.log('╔════════════════════════════╦══════════╦═══════╦════════╗')
    console.log('║ Tabela                     ║ Esperado ║ Atual ║ Status ║')
    console.log('╠════════════════════════════╬══════════╬═══════╬════════╣')
    Object.entries(validation).forEach(([table, data]) => {
      const tableName = table.padEnd(26)
      const expected = data.expected.toString().padStart(8)
      const actual = data.actual.toString().padStart(5)
      const status = data.ok ? '   ✓' : '   ✗'
      console.log(`║ ${tableName} ║ ${expected} ║ ${actual} ║ ${status}   ║`)
    })
    console.log('╚════════════════════════════╩══════════╩═══════╩════════╝\n')

    const allOk = Object.values(validation).every(v => v.ok)

    if (allOk) {
      console.log('✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!')
      console.log('   Todos os dados foram transferidos corretamente.\n')
    } else {
      console.warn('⚠️  ATENÇÃO: Algumas tabelas não bateram!')
      console.warn('   Revise os dados manualmente no Supabase Studio.\n')
    }

    const totalInserted = Object.values(inserted).reduce((a, b) => a + b, 0)
    console.log(`📦 Total migrado: ${totalInserted} registros`)
    console.log(`⏰ Concluído em: ${new Date().toLocaleString('pt-BR')}\n`)

  } catch (error) {
    console.error('❌ Erro na migração:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Obter arquivo de backup do argumento ou procurar o mais recente
const backupFile = process.argv[2] || (() => {
  const files = fs.readdirSync(process.cwd())
    .filter(f => f.startsWith('backup-neon-') && f.endsWith('.json'))
    .sort()
    .reverse()

  if (files.length === 0) {
    throw new Error('❌ Nenhum arquivo de backup encontrado! Execute primeiro: npx tsx scripts/backup-neon.ts')
  }

  return path.join(process.cwd(), files[0])
})()

// Executar migração
migrate(backupFile)
  .then(() => {
    console.log('✨ Processo finalizado!')
    console.log('\n📋 PRÓXIMOS PASSOS:')
    console.log('   1. Testar aplicação localmente (npm run dev)')
    console.log('   2. Validar login/artigos/recursos')
    console.log('   3. Fazer commit e push para Vercel')
    console.log('   4. Validar em produção')
    console.log('   5. Desconectar Neon após 7 dias de validação\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Falha na migração:', error)
    process.exit(1)
  })
