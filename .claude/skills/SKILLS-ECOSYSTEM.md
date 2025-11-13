# 🌐 Token Milagre Skills Ecosystem

**Versão:** 1.0.0
**Data:** 2025-11-13
**Propósito:** Arquitetura completa e navegação do ecossistema de skills do projeto

---

## 🎯 Visão Geral

O Token Milagre Platform possui **22 skills** organizadas em **5 categorias**, formando um ecossistema integrado de conhecimento. Este documento mapeia todas as relações, dependências e fluxos de uso.

### 📊 Estatísticas

- **Total de Skills:** 22
- **Categorias:** 5 (Meta, Core, Features, Project-Specific, Audit)
- **Interligações Documentadas:** 156 referências cruzadas
- **Hub Central:** `project-context` (conecta todas)
- **GPS de Navegação:** `skills-navigator`

---

## 🗺️ Mapa Visual do Ecossistema

```
                     ┌──────────────────────┐
                     │  PROJECT-CONTEXT     │
                     │   (Hub Central)      │
                     └──────────┬───────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
         [META: 2]          [CORE: 4]       [FEATURES: 8]
              │                 │                 │
    ┌─────────┴────────┐  ┌────┴────┐  ┌─────────┴──────────┐
    │                  │  │         │  │                    │
skills-navigator  project-  database testing  article-    chat-
                  manager-  refactor scripts  workflow  workflow
                  brutal-                         │         │
                  honesty                    ┌────┴────┐    │
                                             │         │    │
                                         citations content- api-
                                                    quality integr.
                                                        │
                                                   ┌────┴────┐
                                                   │         │
                                              copilot-  component-
                                               tools    patterns
    
    ┌───────────────────────────────┐        ┌──────────────────┐
    │  [PROJECT-SPECIFIC: 4]        │        │   [AUDIT: 4]     │
    │                               │        │                  │
    │  design-system                │        │  platform-audit  │
    │  pages-reference              │        │  troubleshooting │
    │  url-security                 │        │  due-diligence   │
    │  server-manager               │        │  database-setup  │
    └───────────────────────────────┘        └──────────────────┘
```

---

## 📋 Índice Por Categoria

### 🎯 Meta (_meta/) - 2 skills

Controlam comportamento e filosofia do projeto:

| Skill | Descrição | Quando Usar |
|-------|-----------|-------------|
| **project-context** | Guidelines essenciais, regras críticas, stack, workflow | ⭐ SEMPRE no início de TODA conversa |
| **skills-navigator** | GPS de navegação - identifica skills necessárias | ⭐ Antes de iniciar qualquer tarefa |
| **project-manager-brutal-honesty** | Modo gerente realista - estimativas conservadoras | Decisões estratégicas, priorização |

### ⚙️ Core (core/) - 4 skills

Fundamentos técnicos da plataforma:

| Skill | Descrição | Quando Usar |
|-------|-----------|-------------|
| **tokenmilagre-database** | Prisma schema, migrations, Supabase | Modificar schema, queries, migrations |
| **tokenmilagre-refactoring** | Type safety, metodologia de refactoring | Reduzir 'any', melhorar código |
| **tokenmilagre-testing** | Testing strategies (unit, integration, E2E) | Criar testes, debugar failures |
| **tokenmilagre-scripts** | Automation scripts, bulk processing | Criar ferramentas admin |

### 🎨 Features (features/) - 8 skills

Funcionalidades específicas do produto:

| Skill | Descrição | Quando Usar |
|-------|-----------|-------------|
| **tokenmilagre-article-workflow** | Perplexity → Gemini → Publicação | Criar artigos com IA |
| **article-creation** | Templates, checklists, scripts | Estrutura de artigos |
| **tokenmilagre-citations** | Citation management, fact-checking | Gerenciar fontes, validar |
| **tokenmilagre-content-quality** | SEO, readability, quality metrics | Validar qualidade |
| **tokenmilagre-api-integrations** | Perplexity, Gemini, Binance, CoinGecko | Integrar APIs externas |
| **tokenmilagre-copilot-tools** | Admin AI tools development | Criar ferramentas copilot |
| **chat-workflow** | Sistema chat IA /dashboard/criar-artigo | Arquitetura do chat |
| **tokenmilagre-component-patterns** | Refactoring de componentes React | Componentes >500 linhas |

