/**
 * Artigo: Como Pesquisar um Projeto
 * Slug: como-pesquisar-projeto
 * Posição: 4 de 8 na trilha "Comece por Aqui"
 */

export const comoPesquisarProjetoArticle = {
    slug: 'como-pesquisar-projeto',
    title: 'Como Pesquisar um Projeto: DYOR na Prática',
    excerpt: 'Antes de investir em qualquer criptomoeda, você precisa pesquisar. Este guia ensina como avaliar projetos e identificar red flags.',
    content: `# Como Pesquisar um Projeto: DYOR na Prática

> Este conteúdo é educacional e não é aconselhamento financeiro. A maioria dos projetos cripto falha. Pesquise sempre antes de investir.

"DYOR" significa "Do Your Own Research" — faça sua própria pesquisa. É a regra mais importante do mundo cripto. Este artigo ensina como fazer isso de forma estruturada.

## Por que pesquisar é essencial?

Em 2023, mais de 90% das criptomoedas lançadas falharam ou eram golpes. A única forma de se proteger é pesquisar antes de colocar dinheiro.

Ninguém vai te proteger se você investir em algo ruim. Não existe PROCON cripto. Seu dinheiro, sua responsabilidade.

## O que verificar em qualquer projeto

### Time (Equipe)

Quem está por trás do projeto?

**Bom sinal:** equipe com identidade pública, histórico verificável, LinkedIn ativo, participação em eventos.

**Red flag:** equipe anônima sem justificativa, fotos de banco de imagens, perfis sociais recém-criados.

**Onde verificar:** LinkedIn, Twitter, site oficial, GitHub.

### Problema e Solução

O projeto resolve um problema real?

**Bom sinal:** problema claro que afeta muitas pessoas, solução inovadora ou significativamente melhor que alternativas.

**Red flag:** descrição vaga, promessas grandiosas sem detalhes técnicos, "vamos revolucionar tudo".

### Whitepaper

O documento técnico do projeto é sólido?

**Bom sinal:** whitepaper detalhado, explicação técnica clara, roadmap realista.

**Red flag:** whitepaper de poucas páginas, cópia de outros projetos, foco apenas em preço.

### Tokenomics

Como os tokens são distribuídos?

**Bom sinal:** distribuição equilibrada, vesting (tokens da equipe bloqueados por tempo), supply total definido.

**Red flag:** equipe com mais de 20% dos tokens sem vesting, supply infinito, mecânicas confusas.

### Comunidade

O projeto tem comunidade real e ativa?

**Bom sinal:** discussões técnicas, diversidade de membros, moderação saudável.

**Red flag:** só "moon" e emojis de foguete, bots evidentes, críticas censuradas.

## Ferramentas para pesquisa

### CoinMarketCap / CoinGecko

Verificar dados básicos: preço, volume, supply, exchanges, links oficiais.

### Etherscan / BSCScan

Analisar contrato: verificado? Quantos holders? Concentração de tokens?

### Token Sniffer

Detectar honeypots e contratos maliciosos. Dá um score de segurança.

### DefiLlama

Ver TVL (Total Value Locked) de protocolos DeFi. Quanto dinheiro está no projeto.

### Twitter / X

Seguir o projeto e ver o que a comunidade fala. Buscar críticas e problemas reportados.

### GitHub

Verificar atividade de desenvolvimento. Código aberto é bom sinal.

## Red flags que gritam "fuja"

**Retornos garantidos** — cripto é volátil. Ninguém pode garantir lucro.

**Urgência artificial** — "só hoje", "últimas vagas". Projetos bons não precisam disso.

**Equipe anônima sem motivo** — alguns projetos têm razões válidas, mas a maioria é golpe.

**Sem auditoria** — contratos inteligentes devem ser auditados por empresas reconhecidas.

**Top holder com mais de 50% dos tokens** — risco de rug pull é altíssimo.

**Cópia de outros projetos** — se não trouxer nada novo, provavelmente é golpe.

## Checklist rápido de pesquisa

Antes de investir, confirme:

A equipe é identificável e tem histórico. O projeto resolve um problema real e específico. Whitepaper existe e é detalhado. Tokenomics são justos e transparentes. Comunidade discute o projeto, não só preço. Contrato é verificado e auditado. Não há promessas de retorno garantido.

Se falhar em qualquer item, reconsidere ou não invista.

## Resumo

DYOR não é opcional — é sobrevivência. Verifique equipe, problema, whitepaper, tokenomics e comunidade. Use ferramentas como Token Sniffer e Etherscan. Fuja de red flags óbvias.

## Próximo passo

Agora que você sabe pesquisar projetos, vamos entender como funcionam carteiras e custódia — onde você vai guardar suas criptos.
`,
    type: 'educational',
    category: 'fundamentos',
    level: 'iniciante',
    contentType: 'Tutorial',
    readTime: '12 min',
    warningLevel: 'warning',
    securityTips: JSON.stringify([
        {
            icon: '',
            title: 'DYOR é Obrigatório',
            description: 'Nunca invista sem pesquisar. A maioria dos projetos cripto falha.',
        },
        {
            icon: '',
            title: 'Red Flags Existem por um Motivo',
            description: 'Equipe anônima, retornos garantidos, urgência — são sinais de golpe.',
        },
    ]),
    tags: JSON.stringify(['dyor', 'pesquisa', 'iniciante', 'red-flags', 'tokenomics']),
    published: true,
    projectHighlight: false,
    relatedArticles: JSON.stringify(['seguranca-primeiro', 'golpes-comuns-cripto']),
    quizData: JSON.stringify([
        {
            question: 'O que significa DYOR?',
            options: [
                'Do Your Own Research — faça sua própria pesquisa',
                'Don\'t You Own Risk — não arrisque seu dinheiro',
                'Digital Youth Online Resource',
                'Dataset of Year Over Return'
            ],
            correctAnswer: 0,
            explanation: 'DYOR significa "Do Your Own Research" — a regra mais importante antes de investir em qualquer projeto.'
        },
        {
            question: 'Qual é uma red flag em tokenomics?',
            options: [
                'Equipe com menos de 10% dos tokens',
                'Top holder com mais de 50% dos tokens',
                'Supply total bem definido',
                'Tokens da equipe com vesting de 2 anos'
            ],
            correctAnswer: 1,
            explanation: 'Concentração extrema (>50%) em uma carteira é red flag de possível rug pull.'
        }
    ]),
};
