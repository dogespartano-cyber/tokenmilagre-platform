---
name: tokenmilagre-copilot-tools
description: This skill guides the development of Copilot AI tools for the Token Milagre platform. Use when creating new tools, implementing tool parameters, handling tool execution, and managing activity logging. Includes patterns for type-safe tool development and best practices.
license: MIT
---

# Token Milagre - Copilot Tools Development Guide

Complete guide for creating and managing Copilot AI tools in the Token Milagre Platform.

## Purpose

Provide standardized patterns for developing AI Copilot tools that integrate with Claude/GPT models to perform platform operations through conversational interfaces.

## When to Use This Skill

Use this skill when:
- Creating new Copilot tools
- Debugging tool execution issues
- Adding new tool parameters
- Implementing tool result formatting
- Setting up activity logging
- Managing tool permissions (admin vs user tools)

## Architecture Overview

```
/lib/copilot/
├── tools.ts          # User-level tools (read-only operations)
├── admin-tools.ts    # Admin tools (write operations)
├── types.ts          # Shared type definitions
└── activity.ts       # Activity logging utilities

/app/api/copilot/
└── route.ts          # Copilot API endpoint
```

## Tool Structure

### Basic Tool Template

```typescript
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface ToolContext {
  userId: string;
  userName: string;
  userRole: string;
}

interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export const myToolDefinition = {
  name: 'my_tool_name',
  description: 'Clear, concise description of what this tool does',

  parameters: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Description of parameter 1'
      },
      param2: {
        type: 'number',
        description: 'Description of parameter 2',
        optional: true
      }
    },
    required: ['param1']
  },

  execute: async (args: any, context: ToolContext): Promise<ToolResult> => {
    try {
      // Validate input
      if (!args.param1) {
        return {
          success: false,
          error: 'param1 is required'
        };
      }

      // Perform operation
      const result = await performOperation(args, context);

      // Log activity
      await logActivity({
        userId: context.userId,
        toolName: 'my_tool_name',
        action: 'operation_performed',
        details: { param1: args.param1 }
      });

      return {
        success: true,
        data: result,
        message: 'Operation completed successfully'
      };

    } catch (error: unknown) {
      console.error('Tool execution error:', error);
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }
};
```

## Type-Safe Tool Development

### Error Handling Pattern

```typescript
// Helper function for extracting error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Usage in tools
try {
  // ... operations
} catch (error: unknown) {  // ✅ NOT 'any'
  return {
    success: false,
    error: getErrorMessage(error)
  };
}
```

### Prisma Type Usage

```typescript
import { Prisma } from '@prisma/client';

// Query operations
async function searchArticles(args: any) {
  const where: Prisma.ArticleWhereInput = {};  // ✅ Type-safe

  // Build WHERE clause conditionally
  if (args.category) {
    where.category = args.category;
  }

  if (args.published !== undefined) {
    where.published = args.published;
  }

  // Text search
  if (args.query) {
    where.OR = [
      { title: { contains: args.query, mode: 'insensitive' } },
      { content: { contains: args.query, mode: 'insensitive' } }
    ];
  }

  // Number range (avoid spread - use complete objects)
  if (args.minScore !== undefined && args.maxScore !== undefined) {
    where.factCheckScore = { gte: args.minScore, lte: args.maxScore };
  } else if (args.minScore !== undefined) {
    where.factCheckScore = { gte: args.minScore };
  } else if (args.maxScore !== undefined) {
    where.factCheckScore = { lte: args.maxScore };
  }

  // Execute query
  const articles = await prisma.article.findMany({
    where,
    take: args.limit || 10,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return articles;
}
```

### Create Operations

```typescript
async function createArticle(args: any, context: ToolContext) {
  const articleData: Prisma.ArticleCreateInput = {
    title: args.title,
    slug: args.slug,
    content: args.content || '',
    excerpt: args.excerpt || '',
    type: args.type || 'news',
    category: args.category,
    published: args.published ?? false,

    // JSON fields - convert arrays to strings
    tags: Array.isArray(args.tags) ? JSON.stringify(args.tags) : args.tags,
    keywords: Array.isArray(args.keywords) ? JSON.stringify(args.keywords) : args.keywords,

    // Relations
    author: {
      connect: { id: context.userId }
    }
  };

  const article = await prisma.article.create({
    data: articleData,
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return article;
}
```

### Update Operations

