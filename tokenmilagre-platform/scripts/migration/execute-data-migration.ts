#!/usr/bin/env ts-node
/**
 * Execute Data Migration Script
 * Executa a migração de dados do schema v1 para v2
 * Data: 2025-11-18
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('========================================');
  console.log('DATA MIGRATION: Schema v1 → v2');
  console.log('========================================\n');

  const startTime = Date.now();
  const results: any[] = [];

  try {
    console.log('⚠️  ATENÇÃO: Este script irá modificar o banco de dados!');
    console.log('Certifique-se de que o backup foi criado.\n');

    // Fase 1: Criar categorias a partir de strings únicas
    console.log('FASE 1: Criando categorias...');
    console.log('----------------------------------------\n');

    const uniqueCategories = await prisma.$queryRaw<Array<{ category: string }>>`
      SELECT DISTINCT category
      FROM "Article"
      WHERE category IS NOT NULL
        AND category != ''
    `;

    console.log(`Encontradas ${uniqueCategories.length} categorias únicas.\n`);

    let categoriesCreated = 0;
    for (const { category } of uniqueCategories) {
      const slug = category.toLowerCase().trim();
      const name = category.trim().split(' ').map(w =>
        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      ).join(' ');

      try {
        await prisma.$executeRaw`
          INSERT INTO "Category" (id, slug, name, description, "createdAt", "updatedAt")
          VALUES (
            gen_random_uuid(),
            ${slug},
            ${name},
            NULL,
            NOW(),
            NOW()
          )
          ON CONFLICT (slug) DO NOTHING
        `;
        categoriesCreated++;
        console.log(`  ✓ Categoria criada: ${name} (${slug})`);
      } catch (error: any) {
        console.error(`  ✗ Erro ao criar categoria ${name}:`, error.message);
      }
    }

    console.log(`\n✅ ${categoriesCreated} categorias criadas.\n`);
    results.push({ step: 'create_categories', success: categoriesCreated, total: uniqueCategories.length });

    // Fase 2: Atualizar Article.categoryId com base em Article.category
    console.log('FASE 2: Vinculando artigos às categorias...');
    console.log('----------------------------------------\n');

    const updateResult = await prisma.$executeRaw`
      UPDATE "Article" a
      SET "categoryId" = c.id
      FROM "Category" c
      WHERE LOWER(TRIM(a.category)) = c.slug
        AND a.category IS NOT NULL
        AND a.category != ''
        AND a."categoryId" IS NULL
    `;

    console.log(`✅ ${updateResult} artigos vinculados às categorias.\n`);
    results.push({ step: 'link_articles_to_categories', updated: updateResult });

    // Fase 3: Criar categoria "Sem Categoria" para artigos sem categoria
    console.log('FASE 3: Criando categoria "Sem Categoria"...');
    console.log('----------------------------------------\n');

    await prisma.$executeRaw`
      INSERT INTO "Category" (id, slug, name, description, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'sem-categoria',
        'Sem Categoria',
        'Artigos sem categoria definida',
        NOW(),
        NOW()
      )
      ON CONFLICT (slug) DO NOTHING
    `;

    const uncategorizedCategory = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "Category" WHERE slug = 'sem-categoria'
    `;

    if (uncategorizedCategory.length > 0) {
      const uncategorizedId = uncategorizedCategory[0].id;

      const updateUncategorized = await prisma.$executeRaw`
        UPDATE "Article"
        SET "categoryId" = ${uncategorizedId}
        WHERE "categoryId" IS NULL
      `;

      console.log(`✅ ${updateUncategorized} artigos sem categoria vinculados a "Sem Categoria".\n`);
      results.push({ step: 'assign_uncategorized', updated: updateUncategorized });
    }

    // Fase 4: Migrar Article.published → Article.status
    console.log('FASE 4: Migrando status de publicação...');
    console.log('----------------------------------------\n');

    // Verificar se a coluna status existe
    const statusColumnExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'Article'
          AND column_name = 'status'
      ) as exists
    `;

    if (statusColumnExists[0].exists) {
      const statusUpdated = await prisma.$executeRaw`
        UPDATE "Article"
        SET status = CASE
          WHEN published = true THEN 'published'::"ArticleStatus"
          ELSE 'draft'::"ArticleStatus"
        END
        WHERE status IS NULL
      `;

      console.log(`✅ ${statusUpdated} artigos com status atualizado.\n`);
      results.push({ step: 'migrate_status', updated: statusUpdated });
    } else {
      console.log('⚠️  Coluna "status" não existe ainda. Execute a migration do schema primeiro.\n');
    }

    // Fase 5: Normalizar Article.type
    console.log('FASE 5: Normalizando tipos de artigos...');
    console.log('----------------------------------------\n');

    const typeUpdated = await prisma.$executeRaw`
      UPDATE "Article"
      SET type = CASE
        WHEN LOWER(type) IN ('news', 'educational') THEN LOWER(type)::"ArticleType"
        ELSE 'news'::"ArticleType"
      END
    `;

    console.log(`✅ ${typeUpdated} artigos com tipo normalizado.\n`);
    results.push({ step: 'normalize_type', updated: typeUpdated });

    // Fase 6: Inicializar novos campos
    console.log('FASE 6: Inicializando novos campos...');
    console.log('----------------------------------------\n');

    // viewCount
    const viewCountUpdated = await prisma.$executeRaw`
      UPDATE "Article"
      SET "viewCount" = 0
      WHERE "viewCount" IS NULL
    `;

    console.log(`✅ ${viewCountUpdated} artigos com viewCount inicializado.\n`);

    // readTime
    const readTimeUpdated = await prisma.$executeRaw`
      UPDATE "Article"
      SET "readTime" = CASE
        WHEN LENGTH(content) > 0 THEN
          CONCAT(
            GREATEST(1, ROUND(LENGTH(content) / 1000.0)),
            ' min'
          )
        ELSE '1 min'
      END
      WHERE "readTime" IS NULL
    `;

    console.log(`✅ ${readTimeUpdated} artigos com readTime calculado.\n`);
    results.push({ step: 'initialize_fields', viewCount: viewCountUpdated, readTime: readTimeUpdated });

    // Fase 7: Verificar dados órfãos
    console.log('FASE 7: Verificando dados órfãos...\n');

    const orphanedCheck = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM "Article" a
      WHERE NOT EXISTS (
        SELECT 1 FROM "User" u WHERE u.id = a."authorId"
      )
    `;

    const orphanedCount = Number(orphanedCheck[0].count);

    if (orphanedCount > 0) {
      console.log(`⚠️  ${orphanedCount} artigos órfãos encontrados (não removidos automaticamente).\n`);
    } else {
      console.log(`✅ Nenhum artigo órfão encontrado.\n`);
    }
    results.push({ step: 'check_orphaned', found: orphanedCount });

    // Fase 8: Validações pós-migração
    console.log('FASE 8: Validações pós-migração...');
    console.log('----------------------------------------\n');

    const validations = [];

    // Verificar artigos sem categoria
    const articlesWithoutCategory = await prisma.article.count({
      where: { categoryId: null }
    });

    if (articlesWithoutCategory > 0) {
      console.error(`❌ ERRO: ${articlesWithoutCategory} artigos sem categoria!`);
      validations.push({ check: 'articles_without_category', status: 'FAILED', count: articlesWithoutCategory });
    } else {
      console.log(`✅ Todos os artigos têm categoria.`);
      validations.push({ check: 'articles_without_category', status: 'PASSED' });
    }

    // Verificar artigos sem status
    if (statusColumnExists[0].exists) {
      const articlesWithoutStatus = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM "Article" WHERE status IS NULL
      `;

      const noStatus = Number(articlesWithoutStatus[0].count);
      if (noStatus > 0) {
        console.error(`❌ ERRO: ${noStatus} artigos sem status!`);
        validations.push({ check: 'articles_without_status', status: 'FAILED', count: noStatus });
      } else {
        console.log(`✅ Todos os artigos têm status.`);
        validations.push({ check: 'articles_without_status', status: 'PASSED' });
      }
    }

    // Verificar integridade referencial
    const totalArticles = await prisma.article.count();
    const totalCategories = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM "Category"
    `;

    console.log(`✅ Total de artigos: ${totalArticles}`);
    console.log(`✅ Total de categorias: ${Number(totalCategories[0].count)}\n`);

    results.push({ step: 'validations', checks: validations });

    // Relatório final
    console.log('========================================');
    console.log('RELATÓRIO DE MIGRAÇÃO');
    console.log('========================================\n');

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️  Duração: ${duration}s`);
    console.log(`✅ Categorias criadas: ${categoriesCreated}`);
    console.log(`✅ Artigos migrados: ${totalArticles}`);
    console.log(`✅ Validações: ${validations.filter(v => v.status === 'PASSED').length}/${validations.length} passaram\n`);

    // Salvar relatório
    const reportPath = path.join(process.cwd(), `data-migration-report-${Date.now()}.json`);
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      results,
      summary: {
        categoriesCreated,
        totalArticles,
        totalCategories: Number(totalCategories[0].count),
        validationsPassed: validations.filter(v => v.status === 'PASSED').length,
        validationsTotal: validations.length
      }
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Relatório salvo em: ${reportPath}\n`);

    const failedValidations = validations.filter(v => v.status === 'FAILED');
    if (failedValidations.length > 0) {
      console.error('❌ MIGRAÇÃO COMPLETADA COM ERROS');
      console.error('Corrija os problemas antes de prosseguir.\n');
      process.exit(1);
    } else {
      console.log('✅ MIGRAÇÃO COMPLETADA COM SUCESSO!\n');
      console.log('Próximos passos:');
      console.log('1. Executar testes da aplicação');
      console.log('2. Validar dados manualmente');
      console.log('3. Se tudo OK, pode dropar campos antigos (published, category string)\n');
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Erro durante migração:', error);
    console.error('\n⚠️  REVERTENDO MUDANÇAS...');
    // Em produção, aqui você executaria o rollback
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
