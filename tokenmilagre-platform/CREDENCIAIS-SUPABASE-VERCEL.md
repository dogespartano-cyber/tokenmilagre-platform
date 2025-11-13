# 🔐 Credenciais Exatas do Supabase para Vercel

**COPIE E COLE EXATAMENTE ESTAS VARIÁVEIS NA VERCEL**

---

## 📋 Variáveis para Adicionar

### 1. DATABASE_URL

**Name:**
```
DATABASE_URL
```

**Value (COPIE EXATO):**
```
postgres://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

**Environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

### 2. DIRECT_URL

**Name:**
```
DIRECT_URL
```

**Value (COPIE EXATO):**
```
postgres://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

**Environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

### 3. NEXTAUTH_URL

**Name:**
```
NEXTAUTH_URL
```

**Value:**
```
https://tokenmilagre.xyz
```

**Environment:**
- ✅ Production APENAS

---

### 4. NEXTAUTH_SECRET

**Name:**
```
NEXTAUTH_SECRET
```

**Value:**
```
OT4c86HG4UE3034dvFLXUADFFc2JCekvFhFiCbFzJMs=
```

**Environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🎯 Passo a Passo Visual

### 1. Abrir Environment Variables
```
https://vercel.com/dogespartano-cyber/tokenmilagre-platform/settings/environment-variables
```

### 2. Para Cada Variável Acima:

**a) Clicar em "Add New"**

**b) Preencher:**
- **Name**: (copiar name acima)
- **Value**: (copiar value COMPLETO acima)
- **Environments**: (marcar checkboxes conforme indicado)

**c) Clicar em "Save"**

### 3. Repetir para Todas as 4 Variáveis

---

## ✅ Checklist Final

Após adicionar, sua lista deve ter:

```
✅ DATABASE_URL (Production, Preview, Development)
✅ DIRECT_URL (Production, Preview, Development)
✅ NEXTAUTH_URL (Production)
✅ NEXTAUTH_SECRET (Production, Preview, Development)
✅ PERPLEXITY_API_KEY (...)
✅ GEMINI_API_KEY (...)
✅ ARTICLES_API_KEY (...)
✅ NEXT_PUBLIC_SOLANA_RPC_URL (...)
✅ NEXT_PUBLIC_SOLANA_NETWORK (...)
✅ NEXT_PUBLIC_TOKEN_ADDRESS (...)
```

**NÃO DEVE TER:**
- ❌ POSTGRES_URL (Neon - deletado)
- ❌ POSTGRES_PRISMA_URL (Neon - deletado)
- ❌ POSTGRES_URL_NON_POOLING (Neon - deletado)

---

## 🔄 Após Adicionar

**1. Fazer Redeploy:**
- Deployments → Latest → [...] → Redeploy

**2. Aguardar 3 minutos**

**3. Testar:**
```
https://tokenmilagre.xyz/api/debug-auth
```

**Deve retornar:**
```json
{
  "status": "ok",
  "database": "connected",
  "userCount": 2
}
```

**4. Testar Login:**
```
https://tokenmilagre.xyz/login
```
- Email: `admin@tokenmilagre.com`
- Senha: `admin123`

---

## 🆘 Se Ainda Falhar

### Erro: "endpoint could not be found"

**Causa**: URL do Supabase digitada errada ou incompleta

**Solução**:
- Deletar `DATABASE_URL` e `DIRECT_URL` na Vercel
- Re-adicionar copiando EXATAMENTE deste arquivo
- Garantir que não tem espaços no início/fim
- Garantir que copiou a URL COMPLETA (começa com `postgres://` e termina com `=true` ou `=require`)

### Erro: "authentication failed"

**Causa**: Senha do Supabase incorreta

**Solução**:
- Verificar se a senha na URL é `zk3FbnA9EErzDHmW`
- Copiar novamente as URLs deste arquivo

### Erro: "still using Neon"

**Causa**: Cache da Vercel ainda tem variáveis antigas

**Solução**:
1. Settings → Environment Variables
2. Procurar TODAS que começam com `POSTGRES_` (sem SUPABASE_)
3. Deletar TODAS elas
4. Adicionar DATABASE_URL e DIRECT_URL novamente
5. Redeploy

---

**IMPORTANTE**: Copie as URLs COMPLETAS, sem quebrar em múltiplas linhas!

---

**Criado**: 2025-11-12
**Testado localmente**: ✅ Funcionando
**Aguardando**: Configuração na Vercel
