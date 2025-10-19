#!/usr/bin/env node

/**
 * Script para corrigir cabeçalhos "Sobre Este Artigo" no banco de dados
 * Substitui: "** Sobre Este Artigo**" -> "📊 Sobre Este Artigo"
 */

const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Iniciando correção de cabeçalhos...\n');

  try {
    // Buscar todos os artigos
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    console.log(`📊 Total de artigos no banco: ${articles.length}\n`);

    let updatedCount = 0;

    for (const article of articles) {
      if (!article.content) continue;

      // Verificar se contém o texto antigo
      const oldPattern1 = /\*\* Sobre Este Artigo\*\*/g;
      const oldPattern2 = /\*\*📊 Sobre Este Artigo\*\*/g;

      if (oldPattern1.test(article.content) || oldPattern2.test(article.content)) {
        // Aplicar correções
        let newContent = article.content;
        newContent = newContent.replace(/\*\* Sobre Este Artigo\*\*/g, '📊 Sobre Este Artigo');
        newContent = newContent.replace(/\*\*📊 Sobre Este Artigo\*\*/g, '📊 Sobre Este Artigo');

        // Atualizar no banco
        await prisma.article.update({
          where: { id: article.id },
          data: { content: newContent },
        });

        updatedCount++;
        console.log(`✅ Atualizado: ${article.title}`);
      }
    }

    console.log(`\n🎉 Correção concluída!`);
    console.log(`   Artigos atualizados: ${updatedCount}/${articles.length}`);

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
