# 🚀 GUIA COMPLETO: CONFIGURAR CLAUDE CODE WEB

## ✅ O QUE VOCÊ VAI CONSEGUIR

Após seguir este guia, Claude Code Web terá:
- ✅ Acesso total ao repositório GitHub
- ✅ Capacidade de fazer commits e push
- ✅ Deploy automático no Vercel
- ✅ Acesso ao banco de dados (development)
- ✅ Execução de testes e builds
- ✅ Instalação automática de dependências

---

## 📋 PASSO A PASSO COMPLETO

### **PASSO 1: Copiar Variáveis de Ambiente**

1. Abra o arquivo `.env.cloud` que foi criado
2. Copie TODO o conteúdo
3. Acesse **Claude Code Web** → **Settings** → **Cloud Environment**
4. Click em **Update cloud environment**
5. Cole o conteúdo no campo de variáveis
6. Selecione **Network Access**:
   - ✅ **Limited** (recomendado) - permite npm, GitHub, Vercel, etc.
   - ⚠️ **Full** (só se necessário) - acesso total à internet

**📄 Conteúdo para colar (.env.cloud):**

```env
# COPIE do arquivo .env.cloud.example e ajuste com suas credenciais
DATABASE_URL="postgresql://user:pass@host.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host.supabase.com:5432/postgres?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-development-secret-here"
NEXT_PUBLIC_SOLANA_NETWORK="mainnet-beta"
NEXT_PUBLIC_TOKEN_ADDRESS="3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump"
NEXT_PUBLIC_SOLANA_RPC_URL="https://mainnet.helius-rpc.com/?api-key=demo"
PERPLEXITY_API_KEY="your-perplexity-key-here"
GEMINI_API_KEY="your-gemini-key-here"
ENABLE_API_V2=false
ENABLE_FACT_CHECK=false
ENABLE_E2E_TESTS=false
```

---

### **PASSO 2: Commit dos Arquivos de Configuração**

Os seguintes arquivos foram criados e precisam ser commitados:

```bash
# Arquivos criados:
.claude/settings.json                    # Hooks de inicialização
.claude/scripts/setup-environment.sh     # Script de setup automático
.env.cloud                              # Template de variáveis (safe)
CLAUDE.md                               # Documentação do projeto
CLAUDE_CODE_WEB_SETUP.md               # Este guia
```

**Execute localmente:**

```bash
# 1. Adicionar arquivos
git add .claude/ CLAUDE.md CLAUDE_CODE_WEB_SETUP.md .env.cloud

# 2. Commit
git commit -m "feat: Add Claude Code Web configuration

- Setup automatic environment initialization
- Add SessionStart hook for dependency installation
- Create project documentation for Claude
- Add cloud environment template

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 3. Push
git push origin main
```

---

### **PASSO 3: Verificar Autenticação GitHub**

Claude Code Web gerencia autenticação **automaticamente** via proxy seguro:

✅ **Você NÃO precisa** de tokens manuais
✅ **GitHub auth** funciona automaticamente
✅ **Git operations** (clone, pull, push) são seguros
✅ **Commits** assinados são preservados

**Permissões necessárias no GitHub:**
- Acesso ao repositório (já tem, pois é seu)
- Permissões de push (já tem)

---

### **PASSO 4: Configurar Vercel (Opcional)**

Se quiser que Claude faça deploys direto:

**Opção A: Via Vercel Dashboard (Recomendado)**
1. Acesse: https://vercel.com/dashboard
2. Vá em: **Settings** → **Tokens**
3. Click: **Create Token**
4. Nome: `claude-code-web`
5. Scope: **Full Account**
6. Copie o token
7. Adicione ao Cloud Environment:
   ```env
   VERCEL_TOKEN=seu_token_aqui
   ```

**Opção B: Claude usa Vercel via Git (Automático)**
- Push para main → Vercel deploy automático
- Não precisa de token
- Claude só faz commits, Vercel detecta

---

### **PASSO 5: Testar Configuração**

**No Claude Code Web, peça:**

```
Por favor, execute o seguinte para testar a configuração:

1. Verificar ferramentas disponíveis:
   check-tools

2. Verificar variáveis de ambiente:
   echo "DATABASE_URL: ${DATABASE_URL:0:20}..."
   echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:10}..."

3. Instalar dependências:
   npm install

4. Gerar Prisma Client:
   npx prisma generate

5. Verificar TypeScript:
   npx tsc --noEmit

6. Rodar testes:
   npm test

7. Build:
   npm run build
```

---

## 🎯 O QUE CLAUDE PODE FAZER AGORA

### ✅ Com GitHub
- Clone do repositório (automático)
- Checkout de branches
- Commits e push
- Pull requests
- Merge de branches

### ✅ Com Código
- Editar arquivos
- Criar novos arquivos
- Refatorar código
- Adicionar testes
- Fix bugs

### ✅ Com Build/Deploy
- npm install/build
- TypeScript compilation
- Rodar testes
- Verificar linting
- (Opcional) Deploy Vercel direto

### ✅ Com Database
- Prisma migrations (dev)
- Gerar Prisma Client
- Queries ao banco (leitura)
- Prisma Studio (visualização)

---

## 🔒 SEGURANÇA

### ✅ Seguro
- Credenciais ficam **fora do sandbox**
- Git operations via **proxy autenticado**
- Push restrito à **branch atual**
- Network access **limitado por padrão**

### ⚠️ Não Expor
- **NÃO** coloque tokens de produção no .env.cloud
- **USE** credenciais de **desenvolvimento/staging**
- **NUNCA** exponha `NEXTAUTH_SECRET` de produção

---

## 📚 Recursos Úteis

### Documentação Criada
- `CLAUDE.md` - Visão geral do projeto para Claude
- `.claude/settings.json` - Configuração de hooks
- `.env.cloud` - Template de variáveis (seguro)

### Comandos Úteis para Claude
```
@CLAUDE.md - Referencia a documentação
check-tools - Lista ferramentas disponíveis
npm run <script> - Executa scripts do package.json
```

### Hooks Automáticos
- **SessionStart**: Instala dependências automaticamente
- **Setup script**: Verifica ambiente e configura

---

## ✅ CHECKLIST FINAL

Antes de começar a trabalhar com Claude Code Web:

- [ ] Variáveis de ambiente configuradas
- [ ] Network access definido (Limited ou Full)
- [ ] Arquivos de configuração commitados e pushed
- [ ] Teste executado com sucesso
- [ ] Claude consegue fazer build
- [ ] Claude consegue rodar testes

---

## 🆘 Troubleshooting

### "Failed to install dependencies"
- Verifique network access (Limited permite npm)
- Tente manualmente: `npm install`

### "Database connection failed"
- Verifique `DATABASE_URL` no Cloud Environment
- Confirme que é a URL de desenvolvimento

### "TypeScript errors"
- Execute: `npx prisma generate`
- Verifique: `npm run type-check`

### "Can't push to GitHub"
- Verifique permissões no repositório
- Claude push só para branch atual (segurança)

---

## 🎉 PRONTO!

Agora Claude Code Web tem acesso completo e pode:
- Desenvolver features
- Corrigir bugs
- Fazer deploys (via commits)
- Rodar testes
- Gerenciar banco de dados
- Tudo com segurança e automação!

**Teste pedindo para Claude:**
"Por favor, verifique o ambiente e execute um build de teste"
