---
type: workflow
inherits: _DNA.md
description: Registro de sessão no Graphiti ao final do trabalho (Antigravity v2.0)
---

# /sessao - Finalizar e Registrar (v2.0)

> Workflow para registrar o trabalho da sessão no sistema de conhecimento.

## Quando Usar

- **Final de sessão** - Antes de encerrar o chat
- **Após decisões importantes** - Para não perder contexto
- **Marcos de progresso** - Conclusão de features

## Execução

### 1. Verificar Graphiti

Verifique se a memória está ativa.
> **Tool:** `graphiti_health`

### 2. Preparar Resumo

Crie um resumo estruturado. 
**OBRIGATÓRIO:** Iniciar com Identity Header e assinar como o Agent responsável (ou ANALISTA).

```yaml
Sessão:
  Data: YYYY-MM-DD
  Foco: [área principal de trabalho]
  
  Autoanálise:
    Eficiência: [Nota 0-10]
    Workflow: [Seguido / Adaptado / Falhou]
    Agents: [Agents acionados e se foram úteis]
    Melhorias: [O que melhorar no processo para a próxima vez]

  O que foi feito:
    - [item 1]
    - [item 2]
    
  Decisões tomadas:
    - [decisão importante]
    
  Próximos passos:
    - [tarefa pendente]
```

### 3. Registrar no Graphiti

Persista o conhecimento na memória de longo prazo.

> **Tool:** `graphiti_add_episode`

**Parâmetros:**
- `name`: "[TITULO DA SESSAO]"
- `text`: "[RESUMO COMPLETO DO YAML]"
- `source`: "session"
- `source_description`: "Sessão Antigravity YYYY-MM-DD (TokenMilagre)"

### 4. Atualizar BACKLOG (se necessário)

Se houver novas tarefas ou tarefas concluídas, atualize o arquivo mestre.

> **Tool:** `replace_file_content` (ou edit) em `Feedback/backlog/BACKLOG.md`

### 5. Confirmar Registro

Verifique se foi gravado corretamente.

> **Tool:** `graphiti_search` (query: "última sessão")

---

## Template de Registro Rápido

Para sessões simples, use este formato:

```
[TITULO]: Implementação de [feature/fix]
[TEXTO]: Implementou X, corrigiu Y, decidiu Z. Próximo passo: W.
```

---

```yaml
@agi-metadata:
  type: workflow
  trigger: /sessao
  purpose: knowledge-persistence
  requires: graphiti-online
  created: 2025-12-31
  updated: 2026-01-04
  version: 2.0.0
@last-verified: 2026-01-04
```
