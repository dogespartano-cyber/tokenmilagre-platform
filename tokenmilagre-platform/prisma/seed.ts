import { PrismaClient, Sentiment } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { additionalResources } from './additional-resources';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Criar usuário ADMIN
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tokenmilagre.xyz' },
    update: {},
    create: {
      email: 'admin@tokenmilagre.xyz',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin criado:', admin.email);

  // Criar usuário EDITOR
  const editorPassword = await bcrypt.hash('editor123', 10);

  const editor = await prisma.user.upsert({
    where: { email: 'editor@tokenmilagre.xyz' },
    update: {},
    create: {
      email: 'editor@tokenmilagre.xyz',
      password: editorPassword,
      name: 'Editor',
      role: 'EDITOR'
    }
  });

  console.log('✅ Editor criado:', editor.email);

  console.log('\n📝 Credenciais de acesso:');
  console.log('Admin:');
  console.log('  Email: admin@tokenmilagre.xyz');
  console.log('  Senha: admin123');
  console.log('\nEditor:');
  console.log('  Email: editor@tokenmilagre.xyz');
  console.log('  Senha: editor123');

  // Seed Articles
  console.log('\n📰 Seeding articles...');
  await seedArticles(admin.id);

  // Seed Resources
  console.log('\n🔧 Seeding resources...');
  await seedResources();
}

