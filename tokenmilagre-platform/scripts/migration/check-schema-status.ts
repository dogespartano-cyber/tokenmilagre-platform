#!/usr/bin/env ts-node
// @ts-nocheck
/**
 * Check Schema Status
 * Verifica se o schema v2 já está aplicado no banco
 * Data: 2025-11-18
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSchemaStatus() {
  console.log('========================================');
  console.log('VERIFICAÇÃO DO SCHEMA v2');
  console.log('========================================\n');

  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco\n');

    // Verificar se tabelas do schema v2 existem
    console.log('Verificando tabelas do schema v2...\n');

    const checks = [];

    // 1. Verificar se tabela Category existe
    try {
      const categoryCheck = await prisma.$queryRaw<Array<{ exists: boolean }>>`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'Category'
        ) as exists
      `;
      const categoryExists = categoryCheck[0].exists;
      console.log(`  ${categoryExists ? '✅' : '❌'} Tabela Category: ${categoryExists ? 'EXISTE' : 'NÃO EXISTE'}`);
      checks.push({ name: 'Category', exists: categoryExists });
    } catch (e) {
      console.log(`  ❌ Tabela Category: NÃO EXISTE`);
      checks.push({ name: 'Category', exists: false });
    }

    // 2. Verificar se tabela Tag existe
    try {
      const tagCheck = await prisma.$queryRaw<Array<{ exists: boolean }>>`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'Tag'
        ) as exists
      `;
      const tagExists = tagCheck[0].exists;
      console.log(`  ${tagExists ? '✅' : '❌'} Tabela Tag: ${tagExists ? 'EXISTE' : 'NÃO EXISTE'}`);
      checks.push({ name: 'Tag', exists: tagExists });
    } catch (e) {
      console.log(`  ❌ Tabela Tag: NÃO EXISTE`);
      checks.push({ name: 'Tag', exists: false });
    }

    // 3. Verificar se tabela ArticleTag existe
    try {
      const articleTagCheck = await prisma.$queryRaw<Array<{ exists: boolean }>>`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'ArticleTag'
        ) as exists
      `;
      const articleTagExists = articleTagCheck[0].exists;
      console.log(`  ${articleTagExists ? '✅' : '❌'} Tabela ArticleTag: ${articleTagExists ? 'EXISTE' : 'NÃO EXISTE'}`);
      checks.push({ name: 'ArticleTag', exists: articleTagExists });
    } catch (e) {
      console.log(`  ❌ Tabela ArticleTag: NÃO EXISTE`);
      checks.push({ name: 'ArticleTag', exists: false });
    }

    // 4. Verificar colunas novas em Article
    console.log(`\nVerificando colunas novas em Article...\n`);

    const columnChecks = [
      'categoryId',
      'status',
      'deletedAt',
      'viewCount',
      'readTime'
    ];

    for (const columnName of columnChecks) {
      try {
        const columnCheck = await prisma.$queryRaw<Array<{ exists: boolean }>>`
          SELECT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_name = 'Article'
              AND column_name = ${columnName}
          ) as exists
        `;
        const exists = columnCheck[0].exists;
        console.log(`  ${exists ? '✅' : '❌'} Coluna ${columnName}: ${exists ? 'EXISTE' : 'NÃO EXISTE'}`);
        checks.push({ name: `Article.${columnName}`, exists });
      } catch (e) {
        console.log(`  ❌ Coluna ${columnName}: NÃO EXISTE`);
        checks.push({ name: `Article.${columnName}`, exists: false });
      }
    }

    // 5. Verificar enums
    console.log(`\nVerificando enums...\n`);

    const enumChecks = ['ArticleStatus', 'ArticleType'];

    for (const enumName of enumChecks) {
      try {
        const enumCheck = await prisma.$queryRaw<Array<{ exists: boolean }>>`
          SELECT EXISTS (
            SELECT FROM pg_type
            WHERE typname = ${enumName.toLowerCase()}
          ) as exists
        `;
        const exists = enumCheck[0].exists;
        console.log(`  ${exists ? '✅' : '❌'} Enum ${enumName}: ${exists ? 'EXISTE' : 'NÃO EXISTE'}`);
        checks.push({ name: enumName, exists });
      } catch (e) {
        console.log(`  ❌ Enum ${enumName}: NÃO EXISTE`);
        checks.push({ name: enumName, exists: false });
      }
    }

    // Resumo
    console.log(`\n========================================`);
    console.log('RESUMO');
    console.log('========================================\n');

    const totalChecks = checks.length;
    const existingFeatures = checks.filter(c => c.exists).length;
    const missingFeatures = checks.filter(c => !c.exists).length;

    console.log(`Total de verificações: ${totalChecks}`);
    console.log(`✅ Recursos existentes: ${existingFeatures}`);
    console.log(`❌ Recursos faltando: ${missingFeatures}\n`);

    if (missingFeatures === 0) {
      console.log('🎉 SCHEMA v2 JÁ ESTÁ COMPLETO!');
      console.log('Você pode pular a etapa de migração de schema.\n');
      process.exit(0);
    } else if (missingFeatures === totalChecks) {
      console.log('⚠️  SCHEMA v2 NÃO FOI APLICADO');
      console.log('Execute: npx prisma migrate deploy --schema=prisma/schema-v2.prisma\n');
      process.exit(1);
    } else {
      console.log('⚠️  SCHEMA v2 PARCIALMENTE APLICADO');
      console.log('Alguns recursos existem, outros não.');
      console.log('Recomendado: Verificar migrations e aplicar manualmente.\n');

      console.log('Recursos faltando:');
      checks.filter(c => !c.exists).forEach(c => {
        console.log(`  - ${c.name}`);
      });
      console.log();
      process.exit(2);
    }

  } catch (error) {
    console.error('❌ Erro ao verificar schema:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchemaStatus();
