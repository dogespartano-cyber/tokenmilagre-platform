/**
 * Admin Tools for Copilot
 * Tools for user management, bulk operations and reporting
 */

import { CopilotTool, ToolPermissionLevel } from './types';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Helper para extrair mensagem de erro
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Tool 10: Manage Users
 * Permission: AUTO for read, CONFIRM for write
 */
export const manageUsersTool: CopilotTool = {
  name: 'manage_users',
  description: 'Gerencia usuários do sistema. Pode listar, buscar e obter informações sobre usuários. Atualização de roles requer confirmação.',
  permission: ToolPermissionLevel.AUTO,
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['list', 'search', 'get_details', 'update_role'],
        description: 'Ação a executar'
      },
      role: {
        type: 'string',
        enum: ['ADMIN', 'EDITOR', 'VIEWER'],
        description: 'Filtrar por role (para list/search)'
      },
      searchQuery: {
        type: 'string',
        description: 'Buscar por nome ou email'
      },
      userId: {
        type: 'string',
        description: 'ID do usuário (para get_details ou update_role)'
      },
      newRole: {
        type: 'string',
        enum: ['ADMIN', 'EDITOR', 'VIEWER'],
        description: 'Novo role (apenas para update_role)'
      },
      limit: {
        type: 'number',
        description: 'Limite de resultados (padrão: 20)'
      }
    },
    required: ['action']
  },
  execute: async (args) => {
    try {
      const action = args.action;

      // List users
      if (action === 'list') {
        const where: Prisma.UserWhereInput = {};
        if (args.role) {
          where.role = args.role;
        }

        const users = await prisma.user.findMany({
          where,
          take: Math.min(args.limit || 20, 100),
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: {
              select: { articles: true }
            }
          }
        });

        const byRole = {
          ADMIN: users.filter(u => u.role === 'ADMIN').length,
          EDITOR: users.filter(u => u.role === 'EDITOR').length,
          VIEWER: users.filter(u => u.role === 'VIEWER').length
        };

        return {
          success: true,
          data: {
            summary: {
              total: users.length,
              byRole
            },
            users: users.map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              articlesCount: u._count.articles,
              createdAt: u.createdAt
            }))
          },
          message: `Listados ${users.length} usuários. ${byRole.ADMIN} ADMIN, ${byRole.EDITOR} EDITOR, ${byRole.VIEWER} VIEWER.`
        };
      }

      // Search users
      if (action === 'search') {
        if (!args.searchQuery) {
          throw new Error('searchQuery é obrigatório para search');
        }

        const users = await prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: args.searchQuery, mode: 'insensitive' } },
              { email: { contains: args.searchQuery, mode: 'insensitive' } }
            ]
          },
          take: Math.min(args.limit || 10, 50),
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        });

        return {
          success: true,
          data: {
            query: args.searchQuery,
            results: users.length,
            users
          },
          message: `Encontrados ${users.length} usuários com "${args.searchQuery}"`
        };
      }

      // Get user details
      if (action === 'get_details') {
        if (!args.userId) {
          throw new Error('userId é obrigatório para get_details');
        }

        const user = await prisma.user.findUnique({
          where: { id: args.userId },
          include: {
            articles: {
              select: {
                id: true,
                title: true,
                type: true,
                published: true,
                createdAt: true
              },
              orderBy: { createdAt: 'desc' },
              take: 10
            },
            _count: {
              select: { articles: true }
            }
          }
        });

        if (!user) {
          return {
            success: false,
            error: `Usuário não encontrado: ${args.userId}`
          };
        }

        return {
          success: true,
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
              totalArticles: user._count.articles,
              recentArticles: user.articles
            }
          },
          message: `Detalhes do usuário ${user.name || user.email}`
        };
      }

      // Update role (requires confirmation)
      if (action === 'update_role') {
        if (!args.userId || !args.newRole) {
          throw new Error('userId e newRole são obrigatórios para update_role');
        }

        // This action requires confirmation - return confirmation request
        return {
          success: false,
          requiresConfirmation: true,
          confirmationMessage: `Você quer alterar o role do usuário ${args.userId} para ${args.newRole}. Esta é uma ação administrativa crítica. Confirma?`,
          data: {
            action: 'update_role',
            userId: args.userId,
            newRole: args.newRole
          }
        };
      }

      throw new Error(`Ação não suportada: ${action}`);

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error) || 'Erro ao gerenciar usuários'
      };
    }
  }
};

