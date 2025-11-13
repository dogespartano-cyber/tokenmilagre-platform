# 🌐 Token Milagre Skills Ecosystem

**Versão:** 1.0.1 (Otimizado)
**Data:** 2025-11-13
**Propósito:** Mapa arquitetural do ecossistema de 23 skills

---

## ⚡ TL;DR (30 segundos)

**Problema:** 23 skills sem navegação clara
**Solução:** GPS interativo ([skills-navigator](./_meta/skills-navigator/SKILL.md))
**Como usar:**
1. Abra skills-navigator
2. Escolha categoria de tarefa (A-I)
3. Siga ordem de leitura recomendada

**Ponto de entrada:** Sempre use `skills-navigator` ANTES de qualquer tarefa.

---

## 🗺️ Mapa Visual

```
                     ┌──────────────────────┐
                     │  PROJECT-CONTEXT     │
                     │   (Hub Central)      │
                     └──────────┬───────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
         [META: 3]          [CORE: 4]       [FEATURES: 8]
              │                 │                 │
    ┌─────────┴────────┐  ┌────┴────┐  ┌─────────┴──────────┐
    │                  │  │         │  │                    │
skills-navigator  project-  database testing  article-    chat-
   (GPS)         manager   refactor scripts  workflow  workflow
                  brutal                         │         │
                                             citations content
                                                      quality
                                                        │
                                                   api-integr.
                                                   copilot
                                                   components

    ┌───────────────────────────────┐        ┌──────────────────┐
    │  [PROJECT-SPECIFIC: 4]        │        │   [AUDIT: 4]     │
    │                               │        │                  │
    │  design-system                │        │  troubleshooting │
    │  pages-reference              │        │  platform-audit  │
    │  url-security                 │        │  due-diligence   │
    │  server-manager               │        │  database-setup  │
    └───────────────────────────────┘        └──────────────────┘
```

---

## 📋 Índice Por Categoria

### 🎯 Meta (_meta/) - 3 skills
| Skill | Quando Usar |
|-------|-------------|
| **project-context** ⭐ | Início de TODA conversa |
| **skills-navigator** ⭐ | Antes de qualquer tarefa |
| **project-manager-brutal-honesty** | Decisões estratégicas |

### ⚙️ Core (core/) - 4 skills
| Skill | Quando Usar |
|-------|-------------|
| **tokenmilagre-database** | Schema, queries, migrations |
| **tokenmilagre-refactoring** | Type safety, reduzir 'any' |
| **tokenmilagre-testing** | Criar/debugar testes |
| **tokenmilagre-scripts** | Automação, bulk processing |

### 🎨 Features (features/) - 8 skills
| Skill | Quando Usar |
|-------|-------------|
| **tokenmilagre-article-workflow** | Criar artigos com IA |
| **article-creation** | Templates de artigos |
| **tokenmilagre-citations** | Gerenciar fontes |
| **tokenmilagre-content-quality** | Validar qualidade |
| **tokenmilagre-api-integrations** | APIs externas |
| **tokenmilagre-copilot-tools** | Ferramentas admin |
| **chat-workflow** | Sistema chat IA |
| **tokenmilagre-component-patterns** | Refactoring React |

### 🏗️ Project-Specific (project-specific/) - 4 skills
| Skill | Quando Usar |
|-------|-------------|
| **design-system** | CSS, cores, spacing |
| **pages-reference** | Modificar páginas |
| **tokenmilagre-url-security** | Validação URLs |
| **server-manager** | Start/stop servidor |

### 🔍 Audit (audit/) - 4 skills
| Skill | Quando Usar |
|-------|-------------|
| **troubleshooting** | Debugar problemas |
| **platform-audit** | Auditoria trimestral |
| **due-diligence-report** | Análise estratégica |
| **database-setup** | Contexto histórico DB |

---

## 🔍 Navegação Por Tarefa

### 🎨 Trabalho de Interface
- **Nova página:** pages-reference → design-system → component-patterns
- **Estilizar:** design-system (obrigatória)
- **Refatorar componente:** component-patterns → refactoring → testing

### 📝 Criação de Conteúdo
- **Artigo completo:** article-workflow → api-integrations → article-creation → citations → content-quality
- **Melhorar qualidade:** content-quality → citations
- **Chat IA:** chat-workflow → api-integrations

### 🗄️ Banco de Dados
- **Modificar schema:** tokenmilagre-database → database-setup → testing
- **Otimizar queries:** tokenmilagre-database → troubleshooting
- **Migração:** scripts → tokenmilagre-database → database-setup

### 🔌 APIs
- **Nova API:** api-integrations → testing → troubleshooting
- **Perplexity/Gemini:** article-workflow → api-integrations

### 🧪 Testes & Qualidade
- **Adicionar testes:** testing + skill da feature
- **Refatorar:** refactoring → testing
- **Auditoria:** platform-audit → troubleshooting → due-diligence

### 🚀 Deploy & Ops
- **Servidor local:** server-manager → troubleshooting
- **Deploy DB:** tokenmilagre-database → database-setup → server-manager
- **Debug produção:** troubleshooting → skill específica → platform-audit

