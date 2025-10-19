#!/usr/bin/env node

/**
 * Script para substituir URLs de fontes por fontes genéricas no banco de dados
 * Remove URLs quebrados e usa apenas nomes de sites confiáveis
 */

const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Iniciando correção de fontes...\n');

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

      // Verificar se tem seção de fontes com URLs
      if (article.content.includes('**Fontes:**') || article.content.includes('**Fontes Consultadas:**')) {

        // Substituir toda a seção de fontes (desde **Fontes:** até o próximo ---)
        let newContent = article.content;

        // Padrão 1: **Fontes:**
        newContent = newContent.replace(
          /\*\*Fontes:\*\*[\s\S]*?(?=\n---)/,
          `**Fontes Consultadas:**
- CoinDesk
- Cointelegraph
- BeInCrypto
- Decrypt
- CoinTelegraph Brasil`
        );

        // Padrão 2: **Fontes Consultadas:** (caso já tenha sido parcialmente corrigido)
        newContent = newContent.replace(
          /\*\*Fontes Consultadas:\*\*[\s\S]*?(?=\n---)/,
          `**Fontes Consultadas:**
- CoinDesk
- Cointelegraph
- BeInCrypto
- Decrypt
- CoinTelegraph Brasil`
        );

        // Se houve mudança, atualizar
        if (newContent !== article.content) {
          await prisma.article.update({
            where: { id: article.id },
            data: { content: newContent },
          });

          updatedCount++;
          console.log(`✅ Atualizado: ${article.title}`);
        }
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
