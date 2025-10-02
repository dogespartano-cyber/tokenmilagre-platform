# 🚀 TUTORIAL: Deploy TokenMilagre na Vercel

**Tempo estimado:** 10-15 minutos
**Custo:** R$ 0,00 (100% gratuito)

---

## 📋 PRÉ-REQUISITOS

- [ ] Conta no GitHub (criar em https://github.com/signup se não tiver)
- [ ] Acesso ao domínio tokenmilagre.xyz (painel do provedor)
- [ ] Projeto já está pronto (✅ feito!)

---

## PASSO 1: CRIAR CONTA NO GITHUB (se não tiver)

### 1.1 Acesse https://github.com/signup
- Crie conta com seu e-mail
- Escolha username (ex: "destakar" ou "tokenmilagre")
- Verifique e-mail

### 1.2 Instalar GitHub CLI (opcional, mas recomendado)

```bash
# No terminal Linux:
sudo dnf install gh

# Login no GitHub
gh auth login
```

**Ou use a interface web (mais fácil para iniciantes)**

---

## PASSO 2: CRIAR REPOSITÓRIO NO GITHUB

### Opção A: Via Terminal (mais rápido)

```bash
# Voltar para o diretório correto
cd /home/destakar/Trabalho

# Criar repositório no GitHub
gh repo create tokenmilagre-platform --public --source=. --remote=origin --push
```

### Opção B: Via Interface Web (passo a passo)

1. **Acesse:** https://github.com/new
2. **Preencha:**
   - Repository name: `tokenmilagre-platform`
   - Description: `Plataforma de apoio mútuo - Token $MILAGRE`
   - Visibilidade: **Public** ✅
   - ❌ NÃO marcar "Add README" (já temos)
3. **Clique:** "Create repository"

4. **No terminal, execute:**

```bash
cd /home/destakar/Trabalho
git remote add origin https://github.com/SEU_USERNAME/tokenmilagre-platform.git
git branch -M main
git push -u origin main
```

> **Substitua `SEU_USERNAME`** pelo seu username do GitHub!

---

## PASSO 3: CRIAR CONTA NA VERCEL

### 3.1 Acesse https://vercel.com/signup

- **Clique:** "Continue with GitHub"
- **Autorize** a Vercel a acessar sua conta GitHub
- **Pronto!** Conta criada automaticamente

### 3.2 Instalar Vercel CLI (opcional)

```bash
npm install -g vercel

# Login
vercel login
```

---

## PASSO 4: FAZER DEPLOY DO PROJETO

### Opção A: Via Dashboard Vercel (RECOMENDADO - mais visual)

1. **Acesse:** https://vercel.com/new

2. **Import Git Repository:**
   - Vercel vai listar seus repositórios GitHub
   - Clique em **"Import"** ao lado de `tokenmilagre-platform`

3. **Configure Project:**
   - **Project Name:** `tokenmilagre-platform` (pode deixar assim)
   - **Framework Preset:** Next.js (detectado automaticamente ✅)
   - **Root Directory:** `tokenmilagre-platform` (ou `.` se estiver na raiz)
   - **Build Command:** `npm run build` (já configurado ✅)
   - **Output Directory:** `.next` (já configurado ✅)

4. **Environment Variables** (pode pular por enquanto):
   - Clique em "Add" se quiser adicionar variáveis
   - Não é obrigatório agora

5. **Clique:** "Deploy" 🚀

6. **Aguarde:** ~2-3 minutos (Vercel vai instalar, buildar e deployar)

7. **Sucesso!** 🎉
   - URL temporária: `tokenmilagre-platform-XXXX.vercel.app`
   - Copie essa URL

### Opção B: Via Terminal (mais rápido para devs)

```bash
cd /home/destakar/Trabalho/tokenmilagre-platform

# Deploy automático
vercel --prod
```

Siga as perguntas:
- Set up and deploy? **Y**
- Which scope? (seu username)
- Link to existing project? **N**
- Project name? `tokenmilagre-platform`
- Directory? `./`
- Override settings? **N**

---

## PASSO 5: CONFIGURAR DOMÍNIO CUSTOMIZADO (tokenmilagre.xyz)

### 5.1 No Dashboard da Vercel

1. **Acesse seu projeto:** https://vercel.com/SEU_USERNAME/tokenmilagre-platform
2. **Clique:** Settings → Domains
3. **Digite:** `tokenmilagre.xyz`
4. **Clique:** "Add"

### 5.2 Vercel vai pedir para configurar DNS

A Vercel vai mostrar algo assim:

```
Configure your domain's DNS:

Tipo    Nome    Valor
CNAME   www     cname.vercel-dns.com
A       @       76.76.21.21
```

**IMPORTANTE:** Anote esses valores! Vamos usar no próximo passo.

### 5.3 Configurar DNS no seu Provedor de Domínio

#### Se seu domínio está na **Hostinger:**

1. Acesse: https://hpanel.hostinger.com/domains
2. Clique no domínio `tokenmilagre.xyz`
3. Vá em: **DNS / Name Servers**
4. **Adicione/Edite os registros:**

```
Tipo: A
Nome: @
Valor: 76.76.21.21
TTL: 3600

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600
```

5. **Salve as alterações**

#### Se seu domínio está em outro provedor:

- Procure por "DNS Settings" ou "Gerenciar DNS"
- Adicione os mesmos registros acima
- Salve

### 5.4 Aguarde Propagação

- **Tempo:** 5 minutos a 48 horas (geralmente 10-30min)
- **Verificar:** https://dnschecker.org/#A/tokenmilagre.xyz

### 5.5 Adicionar domínio `www` também (opcional)

Na Vercel, adicione também:
- `www.tokenmilagre.xyz` (vai redirecionar automaticamente)

---

## PASSO 6: CONFIGURAR SSL (HTTPS) - AUTOMÁTICO! ✅

A Vercel **configura SSL automaticamente** com Let's Encrypt.

Após DNS propagar:
- ✅ https://tokenmilagre.xyz (com cadeado)
- ✅ SSL A+ rating

**Não precisa fazer nada!**

---

## PASSO 7: TESTAR O SITE

1. **Abra:** https://tokenmilagre.xyz (ou URL temporária da Vercel)
2. **Teste:**
   - [ ] Site carregou?
   - [ ] Design está correto?
   - [ ] Botão "Conectar Carteira" funciona?
   - [ ] Links para Pump.fun e Telegram funcionam?

---

## 🎯 CHECKLIST FINAL

- [ ] Repositório criado no GitHub
- [ ] Deploy feito na Vercel (URL temporária funcionando)
- [ ] DNS configurado no provedor
- [ ] Domínio tokenmilagre.xyz apontando para Vercel
- [ ] SSL ativo (https:// funcionando)
- [ ] Site testado e funcionando

---

## 🔄 ATUALIZAÇÕES FUTURAS

**Como atualizar o site depois:**

### Método 1: Git Push (RECOMENDADO)

```bash
cd /home/destakar/Trabalho/tokenmilagre-platform

# Fazer alterações nos arquivos...

# Commitar e enviar
git add .
git commit -m "Descrição da mudança"
git push

# Deploy automático acontece em ~2 minutos! 🚀
```

### Método 2: Via Vercel Dashboard

1. Acesse: https://vercel.com/SEU_USERNAME/tokenmilagre-platform
2. Clique em "Redeploy" no último deployment

---

## 🆘 PROBLEMAS COMUNS

### Erro: "Build failed"

**Causa:** Erro no código TypeScript ou falta de dependências

**Solução:**
```bash
cd /home/destakar/Trabalho/tokenmilagre-platform
npm run build
```

Se der erro localmente, me avise para corrigir antes de deployar.

---

### DNS não está propagando

**Causa:** Provedor demora para atualizar

**Solução:**
- Aguarde 30-60 minutos
- Verifique se os registros estão corretos
- Use https://dnschecker.org para monitorar

---

### Site carrega mas está "quebrado"

**Causa:** Algum arquivo não foi commitado

**Solução:**
```bash
cd /home/destakar/Trabalho/tokenmilagre-platform
git status
git add -A
git commit -m "Fix: adiciona arquivos faltantes"
git push
```

---

### Wallet não conecta

**Causa:** Phantom Wallet precisa de HTTPS para funcionar

**Solução:**
- Certifique-se que está acessando via https://
- Aguarde SSL ativar (automático na Vercel)

---

## 📊 MONITORAMENTO

### Analytics da Vercel (grátis)

1. Acesse: https://vercel.com/SEU_USERNAME/tokenmilagre-platform/analytics
2. Veja:
   - Visitantes únicos
   - Pageviews
   - Países de origem
   - Devices (mobile/desktop)

---

## 💰 CUSTOS

### Plano Hobby (Gratuito) inclui:

- ✅ 100GB bandwidth/mês
- ✅ Builds ilimitados
- ✅ SSL grátis
- ✅ Domínio customizado
- ✅ Analytics básico
- ✅ 6.000 build minutes/mês

**Suficiente para:** 10.000-50.000 visitantes/mês

### Quando precisar de upgrade?

- 100k+ visitantes/mês
- Múltiplos domínios
- Analytics avançado

**Custo Pro:** $20/mês (só quando realmente precisar)

---

## 🎓 PRÓXIMOS PASSOS (DEPOIS DO DEPLOY)

1. [ ] Adicionar Google Analytics (opcional)
2. [ ] Configurar Open Graph (preview em redes sociais)
3. [ ] Implementar verificação real de holdings
4. [ ] Criar sistema de dashboard
5. [ ] Adicionar SEO meta tags

---

## 📞 SUPORTE

### Precisa de ajuda?

**Me mande:**
1. Screenshot do erro (se houver)
2. URL atual do projeto
3. Descrição do problema

**Documentação oficial:**
- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs

---

**Última atualização:** 02/10/2025
**Autor:** Claude Code
**Status:** ✅ Pronto para deploy

---

## 🎬 COMANDOS RESUMIDOS (COLA)

```bash
# 1. Criar repo GitHub
cd /home/destakar/Trabalho
gh repo create tokenmilagre-platform --public --source=. --remote=origin --push

# 2. Deploy Vercel (via CLI)
cd tokenmilagre-platform
vercel --prod

# 3. Futuros updates
git add .
git commit -m "Update: descrição"
git push
```

**Pronto! Site no ar em ~10 minutos.** 🚀
