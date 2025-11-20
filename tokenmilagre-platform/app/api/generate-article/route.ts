/**
 * Generate Article API Route
 *
 * Generates article content using Perplexity API with:
 * - Service layer integration (ArticleService for validation)
 * - Auth helpers for role-based access (ADMIN/EDITOR only)
 * - Structured logging with context
 * - Standardized response format
 * - Zod validation for request parameters
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ServiceLocator } from '@/lib/di/container'
import { successResponse, errorResponse } from '@/lib/helpers/response-helpers'
import { requireEditor } from '@/lib/helpers/auth-helpers'
import {
  processArticleContent,
  extractExcerpt,
  titleToSlug,
  calculateReadTime,
  extractTags
} from '@/lib/article-processor'
import { validateArticleContent, ValidationResult } from '@/lib/content-validator'
import { callPerplexity } from '@/lib/perplexity-client'

// Request validation schema
const generateArticleRequestSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters').max(500, 'Topic too long'),
  type: z.enum(['news', 'educational', 'resource']),
  model: z.enum(['sonar', 'sonar-pro', 'sonar-base']).optional().default('sonar'),
})

type GenerateArticleRequest = z.infer<typeof generateArticleRequestSchema>

interface GenerateArticleResponse {
  success: boolean
  data?: {
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    level?: string
    tags: string[]
    readTime: string
    sentiment?: 'positive' | 'neutral' | 'negative'
    citations?: string[]
  }
  error?: string
  usage?: {
    inputTokens: number
    outputTokens: number
    estimatedCost: number
  }
  validation?: ValidationResult
}

/**
 * Monta prompt para Perplexity seguindo regras da skill article-creation
 */
