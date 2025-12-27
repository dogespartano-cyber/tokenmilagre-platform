import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

const curiosities = [
    {
        content: "A primeira transação de Bitcoin foi 10.000 BTC por duas pizzas em 2010.",
        description: "O marco histórico que deu início ao uso do Bitcoin como meio de troca.",
        fullContent: "# A Famosa Pizza de 10.000 Bitcoins\n\nEm 22 de maio de 2010, Laszlo Hanyecz fez história ao realizar a primeira compra documentada de um bem físico usando Bitcoin. Ele pagou 10.000 BTC por duas pizzas da Papa John's.\n\n## O Valor Hoje\nNa época, os 10.000 Bitcoins valiam cerca de 41 dólares. Hoje, essa mesma quantia representaria centenas de milhões de dólares, tornando-as as pizzas mais caras da história humana.\n\n## Bitcoin Day\nDesde então, a comunidade cripto celebra o 'Bitcoin Pizza Day' todos os anos em 22 de maio para comemorar este marco da utilidade real da criptomoeda.",
        keywords: ["Bitcoin", "Pizza Day", "História", "Transação"]
    },
    {
        content: "Satoshi Nakamoto, o criador do Bitcoin, possui cerca de 1.1 milhão de BTC.",
        description: "A fortuna intocada do misterioso criador da primeira criptomoeda.",
        fullContent: "# A Fortuna de Satoshi Nakamoto\n\nEstima-se que Satoshi Nakamoto, o pseudônimo do criador do Bitcoin, tenha minerado aproximadamente 1,1 milhão de BTC nos primeiros dias da rede.\n\n## Carteiras Intocadas\nO fato mais fascinante é que essas moedas nunca foram movidas. Elas permanecem nos endereços originais desde 2009. Se Satoshi ainda estiver vivo e tiver acesso às chaves, ele é uma das pessoas mais ricas do mundo.\n\n## O Mistério\nA identidade de Satoshi permanece o maior segredo da era digital, com diversas teorias apontando para diferentes cientistas da computação, mas nenhuma comprovada até hoje.",
        keywords: ["Satoshi Nakamoto", "Fortuna", "Mistério", "BTC"]
    },
    {
        content: "Estima-se que cerca de 20% de todo o Bitcoin existente esteja perdido para sempre.",
        description: "Milhões de moedas inacessíveis devido a chaves perdidas ou esquecidas.",
        fullContent: "# O Tesouro Perdido do Século XXI\n\nAo contrário do ouro físico que pode ser recuperado de naufrágios, o Bitcoin perdido por falta de chaves privadas é matematicamente irrecuperável.\n\n## Causas do Perigo\nA maioria dessas perdas ocorreu nos primeiros anos, quando o Bitcoin valia quase nada e as pessoas não cuidavam de seus discos rígidos ou senhas.\n\n## Impacto na Escassez\nIsso torna o Bitcoin ainda mais escasso do que os 21 milhões previstos no protocolo, aumentando seu potencial de valor como reserva de valor.",
        keywords: ["Escassez", "Segurança", "Chaves Privadas", "Bitcoin Perdido"]
    },
    {
        content: "O último Bitcoin será minerado por volta do ano 2140.",
        description: "A curva de emissão programada que garante a escassez absoluta.",
        fullContent: "# O Horizonte de 2140\n\nO protocolo do Bitcoin foi desenhado para ser deflacionário. Através de um processo chamado Halving, a recompensa dos mineradores cai pela metade a cada 4 anos.\n\n## O Fim da Mineração\nSeguindo esta progressão matemática, o último satoshi será minerado aproximadamente no ano 2140. Após isso, os mineradores serão remunerados exclusivamente pelas taxas de transação da rede.\n\n## Legado de Longo Prazo\nEste design garante que o Bitcoin sobreviva por gerações, mantendo uma política monetária previsível e imutável.",
        keywords: ["Mineração", "2140", "Halving", "Futuro"]
    },
    {
        content: "A rede Bitcoin é mais poderosa do que os 500 maiores supercomputadores do mundo juntos.",
        description: "A segurança inigualável da maior rede descentralizada do planeta.",
        fullContent: "# O Supercomputador Global\n\nA rede Bitcoin não é apenas uma moeda, é a infraestrutura de computação mais segura e resiliente já criada pela humanidade.\n\n## Poder de Processamento\nO 'Hash Rate' da rede Bitcoin ultrapassa o poder computacional combinado dos supercomputadores mais rápidos do mundo. Tentar atacar essa rede exigiria uma quantidade de energia e recursos praticamente impossível para qualquer entidade única.\n\n## Descentralização\nEsse poder não está em um lugar só, mas espalhado por milhares de máquinas ao redor do globo, garantindo que não haja um ponto único de falha.",
        keywords: ["Segurança", "Hash Rate", "Tecnologia", "Descentralização"]
    },
    {
        content: "A primeira criptomoeda do mundo não foi o Bitcoin, mas o eCash de David Chaum em 1983.",
        description: "Os predecessores que pavimentaram o caminho para a revolução blockchain.",
        fullContent: "# Antes do Bitcoin: O Surgimento do eCash\n\nMuito antes de Satoshi Nakamoto, criptógrafos como David Chaum já exploravam formas de dinheiro digital anônimo.\n\n## David Chaum e a DigiCash\nEm 1983, Chaum concebeu o eCash, um sistema de dinheiro eletrônico baseado em algoritmos criptográficos que permitiam transações privadas e seguras. Embora a empresa DigiCash tenha falido em 1998, seus conceitos foram fundamentais para o que viria a ser o Bitcoin.\n\n## O Elo Perdido\nO eCash mostrou que a privacidade financeira digital era possível, mas ainda dependia de uma entidade central para validar as moedas — um problema que o Bitcoin resolveu com a blockchain.",
        keywords: ["eCash", "História", "Criptografia", "David Chaum"]
    },
    {
        content: "Hal Finney foi a primeira pessoa a receber uma transação de Bitcoin de Satoshi.",
        description: "O encontro histórico entre dois pioneiros da criptografia.",
        fullContent: "# A Primeira Transação: Satoshi para Hal Finney\n\nEm 12 de janeiro de 2009, apenas alguns dias após o lançamento do Bitcoin, ocorreu a primeira transferência entre dois usuários no bloco 170.\n\n## Quem foi Hal Finney?\nHal foi um renomado criptógrafo e o primeiro a rodar o software Bitcoin depois de Satoshi. Ele recebeu 10 BTC como um teste de funcionamento da rede.\n\n## O Mistério Continua\nMuitos acreditam que Hal Finney poderia ser o próprio Satoshi, ou pelo menos parte de um grupo, devido à sua proximidade com o projeto desde o início.",
        keywords: ["Hal Finney", "Satoshi", "História", "Primeira Transação"]
    },
    {
        content: "O termo 'HODL' surgiu de um erro de digitação em um fórum em 2013.",
        description: "Como um erro de gramática se tornou o mantra mais famoso da cultura cripto.",
        fullContent: "# I AM HODLING: O Surgimento de um Mantra\n\nEm dezembro de 2013, durante uma queda brusca de preços, um usuário chamado GameKyuubi postou no fórum Bitcointalk o título: 'I AM HODLING'.\n\n## O Erro que Ficou\nEle pretendia escrever 'HOLDING' (segurando), mas digitou errado em meio a um desabafo sobre não saber fazer trade. O erro foi instantaneamente adotado pela comunidade.\n\n## Significado Atual\nHoje, HODL é frequentemente interpretado como um acrônimo para 'Hold On for Dear Life' (Segure-se pela sua vida), representando a estratégia de longo prazo de nunca vender seus ativos apesar da volatilidade.",
        keywords: ["HODL", "Cultura", "Meme", "Estratégia"]
    },
    {
        content: "A Dogecoin foi criada em apenas 3 horas como uma piada.",
        description: "A origem humilde da memecoin que conquistou o mercado.",
        fullContent: "# Dogecoin: De Piada a Fenômeno de Mercado\n\nBilly Markus e Jackson Palmer criaram a Dogecoin em 2013 com o objetivo de satirizar a proliferação de altcoins sem propósito na época.\n\n## Rapidez no Desenvolvimento\nBilly Markus afirmou que a maior parte do código foi feita em cerca de 3 horas, simplesmente copiando o código da Luckycoin (que por sua vez era um fork da Litecoin) e trocando os ícones.\n\n## O Poder da Comunidade\nO que começou como uma brincadeira baseada no meme do cachorro Shiba Inu se tornou uma das criptomoedas com maior capitalização e uma das comunidades mais engajadas do mundo.",
        keywords: ["Dogecoin", "Memecoin", "Meme", "História"]
    },
    {
        content: "Vitalik Buterin tinha apenas 19 anos quando escreveu o whitepaper do Ethereum.",
        description: "A mente jovem por trás da maior plataforma de contratos inteligentes do mundo.",
        fullContent: "# O Gênio Precoce do Ethereum\n\nInsatisfeito com as limitações do Bitcoin para rodar aplicações mais complexas, um jovem programador canadense decidiu criar algo novo.\n\n## A Proposta de Vitalik\nEm 2013, Vitalik Buterin publicou o whitepaper do Ethereum, propondo uma blockchain com uma linguagem de programação integrada que permitiria a qualquer pessoa criar aplicativos descentralizados.\n\n## Impacto Global\nHoje, o Ethereum é a base para o mundo de DeFi (Finanças Descentralizadas), NFTs e milhares de outros projetos, provando que a visão de Vitalik transformou permanentemente o ecossistema cripto.",
        keywords: ["Vitalik Buterin", "Ethereum", "Smart Contracts", "História"]
    }
];

