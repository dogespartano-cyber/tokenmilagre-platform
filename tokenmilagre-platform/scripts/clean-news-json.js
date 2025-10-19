const fs = require('fs');
const path = require('path');

const OLD_NOTE_PATTERN = /\n\n---\n\n\*\*Nota de Transparência:\*\* Este artigo foi pesquisado via Claude com busca web em tempo real e verificação de fontes primárias, formatado pela equipe \$MILAGRE Research\. O conteúdo é educacional e informativo, não constituindo aconselhamento financeiro ou de investimento\./g;

async function cleanNewsJson() {
  try {
    const newsFilePath = path.join(process.cwd(), 'data', 'news.json');

    console.log('📂 Lendo arquivo news.json...\n');

    // Ler o arquivo
    const fileContent = fs.readFileSync(newsFilePath, 'utf-8');
    const news = JSON.parse(fileContent);

    console.log(`📊 Total de artigos no arquivo: ${news.length}\n`);

    let updated = 0;
    let skipped = 0;

    // Processar cada artigo
    news.forEach(article => {
      if (article.content) {
        const originalContent = article.content;

        // Remover a nota antiga
        article.content = article.content.replace(OLD_NOTE_PATTERN, '');

        // Também tentar remover variações
        article.content = article.content.replace(
          /---\n\n\*\*Nota de Transparência:\*\*[^\n]*Este artigo foi pesquisado via Claude[^]*$/,
          ''
        );

        if (originalContent !== article.content) {
          console.log(`✅ Nota removida: "${article.title}"`);
          updated++;
        } else {
          skipped++;
        }
      } else {
        skipped++;
      }
    });

    // Salvar arquivo atualizado
    fs.writeFileSync(newsFilePath, JSON.stringify(news, null, 2), 'utf-8');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Processo concluído!`);
    console.log(`📝 Artigos atualizados: ${updated}`);
    console.log(`⏭️  Artigos pulados: ${skipped}`);
    console.log(`💾 Arquivo salvo: ${newsFilePath}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro ao limpar news.json:', error);
    process.exit(1);
  }
}

cleanNewsJson();
