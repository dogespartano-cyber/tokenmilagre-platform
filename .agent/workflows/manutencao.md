---
type: workflow
version: 2.0.0
inherits: _DNA.md
description: Manutenção crítica e observadora do ecossistema - não apenas verificar, mas MELHORAR
trigger: "/manutencao", "manter agents", "health check agents", "auditoria crítica"
escalates-to: ARQUITETO
---

# 🔧 Manutenção Crítica do Ecossistema

> *"Um sistema não mantido é um sistema morrendo. Um sistema mantido sem crítica é um sistema estagnado."*

**Propósito**: Não apenas verificar, mas **observar criticamente**, **questionar** e **aprimorar proativamente** todo o ecossistema.

---

## 📊 Dashboard de Saúde

Antes de iniciar, capturar snapshot atual:

```bash
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           DASHBOARD DE SAÚDE - $(date '+%Y-%m-%d %H:%M')          ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║ Agents:        $(ls .agent/workflows/*-agent.md 2>/dev/null | wc -l) arquivos"
echo "║ Workflows:     $(ls .agent/workflows/*.md 2>/dev/null | grep -v agent | wc -l) arquivos"
echo "║ Last verified: $(grep -h "@last-verified" .agent/workflows/*.md | sort | head -1)"
echo "║ Graphiti:      $(curl -s http://localhost:8000/health 2>/dev/null | jq -r '.status // "offline"')"
echo "║ Fallback:      $(wc -l < Feedback/logs/knowledge-fallback.jsonl 2>/dev/null || echo 0) linhas"
echo "║ GEMINI.md:     $([ -s ~/.homebox/dev-ubuntu/.gemini/GEMINI.md ] && echo '✅' || echo '❌')"
echo "╚══════════════════════════════════════════════════════════════╝"
```

---

## 🤖 Configuração Antigravity (CRÍTICO)

> **Descoberta 2025-12-31:** O caminho do GEMINI.md dentro do distrobox é diferente!

### Caminho Correto

| Tipo | Caminho |
|------|---------|
| **✅ CORRETO (distrobox)** | `/home/zenfoco/.homebox/dev-ubuntu/.gemini/GEMINI.md` |
| ❌ Incorreto (home normal) | `/home/zenfoco/.gemini/GEMINI.md` |
| **✅ Workspace Rules** | `.agent/rules/` (dentro do projeto) |
| **✅ Workflows** | `.agent/workflows/` (invocados com `/`) |

### Verificar Sincronização

```bash
# Verificar se GEMINI.md está no local correto e tem conteúdo
if [ -s /home/zenfoco/.homebox/dev-ubuntu/.gemini/GEMINI.md ]; then
  echo "✅ GEMINI.md configurado corretamente"
  head -5 /home/zenfoco/.homebox/dev-ubuntu/.gemini/GEMINI.md
else
  echo "❌ GEMINI.md vazio ou inexistente!"
  echo "→ Copiar de .agent/rules/ ou CLAUDE.md"
fi
```

### Sincronizar se Necessário

```bash
# Se GEMINI.md estiver desatualizado, copiar da fonte
cp /home/zenfoco/Dev/tokenmilagre-platform/CLAUDE.md \
   /home/zenfoco/.homebox/dev-ubuntu/.gemini/GEMINI.md
```

### Verificar se Protocolo Funciona

Após sincronização, a IA deve iniciar respostas com:
```
🧠 Agent: [NOME]
📡 Graphiti: [status]
📋 Contexto: [1 linha]
```

---

## 🔍 Mentalidade Crítica

### O que BUSCAR ativamente

| Categoria | Perguntas Críticas |
|-----------|-------------------|
| **Utilidade** | Este agent ainda é útil? Alguém o usa? |
| **Redundância** | Dois agents fazem a mesma coisa? Podem ser fundidos? |
| **Completude** | Falta algo que deveria existir? |
| **Atualidade** | As informações estão corretas para o código atual? |
| **Conectividade** | Os agents colaboram corretamente? Há ilhas isoladas? |
| **Clareza** | Um novo desenvolvedor entenderia? |

### O que NÃO fazer

❌ Apenas verificar se arquivos existem (passivo)
❌ Ignorar agents que "parecem ok"
❌ Adiar melhorias para "depois"

### O que FAZER

✅ Questionar cada seção: "Isso ainda faz sentido?"
✅ Propor melhorias mesmo se nada estiver quebrado
✅ Registrar insights no grafo de conhecimento

---

## O Processo (6 Fases)

### Fase 1: Integridade Estrutural (5 min)

**1.1 Verificar referências de arquivos**

