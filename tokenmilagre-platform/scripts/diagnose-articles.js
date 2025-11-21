/**
 * Script de Diagnóstico - Listagem de Artigos
 *
 * Verifica quantos artigos existem por tipo no banco de dados
 * Para diagnosticar o problema de "apenas Resources aparecem no dashboard"
 */

const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Diagnóstico de Artigos no Banco de Dados\n');
  console.log('='.repeat(60));

  try {
    // 1. Contar artigos por tipo
    const articlesByType = await prisma.article.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    });

    console.log('\n📊 Artigos por Tipo:');
    articlesByType.forEach(({ type, _count }) => {
      console.log(`  - ${type}: ${_count.id} artigos`);
    });

    // 2. Total de artigos
    const totalArticles = await prisma.article.count();
    console.log(`\n📝 Total de Artigos: ${totalArticles}`);

    // 3. Artigos publicados vs rascunhos
    const publishedCount = await prisma.article.count({
      where: { published: true }
    });
    const draftCount = totalArticles - publishedCount;
    console.log(`  - Publicados: ${publishedCount}`);
    console.log(`  - Rascunhos: ${draftCount}`);

    // 4. Listar últimos 5 artigos criados (qualquer tipo)
    console.log('\n📰 Últimos 5 Artigos Criados:');
    const recentArticles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        category: true,
        published: true,
        createdAt: true
      }
    });

    if (recentArticles.length === 0) {
      console.log('  ⚠️  Nenhum artigo encontrado no banco!');
    } else {
      recentArticles.forEach((article, index) => {
        console.log(`\n  ${index + 1}. ${article.title}`);
        console.log(`     - Slug: ${article.slug}`);
        console.log(`     - Tipo: ${article.type}`);
        console.log(`     - Categoria: ${article.category}`);
        console.log(`     - Status: ${article.published ? 'Publicado' : 'Rascunho'}`);
        console.log(`     - Criado: ${article.createdAt.toISOString()}`);
      });
    }

    // 5. Contar Resources
    console.log('\n\n📦 Resources:');
    const totalResources = await prisma.resource.count();
    console.log(`  - Total: ${totalResources}`);

    const verifiedResources = await prisma.resource.count({
      where: { verified: true }
    });
    console.log(`  - Verificados: ${verifiedResources}`);
    console.log(`  - Não verificados: ${totalResources - verifiedResources}`);

    // 6. Listar últimos 3 resources
    if (totalResources > 0) {
      console.log('\n  Últimos 3 Resources Criados:');
      const recentResources = await prisma.resource.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          name: true,
          slug: true,
          category: true,
          verified: true,
          createdAt: true
        }
      });

      recentResources.forEach((resource, index) => {
        console.log(`\n    ${index + 1}. ${resource.name}`);
        console.log(`       - Slug: ${resource.slug}`);
        console.log(`       - Categoria: ${resource.category}`);
        console.log(`       - Status: ${resource.verified ? 'Verificado' : 'Não verificado'}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Diagnóstico concluído!\n');

  } catch (error) {
    console.error('❌ Erro ao executar diagnóstico:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
