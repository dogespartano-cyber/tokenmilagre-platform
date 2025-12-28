
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

    },

    {
        slug: "muitas-pessoas-no-mundo-usam-criptomoedas-como-pro",
        content: "Muitas pessoas no mundo usam criptomoedas como proteção contra a inflação local.",
        description: "Em países com economias instáveis, o Bitcoin não é investimento de risco, é tábua de salvação.",
        category: "Economia",
        keywords: ["Inflação", "Economia", "Adoção", "Bitcoin"],
        fullContent: `
# Bitcoin como Escudo Contra a Hiperinflação

Para um investidor em Wall Street, Bitcoin é um ativo de risco (risk-on). Para um cidadão na Argentina, Turquia, Líbano ou Venezuela, Bitcoin é o ativo mais seguro que eles podem ter.

## O Problema da Moeda Fiduciária Fraca

Quando o governo imprime dinheiro desenfreadamente, a moeda local perde valor.
- Na **Argentina**, a inflação ultrapassou 100% ao ano diversas vezes.
- Na **Venezuela**, atingiu milhões porcento.

Nesse cenário, guardar dinheiro no colchão ou no banco local é garantia de perder poder de compra diariamente.

## A Saída Cripto

Antigamente, a única saída era comprar dólares no mercado negro ("Dólar Blue"). Hoje, as **Stablecoins (USDT, USDC)** e o próprio **Bitcoin** são alternatives acessíveis pelo celular.
Eles permitem que as pessoas protejam suas economias da má gestão governamental. O Bitcoin, sendo descentralizado e com oferta limitada, funciona como uma reserva de valor digital global, imune às políticas monetárias locais desastrosas.
    `
    },
    {
        slug: "o-custo-de-transacao-no-bitcoin-nao-depende-do-val",
        content: "O custo de transação no Bitcoin não depende do valor enviado, mas do tamanho dos dados.",
        description: "Enviar 1 bilhão de dólares ou 10 dólares pode custar exatamente o mesmo em taxas de rede.",
        category: "Tecnologia",
        keywords: ["Taxas", "Blockchain", "Tecnologia", "Transação"],
        fullContent: `
# O Paradoxo das Taxas de Rede

No sistema bancário tradicional, as taxas costumam ser percentuais. Se você envia R$ 1 milhão, o banco cobra uma fortuna. No Bitcoin e na maioria das blockchains, a lógica é puramente computacional.

## Bytes, não Valores

Quando você faz uma transação de Bitcoin, você está comprando espaço no bloco da blockchain (o "block space").
- Uma transação simples de "Alice para Bob" ocupa cerca de 250 bytes.
- Isso ocupa o mesmo espaço se Alice estiver enviando 0.001 BTC ou 10.000 BTC.

Portanto, a taxa que você paga (fee) é baseada em quão complexa é a transação em termos de dados, e não no valor financeiro que ela carrega.

## A Eficiência para Grandes Valores

Isso torna o Bitcoin incrivelmente eficiente para grandes liquidações. Periodicamente vemos "Baleias" movendo bilhões de dólares pagando menos de $5 em taxas. É, sem dúvida, o sistema de liquidação global mais barato que existe para grandes montantes.
    `
    },
    {
        slug: "o-mercado-cripto-funciona-24-horas-por-dia-7-dias-",
        content: "O mercado cripto funciona 24 horas por dia, 7 dias por semana, sem interrupções.",
        description: "Diferente da Bolsa de Valores que fecha às 17h, o dinheiro na internet nunca dorme.",
        category: "Mercado",
        keywords: ["Mercado", "Trading", "Volatilidade", "Global"],
        fullContent: `
# O Mercado Que Nunca Dorme

Se você vier do mercado de ações tradicional (B3, NYSE), vai estranhar: não existe "toque de abertura" nem "fechamento" no mundo cripto. Não há feriados, não há finais de semana. O Bitcoin é negociado 24/7/365.

## Por Que Isso Acontece?

Criptomoedas são redes globais descentralizadas.
- Quando é noite em Nova York, é dia em Tóquio.
- Quando Londres fecha para o almoço, Singapura está a todo vapor.

Como a blockchain roda em milhares de computadores independentes ao redor do mundo, não existe uma "entidade central" para desligar o interruptor ou declarar o fim do pregão.

## Impactos para Investidores

1.  **Volatilidade de Fim de Semana**: Com bancos fechados e menos liquidez institucional, sábados e domingos costumam ter movimentos de preço mais bruscos.
2.  **Estresse**: Traders de cripto frequentemente brincam sobre não dormir. O mercado reage a notícias em tempo real, a qualquer hora da madrugada.
3.  **Liberdade**: Você pode negociar seus ativos no Natal, no Ano Novo ou num domingo às 3 da manhã. Seu dinheiro está sempre acessível.
    `
    },
    {
        slug: "perder-as-chaves-privadas-da-sua-carteira-signific",
        content: "Perder as chaves privadas da sua carteira significa perder o acesso aos fundos para sempre.",
        description: "Seja seu próprio banco: o maior poder do Bitcoin traz também sua maior responsabilidade.",
        category: "Segurança",
        keywords: ["Segurança", "Chaves Privadas", "Custódia", "Bitcoin"],
        fullContent: `
# Not Your Keys, Not Your Coins

Essa é a frase mais repetida no ecossistema cripto. Ela resume a soberania e o risco da autocustódia. No sistema bancário, se você perde a senha, você liga para o gerente e reseta. No Bitcoin, **não existe gerente**.

## O Que é a Chave Privada?

Pense na chave privada (ou sua Seed Phrase de 12/24 palavras) como a única chave física de um cofre indestrutível no fundo do oceano.
A blockchain sabe que as moedas estão naquele cofre. Mas sem a chave, a matemática garante que é impossível movê-las. Nem os mineradores, nem os desenvolvedores, nem governos podem quebrar essa criptografia.

## Histórias de Terror e Lições

Existem bilhões de dólares "presos" em endereços cujos donos perderam as chaves. Isso ensina uma lição dura, mas valiosa sobre responsabilidade digital. No mundo cripto, a segurança depende 100% de você.

**Dica de Ouro**: Anote sua Seed Phrase em papel (nunca tire foto, nem salve na nuvem) e guarde em locais seguros e separados.
    `
    },
    {
        slug: "o-termo-altcoin-refere-se-a-qualquer-criptomoeda-q",
        content: "O termo 'Altcoin' refere-se a qualquer criptomoeda que não seja o Bitcoin.",
        description: "De Ethereum a Pepecoin: entenda a classificação histórica de tudo que veio depois do Rei.",
        category: "Conceitos",
        keywords: ["Altcoins", "Bitcoin", "Glossário", "Cripto"],
        fullContent: `
# O Universo das Alternative Coins

**Altcoin** é uma abreviação de "Alternative Coin". Historicamente, a definição é simples e binária:
- É Bitcoin? Não.
- Então é uma **Altcoin**.

## A Evolução do Termo

Nos primeiros anos (2011-2014), as Altcoins eram basicamente cópias (forks) do código do Bitcoin com pequenas alterações (como Litecoin ou Dogecoin).
Com o surgimento do Ethereum em 2015, as Altcoins evoluíram. Elas deixaram de ser apenas "dinheiro alternativo" para se tornarem plataformas de computação, tokens de governança, utility tokens, stablecoins e muito mais.

## Bitcoin Dominance

O mercado ainda mede a saúde do setor observando a **Dominância do Bitcoin** (a porcentagem do valor total do mercado que pertence ao BTC).
- Quando a dominância cai, dizemos que estamos em uma **"Altseason"** (temporada das Altcoins), onde moedas menores valorizam mais rápido que o Bitcoin.
- Quando a dominância sobe, o mercado está buscando segurança no ativo principal.
    `
    },
    {
        slug: "cerca-de-10-das-empresas-globais-ja-consideram-ace",
        content: "Cerca de 10% das empresas globais já consideram aceitar pagamentos em Bitcoin.",
        description: "Adoção institucional silenciosa: grandes corporações estão integrando trilhos de pagamento cripto.",
        category: "Adoção",
        keywords: ["Empresas", "Adoção", "Pagamentos", "Futuro"],
        fullContent: `
# O Fim das Fronteiras Comerciais

Pagar com cartão de crédito internacional custa caro e demora dias para liquidar para o lojista. Aceitar cripto é instantâneo e global. Por isso, grandes empresas estão se movendo.

## Quem Já Aceita?

- **Microsoft**: Aceita Bitcoin na sua loja Xbox desde 2014.
- **Starbucks (EUA)**: Através de parceiros como a Bakkt.
- **Destinos de Luxo**: Imobiliárias em Dubai e concessionárias de carros de luxo frequentemente aceitam pagamentos em USDT ou BTC.
- **Tech Companies**: Serviços de VPN, hospedagem e domínios foram os pioneiros.

## Por Que Aceitar?

1.  **Taxas Menores**: Processadores de cartão cobram 2-3%. Transações cripto podem custar centavos.
2.  **Sem Chargeback**: Uma vez pago na blockchain, o pagamento é irreversível. Isso elimina fraudes comuns no e-commerce.
3.  **Clientela Global**: Uma loja no Brasil pode vender um curso online para um cliente no Japão sem se preocupar com conversão cambial complexa.
    `
    },
    {
        slug: "a-binance-e-atualmente-a-maior-exchange-de-criptom",
        content: "A Binance é atualmente a maior exchange de criptomoedas do mundo por volume.",
        description: "Fundada por CZ em 2017, a gigante chinesa (agora global) domina o mercado de trocas centralizadas.",
        category: "Corretoras",
        keywords: ["Binance", "CZ", "Exchange", "Mercado"],
        fullContent: `
# O Gigante Amarelo

Em apenas 6 meses após seu lançamento em 2017, a **Binance** tornou-se a maior corretora de criptomoedas do mundo. Liderada por Changpeng Zhao (conhecido como **CZ**), a empresa revolucionou o setor com:
- Um motor de trade ultra-rápido.
- Taxas baixíssimas (e seu token BNB para descontos).
- Uma atitude agressiva de "mover rápido e quebrar coisas".

## O Ecossistema BNB

A Binance não parou em ser apenas uma casa de câmbio. Eles lançaram sua própria blockchain, a **BNB Chain** (antiga Binance Smart Chain), que se tornou a principal concorrente do Ethereum para usuários que buscavam taxas baixas, impulsionando a explosão dos jogos NFT e DeFi de varejo em 2021.

## Desafios Regulatórios

Sendo tão grande, a Binance virou alvo de reguladores globais. Em 2023-2024, a empresa enfrentou processos pesados nos EUA e concordou em pagar multas bilionárias para continuar operando, marcando uma nova fase de "maturidade e conformidade" para a gigante e para o mercado como um todo.
    `
    },
    {
        slug: "o-criador-da-litecoin-charlie-lee-trabalhou-anteri",
        content: "O criador da Litecoin, Charlie Lee, trabalhou anteriormente no Google.",
        description: "Engenheiro de dia, criptógrafo de noite: como o projeto 'Prata Digital' nasceu dentro do Google.",
        category: "História",
        keywords: ["Litecoin", "Charlie Lee", "Google", "Altcoins"],
        fullContent: `
# A Prata para o Ouro do Bitcoin

Charlie Lee era um engenheiro de software no Google quando descobriu o Bitcoin em 2011. Fascinado, mas percebendo que o Bitcoin poderia ser "pesado" demais para pequenas transações do dia a dia, ele decidiu criar uma versão mais leve.

## Litecoin (LTC)

Lançada em outubro de 2011, a Litecoin foi projetada com algumas diferenças técnicas chave:
- **Tempo de Bloco**: 2.5 minutos (vs 10 min do Bitcoin), para confirmações mais rápidas.
- **Algoritmo**: Scrypt (vs SHA-256), para ser mais acessível a mineradores com hardware comum na época.
- **Suprimento**: 84 milhões (4x mais que os 21 milhões do Bitcoin).

## A Visão de Lee

Charlie Lee famosamente vendeu todos os seus Litecoins no pico do mercado de 2017 para evitar "conflito de interesses", uma atitude que divide opiniões até hoje. Alguns o veem como um fundador ético, outros acham que ele abandonou o barco. Fato é que o Litecoin permanece uma das poucas criptomoedas de "primeira geração" que continua ativa, segura e amplamente aceita após mais de uma década.
    `
    },
    {
        slug: "shiba-inu-comecou-como-uma-parodia-da-dogecoin-que",
        content: "Shiba Inu começou como uma paródia da Dogecoin, que já era uma paródia.",
        description: "O 'Doge Killer': a memecoin que provou que a comunidade pode construir utilidade real.",
        category: "Memecoins",
        keywords: ["Shiba Inu", "Memecoin", "Ethereum", "DeFi"],
        fullContent: `
# Inception de Memes

Se o Dogecoin foi uma piada sobre o Bitcoin, o **Shiba Inu (SHIB)** foi uma piada sobre o Dogecoin. Lançado em 2020 por um fundador anônimo chamado "Ryoshi", o token se autodenominou o "Dogecoin Killer".

## Diferença Fundamental

Enquanto Dogecoin é uma blockchain própria (Fork do Litecoin), o **Shiba Inu é um token ERC-20** rodando dentro do Ethereum.
Isso permitiu que o projeto evoluísse muito mais rápido tecnicamente.

## O Doação para Vitalik

Ryoshi fez algo inusitado: enviou 50% de todo o suprimento de SHIB para a carteira pública de **Vitalik Buterin**, achando que ele nunca tocaria nos fundos.
Vitalik surpreendeu o mundo: ele pegou os bilhões de dólares em SHIB e **doou para um fundo de combate à COVID na Índia**, e queimou (destruiu) o restante (410 trilhões de tokens).

Isso deu ao Shiba uma publicidade global massiva e provou que, por trás do meme, havia uma infraestrutura DeFi real sendo construída (ShibaSwap, Shibarium, etc).
    `
    },
    {
        slug: "a-primeira-ico-oferta-inicial-de-moedas-foi-do-pro",
        content: "A primeira ICO (Oferta Inicial de Moedas) foi do projeto Mastercoin em 2013.",
        description: "Antes do boom de 2017, J.R. Willett inventou a ideia de criar um novo protocolo sobre o Bitcoin.",
        category: "História",
        keywords: ["ICO", "Mastercoin", "História", "Fundraising"],
        fullContent: `
# O Pai das ICOs

Hoje, lançar um token é trivial. Mas em 2013, a ideia de usar a blockchain para captar recursos para construir... mais blockchain, era revolucionária.
**J.R. Willett** publicou o whitepaper "The Second Bitcoin Whitepaper", propondo o **Mastercoin** (hoje Omni Layer).

## A Ideia

Ele argumentou que não precisávamos criar novas blockchains do zero (como Litecoin). Poderíamos usar a rede Bitcoin existente como uma "camada base" e construir novas regras e moedas em cima dela.
Para financiar o desenvolvimento, ele disse: "Mandem Bitcoins para este endereço, e eu lhes darei 100x mais Mastercoins quando a rede for lançada."

## O Resultado

Ele arrecadou cerca de 500.000 dólares em Bitcoin. Embora modesto para os padrões de hoje, inventou o modelo de **ICO (Initial Coin Offering)** que financiaria o Ethereum, EOS, e praticamente toda a indústria cripto anos depois. O protocolo Omni, derivado disso, foi a casa original do dólar Tether (USDT) por muitos anos.
    `
    },
    {
        slug: "o-endereco-do-bloco-genese-do-bitcoin-nao-pode-gas",
        content: "O endereço do bloco gênese do Bitcoin não pode gastar a recompensa original.",
        description: "Os primeiros 50 Bitcoins minerados por Satoshi estão presos para sempre por uma peculiaridade no código.",
        category: "Técnico",
        keywords: ["Genesis Block", "Satoshi", "Código", "Curiosidade"],
        fullContent: `
# O Bloco 0 e o Bug (ou Feature?)

O primeiro bloco do Bitcoin, o **Bloco Gênese** (Genesis Block), foi minerado em 3 de janeiro de 2009. Ele gerou a recompensa padrão da época: 50 BTC.
No entanto, esses 50 BTC **jamais poderão ser gastos**.

## Por Que Estão Presos?

Devido à forma como o código original do cliente Bitcoin foi escrito (intencionalmente ou não), a transação da base de moedas (coinbase transaction) do Bloco 0 não foi adicionada ao banco de dados global de transações gastáveis (UTXO set).
Se Satoshi tentasse enviar esses 50 BTC, a rede rejeitaria a transação como inválida, pois tecnicamente ela "não existe" para fins de gasto.

## O Santuário Digital

O endereço do Gênese (\`1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\`) tornou-se um santuário. Fãs de cripto continuam enviando pequenas quantidades de Bitcoin para lá como tributo a Satoshi. O saldo da carteira continua crescendo, hoje contendo muito mais que os 50 BTC originais, mas todos sabem que essas moedas nunca sairão de lá.
    `
    },
    {
        slug: "a-lightning-network-permite-pagamentos-instantaneo",
        content: "A Lightning Network permite pagamentos instantâneos com taxas quase zero no Bitcoin.",
        description: "A solução de Camada 2 que permite que o Bitcoin escale para comprar cafézinho.",
        category: "Tecnologia",
        keywords: ["Lightning Network", "Escalabilidade", "Pagamentos", "L2"],
        fullContent: `
# Trocando a Rapidez pela Segurança (e vice-versa)

A camada base do Bitcoin (Layer 1) é lenta e cara de propósito: isso garante segurança máxima e descentralização. Mas ninguém quer esperar 10 minutos e pagar $2 de taxa para comprar um café de $3.
Aí entra a **Lightning Network**.

## Como Funciona?

Imagine que Alice e Bob abrem uma "conta conjunta" (um canal de pagamento). Eles colocam 1 BTC lá.
Agora, eles podem trocar esse saldo entre si milhões de vezes por segundo, instantaneamente, sem avisar a blockchain principal. Eles estão apenas atualizando o saldo local no caderno deles.
Só quando eles quiserem fechar a conta é que o saldo final é registrado na blockchain do Bitcoin.

## O Resultado

Isso permite milhões de transações por segundo (TPS), com taxas de frações de centavo, mantendo a segurança final ancorada no Bitcoin. É a tecnologia que permitiu a El Salvador e aplicativos como Strike operarem pagamentos instantâneos globais.
    `
    },
    {
        slug: "existem-caixas-eletronicos-de-bitcoin-em-quase-tod",
        content: "Existem caixas eletrônicos de Bitcoin em quase todos os países do mundo.",
        description: "Bitcoin ATMs (BTMs) são a ponte física entre o dinheiro de papel e a moeda digital.",
        category: "Adoção",
        keywords: ["ATM", "Adoção", "Fisico", "Dinheiro"],
        fullContent: `
# O Caixa Eletrônico do Futuro

Você está andando na rua e vê uma máquina parecida com um caixa eletrônico comum, mas com o logo do Bitcoin. Esses são os **Bitcoin ATMs** (ou BTMs). Hoje existem mais de 30.000 deles espalhados pelo mundo.

## Como Funcionam?

A maioria é unidirecional:
1.  Você insere notas de dinheiro físico (Reais, Dólares, Euros).
2.  Escaneia o QR Code da sua carteira digital.
3.  A máquina envia o equivalente em Bitcoin para você na hora.

Alguns modelos mais avançados são bidirecionais: permitem que você envie Bitcoin para a máquina e saque dinheiro vivo.

## Por Que Usar?

Eles cobram taxas geralmente mais altas que as corretoras online (entre 7% a 15%), mas oferecem:
- **Conveniência**: Transformar dinheiro em cripto em segundos.
- **Privacidade**: Muitos permitem compras pequenas sem necessidade de cadastro complexo (KYC), servindo como porta de entrada anônima ou rápida para a economia digital.
    `
    },
    {
        slug: "o-halving-do-bitcoin-acontece-aproximadamente-a-ca",
        content: "O Halving do Bitcoin acontece aproximadamente a cada quatro anos.",
        description: "O evento olímpico do mercado financeiro que define os ciclos de alta e baixa.",
        category: "Conceitos",
        keywords: ["Halving", "Ciclos", "Economia", "Mineração"],
        fullContent: `
# O Relógio Interno do Bitcoin

O Bitcoin não segue as decisões de um Banco Central. Ele segue o código. E a regra mais importante do código é o **Halving**.
A cada 210.000 blocos minerados (o que leva ~4 anos), a emissão de novos Bitcoins é cortada pela metade.

## Historico de Impacto

Historicamente, o Halving marca o início de um novo ciclo de alta (Bull Market), pois a oferta de novas moedas cai drasticamente enquanto a demanda costuma se manter ou subir (Choque de Oferta).
- **2012**: De 50 para 25 BTC. (Preço explodiu em 2013)
- **2016**: De 25 para 12.5 BTC. (Preço explodiu em 2017)
- **2020**: De 12.5 para 6.25 BTC. (Preço explodiu em 2021)
- **2024**: De 6.25 para 3.125 BTC.

É o mecanismo que garante que o Bitcoin seja deflacionário e se torne cada vez mais escasso com o tempo.
    `
    },
    {
        slug: "o-processo-de-reduzir-a-recompensa-por-bloco-miner",
        content: "O processo de reduzir a recompensa por bloco minerado pela metade chama-se Halving.",
        description: "Entenda a matemática simples que torna o Bitcoin a moeda mais dura do mundo.",
        category: "Conceitos",
        keywords: ["Halving", "Definição", "Mineração", "Recompensa"],
        fullContent: `
# A Política Monetária Imutável

Bancos centrais decidem imprimir dinheiro baseados em reuniões, política e crises. O Bitcoin decide sua emissão baseado em matemática pura. O **Halving** é a execução dessa política.

## Por Que Reduzir?

Satoshi Nakamoto desenhou o Bitcoin para simular a extração de ouro na Terra.
- No começo, é fácil achar ouro (pepitas na superfície).
- Com o tempo, fica mais difícil e escasso (minas profundas).

Ao reduzir a recompensa pela metade a cada 4 anos, o Bitcoin replica essa escassez crescente digitalmente. Isso controla a inflação da moeda de forma previsível. Todo mundo sabe exatamente quantos Bitcoins existirão em 2030, 2040 ou 2100. Nenhuma outra moeda no mundo oferece essa previsibilidade absoluta.
    `
    },
    {
        slug: "defi-financas-descentralizadas-visa-eliminar-inter",
        content: "DeFi (Finanças Descentralizadas) visa eliminar intermediários como bancos.",
        description: "Empréstimos, trocas e rendimentos sem gerente, sem agência e sem permissão.",
        category: "DeFi",
        keywords: ["DeFi", "Bancos", "Inovação", "Ethereum"],
        fullContent: `
# Wall Street no Código

**DeFi** (Decentralized Finance) é o movimento de reconstruir todos os serviços bancários tradicionais usando Smart Contracts na blockchain.

## O Que Você Pode Fazer?

- **DEX (Exchange Descentralizada)**: Trocar moedas sem criar conta em corretora (ex: Uniswap).
- **Lending (Empréstimo)**: Depositar Bitcoin como garantia, pegar Dólares emprestados, pagar juros e receber seu Bitcoin de volta. Tudo automático, sem análise de crédito.
- **Yield Farming**: Emprestar suas moedas para prover liquidez ao mercado e receber juros por isso.

## A Revolução

Em DeFi, o "banco" é um pedaço de código auditável. Não há discriminação por geografia, histórico de crédito ou identidade. Se você tem uma carteira e internet, você tem acesso aos mesmos produtos financeiros que um milionário suíço. É a democratização radical das finanças.
    `
    },
    {
        slug: "stablecoins-sao-criptos-pareadas-ao-valor-de-moeda",
        content: "Stablecoins são criptos pareadas ao valor de moedas fiduciárias como o Dólar.",
        description: "A ponte vital entre a estabilidade do dinheiro velho e a eficiência do dinheiro novo.",
        category: "Stablecoins",
        keywords: ["USDT", "USDC", "Dólar", "Stablecoins"],
        fullContent: `
# O Dólar na Blockchain

Criptomoedas são voláteis. O Bitcoin pode subir 10% ou cair 10% em um dia. Para o comércio e proteção de patrimônio, as pessoas precisam de estabilidade.
Surgem as **Stablecoins** (USDT, USDC, DAI). Moedas digitais cujo valor é travado (pegged) em 1:1 com o Dólar Americano (ou Euro, Real, etc).

## Como Funcionam?

- **Centralizadas (ex: USDC)**: Para cada 1 token digital emitido, a empresa guarda $1 dólar real em uma conta bancária auditada.
- **Descentralizadas (ex: DAI)**: Usuários travam garantias em cripto (como ETH) em um contrato inteligente para gerar dólares sintéticos.

## A Utilidade Gigante

Stablecoins são hoje o "produto" mais utilizado do mundo cripto ("Product-Market Fit"). Elas permitem que pessoas enviem dólares ao redor do mundo em segundos, 24/7, sem passar pelo sistema SWIFT bancário lento e caro.
    `
    },
    {
        slug: "o-termo-whale-baleia-refere-se-a-individuos-que-po",
        content: "O termo 'Whale' (Baleia) refere-se a indivíduos que possuem enormes quantias de cripto.",
        description: "Conheça a fauna do oceano cripto e como esses gigantes movem o mercado.",
        category: "Cultura",
        keywords: ["Whale", "Mercado", "Girias", "Trading"],
        fullContent: `
# A Fauna do Mercado

No oceano das criptomoedas, nem todos são iguais. A terminologia marinha é usada para classificar investidores pelo tamanho de suas carteiras:

- **Camarão (Shrimp)**: < 1 BTC. A grande maioria dos investidores de varejo.
- **Golfinho/Tubarão**: 10 a 500 BTC.
- **Baleia (Whale)**: > 1.000 BTC.

## O Impacto das Baleias

As baleias são monitoradas de perto (existem sites como *Whale Alert*). Quando uma baleia move 10.000 Bitcoins para uma corretora, o mercado entra em pânico achando que ela vai vender e derrubar o preço.
Baleias podem ser:
- Indivíduos pioneiros (Early Adopters).
- Fundos de Investimento (Institucionais).
- As próprias Exchanges (Cold Wallets).

Entender o movimento das baleias é parte essencial da análise de mercado "On-Chain".
    `
    },
    {
        slug: "a-primeira-conferencia-de-bitcoin-aconteceu-em-pra",
        content: "A primeira conferência de Bitcoin aconteceu em Praga, in 2011.",
        description: "Quando apenas alguns nerds e cypherpunks se reuniram para falar de dinheiro mágico da internet.",
        category: "História",
        keywords: ["Evento", "Praga", "Comunidade", "História"],
        fullContent: `
# O Encontro dos Pioneiros

Hoje, conferências de Bitcoin lotam estádios em Miami com milhares de pessoas, touros mecânicos e celebridades. Mas a primeira reunião oficial foi muito mais humilde e "underground".

Aconteceu em **Praga, República Tcheca, em 2011**.
Organizada por Amir Taaki, reuniu poucas dezenas de desenvolvedores, criptógrafos e entusiastas libertários da Europa.

## O Clima da Época

O Bitcoin valia, na época, alguns dólares. Ninguém ali estava rico. O foco não era "Lamborghinis" ou preço, mas sim a tecnologia, a revolução contra o sistema bancário e a privacidade.
Praga, com sua história de resistência política e o famoso *Paralelní Polis* (um café e instituto que só aceita cripto), permanece até hoje um dos corações ideológicos do movimento Cypherpunk na Europa.
    `
    },
    {
        slug: "bitcoin-e-um-software-de-codigo-aberto-qualquer-um",
        content: "Bitcoin é um software de código aberto; qualquer um pode sugerir melhorias.",
        description: "Não existe um 'CEO' do Bitcoin. Quem decide as mudanças é o consenso.",
        category: "Tecnologia",
        keywords: ["Open Source", "Desenvolvimento", "BIP", "Consenso"],
        fullContent: `
# Quem Controla o código?

Bitcoin é **Open Source** (Código Aberto). Isso significa que o código-fonte está disponível gratuitamente no GitHub para qualquer pessoa ler, auditar, copiar ou sugerir mudanças.
Não há uma empresa "Bitcoin Inc.".

## Como as Mudanças Acontecem?

O processo é burocrático e lento de propósito, para garantir segurança.
1.  **BIP (Bitcoin Improvement Proposal)**: Um desenvolvedor escreve uma proposta técnica formal.
2.  **Debate**: A comunidade dev e mineradores debatem a ideia por meses ou anos.
3.  **Consenso**: Para a mudança ser ativada na rede, a maioria esmagadora dos nós (nodes) e mineradores precisa atualizar seu software voluntariamente.

Se não houver consenso, a mudança não acontece (ou a rede se divide num *Hard Fork*, criando uma nova moeda, como aconteceu com o Bitcoin Cash). É a democracia digital mais pura e difícil que existe.
    `
    },
    {
        slug: "o-simbolo-do-bitcoin-foi-adicionado-oficialmente-a",
        content: "O símbolo do Bitcoin (₿) foi adicionado oficialmente ao padrão Unicode em 2017.",
        description: "De moeda de internet hacker para um caractere oficial em todos os teclados do mundo.",
        category: "Cultura",
        keywords: ["Unicode", "Símbolo", "Adoção", "Tech"],
        fullContent: `
# ₿: Oficialmente uma Moeda Global

Durante anos, o Bitcoin usou símbolos improvisados. As vezes usava-se o ฿ (Baht tailandês) ou apenas as letras BTC. A comunidade, no entanto, desenhou o B com dois traços verticais (inspirado no $ do Dólar), que se tornou icônico.

## A Aprovação do Unicode

Em junho de 2017, com o lançamento da versão 10.0 do padrão **Unicode**, o símbolo do Bitcoin **(₿)** foi finalmente imortalizado no código \`U + 20BF\`.
Isso foi um marco simbólico enorme de legitimação: significava que o Bitcoin era reconhecido pelos consórcios de tecnologia globais (Apple, Google, Microsoft) não como uma moda passageira, mas como um caractere permanente na linguagem humana digital, ao lado do $, €, £ e ¥.
    `
    },
    {
        slug: "algumas-mineradoras-de-bitcoin-usam-energia-termic",
        content: "Algumas mineradoras de Bitcoin usam energia térmica de vulcões para operar.",
        description: "Mineração Vulcânica: a solução mais limpa e renovável para a segurança da rede.",
        category: "Energia",
        keywords: ["Vulcão", "Energia Verde", "Mineração", "El Salvador"],
        fullContent: `
# O Poder do Vulcão

A mineração de Bitcoin busca sempre a energia mais barata possível. E a energia mais barata costuma ser aquela que é desperdiçada ou de difícil transporte.

## O Exemplo de El Salvador

O país, rico em atividade geotérmica, inaugurou a **"Lage Volcano"**, uma usina de mineração alimentada 100% por energia geotérmica dos seus vulcões.
- **Zero Emissão de Carbono**.
- **Energia Renovável e Constante** (vulcões não dependem de sol ou vento).

## Tendência Global

Isso não é exclusivo de lá. Na Islândia, a geotérmica também é usada. No Texas, usa-se gás de queima de poços de petróleo (flaring) que seria poluição pura. O Bitcoin está se tornando um incentivador global para aproveitar fontes de energia renováveis e "encalhadas" em locais remotos.
    `
    },
    {
        slug: "gas-no-ecossistema-ethereum-refere-se-a-taxa-paga-",
        content: "Gas no ecossistema Ethereum refere-se à taxa paga para processar transações.",
        description: "Entenda por que você precisa de 'combustível' para rodar contratos inteligentes.",
        category: "Conceitos",
        keywords: ["Gas", "Ethereum", "Taxas", "Gwei"],
        fullContent: `
# O Combustível do Computador Mundial

O Ethereum funciona como um computador global gigante. Cada operação que você faz nele (enviar dinheiro, comprar um NFT, trocar tokens) consome poder computacional da rede.

## Por Que "Gas"?

O nome é uma analogia perfeita com gasolina.
- Seu carro (a transação) precisa ir do ponto A ao B.
- O motor (a rede Ethereum) precisa trabalhar.
- Você paga pelo combustível gasto nesse trabalho.

## Gwei

O preço do Gas é medido em **Gwei** (uma fração minúscula de Ether). Em momentos de congestionamento (muita gente querendo usar a rede ao mesmo tempo), o preço do Gas dispara, em um sistema de leilão: quem paga mais, tem sua transação processada primeiro. Isso torna o Ethereum seguro e evita spam (ataques de negação de serviço), pois atacar a rede custaria uma fortuna em taxas.
    `
    },
    {
        slug: "o-termo-to-the-moon-refere-se-a-expectativa-de-que",
        content: "O termo 'To the Moon' refere-se à expectativa de que o preço suba drasticamente.",
        description: "🚀 A gíria favorita dos otimistas: quando o gráfico aponta para o céu.",
        category: "Cultura",
        keywords: ["To The Moon", "Gíria", "Alta", "Mercado"],
        fullContent: `
# 🚀 To The Moon!

No dialeto cripto, quando alguém pergunta "When Moon?" (Quando Lua?), está perguntando: "Quando ficaremos estupidamente ricos?".
A expressão "To the Moon" simboliza uma valorização vertical do preço de um ativo, subindo tanto que sai da atmosfera terrestre.

## A Cultura Meme

A frase é acompanhada frequentemente de emojis de foguete (🚀) e lua (🌕). Embora tenha virado meme e piada, reflete a natureza explosiva dos ciclos de mercado cripto, onde ativos podem valorizar 1.000% ou 10.000% em curtos períodos de tempo, algo inimaginável no mercado de ações tradicional.

Cuidado, porém: nem todo foguete chega à lua. Muitos explodem no lançamento (o famoso "Rug Pull").
    `
    },
    {
        slug: "mais-de-100-milhoes-de-pessoas-possuem-algum-tipo-",
        content: "Mais de 100 milhões de pessoas possuem algum tipo de ativo cripto no Brasil.",
        description: "O Brasil é uma das potências globais na adoção de criptomoedas.",
        category: "Adoção",
        keywords: ["Brasil", "Estatística", "Adoção", "Mercado"],
        fullContent: `
# O Gigante Brasileiro na Criptoeconomia

O número no título pode parecer exagerado (e varia dependendo da fonte e da métrica), mas o fato é inegável: **o Brasil é consistentemente classificado entre os Top 5 ou Top 10 países do mundo em adoção de criptoativos**.

## Por Que o Brasil?

1.  **Pix e Digitalização**: O brasileiro adotou bancos digitais (Nubank, Inter) e o Pix massivamente. O salto para cripto foi natural.
2.  **Histórico Econômico**: Temos memória inflacionária. Proteger o patrimônio ou buscar retornos altos está no nosso DNA.
3.  **Stablecoins**: O volume de negociação de **USDT (Tether)** no Brasil frequentemente supera o volume de negociação do próprio Bitcoin e, em alguns dias, até o volume da Bolsa (B3). Os brasileiros usam cripto para dolarizar suas economias.

O Banco Central do Brasil é um dos mais inovadores do mundo com o projeto do **Drex** (Real Digital), consolidando o país na vanguarda da economia tokenizada.
    `
    },
    {
        slug: "a-rede-ethereum-processa-significativamente-mais-t",
        content: "A rede Ethereum processa significativamente mais transações diárias que o Bitcoin.",
        description: "Enquanto o Bitcoin é ouro digital (guardar), o Ethereum é petróleo digital (usar).",
        category: "Ethereum",
        keywords: ["Transações", "Utilidade", "Ethereum", "Bitcoin"],
        fullContent: `
# Ouro vs Petróleo

Comparar o volume de transações do Bitcoin com o do Ethereum é comparar maçãs com laranjas, mas revela o propósito de cada rede.

## Bitcoin: A Camada de Liquidação Final
O Bitcoin processa menos transações (cerca de 500-700 mil/dia na camada base), focando em transferências de valor monetário seguro e imutável. É desajeitado, mas extremamente robusto.

## Ethereum: O Sistema Operacional
O Ethereum processa milhões de transações por dia. Por quê? Porque no Ethereum, "transação" não é apenas enviar dinheiro.
- É um voto numa DAO.
- É a compra de um item num jogo.
- É a emissão de uma Stablecoin.
- É um empréstimo DeFi.

A alta atividade reflete a **utilidade** da rede como plataforma de aplicações. Se o Bitcoin é o banco, o Ethereum é a internet inteira de serviços financeiros.
    `
    },
    {
        slug: "nfts-tokens-nao-fungiveis-podem-representar-qualqu",
        content: "NFTs (Tokens Não Fungíveis) podem representar qualquer coisa, de arte a terrenos virtuais.",
        description: "Muito além de imagens de macacos: a tecnologia que garante propriedade digital única.",
        category: "NFTs",
        keywords: ["NFT", "Arte", "Propriedade", "Tecnologia"],
        fullContent: `
# A Propriedade Digital Real

A internet sempre teve um problema: tudo o que é digital pode ser copiado infinitamente (Ctrl+C, Ctrl+V).
O **NFT (Non-Fungible Token)** resolveu isso. Ele cria escassez digital verificável.

## Fungível vs Não-Fungível

- **Fungível**: Uma nota de R$10 é igual a qualquer outra nota de R$10. Um Bitcoin é igual a outro Bitcoin.
- **Não-Fungível**: A pintura original da Mona Lisa é única; não pode ser trocada por outra igual.

## O Que Pode Ser um NFT?

Embora a febre de 2021 tenha focado em arte e "macacos entediados" (Bored Apes), a tecnologia serve para:
- **Ingressos de shows** (evitando falsificação).
- **Documentos de imóveis** (escrituras digitais).
- **Itens de Jogos** (espadas, skins que você realmente possui e pode vender).
- **Identidade Digital**.

NFTs são, basicamente, o certificado de propriedade para a era da Web3.
    `
    },
    {
        slug: "o-bitcoin-e-considerado-ouro-digital-por-sua-escas",
        content: "O Bitcoin é considerado 'ouro digital' por sua escassez programada.",
        description: "As semelhanças (e superioridades) do Bitcoin em relação ao metal precioso mais antigo do mundo.",
        category: "Investimento",
        keywords: ["Ouro Digital", "Reserva de Valor", "Bitcoin", "Escassez"],
        fullContent: `
# Ouro 2.0

Por milênios, o ouro foi a reserva de valor definitiva da humanidade. É escasso, durável e difícil de extrair. O Bitcoin foi desenhado com essas exatas propriedades em mente, mas aprimoradas para o mundo digital.

## A Melhoria da Fórmula

O Bitcoin possui as qualidades do ouro, mas resolve seus problemas logísticos:
- **Escassez**: Ouro é escasso, mas se o preço subir muito, mineradoras cavam mais fundo e acham mais. Bitcoin tem um limite matemático duro de 21 milhões.
- **Verificabilidade**: Verificar se uma barra de ouro é pura é difícil e caro. Verificar se um Bitcoin é real é trivial e gratuito.
- **Portabilidade**: Tente atravessar uma fronteira carregando R$ 100 milhões em barras de ouro (é impossível). Em Bitcoin, você atravessa o mundo com 12 palavras memorizadas na cabeça.

É por isso que grandes fundos de investimento (como BlackRock) agora tratam o Bitcoin como uma classe de ativo rival e complementar ao ouro.
    `
    },
    {
        slug: "a-palavra-criptomoeda-nao-aparece-no-whitepaper-or",
        content: "A palavra 'Criptomoeda' não aparece no whitepaper original do Bitcoin.",
        description: "Satoshi usou termos mais técnicos. A palavra que hoje define o setor veio depois.",
        category: "Curiosidade",
        keywords: ["Whitepaper", "Satoshi", "Linguagem", "História"],
        fullContent: `
# Ele Chamou de "Dinheiro Eletrônico"

Se você ler as 9 páginas do famoso Whitepaper de Satoshi Nakamoto ("Bitcoin: A Peer-to-Peer Electronic Cash System"), você não encontrará a palavra hoje onipresente: **Cryptocurrency**.

Satoshi usou termos como:
- "Electronic Cash" (Dinheiro eletrônico).
- "Digital Coin" (Moeda digital).
- "Chain of digial signatures" (Cadeia de assinaturas digitais).

## De Onde Veio o Nome?

O termo "Cryptocurrency" começou a ser usado pela comunidade cypherpunk e pela imprensa logo após o lançamento, para descrever essa nova classe de dinheiro baseada em **Criptografia**.
Curiosamente, isso mostra como o projeto cresceu além de seu criador. A própria linguagem para descrever a invenção evoluiu organicamente através de seus usuários.
    `
    },
    {
        slug: "existem-milhares-de-moedas-zumbis-que-nao-tem-volu",
        content: "Existem milhares de 'moedas zumbis' que não têm volume ou valor de mercado.",
        description: "O cemitério cripto: projetos abandonados, golpes e ideias que não deram certo.",
        category: "Mercado",
        keywords: ["Zombie Coins", "Risco", "Mercado", "Fracasso"],
        fullContent: `
# O Cemitério Digital

Para cada Bitcoin ou Ethereum que deu certo, existem milhares de projetos que falharam. Sites como *CoinGecko* e *DeadCoins* listam milhares de criptomoedas "mortas" ou "zumbis".

## O Que é uma Moeda Zumbi?

É uma criptomoeda que tecnicamente ainda existe na blockchain (o código está lá), mas:
- Ninguém negocia (volume zero).
- Os desenvolvedores abandonaram o projeto.
- O site saiu do ar e a comunidade dispersou.

## A Lição para Investidores

Isso serve de alerta vital: **A maioria das criptomoedas vai a zero**.
Investir em "Gemas" de baixa capitalização (Low Caps) pode trazer retornos altos, mas o risco de o projeto simplesmente morrer e virar um zumbi na sua carteira é altíssimo. A sobrevivência a longo prazo no mercado cripto é a exceção, não a regra.
    `
    },
    {
        slug: "a-mineracao-de-bitcoin-utiliza-eletricidade-gasta-",
        content: "A mineração de Bitcoin utiliza eletricidade gasta por aparelhos eletrônicos em stand-by nos EUA.",
        description: "Colocando o consumo de energia em perspectiva: mitos e verdades.",
        category: "Energia",
        keywords: ["Mineração", "Consumo", "Energia", "Mito"],
        fullContent: `
# A Narrativa Energética

O Bitcoin consome muita energia? Sim. Mais que alguns países pequenos.
Mas é importante colocar em perspectiva comparativa (o chamado "Whataboutism" analítico).

## Comparações Recentes

Estudos (como os da Cambridge University) mostram dados curiosos:
- A quantidade de energia desperdiçada por aparelhos domésticos em modo "Stand-by" (aquela luzinha vermelha da TV) apenas nos EUA poderia alimentar a rede Bitcoin por anos.
- O sistema bancário tradicional (agências, servidores, transporte de carro-forte, ar condicionado de prédios) consome muito mais.
- A mineração de ouro consome mais.
- As luzes de Natal nos EUA consomem mais.

A questão não é "quanto" consome, mas "para que" consome. Para os defensores, gastar energia para manter a rede monetária mais segura e inclusiva do mundo é um uso extremamente nobre e eficiente de recursos.
    `
    },
    {
        slug: "a-primeira-grande-exchange-de-bitcoin-mt-gox-era-o",
        content: "A primeira grande exchange de Bitcoin, Mt. Gox, era originalmente um site de cards de Magic.",
        description: "Magic: The Gathering Online eXchange. A origem bizarra da maior falência da história cripto.",
        category: "História",
        keywords: ["Mt Gox", "Magic", "Hack", "História"],
        fullContent: `
# De Cartas de Mágica para Bitcoins Perdidos

O nome **Mt. Gox** é sinônimo de desastre no mundo cripto (devido ao hack colossal de 2014 que perdeu 850.000 BTC). Mas você sabe o que a sigla significava?

**M**agic: **T**he **G**athering **O**nline e**X**change.

## A Origem

O domínio foi criado originalmente por Jed McCaleb (que depois criaria a Ripple e a Stellar) para ser um local de troca de cartas do jogo *Magic: The Gathering*.
Ele percebeu depois que o site poderia ser adaptado para negociar essa nova coisa chamada "Bitcoin". Ele vendeu o site para Mark Karpelès, que o transformou na maior corretora de Bitcoin do mundo.

No seu auge, a Mt. Gox processava **70% de todas as transações de Bitcoin do mundo**. O fato de que toda a economia cripto dependia de um site refeito de troca de cartas explica muito sobre a fragilidade e o amadorismo dos primeiros anos do mercado.
    `
    },
    {
        slug: "o-suprimento-total-de-bitcoin-e-de-21-milhoes-nem-",
        content: "O suprimento total de Bitcoin é de 21 milhões, nem um a mais.",
        description: "A regra mais sagrada do protocolo: a finitude absoluta.",
        category: "Conceitos",
        keywords: ["21 Milhões", "Escassez", "Economia", "Protocolo"],
        fullContent: `
# O Número Mágico: 21.000.000

Não serão 22 milhões. Não serão 21 milhões e um. O limite de oferta do Bitcoin é assintótico e matematicamente travado em 21 milhões.

## Por Que 21?

Satoshi nunca explicou explicitamente o motivo exato desse número (poderia ser 100 milhões ou 1 milhão). É uma escolha arbitrária, mas a **finitude** não é.
Ao fixar um limite máximo, o Bitcoin garante que ninguém pode diluir sua riqueza imprimindo mais moedas (inflação).

## Divisibilidade

"Mas 21 milhões não é pouco para o mundo todo?"
Não, porque cada Bitcoin é divisível em 100 milhões de pedaços chamados **Satoshis**.
Isso significa que existem \`2, 1 quadrilhões\` de unidades monetárias básicas no sistema. Há satoshis suficientes para que cada transação global seja feita na blockchain, mesmo que 1 BTC valha 10 milhões de dólares.
    `
    },
    {
        slug: "ethereum-nao-e-apenas-uma-moeda-mas-uma-plataforma",
        content: "Ethereum não é apenas uma moeda, mas uma plataforma para contratos inteligentes.",
        description: "A diferença fundamental entre ter dinheiro digital e ter dinheiro programável.",
        category: "Ethereum",
        keywords: ["Smart Contracts", "Plataforma", "DApps", "Web3"],
        fullContent: `
# Dinheiro Programável

Muitas pessoas confundem Bitcoin e Ethereum como concorrentes diretos, mas eles são animais diferentes.
- **Bitcoin** é uma planilha de Excel compartilhada que diz quem tem quanto dinheiro.
- **Ethereum** é um computador compartilhado que pode rodar qualquer aplicativo.

## Smart Contracts

A mágica do Ethereum são os contratos inteligentes. São códigos que dizem:
*"Se acontecer X, faça Y e envie dinheiro para Z."*

Uma vez publicado na blockchain, esse código roda sozinho, para sempre, sem ninguém poder parar ou alterar. Isso permitiu criar:
- Robôs de investimento.
- Sistemas de votação.
- Jogos onde você é dono dos itens.
- Dólares digitais.

O Ether (ETH) é a moeda usada para pagar pelo uso desse computador mundial.
    `
    },
    {
        slug: "laszlo-hanyecz-o-homem-da-pizza-gastou-o-que-hoje-",
        content: "Laszlo Hanyecz, o homem da pizza, gastou o que hoje valeria bilhões em uma refeição.",
        description: "Você teria coragem de gastar a próxima grande fortuna mundial em jantar?",
        category: "História",
        keywords: ["Pizza Day", "Laszlo", "Arrependimento", "Adoção"],
        fullContent: `
# O Homem Mais Famoso (e Faminto) do Bitcoin

As duas pizzas que Laszlo Hanyecz comprou por 10.000 BTC em 2010 são o exemplo clássico de "custo de oportunidade".
Mas raramente se fala sobre o que Laszlo fez *depois*.

## Ele Continuou Gastando

Laszlo não comprou apenas aquelas duas pizzas. Estima-se que ele tenha gasto cerca de **100.000 BTC** ao longo dos anos em pizzas e itens diversos, minerando e gastando para provar que o sistema funcionava.
Hoje, esse montante valeria trilhões de reais.

## O Herói Necessário

Pode parecer triste perder essa fortuna, mas Laszlo é considerado um herói. Sem pessoas como ele dispostas a usar a moeda quando ela não valia nada, ela nunca teria chegado a valer alguma coisa. O Bitcoin precisava circular para ganhar valor. O sacrifício gastronômico de Laszlo foi o adubo que fez a economia cripto germinar.
    `
    },
    {
        slug: "o-bloco-genese-do-bitcoin-contem-uma-manchete-do-j",
        content: "O bloco gênese do Bitcoin contém uma manchete do jornal 'The Times' sobre resgate bancário.",
        description: "A mensagem oculta deixada por Satoshi Nakamoto revela a motivação política do Bitcoin.",
        category: "História",
        keywords: ["Genesis Block", "The Times", "Bancos", "Crise 2008"],
        fullContent: `
# A Mensagem na Garrafa

Minerar um bloco de Bitcoin permite incluir um pequeno texto arbitrário nos dados. No primeiro bloco de todos (Genesis Block), Satoshi escreveu:

> **"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"**
> (Chanceler à beira do segundo resgate aos bancos)

## O Significado

Essa era a manchete da capa do jornal britânico *The Times* naquele dia.
Ela serve dois propósitos:
1.  **Prova de Data**: Prova que o Bitcoin não foi lançado antes de 03/01/2009.
2.  **Manifesto Político**: O Bitcoin nasceu no auge da crise financeira de 2008, como uma resposta direta à irresponsabilidade dos bancos centrais que imprimiam dinheiro para salvar bancos falidos (bailouts) às custas da inflação da população.

O Bitcoin foi a resposta de Satoshi: um sistema onde nenhum banco precisa (ou pode) ser resgatado.
    `
    },
    {
        slug: "a-menor-unidade-de-um-bitcoin-e-chamada-de-satoshi",
        content: "A menor unidade de um Bitcoin é chamada de 'Satoshi'.",
        description: "Você não precisa comprar um Bitcoin inteiro. Conheça os centavos da criptomoeda.",
        category: "Conceitos",
        keywords: ["Satoshi", "Divisibilidade", "Unidade", "Bitcoin"],
        fullContent: `
# Stacking Sats

Um erro comum de iniciantes é pensar: "O Bitcoin está muito caro ($60.000), não tenho dinheiro para comprar um".
Boa notícia: você não precisa comprar um inteiro.

## Divisível até a 8ª Casa Decimal

Assim como o Real tem centavos (0,01), o Bitcoin tem **Satoshis**.
- 1 Bitcoin = 100.000.000 Satoshis.
- 1 Satoshi = 0.00000001 BTC.

Isso significa que você pode comprar R$ 50 de Bitcoin. Você receberá alguns milhares de Satoshis.
Na comunidade, o ato de acumular pequenas frações de Bitcoin ao longo do tempo é chamado carinhosamente de **"Stacking Sats"** (Empilhando Sats). A meta de muitos é se tornar um "Satoshionário".
    `
    },
    {
        slug: "o-governo-dos-eua-e-um-dos-maiores-detentores-de-b",
        content: "O governo dos EUA é um dos maiores detentores de Bitcoin do mundo devido a apreensões.",
        description: "O Tio Sam é uma Baleia. Como crimes cibernéticos encheram os cofres do governo americano.",
        category: "Curiosidade",
        keywords: ["EUA", "Governo", "Apreensão", "Whale"],
        fullContent: `
# A Baleia Estatal

Ironicamente, uma das entidades que mais possui Bitcoin no mundo é o governo que mais tentou regulá-lo. O Governo dos EUA detém, periodicamente, cerca de **200.000 BTC** (o número varia conforme leilões e novas apreensões).

## De Onde Vem?

Não é compra estratégica (ainda), é combate ao crime.
- **Silk Road**: A apreensão do mercado negro da Deep Web rendeu dezenas de milhares de BTC.
- **Hack da Bitfinex**: Hackers presos tiveram seus fundos confiscados.

## O Que Eles Fazem?

Antigamente, o governo leiloava esses Bitcoins rapidamente (o investidor Tim Draper comprou 30.000 BTC num desses leilões em 2014 a preço de banana).
Hoje, o governo tende a segurar por mais tempo, devido à burocracia e ao impacto que a venda teria no mercado. Isso coloca o governo americano na curiosa posição de ser um dos maiores beneficiários da valorização do Bitcoin.
    `
    },
    {
        slug: "existem-mais-de-200-milhoes-de-usuarios-de-criptom",
        content: "Existem mais de 200 milhões de usuários de criptomoedas no mundo hoje.",
        description: "A curva de adoção da internet se repete. Estamos apenas no começo?",
        category: "Adoção",
        keywords: ["Estatística", "Crescimento", "Global", "Internet"],
        fullContent: `
# Crescimento Exponencial

Estimar o número exato de usuários de cripto é difícil (uma pessoa pode ter 10 carteiras), mas relatórios de empresas como crypto.com e Glassnode apontam que já passamos da marca de **500 milhões de usuários globais** em 2024.

## Comparação com a Internet

Analistas adoram sobrepor o gráfico de adoção do Bitcoin com o gráfico da Internet nos anos 90.
- Estamos, segundo essa métrica, no equivalente ao ano **1998/1999** da internet.
- Isso significa que o "boom" real de usuários (o momento em que sua avó usa sem saber) ainda está por vir.

Se a tendência seguir a da internet, esperamos atingir 1 bilhão de usuários até o final desta década. Cripto deixou de ser "coisa de nerd" para ser uma classe de ativos macroeconômica inevitável.
    `
    },
    {
        slug: "a-primeira-criptomoeda-do-mundo-nao-foi-o-bitcoin-",
        content: "A primeira criptomoeda do mundo não foi o Bitcoin, mas o eCash de David Chaum em 1983.",
        description: "O Bitcoin não nasceu do nada. Conheça os avôs da moeda digital.",
        category: "História",
        keywords: ["Pré-história", "Cypherpunk", "eCash", "David Chaum"],
        fullContent: `
# Os Gigantes Sobre Cujos Ombros Satoshi Subiu

Satoshi Nakamoto não inventou a criptografia, nem a ideia de dinheiro digital. Ele resolveu o **Problema do Gasto Duplo** sem uma autoridade central. Mas antes dele, muitos tentaram.

## As Tentativas Frustradas

- **DigiCash (eCash)**: Criado por David Chaum em 1989. Usava criptografia cega para privacidade, mas era centralizado (uma empresa rodava os servidores). Quando a empresa faliu, o dinheiro sumiu.
- **E-Gold (1996)**: Moeda digital lastreada em ouro. Foi fechada pelo governo dos EUA.
- **Bit Gold (Nick Szabo)** e **B-Money (Wei Dai)**: Projetos teóricos que descreviam quase exatamente o Bitcoin, mas que nunca foram implementados com sucesso.

O Bitcoin foi a peça final desse quebra-cabeça de 30 anos, unindo todas essas ideias anteriores com a inovação da **Blockchain** para remover o ponto único de falha (a empresa central).
    `
    },
    {
        slug: "vitalik-buterin-tinha-apenas-19-anos-quando-escrev",
        content: "Vitalik Buterin tinha apenas 19 anos quando escreveu o whitepaper do Ethereum.",
        description: "A repetição de um gênio: o impacto jovem na revolução blockchain.",
        category: "Ethereum",
        keywords: ["Vitalik", "Jovens", "Inovação", "Ethereum"],
        fullContent: `
# O Garoto Prodígio (Redux)

Vale reforçar a história de Vitalik Buterin, pois ela inspira uma nova geração de desenvolvedores.
Vitalik não era um banqueiro sênior, nem um professor universitário renomado. Ele era um escritor de blog e programador autodidata de 19 anos.

## A Importância do Código Aberto

Isso só foi possível porque a blockchain é um campo meritocrático.
Ninguém perguntou a universidade de Vitalik antes de ler o whitepaper do Ethereum. O código falava por si.
O sucesso do Ethereum prova que, na economia digital, uma boa ideia e a capacidade de executá-la valem mais do que décadas de credenciais tradicionais. Vitalik continua sendo, hoje, a figura pública mais influente e respeitada do ecossistema, guiando o Ethereum em direção a um futuro de escalabilidade global.
    `
    },
    {
        slug: "hal-finney-foi-a-primeira-pessoa-a-receber-uma-tra",
        content: "Hal Finney foi a primeira pessoa a receber uma transação de Bitcoin de Satoshi.",
        description: "O recebedor do Bloco 170 e a suspeita eterna: seria ele o próprio Satoshi?",
        category: "História",
        keywords: ["Hal Finney", "Satoshi", "História", "Pioneiros"],
        fullContent: `
# Running Bitcoin

Em 10 de janeiro de 2009, Hal Finney twittou duas palavras que entrariam para a história: **"Running bitcoin"**.
Ele foi a primeira pessoa, além de Satoshi, a baixar e rodar o software.

## A Primeira Transação

Para testar se a rede funcionava, Satoshi enviou **10 BTC** para Hal Finney. Essa foi a primeira transação P2P de criptomoeda da história.

## Um Legado Trágico e Brilhante

Hal Finney foi diagnosticado com ELA (Esclerose Lateral Amiotrófica) e faleceu em 2014. Seu corpo foi criopreservado.
Muitos acreditam que Hal era o próprio Satoshi, ou o parceiro mais próximo dele. Ele negou até o fim, mas sua contribuição técnica e moral para o Bitcoin é incalculável. Ele previu, ainda em 2010, que cada Bitcoin poderia valer 10 milhões de dólares um dia.
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
