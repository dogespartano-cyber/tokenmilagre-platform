---
name: tokenmilagre-copilot-tools
description: "Copilot AI tools development (type-safe patterns). TRIGGERS: 'copilot', 'AI tool', 'tool development', 'criar ferramenta', 'activity logging', 'tool parameters'. Use when creating new AI tools, implementing tool parameters, handling tool execution, managing activity logging, type-safe tool development."
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

## Tool Structure Template

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
        return { success: false, error: 'param1 is required' };
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

## Type-Safe Development Patterns

### Error Handling

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
  return { success: false, error: getErrorMessage(error) };
}
```

### Prisma Type-Safe Queries

```typescript
import { Prisma } from '@prisma/client';

// Search with conditional WHERE
async function searchArticles(args: any) {
  const where: Prisma.ArticleWhereInput = {};

  if (args.category) where.category = args.category;
  if (args.published !== undefined) where.published = args.published;

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
  }

  return await prisma.article.findMany({
    where,
    take: args.limit || 10,
    orderBy: { createdAt: 'desc' }
  });
}
```

### Create/Update Operations

```typescript
// CREATE: Type-safe data preparation
const createData: Prisma.ArticleCreateInput = {
  title: args.title,
  slug: args.slug,
  content: args.content || '',
  type: args.type || 'news',
  // JSON fields - stringify arrays
  tags: Array.isArray(args.tags) ? JSON.stringify(args.tags) : args.tags,
  // Relations
  author: { connect: { id: context.userId } }
};

const article = await prisma.article.create({ data: createData });

// UPDATE: Conditional updates
const updateData: Prisma.ArticleUpdateInput = {};
if (args.title !== undefined) updateData.title = args.title;
if (args.published !== undefined) updateData.published = args.published;

await prisma.article.update({
  where: { id: args.articleId },
  data: updateData
});
```

## Core Patterns Reference

All tool implementations follow these 5 core patterns:

### Pattern 1: Conditional WHERE Clause Building
Build Prisma queries dynamically based on provided parameters. Use type-safe `Prisma.*WhereInput` types.

### Pattern 2: JSON Field Handling
Stringify arrays before storing in database: `JSON.stringify(args.tags)`

### Pattern 3: Score/Number Range Filtering
Avoid spread operator on conditional properties. Use complete objects: `{ gte: min, lte: max }`

### Pattern 4: Error Message Extraction
Use `getErrorMessage(error: unknown)` helper to safely extract error messages from unknown error types.

### Pattern 5: Activity Logging
Log all tool executions with `logActivity()` for debugging and analytics. Non-blocking (failures don't break tool execution).

## Activity Logging

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
  if (userRole === 'ADMIN') tools.push(...adminTools);
  return tools;
}
```

### Permission Check Pattern

```typescript
function requireAdmin(context: ToolContext): { success: false; error: string } | null {
  if (context.userRole !== 'ADMIN') {
    return { success: false, error: 'This tool requires admin privileges' };
  }
  return null;
}

// Usage in tool
execute: async (args: any, context: ToolContext) => {
  const permissionError = requireAdmin(context);
  if (permissionError) return permissionError;
  // Proceed with operation...
}
```

## Testing Tools

### Basic Test Pattern

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
    { query: 'Bitcoin', category: 'bitcoin', limit: 5 },
    mockContext
  );

  console.log('Test result:', result);
}
```

### Automated Testing (Jest)

```typescript
// __tests__/copilot/tools.test.ts
import { describe, expect, test } from '@jest/globals';
import { searchArticlesTool } from '@/lib/copilot/tools';

describe('searchArticlesTool', () => {
  const mockContext = {
    userId: 'test-user',
    userName: 'Test',
    userRole: 'ADMIN'
  };

  test('returns articles matching query', async () => {
    const result = await searchArticlesTool.execute(
      { query: 'Bitcoin', limit: 5 },
      mockContext
    );

    expect(result.success).toBe(true);
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

## Troubleshooting

### Issue: Tool Not Available to AI
**Solution:** Verify tool is exported and included in `getToolsForUser()`

### Issue: Parameter Validation Failing
**Solution:** Check parameter definitions match what AI sends

### Issue: Permission Denied
**Solution:** Verify user role in context and permission checks

### Issue: Database Query Errors
**Solution:** Use Prisma types, avoid spread on conditional properties

## Complete Example: Search Articles Tool

```typescript
export const searchArticlesTool = {
  name: 'search_articles',
  description: 'Search for articles by title, content, category, or tags. Supports filtering by publication status and fact-check scores.',

  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query to match in title or content' },
      category: { type: 'string', description: 'Filter by category', optional: true },
      published: { type: 'boolean', description: 'Filter by publication status', optional: true },
      minScore: { type: 'number', description: 'Minimum fact-check score (0-100)', optional: true },
      limit: { type: 'number', description: 'Max results', optional: true, default: 10 }
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

      if (args.minScore !== undefined) {
        where.factCheckScore = { gte: args.minScore };
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
          author: { select: { name: true } }
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
      return { success: false, error: getErrorMessage(error) };
    }
  }
};
```

## Related Skills

- `tokenmilagre-refactoring` - Type safety patterns
- `project-context` - Platform architecture
- `tokenmilagre-article-workflow` - Article operations

---

**Last Updated:** 2025-11-17
**Version:** 2.0.0
**Mudanças recentes:**
- ✅ **OTIMIZAÇÃO**: 893 → 458 linhas (-49%)
- ✅ Condensado 3 exemplos completos → 1 exemplo + padrões
- ✅ Condensado seções de Type-Safe Development
- ✅ Condensado seções de Testing
- ✅ Mantido template essencial e 5 core patterns
- ✅ Foco em aplicação prática vs verbosidade