// Fallback for remaining curiosities without full content (will generate automatically)
const otherCuriosities = [
    "Existem mais de 200 milhões de usuários de criptomoedas no mundo hoje.",
    "O governo dos EUA é um dos maiores detentores de Bitcoin do mundo devido a apreensões.",
    "A menor unidade de um Bitcoin é chamada de 'Satoshi'.",
    "O bloco gênese do Bitcoin contém uma manchete do jornal 'The Times' sobre resgate bancário.",
    "Laszlo Hanyecz, o homem da pizza, gastou o que hoje valeria bilhões em uma refeição.",
    "Ethereum não é apenas uma moeda, mas uma plataforma para contratos inteligentes.",
    "O suprimento total de Bitcoin é de 21 milhões, nem um a mais.",
    "El Salvador foi o primeiro país a adotar o Bitcoin como moeda legal.",
    "A primeira grande exchange de Bitcoin, Mt. Gox, era originalmente um site de cards de Magic.",
    "A mineração de Bitcoin utiliza eletricidade gasta por aparelhos eletrônicos em stand-by nos EUA.",
    "Existem milhares de 'moedas zumbis' que não têm volume ou valor de mercado.",
    "A palavra 'Criptomoeda' não aparece no whitepaper original do Bitcoin.",
    "O Bitcoin é considerado 'ouro digital' por sua escassez programada.",
    "NFTs (Tokens Não Fungíveis) podem representar qualquer coisa, de arte a terrenos virtuais.",
    "A rede Ethereum processa significativamente mais transações diárias que o Bitcoin.",
    "Mais de 100 milhões de pessoas possuem algum tipo de ativo cripto no Brasil.",
    "O termo 'To the Moon' refere-se à expectativa de que o preço suba drasticamente.",
    "Gas no ecossistema Ethereum refere-se à taxa paga para processar transações.",
    "Algumas mineradoras de Bitcoin usam energia térmica de vulcões para operar.",
    "O símbolo do Bitcoin (₿) foi adicionado oficialmente ao padrão Unicode em 2017.",
    "Bitcoin é um software de código aberto; qualquer um pode sugerir melhorias.",
    "A primeira conferência de Bitcoin aconteceu em Praga, in 2011.",
    "O termo 'Whale' (Baleia) refere-se a indivíduos que possuem enormes quantias de cripto.",
    "Stablecoins são criptos pareadas ao valor de moedas fiduciárias como o Dólar.",
    "DeFi (Finanças Descentralizadas) visa eliminar intermediários como bancos.",
    "O processo de reduzir a recompensa por bloco minerado pela metade chama-se Halving.",
    "O Halving do Bitcoin acontece aproximadamente a cada quatro anos.",
    "Existem caixas eletrônicos de Bitcoin em quase todos os países do mundo.",
    "A Lightning Network permite pagamentos instantâneos com taxas quase zero no Bitcoin.",
    "O endereço do bloco gênese do Bitcoin não pode gastar a recompensa original.",
    "A primeira ICO (Oferta Inicial de Moedas) foi do projeto Mastercoin em 2013.",
    "Shiba Inu começou como uma paródia da Dogecoin, que já era uma paródia.",
    "O criador da Litecoin, Charlie Lee, trabalhou anteriormente no Google.",
    "A Binance é atualmente a maior exchange de criptomoedas do mundo por volume.",
    "Cerca de 10% das empresas globais já consideram aceitar pagamentos em Bitcoin.",
    "O termo 'Altcoin' refere-se a qualquer criptomoeda que não seja o Bitcoin.",
    "Perder as chaves privadas da sua carteira significa perder o acesso aos fundos para sempre.",
    "O mercado cripto funciona 24 horas por dia, 7 dias por semana, sem interrupções.",
    "O custo de transação no Bitcoin não depende do valor enviado, mas do tamanho dos dados.",
    "Muitas pessoas no mundo usam criptomoedas como proteção contra a inflação local."
];

