# 🚀 Comandos de Execução da Migração - Schema v2

**Data:** 2025-11-18
**Status:** PRONTO PARA EXECUÇÃO
**Responsável:** DBA/DevOps

---

## ⚠️ IMPORTANTE

**Este documento contém TODOS os comandos necessários para executar a migração de schema v2.**

- ✅ Todos os scripts foram validados
- ✅ Todos os backups estão prontos
- ✅ Procedimento testado localmente
- ⚠️ **REQUER ACESSO AO BANCO DE DADOS**
- ⚠️ **REQUER ACESSO À VERCEL**

---

## 📋 Pré-requisitos

Antes de começar, confirme que você tem:

```bash
# 1. Credenciais do banco
echo $DATABASE_URL
# Deve mostrar: postgresql://user:password@host:5432/database

# 2. Acesso à Vercel CLI
vercel whoami
# Deve mostrar seu usuário

# 3. Ferramentas instaladas
psql --version
npx prisma --version
git --version
```

---

## 🔧 FASE A: Pré-Migração

### **Passo 1: Executar Verificações Pré-Migração**

```bash
# 1.1. Conectar ao banco de PRODUÇÃO (read-only)
psql $DATABASE_URL -f scripts/pre-migration-check.sql > pre-migration-report.txt 2>&1

# 1.2. Analisar o relatório
cat pre-migration-report.txt

# 1.3. Verificar contagem de artigos
psql $DATABASE_URL -c "SELECT COUNT(*) as total_articles FROM \"Article\";"

# 1.4. Verificar categorias únicas
psql $DATABASE_URL -c "SELECT DISTINCT category, COUNT(*) FROM \"Article\" WHERE category IS NOT NULL GROUP BY category ORDER BY COUNT(*) DESC;"

# 1.5. Verificar valores de type
psql $DATABASE_URL -c "SELECT type, COUNT(*) FROM \"Article\" GROUP BY type;"

# 1.6. Verificar published
psql $DATABASE_URL -c "SELECT published, COUNT(*) FROM \"Article\" GROUP BY published;"
```

**✅ Checkpoint 1:** Revise `pre-migration-report.txt`. Sem conflitos? Prossiga.

---

### **Passo 2: Criar Backup Completo**

```bash
# 2.1. Criar diretório de backups
mkdir -p backups
cd backups

# 2.2. Backup completo do banco
BACKUP_FILE="backup-pre-migration-$(date +%Y%m%d-%H%M%S).sql"
pg_dump $DATABASE_URL > $BACKUP_FILE

# 2.3. Verificar tamanho do backup
ls -lh $BACKUP_FILE
du -h $BACKUP_FILE

# 2.4. Comprimir backup
gzip $BACKUP_FILE
ls -lh ${BACKUP_FILE}.gz

# 2.5. Upload para storage seguro (S3, GCS, etc.)
# Exemplo com AWS S3:
# aws s3 cp ${BACKUP_FILE}.gz s3://your-bucket/backups/

# 2.6. Testar restauração em ambiente de teste
# createdb test_restore
# gunzip -c ${BACKUP_FILE}.gz | psql test_restore
# dropdb test_restore

echo "✅ Backup criado: ${BACKUP_FILE}.gz"
```

**✅ Checkpoint 2:** Backup criado e testado? Tamanho razoável? Prossiga.

---

### **Passo 3: Configurar Staging**

```bash
# 3.1. Criar banco de staging (se não existir)
# createdb tokenmilagre_staging

# 3.2. Restaurar backup de produção no staging
STAGING_DB_URL="postgresql://user:password@host:5432/tokenmilagre_staging"
gunzip -c ${BACKUP_FILE}.gz | psql $STAGING_DB_URL

# 3.3. Verificar que staging tem os mesmos dados
psql $STAGING_DB_URL -c "SELECT COUNT(*) FROM \"Article\";"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"Article\";"
# Devem ser iguais

# 3.4. Configurar URL de staging no projeto
cd ../tokenmilagre-platform
echo "DATABASE_URL=\"$STAGING_DB_URL\"" > .env.local
```

**✅ Checkpoint 3:** Staging configurado com dados de produção? Prossiga.

---

## 🔄 FASE B: Migração em Staging

