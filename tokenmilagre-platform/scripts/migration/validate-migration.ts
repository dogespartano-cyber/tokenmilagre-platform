#!/usr/bin/env ts-node
/**
 * Validate Migration Script
 * Valida se a migração foi concluída com sucesso
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('========================================');
  console.log('VALIDAÇÃO DA MIGRAÇÃO v2');
  console.log('========================================\n');

  try {
    // Validação 1: Categorias criadas
    const categories = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM "Category"
    `;
    const categoryCount = Number(categories[0].count);
    console.log(`✅ Categorias: ${categoryCount}`);

    // Validação 2: Artigos com categoryId
    const articlesWithCategory = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM "Article" WHERE "categoryId" IS NOT NULL
    `;
    const withCategory = Number(articlesWithCategory[0].count);
    console.log(`✅ Artigos com categoria: ${withCategory}`);

    // Validação 3: Artigos sem categoryId
    const articlesWithoutCategory = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM "Article" WHERE "categoryId" IS NULL
    `;
    const withoutCategory = Number(articlesWithoutCategory[0].count);
    console.log(`${withoutCategory === 0 ? '✅' : '⚠️ '} Artigos sem categoria: ${withoutCategory}`);

    // Validação 4: Artigos com status
    const articlesWithStatus = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM "Article" WHERE status IS NOT NULL
    `;
    const withStatus = Number(articlesWithStatus[0].count);
    console.log(`✅ Artigos com status: ${withStatus}`);

    // Validação 5: Artigos sem status
    const articlesWithoutStatus = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM "Article" WHERE status IS NULL
    `;
    const withoutStatus = Number(articlesWithoutStatus[0].count);
    console.log(`${withoutStatus === 0 ? '✅' : '⚠️ '} Artigos sem status: ${withoutStatus}`);

    // Validação 6: Total de artigos
    const totalArticles = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM "Article"
    `;
    const total = Number(totalArticles[0].count);
    console.log(`✅ Total de artigos: ${total}\n`);

    // Resumo
    console.log('========================================');
    console.log('RESUMO');
    console.log('========================================\n');

    const allValid = withoutCategory === 0 && withoutStatus === 0 && withCategory === total && withStatus === total;

    if (allValid) {
      console.log('🎉 MIGRAÇÃO COMPLETA E VALIDADA!\n');
      console.log(`  - ${categoryCount} categorias criadas`);
      console.log(`  - ${total} artigos migrados com sucesso`);
      console.log(`  - 100% dos artigos com categoria e status\n`);
      process.exit(0);
    } else {
      console.log('⚠️  MIGRAÇÃO PARCIAL - Ações necessárias:\n');
      if (withoutCategory > 0) {
        console.log(`  - ${withoutCategory} artigos sem categoria precisam ser corrigidos`);
      }
      if (withoutStatus > 0) {
        console.log(`  - ${withoutStatus} artigos sem status precisam ser corrigidos`);
      }
      console.log();
      process.exit(1);
    }

  } catch (error: any) {
    console.error('❌ Erro na validação:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
