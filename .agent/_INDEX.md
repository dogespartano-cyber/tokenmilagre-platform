---
type: agent-registry
version: 2.0.0
---

# 📖 Índice de Agents $MILAGRE

> Quando a IA precisar de contexto especializado, consulte este índice.

> **⚠️ IMPORTANTE:** Nunca faça commit ou push sem solicitação explícita do usuário. Pergunte sempre antes de salvar alterações no repositório.

> **🚨 CRÍTICO - BANCO DE DADOS:** Antes de QUALQUER operação destrutiva no banco (migrations, resets, db push --force-reset, etc), você DEVE:
> 1. **Criar backup local** executando: `npm run db:backup`
> 2. **Confirmar com o usuário** que o backup foi criado
> 3. **Só então executar** a operação destrutiva
> 
> Esta regra é INVIOLÁVEL. Consulte [DATABASE](./workflows/DATABASE-agent.md) para detalhes.

> **🌐 NAVEGADOR:** Nunca abra o modo navegador (`browser_subagent`) sem solicitação explícita do usuário. Para análises de páginas, use apenas leitura de código-fonte a menos que o usuário peça especificamente para visualizar no browser.

> **🧠 SISTEMA DE CONHECIMENTO:** Este projeto usa Graphiti (localhost:8000) para memória persistente.
> - **Início de sessão:** Consulte conhecimento anterior com `curl -X POST localhost:8000/search -d '{"query":"<contexto>"}'`
> - **Durante trabalho:** Registre decisões importantes com `curl -X POST localhost:8000/add-episode`
> - **Detalhes:** [CONHECIMENTO-agent.md](./workflows/CONHECIMENTO-agent.md)
> - **Se Graphiti offline:** Use fallback em `Feedback/logs/knowledge-fallback.jsonl`

---

## Uso Rápido

| Preciso de... | Agent | Ativação |
|---------------|-------|----------|
| Validação filosófica/ética | [ARQUITETO](./workflows/ARQUITETO-agent.md) | "Valide esta ideia" |
| Criar conteúdo web | [CONTEUDO](./workflows/CONTEUDO-agent.md) | "Crie artigo/página" |
| Regras de design/tema | [DESIGN](./workflows/DESIGN-agent.md) | "CSS/tema/cores" |
| Gerenciamento de Código e Versionamento | [GITHUB](./workflows/GITHUB-agent.md) | "Gerenciar repositório", "versionamento" |
| Validar arquitetura | [ESTRUTURA](./workflows/ESTRUTURA-agent.md) | "Revisar estrutura" |
| Revisar código | [CODIGO](./workflows/CODIGO-agent.md) | "Code review" |
| Auditoria de segurança | [SEGURANCA](./workflows/SEGURANCA-agent.md) | "Segurança", "auditoria" |
| Análise crítica/UX | [ANALISTA](./workflows/ANALISTA-agent.md) | "Analise o projeto" |
| Token Solana/Tokenomics | [TOKEN](./workflows/TOKEN-agent.md) | "Criar token", "Tokenomics" |
| Geração de ideias | [IDEIAS](./workflows/IDEIAS-agent.md) | "Brainstorm", "ideias" |
| Validação de valor/ROI | [VALOR](./workflows/VALOR-agent.md) | "Monetização", "ROI" |
| Estatísticas e relatórios | [DADOS](./workflows/DADOS-agent.md) | "Estatísticas", "dados" |
| **Verificar consistência** | [CONSISTENCIA](./workflows/CONSISTENCIA-agent.md) | "Sincronização", "integridade" |
| **Banco de dados/Backup** | [DATABASE](./workflows/DATABASE-agent.md) | "Backup", "migração", "db push" |
| **🔧 Manutenção de Agents** | [MANUTENCAO](./workflows/manutencao.md) | "/manutencao", "health check" |
| **🧠 Grafo de Conhecimento** | [CONHECIMENTO](./workflows/CONHECIMENTO-agent.md) | "/conhecimento", "lembrar", "buscar" |

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
| [_DNA.md](./workflows/_DNA.md) | Mantra e valores (herdado por todos) |
| [ONBOARDING](./workflows/ONBOARDING.md) | Onboarding para IAs |
| [MANIFESTO](./workflows/MANIFESTO.md) | Missão e propósito |
| [ARQUITETURA](./workflows/ARQUITETURA.md) | Filosofia fractal |
| [TRANSPARENCIA](./workflows/TRANSPARENCIA.md) | Política ética do token |
| [CONHECIMENTO](./workflows/CONHECIMENTO.md) | Base de troubleshooting |
| [BACKLOG](../Feedback/backlog/BACKLOG.md) | Tarefas pendentes *(local)* |
| [HISTORICO](../Feedback/logs/HISTORICO.md) | Histórico de sessões *(local)* |
| [MANTRA](./workflows/MANTRA.md) | Leitura diária |
| [layout](./workflows/layout.md) | Guia de layout/tipografia |
| [vibe](./workflows/vibe.md) | Boas práticas de vibe coding |
| [ANÁLISE HOLÍSTICA](../Feedback/ANALISE-HOLISTICA_2025-12-19.md) | Auditoria multi-agent *(local)* |

### Workflows de Desenvolvimento (Superpowers)

| Workflow | Propósito |
|----------|-----------|
| [debug](./workflows/debug.md) | Debugging sistemático em 4 fases |
| [tdd](./workflows/tdd.md) | Test-Driven Development (red-green-refactor) |
| [plano](./workflows/plano.md) | Escrita de planos de implementação |
| [execucao](./workflows/execucao.md) | Execução de planos em batches |
| [verificacao](./workflows/verificacao.md) | Verificação antes de conclusão |
| [manutencao](./workflows/manutencao.md) | **🔧 Manutenção semanal do ecossistema** |
| [criador-conteudo](./workflows/criador-conteudo.md) | **📝 Prompts Perplexity para criação de conteúdo** |

---

```yaml
@agi-metadata:
  inherits: _DNA.md
  updates: on-agent-change
  last-maintained: 2025-12-29
```

