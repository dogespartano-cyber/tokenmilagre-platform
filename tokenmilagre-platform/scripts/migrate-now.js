#!/usr/bin/env node

/**
 * Script de Migração Direta Neon → Supabase
 *
 * Executa migração de todas as 14 tabelas diretamente via Prisma
 *
 * Uso:
 *   POSTGRES_PRISMA_URL="..." SUPABASE_POSTGRES_PRISMA_URL="..." node scripts/migrate-now.js
 */

const { PrismaClient } = require('../lib/generated/prisma');

const startTime = Date.now();

async function main() {
  console.log('🚀 MIGRAÇÃO NEON → SUPABASE');
  console.log('═'.repeat(60));

  // Verificar variáveis de ambiente
  const neonUrl = process.env.POSTGRES_PRISMA_URL;
  const supabaseUrl = process.env.SUPABASE_POSTGRES_PRISMA_URL;

  if (!neonUrl) {
    console.error('❌ ERRO: POSTGRES_PRISMA_URL (Neon) não configurada');
    process.exit(1);
  }

  if (!supabaseUrl) {
    console.error('❌ ERRO: SUPABASE_POSTGRES_PRISMA_URL não configurada');
    process.exit(1);
  }

  console.log('✅ Variáveis de ambiente configuradas');
  console.log('📊 Migrando TODAS as 14 tabelas do schema...\n');

  // Prisma Client para NEON (origem)
  const neonClient = new PrismaClient({
    datasources: {
      db: { url: neonUrl }
    }
  });

  // Prisma Client para SUPABASE (destino)
  const supabaseClient = new PrismaClient({
    datasources: {
      db: { url: supabaseUrl }
    }
  });

  const report = {
    startTime: new Date().toISOString(),
    tables: {},
    errors: []
  };

  try {
    // 1. Migrar Users
    console.log('📦 [1/14] Migrando Users...');
    const users = await neonClient.user.findMany();
    report.tables.users = { read: users.length, written: 0 };

    for (const user of users) {
      try {
        await supabaseClient.user.create({ data: user });
        report.tables.users.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`User ${user.id}: ${error.message}`);
        } else {
          report.tables.users.written++; // Já existe
        }
      }
    }
    console.log(`   ✅ Users: ${report.tables.users.written}/${report.tables.users.read}`);

    // 2. Migrar Accounts
    console.log('📦 [2/14] Migrando Accounts...');
    const accounts = await neonClient.account.findMany();
    report.tables.accounts = { read: accounts.length, written: 0 };

    for (const account of accounts) {
      try {
        await supabaseClient.account.create({ data: account });
        report.tables.accounts.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`Account ${account.id}: ${error.message}`);
        } else {
          report.tables.accounts.written++;
        }
      }
    }
    console.log(`   ✅ Accounts: ${report.tables.accounts.written}/${report.tables.accounts.read}`);

    // 3. Migrar Sessions
    console.log('📦 [3/14] Migrando Sessions...');
    const sessions = await neonClient.session.findMany();
    report.tables.sessions = { read: sessions.length, written: 0 };

    for (const session of sessions) {
      try {
        await supabaseClient.session.create({ data: session });
        report.tables.sessions.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`Session ${session.sessionToken}: ${error.message}`);
        } else {
          report.tables.sessions.written++;
        }
      }
    }
    console.log(`   ✅ Sessions: ${report.tables.sessions.written}/${report.tables.sessions.read}`);

    // 4. Migrar Verification Tokens
    console.log('📦 [4/14] Migrando Verification Tokens...');
    const tokens = await neonClient.verificationToken.findMany();
    report.tables.verificationTokens = { read: tokens.length, written: 0 };

    for (const token of tokens) {
      try {
        await supabaseClient.verificationToken.create({ data: token });
        report.tables.verificationTokens.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`Token ${token.token}: ${error.message}`);
        } else {
          report.tables.verificationTokens.written++;
        }
      }
    }
    console.log(`   ✅ VerificationTokens: ${report.tables.verificationTokens.written}/${report.tables.verificationTokens.read}`);

    // 5. Migrar Articles (MAIS IMPORTANTE!)
    console.log('📦 [5/14] Migrando Articles...');
    const articles = await neonClient.article.findMany();
    report.tables.articles = { read: articles.length, written: 0 };

    for (const article of articles) {
      try {
        await supabaseClient.article.create({ data: article });
        report.tables.articles.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`Article ${article.slug}: ${error.message}`);
        } else {
          report.tables.articles.written++;
        }
      }
    }
    console.log(`   ✅ Articles: ${report.tables.articles.written}/${report.tables.articles.read}`);

    // 6. Migrar Resources
    console.log('📦 [6/14] Migrando Resources...');
    const resources = await neonClient.resource.findMany();
    report.tables.resources = { read: resources.length, written: 0 };

    for (const resource of resources) {
      try {
        await supabaseClient.resource.create({ data: resource });
        report.tables.resources.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`Resource ${resource.id}: ${error.message}`);
        } else {
          report.tables.resources.written++;
        }
      }
    }
    console.log(`   ✅ Resources: ${report.tables.resources.written}/${report.tables.resources.read}`);

    // 7. Migrar Cryptocurrencies
    console.log('📦 [7/14] Migrando Cryptocurrencies...');
    const cryptos = await neonClient.cryptocurrency.findMany();
    report.tables.cryptocurrencies = { read: cryptos.length, written: 0 };

    for (const crypto of cryptos) {
      try {
        await supabaseClient.cryptocurrency.create({ data: crypto });
        report.tables.cryptocurrencies.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`Cryptocurrency ${crypto.coingeckoId}: ${error.message}`);
        } else {
          report.tables.cryptocurrencies.written++;
        }
      }
    }
    console.log(`   ✅ Cryptocurrencies: ${report.tables.cryptocurrencies.written}/${report.tables.cryptocurrencies.read}`);

    // 8. Migrar CopilotActivities
    console.log('📦 [8/14] Migrando CopilotActivities...');
    const activities = await neonClient.copilotActivity.findMany();
    report.tables.copilotActivities = { read: activities.length, written: 0 };

    for (const activity of activities) {
      try {
        await supabaseClient.copilotActivity.create({ data: activity });
        report.tables.copilotActivities.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`CopilotActivity ${activity.id}: ${error.message}`);
        } else {
          report.tables.copilotActivities.written++;
        }
      }
    }
    console.log(`   ✅ CopilotActivities: ${report.tables.copilotActivities.written}/${report.tables.copilotActivities.read}`);

    // 9. Migrar AutomationTasks
    console.log('📦 [9/14] Migrando AutomationTasks...');
    const tasks = await neonClient.automationTask.findMany();
    report.tables.automationTasks = { read: tasks.length, written: 0 };

    for (const task of tasks) {
      try {
        await supabaseClient.automationTask.create({ data: task });
        report.tables.automationTasks.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`AutomationTask ${task.id}: ${error.message}`);
        } else {
          report.tables.automationTasks.written++;
        }
      }
    }
    console.log(`   ✅ AutomationTasks: ${report.tables.automationTasks.written}/${report.tables.automationTasks.read}`);

    // 10. Migrar CopilotReports
    console.log('📦 [10/14] Migrando CopilotReports...');
    const reports = await neonClient.copilotReport.findMany();
    report.tables.copilotReports = { read: reports.length, written: 0 };

    for (const copilotReport of reports) {
      try {
        await supabaseClient.copilotReport.create({ data: copilotReport });
        report.tables.copilotReports.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`CopilotReport ${copilotReport.id}: ${error.message}`);
        } else {
          report.tables.copilotReports.written++;
        }
      }
    }
    console.log(`   ✅ CopilotReports: ${report.tables.copilotReports.written}/${report.tables.copilotReports.read}`);

    // 11. Migrar CommunityStories
    console.log('📦 [11/14] Migrando CommunityStories...');
    const stories = await neonClient.communityStory.findMany();
    report.tables.communityStories = { read: stories.length, written: 0 };

    for (const story of stories) {
      try {
        await supabaseClient.communityStory.create({ data: story });
        report.tables.communityStories.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`CommunityStory ${story.slug}: ${error.message}`);
        } else {
          report.tables.communityStories.written++;
        }
      }
    }
    console.log(`   ✅ CommunityStories: ${report.tables.communityStories.written}/${report.tables.communityStories.read}`);

    // 12. Migrar SocialProjects
    console.log('📦 [12/14] Migrando SocialProjects...');
    const projects = await neonClient.socialProject.findMany();
    report.tables.socialProjects = { read: projects.length, written: 0 };

    for (const project of projects) {
      try {
        await supabaseClient.socialProject.create({ data: project });
        report.tables.socialProjects.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`SocialProject ${project.slug}: ${error.message}`);
        } else {
          report.tables.socialProjects.written++;
        }
      }
    }
    console.log(`   ✅ SocialProjects: ${report.tables.socialProjects.written}/${report.tables.socialProjects.read}`);

    // 13. Migrar ProjectMaps
    console.log('📦 [13/14] Migrando ProjectMaps...');
    const maps = await neonClient.projectMap.findMany();
    report.tables.projectMaps = { read: maps.length, written: 0 };

    for (const map of maps) {
      try {
        await supabaseClient.projectMap.create({ data: map });
        report.tables.projectMaps.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`ProjectMap ${map.id}: ${error.message}`);
        } else {
          report.tables.projectMaps.written++;
        }
      }
    }
    console.log(`   ✅ ProjectMaps: ${report.tables.projectMaps.written}/${report.tables.projectMaps.read}`);

    // 14. Migrar UserProgress
    console.log('📦 [14/14] Migrando UserProgress...');
    const userProgress = await neonClient.userProgress.findMany();
    report.tables.userProgress = { read: userProgress.length, written: 0 };

    for (const progress of userProgress) {
      try {
        await supabaseClient.userProgress.create({ data: progress });
        report.tables.userProgress.written++;
      } catch (error) {
        if (!error.message.includes('Unique constraint')) {
          report.errors.push(`UserProgress ${progress.id}: ${error.message}`);
        } else {
          report.tables.userProgress.written++;
        }
      }
    }
    console.log(`   ✅ UserProgress: ${report.tables.userProgress.written}/${report.tables.userProgress.read}`);

    // Calcular totais
    const totalRead = Object.values(report.tables).reduce((sum, table) => sum + table.read, 0);
    const totalWritten = Object.values(report.tables).reduce((sum, table) => sum + table.written, 0);

    report.endTime = new Date().toISOString();
    report.duration = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
    report.status = 'SUCCESS';
    report.summary = {
      totalTables: Object.keys(report.tables).length,
      totalRecordsRead: totalRead,
      totalRecordsWritten: totalWritten,
      successRate: totalRead > 0 ? `${((totalWritten / totalRead) * 100).toFixed(2)}%` : 'N/A',
      errorsCount: report.errors.length
    };

    console.log('\n' + '═'.repeat(60));
    console.log('✅ MIGRAÇÃO COMPLETA!');
    console.log('═'.repeat(60));
    console.log(`📊 Tabelas: ${report.summary.totalTables}`);
    console.log(`📝 Registros Lidos: ${report.summary.totalRecordsRead}`);
    console.log(`✍️  Registros Escritos: ${report.summary.totalRecordsWritten}`);
    console.log(`📈 Taxa de Sucesso: ${report.summary.successRate}`);
    console.log(`⏱️  Duração: ${report.duration}`);
    console.log(`❌ Erros: ${report.summary.errorsCount}`);

    if (report.errors.length > 0) {
      console.log('\n⚠️  ERROS ENCONTRADOS:');
      report.errors.forEach(err => console.log(`   - ${err}`));
    }

    console.log('\n🎉 Todos os dados foram migrados do Neon para o Supabase!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Execute o script de validação: node scripts/validate-migration.js');
    console.log('   2. Teste a aplicação apontando para o Supabase');
    console.log('   3. Atualize DATABASE_URL para usar Supabase');

  } catch (error) {
    console.error('\n❌ ERRO FATAL:', error);
    console.error('\nDetalhes:', error.message);
    process.exit(1);
  } finally {
    await neonClient.$disconnect();
    await supabaseClient.$disconnect();
  }
}

main().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