```typescript
async function updateArticle(args: any, context: ToolContext) {
  // Build update data conditionally
  const updateData: Prisma.ArticleUpdateInput = {};

  if (args.title !== undefined) updateData.title = args.title;
  if (args.content !== undefined) updateData.content = args.content;
  if (args.excerpt !== undefined) updateData.excerpt = args.excerpt;
  if (args.published !== undefined) updateData.published = args.published;

  // JSON fields
  if (args.tags !== undefined) {
    updateData.tags = Array.isArray(args.tags)
      ? JSON.stringify(args.tags)
      : args.tags;
  }

  const article = await prisma.article.update({
    where: { id: args.articleId },
    data: updateData,
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return article;
}
```

## Real-World Tool Examples

### Example 1: Search Articles Tool

```typescript
export const searchArticlesTool = {
  name: 'search_articles',
  description: 'Search for articles by title, content, category, or tags. Supports filtering by publication status and fact-check scores.',

  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query to match in title or content'
      },
      category: {
        type: 'string',
        description: 'Filter by category (bitcoin, ethereum, defi, etc.)',
        optional: true
      },
      published: {
        type: 'boolean',
        description: 'Filter by publication status',
        optional: true
      },
      minScore: {
        type: 'number',
        description: 'Minimum fact-check score (0-100)',
        optional: true
      },
      maxScore: {
        type: 'number',
        description: 'Maximum fact-check score (0-100)',
        optional: true
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return',
        optional: true,
        default: 10
      }
    },
    required: []
  },

  execute: async (args: any, context: ToolContext) => {
    try {
      const where: Prisma.ArticleWhereInput = {};

      if (args.query) {
        where.OR = [
          { title: { contains: args.query, mode: 'insensitive' } },
          { content: { contains: args.query, mode: 'insensitive' } }
        ];
      }

      if (args.category) where.category = args.category;
      if (typeof args.published === 'boolean') where.published = args.published;

      // Score range
      if (args.minScore !== undefined && args.maxScore !== undefined) {
        where.factCheckScore = { gte: args.minScore, lte: args.maxScore };
      } else if (args.minScore !== undefined) {
        where.factCheckScore = { gte: args.minScore };
      } else if (args.maxScore !== undefined) {
        where.factCheckScore = { lte: args.maxScore };
      }

      const articles = await prisma.article.findMany({
        where,
        take: args.limit || 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          published: true,
          factCheckScore: true,
          createdAt: true,
          author: {
            select: {
              name: true
            }
          }
        }
      });

      await logActivity({
        userId: context.userId,
        toolName: 'search_articles',
        action: 'articles_searched',
        details: { query: args.query, resultsCount: articles.length }
      });

      return {
        success: true,
        data: articles,
        message: `Found ${articles.length} article(s)`
      };

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }
};
```

### Example 2: Get Article Analytics Tool

```typescript
export const getArticleAnalyticsTool = {
  name: 'get_article_analytics',
  description: 'Get analytics for articles including view counts, sentiment distribution, and category breakdown.',

  parameters: {
    type: 'object',
    properties: {
      period: {
        type: 'string',
        description: 'Time period: "week", "month", "year", or "all"',
        enum: ['week', 'month', 'year', 'all'],
        default: 'month'
      },
      category: {
        type: 'string',
        description: 'Filter by specific category',
        optional: true
      }
    },
    required: []
  },

  execute: async (args: any, context: ToolContext) => {
    try {
      const where: Prisma.ArticleWhereInput = { published: true };

      // Period filter
      if (args.period && args.period !== 'all') {
        const periodDate = new Date();

        switch (args.period) {
          case 'week':
            periodDate.setDate(periodDate.getDate() - 7);
            break;
          case 'month':
            periodDate.setMonth(periodDate.getMonth() - 1);
            break;
          case 'year':
            periodDate.setFullYear(periodDate.getFullYear() - 1);
            break;
        }

        where.createdAt = { gte: periodDate };
      }

      if (args.category) where.category = args.category;

      // Get total count
      const totalArticles = await prisma.article.count({ where });

      // Category breakdown
      const categoryBreakdown = await prisma.article.groupBy({
        by: ['category'],
        _count: { category: true },
        where,
        orderBy: {
          _count: { category: 'desc' }
        },
        take: 10
      });

      // Sentiment distribution
      const sentimentBreakdown = await prisma.article.groupBy({
        by: ['sentiment'],
        _count: { sentiment: true },
        where: { ...where, sentiment: { not: null } }
      });

      // Average fact-check score
      const scoreStats = await prisma.article.aggregate({
        _avg: { factCheckScore: true },
        _min: { factCheckScore: true },
        _max: { factCheckScore: true },
        where: { ...where, factCheckScore: { not: null } }
      });

      return {
        success: true,
        data: {
          totalArticles,
          period: args.period || 'month',
          categoryBreakdown: categoryBreakdown.map(item => ({
            category: item.category,
            count: item._count.category
          })),
          sentimentBreakdown: sentimentBreakdown.map(item => ({
            sentiment: item.sentiment,
            count: item._count.sentiment
          })),
          factCheckScores: {
            average: scoreStats._avg.factCheckScore || 0,
            min: scoreStats._min.factCheckScore || 0,
            max: scoreStats._max.factCheckScore || 0
          }
        }
      };

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }
};
```

