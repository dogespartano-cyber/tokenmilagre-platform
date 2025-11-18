# 🎯 COMO EXECUTAR A MIGRAÇÃO

## ⚠️ IMPORTANTE
A migração **não pode ser executada pelo Claude Code** devido a restrições de rede.
Você precisa executar **localmente** no seu computador.

## 🚀 MÉTODO MAIS FÁCIL (Windows)

### Opção 1: Duplo Clique (BAT)

1. Navegue até: `C:\Users\Kasnen\Desktop\Claude\tokenmilagre-platform\scripts`
2. **Dê duplo clique** em: `migrate-windows.bat`
3. Aguarde a migração concluir (5-10 minutos)
4. Veja o relatório de sucesso

### Opção 2: PowerShell

```powershell
cd C:\Users\Kasnen\Desktop\Claude\tokenmilagre-platform
powershell.exe -ExecutionPolicy Bypass -File scripts/migrate-windows.ps1
```

### Opção 3: CMD Manual

```cmd
cd C:\Users\Kasnen\Desktop\Claude\tokenmilagre-platform

set POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_W0awYJLdgUV1@ep-rapid-paper-adrzxy4v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

set SUPABASE_POSTGRES_PRISMA_URL=postgresql://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require

node scripts/migrate-now.js
```

## ✅ VALIDAR APÓS MIGRAÇÃO

Execute para validar que todos os dados foram copiados:

```cmd
node scripts/validate-migration.js
```

## 📊 O QUE SERÁ MIGRADO

14 tabelas completas:
- ✅ Users
- ✅ Accounts
- ✅ Sessions
- ✅ VerificationTokens
- ✅ Articles
- ✅ Resources
- ✅ Cryptocurrencies
- ✅ CopilotActivities
- ✅ AutomationTasks
- ✅ CopilotReports
- ✅ CommunityStories
- ✅ SocialProjects
- ✅ ProjectMaps
- ✅ UserProgress

## ⏱️ TEMPO ESTIMADO

- **Migração**: 5-10 minutos
- **Validação**: 1 minuto
- **Total**: ~10 minutos

## 🆘 SE DER ERRO

### Erro de conexão
- Verifique sua conexão com internet
- Tente desligar VPN/Firewall temporariamente
- Use outra rede Wi-Fi

### "Cannot find module"
```cmd
npm install
```

### Timeout
- Execute novamente, duplicatas serão ignoradas automaticamente

## 🎉 APÓS SUCESSO

1. ✅ Validar: `node scripts/validate-migration.js`
2. ✅ Atualizar `DATABASE_URL` no Vercel para apontar para Supabase
3. ✅ Testar aplicação em produção
4. ✅ Deletar rotas temporárias: `./scripts/cleanup-migration.sh`

---

**Dúvidas?** Veja documentação completa em:
- `EXECUTE_MIGRATION.md` - Instruções detalhadas
- `QUICK_START.md` - Guia rápido
- `MIGRATION.md` - Documentação técnica completa