function buildPrompt(params: GenerateArticleRequest): string {
  const { topic, type } = params

  if (type === 'news') {
    return `# SISTEMA: Jornalista Profissional de Criptomoedas

Você é um jornalista experiente especializado em mercado cripto, com rigor editorial equivalente a veículos como Bloomberg, Reuters e CoinDesk. Seu objetivo é produzir artigos com padrão jornalístico profissional (nota 9/10).

**TAREFA**: Escrever uma notícia completa e profissional sobre: "${topic}"

## ESTRUTURA OBRIGATÓRIA DO ARTIGO

### 1. TÍTULO (para campo "title")
- Máximo 12 palavras (80 caracteres)
- Descritivo, não sensacionalista
- Inclua dado quantitativo principal
- Formato: "[ATIVO] + [AÇÃO] + [PERCENTUAL/VALOR] + [CONTEXTO TEMPORAL]"
- Exemplo: "Bitcoin cai 4,5% em outubro e encerra sequência de 7 anos de ganhos"

### 2. EXCERPT (para campo "excerpt")
- 1-2 frases objetivas (máximo 200 caracteres)
- Resuma O QUÊ aconteceu, QUANDO e qual o IMPACTO
- Use dados quantitativos
- Exemplo: "Bitcoin encerrou outubro cotado a $110.350, queda de 4,5%. Marca primeira desvalorização no mês desde 2018."

### 3. CONTEÚDO (para campo "content")

**IMPORTANTE**: NÃO repita o excerpt no conteúdo. Comece direto com as seções H2.

#### Primeira Seção (H2): Lead Detalhado
- Expanda o que foi dito no excerpt
- Responda: O QUÊ, QUANDO, ONDE, QUEM, COMO, POR QUÊ
- Inclua dado principal + contexto temporal + causa em 2-3 parágrafos
- Cite fontes específicas (CoinGecko, CoinMarketCap, Glassnode, etc.)

#### Segunda Seção (H2): Contexto Histórico com Dados
- Compare com períodos anteriores (últimos 5-10 anos)
- Inclua médias históricas e dados comparativos
- Cite fonte específica para cada dado
- Exemplo de título: "Performance Histórica de Outubro", "Contexto do Mercado"

#### Terceira Seção (H2): Métricas Técnicas On-Chain
Inclua PELO MENOS 3-4 das seguintes métricas:
- Dominância de mercado (%)
- Volume de negociação (USD 24h)
- Liquidações totais no período
- MVRV Ratio, Funding rates
- Fluxo de exchanges (entradas/saídas)
- Active addresses, whale transactions

**CITE SEMPRE A FONTE**: Glassnode, CryptoQuant, Santiment, CoinMetrics, CoinGlass

#### Quarta Seção (H2): Perspectivas de Analistas
**OBRIGATÓRIO**: Apresente NO MÍNIMO 2 perspectivas diferentes:

**Visão 1:**
"Segundo [NOME], [CARGO] da [EMPRESA], [análise/opinião]. A projeção aponta para [VALOR/TENDÊNCIA], baseada em [FUNDAMENTO]."

**Visão 2 (contrária ou complementar):**
"Por outro lado, [NOME], [CARGO] da [EMPRESA], destaca que [análise/opinião]. [INSTITUIÇÃO] prevê [CENÁRIO ALTERNATIVO]."

#### Quinta Seção (H2): Impacto no Mercado / Fatores Macro
- Efeito em outros ativos (altcoins principais)
- Comportamento de métricas derivadas
- Correlação com mercados tradicionais
- Política monetária, regulação, eventos relevantes

#### Sexta Seção (H3 dentro da quinta): Perspectivas de Curto/Médio Prazo
- Resistências e suportes técnicos
- Indicadores técnicos (RSI, médias móveis)
- Eventos programados relevantes
- Consenso de mercado

## REGRAS DE REDAÇÃO RIGOROSAS

### FONTES E CITAÇÕES
✅ **FAÇA:**
- Cite nome + cargo + empresa em análises de terceiros
- Especifique fonte de CADA métrica numérica
- Exemplo: "segundo dados da Glassnode de 31 de outubro"
- Use citações diretas quando pertinente

❌ **NÃO FAÇA:**
- "Especialistas apontam" (sem nome)
- "Analistas acreditam" (genérico)
- "Dados mostram" (sem fonte)

### NEUTRALIDADE LINGUÍSTICA
✅ **USE**: "Bitcoin caiu 4,5%", "Investidores registraram perdas", "Volatilidade aumentou"
❌ **EVITE**: "despencou", "surpreendidos", "pânico", "impressionante"

### SEPARAÇÃO FATO vs. OPINIÃO
- Fatos: dados objetivos sem qualificadores
- Opiniões: sempre atribuídas a pessoas/instituições específicas

## REGRAS CRÍTICAS DE FORMATAÇÃO

❌ **NÃO INCLUIR**:
- Título H1 no início do content (# Título)
- Seção "Fontes" ou "Referências" no final
- Nota de transparência ou disclaimer
- Metodologia ao final
- Referências numéricas [1][2][3] (o sistema cuida disso automaticamente)

✅ **INCLUIR**:
- Começar content DIRETO com ## (primeira seção H2)
- Usar 5-6 seções H2 (mínimo 4, máximo 7)
- Títulos de seção descritivos e específicos
- Conclusão/perspectivas como ### (H3) dentro da última seção H2
- Dados concretos e fontes nomeadas
- Tom jornalístico neutro e profissional

**CATEGORIAS DISPONÍVEIS**: bitcoin, ethereum, defi, politica, nfts, altcoins, regulacao, mercado

**FORMATO DE SAÍDA JSON**:
{
  "title": "Título com máx 12 palavras, descritivo, com dado quantitativo",
  "excerpt": "1-2 frases objetivas resumindo o fato principal (máx 200 chars)",
  "content": "## Primeira Seção\\n\\nPrimeiro parágrafo expandindo o lead...\\n\\nSegundo parágrafo com dados...\\n\\n## Segunda Seção\\n\\nConteúdo com fontes citadas...\\n\\n## Terceira Seção\\n\\n...",
  "category": "bitcoin",
  "sentiment": "positive",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

⚠️ **IMPORTANTE**: Retorne APENAS o objeto JSON puro, sem:
- Markdown code blocks (\`\`\`json)
- Texto explicativo antes ou depois
- Comentários no JSON
- Apenas o objeto JSON limpo começando com { e terminando com }

**LEMBRE-SE**: O Perplexity adicionará automaticamente referências [1][2] nas citações. Não se preocupe com isso, apenas escreva o conteúdo naturalmente citando as fontes por nome no texto.`
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
❌ NÃO incluir referências numéricas no texto (como [1], [2], [3], [1][5], etc)
✅ Começar com parágrafo introdutório (não com ##)
✅ Usar ## (H2) para seções principais
✅ Usar ### (H3) para subseções
✅ Tom educacional e acessível
✅ Exemplos práticos e analogias
✅ Escrever informações diretamente no texto, sem marcadores de citação

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
  "category": "blockchain",
  "level": "iniciante",
  "tags": ["tag1", "tag2", "tag3"]
}

⚠️ **IMPORTANTE**: Retorne APENAS o objeto JSON puro, sem:
- Markdown code blocks (\`\`\`json)
- Texto explicativo antes ou depois
- Comentários no JSON
- Apenas o objeto JSON limpo começando com { e terminando com }`
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

**REGRAS CRÍTICAS**:
❌ NÃO incluir referências numéricas no texto (como [1], [2], [3], [1][5], etc)
✅ Escrever informações diretamente no texto, sem marcadores de citação
✅ Tom profissional e objetivo
✅ Informações precisas e atualizadas

**FORMATO DE SAÍDA**:
{
  "name": "Nome do Recurso",
  "slug": "nome-do-recurso-em-slug",
  "category": "wallets",
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

⚠️ **IMPORTANTE**: Retorne APENAS o objeto JSON puro, sem:
- Markdown code blocks (\`\`\`json)
- Texto explicativo antes ou depois
- Comentários no JSON
- Apenas o objeto JSON limpo começando com { e terminando com }`
  }
}

/**
 * POST /api/generate-article
 * Gera artigo usando Perplexity API
 * Protegido: Apenas ADMIN e EDITOR
 */
export async function POST(request: NextRequest) {
  const auth = await requireEditor(request)
  if (!auth.success) return auth.response

  const logger = ServiceLocator.getLogger()
  logger.setContext({ endpoint: '/api/generate-article', method: 'POST', userId: auth.user.id })

  try {
    const validation = ServiceLocator.getValidation()

    // Verificar API key do ambiente (segurança)
    const apiKey = process.env.PERPLEXITY_API_KEY

    if (!apiKey) {
      logger.error('Perplexity API key not configured')
      return errorResponse('API key não configurada no servidor', 500)
    }

    // Parse e valida request body
    const body = await request.json()
    const params = validation.validate(generateArticleRequestSchema, body)

    logger.info('Generating article', {
      topic: params.topic.substring(0, 50),
      type: params.type,
      model: params.model
    })

    // Monta prompt
    const prompt = buildPrompt(params)

    // Determina modelo otimizado baseado no tipo de artigo
    const perplexityModel: 'sonar' | 'sonar-pro' = params.model === 'sonar-pro' ? 'sonar-pro' : 'sonar'
    let search_recency_filter: 'day' | 'week' | 'month' | undefined

    if (params.type === 'news') {
      search_recency_filter = 'day' // Notícias: apenas últimas 24h
    }

    // Chama Perplexity API com otimizações
    const perplexityData = await callPerplexity(
      {
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
        top_p: 0.9,
        max_tokens: params.model === 'sonar-pro' ? 2000 : 1500,
        search_recency_filter,
        return_citations: true,
      },
      apiKey
    )

    // Captura citations da resposta
    const citations = perplexityData.citations || []

    const generatedText = perplexityData.choices[0].message.content

    // Parse JSON gerado (com múltiplas estratégias)
    let articleData
    try {
      let cleanedText = generatedText.trim()

      // Estratégia 1: Remover markdown code blocks se existirem
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
      }

      // Estratégia 2: Extrair apenas o JSON (do primeiro { ao último })
      const firstBrace = cleanedText.indexOf('{')
      const lastBrace = cleanedText.lastIndexOf('}')

      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedText = cleanedText.substring(firstBrace, lastBrace + 1)
      }

      // Tentar parsear
      articleData = JSON.parse(cleanedText)
    } catch (parseError) {
      logger.error('Error parsing Perplexity response', parseError as Error, {
        responsePreview: generatedText.substring(0, 200)
      })

      return errorResponse('Erro ao parsear resposta da API. A IA não retornou JSON válido.', 500)
    }

    // Calcula custo estimado (usado em todos os tipos)
    const inputTokens = perplexityData.usage?.prompt_tokens || 0
    const outputTokens = perplexityData.usage?.completion_tokens || 0

    // Custos por modelo (por 1M tokens)
    let inputCost: number
    let outputCost: number

    if (params.model === 'sonar-pro') {
      inputCost = (inputTokens / 1000000) * 3
      outputCost = (outputTokens / 1000000) * 15
    } else if (params.model === 'sonar-base') {
      inputCost = (inputTokens / 1000000) * 0.2
      outputCost = (outputTokens / 1000000) * 0.2
    } else {
      inputCost = (inputTokens / 1000000) * 1
      outputCost = (outputTokens / 1000000) * 1
    }

    const requestCost = 0.005 // Taxa de requisição
    const estimatedCost = inputCost + outputCost + requestCost

    // Para recursos, retornar estrutura diretamente sem processar
    if (params.type === 'resource') {
      logger.info('Resource generated successfully', {
        name: articleData.name,
        category: articleData.category,
        inputTokens,
        outputTokens,
        cost: estimatedCost
      })

      return successResponse({
        data: {
          ...articleData,
          citations
        },
        usage: {
          inputTokens,
          outputTokens,
          estimatedCost: parseFloat(estimatedCost.toFixed(6))
        }
      })
    }

    // Processa conteúdo seguindo regras da skill (apenas para news/educational)
    const processedContent = processArticleContent(articleData.content, params.type)

    // Valida conteúdo processado
    const validationResult = validateArticleContent(processedContent, params.type)

    // Extrai/gera metadados
    const excerpt = params.type === 'news'
      ? articleData.excerpt
      : articleData.description || extractExcerpt(processedContent)

    const slug = titleToSlug(articleData.title)
    const readTime = calculateReadTime(processedContent)
    const tags = articleData.tags || extractTags(processedContent)

    logger.info('Article generated successfully', {
      title: articleData.title,
      slug,
      type: params.type,
      inputTokens,
      outputTokens,
      cost: estimatedCost,
      validationScore: validationResult.score
    })

    // Monta resposta
    const response: GenerateArticleResponse = {
      success: true,
      data: {
        title: articleData.title,
        slug,
        excerpt,
        content: processedContent,
        category: articleData.category,
        level: params.type === 'educational' ? articleData.level : undefined,
        tags,
        readTime,
        sentiment: params.type === 'news' ? articleData.sentiment : undefined,
        citations,
      },
      usage: {
        inputTokens,
        outputTokens,
        estimatedCost: parseFloat(estimatedCost.toFixed(6))
      },
      validation: validationResult
    }

    return successResponse(response)

  } catch (error) {
    logger.error('Error generating article', error as Error)
    return errorResponse(error as Error)
  } finally {
    logger.clearContext()
  }
}
