# ⚠️ URGENTE: Configurar NextAuth na Vercel

**Problema**: Login não funciona em produção porque `NEXTAUTH_SECRET` não está configurado.

---

## 🔧 Solução Rápida (2 minutos)

### 1. Ir nas Variáveis de Ambiente da Vercel

1. Abrir [Vercel Dashboard](https://vercel.com/dogespartano-cyber/tokenmilagre-platform)
2. Clicar em **Settings** → **Environment Variables**

### 2. Adicionar NEXTAUTH_SECRET

**Clicar em "Add New":**

```
Name: NEXTAUTH_SECRET
Value: OT4c86HG4UE3034dvFLXUADFFc2JCekvFhFiCbFzJMs=
Environment: Production, Preview, Development (marcar todos)
```

### 3. Adicionar NEXTAUTH_URL (Opcional - Vercel detecta auto)

**Se quiser garantir, adicionar:**

```
Name: NEXTAUTH_URL
Value: https://tokenmilagre-platform.vercel.app
Environment: Production
```

**Para Preview:**
```
Name: NEXTAUTH_URL
Value: (deixar vazio - Vercel detecta automaticamente)
Environment: Preview, Development
```

### 4. Fazer Redeploy

**Opção A - Automático (recomendado):**
- Vercel vai detectar mudança de variáveis e pedir redeploy
- Clicar em "Redeploy" no banner que aparecer

**Opção B - Manual:**
```bash
# No seu terminal local
git commit --allow-empty -m "chore: Trigger redeploy for NEXTAUTH_SECRET"
git push origin main
```

### 5. Aguardar Deploy (2-3 minutos)

Acessar: https://tokenmilagre-platform.vercel.app/login

**Credenciais:**
- Email: `admin@tokenmilagre.com`
- Senha: `admin123`

---

## ✅ Checklist de Variáveis na Vercel

Certifique-se que **TODAS** estas variáveis estão configuradas:

### Banco de Dados (Supabase Integration - já configurado)
- ✅ `SUPABASE_POSTGRES_URL`
- ✅ `SUPABASE_POSTGRES_PRISMA_URL`
- ✅ `SUPABASE_POSTGRES_URL_NON_POOLING`
- ✅ `SUPABASE_POSTGRES_PASSWORD`
- ✅ `SUPABASE_POSTGRES_USER`
- ✅ `SUPABASE_POSTGRES_DATABASE`
- ✅ `SUPABASE_POSTGRES_HOST`

### NextAuth (CRÍTICO - adicionar manualmente)
- ❌ `NEXTAUTH_SECRET` → **ADICIONAR AGORA**
- ⚠️ `NEXTAUTH_URL` → Opcional (Vercel detecta auto)

### APIs Externas (já devem estar configuradas)
- `PERPLEXITY_API_KEY`
- `GEMINI_API_KEY`
- `ARTICLES_API_KEY`

### Solana (públicas - já devem estar)
- `NEXT_PUBLIC_SOLANA_RPC_URL`
- `NEXT_PUBLIC_SOLANA_NETWORK`
- `NEXT_PUBLIC_TOKEN_ADDRESS`

---

## 🚨 NEXTAUTH_SECRET - Detalhes Importantes

### O Que É?
- Secret usada para encriptar tokens JWT e cookies de sessão
- **CRÍTICA** para segurança da autenticação

### Por Que Estava Faltando?
- Não estava no `.env` commitado (correto - não deve ser versionado)
- Precisa ser configurada manualmente na Vercel

### Como Gerar Nova (se necessário)?
```bash
openssl rand -base64 32
```

### Nunca Compartilhar
- ❌ Não commitar no Git
- ❌ Não expor publicamente
- ✅ Apenas na Vercel Environment Variables

---

## 🔍 Como Verificar se Funcionou

### 1. Ver Deploy Logs
```
Vercel Dashboard → Deployments → Latest → Logs
```

Procurar por:
- ✅ "Build succeeded"
- ✅ Sem erros de "NEXTAUTH_SECRET"

### 2. Testar Login
1. Abrir https://tokenmilagre-platform.vercel.app/login
2. Email: `admin@tokenmilagre.com`
3. Senha: `admin123`
4. Clicar em "Login"

**Esperado:**
- ✅ Redirect para `/dashboard`
- ✅ Ver nome "Admin" no header
- ✅ Conseguir acessar todas páginas do dashboard

---

## ❓ Troubleshooting

### Erro: "Configuration error"
**Causa**: NEXTAUTH_SECRET ainda não foi carregada
**Solução**: Aguardar redeploy completo (~2min)

### Erro: "Invalid credentials"
**Causa**: Usuários não existem no banco
**Solução**:
```bash
npx tsx scripts/seed-production.ts
```

### Login funciona mas desloga automaticamente
**Causa**: NEXTAUTH_SECRET diferente entre deploys
**Solução**: Garantir que secret é a MESMA em todos ambientes

---

## 📋 Script para Validar Tudo

Depois de configurar, rode:

```bash
npx tsx scripts/check-production-users.ts
```

Vai mostrar:
- ✅ Usuários no banco
- ✅ Hashes de senha válidos
- ✅ Conexão funcionando

---

**Criado em**: 2025-11-12
**Última atualização**: 2025-11-12

**NEXTAUTH_SECRET gerada**: `OT4c86HG4UE3034dvFLXUADFFc2JCekvFhFiCbFzJMs=`
