---
name: project-context
description: ALWAYS use this skill at the start of EVERY conversation to load essential project guidelines, critical rules, interaction protocols, documentation structure, and philosophy. This is the foundation skill that must be loaded first.
allowed-tools: Read
---

# Project Context Skill

**⚠️ CRITICAL**: This skill must be loaded at the start of every conversation to understand project guidelines and critical rules.

---

## 📚 Load Project Memory

When this skill is invoked, read the following file to load all essential project context:

**File**: `/home/destakar/Trabalho/CLAUDE-MEMORY.md`

This file contains:
- ⚠️ Critical interaction rules (ALWAYS ask before executing)
- 📚 Documentation structure (CLAUDE-MEMORY.md, LOG.md, sugestões.md)
- 🎯 Project philosophy and values
- 🚫 What to avoid
- 📞 Official links
- ⚠️ Critical Git rules
- 🤖 Admin AI Assistant (complete architecture)
- 📝 Update history

---

## 🎯 After Loading

Once you've read CLAUDE-MEMORY.md, you'll know:

1. **How to interact with the user** - The absolute rule: ALWAYS ask before executing code
2. **Documentation structure** - When to consult LOG.md and sugestões.md
3. **Project values** - Minimalism, accessibility, open source, education, security
4. **Critical Git rules** - Only commit files inside tokenmilagre-platform/
5. **What to avoid** - Design and code anti-patterns
6. **AI Assistant system** - Chat in `/dashboard/chat` with natural language detection

---

## 🔗 Related Skills

After loading project context, use these specialized skills when needed:

- **`article-creation`** - When creating/editing articles or news
- **`design-system`** - When working with design, CSS, or components
- **`database-setup`** - When working with Prisma, database, or deployment
- **`pages-reference`** - When modifying or understanding page-specific features
- **`troubleshooting`** - When encountering bugs or performance issues (scroll, cache, flash visual)

---

## 📖 Instructions for Claude

When this skill is invoked:

1. Read `/home/destakar/Trabalho/CLAUDE-MEMORY.md` completely
2. Acknowledge that you've loaded the project context
3. Be ready to follow all critical rules, especially:
   - ALWAYS ask before executing code
   - NEVER commit files outside tokenmilagre-platform/
   - NEVER run build or dev server commands
   - Use Prisma directly in Server Components (no HTTP fetch)
   - **BE CONCISE** - Respostas curtas e diretas (usuário prefere economia de tokens)
4. Consult LOG.md when historical context is needed
5. Consult sugestões.md before suggesting improvements

---

## 🔍 Quick References

**AI Assistant System**:
- Location: `/dashboard/chat` (full screen, natural language)
- Full details in CLAUDE-MEMORY.md → Section "🤖 Admin AI Assistant"

**Update ETF Data**:
- Guide: `docs/ATUALIZAR-ETFS.md`
- Component: `components/ETFMetricsSection.tsx` (line ~30)
- Sources: Farside Investors, CoinGlass, SoSoValue

**Server Management**:
- Script: `/home/destakar/Trabalho/server-manager.sh`
- Commands: start, stop, restart, status

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-11-01 (otimização - removida duplicação de conteúdo)
