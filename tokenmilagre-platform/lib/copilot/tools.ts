/**
 * Copilot Tools Definitions
 * All available tools for Gemini 2.5 Pro Copilot
 */

import { CopilotTool, ToolPermissionLevel, SystemStatistics } from './types';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Helper para extrair mensagem de erro
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Tool 1: Read Articles
 * Permission: AUTO (read-only)
 */
export const readArticlesTool: CopilotTool = {
  name: 'read_articles',
  description: 'Lista e busca artigos no banco de dados com filtros avançados. Use para analisar conteúdo, buscar artigos específicos ou gerar relatórios.',
  permission: ToolPermissionLevel.AUTO,
  parameters: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Quantidade de artigos a retornar (padrão: 10, máximo: 100)'
      },
      type: {
        type: 'string',
        enum: ['news', 'educational', 'all'],
        description: 'Tipo de artigo (news, educational ou all)'
      },
      published: {
        type: 'boolean',
        description: 'Filtrar por status de publicação (true = publicados, false = rascunhos)'
      },
      searchQuery: {
        type: 'string',
        description: 'Buscar no título ou conteúdo do artigo'
      },
      category: {
        type: 'string',
        description: 'Filtrar por categoria (ex: bitcoin, ethereum, defi, blockchain, trading)'
      },
      authorId: {
        type: 'string',
        description: 'Filtrar por ID do autor'
      },
      orderBy: {
        type: 'string',
        enum: ['createdAt', 'updatedAt', 'title'],
        description: 'Ordenar por campo'
      },
      order: {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Ordem de classificação (asc = crescente, desc = decrescente)'
      },
      minScore: {
        type: 'number',
        description: 'Filtrar artigos com factCheckScore >= valor especificado'
      },
      maxScore: {
        type: 'number',
        description: 'Filtrar artigos com factCheckScore <= valor especificado'
      },
      daysOld: {
        type: 'number',
        description: 'Filtrar artigos criados há mais de N dias atrás'
      }
    }
  },
  execute: async (args) => {
    try {
      const limit = Math.min(args.limit || 10, 100);
      const orderBy = args.orderBy || 'createdAt';
      const order = args.order || 'desc';

      // Build where clause
      const where: Prisma.ArticleWhereInput = {};

      if (args.type && args.type !== 'all') {
        where.type = args.type;
      }

      if (typeof args.published === 'boolean') {
        where.published = args.published;
      }

      if (args.category) {
        where.category = args.category;
      }

      if (args.authorId) {
        where.authorId = args.authorId;
      }

      if (args.searchQuery) {
        where.OR = [
          { title: { contains: args.searchQuery, mode: 'insensitive' } },
          { content: { contains: args.searchQuery, mode: 'insensitive' } },
          { excerpt: { contains: args.searchQuery, mode: 'insensitive' } }
        ];
      }

      // Filter by fact check score (build complete object to avoid spread issues)
      if (args.minScore !== undefined && args.maxScore !== undefined) {
        where.factCheckScore = { gte: args.minScore, lte: args.maxScore };
      } else if (args.minScore !== undefined) {
        where.factCheckScore = { gte: args.minScore };
      } else if (args.maxScore !== undefined) {
        where.factCheckScore = { lte: args.maxScore };
      }

      if (args.daysOld) {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - args.daysOld);
        where.createdAt = { lt: daysAgo };
      }

      // Execute query
      const articles = await prisma.article.findMany({
        where,
        take: limit,
        orderBy: { [orderBy]: order },
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          published: true,
          category: true,
          tags: true,
          excerpt: true,
          sentiment: true,
          factCheckScore: true,
          factCheckStatus: true,
          level: true,
          readTime: true,
          coverImage: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      });

      return {
        success: true,
        data: {
          count: articles.length,
          articles: articles.map(article => ({
            ...article,
            tags: article.tags ? JSON.parse(article.tags) : [],
            contentPreview: undefined // Não retornar conteúdo completo para economizar tokens
          }))
        },
        message: `Encontrados ${articles.length} artigos`
      };

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error) || 'Erro ao buscar artigos'
      };
    }
  }
};

/**
 * Tool 2: Get Statistics
 * Permission: AUTO (read-only)
 */
