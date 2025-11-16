---
name: tokenmilagre-refactoring
description: "Code refactoring methodology (type safety, dead code elimination, patterns). TRIGGERS: 'refatorar', 'refactoring', 'any typescript', 'código duplicado', 'technical debt', 'code quality', 'dead code'. Use when refactoring codebase, analyzing code quality, reducing 'any' usage, eliminating dead code, applying established patterns, technical debt reduction."
license: MIT
---

# Token Milagre Platform - Refactoring & Code Quality Skill

This skill provides systematic guidance for refactoring the Token Milagre Platform codebase with proven patterns, automated analysis tools, and documented best practices from previous refactoring sessions.

## Purpose

Transform Token Milagre Platform codebase through systematic refactoring while maintaining:
- Type safety (reducing 'any' usage with proper TypeScript/Prisma types)
- Code modularity (breaking large components into smaller, testable units)
- DRY principles (eliminating duplication via centralized helpers)
- Performance (removing dead code, optimizing bundle size)
- Maintainability (clear patterns, documented decisions)

## When to Use This Skill

Use this skill when:
- Reducing TypeScript 'any' occurrences across the codebase
- Identifying and removing dead code or unused arrays
- Breaking large components (>500 lines) into smaller modules
- Applying Prisma type safety patterns to database operations
- Creating reusable utility helpers from duplicated code
- Analyzing code complexity and technical debt
- Following established refactoring patterns from previous sessions

## Refactoring Patterns Library

### Pattern 1: TypeScript Error Handling

**Problem:** Using `any` in catch blocks loses type safety

**Solution:**
```typescript
// ❌ Before
catch (error: any) {
  return error.message;
}

// ✅ After
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

catch (error: unknown) {
  return getErrorMessage(error);
}
```

**Applied in:** `lib/copilot/tools.ts`, `lib/copilot/admin-tools.ts`, `app/dashboard/criar-artigo/_components/types.ts`

### Pattern 2: Prisma Type Safety

**Problem:** Using `any` for Prisma where clauses

**Solution:**
```typescript
// ❌ Before
const where: any = {};

// ✅ After
import { Prisma } from '@prisma/client';
const where: Prisma.ArticleWhereInput = {};
```

**Common Prisma Types:**
- `Prisma.ArticleWhereInput` - Query filters
- `Prisma.ArticleCreateInput` - Create operations
- `Prisma.ArticleUpdateInput` - Update operations
- `Prisma.UserWhereInput` - User queries

**Applied in:** `lib/copilot/tools.ts:83`, `lib/copilot/admin-tools.ts:56,282,345`

### Pattern 3: Avoid Spread on Conditional Types

**Problem:** TypeScript fails when spreading types that may not be objects

**Solution:**
```typescript
// ❌ Before (causes build error)
if (args.minScore !== undefined) {
  where.factCheckScore = { gte: args.minScore };
}
if (args.maxScore !== undefined) {
  where.factCheckScore = { ...where.factCheckScore, lte: args.maxScore }; // Error!
}

// ✅ After (build complete objects)
if (args.minScore !== undefined && args.maxScore !== undefined) {
  where.factCheckScore = { gte: args.minScore, lte: args.maxScore };
} else if (args.minScore !== undefined) {
  where.factCheckScore = { gte: args.minScore };
} else if (args.maxScore !== undefined) {
  where.factCheckScore = { lte: args.maxScore };
}
```

**Applied in:** `lib/copilot/tools.ts:109-116`, `lib/copilot/admin-tools.ts:280-286`

### Pattern 4: Null Coalescing for Type Compatibility

**Problem:** Prisma types use `null`, optional chaining returns `undefined`

**Solution:**
```typescript
// ❌ Before (type error)
email: user?.email,        // string | undefined
role: user?.role,          // Role | undefined

// ✅ After (correct types)
email: user?.email ?? null,  // string | null
role: user?.role ?? null,    // Role | null
```

**Applied in:** `lib/copilot/tools.ts:344`, `lib/copilot/admin-tools.ts:592-593`

### Pattern 5: Dead Code Detection

**Indicators of dead code:**
1. Arrays/constants declared but never referenced
2. Comments stating "DEPRECATED" without removal
3. Hardcoded data when DB queries exist
4. `grep` shows no usage outside declaration

**Removal process:**
```bash
# 1. Verify it's unused
grep -r "VARIABLE_NAME" --include="*.ts" --include="*.tsx"

# 2. Check only declaration shows up
# If only 1 result (the declaration), safe to remove

# 3. Remove and test build
npm run build
```

**Real example:** Removed 1843 lines from `app/educacao/[slug]/page.tsx` (articles_DEPRECATED array)

### Pattern 6: Component Extraction

**When to extract:** Components >500 lines or multiple responsibilities

**Structure:**
```
component-page/
├── page.tsx                    # Main entry point (~200 lines)
├── _components/
│   ├── types.ts               # Shared types
│   ├── SubComponent1.tsx      # Extracted UI
│   └── SubComponent2.tsx      # Extracted UI
└── _hooks/
    └── useCustomLogic.ts      # Extracted hooks
```

**Benefits:**
- Easier testing
- Better code organization
- Improved reusability
- Reduced cognitive load

**Applied in:**
- `app/dashboard/criar-artigo/` (created TypeSelector.tsx + types.ts)
- `app/recursos/` (431→132 lines, 4 sub-components)
- `app/recursos/[slug]/` (477→100 lines, 9 sub-components)

### Pattern 7: Large Page Refactoring (Recursos Case Study)

**Problem:** Multiple giant client components (>400 lines) with mixed responsibilities

**Solution:** Extract focused sub-components with clear single responsibility