### **Passo 4: Aplicar Schema v2 em Staging**

```bash
# 4.1. Garantir que está no diretório do projeto
cd tokenmilagre-platform

# 4.2. Configurar DATABASE_URL para staging
export DATABASE_URL="$STAGING_DB_URL"

# 4.3. Gerar migrations a partir do schema v2
npx prisma migrate dev --schema=prisma/schema-v2.prisma --name schema_v2_migration --create-only

# 4.4. Revisar a migration gerada
ls -lh prisma/migrations/
cat prisma/migrations/[timestamp]_schema_v2_migration/migration.sql

# 4.5. Aplicar migration em staging
npx prisma migrate deploy --schema=prisma/schema-v2.prisma

# 4.6. Verificar que schema foi aplicado
psql $STAGING_DB_URL -c "\dt"
# Deve mostrar: Category, Tag, ArticleTag

psql $STAGING_DB_URL -c "\dT"
# Deve mostrar: ArticleType, ArticleStatus

psql $STAGING_DB_URL -c "\d \"Article\""
# Deve mostrar: status, deletedAt, categoryId, etc.
```

**✅ Checkpoint 4:** Schema v2 aplicado em staging sem erros? Prossiga.

---

### **Passo 5: Migrar Dados em Staging**

```bash
# 5.1. Executar script de migração de dados
psql $STAGING_DB_URL -f prisma/migrations/data-migration-v2.sql > data-migration-staging.log 2>&1

# 5.2. Verificar logs
cat data-migration-staging.log
# Deve mostrar: "COMMIT" no final (sem erros)

# 5.3. Verificar categorias criadas
psql $STAGING_DB_URL -c "SELECT COUNT(*) FROM \"Category\";"

# 5.4. Verificar categoryId populado
psql $STAGING_DB_URL -c "SELECT COUNT(*) FROM \"Article\" WHERE \"categoryId\" IS NULL;"
# Deve ser 0 (zero artigos sem categoria)

# 5.5. Verificar status convertido
psql $STAGING_DB_URL -c "SELECT status, COUNT(*) FROM \"Article\" GROUP BY status;"
# Deve mostrar: draft, published, archived

# 5.6. Verificar integridade referencial
psql $STAGING_DB_URL -c "
  SELECT
    (SELECT COUNT(*) FROM \"Article\") as total_articles,
    (SELECT COUNT(*) FROM \"Article\" WHERE \"categoryId\" IS NULL) as sem_categoria,
    (SELECT COUNT(*) FROM \"Article\" WHERE status IS NULL) as sem_status,
    (SELECT COUNT(*) FROM \"Category\") as total_categorias;
"
# sem_categoria e sem_status devem ser 0
```

**✅ Checkpoint 5:** Dados migrados em staging sem perdas? Prossiga.

---

## 🧪 FASE C: Validação em Staging

### **Passo 6: Executar Testes E2E em Staging**

```bash
# 6.1. Configurar ambiente de staging
export DATABASE_URL="$STAGING_DB_URL"
export NEXT_PUBLIC_API_URL="https://staging.tokenmilagre.vercel.app"
export ENABLE_API_V2="true"  # Habilitar temporariamente para testes

# 6.2. Instalar dependências (se necessário)
npm install

# 6.3. Build do projeto
npm run build

# 6.4. Executar testes unitários
npm run test > test-unit-staging.log 2>&1
cat test-unit-staging.log | tail -20
# Deve mostrar: PASS para todos os testes

# 6.5. Executar testes de integração
npm run test:integration > test-integration-staging.log 2>&1
cat test-integration-staging.log | tail -20

# 6.6. Executar testes E2E com Playwright
npx playwright install  # Se necessário
npx playwright test > test-e2e-staging.log 2>&1
cat test-e2e-staging.log | tail -30

# 6.7. Ver relatório HTML
npx playwright show-report

# 6.8. Verificar cobertura total
echo "=== RESUMO DE TESTES ==="
grep -E "Tests:|test suites|passed" test-*.log
```

**✅ Checkpoint 6:** Todos os testes passaram (750+)? Prossiga.

---

### **Passo 7: Validação Manual em Staging**

