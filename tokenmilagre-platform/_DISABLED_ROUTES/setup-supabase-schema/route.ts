import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

// ROTA TEMPORÁRIA PARA CRIAR SCHEMA NO SUPABASE
// DELETE APÓS USO!

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    // Verificar senha de segurança
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');

    if (secret !== process.env.MIGRATION_SECRET) {
      return NextResponse.json({
        error: 'Unauthorized'
      }, { status: 401 });
    }

    console.log('🔧 Criando schema no Supabase...');

    // Conectar no Supabase
    const supabaseClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.SUPABASE_POSTGRES_PRISMA_URL
        }
      }
    });

    try {
      // Testar conexão com query simples
      await supabaseClient.$queryRaw`SELECT 1`;

      return NextResponse.json({
        status: 'SUCCESS',
        message: 'Supabase conectado com sucesso!',
        note: 'Schema será criado automaticamente no primeiro uso do Prisma.',
        nextStep: 'Acesse /api/migrate-database?secret=YOUR_SECRET para copiar dados'
      });

    } finally {
      await supabaseClient.$disconnect();
    }

  } catch (error: any) {
    console.error('❌ Erro:', error);
    return NextResponse.json({
      status: 'ERROR',
      error: error.message
    }, { status: 500 });
  }
}
