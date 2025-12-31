---
description: Consulta automática de contexto do projeto via Graphiti antes de começar trabalho
---

# /chaos - Contexto Instantâneo

> Workflow para obter contexto completo do projeto em segundos.

## Quando Usar

- **Início de sessão** - Antes de qualquer trabalho
- **Mudança de contexto** - Ao trocar de feature/área
- **Dúvidas sobre decisões** - "Por que fizemos X?"

## Execução

### 1. Verificar Graphiti

```bash
// turbo
curl -s http://localhost:8000/health | jq '.status'
```

Se offline, use fallback em `Feedback/logs/knowledge-fallback.jsonl`.

### 2. Buscar Contexto Relevante

Substitua `<CONTEXTO>` pela área de trabalho atual:

```bash
curl -s -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "<CONTEXTO>", "limit": 10}' | jq '.results'
```

**Exemplos de contexto:**
- `"autenticação clerk"`
- `"editor tiptap"`
- `"decisões de arquitetura"`
- `"última sessão"`

### 3. Listar Tarefas Pendentes

```bash
// turbo
cat /home/zenfoco/Dev/tokenmilagre-platform/Feedback/backlog/BACKLOG.md | head -50
```

### 4. Resumir Estado Atual

Após os comandos acima, gere um resumo:

```yaml
Estado do Projeto:
  Última sessão: [resumo do Graphiti]
  Tarefas pendentes: [do BACKLOG.md]
  Contexto relevante: [fatos do Graphiti]
  Próximos passos sugeridos: [baseado no contexto]
```

---

## Saída Esperada

Após executar `/chaos`, você deve ter:

1. ✅ Verificação de que Graphiti está online
2. ✅ Contexto relevante da área de trabalho
3. ✅ Lista de tarefas pendentes
4. ✅ Resumo estruturado para começar

---

```yaml
@agi-metadata:
  type: workflow
  trigger: /chaos
  purpose: context-retrieval
  requires: graphiti-online
  created: 2025-12-31
```
