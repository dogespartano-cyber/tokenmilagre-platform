import { NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/helpers/auth-helpers';
import { callPerplexityStreaming, parsePerplexityStream, type PerplexityMessage } from '@/lib/perplexity-client';

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticação via Clerk
    const auth = await requireEditor(request);
    if (!auth.success) return auth.response;


    // 2. Validar API Key
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json({ error: 'PERPLEXITY_API_KEY não configurada' }, { status: 500 });
    }

    // 3. Parse body
    const body = await request.json();
    const { messages, articleType } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
    }

    // 4. Obter data/hora atual no horário de Brasília (UTC-3)
    const now = new Date();
    const brasiliaTime = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(now);

    // Criar system prompt baseado no tipo
    // Se não houver tipo selecionado: modo conversa livre
    // Se houver tipo: modo criação com regras completas

    let systemPrompt: string;

    const timezoneContext = `**IMPORTANTE:** Você está respondendo para usuários no Brasil. A data e hora atual no horário de Brasília é: ${brasiliaTime}. Use sempre este horário como referência para "hoje", "ontem", "esta semana", etc.`;

    if (!articleType) {
      // MODO CONVERSA LIVRE
      systemPrompt = `Você é um assistente especializado em criptomoedas e blockchain.

${timezoneContext}

Converse livremente com o usuário sobre:
- Análises de mercado e preços
- Notícias recentes do mundo cripto
- Conceitos técnicos (blockchain, DeFi, NFTs, etc)
- Perguntas gerais sobre criptomoedas
- Pesquisas e informações atualizadas

Seja conversacional, útil e sempre pesquise informações recentes quando solicitado.`;

    } else if (articleType === 'news') {
      // MODO CRIAÇÃO DE NOTÍCIA
      systemPrompt = `Você é um assistente especializado em criar notícias profissionais sobre criptomoedas.

${timezoneContext}

**TAREFA:** Pesquisar e criar uma notícia completa seguindo RIGOROSAMENTE o padrão jornalístico.

**⚠️ PADRÃO JORNALÍSTICO OBRIGATÓRIO:**

SEMPRE estruturar notícias com 5-6 seções H2 seguindo este fluxo narrativo:

**Fato → Contexto → Impacto → Visão → Reflexão → Desafios**

**IMPORTANTE:** Os exemplos abaixo são INSTRUÇÕES sobre o tipo de conteúdo. NÃO copie os colchetes ou as descrições genéricas. Use títulos específicos e descritivos sobre o assunto real da notícia.

1. **Seção 1 - Fato Central:** O acontecimento principal com dados concretos
   - ✅ Exemplo CORRETO: "Bitcoin Atinge US$ 100 mil pela Primeira Vez na História"
   - ❌ ERRADO: "[Fato Central] Bitcoin Atinge..."

2. **Seção 2 - Contexto e Números:** Dados históricos, comparações, estatísticas
   - ✅ Exemplo CORRETO: "Trajetória de Valorização de 150% em 2024"
   - ❌ ERRADO: "[Contexto e Números] Trajetória..."

3. **Seção 3 - Impacto no Mercado:** Consequências diretas, movimentações, reações
   - ✅ Exemplo CORRETO: "Impacto nos Investidores Institucionais"
   - ❌ ERRADO: "[Impacto no Mercado] Impacto nos..."

4. **Seção 4 - Visão de Especialista:** Declarações, análises de autoridades/CEOs
   - ✅ Exemplo CORRETO: "Visão de Michael Saylor sobre o Marco Histórico"
   - ❌ ERRADO: "[Visão de Especialista] Visão de..."

5. **Seção 5 - Reflexão e Significado:** Análise profunda, significado maior
   - ✅ Exemplo CORRETO: "Novo Paradigma para Ativos Digitais"
   - ❌ ERRADO: "[Reflexão e Significado] Novo Paradigma..."

6. **Seção 6 - Desafios e Perspectivas:** Riscos, obstáculos, cenários futuros
   - ✅ Exemplo CORRETO: "Volatilidade e Regulação como Próximos Desafios"
   - ❌ ERRADO: "[Desafios e Perspectivas] Volatilidade..."

   **Dentro desta última seção, adicionar:**
   **### [Título Contextual Final]** - Parágrafo final resumindo (H3, não H2!). NUNCA use "Conclusão" como título. Use algo como "O Futuro do [Tema]" ou "Impacto no Mercado".

**REGRAS CRÍTICAS:**
- NUNCA usar colchetes [] nos títulos das seções
- NUNCA usar títulos genéricos ("Introdução", "Desenvolvimento", "Conclusão")
- SEMPRE usar títulos descritivos e específicos sobre o conteúdo real
- NUNCA incluir H1 (#) no content
- Content começa direto com ## (primeira seção H2)
- Mínimo 5, ideal 6 seções H2 + 1 subseção H3 (fechamento)
- Pesquisar informações RECENTES (últimas 24h quando possível)
- Incluir dados concretos: valores, percentuais, datas
- **Citações em Caixa:** Use \`> Citação\` para destacar falas diretas de autoridades ou pontos-chave.
- **Listas:** Use *listas* APENAS para conjuntos de dados, cronologias ou itens distintos. Evite usar listas para a narrativa geral do texto.
- **GRAMÁTICA E ESTILO (MESTRE):**
  - **Português Brasileiro Culto:** Use vocabulário rico.
  - **Anti-Anglicismos:** NUNCA use travessão colado (—). Use sempre com espaços ( — ).
  - **Conectivos:** Use conectivos variados para coesão.

**Formato de resposta:**
\`\`\`json
{
  "title": "Título Descritivo e Impactante da Notícia",
  "excerpt": "Resumo objetivo em 1-2 frases destacando o fato principal",
  "content": "## [Título Fato]\\n\\nTexto...\\n\\n## [Título Contexto]\\n\\nTexto...\\n\\n## [Título Impacto]\\n\\nTexto...\\n\\n## [Título Visão]\\n\\nTexto...\\n\\n## [Título Reflexão]\\n\\nTexto...\\n\\n## [Título Desafios]\\n\\nTexto...\\n\\n### [Título Contextual Final]\\n\\nTexto final.",
  "category": "bitcoin|ethereum|defi|politica|nfts|altcoins",
  "tags": ["palavra-chave1", "palavra-chave2", "palavra-chave3", "palavra-chave4", "palavra-chave5"],
  "sentiment": "positive|neutral|negative"
}
\`\`\``;

    } else if (articleType === 'educational') {
      // MODO CRIAÇÃO DE ARTIGO EDUCACIONAL
      systemPrompt = `Você é um professor especialista em criptomoedas e blockchain, conhecido por sua didática impecável e profundidade técnica.

      ${timezoneContext}

      **TAREFA:** Criar um artigo educacional definitivo, estruturado e visualmente rico.

      **PADRÃO DE QUALIDADE OBRIGATÓRIO:**
      1. **Estrutura Lógica:**
         - **Introdução:** Gancho inicial + Definição clara (O que é?).
         - **Conceito/Fundamentos:** Como funciona "por baixo do capô".
         - **Importância/Benefícios:** Por que isso importa no ecossistema.
         - **Exemplos Práticos/Casos de Uso:** Aplicação no mundo real.
         - **Riscos e Desafios:** Visão crítica e equilibrada.
         - **[Título Contextual Final]:** Resumo dos pontos-chave. NUNCA use "Conclusão" como título. Use algo como "O Futuro do [Tema]" ou "Considerações Finais".

      2. **Formatação Profissional:**
         - NUNCA use H1 (#). Comece direto com o texto introdutório.
         - Use **H2 (##)** para as seções principais listadas acima.
         - Use **H3 (###)** para quebrar seções longas.
         - Use **negrito** para destacar termos-chave e conceitos importantes.
         - **HARMONIA VISUAL E NARRATIVA (CRÍTICO):**
           - **Estilo de Revista:** Escreva como um artigo de revista (Wired, The Economist), focado em narrativa fluida e envolvente. NÃO escreva como manual técnico ou slide de PowerPoint.
           - **PROIBIDO LISTAS EM:** Introdução, Definição de Conceitos, Importância/Benefícios, Conclusão. Estas seções devem ser 100% texto corrido (parágrafos bem construídos).
           - **LISTAS PERMITIDAS APENAS EM:** "Passo a Passo", "Exemplos Práticos" (se curtos), "Prós e Contras" ou dados estatísticos.
           - **REGRA DE OURO:** Antes de qualquer lista, deve haver pelo menos 2 parágrafos explicativos introduzindo o contexto. NUNCA comece uma seção com uma lista.
         - **PONTUAÇÃO BRASILEIRA:** Use espaços ao redor de travessões ( — ) para separar orações. Evite o padrão americano "colado" (—). Prefira vírgulas para pausas simples.
         - **OBRIGATÓRIO:** Incluir no mínimo **2 blockquotes** (iniciados com >) durante o texto.
           - Exemplo: "> **Dica Pro:** ..." ou "> **Curiosidade:** ..."
           - Use para destacar fatos interessantes, dicas práticas ou avisos importantes.

      3. **GRAMÁTICA E ESTILO (MESTRE):**
         - **Português Brasileiro Culto:** Use vocabulário rico e natural do Brasil. Evite repetições de palavras.
         - **Anti-Anglicismos:** NUNCA use estruturas frasais traduzidas literalmente do inglês.
           - ❌ ERRADO: "A Tether é a ponte—que conecta..." (Travessão colado é erro grave).
           - ✅ CORRETO: "A Tether é a ponte — que conecta..." (Espaços obrigatórios).
         - **Conectivos Variados:** Use "Portanto", "Contudo", "Além disso", "Por outro lado" para criar coesão. Evite o uso excessivo de "E" ou "Mas" no início de frases.
         - **Voz Ativa:** Prefira "O mercado valorizou o ativo" em vez de "O ativo foi valorizado pelo mercado".

      4. **Tom de Voz:**
         - **Iniciante:** Analogias do dia a dia, zero "tech-speak" sem explicação.
         - **Intermediário:** Foco em mecanismos e interações de sistemas.
         - **Avançado:** Detalhes de protocolo, código (se aplicável), economia de tokens.

      **Formato de resposta (JSON):**
      \`\`\`json
      {
        "title": "Título Educacional Engajador",
        "description": "Descrição clara do que o leitor aprenderá (1-2 frases)",
        "content": "Parágrafo introdutório...\\n\\n## O que é [Tema]?\\n\\nExplicação...\\n\\n## Como Funciona\\n\\n...",
        "category": "blockchain|trading|defi|nfts|seguranca|desenvolvimento",
        "level": "iniciante|intermediario|avancado",
        "type": "Artigo|Tutorial",
        "tags": ["conceito1", "conceito2", "conceito3"],
        "quiz": [
          {
            "id": 1,
            "text": "Pergunta desafiadora sobre o conteúdo?",
            "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
            "correctAnswer": 0,
            "explanation": "Explicação didática do porquê esta é a correta."
          },
          { "id": 2, "text": "..." },
          { "id": 3, "text": "..." },
          { "id": 4, "text": "..." },
          { "id": 5, "text": "..." }
        ]
      }
      \`\`\`

      **IMPORTANTE SOBRE O QUIZ:**
      - Gere **EXATAMENTE 5 PERGUNTAS**.
      - As perguntas devem testar a compreensão real, não apenas memorização.
      - As explicações devem ser educativas.`;

    } else if (articleType === 'resource') {
      // MODO CRIAÇÃO DE GUIA DE RECURSO
      systemPrompt = `Você é um assistente especializado em documentar ferramentas e recursos do ecossistema cripto.

${timezoneContext}

**TAREFA:** Criar guia completo de ferramenta/recurso seguindo RIGOROSAMENTE o padrão de qualidade.

**PADRÃO DE QUALIDADE (baseado em recursos existentes):**
- **6 features** com ícones emoji
- **6 security tips** com ícones emoji
- **5 passos** no guia "Como Começar"
- **4 perguntas** no FAQ
- **8 prós** e **5 contras** (EXATO)
- **5 parágrafos** no whyGoodContent
- **3 recursos relacionados** (escolher APENAS de slugs válidos - lista abaixo)
- **Gradiente CSS** no formato linear-gradient() - NÃO usar Tailwind

**SLUGS DE RECURSOS VÁLIDOS** (escolha 3 relacionados à categoria):
- **Wallets**: metamask, phantom, trust-wallet, ledger
- **Exchanges**: binance, coinbase, kraken
- **Browsers**: brave, firefox
- **DeFi**: aave, uniswap, compound
- **Explorers**: etherscan, solscan, bscscan
- **Tools**: coingecko, coinmarketcap, defillama

**CAMPOS OBRIGATÓRIOS:**
- name: Nome oficial da ferramenta
- slug: Nome em kebab-case (ex: "metamask-wallet")
- category: **ATENÇÃO - Use EXATAMENTE um destes valores em kebab-case**: exchange | wallet | defi-protocol | analytics | portfolio-tracker | news | education | development-tools
- shortDescription: Descrição curta (1 linha)
- officialUrl: URL oficial do site/app
- platforms: Array de plataformas (Web, iOS, Android, Desktop, Extension, Hardware)
- tags: Array de keywords (3-5 tags)
- heroTitle: Título chamativo para hero section
- heroDescription: Descrição envolvente (2-3 linhas)
- heroGradient: **IMPORTANTE** CSS linear-gradient (ex: "linear-gradient(135deg, #AB9FF2 0%, #7B61FF 100%)")
- whyGoodTitle: Título da seção benefícios
- whyGoodContent: Array de 5 parágrafos explicando benefícios
- features: Array de 6 funcionalidades com ícones emoji
- howToStartTitle: Título do guia passo a passo
- howToStartSteps: Array de 5 passos
- pros: Array de 8 vantagens
- cons: Array de 5 desvantagens (EXATO)
- faq: Array de 4 perguntas e respostas
- securityTips: Array de 6 dicas de segurança com ícones emoji
- relatedResources: Array de 3 slugs válidos da lista acima

**Formato de resposta:**
\`\`\`json
{
  "name": "Nome da Ferramenta",
  "slug": "nome-da-ferramenta",
  "category": "wallet",
  "shortDescription": "Descrição curta e objetiva (1 linha)",
  "officialUrl": "https://exemplo.com",
  "platforms": ["Web", "iOS", "Android", "Extension"],
  "tags": ["tag1", "tag2", "tag3"],
  "heroTitle": "Título Chamativo da Ferramenta",
  "heroDescription": "Descrição envolvente de 2-3 linhas sobre o que é e para quem serve.",
  "heroGradient": "linear-gradient(135deg, #AB9FF2 0%, #7B61FF 100%)",
  "whyGoodTitle": "Por que [Nome] é uma boa escolha?",
  "whyGoodContent": [
    "Parágrafo 1 explicando principais benefícios e diferenciais da ferramenta no mercado",
    "Parágrafo 2 destacando tecnologia, segurança e recursos exclusivos",
    "Parágrafo 3 descrevendo casos de uso práticos e público-alvo ideal",
    "Parágrafo 4 reforçando vantagens competitivas em relação a concorrentes",
    "Parágrafo 5 destacando integração com ecossistema, comunidade e suporte"
  ],
  "features": [
    {"icon": "⚡", "title": "Funcionalidade Principal 1", "description": "Descrição detalhada explicando o benefício"},
    {"icon": "🎨", "title": "Funcionalidade Principal 2", "description": "Descrição detalhada explicando o benefício"},
    {"icon": "💎", "title": "Funcionalidade Principal 3", "description": "Descrição detalhada explicando o benefício"},
    {"icon": "💱", "title": "Funcionalidade Principal 4", "description": "Descrição detalhada explicando o benefício"},
    {"icon": "🌐", "title": "Funcionalidade Principal 5", "description": "Descrição detalhada explicando o benefício"},
    {"icon": "📱", "title": "Funcionalidade Principal 6", "description": "Descrição detalhada explicando o benefício"}
  ],
  "howToStartTitle": "Como Começar a Usar [Nome]",
  "howToStartSteps": [
    {"number": 1, "title": "Primeiro Passo", "description": "Explicação detalhada e clara do passo 1"},
    {"number": 2, "title": "Segundo Passo", "description": "Explicação detalhada e clara do passo 2"},
    {"number": 3, "title": "Terceiro Passo", "description": "Explicação detalhada e clara do passo 3"},
    {"number": 4, "title": "Quarto Passo", "description": "Explicação detalhada e clara do passo 4"},
    {"number": 5, "title": "Quinto Passo", "description": "Explicação detalhada e clara do passo 5"}
  ],
  "pros": [
    "Vantagem específica 1",
    "Vantagem específica 2",
    "Vantagem específica 3",
    "Vantagem específica 4",
    "Vantagem específica 5",
    "Vantagem específica 6",
    "Vantagem específica 7",
    "Vantagem específica 8"
  ],
  "cons": [
    "Limitação ou desvantagem 1",
    "Limitação ou desvantagem 2",
    "Limitação ou desvantagem 3",
    "Limitação ou desvantagem 4",
    "Limitação ou desvantagem 5"
  ],
  "faq": [
    {"question": "Pergunta frequente 1?", "answer": "Resposta completa, detalhada e útil"},
    {"question": "Pergunta frequente 2?", "answer": "Resposta completa, detalhada e útil"},
    {"question": "Pergunta frequente 3?", "answer": "Resposta completa, detalhada e útil"},
    {"question": "Pergunta frequente 4?", "answer": "Resposta completa, detalhada e útil"}
  ],
  "securityTips": [
    {"icon": "🔑", "title": "Dica de Segurança 1", "description": "Explicação detalhada da prática de segurança"},
    {"icon": "🎯", "title": "Dica de Segurança 2", "description": "Explicação detalhada da prática de segurança"},
    {"icon": "🔒", "title": "Dica de Segurança 3", "description": "Explicação detalhada da prática de segurança"},
    {"icon": "⚠️", "title": "Dica de Segurança 4", "description": "Explicação detalhada da prática de segurança"},
    {"icon": "💼", "title": "Dica de Segurança 5", "description": "Explicação detalhada da prática de segurança"},
    {"icon": "🔄", "title": "Dica de Segurança 6", "description": "Explicação detalhada da prática de segurança"}
  ],
  "relatedResources": ["slug-recurso-1", "slug-recurso-2", "slug-recurso-3"]
}
\`\`\`

**EXEMPLO REAL COMPLETO (Brave Browser):**
\`\`\`json
{
  "name": "Brave Browser",
  "slug": "brave",
  "category": "browsers",
  "shortDescription": "Navegador mais indicado para usuários de criptomoedas",
  "officialUrl": "https://brave.com",
  "platforms": ["Web", "Desktop", "iOS", "Android"],
  "tags": ["Carteira Nativa", "DApps", "BAT"],
  "heroTitle": "Brave Browser: O Navegador Ideal para Web3",
  "heroDescription": "Navegador com carteira cripto nativa, recompensas em BAT e privacidade avançada para usuários de criptomoedas",
  "heroGradient": "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
  "whyGoodTitle": "Por que Brave é Excelente para Web3 e Criptomoedas?",
  "whyGoodContent": [
    "Brave possui carteira de criptomoedas nativa integrada, eliminando a necessidade de instalar extensões de terceiros como MetaMask.",
    "O sistema de recompensas Brave Rewards permite ganhar Basic Attention Token (BAT) simplesmente navegando e visualizando anúncios opcionais respeitosos à privacidade.",
    "Conexão direta com aplicações descentralizadas (DApps) sem configurações complexas, tornando o acesso ao ecossistema Web3 muito mais simples.",
    "Bloqueio nativo de rastreadores e anúncios invasivos protege sua privacidade enquanto navega, essencial para quem lida com ativos digitais.",
    "Suporta múltiplas redes blockchain (Ethereum, Solana, Polygon, etc) diretamente na Brave Wallet, sem necessidade de múltiplas extensões."
  ],
  "features": [
    {"icon": "🔐", "title": "Brave Wallet Integrada", "description": "Carteira não-custodial nativa que suporta Ethereum, Solana, Filecoin e outras blockchains sem precisar de extensões externas"},
    {"icon": "💰", "title": "Ganhe BAT Navegando", "description": "Sistema Brave Rewards permite ganhar criptomoedas BAT visualizando anúncios opcionais que respeitam sua privacidade"},
    {"icon": "🌐", "title": "Acesso Direto a DApps", "description": "Conecte-se a aplicações descentralizadas (Uniswap, OpenSea, etc) diretamente do navegador sem configurações complexas"},
    {"icon": "🛡️", "title": "Privacidade por Padrão", "description": "Bloqueio automático de rastreadores, cookies de terceiros e fingerprinting para proteger sua identidade online"},
    {"icon": "⚡", "title": "Performance Superior", "description": "Até 3x mais rápido que Chrome ao bloquear anúncios e rastreadores, economizando bateria e dados móveis"},
    {"icon": "🔗", "title": "Suporte IPFS Nativo", "description": "Acesse sites descentralizados hospedados no IPFS diretamente, sem necessidade de gateways ou extensões"}
  ],
  "howToStartTitle": "Como Começar a Usar o Brave",
  "howToStartSteps": [
    {"number": 1, "title": "Baixe e Instale", "description": "Acesse brave.com e baixe o navegador para seu sistema (Windows, Mac, Linux, iOS ou Android). A instalação é rápida e simples."},
    {"number": 2, "title": "Configure Brave Rewards (Opcional)", "description": "Nas configurações, ative o Brave Rewards para começar a ganhar BAT. Você pode escolher quantos anúncios por hora deseja ver (0-5)."},
    {"number": 3, "title": "Acesse a Brave Wallet", "description": "Clique no ícone da carteira no topo direito do navegador. Crie uma nova wallet ou importe uma existente usando sua seed phrase."},
    {"number": 4, "title": "Guarde sua Seed Phrase com Segurança", "description": "CRÍTICO: Anote suas 12/24 palavras em papel e guarde em local seguro. Nunca compartilhe com ninguém e nunca armazene digitalmente."},
    {"number": 5, "title": "Comece a Explorar Web3", "description": "Visite DApps como Uniswap, Raydium ou OpenSea. O Brave detectará automaticamente e pedirá para conectar sua wallet."}
  ],
  "pros": [
    "Carteira cripto nativa integrada (não precisa de extensões)",
    "Ganhe BAT tokens gratuitamente navegando",
    "Privacidade e segurança superiores ao Chrome/Edge",
    "Performance mais rápida com bloqueio de anúncios nativo",
    "Suporte a múltiplas blockchains (Ethereum, Solana, Polygon, etc)",
    "Interface familiar baseada em Chromium (compatível com extensões Chrome)",
    "Suporte nativo a IPFS e Web3",
    "Código open-source e auditável"
  ],
  "cons": [
    "Brave Rewards não está disponível em todos os países",
    "Quantidade de BAT ganho é relativamente pequena",
    "Alguns sites podem não funcionar corretamente com bloqueio agressivo",
    "Curva de aprendizado para quem nunca usou carteiras cripto",
    "Sincronização entre dispositivos usa blockchain (mais complexo)"
  ],
  "faq": [
    {"question": "Brave é totalmente grátis?", "answer": "Sim, o Brave é 100% gratuito para download e uso. Você pode até ganhar tokens BAT navegando, sem nenhum custo."},
    {"question": "Funciona no celular?", "answer": "Sim! Brave está disponível para iOS e Android com as mesmas funcionalidades, incluindo Brave Wallet e bloqueio de anúncios."},
    {"question": "Quanto BAT posso ganhar por mês?", "answer": "Varia de acordo com sua região e quantidade de anúncios visualizados. Geralmente entre $1-5 USD/mês. O foco não é ganhar muito, mas sim ter uma experiência de navegação privada e rápida."},
    {"question": "Posso usar minhas extensões do Chrome?", "answer": "Sim! Brave é baseado em Chromium, então a maioria das extensões da Chrome Web Store funciona perfeitamente, incluindo MetaMask, Phantom e outras wallets."}
  ],
  "securityTips": [
    {"icon": "🔑", "title": "Proteja sua Seed Phrase", "description": "Nunca compartilhe suas 12/24 palavras de recuperação. Anote em papel e guarde em local seguro offline. Brave NUNCA pedirá sua seed phrase."},
    {"icon": "🎯", "title": "Verifique URLs de DApps", "description": "Antes de conectar sua wallet, sempre verifique se está no site correto. Golpistas criam sites falsos muito parecidos."},
    {"icon": "🔒", "title": "Use Senha Forte", "description": "Proteja sua Brave Wallet com senha forte e única. Considere usar um gerenciador de senhas como Bitwarden."},
    {"icon": "⚠️", "title": "Revise Permissões de Sites", "description": "Sempre revise o que um DApp está pedindo permissão para fazer. Nunca aprove transações que você não entende."},
    {"icon": "💼", "title": "Considere Múltiplas Wallets", "description": "Use uma wallet para DeFi/trading e outra para guardar fundos (cold storage). Não coloque tudo em um único lugar."},
    {"icon": "🔄", "title": "Mantenha Atualizado", "description": "Sempre use a versão mais recente do Brave para ter as últimas correções de segurança e recursos."}
  ],
  "relatedResources": ["firefox", "metamask", "phantom"]
}
\`\`\`

**REGRAS CRÍTICAS**:
1. **Ícones Emoji**: SEMPRE adicionar ícones emoji em features e securityTips
   - Use emojis relevantes e visuais (⚡🎨💎💱🌐📱🔑🎯🔒⚠️💼🔄)
2. **Gradiente CSS**: SEMPRE usar formato linear-gradient() completo
   - ✅ CORRETO: "linear-gradient(135deg, #AB9FF2 0%, #7B61FF 100%)"
   - ❌ ERRADO: "from-blue-500 to-purple-600" (isso é Tailwind, NÃO funciona)
3. **Recursos Relacionados**: Escolher 3 slugs VÁLIDOS da lista fornecida acima
   - Devem ser ferramentas similares ou complementares
   - NUNCA inventar slugs - usar apenas os listados
4. **Quantidade EXATA**: Respeitar números do padrão
   - 6 features, 6 security tips, 5 passos, 4 FAQ
   - 8 prós, 5 contras (EXATO)
   - 5 parágrafos no whyGoodContent

**IMPORTANTE**:
- Retorne APENAS o JSON, sem markdown code blocks
- Preencha TODOS os campos obrigatórios
- Use informações reais e atualizadas sobre a ferramenta
- Siga RIGOROSAMENTE o exemplo do Brave acima como referência de qualidade`;

    } else {
      // Fallback: se tipo não reconhecido, usar modo conversa
      systemPrompt = `Você é um assistente especializado em criptomoedas e blockchain.

${timezoneContext}

Converse livremente com o usuário sobre qualquer assunto relacionado ao mundo cripto.`;
    }

    const systemMessage: PerplexityMessage = {
      role: 'system',
      content: systemPrompt
    };

    // 5. Validar e normalizar mensagens para garantir alternância user/assistant
    const normalizedMessages: PerplexityMessage[] = [];
    let lastRole: 'user' | 'assistant' | null = null;

    for (const msg of messages) {
      const currentRole = msg.role;

      // Se a mensagem atual tem o mesmo role que a anterior, mesclar conteúdos
      if (lastRole === currentRole && normalizedMessages.length > 0) {
        const lastMessage = normalizedMessages[normalizedMessages.length - 1];
        lastMessage.content += '\n\n' + msg.content;
      } else {
        normalizedMessages.push({
          role: currentRole,
          content: msg.content
        });
        lastRole = currentRole;
      }
    }

    // Construir array final com system message
    const perplexityMessages: PerplexityMessage[] = [
      systemMessage,
      ...normalizedMessages
    ];

    // Se está gerando artigo, usar não-streaming para capturar citations
    if (articleType) {
      const { callPerplexity } = require('@/lib/perplexity-client');

      const response = await callPerplexity(
        {
          model: 'sonar',
          messages: perplexityMessages,
          temperature: 0.7,
          max_tokens: 4000,
          search_recency_filter: articleType === 'news' ? 'day' : 'week',
          return_citations: true, // Habilita citações com URLs
        },
        PERPLEXITY_API_KEY
      );

      const content = response.choices[0].message.content;
      const citations = response.citations || [];

      // DEBUG: Logs apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [DEV] Resposta Perplexity:', {
          citations: citations.length,
          hasContent: !!content
        });
      }

      // Retornar JSON com content e citations
      return NextResponse.json({
        content,
        citations
      });
    }

    // Modo conversa: usar streaming
    const stream = await callPerplexityStreaming(
      {
        model: 'sonar',
        messages: perplexityMessages,
        temperature: 0.7,
        max_tokens: 4000,
        search_recency_filter: 'week',
        return_citations: false, // Em streaming, citations não funcionam
      },
      PERPLEXITY_API_KEY
    );

    // 6. Retornar stream
    const parsedStream = parsePerplexityStream(stream);

    return new Response(parsedStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Erro em /api/chat-perplexity:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
