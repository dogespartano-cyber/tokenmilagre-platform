---
name: tokenmilagre-component-patterns
description: "Component refactoring and architectural patterns. TRIGGERS: 'refatorar componente', 'component refactor', 'custom hooks', '>500 lines', 'componentização', 'quebrar componente'. Use when refactoring large React components, extracting custom hooks, organizing component structure, breaking down components >500 lines into modular pieces."
license: MIT
---

# Token Milagre - Component Architecture & Patterns

Guide for creating maintainable, modular React components with proper organization and reusable patterns.

## Purpose

Transform large, complex components into well-organized, testable modules following React best practices and Token Milagre conventions.

## When to Use This Skill

Use this skill when:
- Refactoring components >500 lines
- Extracting custom hooks from complex state logic
- Organizing component file structure
- Creating reusable UI components
- Implementing consistent patterns across the codebase
- Improving component testability

## Component Size Guidelines

### Complexity Thresholds

| Size | Status | Action |
|------|--------|--------|
| <200 lines | ✅ Ideal | Maintain current structure |
| 200-350 lines | 🟡 Acceptable | Consider extraction if complex |
| 350-500 lines | 🟠 High | Plan refactoring |
| >500 lines | 🔴 Critical | **Refactor immediately** |

### Current Violations

From latest scan:
- `/app/dashboard/criar-artigo/page.tsx` → **1,387 lines** 🔴
- `/app/page.tsx` → **1,092 lines** 🔴
- `/app/criptomoedas/[slug]/page.tsx` → **872 lines** 🔴
- `/app/dashboard/usuarios/page.tsx` → **805 lines** 🔴

## Refactoring Strategy

### Step-by-Step Process

**STEP 1: Analyze Current Component**

Run complexity analysis:
```bash
python .claude/skills/tokenmilagre-refactoring/scripts/analyze_complexity.py --path app/dashboard/criar-artigo
```

Identify:
- Number of useState/useEffect hooks
- Distinct responsibilities (UI, state, API calls, etc.)
- Reusable sections
- Complex business logic

**STEP 2: Plan Module Structure**

Create directory structure:
```
component-page/
├── page.tsx                    # Main entry (target: <400 lines)
├── _components/
│   ├── types.ts               # Shared TypeScript types
│   ├── SubComponent1.tsx      # Extracted UI module
│   ├── SubComponent2.tsx      # Another module
│   └── ...
├── _hooks/
│   ├── useCustomLogic1.ts     # Extracted state/logic
│   ├── useCustomLogic2.ts     # Another hook
│   └── ...
└── _lib/
    ├── helpers.ts             # Pure functions
    ├── constants.ts           # Constants
    └── validators.ts          # Validation logic
```

**STEP 3: Extract Types First**

Create `_components/types.ts`:
```typescript
// Shared interfaces
export interface MainProps {
  // ...
}

export interface ComponentState {
  // ...
}

// Shared types
export type Status = 'idle' | 'loading' | 'success' | 'error';
```

**STEP 4: Extract Pure Functions**

Create `_lib/helpers.ts`:
```typescript
// Pure utility functions
export function calculateScore(data: Data): number {
  // Logic here
}

export function formatDate(date: Date): string {
  // Formatting logic
}
```

**STEP 5: Extract Custom Hooks**

Create hooks in `_hooks/`:
```typescript
// _hooks/useDataFetching.ts
export function useDataFetching(endpoint: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching logic
  }, [endpoint]);

  return { data, loading, error };
}
```

**STEP 6: Extract UI Components**

Create components in `_components/`:
```typescript
// _components/DataTable.tsx
import { TableProps } from './types';

export function DataTable({ data, onRowClick }: TableProps) {
  return (
    <table>
      {/* UI here */}
    </table>
  );
}
```

**STEP 7: Refactor Main File**

Simplify main file:
```typescript
// page.tsx (now much simpler!)
import { useDataFetching } from './_hooks/useDataFetching';
import { DataTable } from './_components/DataTable';
import { StatusBar } from './_components/StatusBar';

export default function Page() {
  const { data, loading, error } = useDataFetching('/api/data');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      <StatusBar status="success" />
      <DataTable data={data} onRowClick={handleRowClick} />
    </div>
  );
}
```

## Component Patterns

### Pattern 1: Container/Presentation

**Container Component** (handles logic):
```typescript
// UserListContainer.tsx
export function UserListContainer() {
  const { users, loading, error } = useUsers();
  const handleDelete = useUserDelete();

  return (
    <UserListPresentation
      users={users}
      loading={loading}
      error={error}
      onDelete={handleDelete}
    />
  );
}
```

