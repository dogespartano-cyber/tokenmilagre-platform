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
   - Use Prisma directly in Server Components (no HTTP fetch)
   - **BE CONCISE** - Respostas curtas e diretas (usuário prefere economia de tokens)
4. Consult LOG.md when historical context is needed
5. Consult sugestões.md before suggesting improvements

**Note**: Use `/home/destakar/Trabalho/server-manager.sh` to manage the development server (start/stop/restart/status).

---

## 🤖 Dashboard AI Assistant - Sistema de Linguagem Natural

**Status Atual**: Sistema 100% funcional (atualizado 2025-10-30)

### 🎯 Arquitetura Atual

**Interface**: Estilo Claude (minimalista)
- `/dashboard/page.tsx` - Tela limpa: header pequeno + chat full screen
- `_components/AIAssistant.tsx` - Input central quando vazio, chat quando ativo
- Sem sidebar, header, ou footer (dashboard isolado)
- Menu hamburger para navegação (artigos, usuários, config)

**Sistema Backend** (100% Linguagem Natural):
- `lib/admin-chat-context.ts` - Prompts sem menção a comandos `/`
- `app/api/admin-chat/route.ts` - Detector de intenção natural (`detectIntent`)
- `hooks/useAdminChat.ts` - Hook gerenciador de chat
- `lib/intent-detector.ts` - Reconhece ações em linguagem natural

### ⚡ Como Funciona

**Usuário fala naturalmente**:
- "Crie uma notícia sobre Bitcoin atingindo $100k"
- "Liste os últimos 10 artigos publicados"
- "Valide este artigo"
- "Mostre as estatísticas do blog"
- "Publique o artigo"

**Sistema**:
1. Detecta intenção com confiança ≥50%
2. Executa ação automaticamente (criar, listar, validar, publicar)
3. IA responde naturalmente (sem mencionar comandos técnicos)

### 🔧 Arquivos Críticos

```
app/dashboard/
├── page.tsx                       # Dashboard principal (limpo)
├── _components/
│   ├── AIAssistant.tsx           # Chat estilo Claude
│   └── StatsCards.tsx            # Cards de métricas (não usado no dashboard principal)

lib/
├── admin-chat-context.ts         # Prompts linguagem natural
└── intent-detector.ts            # Detecção de intenções

app/api/admin-chat/route.ts      # API com processIntent()
hooks/useAdminChat.ts             # Hook de gerenciamento
```

### 🚫 O QUE NÃO EXISTE MAIS

- ❌ Comandos `/create`, `/validate`, `/publish`, etc
- ❌ Botão flutuante de IA (agora é full screen)
- ❌ Sidebar em `/dashboard` (removida)
- ❌ Footer em `/dashboard` (removido)
- ❌ Cards/stats no dashboard principal (limpo estilo Claude)
- ❌ Instruções de comandos nos prompts

### ✅ Capacidades da IA

**Criar Conteúdo**:
- Notícias, artigos educacionais, recursos
- Geração automática via Perplexity (sonar model)
- Filtro de recência: 24h para news, 7d para pesquisas

**Gerenciar**:
- Listar artigos publicados
- Buscar por termo/categoria
- Deletar artigos
- Mostrar estatísticas

**Validar**:
- Score 0-100 de qualidade
- Detecta H1 duplicado, estrutura incorreta
- Verifica regras da skill article-creation

**Publicar**:
- Salva no banco PostgreSQL
- Redireciona automaticamente para artigo publicado

### 🔐 Segurança

- ✅ Auth obrigatória (ADMIN ou EDITOR)
- ✅ Rate limiting: 10 req/min
- ✅ Validação input: max 4000 chars
- ✅ Sanitização output: ReactMarkdown

### 💡 Dicas para Desenvolvedores

**Para adicionar nova ação**:
1. Adicionar intenção em `lib/intent-detector.ts`
2. Processar em `processIntent()` (`app/api/admin-chat/route.ts`)
3. Criar evento/handler em `hooks/useAdminChat.ts`

**Para melhorar detecção**:
- Adicionar mais padrões em `detectIntent()`
- Ajustar threshold de confiança (atual: 50%)
- Adicionar sinônimos e variações

---

## 📊 Atualização de Dados de ETFs

**Localização**: `docs/ATUALIZAR-ETFS.md`

Quando o usuário pedir para atualizar dados de ETFs:

1. **Leia o guia**: `docs/ATUALIZAR-ETFS.md`
2. **Arquivo alvo**: `components/ETFMetricsSection.tsx` (dados na linha ~30)
3. **Fontes de dados**:
   - Farside Investors: https://farside.co.uk/btc/ e https://farside.co.uk/eth/
   - CoinGlass: https://www.coinglass.com/bitcoin-etf e /eth-etf
   - SoSoValue: https://m.sosovalue.com/assets/etf/us-btc-spot

**Comandos comuns do usuário**:
- "Atualize os dados dos ETFs"
- "Atualize ETFMetricsSection com dados de hoje"
- "Dados de ETF desatualizados, atualize"

**Dados a atualizar** (marcados com `// ← ATUALIZAR` no código):
- `lastUpdate` - Data atual
- `totalAUM` - Assets Under Management total
- `inflows7d` - Inflows dos últimos 7 dias
- `inflows30d` - Inflows dos últimos 30 dias
- `topETFs` - Top 3 ETFs (nome, participação %, AUM)
- `trend` - 'positive' ou 'negative'

**Frequência recomendada**: Toda segunda-feira ou após grandes movimentos de mercado.

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-10-30 (adicionada seção AI Assistant 100% linguagem natural)
