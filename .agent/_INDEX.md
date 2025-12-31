---
type: agent-registry
version: 3.0.0
tags:
  - index
  - milagre
  - agents
aliases:
  - Índice de Agents
  - Agent Registry
---

# 📖 Índice de Agents $MILAGRE

> Quando a IA precisar de contexto especializado, consulte este índice.

> [!CAUTION] 🧠 PROTOCOLO OBRIGATÓRIO — LEIA PRIMEIRO
> **Você opera através do [[workflows/ROUTER-agent|ROUTER]]** — um meta-agent que intercepta TODA mensagem.
> 
> ### 🎯 INICIE TODA RESPOSTA COM:
> ```
> 🧠 Agent: [NOME]
> 📡 Graphiti: [status]
> 📋 Contexto: [1 linha]
> ```
>
> **A cada mensagem, você DEVE:**
> 1. **Classificar** a intenção (código, design, conteúdo, etc.)
> 2. **Carregar** o agent especializado apropriado
> 3. **Consultar** Graphiti: `curl -X POST localhost:8000/search -d '{"query":"..."}'`
> 4. **Documentar** decisões importantes automaticamente
>
> Veja também: [[../CLAUDE.md|CLAUDE.md]] na raiz do projeto.

> [!NOTE] 🖥️ AMBIENTE DE EXECUÇÃO
> - **Container:** distrobox `dev-ubuntu` (Ubuntu dentro do host)
> - **Host:** Fedora Kinoite (imutável, acesso via [[workflows/BRIDGE-agent|BRIDGE]])
> - **Limitações:** SEM acesso a Podman/Docker, systemd do host
> - **Bridge:** `/home/zenfoco/Dev/.claude-bridge/` para comunicar com Claude do host
> - **Serviços externos:** Graphiti (port 8000), FalkorDB (port 6379) via Podman no host

> [!WARNING] ⚠️ IMPORTANTE
> Nunca faça commit ou push sem solicitação explícita do usuário. Pergunte sempre antes de salvar alterações no repositório.

> [!CAUTION] 🚨 CRÍTICO - BANCO DE DADOS
> Antes de QUALQUER operação destrutiva no banco (migrations, resets, db push --force-reset, etc), você DEVE:
> 1. **Criar backup local** executando: `npm run db:backup`
> 2. **Confirmar com o usuário** que o backup foi criado
> 3. **Só então executar** a operação destrutiva
> 
> Esta regra é INVIOLÁVEL. Consulte [[workflows/DATABASE-agent|DATABASE]] para detalhes.

> [!TIP] 🌐 NAVEGADOR
> Nunca abra o modo navegador (`browser_subagent`) sem solicitação explícita do usuário. Para análises de páginas, use apenas leitura de código-fonte a menos que o usuário peça especificamente para visualizar no browser.

> [!IMPORTANT] 🧠 SISTEMA DE CONHECIMENTO
> Este projeto usa Graphiti (localhost:8000) para memória persistente.
> - **Início de sessão:** Consulte conhecimento anterior com `curl -X POST localhost:8000/search -d '{"query":"<contexto>"}'`
> - **Durante trabalho:** Registre decisões importantes com `curl -X POST localhost:8000/add-episode`
> - **Detalhes:** [[workflows/CONHECIMENTO-agent|CONHECIMENTO]]
> - **Se Graphiti offline:** Use fallback em `Feedback/logs/knowledge-fallback.jsonl`

---

## Uso Rápido

