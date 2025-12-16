---
type: changelog
version: 1.0.0
inherits: _DNA.md
updated: 2025-12-16
---

# 📜 Changelog $MILAGRE

> Histórico de sessões de trabalho concluídas.

---

## 2025-12-15 — Refatoração Agent System

- Criado sistema de Agents especializados (`ARCHITECT_ZERO`, `CONTENT_ARCHITECT`, etc.)
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
