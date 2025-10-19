const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

// Nota de transparência padrão
const TRANSPARENCY_NOTE = `

---

> **📊 Nota de Transparência**
>
> **Publicado por $MILAGRE Research** | Última atualização: 18/10/2025
>
> Este conteúdo é educacional e informativo, baseado em fontes verificadas do mercado cripto. Não constitui aconselhamento financeiro ou recomendação de investimento. Criptomoedas envolvem riscos - sempre conduza sua própria pesquisa (DYOR).

---
`;

async function addTransparencyNote() {
  try {
    console.log('\n📝 ADICIONANDO NOTA DE TRANSPARÊNCIA\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const articles = await prisma.article.findMany();

    console.log(`📊 Total de artigos: ${articles.length}\n`);

    const notePatterns = [
      'Nota de Transparência',
      '$MILAGRE Research',
      'Este conteúdo é educacional e informativo'
    ];

    let added = 0;
    let skipped = 0;

    for (const article of articles) {
      if (!article.content) {
        skipped++;
        continue;
      }

      // Verificar se já tem a nota
      const hasNote = notePatterns.some(pattern =>
        article.content.includes(pattern)
      );

      if (hasNote) {
        skipped++;
        continue;
      }

      // Adicionar nota ao final do conteúdo
      const newContent = article.content.trim() + TRANSPARENCY_NOTE;

      await prisma.article.update({
        where: { id: article.id },
        data: { content: newContent }
      });

      console.log(`✅ Nota adicionada a: "${article.title}"`);
      added++;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Notas adicionadas: ${added}`);
    console.log(`⏭️  Artigos pulados (já tinham nota): ${skipped}`);
    console.log(`📝 Total processado: ${articles.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTransparencyNote();
