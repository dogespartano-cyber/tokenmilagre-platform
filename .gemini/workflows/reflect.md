---
type: workflow
version: 1.0.0
inherits: _DNA.md
description: Self-correction loop (Reflexion pattern) - revisar e melhorar outputs
trigger: "/reflect", "revisar output", "auto-avaliar", "melhorar resposta"
---

# 🔄 Self-Correction Workflow (Reflexion Pattern)

> **Regra:** Todo output importante merece uma segunda olhada.

---

## 🎯 Propósito

Implementar o padrão Reflexion para auto-avaliação e correção de outputs, aumentando a qualidade e reduzindo erros.

---

## 🧠 Como Funciona

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   OUTPUT    │ ──▶ │   CRITIQUE  │ ──▶ │   REFINE    │
│  Inicial    │     │   (Avaliar) │     │  (Corrigir) │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  COMPARE    │
                    │ (Melhorou?) │
                    └─────────────┘
```

---

## 📋 Checklist de Auto-Avaliação

### 1. Correção Técnica
- [ ] O código compila/executa sem erros?
- [ ] Os tipos estão corretos (sem `any`)?
- [ ] Segue os padrões do projeto?

### 2. Completude
- [ ] Atende todos os critérios de sucesso da spec?
- [ ] Edge cases foram tratados?
- [ ] Não há TODOs deixados para trás?

### 3. Qualidade
- [ ] O código é legível?
- [ ] Há comentários onde necessário?
- [ ] Performance foi considerada?

### 4. Segurança
- [ ] Inputs são validados?
- [ ] Não há secrets expostos?
- [ ] Seguiu princípios de menor privilégio?

---

## 🔄 Protocolo de Iteração

### Limite: Máximo 3 iterações

| Iteração | Foco |
|:--:|:--|
| 1 | Corrigir erros óbvios |
| 2 | Refinar qualidade |
| 3 | Polimento final |

> [!CAUTION] LIMITE ATINGIDO
> Após 3 iterações: entregar com ressalvas documentadas.

---

## 📝 Template de Reflexão

```markdown
## 🔄 Reflexion: [Nome do Output]

### Output Original
[Resumo do que foi produzido]

### Crítica
**Pontos Fortes:**
- [+] ...

**Pontos a Melhorar:**
- [-] ...

### Refinamentos Aplicados
1. [Mudança 1]
2. [Mudança 2]

### Resultado
- Iteração: [1/2/3]
- Status: [MELHOROU | SEM MUDANÇA | REQUER MAIS]
```

---

## 📝 Few-Shot Examples

### Exemplo 1: Refinando Código
**Input:** "Reflita sobre o componente UserCard que acabei de criar"
**Output:**
```markdown
## 🔄 Reflexion: UserCard Component

### Crítica
**Pontos Fortes:**
- [+] Estrutura clara
- [+] Props tipadas corretamente

**Pontos a Melhorar:**
- [-] Falta loading state
- [-] Imagem sem fallback

### Refinamentos Aplicados
1. Adicionado `isLoading` prop com skeleton
2. Adicionado fallback para avatar

### Resultado
- Iteração: 1/3
- Status: MELHOROU ✅
```

### Exemplo 2: Limite Atingido
**Input:** "Continue refinando" (após 3 iterações)
**Output:**
```markdown
## ⚠️ Limite de Reflexion Atingido

Após 3 iterações, o output atual é:
- [Resumo do estado atual]

**Ressalvas pendentes:**
- [Item que não foi possível resolver]

Recomendação: Escalar para revisão humana.
```

---

```yaml
@agi-metadata:
  type: workflow
  trigger: /reflect
  purpose: self-correction
  max_iterations: 3
  pattern: reflexion
  created: 2026-01-10
```
