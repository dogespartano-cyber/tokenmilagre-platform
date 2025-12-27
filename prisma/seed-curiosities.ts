import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

const curiosities = [
    "A primeira transação de Bitcoin foi 10.000 BTC por duas pizzas em 2010.",
    "Satoshi Nakamoto, o criador do Bitcoin, possui cerca de 1.1 milhão de BTC.",
    "Estima-se que cerca de 20% de todo o Bitcoin existente esteja perdido para sempre.",
    "O último Bitcoin será minerado por volta do ano 2140.",
    "A rede Bitcoin é mais poderosa do que os 500 maiores supercomputadores do mundo juntos.",
    "A primeira criptomoeda do mundo não foi o Bitcoin, mas o eCash de David Chaum em 1983.",
    "Hal Finney foi a primeira pessoa a receber uma transação de Bitcoin de Satoshi.",
    "O termo 'HODL' surgiu de um erro de digitação em um fórum em 2013.",
    "Existem mais de 200 milhões de usuários de criptomoedas no mundo hoje.",
    "O governo dos EUA é um dos maiores detentores de Bitcoin do mundo devido a apreensões.",
    "A menor unidade de um Bitcoin é chamada de 'Satoshi'.",
    "O bloco gênese do Bitcoin contém uma manchete do jornal 'The Times' sobre resgate bancário.",
    "Laszlo Hanyecz, o homem da pizza, gastou o que hoje valeria bilhões em uma refeição.",
    "A Dogecoin foi criada em apenas 3 horas como uma piada.",
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
    "Vitalik Buterin tinha apenas 19 anos quando escreveu o whitepaper do Ethereum.",
    "Bitcoin é um software de código aberto; qualquer um pode sugerir melhorias.",
    "A primeira conferência de Bitcoin aconteceu em Praga, em 2011.",
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

async function main() {
    console.log('🌱 Seeding curiosities...');

    for (const content of curiosities) {
        await prisma.curiosity.create({
            data: {
                content,
                category: 'general'
            }
        });
    }

    console.log(`✅ ${curiosities.length} curiosities seeded!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
