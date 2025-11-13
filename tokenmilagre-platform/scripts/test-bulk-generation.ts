/**
 * Script de Teste Automatizado - Geração em Massa de Recursos
 *
 * Este script testa todo o fluxo:
 * 1. Gera recurso via Perplexity API
 * 2. Valida estrutura do JSON
 * 3. Publica no banco de dados
 * 4. Verifica se foi criado com sucesso
 *
 * USO:
 * npx tsx scripts/test-bulk-generation.ts
 */

import { callPerplexity, type PerplexityMessage } from '@/lib/perplexity-client';
import { prisma } from '@/lib/prisma';

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  step: (msg: string) => console.log(`${colors.cyan}▶${colors.reset} ${msg}`),
};

// Validação de recursos
function validateResourceData(data: any): string[] {
  const errors: string[] = [];

  if (!data.name) errors.push('name');
  if (!data.slug) errors.push('slug');
  if (!data.category) errors.push('category');
  if (!data.officialUrl || !data.officialUrl.startsWith('http'))
    errors.push('officialUrl (deve ser URL válida)');
  if (!data.shortDescription) errors.push('shortDescription');
  if (!data.heroTitle) errors.push('heroTitle');
  if (!data.heroDescription) errors.push('heroDescription');
  if (!data.heroGradient) errors.push('heroGradient');
  if (!data.whyGoodTitle) errors.push('whyGoodTitle');
  if (!data.whyGoodContent || !Array.isArray(data.whyGoodContent) || data.whyGoodContent.length < 5)
    errors.push('whyGoodContent (mínimo 5 parágrafos)');
  if (!data.features || !Array.isArray(data.features) || data.features.length < 6)
    errors.push('features (mínimo 6)');
  if (!data.howToStartTitle) errors.push('howToStartTitle');
  if (!data.howToStartSteps || !Array.isArray(data.howToStartSteps) || data.howToStartSteps.length < 5)
    errors.push('howToStartSteps (mínimo 5)');
  if (!data.pros || !Array.isArray(data.pros) || data.pros.length < 8)
    errors.push('pros (mínimo 8)');
  if (!data.cons || !Array.isArray(data.cons) || data.cons.length < 5)
    errors.push('cons (mínimo 5)');
  if (!data.faq || !Array.isArray(data.faq) || data.faq.length < 4)
    errors.push('faq (mínimo 4)');
  if (!data.securityTips || !Array.isArray(data.securityTips) || data.securityTips.length < 6)
    errors.push('securityTips (mínimo 6)');

  return errors;
}

// Gerar slug único
function generateSlug(title: string): string {
  let slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const timestamp = Date.now().toString(36);
  slug = `${slug}-${timestamp}`;

  return slug.substring(0, 100);
}

