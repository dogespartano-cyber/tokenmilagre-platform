# ⚡ NPM Commands Cheatsheet - Token Milagre Platform

**Referência rápida** de todos os comandos npm disponíveis no projeto.

---

## 📋 Índice

1. [Desenvolvimento](#desenvolvimento)
2. [Build e Deploy](#build-e-deploy)
3. [Database (Prisma)](#database-prisma)
4. [Testes](#testes)
5. [Qualidade de Código](#qualidade-de-código)
6. [Utilitários](#utilitários)
7. [Fluxo Completo de Desenvolvimento](#fluxo-completo-de-desenvolvimento)

---

## 🔧 Desenvolvimento

### `npm run dev`

**Descrição:** Inicia o servidor de desenvolvimento com Turbopack (hot reload)

**Quando usar:** Durante desenvolvimento ativo

**Porta:** http://localhost:3000

**Features:**
- Hot Module Replacement (HMR)
- Turbopack para builds ultrarrápidos
- Automatic compilation
- Error overlay

```bash
npm run dev

# Output esperado:
# ▲ Next.js 15.5.4
# - Local:        http://localhost:3000
# - Turbopack:    enabled
# ✓ Ready in 1.2s
```

**Dica:** Deixe rodando em um terminal separado durante desenvolvimento

---

### `npm run dev -- -p 3001`

**Descrição:** Inicia servidor de desenvolvimento em porta customizada

**Quando usar:** Quando porta 3000 está ocupada ou rodando múltiplas instâncias

```bash
npm run dev -- -p 3001
# Roda em http://localhost:3001
```

---

## 🏗️ Build e Deploy

### `npm run build`

**Descrição:** Cria build de produção otimizado

**Quando usar:**
- Antes de fazer deploy
- Para testar build localmente
- Em CI/CD pipelines

**Processo:**
1. Type checking (TypeScript)
2. Linting (ESLint)
3. Next.js compilation
4. Code splitting
5. Minification
6. Asset optimization

```bash
npm run build

# Output esperado:
# ✓ Creating an optimized production build
# ✓ Compiled successfully
# ✓ Collecting page data
# ✓ Generating static pages (42/42)
# ✓ Finalizing page optimization
# Build completed in 75s
```

**Arquivos gerados:** `.next/` directory

---

### `npm start`

**Descrição:** Inicia servidor de produção (requer build prévio)

**Quando usar:**
- Testar build de produção localmente
- Simular ambiente de produção

**Pré-requisito:** `npm run build` deve ter sido executado

```bash
# 1. Build
npm run build

# 2. Start production server
npm start

# Output:
# ✓ Ready on http://localhost:3000
```

---

### `npm run postinstall`

**Descrição:** Gera Prisma Client automaticamente após `npm install`

**Quando usar:** Automático (roda após instalação de dependências)

**Executado automaticamente em:**
- `npm install`
- `npm ci`
- Deploy na Vercel

```bash
# Equivalente a:
npx prisma generate
```

**⚠️ Importante:** Este script é essencial para deploy. Não remova!

---

## 🗄️ Database (Prisma)

### `npm run db:push`

**Descrição:** Aplica mudanças do schema Prisma ao banco de dados (sem migrations)

**Quando usar:**
- Desenvolvimento rápido (prototipagem)
- Schema changes durante desenvolvimento
- Sincronizar schema local com banco

**⚠️ Cuidado:** Pode causar perda de dados em produção!

```bash
npm run db:push

# Output:
# Prisma schema loaded from prisma/schema.prisma
# Datasource "db": PostgreSQL database
#
# 🚀 Your database is now in sync with your schema.
# ✔ Generated Prisma Client
```

**Alternativa para produção:** Use migrations (`prisma migrate`)

---

### `npm run db:studio`

**Descrição:** Abre Prisma Studio - GUI para visualizar e editar dados

**Quando usar:**
- Visualizar dados do banco
- Editar registros manualmente
- Debug de dados
- Testar queries

**Porta:** http://localhost:5555

```bash
npm run db:studio

# Output:
# Prisma Studio is up on http://localhost:5555
```

**Features do Prisma Studio:**
- Visualização de todas as tabelas
- Editor de registros
- Filtros e ordenação
- Suporte a relações
- Criação/edição/deleção de dados

---

### `npm run db:seed`

**Descrição:** Popula banco com dados de exemplo (seed data)

**Quando usar:**
- Setup inicial do banco
- Reset de dados de desenvolvimento
- Popular banco de testes
- Demonstrações

```bash
npm run db:seed

# Executa: tsx prisma/seed.ts

# Output esperado:
# 🌱 Seeding database...
# ✅ Created 5 users
# ✅ Created 10 categories
# ✅ Created 50 articles
# ✅ Database seeded successfully!
```

**Dados criados:**
- Usuários de teste (admin, editor, user)
- Categorias padrão
- Artigos de exemplo
- Tags
- Relações entre entidades

---

### `npm run db:validate`

**Descrição:** Valida schema Prisma (syntax e relações)

**Quando usar:**
- Antes de aplicar mudanças no schema
- Verificar integridade do schema
- Debug de erros de schema

```bash
npm run db:validate

# Output se válido:
# ✔ Prisma schema is valid

# Output se inválido:
# Error: Schema validation error
# --> prisma/schema.prisma:25
#    |
# 25 | model Article {
#    | ^^^^^^^^^^^^^^
# Field `authorId` references undefined model `Users`
```

---

## 🧪 Testes

### `npm test`

**Descrição:** Roda todos os testes unitários

**Quando usar:**
- Antes de fazer commit
- Desenvolvimento de features
- Verificação de qualidade

**Framework:** Jest + Testing Library

```bash
npm test

# Output esperado:
# PASS lib/services/__tests__/logger-service.test.ts
# PASS lib/services/__tests__/error-service.test.ts
# PASS lib/services/__tests__/validation-service.test.ts
# PASS lib/services/__tests__/article-service.test.ts
# PASS lib/di/__tests__/container.test.ts
#
# Test Suites: 5 passed, 5 total
# Tests:       167 passed, 167 total
# Snapshots:   0 total
# Time:        15.234s
```

---

### `npm test -- --watch`

**Descrição:** Roda testes em modo watch (re-executa ao mudar arquivos)

**Quando usar:**
- Desenvolvimento com TDD
- Refatoração contínua
- Debug de testes

```bash
npm test -- --watch

# Opções interativas:
# › Press f to run only failed tests.
# › Press o to only run tests related to changed files.
# › Press p to filter by a filename regex pattern.
# › Press t to filter by a test name regex pattern.
# › Press q to quit watch mode.
# › Press Enter to trigger a test run.
```

---

### `npm test -- --coverage`

**Descrição:** Roda testes e gera relatório de cobertura

**Quando usar:**
- Verificar coverage do código
- Identificar código não testado
- Antes de fazer PR

```bash
npm test -- --coverage

# Output:
# ------------------------|---------|----------|---------|---------|
# File                    | % Stmts | % Branch | % Funcs | % Lines |
# ------------------------|---------|----------|---------|---------|
# All files               |   98.87 |    95.45 |   98.33 |   98.91 |
#  services               |   98.95 |    96.15 |   98.46 |   99.02 |
#   article-service.ts    |   98.58 |    95.83 |   97.89 |   98.67 |
#   error-service.ts      |     100 |      100 |     100 |     100 |
#   logger-service.ts     |    98.3 |    94.73 |   97.72 |   98.41 |
#   validation-service.ts |   98.03 |    96.42 |   98.07 |   98.15 |
#  di                     |     100 |      100 |     100 |     100 |
#   container.ts          |     100 |      100 |     100 |     100 |
# ------------------------|---------|----------|---------|---------|
```

**Arquivos gerados:** `coverage/` directory (HTML report)

**Abrir HTML report:**
```bash
# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

---

### `npm test -- <path>`

**Descrição:** Roda teste de arquivo específico

**Quando usar:**
- Testar módulo específico
- Debug de teste único
- Desenvolvimento focado

```bash
# Teste de um service
npm test -- lib/services/__tests__/article-service.test.ts

# Teste de um helper
npm test -- lib/helpers/__tests__/auth-helpers.test.ts

# Teste de DI container
npm test -- lib/di/__tests__/container.test.ts
```

---

### `npm run test:ci`

**Descrição:** Roda testes em modo CI (coverage + max workers)

**Quando usar:**
- Pipelines de CI/CD
- Ambientes com recursos limitados
- Testes em paralelo controlado

```bash
npm run test:ci

# Equivalente a:
# jest --ci --coverage --maxWorkers=2
```

**Diferenças do modo normal:**
- `--ci`: Otimizações para CI (sem watch, sem interação)
- `--coverage`: Gera coverage report
- `--maxWorkers=2`: Limita paralelismo (economiza memória)

---

## 📊 Qualidade de Código

### `npm run lint`

**Descrição:** Roda ESLint para verificar problemas no código

**Quando usar:**
- Antes de fazer commit
- Verificação de code style
- Identificar problemas potenciais

```bash
npm run lint

# Output se tudo OK:
# ✔ No ESLint warnings or errors

# Output com erros:
# /lib/services/article-service.ts
#   45:7   error    'article' is assigned a value but never used    @typescript-eslint/no-unused-vars
#   89:12  warning  Missing return type on function                 @typescript-eslint/explicit-module-boundary-types
#
# ✖ 2 problems (1 error, 1 warning)
```

---

### `npm run lint:fix`

**Descrição:** Roda ESLint e corrige problemas automaticamente

**Quando usar:**
- Corrigir formatação automaticamente
- Aplicar code style
- Antes de commit

```bash
npm run lint:fix

# Corrige automaticamente:
# - Indentação
# - Quotes (single vs double)
# - Semicolons
# - Trailing commas
# - Whitespace
# - Import order
```

**⚠️ Nota:** Alguns problemas não podem ser corrigidos automaticamente (ex: variáveis não usadas)

---

### `npm run type-check`

**Descrição:** Verifica tipos TypeScript sem gerar arquivos

**Quando usar:**
- Validar tipos antes de build
- Identificar erros de tipo
- Antes de fazer PR

```bash
npm run type-check

# Equivalente a:
# tsc --noEmit

# Output se OK:
# (sem output = tudo certo)

# Output com erros:
# lib/services/article-service.ts:45:7 - error TS2322: Type 'string' is not assignable to type 'number'.
#
# 45   const count: number = 'invalid';
#          ~~~~~
#
# Found 1 error.
```

---

### `npm run check:schema`

**Descrição:** Verifica integridade do schema do banco (orphaned records, duplicates)

**Quando usar:**
- Manutenção do banco
- Identificar dados inconsistentes
- Antes de migrations importantes

```bash
npm run check:schema

# Executa: tsx scripts/quality/check-schema-integrity.ts

# Output:
# 🔍 Checking database integrity...
#
# ✅ No orphaned articles
# ✅ No duplicate slugs
# ✅ All foreign keys valid
# ⚠️  Found 3 articles without tags
#
# Summary:
# - Total checks: 12
# - Passed: 11
# - Warnings: 1
# - Errors: 0
```

---

### `npm run check:all`

**Descrição:** Roda TODAS as verificações de qualidade

**Quando usar:**
- Antes de fazer PR
- Verificação completa de qualidade
- CI/CD pipelines

```bash
npm run check:all

# Executa sequencialmente:
# 1. Type checking
# 2. ESLint
# 3. Prisma validation
# 4. Unit tests with coverage
# 5. Schema integrity check
# 6. Production build
```

**Duração:** ~3-5 minutos

**Output:**
```bash
🔍 Running all quality checks...

[1/6] Type checking...
✅ Type check passed

[2/6] ESLint...
✅ Lint passed

[3/6] Prisma validation...
✅ Schema valid

[4/6] Unit tests...
✅ 167 tests passed (98.87% coverage)

[5/6] Schema integrity...
✅ Database integrity OK

[6/6] Production build...
✅ Build successful

✅ All checks passed! Ready to merge.
```

---

### `npm run format`

**Descrição:** Formata código com Prettier

**Quando usar:**
- Padronizar formatação
- Antes de commit
- Reformatar código legado

```bash
npm run format

# Formata arquivos:
# **/*.ts
# **/*.tsx
# **/*.js
# **/*.jsx
# **/*.json
# **/*.md

# Output:
# lib/services/article-service.ts 245ms
# lib/helpers/auth-helpers.ts 89ms
# docs/README.md 112ms
# ...
# ✅ 42 files formatted
```

---

### `npm run format:check`

**Descrição:** Verifica se código está formatado (sem modificar)

**Quando usar:**
- CI/CD pipelines
- Pre-commit hooks
- Verificação antes de PR

```bash
npm run format:check

# Output se formatado:
# ✅ All files formatted correctly

# Output se não formatado:
# ❌ These files are not formatted:
# - lib/services/article-service.ts
# - components/ArticleCard.tsx
#
# Run 'npm run format' to fix.
```

---

## 🛠️ Utilitários

### `npm run watch`

**Descrição:** Observa mudanças em arquivos de artigos

**Quando usar:**
- Desenvolvimento de sistema de artigos
- Debug de mudanças em real-time

```bash
npm run watch

# Executa: node scripts/watch-articles.js

# Output:
# 📁 Watching for changes in prisma/articles...
#
# ✓ File changed: article-1.md
# ✓ Synced to database
```

---

## 📚 Fluxo Completo de Desenvolvimento

### Setup Inicial (primeira vez)

```bash
# 1. Instalar dependências
npm install

# 2. Setup database
npm run db:push
npm run db:seed

# 3. Verificar se tudo funciona
npm test
npm run dev
```

---

### Desenvolvimento Diário

```bash
# 1. Atualizar dependências
git pull
npm install

# 2. Iniciar servidor (terminal 1)
npm run dev

# 3. Rodar testes em watch (terminal 2 - opcional)
npm test -- --watch

# 4. Fazer mudanças...

# 5. Antes de commit
npm run lint:fix
npm run type-check
npm test

# 6. Commit
git add .
git commit -m "feat: Add new feature"
git push
```

---

### Antes de Pull Request

```bash
# Checklist completo
npm run check:all

# Se tudo passou:
git push
# Abrir PR no GitHub
```

---

### Build de Produção Local

```bash
# 1. Build
npm run build

# 2. Testar localmente
npm start

# 3. Abrir http://localhost:3000
```

---

### Reset Completo (troubleshooting)

```bash
# 1. Limpar dependências
rm -rf node_modules package-lock.json

# 2. Limpar build
rm -rf .next

# 3. Reinstalar
npm install

# 4. Reset database (CUIDADO: apaga dados!)
npm run db:push -- --force-reset
npm run db:seed

# 5. Rebuild
npm run build
```

---

## 🚀 Quick Reference Table

| Comando | Quando Usar | Duração |
|---------|-------------|---------|
| `npm run dev` | Desenvolvimento ativo | Contínuo |
| `npm run build` | Testar build, CI/CD | ~75s |
| `npm start` | Testar produção local | Contínuo |
| `npm test` | Verificar testes | ~15s |
| `npm test -- --watch` | Desenvolvimento TDD | Contínuo |
| `npm test -- --coverage` | Verificar coverage | ~20s |
| `npm run lint` | Verificar code style | ~5s |
| `npm run lint:fix` | Corrigir code style | ~8s |
| `npm run type-check` | Validar tipos | ~10s |
| `npm run db:push` | Aplicar schema | ~3s |
| `npm run db:studio` | Visualizar dados | Contínuo |
| `npm run db:seed` | Popular banco | ~5s |
| `npm run check:all` | Antes de PR | ~4min |
| `npm run format` | Formatar código | ~3s |

---

## 💡 Dicas e Truques

### Rodar múltiplos comandos em paralelo

```bash
# Usar & para executar em background
npm run dev & npm test -- --watch

# Ou use ferramentas como `concurrently`:
npx concurrently "npm run dev" "npm test -- --watch"
```

### Debug de testes

```bash
# Rodar com logs verbose
npm test -- --verbose

# Debug específico
node --inspect-brk node_modules/.bin/jest lib/services/__tests__/article-service.test.ts
```

### Limpar cache de testes

```bash
npm test -- --clearCache
```

### Ver quais scripts estão disponíveis

```bash
npm run
```

---

## 📖 Aliases Úteis (Bash/Zsh)

Adicione ao seu `~/.bashrc` ou `~/.zshrc`:

```bash
# Aliases para Token Milagre Platform
alias dev="npm run dev"
alias build="npm run build"
alias test="npm test"
alias lint="npm run lint:fix"
alias db="npm run db:studio"
alias check="npm run check:all"
```

Depois:
```bash
source ~/.bashrc  # ou ~/.zshrc
dev              # Em vez de npm run dev
check            # Em vez de npm run check:all
```

---

**Última Atualização:** 2025-11-19
**Referência:** `package.json`

*Dúvidas? Veja [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) para mais detalhes.*