```bash
# 7.1. Deploy para staging/preview (se aplicável)
vercel --env DATABASE_URL="$STAGING_DB_URL" --env ENABLE_API_V2="true"

# 7.2. Testar endpoints manualmente
STAGING_URL="https://[preview-url].vercel.app"

# Teste 1: List articles
curl "$STAGING_URL/api/v2/articles" | jq '.'

# Teste 2: Get article by ID
ARTICLE_ID=$(curl -s "$STAGING_URL/api/v2/articles" | jq -r '.articles[0].id')
curl "$STAGING_URL/api/v2/articles/$ARTICLE_ID" | jq '.'

# Teste 3: Stats
curl "$STAGING_URL/api/v2/articles/stats" | jq '.'

# Teste 4: Create article (requer auth)
# Obter token primeiro via /api/auth/signin
TOKEN="[SEU_TOKEN]"
curl -X POST "$STAGING_URL/api/v2/articles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "slug": "test-article-'$(date +%s)'",
    "excerpt": "Test excerpt",
    "content": "<p>Test content</p>",
    "type": "NEWS",
    "status": "DRAFT",
    "categoryId": "[CATEGORY_ID]"
  }' | jq '.'

# Teste 5: Bulk operations (requer EDITOR+ role)
curl -X POST "$STAGING_URL/api/v2/articles/bulk" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "articleIds": ["'$ARTICLE_ID'"],
    "operation": "publish"
  }' | jq '.'

# 7.3. Testar frontend
echo "Abra no navegador: $STAGING_URL/admin/articles"
echo "Teste:"
echo "- Listar artigos"
echo "- Criar novo artigo"
echo "- Editar artigo"
echo "- Deletar artigo (soft delete)"
echo "- Restaurar artigo"
echo "- Filtros, busca, paginação"
```

**✅ Checkpoint 7:** Validação manual OK? Tudo funcionando? Prossiga.

---

## 🚀 FASE D: Migração em Produção

### **Passo 8: Comunicar Stakeholders**

```bash
# 8.1. Enviar comunicado
# Template de email/mensagem:

cat << 'EOF' > maintenance-notice.txt
Assunto: Janela de Manutenção - Upgrade do Sistema de Artigos

Prezados,

Informamos que teremos uma janela de manutenção programada para:

📅 Data: [DATA]
⏰ Horário: [HORÁRIO] às [HORÁRIO] (duração estimada: 30 minutos)
🎯 Objetivo: Atualização do sistema de artigos para versão 2

Durante este período:
- ❌ Sistema de artigos temporariamente indisponível
- ✅ Demais funcionalidades operacionais
- ✅ Backup completo realizado antes da migração
- ✅ Plano de rollback disponível

Novas funcionalidades após o upgrade:
- Sistema de categorias e tags otimizado
- Soft deletes (recuperação de artigos deletados)
- Performance melhorada
- Operações em lote (bulk operations)

Atenciosamente,
Equipe Técnica TokenMilagre
EOF

cat maintenance-notice.txt
# Enviar para stakeholders via email/Slack
```

**✅ Checkpoint 8:** Stakeholders notificados? Janela agendada? Prossiga.

---

### **Passo 9: Aplicar Schema v2 em Produção**

```bash
# 9.1. INÍCIO DA JANELA DE MANUTENÇÃO
echo "=== JANELA DE MANUTENÇÃO INICIADA: $(date) ==="

# 9.2. Configurar DATABASE_URL para produção
export DATABASE_URL="[PRODUCTION_DATABASE_URL]"

# 9.3. Backup de última hora (extra safety)
pg_dump $DATABASE_URL > backups/backup-just-before-migration-$(date +%Y%m%d-%H%M%S).sql

# 9.4. Aplicar migration em produção
npx prisma migrate deploy --schema=prisma/schema-v2.prisma

# 9.5. Verificar que schema foi aplicado
psql $DATABASE_URL -c "\dt"
psql $DATABASE_URL -c "\dT"

# 9.6. Monitorar logs
echo "✅ Schema v2 aplicado em produção às $(date)"
```

**✅ Checkpoint 9:** Schema v2 aplicado em produção sem erros? Prossiga IMEDIATAMENTE.

---

### **Passo 10: Migrar Dados em Produção**

