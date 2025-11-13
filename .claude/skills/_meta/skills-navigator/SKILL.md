---
name: skills-navigator
description: "🧭 GPS de navegação inteligente do ecossistema de skills. SEMPRE consulte esta skill ANTES de iniciar qualquer tarefa para identificar quais skills você precisa ler. Funciona como assistente de decisão que mapeia sua tarefa → skills relevantes → ordem de leitura."
triggers:
  - "qual skill"
  - "que skill"
  - "onde encontro"
  - "como fazer"
  - "preciso implementar"
  - "quero criar"
  - "não sei por onde começar"
version: 1.0.0
---

# 🧭 Skills Navigator - GPS do Ecossistema

**Versão:** 1.0.0
**Propósito:** Guia inteligente para identificar quais skills você precisa consultar para qualquer tarefa

---

## 🎯 Como Usar Esta Skill

### Para Claude AI:
**SEMPRE consulte esta skill ANTES de iniciar qualquer tarefa** para identificar:
1. Quais skills você precisa ler
2. Em que ordem lê-las
3. Quais são opcionais vs obrigatórias

### Para Usuários:
- Não sabe qual skill consultar? Comece aqui!
- Encontre rapidamente a skill certa para sua necessidade

---

## 🗺️ Navegação por Categoria de Tarefa

### A. 🎨 Trabalho de Interface (UI/UX)

#### A1. Criar nova página
**Skills necessárias (nesta ordem):**
1. [`project-context`](../project-context/SKILL.md) - Regras e guidelines
2. [`pages-reference`](../../project-specific/pages-reference/SKILL.md) - Ver estrutura de páginas existentes
3. [`design-system`](../../project-specific/design-system/SKILL.md) - Padrões visuais obrigatórios
4. [`tokenmilagre-component-patterns`](../../features/tokenmilagre-component-patterns/SKILL.md) - Componentes reutilizáveis

**Opcionais:**
- [`tokenmilagre-testing`](../../core/tokenmilagre-testing/SKILL.md) - Se precisar criar testes
- [`troubleshooting`](../../audit/troubleshooting/SKILL.md) - Se encontrar problemas

#### A2. Estilizar componentes
**Skills necessárias:**
1. [`design-system`](../../project-specific/design-system/SKILL.md) ⭐ OBRIGATÓRIA

**Opcionais:**
- [`pages-reference`](../../project-specific/pages-reference/SKILL.md) - Contexto da página
- [`tokenmilagre-component-patterns`](../../features/tokenmilagre-component-patterns/SKILL.md) - Padrões de componentes

#### A3. Refatorar componente React grande (>500 linhas)
**Skills necessárias (nesta ordem):**
1. [`tokenmilagre-component-patterns`](../../features/tokenmilagre-component-patterns/SKILL.md) - Estratégias de quebra
2. [`tokenmilagre-refactoring`](../../core/tokenmilagre-refactoring/SKILL.md) - Metodologia geral
3. [`tokenmilagre-testing`](../../core/tokenmilagre-testing/SKILL.md) - Garantir que não quebrou
4. [`design-system`](../../project-specific/design-system/SKILL.md) - Manter consistência visual

---

### B. 📝 Criação de Conteúdo

#### B1. Criar artigo educacional completo
**Skills necessárias (nesta ordem):**
1. [`project-context`](../project-context/SKILL.md) - Entender filosofia do conteúdo
2. [`tokenmilagre-article-workflow`](../../features/tokenmilagre-article-workflow/SKILL.md) - Fluxo completo Perplexity → Gemini
3. [`tokenmilagre-api-integrations`](../../features/tokenmilagre-api-integrations/SKILL.md) - Usar Perplexity/Gemini
4. [`article-creation`](../../features/article-creation/SKILL.md) - Templates e estrutura
5. [`tokenmilagre-citations`](../../features/tokenmilagre-citations/SKILL.md) - Gerenciar fontes
6. [`tokenmilagre-content-quality`](../../features/tokenmilagre-content-quality/SKILL.md) - Validar qualidade

**Opcionais:**
- [`design-system`](../../project-specific/design-system/SKILL.md) - Formatação visual final

#### B2. Melhorar qualidade de conteúdo existente
**Skills necessárias:**
1. [`tokenmilagre-content-quality`](../../features/tokenmilagre-content-quality/SKILL.md) - Métricas de qualidade
2. [`tokenmilagre-citations`](../../features/tokenmilagre-citations/SKILL.md) - Validar fontes

