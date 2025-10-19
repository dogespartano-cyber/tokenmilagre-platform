const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

function similarity(s1, s2) {
  // Função simples de similaridade (Levenshtein simplificado)
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1, s2) {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

async function checkDuplicates() {
  try {
    console.log('\n🔍 VERIFICANDO ARTIGOS DUPLICADOS\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Buscar todos os artigos
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Total de artigos analisados: ${articles.length}\n`);

    // 1. Verificar duplicatas por SLUG (não deveria haver, pois é unique)
    console.log('1️⃣  VERIFICANDO DUPLICATAS POR SLUG:\n');
    const slugMap = new Map();
    const duplicateSlugs = [];

    articles.forEach(article => {
      if (slugMap.has(article.slug)) {
        duplicateSlugs.push({
          slug: article.slug,
          articles: [slugMap.get(article.slug), article]
        });
      } else {
        slugMap.set(article.slug, article);
      }
    });

    if (duplicateSlugs.length > 0) {
      console.log(`❌ Encontradas ${duplicateSlugs.length} duplicatas por slug:\n`);
      duplicateSlugs.forEach(dup => {
        console.log(`   Slug: "${dup.slug}"`);
        dup.articles.forEach(art => {
          console.log(`   - ID: ${art.id} | Título: "${art.title}"`);
        });
        console.log('');
      });
    } else {
      console.log('✅ Nenhuma duplicata por slug encontrada.\n');
    }

    // 2. Verificar títulos idênticos
    console.log('2️⃣  VERIFICANDO TÍTULOS IDÊNTICOS:\n');
    const titleMap = new Map();
    const duplicateTitles = [];

    articles.forEach(article => {
      const normalizedTitle = article.title.toLowerCase().trim();
      if (titleMap.has(normalizedTitle)) {
        titleMap.get(normalizedTitle).push(article);
      } else {
        titleMap.set(normalizedTitle, [article]);
      }
    });

    titleMap.forEach((arts, title) => {
      if (arts.length > 1) {
        duplicateTitles.push({ title, articles: arts });
      }
    });

    if (duplicateTitles.length > 0) {
      console.log(`⚠️  Encontrados ${duplicateTitles.length} grupos de títulos idênticos:\n`);
      duplicateTitles.forEach(dup => {
        console.log(`   Título: "${dup.articles[0].title}"`);
        console.log(`   Quantidade: ${dup.articles.length} artigos`);
        dup.articles.forEach(art => {
          console.log(`   - ID: ${art.id} | Slug: ${art.slug} | Data: ${art.createdAt.toLocaleDateString()}`);
        });
        console.log('');
      });
    } else {
      console.log('✅ Nenhum título idêntico encontrado.\n');
    }

    // 3. Verificar títulos similares (>90% de similaridade)
    console.log('3️⃣  VERIFICANDO TÍTULOS SIMILARES (>90% similaridade):\n');
    const similarTitles = [];

    for (let i = 0; i < articles.length; i++) {
      for (let j = i + 1; j < articles.length; j++) {
        const sim = similarity(
          articles[i].title.toLowerCase(),
          articles[j].title.toLowerCase()
        );

        if (sim > 0.9 && sim < 1.0) {
          similarTitles.push({
            similarity: (sim * 100).toFixed(1),
            article1: articles[i],
            article2: articles[j]
          });
        }
      }
    }

    if (similarTitles.length > 0) {
      console.log(`⚠️  Encontrados ${similarTitles.length} pares de títulos similares:\n`);
      similarTitles.forEach(pair => {
        console.log(`   Similaridade: ${pair.similarity}%`);
        console.log(`   1. "${pair.article1.title}"`);
        console.log(`      ID: ${pair.article1.id} | Slug: ${pair.article1.slug}`);
        console.log(`   2. "${pair.article2.title}"`);
        console.log(`      ID: ${pair.article2.id} | Slug: ${pair.article2.slug}`);
        console.log('');
      });
    } else {
      console.log('✅ Nenhum título similar encontrado.\n');
    }

    // 4. Verificar conteúdo idêntico
    console.log('4️⃣  VERIFICANDO CONTEÚDO IDÊNTICO:\n');
    const contentMap = new Map();
    const duplicateContent = [];

    articles.forEach(article => {
      const contentHash = article.content.substring(0, 500); // Primeiros 500 chars
      if (contentMap.has(contentHash)) {
        contentMap.get(contentHash).push(article);
      } else {
        contentMap.set(contentHash, [article]);
      }
    });

    contentMap.forEach((arts) => {
      if (arts.length > 1) {
        // Verificar se o conteúdo completo é idêntico
        const firstContent = arts[0].content;
        const identicalArts = arts.filter(a => a.content === firstContent);

        if (identicalArts.length > 1) {
          duplicateContent.push({ articles: identicalArts });
        }
      }
    });

    if (duplicateContent.length > 0) {
      console.log(`❌ Encontrados ${duplicateContent.length} grupos de conteúdo idêntico:\n`);
      duplicateContent.forEach((dup, index) => {
        console.log(`   Grupo ${index + 1}: ${dup.articles.length} artigos com conteúdo idêntico`);
        dup.articles.forEach(art => {
          console.log(`   - ID: ${art.id} | Slug: ${art.slug}`);
          console.log(`     Título: "${art.title}"`);
        });
        console.log('');
      });
    } else {
      console.log('✅ Nenhum conteúdo idêntico encontrado.\n');
    }

    // Resumo Final
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total de artigos: ${articles.length}`);
    console.log(`Duplicatas por slug: ${duplicateSlugs.length}`);
    console.log(`Títulos idênticos: ${duplicateTitles.length} grupos`);
    console.log(`Títulos similares: ${similarTitles.length} pares`);
    console.log(`Conteúdo idêntico: ${duplicateContent.length} grupos`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const totalIssues = duplicateSlugs.length + duplicateTitles.length + duplicateContent.length;

    if (totalIssues === 0) {
      console.log('✅ PARABÉNS! Nenhuma duplicata encontrada no banco de dados.\n');
    } else {
      console.log('⚠️  ATENÇÃO! Encontradas duplicatas que precisam ser revisadas.\n');
    }

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicates();
