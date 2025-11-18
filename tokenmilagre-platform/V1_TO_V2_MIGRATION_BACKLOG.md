# 📋 Backlog de Migração v1 → v2

**Data de Criação:** 2025-11-18
**Status:** ESTRATÉGIA HÍBRIDA ATIVA
**Objetivo:** Migrar incrementalmente arquivos v1 para schema v2

---

## 🎯 Estratégia de Migração

### Fase Atual: **API v2 Deployment** ✅
- API v2 restaurada e funcional
- Schema v2 ativo no banco de dados
- `next.config.ts` configurado com `ignoreBuildErrors: true` (TEMPORÁRIO)

### Próximas Fases:
1. **Fase 2:** Migrar rotas de API v1 (prioridade ALTA)
2. **Fase 3:** Migrar páginas do Dashboard (prioridade MÉDIA)
3. **Fase 4:** Migrar páginas públicas (prioridade BAIXA)
4. **Fase 5:** Remover `ignoreBuildErrors: true`

---

## 📊 Inventário de Arquivos v1 Pendentes

### ❗ **PRIORIDADE ALTA - Rotas de API v1**

Estes arquivos servem o frontend e devem ser migrados primeiro.

#### 1. `/app/api/admin/stats/route.ts`
**Status:** 🟡 PARCIALMENTE MIGRADO
**Incompatibilidades:**
- ✅ `published: boolean` → `status: 'published'` (CORRIGIDO)
- ⚠️ Pode ter outras referências a campos v1

**Ação necessária:**
```typescript
// Revisar groupBy, filtros e agregações
// Garantir que todos os campos usam schema v2
```

**Prioridade:** 🔴 ALTA

---

#### 2. `/app/api/articles/route.ts`
**Status:** 🔴 NÃO MIGRADO
**Incompatibilidades:**
- ❌ `published: boolean` → precisa `status: ArticleStatus`
- ❌ `category: string` → precisa `categoryId: string` + include
- ❌ `tags: string` (JSON) → precisa `ArticleTag[]` relation

**Linhas problemáticas:**
```typescript
// Linha ~135: category: article.category
// Linha ~146: category: [article.category...]
// Linha ~147: published: published ?? false
```

**Ação necessária:**
```typescript
// 1. Atualizar include para trazer category e tags relations
// 2. Converter published para status enum
// 3. Mapear category.name e tags[].tag.name
```

**Prioridade:** 🔴 ALTA

---

#### 3. `/app/api/articles/list/route.ts`
**Status:** 🔴 NÃO MIGRADO
**Incompatibilidades:**
- ❌ `published: boolean` → precisa `status: ArticleStatus`

**Ação necessária:**
```typescript
// Atualizar where clauses para usar status
```

**Prioridade:** 🔴 ALTA

---

#### 4. `/app/api/articles/[slug]/route.ts`
**Status:** 🟡 PARCIALMENTE MIGRADO
**Incompatibilidades:**
- ✅ `category` relation incluída (CORRIGIDO)
- ✅ `tags` relation incluída (CORRIGIDO)
- ⚠️ Verificar se há outras referências a `published`

**Ação necessária:**
```typescript
// Revisar PATCH/DELETE endpoints
// Garantir que updates usam status ao invés de published
```

**Prioridade:** 🟡 MÉDIA

---

#### 5. `/app/api/articles/import/route.ts`
**Status:** 🔴 NÃO MIGRADO
**Incompatibilidades:**
- ❌ `tags: JSON.stringify(tags)` → precisa criar ArticleTag relations
- ❌ `published: boolean` → precisa `status: ArticleStatus`
- ❌ `category: string` → precisa buscar/criar Category e usar categoryId

**Linhas problemáticas:**
```typescript
// Linha 216: tags: JSON.stringify(tags)
// Linha 218: published: frontmatter.published !== false
// Linha 215: category: frontmatter.category
```

**Ação necessária:**
```typescript
// 1. Buscar categoryId a partir do nome da categoria
// 2. Criar tags como ArticleTag relations
// 3. Converter published boolean para status enum
```

**Prioridade:** 🔴 ALTA

---

#### 6. `/app/api/news/route.ts`
**Status:** 🟡 PARCIALMENTE MIGRADO
**Incompatibilidades:**
- ✅ `published: true` → `status: 'published'` (CORRIGIDO)
- ❌ `category: string` → precisa `category` relation

