/**
 * Artigo: Taxas e Redes
 * Slug: taxas-gas-e-redes
 * Posição: 6 de 8 na trilha "Comece por Aqui"
 */

export const taxasGasERedesArticle = {
    slug: 'taxas-gas-e-redes',
    title: 'Taxas e Redes: Entendendo Gas, Confirmações e Custos',
    excerpt: 'Por que algumas transações custam centavos e outras dezenas de dólares? Entenda como funcionam taxas e redes blockchain.',
    content: `# Taxas e Redes

> Este conteúdo é educacional. Taxas variam constantemente. Sempre verifique antes de transacionar.

Uma das maiores surpresas para iniciantes é descobrir que transações em cripto têm custos — às vezes altos. Este artigo explica como funcionam essas taxas e como economizar.

## O que são taxas de transação?

Toda transação em blockchain precisa ser processada por validadores (ou mineradores). Eles gastam recursos computacionais para isso. A taxa é a recompensa que você paga para que sua transação seja incluída no próximo bloco.

Diferente de bancos, as taxas não vão para uma empresa — vão para a rede distribuída.

## Gas: a unidade de trabalho

No Ethereum e redes compatíveis, "gas" mede o trabalho computacional necessário.

**Gas limit** — quantidade máxima de gas que você está disposto a usar.

**Gas price** — quanto você paga por unidade de gas (geralmente em Gwei).

**Taxa total** = Gas usado × Gas price

Exemplo: se uma transação usa 21.000 gas e o preço é 50 Gwei, a taxa é:
21.000 × 50 = 1.050.000 Gwei = 0.00105 ETH

## Por que as taxas variam tanto?

As taxas funcionam como leilão. Quando muitas pessoas querem transacionar, o preço sobe. Quando a rede está tranquila, o preço cai.

**Taxas altas** — geralmente durante lançamentos populares (NFTs, airdrops), alta volatilidade do mercado, ou congestionamento da rede.

**Taxas baixas** — fins de semana, horários de menor atividade (madrugada nos EUA).

## Tipos de transação e custos

**Transferência simples** — enviar ETH ou token. ~21.000 gas.

**Swap em DEX** — trocar tokens. ~100.000-200.000 gas.

**Mint de NFT** — criar NFT. ~50.000-150.000 gas.

**Interação DeFi complexa** — staking, farming. ~200.000-500.000+ gas.

Quanto mais complexa a operação, mais gas consome.

## Layer 1 vs Layer 2

### Layer 1 (L1)

Blockchain principal. Mais segura, mas mais cara e lenta.

**Exemplos:** Ethereum, Bitcoin, Solana, Avalanche.

**Taxas Ethereum:** $1-50+ dependendo do congestionamento.

**Taxas Solana:** <$0.01 geralmente.

### Layer 2 (L2)

Soluções construídas sobre L1 para transações mais rápidas e baratas.

**Exemplos:** Polygon, Arbitrum, Optimism, Base.

**Taxas:** geralmente $0.01-1.00.

**Como funciona:** L2 processa muitas transações e depois "ancora" o resultado na L1.

## Confirmações

Quando você envia uma transação, ela precisa ser confirmada pelos validadores.

**Pendente** — transação enviada mas ainda não incluída em bloco.

**1 confirmação** — incluída em 1 bloco. Geralmente suficiente para pequenos valores.

**6+ confirmações** — considerado irreversível. Necessário para grandes valores.

**Tempo por confirmação:** varia por rede. Ethereum ~12 segundos, Bitcoin ~10 minutos.

## Como economizar em taxas

**Espere horários de baixo tráfego** — fins de semana, madrugadas (horário dos EUA).

**Use L2 quando possível** — Polygon, Arbitrum, etc. são muito mais baratos.

**Ajuste gas price** — carteiras permitem definir gas price menor (transação demora mais).

**Agrupe transações** — se possível, faça menos transações com valores maiores.

**Compare bridges** — ao mover entre redes, compare custos de diferentes bridges.

## Ferramentas úteis

**Etherscan Gas Tracker** — mostra preços de gas atuais e históricos.

**GasNow** — estimativas de tempo para diferentes preços.

**L2Fees** — compara taxas entre diferentes L2s.

**DeBank** — visualiza seu portfolio em múltiplas redes.

## Erros comuns

**Gas limit muito baixo** — transação falha mas você ainda paga a taxa.

**Não verificar rede** — enviar para endereço certo mas rede errada.

**Ignorar taxas em valor pequeno** — taxa de $5 em transação de $10 é 50% de perda.

**Pressa em alta demanda** — pagar gas astronômico por urgência desnecessária.

## Resumo

Taxas são inevitáveis em blockchain. Gas mede trabalho computacional. Preços variam com demanda. L2s são muito mais baratos que L1. Espere horários tranquilos para economizar. Sempre verifique a rede antes de transacionar.

## Próximo passo

Agora que você entende custos, vamos aprender sobre golpes comuns — e como evitá-los.
`,
    type: 'educational',
    category: 'fundamentos',
    level: 'iniciante',
    contentType: 'Artigo',
    readTime: '10 min',
    warningLevel: 'info',
    securityTips: JSON.stringify([
        {
            icon: '',
            title: 'Verifique Gas Antes de Confirmar',
            description: 'Sempre olhe o custo total antes de aprovar uma transação.',
        },
        {
            icon: '',
            title: 'Confirme a Rede',
            description: 'Enviar para rede errada pode significar perda de fundos.',
        },
    ]),
    tags: JSON.stringify(['gas', 'taxas', 'l2', 'ethereum', 'polygon', 'redes']),
    published: true,
    projectHighlight: false,
    relatedArticles: JSON.stringify(['carteiras-e-custodia', 'golpes-comuns-cripto']),
    quizData: JSON.stringify([
        {
            id: 1,
            text: 'O que mede a unidade "gas" no Ethereum?',
            options: ['Velocidade da transação', 'Trabalho computacional necessário', 'Quantidade de tokens', 'Número de confirmações'],
            correctAnswer: 1,
            explanation: 'Gas mede o trabalho computacional necessário para processar uma transação. Operações complexas usam mais gas.',
        },
        {
            id: 2,
            text: 'Qual é a fórmula correta para calcular a taxa total de transação?',
            options: ['Gas price ÷ Gas limit', 'Gas usado × Gas price', 'Confirmações × Gwei', 'Block size × Gas limit'],
            correctAnswer: 1,
            explanation: 'Taxa total = Gas usado × Gas price. Por exemplo: 21.000 gas × 50 Gwei = 1.050.000 Gwei.',
        },
        {
            id: 3,
            text: 'Por que as taxas Layer 2 são geralmente mais baratas que Layer 1?',
            options: ['Usam menos eletricidade', 'Processam transações em lote antes de ancorar na L1', 'Não têm validadores', 'São centralizadas'],
            correctAnswer: 1,
            explanation: 'L2s como Polygon e Arbitrum processam muitas transações e depois "ancoram" o resultado na L1, economizando custos.',
        },
        {
            id: 4,
            text: 'Qual é o melhor horário para economizar em taxas de gas?',
            options: ['Durante lançamentos de NFT', 'Alta volatilidade do mercado', 'Fins de semana e madrugadas (horário EUA)', 'Segundas-feiras de manhã'],
            correctAnswer: 2,
            explanation: 'As taxas funcionam como leilão. Menor demanda = menor preço. Fins de semana e madrugadas costumam ter menos atividade.',
        },
        {
            id: 5,
            text: 'O que acontece se você definir um gas limit muito baixo?',
            options: ['Transação fica mais barata', 'Transação falha mas você ainda paga a taxa', 'Gas é devolvido', 'Nada acontece'],
            correctAnswer: 1,
            explanation: 'Se o gas limit for insuficiente, a transação falha por falta de recursos, mas você ainda paga pelo gas consumido até a falha.',
        },
    ]),
};
