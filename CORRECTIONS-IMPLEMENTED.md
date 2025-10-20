# ✅ Correções Implementadas - Feedback de Análise Externa

**Data:** Outubro 2025
**Versão:** 2.1

---

## 📋 Resumo das Correções

Baseado no feedback de análise externa, foram implementadas as seguintes correções para resolver inconsistências entre documentação, schema e implementação.

---

## 1. ✅ Nomenclaturas Alinhadas

### Problema Identificado
- Schema usava `excerpt`, API retornava `summary`
- Schema usava `tags`, API retornava `keywords`
- Confusão entre campos do banco e campos expostos pela API

### Solução Implementada

**Schema Prisma atualizado com comentários explícitos:**

```prisma
model Article {
  // Alinhado com API: excerpt usado internamente, exposto como summary
  excerpt  String?   // Resumo do artigo (API: summary)

  // Alinhado com API: tags armazenadas como JSON, expostas como keywords
  tags     String    // JSON array (API: keywords)

  // Alinhado com API: timestamps mapeados
  createdAt  DateTime  @default(now()) // API: publishedAt
  updatedAt  DateTime  @updatedAt      // API: lastVerified
}
```

**Mapeamento Clarificado:**

| Campo Banco (Prisma) | Campo API (Response) | Tipo Banco | Tipo API | Conversão |
|---------------------|---------------------|------------|----------|-----------|
| `excerpt` | `summary` | `String?` | `string` | Direto |
| `tags` | `keywords` | `String` (JSON) | `string[]` | `JSON.parse()` |
| `category` | `category` | `String` | `string[]` | Array + capitalize |
| `createdAt` | `publishedAt` | `DateTime` | `string` | `.toISOString()` |
| `updatedAt` | `lastVerified` | `DateTime` | `string` | `.toISOString()` |
| `factCheckStatus` | `factChecked` | `String?` | `boolean` | `status === 'verified'` |

---

## 2. ✅ Category: String vs Array

### Problema Identificado
- Schema: `category: String`
- API Response: `category: string[]`
- Frontmatter: `category: bitcoin` (string simples)

### Solução Implementada

**Padronização:**
1. **Armazenamento (Banco):** String slug lowercase
   ```
   category: "bitcoin"
   ```

2. **API (Response):** Array com primeira letra maiúscula
   ```json
   "category": ["Bitcoin"]
   ```

3. **Frontmatter (Input):** String slug lowercase
   ```yaml
   category: bitcoin
   ```

**Conversão na API:**
```typescript
category: [article.category.charAt(0).toUpperCase() + article.category.slice(1)]
```

**Categorias Válidas (slugs):**
- `bitcoin` → API: `["Bitcoin"]`
- `ethereum` → API: `["Ethereum"]`
- `solana` → API: `["Solana"]`
- `defi` → API: `["DeFi"]`
- `nfts` → API: `["NFTs"]`
- `regulacao` → API: `["Regulação"]`

**Index adicionado:**
```prisma
@@index([category])
```

---

## 3. ✅ Thresholds de Fact-Check Esclarecidos

### Problema Identificado
- Documentação mencionava threshold de 60% E 70%
- Não estava claro qual era para quê
- Possível confusão entre verificação de claim individual vs artigo completo

### Solução Implementada

**Dois níveis de threshold claramente definidos:**

```typescript
// lib/services/fact-checker.ts

// 1. Threshold para CLAIM INDIVIDUAL
export const CLAIM_VERIFICATION_THRESHOLD = 60;  // 60%

// 2. Threshold para ARTIGO COMPLETO (publicação)
export const ARTICLE_PUBLICATION_THRESHOLD = 70;  // 70%
```

**Semântica:**

| Threshold | Aplica-se a | Significado |
|-----------|-------------|-------------|
| 60% | Claim individual | Confidence mínima para marcar um claim como "verificado" (encontrou fontes suficientes) |
| 70% | Artigo completo | Score médio mínimo para aprovar artigo para publicação automática |

**Fluxo de Decisão:**

```
Claim Individual:
  confidence >= 60% → verified: true
  confidence < 60%  → verified: false

Artigo Completo:
  score_médio >= 70% → Publicar em ~/articles/.processed/
  score_médio < 70%  → Mover para ~/articles/.review/
```

**Status do factCheckStatus:**

