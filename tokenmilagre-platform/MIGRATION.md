# 🚀 Guia de Migração Neon → Supabase

## ⚠️ IMPORTANTE
Estas rotas são **TEMPORÁRIAS** e devem ser **DELETADAS** após a migração!

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

1. **Verifique os dados** no Supabase Dashboard
2. **Teste a aplicação** apontando para o Supabase
3. **Delete as rotas temporárias**:
   ```bash
   rm -rf app/api/setup-supabase-schema
   rm -rf app/api/migrate-database
   ```
4. **Remova este arquivo**: `rm MIGRATION.md`
5. **Atualize `.env`** para usar `SUPABASE_POSTGRES_PRISMA_URL` como `DATABASE_URL`
6. **Commit e deploy** das mudanças finais

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
