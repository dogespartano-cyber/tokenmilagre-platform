import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  processArticleContent,
  extractExcerpt,
  titleToSlug,
  calculateReadTime,
  extractTags
} from '@/lib/article-processor';

// Types
interface GenerateArticleRequest {
  topic: string;
  type: 'news' | 'educational' | 'resource';
  model?: 'sonar' | 'sonar-pro' | 'sonar-base';
}

interface GenerateArticleResponse {
  success: boolean;
  data?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    level?: string;
    tags: string[];
    readTime: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
  };
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
}

/**
 * Monta prompt para Perplexity seguindo regras da skill article-creation
 */
function buildPrompt(params: GenerateArticleRequest): string {
  const { topic, type } = params;

  if (type === 'news') {
    return `Você é um jornalista especializado em criptomoedas e blockchain.

**TAREFA**: Escrever uma notícia completa em português (PT-BR) sobre: "${topic}"

**ESTRUTURA OBRIGATÓRIA** (Padrão Jornalístico):
Siga o fluxo: Fato → Contexto → Impacto → Visão → Reflexão → Desafios

1. ## Título da Primeira Seção (Fato Principal)
   - Apresente o fato central da notícia
   - Use dados concretos e números

2. ## Segunda Seção (Contexto)
   - Contextualize com dados históricos
   - Compare com situações similares
   - Adicione números relevantes

3. ## Terceira Seção (Impacto no Mercado)
   - Analise impacto no setor/mercado
   - Mencione consequências práticas

4. ## Quarta Seção (Visão de Especialistas)
   - Inclua perspectiva de protagonistas
   - Citações de CEOs, analistas ou envolvidos

5. ## Quinta Seção (Reflexão sobre Significado)
   - Analise significado maior
   - Contexto histórico ou tendências

6. ### Desafios e Considerações (Subseção da 5ª seção)
   - Equilibre com riscos ou desafios
   - Mantenha realismo

**REGRAS CRÍTICAS**:
❌ NÃO incluir título H1 no início (# Título)
❌ NÃO incluir seção de fontes/referências
❌ NÃO incluir nota de transparência
❌ NÃO repetir o resumo no conteúdo
✅ Começar DIRETO com ## (H2)
✅ Usar 5-6 seções H2 (mínimo 4, máximo 7)
✅ Títulos descritivos (não genéricos como "Introdução")
✅ Conclusão integrada como ### (H3) na última seção
✅ Tom jornalístico profissional
✅ Dados e números concretos

**CATEGORIAS DISPONÍVEIS**: bitcoin, ethereum, defi, politica, nfts, altcoins, regulacao, mercado

**FORMATO DE SAÍDA**:
{
  "title": "Título atrativo da notícia (máx 80 caracteres)",
  "excerpt": "Resumo de 1-2 frases (máx 200 caracteres)",
  "content": "## Primeira Seção\\n\\nConteúdo...",
  "category": "bitcoin", // Escolha a categoria mais apropriada baseada no tópico
  "sentiment": "positive" | "neutral" | "negative",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Retorne APENAS o JSON, sem explicações adicionais.`;
  } else if (type === 'educational') {
    // Educational
    return `Você é um educador especializado em criptomoedas e blockchain.

**TAREFA**: Escrever um artigo educacional completo em português (PT-BR) sobre: "${topic}"

**ESTRUTURA DO ARTIGO**:

1. Parágrafo introdutório (1-2 parágrafos)
   - Apresente o conceito principal
   - Explique por que é importante

2. ## O Que É [Conceito]
   - Definição clara e acessível
   - Exemplos práticos

3. ## Como Funciona
   - Explicação técnica apropriada ao nível
   - Diagramas textuais se necessário

4. ## Principais Características
   - Liste e explique características importantes
   - Use subtítulos ### para cada característica

5. ## Vantagens e Desvantagens
   ### Vantagens
   - Liste benefícios

   ### Desvantagens
   - Liste limitações e riscos

6. ## Casos de Uso Práticos
   - Exemplos reais de aplicação
   - Situações do dia a dia

7. ## Como Começar
   - Passos práticos para iniciantes
   - Recursos recomendados

**REGRAS CRÍTICAS**:
❌ NÃO incluir título H1 no início (# Título)
❌ NÃO incluir seção de fontes/referências
✅ Começar com parágrafo introdutório (não com ##)
✅ Usar ## (H2) para seções principais
✅ Usar ### (H3) para subseções
✅ Tom educacional e acessível
✅ Exemplos práticos e analogias

**CATEGORIAS DISPONÍVEIS**: blockchain, trading, defi, nfts, seguranca, desenvolvimento

**NÍVEIS**:
- Iniciante: Linguagem simples, muitas analogias, evitar jargões
- Intermediário: Termos técnicos explicados, exemplos práticos
- Avançado: Detalhes técnicos, implementações, casos complexos

**FORMATO DE SAÍDA**:
{
  "title": "Título educacional claro (máx 80 caracteres)",
  "description": "Breve descrição do que o leitor aprenderá (1-2 frases)",
  "content": "Parágrafo introdutório...\\n\\n## Primeira Seção...",
  "category": "blockchain", // Escolha a categoria mais apropriada baseada no tópico
  "level": "iniciante" | "intermediario" | "avancado", // Determine o nível baseado na complexidade do tópico
  "tags": ["tag1", "tag2", "tag3"]
}

Retorne APENAS o JSON, sem explicações adicionais.`;
  } else {
    // Resource
    return `Você é um especialista em recursos e ferramentas de criptomoedas e blockchain.

**TAREFA**: Criar uma página completa de recurso em português (PT-BR) sobre: "${topic}"

**CATEGORIAS DISPONÍVEIS**: wallets, exchanges, browsers, defi, explorers, tools

**ESTRUTURA COMPLETA DO RECURSO**:

1. **Informações Básicas**:
   - Nome do recurso
   - Descrição curta (1-2 linhas)
   - URL oficial
   - Plataformas disponíveis (Web, iOS, Android, Desktop)
   - Tags descritivas

2. **Hero Section** (Seção de destaque):
   - Título chamativo
   - Descrição envolvente (2-3 linhas)
   - Gradiente sugerido (ex: "from-blue-500 to-purple-600")

3. **Por Que É Bom** (3-4 parágrafos explicando benefícios)

4. **Características** (4-6 features com ícone, título e descrição)
   Ícones disponíveis: faWallet, faShield, faGlobe, faRocket, faLock, faChartLine, faBolt, faUsers, faCog, faCheckCircle

5. **Como Começar** (3-5 passos numerados com título e descrição)

6. **Prós e Contras** (3-5 de cada)

7. **FAQ** (4-6 perguntas e respostas)

8. **Dicas de Segurança** (3-4 dicas com ícone, título e descrição)

**FORMATO DE SAÍDA**:
{
  "name": "Nome do Recurso",
  "slug": "nome-do-recurso-em-slug",
  "category": "wallets", // Escolha a categoria apropriada
  "shortDescription": "Descrição curta",
  "officialUrl": "https://...",
  "platforms": ["Web", "iOS", "Android"],
  "tags": ["tag1", "tag2", "tag3"],
  "heroTitle": "Título chamativo",
  "heroDescription": "Descrição envolvente",
  "heroGradient": "from-blue-500 to-purple-600",
  "whyGoodTitle": "Por Que Escolher [Nome]?",
  "whyGoodContent": ["Parágrafo 1...", "Parágrafo 2...", "Parágrafo 3..."],
  "features": [
    {
      "icon": "faWallet",
      "title": "Título da Feature",
      "description": "Descrição da feature"
    }
  ],
  "howToStartTitle": "Como Começar com [Nome]",
  "howToStartSteps": [
    {
      "number": 1,
      "title": "Título do Passo",
      "description": "Descrição detalhada"
    }
  ],
  "pros": ["Prós 1", "Prós 2", "Prós 3"],
  "cons": ["Contra 1", "Contra 2", "Contra 3"],
  "faq": [
    {
      "question": "Pergunta?",
      "answer": "Resposta detalhada..."
    }
  ],
  "securityTips": [
    {
      "icon": "faShield",
      "title": "Título da Dica",
      "description": "Descrição da dica de segurança"
    }
  ]
}

Retorne APENAS o JSON, sem explicações adicionais.`;
  }
}

