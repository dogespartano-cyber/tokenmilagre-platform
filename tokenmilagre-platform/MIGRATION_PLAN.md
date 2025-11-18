# Migration Plan: Schema v1 → v2

**Data:** 2025-11-18
**Status:** READY FOR REVIEW
**Impacto:** ALTO - Mudanças estruturais no banco de dados

---

## 🎯 Objetivo

Migrar do `schema.prisma` (v1) para `schema-v2.prisma` para habilitar:
- API v2 com arquitetura em camadas
- Soft deletes (campo `deletedAt`)
- Sistema de status para artigos (`draft`, `published`, `archived`)
- Categorias e tags normalizadas
- Relacionamentos otimizados

---

## 📊 Principais Mudanças

### 1. **Novos Enums**
```prisma
enum ArticleType { news, educational }
enum ArticleStatus { draft, published, archived }
enum Level { iniciante, intermediario, avancado }
enum ContentType { artigo, tutorial, curso }
```

### 2. **Enums Removidos**
```prisma
- enum WarningLevel { info, warning, critical }
- enum StoryCategory { transformation, social_project, achievement }
- enum ProjectCategory { donations, microcredit, education, infrastructure }
```

### 3. **Model Article - Mudanças Críticas**

**Campos Adicionados:**
- `status: ArticleStatus` (enum) - substitui `published: Boolean`
- `deletedAt: DateTime?` - soft delete
- `readTime: String?` - tempo de leitura calculado
- `viewCount: Int` - contador de visualizações

**Campos Modificados:**
- `type: String` → `type: ArticleType` (enum)
- `category: String` → Relacionamento M:1 com model `Category`
- Tags migram para relacionamento M:N via `ArticleTag`

**Campos Removidos:**
- `published: Boolean` (substituído por `status`)
- `category: String` (normalizado em model separado)

### 4. **Novos Models**

```prisma
model Category {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  description String?
  articles    Article[]
}

model Tag {
  id       String       @id @default(cuid())
  slug     String       @unique
  name     String
  articles ArticleTag[]
}

model ArticleTag {
  articleId String
  tagId     String
  article   Article
  tag       Tag
  @@id([articleId, tagId])
}
```

### 5. **Models Removidos**

Os seguintes models serão **REMOVIDOS** (verifique se há dados):
- `ImpactStory`
- `SocialProject`
- `WarningAlert`
- `Cryptocurrency`
- `MarketData`

---

## ⚠️ Riscos e Impactos

### Alto Risco
1. **Perda de dados** se models removidos tiverem registros
2. **Breaking changes** em toda a aplicação que usa `Article.published`
3. **Migração de categorias** - conversão de string para relacionamento

### Médio Risco
1. Mudança de tipo de `category` requer data migration
2. Enum `ArticleType` pode ter valores incompatíveis

### Baixo Risco
1. Novos campos opcionais (`deletedAt`, `readTime`)
2. Novos models (`Category`, `Tag`)

---

## 📋 Checklist Pré-Migração

### Backup
- [ ] Dump completo do banco de dados
- [ ] Backup do schema.prisma atual
- [ ] Backup de .env (conexões DB)

### Análise de Dados
- [ ] Contar registros em models a serem removidos
- [ ] Listar categorias únicas em `Article.category`
- [ ] Verificar valores em `Article.type`
- [ ] Identificar artigos com `published = true/false`

### Preparação
- [ ] Criar migration script para dados
- [ ] Preparar script de rollback
- [ ] Configurar ambiente de staging
- [ ] Comunicar equipe sobre downtime

---

## 🔧 Estratégia de Migração

### Opção 1: Migração Gradual (RECOMENDADA)

1. **Manter ambos schemas simultaneamente**
   - Schema v1: `prisma/schema.prisma` → `lib/generated/prisma`
   - Schema v2: `prisma/schema-v2.prisma` → `lib/generated/prisma-v2`

2. **Deploy incremental**
   - Rotas v1 continuam funcionando
   - Rotas v2 ficam em beta/feature flag
   - Migração de dados acontece em background

