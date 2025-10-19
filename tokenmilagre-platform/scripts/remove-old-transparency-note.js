const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

const OLD_NOTE_TEXT = `---

**Nota de Transparência:** Este artigo foi pesquisado via Claude com busca web em tempo real e verificação de fontes primárias, formatado pela equipe $MILAGRE Research. O conteúdo é educacional e informativo, não constituindo aconselhamento financeiro ou de investimento.`;

async function removeOldTransparencyNote() {
  try {
    // Buscar todos os artigos
    const articles = await prisma.article.findMany();

    console.log(`📊 Total de artigos encontrados: ${articles.length}`);

    let updated = 0;
    let skipped = 0;

    for (const article of articles) {
      if (article.content && article.content.includes(OLD_NOTE_TEXT)) {
        // Remover a nota antiga
        const newContent = article.content.replace(OLD_NOTE_TEXT, '').trim();

        await prisma.article.update({
          where: { id: article.id },
          data: { content: newContent }
        });

        console.log(`✅ Nota removida do artigo: "${article.title}"`);
        updated++;
      } else {
        skipped++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Processo concluído!`);
    console.log(`📝 Artigos atualizados: ${updated}`);
    console.log(`⏭️  Artigos pulados (sem nota antiga): ${skipped}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Erro ao remover notas antigas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeOldTransparencyNote();
