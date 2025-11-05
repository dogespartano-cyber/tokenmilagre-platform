# 📚 Documentação Local (docs-local/)

Esta pasta contém documentação e arquivos de referência **locais** do projeto Token Milagre.

⚠️ **IMPORTANTE**: Esta pasta está no `.gitignore` e **NÃO** é versionada no GitHub.

---

## 📁 Arquivos

### **CLAUDE-MEMORY.md**
Memória principal do Claude Code com:
- Regras críticas de interação
- Estrutura de documentação
- Filosofia do projeto
- Regras de Git
- Sistema Admin AI Assistant

**Uso**: Sempre carregar no início de conversas com Claude Code (skill: `project-context`)

---

### **LOG.md**
Histórico detalhado de mudanças e decisões técnicas do projeto.

**Conteúdo**:
- Changelog de features implementadas
- Bugs corrigidos
- Decisões arquiteturais
- Problemas encontrados e soluções

---

### **sugestões.md**
Lista de melhorias futuras, ideias e backlog.

**Conteúdo**:
- Features planejadas
- Otimizações pendentes
- Ideias da comunidade
- Melhorias de UX/UI

---

### **MELHORIAS-EDITOR-IA.md**
Roadmap completo das melhorias do Editor com IA Gemini.

**Conteúdo**:
- ✅ Fase 1: Fundação (completa)
- ✅ Fase 2: UX crítica (completa)
- 📅 Fase 3: Recursos avançados (planejada)

---

### **COMO-VER-LOGS-CAPAS.md**
Tutorial sobre debugging de capas geradas por IA.

---

### **PROBLEMA-QUOTA-GEMINI-IMAGE.md**
Documentação sobre limitações de quota do Gemini Image Generation.

---

## 🔒 Segurança

Esta pasta está **protegida** pelo `.gitignore`:

```gitignore
/docs-local/
```

**Por quê?**
- Contém informações de desenvolvimento local
- Pode ter credenciais ou dados sensíveis
- Memória do Claude é específica do desenvolvedor
- Evita commits acidentais de rascunhos

---

## 📖 Como Usar

### Para Claude Code:
```bash
# Carregar contexto do projeto
skill: project-context
```

### Para Desenvolvedores:
```bash
# Ver logs de mudanças
cat docs-local/LOG.md | tail -50

# Ver sugestões pendentes
cat docs-local/sugestões.md

# Ver roadmap do editor
cat docs-local/MELHORIAS-EDITOR-IA.md
```

---

## 🚀 Manutenção

**Atualizar LOG.md** após cada feature implementada:
```markdown
## [2025-11-04] Feature X implementada
- Descrição
- Impacto
- Commit: abc123
```

**Atualizar sugestões.md** ao adicionar ideias:
```markdown
### Feature: Nome
**Descrição**: ...
**Prioridade**: Alta/Média/Baixa
```

---

**Última atualização**: 2025-11-04
