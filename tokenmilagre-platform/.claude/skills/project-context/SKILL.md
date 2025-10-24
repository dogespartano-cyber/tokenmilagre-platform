---
name: project-context
description: ALWAYS use this skill at the start of EVERY conversation to load essential project guidelines, critical rules, interaction protocols, documentation structure, and philosophy. This is the foundation skill that must be loaded first. Automatically starts development server if not running.
allowed-tools: Read, Bash
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
- 📝 Update history

---

## 🎯 After Loading

Once you've read CLAUDE-MEMORY.md, you'll know:

1. **How to interact with the user** - The absolute rule: ALWAYS ask before executing code
2. **Documentation structure** - When to consult LOG.md and sugestões.md
3. **Project values** - Minimalism, accessibility, open source, education, security
4. **Critical Git rules** - Only commit files inside tokenmilagre-platform/
5. **What to avoid** - Design and code anti-patterns

---

## 🚀 Auto-Start Development Server

**IMPORTANT**: After loading CLAUDE-MEMORY.md, automatically check and start the development server.

### Check if Server is Running

```bash
# Check for Next.js dev server on port 3000
lsof -i :3000 -t > /dev/null 2>&1 || echo "NOT_RUNNING"
```

### If Server is NOT Running

**Automatically execute** (without asking, as per user request):

```bash
npm run dev > /dev/null 2>&1 &
```

**Then inform the user**:
```
✅ Servidor de desenvolvimento iniciado automaticamente
🌐 http://localhost:3000
```

### If Server IS Running

**Silently skip** (no need to inform the user)

### Exception to "Always Ask" Rule

This is an **explicit exception** to the "ALWAYS ask before executing" rule because:
1. User explicitly requested this automation
2. Starting dev server is non-destructive
3. Improves workflow efficiency
4. Equivalent to "Rode o servidor" command (immediate execution)

---

## 🔗 Related Skills

After loading project context, use these specialized skills when needed:

- **`article-creation`** - When creating/editing articles or news
- **`design-system`** - When working with design, CSS, or components
- **`database-setup`** - When working with Prisma, database, or deployment
- **pages-reference** - When modifying or understanding page-specific features

---

## 📖 Instructions for Claude

When this skill is invoked:

1. Read `/home/destakar/Trabalho/CLAUDE-MEMORY.md` completely
2. **Check and auto-start development server** (see section above)
   - Check if port 3000 is in use
   - If not, start `npm run dev` in background
   - Inform user if server was started
3. Acknowledge that you've loaded the project context
4. Be ready to follow all critical rules, especially:
   - ALWAYS ask before executing code (except auto-start server)
   - NEVER commit files outside tokenmilagre-platform/
   - Use Prisma directly in Server Components (no HTTP fetch)
5. Consult LOG.md when historical context is needed
6. Consult sugestões.md before suggesting improvements

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-10-24 (adicionado auto-start server)
