---
type: workflow
inherits: _DNA.md
description: Registro de sessão no Graphiti ao final do trabalho
---

# /sessao - Finalizar e Registrar

> Workflow para registrar o trabalho da sessão no sistema de conhecimento.

## Quando Usar

- **Final de sessão** - Antes de encerrar o chat
- **Após decisões importantes** - Para não perder contexto
- **Marcos de progresso** - Conclusão de features

## Execução

### 1. Verificar Graphiti

```bash
// turbo
curl -s http://localhost:8000/health | jq '.status'
```

### 2. Preparar Resumo

Crie um resumo estruturado:

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

```bash
curl -s -X POST http://localhost:8000/add-episode \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "zenfoco",
    "name": "[TITULO DA SESSAO]",
    "text": "[RESUMO COMPLETO]",
    "source": "session",
    "source_description": "Sessão Claude YYYY-MM-DD"
  }'
```

### 4. Atualizar BACKLOG (se necessário)

Se houver novas tarefas ou tarefas concluídas:

```bash
// turbo
cat /home/zenfoco/Dev/tokenmilagre-platform/Feedback/backlog/BACKLOG.md
```

Edite movendo tarefas entre colunas.

### 5. Confirmar Registro

```bash
// turbo
curl -s -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "última sessão", "limit": 3}' | jq '.results[0]'
```

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
@last-verified: 2025-12-31
```
