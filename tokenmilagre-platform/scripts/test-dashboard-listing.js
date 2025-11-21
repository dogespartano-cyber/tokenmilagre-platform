/**
 * Script de Teste - Simulação de Listagem do Dashboard
 *
 * Simula exatamente o que /dashboard/artigos faz ao buscar dados
 * Para diagnosticar por que News/Educational não aparecem
 */

const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function testDashboardListing() {
  console.log('🔍 Teste de Listagem do Dashboard\n');
  console.log('='.repeat(60));

  try {
    // Simular o que a API /api/admin/articles faz
    console.log('\n📰 1. Testando busca de ARTICLES (News + Educational):');
    console.log('   Endpoint: /api/admin/articles?published=all&limit=100\n');

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    console.log(`   ✅ Total encontrado: ${articles.length} artigos`);

    // Contar por tipo
    const newCount = articles.filter(a => a.type === 'news').length;
    const eduCount = articles.filter(a => a.type === 'educational').length;
    const otherCount = articles.filter(a => a.type !== 'news' && a.type !== 'educational').length;

    console.log(`   - News: ${newCount}`);
    console.log(`   - Educational: ${eduCount}`);
    if (otherCount > 0) {
      console.log(`   - Outros tipos: ${otherCount}`);
    }

    // Mostrar 3 primeiros
    if (articles.length > 0) {
      console.log('\n   Primeiros 3 artigos:');
      articles.slice(0, 3).forEach((article, i) => {
        console.log(`\n   ${i + 1}. ${article.title}`);
        console.log(`      Tipo: ${article.type}`);
        console.log(`      Categoria: ${article.category}`);
        console.log(`      Publicado: ${article.published}`);
        console.log(`      Autor: ${article.author?.name || article.author?.email}`);
      });
    }

    // Simular o que a API /api/resources faz
    console.log('\n\n📦 2. Testando busca de RESOURCES:');
    console.log('   Endpoint: /api/resources?verified=all\n');

    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    console.log(`   ✅ Total encontrado: ${resources.length} resources`);

    const verifiedCount = resources.filter(r => r.verified).length;
    console.log(`   - Verificados: ${verifiedCount}`);
    console.log(`   - Não verificados: ${resources.length - verifiedCount}`);

    // Mostrar 3 primeiros
    if (resources.length > 0) {
      console.log('\n   Primeiros 3 resources:');
      resources.slice(0, 3).forEach((resource, i) => {
        console.log(`\n   ${i + 1}. ${resource.name}`);
        console.log(`      Categoria: ${resource.category}`);
        console.log(`      Verificado: ${resource.verified}`);
      });
    }

    // Simular a unificação que o frontend faz
    console.log('\n\n🔄 3. Simulando UNIFICAÇÃO do Frontend:');
    console.log('   Código: const allContent = [...articles, ...resources]\n');

    const allContent = [...articles, ...resources];
    console.log(`   ✅ Total unificado: ${allContent.length} itens`);
    console.log(`   - Articles (News + Educational): ${articles.length}`);
    console.log(`   - Resources: ${resources.length}`);

    // Verificar se há campos que podem quebrar a renderização
    console.log('\n\n🔍 4. Verificando CAMPOS CRÍTICOS:');

    // Verificar se articles têm campo 'type'
    const articlesWithoutType = articles.filter(a => !a.type);
    if (articlesWithoutType.length > 0) {
      console.log(`   ⚠️  ${articlesWithoutType.length} artigos SEM campo 'type'`);
    } else {
      console.log(`   ✅ Todos os ${articles.length} artigos têm campo 'type'`);
    }

    // Verificar se articles têm campos obrigatórios
    const articlesWithoutTitle = articles.filter(a => !a.title);
    const articlesWithoutExcerpt = articles.filter(a => !a.excerpt);

    if (articlesWithoutTitle.length > 0) {
      console.log(`   ⚠️  ${articlesWithoutTitle.length} artigos SEM 'title'`);
    }
    if (articlesWithoutExcerpt.length > 0) {
      console.log(`   ⚠️  ${articlesWithoutExcerpt.length} artigos SEM 'excerpt'`);
    }

    // Verificar se resources têm campos obrigatórios
    const resourcesWithoutName = resources.filter(r => !r.name);
    const resourcesWithoutShortDesc = resources.filter(r => !r.shortDescription);

    if (resourcesWithoutName.length > 0) {
      console.log(`   ⚠️  ${resourcesWithoutName.length} resources SEM 'name'`);
    }
    if (resourcesWithoutShortDesc.length > 0) {
      console.log(`   ⚠️  ${resourcesWithoutShortDesc.length} resources SEM 'shortDescription'`);
    }

    // Análise final
    console.log('\n\n📊 5. DIAGNÓSTICO FINAL:');

    if (articles.length === 0) {
      console.log('   ❌ PROBLEMA ENCONTRADO: Nenhum artigo foi retornado pela query!');
      console.log('   Causa provável: Problema na API /api/admin/articles');
    } else if (articles.length > 0 && resources.length > 0) {
      console.log('   ✅ Ambas queries retornam dados corretamente');
      console.log('   ✅ Total de itens: ' + allContent.length);
      console.log('\n   Se apenas Resources aparecem no frontend, o problema é:');
      console.log('   - Renderização condicional quebrando para Articles');
      console.log('   - Filtro aplicado inadvertidamente');
      console.log('   - Problema de permissões/auth no browser');
    } else if (articles.length > 0 && resources.length === 0) {
      console.log('   ℹ️  Apenas Articles no banco (Resources vazios)');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Teste concluído!\n');

  } catch (error) {
    console.error('❌ Erro ao executar teste:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDashboardListing();
