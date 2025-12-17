---
type: agent-registry
version: 2.0.0
---

# 📖 Índice de Agents $MILAGRE

> Quando a IA precisar de contexto especializado, consulte este índice.

---

## Uso Rápido

| Preciso de... | Agent | Ativação |
|---------------|-------|----------|
| Validação filosófica/ética | [ARQUITETO](./workflows/ARQUITETO-agent.md) | "Valide esta ideia" |
| Criar conteúdo web | [CONTEUDO](./workflows/CONTEUDO-agent.md) | "Crie artigo/página" |
| Regras de design/tema | [DESIGN](./workflows/DESIGN-agent.md) | "CSS/tema/cores" |
| Validar arquitetura | [ESTRUTURA](./workflows/ESTRUTURA-agent.md) | "Revisar estrutura" |
| Revisar código | [CODIGO](./workflows/CODIGO-agent.md) | "Code review" |
| Auditoria de segurança | [SEGURANCA](./workflows/SEGURANCA-agent.md) | "Segurança", "auditoria" |
| Análise crítica/UX | [ANALISTA](./workflows/ANALISTA-agent.md) | "Analise o projeto" |
| Token Solana/Tokenomics | [TOKEN](./workflows/TOKEN-agent.md) | "Criar token", "Tokenomics" |
| Geração de ideias | [IDEIAS](./workflows/IDEIAS-agent.md) | "Brainstorm", "ideias" |
| Validação de valor/ROI | [VALOR](./workflows/VALOR-agent.md) | "Monetização", "ROI" |
| Estatísticas e relatórios | [DADOS](./workflows/DADOS-agent.md) | "Estatísticas", "dados" |

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
    │
  TOKEN
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
| [BACKLOG](./workflows/BACKLOG.md) | Tarefas pendentes |
| [HISTORICO](./workflows/HISTORICO.md) | Histórico de sessões |
| [MANTRA](./workflows/MANTRA.md) | Leitura diária |
| [layout](./workflows/layout.md) | Guia de layout/tipografia |
| [vibe](./workflows/vibe.md) | Boas práticas de vibe coding |

---

```yaml
@agi-metadata:
  inherits: _DNA.md
  updates: on-agent-change
```
