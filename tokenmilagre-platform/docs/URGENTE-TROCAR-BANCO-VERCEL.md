# 🚨 URGENTE: Trocar Banco Neon → Supabase na Vercel

**PROBLEMA CRÍTICO**: Vercel está usando Neon (cota excedida) em vez de Supabase

**ERRO**: `Your project has exceeded the data transfer quota`

---

## 🎯 SOLUÇÃO (5 minutos)

### Passo 1: Remover Integração Neon

1. **Ir em Vercel**:
   ```
   https://vercel.com/dogespartano-cyber/tokenmilagre-platform/settings/integrations
   ```

2. **Procurar "Neon"**

3. **Clicar em "Configure" ou "..." → "Remove"**

4. **Confirmar remoção**

Isso vai **deletar automaticamente** todas as variáveis do Neon:
- ❌ `POSTGRES_URL` (Neon)
- ❌ `POSTGRES_PRISMA_URL` (Neon)
- ❌ `POSTGRES_URL_NON_POOLING` (Neon)
- ❌ Outras variáveis do Neon

---

### Passo 2: Garantir Variáveis Supabase

**Ir em**:
```
https://vercel.com/dogespartano-cyber/tokenmilagre-platform/settings/environment-variables
```

**CONFIRMAR que existem (via integração Supabase)**:
- ✅ `SUPABASE_POSTGRES_URL`
- ✅ `SUPABASE_POSTGRES_PRISMA_URL`
- ✅ `SUPABASE_POSTGRES_URL_NON_POOLING`

**Se não existem → Reconectar integração Supabase**:
1. Settings → Integrations
2. Browse Marketplace → Supabase
3. Add Integration → Conectar projeto

---

### Passo 3: Adicionar Variáveis Manuais

**CRÍTICO**: O Prisma usa `DATABASE_URL` e `DIRECT_URL`, mas as integrações criam nomes diferentes.

**Adicionar manualmente**:

```
Name: DATABASE_URL
Value: [COPIAR de SUPABASE_POSTGRES_PRISMA_URL]
Environment: Production, Preview, Development

Name: DIRECT_URL
Value: [COPIAR de SUPABASE_POSTGRES_URL_NON_POOLING]
Environment: Production, Preview, Development
```

**Valores corretos (baseado na migração local)**:
```
DATABASE_URL="postgres://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"

DIRECT_URL="postgres://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

---

### Passo 4: Adicionar NEXTAUTH_URL

```
Name: NEXTAUTH_URL
Value: https://tokenmilagre.xyz
Environment: Production APENAS
```

---

### Passo 5: Verificar NEXTAUTH_SECRET

Confirmar que existe:
```
Name: NEXTAUTH_SECRET
Value: OT4c86HG4UE3034dvFLXUADFFc2JCekvFhFiCbFzJMs=
Environment: Production, Preview, Development
```

---

## ✅ Checklist Final de Variáveis

**Banco de Dados (Supabase)**:
- ✅ `DATABASE_URL` → Supabase PRISMA URL
- ✅ `DIRECT_URL` → Supabase NON_POOLING URL
- ✅ `SUPABASE_POSTGRES_*` → Integração (opcional)
- ❌ `POSTGRES_URL` → REMOVER (Neon)
- ❌ `POSTGRES_PRISMA_URL` → REMOVER (Neon)

**NextAuth**:
- ✅ `NEXTAUTH_SECRET` → (gerado)
- ✅ `NEXTAUTH_URL` → https://tokenmilagre.xyz (Production)

**APIs Externas**:
- ✅ `PERPLEXITY_API_KEY`
- ✅ `GEMINI_API_KEY`
- ✅ `ARTICLES_API_KEY`

**Solana (públicas)**:
- ✅ `NEXT_PUBLIC_SOLANA_RPC_URL`
- ✅ `NEXT_PUBLIC_SOLANA_NETWORK`
- ✅ `NEXT_PUBLIC_TOKEN_ADDRESS`

---

## 🔄 Passo 6: Forçar Redeploy

Após configurar as variáveis:

**Opção A - Via Dashboard**:
- Deployments → Latest → [...] → Redeploy

**Opção B - Via Git (commit vazio)**:
```bash
git commit --allow-empty -m "chore: Force redeploy with Supabase"
git push origin main
```

---

## 🧪 Passo 7: Validar

Aguardar deploy (~3min) e testar:

**1. Status do banco**:
```
https://tokenmilagre.xyz/api/debug-auth
```

Deve retornar:
```json
{
  "status": "ok",
  "database": "connected",
  "userCount": 2
}
```

**2. Login**:
```
https://tokenmilagre.xyz/login
```
- Email: `admin@tokenmilagre.com`
- Senha: `admin123`

---

## 🆘 Se Ainda Falhar

### Erro: "No Supabase integration"

**Causa**: Integração Supabase não está conectada

**Solução**:
1. Settings → Integrations
2. Browse Marketplace → Supabase
3. Add → Selecionar projeto Supabase
4. Authorize

### Erro: "Still using Neon"

**Causa**: Variáveis `DATABASE_URL` e `DIRECT_URL` não foram sobrescritas

**Solução**:
1. Deletar `DATABASE_URL` existente
2. Deletar `DIRECT_URL` existente
3. Recriar com valores do Supabase
4. Redeploy

### Erro: "Cannot connect to database"

**Causa**: URL do Supabase incorreta

**Solução**: Copiar exatamente da integração Supabase:
- `SUPABASE_POSTGRES_PRISMA_URL` → `DATABASE_URL`
- `SUPABASE_POSTGRES_URL_NON_POOLING` → `DIRECT_URL`

---

## 📸 Screenshot do Estado Correto

**Environment Variables deve ter**:

```
DATABASE_URL (Production, Preview, Development)
  postgres://postgres.zuolipvqfwznzqqqcobw:...@...supabase.com:6543/...

DIRECT_URL (Production, Preview, Development)
  postgres://postgres.zuolipvqfwznzqqqcobw:...@...supabase.com:5432/...

NEXTAUTH_SECRET (Production, Preview, Development)
  OT4c86HG4UE3034dvFLXUADFFc2JCekvFhFiCbFzJMs=

NEXTAUTH_URL (Production)
  https://tokenmilagre.xyz
```

**Integrações ativas**:
- ✅ Supabase
- ❌ Neon (DEVE ESTAR REMOVIDO)

---

**IMPORTANTE**: Após remover Neon, aguardar 1-2 minutos antes de fazer redeploy para garantir que as variáveis foram removidas do cache.

---

**Criado em**: 2025-11-12
**Prioridade**: 🔴 CRÍTICA