### 🏗️ Project-Specific (project-specific/) - 4 skills

Conhecimento específico da plataforma:

| Skill | Descrição | Quando Usar |
|-------|-----------|-------------|
| **design-system** | CSS variables, cores, spacing, tema | Estilização, UI consistency |
| **pages-reference** | Info detalhada sobre páginas | Modificar páginas específicas |
| **tokenmilagre-url-security** | Proteção links maliciosos | Adicionar validação URLs |
| **server-manager** | Scripts de gerenciamento servidor | Start/stop/logs servidor |

### 🔍 Audit (audit/) - 4 skills

Auditoria, troubleshooting e histórico:

| Skill | Descrição | Quando Usar |
|-------|-----------|-------------|
| **platform-audit** | Checklist auditoria trimestral | Auditoria completa |
| **troubleshooting** | Histórico de 1286 linhas de problemas | Debugar problemas |
| **due-diligence-report** | Análise estratégica CSO + Blockchain | Análise de negócio |
| **database-setup** | Referência histórica configuração DB | Contexto histórico |

---

## 🔗 Matriz de Dependências

### Nível 1: Skills Fundacionais (Ler Primeiro)

```
project-context ────┬──── skills-navigator
                    │
                    ├──── project-manager-brutal-honesty
                    │
                    └──── design-system
```

**Uso:** Toda tarefa começa aqui.

### Nível 2: Skills de Infraestrutura

```
tokenmilagre-database ───┬──── database-setup
                         │
tokenmilagre-testing ────┤
                         │
tokenmilagre-refactoring ┤
                         │
tokenmilagre-scripts ────┘
```

**Uso:** Modificações técnicas profundas.

### Nível 3: Skills de Features

```
tokenmilagre-article-workflow ───┬──── article-creation
                                 │
                                 ├──── tokenmilagre-citations
                                 │
                                 ├──── tokenmilagre-content-quality
                                 │
                                 └──── tokenmilagre-api-integrations
                                           │
                                           ├──── chat-workflow
                                           │
                                           └──── tokenmilagre-copilot-tools
```

**Uso:** Desenvolvimento de funcionalidades.

### Nível 4: Skills de Suporte

```
pages-reference ───┬──── design-system
                   │
server-manager ────┤
                   │
url-security ──────┘
```

**Uso:** Tarefas específicas isoladas.

### Nível 5: Skills de Auditoria

```
troubleshooting ───┬──── platform-audit
                   │
                   ├──── due-diligence-report
                   │
                   └──── Todas as skills (referência)
```

**Uso:** Debugging, análise, auditoria.

---

## 🔍 Navegação Por Tarefa

### Por Tipo de Trabalho

#### 🎨 UI/UX Development
1. **Criar nova página:**
   - `pages-reference` → Ver estrutura
   - `design-system` → Seguir padrões
   - `tokenmilagre-component-patterns` → Componentes reutilizáveis

2. **Estilizar componentes:**
   - `design-system` (SEMPRE)
   - `pages-reference` (contexto)

3. **Refatorar componente grande:**
   - `tokenmilagre-component-patterns`
   - `tokenmilagre-refactoring`
   - `tokenmilagre-testing`

#### 📝 Content Creation
1. **Criar artigo educacional:**
   - `tokenmilagre-article-workflow` (fluxo completo)
   - `article-creation` (templates)
   - `tokenmilagre-api-integrations` (Perplexity/Gemini)
   - `tokenmilagre-citations` (fontes)
   - `tokenmilagre-content-quality` (validação)

2. **Melhorar qualidade de conteúdo:**
   - `tokenmilagre-content-quality`
   - `tokenmilagre-citations`

3. **Implementar chat IA:**
   - `chat-workflow`
   - `tokenmilagre-api-integrations`

#### 🗄️ Database Work
1. **Modificar schema:**
   - `tokenmilagre-database` (Prisma)
   - `database-setup` (deployment)
   - `tokenmilagre-testing` (validar)

2. **Otimizar queries:**
   - `tokenmilagre-database`
   - `troubleshooting` (problemas comuns)