// System prompt para recursos
function getResourceSystemPrompt(): string {
  const now = new Date();
  const brasiliaTime = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(now);

  return `Você é um assistente especializado em documentar ferramentas e recursos do ecossistema cripto.

**IMPORTANTE:** Você está respondendo para usuários no Brasil. A data e hora atual no horário de Brasília é: ${brasiliaTime}.

**TAREFA:** Criar guia completo de ferramenta/recurso seguindo RIGOROSAMENTE o padrão de qualidade.

**PADRÃO DE QUALIDADE**:
- **6 features** com ícones emoji
- **6 security tips** com ícones emoji
- **5 passos** no guia "Como Começar"
- **4 perguntas** no FAQ
- **8 prós** e **5 contras** (EXATO)
- **5 parágrafos** no whyGoodContent
- **3 recursos relacionados**
- **Gradiente CSS** no formato linear-gradient()

**SLUGS DE RECURSOS VÁLIDOS** (escolha 3 relacionados):
- **Wallets**: metamask, phantom, trust-wallet, ledger
- **Exchanges**: binance, coinbase, kraken
- **Browsers**: brave, firefox
- **DeFi**: aave, uniswap, compound
- **Explorers**: etherscan, solscan, bscscan
- **Tools**: coingecko, coinmarketcap, defillama

**CAMPOS OBRIGATÓRIOS:**
- category: **Use EXATAMENTE um destes**: exchange | wallet | defi-protocol | analytics | portfolio-tracker | news | education | development-tools

**Formato de resposta (APENAS JSON, sem markdown):**
{
  "name": "Nome da Ferramenta",
  "slug": "nome-da-ferramenta",
  "category": "wallet",
  "shortDescription": "Descrição curta",
  "officialUrl": "https://exemplo.com",
  "platforms": ["Web", "iOS", "Android"],
  "tags": ["tag1", "tag2", "tag3"],
  "heroTitle": "Título Chamativo",
  "heroDescription": "Descrição envolvente de 2-3 linhas",
  "heroGradient": "linear-gradient(135deg, #AB9FF2 0%, #7B61FF 100%)",
  "whyGoodTitle": "Por que [Nome] é uma boa escolha?",
  "whyGoodContent": [
    "Parágrafo 1 explicando principais benefícios",
    "Parágrafo 2 destacando tecnologia e segurança",
    "Parágrafo 3 descrevendo casos de uso práticos",
    "Parágrafo 4 reforçando vantagens competitivas",
    "Parágrafo 5 destacando integração e comunidade"
  ],
  "features": [
    {"icon": "⚡", "title": "Funcionalidade 1", "description": "Descrição detalhada"},
    {"icon": "🎨", "title": "Funcionalidade 2", "description": "Descrição detalhada"},
    {"icon": "💎", "title": "Funcionalidade 3", "description": "Descrição detalhada"},
    {"icon": "💱", "title": "Funcionalidade 4", "description": "Descrição detalhada"},
    {"icon": "🌐", "title": "Funcionalidade 5", "description": "Descrição detalhada"},
    {"icon": "📱", "title": "Funcionalidade 6", "description": "Descrição detalhada"}
  ],
  "howToStartTitle": "Como Começar a Usar [Nome]",
  "howToStartSteps": [
    {"number": 1, "title": "Primeiro Passo", "description": "Explicação detalhada"},
    {"number": 2, "title": "Segundo Passo", "description": "Explicação detalhada"},
    {"number": 3, "title": "Terceiro Passo", "description": "Explicação detalhada"},
    {"number": 4, "title": "Quarto Passo", "description": "Explicação detalhada"},
    {"number": 5, "title": "Quinto Passo", "description": "Explicação detalhada"}
  ],
  "pros": [
    "Vantagem 1", "Vantagem 2", "Vantagem 3", "Vantagem 4",
    "Vantagem 5", "Vantagem 6", "Vantagem 7", "Vantagem 8"
  ],
  "cons": [
    "Limitação 1", "Limitação 2", "Limitação 3", "Limitação 4", "Limitação 5"
  ],
  "faq": [
    {"question": "Pergunta 1?", "answer": "Resposta completa"},
    {"question": "Pergunta 2?", "answer": "Resposta completa"},
    {"question": "Pergunta 3?", "answer": "Resposta completa"},
    {"question": "Pergunta 4?", "answer": "Resposta completa"}
  ],
  "securityTips": [
    {"icon": "🔑", "title": "Dica 1", "description": "Explicação detalhada"},
    {"icon": "🎯", "title": "Dica 2", "description": "Explicação detalhada"},
    {"icon": "🔒", "title": "Dica 3", "description": "Explicação detalhada"},
    {"icon": "⚠️", "title": "Dica 4", "description": "Explicação detalhada"},
    {"icon": "💼", "title": "Dica 5", "description": "Explicação detalhada"},
    {"icon": "🔄", "title": "Dica 6", "description": "Explicação detalhada"}
  ],
  "relatedResources": ["slug-recurso-1", "slug-recurso-2", "slug-recurso-3"]
}

**IMPORTANTE**: Retorne APENAS o JSON, sem code blocks markdown.`;
}

// Testar geração de um recurso
async function testGenerateResource(topic: string): Promise<any> {
  log.step(`Gerando recurso: ${topic}`);

  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
  if (!PERPLEXITY_API_KEY) {
    throw new Error('PERPLEXITY_API_KEY não configurada');
  }

  const messages: PerplexityMessage[] = [
    { role: 'system', content: getResourceSystemPrompt() },
    { role: 'user', content: topic }
  ];

  log.info('Chamando Perplexity API...');
  const response = await callPerplexity(
    {
      model: 'sonar',
      messages,
      temperature: 0.7,
      max_tokens: 4000,
      search_recency_filter: 'week',
      return_citations: true,
    },
    PERPLEXITY_API_KEY
  );

  const content = response.choices[0].message.content;
  const citations = response.citations || [];

  log.info(`Resposta recebida (${content.length} chars, ${citations.length} citations)`);

  // Parse JSON
  let parsedContent;
  try {
    // Tentar extrair JSON de code block markdown
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();

    log.info(`JSON preview: ${jsonString.substring(0, 150)}...`);
    parsedContent = JSON.parse(jsonString);
  } catch (e) {
    log.error(`Erro ao parsear JSON: ${e}`);
    log.error(`Conteúdo recebido: ${content.substring(0, 500)}`);
    throw new Error('Resposta da IA não está em formato JSON válido');
  }

  // Validar estrutura
  const validationErrors = validateResourceData(parsedContent);
  if (validationErrors.length > 0) {
    log.error(`Validação falhou: ${validationErrors.join(', ')}`);
    throw new Error(`Dados incompletos: ${validationErrors.join(', ')}`);
  }

  log.success('Validação passou!');
  log.info(`Estrutura: ${parsedContent.features.length} features, ${parsedContent.pros.length} pros, ${parsedContent.cons.length} cons`);

  return {
    ...parsedContent,
    citations
  };
}

