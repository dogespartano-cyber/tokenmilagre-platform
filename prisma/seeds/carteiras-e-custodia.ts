/**
 * Artigo: Carteiras e Custódia
 * Slug: carteiras-e-custodia
 * Posição: 5 de 8 na trilha "Comece por Aqui"
 */

export const carteirasECustodiaArticle = {
    slug: 'carteiras-e-custodia',
    title: 'Carteiras e Custódia: Onde Guardar Suas Criptomoedas',
    excerpt: 'Hot wallet, cold wallet, custódia... Entenda as diferenças e escolha a melhor forma de proteger seus fundos.',
    content: `# Carteiras e Custódia

> Este conteúdo é educacional. A escolha de carteira depende do seu perfil e valores envolvidos.

Uma das primeiras decisões que você precisa tomar em cripto é: onde guardar seus fundos? Este artigo explica suas opções e quando usar cada uma.

## O que é uma carteira de criptomoedas?

Uma carteira (wallet) não guarda moedas — ela guarda suas chaves. As criptomoedas estão sempre na blockchain. Sua carteira apenas permite que você as movimente.

Componentes de uma carteira:

**Chave pública** — seu endereço. Você compartilha para receber fundos.

**Chave privada** — seu acesso. Quem tem ela controla os fundos. NUNCA compartilhe.

**Seed phrase** — 12 a 24 palavras que geram todas as suas chaves. Backup mestre.

## Tipos de carteiras

### Hot Wallet (Carteira Quente)

Conectada à internet. Mais conveniente para uso diário, mas mais vulnerável a ataques.

**Exemplos:** MetaMask, Trust Wallet, Phantom.

**Quando usar:** pequenas quantias, transações do dia a dia, interação com DeFi e dApps.

**Segurança:** média. Vulnerável se seu dispositivo for hackeado.

### Cold Wallet (Carteira Fria)

Desconectada da internet. Suas chaves nunca tocam a rede.

**Exemplos:** Ledger Nano, Trezor, KeepKey.

**Quando usar:** grandes quantias, holdings de longo prazo, "poupança".

**Segurança:** alta. Mesmo se seu computador for hackeado, seus fundos estão seguros.

### Paper Wallet (Carteira de Papel)

Chaves impressas ou escritas em papel físico.

**Quando usar:** backup extremo, armazenamento de longo prazo sem dispositivos.

**Segurança:** alta contra ataques digitais, mas vulnerável a danos físicos (fogo, água).

## Custódia: quem controla as chaves?

### Autocustódia (Self-Custody)

Você controla suas chaves. "Not your keys, not your coins."

**Vantagens:** controle total, resistência a censura, independência de terceiros.

**Desvantagens:** responsabilidade total. Se perder as chaves, perdeu os fundos.

### Custódia por Terceiros

Uma exchange ou serviço guarda suas chaves.

**Exemplos:** Binance, Coinbase, Mercado Bitcoin.

**Vantagens:** mais fácil para iniciantes, recuperação de conta possível.

**Desvantagens:** você não controla seus fundos. Se a exchange quebrar ou for hackeada, você pode perder tudo.

## Estratégia recomendada

Para a maioria das pessoas, a estratégia é simples:

**Hot wallet** — 10% ou menos dos seus fundos. Para uso diário e experimentos.

**Cold wallet** — 90% ou mais. Para guardar a longo prazo.

**Exchange** — apenas o necessário para trading. Retire para sua carteira após compras.

## Como escolher uma hot wallet

**MetaMask** — mais popular para Ethereum e compatíveis. Extensão de navegador e app mobile.

**Trust Wallet** — multi-chain, interface simples. Boa para iniciantes.

**Phantom** — especializada em Solana. Rápida e bem desenhada.

**Rabby** — alternativa ao MetaMask com mais segurança. Mostra alertas de contratos suspeitos.

## Como escolher uma cold wallet

**Ledger Nano X** — mais popular. Bluetooth, suporta muitas criptos. Preço: ~€150.

**Ledger Nano S Plus** — mais barata. Sem Bluetooth. Preço: ~€80.

**Trezor Model T** — código aberto. Tela touch. Preço: ~€220.

**Trezor One** — entrada mais barata. Sem touch. Preço: ~€70.

## Configurando sua primeira wallet

### Para hot wallet (MetaMask)

Baixe apenas de sites oficiais. Crie nova carteira. Anote as 12 palavras em PAPEL. Nunca tire foto ou salve digitalmente. Guarde em local seguro e faça backup.

### Para cold wallet

Compre apenas de fabricantes oficiais. Nunca compre de terceiros (pode vir comprometida). Siga instruções do dispositivo. Anote a seed phrase em papel. Guarde em local seguro.

## Erros comuns

**Guardar seed phrase no celular** — se o celular for hackeado, você perde tudo.

**Seed phrase em foto ou nuvem** — hackers buscam exatamente isso.

**Comprar cold wallet usada** — pode estar comprometida.

**Deixar tudo na exchange** — "not your keys, not your coins".

**Usar mesma senha para tudo** — um vazamento compromete todas as contas.

## Resumo

Hot wallet para dia a dia, cold wallet para poupança. Autocustódia significa responsabilidade total. Seed phrase em papel, nunca digital. Compre hardware wallets apenas do fabricante. Não deixe grandes valores em exchanges.

## Próximo passo

Agora que você sabe onde guardar, vamos entender como funcionam as taxas e redes — para não pagar mais do que deveria em transações.
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
            title: 'Seed Phrase Só em Papel',
            description: 'Nunca tire foto ou salve digitalmente. Papel em local seguro.',
        },
        {
            icon: '',
            title: 'Cold Wallet para Valores Grandes',
            description: 'Mantenha 90%+ dos seus fundos em cold storage.',
        },
    ]),
    tags: JSON.stringify(['carteiras', 'wallet', 'custódia', 'ledger', 'metamask', 'seed-phrase']),
    published: true,
    projectHighlight: false,
    relatedArticles: JSON.stringify(['seguranca-primeiro', 'taxas-gas-e-redes']),
    quizData: JSON.stringify([
        {
            question: 'Qual a principal diferença entre hot e cold wallet?',
            options: [
                'Hot wallet é mais cara',
                'Cold wallet suporta mais criptomoedas',
                'Hot wallet está conectada à internet, cold wallet não',
                'Cold wallet só funciona com Bitcoin'
            ],
            correctAnswer: 2,
            explanation: 'Hot wallets estão online (convenientes mas vulneráveis), cold wallets ficam offline (mais seguras para grandes valores).'
        },
        {
            question: 'O que significa autocustódia?',
            options: [
                'A exchange guarda suas chaves',
                'Você controla suas próprias chaves',
                'Um amigo guarda sua seed phrase',
                'O governo protege seus fundos'
            ],
            correctAnswer: 1,
            explanation: 'Autocustódia significa que você é o único detentor das suas chaves privadas — e responsável por protegê-las.'
        }
    ]),
};