async function seedArticles(authorId: string) {
  const newsArticles = [
    {
      title: 'Bitcoin atinge novo recorde histórico acima de $100k',
      slug: 'bitcoin-atinge-novo-recorde-historico',
      content: `# Bitcoin atinge novo recorde histórico acima de $100k

O Bitcoin (BTC) alcançou um marco histórico nesta semana, ultrapassando a barreira dos $100.000 pela primeira vez. Este movimento representa um crescimento de mais de 150% em relação ao início do ano.

## Fatores que impulsionaram a alta

Diversos fatores contribuíram para esta valorização expressiva:

- **Aprovação de ETFs de Bitcoin spot** pela SEC nos Estados Unidos
- **Adoção institucional crescente** com empresas adicionando BTC ao balanço
- **Halvening do Bitcoin** reduzindo a emissão de novas moedas
- **Instabilidade econômica global** levando investidores a buscar ativos alternativos

## Análise técnica

Os analistas apontam que o próximo nível de resistência está em $120.000, com suporte forte em $95.000. O volume de negociação aumentou 300% nas últimas 24 horas.

## Perspectivas para o futuro

Especialistas permanecem otimistas, com previsões variando de $150.000 a $200.000 para os próximos 12 meses.`,
      excerpt: 'Bitcoin ultrapassa $100k pela primeira vez na história, impulsionado por aprovação de ETFs e adoção institucional crescente.',
      type: 'news',
      category: 'mercado',
      tags: JSON.stringify(['Bitcoin', 'BTC', 'Recorde', 'Mercado', 'Análise']),
      published: true,
      sentiment: Sentiment.positive,
      authorId
    },
    {
      title: 'Ethereum 2.0: Nova atualização promete reduzir taxas em 90%',
      slug: 'ethereum-2-0-nova-atualizacao-reduz-taxas',
      content: `# Ethereum 2.0: Nova atualização promete reduzir taxas em 90%

A rede Ethereum está prestes a implementar sua mais significativa atualização, prometendo reduzir drasticamente as taxas de transação e aumentar a escalabilidade.

## Principais melhorias

- Redução de taxas em até 90%
- Aumento da velocidade de transações
- Maior eficiência energética
- Melhor experiência para usuários de DeFi

## Impacto no mercado

Esta atualização pode ser um divisor de águas para a adoção em massa de aplicações descentralizadas.`,
      excerpt: 'Ethereum 2.0 promete revolucionar a rede com redução de 90% nas taxas e maior escalabilidade.',
      type: 'news',
      category: 'tecnologia',
      tags: JSON.stringify(['Ethereum', 'ETH', 'Ethereum 2.0', 'DeFi', 'Escalabilidade']),
      published: true,
      sentiment: Sentiment.positive,
      authorId
    },
    {
      title: 'Regulamentação cripto: Novos marcos legais em discussão',
      slug: 'regulamentacao-cripto-novos-marcos-legais',
      content: `# Regulamentação cripto: Novos marcos legais em discussão

Governos ao redor do mundo estão acelerando discussões sobre regulamentação do mercado de criptomoedas.

## Brasil avança na regulamentação

O Banco Central e a CVM estão trabalhando em conjunto para criar um framework regulatório claro e equilibrado.

## Impacto para investidores

A regulamentação pode trazer mais segurança jurídica, mas também novas obrigações de compliance.`,
      excerpt: 'Governos aceleram discussões sobre regulamentação cripto, buscando equilíbrio entre inovação e proteção.',
      type: 'news',
      category: 'regulacao',
      tags: JSON.stringify(['Regulação', 'Brasil', 'Legislação', 'Compliance']),
      published: true,
      sentiment: Sentiment.neutral,
      authorId
    },
    {
      title: 'Solana supera Ethereum em transações diárias',
      slug: 'solana-supera-ethereum-transacoes-diarias',
      content: `# Solana supera Ethereum em transações diárias

A blockchain Solana registrou um recorde de 65 milhões de transações em 24 horas, superando Ethereum pela primeira vez.

## O que impulsionou o crescimento

- Baixas taxas de transação (menos de $0.01)
- Velocidade superior (50.000+ TPS)
- Crescimento do ecossistema DeFi e NFT
- Novos protocolos lançados na rede

## Perspectivas

Analistas veem potencial para Solana consolidar-se como alternativa viável ao Ethereum.`,
      excerpt: 'Solana registra recorde de 65 milhões de transações em 24h, superando Ethereum com taxas baixíssimas.',
      type: 'news',
      category: 'mercado',
      tags: JSON.stringify(['Solana', 'SOL', 'Ethereum', 'Blockchain', 'DeFi']),
      published: true,
      sentiment: Sentiment.positive,
      authorId
    }
  ];

  const educationalArticles = [
    {
      title: 'O que é Bitcoin? Guia completo para iniciantes',
      slug: 'o-que-e-bitcoin-guia-completo',
      content: `# O que é Bitcoin? Guia completo para iniciantes

Bitcoin é a primeira e mais conhecida criptomoeda do mundo, criada em 2009 por uma pessoa (ou grupo) sob o pseudônimo Satoshi Nakamoto.

## Como funciona o Bitcoin

O Bitcoin funciona através de uma tecnologia chamada blockchain, que é um livro-razão digital descentralizado.

### Características principais:

1. **Descentralizado**: Não é controlado por nenhum governo ou instituição
2. **Limitado**: Apenas 21 milhões de bitcoins existirão
3. **Transparente**: Todas as transações são públicas
4. **Seguro**: Usa criptografia avançada

## Como comprar Bitcoin

Você pode comprar Bitcoin em exchanges como Binance, Mercado Bitcoin, ou através de P2P.

## Armazenamento seguro

Use carteiras (wallets) para guardar seus bitcoins com segurança. Nunca deixe grandes quantias em exchanges.`,
      excerpt: 'Aprenda o básico sobre Bitcoin: o que é, como funciona e como começar a investir com segurança.',
      type: 'educational',
      category: 'fundamentos',
      level: 'iniciante',
      contentType: 'Guia',
      readTime: '8 min',
      tags: JSON.stringify(['Bitcoin', 'Iniciante', 'Blockchain', 'Criptomoedas']),
      published: true,
      sentiment: Sentiment.neutral,
      authorId
    },
    {
      title: 'Como funciona uma carteira de criptomoedas',
      slug: 'como-funciona-carteira-criptomoedas',
      content: `# Como funciona uma carteira de criptomoedas

Uma carteira de criptomoedas é um software ou hardware que permite armazenar, enviar e receber criptomoedas de forma segura.

## Tipos de carteiras

### 1. Carteiras Hot (Online)
- Conectadas à internet
- Mais convenientes
- Menos seguras

### 2. Carteiras Cold (Offline)
- Não conectadas à internet
- Mais seguras
- Menos convenientes

## Como escolher sua carteira

Considere: segurança, facilidade de uso, criptomoedas suportadas e seu volume de investimento.

## Seed Phrase: Sua chave mestra

A seed phrase (frase de recuperação) é a chave mestra da sua carteira. NUNCA compartilhe com ninguém!`,
      excerpt: 'Entenda como funcionam as carteiras de criptomoedas e como escolher a melhor para você.',
      type: 'educational',
      category: 'seguranca',
      level: 'iniciante',
      contentType: 'Tutorial',
      readTime: '6 min',
      tags: JSON.stringify(['Wallet', 'Segurança', 'Iniciante', 'Tutorial']),
      published: true,
      sentiment: Sentiment.neutral,
      authorId
    },
    {
      title: 'DeFi explicado: O futuro das finanças descentralizadas',
      slug: 'defi-explicado-financas-descentralizadas',
      content: `# DeFi explicado: O futuro das finanças descentralizadas

DeFi (Decentralized Finance) refere-se a serviços financeiros construídos sobre blockchain, sem intermediários.

## Principais protocolos DeFi

### Empréstimos e empréstimos
- Aave
- Compound
- MakerDAO

### Exchanges descentralizadas (DEX)
- Uniswap
- PancakeSwap
- Raydium

## Riscos do DeFi

- Smart contract bugs
- Impermanent loss
- Rug pulls e scams

## Como começar em DeFi

Comece com pequenas quantias, aprenda sobre cada protocolo e sempre faça sua própria pesquisa (DYOR).`,
      excerpt: 'Descubra o mundo das finanças descentralizadas (DeFi) e seus principais protocolos e riscos.',
      type: 'educational',
      category: 'defi',
      level: 'intermediario',
      contentType: 'Guia',
      readTime: '10 min',
      tags: JSON.stringify(['DeFi', 'Intermediário', 'Protocolos', 'Finanças']),
      published: true,
      sentiment: Sentiment.neutral,
      authorId
    },
    {
      title: 'Análise técnica em criptomoedas: Guia avançado',
      slug: 'analise-tecnica-criptomoedas-guia-avancado',
      content: `# Análise técnica em criptomoedas: Guia avançado

A análise técnica é fundamental para traders que buscam identificar padrões e oportunidades no mercado cripto.

## Indicadores essenciais

### 1. Médias Móveis (MA)
- SMA (Simple Moving Average)
- EMA (Exponential Moving Average)

### 2. RSI (Relative Strength Index)
- Identifica condições de sobrecompra/sobrevenda
- Valores acima de 70: sobrecomprado
- Valores abaixo de 30: sobrevendido

### 3. MACD (Moving Average Convergence Divergence)
- Identifica mudanças de momentum
- Crossovers indicam pontos de entrada/saída

## Padrões de candles

- Doji
- Hammer
- Engulfing patterns

## Estratégias de trading

Combine múltiplos indicadores para confirmar sinais e sempre use stop loss.`,
      excerpt: 'Domine a análise técnica com indicadores avançados e estratégias de trading para criptomoedas.',
      type: 'educational',
      category: 'trading',
      level: 'avancado',
      contentType: 'Tutorial',
      readTime: '15 min',
      tags: JSON.stringify(['Trading', 'Análise Técnica', 'Avançado', 'Indicadores']),
      published: true,
      sentiment: Sentiment.neutral,
      authorId
    }
  ];

  // Criar artigos de notícias
  for (const article of newsArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article
    });
  }

  console.log(`✅ ${newsArticles.length} artigos de notícias criados`);

  // Criar artigos educacionais
  for (const article of educationalArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article
    });
  }

  console.log(`✅ ${educationalArticles.length} artigos educacionais criados`);
}