### Example 3: Create Article Tool (Admin)

```typescript
export const createArticleTool = {
  name: 'create_article',
  description: 'Create a new article with all metadata. Admin only.',

  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Article title'
      },
      slug: {
        type: 'string',
        description: 'URL-friendly slug (unique)'
      },
      content: {
        type: 'string',
        description: 'Full article content (Markdown)'
      },
      excerpt: {
        type: 'string',
        description: 'Short excerpt/summary',
        optional: true
      },
      type: {
        type: 'string',
        description: 'Article type: "news" or "educational"',
        enum: ['news', 'educational'],
        default: 'news'
      },
      category: {
        type: 'string',
        description: 'Category (bitcoin, ethereum, defi, etc.)'
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of tags',
        optional: true
      },
      published: {
        type: 'boolean',
        description: 'Publish immediately',
        default: false
      }
    },
    required: ['title', 'slug', 'content', 'category']
  },

  execute: async (args: any, context: ToolContext) => {
    try {
      // Check admin permission
      if (context.userRole !== 'ADMIN') {
        return {
          success: false,
          error: 'Only admins can create articles'
        };
      }

      // Validate slug uniqueness
      const existing = await prisma.article.findUnique({
        where: { slug: args.slug }
      });

      if (existing) {
        return {
          success: false,
          error: `Article with slug "${args.slug}" already exists`
        };
      }

      // Prepare article data
      const articleData: Prisma.ArticleCreateInput = {
        title: args.title,
        slug: args.slug,
        content: args.content,
        excerpt: args.excerpt || '',
        type: args.type || 'news',
        category: args.category,
        published: args.published ?? false,
        tags: args.tags ? JSON.stringify(args.tags) : null,
        author: {
          connect: { id: context.userId }
        }
      };

      const article = await prisma.article.create({
        data: articleData,
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      // Log activity
      await logActivity({
        userId: context.userId,
        toolName: 'create_article',
        action: 'article_created',
        details: {
          articleId: article.id,
          slug: article.slug,
          published: article.published
        }
      });

      return {
        success: true,
        data: article,
        message: `Article "${article.title}" created successfully`
      };

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }
};
```

## Activity Logging

### Log Activity Pattern

```typescript
// lib/copilot/activity.ts
interface ActivityLogParams {
  userId: string;
  toolName: string;
  action: string;
  details?: Record<string, any>;
  status?: 'success' | 'error';
}

export async function logActivity(params: ActivityLogParams): Promise<void> {
  try {
    await prisma.copilotActivity.create({
      data: {
        userId: params.userId,
        toolName: params.toolName,
        action: params.action,
        details: params.details ? JSON.stringify(params.details) : null,
        status: params.status || 'success',
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw - logging failures shouldn't break tool execution
  }
}
```

### Get Activity History Tool

```typescript
export const getActivityHistoryTool = {
  name: 'get_activity_history',
  description: 'Get recent Copilot activity history for the current user or all users (admin only).',

  parameters: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Maximum number of activities to return',
        default: 50
      },
      allUsers: {
        type: 'boolean',
        description: 'Include all users (admin only)',
        default: false
      }
    },
    required: []
  },

  execute: async (args: any, context: ToolContext) => {
    try {
      const where: Prisma.CopilotActivityWhereInput = {};

      // If not admin or not requesting all users, filter by current user
      if (context.userRole !== 'ADMIN' || !args.allUsers) {
        where.userId = context.userId;
      }

      const activities = await prisma.copilotActivity.findMany({
        where,
        take: args.limit || 50,
        orderBy: { timestamp: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      return {
        success: true,
        data: activities.map(activity => ({
          id: activity.id,
          toolName: activity.toolName,
          action: activity.action,
          status: activity.status,
          timestamp: activity.timestamp,
          user: activity.user.name,
          details: activity.details ? JSON.parse(activity.details) : null
        })),
        message: `Found ${activities.length} activity record(s)`
      };

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }
};
```