/**
 * Tool 11: Bulk Update Articles
 * Permission: CONFIRM (modifies multiple articles)
 */
export const bulkUpdateArticlesTool: CopilotTool = {
  name: 'bulk_update_articles',
  description: 'Atualiza múltiplos artigos de uma vez. Permite modificar categoria, tags, status de publicação, etc. Requer confirmação.',
  permission: ToolPermissionLevel.CONFIRM,
  parameters: {
    type: 'object',
    properties: {
      articleIds: {
        type: 'array',
        description: 'IDs dos artigos a atualizar',
        items: { type: 'string' }
      },
      filter: {
        type: 'object',
        description: 'Filtro para selecionar artigos (alternativa a articleIds)',
        properties: {
          type: { type: 'string', enum: ['news', 'educational'] },
          category: { type: 'string' },
          published: { type: 'boolean' },
          minScore: { type: 'number' },
          maxScore: { type: 'number' }
        }
      },
      updates: {
        type: 'object',
        description: 'Campos a atualizar',
        properties: {
          published: { type: 'boolean' },
          category: { type: 'string' },
          addTags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags a adicionar'
          },
          removeTags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags a remover'
          }
        }
      },
      dryRun: {
        type: 'boolean',
        description: 'Simular operação sem executar (padrão: false)'
      }
    },
    required: ['updates']
  },
  execute: async (args) => {
    try {
      let articleIds = args.articleIds || [];

      // If filter is provided, get article IDs from filter
      if (args.filter && articleIds.length === 0) {
        const where: Prisma.ArticleWhereInput = {};
        if (args.filter.type) where.type = args.filter.type;
        if (args.filter.category) where.category = args.filter.category;
        if (typeof args.filter.published === 'boolean') where.published = args.filter.published;
        // Filter by fact check score (build complete object to avoid spread issues)
        if (args.filter.minScore !== undefined && args.filter.maxScore !== undefined) {
          where.factCheckScore = { gte: args.filter.minScore, lte: args.filter.maxScore };
        } else if (args.filter.minScore !== undefined) {
          where.factCheckScore = { gte: args.filter.minScore };
        } else if (args.filter.maxScore !== undefined) {
          where.factCheckScore = { lte: args.filter.maxScore };
        }

        const filtered = await prisma.article.findMany({
          where,
          select: { id: true, title: true, slug: true }
        });

        articleIds = filtered.map(a => a.id);

        if (articleIds.length === 0) {
          return {
            success: false,
            error: 'Nenhum artigo encontrado com os filtros especificados'
          };
        }

        if (articleIds.length > 100) {
          return {
            success: false,
            error: `Muitos artigos (${articleIds.length}). Limite: 100. Refine os filtros.`
          };
        }
      }

      if (articleIds.length === 0) {
        return {
          success: false,
          error: 'É necessário fornecer articleIds ou filter'
        };
      }

      // Dry run - just show what would be updated
      if (args.dryRun) {
        const articles = await prisma.article.findMany({
          where: { id: { in: articleIds } },
          select: { id: true, title: true, slug: true, tags: true, published: true, category: true }
        });

        return {
          success: true,
          data: {
            dryRun: true,
            articlesToUpdate: articles.length,
            updates: args.updates,
            preview: articles.map(a => ({
              id: a.id,
              title: a.title,
              currentPublished: a.published,
              currentCategory: a.category,
              currentTags: a.tags ? JSON.parse(a.tags) : []
            }))
          },
          message: `[DRY RUN] ${articles.length} artigos seriam atualizados`
        };
      }

      // Build update data
      const updateData: Prisma.ArticleUpdateInput = {};

      if (typeof args.updates.published === 'boolean') {
        updateData.published = args.updates.published;
      }

      if (args.updates.category) {
        updateData.category = args.updates.category;
      }

      // Handle tags (if we need to add/remove, fetch current first)
      if (args.updates.addTags || args.updates.removeTags) {
        const articles = await prisma.article.findMany({
          where: { id: { in: articleIds } },
          select: { id: true, tags: true }
        });

        // Update each article individually (can't do bulk tag manipulation easily)
        for (const article of articles) {
          let tags = article.tags ? JSON.parse(article.tags) : [];

          if (args.updates.addTags) {
            tags = [...new Set([...tags, ...args.updates.addTags])];
          }

          if (args.updates.removeTags) {
            tags = tags.filter((t: string) => !args.updates.removeTags!.includes(t));
          }

          await prisma.article.update({
            where: { id: article.id },
            data: {
              ...updateData,
              tags: JSON.stringify(tags)
            }
          });
        }

        return {
          success: true,
          data: {
            updated: articles.length,
            updates: args.updates
          },
          message: `${articles.length} artigos atualizados com sucesso`
        };
      }

      // Simple bulk update (no tag manipulation)
      const result = await prisma.article.updateMany({
        where: { id: { in: articleIds } },
        data: updateData
      });

      return {
        success: true,
        data: {
          updated: result.count,
          updates: args.updates
        },
        message: `${result.count} artigos atualizados com sucesso`
      };

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error) || 'Erro ao atualizar artigos em massa'
      };
    }
  }
};