---

## 🔗 Matriz de Dependências

### Nível 1: Fundacionais (ler primeiro)
- `project-context` → `skills-navigator` → `design-system`

### Nível 2: Infraestrutura
- `tokenmilagre-database` ↔ `database-setup`
- `tokenmilagre-testing`, `tokenmilagre-refactoring`, `tokenmilagre-scripts`

### Nível 3: Features
- `article-workflow` → `article-creation`, `citations`, `content-quality`, `api-integrations`
- `api-integrations` → `chat-workflow`, `copilot-tools`

### Nível 4: Suporte
- `pages-reference` ↔ `design-system`
- `server-manager`, `url-security`

### Nível 5: Auditoria
- `troubleshooting` → `platform-audit`, `due-diligence-report`

---

## 📊 Skills Por Frequência

### Uso Diário (80% das tarefas)
- ⭐⭐⭐ `project-context`, `skills-navigator`
- ⭐⭐ `design-system`, `tokenmilagre-database`, `troubleshooting`

### Uso Semanal (15% das tarefas)
- ⭐ `article-workflow`, `refactoring`, `testing`, `pages-reference`, `api-integrations`

### Uso Mensal (4% das tarefas)
- `platform-audit`, `server-manager`, `scripts`, `copilot-tools`, `component-patterns`

### Uso Ocasional (1% das tarefas)
- `due-diligence-report`, `database-setup`, `url-security`, `project-manager-brutal-honesty`, `article-creation`, `chat-workflow`

---

## 🏷️ Busca por Tag

### Por Tecnologia
- **Prisma:** database, database-setup, refactoring
- **React:** component-patterns, pages-reference, design-system
- **AI:** article-workflow, api-integrations, chat-workflow, copilot-tools
- **TypeScript:** refactoring, testing, database

### Por Domínio
- **Content:** article-workflow, article-creation, citations, content-quality
- **UI:** design-system, pages-reference, component-patterns
- **Database:** tokenmilagre-database, database-setup
- **Quality:** testing, refactoring, content-quality, platform-audit

### Por Ação
- **Create:** article-creation, copilot-tools
- **Analyze:** due-diligence, platform-audit, troubleshooting
- **Optimize:** refactoring, database, content-quality
- **Integrate:** api-integrations, chat-workflow

---

## 📈 Métricas de Interligação

| Skill | Score | Nível |
|-------|-------|-------|
| project-context | 100% | Hub central |
| skills-navigator | 95% | GPS principal |
| troubleshooting | 59% | Muito usado |
| tokenmilagre-database | 36% | Alta interligação |
| tokenmilagre-api-integrations | 27% | Média interligação |

---

## 🔄 Fluxos de Trabalho

### Nova Feature Completa
```
project-context → skills-navigator → design-system →
tokenmilagre-database → Skill da feature → testing → troubleshooting
```

### Criar Artigo
```
article-workflow → api-integrations → article-creation →
citations → content-quality → design-system
```

### Debugging
```
troubleshooting → Skill da área →
tokenmilagre-database/api-integrations → platform-audit
```

### Refatoração
```
refactoring → component-patterns/tokenmilagre-database →
testing → design-system
```

---

## 📚 Índice Alfabético

- `article-creation` → features/
- `chat-workflow` → features/
- `database-setup` → audit/ (histórico)
- `design-system` → project-specific/
- `due-diligence-report` → audit/
- `pages-reference` → project-specific/
- `platform-audit` → audit/
- `project-context` → _meta/ ⭐
- `project-manager-brutal-honesty` → _meta/
- `server-manager` → project-specific/
- `skills-navigator` → _meta/ ⭐
- `tokenmilagre-api-integrations` → features/
- `tokenmilagre-article-workflow` → features/
- `tokenmilagre-citations` → features/
- `tokenmilagre-component-patterns` → features/
- `tokenmilagre-content-quality` → features/
- `tokenmilagre-copilot-tools` → features/
- `tokenmilagre-database` → core/
- `tokenmilagre-refactoring` → core/
- `tokenmilagre-scripts` → core/
- `tokenmilagre-testing` → core/
- `tokenmilagre-url-security` → project-specific/
- `troubleshooting` → audit/

---

## 🎯 Como Usar Este Documento

**Para Claude:**
1. Leia `project-context` primeiro
2. Use `skills-navigator` para identificar skills
3. Consulte este documento para visão arquitetural

**Para Desenvolvedores:**
1. Onboarding: `project-context` → `skills-navigator` → este documento
2. Tarefa específica: Use seção "Navegação Por Tarefa"
3. Busca rápida: Ctrl+F no índice alfabético

**Para Manutenção:**
1. Nova skill: Atualizar índices e mapa visual
2. Skill removida: Atualizar todas referências
3. Relação alterada: Atualizar matriz de dependências

---

**Última Atualização:** 2025-11-13
**Versão:** 1.0.1 (Otimizado - cortado 50%)
**Mantido Por:** Claude Code + Equipe Token Milagre
