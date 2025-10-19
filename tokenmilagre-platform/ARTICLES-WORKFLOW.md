# 🚀 Workflow de Artigos - TokenMilagre

Sistema automatizado para criar artigos com Gemini CLI e publicá-los automaticamente no dashboard.

---

## 📖 Visão Geral

```
Gemini CLI → arquivo.md → Watcher → Fact-Check → API → Banco de Dados → Dashboard
                              ↓
                        [Multi-source verification]
                        Google + Brave Search
```

**Vantagens:**
- ✅ Zero custo (Gemini tokens grátis)
- ✅ 100% automatizado após setup
- ✅ **Fact-checking automático com múltiplas fontes**
- ✅ Artigos curados e validados
- ✅ Mesmo visual das notícias atuais
- ✅ Histórico local em arquivos .md
- ✅ Claims verificados automaticamente

---

## 🎯 Setup Inicial (apenas uma vez)

### 1. Verificar estrutura

```bash
cd ~/Trabalho/tokenmilagre-platform

# Verificar se existe:
ls ~/articles/
ls scripts/watch-articles.js
```

Se não existir, o sistema já foi configurado! ✅

### 2. Iniciar servidor Next.js

```bash
# Terminal 1
npm run dev
```

### 3. Iniciar Watcher

```bash
# Terminal 2
npm run watch
```

Você verá:
```
╔══════════════════════════════════════════════════════╗
║         📝 TokenMilagre Articles Watcher 📝         ║
╚══════════════════════════════════════════════════════╝

ℹ️  Monitorando: /home/destakar/articles
ℹ️  API: http://localhost:3000/api/articles/import

✨ Watcher iniciado! Aguardando arquivos .md...
```

---

## 🔍 Fact-Checking Automático (NOVO!)

O sistema agora verifica automaticamente a veracidade dos artigos antes de publicá-los!

### Como Funciona

1. **Extração de Claims**: Gemini identifica afirmações factuais no artigo
2. **Verificação Multi-Fonte**: Busca cada claim em Google + Brave Search
3. **Score de Confiabilidade**: Calcula score de 0-100 baseado em:
   - Número de fontes encontradas
   - Diversidade de provedores (Google + Brave)
   - Importância do claim
4. **Decisão Automática**:
   - ✅ **Score ≥ 70%**: Artigo aprovado e publicado
   - ❌ **Score < 70%**: Artigo movido para `~/articles/.review/` para revisão manual

### Configurar APIs de Busca

**Opção 1: Google Custom Search (100 queries/dia grátis)**

```bash
# 1. Criar projeto no Google Cloud Console
# 2. Habilitar Custom Search API
# 3. Criar credenciais (API Key)
# 4. Criar Custom Search Engine em: https://programmablesearchengine.google.com/

# Adicionar no .env:
GOOGLE_SEARCH_API_KEY=sua-chave-aqui
GOOGLE_SEARCH_ENGINE_ID=seu-engine-id-aqui
```

**Opção 2: Brave Search (2000 queries/mês grátis)**

```bash
# 1. Criar conta em: https://brave.com/search/api/
# 2. Obter API Key

# Adicionar no .env:
BRAVE_SEARCH_API_KEY=sua-chave-brave-aqui
```

**Recomendado: Usar ambos** para máxima confiabilidade!

### Desabilitar Fact-Checking

Se preferir publicar sem verificação:

```bash
# No .env
ENABLE_FACT_CHECK=false
```

### Revisar Artigos Reprovados

```bash
# Artigos reprovados ficam em:
ls ~/articles/.review/

# Para aprovar manualmente:
mv ~/articles/.review/artigo.md ~/articles/

# O watcher irá processar novamente (SEM fact-check na 2ª vez)
```

---

## ✍️ Criar Artigos (Dia a Dia)

### Método 1: Gemini CLI (Recomendado)

```bash
# Criar artigo direto do Gemini
gemini "Resuma as 3 principais notícias de Bitcoin hoje, formatado em markdown" \
  > ~/articles/bitcoin-$(date +%Y%m%d).md

# Adicionar metadados manualmente
nano ~/articles/bitcoin-$(date +%Y%m%d).md
```

Adicione no topo:
```markdown
---
title: "Bitcoin atinge $100k"
summary: "Resumo em 1 linha"
category: bitcoin
tags: bitcoin, btc, alta
sentiment: positive
author: admin@tokenmilagre.xyz
---

# Conteúdo aqui...
```

Salvar → **Automático no dashboard!** ✨

### Método 2: Template Automático

```bash
# Copiar template
cp ~/articles/_TEMPLATE.md ~/articles/meu-artigo.md

# Editar
nano ~/articles/meu-artigo.md

# Salvar → Automático!
```

### Método 3: Gemini com Perplexity (Workflow Completo)

