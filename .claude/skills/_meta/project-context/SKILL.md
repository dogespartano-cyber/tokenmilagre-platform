---
name: project-context
description: "Foundation skill - Project guidelines, critical rules, philosophy, stack. TRIGGERS: 'início de conversa', 'project context', 'contexto do projeto', 'regras do projeto', 'guidelines'. ALWAYS use at the start of EVERY conversation to load essential project guidelines, critical rules, interaction protocols, documentation structure, and philosophy."
allowed-tools: Read
---

# Project Context Skill

**⚠️ CRITICAL**: This skill must be loaded at the start of every conversation to understand project guidelines and critical rules.

---

## ⚠️ Regras Críticas de Interação

### 🚨 Regra #1: SEMPRE Perguntar Antes de Executar

**NUNCA execute código ou comandos sem confirmar com o usuário primeiro**, exceto:
- ✅ Leitura de arquivos (Read, Grep, Glob)
- ✅ Análise de código
- ✅ Pesquisas (WebSearch, WebFetch)

**SEMPRE pergunte antes de**:
- ❌ Criar/modificar/deletar arquivos
- ❌ Executar comandos bash
- ❌ Fazer commits Git
- ❌ Instalar dependências
- ❌ Modificar configurações

### 🚨 Regra #2: Git - Apenas tokenmilagre-platform/

**NUNCA commitar arquivos fora do diretório `tokenmilagre-platform/`**

✅ Permitido: `tokenmilagre-platform/` (app/, components/, lib/, .claude/, docs/)
❌ PROIBIDO: Qualquer arquivo fora deste diretório

### 🚨 Regra #3: Economia de Tokens

**Seja CONCISO**. O usuário prefere:
- ✅ Respostas curtas e diretas
- ✅ Código sem explicações óbvias
- ✅ Foco em ação, não teoria
- ❌ Parágrafos longos

---

## 💫 Propósito do Projeto

**"$MILAGRE é um projeto comunitário criado para conectar pessoas através de apoio mútuo e esperança."**

Este é um **movimento de educação, transparência e empoderamento financeiro** no universo cripto.

### 🎯 Problema e Solução

**Problema**: Mercado cripto cheio de golpes, desinformação, barreiras técnicas
**Solução**: Educação gratuita + Transparência total (open source) + Comunidade inclusiva + Segurança

### 💪 Valores Core

- **Simples**: Se não é essencial, não adicione
- **Acessível**: Funciona para todos, inclusive iniciantes
- **Rápido**: Performance = respeito pelo tempo das pessoas
- **Confiável**: Funciona sempre, sem surpresas

### 💭 Mantras para Decisões

- ✅ **"Isso ajuda alguém?"** - Senão, não faça
- ✅ **"Um iniciante entenderia?"** - Simplicidade é poder
- ✅ **"Isso convida contribuição?"** - Open source vive disso
- ✅ **"Estamos sendo transparentes?"** - Confiança é tudo

---

## 🚫 O Que Evitar

### ❌ Anti-Patterns Principais
- **Design**: Animações excessivas, cores vibrantes sem propósito, interfaces confusas
- **Code**: Código duplicado, componentes >500 linhas, fetching HTTP quando Prisma direto é possível, variáveis `any`
- **Conteúdo**: Hype exagerado, linguagem técnica desnecessária, sem citações/fontes

---

## 🔧 Stack Tecnológica

**Core**: Next.js 15 (App Router) + React 19 + TypeScript 5.x
**UI**: Tailwind CSS + shadcn/ui + Lucide Icons
**Database**: Supabase PostgreSQL + Prisma ORM 6.3.0
**Deploy**: Vercel
**AI**: Perplexity AI + Google Gemini

**Patterns**:
- Server Components por padrão (Prisma direto, sem API routes desnecessárias)
- Client Components apenas quando necessário (`useState`, `useEffect`)
- Cache estratégico (sessionStorage + Next.js cache)

**⚠️ Database Management**: Ver skill [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md)

---

## 🧭 Navegação de Skills

**⚡ RECOMENDADO**: Consulte [`skills-navigator`](../skills-navigator/SKILL.md) para navegação completa!