**Example: RecursosClient.tsx Refactoring**
```
BEFORE: 431 lines (monolith)
├── State management
├── Filter UI (inline)
├── Resource grid (inline)
├── Security tips (inline)
└── Scroll button (inline)

AFTER: 132 lines (composition)
├── RecursosClient.tsx - State & composition only
├── components/ResourceFilters.tsx (120 lines)
├── components/ResourceGrid.tsx (158 lines)
├── components/SecurityTips.tsx (50 lines)
└── components/ScrollToTop.tsx (41 lines) - Reusable!
```

**Example: ResourceDetailClient.tsx Refactoring**
```
BEFORE: 477 lines (monolith + duplicated code)
├── All sections inline
├── Duplicated ScrollToTop code (40 lines)
└── FAQ state management mixed with UI

AFTER: 100 lines (composition)
├── ResourceDetailClient.tsx - Composition only
├── components/ResourceHeader.tsx (61 lines)
├── components/WhyGoodSection.tsx (24 lines)
├── components/ResourceFeatures.tsx (34 lines)
├── components/CompatibleWallets.tsx (81 lines)
├── components/HowToStart.tsx (43 lines)
├── components/ProsAndCons.tsx (58 lines)
├── components/ResourceFAQ.tsx (67 lines)
├── components/ResourceSecurityTips.tsx (43 lines)
├── components/RelatedResources.tsx (72 lines)
└── Reuses ScrollToTop from parent directory
```

**Benefits:**
- **74% average size reduction** (908→232 lines)
- **Eliminated code duplication** (shared ScrollToTop)
- **Improved accessibility** (comprehensive aria-labels)
- **Better testability** (isolated components)
- **Easier maintenance** (focused responsibilities)

**Applied in:** `app/recursos/` and `app/recursos/[slug]/`

## Systematic Refactoring Workflow

### Step 1: Analyze Current State

Run analysis scripts to identify technical debt:

```bash
# Count 'any' usage
python scripts/count_any_usage.py

# Find large components
python scripts/analyze_complexity.py

# Detect potential dead code
python scripts/find_dead_code.py
```

Review output to prioritize high-impact areas.

### Step 2: Plan Refactoring

Create a plan identifying:
- Files to refactor (sorted by impact/ease)
- Patterns to apply (from Pattern Library above)
- Expected outcomes (lines reduced, 'any' eliminated, etc.)

### Step 3: Execute Incrementally

For each file:
1. Read current implementation
2. Apply relevant patterns
3. Test build: `npm run build`
4. Commit with descriptive message
5. Push to remote branch

**Commit message format:**
```
refactor: [Brief description]

[FASE X.Y]: [Context]

Changes:
- [Specific change 1]
- [Specific change 2]

Benefits:
- [Benefit 1]
- [Benefit 2]

Metrics: [Before → After stats]
```

### Step 4: Update Documentation

After refactoring, update:
- This skill's Pattern Library (if new pattern emerges)
- `references/refactoring-log.md` (session summary)
- `references/architecture-patterns.md` (if architectural change)

## Using Bundled Resources

### Scripts (`scripts/`)

**`count_any_usage.py`** - Count 'any' occurrences across codebase
```bash
python .claude/skills/tokenmilagre-refactoring/scripts/count_any_usage.py
```

**`analyze_complexity.py`** - Find components >500 lines
```bash
python .claude/skills/tokenmilagre-refactoring/scripts/analyze_complexity.py
```

**`find_dead_code.py`** - Detect unused variables/arrays
```bash
python .claude/skills/tokenmilagre-refactoring/scripts/find_dead_code.py
```

Execute these scripts before planning refactoring sessions to get data-driven insights.

### References (`references/`)

**`refactoring-log.md`** - Historical record of all refactoring sessions with metrics, decisions, and outcomes. Load to understand previous work and avoid duplicating effort.

**`prisma-types-guide.md`** - Complete reference of Prisma types for the Token Milagre schema. Load when working with database operations to find correct types.

**`architecture-patterns.md`** - Architectural decisions and component patterns. Load when making structural changes to understand existing architecture.

**`helper-library-index.md`** - Catalog of all utility helpers in `/lib/utils/`. Load to avoid creating duplicate utilities.

Load references as needed:
```
Read references/refactoring-log.md to review past sessions
Read references/prisma-types-guide.md for database type reference
```

## Success Metrics

Track these metrics across refactoring sessions:

| Metric | Target | Measurement |
|--------|--------|-------------|
| 'any' usage | <80 total | `count_any_usage.py` |
| Max component size | <500 lines | `analyze_complexity.py` |
| Code duplication | <5% | Manual review |
| Dead code | 0 files >1000 unused lines | `find_dead_code.py` |
| Build time | <60s | `time npm run build` |

## Important Notes

- **Always test build** after changes: `npm run build`
- **Commit incrementally** (per file or logical group)
- **Reference line numbers** in commit messages for easy review
- **Update this skill** when discovering new patterns
- **Preserve user intent** - never remove code without verification
- **Avoid breaking changes** - maintain API compatibility

## Quick Reference

**Common Commands:**
```bash
# Test TypeScript compilation
npm run build

# Count specific pattern
grep -r "any\b" --include="*.ts" --include="*.tsx" | wc -l

# Find large files
find app -name "*.tsx" -exec wc -l {} + | sort -rn | head -20

# Check if variable is used
grep -r "VARIABLE_NAME" --include="*.ts"
```

**Prisma Import:**
```typescript
import { Prisma } from '@prisma/client';
```

**Error Helper:**
```typescript
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
```

## Related Skills

- `troubleshooting` - For resolving build errors during refactoring
- `project-context` - For understanding overall platform architecture
- `database-setup` - For Prisma schema modifications

---

**Last Updated:** 2025-11-16
**Maintained By:** Claude AI Sessions
**Version:** 1.1.0
