---
name: database-setup
description: Use this skill when working with database, Prisma ORM, PostgreSQL, Server Components, deployment issues, or build configuration. Contains critical rules for data access, migrations, and Vercel builds.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# Database Setup Skill

This skill provides all information about database configuration, Prisma usage, Next.js Server Components, and deployment setup for the Token Milagre Platform.

---

## 🗄️ Banco de Dados e Infraestrutura

### Configuração Atual (ATUALIZADA 2025-11-12)

**Banco de Dados**: ✅ **Supabase PostgreSQL** (migrado do Neon em 2025-11-12)
**ORM**: Prisma
**Localização do Client**: `lib/generated/prisma` (caminho customizado)
**Total de Usuários**: 2 (Admin + Editor)
**Domínio**: https://tokenmilagre.xyz (domínio customizado)

### ⚠️ REGRAS CRÍTICAS - Banco de Dados

1. **SEMPRE usar Prisma diretamente em Server Components**
   - ❌ ERRADO: `fetch('http://localhost:3000/api/articles')`
   - ✅ CORRETO: `await prisma.article.findMany()`
   - Não fazer fetch HTTP em Server Components
   - Acesso direto ao banco é mais rápido e confiável

2. **Caminho CORRETO do Prisma Client**
   ```typescript
   // ✅ CORRETO - Este projeto usa caminho customizado
   import { prisma } from '@/lib/prisma';

   // OU em scripts Node.js:
   const { PrismaClient } = require('../lib/generated/prisma');

   // ❌ ERRADO - Não usar caminho padrão
   import { PrismaClient } from '@prisma/client';
   ```

3. **Script postinstall OBRIGATÓRIO**
   - Sempre manter `"postinstall": "prisma generate"` no package.json
   - Garante geração do Prisma Client no build do Vercel
   - Sem isso, build falha com "Module not found: Can't resolve './generated/prisma'"

### Variáveis de Ambiente

**Produção (Vercel)** - Configuradas via Vercel CLI ou integração Supabase:
```env
DATABASE_URL=postgresql://... (com pooling)
DIRECT_URL=postgresql://... (sem pooling, para migrations)
```

**Desenvolvimento Local** - Copiar do Vercel Settings → Environment Variables:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

### Scripts de Banco de Dados

```bash
# Gerar Prisma Client
npx prisma generate

# Aplicar mudanças no schema (development)
npx prisma db push

# Abrir Prisma Studio (visualizar dados)
npm run db:studio

# Exportar dados do SQLite (backup)
npm run db:export

# Importar dados para PostgreSQL
npm run db:import
```

### Migração SQLite → PostgreSQL

**✅ Concluída em 2025-10-19**

- Banco anterior: SQLite (`prisma/dev.db`)
- Banco atual: Neon PostgreSQL
- Backup mantido: `prisma/backup-sqlite.json` (gitignored)
- Documentação completa: `MIGRACAO-POSTGRES.md`

**NUNCA usar SQLite em produção no Vercel** - ambiente serverless não mantém arquivos.

---

## ⚛️ Next.js e Server Components

### Boas Práticas

1. **Server Components (RSC) - Buscar Dados**
   ```typescript
   // ✅ CORRETO - Buscar direto do Prisma
   import { prisma } from '@/lib/prisma';

   async function getArticle(slug: string) {
     return await prisma.article.findUnique({
       where: { slug }
     });
   }

   // ❌ ERRADO - Fazer fetch HTTP em Server Component
   async function getArticle(slug: string) {
     const res = await fetch('http://localhost:3000/api/articles/' + slug);
     return await res.json();
   }
   ```

2. **Por que evitar fetch HTTP em Server Components?**
   - Requer variáveis de ambiente (`NEXT_PUBLIC_API_URL`, `VERCEL_URL`)
   - Adiciona overhead de HTTP (serialização, rede, desserialização)
   - Propenso a erros em diferentes ambientes
   - Mais lento que acesso direto ao banco

3. **Quando usar API Routes (/api/...)?**
   - ✅ Endpoints públicos (webhooks, integrações externas)
   - ✅ Client Components fazendo mutações
   - ✅ Scripts externos (CLI, watchers)
   - ❌ Server Components buscando dados do banco

### ESLint Configuration

**NUNCA tentar verificar arquivos gerados do Prisma**

