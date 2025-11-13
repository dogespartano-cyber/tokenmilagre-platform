# Migração Neon → Supabase

**Data**: 2025-11-12
**Status**: ✅ CONCLUÍDA
**Motivo**: Mudança de provider PostgreSQL via integração Vercel (Neon atingiu cota de transferência)

## 📊 Resultado da Migração

- ✅ **14 tabelas** criadas no Supabase
- ✅ **2 usuários** criados (Admin + Editor)
- ✅ Schema validado e funcionando
- ✅ Conexão local testada com sucesso
- ⚠️ Dados do Neon não foram migrados (cota excedida bloqueou acesso)

### Credenciais Criadas

**Admin:**
- Email: `admin@tokenmilagre.com`
- Senha: `admin123`
- ⚠️ Alterar senha após primeiro login

**Editor:**
- Email: `editor@tokenmilagre.com`
- Senha: `editor123`

### Scripts Criados

1. **`scripts/backup-neon.ts`** - Backup completo do Neon (bloqueado por cota)
2. **`scripts/migrate-to-supabase.ts`** - Migração de dados (não usado - dados indisponíveis)
3. **`scripts/apply-schema-supabase.ts`** - Teste de conexão e validação
4. **`scripts/seed-admin-supabase.ts`** - Criação de usuários iniciais

---

---

## 📋 Checklist de Migração

### Fase 1: Backup (CRÍTICO)

- [ ] **Executar backup do Neon**
  ```bash
  npx tsx scripts/backup-neon.ts
  ```
  - Gera: `backup-neon-YYYY-MM-DD-HHMMSS.json`
  - Verificar se arquivo foi criado com sucesso
  - Guardar cópia de segurança em local externo

- [ ] **Fazer backup do .env atual**
  ```bash
  cp .env .env.neon.backup
  ```

### Fase 2: Configuração Local

- [ ] **Atualizar .env para Supabase**
  ```env
  # Substituir estas linhas:
  DATABASE_URL="postgres://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
  DIRECT_URL="postgres://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
  ```

- [ ] **Aplicar schema no Supabase**
  ```bash
  npx prisma db push
  ```
  - Confirmar quando perguntar (vai criar 17 tabelas vazias)
  - Validar no [Supabase Studio](https://supabase.com/dashboard)

### Fase 3: Migração de Dados

- [ ] **Executar migração**
  ```bash
  npx tsx scripts/migrate-to-supabase.ts
  ```
  - Script vai:
    1. Ler backup JSON
    2. Inserir dados no Supabase (ordem correta)
    3. Validar contagens
  - Tempo estimado: 2-5 minutos

### Fase 4: Validação Local

- [ ] **Testar aplicação localmente**
  ```bash
  # Usar server-manager (recomendado)
  bash /home/destakar/Trabalho/server-manager.sh start

  # OU manualmente (se necessário)
  npm run dev
  ```

- [ ] **Checklist de testes**
  - [ ] Login com usuário admin funciona
  - [ ] Página de artigos carrega (/noticias)
  - [ ] Página de recursos carrega (/recursos)
  - [ ] Dashboard admin acessível (/dashboard)
  - [ ] Gráficos de criptomoedas funcionam
  - [ ] CRUD de artigos no dashboard funciona

### Fase 5: Deploy em Produção

- [ ] **Verificar variáveis na Vercel**
  - Ir em: [Vercel Dashboard](https://vercel.com) → Projeto → Settings → Environment Variables
  - Confirmar que variáveis Supabase estão ativas:
    - `SUPABASE_POSTGRES_PRISMA_URL`
    - `SUPABASE_POSTGRES_URL_NON_POOLING`

- [ ] **Atualizar prisma/schema.prisma (se necessário)**
  - Verificar se há mudanças não commitadas:
    ```bash
    git status prisma/schema.prisma
    ```

- [ ] **Fazer commit e push**
  ```bash
  git add .
  git commit -m "feat: Migrar banco de dados do Neon para Supabase

  - Adicionar scripts de backup e migração
  - Atualizar .env para credenciais Supabase
  - Documentar processo completo em MIGRACAO-SUPABASE.md

  🤖 Generated with Claude Code
  Co-Authored-By: Claude <noreply@anthropic.com>"

  git push origin main
  ```

- [ ] **Aguardar deploy Vercel** (~2-3 minutos)

### Fase 6: Validação em Produção

- [ ] **Testar site em produção**
  - [ ] Abrir URL do site (https://tokenmilagre.com ou similar)
  - [ ] Verificar home carrega
  - [ ] Artigos aparecem
  - [ ] Login funciona
  - [ ] Dashboard acessível

- [ ] **Verificar logs da Vercel**
  - Ir em: Vercel Dashboard → Projeto → Deployments → Latest → Logs
  - Verificar se não há erros de conexão com banco

### Fase 7: Limpeza (após 7 dias)

- [ ] **Validar estabilidade** (aguardar 7 dias)
  - Site funcionando normalmente
  - Sem erros de banco
  - Performance OK

- [ ] **Remover integração Neon**
  - Vercel Dashboard → Integrations → Neon → Disconnect
  - Remove automaticamente variáveis `POSTGRES_*`

- [ ] **Arquivar backup**
  - Mover `backup-neon-*.json` para local seguro
  - Manter por 30 dias (segurança)
  - Deletar `.env.neon.backup` após confirmar estabilidade

---

## 🔧 Troubleshooting

### Erro: "Module not found: lib/generated/prisma"

**Causa**: Prisma Client não gerado
**Solução**:
```bash
npx prisma generate
```

### Erro: "Can't reach database server"

**Causa**: Credenciais erradas ou IP bloqueado
**Solução**:
1. Verificar credenciais no .env
2. Supabase → Settings → Database → Connection Pooling (desabilitar IPv6)
3. Reiniciar aplicação

### Erro: "Unique constraint failed"

**Causa**: Banco Supabase já contém dados
**Solução**:
```bash
# Limpar banco e recriar schema
npx prisma db push --force-reset

# Rodar migração novamente
npx tsx scripts/migrate-to-supabase.ts
```

### Validação falha (contagens não batem)

**Causa**: Erro durante inserção
**Solução**:
1. Verificar logs do script
2. Abrir [Supabase Studio](https://supabase.com/dashboard)
3. Table Editor → Verificar dados manualmente
4. Se necessário, resetar e migrar novamente

---

## 📊 Comparação: Neon vs Supabase

| Feature | Neon | Supabase |
|---------|------|----------|
| **PostgreSQL** | ✅ Última versão | ✅ Última versão |
| **Connection Pooling** | ✅ Integrado | ✅ Integrado (PgBouncer) |
| **Dashboard** | Básico | 🌟 Completo (Studio) |
| **Auth integrado** | ❌ | ✅ Supabase Auth |
| **Storage integrado** | ❌ | ✅ Supabase Storage |
| **Edge Functions** | ❌ | ✅ Deno runtime |
| **Free Tier** | 500MB | 500MB + 2GB transfer |
| **Backups** | Manual | ✅ Automático (diário) |
| **RLS (Row Level Security)** | Sim | 🌟 Sim + UI visual |
| **Vercel Integration** | ✅ | ✅ |

---

## 📞 Suporte

**Documentação**:
- [Supabase Docs](https://supabase.com/docs)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Vercel + Supabase](https://vercel.com/integrations/supabase)

**Problemas**:
- Abrir issue no GitHub do projeto
- Consultar CLAUDE-MEMORY.md e LOG.md

---

**Criado por**: Claude Code
**Última atualização**: 2025-11-12