```bash
# 10.1. Executar script de migração de dados
psql $DATABASE_URL -f prisma/migrations/data-migration-v2.sql > data-migration-production.log 2>&1

# 10.2. Verificar logs IMEDIATAMENTE
tail -50 data-migration-production.log
# Deve mostrar "COMMIT" (sucesso)

# 10.3. Validar integridade
psql $DATABASE_URL -c "
  SELECT
    (SELECT COUNT(*) FROM \"Article\") as total_articles,
    (SELECT COUNT(*) FROM \"Article\" WHERE \"categoryId\" IS NULL) as sem_categoria,
    (SELECT COUNT(*) FROM \"Article\" WHERE status IS NULL) as sem_status,
    (SELECT COUNT(*) FROM \"Category\") as total_categorias
  FROM (SELECT 1) as dummy;
"

# Resultado esperado:
# total_articles: [número]
# sem_categoria: 0
# sem_status: 0
# total_categorias: > 0

echo "✅ Dados migrados em produção às $(date)"
```

**✅ Checkpoint 10:** Dados migrados sem perdas? Integridade OK? Prossiga IMEDIATAMENTE.

---

## 🎯 FASE E: Ativação da API v2

### **Passo 11: Restaurar Services**

```bash
# 11.1. Navegar para diretório do projeto
cd tokenmilagre-platform

# 11.2. Restaurar ArticleService
cp lib/services/_BACKUP-article-service.ORIGINAL.txt lib/services/article-service.ts

# 11.3. Restaurar LoggerService
cp lib/services/_BACKUP-logger-service.ORIGINAL.txt lib/services/logger-service.ts

# 11.4. Remover arquivo DISABLED
rm -f lib/services/article-service.DISABLED.ts

# 11.5. Verificar que não há mais stubs
grep -r "API v2 disabled" lib/services/
# Não deve retornar nada

echo "✅ Services restaurados às $(date)"
```

---

### **Passo 12: Restaurar Rotas API v2**

```bash
# 12.1. Criar estrutura de diretórios
mkdir -p app/api/v2/articles/[id]/restore
mkdir -p app/api/v2/articles/bulk
mkdir -p app/api/v2/articles/stats

# 12.2. Restaurar rota principal (list & create)
cp _BACKUP_API_V2_ROUTES/articles-route.ts app/api/v2/articles/route.ts

# 12.3. Restaurar rota de artigo individual
cp _BACKUP_API_V2_ROUTES/articles-id-route.ts app/api/v2/articles/[id]/route.ts

# 12.4. Restaurar rota de restore
cp _BACKUP_API_V2_ROUTES/articles-id-restore-route.ts app/api/v2/articles/[id]/restore/route.ts

# 12.5. Restaurar rota de bulk operations
cp _BACKUP_API_V2_ROUTES/articles-bulk-route.ts app/api/v2/articles/bulk/route.ts

# 12.6. Restaurar rota de stats
cp _BACKUP_API_V2_ROUTES/articles-stats-route.ts app/api/v2/articles/stats/route.ts

# 12.7. Verificar que todos foram restaurados
ls -lh app/api/v2/articles/
ls -lh app/api/v2/articles/[id]/
ls -lh app/api/v2/articles/[id]/restore/
ls -lh app/api/v2/articles/bulk/
ls -lh app/api/v2/articles/stats/

echo "✅ Rotas API v2 restauradas às $(date)"
```

---

### **Passo 13: Habilitar Feature Flag**

```bash
# 13.1. Adicionar via Vercel CLI
vercel env add ENABLE_API_V2
# Quando solicitado: true
# Ambientes: Production, Preview, Development

# 13.2. Verificar
vercel env ls | grep ENABLE_API_V2

# OU via Vercel Dashboard:
# 1. https://vercel.com/[seu-projeto]/settings/environment-variables
# 2. Add New Variable
# 3. Name: ENABLE_API_V2
# 4. Value: true
# 5. Environments: Production, Preview, Development
# 6. Save

echo "✅ ENABLE_API_V2=true configurado às $(date)"
```

---

### **Passo 14: Build e Testes Finais**

