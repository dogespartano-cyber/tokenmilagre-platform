import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function removeFontesSection() {
  try {
    console.log('🔍 Buscando artigos com seção "Fontes:"...\n');

    // Buscar todos os artigos
    const articles = await prisma.article.findMany();

    console.log(`📊 Total de artigos encontrados: ${articles.length}\n`);

    let updatedCount = 0;

    for (const article of articles) {
      if (article.content.includes('**Fontes:**')) {
        console.log(`📝 Processando: ${article.title}`);
        console.log(`   Slug: ${article.slug}`);

        // Remover seção de fontes do content
        // A seção de fontes geralmente está no final após "---\n\n**Fontes:**"
        let newContent = article.content;

        // Padrão 1: ---\n\n**Fontes:**\n- [...]
        newContent = newContent.replace(/\n---\n\n\*\*Fontes:\*\*\n(?:- \[.*?\]\(.*?\)\n?)+\s*$/s, '\n---\n');

        // Padrão 2: \n**Fontes:**\n- [...] (sem --- antes)
        newContent = newContent.replace(/\n\*\*Fontes:\*\*\n(?:- \[.*?\]\(.*?\)\n?)+\s*$/s, '\n');

        // Padrão 3: Apenas garantir que termina com ---
        if (!newContent.endsWith('\n---\n') && !newContent.endsWith('\n---')) {
          // Se já tinha --- mas removemos fontes, manter o ---
          if (article.content.match(/\n---\n\n\*\*Fontes:\*\*/)) {
            if (!newContent.endsWith('\n---\n')) {
              newContent = newContent.trimEnd() + '\n---\n';
            }
          }
        }

        // Atualizar no banco
        await prisma.article.update({
          where: { id: article.id },
          data: { content: newContent }
        });

        updatedCount++;
        console.log(`   ✅ Atualizado\n`);
      }
    }

    console.log(`\n✨ Processo concluído!`);
    console.log(`📊 Artigos atualizados: ${updatedCount}/${articles.length}`);
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeFontesSection();