/**
 * Tool 12: Generate Report
 * Permission: AUTO (read-only)
 */
export const generateReportTool: CopilotTool = {
  name: 'generate_report',
  description: 'Gera relatórios customizados sobre a plataforma. Pode incluir estatísticas, análises de conteúdo, performance de autores, etc.',
  permission: ToolPermissionLevel.AUTO,
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['daily', 'weekly', 'monthly', 'custom'],
        description: 'Tipo de relatório'
      },
      startDate: {
        type: 'string',
        description: 'Data de início (formato: YYYY-MM-DD) para relatório custom'
      },
      endDate: {
        type: 'string',
        description: 'Data de fim (formato: YYYY-MM-DD) para relatório custom'
      },
      sections: {
        type: 'array',
        description: 'Seções a incluir no relatório',
        items: {
          type: 'string',
          enum: ['overview', 'articles', 'authors', 'quality', 'growth', 'recommendations']
        }
      }
    },
    required: ['type']
  },
  execute: async (args) => {
    try {
      // Define date range
      let startDate: Date;
      let endDate = new Date();

      if (args.type === 'daily') {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
      } else if (args.type === 'weekly') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
      } else if (args.type === 'monthly') {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (args.type === 'custom') {
        if (!args.startDate || !args.endDate) {
          throw new Error('startDate e endDate são obrigatórios para relatório custom');
        }
        startDate = new Date(args.startDate);
        endDate = new Date(args.endDate);
      } else {
        throw new Error(`Tipo de relatório inválido: ${args.type}`);
      }

      const sections = args.sections || ['overview', 'articles', 'quality', 'recommendations'];

      interface Report {
        type: string;
        period: { start: string; end: string; days: number };
        generatedAt: string;
        sections: Record<string, unknown>;
      }

      const report: Report = {
        type: args.type,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          days: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        },
        generatedAt: new Date().toISOString(),
        sections: {}
      };

      // Overview section
      if (sections.includes('overview')) {
        const [totalArticles, publishedArticles, totalUsers] = await Promise.all([
          prisma.article.count(),
          prisma.article.count({ where: { published: true } }),
          prisma.user.count()
        ]);

        report.sections.overview = {
          totalArticles,
          publishedArticles,
          draftArticles: totalArticles - publishedArticles,
          totalUsers,
          publishRate: ((publishedArticles / totalArticles) * 100).toFixed(1) + '%'
        };
      }

      // Articles section
      if (sections.includes('articles')) {
        const articlesInPeriod = await prisma.article.findMany({
          where: {
            createdAt: { gte: startDate, lte: endDate }
          },
          select: {
            id: true,
            type: true,
            category: true,
            published: true
          }
        });

        const byType = {
          news: articlesInPeriod.filter(a => a.type === 'news').length,
          educational: articlesInPeriod.filter(a => a.type === 'educational').length
        };

        const categories = articlesInPeriod.reduce((acc: Record<string, number>, a) => {
          acc[a.category] = (acc[a.category] || 0) + 1;
          return acc;
        }, {});

        const topCategories = Object.entries(categories)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([category, count]) => ({ category, count }));

        report.sections.articles = {
          total: articlesInPeriod.length,
          published: articlesInPeriod.filter(a => a.published).length,
          byType,
          topCategories
        };
      }

      // Quality section
      if (sections.includes('quality')) {
        const articlesWithScore = await prisma.article.findMany({
          where: {
            factCheckScore: { not: null }
          },
          select: {
            factCheckScore: true
          }
        });

        if (articlesWithScore.length > 0) {
          const avgScore = articlesWithScore.reduce((sum, a) => sum + (a.factCheckScore || 0), 0) / articlesWithScore.length;
          const lowScore = articlesWithScore.filter(a => (a.factCheckScore || 0) < 60).length;
          const goodScore = articlesWithScore.filter(a => (a.factCheckScore || 0) >= 80).length;

          report.sections.quality = {
            articlesWithScore: articlesWithScore.length,
            avgScore: Math.round(avgScore),
            distribution: {
              excellent: articlesWithScore.filter(a => (a.factCheckScore || 0) >= 90).length,
              good: goodScore,
              fair: articlesWithScore.filter(a => (a.factCheckScore || 0) >= 70 && (a.factCheckScore || 0) < 80).length,
              poor: lowScore
            }
          };
        }
      }

      // Authors section
      if (sections.includes('authors')) {
        const topAuthors = await prisma.article.groupBy({
          by: ['authorId'],
          _count: { authorId: true },
          where: {
            createdAt: { gte: startDate, lte: endDate }
          },
          orderBy: { _count: { authorId: 'desc' } },
          take: 5
        });

        const authorsWithDetails = await Promise.all(
          topAuthors.map(async (a) => {
            const user = await prisma.user.findUnique({
              where: { id: a.authorId },
              select: { name: true, email: true, role: true }
            });
            return {
              name: user?.name || 'Unknown',
              email: user?.email ?? null,
              role: user?.role ?? null,
              articlesInPeriod: a._count.authorId
            };
          })
        );

        report.sections.authors = {
          topAuthors: authorsWithDetails
        };
      }

      // Growth section
      if (sections.includes('growth')) {
        const articlesCreated = await prisma.article.count({
          where: { createdAt: { gte: startDate, lte: endDate } }
        });

        const usersCreated = await prisma.user.count({
          where: { createdAt: { gte: startDate, lte: endDate } }
        });

        const days = Math.max(1, report.period.days);

        report.sections.growth = {
          articlesCreated,
          usersCreated,
          avgArticlesPerDay: (articlesCreated / days).toFixed(1)
        };
      }

      // Recommendations section
      if (sections.includes('recommendations')) {
        const recommendations = [];

        // Check article quality
        const lowScoreCount = await prisma.article.count({
          where: { factCheckScore: { lt: 60 } }
        });
        if (lowScoreCount > 0) {
          recommendations.push({
            type: 'quality',
            priority: 'high',
            message: `${lowScoreCount} artigos com score baixo precisam revisão`,
            action: 'Usar analyze_content_quality para identificar problemas'
          });
        }

        // Check outdated news
        const oldNewsDate = new Date();
        oldNewsDate.setDate(oldNewsDate.getDate() - 30);
        const oldNews = await prisma.article.count({
          where: {
            type: 'news',
            published: true,
            createdAt: { lt: oldNewsDate }
          }
        });
        if (oldNews > 0) {
          recommendations.push({
            type: 'freshness',
            priority: 'medium',
            message: `${oldNews} notícias com mais de 30 dias`,
            action: 'Usar check_outdated_articles para revisar'
          });
        }

        // Check articles without cover image
        const noCover = await prisma.article.count({
          where: {
            published: true,
            coverImage: null
          }
        });
        if (noCover > 0) {
          recommendations.push({
            type: 'media',
            priority: 'low',
            message: `${noCover} artigos sem imagem de capa`,
            action: 'Gerar capas com IA para melhor engajamento'
          });
        }

        report.sections.recommendations = recommendations;
      }

      return {
        success: true,
        data: report,
        message: `Relatório ${args.type} gerado com sucesso (${report.period.days} dias)`
      };

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error) || 'Erro ao gerar relatório'
      };
    }
  }
};

/**
 * All admin tools
 */
export const adminTools: CopilotTool[] = [
  manageUsersTool,
  bulkUpdateArticlesTool,
  generateReportTool
];
