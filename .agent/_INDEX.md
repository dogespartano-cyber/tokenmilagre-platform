---
type: agent-registry
version: 1.0.0
---

# 📖 Índice de Agents $MILAGRE

> Quando a IA precisar de contexto especializado, consulte este índice.

---

## Uso Rápido

| Preciso de... | Agent | Ativação |
|---------------|-------|----------|
| Validação filosófica/ética | [ARCHITECT_ZERO](./ARCHITECT_ZERO.md) | "Valide esta ideia" |
| Criar conteúdo web | [CONTENT_ARCHITECT](./CONTENT_ARCHITECT.md) | "Crie artigo/página" |
| Regras de design/tema | [DESIGN_SYSTEM](./DESIGN_SYSTEM.md) | "CSS/tema/cores" |
| Validar arquitetura | [FRACTAL_GUARDIAN](./FRACTAL_GUARDIAN.md) | "Revisar estrutura" |
| Revisar código | [TECH_LEAD](./TECH_LEAD.md) | "Code review" |
| Auditoria de segurança | [DUE_DILIGENCE](./DUE_DILIGENCE.md) | "Due diligence" |
| Análise existencial | [PSYCHOLOGIST](./PSYCHOLOGIST.md) | "Analise o projeto" |
| Token Solana/Tokenomics | [SOLANA_ARCHITECT](./SOLANA_ARCHITECT.md) | "Criar token", "Tokenomics" |
| Geração de ideias | [BRAINSTORM](./BRAINSTORM.md) | "Brainstorm", "ideias" |
| Validação de valor/monetização | [TALENT_MULTIPLIER](./TALENT_MULTIPLIER.md) | "Monetização", "ROI", "viabilidade" |
| Estatísticas e relatórios | [DATA_ANALYST](./DATA_ANALYST.md) | "Estatísticas", "relatório", "dados" |

---

## Hierarquia de Escalação

```
                         ARCHITECT_ZERO
                              ↑
    ┌──────────────┬──────────┼──────────┬──────────────┐
    │              │          │          │              │
TECH_LEAD   FRACTAL_GUARDIAN  │    PSYCHOLOGIST    BRAINSTORM
    │              │          │          │              │
    │              │   TALENT_MULTIPLIER ← ← ← ← ← ← ← ←┤
    │              │     (valida todos)                 │
┌───┴───┐    ┌─────┴─────┐                              │
│       │    │           │                              │
DUE     │  DESIGN    CONTENT_ARCHITECT ←────────────────┘
DILIGENCE   SYSTEM
    │
SOLANA_ARCHITECT
```

---

## Quando Usar Cada Agent

### ARCHITECT_ZERO 👁️
- **Quando**: Decisões fundamentais, dúvidas éticas, validação de propósito
- **Escala para**: Nenhum (é o topo da hierarquia)

### CONTENT_ARCHITECT ✍️
- **Quando**: Criar páginas, artigos, landing pages, microcopy
- **Colabora com**: DESIGN_SYSTEM (visual), TECH_LEAD (implementação)
- **Escala para**: ARCHITECT_ZERO (dúvidas éticas)

### DESIGN_SYSTEM 🎨
- **Quando**: CSS, tokens, tema, cores, glassmorphism
- **Colabora com**: CONTENT_ARCHITECT (visual de conteúdo)
- **Escala para**: FRACTAL_GUARDIAN (consistência de padrões)

### FRACTAL_GUARDIAN 🌀
- **Quando**: Criar módulos, validar estrutura, revisar PRs grandes
- **Colabora com**: TECH_LEAD (código), DESIGN_SYSTEM (padrões)
- **Escala para**: ARCHITECT_ZERO (decisões filosóficas)

### TECH_LEAD 🔍
- **Quando**: Code review, tipagem, convenções, antes de commits
- **Colabora com**: FRACTAL_GUARDIAN (estrutura), DUE_DILIGENCE (segurança)
- **Escala para**: FRACTAL_GUARDIAN (questões arquiteturais)

### DUE_DILIGENCE 🔐
- **Quando**: Auditar segurança, smart contracts, riscos
- **Colabora com**: TECH_LEAD (código)
- **Escala para**: ARCHITECT_ZERO (riscos éticos)

### PSYCHOLOGIST 🧠
- **Quando**: Questionar propósito, analisar UX, desconstruir ideias
- **Colabora com**: CONTENT_ARCHITECT (tom), ARCHITECT_ZERO (filosofia)
- **Escala para**: ARCHITECT_ZERO (questões existenciais)

### SOLANA_ARCHITECT ⚡
- **Quando**: Criar token SPL, definir tokenomics, whitepaper, lançamento
- **Colabora com**: TECH_LEAD (implementação), DUE_DILIGENCE (segurança)
- **Escala para**: ARCHITECT_ZERO (decisões éticas sobre o token)

### BRAINSTORM 💡
- **Quando**: Gerar ideias, explorar possibilidades, sessões criativas
- **Colabora com**: CONTENT_ARCHITECT (execução), PSYCHOLOGIST (análise)
- **Escala para**: ARCHITECT_ZERO (validação ética de ideias)

### TALENT_MULTIPLIER 💰
- **Quando**: Validar monetização, ROI, viabilidade, sustentabilidade
- **Colabora com**: TODOS (valida geração de valor real)
- **Escala para**: ARCHITECT_ZERO (questões éticas sobre dinheiro)
- **Especial**: Deve ser consultado por todos os agents antes de decisões que envolvam recursos

### DATA_ANALYST 📊
- **Quando**: Estatísticas do projeto, relatórios, métricas, gaps de conteúdo
- **Colabora com**: TECH_LEAD (queries), CONTENT_ARCHITECT (gaps)
- **Escala para**: ARCHITECT_ZERO (decisões baseadas em dados)

---

## Referências Estáticas

| Documento | Propósito |
|-----------|-----------|
| [_DNA.md](./_DNA.md) | Mantra e valores (herdado por todos) |
| [workflows/AI-PRIMER.md](./workflows/AI-PRIMER.md) | Onboarding para IAs |
| [workflows/MANIFEST.agi.md](./workflows/MANIFEST.agi.md) | Missão e propósito |
| [workflows/ARCHITECTURE.fractal.md](./workflows/ARCHITECTURE.fractal.md) | Filosofia fractal |
| [workflows/TRANSPARENCY_POLICY.md](./workflows/TRANSPARENCY_POLICY.md) | Política ética do token |

---

```yaml
@agi-metadata:
  inherits: _DNA.md
  updates: on-agent-change
```
