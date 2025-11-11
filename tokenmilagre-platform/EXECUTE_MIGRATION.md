# ⚡ EXECUTAR MIGRAÇÃO - URLs Configuradas!

## ✅ URLs Recebidas

**Neon (Origem):**
```
postgresql://neondb_owner:npg_W0awYJLdgUV1@ep-rapid-paper-adrzxy4v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Supabase (Destino):**
```
postgresql://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```

---

## 🚀 OPÇÃO 1: Migração via pg_dump (RECOMENDADO)

### Pré-requisitos
- PostgreSQL client instalado (`psql` e `pg_dump`)
- Acesso à internet

### Executar

```bash
# Execute o script standalone
./scripts/migrate-direct.sh
```

**O script faz:**
1. Cria backup do Neon com `pg_dump`
2. Restaura dados no Supabase com `psql`
3. Valida counts de 4 tabelas principais
4. Remove backup temporário

**Tempo estimado: 2-5 minutos**

---

## 🚀 OPÇÃO 2: Migração via Node.js

### Pré-requisitos
- Node.js instalado
- Prisma client gerado (`npm install`)

### Executar

```bash
# 1. Instalar dependências (se ainda não fez)
npm install

# 2. Executar migração
POSTGRES_PRISMA_URL="postgresql://neondb_owner:npg_W0awYJLdgUV1@ep-rapid-paper-adrzxy4v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" \
SUPABASE_POSTGRES_PRISMA_URL="postgresql://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require" \
node scripts/migrate-now.js
```

**Tempo estimado: 5-10 minutos**

---

## 🚀 OPÇÃO 3: Migração Manual (SQL)

### Usar GUI do Supabase

1. **Acesse Supabase Dashboard**
   - https://supabase.com/dashboard

2. **Vá em SQL Editor**

3. **Conecte no Neon** e exporte dados:
   ```sql
   -- Copie todos os registros manualmente
   SELECT * FROM "User";
   SELECT * FROM "Article";
   -- ... etc
   ```

4. **Cole no Supabase SQL Editor** e execute

---

## 🚀 OPÇÃO 4: Via Vercel (Deploy)

### Passo a Passo

1. **Deploy do branch no Vercel**
   ```bash
   # Branch já está pushed:
   claude/leia-ski-011CV1G7eKfAiV1Ut2D6b7R1
   ```

2. **Configurar env vars no Vercel:**
   - `POSTGRES_PRISMA_URL` = URL do Neon (acima)
   - `SUPABASE_POSTGRES_PRISMA_URL` = URL do Supabase (acima)
   - `MIGRATION_SECRET` = qualquer senha forte

3. **Acessar rota de migração:**
   ```bash
   curl "https://SEU_APP.vercel.app/api/migrate-database?secret=SUA_SENHA"
   ```

4. **Validar:**
   ```bash
   curl "https://SEU_APP.vercel.app/api/validate-migration?secret=SUA_SENHA"
   ```

---

## ✅ Validação Rápida

Após qualquer método, valide os counts:

### No Neon:
```bash
psql "postgresql://neondb_owner:npg_W0awYJLdgUV1@ep-rapid-paper-adrzxy4v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" \
-c 'SELECT COUNT(*) as users FROM "User"; SELECT COUNT(*) as articles FROM "Article";'
```

### No Supabase:
```bash
psql "postgresql://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require" \
-c 'SELECT COUNT(*) as users FROM "User"; SELECT COUNT(*) as articles FROM "Article";'
```

Os counts devem **bater exatamente**.

---

## 📋 Checklist Pós-Migração

- [ ] Counts de todas as 14 tabelas batem
- [ ] Login/logout funciona
- [ ] Artigos aparecem em `/noticias`
- [ ] Recursos aparecem em `/recursos`
- [ ] Atualizar `DATABASE_URL` para Supabase
- [ ] Testar em produção por 24-48h
- [ ] Deletar banco Neon (opcional)

---

## 🎯 Método Mais Rápido

**Use OPÇÃO 1 (pg_dump)** se tiver PostgreSQL instalado:

```bash
./scripts/migrate-direct.sh
```

Leva apenas **2-5 minutos** e é o mais confiável!

---

## ⚠️ Notas Importantes

- **URLs já estão hard-coded** nos scripts para facilitar
- **Duplicatas serão ignoradas** automaticamente
- **Todas as 14 tabelas** serão migradas
- **Backup temporário** é criado e deletado automaticamente

---

## 🆘 Problemas?

### "Cannot find module prisma"
```bash
npm install
```

### "Connection refused"
- Verifique firewall/VPN
- Tente em outra rede

### "Authentication failed"
- URLs já foram validadas e estão corretas
- Se mudou senhas, atualize os scripts

---

## 🎉 Sucesso!

Após executar com sucesso, você terá:
- ✅ Todos os dados no Supabase
- ✅ Backup do Neon intacto
- ✅ Pronto para atualizar DATABASE_URL

**Próximo passo:** Aponte a aplicação para o Supabase e teste!
