# React Query Hooks - Articles v2

Hooks customizados para gerenciamento de estado de artigos usando React Query.
Implementa caching automático, optimistic updates, e invalidação inteligente de cache.

## 📋 Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Query Hooks](#query-hooks)
- [Mutation Hooks](#mutation-hooks)
- [Cache Invalidation](#cache-invalidation)
- [Optimistic Updates](#optimistic-updates)
- [Exemplos Práticos](#exemplos-práticos)
- [Boas Práticas](#boas-práticas)

---

## Instalação

```bash
npm install @tanstack/react-query
```

## Configuração

Configure o QueryClient no root da aplicação:

```typescript
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
            refetchOnWindowFocus: true,
            retry: 2,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

---

## Query Hooks

### useArticles - Listar Artigos

Busca lista paginada de artigos com filtros.

```typescript
import { useArticles } from '@/lib/shared/hooks'

function ArticleList() {
  const { data, isLoading, error, refetch } = useArticles({
    query: {
      page: 1,
      limit: 10,
      status: 'PUBLISHED',
      type: 'NEWS',
      search: 'bitcoin',
      sortBy: 'publishedAt',
      sortOrder: 'desc',
    },
  })

  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />

  return (
    <div>
      {data.articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
      <Pagination
        total={data.totalPages}
        current={data.page}
        onPageChange={(page) => refetch({ query: { page } })}
      />
    </div>
  )
}
```

**Opções de query:**
- `page`: número da página (default: 1)
- `limit`: itens por página (default: 10, max: 100)
- `type`: 'NEWS' | 'EDUCATIONAL' | 'RESOURCE'
- `status`: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
- `categoryId`: filtrar por categoria
- `authorId`: filtrar por autor
- `tagId`: filtrar por tag
- `search`: busca textual
- `sortBy`: campo para ordenação
- `sortOrder`: 'asc' | 'desc'
- `featured`: mostrar apenas em destaque

**Cache:** 5 minutos (staleTime), 30 minutos (gcTime)

---

### useArticle - Buscar Artigo Único

Busca um artigo por ID ou slug.

```typescript
import { useArticle } from '@/lib/shared/hooks'

function ArticlePage({ articleId }: { articleId: string }) {
  const { data: article, isLoading, error } = useArticle({ id: articleId })

  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />
  if (!article) return <NotFound />

  return (
    <article>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  )
}
```

**Cache:** 10 minutos (staleTime), 1 hora (gcTime)

---

### useArticleStats - Estatísticas

Busca estatísticas de artigos (contadores por status, tipo, categoria).

```typescript
import { useArticleStats } from '@/lib/shared/hooks'

function DashboardStats() {
  const { data: stats, isLoading } = useArticleStats()

  if (isLoading) return <Spinner />

  return (
    <div className="stats-grid">
      <StatCard title="Total" value={stats.total} />
      <StatCard title="Published" value={stats.published} />
      <StatCard title="Draft" value={stats.draft} />
      <StatCard title="Archived" value={stats.archived} />
    </div>
  )
}
```

**Cache:** 5 minutos (staleTime), 30 minutos (gcTime)

---

## Mutation Hooks

### useCreateArticle - Criar Artigo

Cria novo artigo com invalidação automática de cache.

```typescript
import { useCreateArticle } from '@/lib/shared/hooks'
import { toast } from 'sonner'

function CreateArticleForm() {
  const createArticle = useCreateArticle({
    onSuccess: (article) => {
      toast.success(`Article "${article.title}" created!`)
      router.push(`/articles/${article.id}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = (data: ArticleCreateInput) => {
    createArticle.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <input name="slug" required />
      <textarea name="content" required />
      <button disabled={createArticle.isPending}>
        {createArticle.isPending ? 'Creating...' : 'Create Article'}
      </button>
    </form>
  )
}
```

**useCreateArticleWithSlug**: Auto-gera slug a partir do título.

**Cache Invalidation:**
- Invalida todas as listas de artigos
- Invalida estatísticas
- Adiciona artigo criado ao cache

---

### useUpdateArticle - Atualizar Artigo

Atualiza artigo com optimistic updates.

```typescript
import { useUpdateArticle } from '@/lib/shared/hooks'

function EditArticleForm({ article }: { article: Article }) {
  const updateArticle = useUpdateArticle({
    optimistic: true, // Enable optimistic updates
    onSuccess: () => {
      toast.success('Article updated!')
    },
  })

  const handleSubmit = (updates: Partial<ArticleUpdateInput>) => {
    updateArticle.mutate({
      id: article.id,
      data: updates,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" defaultValue={article.title} />
      <button disabled={updateArticle.isPending}>
        {updateArticle.isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
```

**Convenience Wrappers:**
- `usePublishArticle()`: publica artigo
- `useArchiveArticle()`: arquiva artigo

**Optimistic Updates:** Atualiza UI imediatamente, reverte em caso de erro

**Cache Invalidation:**
- Invalida artigo específico
- Invalida todas as listas
- Invalida estatísticas (se status mudou)

---

### useDeleteArticle - Deletar Artigo

Soft delete com optimistic updates.

```typescript
import { useDeleteArticle } from '@/lib/shared/hooks'

function DeleteArticleButton({ articleId }: { articleId: string }) {
  const deleteArticle = useDeleteArticle({
    onSuccess: () => {
      toast.success('Article deleted')
      router.push('/articles')
    },
  })

  const handleDelete = () => {
    if (!confirm('Are you sure?')) return
    deleteArticle.mutate(articleId)
  }

  return (
    <button onClick={handleDelete} disabled={deleteArticle.isPending}>
      {deleteArticle.isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
```

**useDeleteArticles**: Deleta múltiplos artigos em paralelo

**Optimistic Updates:** Remove artigo da UI imediatamente

**Cache Invalidation:**
- Remove artigo do cache
- Invalida todas as listas
- Invalida estatísticas

---

### useRestoreArticle - Restaurar Artigo

Restaura artigo soft-deleted.

```typescript
import { useRestoreArticle } from '@/lib/shared/hooks'

function RestoreButton({ articleId }: { articleId: string }) {
  const restoreArticle = useRestoreArticle()

  return (
    <button onClick={() => restoreArticle.mutate(articleId)}>
      Restore
    </button>
  )
}
```

**useRestoreArticles**: Restaura múltiplos artigos em paralelo

---

### useBulkOperation - Operações em Lote

Realiza operações em até 50 artigos (transacional, all-or-nothing).

```typescript
import { useBulkOperation, useBulkPublish, useBulkDelete } from '@/lib/shared/hooks'

function BulkActionsToolbar({ selectedIds }: { selectedIds: string[] }) {
  const bulkPublish = useBulkPublish({
    onSuccess: (result) => {
      toast.success(`${result.count} articles published`)
    },
  })

  return (
    <div>
      <button onClick={() => bulkPublish.mutate(selectedIds)}>
        Publish Selected ({selectedIds.length})
      </button>
    </div>
  )
}
```

**Operações disponíveis:**
- `useBulkPublish()`: publica múltiplos
- `useBulkArchive()`: arquiva múltiplos
- `useBulkDelete()`: deleta múltiplos
- `useBulkRestore()`: restaura múltiplos

**Cache Invalidation:**
- Invalida todos os artigos afetados
- Invalida todas as listas
- Invalida estatísticas

---

## Cache Invalidation

### Query Keys Hierárquicos

```typescript
import { articleKeys } from '@/lib/shared/hooks'

// Invalida tudo relacionado a artigos
queryClient.invalidateQueries({ queryKey: articleKeys.all })

// Invalida todas as listas
queryClient.invalidateQueries({ queryKey: articleKeys.lists() })

// Invalida lista específica
queryClient.invalidateQueries({
  queryKey: articleKeys.list({ page: 1, status: 'PUBLISHED' }),
})

// Invalida artigo específico
queryClient.invalidateQueries({ queryKey: articleKeys.detail('art-123') })

// Invalida estatísticas
queryClient.invalidateQueries({ queryKey: articleKeys.stats() })
```

### Invalidação Automática

Todos os mutation hooks invalidam cache automaticamente:

| Mutation | Invalida |
|----------|----------|
| `useCreateArticle` | Lists, Stats |
| `useUpdateArticle` | Detail, Lists, Stats (se status mudou) |
| `useDeleteArticle` | Detail, Lists, Stats |
| `useRestoreArticle` | Lists, Stats |
| `useBulkOperation` | Details afetados, Lists, Stats |

---

## Optimistic Updates

### Como Funcionam

1. **onMutate**: Atualiza cache imediatamente (antes da requisição)
2. **Requisição**: Envia para servidor em background
3. **onError**: Reverte para estado anterior se falhar
4. **onSuccess**: Atualiza com resposta do servidor

### Exemplo Manual

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { articleKeys } from '@/lib/shared/hooks'

const queryClient = useQueryClient()

// Optimistic update manual
await queryClient.cancelQueries({ queryKey: articleKeys.detail('art-1') })

const previousArticle = queryClient.getQueryData(articleKeys.detail('art-1'))

queryClient.setQueryData(articleKeys.detail('art-1'), {
  ...previousArticle,
  title: 'New Title',
})

// Fazer requisição...
// Se falhar, reverter:
if (error) {
  queryClient.setQueryData(articleKeys.detail('art-1'), previousArticle)
}
```

---

## Exemplos Práticos

### Dashboard com Múltiplas Queries

```typescript
function Dashboard() {
  const { data: stats } = useArticleStats()
  const { data: recentArticles } = useArticles({
    query: { limit: 5, sortBy: 'createdAt', sortOrder: 'desc' },
  })
  const { data: popularArticles } = useArticles({
    query: { limit: 5, sortBy: 'views', sortOrder: 'desc' },
  })

  return (
    <div>
      <StatsOverview stats={stats} />
      <RecentArticles articles={recentArticles?.articles} />
      <PopularArticles articles={popularArticles?.articles} />
    </div>
  )
}
```

### CRUD Completo

```typescript
function ArticleManager({ articleId }: { articleId: string }) {
  const { data: article } = useArticle({ id: articleId })
  const updateArticle = useUpdateArticle()
  const deleteArticle = useDeleteArticle()
  const publishArticle = usePublishArticle()

  return (
    <div>
      <h1>{article?.title}</h1>

      {/* Update */}
      <button onClick={() => updateArticle.mutate({
        id: articleId,
        data: { title: 'New Title' },
      })}>
        Update
      </button>

      {/* Publish */}
      <button onClick={() => publishArticle.mutate(articleId)}>
        Publish
      </button>

      {/* Delete */}
      <button onClick={() => deleteArticle.mutate(articleId)}>
        Delete
      </button>
    </div>
  )
}
```

### Seleção Múltipla com Bulk Operations

```typescript
function ArticleTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { data } = useArticles()
  const bulkPublish = useBulkPublish()
  const bulkDelete = useBulkDelete()

  return (
    <div>
      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <div>
          <button onClick={() => bulkPublish.mutate(selectedIds)}>
            Publish Selected ({selectedIds.length})
          </button>
          <button onClick={() => bulkDelete.mutate(selectedIds)}>
            Delete Selected ({selectedIds.length})
          </button>
        </div>
      )}

      {/* Article Table */}
      <table>
        {data?.articles.map((article) => (
          <tr key={article.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedIds.includes(article.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds([...selectedIds, article.id])
                  } else {
                    setSelectedIds(selectedIds.filter((id) => id !== article.id))
                  }
                }}
              />
            </td>
            <td>{article.title}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}
```

---

## Boas Práticas

### ✅ DO (Faça)

```typescript
// ✅ Use hooks no nível de componente
function ArticleList() {
  const { data, isLoading } = useArticles()
  // ...
}

// ✅ Handle loading e error states
if (isLoading) return <Spinner />
if (error) return <Error message={error.message} />

// ✅ Use callbacks para feedback
const createArticle = useCreateArticle({
  onSuccess: () => toast.success('Created!'),
  onError: (error) => toast.error(error.message),
})

// ✅ Disable buttons durante mutations
<button disabled={createArticle.isPending}>
  {createArticle.isPending ? 'Creating...' : 'Create'}
</button>

// ✅ Use optimistic updates para melhor UX
const updateArticle = useUpdateArticle({ optimistic: true })
```

### ❌ DON'T (Não faça)

```typescript
// ❌ Não use hooks fora de componentes React
const data = useArticles() // ERRO!

// ❌ Não ignore loading/error states
const { data } = useArticles()
return <div>{data.articles.map(...)}</div> // ERRO se data for undefined

// ❌ Não mutate cache diretamente sem motivo
queryClient.setQueryData(...) // Use apenas para optimistic updates

// ❌ Não esqueça de tratar erros
createArticle.mutate(data) // Faltou onError callback

// ❌ Não invalide cache manualmente (hooks já fazem isso)
await createArticle.mutateAsync(data)
queryClient.invalidateQueries(...) // Desnecessário
```

---

## Referências

- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Optimistic Updates Guide](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
