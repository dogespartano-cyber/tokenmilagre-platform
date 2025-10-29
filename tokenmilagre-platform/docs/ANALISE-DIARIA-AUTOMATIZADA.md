# Análise Diária Automatizada do Mercado Cripto

Sistema de geração automática de análises diárias do mercado de criptomoedas usando Perplexity API.

---

## 📋 Visão Geral

Este sistema:
- Gera **automaticamente** análises completas do mercado cripto todos os dias às 9h BR
- Usa o modelo **sonar-base** (econômico: ~$0.01 por análise)
- Publica automaticamente no banco de dados com a tag `analise-diaria`
- Exibe a análise na **seção Hero da home page**

---

## 🚀 Como Funciona

### 1. Script de Cron Job

**Arquivo**: `scripts/daily-market-analysis.js`

**O que faz**:
1. Chama a API `/api/generate-article` com um prompt otimizado
2. Usa modelo `sonar-base` para economia
3. Recebe o conteúdo gerado pela IA
4. Adiciona automaticamente a tag `analise-diaria`
5. Salva no banco de dados como notícia publicada

**Executar manualmente**:
```bash
cd tokenmilagre-platform
node scripts/daily-market-analysis.js
```

**Configurar Cron Job (executar às 9h BR todos os dias)**:
```bash
# Editar crontab
crontab -e

# Adicionar linha (ajustar o caminho):
0 9 * * * cd /caminho/completo/tokenmilagre-platform && node scripts/daily-market-analysis.js >> /var/log/daily-analysis.log 2>&1
```

> **Nota**: O horário do cron depende do timezone do servidor. Se o servidor estiver em UTC, use `12 * * *` para executar às 9h BR (UTC-3).

---

### 2. API de Geração

**Endpoint**: `POST /api/generate-article`

**Novidades**:
- ✅ Suporte ao modelo `sonar-base` (econômico)
- ✅ Cálculo correto de custos: $0.20 por 1M tokens
- ✅ Aceita `model: 'sonar-base'` no body

**Body da requisição**:
```json
{
  "topic": "Análise completa do mercado...",
  "type": "news",
  "model": "sonar-base"
}
```

---

### 3. Home Page Hero Section

**Arquivo**: `app/page.tsx`

**O que foi adicionado**:
- State `dailyAnalysis` para armazenar análise do dia
- Função `fetchDailyAnalysis()` que busca artigo com tag `analise-diaria` publicado hoje
- Seção Hero visual com:
  - Título da análise
  - Resumo executivo
  - Destaques do mercado (BTC, ETH, sentimento)
  - Data de publicação
  - CTA "Ler Análise Completa"

**Design**:
- Glassmorphism com backdrop-blur
- Borda verde com glow sutil
- Animação fade-in-up
- Responsivo (mobile e desktop)
- Cores adaptativas (modo claro/escuro)

---

## 💰 Custos

| Modelo | Input | Output | Request | Total/análise |
|--------|-------|--------|---------|---------------|
| **sonar-base** | $0.20/1M | $0.20/1M | $0.005 | **~$0.01** |
| sonar | $1/1M | $1/1M | $0.005 | ~$0.05 |
| sonar-pro | $3/1M | $15/1M | $0.005 | ~$0.20 |

**Custo mensal (30 análises/mês)**:
- sonar-base: **~$0.30/mês** ✅

---

## 🎯 Conteúdo da Análise

O prompt solicita à IA:

1. **Bitcoin (BTC)**
   - Preço atual e variação 24h
   - Volume de negociação
   - Resistências e suportes
   - Notícias relevantes

2. **Ethereum (ETH)**
   - Performance comparada ao Bitcoin
   - Volume e movimentação
   - Desenvolvimentos no ecossistema

3. **Principais Altcoins**
   - Maiores valorizações/desvalorizações
   - Projetos em destaque

4. **Mercado Global**
   - Capitalização total
   - Volume global
   - Dominância BTC/ETH

5. **Sentimento**
   - Índice Fear & Greed
   - Análise de tendências

6. **Eventos Importantes**
   - Regulação
   - Adoção institucional
   - Desenvolvimentos tecnológicos

