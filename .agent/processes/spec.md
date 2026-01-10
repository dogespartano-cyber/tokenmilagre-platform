---
type: workflow
version: 1.0.0
inherits: _DNA.md
description: Workflow de Spec-Driven Development - especificar antes de implementar
trigger: "/spec", "especificar", "planejar feature", "definir requisitos"
---

# 📋 Spec-Driven Development Workflow

> **Regra de Ouro:** SEM SPEC = SEM CÓDIGO

---

## 🎯 Propósito

Garantir que toda implementação comece com uma especificação clara, reduzindo retrabalho e alinhando expectativas.

---

## 📝 Template de Especificação

```markdown
## 📋 Spec: [Nome da Feature/Task]

### Objetivo
[1 linha clara do que será feito]

### Critérios de Sucesso
- [ ] [Critério mensurável 1]
- [ ] [Critério mensurável 2]
- [ ] [Critério mensurável 3]

### Output Esperado
[Formato e estrutura do resultado final]

### Não-Objetivos (Fora do Escopo)
- [O que NÃO será feito]
- [Limitações explícitas]

### Edge Cases
- [Caso limítrofe 1]
- [Caso limítrofe 2]

### Dependências
- [Arquivos/módulos afetados]
- [APIs/serviços necessários]

### Estimativa
- Complexidade: [1-10]
- Tempo estimado: [X horas/dias]
```

---

## ✅ Checklist de Completude

Antes de prosseguir para implementação:

- [ ] **Objetivo** está claro em 1 linha?
- [ ] **Sucesso** é mensurável?
- [ ] **Output** está definido?
- [ ] **Não-objetivos** delimitam o escopo?
- [ ] **Dependências** foram identificadas?

---

## 🚦 Gate de Aprovação

> [!WARNING] OBRIGATÓRIO
> A spec DEVE ser aprovada pelo usuário antes de iniciar implementação.

Fluxo:
1. Criar spec usando template
2. Apresentar ao usuário via `notify_user`
3. Aguardar aprovação
4. Só então iniciar implementação

---

## 📝 Few-Shot Examples

### Exemplo 1: Feature Nova
**Input:** "Criar sistema de notificações push"
**Output (Spec):**
```markdown
## 📋 Spec: Sistema de Notificações Push

### Objetivo
Implementar sistema de notificações push para alertar usuários sobre eventos importantes.

### Critérios de Sucesso
- [ ] Notificações aparecem no browser
- [ ] Usuário pode optar por receber/não receber
- [ ] Histórico de notificações persistido

### Output Esperado
- Componente `NotificationBell.tsx`
- API route `/api/notifications`
- Tabela `Notification` no Prisma

### Não-Objetivos
- Push notifications mobile (fase futura)
- Notificações por email

### Estimativa
- Complexidade: 6/10
- Tempo: 2 dias
```

### Exemplo 2: Bug Fix
**Input:** "Corrigir erro de login no Safari"
**Output (Spec):**
```markdown
## 📋 Spec: Fix Login Safari

### Objetivo
Resolver incompatibilidade de autenticação com Safari.

### Critérios de Sucesso
- [ ] Login funciona em Safari 17+
- [ ] Sem regressão em Chrome/Firefox

### Output Esperado
- Patch em `lib/auth/clerk-config.ts`
- Teste E2E validando Safari
```

---

```yaml
@agi-metadata:
  type: workflow
  trigger: /spec
  purpose: spec-driven-development
  gates: [user_approval]
  created: 2026-01-10
```
