
import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

const curiosities = [
    {
        slug: "primeira-transacao-bitcoin-pizza",
        content: "A primeira transação de Bitcoin foi 10.000 BTC por duas pizzas em 2010.",
        description: "Conheça a história do 'Bitcoin Pizza Day' e como uma simples vontade de comer pizza marcou o início da economia cripto.",
        category: "História",
        keywords: ["Bitcoin", "História", "Curiosidade", "Adoção", "Pizza"],
        fullContent: `
# A Pizza de R$ 3 Bilhões: O Nascimento do Comércio em Bitcoin

Em 22 de maio de 2010, um programador chamado **Laszlo Hanyecz** fez história - e provavelmente o pedido de delivery mais caro de todos os tempos. Esta data é hoje celebrada mundialmente como o **Bitcoin Pizza Day**.

## O Pedido Lendário

Laszlo postou no fórum *BitcoinTalk*, o ponto de encontro original dos entusiastas de cripto, oferecendo **10.000 Bitcoins** para quem lhe entregasse duas pizzas grandes. Na época, esses 10.000 BTC valiam cerca de **41 dólares**.

> "Eu pagarei 10.000 bitcoins por um par de pizzas.. talvez duas grandes para que sobre para o dia seguinte." — Laszlo Hanyecz

Um estudante britânico chamado Jeremy Sturdivant aceitou a oferta. Ele comprou duas pizzas da Papa John's por cerca de $25 e as entregou a Laszlo, recebendo as moedas digitais em troca.

## Por Que Isso Importa?

Pode parecer apenas uma troca curiosa, mas foi um marco fundamental: **foi a primeira vez que o Bitcoin foi usado como meio de troca por um bem real e tangível**. Antes desse momento, o Bitcoin era apenas um experimento de nicho minerado por hobby.

Essa transação provou que a moeda digital tinha valor real e poderia ser usada no comércio, pavimentando o caminho para a adoção global que vemos hoje.

## Quanto Valeriam Hoje?

A parte "dolorosa" (ou divertida) da história é calcular o valor atual.
- **2010**: $41 USD
- **2021 (Alta Histórica)**: ~$690.000.000 USD
- **Hoje**: Calcule 10.000 x a cotação atual!

Se Laszlo tivesse guardado esses Bitcoins, hoje ele seria bilionário. No entanto, ele afirma não se arrepender: "Alguém tinha que começar a gastar", disse ele em entrevistas. Graças a sua fome de pizza, o Bitcoin deu seu primeiro passo para se tornar um ativo global.
    `
    },
    {
        slug: "fortuna-satoshi-nakamoto",
        content: "Satoshi Nakamoto, o criador do Bitcoin, possui cerca de 1.1 milhão de BTC.",
        description: "Uma das maiores fortunas do mundo permanece intocada há mais de uma década. Onde estão os Bitcoins do criador?",
        category: "Mistério",
        keywords: ["Satoshi Nakamoto", "Bitcoin", "Riqueza", "Mistério"],
        fullContent: `
# O Tesouro Intocado de Satoshi Nakamoto

Satoshi Nakamoto não é apenas o misterioso criador do Bitcoin - ele é também, potencialmente, uma das pessoas mais ricas do planeta. Análises da blockchain revelam um fato impressionante: as carteiras associadas à mineração inicial do Bitcoin, atribuídas a Satoshi, contêm cerca de **1.1 milhão de BTC**.

## A "Mineração Patrão"

Nos primeiros dias da rede, em 2009, Satoshi era um dos únicos mineradores ativos. Ele minerou milhares de blocos para manter a rede segura e operacional. O resultado é um acúmulo massivo de moedas que, curiosamente, **nunca foram movidas**.

## Por Que Ninguém Mexeu?

Existem várias teorias sobre o porquê desses fundos permanecerem estáticos:

1.  **Altruísmo**: Satoshi queria evitar que uma única pessoa tivesse poder de mercado excessivo para derrubar o preço.
2.  **Perda de Chaves**: As chaves privadas podem ter sido perdidas ou destruídas propositalmente.
3.  **Falecimento**: Uma teoria comum é que Satoshi (ou o indivíduo principal do grupo) pode ter falecido, como Hal Finney, um dos primeiros pioneiros.

## O Impacto no Mercado

Se esses 1.1 milhão de BTC fossem vendidos de uma vez, causariam um choque sísmico no mercado de criptomoedas. No entanto, a imobilidade desses fundos por mais de 15 anos transformou-os em uma espécie de "lastro" psicológico para a comunidade.

Para muitos, o fato de Satoshi nunca ter lucrado com sua invenção é a prova definitiva da pureza e descentralização do projeto Bitcoin.
    `
    },
    {
        slug: "bitcoin-perdido-sempre",
        content: "Estima-se que cerca de 20% de todo o Bitcoin existente esteja perdido para sempre.",
        description: "Discos rígidos no lixo, senhas esquecidas e chaves perdidas. Descubra como milhões de Bitcoins saíram de circulação.",
        category: "Curiosidade",
        keywords: ["Escassez", "Bitcoin", "Segurança", "Blockchain"],
        fullContent: `
# O Tesouro Perdido da Era Digital

Diferente do dinheiro fiduciário que pode ser reimpresso, ou do ouro que pode ser derretido e reusado, o Bitcoin perdido está... bem, perdido para sempre. Segundo análises da empresa **Chainalysis**, estima-se que entre **17% a 23%** de todos os Bitcoins já minerados estão inacessíveis permanentemente.

## Como se Perde um Ativo Digital?

As histórias variam do trágico ao cômico:

*   **Esquecimento de Senhas**: Carteiras antigas protegidas por senhas que os donos não lembram mais.
*   **Hardware no Lixo**: O famoso caso de James Howells, que jogou fora um disco rígido contendo 8.000 BTC e vem tentando convencer a prefeitura a deixá-lo escavar o aterro sanitário há anos.
*   **Morte sem Herdeiros**: Investidores que faleceram sem deixar instruções de acesso para suas famílias.

## Escassez Aumentada

Essa perda permanente tem um efeito econômico importante: **deflação**.
O limite máximo de Bitcoins é 21 milhões. Se considerarmos que ~4 milhões estão perdidos, o suprimento real circulante máximo será de apenas ~17 milhões.

Na prática, cada Bitcoin perdido é uma doação para todos os outros detentores de Bitcoin, pois torna as moedas restantes ligeiramente mais raras e valiosas. Como dizem no meio cripto: *"Lost coins only make everyone else's coins worth slightly more."*
    `
    },
    {
        slug: "ultimo-bitcoin-minerado-2140",
        content: "O último Bitcoin será minerado por volta do ano 2140.",
        description: "O cronograma de emissão do Bitcoin se estende por mais de um século. O que acontece quando o último Satoshi for criado?",
        category: "Futuro",
        keywords: ["Halving", "Mineração", "Futuro", "Economia"],
        fullContent: `
# 2140: O Ano Final da Emissão

O protocolo do Bitcoin é regido por uma regra matemática imutável: só existirão **21 milhões** de unidades. Mas eles não são liberados de uma vez. A emissão segue uma curva logarítmica controlada pelo evento conhecido como **Halving**.

## O Ritmo dos Halvings

A cada 210.000 blocos (aproximadamente 4 anos), a recompensa dada aos mineradores por bloco cai pela metade.
*   2009: 50 BTC
*   2012: 25 BTC
*   2016: 12.5 BTC
*   2020: 6.25 BTC
*   2024: 3.125 BTC

Esse processo continuará até que a recompensa chegue a zero. Cálculos matemáticos projetam que isso ocorrerá por volta do ano **2140**.

## E Depois de 2140?

Muitos perguntam: *"Os mineradores vão parar de trabalhar?"* *"A rede vai morrer?"*
A resposta é **não**.

Quando não houver mais novos Bitcoins para serem criados, os mineradores serão remunerados exclusivamente pelas **taxas de transação**. Espera-se que, até lá, o volume de transações e o valor do Bitcoin sejam altos o suficiente para que apenas as taxas sustentem a segurança da rede.

O Bitcoin foi projetado para ser um sistema autossustentável que sobrevive aos seus criadores e netos.
    `
    },
    {
        slug: "poder-rede-bitcoin-supercomputadores",
        content: "A rede Bitcoin é mais poderosa do que os 500 maiores supercomputadores do mundo juntos.",
        description: "Em termos de poder de processamento bruto, nada na Terra se compara à rede de mineração do Bitcoin.",
        category: "Tecnologia",
        keywords: ["Mineração", "Hashrate", "Tecnologia", "Segurança"],
        fullContent: `
# A Maior Força Computacional da Terra

Frequentemente ouvimos sobre o consumo de energia do Bitcoin, mas raramente sobre o que essa energia produz: a rede de computação mais segura e poderosa da história da humanidade.

Se somarmos todo o poder de processamento (hashrate) dedicado a proteger a rede Bitcoin, o número ultrapassa a capacidade combinada dos **500 supercomputadores mais potentes do mundo**.

## Segurança Através da Força Bruta

Esse poder colossal não é desperdício; é uma muralha digital. Para hackear ou "reverter" o Bitcoin (um ataque de 51%), um atacante precisaria reunir mais poder computacional do que toda essa rede combinada.

*   Isso exigiria bilhões de dólares em hardware.
*   Consumiria a energia de um país pequeno.
*   Seria logisticamente impossível adquirir tantos chips de uma só vez.

## Especialização vs Generalização

Vale notar a diferença: supercomputadores são máquinas de "propósito geral" para cálculos científicos complexos. Os mineradores de Bitcoin (ASICs) são máquinas de "propósito único", projetadas para fazer apenas uma coisa: calcular hashes SHA-256.

Ainda assim, a escala da infraestrutura física do Bitcoin - galpões de servidores espalhados do Texas à Islândia - representa a maior mobilização de recursos de hardware para um único propósito descentralizado que já vimos.
    `
    },
    {
        slug: "erro-digitacao-hodl-2013",
        content: "O termo 'HODL' surgiu de um erro de digitação em um fórum em 2013.",
        description: "Como um post bêbado e frustrado criou a gíria mais famosa do mercado financeiro moderno.",
        category: "Cultura",
        keywords: ["HODL", "Meme", "Cultura", "História"],
        fullContent: `
# I AM HODLING: O Erro que Virou Mantra

No mundo das finanças tradicionais, temos termos como "Buy and Hold" (Comprar e Segurar). No mundo cripto, temos **HODL**. E não, não é uma sigla técnica sofisticada.

## O Post Original

Em 18 de dezembro de 2013, o preço do Bitcoin estava despencando. Um usuário do fórum BitcoinTalk chamado **GameKyuubi**, aparentemente embriagado e frustrado com a queda e com sua falta de habilidade para "tradar", escreveu um post intitulado:

> **"I AM HODLING"**

No corpo do texto, ele admitiu o erro de digitação ("eu sei que escrevi errado"), explicou que tinha bebido uísque e desabafou que, como era um péssimo trader, sua melhor estratégia era simplesmente segurar suas moedas, não importava o quanto o preço caísse.

## O Significado Hoje

A comunidade adotou o erro instantaneamente. HODL passou a representar uma filosofia de investimento: **resistir à volatilidade e não vender no pânico**.

Posteriormente, alguns tentaram criar um retro-acrônimo para a palavra: *Hold On for Dear Life* (Segure por sua vida), mas a verdade é mais simples e humana: foi apenas um erro de digitação honesto de alguém que acreditava no futuro da moeda, mesmo enquanto ela caía.
    `
    },
    {
        slug: "criacao-dogecoin-3-horas",
        content: "A Dogecoin foi criada em apenas 3 horas como uma piada.",
        description: "Billy Markus queria satirizar a explosão de novas criptomoedas. Acabou criando um ícone cultural de bilhões de dólares.",
        category: "Altcoins",
        keywords: ["Dogecoin", "Memecoin", "História", "Elon Musk"],
        fullContent: `
# De Piada a Fenômeno Global em 3 Horas

Em 2013, o cenário de criptomoedas estava ficando sério e cheio de especulação. Billy Markus e Jackson Palmer achavam tudo aquilo um tanto ridículo. Eles decidiram criar uma moeda "meme" para satirizar a febre do momento.

## Copy, Paste, Doge

Billy Markus, um programador da IBM, pegou o código fonte do Litecoin (que já era um fork do Bitcoin), fez algumas pequenas alterações no protocolo, trocou a fonte para Comic Sans e colocou a imagem do cachorro Shiba Inu "Doge" como logo.

Todo o processo de desenvolvimento levou cerca de **3 horas**.

## O Efeito Inesperado

Eles esperavam que a moeda morresse em dias. Em vez disso:
1.  A comunidade do Reddit adotou a moeda para "gorjetas" (tipping) devido ao seu valor baixo.
2.  A cultura leve e divertida atraiu novatos que tinham medo da seriedade do Bitcoin.
3.  Anos depois, figuras como **Elon Musk** abraçaram o meme, impulsionando a moeda para o top 10 do mercado global.

A Dogecoin provou que, na era da internet, a **comunidade e a cultura** podem ser tão valiosas quanto a tecnologia pura. O que era uma sátira tornou-se uma das maiores portas de entrada para o mundo cripto.
    `
    },
    {
        slug: "vitalik-buterin-19-anos-ethereum",
        content: "Vitalik Buterin tinha apenas 19 anos quando escreveu o whitepaper do Ethereum.",
        description: "Insatisfeito com as limitações do Bitcoin, um adolescente propôs um 'computador mundial'.",
        category: "Ethereum",
        keywords: ["Vitalik Buterin", "Ethereum", "Smart Contracts", "Inovação"],
        fullContent: `
# O Adolescente que Mudou a Internet

Imagine ter 19 anos e decidir que a invenção financeira mais revolucionária do século (o Bitcoin) "precisava de uma atualização". Foi exatamente isso que **Vitalik Buterin** fez.

## O Escritor Prodígio

Vitalik já era co-fundador da *Bitcoin Magazine* e viajava o mundo conversando com desenvolvedores. Ele percebeu uma falha fundamental no Bitcoin. O Bitcoin era ótimo como uma "calculadora" (fazer transações), mas péssimo como um "computador" (rodar programas complexos).

Ele sugeriu melhorias à comunidade Bitcoin (Mastercoin), mas foi rejeitado. Então, decidiu criar sua própria plataforma.

## O Nascimento dos Smart Contracts

Em 2013, ele publicou o Whitepaper do **Ethereum**. A grande inovação não foi a moeda (Ether), mas a capacidade de escrever **Smart Contracts** (Contratos Inteligentes) - código programável que roda na blockchain.

Isso abriu as portas para tudo o que veio depois:
*   DeFi (Finanças Descentralizadas)
*   NFTs
*   DAOs

Vitalik provou que a juventude e uma mente aberta (e genial) podem superar barreiras que especialistas experientes consideravam impossíveis. O Ethereum transformou a blockchain de um simples livro-razão em um **computador mundial**.
    `
    },
    {
        slug: "el-salvador-bitcoin-moeda-legal",
        content: "El Salvador foi o primeiro país a adotar o Bitcoin como moeda legal.",
        description: "Em 2021, uma pequena nação da América Central fez a aposta mais ousada da história econômica moderna.",
        category: "Adoção",
        keywords: ["El Salvador", "Nayib Bukele", "Adoção", "Economia"],
        fullContent: `
# A Lei Bitcoin: O Experimento de El Salvador

Em setembro de 2021, o mundo assistiu incrédulo quando El Salvador, um pequeno país da América Central, tornou-se a primeira nação soberana a adotar o Bitcoin como **moeda de curso legal (Legal Tender)**.

## O Que Isso Significa?

Diferente de apenas "permitir" o uso, torná-lo moeda legal significa que:
1.  Todo comerciante deve aceitar Bitcoin se tiver tecnologia para tal.
2.  Impostos podem ser pagos em Bitcoin.
3.  Não há imposto sobre ganho de capital na valorização da moeda.

## A Visão de Nayib Bukele

O presidente Nayib Bukele apostou no Bitcoin para resolver problemas estruturais:
*   **Remessas**: Milhões de salvadorenhos vivem no exterior e enviam dinheiro para casa. O Bitcoin elimina intermediários caros como a Western Union.
*   **Bancarização**: 70% da população não tinha conta em banco, mas tinha celular.
*   **Turismo e Investimento**: Atrair capital estrangeiro e turistas tech-savvy.

## O Resultado Até Agora

A jornada tem sido volátil. O país comprou centenas de Bitcoins e passou por períodos de prejuízo durante o "inverno cripto" de 2022, sendo duramente criticado pelo FMI.

No entanto, com a recuperação do mercado, os cofres do país voltaram ao lucro, e o turismo aumentou drasticamente. El Salvador se tornou uma "Meca" para bitcoiners do mundo todo, provando que a inovacão pode vir de onde menos se espera.
    `
    }
];

async function main() {
    console.log('🌱 Starting curiosities seed...');

    for (const curiosity of curiosities) {
        const created = await prisma.curiosity.upsert({
            where: { slug: curiosity.slug },
            update: {
                content: curiosity.content,
                description: curiosity.description,
                fullContent: curiosity.fullContent,
                category: curiosity.category,
                keywords: curiosity.keywords,
            },
            create: {
                slug: curiosity.slug,
                content: curiosity.content,
                description: curiosity.description,
                fullContent: curiosity.fullContent,
                category: curiosity.category,
                keywords: curiosity.keywords,
            },
        });
        console.log(`✅ Upserted curiosity: ${created.slug}`);
    }

    console.log('✨ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