7. **Perspectivas**
   - O que esperar para hoje
   - Pontos de atenção

---

## 🔧 Configuração Necessária

### Variáveis de Ambiente

```env
# Perplexity API
PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxx

# URL da aplicação (para scripts)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # ou URL de produção
```

### Banco de Dados

O script usa o mesmo banco PostgreSQL via Prisma.

**Autor padrão** (ID do usuário EDITOR):
```javascript
const EDITOR_USER_ID = 'cmggcrcr40001ijinifhwp0zq';
```

> Se usar outro usuário, altere no script `daily-market-analysis.js`.

---

## 📊 Como Aparece na Home

```
┌────────────────────────────────────────────────────────────┐
│ 📊 ANÁLISE DO DIA                   28 de Outubro de 2025  │
│    Todos os dias as 21h                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                                             │
│ Bitcoin Rompe $95K: O Que Esperar para o Restante...      │
│                                                             │
│ O mercado cripto apresentou forte recuperação nas           │
│ últimas 24h com Bitcoin rompendo a resistência de $95K...  │
│                                                             │
│ ┌───────────┬───────────┬────────────┐                    │
│ │ 🟢 BTC    │ 📈 ETH    │ 📊 Mercado │                    │
│ │ +5.2%     │ 15.2%     │ Positivo   │                    │
│ └───────────┴───────────┴────────────┘                    │
│                                                             │
│                              [Ler Análise Completa →]      │
└────────────────────────────────────────────────────────────┘
```

**Posicionamento**: Entre "Market Data" e "Recursos Essenciais"

---

## 🧪 Testar Manualmente

### 1. Gerar análise do dia
```bash
cd tokenmilagre-platform
node scripts/daily-market-analysis.js
```

### 2. Verificar no banco
```bash
# Ver último artigo criado
node scripts/verify-latest-article.js
```

### 3. Acessar a home
```
http://localhost:3000/
```

A seção Hero deve aparecer automaticamente se houver análise de hoje.

---

## 🐛 Troubleshooting

### Análise não aparece na home

**Verificar**:
1. A análise foi criada hoje?
2. Tem a tag `analise-diaria`?
3. Está publicada (`published: true`)?

**Comando para verificar**:
```bash
node scripts/list-articles.js
```

### Script falha ao executar

**Possíveis causas**:
1. `PERPLEXITY_API_KEY` não configurada
2. Servidor não está rodando (script precisa chamar API)
3. Banco de dados inacessível
4. Saldo insuficiente na conta Perplexity

**Ver logs**:
```bash
# Se configurou cron job com log
tail -f /var/log/daily-analysis.log
```

### Custo muito alto

Se o custo estiver muito alto:
1. Verificar se está usando `sonar-base` (não `sonar` ou `sonar-pro`)
2. Reduzir tamanho do prompt (mas manter qualidade)
3. Ajustar `max_tokens` na API (linha 336 de `route.ts`)

---

## 📝 Próximas Melhorias

- [ ] Notificação por email quando análise é gerada
- [ ] Dashboard para ver histórico de análises
- [ ] Comparação com análises anteriores
- [ ] Gráficos integrados na seção Hero
- [ ] Newsletter automática com resumo da análise

---

## 📚 Arquivos Modificados

1. **Novos**:
   - `scripts/daily-market-analysis.js` - Script principal
   - `docs/ANALISE-DIARIA-AUTOMATIZADA.md` - Este documento

2. **Modificados**:
   - `app/api/generate-article/route.ts` - Suporte a sonar-base
   - `app/page.tsx` - Seção Hero da análise diária

---

## 🎉 Conclusão

Sistema completo e funcional para análises diárias automatizadas!

**Benefícios**:
- ✅ Conteúdo fresco todos os dias sem esforço manual
- ✅ Custo baixíssimo (~$0.01 por análise)
- ✅ SEO melhorado (Google adora conteúdo atualizado)
- ✅ Engajamento de usuários (voltam todo dia para ler)
- ✅ Autoridade no mercado cripto

**Próximo passo**: Configurar o cron job no servidor de produção!