#### B3. Implementar/modificar chat IA
**Skills necessárias (nesta ordem):**
1. [`chat-workflow`](../../features/chat-workflow/SKILL.md) - Arquitetura do chat
2. [`tokenmilagre-api-integrations`](../../features/tokenmilagre-api-integrations/SKILL.md) - Integração Gemini
3. [`tokenmilagre-copilot-tools`](../../features/tokenmilagre-copilot-tools/SKILL.md) - Se criando novas ferramentas

---

### C. 🗄️ Trabalho com Banco de Dados

#### C1. Modificar schema Prisma
**Skills necessárias (nesta ordem):**
1. [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md) - Modelagem e schema
2. [`database-setup`](../../audit/database-setup/SKILL.md) - Deployment e migrations
3. [`tokenmilagre-testing`](../../core/tokenmilagre-testing/SKILL.md) - Validar mudanças

**Opcionais:**
- [`troubleshooting`](../../audit/troubleshooting/SKILL.md) - Se encontrar problemas

#### C2. Otimizar queries lentas
**Skills necessárias:**
1. [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md) - Patterns de otimização
2. [`troubleshooting`](../../audit/troubleshooting/SKILL.md) - Problemas conhecidos

#### C3. Migrar dados / Bulk processing
**Skills necessárias (nesta ordem):**
1. [`tokenmilagre-scripts`](../../core/tokenmilagre-scripts/SKILL.md) - Automation patterns
2. [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md) - Estrutura de dados
3. [`database-setup`](../../audit/database-setup/SKILL.md) - Deployment

---

### D. 🔌 Integração de APIs

#### D1. Integrar nova API externa
**Skills necessárias (nesta ordem):**
1. [`tokenmilagre-api-integrations`](../../features/tokenmilagre-api-integrations/SKILL.md) - Patterns de integração
2. [`tokenmilagre-testing`](../../core/tokenmilagre-testing/SKILL.md) - Testar integração
3. [`troubleshooting`](../../audit/troubleshooting/SKILL.md) - Erros comuns de API

#### D2. Usar Perplexity AI para pesquisa
**Skills necessárias:**
1. [`tokenmilagre-article-workflow`](../../features/tokenmilagre-article-workflow/SKILL.md) - Workflow completo
2. [`tokenmilagre-api-integrations`](../../features/tokenmilagre-api-integrations/SKILL.md) - Detalhes da API

#### D3. Usar Gemini para refinamento
**Skills necessárias:**
1. [`tokenmilagre-article-workflow`](../../features/tokenmilagre-article-workflow/SKILL.md) - Workflow completo
2. [`tokenmilagre-api-integrations`](../../features/tokenmilagre-api-integrations/SKILL.md) - Detalhes da API
3. [`tokenmilagre-content-quality`](../../features/tokenmilagre-content-quality/SKILL.md) - Critérios de qualidade

---

### E. 🧪 Testes e Qualidade

#### E1. Adicionar testes a uma feature
**Skills necessárias (nesta ordem):**
1. [`tokenmilagre-testing`](../../core/tokenmilagre-testing/SKILL.md) - Estratégias de teste
2. Skill da feature específica (ex: article-creation, chat-workflow)

#### E2. Refatorar código para type safety
**Skills necessárias (nesta ordem):**
1. [`tokenmilagre-refactoring`](../../core/tokenmilagre-refactoring/SKILL.md) - Metodologia
2. [`tokenmilagre-testing`](../../core/tokenmilagre-testing/SKILL.md) - Validar refatoração
3. Skill da área específica

#### E3. Auditoria completa da plataforma
**Skills necessárias (nesta ordem):**
1. [`platform-audit`](../../audit/platform-audit/SKILL.md) - Checklist de auditoria
2. [`troubleshooting`](../../audit/troubleshooting/SKILL.md) - Problemas conhecidos
3. [`due-diligence-report`](../../audit/due-diligence-report/SKILL.md) - Análise estratégica

---

### F. 🚀 Deploy e Operações

#### F1. Gerenciar servidor Next.js local
**Skills necessárias:**
1. [`server-manager`](../../project-specific/server-manager/SKILL.md) - Scripts de gerenciamento
2. [`troubleshooting`](../../audit/troubleshooting/SKILL.md) - Se houver problemas

