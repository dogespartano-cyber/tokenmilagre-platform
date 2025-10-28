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
  type: 'news' | 'educational';
  category: string;
  level?: 'iniciante' | 'intermediario' | 'avancado'; // Apenas para educacional
  model?: 'sonar' | 'sonar-pro';
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
  const { topic, type, category, level } = params;

  if (type === 'news') {
    return `Você é um jornalista especializado em criptomoedas e blockchain.

**TAREFA**: Escrever uma notícia completa em português (PT-BR) sobre: "${topic}"

**CATEGORIA**: ${category}

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

**FORMATO DE SAÍDA**:
{
  "title": "Título atrativo da notícia (máx 80 caracteres)",
  "excerpt": "Resumo de 1-2 frases (máx 200 caracteres)",
  "content": "## Primeira Seção\\n\\nConteúdo...",
  "sentiment": "positive" | "neutral" | "negative",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Retorne APENAS o JSON, sem explicações adicionais.`;
  } else {
    // Educational
    return `Você é um educador especializado em criptomoedas e blockchain.

**TAREFA**: Escrever um artigo educacional completo em português (PT-BR) sobre: "${topic}"

**CATEGORIA**: ${category}
**NÍVEL**: ${level || 'intermediario'}

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

**AJUSTE DE COMPLEXIDADE**:
- Iniciante: Linguagem simples, muitas analogias, evitar jargões
- Intermediário: Termos técnicos explicados, exemplos práticos
- Avançado: Detalhes técnicos, implementações, casos complexos

**FORMATO DE SAÍDA**:
{
  "title": "Título educacional claro (máx 80 caracteres)",
  "description": "Breve descrição do que o leitor aprenderá (1-2 frases)",
  "content": "Parágrafo introdutório...\\n\\n## Primeira Seção...",
  "tags": ["tag1", "tag2", "tag3"]
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
    const { topic, type, category, level, model = 'sonar' } = body;

    // Validação
    if (!topic || !type || !category) {
      return NextResponse.json(
        { success: false, error: 'Parâmetros obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Monta prompt
    const prompt = buildPrompt(body);

    // Determina modelo Perplexity
    const perplexityModel = model === 'sonar-pro'
      ? 'sonar-pro'
      : 'sonar';

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

    // Processa conteúdo seguindo regras da skill
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

    const inputCost = model === 'sonar-pro'
      ? (inputTokens / 1000000) * 3
      : (inputTokens / 1000000) * 1;

    const outputCost = model === 'sonar-pro'
      ? (outputTokens / 1000000) * 15
      : (outputTokens / 1000000) * 1;

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
        category,
        level: type === 'educational' ? level : undefined,
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