3. **Cutover controlado**
   - Quando v2 estiver validada, deprecar v1
   - Remover schema antigo em release futura

### Opção 2: Big Bang Migration (NÃO RECOMENDADA)

1. Substituir `schema.prisma` por `schema-v2.prisma`
2. Executar migrations
3. Corrigir todos erros TypeScript
4. Deploy com downtime

---

## 📝 Scripts Necessários

### 1. Data Migration Script
```sql
-- Migrar categorias (string → relação)
INSERT INTO "Category" (id, slug, name)
SELECT DISTINCT
  gen_random_uuid(),
  category,
  INITCAP(category)
FROM "Article"
WHERE category IS NOT NULL;

-- Atualizar Article.categoryId
UPDATE "Article" a
SET "categoryId" = c.id
FROM "Category" c
WHERE a.category = c.slug;

-- Migrar published → status
UPDATE "Article"
SET status = CASE
  WHEN published = true THEN 'published'
  ELSE 'draft'
END;
```

### 2. Rollback Script
```sql
-- Reverter status → published
UPDATE "Article"
SET published = CASE
  WHEN status = 'published' THEN true
  ELSE false
END;

-- Restaurar category (relação → string)
UPDATE "Article" a
SET category = c.slug
FROM "Category" c
WHERE a."categoryId" = c.id;
```

---

## ✅ Plano de Ação

### Fase 1: Preparação (30min)
1. [ ] Executar backup completo do DB
2. [ ] Análise de dados (queries acima)
3. [ ] Review deste documento com equipe
4. [ ] Criar branch `migration/schema-v2`

### Fase 2: Migration em DEV (1h)
1. [ ] Copiar `schema-v2.prisma` → `schema.prisma`
2. [ ] Ajustar `output` para `../lib/generated/prisma`
3. [ ] Executar `prisma migrate dev --name schema-v2-initial`
4. [ ] Executar data migration scripts
5. [ ] Testar aplicação completa

### Fase 3: Correção de Código (2h)
1. [ ] Corrigir todos erros TypeScript
2. [ ] Atualizar queries que usam `published`
3. [ ] Atualizar queries que usam `category`
4. [ ] Rodar testes unitários e E2E

### Fase 4: Validação (1h)
1. [ ] Testar todas rotas v2
2. [ ] Verificar integridade de dados
3. [ ] Performance testing
4. [ ] Code review

### Fase 5: Deploy (variável)
1. [ ] Merge para main
2. [ ] Deploy em staging
3. [ ] Smoke tests em staging
4. [ ] Deploy em produção
5. [ ] Monitoramento pós-deploy

---

## 🚨 Rollback Plan

**Se algo der errado:**

1. **Imediato (< 5min)**
   ```bash
   git revert HEAD
   git push origin main --force
   vercel --prod
   ```

2. **Database (< 15min)**
   ```bash
   psql $DATABASE_URL < backup-YYYYMMDD.sql
   ```

3. **Verificação**
   - Testar rotas críticas
   - Verificar logs do Sentry
   - Confirmar integridade de dados

---

## 📞 Comunicação

### Antes da migração
- [ ] Notificar equipe 24h antes
- [ ] Agendar janela de manutenção
- [ ] Preparar status page

### Durante a migração
- [ ] Updates a cada 15min no Slack
- [ ] Monitorar erros no Sentry
- [ ] Logs detalhados de cada etapa

### Após a migração
- [ ] Relatório de sucesso/falhas
- [ ] Lições aprendidas
- [ ] Atualizar documentação

---

## 🔗 Recursos

- [Prisma Migration Guide](https://www.prisma.io/docs/guides/migrate)
- [Schema v2 Documentation](./docs/NEW_PRISMA_SCHEMA.md)
- [API v2 Specification](./docs/API_V2_SPECIFICATION.md)
- [Rollback Procedures](./docs/ROLLBACK_PROCEDURES.md)

---

## ✍️ Aprovações

- [ ] Tech Lead
- [ ] DevOps
- [ ] Product Owner
- [ ] QA Lead

---

**Próximo passo:** Review deste documento e decisão sobre estratégia (Gradual vs Big Bang)
