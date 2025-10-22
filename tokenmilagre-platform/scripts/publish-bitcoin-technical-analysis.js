const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const slug = 'bitcoin-ponto-decisao-critico-20251021';

  // Verificar se já existe
  const existing = await prisma.article.findUnique({
    where: { slug }
  });

  if (existing) {
    console.log('❌ Artigo já existe:', slug);
    return;
  }

  // Conteúdo processado (sem H1, sem fontes, sem referências numeradas)
  const content = `**O mercado de Bitcoin enfrenta momento decisivo com níveis técnicos estratégicos que podem ditar a trajetória de preços nas próximas semanas**

O Bitcoin está sendo negociado em uma zona de volatilidade intensa nesta terça-feira, 21 de outubro de 2025, com o preço oscilando entre $107.444 e $114.082 durante o dia, atualmente cotado em torno de $112.607. Analistas técnicos apontam que os próximos movimentos do ativo digital dependem crucialmente de como o preço reagirá a níveis específicos de suporte e resistência.

## Cenário de Alta: Rompimento Acima de $110.800

De acordo com análises técnicas recentes, uma quebra decisiva acima de **$110.800** representa o primeiro gatilho para um movimento altista mais expressivo. Este nível atua como resistência psicológica importante, marcando a transição de uma zona de consolidação para uma possível retomada da tendência de alta.

Caso o Bitcoin consiga superar esta barreira com volume significativo, os próximos alvos técnicos estão estabelecidos em **$113.200** e posteriormente **$115.000**. Estes patamares coincidem com áreas de resistência histórica e zonas de fornecimento onde grandes volumes de negociação ocorreram anteriormente, tornando-se pontos naturais de realização de lucros.

Um fator adicional que reforça a importância deste movimento é o **nível crítico de liquidação em $112.300**. Quando o preço ultrapassa esta marca, ocorre uma cascata de liquidações de posições vendidas (shorts), gerando combustível adicional para impulsionar o preço ainda mais alto através de compras forçadas no mercado.

## Cenário de Baixa: Perda do Suporte em $107.000

No lado oposto, a perda do suporte crítico em **$107.000** representa um sinal técnico preocupante para os investidores otimistas. Este nível está próximo da média móvel simples de 200 dias, atualmente em $107.846, que historicamente tem separado mercados de alta e baixa para o Bitcoin.

Uma quebra sustentada abaixo de $107.000 com volume confirmando a pressão vendedora abriria caminho para uma correção mais profunda, com o próximo suporte relevante posicionado em **$104.500**. Esta zona representa uma área de consolidação anterior e coincide com níveis técnicos onde compradores institucionais demonstraram interesse histórico.

Analistas alertam que, caso este suporte também seja rompido, o Bitcoin poderia testar a zona psicológica de $100.000 a $102.000, onde a média móvel de 365 dias ($100.367) tem servido consistentemente como suporte secundário durante este ciclo.

## Contexto do Mercado Atual

O Bitcoin acumula queda de aproximadamente 5% durante outubro, um desempenho decepcionante para o que tradicionalmente é chamado de "Uptober" - período historicamente forte para a criptomoeda. O mercado total de criptomoedas registra capitalização de $3,76 trilhões, com volume de negociação de $156,6 bilhões nas últimas 24 horas.

As liquidações nas últimas 24 horas totalizaram **$320 milhões**, com 76% provenientes de posições compradas, indicando que o mercado ainda está eliminando o excesso de alavancagem acumulado. O open interest em futuros de Bitcoin subiu para $26,06 bilhões, sinalizando que traders estão reposicionando suas apostas conforme aguardam definição direcional.

## Indicadores Técnicos em Foco

Os principais indicadores técnicos apresentam sinais mistos. O RSI (Índice de Força Relativa) está em território neutro após sair da zona de sobrecompra, oferecendo espaço para movimento significativo em qualquer direção. O MACD mostra viés baixista no curto prazo, embora traders monitorem um possível cruzamento altista que poderia confirmar formação de fundo.

A estrutura de médias móveis revela que o Bitcoin está testando sua média de 128 dias, que historicamente serviu como trampolim para ralis durante este ciclo de alta. Manter-se acima desta média é considerado crítico para preservar o viés altista de longo prazo.

## Perspectivas para os Próximos Dias

O mercado se encontra em um momento de compressão técnica, com o preço travado entre a média móvel de 200 dias e a de 365 dias - uma configuração que historicamente pode durar meses. Esta é a quarta vez neste ciclo que o Bitcoin enfrenta esta situação, sugerindo que paciência e gestão de risco são fundamentais.

Traders profissionais estão observando atentamente o comportamento do volume nos extremos do range atual, pois expansão volumétrica frequentemente antecede o rompimento direcional. A definição deste movimento nas próximas sessões pode estabelecer a trajetória do Bitcoin para o restante de outubro e início de novembro.

Para investidores, a recomendação técnica é clara: aguardar confirmação de rompimento dos níveis-chave antes de aumentar exposição, utilizando stops bem definidos em $107.000 no lado da baixa e $110.800 no lado da alta como pontos de invalidação das respectivas teses.`;

  const article = await prisma.article.create({
    data: {
      slug,
      title: 'Bitcoin em Ponto de Decisão Crítico: Níveis Técnicos Definem Próximos Movimentos',
      excerpt: 'O mercado de Bitcoin enfrenta momento decisivo com níveis técnicos estratégicos que podem ditar a trajetória de preços nas próximas semanas. Análise aponta suportes e resistências críticos.',
      content,
      category: 'bitcoin',
      tags: JSON.stringify(['bitcoin', 'análise técnica', 'trading', 'preço', 'suporte', 'resistência', 'mercado cripto']),
      sentiment: 'neutral',
      published: true,
      authorId: 'cmggcrcr40001ijinifhwp0zq', // Editor
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log('✅ Artigo sobre análise técnica do Bitcoin criado com sucesso!');
  console.log('📊 Título:', article.title);
  console.log('📂 Categoria:', article.category);
  console.log('💭 Sentimento:', article.sentiment);
  console.log('🏷️  Tags:', article.tags);
  console.log('🌐 URL: http://localhost:3000/dashboard/noticias/' + slug);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar artigo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