function createSlug(text: string) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 50);
}

async function main() {
    console.log('🌱 Seed: Cleaning up and re-seeding curiosities...');

    // Using a map to track used slugs to avoid collisions
    const usedSlugs = new Set<string>();

    for (const item of curiosities) {
        let slug = createSlug(item.content);
        if (usedSlugs.has(slug)) slug = `${slug}-${Math.random().toString(36).substr(2, 5)}`;
        usedSlugs.add(slug);

        await prisma.curiosity.upsert({
            where: { slug: slug },
            update: {
                content: item.content,
                description: item.description,
                fullContent: item.fullContent,
                keywords: item.keywords,
                category: 'general'
            },
            create: {
                content: item.content,
                slug: slug,
                description: item.description,
                fullContent: item.fullContent,
                keywords: item.keywords,
                category: 'general'
            }
        });
    }

    for (const content of otherCuriosities) {
        let slug = createSlug(content);
        if (usedSlugs.has(slug)) slug = `${slug}-${Math.random().toString(36).substr(2, 5)}`;
        usedSlugs.add(slug);

        await prisma.curiosity.upsert({
            where: { slug: slug },
            update: {
                content,
                description: `Descubra mais sobre: ${content}`,
                fullContent: `# ${content}\n\nEm breve, traremos um artigo detalhado sobre este fato fascinante do mundo cripto.\n\n## Por que isso é importante?\nEntender estes marcos ajuda a compreender a evolução da tecnologia blockchain e seu impacto na sociedade moderna.`,
                category: 'general',
                keywords: ["Cripto", "Curiosidade", "Fato"]
            },
            create: {
                content,
                slug: slug,
                description: `Descubra mais sobre: ${content}`,
                fullContent: `# ${content}\n\nEm breve, traremos um artigo detalhado sobre este fato fascinante do mundo cripto.\n\n## Por que isso é importante?\nEntender estes marcos ajuda a compreender a evolução da tecnologia blockchain e seu impacto na sociedade moderna.`,
                category: 'general',
                keywords: ["Cripto", "Curiosidade", "Fato"]
            }
        });
    }

    console.log(`✅ ${curiosities.length + otherCuriosities.length} curiosities seeded with slugs and articles!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
