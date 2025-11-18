# 🔄 Skills Workflow - Navegação Inteligente

**Versão**: 1.0.0
**Data**: 2025-11-18
**Propósito**: Workflow integrado para navegação eficiente entre skills

---

## ⚡ Quick Start (30 segundos)

```
┌─────────────────────────────────────┐
│  1. SEMPRE começar: project-context │
│  2. Identificar tarefa: A-I         │
│  3. Usar skills-navigator           │
│  4. Ler skills na ordem             │
└─────────────────────────────────────┘
```

---

## 🗺️ Grafo de Conexões Completo

```
                         PROJECT-CONTEXT
                         [209L | Daily]
                         (HUB CENTRAL)
                               │
                ┌──────────────┼──────────────┐
                │              │              │
         [META: 3]        [CORE: 4]     [FEATURES: 8]
                │              │              │
    ┌───────────┴──┐    ┌─────┴─────┐   ┌────┴────┐
    │              │    │           │   │         │
skills-nav    brutal-    database  testing  article-  chat-
[367L|Daily]  honesty  [481L|Daily] [756L]  workflow  workflow
              [295L]              [Weekly] [505L]   [561L]
                │                          [Weekly] [Occas]
                │                             │        │
           audit-tools              ┌─────────┼────────┼─────┐
                                    │         │        │     │
                              citations  content-  api-    copilot
                              [524L]     quality  integr  [466L]
                              [Weekly]   [740L]   [730L]  [Monthly]
                                        [Weekly]  [Weekly]
                                                     │
                                                  3 REFS
                                                  (central)

    ┌─────────────────────┐              ┌──────────────────┐
    │  [PROJECT-SPEC: 4]  │              │   [AUDIT: 4]     │
    ├─────────────────────┤              ├──────────────────┤
    │ design-system       │              │ troubleshooting  │
    │ [145L | Daily] ⭐   │              │ [304L | Daily] ⭐│
    │                     │              │                  │
    │ pages-reference     │              │ platform-audit   │
    │ [142L | Weekly] ⭐  │              │ [403L | Monthly] │
    │                     │              │                  │
    │ url-security        │              │ due-diligence    │
    │ [491L | Occas]      │              │ [687L | Occas]   │
    │                     │              │                  │
    │ server-manager      │              │ database-setup   │
    │ [717L | Monthly] 🚨 │              │ [384L | Occas]   │
    └─────────────────────┘              └──────────────────┘

Legenda:
⭐ Gold Standard (pequena + alto uso)
🚨 Red Flag (grande + baixo uso)
[XL | Freq] = Linhas | Frequência de uso
```

---

## 🎯 Decision Tree - Qual Skill Usar?

```
                    Início da Tarefa
                          │
                    project-context
                    (SEMPRE primeiro)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    Trabalho           Criação          Database/
    de UI?            Conteúdo?         Backend?
        │                 │                 │
        ▼                 ▼                 ▼
  design-system     article-workflow  tokenmilagre-
  [145L, 2min]      [505L, 5min]      database
        │                 │            [481L, 5min]
        │                 │                 │
  pages-reference   api-integrations   testing
  [142L, 2min]      [730L, 7min]      [756L, 8min]
        │                 │                 │
  component-        citations/         scripts
  patterns          content-quality    [494L, 5min]
  [672L, 7min]      [524L + 740L]           │
        │                 │                 │
        └────────┬────────┴─────┬───────────┘
                 │              │
            testing       troubleshooting
            [756L]        (se problemas)
                          [304L, 3min]

    API Externa?          Debug?          Deploy?
        │                   │                │
        ▼                   ▼                ▼
  api-integrations   troubleshooting   server-manager
  [730L, 7min]       [304L, 3min]      [717L, 8min]
        │                   │                │
    testing           skill da área     database-setup
    [756L, 8min]            │           [384L, 4min]
        │                   ▼                │
        │             platform-audit         │
        │             (recorrente)            │
        │             [403L, 4min]            │
        │                                     │
        └─────────────────┬─────────────────┘
                          │
                    Validação Final
                    (testing sempre)
```

---

## 📚 Fluxos de Trabalho Pré-Definidos

### 1. Nova Feature Completa

**Tempo estimado**: 45-60 min (leitura) + implementação

```
project-context [2min]
    ↓
skills-navigator [3min] → identificar categoria
    ↓
design-system [2min] → se tiver UI
    ↓
tokenmilagre-database [5min] → se usar DB
    ↓
Skill da feature [5-8min]
    ↓
testing [8min]
    ↓
troubleshooting [3min] → conhecer problemas
```

### 2. Criar Artigo Educacional

**Tempo estimado**: 30-40 min (leitura) + criação

```
project-context [2min]
    ↓
tokenmilagre-article-workflow [5min]
    ↓
tokenmilagre-api-integrations [7min]
    ↓
article-creation [4min]
    ↓
tokenmilagre-citations [5min]
    ↓
tokenmilagre-content-quality [7min]
    ↓
design-system [2min] → formatação final
```