- Arquivos em `lib/generated/prisma/` são gerados automaticamente
- Configurar `next.config.ts` com `ignoreDuringBuilds: true`
- Linting deve ser feito localmente, não no build do Vercel
- Prisma Client sempre usa sintaxe CommonJS (require)

### Build no Vercel

**Checklist para build bem-sucedido:**

- [ ] Script `postinstall` presente no package.json
- [ ] `next.config.ts` com `eslint.ignoreDuringBuilds: true`
- [ ] `prisma/schema.prisma` apontando para PostgreSQL
- [ ] Variáveis `DATABASE_URL` e `DIRECT_URL` configuradas no Vercel
- [ ] Integração Neon conectada ao projeto

---

## 🚫 O Que Evitar - Banco de Dados e Código

1. **Fetch HTTP em Server Components**: Usar Prisma diretamente
2. **SQLite em produção**: Vercel não suporta bancos baseados em arquivo
3. **Caminho padrão do Prisma**: Sempre usar `../lib/generated/prisma`
4. **Build sem postinstall**: Prisma Client não será gerado
5. **Lint de arquivos gerados**: Configurar ignoreDuringBuilds no ESLint

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-10-24

---

## 🔄 Migração Neon → Supabase (2025-11-12)

### Contexto da Migração

**Problema**: Neon atingiu cota de transferência do plano gratuito
**Erro**: `Your project has exceeded the data transfer quota`
**Solução**: Migração completa para Supabase PostgreSQL

### Estado Pós-Migração

- ✅ 14 tabelas criadas no Supabase
- ✅ 2 usuários criados (Admin + Editor)
- ✅ Schema aplicado com sucesso
- ✅ Conexão validada
- ⚠️ Dados do Neon NÃO foram migrados (cota bloqueou acesso)

### Configuração de Variáveis via Vercel CLI (MÉTODO RECOMENDADO)

**Por que usar CLI:**
- ✅ Muito mais rápido que dashboard manual
- ✅ Menos propenso a erros (copy-paste exato)
- ✅ Pode ser automatizado
- ✅ Útil quando usuário está cansado

**Passo a passo:**

```bash
# 1. Login (apenas primeira vez)
vercel login

# 2. Linkar projeto
vercel link --yes

# 3. Adicionar variáveis (exemplo Supabase)
echo "postgres://postgres.PROJECT:PASSWORD@...supabase.com:6543/postgres?sslmode=require&pgbouncer=true" | vercel env add DATABASE_URL production
echo "postgres://postgres.PROJECT:PASSWORD@...supabase.com:6543/postgres?sslmode=require&pgbouncer=true" | vercel env add DATABASE_URL preview
echo "postgres://postgres.PROJECT:PASSWORD@...supabase.com:6543/postgres?sslmode=require&pgbouncer=true" | vercel env add DATABASE_URL development

echo "postgres://postgres.PROJECT:PASSWORD@...supabase.com:5432/postgres?sslmode=require" | vercel env add DIRECT_URL production
echo "postgres://postgres.PROJECT:PASSWORD@...supabase.com:5432/postgres?sslmode=require" | vercel env add DIRECT_URL preview
echo "postgres://postgres.PROJECT:PASSWORD@...supabase.com:5432/postgres?sslmode=require" | vercel env add DIRECT_URL development

# 4. Forçar redeploy
git commit --allow-empty -m "chore: Trigger redeploy"
git push origin main
```

### ⚠️ IMPORTANTE: Integrações vs Variáveis Manuais

**Problema comum:**
- Integrações Vercel (Neon, Supabase) criam variáveis com prefixos: `SUPABASE_POSTGRES_*`, `POSTGRES_*`
- Prisma usa: `DATABASE_URL` e `DIRECT_URL`
- **Você DEVE criar manualmente** `DATABASE_URL` e `DIRECT_URL` mesmo tendo a integração

**Solução:**
1. Manter integração Supabase (cria variáveis auxiliares)
2. ADICIONAR manualmente `DATABASE_URL` e `DIRECT_URL` copiando valores da integração
3. Remover integração antiga (Neon) se existir

---

## 🔐 NextAuth com Domínio Customizado

### Problema: Login falha com 401 no domínio customizado

**Sintoma:**
- Login funciona em `*.vercel.app`
- Login falha (401) em domínio customizado (ex: `tokenmilagre.xyz`)
- Erro: `api/auth/callback/credentials:1 Failed to load resource: 401`