3. **Migrar dados:**
   - `tokenmilagre-scripts`
   - `tokenmilagre-database`
   - `database-setup`

#### 🔌 API Integration
1. **Integrar nova API:**
   - `tokenmilagre-api-integrations` (patterns)
   - `tokenmilagre-testing` (testes)
   - `troubleshooting` (erros comuns)

2. **Usar Perplexity/Gemini:**
   - `tokenmilagre-article-workflow`
   - `tokenmilagre-api-integrations`
   - `chat-workflow`

#### 🧪 Testing & Quality
1. **Adicionar testes:**
   - `tokenmilagre-testing`
   - Skill da feature específica

2. **Refatorar código:**
   - `tokenmilagre-refactoring`
   - `tokenmilagre-testing`
   - `tokenmilagre-component-patterns` (se React)

3. **Auditoria completa:**
   - `platform-audit`
   - `troubleshooting`
   - `due-diligence-report`

#### 🚀 Deploy & Ops
1. **Gerenciar servidor local:**
   - `server-manager`
   - `troubleshooting`

2. **Deploy de mudanças:**
   - `tokenmilagre-database` (migrations)
   - `server-manager` (restart)

3. **Debugging de produção:**
   - `troubleshooting` (SEMPRE PRIMEIRO)
   - Skill específica da área
   - `platform-audit` (se recorrente)

---

## 📊 Skills Por Frequência de Uso

### Uso Diário (80% das tarefas)
- ⭐⭐⭐ `project-context` - Todo início de conversa
- ⭐⭐⭐ `skills-navigator` - Toda tarefa nova
- ⭐⭐ `design-system` - Todo trabalho UI
- ⭐⭐ `tokenmilagre-database` - Queries frequentes
- ⭐⭐ `troubleshooting` - Debug constante

### Uso Semanal (15% das tarefas)
- ⭐ `tokenmilagre-article-workflow` - Criação de conteúdo
- ⭐ `tokenmilagre-refactoring` - Code quality
- ⭐ `tokenmilagre-testing` - Implementação de testes
- ⭐ `pages-reference` - Modificações de páginas
- ⭐ `tokenmilagre-api-integrations` - Trabalho com APIs

### Uso Mensal (4% das tarefas)
- `platform-audit` - Auditoria trimestral
- `server-manager` - Setup/troubleshooting
- `tokenmilagre-scripts` - Automação nova
- `tokenmilagre-copilot-tools` - Novas ferramentas
- `tokenmilagre-component-patterns` - Refatoração grande

### Uso Ocasional (1% das tarefas)
- `due-diligence-report` - Análise estratégica
- `database-setup` - Setup inicial/migração
- `tokenmilagre-url-security` - Implementação única
- `project-manager-brutal-honesty` - Decisões críticas
- `article-creation` - Setup inicial
- `chat-workflow` - Modificações do chat

---

## 🏷️ Sistema de Tags

Todas as skills possuem tags para busca rápida:

### Por Tecnologia
- **`prisma`**: database, database-setup, refactoring
- **`react`**: component-patterns, pages-reference, design-system
- **`ai`**: article-workflow, api-integrations, chat-workflow, copilot-tools, citations
- **`typescript`**: refactoring, testing, database
- **`bash`**: server-manager, scripts

### Por Domínio
- **`content`**: article-workflow, article-creation, citations, content-quality
- **`ui`**: design-system, pages-reference, component-patterns
- **`database`**: tokenmilagre-database, database-setup
- **`quality`**: testing, refactoring, content-quality, platform-audit
- **`infra`**: server-manager, database-setup, scripts

### Por Ação
- **`create`**: article-creation, copilot-tools
- **`analyze`**: due-diligence, platform-audit, troubleshooting
- **`optimize`**: refactoring, database (queries), content-quality
- **`integrate`**: api-integrations, chat-workflow
- **`manage`**: server-manager, database, scripts

---

## 📈 Métricas de Interligação