**Linhas problemáticas:**
```typescript
// Linha 64: category: [article.category.charAt...]
// Precisa incluir category relation
```

**Ação necessária:**
```typescript
// Adicionar include: { category: true } ao findMany
// Mapear category.name
```

**Prioridade:** 🟡 MÉDIA

---

#### 7. `/app/api/news/related/[slug]/route.ts`
**Status:** 🟡 PARCIALMENTE MIGRADO
**Incompatibilidades:**
- ✅ `published: true` → `status: 'published'` (CORRIGIDO)
- ❌ `category: string` → precisa `category` relation

**Ação necessária:**
```typescript
// Adicionar include: { category: true }
// Mapear category.name
```

**Prioridade:** 🟡 MÉDIA

---

### 🖥️ **PRIORIDADE MÉDIA - Páginas do Dashboard**

#### 8. `/app/dashboard/artigos/page.tsx`
**Status:** 🔴 NÃO MIGRADO
**Incompatibilidades:**
- ❌ Interface define `published: boolean`
- ❌ Usa `published: 'all'` em query params
- ❌ Toggle `published: !currentStatus`

**Linhas problemáticas:**
```typescript
// Linha ~30: published: boolean
// Linha ~50: published: 'all'
// Linha ~100: published: !currentStatus
```

**Ação necessária:**
```typescript
// 1. Atualizar interface para status: ArticleStatus
// 2. Mudar query params para status: 'all' | 'published' | 'draft' | 'archived'
// 3. Implementar toggle de status (published ↔ draft)
```

**Prioridade:** 🟡 MÉDIA

---

#### 9. `/app/dashboard/criar-artigo/page.tsx`
**Status:** 🔴 NÃO MIGRADO
**Incompatibilidades:**
- ❌ `published: selectedType !== 'resource' ? true : undefined`

**Ação necessária:**
```typescript
// Substituir published por status: 'published' | 'draft'
```

**Prioridade:** 🟡 MÉDIA

---

#### 10. `/app/dashboard/noticias/[slug]/page.tsx`
**Status:** 🟡 PARCIALMENTE MIGRADO
**Incompatibilidades:**
- ✅ `status: 'published'` usado (CORRIGIDO)
- ❌ `category: string` → precisa `category.name`

**Linhas problemáticas:**
```typescript
// Linha 92: article.category.charAt(...)
// Linha 224: article.category.includes(...)
```

**Ação necessária:**
```typescript
// Incluir category relation
// Usar article.category.name
```

**Prioridade:** 🟡 MÉDIA

---

#### 11. `/app/dashboard/gerar-em-massa/page.tsx`
**Status:** 🟡 PARCIALMENTE MIGRADO
**Incompatibilidades:**
- ✅ `status: 'published'` usado (CORRIGIDO)
- ❌ `category: string` → precisa `categoryId`

**Linhas problemáticas:**
```typescript
// Linha 566-569: category: article.category
// Linha 1199: {article.category}
```

**Ação necessária:**
```typescript
// Converter category string para categoryId lookup
// Buscar Category.id a partir do nome
```

**Prioridade:** 🟡 MÉDIA

---

### 🌐 **PRIORIDADE BAIXA - Páginas Públicas**

#### 12. `/app/educacao/page.tsx`
**Status:** 🟡 PARCIALMENTE MIGRADO
**Incompatibilidades:**
- ✅ `status: 'published'` usado (CORRIGIDO)

**Ação necessária:**
```typescript
// Revisar se há outras referências a campos v1
```

**Prioridade:** 🟢 BAIXA

---

#### 13. `/app/educacao/[slug]/page.tsx`
**Status:** 🟡 PARCIALMENTE MIGRADO
**Incompatibilidades:**
- ✅ `status: 'published'` usado (CORRIGIDO)
- ❌ `category: string` usado em 2 lugares

**Linhas problemáticas:**
```typescript
// Linha 65: category: article.category
// Linha 97: category: article.category
```

**Ação necessária:**
```typescript
// Incluir category relation
// Usar article.category.name ou article.category.slug
```

**Prioridade:** 🟢 BAIXA

---

### 📊 **PRIORIDADE BAIXA - Seed Data**

#### 14. `/lib/seed-data/security-articles.ts`
**Status:** 🟡 PARCIALMENTE MIGRADO
**Incompatibilidades:**
- ✅ `status: 'published'` usado (CORRIGIDO)