**Causa:**
NextAuth precisa de `NEXTAUTH_URL` explícito quando há domínio customizado.

**Solução:**
```bash
# Via Vercel CLI
echo "https://tokenmilagre.xyz" | vercel env add NEXTAUTH_URL production

# Não adicionar para preview/development (Vercel auto-detect)
```

**Configuração correta:**
```
NEXTAUTH_URL (Production apenas): https://tokenmilagre.xyz
NEXTAUTH_SECRET (Todos): [gerado com openssl rand -base64 32]
```

---

## 🐛 Troubleshooting: Problemas Comuns de Build

### Erro: "Namespace 'Prisma' has no exported member 'ArticleWhereInput'"

**Causa:** Imports usando `@prisma/client` em vez do caminho customizado

**Arquivos que devem usar caminho customizado:**
- `app/api/articles/route.ts`
- `lib/copilot/admin-tools.ts`
- `lib/copilot/tools.ts`

**Correção:**
```typescript
// ❌ ERRADO
import { Prisma } from '@prisma/client';

// ✅ CORRETO
import { Prisma } from '@/lib/generated/prisma';
```

**Buscar outros casos:**
```bash
grep -r "from '@prisma/client'" app/ lib/ --include="*.ts" --include="*.tsx"
```

---

## 🧪 Scripts de Debug Criados

Durante a migração, foram criados scripts úteis para diagnóstico:

### 1. `scripts/check-users.ts`
Verifica usuários no banco (produção ou local)

```bash
npx tsx scripts/check-users.ts
```

**Output:**
- Lista todos usuários
- Mostra email, role, ID
- Prefixo do hash da senha

### 2. `scripts/test-login.ts`
Testa autenticação localmente

```bash
npx tsx scripts/test-login.ts
```

**Valida:**
- Usuário existe
- Senha bcrypt funciona
- Recria usuário se hash estiver errado

### 3. `scripts/debug-production-login.ts`
Testa login EXATAMENTE como produção

```bash
npx tsx scripts/debug-production-login.ts
```

**Conecta em:**
- Supabase de produção (mesma URL que Vercel)
- Testa fluxo completo de autenticação
- Mostra tempo de bcrypt.compare()

### 4. `scripts/seed-production.ts`
Cria usuários admin/editor direto na produção

```bash
npx tsx scripts/seed-production.ts
```

**Cria:**
- admin@tokenmilagre.com / admin123 (ADMIN)
- editor@tokenmilagre.com / editor123 (EDITOR)

### 5. `app/api/debug-auth/route.ts`
Endpoint HTTP para debug remoto

**GET:** Status geral
```
https://tokenmilagre.xyz/api/debug-auth
```

**POST:** Testar login
```bash
curl -X POST https://tokenmilagre.xyz/api/debug-auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tokenmilagre.com","password":"admin123"}'
```

**⚠️ REMOVER antes de produção final** (expõe informações sensíveis)

---

## 📝 Documentação Criada

- `docs/MIGRACAO-SUPABASE.md` - Documentação completa da migração
- `docs/URGENTE-TROCAR-BANCO-VERCEL.md` - Guia de troubleshooting
- `docs/CONFIGURAR-VERCEL-NEXTAUTH.md` - Configuração NextAuth
- `CREDENCIAIS-SUPABASE-VERCEL.md` - Variáveis prontas para copy-paste

---

## 🎓 Lições Aprendidas

### 1. Sempre oferecer automação primeiro
Quando usuário diz "estou cansado" ou similar:
- ✅ Oferecer Vercel CLI imediatamente
- ✅ Perguntar se quer fazer manual ou automático
- ❌ Não assumir que usuário quer fazer manual

### 2. Vercel CLI é mais confiável
- Menos erros de digitação
- Mais rápido (5 minutos vs 20+ minutos)
- Pode ser scriptado

### 3. Domínios customizados precisam configuração extra
- `NEXTAUTH_URL` obrigatório
- Sempre testar em produção após configurar

### 4. Integrações != Variáveis prontas
- Integrações criam variáveis com prefixos
- Sempre verificar se Prisma usa os nomes corretos
- Criar manualmente se necessário

---

**Última atualização**: 2025-11-12 (Migração Neon → Supabase)
**Criado por**: Claude Code
