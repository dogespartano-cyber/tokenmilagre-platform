const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

/**
 * Script para publicar notícia sobre recuperação do mercado de criptomoedas
 */

async function main() {
  console.log('📰 Publicando notícia sobre recuperação do mercado cripto...\n');

  // Buscar ID do usuário Editor
  const editor = await prisma.user.findUnique({
    where: { email: 'editor@tokenmilagre.xyz' }
  });

  if (!editor) {
    console.error('❌ Usuário editor não encontrado!');
    process.exit(1);
  }

  const article = {
    slug: 'mercado-criptomoedas-recuperacao-3-porcento-385-trilhoes',
    title: 'Mercado de Criptomoedas Registra Forte Recuperação com Valorização de 3% e Retoma os US$ 3,85 Trilhões',
    excerpt: 'Após semana turbulenta com liquidações bilionárias, setor demonstra resiliência com Bitcoin e Ethereum liderando movimento de alta',
    category: 'mercado',
    tags: JSON.stringify(['mercado cripto', 'capitalização', 'Bitcoin', 'Ethereum', 'recuperação', 'volatilidade', 'altcoins', 'análise técnica']),
    sentiment: 'positive',
    content: `**Após semana turbulenta com liquidações bilionárias, setor demonstra resiliência com Bitcoin e Ethereum liderando movimento de alta**

O mercado global de criptomoedas apresentou uma recuperação expressiva nesta segunda-feira (20), com o valor total da capitalização alcançando US$ 3,85 trilhões, representando um ganho de aproximadamente 3% nas últimas 24 horas. O movimento de alta marca uma importante virada de sentimento após a semana mais volátil de outubro, quando o setor enfrentou liquidações massivas que retiraram mais de US$ 730 bilhões do mercado.

## Ampla Recuperação Entre as Principais Criptomoedas

A recuperação não se limitou apenas ao Bitcoin. Das 10 maiores criptomoedas por capitalização de mercado, sete encerraram o dia no positivo, demonstrando um movimento coordenado de compra por parte dos investidores. Esse comportamento generalizado sugere que o sentimento do mercado está se estabilizando após o período de forte correção observado na semana anterior.

O valor total do mercado de criptomoedas manteve com sucesso o nível crítico de suporte de US$ 3,59 trilhões, uma linha que tem atuado repetidamente como piso durante os recuos recentes. Analistas técnicos apontam que uma recuperação sustentada a partir desse patamar pode empurrar o mercado para US$ 3,76 trilhões, que continua sendo a principal resistência para confirmar uma tendência de alta mais ampla.

## Ethereum Reconquista Marca Psicológica dos US$ 4.000

Um dos destaques do dia foi a recuperação do Ethereum (ETH), que retomou a importante marca psicológica de US$ 4.000. A segunda maior criptomoeda do mundo havia sofrido forte pressão vendedora na semana anterior, quando o mercado enfrentou liquidações totalizando aproximadamente US$ 500 bilhões em posições alavancadas.

A recuperação do Ethereum é particularmente significativa, considerando que a criptomoeda lidera o setor de finanças descentralizadas (DeFi) com mais de US$ 90 bilhões em valor total depositado em sua rede. O ETH também se beneficia do fato de que 30% de sua oferta circulante está travada em staking, reduzindo a pressão vendedora disponível no mercado.

## Contexto da Volatilidade de Outubro

O início de outubro havia começado promissor para o mercado cripto, com o chamado "Uptober" impulsionando Bitcoin e Ethereum a máximas históricas. O Bitcoin chegou a atingir US$ 126.000 em 7 de outubro, mas sofreu uma queda abrupta de quase 10% no dia 10, chegando a ficar brevemente abaixo de US$ 108.000.

Os setores mais atingidos durante a correção foram as memecoins e tokens de inteligência artificial, ambos caindo cerca de 30%. Aproximadamente 75 dos 100 maiores criptoativos registraram baixas significativas durante o período de maior volatilidade.

## Dominância do Bitcoin Continua

Enquanto o valor total do mercado de altcoins (excluindo Bitcoin), conhecido como TOTAL2, também melhorou chegando a US$ 1,49 trilhão com aumento de 1,28% em 24 horas, esse ganho foi inferior ao crescimento do mercado total. Isso demonstra que o Bitcoin continua sendo o principal impulsionador do mercado, com sua dominância se mantendo elevada.

Para que as altcoins sinalizem força real independente do Bitcoin, o TOTAL2 precisa ultrapassar US$ 1,62 trilhão, sua próxima zona de resistência importante. Até lá, o mercado permanece dependente dos movimentos da principal criptomoeda.

## Perspectivas Técnicas e Níveis Importantes

Do ponto de vista técnico, o mercado encontra-se em um momento crucial. Se a capitalização total conseguir fechar acima de US$ 3,76 trilhões, a próxima grande meta fica próxima de US$ 3,94 trilhões. Por outro lado, a falha em manter-se acima de US$ 3,59 trilhões pode reintroduzir pressão de venda de curto prazo e arrastar as avaliações de volta para US$ 3,45 trilhões.

Os volumes de negociação permanecem elevados, tendo disparado para cerca de US$ 206 bilhões durante o pico da volatilidade, refletindo a reação intensa dos investidores à turbulência do mercado. Esse volume continua acima da média histórica, indicando que os participantes do mercado estão ativamente reposicionando suas carteiras.

## Fatores de Suporte ao Mercado

Diversos fatores fundamentais continuam oferecendo suporte ao mercado de criptomoedas. Os ETFs de Bitcoin à vista nos Estados Unidos alcançaram US$ 155 bilhões em depósitos até outubro de 2025, demonstrando forte demanda institucional. Além disso, o poder de processamento (hashrate) da rede Bitcoin apresentou alta de 55% em 12 meses, indicando crescente segurança e investimento em infraestrutura.

O segmento de stablecoins também atingiu novo recorde nesta semana, com capitalização total chegando a US$ 314 bilhões, impulsionado principalmente pelo crescimento da USDT e USDC. Esse crescimento das stablecoins é frequentemente interpretado como liquidez adicional disponível para entrada em outros criptoativos.

## Conclusão

A recuperação de 3% no valor total do mercado para US$ 3,85 trilhões, combinada com a retomada do Ethereum acima de US$ 4.000 e o desempenho positivo de 7 das 10 maiores criptomoedas, sugere que o pior da correção de outubro pode ter ficado para trás. No entanto, os investidores permanecem cautelosos, monitorando de perto os níveis técnicos críticos que determinarão se essa recuperação se consolidará em uma nova tendência de alta ou se representará apenas um alívio temporário em um mercado ainda volátil.

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
