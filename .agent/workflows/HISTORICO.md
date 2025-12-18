---
type: changelog
version: 1.0.0
inherits: _DNA.md
updated: 2025-12-18
---

# 📜 Changelog $MILAGRE

> Histórico de sessões de trabalho concluídas.

---


## 2025-12-18 — Refino da Home e Correção do Ticker Mobile

### Seção "Top 10 Criptomoedas"
- Layout de grid refinado para 12 colunas (melhor responsividade)
- Adicionados indicadores de variação de preço 1h, 24h e 7d
- Header padronizado com link interativo "Ver todas"

### Correção: Ticker Mobile Estático
- **Problema:** Preços no carrossel mobile do `ZenithMarketTicker` eram estáticos (hardcoded)
- **Solução:**
  - Integrado hook `useCryptoData`
  - Implementada renderização dinâmica para BTC, ETH, XRP, BNB, SOL
  - Adicionado estado de carregamento

### Otimização de API (Rate Limiting)
- Refatorado `useCryptoData` para padrão **Singleton**
- Implementado **Throttling Global** de 60s entre requisições
- Deduplicação de chamadas simultâneas para evitar erro 429 da CoinGecko

### Melhorias Visuais
- Padronizados headers de todas as seções (Link+Arrow pattern)
- Transição de tema suavizada para 0.5s (cubic-bezier)

---

## 2025-12-17 — Incidente Prisma Schema

### ⚠️ Lição Aprendida: NUNCA usar `prisma db pull` em produção/desenvolvimento

**O que aconteceu:**
- Ao investigar conexão com banco de dados, foi executado `prisma db pull --force`
- O comando **sobrescreveu o schema local** com schema bruto do banco
- Removeu aliases customizados (ex: `author` → `User`)
- API retornou erro 500: "Unknown field `author` for include statement"

**Solução aplicada:**
```bash
git checkout -- prisma/schema.prisma  # Reverter schema
npx prisma generate                   # Regenerar client
# Reiniciar servidor
```

**Regra para IAs:**
> ❌ `prisma db pull` — Sobrescreve customizações locais
> ✅ `prisma db push` — Aplica schema local no banco
> ✅ `prisma generate` — Regenera client com schema local

### Fix: server-manager.sh path incorreto
- Script em `/home/zenfoco/$Milagre/server-manager.sh` apontava para caminho antigo
- Corrigido: `PROJECT_DIR='/home/zenfoco/LLM/...'` → `'/home/zenfoco/$Milagre/...'`

---

## 2025-12-15 — Refatoração Agent System

- Criado sistema de Agents especializados (`ARQUITETO`, `CONTEUDO`, etc.)
- Implementado `_DNA.md` como núcleo herdado por todos
- Criado `_INDEX.md` como registry central

---

## 2025-12-13 — Article Creation Workflow

### Bugs Corrigidos
| Bug | Solução |
|-----|---------|
| Categoria `exchanges` rejeitada | Expandido para 27 categorias |
| Sentimento sempre "neutral" | Prompt alterado para fato principal |
| Excerpt > 160 chars bloqueava | Auto-truncate antes da validação |

### Limpeza de Código (-294 linhas)
- Removido `CATEGORY_FALLBACK_MAP`
- Removida API `process-news`
- Unificado `generateSlug` em `lib/shared/utils/slug-utils.ts`

---

## 2025-12-12 — Theme System v2.1

### Multi-Theme Consolidado
- Implementados temas Ocean, Forest, Sunset (posteriormente revertidos)
- Consolidado para apenas Light/Dark
- Adicionados 50+ tokens CSS

### Auditoria de Temas
- 158+ hardcodes identificados
- Widgets TradingView com tema dinâmico
- ESLint rule `theme/no-hardcoded-colors`

---

## 2025-12-11 — Theme System v2.0

### Solidificação
- 30+ testes unitários (`ThemeProvider.test.tsx`)
- JSDoc completo em todas as funções
- Detecção de preferência do sistema

### Performance
- GlobalBackground otimizado: 89 → 35 linhas (-60%)
- CSS-only approach (3x mais rápido)

### Gráficos
- Criado `BinanceDataContext` (fetch único)
- Fix: gráfico desaparecendo ao mudar tema

---

## 2025-12-11 — Drag-and-Drop

- Implementado `@dnd-kit` em:
  - Sessões da Home
  - Cards de capitalização
  - Botões "Comece por Aqui"
  - Menu lateral
- Botão "Restaurar Padrão" no footer

---

## 2025-12-10 — Filosofia de Prosperidade

- Reformulado valor "Propósito"
- Nova constante `PROSPERITY_PHILOSOPHY`
- 6 princípios de prosperidade ética

---

## 2025-12-09 — Infraestrutura

- Fix: `reflect-metadata` polyfill
- Fix: `AdminRoute` usando role do DB
- Server Manager atualizado

---

## 2025-12-07/08 — Refatoração Fractal

### Fase 1
- Quebrado `useAdminChat.ts`: 1018 → 270 linhas (-74%)
- Organizado `components/` por domínio (34 componentes)
- Quebrado `layout-root.tsx`: 591 → 220 linhas (-63%)

### Fase 2
- Criado `lib/domains/` (articles, users, resources, crypto, admin-chat)
- Migrados serviços e schemas para domínios
- Registry central em `lib/domains/index.ts`

### Fase 3 (Zen Garden)
- 100% aderência fractal
- Facades removidos
- `lib/core/` consolidado

---

```yaml
@agi-metadata:
  inherits: _DNA.md
  purpose: historical-record
```