| Preciso de... | Agent | Ativação |
|---------------|-------|----------|
| **🧠 Orquestração automática** | [[workflows/ROUTER-agent\|ROUTER]] | **AUTOMÁTICO** (toda mensagem) |
| Validação filosófica/ética | [[workflows/ARQUITETO-agent\|ARQUITETO]] | "Valide esta ideia" |
| Criar conteúdo web | [[workflows/CONTEUDO-agent\|CONTEUDO]] | "Crie artigo/página" |
| Regras de design/tema | [[workflows/DESIGN-agent\|DESIGN]] | "CSS/tema/cores" |
| Gerenciamento de Código e Versionamento | [[workflows/GITHUB-agent\|GITHUB]] | "Gerenciar repositório", "versionamento" |
| Validar arquitetura | [[workflows/ESTRUTURA-agent\|ESTRUTURA]] | "Revisar estrutura" |
| Revisar código | [[workflows/CODIGO-agent\|CODIGO]] | "Code review" |
| Auditoria de segurança | [[workflows/SEGURANCA-agent\|SEGURANCA]] | "Segurança", "auditoria" |
| Análise crítica/UX | [[workflows/ANALISTA-agent\|ANALISTA]] | "Analise o projeto" |
| Token Solana/Tokenomics | [[workflows/TOKEN-agent\|TOKEN]] | "Criar token", "Tokenomics" |
| Geração de ideias | [[workflows/IDEIAS-agent\|IDEIAS]] | "Brainstorm", "ideias" |
| Validação de valor/ROI | [[workflows/VALOR-agent\|VALOR]] | "Monetização", "ROI" |
| Estatísticas e relatórios | [[workflows/DADOS-agent\|DADOS]] | "Estatísticas", "dados" |
| **Verificar consistência** | [[workflows/CONSISTENCIA-agent\|CONSISTENCIA]] | "Sincronização", "integridade" |
| **Banco de dados/Backup** | [[workflows/DATABASE-agent\|DATABASE]] | "Backup", "migração", "db push" |
| **🔧 Manutenção de Agents** | [[workflows/manutencao\|MANUTENCAO]] | "/manutencao", "health check" |
| **🧠 Grafo de Conhecimento** | [[workflows/CONHECIMENTO-agent\|CONHECIMENTO]] | "/conhecimento", "lembrar", "buscar" |
| **🌉 Comunicação com Host** | [[workflows/BRIDGE-agent\|BRIDGE]] | "bridge", "host", "podman", "fora do container" |

---

## Hierarquia de Escalação

```
                          ARQUITETO
                               ↑
    ┌──────────────┬──────────┼──────────┬──────────────┐
    │              │          │          │              │
  CODIGO      ESTRUTURA       │      ANALISTA       IDEIAS
    │              │          │          │              │
    │              │        VALOR ← ← ← ← ← ← ← ← ← ← ←┤
    │              │     (valida todos)                 │
┌───┴───┐    ┌─────┴─────┐                              │
│       │    │           │                              │
SEGURANCA   DESIGN    CONTEUDO ←────────────────────────┘
    │                    ↑
  TOKEN            CONSISTENCIA
                   (audita todos)
                        
═══════════════════════════════════════════════════════════
         🧠 CONHECIMENTO (memória de todos os agents)
═══════════════════════════════════════════════════════════
              ↓                       ↓
         DATABASE               MANUTENCAO
       (infraestrutura)        (meta-operacional)
```

---

## Quando Usar Cada Agent

### ARQUITETO 👁️
- **Quando**: Decisões fundamentais, dúvidas éticas, validação de propósito
- **Escala para**: Nenhum (é o topo da hierarquia)

### CONTEUDO ✍️
- **Quando**: Criar páginas, artigos, landing pages, microcopy
- **Colabora com**: DESIGN (visual), CODIGO (implementação)
- **Escala para**: ARQUITETO (dúvidas éticas)

### DESIGN 🎨
- **Quando**: CSS, tokens, tema, cores, glassmorphism
- **Colabora com**: CONTEUDO (visual de conteúdo)
- **Escala para**: ESTRUTURA (consistência de padrões)

### ESTRUTURA 🌀
- **Quando**: Criar módulos, validar estrutura, revisar PRs grandes
- **Colabora com**: CODIGO (código), DESIGN (padrões)
- **Escala para**: ARQUITETO (decisões filosóficas)

### CODIGO 🔍
- **Quando**: Code review, tipagem, convenções, antes de commits
- **Colabora com**: ESTRUTURA (estrutura), SEGURANCA (segurança)
- **Escala para**: ESTRUTURA (questões arquiteturais)

