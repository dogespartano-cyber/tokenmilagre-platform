/**
 * Artigo: Comece pelo Básico (Fundamentos Cripto)
 * Slug: fundamentos-cripto
 * Posição: 1 de 8 na trilha "Comece por Aqui"
 */

export const fundamentosCriptoArticle = {
    slug: 'fundamentos-cripto',
    title: 'Comece pelo Básico: Entendendo Criptomoedas em 10 Minutos',
    excerpt: 'O que são criptomoedas, blockchain e por que isso importa? Este guia explica os conceitos essenciais de forma simples e direta.',
    content: `# Comece pelo Básico

> Este conteúdo é educacional e não é aconselhamento financeiro. Criptomoedas envolvem riscos. Faça sua própria pesquisa.

Se você está aqui, provavelmente já ouviu falar de Bitcoin, Ethereum ou "cripto" — mas talvez não saiba exatamente o que são ou como funcionam. Este artigo vai te dar a base necessária para entender o resto da trilha.

## O que é uma criptomoeda?

Uma criptomoeda é dinheiro digital que funciona sem banco ou governo. Você pode enviar para qualquer pessoa no mundo, a qualquer hora, sem pedir permissão.

Diferente do dinheiro tradicional, criptomoedas são:

**Descentralizadas** — não existe um banco central controlando. A rede é mantida por milhares de computadores ao redor do mundo.

**Transparentes** — todas as transações ficam registradas publicamente. Qualquer pessoa pode verificar.

**Imutáveis** — uma vez confirmada, uma transação não pode ser cancelada ou alterada.

## O que é blockchain?

Blockchain é a tecnologia por trás das criptomoedas. Pense nela como um livro de registros público e incorruptível.

Imagina um caderno onde cada página tem um resumo criptográfico da página anterior. Se você alterar qualquer informação em uma página antiga, todas as páginas seguintes ficam inválidas. Isso torna praticamente impossível fraudar o sistema.

Cada "página" é chamada de bloco. Cada bloco contém transações. Os blocos são conectados em sequência — daí o nome "blockchain" (cadeia de blocos).

## Bitcoin: a primeira criptomoeda

O Bitcoin foi criado em 2009 por uma pessoa (ou grupo) sob o pseudônimo Satoshi Nakamoto. É a primeira e mais conhecida criptomoeda.

Características principais do Bitcoin:

**Oferta limitada** — só existirão 21 milhões de bitcoins. Nunca mais que isso. Isso cria escassez digital.

**Mineração** — novos bitcoins são criados por computadores que resolvem problemas matemáticos complexos. Isso também protege a rede.

**Reserva de valor** — muitos veem o Bitcoin como "ouro digital" — uma forma de proteger patrimônio a longo prazo.

## Altcoins: outras criptomoedas

Qualquer criptomoeda que não seja Bitcoin é chamada de "altcoin" (moeda alternativa). Existem milhares delas.

**Ethereum (ETH)** — a segunda maior criptomoeda. Permite "contratos inteligentes" — programas que rodam automaticamente na blockchain.

**Stablecoins (USDT, USDC)** — criptomoedas atreladas ao dólar. 1 USDT vale sempre aproximadamente 1 dólar. Úteis para guardar valor sem volatilidade.

**Memecoins** — criptomoedas baseadas em memes ou cultura da internet. Altamente especulativas e arriscadas.

## Carteiras: onde você guarda cripto

Você não guarda criptomoedas em uma carteira física. Uma "carteira" (wallet) é um software ou dispositivo que guarda suas chaves privadas.

**Chave pública** — como seu número de conta. Você compartilha para receber dinheiro.

**Chave privada** — como sua senha do banco. Quem tem ela controla seu dinheiro. NUNCA compartilhe.

Tipos de carteiras:

**Hot wallet** — conectada à internet. Mais conveniente, menos segura. Exemplos: MetaMask, Trust Wallet.

**Cold wallet** — desconectada da internet. Mais segura, menos conveniente. Exemplos: Ledger, Trezor.

## Por que isso importa?

Criptomoedas representam uma mudança na forma como pensamos sobre dinheiro:

**Você é seu próprio banco** — ninguém pode congelar sua conta ou impedir transações.

**Acesso global** — qualquer pessoa com internet pode participar, sem precisar de documentos ou aprovação.

**Programável** — contratos inteligentes permitem criar aplicações financeiras sem intermediários.

Mas com grande poder vem grande responsabilidade: se você perder suas chaves ou cair em golpe, não tem "suporte" para ligar.

## Resumo

Criptomoeda é dinheiro digital descentralizado. Blockchain é a tecnologia que registra transações de forma segura. Bitcoin foi a primeira cripto; altcoins são todas as outras. Sua chave privada é tudo — proteja-a. Você é responsável pela segurança dos seus fundos.

## Próximo passo

Agora que você entende os conceitos básicos, vamos aprender sobre segurança — o assunto mais importante antes de fazer qualquer coisa com cripto.
`,
    type: 'educational',
    category: 'fundamentos',
    level: 'iniciante',
    contentType: 'Artigo',
    readTime: '10 min',
    warningLevel: 'info',
    securityTips: JSON.stringify([
        {
            icon: '🔑',
            title: 'Chave Privada é Sagrada',
            description: 'Quem tem sua chave privada controla seus fundos. Nunca compartilhe.',
        },
        {
            icon: '',
            title: 'Entenda Antes de Investir',
            description: 'Conhecimento é sua primeira linha de defesa contra perdas.',
        },
    ]),
    tags: JSON.stringify(['iniciante', 'fundamentos', 'bitcoin', 'blockchain', 'carteiras']),
    published: true,
    projectHighlight: true,
    relatedArticles: JSON.stringify(['seguranca-primeiro', 'glossario-essencial']),
    quizData: JSON.stringify([
        {
            question: 'O que significa dizer que o Bitcoin é descentralizado?',
            options: [
                'É controlado por um banco central',
                'Funciona sem controle de governos ou bancos',
                'Só pode ser usado em um país',
                'Precisa de aprovação para transações'
            ],
            correctAnswer: 1,
            explanation: 'Descentralizado significa que a rede é mantida por milhares de computadores ao redor do mundo, sem controle central.'
        },
        {
            question: 'Qual a diferença entre hot wallet e cold wallet?',
            options: [
                'Hot wallet é mais cara',
                'Cold wallet está sempre online',
                'Hot wallet está conectada à internet, cold wallet não',
                'Não há diferença'
            ],
            correctAnswer: 2,
            explanation: 'Hot wallets estão conectadas à internet (mais convenientes), cold wallets ficam offline (mais seguras).'
        },
        {
            question: 'O que são stablecoins?',
            options: [
                'Criptomoedas muito voláteis',
                'Criptomoedas atreladas a moedas fiduciárias como o dólar',
                'A primeira criptomoeda criada',
                'Tokens de jogos'
            ],
            correctAnswer: 1,
            explanation: 'Stablecoins como USDT e USDC mantêm seu valor próximo de $1, sendo úteis para proteger contra volatilidade.'
        }
    ]),
};