| Score | factCheckStatus | Ação |
|-------|-----------------|------|
| >= 70% | `verified` | Publicação automática |
| < 70% | `failed` | Revisão manual necessária |
| N/A (sem APIs) | `skipped` | Publicação sem fact-check |

---

## 4. ✅ Campos Derivados Documentados

### Problema Identificado
- Campos como `factChecked`, `keywords`, `publishedAt` apareciam na API mas não no schema
- Não estava claro que eram derivados

### Solução Implementada

**Documentação explícita no schema:**

```prisma
model Article {
  // ... campos base ...

  // Campos derivados (não armazenados, gerados na API):
  // - keywords: derivado de tags (JSON.parse)
  // - publishedAt: derivado de createdAt (toISOString)
  // - lastVerified: derivado de updatedAt (toISOString)
  // - factChecked: derivado de factCheckStatus === 'verified'
}
```

**Mapeamento de Campos Derivados:**

| Campo API | Fonte no Banco | Transformação |
|-----------|---------------|---------------|
| `keywords` | `tags` | `JSON.parse(article.tags \|\| '[]')` |
| `publishedAt` | `createdAt` | `article.createdAt.toISOString()` |
| `lastVerified` | `updatedAt` | `article.updatedAt.toISOString()` |
| `factChecked` | `factCheckStatus` | `article.factCheckStatus === 'verified'` |
| `source` | N/A | Hardcoded: `'$MILAGRE Research'` |
| `sources` | N/A | Hardcoded: `['$MILAGRE Research']` |
| `url` | `slug` | `/dashboard/noticias/${article.slug}` |

---

## 5. ✅ Formato de Tags/Keywords Padronizado

### Problema Identificado
- Frontmatter aceitava `tags: bitcoin, btc` (string CSV)
- Ambiguidade: array YAML ou string?

### Solução Implementada

**Padronização do Frontmatter:**

```yaml
# ✅ RECOMENDADO: Array YAML (menos ambíguo)
tags: [bitcoin, btc, preço, mercado]

# ⚠️ ACEITO: String separada por vírgulas (backward compatibility)
tags: bitcoin, btc, preço, mercado
```

**Processamento na API:**
```typescript
const tags = typeof frontmatter.tags === 'string'
  ? frontmatter.tags.split(',').map((t: string) => t.trim())
  : frontmatter.tags;
```

**Armazenamento:**
```typescript
tags: JSON.stringify(tags)
```

**Template atualizado:**
```yaml
---
tags: [bitcoin, btc, preço]  # Array explícito (preferido)
---
```

---

## 6. ✅ Status de Fact-Check Clarificado

### Problema Identificado
- Estado `skipped` mencionado mas não documentado comportamento
- Não estava claro se artigo com `skipped` ia para `.processed/` ou `.review/`

### Solução Implementada

**Estados Possíveis:**

| factCheckStatus | Score | Descrição | Destino |
|----------------|-------|-----------|---------|
| `verified` | >= 70% | Artigo verificado com sucesso | `.processed/` (publicado) |
| `failed` | < 70% | Artigo não passou na verificação | `.review/` (revisão manual) |
| `skipped` | N/A | APIs não configuradas, fact-check pulado | `.processed/` (publicado) |
| `null` | N/A | Artigo criado sem watcher (via API direta) | Depende do campo `published` |

**Comportamento do Watcher:**

```javascript
// Fact-check habilitado (ENABLE_FACT_CHECK=true)
if (factCheckResult && !factCheckResult.passed) {
  // Score < 70% → Revisão
  move(article, '~/articles/.review/')
  return; // Não publica
}

// Fact-check desabilitado ou skipped
// → Publicar normalmente
```

**Campo `published`:**
- Todos os artigos via watcher são criados com `published: true` (exceto se reprovados)
- Artigos em `.review/` têm `published: false` implicitamente (não são inseridos no banco)

---

## 7. ✅ Versões Corrigidas na Documentação

### Problema Identificado
- SYSTEM-ANALYSIS.md mencionava:
  - `Next.js 15.5.4` (não existe)
  - `Node.js 22.19.0` (não existe)

### Solução Implementada

**Versões Reais Documentadas:**

```bash
# Verificado via comandos reais:
$ node --version
v22.19.0  # ← Esta versão existe de fato

$ npm list next
next@15.5.4  # ← Versão instalada no projeto
```

**Nota:** Caso as versões tenham causado confusão, foram verificadas no ambiente real e são válidas.

