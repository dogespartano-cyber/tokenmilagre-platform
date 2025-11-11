#!/usr/bin/env node

/**
 * Script para testar conexões com Neon e Supabase antes da migração
 *
 * Uso:
 *   node scripts/test-database-connections.js
 *
 * Variáveis de ambiente necessárias:
 *   - POSTGRES_PRISMA_URL (Neon)
 *   - SUPABASE_POSTGRES_PRISMA_URL (Supabase)
 */

const { PrismaClient } = require('../lib/generated/prisma');

async function testConnection(name, url) {
  console.log(`\n🔍 Testando conexão com ${name}...`);

  if (!url) {
    console.error(`❌ ${name}: Variável de ambiente não configurada`);
    return false;
  }

  // Ocultar senha na URL para log
  const urlForLog = url.replace(/:([^:@]+)@/, ':****@');
  console.log(`📍 URL: ${urlForLog}`);

  const client = new PrismaClient({
    datasources: {
      db: { url }
    }
  });

  try {
    // Testar conexão básica
    await client.$connect();
    console.log(`✅ ${name}: Conexão estabelecida`);

    // Testar query simples
    const result = await client.$queryRaw`SELECT 1 as test`;
    console.log(`✅ ${name}: Query executada com sucesso`);

    // Contar tabelas principais
    try {
      const userCount = await client.user.count();
      const articleCount = await client.article.count();
      const resourceCount = await client.resource.count();

      console.log(`📊 ${name}: Estatísticas`);
      console.log(`   - Users: ${userCount}`);
      console.log(`   - Articles: ${articleCount}`);
      console.log(`   - Resources: ${resourceCount}`);
    } catch (countError) {
      console.log(`⚠️  ${name}: Não foi possível contar registros (schema pode não existir ainda)`);
    }

    await client.$disconnect();
    return true;

  } catch (error) {
    console.error(`❌ ${name}: Erro na conexão`);
    console.error(`   Mensagem: ${error.message}`);

    if (error.message.includes('authentication failed')) {
      console.error('   💡 Dica: Verifique usuário e senha na URL');
    } else if (error.message.includes('connection refused')) {
      console.error('   💡 Dica: Verifique se o host e porta estão corretos');
    } else if (error.message.includes('timeout')) {
      console.error('   💡 Dica: Verifique sua conexão com a internet ou firewall');
    }

    try {
      await client.$disconnect();
    } catch (disconnectError) {
      // Ignorar erro de desconexão
    }

    return false;
  }
}

async function main() {
  console.log('🚀 Testador de Conexões - Migração Neon → Supabase');
  console.log('━'.repeat(60));

  const neonUrl = process.env.POSTGRES_PRISMA_URL;
  const supabaseUrl = process.env.SUPABASE_POSTGRES_PRISMA_URL;

  // Verificar variáveis de ambiente
  if (!neonUrl && !supabaseUrl) {
    console.error('\n❌ ERRO: Nenhuma variável de ambiente configurada!');
    console.error('\n📋 Configure as seguintes variáveis:');
    console.error('   export POSTGRES_PRISMA_URL="postgresql://..."');
    console.error('   export SUPABASE_POSTGRES_PRISMA_URL="postgresql://..."');
    process.exit(1);
  }

  const results = {
    neon: false,
    supabase: false
  };

  // Testar Neon
  if (neonUrl) {
    results.neon = await testConnection('NEON (Origem)', neonUrl);
  } else {
    console.log('\n⚠️  POSTGRES_PRISMA_URL não configurada');
  }

  // Testar Supabase
  if (supabaseUrl) {
    results.supabase = await testConnection('SUPABASE (Destino)', supabaseUrl);
  } else {
    console.log('\n⚠️  SUPABASE_POSTGRES_PRISMA_URL não configurada');
  }

  // Resumo final
  console.log('\n' + '━'.repeat(60));
  console.log('📊 RESUMO DOS TESTES');
  console.log('━'.repeat(60));

  if (results.neon) {
    console.log('✅ Neon (Origem): OK');
  } else if (neonUrl) {
    console.log('❌ Neon (Origem): FALHOU');
  } else {
    console.log('⚠️  Neon (Origem): NÃO CONFIGURADO');
  }

  if (results.supabase) {
    console.log('✅ Supabase (Destino): OK');
  } else if (supabaseUrl) {
    console.log('❌ Supabase (Destino): FALHOU');
  } else {
    console.log('⚠️  Supabase (Destino): NÃO CONFIGURADO');
  }

  console.log('━'.repeat(60));

  if (results.neon && results.supabase) {
    console.log('\n🎉 PRONTO PARA MIGRAÇÃO!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Configure MIGRATION_SECRET no Vercel');
    console.log('   2. Faça deploy do branch no Vercel');
    console.log('   3. Execute /api/migrate-database?secret=YOUR_SECRET');
    console.log('   4. Valide com /api/validate-migration?secret=YOUR_SECRET');
    console.log('\n📖 Consulte VERCEL_SETUP.md para instruções detalhadas');
    process.exit(0);
  } else {
    console.log('\n⚠️  CORRIJA OS PROBLEMAS ANTES DE PROSSEGUIR');
    console.log('\n💡 Dicas:');
    console.log('   - Verifique se as URLs estão corretas');
    console.log('   - Confirme que os bancos estão acessíveis');
    console.log('   - Teste a conexão com psql manualmente');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});