```bash
cd /home/zenfoco/Dev/tokenmilagre-platform

# Verificar paths essenciais
for ref in \
  "lib/core/theme/" \
  "lib/core/constants/" \
  "lib/domains/" \
  "lib/knowledge/" \
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
# NÃO esperado: .obsidian, arquivos temporários
```

---

### Fase 2: Auditoria de Referências (10 min)

**2.1 Verificar referências quebradas**

```bash
# Verificar se referências -agent.md existem
for f in .agent/workflows/*-agent.md; do
  grep -A20 "@references:" "$f" 2>/dev/null | grep -E "^\s+-.*\.md" | while read ref; do
    path=$(echo "$ref" | sed 's/.*- //' | tr -d ' ')
    if [[ "$path" == *"-agent.md"* ]] && [ ! -f ".agent/workflows/$(basename $path)" ]; then
      echo "❌ $f → $path (não encontrado)"
    fi
  done
done
```

**2.2 Verificar frontmatter padronizado**

```bash
for f in .agent/workflows/*-agent.md; do
  missing=""
  grep -q "^type:" "$f" || missing="$missing type"
  grep -q "escalates-to:" "$f" || missing="$missing escalates-to"
  grep -q "@last-verified:" "$f" || missing="$missing @last-verified"
  [ -n "$missing" ] && echo "⚠️ $(basename $f): falta$missing"
done
```

**2.3 🔍 CRÍTICO: Verificar consistência de colaborações**

```bash
# Todos os agents devem colaborar com CONHECIMENTO
for f in .agent/workflows/*-agent.md; do
  if ! grep -q "CONHECIMENTO" "$f"; then
    echo "⚠️ $(basename $f): não integrado com CONHECIMENTO"
  fi
done
```

---

### Fase 3: Análise Crítica de Conteúdo (15 min)

**3.1 Perguntas por Agent**

Para CADA agent, perguntar:

| Pergunta | Se NÃO | Ação |
|----------|--------|------|
| O trigger ainda faz sentido? | → | Atualizar triggers |
| Os exemplos de código funcionam? | → | Testar e corrigir |
| As referências estão corretas? | → | Atualizar paths |
| Há seções obsoletas? | → | Remover ou atualizar |
| Falta algo que deveria ter? | → | Adicionar |

**3.2 Verificar se código reflete agents**

```bash
# Verificar se estruturas citadas existem
ls -la lib/core/theme/ 2>/dev/null || echo "⚠️ DESIGN cita lib/core/theme/ mas não existe"
ls -la lib/domains/ 2>/dev/null || echo "⚠️ ESTRUTURA cita lib/domains/ mas não existe"
```

**3.3 Atualizar timestamps**

```bash
# Atualizar @last-verified para hoje em TODOS os arquivos verificados
today=$(date '+%Y-%m-%d')
for f in .agent/workflows/*.md; do
  if grep -q "@last-verified:" "$f"; then
    sed -i "s/@last-verified: .*/@last-verified: $today/" "$f"
  fi
done
```

---

### Fase 4: Grafo de Conhecimento (5 min)

**4.1 Verificar saúde do Graphiti**

```bash
curl -s http://localhost:8000/health
# ✅ {"status":"healthy"}
# ⚠️ Offline → usar fallback
```

**4.2 Verificar e limpar fallback**

```bash
lines=$(wc -l < Feedback/logs/knowledge-fallback.jsonl 2>/dev/null || echo 0)
echo "Fallback: $lines linhas"

if [ "$lines" -gt 100 ]; then
  echo "⚠️ Fallback muito grande - considerar sincronizar ou arquivar"
fi
```

**4.3 Indexar a manutenção atual**

```bash
npx tsx scripts/knowledge/index-session.ts "Manutenção semanal realizada: $(date '+%Y-%m-%d')"
```

---

### Fase 5: Propostas de Melhoria (10 min) 🆕

> **Esta é a fase crítica que diferencia manutenção passiva de melhoria ativa.**

**5.1 Identificar oportunidades**

| Área | Perguntas |
|------|-----------|
| **Novos agents** | Há funcionalidade que deveria ter um agent dedicado? |
| **Fusão de agents** | Dois agents similares podem ser combinados? |
| **Novos workflows** | Há processos repetitivos que podem ser documentados? |
| **Automação** | Algo manual pode ser automatizado? |

**5.2 Registrar propostas**

```markdown
## Propostas de Melhoria ($(date '+%Y-%m-%d'))

### Novos Agents Sugeridos
- [ ] [Nome]: [Justificativa]

### Melhorias em Agents Existentes
- [ ] [Agent]: [Melhoria sugerida]

### Automações Possíveis
- [ ] [Descrição]: [Benefício esperado]
```

