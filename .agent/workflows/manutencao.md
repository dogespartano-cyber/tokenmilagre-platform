---
type: workflow
version: 1.0.0
inherits: _DNA.md
description: Manutenção obrigatória do ecossistema de agents - execute semanalmente
trigger: "/manutencao", "manter agents", "health check agents"
---

# 🔧 Manutenção do Ecossistema de Agents

> *"Um sistema não mantido é um sistema morrendo."*

**Propósito**: Garantir que o ecossistema de agents permaneça útil, sincronizado e livre de degradação.

---

## Quando Executar

| Gatilho | Frequência |
|---------|------------|
| **Automático** | Toda segunda-feira (início de sprint) |
| **Manual** | Após grandes refatorações |
| **Obrigatório** | Antes de releases |

---

## O Processo (4 Fases)

### Fase 1: Verificação de Integridade (5 min)

**1.1 Verificar referências de arquivos**

```bash
# Executar no diretório do projeto
cd /home/zenfoco/Dev/tokenmilagre-platform

# Verificar se paths referenciados existem
for ref in \
  "lib/core/theme/" \
  "lib/core/constants/" \
  "lib/domains/" \
  "prisma/schema.prisma" \
  "Feedback/backlog/BACKLOG.md" \
  "Feedback/logs/HISTORICO.md"; do
  if [ -e "$ref" ]; then
    echo "✅ $ref"
  else
    echo "❌ FALTANDO: $ref"
  fi
done
```

**1.2 Verificar estrutura do Feedback/**

```bash
ls -la Feedback/
# Esperado: backlog/, logs/, ideas/, notes/
```

**1.3 Verificar última auditoria**

```bash
ls -la Feedback/logs/AUDITORIA_*.md 2>/dev/null | tail -3
# Se última auditoria > 7 dias: EXECUTAR /consistencia
```

---

### Fase 2: Auditoria de Referências (10 min)

**2.1 Listar todas as referências nos agents**

```bash
grep -r "@references:" .agent/workflows/ -A 10 | grep -E "^\s+-"
```

**2.2 Para cada referência, verificar se existe**

| Tipo de Referência | Como Verificar |
|--------------------|----------------|
| `./ARQUIVO.md` | `ls .agent/workflows/ARQUIVO.md` |
| `lib/path/` | `ls lib/path/` |
| `app/path/` | `ls app/path/` |
| `prisma/` | `ls prisma/` |

**2.3 Corrigir ou remover referências quebradas**

Se arquivo não existe:
1. Arquivo foi renomeado? → Atualizar referência
2. Arquivo foi deletado? → Remover referência
3. Arquivo deveria existir? → Criar arquivo ou escalar

**2.4 ⚠️ CRÍTICO: Verificar YAML frontmatter em TODOS os arquivos**

```bash
# Listar arquivos SEM header YAML válido
for f in .agent/workflows/*.md; do
  if ! head -1 "$f" | grep -q "^---$"; then
    echo "❌ SEM FRONTMATTER: $f"
  fi
done
```

**2.5 Verificar se TODOS os .md estão no _INDEX.md**

```bash
# Comparar arquivos existentes vs listados no índice
for f in .agent/workflows/*.md; do
  basename=$(basename "$f")
  if ! grep -q "$basename" .agent/_INDEX.md; then
    echo "⚠️ Não listado no _INDEX: $basename"
  fi
done
```

> **Lição aprendida**: Arquivos sem nomenclatura `-agent.md` podem escapar da auditoria. Verificar TODOS os `.md`, não apenas os agents.

### Fase 3: Sincronização com Código (15 min)

**3.1 Verificar se agents refletem estrutura real**

| Agent | Verificar |
|-------|-----------|
| DESIGN | `lib/core/theme/` existe e tem os arquivos citados? |
| CODIGO | Convenções citadas ainda são válidas? |
| ESTRUTURA | Hierarquia de pastas ainda está correta? |
| DADOS | Queries Prisma ainda funcionam? |
| DATABASE | Scripts `npm run db:*` funcionam? |

**3.2 Atualizar agents se necessário**

Se código mudou → atualizar agent correspondente
Se agent menciona arquivo que não existe mais → atualizar ou remover

**3.3 Atualizar timestamps**

```yaml
# No final de cada agent modificado:
@last-verified: YYYY-MM-DD
```

---

### Fase 4: Registro e Próximos Passos (5 min)

**4.1 Criar entrada no HISTORICO.md**

```markdown
## [DATA] - Manutenção de Agents

### Verificações
- [x] Referências de arquivos verificadas
- [x] Estrutura Feedback/ OK
- [x] Última auditoria: [DATA]

### Correções Aplicadas
- [lista de correções]

### Issues Encontradas
- [lista de issues para próxima manutenção]

### Próxima Manutenção
- Data: [próxima segunda-feira]
```

**4.2 Se encontrou issues críticas**

→ Criar item no `Feedback/backlog/BACKLOG.md`
→ Escalar para ARQUITETO se for decisão filosófica

---

## Checklist Rápido

Antes de marcar manutenção como completa:

- [ ] Todos os paths em `@references` existem
- [ ] `Feedback/` tem estrutura completa
- [ ] Última auditoria < 7 dias (ou executar)
- [ ] Agents refletem código atual
- [ ] Entrada adicionada ao HISTORICO.md
- [ ] Issues registradas no BACKLOG.md

---

## Métricas de Saúde

| Métrica | Verde | Amarelo | Vermelho |
|---------|-------|---------|----------|
| Referências quebradas | 0 | 1-2 | 3+ |
| Dias desde última auditoria | < 7 | 7-14 | 15+ |
| Agents sem `@last-verified` | 0-3 | 4-7 | 8+ |
| Issues no BACKLOG | < 10 | 10-20 | 20+ |

---

## Automação (Futuro)

Para automatizar esta verificação, criar script em `scripts/agent-health-check.sh`:

```bash
#!/bin/bash
# TODO: Implementar verificação automática
# - Checar referências
# - Alertar se manutenção atrasada
# - Gerar relatório
```

---

## Escalação

Se durante a manutenção encontrar:

| Situação | Escalar Para |
|----------|--------------|
| Referência para arquivo que nunca existiu | ARQUITETO |
| Agent está completamente desatualizado | ESTRUTURA |
| Conflito entre agents | ARQUITETO |
| Dúvida sobre manter ou deletar | ARQUITETO |

---

```yaml
@workflow-links:
  - /consistencia: Para auditorias de conteúdo
  - /verificacao: Para verificar antes de concluir
@created: 2025-12-29
@author: DevSenior Agent
```
