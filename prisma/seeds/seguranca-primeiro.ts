/**
 * Artigo: Segurança Primeiro (v2 - Visual Limpo)
 * Slug: seguranca-primeiro
 * 
 * Versão simplificada: sem tabelas markdown, menos ícones, texto mais corrido
 */

export const segurancaPrimeiroArticle = {
    slug: 'seguranca-primeiro',
    title: 'Segurança Primeiro: O Que Você Precisa Saber Antes de Qualquer Ação em Cripto',
    excerpt: 'Antes de comprar, vender ou armazenar criptomoedas, você precisa entender segurança. Este guia protege você dos erros mais comuns que causam perdas irreversíveis.',
    content: `# Segurança Primeiro

> Este conteúdo é educacional e não é aconselhamento financeiro. Criptomoedas envolvem riscos. Faça sua própria pesquisa.

Este é um artigo para iniciantes absolutos. Você não precisa saber nada sobre criptomoedas para começar aqui.

## O que você vai aprender

Neste artigo, você vai entender o que é seed phrase e por que ela é sua vida em cripto, os hábitos que protegem a maioria dos iniciantes, como reconhecer golpes antes de cair neles, e o que fazer se algo der errado.

## Por que segurança vem primeiro?

No mundo cripto, você é seu próprio banco. Não existe gerente, não existe 0800, não existe "cancelar transação". Se você perder sua seed phrase ou cair em um golpe, seus fundos estão perdidos para sempre.

A boa notícia: a maioria dos problemas pode ser evitada com conhecimento básico.

## Seed Phrase: sua chave mestra

A seed phrase (frase semente) é uma sequência de 12 a 24 palavras que funciona como a "senha mestra" da sua carteira. Com ela, você pode recuperar seus fundos em qualquer dispositivo.

Exemplo: "apple banana cherry dog elephant fish grape honey ice jungle kite lemon"

**O que fazer:** escreva em papel, guarde em cofre ou local seguro, faça cópias em locais diferentes.

**O que nunca fazer:** tirar foto, salvar em nuvem (Google Drive, iCloud), enviar por mensagem, compartilhar com qualquer pessoa — nem "suporte".

Quem tem sua seed phrase, tem seus fundos. Se alguém descobrir, pode roubar tudo. Se você perder e também perder o dispositivo, perdeu tudo.

## Os 3 hábitos que protegem você

### Desconfie de mensagens privadas

Se alguém te chama no privado oferecendo "ajuda" ou "oportunidade", trate como golpe até prova em contrário. Nenhuma empresa de cripto entra em contato por DM. Suporte real nunca pede seed phrase. "Lucro garantido" é golpe garantido.

### Verifique URLs antes de clicar

Golpistas criam sites idênticos aos originais com URLs levemente diferentes. Por exemplo: "binancce.com" (dois "c") ou "coinbase-support.xyz". Sempre digite a URL manualmente ou use favoritos salvos.

### Nunca tenha pressa

A urgência é a arma favorita dos golpistas. Frases como "Sua conta será bloqueada em 24 horas!" ou "Oportunidade exclusiva que acaba hoje!" são sinais de alerta. Projetos legítimos não desaparecem em horas.

## Hot vs Cold Wallet

**Hot Wallet** é conectada à internet, conveniente para uso diário, mas mais vulnerável. Exemplos: MetaMask, Trust Wallet. Use para transações do dia a dia, guardando no máximo 10% dos fundos.

**Cold Wallet** nunca está conectada à internet, usada para armazenamento de longo prazo, muito mais segura. Exemplos: Ledger, Trezor. Use para poupança, guardando 90% ou mais dos fundos.

## Autenticação de Dois Fatores (2FA)

É uma camada extra de proteção: além da senha, você precisa de um código do celular.

Evite SMS — é vulnerável a ataques de SIM Swap. Prefira apps como Google Authenticator ou Authy. Para valores altos, hardware keys como YubiKey são ideais.

Para configurar: baixe Google Authenticator ou Authy, ative 2FA nas configurações de segurança da exchange ou wallet, escaneie o QR code com o app, e guarde o código de backup em papel junto com sua seed phrase.

## Erros comuns que você deve evitar

**Guardar seed phrase no celular.** Se perder, quebrar ou for hackeado, perdeu tudo. Solução: papel em local seguro.

**Usar a mesma senha em tudo.** Um vazamento compromete todas suas contas. Solução: use gerenciador de senhas como Bitwarden ou 1Password.

**Não verificar endereços de carteira.** Malware pode trocar o endereço na hora de colar. Sempre confira os primeiros 6 e últimos 4 caracteres.

**Responder DMs de "suporte".** São golpes em 100% dos casos. Ignore e bloqueie. Use apenas canais oficiais.

**Investir sem entender.** Você não sabe o que está em risco. Termine este guia antes de qualquer ação.

## Checklist prático

Antes de fazer qualquer coisa em cripto, confirme: minha seed phrase está escrita em papel e guardada em segurança; tenho backup da seed em local diferente; 2FA está ativado com app (não SMS); verifiquei a URL antes de acessar qualquer site; não respondi nenhuma DM de "suporte"; não tenho pressa para tomar decisões; entendo que posso perder o que estou investindo.

## Quando parar e pedir ajuda

Procure ajuda em canais oficiais se: você suspeita de golpe (clicou em algo suspeito ou compartilhou informações); fundos foram movimentados sem você autorizar; esqueceu senha ou perdeu seed phrase; tem dúvida sobre segurança antes de fazer algo que não entende.

Onde buscar: comunidades oficiais (Discord/Telegram do projeto), documentação oficial da carteira ou exchange, fóruns como r/CryptoCurrency no Reddit.

## Resumo

Seed phrase é sua vida — guarde em papel, nunca compartilhe. Desconfie de DMs — suporte real nunca pede suas chaves. Verifique URLs — golpistas copiam sites. Não tenha pressa — urgência é tática de golpe. Use 2FA de app — não SMS. Hot wallet para dia a dia, cold wallet para poupança.

## Próximo passo

Continue aprendendo sobre golpes comuns em cripto para saber identificá-los e se proteger.

## Fontes consultadas

Este artigo foi baseado em padrões técnicos e relatórios de segurança, incluindo o padrão BIP-39 para seed phrases, alertas do FBI sobre ataques de SIM Swap, o whitepaper original do Bitcoin sobre irreversibilidade de transações, relatório Chainalysis 2023 sobre crimes em cripto, e documentação da Ledger sobre hardware wallets.
`,
    type: 'educational',
    category: 'seguranca',
    level: 'iniciante',
    contentType: 'Artigo',
    readTime: '8 min',
    warningLevel: 'info',
    securityTips: JSON.stringify([
        {
            icon: '🔐',
            title: 'Seed Phrase em Papel',
            description: 'Nunca armazene digitalmente. Papel em cofre é mais seguro que nuvem.',
        },
        {
            icon: '🚫',
            title: 'Ignore DMs de Suporte',
            description: 'Empresas legítimas nunca pedem suas chaves por mensagem.',
        },
    ]),
    tags: JSON.stringify(['segurança', 'iniciante', 'seed-phrase', 'wallet', '2fa']),
    published: true,
    projectHighlight: true,
    relatedArticles: JSON.stringify(['golpes-comuns-cripto', 'carteiras-e-custodia']),
    quizData: JSON.stringify([
        {
            question: 'Onde você deve guardar sua seed phrase?',
            options: [
                'Em uma foto no celular',
                'No Google Drive',
                'Em papel, guardado em local seguro',
                'Em uma mensagem para você mesmo'
            ],
            correctAnswer: 2,
            explanation: 'Seed phrases devem ser escritas em papel e guardadas em locais seguros. Armazenamento digital é vulnerável a hackers.'
        },
        {
            question: 'Alguém no Telegram diz ser do suporte e pede sua seed phrase. O que você faz?',
            options: [
                'Envia a seed phrase',
                'Ignora e bloqueia imediatamente',
                'Pede mais provas',
                'Envia apenas parte das palavras'
            ],
            correctAnswer: 1,
            explanation: 'Nenhum suporte legítimo pede seed phrase. Isso é golpe. Ignore e bloqueie.'
        },
        {
            question: 'Qual tipo de 2FA é mais seguro?',
            options: [
                'SMS',
                'Email',
                'App authenticator (Google Authenticator)',
                'Nenhum'
            ],
            correctAnswer: 2,
            explanation: 'Apps authenticator geram códigos localmente, enquanto SMS pode ser interceptado via SIM Swap.'
        }
    ]),
};

export const segurancaPrimeiroCitations = [
    {
        url: 'https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki',
        title: 'BIP-39: Mnemonic code for generating deterministic keys',
        domain: 'github.com',
        order: 1,
        verified: true,
    },
    {
        url: 'https://www.ic3.gov/Media/Y2022/PSA220208',
        title: 'FBI IC3: SIM Swapping Attacks',
        domain: 'ic3.gov',
        order: 2,
        verified: true,
    },
    {
        url: 'https://bitcoin.org/bitcoin.pdf',
        title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
        domain: 'bitcoin.org',
        order: 3,
        verified: true,
    },
    {
        url: 'https://www.chainalysis.com/blog/2023-crypto-crime-report-introduction/',
        title: 'Chainalysis 2023 Crypto Crime Report',
        domain: 'chainalysis.com',
        order: 4,
        verified: true,
    },
    {
        url: 'https://www.ledger.com/academy/crypto/what-are-hardware-wallets',
        title: 'What are Hardware Wallets? | Ledger Academy',
        domain: 'ledger.com',
        order: 5,
        verified: true,
    },
];
