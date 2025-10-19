#!/usr/bin/env node

const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

const NEW_TRANSPARENCY_NOTE = `
---

> **📊 Nota de Transparência**
>
> **Publicado por $MILAGRE Research** | Última atualização: {DATE}
>
> Este conteúdo é educacional e informativo, baseado em fontes verificadas do mercado cripto. Não constitui aconselhamento financeiro ou recomendação de investimento. Criptomoedas envolvem riscos - sempre conduza sua própria pesquisa (DYOR).

---
`;

function migrateTransparencyNote(content, publishDate) {
  // Remover notas antigas (HTML ou texto simples)
  let cleanContent = content;

  // Remover nota HTML antiga
  cleanContent = cleanContent.replace(/<div style="background: linear-gradient[^>]+>[\s\S]*?<\/div>/g, '');

  // Remover nota de texto simples antiga (várias variações)
  cleanContent = cleanContent.replace(/---\s*\n\s*Publicado por \*\*\$MILAGRE Research\*\*[\s\S]*?---/g, '');
  cleanContent = cleanContent.replace(/Publicado por \*\*\$MILAGRE Research\*\*[\s\S]*?(DYOR|pesquisa)\./g, '');

  // Remover múltiplas linhas vazias
  cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n');

  // Remover --- no final se existir
  cleanContent = cleanContent.replace(/\n---\s*$/, '');
  cleanContent = cleanContent.trim();

  // Formatar data
  const date = new Date(publishDate);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Adicionar nova nota no final
  const noteWithDate = NEW_TRANSPARENCY_NOTE.replace('{DATE}', formattedDate);
  const newContent = cleanContent + '\n' + noteWithDate;

  return newContent;
}

async function migrateAllArticles() {
  try {
    console.log('🔄 Iniciando migração de Notas de Transparência...\n');

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Total de artigos: ${articles.length}\n`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const article of articles) {
      try {
        // Verificar se já tem o novo formato
        if (article.content.includes('📊 Nota de Transparência')) {
          console.log(`⏭️  Já migrado: "${article.title}"`);
          skipped++;
          continue;
        }

        const newContent = migrateTransparencyNote(article.content, article.createdAt);

        await prisma.article.update({
          where: { id: article.id },
          data: { content: newContent }
        });

        console.log(`✅ Migrado: "${article.title}"`);
        migrated++;
      } catch (error) {
        console.error(`❌ Erro em "${article.title}": ${error.message}`);
        errors++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO DA MIGRAÇÃO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Artigos migrados: ${migrated}`);
    console.log(`⏭️  Artigos já estavam no novo formato: ${skipped}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📊 Total processado: ${articles.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
console.log('\n🚀 Script de Migração - Nota de Transparência\n');
migrateAllArticles();
