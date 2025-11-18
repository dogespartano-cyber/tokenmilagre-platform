import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

// ROTA TEMPORÁRIA PARA VALIDAR MIGRAÇÃO NEON → SUPABASE
// DELETE APÓS USO!
//
// Compara counts de todas as 14 tabelas entre Neon e Supabase

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // Verificar senha de segurança na URL
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');

    if (secret !== process.env.MIGRATION_SECRET) {
      return NextResponse.json({
        error: 'Unauthorized - senha incorreta'
      }, { status: 401 });
    }

    // Verificar variáveis de ambiente necessárias
    if (!process.env.POSTGRES_PRISMA_URL) {
      return NextResponse.json({
        error: 'POSTGRES_PRISMA_URL (Neon) não configurada'
      }, { status: 500 });
    }

    if (!process.env.SUPABASE_POSTGRES_PRISMA_URL) {
      return NextResponse.json({
        error: 'SUPABASE_POSTGRES_PRISMA_URL não configurada'
      }, { status: 500 });
    }

    console.log('🔍 Iniciando validação de migração...');

    // Prisma Client para NEON (origem)
    const neonClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.POSTGRES_PRISMA_URL
        }
      }
    });

    // Prisma Client para SUPABASE (destino)
    const supabaseClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.SUPABASE_POSTGRES_PRISMA_URL
        }
      }
    });

    const validation: any = {
      startTime: new Date().toISOString(),
      tables: {},
      summary: {
        totalTables: 0,
        tablesMatching: 0,
        tablesMismatch: 0,
        tablesWithErrors: 0
      },
      errors: []
    };

    try {
      // Função helper para validar uma tabela
      const validateTable = async (
        tableName: string,
        neonQuery: () => Promise<number>,
        supabaseQuery: () => Promise<number>
      ) => {
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
          } else {
            validation.summary.tablesMismatch++;
          }

          console.log(`${validation.tables[tableName].status} ${tableName}: Neon=${neonCount}, Supabase=${supabaseCount}`);
        } catch (error: any) {
          validation.tables[tableName] = {
            neon: 'ERROR',
            supabase: 'ERROR',
            match: false,
            error: error.message,
            status: '❌ ERROR'
          };
          validation.summary.tablesWithErrors++;
          validation.errors.push(`${tableName}: ${error.message}`);
          console.error(`❌ Erro ao validar ${tableName}:`, error.message);
        }
      };

      // Validar todas as 14 tabelas
      validation.summary.totalTables = 14;

      console.log('📊 Validando User...');
      await validateTable(
        'users',
        async () => await neonClient.user.count(),
        async () => await supabaseClient.user.count()
      );

      console.log('📊 Validando Account...');
      await validateTable(
        'accounts',
        async () => await neonClient.account.count(),
        async () => await supabaseClient.account.count()
      );

      console.log('📊 Validando Session...');
      await validateTable(
        'sessions',
        async () => await neonClient.session.count(),
        async () => await supabaseClient.session.count()
      );

      console.log('📊 Validando VerificationToken...');
      await validateTable(
        'verificationTokens',
        async () => await neonClient.verificationToken.count(),
        async () => await supabaseClient.verificationToken.count()
      );

      console.log('📊 Validando Article...');
      await validateTable(
        'articles',
        async () => await neonClient.article.count(),
        async () => await supabaseClient.article.count()
      );

      console.log('📊 Validando Resource...');
      await validateTable(
        'resources',
        async () => await neonClient.resource.count(),
        async () => await supabaseClient.resource.count()
      );

      console.log('📊 Validando Cryptocurrency...');
      await validateTable(
        'cryptocurrencies',
        async () => await neonClient.cryptocurrency.count(),
        async () => await supabaseClient.cryptocurrency.count()
      );

      console.log('📊 Validando CopilotActivity...');
      await validateTable(
        'copilotActivities',
        async () => await neonClient.copilotActivity.count(),
        async () => await supabaseClient.copilotActivity.count()
      );

      console.log('📊 Validando AutomationTask...');
      await validateTable(
        'automationTasks',
        async () => await neonClient.automationTask.count(),
        async () => await supabaseClient.automationTask.count()
      );

      console.log('📊 Validando CopilotReport...');
      await validateTable(
        'copilotReports',
        async () => await neonClient.copilotReport.count(),
        async () => await supabaseClient.copilotReport.count()
      );

      console.log('📊 Validando CommunityStory...');
      await validateTable(
        'communityStories',
        async () => await neonClient.communityStory.count(),
        async () => await supabaseClient.communityStory.count()
      );

      console.log('📊 Validando SocialProject...');
      await validateTable(
        'socialProjects',
        async () => await neonClient.socialProject.count(),
        async () => await supabaseClient.socialProject.count()
      );

      console.log('📊 Validando ProjectMap...');
      await validateTable(
        'projectMaps',
        async () => await neonClient.projectMap.count(),
        async () => await supabaseClient.projectMap.count()
      );

      console.log('📊 Validando UserProgress...');
      await validateTable(
        'userProgress',
        async () => await neonClient.userProgress.count(),
        async () => await supabaseClient.userProgress.count()
      );

      // Calcular resultado final
      validation.endTime = new Date().toISOString();
      validation.duration = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;

      const allTablesMatch = validation.summary.tablesMismatch === 0 && validation.summary.tablesWithErrors === 0;
      validation.status = allTablesMatch ? 'SUCCESS' : 'VALIDATION_FAILED';
      validation.message = allTablesMatch
        ? '✅ Migração validada com sucesso! Todos os dados foram migrados.'
        : '⚠️  Algumas tabelas não batem. Revise o relatório abaixo.';

      console.log(validation.message);
      console.log(JSON.stringify(validation, null, 2));

      return NextResponse.json(validation);

    } finally {
      await neonClient.$disconnect();
      await supabaseClient.$disconnect();
    }

  } catch (error: any) {
    console.error('❌ Erro na validação:', error);
    return NextResponse.json({
      status: 'ERROR',
      error: error.message,
      duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`
    }, { status: 500 });
  }
}
