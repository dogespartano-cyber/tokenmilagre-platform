---
type: workflow
version: 1.0.0
inherits: _DNA.md
description: Execução de planos em batches com checkpoints de revisão
source: Superpowers - obra/superpowers (executing-plans)
---

# Executando Planos

> Carregue o plano, revise criticamente, execute em batches, reporte para revisão.

**Princípio Core:** Execução em batches com checkpoints para revisão.

---

## O Processo

### Step 1: Carregar e Revisar Plano

1. Leia o arquivo do plano
2. Revise criticamente - identifique questões ou preocupações
3. Se houver preocupações: Levante com o usuário antes de começar
4. Se não houver: Prossiga para execução

---

### Step 2: Executar Batch

**Default: Primeiras 3 tarefas**

Para cada tarefa:
1. Marque como `em progresso`
2. Siga cada step exatamente (plano tem steps bite-sized)
3. Execute verificações como especificado
4. Marque como `completa`

---

### Step 3: Reportar

Quando batch completar:

```markdown
## Batch 1 Completo ✅

**Tarefas implementadas:**
- [x] Tarefa 1: Componente X
- [x] Tarefa 2: Componente Y  
- [x] Tarefa 3: Componente Z

**Verificação:**
\`\`\`
npm test
> 15/15 tests passing
\`\`\`

**Pronto para feedback.**
```

---

### Step 4: Continuar

Baseado no feedback:
- Aplique mudanças se necessário
- Execute próximo batch
- Repita até completar

---

### Step 5: Completar

Após todas as tarefas completas e verificadas:
- Use `/verificacao` para confirmar que tudo funciona
- Apresente opções: merge, PR, manter branch, descartar

---

## Quando Parar e Pedir Ajuda

**PARE imediatamente quando:**
- Encontrar blocker no meio do batch
- Plano tem gaps críticos
- Instrução não está clara
- Verificação falha repetidamente

**Pergunte ao invés de adivinhar.**

---

## Quando Voltar Atrás

**Volte para Revisão (Step 1) quando:**
- Usuário atualiza o plano baseado no seu feedback
- Abordagem fundamental precisa repensar

**Não force através de blockers** - pare e pergunte.

---

## Regras

| Regra | Descrição |
|-------|-----------|
| Siga steps exatamente | Não improvise ou pule |
| Não pule verificações | Execute os comandos |
| Entre batches: apenas reporte | Espere feedback |
| Pare quando bloqueado | Não adivinhe |

---

```yaml
@workflow-links:
  - /plano: Para criar o plano que este workflow executa
  - /verificacao: Verificar antes de marcar como completo
  - /tdd: Seguir TDD em cada tarefa
@source: https://github.com/obra/superpowers  
@created: 2025-12-22
```
