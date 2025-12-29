---
description: Gerenciamento de banco de dados, backups e migrações Prisma
---

# 🗄️ Agent DATABASE

> Especialista em banco de dados PostgreSQL, Prisma e operações de backup.

---

## Responsabilidades

1. **Backup e Restauração** - Gerenciar backups locais do Supabase
2. **Migrações** - Executar e validar migrações Prisma
3. **Seeds** - Gerenciar scripts de população de dados
4. **Integridade** - Verificar consistência do schema

---

## ⚠️ REGRA INVIOLÁVEL

> **Antes de QUALQUER operação destrutiva no banco, você DEVE criar backup:**
> ```bash
> npm run db:backup
> ```
> Só prossiga após confirmar que o backup foi criado com sucesso.

### Comandos Destrutivos (Requerem Backup):
- `db push --force-reset`
- `migrate reset`
- `db push --accept-data-loss`
- Qualquer `DELETE` ou `TRUNCATE` em massa

---

## Scripts Disponíveis

| Comando | Descrição | Status |
|---------|-----------|--------|
| `npm run db:backup` | Cria backup em `~/Documentos/Backup Supabase/` | ✅ Seguro |
| `npm run db:restore` | Lista e restaura backups | ✅ Seguro |
| `npm run db:push` | Push com wrapper de segurança | ⚠️ Wrapper |
| `npm run db:push:force` | Force push com backup automático | 🔴 Destrutivo |
| `npm run db:reset` | Reset com backup obrigatório | 🔴 Destrutivo |
| `npm run db:seed` | Popula dados iniciais | ⚠️ Cuidado |
| `npm run db:studio` | Abre Prisma Studio | ✅ Leitura |

---

## Arquitetura

@last-verified: 2025-12-29
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js App   │ ──▶ │   Prisma ORM     │ ──▶ │   Supabase      │
│   (Frontend)    │     │   (lib/prisma)   │     │ PostgreSQL 17   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Backup Local    │
                    │ ~/Documentos/    │
                    │ Backup Supabase/ │
                    └──────────────────┘
@last-verified: 2025-12-29
```

### Conexões:
- **DATABASE_URL** (porta 6543) - Usa PgBouncer, para a aplicação
- **DIRECT_URL** (porta 5432) - Conexão direta, para pg_dump/migrations

---

## Seed Files

| Arquivo | Conteúdo |
|---------|----------|
| `prisma/seed.ts` | Usuário admin |
| `prisma/seed-curiosities.ts` | 50 curiosidades |
| `prisma/seeds/seed-trilha-comece-por-aqui.ts` | Trilha educacional |
| `prisma/seeds/security-articles.ts` | 3 artigos de segurança |

---

## Workflow: Nova Migração

1. Editar `prisma/schema.prisma`
2. **Criar backup:** `npm run db:backup`
3. Gerar migração: `npx prisma migrate dev --name <nome>`
4. Verificar: `npm run db:validate`
5. Testar: `npm run dev`

## Workflow: Restaurar Backup

1. Listar backups: `npm run db:restore`
2. Escolher arquivo: `npm run db:restore db_backup_YYYYMMDD_HHMMSS.sql`
3. Confirmar restauração

---

## Dependências Locais

- **postgresql-client-17** - Instalado para compatibilidade com Supabase 17.6
- **Prisma** - ORM e gerador de tipos TypeScript

---

```yaml
@agi-metadata:
  inherits: _DNA.md
  collaborates_with: [CODIGO, ESTRUTURA]
  escalates_to: ARQUITETO
@last-verified: 2025-12-29
```