async function seedResources() {
  const resources = [
    // Brave
    {
      slug: 'brave',
      name: 'Brave Browser',
      category: 'browsers',
      verified: true,
      shortDescription: 'Navegador mais indicado para usuários de criptomoedas',
      officialUrl: 'https://brave.com',
      platforms: JSON.stringify(['Web', 'Desktop', 'iOS', 'Android']),
      tags: JSON.stringify(['Carteira Nativa', 'DApps', 'BAT']),
      heroTitle: 'Brave Browser: O Navegador Ideal para Web3',
      heroDescription: 'Navegador com carteira cripto nativa, recompensas em BAT e privacidade avançada para usuários de criptomoedas',
      heroGradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      whyGoodTitle: 'Por que Brave é Excelente para Web3 e Criptomoedas?',
      whyGoodContent: JSON.stringify([
        'Brave possui carteira de criptomoedas nativa integrada, eliminando a necessidade de instalar extensões de terceiros como MetaMask.',
        'O sistema de recompensas Brave Rewards permite ganhar Basic Attention Token (BAT) simplesmente navegando e visualizando anúncios opcionais respeitosos à privacidade.',
        'Conexão direta com aplicações descentralizadas (DApps) sem configurações complexas, tornando o acesso ao ecossistema Web3 muito mais simples.',
        'Bloqueio nativo de rastreadores e anúncios invasivos protege sua privacidade enquanto navega, essencial para quem lida com ativos digitais.',
        'Suporta múltiplas redes blockchain (Ethereum, Solana, Polygon, etc) diretamente na Brave Wallet, sem necessidade de múltiplas extensões.',
      ]),
      features: JSON.stringify([
        {
          icon: '🔐',
          title: 'Brave Wallet Integrada',
          description: 'Carteira não-custodial nativa que suporta Ethereum, Solana, Filecoin e outras blockchains sem precisar de extensões externas',
        },
        {
          icon: '💰',
          title: 'Ganhe BAT Navegando',
          description: 'Sistema Brave Rewards permite ganhar criptomoedas BAT visualizando anúncios opcionais que respeitam sua privacidade',
        },
        {
          icon: '🌐',
          title: 'Acesso Direto a DApps',
          description: 'Conecte-se a aplicações descentralizadas (Uniswap, OpenSea, etc) diretamente do navegador sem configurações complexas',
        },
        {
          icon: '🛡️',
          title: 'Privacidade por Padrão',
          description: 'Bloqueio automático de rastreadores, cookies de terceiros e fingerprinting para proteger sua identidade online',
        },
        {
          icon: '⚡',
          title: 'Performance Superior',
          description: 'Até 3x mais rápido que Chrome ao bloquear anúncios e rastreadores, economizando bateria e dados móveis',
        },
        {
          icon: '🔗',
          title: 'Suporte IPFS Nativo',
          description: 'Acesse sites descentralizados hospedados no IPFS diretamente, sem necessidade de gateways ou extensões',
        },
      ]),
      howToStartTitle: 'Como Começar a Usar o Brave',
      howToStartSteps: JSON.stringify([
        {
          number: 1,
          title: 'Baixe e Instale',
          description: 'Acesse brave.com e baixe o navegador para seu sistema (Windows, Mac, Linux, iOS ou Android). A instalação é rápida e simples.',
        },
        {
          number: 2,
          title: 'Configure Brave Rewards (Opcional)',
          description: 'Nas configurações, ative o Brave Rewards para começar a ganhar BAT. Você pode escolher quantos anúncios por hora deseja ver (0-5).',
        },
        {
          number: 3,
          title: 'Acesse a Brave Wallet',
          description: 'Clique no ícone da carteira no topo direito do navegador. Crie uma nova wallet ou importe uma existente usando sua seed phrase.',
        },
        {
          number: 4,
          title: 'Guarde sua Seed Phrase com Segurança',
          description: 'CRÍTICO: Anote suas 12/24 palavras em papel e guarde em local seguro. Nunca compartilhe com ninguém e nunca armazene digitalmente.',
        },
        {
          number: 5,
          title: 'Comece a Explorar Web3',
          description: 'Visite DApps como Uniswap, Raydium ou OpenSea. O Brave detectará automaticamente e pedirá para conectar sua wallet.',
        },
      ]),
      pros: JSON.stringify([
        'Carteira cripto nativa integrada (não precisa de extensões)',
        'Ganhe BAT tokens gratuitamente navegando',
        'Privacidade e segurança superiores ao Chrome/Edge',
        'Performance mais rápida com bloqueio de anúncios nativo',
        'Suporte a múltiplas blockchains (Ethereum, Solana, Polygon, etc)',
        'Interface familiar baseada em Chromium (compatível com extensões Chrome)',
        'Suporte nativo a IPFS e Web3',
        'Código open-source e auditável',
      ]),
      cons: JSON.stringify([
        'Brave Rewards não está disponível em todos os países',
        'Quantidade de BAT ganho é relativamente pequena',
        'Alguns sites podem não funcionar corretamente com bloqueio agressivo',
        'Curva de aprendizado para quem nunca usou carteiras cripto',
        'Sincronização entre dispositivos usa blockchain (mais complexo)',
      ]),
      faq: JSON.stringify([
        {
          question: 'Brave é totalmente grátis?',
          answer: 'Sim, o Brave é 100% gratuito para download e uso. Você pode até ganhar tokens BAT navegando, sem nenhum custo.',
        },
        {
          question: 'Funciona no celular?',
          answer: 'Sim! Brave está disponível para iOS e Android com as mesmas funcionalidades, incluindo Brave Wallet e bloqueio de anúncios.',
        },
        {
          question: 'Quanto BAT posso ganhar por mês?',
          answer: 'Varia de acordo com sua região e quantidade de anúncios visualizados. Geralmente entre $1-5 USD/mês. O foco não é ganhar muito, mas sim ter uma experiência de navegação privada e rápida.',
        },
        {
          question: 'Posso usar minhas extensões do Chrome?',
          answer: 'Sim! Brave é baseado em Chromium, então a maioria das extensões da Chrome Web Store funciona perfeitamente, incluindo MetaMask, Phantom e outras wallets.',
        },
      ]),
      securityTips: JSON.stringify([
        {
          icon: '🔑',
          title: 'Proteja sua Seed Phrase',
          description: 'Nunca compartilhe suas 12/24 palavras de recuperação. Anote em papel e guarde em local seguro offline. Brave NUNCA pedirá sua seed phrase.',
        },
        {
          icon: '🎯',
          title: 'Verifique URLs de DApps',
          description: 'Antes de conectar sua wallet, sempre verifique se está no site correto. Golpistas criam sites falsos muito parecidos.',
        },
        {
          icon: '🔒',
          title: 'Use Senha Forte',
          description: 'Proteja sua Brave Wallet com senha forte e única. Considere usar um gerenciador de senhas como Bitwarden.',
        },
        {
          icon: '⚠️',
          title: 'Revise Permissões de Sites',
          description: 'Sempre revise o que um DApp está pedindo permissão para fazer. Nunca aprove transações que você não entende.',
        },
        {
          icon: '💼',
          title: 'Considere Múltiplas Wallets',
          description: 'Use uma wallet para DeFi/trading e outra para guardar fundos (cold storage). Não coloque tudo em um único lugar.',
        },
        {
          icon: '🔄',
          title: 'Mantenha Atualizado',
          description: 'Sempre use a versão mais recente do Brave para ter as últimas correções de segurança e recursos.',
        },
      ]),
      showCompatibleWallets: true,
      relatedResources: JSON.stringify(['firefox', 'metamask', 'phantom']),
    },

    // Firefox
    {
      slug: 'firefox',
      name: 'Firefox',
      category: 'browsers',
      verified: true,
      shortDescription: 'Navegador de código aberto focado em privacidade e extensibilidade',
      officialUrl: 'https://www.mozilla.org/firefox',
      platforms: JSON.stringify(['Web', 'Desktop', 'iOS', 'Android']),
      tags: JSON.stringify(['Extensões Web3', 'Privacidade', 'Developers']),
      heroTitle: 'Firefox: Privacidade e Liberdade na Web',
      heroDescription: 'Navegador open-source da Mozilla com foco em privacidade, extensões Web3 e controle total sobre sua experiência online',
      heroGradient: 'linear-gradient(135deg, #FF7139 0%, #E66000 100%)',
      whyGoodTitle: 'Por que Firefox é Excelente para Privacidade e Web3?',
      whyGoodContent: JSON.stringify([
        'Firefox é desenvolvido pela Mozilla, organização sem fins lucrativos que coloca privacidade e liberdade do usuário acima de lucros corporativos.',
        'Código 100% open-source e auditável pela comunidade, garantindo transparência total sobre o que o navegador faz com seus dados.',
        'Compatibilidade completa com extensões Web3 como MetaMask, Phantom e outras wallets, oferecendo acesso total ao ecossistema descentralizado.',
        'Sistema de proteção avançada contra rastreamento que bloqueia cookies de terceiros, fingerprinting e mineradores de criptomoedas sem sua permissão.',
        'Containers Multi-Conta permitem isolar diferentes identidades digitais, essencial para quem gerencia múltiplas wallets e contas DeFi.',
      ]),
      features: JSON.stringify([
        {
          icon: '🛡️',
          title: 'Proteção Avançada Contra Rastreamento',
          description: 'Bloqueia cookies de terceiros, rastreadores sociais, fingerprinting e crypto-miners automaticamente',
        },
        {
          icon: '🔓',
          title: 'Código 100% Open Source',
          description: 'Auditado pela comunidade global, garantindo transparência total e sem backdoors corporativos',
        },
        {
          icon: '🧩',
          title: 'Extensões Web3 Completas',
          description: 'Suporte total para MetaMask, Phantom, Rabby e todas as principais wallets do mercado',
        },
        {
          icon: '🎭',
          title: 'Multi-Account Containers',
          description: 'Isole identidades digitais diferentes em containers separados, ideal para múltiplas wallets',
        },
        {
          icon: '🔐',
          title: 'DNS sobre HTTPS (DoH)',
          description: 'Criptografa consultas DNS para impedir que ISPs rastreiem quais sites você visita',
        },
        {
          icon: '⚡',
          title: 'Sync Criptografado End-to-End',
          description: 'Sincronize dados entre dispositivos com criptografia ponta-a-ponta (Mozilla não pode ler)',
        },
      ]),
      howToStartTitle: 'Como Começar a Usar o Firefox',
      howToStartSteps: JSON.stringify([
        {
          number: 1,
          title: 'Baixe e Instale',
          description: 'Acesse mozilla.org/firefox e baixe para seu sistema (Windows, Mac, Linux, iOS ou Android). A instalação é simples e rápida.',
        },
        {
          number: 2,
          title: 'Configure Proteção de Privacidade',
          description: 'Vá em Configurações > Privacidade e Segurança e escolha "Rigorosa" para máxima proteção contra rastreamento.',
        },
        {
          number: 3,
          title: 'Instale Extensões Web3',
          description: 'Acesse addons.mozilla.org e instale MetaMask, Phantom ou sua wallet preferida da loja oficial de extensões.',
        },
        {
          number: 4,
          title: 'Configure Multi-Account Containers (Opcional)',
          description: 'Instale a extensão "Multi-Account Containers" para isolar diferentes identidades (DeFi, NFTs, uso pessoal).',
        },
        {
          number: 5,
          title: 'Ative DNS sobre HTTPS',
          description: 'Em Configurações > Privacidade, ative "DNS sobre HTTPS" para criptografar suas consultas DNS.',
        },
      ]),
      pros: JSON.stringify([
        'Código 100% open-source e auditável',
        'Desenvolvido por organização sem fins lucrativos (Mozilla)',
        'Proteção superior contra rastreamento e fingerprinting',
        'Suporte completo para extensões Web3',
        'Multi-Account Containers para isolar identidades',
        'DNS sobre HTTPS nativo',
        'Sync criptografado end-to-end',
        'Não vende seus dados para anunciantes',
      ]),
      cons: JSON.stringify([
        'Não tem wallet cripto nativa integrada (precisa de extensões)',
        'Alguns sites otimizados apenas para Chrome podem ter problemas',
        'Performance pode ser ligeiramente inferior ao Chrome/Brave',
        'Marketshare menor significa menos prioridade de desenvolvedores web',
        'Containers podem ser confusos para iniciantes',
      ]),
      faq: JSON.stringify([
        {
          question: 'Firefox é realmente mais privado que Chrome?',
          answer: 'Sim. Firefox não rastreia você por padrão, não vende dados para anunciantes e é desenvolvido por organização sem fins lucrativos. Chrome coleta dados extensivos para o Google.',
        },
        {
          question: 'Posso usar MetaMask e outras wallets no Firefox?',
          answer: 'Sim! Firefox suporta todas as principais extensões de wallets: MetaMask, Phantom, Rabby, Coinbase Wallet, etc.',
        },
        {
          question: 'O que são Multi-Account Containers?',
          answer: 'Recurso exclusivo do Firefox que permite isolar diferentes identidades digitais. Por exemplo: um container para DeFi, outro para NFTs, outro para uso pessoal. Sites em containers diferentes não compartilham cookies ou dados.',
        },
        {
          question: 'Firefox é mais lento que Chrome?',
          answer: 'Não necessariamente. Firefox moderno é muito rápido, mas alguns sites otimizados exclusivamente para Chrome podem ter pequenas diferenças de performance.',
        },
      ]),
      securityTips: JSON.stringify([
        {
          icon: '🔒',
          title: 'Use Proteção "Rigorosa"',
          description: 'Em Configurações > Privacidade, escolha "Rigorosa" para máxima proteção. Se algum site quebrar, você pode liberar individualmente.',
        },
        {
          icon: '🎭',
          title: 'Containers para Wallets Diferentes',
          description: 'Use Multi-Account Containers para separar suas wallets DeFi das wallets de holding. Nunca misture fundos grandes com DApps experimentais.',
        },
        {
          icon: '🔐',
          title: 'Ative DNS sobre HTTPS',
          description: 'Impede que seu ISP veja quais sites você visita. Ative em Configurações > Privacidade > DNS sobre HTTPS.',
        },
        {
          icon: '🧩',
          title: 'Extensões Apenas da Loja Oficial',
          description: 'Instale extensões apenas de addons.mozilla.org. Nunca instale extensões de sites desconhecidos.',
        },
        {
          icon: '🔄',
          title: 'Mantenha Atualizado',
          description: 'Firefox atualiza automaticamente, mas verifique regularmente em Menu > Ajuda > Sobre o Firefox.',
        },
        {
          icon: '⚠️',
          title: 'Revise Permissões de Extensões',
          description: 'Extensões de wallet precisam de permissões amplas. Revise em Menu > Extensões e remova extensões que não usa.',
        },
      ]),
      showCompatibleWallets: true,
      relatedResources: JSON.stringify(['brave', 'metamask', 'phantom']),
    },

    // MetaMask
    {
      slug: 'metamask',
      name: 'MetaMask',
      category: 'wallets',
      verified: true,
      shortDescription: 'Wallet não custodial líder para Ethereum e redes EVM',
      officialUrl: 'https://metamask.io',
      platforms: JSON.stringify(['Web', 'iOS', 'Android', 'Chrome']),
      tags: JSON.stringify(['EVM', 'DeFi', 'NFTs']),
      heroTitle: 'MetaMask: Sua Porta de Entrada para Web3',
      heroDescription: 'Wallet não-custodial mais popular do mundo para Ethereum, Polygon, BSC e todas as redes compatíveis com EVM',
      heroGradient: 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)',
      whyGoodTitle: 'Por que MetaMask é a Wallet Mais Popular?',
      whyGoodContent: JSON.stringify([
        'MetaMask é a wallet não-custodial mais utilizada no mundo, com mais de 30 milhões de usuários ativos mensais e integração nativa em praticamente todos os DApps.',
        'Suporte completo para todas as redes compatíveis com EVM (Ethereum Virtual Machine): Ethereum, Polygon, BNB Smart Chain, Arbitrum, Optimism, Avalanche e centenas de outras.',
        'Você mantém controle total das suas chaves privadas. MetaMask nunca tem acesso aos seus fundos - apenas você possui suas seed phrases.',
        'Interface intuitiva tanto para iniciantes quanto para usuários avançados, com suporte para múltiplas contas, redes customizadas e configurações de gas avançadas.',
        'Disponível como extensão de navegador (Chrome, Firefox, Brave, Edge) e aplicativo móvel (iOS, Android) com sincronização segura entre dispositivos.',
      ]),
      features: JSON.stringify([
        {
          icon: '🔐',
          title: 'Não-Custodial e Auto-Custódia',
          description: 'Você controla suas chaves privadas. MetaMask não pode acessar seus fundos ou recuperar sua seed phrase',
        },
        {
          icon: '🌐',
          title: 'Suporte Multi-Chain EVM',
          description: 'Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche e centenas de redes EVM customizadas',
        },
        {
          icon: '💱',
          title: 'Swap Integrado',
          description: 'Troque tokens diretamente na wallet comparando preços de múltiplas DEXs (Uniswap, 1inch, etc)',
        },
        {
          icon: '🎨',
          title: 'NFTs e Colecionáveis',
          description: 'Visualize, envie e receba NFTs diretamente na wallet (ERC-721 e ERC-1155)',
        },
        {
          icon: '🔗',
          title: 'WalletConnect',
          description: 'Conecte-se a DApps mobile usando QR code, expandindo acesso além do navegador',
        },
        {
          icon: '⚙️',
          title: 'Controle Avançado de Gas',
          description: 'Ajuste taxas de gas manualmente para economizar ou acelerar transações',
        },
      ]),
      howToStartTitle: 'Como Começar com MetaMask',
      howToStartSteps: JSON.stringify([
        {
          number: 1,
          title: 'Instale a Extensão ou App',
          description: 'Acesse metamask.io e baixe a extensão para seu navegador ou app para celular. NUNCA baixe de outras fontes.',
        },
        {
          number: 2,
          title: 'Crie Nova Wallet',
          description: 'Clique em "Criar nova carteira" e defina uma senha forte. Esta senha protege a wallet localmente no dispositivo.',
        },
        {
          number: 3,
          title: 'Guarde Seed Phrase com SEGURANÇA',
          description: 'CRÍTICO: Anote as 12 palavras em papel e guarde em local seguro. NUNCA tire foto, NUNCA salve digitalmente. Quem tem a seed phrase tem acesso total aos fundos.',
        },
        {
          number: 4,
          title: 'Confirme Seed Phrase',
          description: 'MetaMask pedirá para confirmar sua seed phrase na ordem correta. Isso garante que você anotou corretamente.',
        },
        {
          number: 5,
          title: 'Adicione Redes (Opcional)',
          description: 'Por padrão vem com Ethereum. Adicione outras redes como Polygon ou BSC em Configurações > Redes > Adicionar Rede.',
        },
      ]),
      pros: JSON.stringify([
        'Wallet não-custodial mais popular e confiável',
        'Suporte para todas as redes EVM (Ethereum, Polygon, BSC, etc)',
        'Interface intuitiva e fácil de usar',
        'Swap integrado com comparação de preços',
        'Suporte a NFTs nativamente',
        'WalletConnect para DApps mobile',
        'Extensão de navegador e app mobile',
        'Código open-source e auditado',
      ]),
      cons: JSON.stringify([
        'Apenas redes EVM (não suporta Solana, Bitcoin, etc)',
        'Taxas de swap podem ser mais altas que ir direto na DEX',
        'Seed phrase de 12 palavras é menos segura que 24 palavras',
        'Phishing é comum - sites falsos tentam roubar seed phrases',
        'Performance pode ser lenta com muitas redes adicionadas',
      ]),
      faq: JSON.stringify([
        {
          question: 'MetaMask é seguro?',
          answer: 'Sim, se usado corretamente. MetaMask é não-custodial (você controla as chaves) e open-source. Porém, você deve proteger sua seed phrase e nunca compartilhá-la. A segurança depende principalmente do usuário.',
        },
        {
          question: 'Posso usar MetaMask para Solana ou Bitcoin?',
          answer: 'Não. MetaMask suporta apenas redes compatíveis com EVM (Ethereum Virtual Machine). Para Solana use Phantom, para Bitcoin use wallet específica.',
        },
        {
          question: 'O que fazer se perder a senha?',
          answer: 'Você pode recuperar acesso usando sua seed phrase de 12 palavras. Por isso é CRÍTICO guardar a seed phrase em local seguro. Se perder ambas (senha E seed phrase), seus fundos são irrecuperáveis.',
        },
        {
          question: 'Como adicionar Polygon ou BSC?',
          answer: 'Vá em Configurações > Redes > Adicionar Rede. Você pode usar Chainlist.org para adicionar redes automaticamente ou inserir manualmente os dados de RPC.',
        },
      ]),
      securityTips: JSON.stringify([
        {
          icon: '🔑',
          title: 'NUNCA Compartilhe Seed Phrase',
          description: 'Suas 12 palavras dão acesso total aos fundos. MetaMask NUNCA pedirá. Golpistas fingem ser suporte técnico para roubar seed phrases.',
        },
        {
          icon: '🎯',
          title: 'Verifique URLs Antes de Conectar',
          description: 'Golpistas criam sites falsos idênticos aos reais. Sempre verifique a URL completa antes de conectar wallet.',
        },
        {
          icon: '🔒',
          title: 'Use Hardware Wallet',
          description: 'Para fundos grandes, conecte MetaMask a uma Ledger ou Trezor. Isso adiciona camada extra de segurança.',
        },
        {
          icon: '⚠️',
          title: 'Revise TODAS as Transações',
          description: 'Sempre leia o que você está assinando. Golpistas tentam fazer você aprovar contratos maliciosos. Se não entender, não aprove.',
        },
        {
          icon: '💼',
          title: 'Múltiplas Wallets = Mais Segurança',
          description: 'Use uma wallet "quente" para DeFi/trading e outra "fria" para holding. Não coloque tudo em um lugar só.',
        },
        {
          icon: '🔄',
          title: 'Revogue Aprovações Antigas',
          description: 'Use Revoke.cash para revogar aprovações de contratos que você não usa mais. Contratos hackeados podem drenar fundos aprovados.',
        },
      ]),
      showCompatibleWallets: false,
      relatedResources: JSON.stringify(['phantom', 'brave', 'uniswap']),
    },

    // Phantom
    {
      slug: 'phantom',
      name: 'Phantom',
      category: 'wallets',
      verified: true,
      shortDescription: 'Wallet não-custodial líder do ecossistema Solana',
      officialUrl: 'https://phantom.app',
      platforms: JSON.stringify(['Web', 'iOS', 'Android', 'Chrome']),
      tags: JSON.stringify(['Solana', 'DeFi', 'NFTs']),
      heroTitle: 'Phantom: A Melhor Wallet para Solana',
      heroDescription: 'Wallet não-custodial mais popular para Solana, com suporte a tokens, NFTs, DeFi e experiência mobile excepcional',
      heroGradient: 'linear-gradient(135deg, #AB9FF2 0%, #7B61FF 100%)',
      whyGoodTitle: 'Por que Phantom é a Wallet Favorita de Solana?',
      whyGoodContent: JSON.stringify([
        'Phantom é a wallet dominante do ecossistema Solana, com integração nativa em praticamente todos os DApps, DEXs e marketplaces de NFT da rede.',
        'Interface extremamente polida e intuitiva, considerada a melhor UX entre wallets cripto. Funciona perfeitamente tanto no desktop quanto no mobile.',
        'Suporte completo para tokens SPL, NFTs (incluindo cNFTs comprimidos), staking de SOL e interação com todos os principais protocolos DeFi de Solana.',
        'Transações na Solana são ultra-rápidas (400ms) e baratas (~$0.00025), tornando Phantom ideal para NFTs, gaming e DeFi sem as altas taxas de gas do Ethereum.',
        'Multi-chain: além de Solana, Phantom agora suporta Ethereum e Polygon, permitindo gerenciar portfolios cross-chain em uma única wallet.',
      ]),
      features: JSON.stringify([
        {
          icon: '⚡',
          title: 'Velocidade da Solana',
          description: 'Transações em 400ms e taxas de ~$0.00025. Experiência instantânea para swaps, NFTs e DeFi',
        },
        {
          icon: '🎨',
          title: 'NFTs e cNFTs',
          description: 'Visualize NFTs, cNFTs comprimidos, e gerencie coleções diretamente na wallet com galeria integrada',
        },
        {
          icon: '💎',
          title: 'Staking de SOL Integrado',
          description: 'Faça staking de SOL diretamente na wallet e ganhe recompensas (~7% APY) sem sair do app',
        },
        {
          icon: '💱',
          title: 'Swap Integrado',
          description: 'Troque tokens SPL diretamente na wallet usando Jupiter Aggregator com melhores rotas',
        },
        {
          icon: '🌐',
          title: 'Multi-Chain (Solana + EVM)',
          description: 'Gerencie Solana, Ethereum e Polygon na mesma wallet. Melhor de ambos os mundos',
        },
        {
          icon: '📱',
          title: 'Mobile de Primeira Classe',
          description: 'App mobile excepcional com suporte a iOS e Android. Melhor experiência mobile entre wallets',
        },
      ]),
      howToStartTitle: 'Como Começar com Phantom',
      howToStartSteps: JSON.stringify([
        {
          number: 1,
          title: 'Instale Extensão ou App',
          description: 'Acesse phantom.app e instale a extensão (Chrome, Firefox, Brave, Edge) ou baixe o app (iOS/Android). APENAS do site oficial.',
        },
        {
          number: 2,
          title: 'Crie Nova Wallet',
          description: 'Clique em "Criar nova carteira" e escolha se quer seed phrase de 12 ou 24 palavras (24 é mais seguro).',
        },
        {
          number: 3,
          title: 'Guarde Recovery Phrase',
          description: 'CRÍTICO: Anote todas as palavras em papel, na ordem correta, e guarde em local extremamente seguro. Sem isso, você perde acesso aos fundos para sempre.',
        },
        {
          number: 4,
          title: 'Configure Senha e Biometria',
          description: 'Defina senha forte para proteger a wallet localmente. No mobile, ative biometria (Face ID/Touch ID) para conveniência.',
        },
        {
          number: 5,
          title: 'Adicione Redes (Opcional)',
          description: 'Phantom vem com Solana por padrão. Você pode adicionar Ethereum e Polygon nas configurações para wallet multi-chain.',
        },
      ]),
      pros: JSON.stringify([
        'Melhor wallet para Solana (ecossistema dominante)',
        'Interface e UX excepcionais (melhor design)',
        'Transações ultra-rápidas e baratas (~$0.00025)',
        'Suporte nativo a NFTs e cNFTs comprimidos',
        'Staking de SOL integrado (~7% APY)',
        'Swap integrado com Jupiter (melhores rotas)',
        'Multi-chain: Solana + Ethereum + Polygon',
        'App mobile excelente',
      ]),
      cons: JSON.stringify([
        'Focado em Solana (suporte EVM é secundário)',
        'Menos maduro que MetaMask para Ethereum',
        'Solana teve períodos de instabilidade de rede no passado',
        'Menos DApps disponíveis comparado a Ethereum',
        'Alguns recursos avançados ainda limitados',
      ]),
      faq: JSON.stringify([
        {
          question: 'Phantom é seguro?',
          answer: 'Sim. Phantom é não-custodial (você controla as chaves), código auditado e usado por milhões. Porém, a segurança depende de VOCÊ proteger sua recovery phrase e nunca compartilhá-la.',
        },
        {
          question: 'Posso usar Phantom para Ethereum?',
          answer: 'Sim! Phantom agora suporta Ethereum e Polygon além de Solana. Você pode gerenciar tokens e NFTs de múltiplas chains na mesma wallet.',
        },
        {
          question: 'Qual a diferença entre NFT e cNFT?',
          answer: 'cNFTs (compressed NFTs) são NFTs comprimidos na Solana que custam ~$0.0001 para mintar (vs ~$0.01 NFTs normais). Phantom suporta ambos nativamente.',
        },
        {
          question: 'Como fazer staking de SOL?',
          answer: 'Na Phantom, vá em "Stake SOL" no menu principal. Escolha um validador (veja APY e comissão) e confirme. Seus SOL renderão ~7% APY automaticamente.',
        },
      ]),
      securityTips: JSON.stringify([
        {
          icon: '🔑',
          title: 'Recovery Phrase = Seus Fundos',
          description: 'NUNCA compartilhe suas palavras de recuperação. Phantom NUNCA pedirá. Golpistas fingem ser suporte técnico. Se alguém pedir, é golpe 100%.',
        },
        {
          icon: '🎯',
          title: 'Sites Falsos de NFT',
          description: 'Golpistas criam sites falsos de mint de NFT para roubar wallets. Sempre verifique URL e siga apenas links de fontes oficiais (Twitter verificado, Discord oficial).',
        },
        {
          icon: '🔒',
          title: 'Revise Aprovações de Transação',
          description: 'Leia o que você está assinando. Golpistas tentam fazer você aprovar drenagem de fundos. Se não entender completamente, NÃO aprove.',
        },
        {
          icon: '⚠️',
          title: 'Cuidado com Airdrops',
          description: 'NFTs falsos podem aparecer automaticamente na sua wallet. NUNCA interaja com NFTs desconhecidos - podem ser maliciosos.',
        },
        {
          icon: '💼',
          title: 'Múltiplas Wallets',
          description: 'Use wallet "quente" para trading/minting e "fria" para holdings valiosos. Não coloque todos NFTs caros em wallet que você conecta em sites.',
        },
        {
          icon: '🔄',
          title: 'Mantenha Atualizado',
          description: 'Sempre use a versão mais recente do Phantom. Atualizações incluem correções de segurança críticas.',
        },
      ]),
      showCompatibleWallets: false,
      relatedResources: JSON.stringify(['metamask', 'brave', 'raydium']),
    },
    ...additionalResources,
  ];

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { slug: resource.slug },
      update: resource,
      create: resource,
    });
    console.log(`✅ Resource seeded: ${resource.name}`);
  }

  console.log(`\n✅ ${resources.length} resources seeded successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
