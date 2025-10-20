# 📊 Análise Técnica - Sistema de Criação Automática de Artigos

**Versão:** 2.0
**Data:** Outubro 2025
**Status:** Em Produção

---

## 🎯 Objetivo do Projeto

Sistema automatizado para criação, validação e publicação de artigos sobre criptomoedas com fact-checking opcional usando múltiplas fontes de verificação.

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

- **Framework:** Next.js 15.5.4 (Turbopack)
- **Runtime:** Node.js v22.19.0
- **Database:** SQLite (Prisma ORM)
- **Authentication:** NextAuth.js
- **IA:** Google Gemini (via CLI)
- **File Watching:** Chokidar
- **APIs de Busca:** Google Custom Search API, Brave Search API

### Componentes Principais

```
┌─────────────────────────────────────────────────────┐
│                 Usuário/Gemini CLI                  │
└──────────────────┬──────────────────────────────────┘
                   │ cria artigo.md
                   ▼
┌─────────────────────────────────────────────────────┐
│           Pasta ~/articles/ (File System)           │
└──────────────────┬──────────────────────────────────┘
                   │ detecta
                   ▼
┌─────────────────────────────────────────────────────┐
│        Watcher (Chokidar + Node.js Script)          │
│  • Monitora pasta                                   │
│  • Valida formato                                   │
│  • Inicia fact-checking                             │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────┐    ┌──────────────────┐
│ Fact-Check   │    │  Pula fact-check │
│ (Opcional)   │    │  se desabilitado │
└──────┬───────┘    └────────┬─────────┘
       │                     │
       ▼                     │
┌─────────────────────────────┼──────────┐
│  Gemini API                 │          │
│  • Extrai claims factuais   │          │
│  • Categoriza importância   │          │
└──────┬──────────────────────┘          │
       │                                 │
       ▼                                 │
┌─────────────────────────────┐          │
│  Multi-Source Search        │          │
│  • Google Custom Search     │          │
│  • Brave Search API         │          │
│  • Busca paralela           │          │
└──────┬──────────────────────┘          │
       │                                 │
       ▼                                 │
┌─────────────────────────────┐          │
│  Score Calculation          │          │
│  • Número de fontes: 0-60%  │          │
│  • Multi-provider: +20%     │          │
│  • Importância claim: +20%  │          │
│  • Threshold: 70%           │          │
└──────┬──────────────────────┘          │
       │                                 │
       ├─ Score >= 70% ──────────────────┤
       │                                 │
       ├─ Score < 70% → ~/articles/.review/
       │                                 │
       └─────────────┬───────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│        API Endpoint /api/articles/import            │
│  • Parse frontmatter (YAML)                         │
│  • Valida campos obrigatórios                       │
│  • Gera slug único                                  │
│  • Salva fact-check metadata                        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              Database (SQLite + Prisma)             │
│  • Artigo completo                                  │
│  • Score de fact-check                              │
│  • Fontes consultadas                               │
│  • Timestamp de verificação                         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│         Frontend (Next.js App Router)               │
│  • Dashboard de notícias                            │
│  • Páginas individuais de artigos                   │
│  • Badge de verificação                             │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Funcionalidades Implementadas

### 1. Sistema de File Watching

**Script:** `scripts/watch-articles.js`

**Funcionamento:**
- Monitora pasta `~/articles/` em tempo real
- Detecta novos arquivos `.md` automaticamente
- Ignora arquivos começando com `_` ou `.`
- Aguarda estabilização do arquivo (2s) antes de processar
- Processa arquivos existentes na inicialização (após 3s)

**Estados dos arquivos:**
- `~/articles/*.md` → Pendente (será processado)
- `~/articles/.processed/*.md` → Publicado
- `~/articles/.review/*.md` → Reprovado no fact-check

### 2. Fact-Checking Automático

#### 2.1 Extração de Claims (Gemini)

**Serviço:** `lib/services/gemini-claims.ts`

**Processo:**
1. Envia artigo completo para Gemini CLI
2. Solicita extração de afirmações factuais
3. Filtra opiniões e previsões
4. Categoriza por importância (high/medium/low)
5. Gera query de busca otimizada para cada claim

**Exemplo de output:**
```json
{
  "claims": [
    {
      "text": "Bitcoin atingiu $100k em 15 de março de 2024",
      "category": "fact",
      "importance": "high",
      "searchQuery": "Bitcoin price $100k March 2024"
    }
  ]
}
```

**Limitações conhecidas:**
- ⚠️ Gemini CLI pode adicionar texto explicativo ao JSON
- ⚠️ Parsing pode falhar se resposta não for JSON puro
- ⚠️ Dependente de Gemini CLI estar instalado
- ⚠️ Não há fallback se Gemini falhar

#### 2.2 Verificação Multi-Fonte

**Serviço:** `lib/services/search-providers.ts`

**APIs suportadas:**
- **Google Custom Search:** 100 queries/dia (free tier)
- **Brave Search:** 2000 queries/mês (free tier)

**Processo:**
1. Busca paralela em ambas APIs
2. Coleta top 5 resultados de cada
3. Remove duplicatas por URL
4. Retorna fontes únicas

**Comportamento sem APIs:**
- Sistema pula fact-check silenciosamente
- Artigo é publicado normalmente
- Status: `skipped`

#### 2.3 Cálculo de Score

**Serviço:** `lib/services/fact-checker.ts`

**Algoritmo:**

```
Base Score (0-60 pontos):
  - 1 fonte = 12 pontos
  - 2 fontes = 24 pontos
  - 3 fontes = 36 pontos
  - 4 fontes = 48 pontos
  - 5+ fontes = 60 pontos

Bonus Multi-Provider (+20 pontos):
  - Encontrado em Google E Brave

Bonus Importância (+20 pontos):
  - Claim marcado como "high importance"

Score Final = min(Base + Bonus, 100)

Verificado = Score >= 60%
```

**Threshold de Aprovação:**
- Score >= 70% → Publicar
- Score < 70% → Mover para revisão

**Crítica importante:**
> ⚠️ **O sistema NÃO verifica veracidade, apenas conta fontes!**
>
> Exemplo de falha possível:
> - "Bitcoin vai a $1 milhão amanhã"
> - Se viralizar no Twitter → Muitas fontes
> - Score alto → Aprovado ❌
>
> É "source-checking", não "fact-checking" verdadeiro.

### 3. Schema do Banco de Dados

**Model:** `Article`

```prisma
model Article {
  id                 String    @id @default(cuid())
  title              String
  slug               String    @unique
  content            String    // Markdown puro
  excerpt            String?
  published          Boolean   @default(false)
  authorId           String
  category           String
  tags               String    // JSON array
  sentiment          Sentiment @default(neutral)

  // Fact-checking fields
  factCheckScore     Float?    // 0-100
  factCheckSources   String?   // JSON array de URLs
  factCheckDate      DateTime?
  factCheckStatus    String?   // verified/failed/skipped

  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}
```

### 4. API Endpoints

#### POST `/api/articles/import`

**Função:** Importar artigo markdown para o banco

**Payload:**
```json
{
  "markdown": "---\ntitle: ...\n---\n# Content",
  "filename": "artigo.md",
  "factCheckResult": {
    "score": 85,
    "sources": ["url1", "url2"],
    "status": "verified",
    "checkedAt": "2025-10-07T..."
  }
}
```

**Validações:**
- Frontmatter YAML válido
- Campos obrigatórios: title, summary, category, tags, sentiment
- Slug único (auto-gerado de título ou filename)
- Autor existe no banco
- Sentiment válido (positive/neutral/negative)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "slug": "bitcoin-100k",
    "title": "...",
    "message": "Artigo importado com sucesso!"
  }
}
```

#### POST `/api/articles/fact-check`

**Função:** Verificar fatos de um artigo (standalone)

**Payload:**
```json
{
  "markdown": "---\ntitle: ...\n---\n# Content",
  "threshold": 70,
  "maxClaims": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "passed": true,
    "score": 85,
    "threshold": 70,
    "status": "verified",
    "totalClaims": 5,
    "verifiedClaims": 4,
    "failedClaims": 1,
    "sources": ["url1", "url2", ...],
    "searchAPIsUsed": ["Google Custom Search", "Brave Search"],
    "verifications": [
      {
        "claim": "Bitcoin atingiu $100k",
        "verified": true,
        "confidence": 85,
        "sourcesCount": 5,
        "reasoning": "Verificado com 5 fontes em múltiplos provedores"
      }
    ],
    "report": "=== RELATÓRIO ===\n..."
  }
}
```

#### GET `/api/articles?category=all`

**Função:** Listar artigos do banco

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "slug": "...",
      "title": "...",
      "summary": "...",
      "content": "...",
      "category": ["Bitcoin"],
      "sentiment": "neutral",
      "keywords": ["bitcoin", "btc"],
      "factChecked": true,
      "factCheckScore": 85,
      "publishedAt": "2025-10-07T..."
    }
  ]
}
```

#### GET `/api/articles/[slug]`

**Função:** Buscar artigo específico

### 5. Script de Gerenciamento Unificado

**Script:** `create-article.sh`

**Comandos:**

```bash
./create-article.sh setup      # Primeira configuração
./create-article.sh start      # Iniciar servidor + watcher
./create-article.sh stop       # Parar tudo
./create-article.sh restart    # Reiniciar
./create-article.sh status     # Ver status e estatísticas
./create-article.sh logs       # Logs em tempo real
```

**Funcionalidades:**
- ✅ Verifica dependências (Node, NPM, Gemini CLI)
- ✅ Cria estrutura de pastas
- ✅ Aplica migrações do banco
- ✅ Gerencia PIDs dos processos
- ✅ Logs centralizados em `/tmp/`
- ✅ Graceful shutdown
- ✅ Estatísticas de artigos

---

## 📝 Formato de Artigo

### Estrutura YAML + Markdown

```markdown
---
title: "Título completo da notícia"
summary: "Resumo em 1-2 linhas"
category: bitcoin
tags: bitcoin, btc, preço, mercado
sentiment: positive
author: admin@example.com
---

# Título Principal

Conteúdo do artigo em Markdown...

## Seção 1

Texto...

---

**Fontes:**
- [Site 1](https://...)
- [Site 2](https://...)
```

### Categorias Válidas

- `bitcoin` → Bitcoin
- `ethereum` → Ethereum
- `solana` → Solana
- `defi` → DeFi
- `nfts` → NFTs
- `regulacao` → Regulação

### Sentiments

- `positive` → 🟢 Notícia otimista
- `neutral` → 🟡 Notícia neutra
- `negative` → 🔴 Notícia pessimista

---

## 🐛 Problemas Encontrados e Soluções

### Problema 1: Porta Incorreta

**Sintoma:** Erro `ECONNREFUSED` ao buscar artigos

**Causa:**
```javascript
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

Fallback usando porta 3001, mas servidor na 3000.

**Solução:** Corrigir fallback para `http://localhost:3000`

**Arquivos modificados:**
- `app/dashboard/noticias/[slug]/page.tsx` (2 ocorrências)

### Problema 2: Gemini CLI - Output Inconsistente

**Sintoma:** JSON parsing falha

**Causa:** Gemini pode retornar:
```
Aqui está o resultado:
```json
{...}
```
Espero que ajude!
```

**Solução Atual:** Regex para limpar markdown wrappers
```javascript
cleanOutput = cleanOutput.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
```

**Limitação:** Não captura todos os casos (explicações antes/depois do JSON)

**Solução Ideal (TODO):**
- Usar API do Gemini diretamente (não CLI)
- Forçar JSON mode
- Try-catch robusto com fallback

### Problema 3: Watcher Processa Arquivos 2x

**Sintoma:** Arquivo processado na inicialização + evento `add`

**Solução:**
```javascript
chokidar.watch('*.md', {
  ignoreInitial: true, // Não processar arquivos existentes automaticamente
  // ...
})
```

Arquivos existentes processados apenas após 3s + confirmação implícita.

### Problema 4: Fact-Check "Silencioso"

**Sintoma:** Usuário não sabe que APIs não estão configuradas

**Solução:** Logs claros no watcher:
```
⚠️  Fact-check pulado (APIs não configuradas)
```

**Melhorias possíveis:**
- Endpoint de health check para APIs
- Notificação no dashboard
- Email/webhook quando artigo vai para revisão

---

## 🎯 Limitações Conhecidas

### 1. Gemini CLI

❌ **Problemas:**
- Parsing inconsistente (não é JSON puro sempre)
- Dependência externa (precisa estar instalado)
- Sem controle de rate limit
- Sem tratamento de erro robusto

✅ **Solução Proposta:**
- Migrar para Gemini API oficial
- Implementar retry logic
- Fallback: publicar sem fact-check em caso de erro

### 2. "Fact-Checking" é "Source-Counting"

❌ **Problema Real:**
- Sistema conta fontes, não verifica veracidade
- Desinformação viral = muitas fontes = score alto
- Não analisa credibilidade das fontes
- Não detecta contradições entre fontes

✅ **Melhorias Propostas:**
- Whitelist de fontes confiáveis (peso maior)
- Blacklist de sites não confiáveis
- Análise de contradições (Gemini comparar claims vs fontes)
- Score de credibilidade por domínio
- Integração com fact-checking databases (Snopes, etc)

### 3. Sem Revisão Humana Obrigatória

❌ **Risco:**
- Artigos aprovados automaticamente
- Erros podem passar despercebidos
- Não há workflow de revisão

✅ **Melhorias Propostas:**
- Flag de "requer revisão humana" para scores 70-85%
- Dashboard de moderação
- Aprovação manual para categorias sensíveis
- Histórico de edições

### 4. Escalabilidade

❌ **Limitações:**
- File watching não escala além de 1 servidor
- SQLite não é ideal para produção
- Sem queue system para processamento

✅ **Melhorias para Produção:**
- Migrar para PostgreSQL
- Implementar job queue (Bull, BullMQ)
- Upload direto via API (não file system)
- Webhooks para notificações

### 5. APIs Gratuitas - Limites

**Google Custom Search:**
- 100 queries/dia = ~10 artigos/dia (10 claims cada)

**Brave Search:**
- 2000 queries/mês = ~200 artigos/mês

❌ **Problema:** Limite baixo para produção

✅ **Soluções:**
- Cache de buscas (evitar repetir queries)
- Rate limiting inteligente
- Priorização de claims (verificar apenas high importance)
- Upgrade para tiers pagos se necessário

---

## 📊 Métricas de Performance

### Tempos de Processamento

**Sem Fact-Checking:**
- Detecção arquivo: ~2s (estabilização)
- Parse + validação: <1s
- Insert no banco: <1s
- **Total: ~2-3 segundos**

**Com Fact-Checking:**
- Detecção arquivo: ~2s
- Extração claims (Gemini): ~3-5s
- Busca multi-fonte (5 claims): ~3-5s
- Cálculo score: <1s
- Insert no banco: <1s
- **Total: ~10-15 segundos**

### Consumo de Recursos

**APIs por Artigo (média):**
- Gemini: 1 request (extração)
- Google/Brave: ~10 requests (5 claims × 2 APIs)
- **Total: ~11 API calls**

**Capacidade Mensal (Free Tier):**
- Google: 100/dia × 30 = 3000 queries
- Brave: 2000 queries
- **~200-300 artigos/mês** (usando ambas APIs)

---

## 🔐 Segurança

### Implementado

✅ **Validação de Input:**
- Sanitização de frontmatter YAML
- Validação de campos obrigatórios
- Slug único (previne sobrescrita)
- Autor deve existir no banco

✅ **Armazenamento:**
- API keys em `.env` (não commitadas)
- `.gitignore` configurado
- Markdown armazenado como string (não executado)

### Pendente

⚠️ **Melhorias Necessárias:**
- [ ] Rate limiting nas APIs públicas
- [ ] CSRF protection
- [ ] Input sanitization para XSS
- [ ] Content Security Policy
- [ ] Markdown sanitization (prevenir XSS via markdown)
- [ ] API authentication (atualmente pública)

---

## 🚀 Roadmap / Melhorias Futuras

### Curto Prazo

1. **Migrar Gemini CLI → API Oficial**
   - Parsing confiável
   - JSON mode forçado
   - Melhor tratamento de erros

2. **Adicionar Testes**
   - Unit tests (services)
   - Integration tests (APIs)
   - E2E tests (workflow completo)

3. **Dashboard de Moderação**
   - Ver artigos em revisão
   - Aprovar/rejeitar manualmente
   - Histórico de fact-checks

4. **Notificações**
   - Email quando artigo vai para revisão
   - Webhook para integração externa
   - Discord/Slack notification

### Médio Prazo

5. **Melhorar Fact-Checking**
   - Whitelist de fontes confiáveis
   - Análise de contradições
   - Score de credibilidade por domínio
   - Integração com fact-checking databases

6. **Cache Inteligente**
   - Cache de buscas (Redis)
   - Reusar verificações de claims similares
   - Economizar API calls

7. **Analytics**
   - Métricas de artigos
   - Taxa de aprovação do fact-check
   - Fontes mais usadas
   - Categorias mais populares

### Longo Prazo

8. **Escalabilidade**
   - Migrar para PostgreSQL
   - Job queue (Bull)
   - Múltiplos workers
   - Upload direto via API (não file system)

9. **Multi-Idioma**
   - Suporte a PT, EN, ES
   - Tradução automática
   - Fact-checking por idioma

10. **IA Avançada**
    - Resumo automático
    - Geração de imagens (DALL-E)
    - Recomendação de tags
    - Detecção de bias/sentimento aprimorado

---

## 🧪 Como Testar

### Setup Local

```bash
# 1. Clonar e instalar dependências
npm install

# 2. Configurar .env
cp .env.example .env
# Editar .env com suas keys (opcional para fact-checking)

# 3. Setup inicial
./create-article.sh setup

# 4. Iniciar sistema
./create-article.sh start
```

### Criar Artigo de Teste

```bash
# Criar artigo simples
cat > ~/articles/teste.md <<EOF
---
title: "Teste de Artigo"
summary: "Artigo de teste"
category: bitcoin
tags: teste, bitcoin
sentiment: neutral
author: admin@example.com
---

# Teste

Conteúdo de teste.
EOF

# Verificar logs
./create-article.sh logs
```

### Testar Fact-Checking (com APIs configuradas)

```bash
# Criar artigo com claims verificáveis
cat > ~/articles/bitcoin-test.md <<EOF
---
title: "Bitcoin atinge $100k"
summary: "Bitcoin quebra recorde histórico"
category: bitcoin
tags: bitcoin, preço
sentiment: positive
author: admin@example.com
---

# Bitcoin atinge $100k

O Bitcoin atingiu $100.000 dólares hoje.
EOF

# Ver resultado do fact-check nos logs
tail -f /tmp/tokenmilagre-watcher.log
```

---

## 📈 Estatísticas de Desenvolvimento

**Tempo de Desenvolvimento:** ~8 horas

**Arquivos Criados:**
- 6 serviços backend
- 3 endpoints API
- 1 script shell gerenciamento
- 1 migration banco de dados
- 3 documentações

**Linhas de Código:** ~2500 LOC

**Tecnologias Integradas:** 8
- Next.js, Prisma, NextAuth, Gemini, Google API, Brave API, Chokidar, Bash

---

## 💭 Reflexões Técnicas

### O que funcionou bem

✅ **File watching + automação:** Workflow muito eficiente
✅ **Script unificado:** `create-article.sh` simplifica muito
✅ **Prisma:** Schema changes triviais, migrations automáticas
✅ **Next.js API Routes:** Fácil criar endpoints
✅ **Arquitetura modular:** Fácil adicionar/remover features

### O que poderia ser melhor

⚠️ **Gemini CLI:** Instável, melhor usar API oficial
⚠️ **Fact-checking simplista:** Precisa de lógica mais sofisticada
⚠️ **Sem testes:** Dificulta refatoração
⚠️ **SQLite:** Não ideal para produção
⚠️ **Sem monitoring:** Difícil debugar problemas em produção

### Lições Aprendidas

1. **"Fact-checking" real é MUITO difícil**
   - Contar fontes ≠ verificar veracidade
   - Credibilidade das fontes importa mais que quantidade
   - Contradições entre fontes são críticas

2. **Fallbacks são essenciais**
   - APIs podem falhar
   - Gemini pode retornar formato errado
   - Sistema deve funcionar mesmo sem fact-checking

3. **UX do desenvolvedor importa**
   - Script unificado elimina friction
   - Logs claros economizam tempo de debug
   - Automação end-to-end é game changer

4. **Free tiers são limitados**
   - 100 queries/dia é pouco
   - Precisa de cache inteligente
   - Ou upgrade para paid tiers

---

## 🎓 Questões para Análise Externa

### Arquitetura

1. A arquitetura atual é escalável?
2. File watching é a melhor abordagem ou deveria ser API upload?
3. SQLite é adequado ou migrar para PostgreSQL já?

### Fact-Checking

4. O algoritmo de scoring faz sentido?
5. Como melhorar detecção de desinformação viral?
6. Vale integrar APIs de fact-checking profissionais (Snopes, etc)?
7. Whitelist/blacklist de fontes é viável?

### Segurança

8. Quais são os maiores riscos de segurança?
9. Markdown user-generated precisa de sanitização?
10. APIs públicas devem ter auth?

### Performance

11. Como otimizar consumo de APIs (cache)?
12. Job queue traria benefícios?
13. Processamento paralelo de claims seria mais rápido?

### UX

14. Dashboard de moderação é necessário?
15. Notificações são úteis ou spam?
16. Usuários devem poder configurar threshold?

### Produção

17. Qual seria a melhor estratégia de deploy?
18. Monitoring e observability: o que adicionar?
19. Como fazer rollback seguro de artigos problemáticos?

---

## 📞 Conclusão

Sistema funcional para criação automática de artigos com fact-checking opcional.

**Pronto para:** Desenvolvimento, Staging, MVP

**NÃO pronto para:** Produção de alto volume sem melhorias

**Principais gaps:**
- Fact-checking simplista (conta fontes, não verifica veracidade)
- Gemini CLI instável (migrar para API)
- Sem testes automatizados
- Sem monitoring/alerting
- Limitações de free tier APIs

**Próximos passos recomendados:**
1. Testes automatizados
2. Migrar Gemini CLI → API
3. Melhorar algoritmo de fact-checking
4. Dashboard de moderação
5. Monitoring e alerting

---

**Este documento foi gerado para análise externa. Dados sensíveis foram removidos.**

**Feedback bem-vindo sobre:**
- Arquitetura
- Segurança
- Escalabilidade
- UX/DX
- Melhorias sugeridas