**Presentation Component** (pure UI):
```typescript
// UserListPresentation.tsx
interface Props {
  users: User[];
  loading: boolean;
  error: Error | null;
  onDelete: (id: string) => void;
}

export function UserListPresentation({ users, loading, error, onDelete }: Props) {
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

### Pattern 2: Compound Components

**For complex UI with multiple related parts:**

```typescript
// Accordion.tsx
export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="accordion">{children}</div>;
}

export function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

// Usage
<Accordion>
  <AccordionItem title="Section 1">Content 1</AccordionItem>
  <AccordionItem title="Section 2">Content 2</AccordionItem>
</Accordion>
```

### Pattern 3: Render Props

**For flexible, reusable logic:**

```typescript
interface DataFetcherProps {
  url: string;
  children: (data: any, loading: boolean, error: Error | null) => React.ReactNode;
}

export function DataFetcher({ url, children }: DataFetcherProps) {
  const { data, loading, error } = useFetch(url);
  return <>{children(data, loading, error)}</>;
}

// Usage
<DataFetcher url="/api/users">
  {(users, loading, error) => (
    loading ? <Spinner /> : <UserList users={users} />
  )}
</DataFetcher>
```

## Custom Hook Patterns

### Pattern 1: State + Effect Hook

```typescript
export function useArticles(filters: ArticleFilters) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/articles?' + new URLSearchParams(filters));
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [filters]);

  return { articles, loading, error, refetch: () => setArticles([]) };
}
```

### Pattern 2: Logic Extraction Hook

```typescript
// Extract complex form logic
export function useArticleForm(initialArticle?: Article) {
  const [formData, setFormData] = useState(initialArticle || {});
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    validateField(field, value);
  };

  const validateField = (field: string, value: any) => {
    // Validation logic
  };

  const handleSubmit = async () => {
    // Submit logic
  };

  const resetForm = () => {
    setFormData(initialArticle || {});
    setErrors({});
    setIsDirty(false);
  };

  return {
    formData,
    errors,
    isDirty,
    handleChange,
    handleSubmit,
    resetForm
  };
}
```

### Pattern 3: Event Handler Hook

```typescript
export function useChatScroll(containerRef: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollToBottom = () => {
      container.scrollTop = container.scrollHeight;
    };

    // Auto-scroll on new messages
    const observer = new MutationObserver(scrollToBottom);
    observer.observe(container, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [containerRef]);
}
```

## Naming Conventions

### Component Names

| Type | Pattern | Example |
|------|---------|---------|
| Page | `[Name]Page` | `ArticleListPage` |
| Container | `[Name]Container` | `UserListContainer` |
| Presentation | `[Name]` or `[Name]Presentation` | `UserList` |
| HOC | `with[Feature]` | `withAuth` |
| Layout | `[Name]Layout` | `DashboardLayout` |

### Hook Names

| Type | Pattern | Example |
|------|---------|---------|
| State | `use[Name]State` | `useArticleState` |
| Data fetching | `use[Resource]` | `useArticles`, `useUser` |
| Event | `use[Action]` | `useArticleDelete`, `useFormSubmit` |
| Complex logic | `use[Feature]` | `useChatScroll`, `useInfiniteScroll` |

### File Names

- **Components**: PascalCase → `ArticleCard.tsx`
- **Hooks**: camelCase → `useArticles.ts`
- **Utils**: camelCase → `formatDate.ts`
- **Types**: camelCase → `types.ts`
- **Constants**: camelCase → `constants.ts`

## Directory Structure

### Recommended Organization

```
feature/
├── page.tsx                 # Next.js page (public API)
├── layout.tsx               # Optional layout
├── loading.tsx              # Loading state
├── error.tsx                # Error boundary
├── _components/             # Private components
│   ├── types.ts            # Shared types
│   ├── Component1.tsx
│   ├── Component2.tsx
│   └── index.ts            # Re-export for convenience
├── _hooks/                  # Private hooks
│   ├── useFeature1.ts
│   ├── useFeature2.ts
│   └── index.ts
├── _lib/                    # Private utilities
│   ├── helpers.ts
│   ├── constants.ts
│   └── validators.ts
└── _tests/                  # Optional tests
    ├── Component1.test.tsx
    └── useFeature1.test.ts
```

**Note:** `_` prefix makes directories private (not routes in Next.js)

## State Management Patterns

### Local State (useState)

**Use when:**
- State is used only in one component
- Simple state (strings, numbers, booleans)
- No sharing needed

```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Lifted State

**Use when:**
- Multiple sibling components need same state
- Parent controls child state

```typescript
function Parent() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <>
      <List onSelect={setSelectedId} />
      <Detail id={selectedId} />
    </>
  );
}
```

