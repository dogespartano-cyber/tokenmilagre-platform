---
type: agent-registry
version: 3.1.0
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
> **Você opera através do [[workers/meta/ROUTER-agent|ROUTER]]** — um meta-agent que intercepta TODA mensagem.
> 
> ### 🎯 INICIE TODA RESPOSTA COM:
> ```
> 🧠 Agent: [NOME]
> 📡 Graphiti: [status]
> 📋 Contexto: [1 linha]
> ```
>
> **ROUTER v2.0 — Sistema Inteligente de Roteamento:**
> 1. **Detector Semântico** — keywords + sinônimos + frases contextuais
> 2. **Score de Confiança** — ≥0.8 (skill direta), 0.5-0.8 (confirmação), <0.5 (fallback)
> 3. **Multi-skill Dispatch** — combina agents (ex: "🧠 Agent: CONTEUDO (com DESIGN)")
>
> Veja também: [[../CLAUDE.md|CLAUDE.md]] na raiz do projeto.

> [!NOTE] 🖥️ AMBIENTE DE EXECUÇÃO
> - **Container:** distrobox `dev-ubuntu` (Ubuntu dentro do host)
> - **Host:** Fedora Kinoite (imutável, acesso via [[workers/meta/BRIDGE-agent|BRIDGE]])
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
> Esta regra é INVIOLÁVEL. Consulte [[workers/dev/DATABASE-agent|DATABASE]] para detalhes.

> [!TIP] 🌐 NAVEGADOR
> Nunca abra o modo navegador (`browser_subagent`) sem solicitação explícita do usuário. Para análises de páginas, use apenas leitura de código-fonte a menos que o usuário peça especificamente para visualizar no browser.

> [!IMPORTANT] 🧠 SISTEMA DE CONHECIMENTO
> Este projeto usa Graphiti (localhost:8000) para memória persistente.
> - **Início de sessão:** Consulte conhecimento anterior com `curl -X POST localhost:8000/search -d '{"query":"<contexto>"}'`
> - **Durante trabalho:** Registre decisões importantes com `curl -X POST localhost:8000/add-episode`
> - **Detalhes:** [[workers/meta/CONHECIMENTO-agent|CONHECIMENTO]]
> - **Se Graphiti offline:** Use fallback em `Feedback/logs/knowledge-fallback.jsonl`

---

## Uso Rápido

| Preciso de... | Agent | Ativação |
|---------------|-------|----------|
| **🧠 Orquestração automática** | [[workers/meta/ROUTER-agent\|ROUTER]] | **AUTOMÁTICO** (toda mensagem) |
| Validação filosófica/ética | [[workers/arch/ARQUITETO-agent\|ARQUITETO]] | "Valide esta ideia" |
| Criar conteúdo web | [[workers/product/CONTEUDO-agent\|CONTEUDO]] | "Crie artigo/página" |
| Regras de design/tema | [[workers/product/DESIGN-agent\|DESIGN]] | "CSS/tema/cores" |
| Gerenciamento de Código e Versionamento | [[workers/dev/GITHUB-agent\|GITHUB]] | "Gerenciar repositório", "versionamento" |
| Validar arquitetura | [[workers/arch/ESTRUTURA-agent\|ESTRUTURA]] | "Revisar estrutura" |
| Revisar código | [[workers/dev/CODIGO-agent\|CODIGO]] | "Code review" |
| Auditoria de segurança | [[workers/dev/SEGURANCA-agent\|SEGURANCA]] | "Segurança", "auditoria" |
| Análise crítica/UX | [[workers/arch/ANALISTA-agent\|ANALISTA]] | "Analise o projeto" |
| Token Solana/Tokenomics | [[workers/product/TOKEN-agent\|TOKEN]] | "Criar token", "Tokenomics" |
| Geração de ideias | [[workers/product/IDEIAS-agent\|IDEIAS]] | "Brainstorm", "ideias" |
| Validação de valor/ROI | [[workers/product/VALOR-agent\|VALOR]] | "Monetização", "ROI" |
| Estatísticas e relatórios | [[workers/product/DADOS-agent\|DADOS]] | "Estatísticas", "dados" |
| **Verificar consistência** | [[workers/dev/CONSISTENCIA-agent\|CONSISTENCIA]] | "Sincronização", "integridade" |
| **Banco de dados/Backup** | [[workers/dev/DATABASE-agent\|DATABASE]] | "Backup", "migração", "db push" |
| **🔧 Manutenção de Agents** | [[processes/manutencao\|MANUTENCAO]] | "/manutencao", "health check" |
| **🧠 Grafo de Conhecimento** | [[workers/meta/CONHECIMENTO-agent\|CONHECIMENTO]] | "/conhecimento", "lembrar", "buscar" |
| **🌉 Comunicação com Host** | [[workers/meta/BRIDGE-agent\|BRIDGE]] | "bridge", "host", "podman", "fora do container" |
| **🚀 Infraestrutura/Deploy** | [[workers/dev/DEVOPS-agent\|DEVOPS]] | "deploy", "vercel", "build", "ci/cd" |
| **🧬 Criador de Agents** | [[workers/meta/GENESIS-agent\|GENESIS]] | "criar agent", "novo workflow", "genesis" |
| **☣️ Crescimento/Viral** | [[workers/product/VIRAL-agent\|VIRAL]] | "crescer", "viralizar", "trends", "ROI imediato" |

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
    │              │                                    │
