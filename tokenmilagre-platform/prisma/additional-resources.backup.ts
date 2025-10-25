// Recursos adicionais para seed
export const additionalResources = [
  // WALLETS - Ledger
  {
    slug: 'ledger',
    name: 'Ledger',
    category: 'wallets',
    verified: true,
    shortDescription: 'Hardware wallet de alta segurança para armazenamento offline (cold storage)',
    officialUrl: 'https://www.ledger.com',
    platforms: JSON.stringify(['Hardware', 'Desktop', 'iOS', 'Android']),
    tags: JSON.stringify(['Cold Storage', 'Segurança', 'Hardware']),
    heroTitle: 'Ledger: Máxima Segurança para Seus Cripto-Ativos',
    heroDescription: 'Hardware wallet líder mundial que armazena suas chaves privadas offline em dispositivo físico certificado',
    heroGradient: 'linear-gradient(135deg, #000000 0%, #2D2D2D 100%)',
    whyGoodTitle: 'Por que Ledger é a Escolha Mais Segura?',
    whyGoodContent: JSON.stringify([
      'Ledger armazena suas chaves privadas em um chip seguro (Secure Element) certificado, o mesmo usado em passaportes e cartões bancários, tornando praticamente impossível extrair as chaves mesmo com acesso físico.',
      'Cold storage verdadeiro: suas chaves NUNCA tocam a internet. Transações são assinadas internamente no dispositivo e apenas a transação assinada é enviada.',
      'Suporte para mais de 5.500 criptomoedas e tokens, incluindo Bitcoin, Ethereum, Solana, Polygon, e praticamente todas as principais blockchains.',
      'Ledger Live (app complementar) oferece interface intuitiva para gerenciar portfolio, fazer staking, comprar crypto e interagir com DApps, tudo com segurança do hardware wallet.',
      'Código de firmware open-source auditado por especialistas de segurança independentes, garantindo transparência e confiança.',
    ]),
    features: JSON.stringify([
      {
        icon: '🔐',
        title: 'Secure Element Certificado',
        description: 'Chip de segurança certificado CC EAL5+ (mesmo nível de bancos e governos) protege chaves privadas',
      },
      {
        icon: '❄️',
        title: 'Cold Storage Verdadeiro',
        description: 'Chaves privadas NUNCA deixam o dispositivo. Transações assinadas offline para máxima segurança',
      },
      {
        icon: '🌐',
        title: '5.500+ Criptomoedas Suportadas',
        description: 'Bitcoin, Ethereum, Solana, Cardano, Polygon, e praticamente todas as principais blockchains',
      },
      {
        icon: '💼',
        title: 'Ledger Live App',
        description: 'Gerencie portfolio, faça staking, compre crypto e conecte a DApps - tudo com segurança do hardware',
      },
      {
        icon: '🛡️',
        title: 'Proteção Física',
        description: 'Resistente a ataques físicos, malware e keyloggers. Tela integrada mostra detalhes da transação',
      },
      {
        icon: '🔓',
        title: 'Open Source Auditável',
        description: 'Firmware open-source auditado por especialistas independentes de segurança',
      },
    ]),
    howToStartTitle: 'Como Começar com Ledger',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Compre APENAS do Site Oficial',
        description: 'Acesse ledger.com e compre diretamente. NUNCA compre de terceiros (eBay, Mercado Livre, etc) - dispositivos podem estar comprometidos.',
      },
      {
        number: 2,
        title: 'Configure o Dispositivo',
        description: 'Ao receber, verifique se está lacrado. Conecte ao computador, instale Ledger Live e siga o processo de configuração inicial.',
      },
      {
        number: 3,
        title: 'Gere e Anote Recovery Phrase',
        description: 'CRÍTICO: O dispositivo gerará 24 palavras. Anote em papel (Ledger fornece cartão), na ordem exata. NUNCA digite no computador. Esta é a ÚNICA forma de recuperar fundos se perder o dispositivo.',
      },
      {
        number: 4,
        title: 'Defina PIN de Segurança',
        description: 'Crie PIN de 4-8 dígitos. Após 3 tentativas erradas, o dispositivo se reseta (mas você pode recuperar com as 24 palavras).',
      },
      {
        number: 5,
        title: 'Instale Apps de Blockchains',
        description: 'No Ledger Live, instale os apps das blockchains que você usa (Bitcoin, Ethereum, Solana, etc). Cada blockchain tem seu próprio app no dispositivo.',
      },
    ]),
    pros: JSON.stringify([
      'Segurança máxima com Secure Element certificado',
      'Cold storage verdadeiro (chaves offline)',
      'Suporte para 5.500+ criptomoedas',
      'Ledger Live app intuitivo e completo',
      'Proteção contra malware, keyloggers e phishing',
      'Tela física mostra detalhes da transação',
      'Firmware open-source auditado',
      'Marca líder e confiável desde 2014',
    ]),
    cons: JSON.stringify([
      'Custo inicial (€79-€279 dependendo do modelo)',
      'Curva de aprendizado para iniciantes',
      'Menos conveniente para trading frequente',
      'Precisa estar presente fisicamente para assinar transações',
      'Recovery phrase de 24 palavras requer cuidado extremo',
    ]),
    faq: JSON.stringify([
      {
        question: 'Qual a diferença entre Ledger Nano S Plus e Nano X?',
        answer: 'Nano S Plus (€79): Conecta apenas via USB, memória para ~100 apps. Nano X (€149): Bluetooth (mobile), bateria, memória para ~100 apps. Ambos têm mesma segurança. Se usa mobile, escolha Nano X.',
      },
      {
        question: 'E se eu perder o dispositivo Ledger?',
        answer: 'Seus fundos estão SEGUROS. Compre novo Ledger, restaure com suas 24 palavras e terá acesso total novamente. Por isso é CRÍTICO guardar as 24 palavras em local seguro.',
      },
      {
        question: 'Posso usar com MetaMask ou outras wallets?',
        answer: 'Sim! Você pode conectar Ledger ao MetaMask, Phantom e outras wallets. Elas gerenciam a interface, mas suas chaves ficam seguras no Ledger.',
      },
      {
        question: 'É seguro comprar Ledger usada?',
        answer: 'NUNCA! Dispositivos usados podem estar comprometidos. Sempre compre NOVO e DIRETO da Ledger.com ou revendedores oficiais autorizados.',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🛒',
        title: 'Compre APENAS do Site Oficial',
        description: 'Ledger.com ou revendedores autorizados. NUNCA eBay, Mercado Livre ou usados. Dispositivos podem ter malware.',
      },
      {
        icon: '🔑',
        title: 'Recovery Phrase em Local Seguro',
        description: 'Anote as 24 palavras em papel (Ledger fornece cartão) e guarde em cofre ou local ultra-seguro. NUNCA tire foto ou digite no computador.',
      },
      {
        icon: '👀',
        title: 'SEMPRE Verifique a Tela do Ledger',
        description: 'Antes de aprovar transações, confira endereço e valor NA TELA DO LEDGER (não no computador). Malware pode modificar o que aparece no PC.',
      },
      {
        icon: '⚠️',
        title: 'Ledger NUNCA Pede Recovery Phrase',
        description: 'E-mails/mensagens pedindo suas 24 palavras são GOLPE 100%. Ledger nunca pede, nem suporte técnico.',
      },
      {
        icon: '🔄',
        title: 'Mantenha Firmware Atualizado',
        description: 'Atualize firmware via Ledger Live oficial. Atualizações corrigem vulnerabilidades e adicionam novos recursos.',
      },
      {
        icon: '💼',
        title: 'Considere Múltiplos Backups',
        description: 'Anote recovery phrase em 2-3 locais diferentes (ex: cofre casa, cofre banco). Se um for destruído, você tem backup.',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['metamask', 'phantom', 'trust-wallet']),
  },

  // WALLETS - Trust Wallet
  {
    slug: 'trust-wallet',
    name: 'Trust Wallet',
    category: 'wallets',
    verified: true,
    shortDescription: 'Wallet multicurrency não custodial da Binance, suporta múltiplas blockchains',
    officialUrl: 'https://trustwallet.com',
    platforms: JSON.stringify(['iOS', 'Android', 'Chrome']),
    tags: JSON.stringify(['Multicurrency', 'DeFi', 'Staking']),
    heroTitle: 'Trust Wallet: Wallet Multi-Chain Mobile-First',
    heroDescription: 'Wallet oficial da Binance com suporte a 10M+ ativos em 100+ blockchains, ideal para mobile',
    heroGradient: 'linear-gradient(135deg, #3375BB 0%, #1E5A8E 100%)',
    whyGoodTitle: 'Por que Trust Wallet é Popular?',
    whyGoodContent: JSON.stringify([
      'Trust Wallet é a wallet oficial da Binance (maior exchange do mundo), oferecendo integração perfeita com a exchange e suporte a milhões de tokens.',
      'Suporte para mais de 100 blockchains diferentes, incluindo Ethereum, BSC, Solana, Polygon, Cosmos, e dezenas de outras redes principais e emergentes.',
      'Mobile-first: apps iOS e Android excepcionalmente polidos, considerados entre os melhores em UX mobile. Extensão Chrome disponível para desktop.',
      'Built-in browser Web3 permite acessar DApps diretamente do celular, sem precisar de extensões ou configurações complexas.',
      'Staking integrado para 15+ blockchains com APY competitivo. Ganhe recompensas de staking diretamente na wallet sem mover fundos.',
    ]),
    features: JSON.stringify([
      {
        icon: '🌐',
        title: '100+ Blockchains Suportadas',
        description: 'Ethereum, BSC, Solana, Polygon, Cosmos, Avalanche, Fantom e dezenas de outras redes',
      },
      {
        icon: '📱',
        title: 'Mobile-First Excellence',
        description: 'Apps iOS e Android com UX excepcional. Melhor experiência mobile entre wallets multi-chain',
      },
      {
        icon: '🔗',
        title: 'Browser Web3 Integrado',
        description: 'Acesse DApps, DEXs e NFT marketplaces diretamente do celular sem extensões',
      },
      {
        icon: '💎',
        title: 'Staking em 15+ Blockchains',
        description: 'Ganhe recompensas fazendo staking de BNB, ETH, SOL, ATOM, DOT e outras diretamente na wallet',
      },
      {
        icon: '💱',
        title: 'Swap Multi-Chain Integrado',
        description: 'Troque tokens entre diferentes blockchains usando aggregators como 1inch e Uniswap',
      },
      {
        icon: '🎨',
        title: 'NFTs e Colecionáveis',
        description: 'Visualize, envie e receba NFTs de múltiplas blockchains em galeria integrada',
      },
    ]),
    howToStartTitle: 'Como Começar com Trust Wallet',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Baixe o App Oficial',
        description: 'Acesse trustwallet.com e baixe na App Store (iOS) ou Google Play (Android). Extensão Chrome disponível em chrome.google.com/webstore.',
      },
      {
        number: 2,
        title: 'Crie Nova Wallet',
        description: 'Toque em "Criar nova wallet". Escolha senha forte para proteger o app localmente.',
      },
      {
        number: 3,
        title: 'Backup da Recovery Phrase',
        description: 'CRÍTICO: Anote as 12 palavras em papel, na ordem exata. NUNCA tire screenshot. Sem essas palavras, fundos são irrecuperáveis se perder o celular.',
      },
      {
        number: 4,
        title: 'Ative Biometria',
        description: 'Configure Face ID ou Touch ID para acesso rápido e seguro ao app.',
      },
      {
        number: 5,
        title: 'Adicione Blockchains',
        description: 'Trust Wallet suporta 100+ chains. Adicione as que você usa em Settings > Networks ou ao receber tokens de novas redes.',
      },
    ]),
    pros: JSON.stringify([
      'Suporte para 100+ blockchains (uma das mais completas)',
      'Excelente app mobile (iOS e Android)',
      'Wallet oficial da Binance',
      'Browser Web3 integrado para DApps mobile',
      'Staking em 15+ blockchains',
      'Swap multi-chain integrado',
      'NFTs suportados nativamente',
      'Código open-source',
    ]),
    cons: JSON.stringify([
      'Extensão desktop menos madura que MetaMask',
      'Suporte ao cliente pode ser lento',
      'Alguns recursos avançados limitados vs wallets especializadas',
      'Interface pode parecer sobrecarregada para iniciantes',
      'Recovery phrase de 12 palavras menos segura que 24',
    ]),
    faq: JSON.stringify([
      {
        question: 'Trust Wallet é segura?',
        answer: 'Sim. É não-custodial (você controla chaves), código open-source e auditada. Porém, você deve proteger sua recovery phrase. A segurança depende do usuário.',
      },
      {
        question: 'Preciso de conta Binance para usar?',
        answer: 'NÃO. Trust Wallet é completamente independente. Você não precisa de conta Binance. A integração é opcional para quem usa a exchange.',
      },
      {
        question: 'Como fazer staking?',
        answer: 'Vá em "Staking" no menu, escolha a moeda (BNB, ETH, SOL, etc), valor e validador. Confirme e comece a ganhar recompensas automaticamente.',
      },
      {
        question: 'Posso usar no computador?',
        answer: 'Sim, há extensão para Chrome. Mas Trust Wallet é otimizada para mobile - experiência desktop é secundária.',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔑',
        title: 'Recovery Phrase em Papel',
        description: 'Anote as 12 palavras em papel e guarde em local seguro. NUNCA tire screenshot ou salve digitalmente.',
      },
      {
        icon: '📱',
        title: 'Baixe APENAS das Lojas Oficiais',
        description: 'App Store ou Google Play. Apps falsos roubam fundos. Verifique desenvolvedor: "DApps Platform Inc".',
      },
      {
        icon: '🎯',
        title: 'Cuidado com DApps Maliciosos',
        description: 'Browser integrado facilita acesso a DApps, mas também aumenta risco. Só acesse DApps de fontes confiáveis.',
      },
      {
        icon: '⚠️',
        title: 'Revise Aprovações de Transação',
        description: 'Antes de aprovar, leia cuidadosamente o que está assinando. Golpistas tentam drenar wallets com aprovações maliciosas.',
      },
      {
        icon: '💼',
        title: 'Use Múltiplas Wallets',
        description: 'Wallet "quente" para DeFi/trading, wallet "fria" (Ledger) para holdings grandes. Não coloque tudo em um lugar.',
      },
      {
        icon: '🔄',
        title: 'Mantenha App Atualizado',
        description: 'Atualizações corrigem vulnerabilidades. Ative auto-update nas configurações do celular.',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['metamask', 'phantom', 'ledger']),
  },
];