export const getStatisticsTool: CopilotTool = {
  name: 'get_statistics',
  description: 'Obtém estatísticas completas do sistema incluindo artigos, usuários, recursos e performance. Use para visão geral do estado da plataforma.',
  permission: ToolPermissionLevel.AUTO,
  parameters: {
    type: 'object',
    properties: {
      includeDetails: {
        type: 'boolean',
        description: 'Incluir detalhes adicionais como top categorias, autores mais ativos, etc'
      }
    }
  },
  execute: async (args) => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      // Articles stats
      const [
        totalArticles,
        publishedArticles,
        newsArticles,
        educationalArticles,
        todayArticles,
        weekArticles,
        monthArticles,
        avgScoreResult
      ] = await Promise.all([
        prisma.article.count(),
        prisma.article.count({ where: { published: true } }),
        prisma.article.count({ where: { type: 'news' } }),
        prisma.article.count({ where: { type: 'educational' } }),
        prisma.article.count({ where: { createdAt: { gte: today } } }),
        prisma.article.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.article.count({ where: { createdAt: { gte: monthAgo } } }),
        prisma.article.aggregate({
          _avg: { factCheckScore: true },
          where: { factCheckScore: { not: null } }
        })
      ]);

      // Users stats
      const [
        totalUsers,
        adminUsers,
        editorUsers,
        viewerUsers
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.user.count({ where: { role: 'EDITOR' } }),
        prisma.user.count({ where: { role: 'VIEWER' } })
      ]);

      // Active authors today (distinct count)
      const activeAuthors = await prisma.article.findMany({
        where: { createdAt: { gte: today } },
        distinct: ['authorId'],
        select: { authorId: true }
      });
      const activeToday = activeAuthors.length;

      // Resources stats
      const totalResources = await prisma.resource.count();

      // Performance stats
      const [
        articlesNeedingReview,
        lowScoreArticles
      ] = await Promise.all([
        prisma.article.count({
          where: {
            OR: [
              { factCheckScore: { lt: 70 } },
              { factCheckScore: null, published: true }
            ]
          }
        }),
        prisma.article.count({
          where: { factCheckScore: { lt: 60 } }
        })
      ]);

      const stats: SystemStatistics = {
        articles: {
          total: totalArticles,
          published: publishedArticles,
          drafts: totalArticles - publishedArticles,
          byType: {
            news: newsArticles,
            educational: educationalArticles
          },
          today: todayArticles,
          thisWeek: weekArticles,
          thisMonth: monthArticles
        },
        users: {
          total: totalUsers,
          byRole: {
            admin: adminUsers,
            editor: editorUsers,
            viewer: viewerUsers
          },
          activeToday: activeToday
        },
        resources: {
          total: totalResources,
          byCategory: {}
        },
        performance: {
          avgArticleScore: avgScoreResult._avg.factCheckScore || 0,
          articlesNeedingReview,
          lowScoreArticles
        },
        system: {}
      };

      // Include details if requested
      interface StatisticsDetails {
        topCategories?: Array<{ category: string | null; count: number }>;
        topAuthors?: Array<{ name: string; email: string | null; articles: number }>;
      }
      let details: StatisticsDetails = {};
      if (args.includeDetails) {
        const [topCategories, topAuthors] = await Promise.all([
          // Top categories
          prisma.article.groupBy({
            by: ['category'],
            _count: { category: true },
            orderBy: { _count: { category: 'desc' } },
            take: 5,
            where: { published: true }
          }),
          // Top authors
          prisma.article.groupBy({
            by: ['authorId'],
            _count: { authorId: true },
            orderBy: { _count: { authorId: 'desc' } },
            take: 5,
            where: { published: true }
          })
        ]);

        details = {
          topCategories: topCategories.map(c => ({
            category: c.category,
            count: c._count.category
          })),
          topAuthors: await Promise.all(
            topAuthors.map(async (a) => {
              const user = await prisma.user.findUnique({
                where: { id: a.authorId },
                select: { name: true, email: true }
              });
              return {
                name: user?.name || 'Unknown',
                email: user?.email,
                articles: a._count.authorId
              };
            })
          )
        };
      }

      return {
        success: true,
        data: {
          statistics: stats,
          ...(args.includeDetails && { details })
        },
        message: 'Estatísticas obtidas com sucesso'
      };

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error) || 'Erro ao obter estatísticas'
      };
    }
  }
};

/**
 * Tool 3: Create Article
 * Permission: CONFIRM (requires user confirmation)
 */
