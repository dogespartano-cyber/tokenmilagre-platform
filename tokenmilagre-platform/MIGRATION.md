# 🚀 Guia de Migração Neon → Supabase

## ⚠️ IMPORTANTE
Estas rotas são **TEMPORÁRIAS** e devem ser **DELETADAS** após a migração!

## 📝 Visão Geral

Este guia descreve como migrar **TODOS os dados** do banco Neon (PostgreSQL) para Supabase (PostgreSQL).

### 🎯 O que será migrado?

**14 tabelas completas** com todos os registros:
- Autenticação: Users, Accounts, Sessions, VerificationTokens
- Conteúdo: Articles, Resources, Cryptocurrencies
- Copilot: CopilotActivities, AutomationTasks, CopilotReports
- Comunidade: CommunityStories, SocialProjects, ProjectMaps, UserProgress

### 🛠️ Ferramentas Disponíveis

1. **`/api/setup-supabase-schema`** - Testa conexão com Supabase
2. **`/api/migrate-database`** - Executa migração completa
3. **`/api/validate-migration`** - Valida se dados foram copiados corretamente
4. **`scripts/cleanup-migration.sh`** - Deleta rotas temporárias após migração

### 📋 Fluxo Completo

```
┌─────────────────────────────────────────────────┐
│ 1. Configurar variáveis de ambiente no Vercel  │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│ 2. Testar conexão: /api/setup-supabase-schema  │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│ 3. Migrar dados: /api/migrate-database          │
│    → Copia 14 tabelas (Neon → Supabase)        │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│ 4. Validar: /api/validate-migration             │
│    → Compara counts de todas as tabelas         │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│ 5. Testar aplicação com Supabase                │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│ 6. Limpar rotas: ./scripts/cleanup-migration.sh │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│ 7. Commit, push e deploy final ✅                │
└─────────────────────────────────────────────────┘
```

## 📋 Pré-requisitos

1. Configure as variáveis de ambiente:
```env
# Banco de dados ORIGEM (Neon)
POSTGRES_PRISMA_URL=postgresql://user:pass@neon-host/db

# Banco de dados DESTINO (Supabase)
SUPABASE_POSTGRES_PRISMA_URL=postgresql://user:pass@supabase-host/db

# Senha de segurança para as rotas
MIGRATION_SECRET=sua-senha-super-secreta
```

2. Deploy no Vercel com as variáveis acima configuradas

## 🔧 Passo 1: Testar Conexão com Supabase

```bash
# Acesse a rota de setup
https://seu-dominio.vercel.app/api/setup-supabase-schema?secret=SUA_SENHA
```

**Resposta esperada:**
```json
{
  "status": "SUCCESS",
  "message": "Supabase conectado com sucesso!",
  "note": "Schema será criado automaticamente no primeiro uso do Prisma.",
  "nextStep": "Acesse /api/migrate-database?secret=YOUR_SECRET para copiar dados"
}
```

## 📦 Passo 2: Executar Migração Completa

```bash
# Acesse a rota de migração
https://seu-dominio.vercel.app/api/migrate-database?secret=SUA_SENHA
```

### O que será migrado?

A rota migra **TODAS as 14 tabelas** do schema Prisma:

1. ✅ **Users** - Usuários do sistema
2. ✅ **Accounts** - Contas de autenticação (NextAuth)
3. ✅ **Sessions** - Sessões ativas
4. ✅ **VerificationTokens** - Tokens de verificação
5. ✅ **Articles** - Artigos e conteúdo educacional
6. ✅ **Resources** - Recursos cripto (wallets, exchanges, etc)
7. ✅ **Cryptocurrencies** - Dados de criptomoedas
8. ✅ **CopilotActivities** - Atividades do copilot AI
9. ✅ **AutomationTasks** - Tarefas automatizadas
10. ✅ **CopilotReports** - Relatórios gerados
11. ✅ **CommunityStories** - Histórias da comunidade
12. ✅ **SocialProjects** - Projetos sociais
13. ✅ **ProjectMaps** - Mapas de projetos
14. ✅ **UserProgress** - Progresso dos usuários em cursos

### Relatório de Migração

A rota retorna um relatório detalhado:

```json
{
  "status": "SUCCESS",
  "startTime": "2025-11-11T12:00:00.000Z",
  "endTime": "2025-11-11T12:02:30.000Z",
  "duration": "150.45s",
  "summary": {
    "totalTables": 14,
    "totalRecordsRead": 1523,
    "totalRecordsWritten": 1523,
    "successRate": "100.00%",
    "errorsCount": 0
  },
  "tables": {
    "users": { "read": 45, "written": 45 },
    "accounts": { "read": 23, "written": 23 },
    "articles": { "read": 892, "written": 892 },
    ...
  },
  "errors": []
}
```

## 🔍 Passo 3: Validar Migração

