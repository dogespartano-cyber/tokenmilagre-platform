---
type: workflow
version: 4.0.0
inherits: _DNA.md
description: Manutenção crítica automatizada do ecossistema de agents (v4.0)
trigger: "/manutencao", "manter agents", "health check agents", "auditoria crítica"
escalates-to: ARQUITETO
---

# 🔧 Manutenção Crítica do Ecossistema (v4.0)

> *"Um sistema não mantido é um sistema morrendo."* - Automação > Esforço Manual.

**Propósito**: Garantir a integridade, validade e sincronia de todos os agents e workflows, utilizando ferramentas automatizadas de validação.

---

## 🏎️ Execução Rápida (Prioritária)

Para uma verificação completa e imediata do sistema:

```bash
# Executa dashboard de saúde, validação de arquivos e verificação de hash-chain
npm run agents:dashboard
```

**O que este comando faz:**
1.  **Registry:** Carrega todos os arquivos `.md` e verifica sintaxe.
2.  **Validator:** Confere frontmatter, links quebrados e regras.
3.  **Integrity:** Verifica se a corrente de hashes (Blockchain interno) está válida.
4.  **Graphiti:** Testa a conexão com a memória.

---

## 🤖 Protocolo de Identidade (Core)

**Verificação de conformidade do `GEMINI.md`:**

```bash
# Verificar se o Bootloader está correto na raiz do projeto
cat GEMINI.md | head -n 20
```

Se precisar restaurar o bootloader padrão:
```bash
# CUIDADO: Isso sobrescreve o arquivo atual
cat .agent/rules/GEMINI_TEMPLATE.md > GEMINI.md
```

---

## 🔍 Processo de Auditoria Guiada

Se o dashboard automático apontar erros, siga este roteiro de correção:

### 1. Erros de Validação (Syntax/Frontmatter)
Se houver `Errors` ou `Warnings`:

```bash
npm run agents:validate
```
Isso listará especificamente qual arquivo está com problema. Edite o arquivo `.md` e corrija os campos obrigatórios (`type`, `identity-token`, `escalates-to`).

### 2. Quebra de Integridade (Hash Chain)
Se a integridade estiver corrompida ("Chain Broken"):

1.  Identifique qual arquivo foi alterado manualmente sem log.
2.  Gere um novo snapshot para "aceitar" o estado atual como o novo padrão:
    ```bash
    npx tsx lib/agents/integrity-tracker.ts --snapshot
    ```

### 3. Memória (Graphiti)
Se o Graphiti estiver `OFFLINE`:

> **Ação:** Verifique o container ou serviço no host.
> **Tool:** `graphiti_health` (MCP)

---

## 🛠️ Manutenção de Conteúdo

Use estas Tools para auditoria semântica (não detectada por scripts):

### Verificar Dead Agents
Identifique agents que ninguém chama.
> **Tool:** `graphiti_search` (query: "uso do agent [NOME]")

### Atualizar Dependências
Se atualizar bibliotecas core, verifique se os agents refletem isso.
> **Tool:** `grep_search` (query: "biblioteca antiga")

---

## 📝 Registro de Sessão (Finalização)

Após corrigir os problemas, registre a manutenção:

1.  **Indexar Manutenção:**
    > **Tool:** `graphiti_add_episode`
    > *   Name: "Manutenção do Sistema v4.0"
    > *   Text: "Executou dashboard, corrigiu X erros, validou integridade."
    > *   Source: "manutencao-agent"

2.  **Atualizar Backlog:**
    > **Tool:** `replace_file_content` em `Feedback/backlog/BACKLOG.md` se houver débitos técnicos descobertos.

---

```yaml
@agi-metadata:
  type: workflow
  trigger: /manutencao
  purpose: system-health-automation
  requires: npm, node, mcp-graphiti
  created: 2025-12-29
  updated: 2026-01-04
  version: 4.0.0
@collaborates:
  - CONHECIMENTO: Indexar resultados
  - ARQUITETO: Escalar problemas estruturais
@last-verified: 2026-01-04
```
