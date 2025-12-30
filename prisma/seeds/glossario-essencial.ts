/**
 * Artigo: Glossário Essencial
 * Slug: glossario-essencial
 * Posição: 3 de 8 na trilha "Comece por Aqui"
 */

export const glossarioEssencialArticle = {
    slug: 'glossario-essencial',
    title: 'Glossário Essencial: Os 30 Termos que Você Precisa Conhecer',
    excerpt: 'Blockchain, HODL, DeFi, Gas... O mundo cripto tem seu próprio vocabulário. Este glossário explica os termos mais importantes de forma simples.',
    content: `# Glossário Essencial

> Este conteúdo é educacional. Guarde este artigo para consultar sempre que encontrar um termo desconhecido.

O mundo cripto usa muitos termos técnicos e gírias. Este glossário reúne os mais importantes para você entender conversas, artigos e tutoriais.

## Termos Fundamentais

### Blockchain
Tecnologia que registra transações em blocos conectados. Funciona como um livro contábil público e imutável. Base de todas as criptomoedas.

### Criptomoeda (Crypto)
Dinheiro digital que funciona em blockchain. Exemplos: Bitcoin, Ethereum, Solana.

### Token
Ativo digital criado em uma blockchain existente. Diferente de "moeda" que tem sua própria blockchain. Exemplo: USDT é um token na blockchain Ethereum.

### Altcoin
Qualquer criptomoeda que não seja Bitcoin. "Alt" de alternativa.

### Stablecoin
Criptomoeda que mantém valor estável, geralmente atrelada ao dólar. Exemplos: USDT, USDC, DAI.

## Carteiras e Chaves

### Wallet (Carteira)
Software ou dispositivo que armazena suas chaves e permite enviar/receber cripto.

### Seed Phrase (Frase Semente)
Sequência de 12 a 24 palavras que recupera sua carteira. Sua chave mestra. NUNCA compartilhe.

### Private Key (Chave Privada)
Código secreto que controla seus fundos. Quem tem ela, controla o dinheiro.

### Public Key (Chave Pública)
Endereço que você compartilha para receber cripto. Como seu "número de conta".

### Hot Wallet
Carteira conectada à internet. Conveniente mas menos segura. Ex: MetaMask, Trust Wallet.

### Cold Wallet
Carteira offline. Mais segura para guardar grandes valores. Ex: Ledger, Trezor.

## Transações e Taxas

### Gas
Taxa paga para processar transações na blockchain. Quanto mais complexa a transação, mais gas.

### Gas Fee
O custo em cripto que você paga de taxa. Varia conforme demanda da rede.

### Gwei
Unidade de medida de gas no Ethereum. 1 Gwei = 0.000000001 ETH.

### Confirmação
Quando sua transação é incluída em um bloco. Mais confirmações = mais segurança.

### Hash
Identificador único de uma transação. Usado para rastrear transferências.

## Investimento e Trading

### HODL
Gíria para "Hold" (segurar). Significa manter cripto a longo prazo sem vender. Origem: erro de digitação que virou meme.

### DYOR
"Do Your Own Research" — faça sua própria pesquisa. Lembrete para não confiar cegamente em dicas.

### FUD
"Fear, Uncertainty, Doubt" — medo, incerteza, dúvida. Notícias ou rumores negativos que causam pânico.

### FOMO
"Fear Of Missing Out" — medo de ficar de fora. Sensação de urgência que leva a decisões impulsivas.

### ATH (All-Time High)
Preço mais alto já atingido por uma cripto.

### Bear Market
Mercado em queda prolongada. Preços caindo.

### Bull Market
Mercado em alta. Preços subindo.

### Whale (Baleia)
Pessoa ou entidade que possui grande quantidade de cripto. Pode mover o mercado.

## DeFi e Tecnologia

### DeFi (Finanças Descentralizadas)
Serviços financeiros em blockchain sem intermediários. Empréstimos, trocas, rendimentos.

### DEX (Exchange Descentralizada)
Plataforma para trocar criptos diretamente entre usuários. Ex: Uniswap, PancakeSwap.

### CEX (Exchange Centralizada)
Corretora tradicional de criptos. Ex: Binance, Coinbase.

### Smart Contract (Contrato Inteligente)
Programa que roda automaticamente na blockchain quando condições são cumpridas.

### NFT (Token Não-Fungível)
Token único que representa propriedade de item digital (arte, música, etc).

### L1 (Layer 1)
Blockchain principal. Ex: Ethereum, Solana, Bitcoin.

### L2 (Layer 2)
Solução construída sobre L1 para transações mais rápidas e baratas. Ex: Polygon, Arbitrum.

## Segurança

### Phishing
Golpe que imita sites/emails oficiais para roubar suas credenciais.

### Rug Pull
Quando desenvolvedores abandonam projeto e fogem com o dinheiro dos investidores.

### Scam
Golpe. Qualquer tentativa de roubar seus fundos ou informações.

### KYC
"Know Your Customer" — verificação de identidade exigida por exchanges centralizadas.

### 2FA
Autenticação de dois fatores. Camada extra de segurança além da senha.

## Resumo

Este glossário cobre os termos mais comuns. Salve este artigo e consulte quando encontrar palavras desconhecidas. Com o tempo, você vai memorizar todos naturalmente.

## Próximo passo

Agora que você conhece o vocabulário, vamos aprender como pesquisar projetos de forma inteligente — uma habilidade essencial para evitar perdas.
`,
    type: 'educational',
    category: 'fundamentos',
    level: 'iniciante',
    contentType: 'Artigo',
    readTime: '8 min',
    warningLevel: 'info',
    securityTips: JSON.stringify([
        {
            icon: '',
            title: 'Glossário de Bolso',
            description: 'Salve este artigo para consulta rápida quando encontrar termos desconhecidos.',
        },
        {
            icon: '',
            title: 'DYOR Sempre',
            description: 'Faça sua própria pesquisa — não confie cegamente em dicas de terceiros.',
        },
    ]),
    tags: JSON.stringify(['glossário', 'termos', 'iniciante', 'vocabulário', 'cripto']),
    published: true,
    projectHighlight: false,
    relatedArticles: JSON.stringify(['fundamentos-cripto', 'como-pesquisar-projeto']),
    quizData: JSON.stringify([
        {
            id: 1,
            text: 'O que significa a gíria HODL no mundo cripto?',
            options: ['Vender rapidamente', 'Manter cripto a longo prazo sem vender', 'Comprar mais', 'Fazer day trading'],
            correctAnswer: 1,
            explanation: 'HODL veio de um erro de digitação de "Hold" que virou meme. Significa manter cripto a longo prazo sem vender.',
        },
        {
            id: 2,
            text: 'Qual é a diferença entre Hot Wallet e Cold Wallet?',
            options: ['Hot é mais cara', 'Hot é conectada à internet, Cold é offline', 'Cold é para tokens, Hot é para moedas', 'Não há diferença'],
            correctAnswer: 1,
            explanation: 'Hot Wallet fica online (conveniente mas menos segura). Cold Wallet fica offline (mais segura para guardar grandes valores).',
        },
        {
            id: 3,
            text: 'O que é uma Stablecoin?',
            options: ['Moeda com preço volátil', 'Criptomoeda que mantém valor estável atrelada ao dólar', 'Token de NFT', 'Moeda de mineração'],
            correctAnswer: 1,
            explanation: 'Stablecoins como USDT, USDC e DAI mantêm valor estável (geralmente $1) para facilitar transações sem volatilidade.',
        },
        {
            id: 4,
            text: 'O que significa DYOR?',
            options: ['Do Your Own Research', 'Digital Yield On Returns', 'Decentralized Year Over Rate', 'Dollar Yield Operating Reserve'],
            correctAnswer: 0,
            explanation: 'DYOR significa "Do Your Own Research" - lembrete para pesquisar antes de investir, sem confiar cegamente em dicas.',
        },
        {
            id: 5,
            text: 'O que é um Rug Pull?',
            options: ['Tipo de NFT', 'Quando desenvolvedores abandonam projeto e fogem com o dinheiro', 'Método de staking', 'Ferramenta de análise'],
            correctAnswer: 1,
            explanation: 'Rug Pull é um golpe onde criadores de projeto abandonam tudo depois de levantar dinheiro, deixando investidores no prejuízo.',
        },
    ]),
};