## Permission Management

### Admin vs User Tools

```typescript
// User tools (read-only) - lib/copilot/tools.ts
export const userTools = [
  searchArticlesTool,
  getArticleAnalyticsTool,
  getActivityHistoryTool
];

// Admin tools (write operations) - lib/copilot/admin-tools.ts
export const adminTools = [
  createArticleTool,
  updateArticleTool,
  deleteArticleTool,
  publishArticleTool
];

// Combine based on user role
export function getToolsForUser(userRole: string) {
  const tools = [...userTools];

  if (userRole === 'ADMIN') {
    tools.push(...adminTools);
  }

  return tools;
}
```

### Permission Check Pattern

```typescript
function requireAdmin(context: ToolContext): { success: false; error: string } | null {
  if (context.userRole !== 'ADMIN') {
    return {
      success: false,
      error: 'This tool requires admin privileges'
    };
  }
  return null;
}

// Usage in tool
execute: async (args: any, context: ToolContext) => {
  const permissionError = requireAdmin(context);
  if (permissionError) return permissionError;

  // Proceed with operation
  // ...
}
```

## Testing Tools

### Manual Testing

```typescript
// scripts/test-tools.ts
import { searchArticlesTool } from '@/lib/copilot/tools';

async function testSearchTool() {
  const mockContext = {
    userId: 'test-user-id',
    userName: 'Test User',
    userRole: 'ADMIN'
  };

  const result = await searchArticlesTool.execute(
    {
      query: 'Bitcoin',
      category: 'bitcoin',
      limit: 5
    },
    mockContext
  );

  console.log('Test result:', result);
}
```

### Automated Testing

```typescript
// __tests__/copilot/tools.test.ts
import { describe, expect, test } from '@jest/globals';
import { searchArticlesTool } from '@/lib/copilot/tools';

describe('searchArticlesTool', () => {
  test('returns articles matching query', async () => {
    const context = {
      userId: 'test-user',
      userName: 'Test',
      userRole: 'ADMIN'
    };

    const result = await searchArticlesTool.execute(
      { query: 'Bitcoin', limit: 5 },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
  });

  test('respects limit parameter', async () => {
    const result = await searchArticlesTool.execute(
      { limit: 3 },
      mockContext
    );

    expect(result.data.length).toBeLessThanOrEqual(3);
  });
});
```

## Best Practices

1. **Always use Prisma types** - Never use `any` for database operations
2. **Validate inputs** - Check required parameters before execution
3. **Handle errors gracefully** - Return structured error responses
4. **Log all operations** - Track tool usage for debugging and analytics
5. **Check permissions** - Verify user role before write operations
6. **Provide clear descriptions** - Help AI models understand tool purpose
7. **Return structured data** - Consistent response format across tools
8. **Test thoroughly** - Write tests for all tools
9. **Document parameters** - Clear descriptions help AI use tools correctly
10. **Avoid side effects** - Tools should be predictable and repeatable

## Common Patterns Library

**Pattern:** Conditional WHERE clause building
**Pattern:** JSON field handling (stringify arrays)
**Pattern:** Score range filtering (avoid spread)
**Pattern:** Error message extraction
**Pattern:** Activity logging
**Pattern:** Permission checking
**Pattern:** Result formatting

## Troubleshooting

### Issue: Tool Not Available to AI

**Solution:** Verify tool is exported and included in `getToolsForUser()`

### Issue: Parameter Validation Failing

**Solution:** Check parameter definitions match what AI sends

### Issue: Permission Denied

**Solution:** Verify user role in context and permission checks

### Issue: Database Query Errors

**Solution:** Use Prisma types, avoid spread on conditional properties

## Related Skills

- `tokenmilagre-refactoring` - Type safety patterns
- `project-context` - Platform architecture
- `tokenmilagre-article-workflow` - Article operations

---

**Last Updated:** 2025-01-09
**Version:** 1.0.0
