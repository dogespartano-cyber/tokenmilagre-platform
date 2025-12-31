---
type: workflow
inherits: _DNA.md
description: Prompt para auditoria completa do ecossistema de agents em nova sessão
trigger: /auditoria, /health-check, "verificar agents"
---

# /auditoria - Prompt para Nova Sessão

> Copie e cole este prompt ao iniciar uma nova sessão para auditar o ecossistema de agents.

---

## 🎯 Prompt para Colar

```
Preciso de uma auditoria completa do sistema de agents em .agent/

## Execute os Seguintes Passos

### 1. Script Automático
```bash
./scripts/agent-health-check.sh
```

### 2. Verificações Manuais (se script falhar)

1. **Graphiti**: `curl -s localhost:8000/health`
2. **Frontmatter**: Todos os *-agent.md devem ter `type`, `inherits`, `escalates-to`
3. **Workflows**: Todos os *.md devem ter `type`, `inherits`
4. **@last-verified**: Todos os arquivos devem ter no bloco final
5. **Integração CONHECIMENTO**: Todos agents devem mencionar CONHECIMENTO/Graphiti
6. **Paths**: lib/core/, lib/domains/, Feedback/ devem existir

### 3. Correções Necessárias
Se encontrar problemas, corrija automaticamente.

### 4. Registro
Registre no Graphiti:
```bash
curl -X POST localhost:8000/add-episode -d '{"user_id":"zenfoco","name":"AUDIT: [data]","text":"[resumo]","source":"session"}'
```

### Entregue
- Score final (X/100)
- Lista de correções aplicadas
- Próxima manutenção sugerida
```

---

## 📋 Checklist Rápido

Se preferir uma verificação manual rápida:

- [ ] `./scripts/agent-health-check.sh` passou?
- [ ] Graphiti responde em localhost:8000?
- [ ] GEMINI.md existe em `~/.homebox/dev-ubuntu/.gemini/`?
- [ ] CLAUDE.md está sincronizado?
- [ ] _INDEX.md reflete todos os agents?

---

## 🔄 Frequência Recomendada

| Quando | Ação |
|--------|------|
| Início de sessão | Executar script rápido |
| Semanalmente | Auditoria completa com prompt |
| Após criar novo agent | Verificar integração |
| Antes de deploy | Verificação obrigatória |

---

```yaml
@agi-metadata:
  type: workflow
  trigger: /auditoria
  purpose: ecosystem-audit
  created: 2025-12-31
@last-verified: 2025-12-31
```
