import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

// ROTA TEMPORÁRIA PARA MIGRAÇÃO NEON → SUPABASE
// DELETE APÓS USO!

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

    console.log('🚀 Iniciando migração Neon → Supabase...');

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

      report.endTime = new Date().toISOString();
      report.duration = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
      report.status = 'SUCCESS';

      console.log('✅ Migração completa!');
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
