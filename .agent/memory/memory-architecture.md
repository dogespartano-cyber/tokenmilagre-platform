---
type: reference
version: 1.0.0
inherits: _DNA.md
purpose: memory-system-architecture
tags:
  - memory
  - graphiti
  - context
---

# 🧠 Memory Architecture (Triple-Store System)

> Sistema de memória em três camadas para agents, alinhado com práticas 2026.

---

## Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    MEMORY SYSTEM                            │
├─────────────────┬─────────────────┬─────────────────────────┤
│   SHORT-TERM    │    LONG-TERM    │       EPISODIC          │
│   (Context)     │   (Graphiti)    │      (Graphiti)         │
├─────────────────┼─────────────────┼─────────────────────────┤
│ • Current task  │ • decisions     │ • session logs          │
│ • Active files  │ • troubleshoot  │ • handoff records       │
│ • Recent edits  │ • codeindex     │ • milestones            │
│ • User intent   │ • patterns      │ • routing history       │
├─────────────────┼─────────────────┼─────────────────────────┤
│ Max: 8K tokens  │ Persistent      │ Persistent              │
│ Volatile        │ Searchable      │ Time-indexed            │
└─────────────────┴─────────────────┴─────────────────────────┘
```

---

## 1. Short-Term Memory (Context Window)

**Provider:** LLM Context Window
**Limite:** ~8.000 tokens dedicados ao contexto ativo

### O que armazenar:
- Arquivos atualmente abertos/modificados
- Intenção do usuário na sessão atual
- Últimas 3-5 ações executadas
- Estado atual do ROUTER (delegações)

### Compressão Inteligente

Quando o contexto exceder 80% da capacidade:
1. **Sumarizar** histórico antigo (não deletar)
2. **Priorizar** arquivos mais recentes
3. **Mover** decisões importantes → Long-term

```yaml
@compression-rules:
  trigger: context_usage > 80%
  actions:
    - summarize_old_messages
    - keep_last_5_tool_calls
    - preserve_user_intent
    - promote_decisions_to_longterm
```

---

## 2. Long-Term Memory (Graphiti)

**Provider:** Graphiti (localhost:8000)
**Tipos de conhecimento:**

| Tipo | Quando Criar | Exemplo |
|:--|:--|:--|
| `decision` | Após escolhas arquiteturais | "Usar Clerk para auth" |
| `troubleshoot` | Após resolver bugs | "TypeError → falta field no schema" |
| `codeindex` | Documentar patterns | "Componentes seguem pattern X" |
| `pattern` | Padrões recorrentes | "API routes usam Zod validation" |

### Consulta Obrigatória

Antes de decisões importantes:
```bash
curl -X POST localhost:8000/search -d '{"query":"[contexto]", "limit": 5}'
```

### Registro Obrigatório

Após decisões importantes:
```bash
curl -X POST localhost:8000/add-episode -d '{
  "name": "[título]",
  "text": "[detalhes]",
  "source": "agent-[NOME]"
}'
```

---

## 3. Episodic Memory (Graphiti - Sessions)

**Provider:** Graphiti
**Propósito:** Rastrear histórico de sessões e handoffs

| Tipo | Descrição | Quando |
|:--|:--|:--|
| `session` | Resumo de sessão de trabalho | Final de cada sessão |
| `handoff` | Registro de delegação entre agents | Cada troca de agent |
| `milestone` | Marcos importantes do projeto | Releases, deploys, etc |

### Registro de Handoff

Quando ROUTER delegar:
```yaml
@handoff-record:
  from: ROUTER
  to: CODIGO
  reason: "keyword match: 'revisar código'"
  timestamp: [ISO]
  context_summary: "[1 linha]"
```

---

## Sync Protocol

### Promoção: Short → Long

Quando mover informação de short-term para long-term:
- Decisão tomada → `decision`
- Bug resolvido → `troubleshoot`
- Padrão identificado → `pattern`

### Degradação: Long → Archive

Informações não acessadas em 30 dias → marcar como `archived`

---

## Fallback (Graphiti Offline)

Se Graphiti não responder:
1. **Verificar** `graphiti_health` tool
2. **Usar fallback** em `Feedback/logs/knowledge-fallback.jsonl`
3. **Registrar** que fallback foi usado
4. **Sincronizar** quando Graphiti voltar

---

```yaml
@agi-metadata:
  inherits: _DNA.md
  purpose: memory-system-architecture
  referenced-by: [CONHECIMENTO, ROUTER, ALL_AGENTS]
  created: 2026-01-10
  version: 1.0.0
```