export const createArticleTool: CopilotTool = {
  name: 'create_article',
  description: 'Cria um novo artigo no banco de dados. Requer confirmação do usuário. Use quando precisar criar conteúdo automaticamente.',
  permission: ToolPermissionLevel.CONFIRM,
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Título do artigo'
      },
      slug: {
        type: 'string',
        description: 'Slug único para URL (kebab-case)'
      },
      content: {
        type: 'string',
        description: 'Conteúdo em markdown'
      },
      excerpt: {
        type: 'string',
        description: 'Resumo/descrição do artigo'
      },
      type: {
        type: 'string',
        enum: ['news', 'educational'],
        description: 'Tipo de artigo'
      },
      category: {
        type: 'string',
        description: 'Categoria do artigo'
      },
      tags: {
        type: 'array',
        description: 'Array de tags',
        items: { type: 'string' }
      },
      published: {
        type: 'boolean',
        description: 'Publicar imediatamente (padrão: false)'
      },
      sentiment: {
        type: 'string',
        enum: ['positive', 'neutral', 'negative'],
        description: 'Sentimento do artigo (apenas para notícias)'
      },
      level: {
        type: 'string',
        enum: ['iniciante', 'intermediario', 'avancado'],
        description: 'Nível de dificuldade (apenas para educacionais)'
      },
      readTime: {
        type: 'string',
        description: 'Tempo de leitura estimado (ex: "5 min")'
      }
    },
    required: ['title', 'slug', 'content', 'type', 'category']
  },
  execute: async (args, context) => {
    try {
      if (!context?.userId) {
        return {
          success: false,
          error: 'Contexto de usuário não fornecido',
          requiresConfirmation: false
        };
      }

      // Validate slug uniqueness
      const existingArticle = await prisma.article.findUnique({
        where: { slug: args.slug }
      });

      if (existingArticle) {
        return {
          success: false,
          error: `Já existe um artigo com o slug "${args.slug}"`,
          requiresConfirmation: false
        };
      }

      // Prepare article data
      const articleData: Prisma.ArticleCreateInput = {
        title: args.title,
        slug: args.slug,
        content: args.content,
        excerpt: args.excerpt,
        type: args.type,
        category: args.category,
        tags: args.tags ? JSON.stringify(args.tags) : JSON.stringify([]),
        published: args.published || false,
        author: { connect: { id: context.userId } }
      };

      if (args.type === 'news' && args.sentiment) {
        articleData.sentiment = args.sentiment;
      }

      if (args.type === 'educational') {
        if (args.level) articleData.level = args.level;
        if (args.readTime) articleData.readTime = args.readTime;
      }

      // Create article
      const article = await prisma.article.create({
        data: articleData,
        include: {
          author: {
            select: { name: true, email: true }
          }
        }
      });

      return {
        success: true,
        data: {
          article: {
            id: article.id,
            title: article.title,
            slug: article.slug,
            type: article.type,
            category: article.category,
            published: article.published,
            author: article.author
          }
        },
        message: `Artigo "${article.title}" criado com sucesso!`,
        metadata: {
          articleUrl: `/dashboard/${article.type === 'news' ? 'noticias' : 'educacao'}/${article.slug}`
        }
      };

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error) || 'Erro ao criar artigo'
      };
    }
  }
};

/**
 * Tool 4: Update Article
 * Permission: CONFIRM (requires user confirmation)
 */
export const updateArticleTool: CopilotTool = {
  name: 'update_article',
  description: 'Atualiza um artigo existente. Requer confirmação do usuário. Use para corrigir erros, melhorar conteúdo ou atualizar informações.',
  permission: ToolPermissionLevel.CONFIRM,
  parameters: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID do artigo a ser atualizado (obrigatório se slug não fornecido)'
      },
      slug: {
        type: 'string',
        description: 'Slug do artigo a ser atualizado (obrigatório se id não fornecido)'
      },
      title: {
        type: 'string',
        description: 'Novo título'
      },
      content: {
        type: 'string',
        description: 'Novo conteúdo em markdown'
      },
      excerpt: {
        type: 'string',
        description: 'Novo resumo/descrição'
      },
      category: {
        type: 'string',
        description: 'Nova categoria'
      },
      tags: {
        type: 'array',
        description: 'Novas tags',
        items: { type: 'string' }
      },
      published: {
        type: 'boolean',
        description: 'Alterar status de publicação'
      },
      sentiment: {
        type: 'string',
        enum: ['positive', 'neutral', 'negative'],
        description: 'Atualizar sentimento (apenas notícias)'
      },
      level: {
        type: 'string',
        enum: ['iniciante', 'intermediario', 'avancado'],
        description: 'Atualizar nível (apenas educacionais)'
      }
    }
  },
  execute: async (args) => {
    try {
      if (!args.id && !args.slug) {
        return {
          success: false,
          error: 'É necessário fornecer id ou slug do artigo'
        };
      }

      // Find article
      const article = await prisma.article.findUnique({
        where: args.id ? { id: args.id } : { slug: args.slug }
      });

      if (!article) {
        return {
          success: false,
          error: `Artigo não encontrado (${args.id || args.slug})`
        };
      }

      // Prepare update data
      const updateData: Prisma.ArticleUpdateInput = {};
      if (args.title) updateData.title = args.title;
      if (args.content) updateData.content = args.content;
      if (args.excerpt) updateData.excerpt = args.excerpt;
      if (args.category) updateData.category = args.category;
      if (args.tags) updateData.tags = JSON.stringify(args.tags);
      if (typeof args.published === 'boolean') updateData.published = args.published;
      if (args.sentiment) updateData.sentiment = args.sentiment;
      if (args.level) updateData.level = args.level;

      // Update article
      const updatedArticle = await prisma.article.update({
        where: { id: article.id },
        data: updateData,
        include: {
          author: {
            select: { name: true }
          }
        }
      });

      return {
        success: true,
        data: {
          article: {
            id: updatedArticle.id,
            title: updatedArticle.title,
            slug: updatedArticle.slug,
            updatedFields: Object.keys(updateData)
          }
        },
        message: `Artigo "${updatedArticle.title}" atualizado com sucesso!`,
        metadata: {
          changesCount: Object.keys(updateData).length
        }
      };

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error) || 'Erro ao atualizar artigo'
      };
    }
  }
};