#### F2. Deploy de mudanças de database
**Skills necessárias (nesta ordem):**
1. [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md) - Migrations
2. [`database-setup`](../../audit/database-setup/SKILL.md) - Deployment
3. [`server-manager`](../../project-specific/server-manager/SKILL.md) - Restart

#### F3. Debugging de produção
**Skills necessárias (nesta ordem):**
1. [`troubleshooting`](../../audit/troubleshooting/SKILL.md) ⭐ SEMPRE PRIMEIRO
2. Skill da área específica (database, api-integrations, etc.)
3. [`platform-audit`](../../audit/platform-audit/SKILL.md) - Se problema recorrente

---

### G. 🛠️ Desenvolvimento de Ferramentas

#### G1. Criar ferramenta admin/copilot
**Skills necessárias (nesta ordem):**
1. [`tokenmilagre-copilot-tools`](../../features/tokenmilagre-copilot-tools/SKILL.md) - Patterns de ferramentas
2. [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md) - Se usar DB
3. [`tokenmilagre-testing`](../../core/tokenmilagre-testing/SKILL.md) - Testes

#### G2. Criar script de automação
**Skills necessárias:**
1. [`tokenmilagre-scripts`](../../core/tokenmilagre-scripts/SKILL.md) - Patterns de scripts
2. [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md) - Se manipular dados

---

### H. 🔒 Segurança

#### H1. Adicionar validação de URLs
**Skills necessárias:**
1. [`tokenmilagre-url-security`](../../project-specific/tokenmilagre-url-security/SKILL.md) - Sistema de proteção
2. [`tokenmilagre-testing`](../../core/tokenmilagre-testing/SKILL.md) - Testar validação

#### H2. Auditoria de segurança
**Skills necessárias:**
1. [`platform-audit`](../../audit/platform-audit/SKILL.md) - Checklist completo
2. [`tokenmilagre-url-security`](../../project-specific/tokenmilagre-url-security/SKILL.md) - Proteção de links
3. [`troubleshooting`](../../audit/troubleshooting/SKILL.md) - Vulnerabilidades conhecidas

---

### I. 📊 Análise e Estratégia

#### I1. Análise de viabilidade de negócio
**Skills necessárias:**
1. [`due-diligence-report`](../../audit/due-diligence-report/SKILL.md) - Análise estratégica CSO
2. [`platform-audit`](../../audit/platform-audit/SKILL.md) - Estado atual

#### I2. Decisão de priorização de features
**Skills necessárias:**
1. [`project-manager-brutal-honesty`](../project-manager-brutal-honesty/SKILL.md) - Análise de ROI
2. [`due-diligence-report`](../../audit/due-diligence-report/SKILL.md) - Contexto estratégico

---

## 🔍 Busca por Palavra-Chave

### Por Tecnologia/Ferramenta
- **Prisma** → `tokenmilagre-database`, `database-setup`, `tokenmilagre-refactoring`
- **React** → `tokenmilagre-component-patterns`, `pages-reference`, `design-system`
- **Perplexity** → `tokenmilagre-article-workflow`, `tokenmilagre-api-integrations`
- **Gemini** → `tokenmilagre-article-workflow`, `tokenmilagre-api-integrations`, `chat-workflow`
- **TypeScript** → `tokenmilagre-refactoring`, `tokenmilagre-testing`
- **Tailwind/CSS** → `design-system`
- **Next.js** → `server-manager`, `pages-reference`
- **Supabase** → `tokenmilagre-database`, `database-setup`

### Por Problema Comum
- **Build falhando** → `troubleshooting`, `database-setup`
- **Servidor não inicia** → `server-manager`, `troubleshooting`
- **Queries lentas** → `tokenmilagre-database`, `troubleshooting`
- **Erro TypeScript** → `tokenmilagre-refactoring`, `troubleshooting`
- **API com erro** → `tokenmilagre-api-integrations`, `troubleshooting`
- **Componente muito grande** → `tokenmilagre-component-patterns`, `tokenmilagre-refactoring`
- **Teste falhando** → `tokenmilagre-testing`, `troubleshooting`

