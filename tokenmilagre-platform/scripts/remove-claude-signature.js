const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function removeClaudeSignature() {
  try {
    // Buscar artigos publicados hoje (2025-10-20)
    const today = new Date('2025-10-20');
    const tomorrow = new Date('2025-10-21');

    const articles = await prisma.article.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    console.log(`\n📊 Encontrados ${articles.length} artigos criados hoje:\n`);

    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Created: ${article.createdAt}`);
      console.log('');
    });

    let updated = 0;

    for (const article of articles) {
      let cleanedContent = article.content;
      let wasModified = false;

      // 1. Remover título H1 do início (# Título...)
      const h1Pattern = /^#\s+.+?\n+/;
      if (h1Pattern.test(cleanedContent)) {
        cleanedContent = cleanedContent.replace(h1Pattern, '');
        wasModified = true;
        console.log(`  → Removido título H1 duplicado`);
      }

      // 2. Remover linha de data (Publicado em: ...)
      const datePattern = /^Publicado em:.+?\n+/m;
      if (datePattern.test(cleanedContent)) {
        cleanedContent = cleanedContent.replace(datePattern, '');
        wasModified = true;
        console.log(`  → Removida data de publicação duplicada`);
      }

      // 3. Remover resumo duplicado (primeiro parágrafo se for igual ao excerpt)
      if (article.excerpt) {
        // Pegar primeiro parágrafo do conteúdo
        const firstParagraphMatch = cleanedContent.match(/^(.+?)(?:\n\n|$)/);
        if (firstParagraphMatch) {
          const firstParagraph = firstParagraphMatch[1].trim();
          const excerpt = article.excerpt.trim();

          // Se o primeiro parágrafo for similar ao excerpt (70% de match)
          if (firstParagraph.includes(excerpt.substring(0, 50)) || excerpt.includes(firstParagraph.substring(0, 50))) {
            cleanedContent = cleanedContent.replace(firstParagraphMatch[0], '');
            wasModified = true;
            console.log(`  → Removido resumo duplicado`);
          }
        }
      }

      // 4. Remover linha horizontal no final (vários formatos possíveis)
      if (cleanedContent.endsWith('\n---\n')) {
        cleanedContent = cleanedContent.slice(0, -5);
        wasModified = true;
      } else if (cleanedContent.endsWith('\n---')) {
        cleanedContent = cleanedContent.slice(0, -4);
        wasModified = true;
      } else if (cleanedContent.endsWith('---\n')) {
        cleanedContent = cleanedContent.slice(0, -4);
        wasModified = true;
      } else if (cleanedContent.endsWith('---')) {
        cleanedContent = cleanedContent.slice(0, -3);
        wasModified = true;
      }

      // 5. Remover <hr> no final
      if (cleanedContent.endsWith('<hr>') || cleanedContent.endsWith('<hr/>') || cleanedContent.endsWith('<hr />')) {
        cleanedContent = cleanedContent.replace(/<hr\s*\/?>$/g, '');
        wasModified = true;
      }

      // 6. Limpar múltiplas linhas em branco
      cleanedContent = cleanedContent.replace(/\n\n\n+/g, '\n\n'); // Max 2 quebras
      cleanedContent = cleanedContent.replace(/^\n+/, ''); // Remove do início
      cleanedContent = cleanedContent.replace(/\n+$/g, '\n'); // Remove do final

      if (wasModified) {
        await prisma.article.update({
          where: { id: article.id },
          data: { content: cleanedContent }
        });

        console.log(`✅ Corrigido: ${article.title}\n`);
        updated++;
      }
    }

    console.log(`\n✨ Total atualizado: ${updated} artigos`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeClaudeSignature();
