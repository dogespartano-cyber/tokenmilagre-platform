const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const slug = 'eua-maior-apreensao-bitcoin-historia-15-bilhoes-20251021';

  // Verificar se já existe
  const existing = await prisma.article.findUnique({
    where: { slug }
  });

  if (existing) {
    console.log('❌ Artigo já existe:', slug);
    return;
  }

  // Conteúdo processado (sem H1, sem fontes, sem referências numeradas)
  const content = `**Governo americano confisca 127 mil BTC ligados a esquema internacional de fraudes comandado do Camboja, marcando recorde histórico em apreensões de criptomoedas e gerando debate sobre segurança de ativos digitais**

O Departamento de Justiça dos Estados Unidos anunciou nesta semana a maior apreensão de Bitcoin da história: mais de **US$ 14 bilhões**, equivalentes a aproximadamente **127 mil BTC**, supostamente vinculados a um esquema internacional de fraudes baseado no Camboja. A operação, conduzida em parceria com o Reino Unido, representa um marco sem precedentes no combate a crimes financeiros envolvendo criptomoedas e levanta questões importantes sobre confiança do mercado e segurança dos ativos digitais.

## O Mentor do "Abate de Porcos"

No centro da investigação está **Chen Zhi**, empresário cambojano de 37 anos e fundador do conglomerado Prince Group, descrito pelas autoridades como o "chefão do abate de porcos". Zhi foi formalmente acusado em Nova York por conspiração envolvendo lavagem de dinheiro, fraude eletrônica, organização criminosa, tráfico de pessoas, tortura, extorsão, exploração sexual e manutenção de pessoas em condições análogas à escravidão.

O termo **"pig butchering"** (abate de porcos) refere-se a um tipo sofisticado de fraude que mistura romance falso e manipulação emocional. Os criminosos primeiro "engordam" a confiança das vítimas através de relacionamentos online construídos ao longo de semanas ou meses, para então "abater" financeiramente, convencendo-as a enviar valores cada vez maiores para plataformas de investimento fraudulentas em criptomoedas.

## Esquema Global de Proporções Gigantescas

Segundo o Departamento de Justiça, desde **2015**, Chen Zhi e seus associados criaram pelo menos **dez zonas econômicas falsas** para atrair vítimas de golpes de criptoinvestimentos, gerando bilhões de dólares em lucros ilícitos. A operação teria atingido vítimas em mais de **30 países** e movimentado cerca de **R$ 80 bilhões** (aproximadamente US$ 16 bilhões).

O que torna este caso particularmente perturbador é o envolvimento de **trabalho forçado**. A investigação revelou que operadores do esquema recrutavam e, em muitos casos, traficavam pessoas para trabalhar em "fazendas de celulares" no Camboja, onde eram forçadas a aplicar golpes online contra vítimas ao redor do mundo.

A operação criminosa movimentava mais de **R$ 160 milhões por dia** e, desde 2014, Chen Zhi vinha transformando seu conglomerado em uma das maiores organizações criminosas da Ásia. Os lucros obtidos foram convertidos em Bitcoin e usados para comprar iates, obras de arte (incluindo uma pintura de Pablo Picasso adquirida em Nova York), jatos particulares, relógios de luxo e imóveis.

## Operação Internacional de Larga Escala

A apreensão foi resultado de uma operação conjunta entre Estados Unidos e Reino Unido. O governo britânico anunciou o congelamento de bens pertencentes ao Prince Group, incluindo **19 propriedades em Londres**, uma delas avaliada em quase **100 milhões de libras esterlinas** (aproximadamente US$ 123 milhões).

O Prince Group foi oficialmente sancionado nos EUA e rotulado como uma **organização criminosa**. As criptomoedas apreendidas agora estão sob custódia do governo dos Estados Unidos, e Chen Zhi, que permanece foragido, pode enfrentar até **40 anos de prisão** se for condenado.

## Recorde Absoluto em Confiscos

Esta apreensão supera todos os recordes anteriores de confisco de criptomoedas nos Estados Unidos, incluindo até mesmo as apreensões históricas ligadas à **Silk Road**, o infame marketplace da dark web fechado em 2013. Para contextualizar a magnitude: em fevereiro de 2022, o que era considerado a maior apreensão de Bitcoin da história envolveu 94.000 BTC avaliados em US$ 3,6 bilhões. A operação atual supera esse valor em mais de **300%**.

Apenas em junho de 2025, o Serviço Secreto dos EUA havia realizado o que era então sua maior apreensão, confiscando US$ 225,3 milhões em ativos digitais ligados a esquemas de fraude. A atual operação é **62 vezes maior** que aquele confisco.

## Impacto na Confiança do Mercado

A notícia da apreensão está gerando ondas de preocupação no mercado de criptomoedas sobre questões fundamentais de **confiança e segurança** dos ativos digitais. Investidores e analistas questionam como um esquema desta magnitude conseguiu operar por quase uma década sem detecção mais precoce pelas autoridades reguladoras.

A transparência da blockchain, frequentemente citada como uma vantagem de segurança das criptomoedas, revelou-se uma faca de dois gumes: embora tenha permitido às autoridades rastrear os fundos roubados através de milhares de transações, não impediu que bilhões fossem desviados ao longo de anos.

Especialistas alertam que casos como este podem impactar negativamente a percepção pública sobre a legitimidade das criptomoedas como classe de ativos, especialmente entre investidores institucionais que ainda avaliam sua entrada neste mercado. A associação de grandes volumes de Bitcoin com atividades criminosas reforça narrativas negativas que o setor vem tentando combater.

## Metodologia do Golpe

O esquema operava através de um método sofisticado e psicologicamente manipulador. O contato inicial era feito por meio de mensagens em redes sociais, onde golpistas criavam perfis falsos e estabeleciam relacionamentos com as vítimas. Após ganhar confiança, os criminosos apresentavam supostos ganhos financeiros em plataformas de investimento em criptomoedas e convenciam as vítimas a investirem quantias cada vez maiores.

As plataformas fraudulentas mostravam lucros fictícios, encorajando as vítimas a investir mais. Somente quando tentavam sacar os lucros prometidos, descobriam que haviam sido completamente enganadas. Nesse ponto, os valores já haviam sido transferidos e convertidos em Bitcoin, tornando a recuperação extremamente difícil.

## Chen Zhi: De Empresário Celebrado a Criminoso Internacional

A transformação de Chen Zhi de empresário respeitado a chefe de organização criminosa é um dos aspectos mais perturbadores do caso. O cambojano foi anteriormente **eleito personalidade do ano** em seu país e comandava um conglomerado com operações nos setores imobiliário e financeiro. Esta fachada de legitimidade permitiu que suas operações criminosas prosperassem sem suspeitas significativas por anos.

## Perspectivas e Consequências

Este caso estabelece um novo padrão para a perseguição de crimes financeiros envolvendo criptomoedas e demonstra a crescente capacidade das autoridades em rastrear e confiscar ativos digitais. A cooperação internacional entre Estados Unidos e Reino Unido mostra que jurisdições estão cada vez mais coordenadas no combate a crimes transnacionais envolvendo criptoativos.

Para o mercado de criptomoedas, o evento serve como um lembrete severo sobre a necessidade de due diligence rigorosa e ceticismo saudável em relação a promessas de retornos extraordinários. A educação de investidores sobre golpes comuns, particularmente o esquema de "abate de porcos", tornou-se uma prioridade para exchanges e organizações do setor.

As vítimas do esquema, espalhadas por mais de 30 países, aguardam agora para saber se poderão recuperar parte de seus fundos perdidos através do processo legal. Historicamente, apreensões de grande escala resultam em fundos sendo devolvidos às vítimas após conclusão dos processos judiciais, embora este seja um processo que pode levar anos.

Enquanto Chen Zhi permanece foragido, sua inclusão nas listas internacionais de criminosos procurados torna improvável que consiga evitar a justiça indefinidamente. A magnitude das acusações e a cooperação internacional sugerem que autoridades manterão pressão contínua até sua captura.`;

  const article = await prisma.article.create({
    data: {
      slug,
      title: 'EUA Realizam Maior Apreensão de Bitcoin da História: US$ 15 Bilhões Confiscados em Operação Global',
      excerpt: 'Governo americano confisca 127 mil BTC ligados a esquema internacional de fraudes comandado do Camboja, marcando recorde histórico em apreensões de criptomoedas.',
      content,
      category: 'politica',
      tags: JSON.stringify(['bitcoin', 'apreensão', 'fraude', 'pig butchering', 'chen zhi', 'crime', 'regulação', 'camboja']),
      sentiment: 'negative',
      published: true,
      authorId: 'cmggcrcr40001ijinifhwp0zq', // Editor
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log('✅ Artigo sobre apreensão recorde de Bitcoin criado com sucesso!');
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