```bash
# 1. Perplexity: Pesquisar fontes
perplexity "últimas notícias Solana DeFi"

# 2. Gemini: Criar artigo com base nas fontes
gemini "Com base nessas informações [colar output Perplexity],
        crie artigo sobre Solana DeFi com:
        - Título atraente
        - Resumo de 1 linha
        - 3 seções principais
        - Fontes no rodapé" \
  > ~/articles/solana-defi-$(date +%Y%m%d).md

# 3. Adicionar metadados
nano ~/articles/solana-defi-$(date +%Y%m%d).md

# 4. Salvar → Automático!
```

---

## 📋 Metadados Obrigatórios

```yaml
---
title: "Título completo da notícia"          # Obrigatório
summary: "Resumo para card (1-2 linhas)"     # Obrigatório
category: bitcoin                            # Obrigatório (ver lista abaixo)
tags: tag1, tag2, tag3                       # Obrigatório
sentiment: positive                          # Obrigatório (positive/neutral/negative)
author: admin@tokenmilagre.xyz               # Opcional (usa admin padrão)
published: true                              # Opcional (padrão: true)
---
```

### Categorias Válidas

- `bitcoin` → Bitcoin ₿
- `ethereum` → Ethereum Ξ
- `solana` → Solana ◎
- `defi` → DeFi 🏦
- `nfts` → NFTs 🎨
- `regulacao` → Regulação ⚖️

### Sentiments

- `positive` → 🟢 Notícia otimista
- `neutral` → 🟡 Notícia neutra
- `negative` → 🔴 Notícia pessimista

---

## 🔄 Como Funciona (Automação)

1. **Você salva** `.md` em `~/articles/`
2. **Watcher detecta** novo arquivo
3. **Fact-checking** (se habilitado):
   - Extrai claims com Gemini
   - Verifica em Google + Brave
   - Calcula score de confiabilidade
   - Se aprovado (≥70%), continua
   - Se reprovado (<70%), move para `.review/`
4. **Processa** metadados + converte markdown → HTML
5. **Envia** para `/api/articles/import` com dados de fact-check
6. **Salva** no banco de dados (PostgreSQL/SQLite) + score de verificação
7. **Move** arquivo para `.processed/` (backup)
8. **Dashboard** exibe automaticamente com badge de verificação!

**Tempo total:**
- Sem fact-check: ~2 segundos ⚡
- Com fact-check: ~10-15 segundos 🔍

---

## 🎨 Visual no Dashboard

Seus artigos aparecem **idênticos** às notícias atuais:

```
┌────────────────────────────────────┐
│ 🟢 Notícia otimista      Há 2m    │
│                                    │
│ Bitcoin atinge novo recorde        │
│ histórico de $100k                 │
│                                    │
│ Criptomoeda líder do mercado...    │
│                                    │
│ [bitcoin] [btc] [alta] [recorde]   │
│                                    │
│ [Bitcoin] ← categoria              │
│                                    │
│ Leia mais →                        │
└────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Artigo não apareceu?

1. **Verifique watcher**:
   ```bash
   # Se não estiver rodando:
   npm run watch
   ```

2. **Veja logs do watcher** no terminal 2

3. **Verifique metadados**:
   - Tem `---` no início e fim?
   - Todos campos obrigatórios preenchidos?
   - Category é válida?

4. **Verifique nome do arquivo**:
   - Termina com `.md`?
   - Não começa com `_` ou `.`?

### Erro de formatação?

- Use o `_TEMPLATE.md` como base
- Copie e cole os metadados exatos

### Watcher não detecta arquivos?

```bash
# Reiniciar watcher
# Terminal 2: Ctrl+C
npm run watch
```

### Artigo com HTML quebrado?

- Markdown mal formatado
- Use ferramentas: https://markdownlivepreview.com/

---

## 💡 Dicas Pro

### Alias úteis

Adicione no `~/.bashrc`:

```bash
# Criar novo artigo com template
alias new-article='cp ~/articles/_TEMPLATE.md ~/articles/article-$(date +%Y%m%d-%H%M).md && nano ~/articles/article-$(date +%Y%m%d-%H%M).md'

# Ver artigos processados
alias articles-log='ls -lh ~/articles/.processed/'

# Abrir pasta de artigos
alias articles='cd ~/articles && ls -lh'
```

Depois:
```bash
source ~/.bashrc
new-article  # Cria e abre editor automaticamente!
```

### Workflow Otimizado (5 minutos)

```bash
# 1. Pesquisar (30s)
perplexity "notícias Bitcoin hoje"

# 2. Gerar artigo (2min)
gemini "Criar artigo markdown com [fontes]" > ~/articles/bitcoin-hoje.md

# 3. Adicionar metadados (1min)
nano ~/articles/bitcoin-hoje.md
# Ctrl+O (salvar) → Ctrl+X (sair)

# 4. Publicado! ✅
```

### Batch Processing

Criar vários artigos de uma vez:

```bash
# Criar lista de tópicos
topics=("Bitcoin ETF" "Ethereum 2.0" "Solana Performance")