/**
 * POST /api/generate-article
 * Gera artigo usando Perplexity API
 * Protegido: Apenas ADMIN e EDITOR
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verificar permissão de ADMIN ou EDITOR
    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json(
        { success: false, error: 'Sem permissão. Apenas ADMIN e EDITOR podem gerar artigos.' },
        { status: 403 }
      );
    }

    // Obter API key do ambiente (segurança)
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key não configurada no servidor' },
        { status: 500 }
      );
    }

    const body: GenerateArticleRequest = await request.json();
    const { topic, type, model = 'sonar' } = body;

    // Validação
    if (!topic || !type) {
      return NextResponse.json(
        { success: false, error: 'Parâmetros obrigatórios faltando (topic, type)' },
        { status: 400 }
      );
    }

    if (!['news', 'educational', 'resource'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo inválido. Use: news, educational ou resource' },
        { status: 400 }
      );
    }

    // Monta prompt
    const prompt = buildPrompt(body);

    // Determina modelo Perplexity
    let perplexityModel: string;
    if (model === 'sonar-pro') {
      perplexityModel = 'sonar-pro';
    } else if (model === 'sonar-base') {
      perplexityModel = 'sonar'; // sonar-base usa o modelo 'sonar' da Perplexity
    } else {
      perplexityModel = 'sonar';
    }

    // Chama Perplexity API
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: perplexityModel,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates structured articles in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: model === 'sonar-pro' ? 2000 : 1500,
      })
    });

    if (!perplexityResponse.ok) {
      const errorData = await perplexityResponse.json();
      return NextResponse.json(
        { success: false, error: `Perplexity API error: ${errorData.error?.message || 'Unknown error'}` },
        { status: perplexityResponse.status }
      );
    }

    const perplexityData = await perplexityResponse.json();
    const generatedText = perplexityData.choices[0].message.content;

    // Parse JSON gerado
    let articleData;
    try {
      // Tenta extrair JSON se vier com texto adicional
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        articleData = JSON.parse(jsonMatch[0]);
      } else {
        articleData = JSON.parse(generatedText);
      }
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Erro ao parsear resposta da API' },
        { status: 500 }
      );
    }

    // Para recursos, retornar estrutura diretamente sem processar
    if (type === 'resource') {
      return NextResponse.json({
        success: true,
        data: articleData, // Retorna todo o JSON do resource
        usage: {
          inputTokens,
          outputTokens,
          estimatedCost: parseFloat(estimatedCost.toFixed(6))
        }
      });
    }

    // Processa conteúdo seguindo regras da skill (apenas para news/educational)
    const processedContent = processArticleContent(articleData.content, type);

    // Extrai/gera metadados
    const excerpt = type === 'news'
      ? articleData.excerpt
      : articleData.description || extractExcerpt(processedContent);

    const slug = titleToSlug(articleData.title);
    const readTime = calculateReadTime(processedContent);
    const tags = articleData.tags || extractTags(processedContent);

    // Calcula custo estimado
    const inputTokens = perplexityData.usage?.prompt_tokens || 0;
    const outputTokens = perplexityData.usage?.completion_tokens || 0;

    // Custos por modelo (por 1M tokens)
    let inputCost: number;
    let outputCost: number;

    if (model === 'sonar-pro') {
      inputCost = (inputTokens / 1000000) * 3;
      outputCost = (outputTokens / 1000000) * 15;
    } else if (model === 'sonar-base') {
      inputCost = (inputTokens / 1000000) * 0.2; // $0.20 por 1M tokens
      outputCost = (outputTokens / 1000000) * 0.2;
    } else {
      inputCost = (inputTokens / 1000000) * 1;
      outputCost = (outputTokens / 1000000) * 1;
    }

    const requestCost = 0.005; // Taxa de requisição
    const estimatedCost = inputCost + outputCost + requestCost;

    // Monta resposta
    const response: GenerateArticleResponse = {
      success: true,
      data: {
        title: articleData.title,
        slug,
        excerpt,
        content: processedContent,
        category: articleData.category, // Categoria determinada pela IA
        level: type === 'educational' ? articleData.level : undefined, // Nível determinado pela IA
        tags,
        readTime,
        sentiment: type === 'news' ? articleData.sentiment : undefined,
      },
      usage: {
        inputTokens,
        outputTokens,
        estimatedCost: parseFloat(estimatedCost.toFixed(6))
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating article:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao gerar artigo'
      },
      { status: 500 }
    );
  }
}
