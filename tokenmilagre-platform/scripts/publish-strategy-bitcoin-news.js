const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

/**
 * Script para publicar notícia sobre Strategy ampliando reservas de Bitcoin
 */

async function main() {
  console.log('📰 Publicando notícia sobre Strategy e Bitcoin...\n');

  // Buscar ID do usuário Editor
  const editor = await prisma.user.findUnique({
    where: { email: 'editor@tokenmilagre.xyz' }
  });

  if (!editor) {
    console.error('❌ Usuário editor não encontrado!');
    process.exit(1);
  }

  const article = {
    slug: 'strategy-amplia-reservas-bitcoin-compra-18-milhoes-ultrapassa-640-mil-btc',
    title: 'Strategy Amplia Reservas de Bitcoin com Compra de US$ 18,8 Milhões e Ultrapassa 640 Mil BTC',
    excerpt: 'A maior detentora corporativa de Bitcoin do mundo segue sua estratégia agressiva de acumulação, aproveitando volatilidade do mercado para ampliar posição',
    category: 'bitcoin',
    tags: JSON.stringify(['Strategy', 'MicroStrategy', 'Bitcoin', 'BTC', 'investimento institucional', 'Michael Saylor', 'reserva de valor']),
    sentiment: 'positive',
    content: `**A maior detentora corporativa de Bitcoin do mundo segue sua estratégia agressiva de acumulação, aproveitando volatilidade do mercado para ampliar posição**

A Strategy (anteriormente conhecida como MicroStrategy), maior detentora corporativa pública de Bitcoin do mundo, anunciou nesta segunda-feira (20) a aquisição de mais 168 bitcoins, reforçando sua posição como principal investidora institucional na criptomoeda.

## Detalhes da Operação

De acordo com comunicado oficial divulgado pela empresa, a compra foi realizada entre os dias 13 e 19 de outubro, com um investimento total de aproximadamente US$ 18,8 milhões a um preço médio de US$ 112.051 por bitcoin. A operação foi financiada por meio da emissão de ações preferenciais perpétuas, incluindo as séries Strike (STRK), Strife (STRF) e Stride (STRD).

Com essa aquisição, a Strategy eleva seu total de participações para impressionantes 640.418 BTC, avaliados atualmente em cerca de US$ 71,1 bilhões. O investimento acumulado da empresa no ativo digital totaliza aproximadamente US$ 47,4 bilhões, com um preço médio de aquisição de US$ 74.010 por bitcoin.

## Contexto de Mercado

A compra aconteceu durante um período de forte volatilidade no mercado de criptomoedas. O Bitcoin atingiu US$ 115.000 em 13 de outubro, mas sofreu uma correção acentuada, caindo para até US$ 103.500 em 17 de outubro. A Strategy aproveitou justamente esse período de correção para adicionar mais unidades à sua reserva estratégica.

Segundo o cofundador e CEO da empresa, Michael Saylor, essa quantidade representa mais de 3% da oferta total de 21 milhões de bitcoins, implicando cerca de US$ 23,7 bilhões em ganhos contábeis não realizados com relação aos preços atuais.

## Impacto no Mercado de Ações

A notícia teve recepção positiva no mercado financeiro tradicional. As ações da Strategy registraram alta de 3% no pregão pré-mercado, negociando próximo de US$ 300 por ação. Apesar da valorização pontual, o papel ainda permanece negativo no acumulado do ano, contrastando com o ganho de 19% do Bitcoin no mesmo período.

## Estratégia de Longo Prazo

Esta não é a primeira aquisição recente da empresa. Na semana anterior, a Strategy havia comprado 220 BTC por US$ 27,2 milhões, demonstrando seu compromisso contínuo com a estratégia de acumulação de Bitcoin. A companhia lidera as aquisições corporativas globais, com empresas listadas comprando um total líquido de US$ 31,63 milhões em Bitcoin na semana passada, sendo a Strategy responsável pela maior parte desse volume.

Com as participações atuais, a Strategy precisa de mais 59.582 BTC para alcançar a marca simbólica de 700 mil unidades em reserva. Atualmente, empresas listadas detêm coletivamente 864.940 BTC, avaliados em aproximadamente US$ 98,91 bilhões, representando 4,34% do valor de mercado circulante do Bitcoin.

## Perspectivas Futuras

A Strategy consolida sua posição como referência em adoção institucional de Bitcoin, mantendo uma política consistente de alocação de capital na criptomoeda independentemente das condições de mercado. A empresa continua utilizando mecanismos diversos de captação de recursos, incluindo emissão de ações e instrumentos financeiros especializados, para financiar suas aquisições sem comprometer sua estrutura operacional.

A movimentação reforça a tese de investidores institucionais que veem o Bitcoin como reserva de valor de longo prazo, especialmente em cenários de incerteza econômica global e políticas monetárias expansionistas.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>`
  };

  try {
    // Verificar se já existe
    const existing = await prisma.article.findUnique({
      where: { slug: article.slug }
    });

    if (existing) {
      console.log('⚠️  Artigo já existe no banco de dados!');
      console.log(`   ID: ${existing.id}`);
      console.log(`   Título: ${existing.title}`);
      console.log(`   URL: /dashboard/noticias/${existing.slug}\n`);
      return;
    }

    // Criar artigo
    const created = await prisma.article.create({
      data: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        tags: article.tags,
        sentiment: article.sentiment,
        type: 'news',
        published: true,
        authorId: editor.id,
      }
    });

    console.log('✅ Notícia publicada com sucesso!\n');
    console.log(`   📝 Título: ${created.title}`);
    console.log(`   🔗 Slug: ${created.slug}`);
    console.log(`   📊 Categoria: ${created.category}`);
    console.log(`   😊 Sentimento: ${created.sentiment}`);
    console.log(`   🏷️  Tags: ${JSON.parse(created.tags).join(', ')}`);
    console.log(`   🌐 URL: /dashboard/noticias/${created.slug}`);
    console.log(`   🆔 ID: ${created.id}\n`);

  } catch (error) {
    console.error('❌ Erro ao publicar artigo:', error.message);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