for topic in "${topics[@]}"; do
  slug=$(echo "$topic" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
  gemini "Artigo sobre $topic" > ~/articles/${slug}.md
  sleep 2  # Aguardar API Gemini
done

# Adicionar metadados em lote (manual)
```

---

## 📊 Monitoramento

### Ver artigos no banco

```bash
# Acessar banco SQLite
cd ~/Trabalho/tokenmilagre-platform
npx prisma studio

# Navegar para "Article"
```

### Estatísticas

```bash
# Total de artigos processados
ls ~/articles/.processed/ | wc -l

# Artigos pendentes
ls ~/articles/*.md | grep -v "_" | wc -l
```

---

## 🔐 Segurança

- ✅ Watcher roda **localmente**
- ✅ API valida **todos** campos
- ✅ Autor **precisa existir** no banco
- ✅ Slug duplicado → **rejeitado**
- ✅ Markdown → HTML **sanitizado**

---

## 🚀 Produção

Quando subir para produção:

1. **Mudar API_URL** no watcher:
   ```bash
   # Em .env.local ou .env
   NEXT_PUBLIC_API_URL=https://tokenmilagre.xyz
   ```

2. **Rodar watcher no servidor** (opcional):
   ```bash
   # Com PM2 ou systemd
   pm2 start npm --name "articles-watcher" -- run watch
   ```

3. **Ou manter local** e só subir quando criar:
   ```bash
   # Local → Automático → Deploy
   ```

---

## ❓ FAQ

### Fact-Checking

**P: Preciso configurar as APIs de busca?**
R: Não, é opcional. Se não configurar, o fact-check será pulado e artigos publicados normalmente.

**P: Posso usar apenas uma API (Google OU Brave)?**
R: Sim! O sistema funciona com qualquer uma ou ambas. Usar ambas aumenta a confiabilidade.

**P: O que acontece se meu artigo for reprovado?**
R: Ele vai para `~/articles/.review/`. Você pode revisar manualmente e, se aprovar, mover de volta para `~/articles/`.

**P: Como ajustar o threshold (score mínimo)?**
R: Edite `scripts/watch-articles.js` na linha onde diz `threshold: 70` e mude para o valor desejado (0-100).

**P: O fact-check consome tokens do Gemini?**
R: Sim, mas muito pouco. Apenas para extrair claims (~1 request por artigo).

**P: Quanto custa as APIs de busca?**
R: Google: 100 queries/dia **GRÁTIS** | Brave: 2000 queries/mês **GRÁTIS**

**P: Posso ver o relatório de fact-check?**
R: Sim! Ele aparece nos logs do watcher quando você salva o artigo.

### Geral

**P: Posso editar artigos depois de publicados?**
R: Sim! Via banco de dados (Prisma Studio) ou implementar API PUT.

**P: Como deletar artigo?**
R: Prisma Studio → Article → Delete (ou implementar API DELETE).

**P: Posso usar outro LLM?**
R: Sim! Claude, ChatGPT, qualquer que gere markdown.

**P: Funciona com Windows?**
R: Sim, mas ajuste path: `C:\Users\Usuario\articles`

**P: Posso automatizar TUDO?**
R: Sim! Crie script que busca notícias + Gemini + adiciona metadados.

---

## 📞 Suporte

- **Logs do watcher**: Terminal onde rodou `npm run watch`
- **Logs da API**: Terminal do `npm run dev`
- **Banco de dados**: `npx prisma studio`
- **Template**: `~/articles/_TEMPLATE.md`
- **Docs**: `~/articles/README.md`

---

## 🎉 Pronto!

Agora você pode criar artigos infinitos **de graça** com Gemini! 🚀

**Workflow final (COM fact-checking):**
1. Configurar APIs (Google + Brave) - **uma vez**
2. `npm run watch` (deixar rodando)
3. `gemini "..." > ~/articles/novo.md`
4. Adicionar metadados
5. Salvar
6. 🔍 **Fact-check automático** (10-15 segundos)
7. ✨ **Se aprovado → Automático no dashboard!**
8. ⚠️ **Se reprovado → Vai para revisão**

**Workflow final (SEM fact-checking):**
1. `npm run watch` (deixar rodando)
2. `gemini "..." > ~/articles/novo.md`
3. Adicionar metadados
4. Salvar
5. ✨ **Automático no dashboard!** (~2 segundos)

**Tempo:** ~2-15 minutos por artigo (dependendo de fact-check)
**Custo:** R$ 0,00 (APIs grátis dentro dos limites)
**Tokens gastos no Claude Code:** 0
**Artigos verificados:** ✅ 100% (com fact-check habilitado)

🎯 **Objetivo alcançado + Fact-Checking implementado!**

---

## 🆕 Novidades v2.0 - Fact-Checking

- ✅ Verificação automática de fatos com múltiplas fontes
- ✅ Integração com Google Custom Search API
- ✅ Integração com Brave Search API
- ✅ Score de confiabilidade (0-100)
- ✅ Aprovação/rejeição automática baseada em threshold
- ✅ Pasta `.review/` para artigos reprovados
- ✅ Relatórios detalhados de verificação
- ✅ Claims extraídos e verificados individualmente
- ✅ Badge de verificação no banco de dados
- ✅ 100% gratuito (dentro dos limites free tier)