### SEGURANCA 🔐
- **Quando**: Auditar segurança, smart contracts, riscos
- **Colabora com**: CODIGO (código)
- **Escala para**: ARQUITETO (riscos éticos)

### ANALISTA 🧠
- **Quando**: Questionar propósito, analisar UX, desconstruir ideias
- **Colabora com**: CONTEUDO (tom), ARQUITETO (filosofia)
- **Escala para**: ARQUITETO (questões existenciais)

### TOKEN ⚡
- **Quando**: Criar token SPL, definir tokenomics, whitepaper, lançamento
- **Colabora com**: CODIGO (implementação), SEGURANCA (segurança)
- **Escala para**: ARQUITETO (decisões éticas sobre o token)

### IDEIAS 💡
- **Quando**: Gerar ideias, explorar possibilidades, sessões criativas
- **Colabora com**: CONTEUDO (execução), ANALISTA (análise)
- **Escala para**: ARQUITETO (validação ética de ideias)

### VALOR 💰
- **Quando**: Validar monetização, ROI, viabilidade, sustentabilidade
- **Colabora com**: TODOS (valida geração de valor real)
- **Escala para**: ARQUITETO (questões éticas sobre dinheiro)
- **Especial**: Deve ser consultado por todos antes de decisões que envolvam recursos

### DADOS 📊
- **Quando**: Estatísticas do projeto, relatórios, métricas, gaps de conteúdo
- **Colabora com**: CODIGO (queries), CONTEUDO (gaps)
- **Escala para**: ARQUITETO (decisões baseadas em dados)

---

## Referências Estáticas

| Documento | Propósito |
|-----------|-----------|
| [[workflows/_DNA\|_DNA]] | Mantra e valores (herdado por todos) |
| [[workflows/ONBOARDING\|ONBOARDING]] | Onboarding para IAs |
| [[workflows/MANIFESTO\|MANIFESTO]] | Missão e propósito |
| [[workflows/ARQUITETURA\|ARQUITETURA]] | Filosofia fractal |
| [[workflows/TRANSPARENCIA\|TRANSPARENCIA]] | Política ética do token |
| [[workflows/CONHECIMENTO\|CONHECIMENTO]] | Base de troubleshooting |
| [[../Feedback/backlog/BACKLOG\|BACKLOG]] | Tarefas pendentes *(local)* |
| [[../Feedback/logs/HISTORICO\|HISTORICO]] | Histórico de sessões *(local)* |
| [[workflows/MANTRA\|MANTRA]] | Leitura diária |
| [[workflows/layout\|layout]] | Guia de layout/tipografia |
| [[workflows/vibe\|vibe]] | Boas práticas de vibe coding |
| [[../Feedback/ANALISE-HOLISTICA_2025-12-19\|ANÁLISE HOLÍSTICA]] | Auditoria multi-agent *(local)* |

### Workflows de Desenvolvimento (Superpowers)

| Workflow | Propósito |
|----------|-----------|
| [[workflows/chaos\|chaos]] | **🧠 Contexto instantâneo via Graphiti** |
| [[workflows/sessao\|sessao]] | **📝 Registro de sessão no Graphiti** |
| [[workflows/debug\|debug]] | Debugging sistemático em 4 fases |
| [[workflows/tdd\|tdd]] | Test-Driven Development (red-green-refactor) |
| [[workflows/plano\|plano]] | Escrita de planos de implementação |
| [[workflows/execucao\|execucao]] | Execução de planos em batches |
| [[workflows/verificacao\|verificacao]] | Verificação antes de conclusão |
| [[workflows/manutencao\|manutencao]] | 🔧 Manutenção semanal do ecossistema |
| [[workflows/criador-conteudo\|criador-conteudo]] | 📝 Prompts Perplexity para criação de conteúdo |


---

```yaml
@agi-metadata:
  inherits: [[workflows/_DNA|_DNA]]
  updates: on-agent-change
  last-maintained: 2025-12-31
```