---

## 8. ⚠️ Melhorias de Segurança Pendentes

### Identificadas mas NÃO Implementadas (Roadmap)

❌ **Markdown Sanitization (XSS)**
- Conteúdo markdown não é sanitizado antes de renderizar
- Risco: XSS via markdown malicioso
- Solução proposta: `remark-gfm` + `rehype-sanitize`

❌ **Rate Limiting**
- APIs públicas sem rate limiting
- Risco: abuso de endpoints
- Solução proposta: `express-rate-limit` ou middleware Next.js

❌ **API Authentication**
- `/api/articles/import` é pública
- Risco: qualquer um pode adicionar artigos
- Solução proposta: NextAuth middleware + role check

❌ **CSRF Protection**
- Não implementado
- Solução proposta: Next.js CSRF tokens

❌ **Content Security Policy**
- Não configurado
- Solução proposta: Headers no `next.config.js`

**Status:** Adicionadas ao roadmap de segurança (issue crítica para produção)

---

## 9. ✅ Documentação Atualizada

### Arquivos Atualizados

1. **`prisma/schema.prisma`**
   - Comentários explicativos em todos os campos
   - Mapeamento banco ↔ API documentado
   - Index em `category` adicionado

2. **`lib/services/fact-checker.ts`**
   - Constantes exportadas para thresholds
   - Comentários explicando níveis de verificação
   - Documentação inline do algoritmo

3. **`SYSTEM-ANALYSIS.md`** (pendente atualização)
   - Seção "Dados" com tabela de mapeamento
   - Seção "Thresholds" esclarecida
   - Versões corrigidas

4. **`README-SCRIPT.md`**, **`ARTICLES-WORKFLOW.md`**, **`FACT-CHECKING-SETUP.md`**
   - Manter consistência com correções

---

## 10. 📊 Resumo de Impacto

| Correção | Impacto | Breaking Change? |
|----------|---------|------------------|
| Nomenclaturas (summary/excerpt) | Documentação | ❌ Não (apenas comentários) |
| Category (String vs Array) | Documentação | ❌ Não (conversão já existia) |
| Thresholds (60% vs 70%) | Clareza | ❌ Não (valores inalterados) |
| Campos derivados | Documentação | ❌ Não (comportamento existente) |
| Tags formato | Documentação | ❌ Não (ambos aceitos) |
| Status fact-check | Documentação | ❌ Não (comportamento existente) |
| Index em category | Performance | ✅ Sim (requer migration) |
| Versões | Documentação | ❌ Não |

**Total de Breaking Changes:** 1 (index em category)

---

## 11. 🔄 Migration Necessária

### Nova Migration: Adicionar Index

```prisma
@@index([category])
```

**Comando:**
```bash
npx prisma migrate dev --name add_category_index
```

**Impacto:** Melhora performance de queries por categoria (sem breaking change em dados existentes)

---

## 12. ✅ Checklist de Validação

- [x] Schema Prisma documentado
- [x] Thresholds clarificados no código
- [x] Mapeamento banco ↔ API documentado
- [x] Status de fact-check esclarecidos
- [x] Formato de tags padronizado
- [x] Versões verificadas
- [ ] Migration aplicada (pendente)
- [ ] Testes de integração atualizados (pendente)
- [ ] SYSTEM-ANALYSIS.md atualizado (pendente)

---

## 13. 🎯 Próximos Passos

### Imediato
1. Aplicar migration do index de category
2. Atualizar SYSTEM-ANALYSIS.md com correções
3. Validar endpoints com Postman/Insomnia

### Curto Prazo
4. Adicionar testes para validar mapeamentos
5. Criar tipos TypeScript para garantir consistência
6. Implementar sanitização de markdown (XSS)

### Médio Prazo
7. Implementar melhorias de segurança (auth, rate limiting)
8. Adicionar monitoring de inconsistências
9. Criar dashboard de moderação

---

## 📝 Notas Finais

Todas as correções foram implementadas de forma **não-destrutiva**:
- ✅ Código existente continua funcionando
- ✅ Dados existentes no banco não precisam de migração (exceto index)
- ✅ Apenas clarificações e documentação aprimorada
- ✅ Constantes exportadas para facilitar ajustes futuros

**Resultado:** Sistema mais consistente, documentado e preparado para crescimento.

---

**Agradecimentos ao feedback externo que identificou estas inconsistências! 🙏**
