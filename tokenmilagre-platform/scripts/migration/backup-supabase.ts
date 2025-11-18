#!/usr/bin/env ts-node
// @ts-nocheck
/**
 * Backup Script - Supabase
 * Cria backup completo antes da migração v2
 * Data: 2025-11-18
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface BackupData {
  timestamp: string;
  source: string;
  database_url: string;
  tables: {
    [key: string]: any[];
  };
  metadata: {
    [key: string]: number;
  };
}

async function backup() {
  console.log('🔄 Iniciando backup do banco Supabase...\n');

  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco Supabase\n');

    const backupData: BackupData = {
      timestamp: new Date().toISOString(),
      source: 'supabase',
      database_url: process.env.DATABASE_URL?.replace(/:[^:]*@/, ':***@') || 'not-set',
      tables: {},
      metadata: {}
    };

    console.log('📊 Exportando dados...\n');

    // 1. Users
    console.log('  → Users...');
    const users = await prisma.user.findMany();
    backupData.tables.users = users;
    backupData.metadata.users = users.length;
    console.log(`    ✓ ${users.length} usuários\n`);

    // 2. Accounts
    console.log('  → Accounts...');
    const accounts = await prisma.account.findMany();
    backupData.tables.accounts = accounts;
    backupData.metadata.accounts = accounts.length;
    console.log(`    ✓ ${accounts.length} contas\n`);

    // 3. Sessions
    console.log('  → Sessions...');
    const sessions = await prisma.session.findMany();
    backupData.tables.sessions = sessions;
    backupData.metadata.sessions = sessions.length;
    console.log(`    ✓ ${sessions.length} sessões\n`);

    // 4. Articles
    console.log('  → Articles...');
    const articles = await prisma.article.findMany();
    backupData.tables.articles = articles;
    backupData.metadata.articles = articles.length;
    console.log(`    ✓ ${articles.length} artigos\n`);

    // 5. Resources
    console.log('  → Resources...');
    const resources = await prisma.resource.findMany();
    backupData.tables.resources = resources;
    backupData.metadata.resources = resources.length;
    console.log(`    ✓ ${resources.length} recursos\n`);

    // 6. Cryptocurrencies
    console.log('  → Cryptocurrencies...');
    const cryptocurrencies = await prisma.cryptocurrency.findMany();
    backupData.tables.cryptocurrencies = cryptocurrencies;
    backupData.metadata.cryptocurrencies = cryptocurrencies.length;
    console.log(`    ✓ ${cryptocurrencies.length} criptomoedas\n`);

    // Gerar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
    const filename = `backup-supabase-pre-migration-v2-${timestamp}.json`;
    const backupsDir = path.join(process.cwd(), 'backups');

    // Criar diretório se não existir
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const filepath = path.join(backupsDir, filename);

    // Salvar arquivo
    console.log('\n💾 Salvando backup...');
    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup salvo em: backups/${filename}\n`);

    // Resumo
    console.log('📊 RESUMO DO BACKUP:\n');
    console.log('╔════════════════════════════╦═══════════╗');
    console.log('║ Tabela                     ║ Registros ║');
    console.log('╠════════════════════════════╬═══════════╣');
    Object.entries(backupData.metadata).forEach(([table, count]) => {
      const tableName = table.padEnd(26);
      const countStr = count.toString().padStart(9);
      console.log(`║ ${tableName} ║ ${countStr} ║`);
    });
    console.log('╚════════════════════════════╩═══════════╝\n');

    const totalRecords = Object.values(backupData.metadata).reduce((a, b) => a + b, 0);
    console.log(`📦 Total de registros: ${totalRecords}`);
    console.log(`📁 Arquivo: backups/${filename}`);
    console.log(`💾 Tamanho: ${(fs.statSync(filepath).size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`⏰ Data: ${new Date().toLocaleString('pt-BR')}\n`);

    console.log('✅ Backup concluído com sucesso!');
    console.log('\n⚠️  IMPORTANTE: Este backup será usado caso precise fazer rollback.\n');

    return filepath;

  } catch (error) {
    console.error('❌ Erro ao fazer backup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar backup
backup()
  .then((filepath) => {
    console.log('✨ Processo finalizado!');
    console.log(`📄 Backup salvo em: ${filepath}\n`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha no backup:', error);
    process.exit(1);
  });