→ Salvar em `Feedback/backlog/BACKLOG.md`

---

### Fase 6: Registro e Conhecimento (5 min)

**6.1 Criar entrada no HISTORICO.md**

```markdown
## [DATA] - Manutenção Crítica

### Verificações
- [x] Referências de arquivos: [OK/X issues]
- [x] Frontmatter padronizado: [OK/X issues]
- [x] Integração CONHECIMENTO: [OK/X issues]
- [x] Graphiti: [healthy/offline]

### Correções Aplicadas
- [lista]

### Propostas de Melhoria
- [lista de propostas geradas]

### Métricas Finais
| Métrica | Valor | Status |
|---------|-------|--------|
| Referências quebradas | X | 🟢/🟡/🔴 |
| Agents desatualizados | X | 🟢/🟡/🔴 |
| Graphiti status | X | 🟢/🟡/🔴 |
```

**6.2 Indexar no grafo de conhecimento**

```typescript
await knowledgeTracker.track('session', 
  'Manutenção crítica: X correções, Y propostas de melhoria',
  { tags: ['manutencao', 'auditoria'] }
);
```

---

## Checklist Final

Antes de marcar como completa:

### Integridade
- [ ] Todos os paths em `@references` existem
- [ ] Todos os agents têm frontmatter completo
- [ ] Todos integrados com CONHECIMENTO

### Atualidade
- [ ] `@last-verified` atualizado em todos
- [ ] Código e agents estão sincronizados
- [ ] Nenhum agent obsoleto

### Conhecimento
- [ ] Graphiti healthy OU fallback funcionando
- [ ] Fallback < 100 linhas
- [ ] Sessão indexada

### Melhoria (🆕)
- [ ] Pelo menos 1 proposta de melhoria registrada
- [ ] Propostas adicionadas ao BACKLOG.md

---

## Métricas de Saúde

| Métrica | 🟢 Verde | 🟡 Amarelo | 🔴 Vermelho |
|---------|----------|------------|-------------|
| Referências quebradas | 0 | 1-2 | 3+ |
| Dias desde manutenção | < 7 | 7-14 | 15+ |
| Agents sem @last-verified | 0 | 1-3 | 4+ |
| Issues no BACKLOG | < 10 | 10-20 | 20+ |
| Graphiti status | healthy | degraded | offline |
| Fallback lines | < 50 | 50-100 | 100+ |
| Propostas de melhoria | 1+ | 0 | - |

---

## Script de Verificação Automática

```bash
#!/bin/bash
# scripts/agent-health-check.sh

echo "🔧 Verificação de Saúde do Ecossistema"
echo "======================================"

errors=0
warnings=0

# 1. Verificar referências
echo -e "\n📁 Referências..."
for f in .agent/workflows/*-agent.md; do
  if grep -q "FALTANDO" <(grep -A10 "@references:" "$f"); then
    ((errors++))
  fi
done

# 2. Verificar frontmatter
echo -e "\n📋 Frontmatter..."
for f in .agent/workflows/*-agent.md; do
  if ! grep -q "escalates-to:" "$f"; then
    echo "⚠️ $(basename $f): sem escalates-to"
    ((warnings++))
  fi
done

# 3. Verificar Graphiti
echo -e "\n🧠 Graphiti..."
if ! curl -s http://localhost:8000/health | grep -q "healthy"; then
  echo "⚠️ Graphiti offline"
  ((warnings++))
fi

# 4. Resultado
echo -e "\n======================================"
echo "Erros: $errors | Avisos: $warnings"
[ $errors -eq 0 ] && [ $warnings -eq 0 ] && echo "✅ Ecossistema saudável!"
```

---

## Escalação

| Situação | Escalar Para |
|----------|--------------|
| Agent obsoleto que pode ser deletado | ARQUITETO |
| Conflito entre agents | ARQUITETO |
| Proposta de novo agent | ARQUITETO |
| Performance do Graphiti | CONHECIMENTO |
| Estrutura de pastas | ESTRUTURA |

---

```yaml
@workflow-links:
  - /consistencia: Para auditorias de conteúdo
  - /verificacao: Para verificar antes de concluir
  - /conhecimento: Para gerenciar o grafo
  - /chaos: Para contexto inicial via Graphiti
  - /sessao: Para registrar sessão ao finalizar
@collaborates:
  - CONHECIMENTO: Indexar resultados da manutenção
  - ARQUITETO: Escalar decisões críticas
@created: 2025-12-29
@updated: 2025-12-31
@version-notes: v3.0 - Adicionada seção Configuração Antigravity com caminho correto do GEMINI.md
```