**Ação necessária:**
```typescript
// Apenas validar se seed funciona com schema v2
```

**Prioridade:** 🟢 BAIXA

---

## 📈 Estatísticas de Migração

| Categoria | Total | Migrado | Parcial | Pendente |
|-----------|-------|---------|---------|----------|
| **Rotas API** | 7 | 0 | 4 | 3 |
| **Dashboard** | 4 | 0 | 3 | 1 |
| **Páginas Públicas** | 2 | 0 | 2 | 0 |
| **Seed Data** | 1 | 0 | 1 | 0 |
| **TOTAL** | **14** | **0** | **10** | **4** |

**Progresso geral:** ~30% (correções parciais aplicadas)

---

## 🔧 Template de Migração

### Para Rotas de API:

```typescript
// ANTES (v1)
const articles = await prisma.article.findMany({
  where: {
    published: true,
    category: 'bitcoin'
  },
  select: {
    id: true,
    title: true,
    tags: true, // JSON string
  }
})

// DEPOIS (v2)
const articles = await prisma.article.findMany({
  where: {
    status: 'published',
    category: {
      slug: 'bitcoin'
    }
  },
  include: {
    category: {
      select: {
        id: true,
        name: true,
        slug: true
      }
    },
    tags: {
      include: {
        tag: {
          select: {
            name: true
          }
        }
      }
    }
  }
})

// Mapear tags
const formattedArticles = articles.map(article => ({
  ...article,
  categoryName: article.category.name,
  tagNames: article.tags.map(at => at.tag.name)
}))
```

---

## ✅ Checklist de Migração por Arquivo

Para cada arquivo, seguir:

- [ ] Ler arquivo e identificar todas incompatibilidades
- [ ] Atualizar queries Prisma (where, include, select)
- [ ] Atualizar interfaces TypeScript
- [ ] Converter `published` → `status`
- [ ] Converter `category: string` → `category: Category`
- [ ] Converter `tags: string` → `tags: ArticleTag[]`
- [ ] Testar endpoints/páginas localmente
- [ ] Executar testes automatizados
- [ ] Commit individual por arquivo
- [ ] Validar em staging

---

## 🎯 Ordem Recomendada de Migração

### Semana 1 (Prioridade ALTA):
1. `/app/api/articles/import/route.ts` (bloqueia imports)
2. `/app/api/articles/route.ts` (API principal)
3. `/app/api/articles/list/route.ts` (listagem)
4. `/app/api/admin/stats/route.ts` (dashboard stats)

### Semana 2 (Prioridade MÉDIA):
5. `/app/dashboard/artigos/page.tsx`
6. `/app/dashboard/criar-artigo/page.tsx`
7. `/app/dashboard/noticias/[slug]/page.tsx`
8. `/app/dashboard/gerar-em-massa/page.tsx`

### Semana 3 (Prioridade BAIXA):
9. `/app/api/news/route.ts`
10. `/app/api/news/related/[slug]/route.ts`
11. `/app/educacao/[slug]/page.tsx`
12. Validação final e remoção de `ignoreBuildErrors: true`

---

## 🚨 Avisos Importantes

1. **Não remover `ignoreBuildErrors: true`** até que TODOS os arquivos sejam migrados
2. **Testar cada arquivo** individualmente após migração
3. **Commits atômicos** - um arquivo por vez
4. **Backup antes de cada sessão** de migração
5. **Validar em staging** antes de ir para produção

---

## 📝 Notas Técnicas

### Diferenças Schema v1 vs v2:

| Campo | v1 | v2 |
|-------|----|----|
| **published** | `Boolean` | ❌ Removido → usar `status` |
| **status** | ❌ N/A | `ArticleStatus` enum ('draft', 'published', 'archived') |
| **category** | `String` | `Category` relation (M:1) |
| **categoryId** | ❌ N/A | `String` (foreign key) |
| **tags** | `String` (JSON array) | `ArticleTag[]` (M:N via pivot) |
| **readTime** | `number` (minutos) | `String?` ("X min") |

### Enums do Schema v2:

```prisma
enum ArticleStatus {
  draft
  published
  archived
}

enum ArticleType {
  news
  educational
}
```

---

**Última atualização:** 2025-11-18
**Responsável:** Claude Code CLI
**Referência:** Estratégia Híbrida - Opção B
