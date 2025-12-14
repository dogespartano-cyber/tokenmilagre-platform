/**
 * Artigo: Golpes Comuns em Cripto
 * Slug: golpes-comuns-cripto
 * Posição: 7 de 8 na trilha "Comece por Aqui"
 */

export const golpesComunsCriptoArticle = {
    slug: 'golpes-comuns-cripto',
    title: 'Golpes Comuns em Cripto: Como Identificar e Se Proteger',
    excerpt: 'Phishing, rug pull, fake airdrop... Conheça os golpes mais comuns e aprenda a identificá-los antes de perder dinheiro.',
    content: `# Golpes Comuns em Cripto

> Este conteúdo é educacional. Em 2023, mais de $4 bilhões foram perdidos em golpes cripto. Este guia pode salvar seus fundos.

O mundo cripto atrai golpistas porque transações são irreversíveis e não há "suporte" para te ajudar. A melhor defesa é conhecer os golpes antes de cair neles.

## 1. Phishing

### Como funciona

Golpistas criam sites, emails ou mensagens falsas que imitam serviços legítimos para roubar suas credenciais.

**Exemplo real:** site "binancce.com" (com dois "c") idêntico ao original. Vítima digita login e senha, golpista acessa a conta real.

### Como identificar

URL diferente do oficial (mesmo que pareça ser). Erros de português ou formatação. Urgência artificial ("sua conta será bloqueada"). Pedido de informações sensíveis.

### Como se proteger

Acesse sites digitando URL manualmente. Marque sites oficiais nos favoritos. Verifique certificado SSL (cadeado). Nunca clique em links de emails ou mensagens.

## 2. Rug Pull

### Como funciona

Desenvolvedores criam um projeto, atraem investidores, e depois desaparecem com o dinheiro.

**Exemplo real:** Squid Game Token (2021) — subiu 23.000.000%, desenvolvedores bloquearam vendas e fugiram com milhões.

### Como identificar

Equipe anônima sem justificativa. Liquidez não bloqueada. Impossível vender (honeypot). Tokenomics concentrado em poucos wallets.

### Como se proteger

Use Token Sniffer para verificar contratos. Confirme se liquidez está bloqueada. Verifique distribuição de tokens no Etherscan. Desconfie de projetos muito novos.

## 3. Fake Airdrop

### Como funciona

Você recebe tokens "de graça" na carteira. Ao tentar vendê-los, seu wallet é drenado.

**Como funciona tecnicamente:** o token malicioso pede aprovação ilimitada do seu wallet, e depois rouba seus fundos reais.

### Como identificar

Tokens que aparecem sem você pedir. Valor suspeitamente alto. Site do projeto não existe ou é recém-criado.

### Como se proteger

Ignore tokens que você não reconhece. Nunca tente vender tokens desconhecidos. Use revoke.cash para verificar aprovações.

## 4. Golpe de Suporte Falso

### Como funciona

Você posta uma dúvida em rede social. Alguém finge ser "suporte oficial" e pede suas informações.

**Exemplo real:** usuário posta no Twitter que MetaMask está com problema. Conta @MetaMask_Support (fake) envia DM pedindo seed phrase.

### Como identificar

Suporte real NUNCA entra em contato por DM. Pedem seed phrase ou chave privada. Conta recém-criada ou com poucos seguidores. Urgência e pressão.

### Como se proteger

Ignore todas as DMs de "suporte". Use apenas canais oficiais (sites, emails verificados). Nenhum suporte legítimo pede seed phrase.

## 5. Pump and Dump

### Como funciona

Grupo organizado compra um token barato, cria hype falso para atrair compradores, e vende tudo quando o preço sobe.

**Como funciona:** você compra no topo do hype, o grupo vende, preço despenca, você perde.

### Como identificar

Shilling agressivo em redes sociais. Promessas de "moon" garantido. Volume súbito sem notícia real. Grupos de Telegram ou Discord coordenando compras.

### Como se proteger

Desconfie de hype repentino. Verifique quem está promovendo. Pesquise o projeto antes (DYOR). Não entre por FOMO.

## 6. Golpes de Romance/Social

### Como funciona

Golpista desenvolve "relacionamento" online (amizade ou romance) e depois pede investimento em "oportunidade".

**Exemplo real:** "pig butchering" — vítima é "engordada" com atenção por semanas antes de ser convencida a "investir".

### Como identificar

Pessoa muito interessada em você sem motivo. Conversa eventualmente vai para investimentos. Plataformas de trading que você nunca ouviu falar. Lucros falsos mostrados em apps.

### Como se proteger

Desconfie de estranhos oferecendo dicas de investimento. Nunca envie dinheiro para pessoas que conheceu online. Plataformas desconhecidas são golpe.

## 7. Malware e Clipboard Hijacker

### Como funciona

Malware no seu computador troca endereços quando você copia/cola.

**Exemplo:** você copia seu endereço para receber, malware troca pelo endereço do golpista. Você envia para o hacker sem perceber.

### Como se proteger

Sempre verifique os primeiros 6 e últimos 4 caracteres do endereço. Use hardware wallet. Mantenha antivírus atualizado. Não baixe softwares de fontes não oficiais.

## Checklist: Estou Sendo Enganado?

Se você responder SIM a qualquer pergunta, PARE:

Prometem retorno garantido? Pedem minha seed phrase? Recebi DM não solicitada? URL parece suspeita? Urgência para decidir agora? Plataforma que nunca ouvi falar?

## O que fazer se cair em golpe

**Imediatamente:** troque todas as senhas; revogue aprovações (revoke.cash); mova fundos restantes para novo wallet; não interaja mais com o golpista.

**Depois:** denuncie nas plataformas; registre B.O. se for grande valor; alerte a comunidade para proteger outros.

## Resumo

Phishing: verifique URLs sempre. Rug pull: pesquise liquidez e equipe. Fake airdrop: ignore tokens desconhecidos. Suporte falso: DM pedindo seed é golpe. Pump and dump: desconfie de hype repentino. Romance: investimento + estranho online = golpe.

## Próximo passo

Parabéns! Você completou quase toda a trilha. O último artigo mostra os próximos passos no seu aprendizado cripto.
`,
    type: 'educational',
    category: 'seguranca',
    level: 'iniciante',
    contentType: 'Artigo',
    readTime: '15 min',
    warningLevel: 'critical',
    securityTips: JSON.stringify([
        {
            icon: '',
            title: 'DM de Suporte = Golpe',
            description: 'Nenhuma empresa legítima entra em contato por mensagem direta.',
        },
        {
            icon: '',
            title: 'Verifique Antes de Clicar',
            description: 'URLs falsas são quase idênticas às reais. Olhe com atenção.',
        },
    ]),
    tags: JSON.stringify(['golpes', 'scam', 'phishing', 'rug-pull', 'segurança']),
    published: true,
    projectHighlight: true,
    relatedArticles: JSON.stringify(['seguranca-primeiro', 'como-pesquisar-projeto']),
    quizData: JSON.stringify([
        {
            question: 'O que é um rug pull?',
            options: [
                'Quando o preço de uma cripto sobe muito',
                'Quando desenvolvedores abandonam projeto e fogem com dinheiro',
                'Quando você esquece sua seed phrase',
                'Quando taxas de gas estão altas'
            ],
            correctAnswer: 1,
            explanation: 'Rug pull é quando desenvolvedores atraem investidores e depois desaparecem com os fundos.'
        },
        {
            question: 'Suporte oficial de empresas cripto costuma:',
            options: [
                'Enviar DM pedindo verificação de conta',
                'Pedir sua seed phrase para resolver problemas',
                'Nunca pedir informações sensíveis por mensagem',
                'Ligar para seu telefone'
            ],
            correctAnswer: 2,
            explanation: 'Suporte legítimo NUNCA pede seed phrase ou entra em contato por DM. Qualquer contato assim é golpe.'
        }
    ]),
};
