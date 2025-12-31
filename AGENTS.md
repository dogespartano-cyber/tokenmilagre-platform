# AI Context — $MILAGRE Project

> **LEIA ISTO PRIMEIRO** — Instruções obrigatórias para qualquer IA.

---

## 🎯 FORMATO DE RESPOSTA OBRIGATÓRIO

**Inicie TODA resposta com:**
```
🧠 Agent: [NOME DO AGENT]
📡 Graphiti: [online/offline]
📋 Contexto: [resumo de 1 linha]
```

---

## 🧠 Sistema de Agents Autônomos

Este projeto usa um **sistema de agents especializados** com memória persistente.

### Arquivos Essenciais (LER NA ORDEM)

1. **[.agent/_INDEX.md](.agent/_INDEX.md)** — Índice de todos os agents
2. **[.agent/workflows/ROUTER-agent.md](.agent/workflows/ROUTER-agent.md)** — Protocolo de auto-invocação
3. **[.agent/workflows/_DNA.md](.agent/workflows/_DNA.md)** — Valores imutáveis

### Protocolo Obrigatório

A cada mensagem, você DEVE:
1. **Classificar** a intenção (código, design, conteúdo, etc.)
2. **Carregar** o agent especializado apropriado
3. **Consultar** Graphiti para contexto: `curl -s -X POST localhost:8000/search -d '{"query":"<contexto>"}'`
4. **Documentar** decisões importantes automaticamente

### Ambiente

- **Container:** distrobox `dev-ubuntu`
- **Host:** Fedora Kinoite
- **Memória:** Graphiti (localhost:8000)
- **Stack:** Next.js + Prisma + Supabase

### Regras Críticas

- ❌ NUNCA commit/push sem ordem explícita
- ❌ NUNCA browser sem ordem explícita  
- ✅ BACKUP antes de operações de banco: `npm run db:backup`
- ✅ Consultar Graphiti para contexto histórico

---

**Veja:** [.agent/_INDEX.md](.agent/_INDEX.md) para lista completa de agents.
