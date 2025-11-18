#!/usr/bin/env ts-node
// @ts-nocheck
/**
 * Pre-Migration Check Script
 * Executa verificações antes da migração v2
 * Data: 2025-11-18
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface CheckResult {
  name: string;
  status: 'OK' | 'WARNING' | 'ERROR';
  message: string;
  data?: any;
}

async function main() {
  console.log('========================================');
  console.log('PRE-MIGRATION CHECK - Schema v2');
  console.log('========================================\n');

  const results: CheckResult[] = [];
  const timestamp = new Date().toISOString();

  try {
    // 1. Contagem geral de registros
    console.log('1. CONTAGEM GERAL');
    console.log('----------------------------------------');

    const [userCount, articleCount, accountCount, sessionCount] = await Promise.all([
      prisma.user.count(),
      prisma.article.count(),
      prisma.account.count(),
      prisma.session.count()
    ]);

    console.log(`Users: ${userCount}`);
    console.log(`Articles: ${articleCount}`);
    console.log(`Accounts: ${accountCount}`);
    console.log(`Sessions: ${sessionCount}\n`);

    results.push({
      name: 'CONTAGEM_GERAL',
      status: 'OK',
      message: `Total: ${articleCount} artigos, ${userCount} usuários`,
      data: { userCount, articleCount, accountCount, sessionCount }
    });

    // 2. Análise de categorias únicas
    console.log('2. CATEGORIAS ÚNICAS (serão criadas)');
    console.log('----------------------------------------');

    const categories = await prisma.$queryRaw<Array<{ slug: string; name: string; article_count: bigint }>>`
      SELECT
        LOWER(TRIM(category)) as slug,
        category as name,
        COUNT(*) as article_count
      FROM "Article"
      WHERE category IS NOT NULL
        AND category != ''
      GROUP BY LOWER(TRIM(category)), category
      ORDER BY article_count DESC
    `;

    categories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug}): ${cat.article_count} artigos`);
    });
    console.log();

    results.push({
      name: 'CATEGORIAS_UNICAS',
      status: 'OK',
      message: `${categories.length} categorias únicas encontradas`,
      data: categories.map(c => ({ ...c, article_count: Number(c.article_count) }))
    });

    // 3. Análise de tipos de artigos
    console.log('3. TIPOS DE ARTIGOS');
    console.log('----------------------------------------');

    const types = await prisma.$queryRaw<Array<{ type: string; count: bigint }>>`
      SELECT type, COUNT(*) as count
      FROM "Article"
      GROUP BY type
      ORDER BY count DESC
    `;

    types.forEach(t => {
      console.log(`- ${t.type}: ${t.count} artigos`);
    });
    console.log();

    const invalidTypes = types.filter(t => !['news', 'educational'].includes(t.type.toLowerCase()));
    if (invalidTypes.length > 0) {
      results.push({
        name: 'TIPOS_INVALIDOS',
        status: 'WARNING',
        message: `${invalidTypes.length} tipos inválidos serão convertidos para "news"`,
        data: invalidTypes.map(t => ({ ...t, count: Number(t.count) }))
      });
    } else {
      results.push({
        name: 'TIPOS_ARTIGOS',
        status: 'OK',
        message: 'Todos os tipos são válidos',
        data: types.map(t => ({ ...t, count: Number(t.count) }))
      });
    }

    // 4. Análise de status de publicação
    console.log('4. STATUS DE PUBLICAÇÃO');
    console.log('----------------------------------------');

    const publishedStatus = await prisma.$queryRaw<Array<{ published: boolean; count: bigint }>>`
      SELECT published, COUNT(*) as count
      FROM "Article"
      GROUP BY published
      ORDER BY published DESC
    `;

    publishedStatus.forEach(s => {
      console.log(`- ${s.published ? 'Publicado' : 'Rascunho'}: ${s.count} artigos`);
    });
    console.log();

    results.push({
      name: 'STATUS_PUBLICACAO',
      status: 'OK',
      message: 'Status de publicação mapeado',
      data: publishedStatus.map(s => ({ ...s, count: Number(s.count) }))
    });

    // 5. Artigos sem categoria
    console.log('5. ARTIGOS SEM CATEGORIA');
    console.log('----------------------------------------');

    const articlesWithoutCategory = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM "Article"
      WHERE category IS NULL OR category = ''
    `;

    const noCategory = Number(articlesWithoutCategory[0].count);
    console.log(`Artigos sem categoria: ${noCategory}\n`);

    if (noCategory > 0) {
      results.push({
        name: 'ARTIGOS_SEM_CATEGORIA',
        status: 'WARNING',
        message: `${noCategory} artigos receberão categoria "Sem Categoria"`,
        data: { count: noCategory }
      });
    } else {
      results.push({
        name: 'ARTIGOS_SEM_CATEGORIA',
        status: 'OK',
        message: 'Todos os artigos têm categoria',
        data: { count: 0 }
      });
    }

    // 6. Artigos órfãos (sem autor) - verificação via query raw
    console.log('6. ARTIGOS ÓRFÃOS (sem autor)');
    console.log('----------------------------------------');

    const orphanedCheck = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM "Article" a
      WHERE NOT EXISTS (
        SELECT 1 FROM "User" u WHERE u.id = a."authorId"
      )
    `;

    const orphanedArticles = Number(orphanedCheck[0].count);
    console.log(`Artigos órfãos: ${orphanedArticles}\n`);

    if (orphanedArticles > 0) {
      results.push({
        name: 'ARTIGOS_ORFAOS',
        status: 'ERROR',
        message: `${orphanedArticles} artigos órfãos precisam ser removidos ou ter autor atribuído`,
        data: { count: orphanedArticles }
      });
    } else {
      results.push({
        name: 'ARTIGOS_ORFAOS',
        status: 'OK',
        message: 'Nenhum artigo órfão encontrado',
        data: { count: 0 }
      });
    }

    // 7. Distribuição de autores
    console.log('7. ARTIGOS POR AUTOR');
    console.log('----------------------------------------');

    const authorStats = await prisma.$queryRaw<Array<{ name: string | null; email: string; article_count: bigint }>>`
      SELECT
        u.name,
        u.email,
        COUNT(a.id) as article_count
      FROM "User" u
      LEFT JOIN "Article" a ON a."authorId" = u.id
      GROUP BY u.id, u.name, u.email
      ORDER BY article_count DESC
      LIMIT 10
    `;

    authorStats.forEach(author => {
      console.log(`- ${author.name || 'Sem nome'} (${author.email}): ${author.article_count} artigos`);
    });
    console.log();

    results.push({
      name: 'DISTRIBUICAO_AUTORES',
      status: 'OK',
      message: 'Distribuição de autores mapeada',
      data: authorStats.map(a => ({ ...a, article_count: Number(a.article_count) }))
    });

    // 8. Resumo de ações necessárias
    console.log('========================================');
    console.log('CHECKLIST DE AÇÕES');
    console.log('========================================\n');

    const errors = results.filter(r => r.status === 'ERROR');
    const warnings = results.filter(r => r.status === 'WARNING');

    if (errors.length > 0) {
      console.log('❌ ERROS CRÍTICOS (bloqueiam migração):');
      errors.forEach(e => console.log(`   - ${e.message}`));
      console.log();
    }

    if (warnings.length > 0) {
      console.log('⚠️  AVISOS (migração irá corrigir):');
      warnings.forEach(w => console.log(`   - ${w.message}`));
      console.log();
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ Nenhum problema encontrado. Pronto para migração!\n');
    }

    // Salvar relatório
    const reportPath = path.join(process.cwd(), `pre-migration-report-${Date.now()}.json`);
    const report = {
      timestamp,
      summary: {
        total_checks: results.length,
        errors: errors.length,
        warnings: warnings.length,
        ok: results.filter(r => r.status === 'OK').length
      },
      checks: results,
      ready_for_migration: errors.length === 0
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ Relatório salvo em: ${reportPath}\n`);

    console.log('========================================');
    console.log('FIM DO PRE-MIGRATION CHECK');
    console.log('========================================\n');

    if (errors.length > 0) {
      console.log('⛔ MIGRAÇÃO BLOQUEADA - Corrija os erros antes de prosseguir');
      process.exit(1);
    } else if (warnings.length > 0) {
      console.log('⚠️  AVISOS ENCONTRADOS - Revise antes de prosseguir');
      process.exit(0);
    } else {
      console.log('✅ PRONTO PARA MIGRAÇÃO');
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Erro ao executar verificações:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
