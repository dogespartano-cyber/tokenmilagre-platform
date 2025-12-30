import { PrismaClient, Prisma } from '../../lib/generated/prisma';

const prisma = new PrismaClient();

const newsArticles = [
    {
        slug: 'bitcoin-atinge-nova-maxima-historica',
        title: 'Bitcoin rompe barreira dos US$ 100.000 e atinge nova máxima histórica',
        excerpt: 'A maior criptomoeda do mundo ultrapassou a marca psicológica de seis dígitos, impulsionada pela adoção institucional e clareza regulatória.',
        content: `# Bitcoin rompe os US$ 100.000: Um Novo Marco para o Mercado Cripto\n\nO dia de hoje ficará marcado na história das finanças digitais. O **Bitcoin (BTC)** finalmente ultrapassou a barreira dos **US$ 100.000**, uma marca que muitos especialistas consideravam impossível há apenas alguns anos.\n\n## Fatores Determinantes\nVários fatores contribuíram para este rali histórico:\n\n1. **Adoção Institucional:** Grandes empresas e fundos de pensão começaram a alocar capital significativamente em ETFs de Bitcoin Spot.\n\n2. **Clareza Regulatória:** Novos marcos legais em grandes economias trouxeram mais segurança para investidores conservadores.\n\n3. **Escassez Digital:** Com o último halving, a oferta de novos bitcoins tornou-se ainda mais restrita.\n\n## O que esperar agora?\nAnalistas acreditam que o rompimento desta marca psicológica pode atrair uma nova onda de investidores de varejo, enquanto o "HODLing" institucional continua forte.`,
        type: 'news',
        category: 'mercado',
        sentiment: 'positive',
        tags: JSON.stringify(['Bitcoin', 'BTC', 'Mercado', 'Rali']),
        published: true,
    },
    {
        slug: 'ethereum-prow-upgrade-concluido',
        title: 'Ethereum conclui atualização crucial para escalabilidade e taxas menores',
        excerpt: 'A nova atualização da rede Ethereum foca em reduzir drasticamente as taxas de gas nas Camadas 2, tornando o ecossistema mais acessível.',
        content: `# Ethereum se Torna Mais Barato com Nova Atualização\n\nA rede Ethereum deu mais um passo gigante em seu roadmap. A conclusão da atualização 'Prow' trouxe melhorias significativas na forma como os dados são processados.\n\n## Foco nas Camadas 2\nO principal objetivo desta atualização é beneficiar redes como Arbitrum, Optimism e Polygon. Usuários destas redes verão uma redução de até 90% nas taxas de transação.\n\n## O Impacto no DeFi\nCom taxas menores, operações de micro-finanças e pequenos trades tornam-se viáveis novamente na rede principal e suas extensões, fortalecendo o ecossistema DeFi como um todo.`,
        type: 'news',
        category: 'tecnologia',
        sentiment: 'positive',
        tags: JSON.stringify(['Ethereum', 'ETH', 'Layer2', 'Tech']),
        published: true,
    },
    {
        slug: 'regulamentacao-cripto-brasil-avanca',
        title: 'Nova regulamentação de criptoativos no Brasil entra em vigor com foco em proteção',
        excerpt: 'As novas diretrizes visam trazer mais transparência para as exchanges operando no país e garantir a segregação patrimonial dos fundos dos clientes.',
        content: `# Brasil se Posiciona como Hub Cripto com Nova Regulação\n\nA nova fase da regulamentação de criptoativos no Brasil começou a valer, trazendo mudanças estruturais para o mercado nacional.\n\n## Segregação Patrimonial\nA medida mais importante é a obrigatoriedade da segregação patrimonial, o que significa que o dinheiro dos clientes deve estar totalmente separado dos ativos da exchange.\n\n## Segurança para o Usuário\nIsso evita situações como a da extinta FTX, garantindo que mesmo em caso de falência da empresa, os fundos dos usuários permaneçam protegidos e acessíveis.`,
        type: 'news',
        category: 'regulamentação',
        sentiment: 'neutral',
        tags: JSON.stringify(['Brasil', 'Cripto', 'Lei', 'Governo']),
        published: true,
    },
    {
        slug: 'solana-ultrapassa-volume-dex-ethereum',
        title: 'Solana ultrapassa Ethereum em volume diário de negociação em DEXs',
        excerpt: 'Pela primeira vez em meses, a rede Solana registrou um volume de trocas descentralizadas superior ao da rede Ethereum, impulsionada por memecoins.',
        content: `# Solana Lidera Volume em Exchanges Descentralizadas\n\nO ecossistema Solana continua a demonstrar uma força impressionante. Dados recentes mostram que o volume diário nas DEXs da Solana superou o do Ethereum.\n\n## A Febre das Memecoins\nGrande parte desse volume é atribuído ao lançamento constante de novos tokens e memecoins que utilizam a infraestrutura rápida e barata da Solana.\n\n## Desafio para o Ethereum\nEmbora o Ethereum continue sendo o lar de grandes volumes institucionais, a Solana está se consolidando como a escolha preferida para o varejo e usuários ativos.`,
        type: 'news',
        category: 'mercado',
        sentiment: 'positive',
        tags: JSON.stringify(['Solana', 'SOL', 'DEX', 'Trading']),
        published: true,
    }
];

async function main() {
    console.log('📰 Seeding news articles...');

    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (!admin) {
        throw new Error('Nenhum usuário ADMIN encontrado. Execute seed.ts primeiro.');
    }

    for (const articleData of newsArticles) {
        const baseData = {
            ...articleData,
            authorId: admin.id,
        };
        await prisma.article.upsert({
            where: { slug: articleData.slug },
            update: baseData as Prisma.ArticleUncheckedUpdateInput,
            create: baseData as Prisma.ArticleUncheckedCreateInput,
        });
        console.log(`✅ News seeded: ${articleData.title}`);
    }

    console.log(`\n🎉 ${newsArticles.length} news articles seeded successfully!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
