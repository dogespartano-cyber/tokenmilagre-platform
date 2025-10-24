---
name: database-setup
description: Use this skill when working with database, Prisma ORM, PostgreSQL, Server Components, deployment issues, or build configuration. Contains critical rules for data access, migrations, and Vercel builds.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# Database Setup Skill

This skill provides all information about database configuration, Prisma usage, Next.js Server Components, and deployment setup for the Token Milagre Platform.

---

## 🗄️ Banco de Dados e Infraestrutura

### Configuração Atual

**Banco de Dados**: Neon PostgreSQL (Vercel Marketplace)
**ORM**: Prisma
**Localização do Client**: `lib/generated/prisma`
**Total de Usuários**: 2 (Admin + Editor)

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

**Produção (Vercel)** - Configuradas automaticamente pela integração Neon:
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
