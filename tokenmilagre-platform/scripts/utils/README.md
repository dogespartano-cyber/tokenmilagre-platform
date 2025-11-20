# Utility Scripts - TokenMilagre Platform

Coleção de scripts utilitários para automação de tarefas comuns de desenvolvimento, deployment e manutenção.

## 📋 Scripts Disponíveis

### 1. lint-changed.sh

Executa lint e type-check apenas em arquivos alterados, economizando tempo em grandes codebases.

**Uso:**
```bash
# Check apenas arquivos staged (padrão)
./scripts/utils/lint-changed.sh

# Check todos os arquivos não commitados
./scripts/utils/lint-changed.sh --all

# Check arquivos alterados vs branch específica
./scripts/utils/lint-changed.sh main
```

**Casos de uso:**
- ✅ Pre-commit hooks
- ✅ CI/CD incremental
- ✅ Desenvolvimento local rápido

**Output:**
```
═══════════════════════════════════════════════════════════════
  🔍 LINT CHANGED FILES
═══════════════════════════════════════════════════════════════

Mode: Staged files only

Found 3 file(s) to check:
  - app/api/articles/route.ts
  - lib/services/article-service.ts
  - components/Header.tsx

📝 Running ESLint on changed files...
✅ ESLint passed

📝 Running TypeScript check on changed files...
✅ TypeScript check passed

═══════════════════════════════════════════════════════════════
✅ ALL CHECKS PASSED (3 files)
═══════════════════════════════════════════════════════════════
```

**Troubleshooting:**

| Erro | Causa | Solução |
|------|-------|---------|
| `No files changed` | Nenhum arquivo staged/alterado | Normal, não é um erro |
| `ESLint failed` | Erros de linting | Execute `npm run lint:fix` |
| `TypeScript check failed` | Erros de tipo | Corrija os erros no seu editor |

---

### 2. backup-db.sh

Automatiza backup e restore de bancos de dados PostgreSQL (local e staging).

**Uso:**
```bash
# Criar backup do banco local
./scripts/utils/backup-db.sh backup local

# Criar backup do banco staging
./scripts/utils/backup-db.sh backup staging

# Restaurar backup
./scripts/utils/backup-db.sh restore local backup-20250119-143022.sql

# Listar backups disponíveis
./scripts/utils/backup-db.sh list
```

**Configuração:**

Adicione no `.env`:
```bash
# Local database
DATABASE_URL="postgresql://user:pass@localhost:5432/tokenmilagre"

# Staging database
STAGING_DATABASE_URL="postgresql://user:pass@db.supabase.co:5432/postgres"
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

═══════════════════════════════════════════════════════════════
```

**Troubleshooting:**

| Erro | Causa | Solução |
|------|-------|---------|
| `pg_dump not found` | PostgreSQL client não instalado | `brew install postgresql` (macOS) ou `apt-get install postgresql-client` (Ubuntu) |
| `No database URL found` | Variável de ambiente não configurada | Configure `DATABASE_URL` no `.env` |
| `Backup failed` | Erro de conexão ao banco | Verifique credenciais e conectividade |
| `Backup file not found` | Arquivo não existe | Use `./scripts/utils/backup-db.sh list` para ver backups disponíveis |

**Dicas:**
- 💡 Use `latest-local.sql` para sempre referenciar o backup mais recente
- 💡 Backups são salvos em `./backups/db/` (gitignored)
- 💡 Sempre teste restore em ambiente local antes de staging/produção

---

### 3. check-env.sh

Valida variáveis de ambiente obrigatórias antes de deployment.

**Uso:**
```bash
# Check ambiente de desenvolvimento (padrão)
./scripts/utils/check-env.sh

# Check ambiente específico
./scripts/utils/check-env.sh production
./scripts/utils/check-env.sh staging

# Com NODE_ENV
NODE_ENV=production ./scripts/utils/check-env.sh
```

