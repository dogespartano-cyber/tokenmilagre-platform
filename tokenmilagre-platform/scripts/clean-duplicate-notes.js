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

function cleanAllTransparencyNotes(content) {
  let cleaned = content;

  // 1. REMOVER TUDO que contenha "MILAGRE Research" ou variações
  // Buscar parágrafos/blocos que contenham essas keywords e remover todo o bloco

  // Remover blockquotes que contenham MILAGRE Research
  cleaned = cleaned.replace(/>\s*\*\*[^*]*\*\*[\s\S]*?MILAGRE Research[\s\S]*?(?=\n\n|\n---|$)/gi, '');

  // Remover parágrafos que comecem com "Publicado por"
  cleaned = cleaned.replace(/Publicado por[\s\S]*?MILAGRE Research[\s\S]*?(?=\n\n|\n---|$)/gi, '');

  // Remover blocos --- que contenham MILAGRE
  cleaned = cleaned.replace(/---\s*[\s\S]*?MILAGRE Research[\s\S]*?---/gi, '');

  // Remover HTML divs
  cleaned = cleaned.replace(/<div[^>]*>[\s\S]*?MILAGRE Research[\s\S]*?<\/div>/gi, '');

  // Remover qualquer parágrafo com "aconselhamento financeiro"
  cleaned = cleaned.replace(/[^\n]*aconselhamento financeiro[^\n]*DYOR[^\n.]*/gi, '');

  // Remover notas de transparência genéricas
  cleaned = cleaned.replace(/\*\*?Nota de Transparência[\s\S]*?DYOR[^\n.]*/gi, '');

  // Remover "Sobre Este Artigo" ou variações com emoji
  cleaned = cleaned.replace(/📊\s*Sobre Este (Artigo|Conteúdo)[\s\S]*?(?=\n\n|##|\*\*Fontes|$)/gi, '');
  cleaned = cleaned.replace(/\*\*?Sobre Este (Artigo|Conteúdo)\*\*?[\s\S]*?(?=\n\n|##|\*\*Fontes|$)/gi, '');

  // Remover linhas órfãs com apenas "."
  cleaned = cleaned.replace(/\n\.\s*\n/g, '\n\n');

  // 2. LIMPEZA GERAL

  // Remover múltiplos --- seguidos
  cleaned = cleaned.replace(/---\s*\n\s*---/g, '---');

  // Remover --- órfãos (sozinhos no final ou meio do texto)
  cleaned = cleaned.replace(/\n---\s*\n\s*\n/g, '\n\n');

  // Remover múltiplas linhas vazias
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Remover --- no final
  cleaned = cleaned.replace(/\n---\s*$/g, '');

  // Limpar espaços e linhas vazias no final
  cleaned = cleaned.trim();

  return cleaned;
}

function addFinalNote(content, publishDate) {
  // Formatar data
  const date = new Date(publishDate);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Adicionar nova nota no final
  const noteWithDate = NEW_TRANSPARENCY_NOTE.replace('{DATE}', formattedDate);
  return content + '\n' + noteWithDate;
}

async function cleanAndFixAllArticles() {
  try {
    console.log('🧹 Iniciando limpeza de notas duplicadas...\n');

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Total de artigos: ${articles.length}\n`);

    let cleaned = 0;
    let skipped = 0;
    let errors = 0;

    for (const article of articles) {
      try {
        // Limpar todas as notas
        let cleanContent = cleanAllTransparencyNotes(article.content);

        // Adicionar a nota final única
        const finalContent = addFinalNote(cleanContent, article.createdAt);

        // Verificar se houve mudança
        if (finalContent === article.content) {
          console.log(`⏭️  Sem mudanças: "${article.title}"`);
          skipped++;
          continue;
        }

        await prisma.article.update({
          where: { id: article.id },
          data: { content: finalContent }
        });

        console.log(`✅ Limpo: "${article.title}"`);
        cleaned++;
      } catch (error) {
        console.error(`❌ Erro em "${article.title}": ${error.message}`);
        errors++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO DA LIMPEZA:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Artigos limpos: ${cleaned}`);
    console.log(`⏭️  Artigos sem mudanças: ${skipped}`);
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
console.log('\n🧹 Script de Limpeza - Remover Notas Duplicadas\n');
cleanAndFixAllArticles();
