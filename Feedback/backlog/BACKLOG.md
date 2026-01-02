---
type: backlog
version: 2.0.0
inherits: _DNA.md
updated: 2025-12-31
---

# 📋 Backlog $MILAGRE

> Tarefas pendentes organizadas por prioridade + Kanban visual.

---

## 🎯 Kanban Rápido

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   BACKLOG   │   TO DO     │ IN PROGRESS │   REVIEW    │    DONE     │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Gamificação │ SEO Schema  │             │             │ Chaos MVP   │
│ Newsletter  │             │             │             │ Graphiti    │
│ PWA         │             │             │             │ UI Standard │
│ OpenAPI     │             │             │             │ Zenith Refac│
│             │             │             │             │ Unit Tests  │
│             │             │             │             │ Agent Opt.  │
│             │             │             │             │ Mobile Check│
│             │             │             │             │ Agent Gov   │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

**Legenda:** Mova tarefas editando a tabela acima.

---

## 🔜 Prioridade Alta

### SEO (Schema.org)

> **Origem:** Adiado da Fase 4 de Refinamento Educacional (13/12/2025)

**Objetivo:** Implementar dados estruturados (JSON-LD) para rich snippets.

#### Detalhes Técnicos

1. **Componente Global:** `JsonLd.tsx` reutilizável
2. **Schema de Artigo (`/educacao/[slug]`):**
   - `headline`, `description`, `author`, `datePublished`, `dateModified`, `image`
3. **Schema de Lista/Curso (`/educacao`):**
   - Trilhas como `Course` ou `ItemList`

**Arquivos:**
- `[NEW] app/components/seo/JsonLd.tsx`
- `[MODIFY] app/educacao/[slug]/page.tsx`
- `[MODIFY] app/educacao/page.tsx`

---

## 🟡 Prioridade Média

### Marketing & Comunidade

- [ ] **X/Twitter** (@TokenMilagre) - Threads educacionais, divulgação automática
- [ ] **YouTube/Shorts** - Tutoriais e análises de mercado

### Funcionalidades

- [ ] **Sistema de Gamificação** - XP, badges, leaderboard
- [ ] **Newsletter** - Resumo semanal, alertas de mercado
- [ ] **PWA completo** - Push notifications, offline mode

### Documentação

- [ ] **OpenAPI spec** - `next-swagger-doc` ou `@asteasolutions/zod-to-openapi`
- [ ] **Visual regression tests** - Playwright

---

## 🔴 Prioridade Baixa / Futuro

### Web3 & Token

- [ ] **Smart Contract $MILAGRE** - ERC-20/SPL (requer decisão estratégica)
- [ ] **DAO para Governança** - Snapshot.org
- [ ] **NFT Badges** - Certificados on-chain
- [ ] **Integração com Wallets** - Phantom, MetaMask

### Técnico

- [ ] **Migração String→Json** - campos Prisma (tags, features, pros, cons)
- [ ] **i18n** - expansão global
- [ ] **ESLint rule** - proibir cores hardcoded

---

## 💡 Como usar este arquivo

1. **Adicionar:** Coloque na seção apropriada com `[ ]`
2. **Em progresso:** Mude para `[/]`
3. **Concluída:** Mova para `CHANGELOG.md` com data

```yaml
@agi-metadata:
  inherits: _DNA.md
  purpose: task-tracking
```