### 3. Debugging de Produção

**Tempo estimado**: 15-25 min (leitura) + debug

```
troubleshooting [3min] ⭐ SEMPRE PRIMEIRO
    ↓
Skill da área específica [5-8min]
    │
    ├─→ UI? → design-system + pages-reference
    ├─→ DB? → tokenmilagre-database
    ├─→ API? → api-integrations
    └─→ Geral? → platform-audit [4min]
    ↓
Resolver + testing [8min]
```

### 4. Refatoração de Código

**Tempo estimado**: 25-35 min (leitura) + refactor

```
project-context [2min]
    ↓
tokenmilagre-refactoring [4min]
    ↓
    ├─→ React? → component-patterns [7min]
    ├─→ DB? → tokenmilagre-database [5min]
    └─→ Geral? → TypeScript best practices
    ↓
testing [8min] → OBRIGATÓRIO
    ↓
design-system [2min] → se UI alterada
```

### 5. Integração de API Externa

**Tempo estimado**: 20-30 min (leitura) + integração

```
project-context [2min]
    ↓
tokenmilagre-api-integrations [7min]
    ↓
testing [8min]
    ↓
troubleshooting [3min] → erros comuns de API
```

### 6. Deploy e Operações

**Tempo estimado**: 15-20 min (leitura) + operação

```
server-manager [8min]
    ↓
    ├─→ Mudança DB? → database-setup [4min]
    └─→ Problemas? → troubleshooting [3min]
```

---

## 🔍 Índice de Busca Rápida

### Por Keyword

| Busco | Skill | Tempo |
|-------|-------|-------|
| **Cores, CSS, Tailwind** | design-system | 2min |
| **Páginas, rotas** | pages-reference | 2min |
| **Prisma, schema** | tokenmilagre-database | 5min |
| **React, componentes** | component-patterns | 7min |
| **Testes, testing** | tokenmilagre-testing | 8min |
| **Artigos, conteúdo** | article-workflow | 5min |
| **Perplexity, Gemini** | api-integrations | 7min |
| **Erro, bug** | troubleshooting | 3min |
| **Deploy, servidor** | server-manager | 8min |
| **Segurança, URLs** | url-security | 5min |

### Por Problema Comum

| Problema | Fluxo | Tempo Total |
|----------|-------|-------------|
| **Build falhando** | troubleshooting → database-setup | 7min |
| **Servidor não inicia** | server-manager → troubleshooting | 11min |
| **Query lenta** | tokenmilagre-database → troubleshooting | 8min |
| **Erro TypeScript** | refactoring → troubleshooting | 7min |
| **API com erro** | api-integrations → troubleshooting | 10min |
| **Componente muito grande** | component-patterns → refactoring → testing | 19min |
| **Teste falhando** | testing → troubleshooting | 11min |

---

## 💾 Persistência de Contexto

### Session State (Recomendado)

**Para Claude AI**: Usar `sessionStorage` mental para lembrar:

1. **Skills já lidas nesta sessão**
   - Não reler se não houver mudanças
   - Apenas referenciar conceitos já conhecidos

2. **Decisões de arquitetura**
   - Design patterns escolhidos
   - Estrutura de dados definida
   - APIs selecionadas

3. **Contexto do projeto**
   - Branch atual
   - Features em desenvolvimento
   - Problemas conhecidos (de troubleshooting)

### Cross-Session Context

**Sempre disponível** (não depende de memória):

1. **project-context** - Regras e filosofia (209L)
2. **SKILLS-ECOSYSTEM.md** - Mapa completo (289L)
3. **SKILLS-WORKFLOW.md** - Este documento
4. **BRUTAL-AUDIT-REPORT.md** - Estado atual do sistema

**Acesso rápido**:
```bash
# Listar todas as skills
find .claude/skills -name 'SKILL.md' | grep -v backup

# Ver tamanho de skill específica
wc -l .claude/skills/core/tokenmilagre-database/SKILL.md

# Ver relacionamentos
cat .claude/skills/SKILLS-RELATIONSHIPS.json | jq '.skills["tokenmilagre-database"]'
```

---

## 📊 Métricas de Eficiência

### Token Budget por Fluxo

| Fluxo | Skills | Linhas | Tokens | Tempo |
|-------|--------|--------|--------|-------|
| **Mínimo** (debug simples) | 2 | ~500 | ~1,840 | 6min |
| **Médio** (feature simples) | 4 | ~1,500 | ~5,520 | 17min |
| **Completo** (feature complexa) | 6-8 | ~3,000 | ~11,040 | 35min |
| **Full Stack** (nova feature end-to-end) | 10+ | ~5,000 | ~18,400 | 60min |

### Velocidade de Leitura Estimada

- **Scanning** (contexto básico): 50L/min
- **Reading** (compreensão): 30L/min
- **Deep Dive** (memorização): 15L/min

