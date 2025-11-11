import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

// ROTA TEMPORÁRIA PARA MIGRAÇÃO NEON → SUPABASE
// DELETE APÓS USO!
//
// Migra TODAS as 14 tabelas do schema:
// 1. Users, 2. Accounts, 3. Sessions, 4. VerificationTokens
// 5. Articles, 6. Resources, 7. Cryptocurrencies
// 8. CopilotActivities, 9. AutomationTasks, 10. CopilotReports
// 11. CommunityStories, 12. SocialProjects, 13. ProjectMaps, 14. UserProgress

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos

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

    console.log('🚀 Iniciando migração Neon → Supabase...');
    console.log('📊 Migrando TODAS as 14 tabelas do schema...');

    // Prisma Client para NEON (origem)
    const neonClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.POSTGRES_PRISMA_URL // Neon
        }
      }
    });

    // Prisma Client para SUPABASE (destino)
    const supabaseClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.SUPABASE_POSTGRES_PRISMA_URL // Supabase
        }
      }
    });

    const report: any = {
      startTime: new Date().toISOString(),
      tables: {},
      errors: []
    };

    try {
      // 1. Migrar Users
      console.log('📦 Migrando Users...');
      const users = await neonClient.user.findMany();
      report.tables.users = { read: users.length, written: 0 };

      for (const user of users) {
        try {
          await supabaseClient.user.create({ data: user });
          report.tables.users.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`User ${user.id}: ${error.message}`);
          } else {
            report.tables.users.written++; // Já existe
          }
        }
      }

      // 2. Migrar Accounts
      console.log('📦 Migrando Accounts...');
      const accounts = await neonClient.account.findMany();
      report.tables.accounts = { read: accounts.length, written: 0 };

      for (const account of accounts) {
        try {
          await supabaseClient.account.create({ data: account });
          report.tables.accounts.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`Account ${account.id}: ${error.message}`);
          } else {
            report.tables.accounts.written++;
          }
        }
      }

      // 3. Migrar Sessions
      console.log('📦 Migrando Sessions...');
      const sessions = await neonClient.session.findMany();
      report.tables.sessions = { read: sessions.length, written: 0 };

      for (const session of sessions) {
        try {
          await supabaseClient.session.create({ data: session });
          report.tables.sessions.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`Session ${session.sessionToken}: ${error.message}`);
          } else {
            report.tables.sessions.written++;
          }
        }
      }

      // 4. Migrar Verification Tokens
      console.log('📦 Migrando Verification Tokens...');
      const tokens = await neonClient.verificationToken.findMany();
      report.tables.verificationTokens = { read: tokens.length, written: 0 };

      for (const token of tokens) {
        try {
          await supabaseClient.verificationToken.create({ data: token });
          report.tables.verificationTokens.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`Token ${token.token}: ${error.message}`);
          } else {
            report.tables.verificationTokens.written++;
          }
        }
      }

      // 5. Migrar Articles (MAIS IMPORTANTE!)
      console.log('📦 Migrando Articles...');
      const articles = await neonClient.article.findMany();
      report.tables.articles = { read: articles.length, written: 0 };

      for (const article of articles) {
        try {
          await supabaseClient.article.create({ data: article });
          report.tables.articles.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`Article ${article.slug}: ${error.message}`);
          } else {
            report.tables.articles.written++;
          }
        }
      }

      // 6. Migrar Resources
      console.log('📦 Migrando Resources...');
      const resources = await neonClient.resource.findMany();
      report.tables.resources = { read: resources.length, written: 0 };

      for (const resource of resources) {
        try {
          await supabaseClient.resource.create({ data: resource });
          report.tables.resources.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`Resource ${resource.id}: ${error.message}`);
          } else {
            report.tables.resources.written++;
          }
        }
      }

      // 7. Migrar Cryptocurrencies
      console.log('📦 Migrando Cryptocurrencies...');
      const cryptos = await neonClient.cryptocurrency.findMany();
      report.tables.cryptocurrencies = { read: cryptos.length, written: 0 };

      for (const crypto of cryptos) {
        try {
          await supabaseClient.cryptocurrency.create({ data: crypto });
          report.tables.cryptocurrencies.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`Cryptocurrency ${crypto.coingeckoId}: ${error.message}`);
          } else {
            report.tables.cryptocurrencies.written++;
          }
        }
      }

      // 8. Migrar CopilotActivities
      console.log('📦 Migrando CopilotActivities...');
      const activities = await neonClient.copilotActivity.findMany();
      report.tables.copilotActivities = { read: activities.length, written: 0 };

      for (const activity of activities) {
        try {
          await supabaseClient.copilotActivity.create({ data: activity });
          report.tables.copilotActivities.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`CopilotActivity ${activity.id}: ${error.message}`);
          } else {
            report.tables.copilotActivities.written++;
          }
        }
      }

      // 9. Migrar AutomationTasks
      console.log('📦 Migrando AutomationTasks...');
      const tasks = await neonClient.automationTask.findMany();
      report.tables.automationTasks = { read: tasks.length, written: 0 };

      for (const task of tasks) {
        try {
          await supabaseClient.automationTask.create({ data: task });
          report.tables.automationTasks.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`AutomationTask ${task.id}: ${error.message}`);
          } else {
            report.tables.automationTasks.written++;
          }
        }
      }

      // 10. Migrar CopilotReports
      console.log('📦 Migrando CopilotReports...');
      const reports = await neonClient.copilotReport.findMany();
      report.tables.copilotReports = { read: reports.length, written: 0 };

      for (const copilotReport of reports) {
        try {
          await supabaseClient.copilotReport.create({ data: copilotReport });
          report.tables.copilotReports.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`CopilotReport ${copilotReport.id}: ${error.message}`);
          } else {
            report.tables.copilotReports.written++;
          }
        }
      }

      // 11. Migrar CommunityStories
      console.log('📦 Migrando CommunityStories...');
      const stories = await neonClient.communityStory.findMany();
      report.tables.communityStories = { read: stories.length, written: 0 };

      for (const story of stories) {
        try {
          await supabaseClient.communityStory.create({ data: story });
          report.tables.communityStories.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`CommunityStory ${story.slug}: ${error.message}`);
          } else {
            report.tables.communityStories.written++;
          }
        }
      }

      // 12. Migrar SocialProjects
      console.log('📦 Migrando SocialProjects...');
      const projects = await neonClient.socialProject.findMany();
      report.tables.socialProjects = { read: projects.length, written: 0 };

      for (const project of projects) {
        try {
          await supabaseClient.socialProject.create({ data: project });
          report.tables.socialProjects.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`SocialProject ${project.slug}: ${error.message}`);
          } else {
            report.tables.socialProjects.written++;
          }
        }
      }

      // 13. Migrar ProjectMaps
      console.log('📦 Migrando ProjectMaps...');
      const maps = await neonClient.projectMap.findMany();
      report.tables.projectMaps = { read: maps.length, written: 0 };

      for (const map of maps) {
        try {
          await supabaseClient.projectMap.create({ data: map });
          report.tables.projectMaps.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`ProjectMap ${map.id}: ${error.message}`);
          } else {
            report.tables.projectMaps.written++;
          }
        }
      }

      // 14. Migrar UserProgress
      console.log('📦 Migrando UserProgress...');
      const userProgress = await neonClient.userProgress.findMany();
      report.tables.userProgress = { read: userProgress.length, written: 0 };

      for (const progress of userProgress) {
        try {
          await supabaseClient.userProgress.create({ data: progress });
          report.tables.userProgress.written++;
        } catch (error: any) {
          if (!error.message.includes('Unique constraint')) {
            report.errors.push(`UserProgress ${progress.id}: ${error.message}`);
          } else {
            report.tables.userProgress.written++;
          }
        }
      }

      // Calcular totais
      const totalRead = Object.values(report.tables).reduce((sum: number, table: any) => sum + table.read, 0);
      const totalWritten = Object.values(report.tables).reduce((sum: number, table: any) => sum + table.written, 0);

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

      console.log('✅ Migração completa!');
      console.log(`📊 Total: ${totalWritten}/${totalRead} registros migrados (${report.summary.successRate})`);
      console.log(JSON.stringify(report, null, 2));

      return NextResponse.json(report);

    } finally {
      await neonClient.$disconnect();
      await supabaseClient.$disconnect();
    }

  } catch (error: any) {
    console.error('❌ Erro na migração:', error);
    return NextResponse.json({
      status: 'ERROR',
      error: error.message,
      duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`
    }, { status: 500 });
  }
}