/**
 * Tool 5: Delete Article
 * Permission: CONFIRM_TWICE (requires double confirmation)
 */
export const deleteArticleTool: CopilotTool = {
  name: 'delete_article',
  description: 'Deleta permanentemente um artigo. AÇÃO DESTRUTIVA - Requer confirmação dupla. Use apenas em casos excepcionais.',
  permission: ToolPermissionLevel.CONFIRM_TWICE,
  parameters: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID do artigo a ser deletado (obrigatório se slug não fornecido)'
      },
      slug: {
        type: 'string',
        description: 'Slug do artigo a ser deletado (obrigatório se id não fornecido)'
      },
      reason: {
        type: 'string',
        description: 'Motivo da exclusão (obrigatório para audit log)'
      }
    },
    required: ['reason']
  },
  execute: async (args) => {
    try {
      if (!args.id && !args.slug) {
        return {
          success: false,
          error: 'É necessário fornecer id ou slug do artigo'
        };
      }

      // Find article
      const article = await prisma.article.findUnique({
        where: args.id ? { id: args.id } : { slug: args.slug },
        include: {
          author: {
            select: { name: true }
          }
        }
      });

      if (!article) {
        return {
          success: false,
          error: `Artigo não encontrado (${args.id || args.slug})`
        };
      }

      // Delete article
      await prisma.article.delete({
        where: { id: article.id }
      });

      return {
        success: true,
        data: {
          deletedArticle: {
            id: article.id,
            title: article.title,
            slug: article.slug,
            author: article.author.name,
            reason: args.reason
          }
        },
        message: `Artigo "${article.title}" deletado permanentemente. Motivo: ${args.reason}`,
        metadata: {
          warning: 'Esta ação é irreversível!'
        }
      };

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error) || 'Erro ao deletar artigo'
      };
    }
  }
};

/**
 * Basic tools (Phase 1)
 */
export const basicTools: CopilotTool[] = [
  readArticlesTool,
  getStatisticsTool,
  createArticleTool,
  updateArticleTool,
  deleteArticleTool
];

// Import advanced and admin tools
import { advancedTools } from './advanced-tools';
import { adminTools } from './admin-tools';

/**
 * All available tools (Phase 1 + Phase 2)
 */
export const allTools: CopilotTool[] = [
  ...basicTools,
  ...advancedTools,
  ...adminTools
];

/**
 * Get tool by name
 */
export function getToolByName(name: string): CopilotTool | undefined {
  return allTools.find(tool => tool.name === name);
}

/**
 * Convert tools to Gemini function declarations
 */
export function toolsToFunctionDeclarations() {
  return allTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters
  }));
}

/**
 * Get tools by permission level
 */
export function getToolsByPermission(level: ToolPermissionLevel): CopilotTool[] {
  return allTools.filter(tool => tool.permission === level);
}

/**
 * Get tool statistics
 */
export function getToolsStats() {
  return {
    total: allTools.length,
    basic: basicTools.length,
    advanced: advancedTools.length,
    admin: adminTools.length,
    byPermission: {
      auto: allTools.filter(t => t.permission === ToolPermissionLevel.AUTO).length,
      confirm: allTools.filter(t => t.permission === ToolPermissionLevel.CONFIRM).length,
      confirmTwice: allTools.filter(t => t.permission === ToolPermissionLevel.CONFIRM_TWICE).length
    }
  };
}
