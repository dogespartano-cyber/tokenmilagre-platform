# ⚡ MIGRAÇÃO RÁPIDA - Execute AGORA!

## 🚀 Executar Migração Imediatamente

### Opção 1: Linha de Comando Direta (1 comando)

```bash
POSTGRES_PRISMA_URL="postgresql://USER:PASS@HOST/DB" \
SUPABASE_POSTGRES_PRISMA_URL="postgresql://USER:PASS@HOST/DB" \
node scripts/migrate-now.js
```

**Substitua:**
- `POSTGRES_PRISMA_URL`: URL do Neon (origem)
- `SUPABASE_POSTGRES_PRISMA_URL`: URL do Supabase (destino)

### Opção 2: Exportar Variáveis (2 comandos)

```bash
# 1. Configure as URLs
export POSTGRES_PRISMA_URL="postgresql://..."
export SUPABASE_POSTGRES_PRISMA_URL="postgresql://..."

# 2. Execute a migração
node scripts/migrate-now.js
```

### Opção 3: Arquivo .env (criar arquivo)

```bash
# 1. Crie um arquivo .env.migration
cat > .env.migration <<'EOF'
POSTGRES_PRISMA_URL=postgresql://...
SUPABASE_POSTGRES_PRISMA_URL=postgresql://...
EOF

# 2. Execute com o arquivo
export $(cat .env.migration | xargs) && node scripts/migrate-now.js
```

---

## 📋 URLs de Conexão

### Como Obter a URL do Neon

1. Acesse: https://console.neon.tech/
2. Selecione seu projeto
3. Vá em **Connection Details**
4. Copie a **Prisma connection string**

**Formato:**
```
postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### Como Obter a URL do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Database**
4. Role até **Connection string** → **URI**
5. Copie e **adicione** `?pgbouncer=true&connection_limit=1` no final

**Formato:**
```
postgresql://postgres.xxx:password@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

---

## ✅ Passo a Passo Completo

### 1. Obter Credenciais (2 minutos)

- [ ] Copiar URL do Neon
- [ ] Copiar URL do Supabase
- [ ] Adicionar `?pgbouncer=true&connection_limit=1` na URL do Supabase

### 2. Executar Migração (5-10 minutos)

```bash
# Substituir pelas suas URLs reais
POSTGRES_PRISMA_URL="postgresql://..." \
SUPABASE_POSTGRES_PRISMA_URL="postgresql://..." \
node scripts/migrate-now.js
```

**O que acontece:**
- Migra TODAS as 14 tabelas
- Ignora duplicatas automaticamente
- Mostra progresso em tempo real
- Gera relatório completo ao final

**Saída esperada:**
```
🚀 MIGRAÇÃO NEON → SUPABASE
═══════════════════════════════════════════════════════════
✅ Variáveis de ambiente configuradas
📊 Migrando TODAS as 14 tabelas do schema...

📦 [1/14] Migrando Users...
   ✅ Users: 45/45
📦 [2/14] Migrando Accounts...
   ✅ Accounts: 23/23
...
✅ MIGRAÇÃO COMPLETA!
```

### 3. Validar Migração (1 minuto)

```bash
# Usar as mesmas URLs
POSTGRES_PRISMA_URL="postgresql://..." \
SUPABASE_POSTGRES_PRISMA_URL="postgresql://..." \
node scripts/validate-migration.js
```

**O que acontece:**
- Compara counts de todas as 14 tabelas
- Mostra diferenças se houver
- Exit code 0 se tudo OK, 1 se houver problemas

**Saída esperada:**
```
🔍 VALIDAÇÃO DE MIGRAÇÃO NEON → SUPABASE
═══════════════════════════════════════════════════════════
✅ users                 | Neon:    45 | Supabase:    45 | ✓
✅ accounts              | Neon:    23 | Supabase:    23 | ✓
✅ articles              | Neon:   892 | Supabase:   892 | ✓
...
✅ VALIDAÇÃO BEM-SUCEDIDA!
```

### 4. Testar Aplicação (5 minutos)

- [ ] Atualizar `DATABASE_URL` para apontar para Supabase
- [ ] Testar login/logout
- [ ] Verificar artigos em `/noticias`
- [ ] Verificar recursos em `/recursos`

### 5. Limpar Rotas Temporárias (1 minuto)

```bash
./scripts/cleanup-migration.sh
```

---

## 🎯 Comando Único - Copy & Paste

**SUBSTITUA AS URLs E EXECUTE:**

```bash
# ⚠️  ATENÇÃO: Substitua as URLs antes de executar!

# Definir URLs
export POSTGRES_PRISMA_URL="postgresql://USER:PASS@neon-host/db"
export SUPABASE_POSTGRES_PRISMA_URL="postgresql://USER:PASS@supabase-host/db?pgbouncer=true&connection_limit=1"

# Migrar + Validar
node scripts/migrate-now.js && node scripts/validate-migration.js

# Se tudo OK, limpar rotas temporárias
# ./scripts/cleanup-migration.sh
```

---

## 🐛 Problemas Comuns

### "Cannot find module '@/lib/generated/prisma'"

```bash
# Gerar client Prisma primeiro
npm install
npx prisma generate
```

### "Connection refused" ou "timeout"

- Verifique se as URLs estão corretas
- Confirme que os bancos estão acessíveis
- Teste com: `node scripts/test-database-connections.js`

### "Authentication failed"

- Verifique usuário e senha nas URLs
- URLs devem estar entre aspas: `"postgresql://..."`

### Migração parcial (alguns registros falharam)

- Execute novamente: `node scripts/migrate-now.js`
- A migração ignora duplicatas automaticamente
- Verifique o relatório de erros ao final

---

## ⏱️ Tempo Total

- **Obter URLs:** 2 min
- **Migração:** 5-10 min
- **Validação:** 1 min
- **Testes:** 5 min
- **Limpeza:** 1 min

**TOTAL: 15-20 minutos** ⚡

---

## 🎉 Pronto!

Após executar os passos acima, sua aplicação estará **100% rodando no Supabase**!

Para documentação completa, veja:
- `MIGRATION.md` - Guia detalhado
- `VERCEL_SETUP.md` - Deploy no Vercel
- `scripts/README.md` - Documentação dos scripts
