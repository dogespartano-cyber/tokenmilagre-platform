# 🚀 Migração de SQLite para Vercel Postgres

Este guia contém os passos para migrar o banco de dados de SQLite para PostgreSQL do Vercel.

## 📦 Status Atual

- ✅ Dados exportados: **43 artigos + 2 usuários**
- ✅ Backup criado: `prisma/backup-sqlite.json`
- ✅ Schema atualizado para PostgreSQL
- ✅ Scripts de importação prontos

---

## 🔧 PASSO 1: Criar Vercel Postgres

### 1.1 Acessar Dashboard do Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto: **tokenmilagre-platform**

### 1.2 Criar Banco de Dados

1. Clique na aba **Storage** (no menu lateral)
2. Clique em **Create Database**
3. Selecione **Postgres**
4. Configure:
   - **Database Name**: `tokenmilagre-db` (ou outro nome de sua preferência)
   - **Region**: Escolha **Washington, D.C. (iad1)** (mesmo região do deploy)
5. Clique em **Create**

### 1.3 Conectar ao Projeto

1. Após criar, clique em **Connect Project**
2. Selecione: **tokenmilagre-platform**
3. Clique em **Connect**

**🎉 Pronto! O Vercel criou automaticamente as variáveis de ambiente:**
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← **Esta é a que vamos usar**
- `POSTGRES_URL_NON_POOLING`

---

## 🔧 PASSO 2: Configurar Variáveis de Ambiente Locais

### 2.1 Copiar Variáveis do Vercel

1. No dashboard do Vercel, vá em **Storage** → **tokenmilagre-db**
2. Na aba **Settings**, encontre a seção **Connection String**
3. Copie os valores de:
   - **POSTGRES_PRISMA_URL**
   - **POSTGRES_URL_NON_POOLING**

### 2.2 Atualizar `.env` Local

Edite o arquivo `.env` e substitua:

```env
# Antes (SQLite)
DATABASE_URL="file:./dev.db"

# Depois (PostgreSQL)
DATABASE_URL="postgresql://..."  # Cole POSTGRES_PRISMA_URL aqui
DIRECT_URL="postgresql://..."    # Cole POSTGRES_URL_NON_POOLING aqui
```

**⚠️ IMPORTANTE:** Não commite o arquivo `.env` com as credenciais reais!

---

## 🔧 PASSO 3: Executar Migração

### 3.1 Gerar Prisma Client para PostgreSQL

```bash
npx prisma generate
```

### 3.2 Criar Tabelas no PostgreSQL

```bash
npx prisma db push
```

**Isso irá:**
- Criar todas as tabelas no PostgreSQL
- Criar índices
- Configurar relações

### 3.3 Importar Dados

```bash
node scripts/import-to-postgres.js
```

**Você verá:**
```
📥 Importando dados para PostgreSQL...
📦 Backup de 2025-10-19...
   - 2 usuários
   - 43 artigos

🗑️  Limpando banco de dados...
✅ Banco limpo

👥 Importando usuários...
✅ 2 usuários importados

📰 Importando artigos...
✅ 43 artigos importados

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ IMPORTAÇÃO CONCLUÍDA COM SUCESSO!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Usuários: 2
📰 Artigos: 43 (43 publicados)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔧 PASSO 4: Testar Localmente

### 4.1 Iniciar Servidor Local

```bash
npm run dev
```

### 4.2 Verificar Notícias

Acesse: http://localhost:3000/dashboard/noticias

**✅ Você deve ver os 43 artigos carregados!**

---

## 🔧 PASSO 5: Deploy Final

### 5.1 Verificar Variáveis no Vercel

No dashboard do Vercel:
1. **Settings** → **Environment Variables**
2. Confirme que existem:
   - `POSTGRES_PRISMA_URL` ✅
   - `POSTGRES_URL_NON_POOLING` ✅
3. **Adicione** as variáveis que faltam:

```
NEXTAUTH_SECRET=your-super-secret-key-change-in-production
NEXTAUTH_URL=https://seu-dominio.vercel.app
ARTICLES_API_KEY=e6163d046556648fa97aea1352fdd43ee50454946114bc71c2bb46d1bc09fda5
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=demo
```

### 5.2 Commit e Push

O Claude irá fazer o commit das mudanças:
- `schema.prisma` atualizado para PostgreSQL
- Scripts de migração
- Documentação

### 5.3 Deploy Automático

O Vercel detectará o push e fará deploy automaticamente.

---

## ✅ VERIFICAÇÃO FINAL

Após o deploy, acesse:

**https://seu-dominio.vercel.app/dashboard/noticias**

**Você deve ver:**
- ✅ 43 notícias carregadas
- ✅ Filtros funcionando
- ✅ Busca funcionando
- ✅ Paginação funcionando

---

## 🆘 Troubleshooting

### Erro: "Can't reach database server"

**Causa:** DATABASE_URL incorreta ou firewall bloqueando

**Solução:**
1. Verifique se copiou `POSTGRES_PRISMA_URL` corretamente
2. Teste a conexão: `npx prisma db push`

### Erro: "Table already exists"

**Causa:** Tentou criar tabelas que já existem

**Solução:**
```bash
# Resetar banco (apaga tudo!)
npx prisma db push --force-reset
node scripts/import-to-postgres.js
```

### Artigos não aparecem no Vercel

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Verifique **Settings** → **Environment Variables**
2. Certifique-se que `POSTGRES_PRISMA_URL` está configurada
3. Faça um **Redeploy** manual

---

## 📚 Próximos Passos

Após migração bem-sucedida:

1. ✅ SQLite pode ser removido (opcional)
2. ✅ Manter `backup-sqlite.json` como backup
3. ✅ Configurar backups automáticos no Vercel (Settings → Backups)
4. ✅ Monitorar uso no plano gratuito (256 MB limit)

---

## 🎉 Parabéns!

Seu projeto agora está rodando com PostgreSQL serverless no Vercel! 🚀