**Output:**
```
═══════════════════════════════════════════════════════════════
  🔍 ENVIRONMENT VARIABLES SANITY CHECK
  Environment: PRODUCTION
═══════════════════════════════════════════════════════════════

Loading .env file...

=== Common Variables ===

✅ DATABASE_URL
   Database connection URL
   Value: postgresql://****@db.supabase.co:5432/****

✅ NEXTAUTH_SECRET
   NextAuth secret key
   Value: k9mL****vR2p

✅ NEXTAUTH_URL
   NextAuth callback URL
   Value: https://tokenmilagre.vercel.app

=== Production Variables ===

✅ SENTRY_DSN
   Sentry error tracking DSN
   Value: https://****@sentry.io/****

✅ VERCEL_ENV
   Vercel environment
   Value: production

=== Security Checks ===

✅ NEXTAUTH_SECRET has adequate length (64 chars)

═══════════════════════════════════════════════════════════════
✅ ALL REQUIRED CHECKS PASSED (5/5)
═══════════════════════════════════════════════════════════════
```

**Variáveis Verificadas por Ambiente:**

| Ambiente | Variáveis Obrigatórias |
|----------|------------------------|
| **Common** | `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| **Development** | `DIRECT_URL` |
| **Staging** | `DIRECT_URL`, `STAGING_DATABASE_URL`, `VERCEL_ENV` |
| **Production** | `DIRECT_URL`, `VERCEL_ENV`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN` |

**Variáveis Opcionais:**
- `NEXT_PUBLIC_SOLANA_NETWORK`
- `NEXT_PUBLIC_TOKEN_ADDRESS`
- `SENTRY_DSN` (exceto produção)

**Troubleshooting:**

| Erro | Causa | Solução |
|------|-------|---------|
| `Missing or empty` | Variável não configurada | Adicione no `.env` ou Vercel |
| `Secret is too short` | `NEXTAUTH_SECRET` < 32 chars | Gere novo secret: `openssl rand -base64 32` |
| `Using development secret` | Secret de dev em produção | Nunca use secrets de dev em produção! |
| `Database connection failed` | Credenciais inválidas | Verifique `DATABASE_URL` |

**Dicas:**
- 💡 Execute antes de todo deployment
- 💡 Integre no CI/CD pipeline
- 💡 Secrets são mascarados no output

---

## 🚀 Uso Integrado

### Pre-commit Hook

Adicione ao `.husky/pre-commit`:
```bash
#!/bin/bash
./scripts/utils/lint-changed.sh
```

### CI/CD Pipeline

Veja `.github/workflows/ci.yml` para exemplo completo.

### Scripts NPM

Adicione ao `package.json`:
```json
{
  "scripts": {
    "lint:changed": "./scripts/utils/lint-changed.sh",
    "db:backup": "./scripts/utils/backup-db.sh backup local",
    "db:restore": "./scripts/utils/backup-db.sh restore local",
    "env:check": "./scripts/utils/check-env.sh"
  }
}
```

---

## 🛠️ Requisitos

### Sistema
- **Bash:** 4.0+
- **Node.js:** 20.x
- **PostgreSQL Client:** 14+ (para backup/restore)

### Dependências Node
```bash
npm install
```

### Permissões
Todos os scripts já possuem permissão de execução (`chmod +x`).

---

## 📁 Estrutura de Diretórios

```
scripts/
├── utils/                      # Scripts utilitários
│   ├── README.md              # Esta documentação
│   ├── lint-changed.sh        # Lint incremental
│   ├── backup-db.sh           # Backup/restore DB
│   └── check-env.sh           # Validação env vars
├── quality/                   # Scripts de qualidade
│   ├── run-all-checks.sh      # Todos os checks
│   └── check-schema-integrity.ts
└── helpers/                   # Helpers reutilizáveis
    └── generate-unique-slug.js
```

---

## 🐛 Troubleshooting Geral

### Permissão negada
```bash
chmod +x scripts/utils/*.sh
```

### Command not found
```bash
# Adicione ./ antes do script
./scripts/utils/lint-changed.sh
```

### Script não encontra dependências
```bash
# Execute do diretório raiz do projeto
cd /path/to/tokenmilagre-platform
./scripts/utils/script-name.sh
```

---

## 📚 Recursos Adicionais

- **Quality Scripts:** Ver `scripts/quality/README.md`
- **CI/CD Workflow:** Ver `.github/workflows/ci.yml`
- **Main README:** Ver `README.md` na raiz

---

## 🤝 Contribuindo

Ao adicionar novos scripts:

1. ✅ Adicione header com documentação
2. ✅ Implemente tratamento de erros
3. ✅ Use cores para output legível
4. ✅ Adicione exemplos de uso
5. ✅ Documente troubleshooting comum
6. ✅ Atualize este README

---

**Desenvolvido com ❤️ pela comunidade $MILAGRE**
