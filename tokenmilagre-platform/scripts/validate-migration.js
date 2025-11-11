#!/usr/bin/env node

/**
 * Script de Validação de Migração Neon → Supabase
 *
 * Compara counts de todas as 14 tabelas entre Neon e Supabase
 *
 * Uso:
 *   POSTGRES_PRISMA_URL="..." SUPABASE_POSTGRES_PRISMA_URL="..." node scripts/validate-migration.js
 */

const { PrismaClient } = require('../lib/generated/prisma');

const startTime = Date.now();

async function main() {
  console.log('🔍 VALIDAÇÃO DE MIGRAÇÃO NEON → SUPABASE');
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
  console.log('📊 Validando todas as 14 tabelas...\n');

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

  const validation = {
    startTime: new Date().toISOString(),
    tables: {},
    summary: {
      totalTables: 14,
      tablesMatching: 0,
      tablesMismatch: 0,
      tablesWithErrors: 0
    },
    errors: []
  };

  try {
    // Função helper para validar uma tabela
    const validateTable = async (tableName, neonQuery, supabaseQuery) => {
      try {
        const neonCount = await neonQuery();
        const supabaseCount = await supabaseQuery();
        const isMatch = neonCount === supabaseCount;

        validation.tables[tableName] = {
          neon: neonCount,
          supabase: supabaseCount,
          match: isMatch,
          diff: supabaseCount - neonCount,
          status: isMatch ? '✅ OK' : '⚠️  MISMATCH'
        };

        if (isMatch) {
          validation.summary.tablesMatching++;
          console.log(`✅ ${tableName.padEnd(20)} | Neon: ${neonCount.toString().padStart(5)} | Supabase: ${supabaseCount.toString().padStart(5)} | ✓`);
        } else {
          validation.summary.tablesMismatch++;
          console.log(`⚠️  ${tableName.padEnd(20)} | Neon: ${neonCount.toString().padStart(5)} | Supabase: ${supabaseCount.toString().padStart(5)} | DIFF: ${supabaseCount - neonCount}`);
        }
      } catch (error) {
        validation.tables[tableName] = {
          neon: 'ERROR',
          supabase: 'ERROR',
          match: false,
          error: error.message,
          status: '❌ ERROR'
        };
        validation.summary.tablesWithErrors++;
        validation.errors.push(`${tableName}: ${error.message}`);
        console.log(`❌ ${tableName.padEnd(20)} | ERRO: ${error.message}`);
      }
    };

    // Validar todas as 14 tabelas
    await validateTable('users',
      async () => await neonClient.user.count(),
      async () => await supabaseClient.user.count()
    );

    await validateTable('accounts',
      async () => await neonClient.account.count(),
      async () => await supabaseClient.account.count()
    );

    await validateTable('sessions',
      async () => await neonClient.session.count(),
      async () => await supabaseClient.session.count()
    );

    await validateTable('verificationTokens',
      async () => await neonClient.verificationToken.count(),
      async () => await supabaseClient.verificationToken.count()
    );

    await validateTable('articles',
      async () => await neonClient.article.count(),
      async () => await supabaseClient.article.count()
    );

    await validateTable('resources',
      async () => await neonClient.resource.count(),
      async () => await supabaseClient.resource.count()
    );

    await validateTable('cryptocurrencies',
      async () => await neonClient.cryptocurrency.count(),
      async () => await supabaseClient.cryptocurrency.count()
    );

    await validateTable('copilotActivities',
      async () => await neonClient.copilotActivity.count(),
      async () => await supabaseClient.copilotActivity.count()
    );

    await validateTable('automationTasks',
      async () => await neonClient.automationTask.count(),
      async () => await supabaseClient.automationTask.count()
    );

    await validateTable('copilotReports',
      async () => await neonClient.copilotReport.count(),
      async () => await supabaseClient.copilotReport.count()
    );

    await validateTable('communityStories',
      async () => await neonClient.communityStory.count(),
      async () => await supabaseClient.communityStory.count()
    );

    await validateTable('socialProjects',
      async () => await neonClient.socialProject.count(),
      async () => await supabaseClient.socialProject.count()
    );

    await validateTable('projectMaps',
      async () => await neonClient.projectMap.count(),
      async () => await supabaseClient.projectMap.count()
    );

    await validateTable('userProgress',
      async () => await neonClient.userProgress.count(),
      async () => await supabaseClient.userProgress.count()
    );

    // Calcular resultado final
    validation.endTime = new Date().toISOString();
    validation.duration = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;

    const allTablesMatch = validation.summary.tablesMismatch === 0 && validation.summary.tablesWithErrors === 0;
    validation.status = allTablesMatch ? 'SUCCESS' : 'VALIDATION_FAILED';

    console.log('\n' + '═'.repeat(60));
    console.log(allTablesMatch ? '✅ VALIDAÇÃO BEM-SUCEDIDA!' : '⚠️  VALIDAÇÃO FALHOU!');
    console.log('═'.repeat(60));
    console.log(`📊 Total de Tabelas: ${validation.summary.totalTables}`);
    console.log(`✅ Tabelas OK: ${validation.summary.tablesMatching}`);
    console.log(`⚠️  Tabelas com Mismatch: ${validation.summary.tablesMismatch}`);
    console.log(`❌ Tabelas com Erro: ${validation.summary.tablesWithErrors}`);
    console.log(`⏱️  Duração: ${validation.duration}`);

    if (validation.errors.length > 0) {
      console.log('\n❌ ERROS ENCONTRADOS:');
      validation.errors.forEach(err => console.log(`   - ${err}`));
    }

    if (allTablesMatch) {
      console.log('\n🎉 Todos os dados foram validados com sucesso!');
      console.log('\n📋 Próximos passos:');
      console.log('   1. Teste a aplicação apontando para Supabase');
      console.log('   2. Atualize DATABASE_URL para usar SUPABASE_POSTGRES_PRISMA_URL');
      console.log('   3. Execute ./scripts/cleanup-migration.sh para remover rotas temporárias');
      process.exit(0);
    } else {
      console.log('\n⚠️  Algumas tabelas não batem!');
      console.log('\n💡 Sugestões:');
      console.log('   1. Execute a migração novamente: node scripts/migrate-now.js');
      console.log('   2. A migração ignora duplicatas automaticamente');
      console.log('   3. Verifique os erros acima para mais detalhes');
      process.exit(1);
    }

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
