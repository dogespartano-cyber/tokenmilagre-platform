# 🚦 Status do Sistema - TokenMilagre Platform

**Última Atualização:** 2025-11-18
**Ambiente:** Produção
**Status Geral:** 🟢 ESTÁVEL (com features desabilitadas)

---

## 📊 Status das Features

### 🟢 Produção Estável (Funcionando)

| Feature | Status | Versão | Notas |
|---------|--------|--------|-------|
| **Dashboard Principal** | 🟢 Ativo | v1 | Funcionamento normal |
| **Autenticação (NextAuth)** | 🟢 Ativo | v1 | Funcionamento normal |
| **API v1** | 🟢 Ativo | v1 | Endpoints `/api/*` funcionais |
| **Gestão de Usuários** | 🟢 Ativo | v1 | CRUD completo |
| **Sistema de Artigos (v1)** | 🟢 Ativo | v1 | Schema atual |
| **Integração Solana** | 🟢 Ativo | v1 | Token tracking ativo |

### 🟡 Em Migração (Desabilitado Temporariamente)

| Feature | Status | Versão | ETA | Blocker |
|---------|--------|--------|-----|---------|
| **API v2** | 🔴 Desabilitado | v2 | TBD | Migração de schema pendente |
| **Testes E2E (Playwright)** | 🔴 Desabilitado | v2 | TBD | Depende de API v2 |
| **Sistema de Categorias** | 🔴 Desabilitado | v2 | TBD | Migração de schema pendente |
| **Sistema de Tags** | 🔴 Desabilitado | v2 | TBD | Migração de schema pendente |
| **Soft Deletes** | 🔴 Desabilitado | v2 | TBD | Migração de schema pendente |

---

## 🔧 Feature Flags Ativas

### Como habilitar features

Features desabilitadas podem ser habilitadas via variáveis de ambiente:

```bash
# .env ou .env.local

# API v2 (NÃO HABILITAR ainda!)
ENABLE_API_V2=false

# E2E Tests
ENABLE_E2E_TESTS=false
```

⚠️ **IMPORTANTE:** Não habilite `ENABLE_API_V2=true` até completar a migração do schema!

---

## 📋 Roadmap de Migração

### Fase 1: Preparação ✅ CONCLUÍDA
- [x] Código v2 mergeado
- [x] Dependências instaladas
- [x] Feature flags implementadas
- [x] Documentação criada
- [x] Scripts de migração prontos
- [x] Sistema v1 estabilizado

### Fase 2: Validação em Staging 🔄 EM ANDAMENTO
- [ ] Executar `pre-migration-check.sql`
- [ ] Criar clone do banco de produção
- [ ] Aplicar migrations estruturais
- [ ] Executar `data-migration-v2.sql`
- [ ] Testes manuais completos
- [ ] Testes E2E automatizados
- [ ] Validação de integridade de dados
- [ ] Performance testing

### Fase 3: Deploy em Produção ⏳ AGUARDANDO
- [ ] Review final do MIGRATION_PLAN.md
- [ ] Comunicação com stakeholders
- [ ] Janela de manutenção agendada
- [ ] Backup completo do banco
- [ ] Execução da migração
- [ ] Habilitar `ENABLE_API_V2=true`
- [ ] Smoke tests
- [ ] Monitoramento pós-deploy

### Fase 4: Deprecação do Schema v1 📅 FUTURO
- [ ] 2 semanas de dual-schema
- [ ] Migração de clientes para API v2
- [ ] Remoção de código v1 legado
- [ ] Cleanup de campos deprecados

---

## 🚨 Como Acessar Features Desabilitadas

### API v2 (Desabilitada)

**Tentativa de acesso retorna:**
```json
{
  "error": "API v2 Temporarily Disabled",
  "message": "API v2 is currently undergoing database migration...",
  "status": 503,
  "details": {
    "reason": "Schema migration in progress",
    "eta": "TBD - Waiting for staging validation",
    "fallback": "Use /api/v1/* endpoints"
  }
}
```

**Headers retornados:**
```
HTTP/1.1 503 Service Unavailable
Retry-After: 3600
X-Feature-Status: disabled
X-Migration-Status: pending
```

---

## 📞 Contatos

### Emergências de Produção
- **DevOps:** [Definir]
- **Tech Lead:** [Definir]
- **On-Call:** [Definir]

### Comunicação sobre Migração
- **Slack Channel:** #tokenmilagre-migration
- **Status Page:** [TBD]
- **Email Updates:** [TBD]

---

## 📚 Documentação Relacionada

- [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) - Plano completo de migração
- [API_V2_SPECIFICATION.md](./docs/API_V2_SPECIFICATION.md) - Especificação da API v2
- [NEW_PRISMA_SCHEMA.md](./docs/NEW_PRISMA_SCHEMA.md) - Documentação do schema v2
- [CHANGELOG.md](./CHANGELOG.md) - Histórico de mudanças

---

## 🔍 Monitoramento

### Dashboards
- **Vercel Analytics:** [Link]
- **Sentry Errors:** [Link]
- **Database Performance:** [Link]

### Métricas Críticas
- ✅ Uptime: 99.9%
- ✅ Response Time (P95): < 500ms
- ✅ Error Rate: < 0.1%
- ✅ Database Connections: Normal

---

## ⚡ Quick Actions

### Se algo der errado

```bash
# 1. Verificar logs
vercel logs

# 2. Verificar Sentry
open https://sentry.io/[project]

# 3. Rollback imediato
git revert HEAD
git push origin main --force
vercel --prod

# 4. Restaurar banco (se necessário)
psql $DATABASE_URL < backup-YYYYMMDD.sql
```

### Habilitar API v2 (SOMENTE após migração)

```bash
# 1. Verificar que migração foi bem-sucedida
npm run test:e2e

# 2. Adicionar no Vercel
vercel env add ENABLE_API_V2
# Valor: true

# 3. Redeploy
vercel --prod

# 4. Smoke test
curl https://tokenmilagre.vercel.app/api/v2/articles
```

---

**Última Verificação de Produção:** 2025-11-18 às [hora]
**Próxima Revisão Agendada:** [TBD]