**📊 Skills Index**: Ver [SKILL-INDEX.md](../SKILL-INDEX.md) para ranking e métricas

### 🎯 Skills Mais Usadas

**Interface**: `design-system`, `pages-reference`, `tokenmilagre-component-patterns`
**Conteúdo**: `article-creation`, `tokenmilagre-citations`
**Database**: `tokenmilagre-database`
**APIs**: `tokenmilagre-api-integrations`
**Testes**: `tokenmilagre-testing`, `tokenmilagre-refactoring`
**Deploy**: `server-manager`, `troubleshooting`

---

## 🔄 Workflow de Desenvolvimento

**Claude Code Web (80%)**: Desenvolve features, lança preview automático (branches claude/*)
**Claude Code CLI (20%)**: Validação local, commit final, push produção

**Fluxo Resumido**:
```
1. Desenvolver → Claude Web (preview automático)
2. Testar local → server-manager.sh start-preview
3. Validar → Testes manuais
4. Produção → server-manager.sh promote-preview
```

**📚 Detalhes completos**: Ver skill [`server-manager`](../../project-specific/server-manager/SKILL.md)

---

## 💡 Guidelines de Desenvolvimento

### 🎯 Sugestões Proativas de Skills

**Sugira criar nova skill quando**:
1. **Padrão Repetitivo** - Mesmo código/solução usado 3+ vezes
2. **Feature Complexa** - Múltiplos passos e decisões
3. **Integração Externa** - Nova API ou serviço

**Antes de sugerir**: Verificar se já existe skill similar (consulte skills-navigator)

### 📢 Comunicando Mudanças

**Após completar implementação, SEMPRE forneça**:

```markdown
## ✅ Mudanças Implementadas

**O que mudou**: [1 linha descritiva]
**Onde testar**: /caminho/url
**Como validar**:
1. Acesse X
2. Clique em Y
3. Verifique Z
```

### 🎯 Modo Padrão: Brutal Honesty

**SEMPRE ATIVO** - Ver skill [`project-manager-brutal-honesty`](../project-manager-brutal-honesty/SKILL.md)

**Princípios**:
- Estimativas conservadoras (x2.5 do otimista)
- Comunicação leiga obrigatória
- MVP-first: propor versões simples antes de complexas
- ROI calculado: tempo investido vs retorno

---

## 📚 Referências Rápidas

**Documentação**: `docs/MIGRACAO-SUPABASE.md`, `docs/ATUALIZAR-ETFS.md`
**Skills Ecosystem**: `.claude/skills/SKILLS-ECOSYSTEM.md`, `.claude/skills/SKILL-INDEX.md`
**AI Chat**: `/dashboard/criar-artigo` (workflow: `chat-workflow` skill)
**Server**: `/home/destakar/Trabalho/server-manager.sh`
**Database**: Supabase PostgreSQL, Prisma Client em `lib/generated/prisma`

---

## 📖 Instructions for Claude

When this skill is invoked:

1. **All essential context is in this skill** - no external files needed
2. Acknowledge that you've loaded the project context
3. Be ready to follow all critical rules:
   - ALWAYS ask before executing code
   - NEVER commit files outside tokenmilagre-platform/
   - Use Prisma directly in Server Components
   - **BE CONCISE** - Respostas curtas e diretas
4. Use specialized skills when needed (consult skills-navigator first)
5. Suggest new skills proactively when patterns emerge
6. **Brutal Honesty mode always active**: estimativas realistas, comunicação leiga, ROI calculado

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-11-17
**Versão**: 3.0.1
**Mudanças recentes**:
- ✅ Removida restrição sobre não rodar npm run dev/build/start
- ✅ **OTIMIZAÇÃO AGRESSIVA**: 356 → 185 linhas (-48%, -630 tokens)
- ✅ Propósito condensado mantendo essência
- ✅ Stack reduzida ao essencial
- ✅ Navegação de skills simplificada (referência ao navigator + index)
- ✅ Workflow resumido (detalhes no server-manager)
- ✅ Guidelines condensadas
- ✅ Foco máximo em regras críticas e valores core
