import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { callPerplexity, type PerplexityMessage } from '@/lib/perplexity-client';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/test/bulk-generation
 *
 * Endpoint de teste interno para validar todo o fluxo de geração em massa.
 *
 * Workflow:
 * 1. Gera recurso via Perplexity API
 * 2. Valida estrutura do JSON
 * 3. Publica no banco de dados
 * 4. Retorna resultado detalhado
 *
 * ATENÇÃO: Apenas para ADMIN
 */
export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado. Apenas ADMIN pode executar testes.' },
        { status: 401 }
      );
    }

    // Validar API Key
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { error: 'PERPLEXITY_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Campo "topic" obrigatório' },
        { status: 400 }
      );
    }

    const testResults: any = {
      topic,
      steps: [],
      success: false,
      resource: null,
      errors: []
    };

    // ========================================
    // STEP 1: Gerar recurso via Perplexity
    // ========================================
    testResults.steps.push({ step: 1, name: 'Gerar recurso via Perplexity', status: 'in_progress' });

    const systemPrompt = getResourceSystemPrompt();
    const messages: PerplexityMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: topic }
    ];

    console.log('🚀 [TEST] Chamando Perplexity API...');
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

    console.log(`🔍 [TEST] Resposta recebida: ${content.length} chars, ${citations.length} citations`);
    testResults.steps[0].status = 'success';
    testResults.steps[0].details = {
      contentLength: content.length,
      citationsCount: citations.length
    };

    // ========================================
    // STEP 2: Parse e validação do JSON
    // ========================================
    testResults.steps.push({ step: 2, name: 'Parse e validação do JSON', status: 'in_progress' });

    let parsedContent;
    try {
      // Tentar extrair JSON de code block markdown
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();

      console.log(`📄 [TEST] JSON preview: ${jsonString.substring(0, 150)}...`);
      parsedContent = JSON.parse(jsonString);
    } catch (e: any) {
      console.error(`❌ [TEST] Erro ao parsear JSON:`, e);
      testResults.steps[1].status = 'error';
      testResults.steps[1].error = `Parse JSON falhou: ${e.message}`;
      testResults.errors.push(`Parse JSON: ${e.message}`);
      return NextResponse.json(testResults, { status: 500 });
    }

    // Validar estrutura
    const validationErrors = validateResourceData(parsedContent);
    if (validationErrors.length > 0) {
      console.error(`❌ [TEST] Validação falhou:`, validationErrors);
      testResults.steps[1].status = 'error';
      testResults.steps[1].error = `Campos inválidos: ${validationErrors.join(', ')}`;
      testResults.errors.push(`Validação: ${validationErrors.join(', ')}`);
      return NextResponse.json(testResults, { status: 400 });
    }

    console.log(`✅ [TEST] Validação OK!`);
    testResults.steps[1].status = 'success';
    testResults.steps[1].details = {
      name: parsedContent.name,
      category: parsedContent.category,
      featuresCount: parsedContent.features?.length,
      prosCount: parsedContent.pros?.length,
      consCount: parsedContent.cons?.length
    };

    // ========================================
    // STEP 3: Publicar no banco de dados
    // ========================================
    testResults.steps.push({ step: 3, name: 'Publicar no banco de dados', status: 'in_progress' });

    try {
      const VALID_CATEGORIES = [
        'exchange', 'wallet', 'defi-protocol', 'analytics',
        'portfolio-tracker', 'news', 'education', 'development-tools'
      ];

      const category = VALID_CATEGORIES.includes(parsedContent.category)
        ? parsedContent.category
        : 'wallet';

      // Gerar slug único
      const slug = generateSlug(parsedContent.name);

      const payload = {
        name: parsedContent.name,
        slug,
        category,
        shortDescription: parsedContent.shortDescription,
        officialUrl: parsedContent.officialUrl,
        platforms: typeof parsedContent.platforms === 'string'
          ? parsedContent.platforms
          : JSON.stringify(parsedContent.platforms),
        tags: typeof parsedContent.tags === 'string'
          ? parsedContent.tags
          : JSON.stringify(parsedContent.tags),
        heroTitle: parsedContent.heroTitle,
        heroDescription: parsedContent.heroDescription,
        heroGradient: parsedContent.heroGradient,
        whyGoodTitle: parsedContent.whyGoodTitle,
        whyGoodContent: typeof parsedContent.whyGoodContent === 'string'
          ? parsedContent.whyGoodContent
          : JSON.stringify(parsedContent.whyGoodContent),
        features: typeof parsedContent.features === 'string'
          ? parsedContent.features
          : JSON.stringify(parsedContent.features),
        howToStartTitle: parsedContent.howToStartTitle,
        howToStartSteps: typeof parsedContent.howToStartSteps === 'string'
          ? parsedContent.howToStartSteps
          : JSON.stringify(parsedContent.howToStartSteps),
        pros: typeof parsedContent.pros === 'string'
          ? parsedContent.pros
          : JSON.stringify(parsedContent.pros),
        cons: typeof parsedContent.cons === 'string'
          ? parsedContent.cons
          : JSON.stringify(parsedContent.cons),
        faq: typeof parsedContent.faq === 'string'
          ? parsedContent.faq
          : JSON.stringify(parsedContent.faq),
        securityTips: typeof parsedContent.securityTips === 'string'
          ? parsedContent.securityTips
          : JSON.stringify(parsedContent.securityTips),
        verified: true,
        sources: JSON.stringify(citations),
        showCompatibleWallets: parsedContent.showCompatibleWallets || false,
        relatedResources: parsedContent.relatedResources
          ? (typeof parsedContent.relatedResources === 'string'
              ? parsedContent.relatedResources
              : JSON.stringify(parsedContent.relatedResources))
          : null
      };

      console.log(`💾 [TEST] Criando no banco...`);
      const resource = await prisma.resource.create({
        data: payload
      });

      console.log(`✅ [TEST] Recurso criado: ${resource.id}`);
      testResults.steps[2].status = 'success';
      testResults.steps[2].details = {
        id: resource.id,
        slug: resource.slug,
        name: resource.name,
        url: `/recursos/${resource.slug}`
      };

      testResults.success = true;
      testResults.resource = {
        id: resource.id,
        slug: resource.slug,
        name: resource.name,
        category: resource.category,
        url: `/recursos/${resource.slug}`
      };

    } catch (e: any) {
      console.error(`❌ [TEST] Erro ao publicar:`, e);
      testResults.steps[2].status = 'error';
      testResults.steps[2].error = e.message;
      testResults.errors.push(`Publicação: ${e.message}`);
      return NextResponse.json(testResults, { status: 500 });
    }

    // ========================================
    // SUCESSO TOTAL
    // ========================================
    console.log(`\n✅ [TEST] TESTE COMPLETO COM SUCESSO!`);
    return NextResponse.json(testResults, { status: 200 });

  } catch (error: any) {
    console.error('❌ [TEST] Erro fatal:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// ========================================
// Funções auxiliares
// ========================================

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

**IMPORTANTE**: Retorne APENAS o JSON, sem markdown code blocks. O JSON deve começar com { e terminar com }.`;
}