**Exemplo**: design-system (145L)
- Scan: 3min
- Read: 5min
- Deep: 10min

---

## 🎯 Otimizações de Workflow

### Cache de Skills (Mental Model)

**Tier 1 - SEMPRE em cache** (uso daily):
- project-context (209L)
- design-system (145L)
- troubleshooting (304L)
- tokenmilagre-database (481L)

**Tier 2 - Carregar sob demanda** (uso weekly):
- skills-navigator (367L)
- article-workflow (505L)
- api-integrations (730L)
- testing (756L)

**Tier 3 - Ler apenas quando necessário** (uso occasional):
- due-diligence-report (687L)
- chat-workflow (561L)
- database-setup (384L)

### Lazy Loading Strategy

```
Tarefa identificada
    ↓
Carregar Tier 1 (obrigatório) - 1,139L
    ↓
Identificar categoria (A-I)
    ↓
Carregar Tier 2 relevante - ~500-750L
    ↓
Se necessário, Tier 3 - ~400-700L
    ↓
Total carregado: 2,000-2,500L (~7,500-9,000 tokens)
```

---

## 🔗 Integrações

### Com Claude Code Features

**Slash Commands**:
- `/skill [nome]` → Carrega skill específica
- `/audit` → Roda BRUTAL-AUDIT-REPORT
- `/nav [tarefa]` → Usa skills-navigator para identificar skills

**Hooks**:
- **Pre-task**: Sempre carregar project-context
- **Post-task**: Atualizar SKILL-INDEX se otimização realizada
- **On-error**: Auto-sugerir troubleshooting

### Com Git Workflow

**Branch Strategy**:
```
claude/* → Claude Code Web (preview automático)
    ↓
Validar local → server-manager.sh start-preview
    ↓
Produção → server-manager.sh promote-preview
```

**Skills envolvidas**:
- server-manager (deploy)
- troubleshooting (se problemas)
- platform-audit (antes de merge)

---

## ✅ Checklist Universal

Antes de QUALQUER tarefa:

```
[ ] Li project-context? (regras críticas)
[ ] Identifiquei categoria (A-I)?
[ ] Consultei skills-navigator?
[ ] Carreguei skills necessárias?
[ ] Li troubleshooting? (problemas conhecidos)
[ ] Se UI: li design-system?
[ ] Se DB: li tokenmilagre-database?
[ ] Se API: li api-integrations?
[ ] Planejei tempo de leitura (15-60min)?
[ ] Defini ordem de execução?
```

Durante desenvolvimento:

```
[ ] Seguindo padrões da skill?
[ ] Consultando referências certas?
[ ] Problemas? Voltar ao troubleshooting?
[ ] Mudança grande? Testar com testing?
```

Antes de finalizar:

```
[ ] Código testado?
[ ] UI validada com design-system?
[ ] Documentação atualizada?
[ ] Skills precisam atualização?
```

---

## 📈 Próximas Melhorias

### Curto Prazo (Este mês)

1. **Auto-navigation**
   - Skill sugere próximas skills automaticamente
   - Baseado na tarefa identificada

2. **Skill Summarizer**
   - Resumo de 50 linhas de cada skill
   - Para quick reference

3. **Interactive Index**
   - Search interativo de skills
   - Filtros por categoria, tamanho, frequência

### Médio Prazo (Trimestre)

4. **Usage Analytics**
   - Tracking real de quais skills são usadas
   - Atualizar frequências baseado em dados reais

5. **Skill Versions**
   - Versionamento semântico de skills
   - Changelog automático

6. **AI-Assisted Navigation**
   - Claude identifica skills automaticamente
   - Baseado na descrição da tarefa do usuário

---

## 🎓 Como Este Workflow Ajuda

### Para Claude AI

✅ **Navegação clara**: Sabe exatamente qual skill ler
✅ **Ordem otimizada**: Evita reler skills desnecessárias
✅ **Cache mental**: Tier system reduz token usage
✅ **Decisões rápidas**: Decision tree visual
✅ **Troubleshooting**: Sempre sabe onde buscar ajuda

### Para Desenvolvedores

✅ **Onboarding rápido**: 30min para entender sistema completo
✅ **Referência rápida**: Busca por keyword ou problema
✅ **Workflows prontos**: Fluxos pré-definidos para tarefas comuns
✅ **Métricas claras**: Sabe quanto tempo vai levar
✅ **Manutenção fácil**: Checklist para atualizar skills

### Para o Projeto

✅ **Token efficiency**: Carrega apenas skills necessárias
✅ **Consistência**: Todos seguem mesmo fluxo
✅ **Escalabilidade**: Fácil adicionar novas skills
✅ **Auditabilidade**: BRUTAL-AUDIT-REPORT mostra saúde
✅ **Evolução**: Métricas permitem otimização contínua

---

**Mantido Por**: Claude Code + Token Milagre Team
**Atualizar**: Após cada mudança significativa em skills
**Próxima Revisão**: 2025-12-18