| Skill | Referencias | É Referenciada | Score |
|-------|-------------|----------------|-------|
| project-context | 21 | 21 | 100% |
| skills-navigator | 0 | 21 | 95% |
| troubleshooting | 5 | 8 | 59% |
| tokenmilagre-database | 1 | 7 | 36% |
| tokenmilagre-api-integrations | 0 | 6 | 27% |
| platform-audit | 6 | 2 | 36% |
| design-system | 1 | 5 | 27% |
| due-diligence-report | 4 | 1 | 23% |
| tokenmilagre-article-workflow | 3 | 3 | 27% |
| tokenmilagre-citations | 2 | 3 | 23% |
| tokenmilagre-content-quality | 3 | 2 | 23% |
| article-creation | 4 | 1 | 23% |
| database-setup | 3 | 4 | 32% |
| pages-reference | 1 | 3 | 18% |
| tokenmilagre-testing | 2 | 3 | 23% |
| tokenmilagre-refactoring | 1 | 3 | 18% |
| tokenmilagre-component-patterns | 0 | 2 | 9% |
| chat-workflow | 1 | 2 | 14% |
| tokenmilagre-copilot-tools | 1 | 1 | 9% |
| server-manager | 0 | 1 | 5% |
| tokenmilagre-scripts | 0 | 1 | 5% |
| tokenmilagre-url-security | 0 | 0 | 0% |
| project-manager-brutal-honesty | 0 | 1 | 5% |

---

## 🔄 Fluxos de Trabalho Comuns

### Fluxo 1: Nova Feature Completa

```
1. project-context (contexto)
   ↓
2. skills-navigator (identificar skills)
   ↓
3. design-system (UI patterns)
   ↓
4. tokenmilagre-database (schema changes)
   ↓
5. Skill da feature (implementação)
   ↓
6. tokenmilagre-testing (testes)
   ↓
7. troubleshooting (se houver problemas)
```

### Fluxo 2: Criar Artigo Educacional

```
1. tokenmilagre-article-workflow (fluxo completo)
   ↓
2. tokenmilagre-api-integrations (Perplexity prompt)
   ↓
3. article-creation (estrutura/template)
   ↓
4. tokenmilagre-citations (fontes/fact-check)
   ↓
5. tokenmilagre-content-quality (validação)
   ↓
6. design-system (formatação final)
```

### Fluxo 3: Debugging de Problema

```
1. troubleshooting (problema já conhecido?)
   ↓
2. Skill da área específica (contexto)
   ↓
3. tokenmilagre-database OU api-integrations (se aplicável)
   ↓
4. platform-audit (se problema recorrente)
   ↓
5. Documentar em troubleshooting (novo aprendizado)
```

### Fluxo 4: Refatoração de Código

```
1. tokenmilagre-refactoring (metodologia)
   ↓
2. tokenmilagre-component-patterns (se React) OU tokenmilagre-database (se queries)
   ↓
3. tokenmilagre-testing (garantir não quebrou nada)
   ↓
4. design-system (se mudou UI)
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

### Para Claude AI:
1. **Início de conversa:** Leia `project-context` primeiro
2. **Nova tarefa:** Consulte `skills-navigator` para identificar skills
3. **Dúvida sobre arquitetura:** Use este documento (SKILLS-ECOSYSTEM)
4. **Debugging:** Sempre consulte `troubleshooting` antes de perguntar

### Para Desenvolvedores:
1. **Onboarding:** Leia `project-context` → `skills-navigator` → este documento
2. **Tarefa específica:** Use a seção "Navegação Por Tarefa"
3. **Busca rápida:** Ctrl+F no índice alfabético ou tags
4. **Contribuir:** Ao criar nova skill, atualize SKILLS-RELATIONSHIPS.json

### Para Manutenção:
1. **Nova skill criada:** 
   - Atualizar SKILLS-RELATIONSHIPS.json
   - Rodar `generate-templates.py`
   - Atualizar este documento (métricas e mapa)
2. **Skill removida:**
   - Atualizar SKILLS-RELATIONSHIPS.json
   - Remover de todos os índices
3. **Relação alterada:**
   - Modificar SKILLS-RELATIONSHIPS.json
   - Regenerar templates

---

**Última Atualização:** 2025-11-13  
**Mantido Por:** Claude Code + Equipe Token Milagre  
**Versão:** 1.0.0