### Por Resultado Desejado
- **Criar conteúdo** → Categoria B (Criação de Conteúdo)
- **Melhorar UI** → Categoria A (Interface)
- **Otimizar performance** → `tokenmilagre-database`, `tokenmilagre-refactoring`
- **Adicionar feature** → Categoria específica + `tokenmilagre-testing`
- **Resolver bug** → `troubleshooting` + skill da área
- **Entender arquitetura** → `SKILLS-ECOSYSTEM.md`, `project-context`

---

## ✅ Checklist Universal (Toda Tarefa)

Antes de iniciar qualquer implementação:

- [ ] Li [`project-context`](../project-context/SKILL.md)? (regras críticas, stack, filosofia)
- [ ] Identifiquei categoria da tarefa nesta skill (A-I)?
- [ ] Vi lista de skills necessárias para minha tarefa?
- [ ] Li skills na ordem recomendada?
- [ ] Consultei [`troubleshooting`](../../audit/troubleshooting/SKILL.md) para problemas conhecidos?
- [ ] Se modificando UI: li [`design-system`](../../project-specific/design-system/SKILL.md)?
- [ ] Se modificando DB: li [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md)?
- [ ] Se modificando API: li [`tokenmilagre-api-integrations`](../../features/tokenmilagre-api-integrations/SKILL.md)?

---

## 🎯 Decisão Rápida: Qual Skill Ler?

```
┌─────────────────────────────────────────────┐
│  Sua tarefa envolve...                      │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴───────┐
       │  Primeiro:    │
       │  project-     │ 
       │  context      │
       └───────┬───────┘
               │
    ┌──────────┴──────────┐
    │                     │
  UI/CSS?            Conteúdo?
    │                     │
design-system      article-workflow
pages-reference    api-integrations
    │                     │
    │                Database?
    │                     │
    │              tokenmilagre-
    │               database
    │                     │
    │                  API?
    │                     │
    │              api-integrations
    │                     │
    └──────────┬──────────┘
               │
         ┌─────┴─────┐
         │  Depois:  │
         │  testing  │
         └───────────┘
```

---

## 📋 Exemplos Práticos

### Exemplo 1: "Quero criar um novo artigo sobre DeFi"
**Navegação:**
1. Categoria **B1** (Criar artigo educacional)
2. Skills (nesta ordem):
   - `project-context` → Entender filosofia
   - `tokenmilagre-article-workflow` → Fluxo completo
   - `tokenmilagre-api-integrations` → Usar Perplexity/Gemini
   - `article-creation` → Template
   - `tokenmilagre-citations` → Fontes
   - `tokenmilagre-content-quality` → Validar

### Exemplo 2: "Página /educacao está lenta"
**Navegação:**
1. Categoria **F3** (Debugging)
2. Skills (nesta ordem):
   - `troubleshooting` → Problema conhecido?
   - `tokenmilagre-database` → Otimizar queries
   - `pages-reference` → Contexto da página
   - `platform-audit` → Se recorrente

### Exemplo 3: "Refatorar componente ArticleCard (800 linhas)"
**Navegação:**
1. Categoria **A3** (Refatorar componente)
2. Skills (nesta ordem):
   - `tokenmilagre-component-patterns` → Estratégias
   - `tokenmilagre-refactoring` → Metodologia
   - `tokenmilagre-testing` → Garantir funcionalidade
   - `design-system` → Manter consistência

### Exemplo 4: "Não sei por onde começar"
**Navegação:**
1. Leia [`project-context`](../project-context/SKILL.md) (15 min)
2. Volte aqui e identifique categoria (A-I)
3. Siga skills recomendadas
4. Consulte [`SKILLS-ECOSYSTEM.md`](../../SKILLS-ECOSYSTEM.md) para visão geral

---

## 🔗 Skills Relacionadas

### Esta skill depende de:
- [`project-context`](../project-context/SKILL.md) - Contexto geral do projeto

### Esta skill referencia:
- **Todas as 22 skills** - É o índice de navegação

### Documentação complementar:
- [`SKILLS-ECOSYSTEM.md`](../../SKILLS-ECOSYSTEM.md) - Arquitetura completa
- [`IMPLEMENTACAO-INTERLIGACOES.md`](../../IMPLEMENTACAO-INTERLIGACOES.md) - Guia técnico

---

**Última Atualização:** 2025-11-13  
**Versão:** 1.0.0  
**Criada Por:** Claude Code