┌───┴───┐    ┌─────┴─────┐                              │
│       │    │           │                              │
SEGURANCA   DESIGN    CONTEUDO ←────────────────────────┘
    │                    ↑
  TOKEN            CONSISTENCIA                DEVOPS
                   (audita todos)            (infra/deploy)
                        │
                      VIRAL
                    (caçador)
                        
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

### DEVOPS 🚀
- **Quando**: Deploys (Vercel), CI/CD, variáveis de ambiente, infraestrutura
- **Colabora com**: GITHUB (código), SEGURANCA (secrets)
- **Escala para**: ARQUITETO (risco de downtime/custo)

### GENESIS 🧬
- **Quando**: Criar novos agents, atualizar workflows, evoluir o sistema
- **Colabora com**: ARQUITETO (validação de necessidade)
- **Escala para**: ARQUITETO (criação de vida artificial)

### VIRAL ☣️
- **Quando**: Buscar crescimento agressivo, caçar trends, viralizar
- **Colabora com**: VALOR (validação de ROI), CONTEUDO (produção de iscas)
- **Escala para**: ARQUITETO (se a agressividade violar ética)

---

## Referências Estáticas

| Documento | Propósito |
|-----------|-----------|
| [[memory/_DNA\|_DNA]] | Mantra e valores (herdado por todos) |
| [[memory/ONBOARDING\|ONBOARDING]] | Onboarding para IAs |
| [[memory/MANIFESTO\|MANIFESTO]] | Missão e propósito |
| [[memory/ARQUITETURA\|ARQUITETURA]] | Filosofia fractal |
| [[memory/TRANSPARENCIA\|TRANSPARENCIA]] | Política ética do token |
| [[workers/meta/CONHECIMENTO-agent\|CONHECIMENTO]] | Base de troubleshooting |
| [[../Feedback/backlog/BACKLOG\|BACKLOG]] | Tarefas pendentes *(local)* |
| [[../Feedback/logs/HISTORICO\|HISTORICO]] | Histórico de sessões *(local)* |
| [[memory/MANTRA\|MANTRA]] | Leitura diária |
| [[processes/layout\|layout]] | Guia de layout/tipografia |
| [[processes/vibe\|vibe]] | Boas práticas de vibe coding |
| [[../Feedback/ANALISE-HOLISTICA_2025-12-19\|ANÁLISE HOLÍSTICA]] | Auditoria multi-agent *(local)* |

### Workflows de Desenvolvimento (Superpowers)

| Workflow | Propósito |
|----------|-----------|
| [[processes/chaos\|chaos]] | **🧠 Contexto instantâneo via Graphiti** |
| [[processes/auditoria\|auditoria]] | **🏥 Prompt para auditoria completa** |
| [[processes/sessao\|sessao]] | **📝 Registro de sessão no Graphiti** |
| [[processes/debug\|debug]] | Debugging sistemático em 4 fases |
| [[processes/tdd\|tdd]] | Test-Driven Development (red-green-refactor) |
| [[processes/plano\|plano]] | Escrita de planos de implementação |
| [[processes/execucao\|execucao]] | Execução de planos em batches |
| [[processes/verificacao\|verificacao]] | Verificação antes de conclusão |
| [[processes/manutencao\|manutencao]] | 🔧 Manutenção semanal do ecossistema |
| [[processes/criador-conteudo\|criador-conteudo]] | 📝 Prompts Perplexity para criação de conteúdo |


---

```yaml
@agi-metadata:
  inherits: [[memory/_DNA|_DNA]]
  updates: on-agent-change
  last-maintained: 2026-01-05
```