// Publicar recurso no banco
async function publishResource(resourceData: any, citations: string[]): Promise<any> {
  log.step(`Publicando recurso: ${resourceData.name}`);

  const VALID_CATEGORIES = [
    'exchange', 'wallet', 'defi-protocol', 'analytics',
    'portfolio-tracker', 'news', 'education', 'development-tools'
  ];

  // Validar categoria
  const category = VALID_CATEGORIES.includes(resourceData.category)
    ? resourceData.category
    : 'wallet';

  // Gerar slug único
  const slug = resourceData.slug || generateSlug(resourceData.name);

  // Verificar se slug já existe
  const existing = await prisma.resource.findUnique({
    where: { slug }
  });

  if (existing) {
    log.warn(`Slug já existe: ${slug}`);
    // Gerar novo slug
    const newSlug = generateSlug(resourceData.name);
    log.info(`Usando novo slug: ${newSlug}`);
    resourceData.slug = newSlug;
  }

  const payload = {
    name: resourceData.name,
    slug: resourceData.slug || slug,
    category,
    shortDescription: resourceData.shortDescription,
    officialUrl: resourceData.officialUrl,
    platforms: typeof resourceData.platforms === 'string'
      ? resourceData.platforms
      : JSON.stringify(resourceData.platforms),
    tags: typeof resourceData.tags === 'string'
      ? resourceData.tags
      : JSON.stringify(resourceData.tags),
    heroTitle: resourceData.heroTitle,
    heroDescription: resourceData.heroDescription,
    heroGradient: resourceData.heroGradient,
    whyGoodTitle: resourceData.whyGoodTitle,
    whyGoodContent: typeof resourceData.whyGoodContent === 'string'
      ? resourceData.whyGoodContent
      : JSON.stringify(resourceData.whyGoodContent),
    features: typeof resourceData.features === 'string'
      ? resourceData.features
      : JSON.stringify(resourceData.features),
    howToStartTitle: resourceData.howToStartTitle,
    howToStartSteps: typeof resourceData.howToStartSteps === 'string'
      ? resourceData.howToStartSteps
      : JSON.stringify(resourceData.howToStartSteps),
    pros: typeof resourceData.pros === 'string'
      ? resourceData.pros
      : JSON.stringify(resourceData.pros),
    cons: typeof resourceData.cons === 'string'
      ? resourceData.cons
      : JSON.stringify(resourceData.cons),
    faq: typeof resourceData.faq === 'string'
      ? resourceData.faq
      : JSON.stringify(resourceData.faq),
    securityTips: typeof resourceData.securityTips === 'string'
      ? resourceData.securityTips
      : JSON.stringify(resourceData.securityTips),
    verified: true,
    sources: JSON.stringify(citations),
    showCompatibleWallets: resourceData.showCompatibleWallets || false,
    relatedResources: resourceData.relatedResources
      ? (typeof resourceData.relatedResources === 'string'
          ? resourceData.relatedResources
          : JSON.stringify(resourceData.relatedResources))
      : null
  };

  log.info(`Criando no banco de dados...`);
  const resource = await prisma.resource.create({
    data: payload
  });

  log.success(`Recurso criado com sucesso!`);
  log.info(`ID: ${resource.id}`);
  log.info(`Slug: ${resource.slug}`);
  log.info(`URL: /recursos/${resource.slug}`);

  return resource;
}

// Workflow completo de teste
async function runTest() {
  console.log('\n' + '='.repeat(60));
  log.info('TESTE AUTOMATIZADO - Geração em Massa de Recursos');
  console.log('='.repeat(60) + '\n');

  const testTopics = [
    'Trust Wallet: Carteira multi-chain popular',
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const topic of testTopics) {
    try {
      console.log('\n' + '-'.repeat(60));

      // Passo 1: Gerar
      const resourceData = await testGenerateResource(topic);

      // Delay de 2s (rate limiting)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Passo 2: Publicar
      const published = await publishResource(resourceData, resourceData.citations);

      successCount++;
      log.success(`✓ Teste completo: ${published.name}`);

    } catch (error: any) {
      errorCount++;
      log.error(`✗ Falha no teste: ${error.message}`);
      console.error(error);
    }
  }

  console.log('\n' + '='.repeat(60));
  log.info('RESUMO DOS TESTES');
  console.log('='.repeat(60));
  log.success(`Sucessos: ${successCount}`);
  log.error(`Falhas: ${errorCount}`);
  log.info(`Total: ${testTopics.length}`);
  console.log('='.repeat(60) + '\n');

  process.exit(errorCount > 0 ? 1 : 0);
}

// Executar
runTest().catch((error) => {
  log.error(`Erro fatal: ${error.message}`);
  console.error(error);
  process.exit(1);
});
