# ⚡ Configuração Rápida Vercel - Migração Neon→Supabase

## 🎯 Objetivo
Executar a migração de dados do Neon para Supabase via Vercel.

## 📋 Checklist Rápido

### 1️⃣ Preparação (5 min)

- [ ] Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Selecione seu projeto `tokenmilagre-platform`
- [ ] Vá em **Settings** → **Environment Variables**

### 2️⃣ Configurar Variáveis de Ambiente (5 min)

Adicione as seguintes variáveis:

| Nome da Variável | Valor | Ambiente |
|------------------|-------|----------|
| `POSTGRES_PRISMA_URL` | `postgresql://...` (Neon) | Production |
| `SUPABASE_POSTGRES_PRISMA_URL` | `postgresql://...` (Supabase) | Production |
| `MIGRATION_SECRET` | `[CRIE UMA SENHA FORTE]` | Production |

**Como obter as URLs:**

**Neon (POSTGRES_PRISMA_URL):**
1. Acesse [Neon Console](https://console.neon.tech/)
2. Selecione seu projeto
3. Copie a **Connection String** (formato Prisma)

**Supabase (SUPABASE_POSTGRES_PRISMA_URL):**
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **Database**
4. Copie a **Connection string** no formato: `postgresql://postgres.xxx:password@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`
5. **IMPORTANTE**: Adicione `?pgbouncer=true&connection_limit=1` no final da URL

**Formato final da URL Supabase:**
```
postgresql://postgres.xxx:password@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**MIGRATION_SECRET:**
- Use um gerador de senhas ou comando: `openssl rand -base64 32`
- Guarde essa senha, você vai precisar dela nas URLs!

### 3️⃣ Deploy do Branch (2 min)

```bash
# Certifique-se de que está no branch correto
git branch

# Se não estiver, mude para o branch
git checkout claude/leia-ski-011CV1G7eKfAiV1Ut2D6b7R1

# Faça push (já deve estar feito)
git push -u origin claude/leia-ski-011CV1G7eKfAiV1Ut2D6b7R1
```

**No Vercel:**
1. Vá em **Deployments**
2. Aguarde o deploy automático do branch
3. Quando concluído, copie a URL do deploy (ex: `https://tokenmilagre-platform-xxx.vercel.app`)

### 4️⃣ Executar Migração (10-15 min)

**Passo 1: Testar Conexão**
```bash
# Substitua [URL_DO_DEPLOY] e [SUA_SENHA]
curl "https://[URL_DO_DEPLOY]/api/setup-supabase-schema?secret=[SUA_SENHA]"

# Resposta esperada:
# {"status":"SUCCESS","message":"Supabase conectado com sucesso!"}
```

**Passo 2: Executar Migração**
```bash
# ATENÇÃO: Este processo pode demorar 2-5 minutos!
curl "https://[URL_DO_DEPLOY]/api/migrate-database?secret=[SUA_SENHA]"

# Resposta esperada: JSON com relatório completo
```

**Passo 3: Validar Migração**
```bash
curl "https://[URL_DO_DEPLOY]/api/validate-migration?secret=[SUA_SENHA]"

# Resposta esperada:
# {"status":"SUCCESS","summary":{"tablesMatching":14,"tablesMismatch":0}}
```

### 5️⃣ Testar Aplicação (5 min)

- [ ] Acesse sua aplicação no Vercel
- [ ] Teste login/logout (autenticação)
- [ ] Acesse `/noticias` (artigos)
- [ ] Acesse `/recursos` (recursos)
- [ ] Verifique se tudo funciona normalmente

### 6️⃣ Finalizar (5 min)

**Se tudo funcionou:**

1. **Atualizar DATABASE_URL** no Vercel:
   - Vá em **Environment Variables**
   - Mude `DATABASE_URL` para usar o valor de `SUPABASE_POSTGRES_PRISMA_URL`
   - Ou simplesmente delete `POSTGRES_PRISMA_URL`

2. **Limpar rotas temporárias:**
   ```bash
   ./scripts/cleanup-migration.sh
   ```

3. **Commit e push:**
   ```bash
   git add .
   git commit -m "chore: remover rotas temporárias de migração"
   git push
   ```

4. **Aguardar deploy final** no Vercel

## 🐛 Troubleshooting Rápido

### Erro 401: Unauthorized
- Verifique se `MIGRATION_SECRET` está configurada no Vercel
- Confira se está usando a senha correta na URL

### Erro 500: Database connection
- Verifique se as URLs dos bancos estão corretas
- Teste a conexão diretamente com `psql` ou client PostgreSQL
- Confirme que adicionou `?pgbouncer=true&connection_limit=1` na URL do Supabase

### Erro 504: Timeout
- A migração pode demorar mais de 5 minutos
- Considere executar em horário de baixo tráfego
- Se necessário, aumente `maxDuration` no código (requer Vercel Pro)

### Tabelas não batem na validação
- Execute a migração novamente (ela ignora duplicatas)
- Verifique os logs no Vercel para identificar erros específicos

## 📞 URLs Úteis

- **Neon Console**: https://console.neon.tech/
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentação completa**: Ver `MIGRATION.md`

## ⏱️ Tempo Total Estimado

- Configuração: **10-15 minutos**
- Migração: **5-10 minutos**
- Validação e testes: **5-10 minutos**
- **TOTAL: 20-35 minutos**

---

🎉 **Após concluir, sua aplicação estará 100% rodando no Supabase!**
