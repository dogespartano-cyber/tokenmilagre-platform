# 🔍 Guia de Setup: Fact-Checking Automático

Sistema de verificação automática de fatos com múltiplas fontes (Google + Brave).

---

## 🚀 Setup Rápido (5 minutos)

### 1. Obter API Keys (GRÁTIS)

#### Google Custom Search API (100 queries/dia)

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** → **Library**
4. Busque por **Custom Search API** e clique em **Enable**
5. Vá em **Credentials** → **Create Credentials** → **API Key**
6. Copie a API Key gerada

**Criar Search Engine ID:**

1. Acesse [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Clique em **Add** (novo search engine)
3. Em **Sites to search**, digite: `*` (buscar em toda web)
4. Dê um nome e clique em **Create**
5. Copie o **Search Engine ID** gerado

#### Brave Search API (2000 queries/mês)

1. Acesse [Brave Search API](https://brave.com/search/api/)
2. Clique em **Get Started** e crie uma conta
3. Escolha o plano **Free** (2000 queries/mês)
4. Copie a **API Key** gerada

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto:

```bash
# Fact-checking habilitado
ENABLE_FACT_CHECK=true

# Google Custom Search
GOOGLE_SEARCH_API_KEY=sua-google-api-key-aqui
GOOGLE_SEARCH_ENGINE_ID=seu-search-engine-id-aqui

# Brave Search
BRAVE_SEARCH_API_KEY=sua-brave-api-key-aqui
```

### 3. Testar Sistema

```bash
# 1. Aplicar migração do banco (se ainda não fez)
cd tokenmilagre-platform
npx prisma migrate dev

# 2. Iniciar servidor Next.js
npm run dev

# 3. Em outro terminal, iniciar watcher
npm run watch

# Você verá:
# ✅ Fact-checking: HABILITADO
# APIs necessárias: Google Custom Search, Brave Search
```

### 4. Testar com Artigo de Exemplo

Crie um arquivo de teste:

```bash
cat > ~/articles/test-fact-check.md <<EOF
---
title: "Bitcoin atinge $100.000 em marco histórico"
summary: "Criptomoeda líder atinge marca inédita de seis dígitos"
category: bitcoin
tags: bitcoin, btc, preço, recorde
sentiment: positive
author: admin@tokenmilagre.xyz
---

# Bitcoin atinge $100.000 em marco histórico

O Bitcoin alcançou hoje a marca histórica de $100.000 dólares, estabelecendo um novo recorde de valorização.

A criptomoeda subiu 15% nas últimas 24 horas, impulsionada por demanda institucional crescente.

Analistas preveem que o preço pode continuar subindo nos próximos meses.
EOF
```

**O que vai acontecer:**

1. Watcher detecta o arquivo
2. Fact-checking é executado:
   - Extrai claims: "Bitcoin $100k", "subiu 15%", etc.
   - Busca em Google + Brave
   - Calcula score
3. Se aprovado (score ≥ 70%): publica automaticamente
4. Se reprovado (score < 70%): move para `~/articles/.review/`

Você verá logs como:

```
📄 Novo arquivo detectado: test-fact-check.md
ℹ️  Processando: test-fact-check.md
🔍 Realizando fact-checking...
ℹ️     Status: ✅ APROVADO
ℹ️     Score: 85/70
ℹ️     Claims verificados: 3/3
ℹ️     Fontes consultadas: 12
ℹ️     APIs usadas: Google Custom Search, Brave Search
✅ Artigo "Bitcoin atinge $100.000 em marco histórico" importado com sucesso!
ℹ️     Slug: bitcoin-atinge-100-000-em-marco-historico
ℹ️     URL: http://localhost:3000/dashboard/noticias/bitcoin-atinge-100-000-em-marco-historico
ℹ️     Movido para: .processed/test-fact-check.md
```

---

## ⚙️ Configurações Avançadas

### Ajustar Threshold (Score Mínimo)

Edite `scripts/watch-articles.js`:

```javascript
// Linha ~60
factCheckResult = await factCheckArticle(markdown, {
  threshold: 70,  // ← Mude aqui (0-100)
  maxClaims: 10
});
```

**Valores recomendados:**
- `50`: Liberado (aceita mais artigos)
- `70`: Balanceado (recomendado)
- `85`: Rigoroso (apenas artigos muito bem verificados)

### Limitar Número de Claims Verificados

```javascript
// Linha ~60
factCheckResult = await factCheckArticle(markdown, {
  threshold: 70,
  maxClaims: 10  // ← Mude aqui (1-20)
});
```

**Nota:** Mais claims = mais queries nas APIs = mais tempo

### Desabilitar Temporariamente

```bash
# No .env
ENABLE_FACT_CHECK=false
```

Ou diretamente no comando:

```bash
ENABLE_FACT_CHECK=false npm run watch
```

---

## 📊 Como Funciona o Score

O sistema calcula o score de 0-100 baseado em:

### 1. Número de Fontes (máx 60 pontos)

- 1 fonte = 12 pontos
- 2 fontes = 24 pontos
- 3 fontes = 36 pontos
- 4 fontes = 48 pontos
- 5+ fontes = 60 pontos

### 2. Múltiplos Provedores (+20 pontos)

- Bonus se encontrou em Google **E** Brave

### 3. Importância do Claim (+20 pontos)

- Claims marcados como "high importance" recebem bonus

### Exemplo de Cálculo

**Claim:** "Bitcoin atingiu $100k"

- ✅ Encontrado em 5 fontes = **60 pontos**
- ✅ Fontes de Google + Brave = **+20 pontos**
- ✅ Alta importância = **+20 pontos**
- **Total: 100 pontos** ✅ APROVADO

---

## 🔧 Troubleshooting

### ⚠️ "APIs não configuradas. Fact-checking será pulado."

**Solução:** Configure pelo menos uma API (Google ou Brave) no `.env`

### ⚠️ "Erro ao buscar no Google: 403"

**Possíveis causas:**
1. API Key inválida
2. Custom Search API não habilitada no projeto
3. Limite de queries excedido (100/dia no free tier)

**Solução:** Verifique as credenciais e limites

### ⚠️ "Erro ao buscar no Brave: 401"

**Solução:** Verifique se a API Key está correta no `.env`

### ⚠️ Todos os artigos vão para `.review/`

**Possível causa:** Threshold muito alto ou APIs não encontrando fontes

**Solução:**
1. Reduza o threshold para 50-60
2. Verifique se as APIs estão funcionando
3. Teste com artigos sobre eventos recentes (mais fontes disponíveis)

### Ver Logs Detalhados

Os logs do watcher mostram todo o processo de fact-checking em tempo real.

Para debugging adicional, verifique:

```bash
# Logs do servidor Next.js (terminal 1)
# Logs do watcher (terminal 2)
```

---

## 📈 Limites e Custos

### Tier Gratuito

| API | Limite Grátis | Custo Adicional |
|-----|---------------|-----------------|
| Google Custom Search | 100 queries/dia | $5 por 1000 queries |
| Brave Search | 2000 queries/mês | $0.50 por 1000 queries |

### Consumo Estimado

**Por artigo (com 5 claims):**
- Gemini: 1 request (extração de claims)
- Google: ~5 requests (1 por claim)
- Brave: ~5 requests (1 por claim)
- **Total: ~10 queries de busca**

**Capacidade mensal (free tier):**
- Google: ~300 artigos/mês (100/dia × 30 dias = 3000 queries ÷ 10)
- Brave: ~200 artigos/mês (2000 queries ÷ 10)

**Usando ambos:** ~500 artigos/mês **GRÁTIS**

---

## 🎯 Boas Práticas

### ✅ Fazer

- Configure ambas as APIs para máxima confiabilidade
- Revise artigos em `.review/` regularmente
- Ajuste o threshold conforme necessário
- Use Gemini para criar artigos bem estruturados

### ❌ Evitar

- Não desabilite fact-checking em produção
- Não aprove artigos reprovados sem revisar
- Não use APIs em excesso (respeite limites)
- Não confie 100% em scores altos (sempre revise conteúdo importante)

---

## 🔐 Segurança

### Armazenamento de API Keys

- ✅ **NUNCA** commite o arquivo `.env` no git
- ✅ Use `.env.example` como template
- ✅ Em produção, use variáveis de ambiente do servidor
- ✅ Rotacione API Keys periodicamente

### Validação de Artigos

O fact-checking **NÃO substitui** revisão humana. Use-o como:

- ✅ Primeira linha de defesa
- ✅ Filtro automático de desinformação óbvia
- ✅ Ferramenta para priorizar revisão manual

**Artigos críticos devem sempre ser revisados manualmente.**

---

## 📞 Suporte

### Problemas Comuns

Veja seção de Troubleshooting acima.

### Logs

- Watcher: Terminal onde rodou `npm run watch`
- API: Terminal onde rodou `npm run dev`
- Banco de dados: `npx prisma studio`

### Documentação

- **Workflow geral:** `ARTICLES-WORKFLOW.md`
- **Fact-checking:** Este arquivo
- **API Keys:** `.env.example`

---

## 🎉 Pronto!

Seu sistema de fact-checking está configurado e pronto para uso!

**Teste agora:**

```bash
# Criar artigo de teste
gemini "Resuma a notícia mais recente sobre Bitcoin" > ~/articles/test.md

# Adicionar metadados no início do arquivo
nano ~/articles/test.md

# Salvar e ver a mágica acontecer! ✨
```

O artigo será automaticamente verificado e publicado (ou enviado para revisão).
