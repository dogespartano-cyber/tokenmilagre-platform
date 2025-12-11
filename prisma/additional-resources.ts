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

  // EXCHANGES - Binance
  {
    slug: 'binance',
    name: 'Binance',
    category: 'exchanges',
    verified: true,
    shortDescription: 'Maior exchange de criptomoedas do mundo por volume de negociação',
    officialUrl: 'https://www.binance.com',
    platforms: JSON.stringify(['Web', 'iOS', 'Android', 'Desktop']),
    tags: JSON.stringify(['Trading', 'Spot', 'Futures']),
    heroTitle: 'Binance: Maior Exchange de Criptomoedas do Mundo',
    heroDescription: 'Plataforma líder global com maior volume de negociação, liquidez superior e centenas de criptomoedas listadas',
    heroGradient: 'linear-gradient(135deg, #F3BA2F 0%, #EAA42D 100%)',
    whyGoodTitle: 'Por que Binance é a Exchange Mais Popular?',
    whyGoodContent: JSON.stringify([
      'Binance é a maior exchange de criptomoedas do mundo por volume diário de negociação (frequentemente excedendo $50 bilhões), oferecendo liquidez incomparável para trading eficiente.',
      'Mais de 350 criptomoedas listadas para trading spot, incluindo todas as principais e centenas de altcoins emergentes, permitindo diversificação máxima de portfolio.',
      'Taxas extremamente competitivas: 0,1% em trading spot (reduzível para 0,02% com BNB), tornando-a uma das exchanges mais baratas para traders ativos.',
      'Ecossistema completo: trading spot e futures, staking, savings, launchpad, NFT marketplace, Binance Pay, e cartão de crédito crypto.',
      'Binance Academy oferece educação gratuita de alta qualidade sobre blockchain, trading e criptomoedas, ideal para iniciantes aprenderem.',
    ]),
    features: JSON.stringify([
      {
        icon: '📊',
        title: 'Trading Spot e Futures',
        description: 'Negocie spot (à vista) ou contratos futuros com alavancagem até 125x. Maior variedade de pares de trading',
      },
      {
        icon: '💰',
        title: 'Binance Earn (Staking & Savings)',
        description: 'Ganhe juros em suas criptomoedas paradas. Staking, Savings flexível, Locked Savings com APY competitivo',
      },
      {
        icon: '🚀',
        title: 'Binance Launchpad',
        description: 'Acesso antecipado a novos projetos de criptomoedas antes de listagem pública',
      },
      {
        icon: '🔗',
        title: 'Binance Smart Chain (BSC)',
        description: 'Blockchain própria com fees baixíssimas, compatível com Ethereum (EVM). DeFi e NFTs',
      },
      {
        icon: '💳',
        title: 'Binance Pay & Cartão',
        description: 'Pague com crypto em estabelecimentos e obtenha cashback. Cartão Visa Binance disponível',
      },
      {
        icon: '📚',
        title: 'Binance Academy',
        description: 'Educação gratuita de alta qualidade: cursos, artigos e vídeos sobre blockchain e trading',
      },
    ]),
    howToStartTitle: 'Como Começar na Binance',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Crie Conta',
        description: 'Acesse binance.com e registre-se com e-mail. Defina senha forte (letras, números e símbolos).',
      },
      {
        number: 2,
        title: 'Complete KYC (Verificação de Identidade)',
        description: 'Para depositar/sacar fiat e aumentar limites, complete KYC enviando documento com foto e selfie. Processo leva minutos.',
      },
      {
        number: 3,
        title: 'Ative 2FA (Autenticação de Dois Fatores)',
        description: 'CRÍTICO: Ative Google Authenticator ou SMS 2FA para proteger sua conta contra hackers.',
      },
      {
        number: 4,
        title: 'Deposite Fundos',
        description: 'Deposite crypto de outra wallet OU compre diretamente com cartão/PIX. Binance suporta BRL (Real brasileiro).',
      },
      {
        number: 5,
        title: 'Comece a Negociar',
        description: 'Vá em Trade > Spot e escolha o par (ex: BTC/USDT). Use ordem Market (instantânea) ou Limit (preço específico).',
      },
    ]),
    pros: JSON.stringify([
      'Maior liquidez do mercado (volume diário >$50 bilhões)',
      '350+ criptomoedas listadas',
      'Taxas baixíssimas (0,1% spot, reduzível a 0,02%)',
      'Ecossistema completo (spot, futures, staking, NFTs, etc)',
      'Suporte a BRL e PIX (Brasil)',
      'Binance Academy para educação gratuita',
      'Apps mobile excelentes (iOS e Android)',
      'Binance Smart Chain (BSC) própria',
    ]),
    cons: JSON.stringify([
      'Complexidade pode intimidar iniciantes',
      'Problemas regulatórios em alguns países',
      'Suporte ao cliente pode ser lento',
      'Interface pode parecer sobrecarregada',
      'Centralized exchange (você não controla chaves)',
    ]),
    faq: JSON.stringify([
      {
        question: 'Binance é segura?',
        answer: 'Sim, é uma das exchanges mais seguras. Usa Secure Asset Fund for Users (SAFU) - fundo de emergência de $1 bilhão para proteger usuários. Porém, ative 2FA e nunca compartilhe credenciais.',
      },
      {
        question: 'Posso usar no Brasil?',
        answer: 'Sim! Binance suporta BRL, aceita PIX para depósitos/saques e está disponível para brasileiros. KYC necessário.',
      },
      {
        question: 'Qual a diferença entre Spot e Futures?',
        answer: 'Spot: compra/venda à vista (você possui o ativo). Futures: contratos com alavancagem (alto risco/retorno). Iniciantes devem começar com Spot.',
      },
      {
        question: 'Como funcionam as taxas?',
        answer: '0,1% em trading spot. Se pagar taxas com BNB (token da Binance), cai para 0,075%. Quanto mais você negocia, menores as taxas (sistema VIP).',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔐',
        title: 'SEMPRE Ative 2FA',
        description: 'Use Google Authenticator (não SMS). 2FA protege contra hackers mesmo se roubarem sua senha.',
      },
      {
        icon: '🎣',
        title: 'Cuidado com Phishing',
        description: 'Sempre verifique URL: binance.com (não "binanc.com" ou "binance-secure.com"). Golpistas criam sites falsos idênticos.',
      },
      {
        icon: '📧',
        title: 'Binance NUNCA Pede Senha por E-mail',
        description: 'E-mails pedindo senha/2FA são GOLPE. Binance nunca pede credenciais por e-mail, telefone ou chat.',
      },
      {
        icon: '💼',
        title: 'Não Deixe Grandes Quantias na Exchange',
        description: 'Exchanges são alvo de hackers. Para holdings de longo prazo, transfira para hardware wallet (Ledger).',
      },
      {
        icon: '🔄',
        title: 'Use Whitelist de Endereços',
        description: 'Ative whitelist de saques nas configurações. Permite apenas saques para endereços pré-aprovados.',
      },
      {
        icon: '⚠️',
        title: 'Cuidado com Alavancagem em Futures',
        description: 'Futures com alavancagem podem liquidar sua posição rapidamente. Iniciantes devem evitar ou usar alavancagem baixa (2-3x).',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['coinbase', 'kraken', 'trust-wallet']),
  },

  // EXCHANGES - Coinbase
  {
    slug: 'coinbase',
    name: 'Coinbase',
    category: 'exchanges',
    verified: true,
    shortDescription: 'Exchange americana regulamentada, ideal para iniciantes',
    officialUrl: 'https://www.coinbase.com',
    platforms: JSON.stringify(['Web', 'iOS', 'Android']),
    tags: JSON.stringify(['Iniciante', 'Regulada', 'Fiat']),
    heroTitle: 'Coinbase: A Exchange Mais Confiável para Iniciantes',
    heroDescription: 'Exchange regulamentada nos EUA, publicamente negociada (NASDAQ: COIN) com interface amigável e segurança institucional',
    heroGradient: 'linear-gradient(135deg, #0052FF 0%, #0041CC 100%)',
    whyGoodTitle: 'Por que Coinbase é Ideal para Iniciantes?',
    whyGoodContent: JSON.stringify([
      'Coinbase é publicamente negociada na NASDAQ (ticker: COIN) e totalmente regulamentada nos EUA, oferecendo nível de transparência e conformidade incomparável.',
      'Interface extremamente simples e intuitiva, projetada especificamente para iniciantes. Comprar crypto é tão fácil quanto comprar na Amazon.',
      'Segurança institucional: 98% dos fundos de clientes em cold storage offline, seguro FDIC para saldos USD, e nunca foi hackeada desde fundação em 2012.',
      'Coinbase Earn permite ganhar crypto gratuitamente assistindo vídeos educacionais sobre diferentes projetos - ótimo para iniciantes aprenderem e ganharem ao mesmo tempo.',
      'Suporte ao cliente superior com chat ao vivo e telefone, raro no mundo crypto onde a maioria das exchanges oferece apenas tickets.',
    ]),
    features: JSON.stringify([
      {
        icon: '🏛️',
        title: 'Regulamentação Total',
        description: 'Publicamente negociada (NASDAQ: COIN), regulada nos EUA, auditada externamente. Máxima transparência',
      },
      {
        icon: '🎓',
        title: 'Coinbase Earn',
        description: 'Ganhe crypto gratuita assistindo vídeos educacionais. Aprenda sobre projetos e ganhe tokens deles',
      },
      {
        icon: '🔒',
        title: 'Segurança Institucional',
        description: '98% em cold storage, seguro FDIC para USD, nunca foi hackeada. Mesmo nível de bancos tradicionais',
      },
      {
        icon: '💳',
        title: 'Compra Fácil com Cartão',
        description: 'Compre crypto instantaneamente com cartão de crédito/débito. Processo simples como e-commerce',
      },
      {
        icon: '💰',
        title: 'Coinbase Card',
        description: 'Cartão Visa que gasta suas criptomoedas diretamente. Ganhe até 4% de cashback em crypto',
      },
      {
        icon: '📞',
        title: 'Suporte ao Cliente Premium',
        description: 'Chat ao vivo, telefone e e-mail. Suporte em português disponível. Raro em exchanges',
      },
    ]),
    howToStartTitle: 'Como Começar na Coinbase',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Crie Conta',
        description: 'Acesse coinbase.com e registre-se com e-mail. Processo guiado passo-a-passo muito simples.',
      },
      {
        number: 2,
        title: 'Verificação de Identidade (KYC)',
        description: 'Envie documento com foto (RG, CNH ou Passaporte) e tire selfie. Aprovação em minutos. Necessário por regulamentação.',
      },
      {
        number: 3,
        title: 'Adicione Método de Pagamento',
        description: 'Conecte conta bancária, cartão de débito ou cartão de crédito. Coinbase aceita várias formas de pagamento.',
      },
      {
        number: 4,
        title: 'Compre Sua Primeira Crypto',
        description: 'Clique em "Buy/Sell", escolha a crypto (Bitcoin, Ethereum, etc), valor e confirme. Instantâneo com cartão.',
      },
      {
        number: 5,
        title: 'Explore Coinbase Earn',
        description: 'Vá em "Earn" e assista vídeos educacionais. Ganhe crypto grátis enquanto aprende sobre diferentes projetos.',
      },
    ]),
    pros: JSON.stringify([
      'Ideal para iniciantes (interface super simples)',
      'Regulamentada e publicamente negociada (NASDAQ)',
      'Nunca foi hackeada (segurança institucional)',
      'Coinbase Earn (ganhe crypto aprendendo)',
      'Suporte ao cliente excelente (chat, telefone)',
      'Seguro FDIC para saldos USD',
      'Coinbase Card com cashback',
      'Apps mobile excepcionais',
    ]),
    cons: JSON.stringify([
      'Taxas altas (até 1,49% + spread)',
      'Menos criptomoedas listadas vs Binance (~250 vs 350+)',
      'Não disponível em todos os países',
      'Interface básica pode limitar traders avançados',
      'Processo KYC obrigatório e rigoroso',
    ]),
    faq: JSON.stringify([
      {
        question: 'Coinbase é segura?',
        answer: 'Extremamente segura. Publicamente negociada, regulamentada, nunca foi hackeada, 98% dos fundos em cold storage offline e seguro FDIC para USD. Uma das exchanges mais seguras.',
      },
      {
        question: 'Funciona no Brasil?',
        answer: 'Parcialmente. Brasileiros podem criar conta e comprar crypto, mas algumas funcionalidades podem ser limitadas. Verifique disponibilidade no site.',
      },
      {
        question: 'Diferença entre Coinbase e Coinbase Pro?',
        answer: 'Coinbase: interface simples, taxas mais altas, ideal iniciantes. Coinbase Pro: interface avançada, taxas menores (0,5%), para traders experientes. Mesma empresa, contas ligadas.',
      },
      {
        question: 'Como funciona o Coinbase Earn?',
        answer: 'Assista vídeos curtos (3-5 min) sobre diferentes criptomoedas e responda quiz simples. Ganhe tokens daquele projeto gratuitamente. Pode ganhar $50+ total.',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔐',
        title: 'Ative 2FA Imediatamente',
        description: 'Use app autenticador (não SMS). 2FA é OBRIGATÓRIO para saques, mas ative também para login.',
      },
      {
        icon: '🎣',
        title: 'Verifique URL (Phishing)',
        description: 'Sempre coinbase.com (não "coinbase-secure.com"). Golpistas criam sites falsos. Salve nos favoritos.',
      },
      {
        icon: '📧',
        title: 'Coinbase NUNCA Pede Senha',
        description: 'E-mails pedindo senha, 2FA ou "verificação de conta" são GOLPE. Coinbase nunca pede credenciais.',
      },
      {
        icon: '💼',
        title: 'Use Coinbase Vault para Holdings',
        description: 'Coinbase Vault adiciona delay de 48h em saques e requer múltiplas aprovações. Ideal para guardar crypto de longo prazo.',
      },
      {
        icon: '🔄',
        title: 'Revise Dispositivos Conectados',
        description: 'Em Settings > Security, veja quais dispositivos têm acesso. Remova dispositivos desconhecidos.',
      },
      {
        icon: '⚠️',
        title: 'Não Compartilhe Código 2FA',
        description: 'Golpistas fingem ser suporte e pedem código 2FA. NUNCA compartilhe. Suporte real nunca pede.',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['binance', 'kraken', 'metamask']),
  },

  // EXCHANGES - Kraken
  {
    slug: 'kraken',
    name: 'Kraken',
    category: 'exchanges',
    verified: true,
    shortDescription: 'Exchange confiável com foco em segurança e conformidade regulatória',
    officialUrl: 'https://www.kraken.com',
    platforms: JSON.stringify(['Web', 'iOS', 'Android']),
    tags: JSON.stringify(['Segurança', 'Regulada', 'Staking']),
    heroTitle: 'Kraken: Segurança e Conformidade de Nível Bancário',
    heroDescription: 'Exchange regulamentada com histórico impecável de segurança, nunca foi hackeada desde 2011',
    heroGradient: 'linear-gradient(135deg, #5741D9 0%, #4230B0 100%)',
    whyGoodTitle: 'Por que Kraken é Referência em Segurança?',
    whyGoodContent: JSON.stringify([
      'Kraken opera desde 2011 e NUNCA foi hackeada, um histórico de segurança incomparável na indústria crypto onde exchanges são constantemente alvo de ataques.',
      'Primeira exchange de Bitcoin a passar auditoria proof-of-reserves, provando publicamente que possui 100% dos fundos de clientes - transparência total.',
      'Regulamentada como banco em vários países (incluindo licença bancária nos EUA), sujeita às mesmas regulamentações rigorosas de bancos tradicionais.',
      'Suporte a staking para 15+ criptomoedas com APY competitivo, permitindo ganhar recompensas passivas enquanto mantém ativos na exchange com segurança.',
      'Kraken Pro oferece trading avançado com taxas baixíssimas (0,16% maker / 0,26% taker) e ferramentas profissionais como margin trading e futures.',
    ]),
    features: JSON.stringify([
      {
        icon: '🛡️',
        title: 'Nunca Foi Hackeada',
        description: 'Desde 2011, zero hacks. Segurança de nível bancário com cold storage e práticas rigorosas',
      },
      {
        icon: '🏦',
        title: 'Licença Bancária',
        description: 'Regulada como banco em vários países. Auditoria proof-of-reserves pública e verificável',
      },
      {
        icon: '💎',
        title: 'Staking em 15+ Moedas',
        description: 'Ganhe recompensas em ETH, SOL, DOT, ATOM e outras. APY competitivo direto na exchange',
      },
      {
        icon: '📊',
        title: 'Kraken Pro (Trading Avançado)',
        description: 'Interface profissional com gráficos avançados, margin trading, futures. Taxas ultra-baixas',
      },
      {
        icon: '🔐',
        title: 'Master Key de Segurança',
        description: 'Sistema exclusivo de chave mestra para recuperação de conta. Proteção adicional contra phishing',
      },
      {
        icon: '💰',
        title: 'OTC Desk',
        description: 'Trading over-the-counter para grandes volumes (whales). Execução sem slippage',
      },
    ]),
    howToStartTitle: 'Como Começar na Kraken',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Crie Conta',
        description: 'Acesse kraken.com e registre-se com e-mail. Escolha senha ultra-segura (Kraken recomenda 15+ caracteres).',
      },
      {
        number: 2,
        title: 'Verificação de Identidade (Starter/Intermediate)',
        description: 'Starter: verificação básica. Intermediate: documento + endereço. Cada nível aumenta limites de depósito/saque.',
      },
      {
        number: 3,
        title: 'Configure Segurança Avançada',
        description: 'Ative 2FA (Yubikey recomendado), Master Key, e Global Settings Lock. Kraken oferece opções de segurança mais avançadas.',
      },
      {
        number: 4,
        title: 'Deposite Fundos',
        description: 'Deposite crypto de outra wallet OU fiat via wire transfer. Kraken não aceita cartão (foco em segurança vs conveniência).',
      },
      {
        number: 5,
        title: 'Escolha Interface',
        description: 'Kraken.com (simples) para iniciantes. Kraken Pro (avançada) para traders com ferramentas profissionais e taxas menores.',
      },
    ]),
    pros: JSON.stringify([
      'Nunca foi hackeada (melhor histórico de segurança)',
      'Regulamentada como banco',
      'Proof-of-reserves auditado publicamente',
      'Staking em 15+ moedas',
      'Taxas baixas no Kraken Pro (0,16%)',
      'Suporte ao cliente excelente',
      'Margem trading e futures disponíveis',
      '200+ criptomoedas listadas',
    ]),
    cons: JSON.stringify([
      'Interface pode parecer desatualizada',
      'Não aceita cartão (apenas wire transfer para fiat)',
      'Processo de verificação pode ser lento',
      'Menor variedade que Binance',
      'Apps mobile menos polidos que concorrentes',
    ]),
    faq: JSON.stringify([
      {
        question: 'Kraken é realmente mais segura?',
        answer: 'Sim. Nunca foi hackeada em 13+ anos, regulada como banco, auditoria proof-of-reserves pública. É referência da indústria em segurança.',
      },
      {
        question: 'Por que não aceita cartão de crédito?',
        answer: 'Foco em segurança vs conveniência. Cartões aumentam risco de fraude e chargebacks. Kraken prioriza wire transfers mais seguros.',
      },
      {
        question: 'Diferença entre Kraken e Kraken Pro?',
        answer: 'Kraken.com: interface simples, taxas padrão. Kraken Pro: interface avançada com gráficos profissionais e taxas MUITO menores (0,16% vs 0,9%). Mesma conta, dados compartilhados.',
      },
      {
        question: 'Como funciona o staking?',
        answer: 'Compre moedas que suportam staking (ETH, SOL, DOT, etc), vá em "Earn > Staking", escolha a moeda e confirme. Começa a ganhar recompensas automaticamente.',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔐',
        title: 'Use Hardware 2FA (Yubikey)',
        description: 'Kraken suporta Yubikey (USB security key). Mais seguro que app autenticador. Invista em 2 Yubikeys (backup).',
      },
      {
        icon: '🔑',
        title: 'Configure Master Key',
        description: 'Master Key permite recuperar conta se perder acesso. Anote e guarde em local ultra-seguro. Única forma de recuperar conta hackeada.',
      },
      {
        icon: '🔒',
        title: 'Ative Global Settings Lock',
        description: 'Impede mudanças em configurações de segurança por 72h. Protege contra hackers que ganham acesso temporário.',
      },
      {
        icon: '📧',
        title: 'Verifique TODOS os E-mails',
        description: 'Kraken envia confirmação por e-mail para TUDO (logins, trades, saques). Leia todos. Se receber e-mail de ação que você não fez, alerte suporte imediatamente.',
      },
      {
        icon: '💼',
        title: 'Use Withdrawal Address Whitelist',
        description: 'Pré-aprove endereços de saque. Mesmo se hacker acessar conta, não consegue sacar para endereço dele.',
      },
      {
        icon: '⏰',
        title: 'Configure Withdrawal Delay',
        description: 'Adicione delay de 24-72h em saques. Tempo para cancelar se detectar atividade suspeita.',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['binance', 'coinbase', 'ledger']),
  },

  // EXPLORERS - Solscan
  {
    slug: 'solscan',
    name: 'Solscan',
    category: 'explorers',
    verified: true,
    shortDescription: 'Explorador de blockchain para a rede Solana',
    officialUrl: 'https://solscan.io',
    platforms: JSON.stringify(['Web']),
    tags: JSON.stringify(['Solana', 'Transações', 'Análise']),
    heroTitle: 'Solscan: O Explorador Líder de Solana',
    heroDescription: 'Plataforma completa de análise e exploração da blockchain Solana com dados em tempo real',
    heroGradient: 'linear-gradient(135deg, #14F195 0%, #00D4AA 100%)',
    whyGoodTitle: 'Por que Solscan é Essencial para Usuários de Solana?',
    whyGoodContent: JSON.stringify([
      'Solscan é o explorador de blockchain mais completo e popular para a rede Solana, oferecendo interface intuitiva e dados precisos em tempo real sobre todas as atividades da rede.',
      'Rastreamento detalhado de transações com visualização de assinaturas, timestamps, blocos, instruções e status de confirmação - essencial para verificar se transações foram processadas corretamente.',
      'Token Dashboard mostra todos os tokens SPL da Solana com dados de preço, capitalização de mercado, holders e volume - ótimo para pesquisar novos projetos.',
      'DeFi Dashboard exclusivo monitora protocolos DeFi de Solana ordenados por TVL (Total Value Locked) e volume de 24h, permitindo identificar os protocolos mais utilizados.',
      'API completa e documentada permite desenvolvedores integrarem dados do Solscan em seus aplicativos, wallets e ferramentas.',
    ]),
    features: JSON.stringify([
      {
        icon: '🔍',
        title: 'Busca Universal',
        description: 'Pesquise endereços, transações, tokens, NFTs, programas e blocos. Interface rápida e responsiva',
      },
      {
        icon: '📊',
        title: 'Token Analytics',
        description: 'Dados completos de tokens: preço, market cap, volume, holders, supply. Gráficos históricos',
      },
      {
        icon: '💎',
        title: 'NFT Explorer',
        description: 'Visualize NFTs e cNFTs (compressed NFTs), coleções, metadados e histórico de transações',
      },
      {
        icon: '📈',
        title: 'DeFi Dashboard',
        description: 'Monitore protocolos DeFi por TVL e volume. Veja onde a liquidez está concentrada',
      },
      {
        icon: '⚡',
        title: 'Métricas de Rede em Tempo Real',
        description: 'TPS (transações por segundo), altura do bloco, época atual, performance dos validadores',
      },
      {
        icon: '🔗',
        title: 'API Pública',
        description: 'API RESTful documentada para integração em wallets, apps e ferramentas de análise',
      },
    ]),
    howToStartTitle: 'Como Usar o Solscan',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Acesse solscan.io',
        description: 'Não precisa criar conta. Interface pública e gratuita para todos.',
      },
      {
        number: 2,
        title: 'Pesquise o que Precisa',
        description: 'Use a barra de busca: cole endereço de wallet, hash de transação, nome de token ou NFT. Solscan identifica automaticamente.',
      },
      {
        number: 3,
        title: 'Explore Transações',
        description: 'Clique em qualquer transação para ver detalhes: remetente, destinatário, valor, instruções, logs e status de confirmação.',
      },
      {
        number: 4,
        title: 'Analise Tokens e NFTs',
        description: 'Vá em "Tokens" ou "NFTs" no menu para explorar mercado. Filtre por volume, market cap, holders.',
      },
      {
        number: 5,
        title: 'Monitore DeFi',
        description: 'Acesse "DeFi" para ver ranking de protocolos por TVL. Identifique onde há mais liquidez e atividade.',
      },
    ]),
    pros: JSON.stringify([
      'Interface mais limpa e intuitiva entre exploradores Solana',
      'Dados em tempo real com baixa latência',
      'Token e NFT analytics completos',
      'DeFi dashboard exclusivo',
      'API pública gratuita',
      'Sem necessidade de criar conta',
      'Mobile-friendly',
      'Suporte a cNFTs (compressed NFTs)',
    ]),
    cons: JSON.stringify([
      'Apenas para Solana (não suporta outras blockchains)',
      'Pode ter lag durante picos de rede Solana',
      'Alguns dados avançados requerem conta premium',
      'Anúncios na versão gratuita',
    ]),
    faq: JSON.stringify([
      {
        question: 'Solscan é gratuito?',
        answer: 'Sim, totalmente gratuito para uso básico. Há plano premium para APIs avançadas e remoção de anúncios, mas não é necessário para maioria dos usuários.',
      },
      {
        question: 'Como verificar se minha transação foi confirmada?',
        answer: 'Cole o hash da transação (signature) na busca. Solscan mostrará status: Success (confirmada), Failed (falhou) ou Pending (processando). Verifique número de confirmations.',
      },
      {
        question: 'Posso ver histórico de uma wallet?',
        answer: 'Sim! Cole o endereço da wallet e veja todas as transações, tokens holdings, NFTs, e interações com programas DeFi.',
      },
      {
        question: 'Diferença entre Solscan e Solana Explorer oficial?',
        answer: 'Solscan tem interface mais amigável, analytics melhores, DeFi dashboard, e é mais rápido. Solana Explorer (explorer.solana.com) é oficial mas mais técnico.',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔍',
        title: 'SEMPRE Verifique Endereços',
        description: 'Antes de enviar SOL ou tokens, cole endereço no Solscan para verificar se é válido e se tem histórico de transações legítimas.',
      },
      {
        icon: '⚠️',
        title: 'Cuidado com Tokens Scam',
        description: 'Solscan mostra TODOS os tokens, incluindo scams. Verifique holders, volume e liquidity antes de comprar tokens desconhecidos.',
      },
      {
        icon: '🎯',
        title: 'Confirme Transações Antes de Agir',
        description: 'Se alguém diz que enviou SOL/tokens, verifique no Solscan antes de enviar produto/serviço. Confirme que transação realmente existe e está confirmada.',
      },
      {
        icon: '💼',
        title: 'Monitore Sua Wallet',
        description: 'Adicione sua wallet aos favoritos e verifique regularmente. Detecte atividades suspeitas rapidamente.',
      },
      {
        icon: '🔗',
        title: 'Verifique Smart Contracts',
        description: 'Antes de interagir com DApps novos, pesquise o program address no Solscan. Veja se tem muitas interações e TVL razoável.',
      },
      {
        icon: '📊',
        title: 'Analise antes de Investir',
        description: 'Use Token Dashboard para pesquisar projetos. Verifique distribuição de holders (evite tokens com 1 holder tendo 90% do supply).',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['phantom', 'raydium', 'etherscan']),
  },

  // EXPLORERS - Etherscan
  {
    slug: 'etherscan',
    name: 'Etherscan',
    category: 'explorers',
    verified: true,
    shortDescription: 'Principal explorador de blockchain para Ethereum',
    officialUrl: 'https://etherscan.io',
    platforms: JSON.stringify(['Web']),
    tags: JSON.stringify(['Ethereum', 'Smart Contracts', 'Análise']),
    heroTitle: 'Etherscan: O Padrão-Ouro dos Exploradores de Blockchain',
    heroDescription: 'Explorador mais confiável e completo para Ethereum com verificação de contratos e analytics avançados',
    heroGradient: 'linear-gradient(135deg, #627EEA 0%, #4E5FD1 100%)',
    whyGoodTitle: 'Por que Etherscan é Referência da Indústria?',
    whyGoodContent: JSON.stringify([
      'Etherscan é o explorador de blockchain mais antigo e confiável para Ethereum (desde 2015), usado por milhões diariamente como fonte primária de verdade sobre o estado da rede.',
      'Verificação de contratos inteligentes permite desenvolvedores publicarem código-fonte de smart contracts para auditoria pública - essencial para confiança em DeFi e NFTs.',
      'Gas Tracker em tempo real mostra preço atual do gas (Gwei) e prevê melhor horário para transações, economizando dinheiro em taxas de rede.',
      'Analytics avançados incluem: charts de preço ETH, supply total, burnt tokens (EIP-1559), endereços únicos, e métricas de adoção da rede.',
      'Suporta múltiplas redes EVM: Ethereum Mainnet, Sepolia testnet, e dezenas de outras redes compatíveis, tudo sob mesma interface familiar.',
    ]),
    features: JSON.stringify([
      {
        icon: '🔍',
        title: 'Busca Universal Poderosa',
        description: 'Pesquise addresses, txns, blocos, tokens (ERC-20), NFTs (ERC-721/1155), ENS names. Resultados instantâneos',
      },
      {
        icon: '📜',
        title: 'Verificação de Smart Contracts',
        description: 'Código-fonte de contratos verificados é público. Audite segurança de DApps e tokens antes de usar',
      },
      {
        icon: '⛽',
        title: 'Gas Tracker Inteligente',
        description: 'Preço de gas em tempo real (Low, Average, High). Previsões de melhor horário para economizar em fees',
      },
      {
        icon: '🪙',
        title: 'Token Tracker (ERC-20/721/1155)',
        description: 'Analise qualquer token ou NFT: holders, transfers, supply, contract. Histórico completo',
      },
      {
        icon: '📊',
        title: 'Charts e Analytics',
        description: 'Preço ETH, market cap, supply, gas usado, endereços ativos. Dados históricos desde 2015',
      },
      {
        icon: '🔔',
        title: 'Alertas e Notificações',
        description: 'Crie alertas para addresses (recebeu ETH), eventos de contratos, preço de gas. Notificações por email',
      },
    ]),
    howToStartTitle: 'Como Usar o Etherscan',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Acesse etherscan.io',
        description: 'Interface pública e gratuita. Não precisa criar conta para explorar (apenas para alertas e API).',
      },
      {
        number: 2,
        title: 'Pesquise o que Precisa',
        description: 'Barra de busca aceita: endereços (0x...), hash de transação, ENS names (vitalik.eth), tokens, blocos.',
      },
      {
        number: 3,
        title: 'Verifique Transações',
        description: 'Clique em qualquer txn para ver: from, to, value, gas used, status (Success/Fail), input data, logs de eventos.',
      },
      {
        number: 4,
        title: 'Analise Smart Contracts',
        description: 'Ao ver um contrato, vá em aba "Contract" para ler código (se verificado), fazer chamadas (Read/Write), ver eventos.',
      },
      {
        number: 5,
        title: 'Use Gas Tracker',
        description: 'Clique em "Gas Tracker" no menu. Veja preço atual e gráficos históricos. Agende transações para horários baratos.',
      },
    ]),
    pros: JSON.stringify([
      'Explorador mais confiável e usado do Ethereum',
      'Verificação de código de smart contracts',
      'Gas tracker em tempo real',
      'Analytics e charts completos desde 2015',
      'Suporte a ENS names',
      'API robusta (gratuita e premium)',
      'Alertas e notificações customizáveis',
      'Mobile-friendly',
    ]),
    cons: JSON.stringify([
      'Apenas redes EVM (não suporta Solana, Bitcoin, etc)',
      'Interface pode parecer sobrecarregada para iniciantes',
      'Anúncios na versão gratuita',
      'API gratuita tem rate limits',
    ]),
    faq: JSON.stringify([
      {
        question: 'Etherscan é oficial do Ethereum?',
        answer: 'Não, é independente. Ethereum não tem explorador "oficial", mas Etherscan é o mais confiável e usado pela comunidade desde 2015.',
      },
      {
        question: 'Como saber se transação foi confirmada?',
        answer: 'Cole txn hash na busca. Veja "Status": Success (confirmada e executada), Pending (na mempool), ou Failed (revertida). Veja quantas confirmações de bloco tem.',
      },
      {
        question: 'O que é contrato "verificado"?',
        answer: 'Desenvolvedor publicou código-fonte no Etherscan. Você pode ler e auditar o código antes de interagir. Contratos verificados têm ícone de check verde.',
      },
      {
        question: 'Como economizar em gas fees?',
        answer: 'Use Gas Tracker para ver horários mais baratos (geralmente fins de semana/madrugada). Defina gas price manualmente em wallet baseado em "Low" do Etherscan.',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔍',
        title: 'SEMPRE Verifique Contratos Antes de Usar',
        description: 'Vá em Etherscan, procure o contrato, veja se está verificado (código público). Leia código ou procure auditorias.',
      },
      {
        icon: '⚠️',
        title: 'Cuidado com Tokens Falsos',
        description: 'Golpistas criam tokens ERC-20 com nomes idênticos a projetos famosos. Verifique contract address oficial no site do projeto.',
      },
      {
        icon: '🎯',
        title: 'Confirme Endereços Completos',
        description: 'NUNCA confie apenas nos primeiros/últimos caracteres. Golpistas criam addresses similares. Verifique endereço completo no Etherscan.',
      },
      {
        icon: '💼',
        title: 'Monitore Sua Wallet',
        description: 'Adicione seu endereço aos favoritos. Verifique regularmente se há transações não autorizadas ou aprovações suspeitas.',
      },
      {
        icon: '🔗',
        title: 'Use Token Approval Checker',
        description: 'Em Etherscan, vá em "More > Token Approvals" para revogar aprovações antigas de contratos que você não usa mais. Protege contra hacks.',
      },
      {
        icon: '📊',
        title: 'Pesquise Antes de Investir',
        description: 'Analise holders do token no Etherscan. Evite tokens onde 1-2 addresses controlam >50% do supply (risco de rug pull).',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['metamask', 'uniswap', 'solscan']),
  },

  // EXPLORERS - Blockchain.com Explorer (Bitcoin)
  {
    slug: 'blockchain-explorer',
    name: 'Blockchain.com Explorer',
    category: 'explorers',
    verified: true,
    shortDescription: 'Explorador para Bitcoin e outras blockchains principais',
    officialUrl: 'https://www.blockchain.com/explorer',
    platforms: JSON.stringify(['Web']),
    tags: JSON.stringify(['Bitcoin', 'Multi-chain', 'Transações']),
    heroTitle: 'Blockchain.com Explorer: Transparência Total do Bitcoin',
    heroDescription: 'Explorador confiável para Bitcoin, Ethereum e Bitcoin Cash com dados desde a genesis block',
    heroGradient: 'linear-gradient(135deg, #F7931A 0%, #D87006 100%)',
    whyGoodTitle: 'Por que Blockchain.com é Referência para Bitcoin?',
    whyGoodContent: JSON.stringify([
      'Blockchain.com opera desde 2011 e é um dos exploradores de Bitcoin mais antigos e confiáveis, com dados completos desde a genesis block (primeiro bloco do Bitcoin).',
      'Interface extremamente simples e focada, ideal para iniciantes que querem apenas verificar transações de Bitcoin sem complexidade desnecessária.',
      'Suporte a múltiplas blockchains principais (Bitcoin, Ethereum, Bitcoin Cash) em uma única plataforma, permitindo verificar transações cross-chain.',
      'Dados históricos completos com charts de preço, hashrate, difficulty, mempool size e outras métricas da rede Bitcoin ao longo dos anos.',
      'Visualização clara de UTXO (Unspent Transaction Outputs) e estrutura de transações Bitcoin, essencial para entender como Bitcoin funciona tecnicamente.',
    ]),
    features: JSON.stringify([
      {
        icon: '₿',
        title: 'Explorador Bitcoin Completo',
        description: 'Dados desde 2009 (genesis block). Todas as transações, blocos e endereços do Bitcoin',
      },
      {
        icon: '🔍',
        title: 'Busca Multi-Chain',
        description: 'Pesquise transações de Bitcoin, Ethereum e Bitcoin Cash na mesma interface',
      },
      {
        icon: '📊',
        title: 'Charts e Estatísticas',
        description: 'Preço BTC, market cap, hashrate, difficulty, mempool, fees médias. Dados históricos completos',
      },
      {
        icon: '⏱️',
        title: 'Mempool Monitor',
        description: 'Veja transações não confirmadas esperando na mempool e estime tempo de confirmação',
      },
      {
        icon: '🧮',
        title: 'UTXO Explorer',
        description: 'Visualize estrutura de UTXOs (modelo de transações do Bitcoin). Aprenda como Bitcoin funciona',
      },
      {
        icon: '🔔',
        title: 'Notificações de Transações',
        description: 'Receba alertas quando endereço específico receber Bitcoin',
      },
    ]),
    howToStartTitle: 'Como Usar o Blockchain.com Explorer',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Acesse blockchain.com/explorer',
        description: 'Interface gratuita e pública. Não precisa criar conta.',
      },
      {
        number: 2,
        title: 'Selecione Blockchain',
        description: 'Escolha Bitcoin (BTC), Ethereum (ETH) ou Bitcoin Cash (BCH) no menu superior.',
      },
      {
        number: 3,
        title: 'Pesquise Transação ou Endereço',
        description: 'Cole hash de transação, endereço Bitcoin, ou número de bloco na barra de busca.',
      },
      {
        number: 4,
        title: 'Verifique Status de Transação',
        description: 'Veja confirmações (6+ = seguro), inputs, outputs, fees pagos e tempo estimado.',
      },
      {
        number: 5,
        title: 'Explore Blocos',
        description: 'Clique em número de bloco para ver todas as transações daquele bloco, minerador, reward e timestamp.',
      },
    ]),
    pros: JSON.stringify([
      'Interface simples e limpa (ideal para iniciantes)',
      'Dados desde 2009 (genesis block do Bitcoin)',
      'Suporte a Bitcoin, Ethereum e Bitcoin Cash',
      'Charts históricos completos',
      'Mempool monitor em tempo real',
      'Mobile-friendly',
      'Sem anúncios intrusivos',
      'Marca confiável e estabelecida',
    ]),
    cons: JSON.stringify([
      'Menos features que Etherscan para Ethereum',
      'Não suporta outras blockchains (Solana, BSC, etc)',
      'Analytics menos avançados que concorrentes',
      'Não tem verificação de smart contracts',
      'API limitada vs alternativas',
    ]),
    faq: JSON.stringify([
      {
        question: 'Blockchain.com Explorer é o mesmo que Blockchain.com Wallet?',
        answer: 'Não. São serviços separados da mesma empresa. Explorer é para VER transações (público). Wallet é para FAZER transações (requer conta). Ambos são confiáveis.',
      },
      {
        question: 'Quantas confirmações preciso para Bitcoin estar seguro?',
        answer: '6 confirmações (~1 hora) é considerado muito seguro. Para valores pequenos, 1-2 confirmações (~20 min) já é aceitável. Exchanges geralmente exigem 3-6.',
      },
      {
        question: 'Como verificar se enviei para endereço correto?',
        answer: 'Cole o endereço de destino no Explorer ANTES de enviar. Verifique se é válido e se tem histórico de transações (se for exchange/serviço conhecido).',
      },
      {
        question: 'Por que minha transação está "pending" há horas?',
        answer: 'Fee de transação muito baixo. Mineradores priorizam txns com fees altos. Use Mempool monitor para ver posição na fila. Pode levar dias se fee muito baixo.',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔍',
        title: 'SEMPRE Verifique Endereço Antes de Enviar',
        description: 'Cole endereço no Explorer para confirmar que é válido. Bitcoin transações são irreversíveis - endereço errado = dinheiro perdido.',
      },
      {
        icon: '⏱️',
        title: 'Aguarde 6 Confirmações para Valores Grandes',
        description: 'Até 6 confirmações, há risco teórico de reversão (51% attack). Para grandes valores, aguarde confirmações suficientes.',
      },
      {
        icon: '💰',
        title: 'Verifique Fee Antes de Enviar',
        description: 'Use Mempool monitor para ver fee médio atual. Fee muito baixo = transação pode ficar presa por dias/semanas.',
      },
      {
        icon: '🎯',
        title: 'Endereços Bitcoin Começam com 1, 3 ou bc1',
        description: 'Se não começar com esses prefixos, NÃO é endereço Bitcoin válido. Não envie! Verifique no Explorer.',
      },
      {
        icon: '📊',
        title: 'Monitore Endereços Grandes Antes de Confiar',
        description: 'Se alguém envia endereço alegando ser exchange/serviço, verifique histórico. Endereços legítimos têm milhares de transações.',
      },
      {
        icon: '⚠️',
        title: 'Cuidado com Transações 0-Confirmações',
        description: 'Transações sem confirmação podem ser revertidas (double-spend attack). NUNCA confie em 0-conf para valores significativos.',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['ledger', 'etherscan', 'binance']),
  },

  // DeFi - Uniswap
  {
    slug: 'uniswap',
    name: 'Uniswap',
    category: 'defi',
    verified: true,
    shortDescription: 'DEX (exchange descentralizada) líder do Ethereum',
    officialUrl: 'https://app.uniswap.org',
    platforms: JSON.stringify(['Web', 'iOS', 'Android']),
    tags: JSON.stringify(['DEX', 'Swaps', 'Liquidez']),
    heroTitle: 'Uniswap: A DEX Mais Popular do Mundo',
    heroDescription: 'Protocol descentralizado que permite trocar tokens ERC-20 sem intermediários, com mais de $4 bilhões em volume diário',
    heroGradient: 'linear-gradient(135deg, #FF007A 0%, #E6006E 100%)',
    whyGoodTitle: 'Por que Uniswap é a DEX Líder?',
    whyGoodContent: JSON.stringify([
      'Uniswap é a DEX (exchange descentralizada) mais popular e confiável do Ethereum, processando bilhões em volume diário sem necessidade de custódia centralizada.',
      'Modelo AMM (Automated Market Maker) permite qualquer um fornecer liquidez e ganhar fees, democratizando o market making que antes era restrito a instituições.',
      'Totalmente não-custodial: você mantém controle total das suas chaves privadas. Uniswap é apenas interface para smart contracts na blockchain.',
      'Listagem permissionless significa que QUALQUER token ERC-20 pode ser negociado, sem aprovação central. Acesso a milhares de tokens que exchanges centralizadas não listam.',
      'Uniswap V3 introduziu liquidez concentrada, permitindo provedores de liquidez (LPs) ganharem até 4000x mais fees ao concentrarem capital em faixas de preço específicas.',
    ]),
    features: JSON.stringify([
      {
        icon: '💱',
        title: 'Swaps Instantâneos',
        description: 'Troque qualquer token ERC-20 por outro em segundos. Milhares de tokens disponíveis',
      },
      {
        icon: '💧',
        title: 'Fornecer Liquidez (LP)',
        description: 'Deposite pares de tokens em pools e ganhe 0,05-1% de fee em CADA swap. Rendimento passivo',
      },
      {
        icon: '🎯',
        title: 'Liquidez Concentrada (V3)',
        description: 'LPs podem concentrar capital em faixas de preço específicas para eficiência de capital até 4000x maior',
      },
      {
        icon: '🔓',
        title: 'Totalmente Não-Custodial',
        description: 'Você controla suas chaves. Uniswap nunca tem acesso aos seus fundos. Smart contracts auditados',
      },
      {
        icon: '🌐',
        title: 'Multi-Chain',
        description: 'Suporte para Ethereum, Polygon, Arbitrum, Optimism, BSC e mais. Mesmo protocolo, várias redes',
      },
      {
        icon: '🪙',
        title: 'Token UNI (Governança)',
        description: 'Holders de UNI votam em mudanças do protocolo. Governança descentralizada e comunitária',
      },
    ]),
    howToStartTitle: 'Como Usar o Uniswap',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Conecte Sua Wallet',
        description: 'Acesse app.uniswap.org e conecte MetaMask, Trust Wallet ou outra wallet compatível. Uniswap não custódia fundos.',
      },
      {
        number: 2,
        title: 'Escolha Tokens para Trocar',
        description: 'Selecione token que quer vender (From) e token que quer comprar (To). Uniswap mostra taxa de conversão e price impact.',
      },
      {
        number: 3,
        title: 'Revise Detalhes da Transação',
        description: 'Veja estimated output, price impact, minimum received (slippage) e fees de gas. Ajuste slippage se necessário.',
      },
      {
        number: 4,
        title: 'Aprove Token (Primeira Vez)',
        description: 'Na primeira vez que troca um token, precisa aprovar Uniswap router para gastá-lo. Isso custa gas. Aprovação única por token.',
      },
      {
        number: 5,
        title: 'Confirme Swap',
        description: 'Clique "Swap" e confirme na wallet. Aguarde confirmação da transação (15s-2min dependendo do gas fee).',
      },
    ]),
    pros: JSON.stringify([
      'DEX mais popular e líquida do Ethereum',
      'Totalmente descentralizado e não-custodial',
      'Listagem permissionless (acesso a todos os tokens)',
      'Smart contracts auditados e battle-tested',
      'Liquidez concentrada V3 (eficiência capital)',
      'Suporte multi-chain (Polygon, Arbitrum, etc)',
      'Open-source e governança comunitária',
      'Apps mobile iOS e Android',
    ]),
    cons: JSON.stringify([
      'Gas fees altos no Ethereum mainnet',
      'Price impact em tokens com pouca liquidez',
      'Slippage pode ser alto em swaps grandes',
      'Curva de aprendizado vs exchanges centralizadas',
      'Scam tokens podem estar listados (verifique sempre)',
    ]),
    faq: JSON.stringify([
      {
        question: 'Uniswap cobra taxas?',
        answer: 'Uniswap router não cobra. Você paga: 1) Fees para LPs (0,05-1% dependendo do pool), 2) Gas fees para Ethereum. Em L2s (Polygon, Arbitrum) gas é muito mais barato.',
      },
      {
        question: 'O que é slippage?',
        answer: 'Diferença entre preço esperado e preço executado. Se pool tem pouca liquidez, sua ordem pode mover o preço (price impact). Configure slippage tolerance (1-5%) para proteger.',
      },
      {
        question: 'Como fornecer liquidez e ganhar fees?',
        answer: 'Vá em "Pool", escolha par (ex: ETH/USDC), deposite ambos os tokens em quantidade proporcional. Você ganha porcentagem de CADA swap naquele pool. Risco: impermanent loss.',
      },
      {
        question: 'Por que preciso aprovar tokens?',
        answer: 'Smart contracts ERC-20 exigem aprovação explícita antes de gastarem seus tokens. É medida de segurança. Aprovação é única por token, não por swap.',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔍',
        title: 'SEMPRE Verifique Contract Address de Tokens',
        description: 'Scam tokens com nomes idênticos a projetos famosos são comuns. Verifique contract address no site oficial do projeto antes de comprar.',
      },
      {
        icon: '⚠️',
        title: 'Cuidado com Price Impact Alto',
        description: 'Se price impact >5%, pool tem pouca liquidez. Você pode estar pagando muito mais caro. Considere dividir em múltiplos swaps menores.',
      },
      {
        icon: '🎯',
        title: 'Configure Slippage Apropriado',
        description: '0,5-1% para tokens líquidos (ETH, USDC). 3-5% para tokens ilíquidos. Slippage muito alto = risco de front-running.',
      },
      {
        icon: '💼',
        title: 'Revise Aprovações Antigas',
        description: 'Use Etherscan Token Approvals ou Revoke.cash para revogar aprovações de tokens que não usa mais. Proteção contra hacks de contratos.',
      },
      {
        icon: '🔐',
        title: 'Use app.uniswap.org Oficial',
        description: 'Sites phishing fingem ser Uniswap. SEMPRE verifique URL: app.uniswap.org (não unisvvap.org ou uniswap-app.com). Salve nos favoritos.',
      },
      {
        icon: '📊',
        title: 'Pesquise Tokens Desconhecidos',
        description: 'Verifique no Etherscan: holders, liquidity, contract code. Evite tokens com 1 holder tendo 90%+ supply ou sem liquidez no Uniswap.',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['metamask', 'etherscan', 'aave']),
  },

  // DeFi - Raydium
  {
    slug: 'raydium',
    name: 'Raydium',
    category: 'defi',
    verified: true,
    shortDescription: 'DEX líder da Solana com AMM e order book híbrido',
    officialUrl: 'https://raydium.io',
    platforms: JSON.stringify(['Web']),
    tags: JSON.stringify(['Solana', 'DEX', 'AMM']),
    heroTitle: 'Raydium: A DEX Mais Rápida e Barata',
    heroDescription: 'AMM líder da Solana com liquidez compartilhada com Serum order book, oferecendo swaps ultra-rápidos e taxas de centavos',
    heroGradient: 'linear-gradient(135deg, #C64ADD 0%, #9945FF 100%)',
    whyGoodTitle: 'Por que Raydium é a DEX Favorita da Solana?',
    whyGoodContent: JSON.stringify([
      'Raydium é a DEX dominante do ecossistema Solana, aproveitando a velocidade (400ms) e baixíssimas taxas (~$0.00025) da rede para swaps praticamente instantâneos.',
      'Modelo híbrido único: AMM tradicional + liquidez compartilhada com Serum order book central, garantindo liquidez superior e melhores preços de execução.',
      'Primeiro AMM da Solana e mais battle-tested, processando bilhões em volume com segurança comprovada e sem hacks significativos desde lançamento.',
      'Interface extremamente rápida e responsiva aproveitando a velocidade da Solana. Swaps executam em <1 segundo vs 15-30 segundos no Ethereum.',
      'Farms e pools de liquidez oferecem APY atrativo (frequentemente 20-100%+) em recompensas RAY (token nativo), ideal para yield farming.',
    ]),
    features: JSON.stringify([
      {
        icon: '⚡',
        title: 'Swaps Ultra-Rápidos',
        description: 'Transações em <1 segundo graças à Solana. Fees de ~$0.00025. Experiência instantânea',
      },
      {
        icon: '🔗',
        title: 'Liquidez Compartilhada com Serum',
        description: 'AMM pools acessam liquidez do Serum order book central. Melhores preços e menos slippage',
      },
      {
        icon: '💧',
        title: 'Liquidity Pools e Farms',
        description: 'Forneça liquidez e ganhe fees de swap + recompensas RAY. APYs frequentemente 20-100%+',
      },
      {
        icon: '🚀',
        title: 'AcceleRaytor (Launchpad)',
        description: 'IDO platform para novos projetos Solana. Acesso antecipado a tokens antes de listagem pública',
      },
      {
        icon: '🎯',
        title: 'Concentrated Liquidity (CLMM)',
        description: 'Similar ao Uniswap V3. Provedores de liquidez concentram capital em faixas de preço para eficiência',
      },
      {
        icon: '📊',
        title: 'Trading Charts Avançados',
        description: 'Interface com gráficos profissionais, order book view, histórico de trades. Experiência de CEX',
      },
    ]),
    howToStartTitle: 'Como Usar o Raydium',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Conecte Wallet Solana',
        description: 'Acesse raydium.io e conecte Phantom, Solflare ou outra wallet Solana. Certifique-se de ter SOL para fees.',
      },
      {
        number: 2,
        title: 'Escolha Tokens para Swap',
        description: 'Selecione token para vender e comprar. Raydium mostra route, price impact e estimated output.',
      },
      {
        number: 3,
        title: 'Revise Detalhes',
        description: 'Verifique price, slippage, minimum received e fees (~$0.00025). Ajuste slippage se necessário.',
      },
      {
        number: 4,
        title: 'Confirme na Wallet',
        description: 'Clique "Swap" e aprove na Phantom/wallet. Transação confirma em <1 segundo. Muito mais rápido que Ethereum.',
      },
      {
        number: 5,
        title: 'Explore Farms (Opcional)',
        description: 'Vá em "Farms", escolha pool (ex: SOL-USDC), deposite liquidez e faça staking para ganhar recompensas RAY + fees.',
      },
    ]),
    pros: JSON.stringify([
      'Swaps ultra-rápidos (<1seg) e baratos ($0.00025)',
      'DEX mais líquida e popular da Solana',
      'Liquidez compartilhada com Serum (melhores preços)',
      'Farms com APY atrativo (20-100%+)',
      'Interface polida e profissional',
      'AcceleRaytor launchpad para novos projetos',
      'Concentrated liquidity (CLMM)',
      'Token RAY com governança',
    ]),
    cons: JSON.stringify([
      'Apenas Solana (não suporta Ethereum ou outras chains)',
      'Solana teve períodos de instabilidade de rede (downtime)',
      'Menos batalha-testado que Uniswap (mais novo)',
      'Scam tokens listados (verifique sempre)',
      'Impermanent loss em pools de liquidez',
    ]),
    faq: JSON.stringify([
      {
        question: 'Raydium é seguro?',
        answer: 'Sim, é a DEX mais estabelecida da Solana com smart contracts auditados. Porém, sempre há risco em DeFi. Use apenas fundos que pode perder e verifique tokens antes de comprar.',
      },
      {
        question: 'Por que fees são tão baixas vs Uniswap?',
        answer: 'Solana tem fees de rede de ~$0.00025 vs $5-50+ no Ethereum. Raydium aproveita isso. Fees de LP (0,25%) vão para provedores de liquidez, não para Raydium.',
      },
      {
        question: 'O que é liquidez compartilhada com Serum?',
        answer: 'Raydium pools AMM também acessam liquidez do Serum order book (DEX baseado em order book). Isso garante liquidez mais profunda e melhores preços.',
      },
      {
        question: 'Como fazer yield farming?',
        answer: 'Vá em "Farms", escolha pool (ex: RAY-SOL), deposite ambos os tokens proporcionalmente, receba LP tokens, faça staking. Ganhe fees de swap + recompensas RAY.',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔍',
        title: 'Verifique Mint Address de Tokens',
        description: 'Scam tokens com nomes idênticos são comuns. Verifique mint address no site oficial do projeto. Cole no Solscan para verificar.',
      },
      {
        icon: '⚠️',
        title: 'Cuidado com Rugs em Tokens Novos',
        description: 'Tokens recém-lançados podem ser rug pulls. Verifique liquidez trancada, holders, e se devs têm grande % do supply antes de investir.',
      },
      {
        icon: '🎯',
        title: 'Não Use Slippage >10% Sem Pesquisar',
        description: 'Slippage alto = risco de front-running ou token ilíquido. 1-3% é normal. Se token exige >10%, pesquise muito antes de comprar.',
      },
      {
        icon: '💼',
        title: 'Entenda Impermanent Loss',
        description: 'Fornecer liquidez tem risco de impermanent loss se preços dos tokens divergirem. Pools estáveis (USDC-USDT) têm menos risco que pools voláteis (SOL-meme coin).',
      },
      {
        icon: '🔐',
        title: 'Use raydium.io Oficial',
        description: 'Sites phishing são comuns. SEMPRE verifique URL: raydium.io. Salve nos favoritos. Nunca clique em links de DMs ou emails.',
      },
      {
        icon: '📊',
        title: 'Pesquise APYs Muito Altos',
        description: 'Farms com APY 1000%+ geralmente são tokens novos/arriscados. APY alto = risco alto. Verifique projeto antes de investir.',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['phantom', 'solscan', 'uniswap']),
  },

  // DeFi - Aave
  {
    slug: 'aave',
    name: 'Aave',
    category: 'defi',
    verified: true,
    shortDescription: 'Protocolo líder de lending e borrowing descentralizado',
    officialUrl: 'https://aave.com',
    platforms: JSON.stringify(['Web']),
    tags: JSON.stringify(['Lending', 'Borrowing', 'DeFi']),
    heroTitle: 'Aave: Banco Descentralizado do Futuro',
    heroDescription: 'Protocolo não-custodial com $64B+ TVL que permite emprestar crypto e ganhar juros ou tomar empréstimos usando cripto como colateral',
    heroGradient: 'linear-gradient(135deg, #B6509E 0%, #2EBAC6 100%)',
    whyGoodTitle: 'Por que Aave é o Protocolo de Lending Líder?',
    whyGoodContent: JSON.stringify([
      'Aave é o maior protocolo de lending/borrowing descentralizado com mais de $64 bilhões em TVL, processando dezenas de bilhões em volume mensal de forma totalmente não-custodial.',
      'Suporte para 12+ redes blockchain (Ethereum, Polygon, Avalanche, Arbitrum, Optimism, etc) permitindo acessar o protocolo em diferentes chains com fees variados.',
      'Sistema de overcollateralization protege credores: empréstimos exigem colateral >100% do valor emprestado, garantindo segurança mesmo em market crashes.',
      'Flash Loans inovadores permitem empréstimos de milhões sem colateral desde que sejam pagos na mesma transação, revolucionando arbitragem e liquidações.',
      '5+ anos de operação sem hacks significativos, múltiplas auditorias de segurança, programa de bug bounty e seguro contra insolvência demonstram robustez.',
    ]),
    features: JSON.stringify([
      {
        icon: '💰',
        title: 'Supply (Emprestar) e Ganhar Juros',
        description: 'Deposite USDC, ETH, etc e ganhe APY (~4-8% em stablecoins). Liquidez disponível 24/7 sem lock-up',
      },
      {
        icon: '🏦',
        title: 'Borrow (Pedir Emprestado)',
        description: 'Use crypto como colateral e pegue empréstimos. Útil para não vender holdings mas ter liquidez',
      },
      {
        icon: '⚡',
        title: 'Flash Loans',
        description: 'Empréstimos instantâneos de milhões sem colateral (pagos na mesma transação). Revolucionário para arbitragem',
      },
      {
        icon: '🌐',
        title: 'Multi-Chain (12+ Redes)',
        description: 'Ethereum, Polygon, Avalanche, Arbitrum, Optimism, BSC e mais. Escolha chain por fees',
      },
      {
        icon: '💎',
        title: 'GHO Stablecoin',
        description: 'Stablecoin nativa descentralizada do Aave. Mint GHO usando crypto como colateral',
      },
      {
        icon: '🛡️',
        title: 'Safety Module',
        description: 'Seguro contra insolvência. Stake AAVE tokens para proteger protocolo e ganhar rewards',
      },
    ]),
    howToStartTitle: 'Como Usar o Aave',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Conecte Wallet e Escolha Chain',
        description: 'Acesse app.aave.com, conecte MetaMask/wallet. Escolha rede (Ethereum para máxima liquidez, Polygon para fees baixos).',
      },
      {
        number: 2,
        title: 'Supply (Emprestar)',
        description: 'Vá em "Supply", escolha ativo (USDC, ETH, etc) e valor. Você começa a ganhar juros imediatamente. Pode sacar a qualquer momento.',
      },
      {
        number: 3,
        title: 'Borrow (Opcional)',
        description: 'Com collateral depositado, vá em "Borrow", escolha ativo e valor. Máximo é ~75% do collateral (depende do ativo). Pague juros.',
      },
      {
        number: 4,
        title: 'Monitore Health Factor',
        description: 'CRÍTICO: Health Factor >1 é seguro. Se cair <1, você é liquidado (perde parte do colateral). Monitore sempre se tiver borrow.',
      },
      {
        number: 5,
        title: 'Repay e Withdraw Quando Quiser',
        description: 'Repay empréstimos a qualquer momento. Withdraw seus fundos Supply sem lock-up. Liquidez sempre disponível.',
      },
    ]),
    pros: JSON.stringify([
      'Maior TVL em DeFi lending ($64B+)',
      '5+ anos de operação sem hacks significativos',
      'Suporte para 12+ blockchains',
      'APY competitivo (~4-8% stablecoins)',
      'Flash loans revolucionários',
      'GHO stablecoin descentralizada',
      'Governança descentralizada (AAVE token)',
      'Smart contracts auditados extensivamente',
    ]),
    cons: JSON.stringify([
      'Risco de liquidação se Health Factor <1',
      'Taxas de gas altas no Ethereum mainnet',
      'Complexidade pode intimidar iniciantes',
      'Smart contract risk (bugs são possíveis)',
      'Volatilidade de APY (muda com oferta/demanda)',
    ]),
    faq: JSON.stringify([
      {
        question: 'Aave é seguro?',
        answer: 'É um dos protocolos DeFi mais seguros: 5+ anos sem hacks, múltiplas auditorias, bug bounty program, seguro contra insolvência. Porém, sempre há risco em DeFi smart contracts.',
      },
      {
        question: 'O que acontece se ser liquidado?',
        answer: 'Se Health Factor <1, liquidadores pagam parte da sua dívida e recebem seu colateral com desconto (~5-10%). Você perde parte do colateral. SEMPRE monitore Health Factor.',
      },
      {
        question: 'Qual chain usar?',
        answer: 'Ethereum: máxima liquidez e segurança, mas gas caro. Polygon/Arbitrum: fees baixos (~$0.01), ótimo para valores pequenos. TVL menor mas suficiente.',
      },
      {
        question: 'O que são Flash Loans?',
        answer: 'Empréstimos de milhões que devem ser pagos na mesma transação. Sem colateral. Usado para arbitragem, liquidações, refinanciamento. Requer conhecimento técnico (smart contracts).',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '📊',
        title: 'SEMPRE Monitore Health Factor',
        description: 'Health Factor <1 = liquidação. Monitore DIARIAMENTE se tiver borrow. Adicione collateral ou repay debt se Health Factor caindo.',
      },
      {
        icon: '⚠️',
        title: 'Use Collateral Estável',
        description: 'ETH/BTC como collateral são voláteis. Se preço cai rápido, você pode ser liquidado. Stablecoins como colateral = mais seguro mas menos eficiente.',
      },
      {
        icon: '💰',
        title: 'Não Pegue Empréstimo Máximo',
        description: 'Se pode pegar 75% do collateral, pegue apenas 50-60%. Margem de segurança evita liquidação em volatilidade.',
      },
      {
        icon: '🔐',
        title: 'Use app.aave.com Oficial',
        description: 'Sites phishing roubam fundos. SEMPRE verifique URL: app.aave.com (não aave-app.com ou aave-protocol.com). Salve nos favoritos.',
      },
      {
        icon: '🌐',
        title: 'Comece em Polygon para Aprender',
        description: 'Fees baixos (~$0.01) vs Ethereum ($5-50). Teste com valores pequenos em Polygon antes de usar Ethereum mainnet.',
      },
      {
        icon: '📈',
        title: 'Entenda Riscos de Smart Contracts',
        description: 'Bugs em smart contracts podem drenar fundos (raro mas possível). Nunca invista mais do que pode perder. Aave é auditado mas risco zero não existe.',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['uniswap', 'metamask', 'etherscan']),
  },

  // TOOLS - CoinGecko
  {
    slug: 'coingecko',
    name: 'CoinGecko',
    category: 'tools',
    verified: true,
    shortDescription: 'Plataforma líder de dados e preços de criptomoedas',
    officialUrl: 'https://www.coingecko.com',
    platforms: JSON.stringify(['Web', 'iOS', 'Android']),
    tags: JSON.stringify(['Preços', 'Analytics', 'Tracking']),
    heroTitle: 'CoinGecko: Dados Completos de Cripto',
    heroDescription: 'Plataforma que rastreia 19.000+ criptomoedas e 1.400+ exchanges com dados em tempo real, charts e portfolio tracking',
    heroGradient: 'linear-gradient(135deg, #8BC53F 0%, #6FA82D 100%)',
    whyGoodTitle: 'Por que CoinGecko é Referência em Dados Cripto?',
    whyGoodContent: JSON.stringify([
      'CoinGecko rastreia mais de 19.000 criptomoedas e 1.400+ exchanges, oferecendo cobertura mais completa que qualquer concorrente, incluindo altcoins e projetos emergentes.',
      'Metodologia de pricing não-enviesada agrega dados de múltiplos exchanges e usa algoritmos para detectar anomalias, oferecendo preços mais precisos que simplesmente copiar de uma fonte.',
      'Completamente gratuito para uso básico: preços em tempo real, charts históricos, rankings, portfolio tracker - sem paywall ou limitações artificiais.',
      'Dados fundamentais completos além de preço: market cap, volume, supply, ATH/ATL, community stats, developer activity, permitindo análise profunda de projetos.',
      'Apps mobile excepcionais (iOS/Android) com notificações push personalizáveis para alertas de preço, permitindo monitorar portfolio de qualquer lugar.',
    ]),
    features: JSON.stringify([
      {
        icon: '📊',
        title: '19.000+ Cryptos Rastreadas',
        description: 'Cobertura mais completa da indústria. De Bitcoin a altcoins obscuras, tudo em um lugar',
      },
      {
        icon: '💰',
        title: 'Portfolio Tracker',
        description: 'Adicione suas holdings, veja valor total, performance, profit/loss. Sincroniza entre dispositivos',
      },
      {
        icon: '🔔',
        title: 'Alertas de Preço',
        description: 'Configure alertas para qualquer crypto. Notificações push quando atingir preço alvo',
      },
      {
        icon: '📈',
        title: 'Charts e Histórico',
        description: 'Gráficos históricos completos desde listagem. Comparações entre cryptos, timeframes personalizáveis',
      },
      {
        icon: '🏆',
        title: 'Rankings e Categories',
        description: 'Rank por market cap, volume, performance. Filtre por categoria (DeFi, NFT, Metaverse, etc)',
      },
      {
        icon: '🌐',
        title: 'Multi-Exchange Price Comparison',
        description: 'Compare preços de mesma crypto em diferentes exchanges. Encontre melhores deals',
      },
    ]),
    howToStartTitle: 'Como Usar o CoinGecko',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Acesse coingecko.com',
        description: 'Interface gratuita. Não precisa criar conta para ver preços (apenas para portfolio e alertas).',
      },
      {
        number: 2,
        title: 'Pesquise Crypto',
        description: 'Use barra de busca para encontrar qualquer crypto. Veja preço, market cap, volume, ATH/ATL, supply e links oficiais.',
      },
      {
        number: 3,
        title: 'Explore Charts',
        description: 'Clique em qualquer crypto para ver gráficos detalhados. Escolha timeframe (24h, 7d, 30d, 1y, All). Compare com Bitcoin/Ethereum.',
      },
      {
        number: 4,
        title: 'Crie Portfolio (Opcional)',
        description: 'Crie conta gratuita, vá em "Portfolio", adicione suas holdings (crypto + quantidade). Veja performance em tempo real.',
      },
      {
        number: 5,
        title: 'Configure Alertas',
        description: 'Baixe app mobile, configure notificações para preço alvo. Ex: "Avisar quando BTC atingir $50k" ou "quando ETH cair 10%".',
      },
    ]),
    pros: JSON.stringify([
      'Cobertura mais completa (19.000+ cryptos)',
      'Totalmente gratuito para uso básico',
      'Metodologia de pricing não-enviesada',
      'Portfolio tracker com sync entre dispositivos',
      'Apps mobile excelentes com notificações',
      'Dados fundamentais completos',
      'API gratuita disponível',
      'Sem anúncios intrusivos',
    ]),
    cons: JSON.stringify([
      'Alguns dados avançados requerem conta premium',
      'Interface pode parecer sobrecarregada',
      'API gratuita tem rate limits',
      'Preços podem ter pequeno delay vs tempo real',
    ]),
    faq: JSON.stringify([
      {
        question: 'CoinGecko é gratuito?',
        answer: 'Sim! Uso básico (preços, charts, rankings, portfolio) é 100% gratuito. Há plano premium para dados avançados e API sem limits, mas não é necessário para maioria.',
      },
      {
        question: 'Diferença entre CoinGecko e CoinMarketCap?',
        answer: 'Ambos são excelentes. CoinGecko tem metodologia mais transparente, interface mais limpa e é independente. CoinMarketCap é propriedade da Binance (desde 2020).',
      },
      {
        question: 'Como CoinGecko calcula preços?',
        answer: 'Agrega dados de centenas de exchanges, usa volume ponderado e algoritmos para detectar manipulação/wash trading. Mais preciso que usar preço de exchange única.',
      },
      {
        question: 'Portfolio Tracker é seguro?',
        answer: 'Sim. Você insere apenas QUANTIDADES, não conecta wallet. CoinGecko não tem acesso aos seus fundos. Apenas rastreia holdings que você informa manualmente.',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔐',
        title: 'Portfolio Não Conecta Wallet',
        description: 'CoinGecko portfolio é manual (você digita quantidades). Nunca conecte wallet ou forneça seed phrases. Ninguém precisa dessas informações.',
      },
      {
        icon: '🎯',
        title: 'Verifique Links Oficiais de Projetos',
        description: 'CoinGecko lista links oficiais (site, whitepaper, social). SEMPRE use esses links para acessar projetos, não resultados de Google.',
      },
      {
        icon: '⚠️',
        title: 'Novos Listings Podem Ser Scams',
        description: 'Cryptos recém-listadas podem ser rug pulls. Verifique market cap, volume, holders e comunidade antes de investir.',
      },
      {
        icon: '📊',
        title: 'Compare Preços Entre Exchanges',
        description: 'Use "Markets" tab para ver preços em diferentes exchanges. Grandes discrepâncias podem indicar problemas de liquidez.',
      },
      {
        icon: '🔍',
        title: 'Pesquise Antes de Comprar Altcoins',
        description: 'Veja market cap, volume 24h, supply, links sociais. Evite coins com market cap <$1M ou volume <$100k (risco altíssimo).',
      },
      {
        icon: '💼',
        title: 'Não Confie Cegamente em Rankings',
        description: 'Market cap pode ser manipulado. Verifique: volume real, distribuição de holders, projeto ativo, comunidade engajada.',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['coinmarketcap', 'defillama', 'binance']),
  },

  // TOOLS - DeFi Llama
  {
    slug: 'defillama',
    name: 'DeFi Llama',
    category: 'tools',
    verified: true,
    shortDescription: 'Maior agregador de dados DeFi com tracking de TVL e analytics',
    officialUrl: 'https://defillama.com',
    platforms: JSON.stringify(['Web']),
    tags: JSON.stringify(['DeFi', 'TVL', 'Analytics']),
    heroTitle: 'DeFi Llama: O Painel de Controle do DeFi',
    heroDescription: 'Plataforma de analytics que rastreia TVL (Total Value Locked) de 2.000+ protocolos DeFi em 200+ blockchains',
    heroGradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
    whyGoodTitle: 'Por que DeFi Llama é Essencial para DeFi?',
    whyGoodContent: JSON.stringify([
      'DeFi Llama é o padrão-ouro para tracking de TVL (Total Value Locked) em DeFi, rastreando mais de $90 bilhões bloqueados em 2.000+ protocolos de forma transparente e verificável.',
      'Cobertura incomparável: 200+ blockchains rastreadas, incluindo Ethereum, Solana, BSC, Polygon, Avalanche, e dezenas de chains emergentes, tudo em uma interface única.',
      'Metodologia completamente transparente: código open-source no GitHub permite qualquer um auditar como TVL é calculado, eliminando manipulação ou números inflados.',
      'Além de TVL, oferece dados sobre fees, revenue, volume, stablecoins, yields, hacks, fundraising e airdrops - hub completo de analytics DeFi.',
      'Totalmente gratuito, sem ads intrusivos, mantido pela comunidade. Sem conflitos de interesse (não pertence a nenhum protocolo ou exchange).',
    ]),
    features: JSON.stringify([
      {
        icon: '💰',
        title: 'TVL Tracker Universal',
        description: 'Track TVL de 2.000+ protocolos em 200+ chains. Ranking por tamanho, crescimento, dominância',
      },
      {
        icon: '📊',
        title: 'Charts e Comparações',
        description: 'Compare TVL histórico entre protocolos, chains e categorias. Identifique tendências e crescimento',
      },
      {
        icon: '💸',
        title: 'Fees e Revenue',
        description: 'Veja quanto cada protocolo gera em fees e revenue. Identifique protocolos mais lucrativos e sustentáveis',
      },
      {
        icon: '💎',
        title: 'Yields Aggregator',
        description: 'Encontre melhores APYs em lending, liquidity pools e farms. Filtre por risco, chain e ativo',
      },
      {
        icon: '⚠️',
        title: 'Hacks Database',
        description: 'Histórico completo de hacks em DeFi: valor roubado, data, vulnerabilidade explorada. Aprenda com erros',
      },
      {
        icon: '🪙',
        title: 'Stablecoins Dashboard',
        description: 'Track supply de todas as stablecoins, dominância, chains, collateralization. Métricas essenciais',
      },
    ]),
    howToStartTitle: 'Como Usar o DeFi Llama',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Acesse defillama.com',
        description: 'Interface gratuita, sem ads intrusivos. Não precisa criar conta.',
      },
      {
        number: 2,
        title: 'Explore TVL Rankings',
        description: 'Homepage mostra ranking de protocolos por TVL. Clique em qualquer um para ver detalhes: TVL histórico, chains, tokens.',
      },
      {
        number: 3,
        title: 'Compare Chains',
        description: 'Vá em "Chains" para ver ranking de blockchains por TVL. Identifique quais chains estão crescendo vs estagnadas.',
      },
      {
        number: 4,
        title: 'Encontre Yields',
        description: 'Vá em "Yields" para ver ranking de APYs. Filtre por chain, ativo (ETH, USDC, etc) e risco. Compare oportunidades.',
      },
      {
        number: 5,
        title: 'Pesquise Antes de Investir',
        description: 'Antes de usar protocolo DeFi, pesquise no DeFi Llama: TVL histórico, crescimento, audits, hacks anteriores, fees gerados.',
      },
    ]),
    pros: JSON.stringify([
      'Padrão-ouro para tracking de TVL em DeFi',
      'Cobertura incomparável (2.000+ protocolos, 200+ chains)',
      'Metodologia totalmente transparente (open-source)',
      'Yields aggregator encontra melhores APYs',
      'Hacks database aprenda com exploits passados',
      'Totalmente gratuito sem ads intrusivos',
      'Independente (sem conflitos de interesse)',
      'Atualizado em tempo real',
    ]),
    cons: JSON.stringify([
      'Interface pode parecer técnica para iniciantes',
      'Dados de TVL podem ter pequeno delay',
      'Alguns protocolos pequenos podem não estar listados',
      'Yields mostrados não consideram impermanent loss',
    ]),
    faq: JSON.stringify([
      {
        question: 'O que é TVL?',
        answer: 'Total Value Locked - total de valor (em USD) bloqueado em smart contracts de um protocolo. Métrica chave para medir tamanho e confiança em protocolos DeFi.',
      },
      {
        question: 'DeFi Llama é gratuito?',
        answer: 'Sim, 100% gratuito. Mantido pela comunidade sem ads intrusivos. API também é gratuita. Modelo sustentável através de doações.',
      },
      {
        question: 'TVL alto = protocolo seguro?',
        answer: 'NÃO necessariamente. TVL alto indica confiança, mas não garante segurança. Sempre verifique: audits, tempo de operação, hacks anteriores, equipe do projeto.',
      },
      {
        question: 'Como usar Yields para encontrar APYs?',
        answer: 'Vá em "Yields", filtre por chain e ativo desejado. Yields mostra APY base (fees de swap) + APY de rewards. Verifique "Stablecoin" (menos risco) vs "IL" (impermanent loss risk).',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔍',
        title: 'TVL Alto ≠ Automático Seguro',
        description: 'TVL alto é bom sinal mas não garante segurança. Verifique: audits, tempo de operação, equipe conhecida, código open-source.',
      },
      {
        icon: '⚠️',
        title: 'Pesquise Hacks Anteriores',
        description: 'Use "Hacks" database para ver se protocolo foi hackeado antes. Protocolos com hacks recentes = risco maior.',
      },
      {
        icon: '📊',
        title: 'TVL Crescendo Rápido = Atenção',
        description: 'Crescimento explosivo pode indicar hype ou insustentável. Verifique se crescimento é orgânico ou apenas yield farming temporário.',
      },
      {
        icon: '💸',
        title: 'APY Muito Alto = Risco Muito Alto',
        description: 'Yields >100% geralmente envolvem tokens voláteis ou novos. APY alto = risco de impermanent loss ou rug pull. Pesquise MUITO.',
      },
      {
        icon: '🔐',
        title: 'Verifique Auditorias',
        description: 'DeFi Llama mostra se protocolo foi auditado. Protocolos não-auditados = risco significativo. Use apenas com fundos que pode perder.',
      },
      {
        icon: '💼',
        title: 'Diversifique Protocolos',
        description: 'Não coloque tudo em um protocolo só, mesmo com TVL alto. Diversifique entre vários protocolos battle-tested para reduzir risco.',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['aave', 'uniswap', 'coingecko']),
  },

  // TOOLS - CoinMarketCap
  {
    slug: 'coinmarketcap',
    name: 'CoinMarketCap',
    category: 'tools',
    verified: true,
    shortDescription: 'Plataforma pioneira de tracking de preços e market cap de criptomoedas',
    officialUrl: 'https://coinmarketcap.com',
    platforms: JSON.stringify(['Web', 'iOS', 'Android']),
    tags: JSON.stringify(['Preços', 'Market Cap', 'Rankings']),
    heroTitle: 'CoinMarketCap: O Padrão da Indústria',
    heroDescription: 'Plataforma mais conhecida de dados cripto com 28.000+ moedas rastreadas e recursos educacionais completos',
    heroGradient: 'linear-gradient(135deg, #3861FB 0%, #1E40AF 100%)',
    whyGoodTitle: 'Por que CoinMarketCap é Referência Histórica?',
    whyGoodContent: JSON.stringify([
      'CoinMarketCap foi pioneiro (fundado em 2013) e estabeleceu o padrão da indústria para ranking de criptomoedas por market cap, sendo referência citada por mídia global.',
      'Rastreia mais de 28.000 criptomoedas e 600+ exchanges, oferecendo cobertura extremamente abrangente desde Bitcoin até os altcoins mais obscuros.',
      'Learn & Earn permite ganhar crypto gratuita completando cursos educacionais sobre diferentes projetos - excelente para iniciantes aprenderem e ganharem simultaneamente.',
      'Alexandria (seção educacional) oferece artigos, glossário e guias completos sobre blockchain, crypto e DeFi - hub educacional de alta qualidade.',
      'Propriedade da Binance desde 2020 garante recursos e integração com maior exchange do mundo, oferecendo links diretos para trading.',
    ]),
    features: JSON.stringify([
      {
        icon: '📊',
        title: '28.000+ Criptomoedas',
        description: 'Cobertura massiva de cryptos, de Bitcoin a projetos micro-cap. Rankings completos por market cap',
      },
      {
        icon: '🎓',
        title: 'Learn & Earn',
        description: 'Complete quizzes educacionais sobre projetos crypto e ganhe tokens gratuitos. Aprenda ganhando',
      },
      {
        icon: '📚',
        title: 'Alexandria (Educação)',
        description: 'Biblioteca completa de artigos, guias, glossário crypto. Aprenda blockchain, DeFi, NFTs e mais',
      },
      {
        icon: '💰',
        title: 'Portfolio Tracker',
        description: 'Adicione holdings, conecte wallets via API, veja P&L. Tracking completo de investimentos',
      },
      {
        icon: '🏆',
        title: 'Rankings e Categorias',
        description: 'Rank por market cap, volume, performance. Filtre por categoria (DeFi, Metaverse, Gaming, etc)',
      },
      {
        icon: '📱',
        title: 'Apps Mobile Premium',
        description: 'iOS e Android com widgets, notificações de preço, watchlists. Monitore portfolio mobile',
      },
    ]),
    howToStartTitle: 'Como Usar o CoinMarketCap',
    howToStartSteps: JSON.stringify([
      {
        number: 1,
        title: 'Acesse coinmarketcap.com',
        description: 'Interface gratuita. Não precisa conta para ver rankings e preços (apenas para portfolio e Learn & Earn).',
      },
      {
        number: 2,
        title: 'Explore Rankings',
        description: 'Homepage mostra top 100 por market cap. Clique em crypto para ver: preço, charts, supply, volume, links oficiais, whitepaper.',
      },
      {
        number: 3,
        title: 'Learn & Earn (Ganhe Crypto Grátis)',
        description: 'Crie conta, vá em "Learn", complete quizzes educacionais. Ganhe tokens dos projetos sobre os quais aprendeu. Totalmente gratuito.',
      },
      {
        number: 4,
        title: 'Crie Portfolio',
        description: 'Vá em "Portfolio", adicione holdings (manual ou conecte exchange via API). Veja performance, P&L, diversificação.',
      },
      {
        number: 5,
        title: 'Leia Alexandria para Aprender',
        description: 'Vá em "Learn > Alexandria" para ler guias educacionais. Aprenda conceitos: blockchain, DeFi, staking, NFTs, etc.',
      },
    ]),
    pros: JSON.stringify([
      'Plataforma mais conhecida e estabelecida (desde 2013)',
      'Cobertura massiva (28.000+ cryptos)',
      'Learn & Earn ganhe crypto estudando',
      'Alexandria hub educacional completo',
      'Portfolio tracker com API de exchanges',
      'Integração com Binance (maior exchange)',
      'Apps mobile excelentes',
      'Reconhecimento global e citado pela mídia',
    ]),
    cons: JSON.stringify([
      'Propriedade da Binance pode gerar viés',
      'Interface pode parecer sobrecarregada',
      'Anúncios presentes (gratuito mas com ads)',
      'Alguns dados podem favorecer projetos parceiros',
      'Metodologia menos transparente que CoinGecko',
    ]),
    faq: JSON.stringify([
      {
        question: 'CoinMarketCap é confiável?',
        answer: 'Sim, é referência da indústria desde 2013. Porém, é propriedade da Binance desde 2020, o que pode gerar viés. Use junto com CoinGecko para comparação.',
      },
      {
        question: 'Learn & Earn é legítimo?',
        answer: 'Sim! Totalmente legítimo. Projetos pagam CMC para educar usuários. Você completa quiz simples e recebe tokens reais na sua wallet. Pode ganhar $50-100+ total.',
      },
      {
        question: 'Diferença vs CoinGecko?',
        answer: 'CMC: mais conhecido, Learn & Earn, propriedade Binance. CoinGecko: metodologia mais transparente, independente, interface mais limpa. Ambos excelentes.',
      },
      {
        question: 'Portfolio Tracker requer conectar wallet?',
        answer: 'Não. Você pode adicionar holdings manualmente OU conectar via API de exchanges (leitura apenas). Nunca forneça seed phrases - não é necessário.',
      },
    ]),
    securityTips: JSON.stringify([
      {
        icon: '🔐',
        title: 'Nunca Conecte Wallet Diretamente',
        description: 'Portfolio usa API de leitura de exchanges OU entrada manual. NUNCA forneça seed phrases. CoinMarketCap legítimo nunca pede.',
      },
      {
        icon: '🎯',
        title: 'Verifique Links Oficiais',
        description: 'CMC lista links oficiais de projetos. Use ESSES links, não resultados de Google. Golpistas pagam Google Ads para aparecer primeiro.',
      },
      {
        icon: '⚠️',
        title: 'Novos Listings Podem Ser Scams',
        description: 'Cryptos recém-listadas podem ser rug pulls. Verifique: market cap, volume, holders, código, auditorias antes de investir.',
      },
      {
        icon: '📊',
        title: 'Market Cap Pode Ser Manipulado',
        description: 'Low float high FDV pode inflar market cap. Verifique circulating supply vs total supply. Grande diferença = vermelho.',
      },
      {
        icon: '🔍',
        title: 'Pesquise Fundamentals',
        description: 'Não compre só porque está em alta. Verifique: projeto real? Team doxxed? Whitepaper sólido? Comunidade ativa? Código open-source?',
      },
      {
        icon: '💼',
        title: 'Cuidado com Pump & Dumps',
        description: 'Cryptos com picos súbitos de volume podem ser pump & dump. Evite FOMO. Investigue sempre antes de comprar em alta.',
      },
    ]),
    showCompatibleWallets: false,
    relatedResources: JSON.stringify(['coingecko', 'binance', 'defillama']),
  },
];
