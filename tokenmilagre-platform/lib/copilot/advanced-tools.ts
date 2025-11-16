/**
 * Advanced Copilot Tools
 * Sophisticated tools for analysis, automation and insights
 */

import { CopilotTool, ToolPermissionLevel } from './types';
import { prisma } from '@/lib/prisma';

/**
 * Tool 6: Analyze Content Quality
 * Permission: AUTO (read-only analysis)
 */
export const analyzeContentQualityTool: CopilotTool = {
  name: 'analyze_content_quality',
  description: 'Analisa a qualidade de artigos baseado em múltiplos critérios: score, estrutura, SEO, engajamento. Retorna relatório detalhado com sugestões de melhoria.',
  permission: ToolPermissionLevel.AUTO,
  parameters: {
    type: 'object',
    properties: {
      articleIds: {
        type: 'array',
        description: 'IDs dos artigos a analisar (opcional - se não fornecido, analisa artigos com problemas)',
        items: { type: 'string' }
      },
      minScore: {
        type: 'number',
        description: 'Analisar apenas artigos com score abaixo deste valor (padrão: 70)'
      },
      limit: {
        type: 'number',
        description: 'Quantidade máxima de artigos a analisar (padrão: 10)'
      },
      includeRecommendations: {
        type: 'boolean',
        description: 'Incluir recomendações detalhadas de melhoria (padrão: true)'
      }
    }
  },
  execute: async (args) => {
    try {
      const limit = Math.min(args.limit || 10, 50);
      const minScore = args.minScore || 70;

      let articles;

      if (args.articleIds && args.articleIds.length > 0) {
        // Analyze specific articles
        articles = await prisma.article.findMany({
          where: {
            id: { in: args.articleIds }
          },
          include: {
            author: {
              select: { name: true }
            }
          }
        });
      } else {
        // Analyze articles with low scores
        articles = await prisma.article.findMany({
          where: {
            OR: [
              { factCheckScore: { lt: minScore } },
              { factCheckScore: null, published: true }
            ]
          },
          take: limit,
          orderBy: { factCheckScore: 'asc' },
          include: {
            author: {
              select: { name: true }
            }
          }
        });
      }

      const analysis = articles.map((article: any) => {
        const issues = [];
        const warnings = [];
        const recommendations = [];

        // Score analysis
        const score = article.factCheckScore || 0;
        if (score < 50) {
          issues.push('Score crítico (<50)');
          recommendations.push('Revisar completamente o conteúdo');
        } else if (score < 70) {
          warnings.push('Score abaixo do ideal (<70)');
          recommendations.push('Melhorar qualidade do conteúdo');
        }

        // Structure analysis
        const contentLength = article.content?.length || 0;
        if (contentLength < 500) {
          issues.push('Conteúdo muito curto (<500 chars)');
          recommendations.push('Expandir conteúdo para pelo menos 1000 caracteres');
        }

        const h2Count = (article.content?.match(/^## /gm) || []).length;
        if (article.type === 'news' && h2Count < 4) {
          warnings.push(`Poucas seções (${h2Count} H2, ideal: 5-6)`);
          recommendations.push('Adicionar mais seções H2 para melhor estrutura');
        }

        // SEO analysis
        if (!article.excerpt || article.excerpt.length < 100) {
          warnings.push('Excerpt muito curto ou ausente');
          recommendations.push('Criar excerpt de 150-200 caracteres');
        }

        const tags = article.tags ? JSON.parse(article.tags) : [];
        if (tags.length < 3) {
          warnings.push(`Poucas tags (${tags.length}, ideal: 5-8)`);
          recommendations.push('Adicionar mais tags relevantes para SEO');
        }

        // Freshness analysis
        const daysSinceCreation = Math.floor(
          (Date.now() - article.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (article.type === 'news' && daysSinceCreation > 30) {
          warnings.push(`Artigo desatualizado (${daysSinceCreation} dias)`);
          recommendations.push('Atualizar ou arquivar artigo antigo');
        }

        // Cover image analysis
        if (!article.coverImage) {
          warnings.push('Sem imagem de capa');
          recommendations.push('Gerar capa com IA para melhor engajamento');
        }

        // Calculate quality score
        let qualityScore = 100;
        qualityScore -= issues.length * 15;
        qualityScore -= warnings.length * 5;
        qualityScore = Math.max(0, Math.min(100, qualityScore));

        return {
          id: article.id,
          title: article.title,
          slug: article.slug,
          type: article.type,
          published: article.published,
          author: article.author.name,
          factCheckScore: article.factCheckScore,
          qualityScore,
          contentLength,
          h2Count,
          tagsCount: tags.length,
          daysSinceCreation,
          hasCoverImage: !!article.coverImage,
          issues,
          warnings,
          ...(args.includeRecommendations !== false && { recommendations })
        };
      });

      // Summary statistics
      const avgQualityScore = analysis.reduce((sum: any, a: any) => sum + a.qualityScore, 0) / analysis.length;
      const criticalIssues = analysis.filter((a: any) => a.issues.length > 0).length;
      const needsAttention = analysis.filter((a: any) => a.qualityScore < 70).length;

      return {
        success: true,
        data: {
          summary: {
            totalAnalyzed: analysis.length,
            avgQualityScore: Math.round(avgQualityScore),
            criticalIssues,
            needsAttention,
            healthStatus: avgQualityScore >= 80 ? 'excellent' : avgQualityScore >= 70 ? 'good' : avgQualityScore >= 60 ? 'fair' : 'poor'
          },
          articles: analysis
        },
        message: `Análise completa de ${analysis.length} artigos. Score médio: ${Math.round(avgQualityScore)}/100. ${criticalIssues} com problemas críticos.`
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao analisar qualidade do conteúdo'
      };
    }
  }
};

/**
 * Tool 7: Check Outdated Articles
 * Permission: AUTO (read-only)
 */
export const checkOutdatedArticlesTool: CopilotTool = {
  name: 'check_outdated_articles',
  description: 'Detecta artigos desatualizados baseado em idade e tipo. Notícias >30 dias são consideradas antigas.',
  permission: ToolPermissionLevel.AUTO,
  parameters: {
    type: 'object',
    properties: {
      daysThreshold: {
        type: 'number',
        description: 'Considerar artigos com mais de N dias como desatualizados (padrão: 30 para news, 180 para educational)'
      },
      type: {
        type: 'string',
        enum: ['news', 'educational', 'all'],
        description: 'Tipo de artigo a verificar'
      },
      onlyPublished: {
        type: 'boolean',
        description: 'Verificar apenas artigos publicados (padrão: true)'
      },
      limit: {
        type: 'number',
        description: 'Quantidade máxima de artigos a retornar (padrão: 20)'
      }
    }
  },
  execute: async (args) => {
    try {
      const type = args.type || 'all';
      const onlyPublished = args.onlyPublished !== false;
      const limit = Math.min(args.limit || 20, 100);

      // Different thresholds for different types
      const newsThreshold = args.daysThreshold || 30;
      const educationalThreshold = args.daysThreshold || 180;

      const now = new Date();
      const newsDate = new Date(now);
      newsDate.setDate(newsDate.getDate() - newsThreshold);
      const eduDate = new Date(now);
      eduDate.setDate(eduDate.getDate() - educationalThreshold);

      const where: any = {
        published: onlyPublished ? true : undefined
      };

      if (type === 'news') {
        where.type = 'news';
        where.createdAt = { lt: newsDate };
      } else if (type === 'educational') {
        where.type = 'educational';
        where.createdAt = { lt: eduDate };
      } else {
        where.OR = [
          { type: 'news', createdAt: { lt: newsDate } },
          { type: 'educational', createdAt: { lt: eduDate } }
        ];
      }

      const articles = await prisma.article.findMany({
        where,
        take: limit,
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          category: true,
          published: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: { name: true }
          }
        }
      });

      const outdated = articles.map((article: any) => {
        const daysSinceCreation = Math.floor(
          (now.getTime() - article.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        const daysSinceUpdate = Math.floor(
          (now.getTime() - article.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        let urgency: 'high' | 'medium' | 'low';
        if (article.type === 'news') {
          urgency = daysSinceCreation > 60 ? 'high' : daysSinceCreation > 45 ? 'medium' : 'low';
        } else {
          urgency = daysSinceCreation > 365 ? 'high' : daysSinceCreation > 270 ? 'medium' : 'low';
        }

        return {
          id: article.id,
          title: article.title,
          slug: article.slug,
          type: article.type,
          category: article.category,
          published: article.published,
          author: article.author.name,
          daysSinceCreation,
          daysSinceUpdate,
          urgency,
          recommendation: urgency === 'high'
            ? 'Arquivar ou atualizar urgentemente'
            : urgency === 'medium'
            ? 'Revisar e atualizar se relevante'
            : 'Monitorar'
        };
      });

      const byUrgency = {
        high: outdated.filter((a: any) => a.urgency === 'high').length,
        medium: outdated.filter((a: any) => a.urgency === 'medium').length,
        low: outdated.filter((a: any) => a.urgency === 'low').length
      };

      return {
        success: true,
        data: {
          summary: {
            total: outdated.length,
            byUrgency,
            oldestArticle: outdated[0] ? {
              title: outdated[0].title,
              daysOld: outdated[0].daysSinceCreation
            } : null
          },
          articles: outdated
        },
        message: `Encontrados ${outdated.length} artigos desatualizados. ${byUrgency.high} urgentes, ${byUrgency.medium} médios, ${byUrgency.low} baixos.`
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao verificar artigos desatualizados'
      };
    }
  }
};

/**
 * Tool 8: Suggest Trending Topics
 * Permission: AUTO (read-only web search)
 */
export const suggestTrendingTopicsTool: CopilotTool = {
  name: 'suggest_trending_topics',
  description: 'Sugere tópicos em alta no mundo crypto usando Perplexity AI para buscar tendências atuais. Retorna lista de tópicos relevantes para criar artigos.',
  permission: ToolPermissionLevel.AUTO,
  parameters: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: ['bitcoin', 'ethereum', 'defi', 'nfts', 'altcoins', 'all'],
        description: 'Categoria específica para buscar tendências (padrão: all)'
      },
      region: {
        type: 'string',
        enum: ['global', 'brasil', 'americas', 'europe'],
        description: 'Região geográfica para tendências (padrão: global)'
      },
      limit: {
        type: 'number',
        description: 'Quantidade de tópicos a sugerir (padrão: 5, máx: 10)'
      }
    }
  },
  execute: async (args) => {
    try {
      const category = args.category || 'all';
      const region = args.region || 'global';
      const limit = Math.min(args.limit || 5, 10);

      const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
      if (!PERPLEXITY_API_KEY) {
        throw new Error('PERPLEXITY_API_KEY não configurada');
      }

      // Build search query
      let query = 'O que está em alta no mundo das criptomoedas';
      if (category !== 'all') {
        query += ` sobre ${category}`;
      }
      if (region !== 'global') {
        query += ` na região ${region}`;
      }
      query += ' hoje? Liste os tópicos mais relevantes e discutidos nas últimas 24 horas.';

      // Call Perplexity
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: `Você é um analista de tendências crypto. Retorne uma lista estruturada de ${limit} tópicos trending em formato JSON com esta estrutura:
{
  "topics": [
    {
      "title": "Título do tópico",
      "description": "Descrição breve",
      "category": "bitcoin|ethereum|defi|nfts|altcoins",
      "urgency": "high|medium|low",
      "suggestedArticleType": "news|educational",
      "keywords": ["keyword1", "keyword2"]
    }
  ]
}`
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
          search_recency_filter: 'day'
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao consultar Perplexity API');
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Resposta vazia da Perplexity');
      }

      // Parse JSON from response
      let topics;
      try {
        // Remove markdown code blocks if present
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```/g, '');
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          topics = parsed.topics || [];
        } else {
          throw new Error('JSON não encontrado na resposta');
        }
      } catch (parseError) {
        // Fallback: return raw content
        return {
          success: true,
          data: {
            raw: true,
            content,
            message: 'Não foi possível parsear JSON. Retornando conteúdo bruto.'
          }
        };
      }

      return {
        success: true,
        data: {
          category,
          region,
          topics: topics.slice(0, limit),
          generatedAt: new Date().toISOString()
        },
        message: `Encontrados ${topics.length} tópicos em alta sobre ${category} (${region})`
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao sugerir tópicos trending'
      };
    }
  }
};

/**
 * Tool 9: Search Web
 * Permission: AUTO (read-only web search)
 */
export const searchWebTool: CopilotTool = {
  name: 'search_web',
  description: 'Busca informações atualizadas na web usando Perplexity AI. Use para obter dados em tempo real sobre mercado, notícias, análises crypto.',
  permission: ToolPermissionLevel.AUTO,
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Pergunta ou tópico a pesquisar'
      },
      recency: {
        type: 'string',
        enum: ['day', 'week', 'month', 'year'],
        description: 'Filtrar resultados por recência (padrão: week)'
      },
      maxLength: {
        type: 'number',
        description: 'Tamanho máximo da resposta em tokens (padrão: 1000)'
      }
    },
    required: ['query']
  },
  execute: async (args) => {
    try {
      const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
      if (!PERPLEXITY_API_KEY) {
        throw new Error('PERPLEXITY_API_KEY não configurada');
      }

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            {
              role: 'user',
              content: args.query
            }
          ],
          max_tokens: args.maxLength || 1000,
          temperature: 0.5,
          search_recency_filter: args.recency || 'week',
          return_citations: true
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao consultar Perplexity API');
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      const citations = data.citations || [];

      return {
        success: true,
        data: {
          query: args.query,
          answer: content,
          citations,
          searchedAt: new Date().toISOString()
        },
        message: `Busca concluída. ${citations.length} fontes consultadas.`
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao buscar na web'
      };
    }
  }
};

/**
 * All advanced tools
 */
export const advancedTools: CopilotTool[] = [
  analyzeContentQualityTool,
  checkOutdatedArticlesTool,
  suggestTrendingTopicsTool,
  searchWebTool
];
