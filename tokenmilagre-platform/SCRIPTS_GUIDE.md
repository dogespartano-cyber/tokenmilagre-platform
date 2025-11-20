# 📚 Guia Completo de Scripts - TokenMilagre Platform

Documentação abrangente de todos os scripts de automação, qualidade e utilitários disponíveis no projeto.

## 📋 Índice

1. [Scripts Rápidos (Quick Commands)](#scripts-rápidos)
2. [Automação e DevOps](#automação-e-devops)
3. [Quality Assurance](#quality-assurance)
4. [Database Management](#database-management)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Scripts Rápidos

### Desenvolvimento Local

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar checks rápidos (sem build)
npm run check:all:fast

# Lint apenas arquivos alterados
npm run lint:changed
```

### Quality Checks

```bash
# Todos os checks (completo)
npm run check:all

# Apenas lint
npm run lint

# Fix automático de lint
npm run lint:fix

# Type checking
npm run type-check

# Testes
npm test
npm run test:coverage
```

### Database

```bash
# Backup do banco local
npm run db:backup

# Backup do staging
npm run db:backup:staging

# Listar backups disponíveis
npm run db:list-backups

# Restore (especificar arquivo)
npm run db:restore

# Prisma Studio
npm run db:studio
```

---

## 🔧 Automação e DevOps

### 1. lint-changed.sh

**Lint incremental para economizar tempo em grandes codebases.**

#### Uso Básico

```bash
# Via NPM
npm run lint:changed

# Direto
./scripts/utils/lint-changed.sh
```

#### Modos de Operação

```bash
# Arquivos staged (padrão - ideal para pre-commit)
./scripts/utils/lint-changed.sh

# Todos os arquivos modificados (não commitados)
./scripts/utils/lint-changed.sh --all

# Comparar com branch específica
./scripts/utils/lint-changed.sh main
./scripts/utils/lint-changed.sh develop
```

#### Quando Usar

| Cenário | Comando | Benefício |
|---------|---------|-----------|
| Pre-commit hook | `lint-changed.sh` | Valida apenas o que vai ser commitado |
| PR review | `lint-changed.sh main` | Check só das mudanças da branch |
| Development | `lint-changed.sh --all` | Valida tudo que não foi commitado |

#### Integração com Git Hooks

Adicione ao `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint:changed
```

---

### 2. backup-db.sh

**Sistema completo de backup/restore para PostgreSQL.**

#### Backup

```bash
# Backup local
npm run db:backup
./scripts/utils/backup-db.sh backup local

# Backup staging
npm run db:backup:staging
./scripts/utils/backup-db.sh backup staging
```

**Output:**
```
═══════════════════════════════════════════════════════════════
  💾 DATABASE BACKUP - LOCAL
═══════════════════════════════════════════════════════════════

Database: local
Backup file: ./backups/db/backup-local-20250119-143022.sql

📦 Creating backup...
✅ Backup created successfully
   Size: 2.4M
   File: ./backups/db/backup-local-20250119-143022.sql

🔗 Created symlink: ./backups/db/latest-local.sql
```

#### Restore

```bash
# Restore específico
./scripts/utils/backup-db.sh restore local backup-local-20250119-143022.sql

# Restore do último backup
./scripts/utils/backup-db.sh restore local latest-local.sql
```

⚠️ **ATENÇÃO:** Restore sobrescreve o banco atual! Sempre confirme antes.

#### Listar Backups

```bash
npm run db:list-backups
./scripts/utils/backup-db.sh list
```

#### Configuração

No `.env`:

```bash
# Local
DATABASE_URL="postgresql://user:pass@localhost:5432/tokenmilagre"

# Staging
STAGING_DATABASE_URL="postgresql://user:pass@db.supabase.co:5432/postgres"
```

#### Estratégias de Backup

**Desenvolvimento:**
```bash
# Backup antes de migrations perigosas
npm run db:backup
npx prisma db push

# Se algo der errado
npm run db:restore
```

**Staging/Produção:**
```bash
# Backup automático via cron (exemplo)
0 2 * * * cd /path/to/project && ./scripts/utils/backup-db.sh backup staging
```

---

### 3. check-env.sh

**Validação de variáveis de ambiente obrigatórias.**

#### Uso Básico

```bash
# Auto-detect (usa NODE_ENV)
npm run check:env

# Ambiente específico
./scripts/utils/check-env.sh development
./scripts/utils/check-env.sh staging
./scripts/utils/check-env.sh production
```

#### O Que é Verificado

**Todos os ambientes:**
- ✅ `DATABASE_URL` - Conexão com banco
- ✅ `NEXTAUTH_SECRET` - Autenticação (min 32 chars)
- ✅ `NEXTAUTH_URL` - Callback URL

**Production adicional:**
- ✅ `SENTRY_DSN` - Error tracking
- ✅ `VERCEL_ENV` - Ambiente Vercel
- ✅ Database connection test

#### Checagens de Segurança

- 🔒 Valida tamanho de secrets (min 32 chars)
- 🔒 Detecta secrets de desenvolvimento em produção
- 🔒 Testa conexão com banco
- 🔒 Mascara valores sensíveis no output

#### Integração CI/CD

```yaml
# .github/workflows/deploy.yml
- name: Validate environment
  run: ./scripts/utils/check-env.sh production
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
```

---

## ✅ Quality Assurance

### run-all-checks.sh

**Suite completa de quality checks para CI/CD.**

#### Uso

```bash
# Completo (inclui build)
npm run check:all

# Rápido (pula build)
npm run check:all:fast

# Direto
./scripts/quality/run-all-checks.sh
./scripts/quality/run-all-checks.sh --fast
./scripts/quality/run-all-checks.sh --coverage
```

#### O Que é Executado

| Check | Descrição | Tempo Médio |
|-------|-----------|-------------|
| 1. TypeScript | Type checking completo | ~30s |
| 2. ESLint | Linting de código | ~20s |
| 3. Prisma Schema | Validação do schema | ~5s |
| 4. Unit Tests | Testes unitários | ~45s |
| 5. Coverage | Threshold 95% (warning) | ~60s |
| 6. Schema Integrity | Checks customizados | ~10s |
| 7. Build | Build de produção | ~120s |
| 8. Env Check | Variáveis de ambiente | ~5s |

**Total:** ~5min (completo) | ~2min (--fast)

#### Modos de Execução

**Development (local):**
```bash
# Rápido para feedback
npm run check:all:fast
```

**Pre-push hook:**
```bash
# Completo antes de push
npm run check:all
```

**CI/CD:**
```bash
# Com coverage report
./scripts/quality/run-all-checks.sh --coverage
```

---

### check-schema-integrity.ts

**Validação avançada de integridade do banco de dados.**

#### Uso

```bash
npm run check:schema
tsx scripts/quality/check-schema-integrity.ts
```

#### Validações

1. ✅ **Database Connection** - Testa conectividade
2. ✅ **Required Tables** - Verifica existência de tabelas
3. ✅ **Orphaned Records** - Detecta registros órfãos
4. ✅ **Duplicate Slugs** - Identifica slugs duplicados
5. ✅ **Invalid Enums** - Valida valores de enum
6. ✅ **Missing Fields** - Detecta campos obrigatórios vazios

#### Quando Executar

- 📅 Diariamente via cron/CI
- 🔄 Após migrations
- 🐛 Debug de problemas de dados
- 🚀 Antes de deploys importantes

---

## 💾 Database Management

### Workflows Comuns

#### Migration Segura

```bash
# 1. Backup antes da migration
npm run db:backup

# 2. Validar schema
npm run db:validate

# 3. Executar migration
npx prisma db push

# 4. Verificar integridade
npm run check:schema

# 5. Se algo der errado
npm run db:restore
```

#### Sync entre Ambientes

```bash
# 1. Backup do staging
npm run db:backup:staging

# 2. Restore no local
./scripts/utils/backup-db.sh restore local backup-staging-YYYYMMDD-HHMMSS.sql

# 3. Verificar
npm run db:studio
```

---

## 🔄 CI/CD Pipeline

### Workflow Completo (.github/workflows/ci.yml)

#### Jobs Configurados

1. **Quality Checks** - Lint, tests, type checking
2. **Security Audit** - npm audit, vulnerabilities
3. **Code Coverage** - Relatório de cobertura
4. **Documentation** - Build automático de docs
5. **Build Test** - Validação de build
6. **Notify** - Resumo de resultados

#### Triggers

```yaml
on:
  push:
    branches: [main, develop, 'claude/**']
  pull_request:
    branches: [main, develop]
```

#### Features

- ✅ Execução paralela de jobs
- ✅ Upload de artifacts (coverage, docs)
- ✅ Security audit com thresholds
- ✅ Deploy automático de docs (GitHub Pages)
- ✅ Comentário de coverage em PRs
- ✅ Cache de dependências npm

#### Secrets Necessários

Configure no GitHub:

```
DATABASE_URL          # Connection string
NEXTAUTH_SECRET       # Min 32 chars
CODECOV_TOKEN         # Para upload de coverage
GITHUB_TOKEN          # Auto-configurado
```

---

## 🐛 Troubleshooting

### Problemas Comuns

#### Script: Permission Denied

```bash
chmod +x scripts/utils/*.sh
chmod +x scripts/quality/*.sh
```

#### pg_dump/psql not found

**macOS:**
```bash
brew install postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-client
```

#### Git hooks não executam

```bash
# Reinstalar husky
npm run prepare

# Verificar permissões
chmod +x .husky/pre-commit
```

#### ESLint failing in CI

```bash
# Testar localmente primeiro
npm run lint

# Check configuração
cat .eslintrc.json
```

#### Coverage abaixo do threshold

```bash
# Ver relatório detalhado
npm run test:coverage
open coverage/lcov-report/index.html
```

### Debug de Scripts

#### Modo Verbose

Adicione no início do script:

```bash
set -x  # Print commands
set -v  # Print input
```

#### Check variáveis

```bash
echo "DATABASE_URL: ${DATABASE_URL:0:20}..."
echo "NODE_ENV: $NODE_ENV"
```

---

## 📊 Performance Tips

### Otimizar CI/CD

1. **Use --fast mode** em checks não-críticos
2. **Cache npm dependencies** no workflow
3. **Paralelizar jobs** independentes
4. **Skip docs build** em feature branches

### Otimizar Local Development

1. **Use lint:changed** em vez de lint completo
2. **Run checks incrementalmente** durante development
3. **Backup apenas quando necessário**
4. **Use test:watch** para feedback imediato

---

## 🔗 Links Úteis

- **Scripts Utils:** `scripts/utils/README.md`
- **Scripts Quality:** `scripts/quality/`
- **CI/CD Workflow:** `.github/workflows/ci.yml`
- **Main README:** `README.md`

---

## 🎯 Cheat Sheet

```bash
# Development
npm run dev                    # Start dev server
npm run lint:changed           # Quick lint
npm run test:watch             # TDD mode

# Quality
npm run check:all:fast         # Fast checks
npm run check:all              # Full checks
npm run check:env              # Env validation

# Database
npm run db:backup              # Backup local
npm run db:studio              # Prisma Studio
npm run check:schema           # Integrity check

# CI/CD
git push                       # Triggers pipeline
npm run build                  # Test build locally
```

---

**Desenvolvido com ❤️ pela comunidade $MILAGRE**