### Context API

**Use when:**
- State needed by many components at different levels
- Avoiding prop drilling

```typescript
const ArticleContext = createContext(null);

export function ArticleProvider({ children }) {
  const [article, setArticle] = useState(null);

  return (
    <ArticleContext.Provider value={{ article, setArticle }}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticle() {
  return useContext(ArticleContext);
}
```

### URL State (Next.js)

**Use when:**
- State should be shareable via URL
- Filters, pagination, tabs

```typescript
'use client';
import { useSearchParams, useRouter } from 'next/navigation';

export function FilteredList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || 'all';

  const setCategory = (newCategory: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', newCategory);
    router.push(`?${params.toString()}`);
  };

  // ...
}
```

## Performance Optimization

### Memoization

**useMemo** - Expensive calculations:
```typescript
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);
```

**useCallback** - Stable function references:
```typescript
const handleClick = useCallback((id: string) => {
  deleteArticle(id);
}, [deleteArticle]);
```

**React.memo** - Prevent unnecessary re-renders:
```typescript
export const ArticleCard = React.memo(function ArticleCard({ article }: Props) {
  return <div>{article.title}</div>;
});
```

### Code Splitting

**Dynamic imports:**
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./_components/HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false // If not needed on server
});
```

## Real Example: Criar-Artigo Refactoring

### Before (1,387 lines)

```typescript
// page.tsx - EVERYTHING IN ONE FILE
export default function CriarArtigoPage() {
  // 15+ useState hooks
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  // ... 13 more states

  // Multiple useEffects
  useEffect(() => { /* scroll logic */ }, []);
  useEffect(() => { /* chat scroll */ }, [conversation]);
  // ... more effects

  // Complex handlers
  const handleGenerate = async () => { /* 100+ lines */ };
  const handleRefine = async () => { /* 80+ lines */ };
  // ... more handlers

  // ReactMarkdown components
  const components = { /* 200+ lines */ };

  // JSX (500+ lines)
  return ( /* massive JSX */ );
}
```

### After (Refactored)

```typescript
// page.tsx (~300 lines)
import { TypeSelector } from './_components/TypeSelector';
import { ChatInterface } from './_components/ChatInterface';
import { ArticlePreview } from './_components/ArticlePreview';
import { useArticleGeneration } from './_hooks/useArticleGeneration';
import { useChatScroll } from './_hooks/useChatScroll';

export default function CriarArtigoPage() {
  const {
    article,
    loading,
    generate,
    refine
  } = useArticleGeneration();

  return (
    <AdminRoute>
      <div className="grid grid-cols-2 gap-4">
        <ChatInterface onGenerate={generate} loading={loading} />
        <ArticlePreview article={article} onRefine={refine} />
      </div>
    </AdminRoute>
  );
}

// _hooks/useArticleGeneration.ts (~150 lines)
export function useArticleGeneration() {
  // All generation logic here
}

// _hooks/useChatScroll.ts (~50 lines)
export function useChatScroll(containerRef) {
  // Auto-scroll logic
}

// _components/ChatInterface.tsx (~200 lines)
// _components/ArticlePreview.tsx (~250 lines)
// _components/TypeSelector.tsx (~60 lines) ✅ Already created!
```

**Result:** 1,387 lines → ~300 main + ~650 modules = More maintainable!

## Best Practices

### Do's ✅
- Keep components focused on single responsibility
- Extract reusable logic to custom hooks
- Use TypeScript for all props
- Memoize expensive calculations
- Clean up effects (return cleanup function)
- Follow naming conventions
- Co-locate related files

### Don'ts ❌
- Don't create components >500 lines
- Don't repeat logic across components
- Don't use `any` types
- Don't skip prop validation
- Don't forget cleanup in useEffect
- Don't over-optimize prematurely
- Don't deeply nest components (max 3 levels)

## Quick Reference

**Extract component:**
```bash
# Identify section to extract
# Create _components/NewComponent.tsx
# Define props interface
# Move JSX and related logic
# Import in parent
```

**Extract hook:**
```bash
# Identify state + logic to extract
# Create _hooks/useFeature.ts
# Move useState, useEffect, handlers
# Return state and handlers
# Use in component
```

**Measure complexity:**
```bash
python .claude/skills/tokenmilagre-refactoring/scripts/analyze_complexity.py
```

## Related Skills

- `tokenmilagre-refactoring` - Overall refactoring strategies
- `tokenmilagre-article-workflow` - Specific to criar-artigo component
- `project-context` - Project architecture overview

---

**Last Updated:** 2025-01-09
**Version:** 1.0.0