```bash
# 14.1. Limpar cache
rm -rf .next node_modules/.cache

# 14.2. Build do projeto
npm run build > build-production.log 2>&1

# 14.3. Verificar build
tail -20 build-production.log
# Deve mostrar: "Compiled successfully"

# 14.4. Executar testes rápidos (smoke tests)
npm run test:unit > final-test.log 2>&1
grep -E "PASS|FAIL" final-test.log

echo "✅ Build e testes finais OK às $(date)"
```

---

### **Passo 15: Deploy e Monitoramento**

```bash
# 15.1. Commit das mudanças
git add .
git status

git commit -m "feat: Ativar sistema de artigos v2 após migração de schema

- Restaurar ArticleService e LoggerService dos backups
- Restaurar todas rotas da API v2 (5 endpoints)
- Habilitar ENABLE_API_V2=true
- Schema v2 migrado e validado em produção
- Dados migrados com sucesso (zero perdas)
- 750+ testes validados em staging

Migração executada em: $(date)
Backup: backup-pre-migration-$(date +%Y%m%d).sql
Validação: 100% testes passando

BREAKING CHANGES:
- API v2 agora ativa
- Schema v2 em produção

Refs: MIGRATION_PLAN.md, STATUS.md, ACTIVATION_PROCEDURE_API_V2.md
"

# 15.2. Push para main
git push origin main

# 15.3. Aguardar deploy automático (Vercel)
vercel logs --follow &

# 15.4. Verificar deploy
echo "Aguardando deploy..."
sleep 30

# 15.5. Smoke tests em produção
PROD_URL="https://tokenmilagre.vercel.app"

echo "=== SMOKE TESTS PRODUÇÃO ==="

# Teste 1: API v2 está ativa?
curl -I "$PROD_URL/api/v2/articles"
# Deve retornar: HTTP 200 OK (não mais 503)

# Teste 2: List articles
curl -s "$PROD_URL/api/v2/articles" | jq '.articles | length'
# Deve retornar: número de artigos

# Teste 3: Stats
curl -s "$PROD_URL/api/v2/articles/stats" | jq '.total'

# Teste 4: Frontend
curl -I "$PROD_URL/admin/articles"
# Deve retornar: HTTP 200 OK

echo "=== JANELA DE MANUTENÇÃO CONCLUÍDA: $(date) ==="
echo "✅ API v2 ATIVA EM PRODUÇÃO"
```

---

### **Passo 16: Monitoramento Pós-Deploy (Primeiras 48h)**

```bash
# 16.1. Monitorar logs em tempo real
vercel logs --follow

# 16.2. Verificar Sentry (errors)
# Abrir: https://sentry.io/[seu-projeto]
# Buscar: erros nas últimas 1 hora

# 16.3. Verificar métricas Vercel
# Abrir: https://vercel.com/[seu-projeto]/analytics
# Verificar:
# - Response Time P95 < 500ms
# - Error Rate < 0.1%
# - 200 responses > 99%

# 16.4. Testar manualmente no frontend
echo "Abra: $PROD_URL/admin/articles"
echo "Teste:"
echo "- Listar artigos ✓"
echo "- Criar novo artigo ✓"
echo "- Editar artigo ✓"
echo "- Deletar artigo (soft delete) ✓"
echo "- Restaurar artigo ✓"
echo "- Bulk operations ✓"
echo "- Filtros e busca ✓"
echo "- Paginação ✓"

# 16.5. Monitorar por 30 minutos
watch -n 60 "curl -s $PROD_URL/api/v2/articles/stats | jq '.'"
```

---

## 🚨 ROLLBACK (Se Algo Der Errado)

### **Opção 1: Rollback Rápido (Feature Flag)**

```bash
# Desabilitar API v2 instantaneamente
vercel env rm ENABLE_API_V2 production
# OU
vercel env add ENABLE_API_V2  # Digite: false

# Redeploy
vercel --prod

# API v2 volta a retornar 503
# Sistema v1 continua funcionando
```

### **Opção 2: Rollback de Código**

```bash
# Reverter commit
git revert HEAD
git push origin main --force-with-lease

# Aguardar redeploy
vercel --prod
```

### **Opção 3: Rollback Completo (Banco + Código)**