Após executar a migração, **valide** se todos os dados foram copiados corretamente:

```bash
# Acesse a rota de validação
https://seu-dominio.vercel.app/api/validate-migration?secret=SUA_SENHA
```

### Relatório de Validação

A rota compara os **counts** de todas as 14 tabelas entre Neon e Supabase:

```json
{
  "status": "SUCCESS",
  "message": "✅ Migração validada com sucesso! Todos os dados foram migrados.",
  "startTime": "2025-11-11T12:05:00.000Z",
  "endTime": "2025-11-11T12:05:15.000Z",
  "duration": "15.23s",
  "summary": {
    "totalTables": 14,
    "tablesMatching": 14,
    "tablesMismatch": 0,
    "tablesWithErrors": 0
  },
  "tables": {
    "users": {
      "neon": 45,
      "supabase": 45,
      "match": true,
      "diff": 0,
      "status": "✅ OK"
    },
    "articles": {
      "neon": 892,
      "supabase": 892,
      "match": true,
      "diff": 0,
      "status": "✅ OK"
    },
    ...
  },
  "errors": []
}
```

### Interpretação do Relatório

- **✅ OK**: Tabela migrada com sucesso (counts batem)
- **⚠️ MISMATCH**: Diferença entre Neon e Supabase (revise!)
- **❌ ERROR**: Erro ao consultar tabela (verifique conexões)

Se houver **mismatches**, execute a migração novamente. A rota ignora duplicatas automaticamente.

## 🔒 Segurança

- ✅ Todas as rotas exigem `?secret=MIGRATION_SECRET` na URL
- ✅ Timeout de 5 minutos (300s) para migração completa
- ✅ Tratamento de duplicatas (unique constraints)
- ✅ Relatório de erros detalhado
- ✅ Conexões com banco são fechadas automaticamente

## ⚙️ Tratamento de Erros

A migração:
- **Ignora duplicatas**: Se um registro já existe (unique constraint), pula e continua
- **Registra erros**: Outros erros são logados no array `errors` do relatório
- **Continua em caso de erro**: Um erro em um registro não para a migração
- **Respeita relações**: Migra tabelas na ordem correta (Users antes de Articles, etc)

## 🧹 Pós-Migração

Após confirmar que a migração foi bem-sucedida:

### Checklist de Validação

- [ ] ✅ Todos os **14 counts** batem na rota `/api/validate-migration`
- [ ] ✅ Dados críticos estão corretos no **Supabase Dashboard**
- [ ] ✅ Aplicação **funciona** apontando para Supabase (DATABASE_URL)
- [ ] ✅ **Autenticação** funciona (teste login/logout)
- [ ] ✅ **Artigos** aparecem corretamente nas páginas
- [ ] ✅ **Recursos** estão acessíveis em `/recursos`

### Limpeza Automática

Use o script fornecido para deletar todas as rotas temporárias de uma vez:

```bash
# Execute a partir da raiz do projeto
./scripts/cleanup-migration.sh
```

O script vai deletar:
- ✅ `app/api/setup-supabase-schema/`
- ✅ `app/api/migrate-database/`
- ✅ `app/api/validate-migration/`
- ✅ `MIGRATION.md`
- ✅ `scripts/cleanup-migration.sh` (o próprio script)

### Limpeza Manual (alternativa)

Se preferir deletar manualmente:

```bash
rm -rf app/api/setup-supabase-schema
rm -rf app/api/migrate-database
rm -rf app/api/validate-migration
rm -f MIGRATION.md
rm -f scripts/cleanup-migration.sh
```

### Finalização

1. **Atualize `.env.production`** no Vercel:
   - Mude `DATABASE_URL` para apontar para `SUPABASE_POSTGRES_PRISMA_URL`
   - Ou simplesmente delete `POSTGRES_PRISMA_URL` (Neon)

2. **Commit e push**:
   ```bash
   git add .
   git commit -m "chore: remover rotas temporárias de migração"
   git push
   ```

3. **Deploy final** no Vercel

4. **Opcional**: Deletar o banco Neon após alguns dias de estabilidade

## 🐛 Troubleshooting

### Erro: "Unauthorized"
- Verifique se `MIGRATION_SECRET` está configurada no Vercel
- Confira se está passando `?secret=` corretamente na URL

### Erro: "POSTGRES_PRISMA_URL não configurada"
- Configure as variáveis de ambiente no Vercel
- Redeploy da aplicação

### Timeout (504)
- A migração pode demorar >5min se houver muitos dados
- Considere aumentar `maxDuration` no código (requer Vercel Pro)
- Ou migre tabelas em batches separados

### Registros duplicados
- A rota ignora automaticamente duplicatas
- Use o campo `errors` do relatório para investigar problemas reais

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs do Vercel
2. Analise o relatório JSON retornado pela rota
3. Verifique a conexão com ambos bancos de dados