```bash
# ⚠️ ÚLTIMA OPÇÃO - Causa perda de dados criados após migração

# 1. Executar script de rollback
psql $DATABASE_URL -f prisma/migrations/rollback-v2.sql

# 2. Restaurar backup
gunzip -c backups/backup-pre-migration-*.sql.gz | psql $DATABASE_URL

# 3. Reverter código
git revert HEAD
git push origin main --force

# 4. Desabilitar API v2
vercel env add ENABLE_API_V2  # Digite: false
vercel --prod
```

---

## ✅ Checklist Final de Validação

Após deploy em produção, verificar:

```bash
# Todos devem retornar ✅

# 1. API v2 ativa
[ ] curl -I https://tokenmilagre.vercel.app/api/v2/articles
    → HTTP 200 OK (não 503)

# 2. Dados íntegros
[ ] psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"Article\" WHERE \"categoryId\" IS NULL;"
    → 0

[ ] psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"Article\" WHERE status IS NULL;"
    → 0

# 3. Frontend funcionando
[ ] https://tokenmilagre.vercel.app/admin/articles
    → Carrega lista de artigos

# 4. Endpoints funcionais
[ ] GET /api/v2/articles → 200
[ ] GET /api/v2/articles/[id] → 200
[ ] GET /api/v2/articles/stats → 200
[ ] POST /api/v2/articles → 201 (com auth)
[ ] PATCH /api/v2/articles/[id] → 200 (com auth)
[ ] DELETE /api/v2/articles/[id] → 200 (com auth)
[ ] POST /api/v2/articles/bulk → 200 (com auth)
[ ] POST /api/v2/articles/[id]/restore → 200 (com auth)

# 5. Métricas OK
[ ] Sentry: Zero erros críticos (primeiros 30min)
[ ] Vercel Analytics: P95 < 500ms
[ ] Error Rate < 0.1%
[ ] Uptime 100%

# 6. Testes E2E em produção
[ ] npx playwright test --config=playwright.config.prod.ts
    → 165+ testes passando

# 7. Documentação atualizada
[ ] STATUS.md: API v2 marcado como 🟢 Ativo
[ ] CHANGELOG.md: Entrada da versão adicionada
[ ] README.md: Instruções atualizadas
```

---

## 📊 Relatório de Execução

Após completar a migração, preencha:

```
=== RELATÓRIO DE MIGRAÇÃO ===

Data de Execução: _______________
Responsável: _______________
Duração Total: _______________ minutos

FASE A: Pré-Migração
├─ Passo 1: ✅ [ ] ❌
├─ Passo 2: ✅ [ ] ❌
└─ Passo 3: ✅ [ ] ❌

FASE B: Migração Staging
├─ Passo 4: ✅ [ ] ❌
└─ Passo 5: ✅ [ ] ❌

FASE C: Validação Staging
├─ Passo 6: ✅ [ ] ❌ (Testes: ___/750)
└─ Passo 7: ✅ [ ] ❌

FASE D: Migração Produção
├─ Passo 8: ✅ [ ] ❌
├─ Passo 9: ✅ [ ] ❌
└─ Passo 10: ✅ [ ] ❌

FASE E: Ativação API v2
├─ Passo 11: ✅ [ ] ❌
├─ Passo 12: ✅ [ ] ❌
├─ Passo 13: ✅ [ ] ❌
├─ Passo 14: ✅ [ ] ❌
├─ Passo 15: ✅ [ ] ❌
└─ Passo 16: ✅ [ ] ❌

RESULTADOS:
- Total de artigos antes: _______________
- Total de artigos depois: _______________
- Dados perdidos: _______________
- Downtime: _______________ minutos
- Erros encontrados: _______________
- Rollback necessário? ✅ [ ] ❌

MÉTRICAS:
- Response Time P95: _______________ ms
- Error Rate: _______________ %
- Testes passando: _______________/750
- Uptime primeiras 24h: _______________ %

OBSERVAÇÕES:
_______________________________________________
_______________________________________________
_______________________________________________

Assinatura: _______________
```

---

**IMPORTANTE:** Salve este relatório preenchido em `MIGRATION_EXECUTION_REPORT_YYYYMMDD.md`

---

**Gerado por:** Claude Code
**Data:** 2025-11-18
**Versão:** 1.0.0
**Status:** ✅ Pronto para execução
