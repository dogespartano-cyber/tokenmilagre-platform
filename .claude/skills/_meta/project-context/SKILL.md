---
name: project-context
description: "Foundation skill - Project guidelines, critical rules, philosophy, stack. TRIGGERS: 'início de conversa', 'project context', 'contexto do projeto', 'regras do projeto', 'guidelines'. ALWAYS use at the start of EVERY conversation to load essential project guidelines, critical rules, interaction protocols, documentation structure, and philosophy."
allowed-tools: Read
---

# Project Context Skill

**⚠️ CRITICAL**: This skill must be loaded at the start of every conversation to understand project guidelines and critical rules.

**This skill contains all essential project context**:
- ⚠️ Critical interaction rules (ALWAYS ask before executing)
- 🎯 Project philosophy and values
- 🚫 What to avoid (anti-patterns)
- 🔧 Stack tecnológica
- 🧭 Skills navigation guide
- 🔄 Workflow resumido

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

✅ Permitido commitar:
```
tokenmilagre-platform/
  ├── app/
  ├── components/
  ├── lib/
  ├── .claude/
  └── docs/
```

❌ PROIBIDO commitar:
- Qualquer arquivo fora do diretório `tokenmilagre-platform/`
- Arquivos pessoais em diretórios paralelos
- Configurações do sistema

### 🚨 Regra #3: Nunca Rodar Build ou Dev Server

**NUNCA execute estes comandos**:
- ❌ `npm run dev`
- ❌ `npm run build`
- ❌ `npm start`
- ❌ Qualquer comando que inicie servidor

**Motivo**: Servidor é gerenciado pelo `server-manager.sh` no ambiente de produção.

### 🚨 Regra #4: Economia de Tokens

**Seja CONCISO**. O usuário prefere:
- ✅ Respostas curtas e diretas
- ✅ Código sem explicações óbvias
- ✅ Foco em ação, não teoria
- ❌ Parágrafos longos
- ❌ Explicações excessivas

---

## 💫 Propósito do Projeto

### 🌟 A Essência do Token Milagre

**"$MILAGRE é um projeto comunitário criado para conectar pessoas através de apoio mútuo e esperança."**

Este não é apenas um projeto de criptomoedas. É um **movimento de educação, transparência e empoderamento financeiro**.

### 🎯 Problema e Solução

**Problema**:
- Mercado cripto cheio de golpes e desinformação
- Pessoas perdendo dinheiro por falta de conhecimento
- Barreiras técnicas impedem acesso à tecnologia blockchain

**Nossa solução**:
- ✅ **Educação gratuita** - Artigos, guias, tutoriais
- ✅ **Transparência total** - Open source
- ✅ **Comunidade inclusiva** - Todos são bem-vindos
- ✅ **Segurança em primeiro lugar** - Alertas e proteção

### 💪 Valores Core

**Todo código e design deve ser**:
- **Simples**: Se não é essencial, não adicione
- **Acessível**: Funciona para todos, inclusive iniciantes
- **Rápido**: Performance = respeito pelo tempo das pessoas
- **Confiável**: Funciona sempre, sem surpresas

### 🚀 Como o Claude Deve Contribuir

**Em cada interação, considere**:

1. **O código facilita contribuições futuras?**
   - Comentários claros quando necessário
   - Estrutura lógica e previsível

2. **O design é inclusivo?**
   - Cores com contraste adequado
   - Texto em português claro
   - Mobile-first

3. **A solução educa?**
   - Código é exemplo de boas práticas
   - Erros têm mensagens úteis

### 💭 Mantras para Decisões

Quando em dúvida, pergunte:
- ✅ **"Isso ajuda alguém?"** - Senão, não faça
- ✅ **"Um iniciante entenderia?"** - Simplicidade é poder
- ✅ **"Isso convida contribuição?"** - Open source vive disso
- ✅ **"Estamos sendo transparentes?"** - Confiança é tudo

---

## 🚫 O Que Evitar

### ❌ Design Anti-Patterns
- Animações excessivas ou distrativas
- Cores muito vibrantes (exceto accent estratégico)
- Elementos decorativos sem propósito
- Interfaces confusas ou complexas
- Over-engineering de componentes simples

### ❌ Code Anti-Patterns
- Código duplicado (DRY principle)
- Componentes gigantes (>500 linhas)
- Fetching HTTP quando Prisma direto é possível (Server Components)
- Variáveis `any` no TypeScript
- Magic numbers sem constantes nomeadas
- Funções com mais de 3-4 parâmetros

### ❌ Conteúdo Anti-Patterns
- Hype ou promessas exageradas
- Linguagem técnica desnecessária
- Conteúdo sem citações/fontes
- Informações desatualizadas
- Foco em ganhos rápidos em vez de educação

---

## 🔧 Stack Tecnológica

**Framework**: Next.js 15 (App Router)
**UI**: React 19 + Tailwind CSS + shadcn/ui
**Database**: Supabase PostgreSQL + Prisma ORM (migrado de Neon em 2025-11-12)
**Deploy**: Vercel
**AI**: Perplexity AI + Google Gemini
**Icons**: Lucide React
**Language**: TypeScript 5.x

**Patterns**:
- Server Components por padrão
- Client Components apenas quando necessário (`useState`, `useEffect`, interatividade)
- Prisma Client direto em Server Components (sem API routes desnecessárias)
- Cache estratégico (sessionStorage client-side + Next.js cache server-side)

**⚠️ Database Management**: Ver skill [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md) para:
- Quota management e otimizações
- Prisma schema e migrations
- Query optimization
- Build configuration

---

## 🧭 Navegação de Skills

**⚡ RECOMENDADO**: Consulte [`skills-navigator`](../skills-navigator/SKILL.md) para navegação interativa completa!

### Estrutura Organizada (22 Skills)

**📂 Categorias**:
- **_meta/** (2) - Meta-skills de controle e filosofia
- **core/** (4) - Fundamentos (database, testing, refactoring, scripts)
- **features/** (8) - Features e workflows do produto
- **project-specific/** (4) - Conhecimento específico da plataforma
- **audit/** (4) - Auditoria e troubleshooting

### 🎯 Guia Rápido de Uso

**Interface (UI/UX)**:
- [`design-system`](../../project-specific/design-system/SKILL.md) - Cores, spacing, padrões visuais
- [`pages-reference`](../../project-specific/pages-reference/SKILL.md) - Estrutura de páginas
- [`tokenmilagre-component-patterns`](../../features/tokenmilagre-component-patterns/SKILL.md) - Componentes reutilizáveis

**Conteúdo**:
- [`article-creation`](../../features/article-creation/SKILL.md) - Templates e workflow
- [`tokenmilagre-citations`](../../features/tokenmilagre-citations/SKILL.md) - Fact-checking

**Database**:
- [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md) - Schema, migrations, otimização

**APIs**:
- [`tokenmilagre-api-integrations`](../../features/tokenmilagre-api-integrations/SKILL.md) - Integrações externas

**Testes**:
- [`tokenmilagre-testing`](../../core/tokenmilagre-testing/SKILL.md) - Testing strategies
- [`tokenmilagre-refactoring`](../../core/tokenmilagre-refactoring/SKILL.md) - Refactoring patterns

**Deploy**:
- [`server-manager`](../../project-specific/server-manager/SKILL.md) - Gerenciamento do servidor
- [`troubleshooting`](../../audit/troubleshooting/SKILL.md) - Debugging histórico

---

## 🔄 Workflow de Desenvolvimento

### 🎯 Divisão de Responsabilidades

**Claude Code Web (80%)**:
- Desenvolvimento de features
- Refactoring e correções
- Criação de componentes
- **Lança automaticamente em PREVIEW** (branches claude/*)

**Claude Code CLI (20%)**:
- Validação de build local
- Ajustes rápidos
- Commit final e push para produção

### ⚡ Fluxo Resumido

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

**Analise se o trabalho atual precisa de uma skill dedicada**. Sugira criar nova skill quando:

1. **Padrão Repetitivo** - Mesmo código/solução usado 3+ vezes
2. **Feature Complexa** - Múltiplos passos e decisões
3. **Integração Externa** - Nova API ou serviço
4. **Conhecimento Especializado** - Domain-specific patterns

**Antes de sugerir**:
- ✅ Verificar se já existe skill similar
- ✅ Avaliar se será reutilizado
- ✅ Calcular impacto (economia de tempo)

### 📢 Comunicando Mudanças

**Após completar implementação, SEMPRE forneça**:

```markdown
## ✅ Mudanças Implementadas

**O que mudou**: [1 linha descritiva]

**Onde testar**:
- 📍 Página: `/caminho/url`
- 🎯 Elemento: [componente/botão]

**Como validar**:
1. Acesse X
2. Clique em Y
3. Verifique Z
```

### 🎯 Modo Padrão: Brutal Honesty

**SEMPRE ATIVO** - Ver skill [`project-manager-brutal-honesty`](../project-manager-brutal-honesty/SKILL.md)

**Princípios**:
- Estimativas conservadoras (x2.5 do otimista)
- Comunicação leiga obrigatória ("Pra que serve?")
- Questionar valor: "Qual o benefício real mensurável?"
- MVP-first: propor versões simples antes de complexas
- ROI calculado: tempo investido vs retorno

**Template obrigatório**:
- O que foi feito
- Pra que serve (leigo)
- Benefício mensurável
- ROI
- Crítica brutal

---

## 📚 Referências Rápidas

**Documentação Importante**:
- `docs/MIGRACAO-SUPABASE.md` - Migration guide Neon → Supabase
- `docs/ATUALIZAR-ETFS.md` - ETF data update guide
- `.claude/skills/SKILLS-ECOSYSTEM.md` - Ecossistema completo de skills

**AI Assistant System**:
- Location: `/dashboard/criar-artigo` (chat IA integrado)
- Sidebar: `AdminChatSidebar` (dashboard global)
- Workflow: [`chat-workflow`](../../features/chat-workflow/SKILL.md)

**Server Management**:
- Script: `/home/destakar/Trabalho/server-manager.sh`
- Commands: start-preview, promote-preview, logs, status

**Database**:
- Provider: Supabase PostgreSQL (Free Tier)
- ORM: Prisma 6.3.0
- Location: `prisma/schema.prisma`
- Client: `lib/generated/prisma` (custom path)

---

## 📖 Instructions for Claude

When this skill is invoked:

1. **All essential context is in this skill** - no external files needed
2. Acknowledge that you've loaded the project context
3. Be ready to follow all critical rules:
   - ALWAYS ask before executing code
   - NEVER commit files outside tokenmilagre-platform/
   - NEVER run build or dev server commands
   - Use Prisma directly in Server Components (no HTTP fetch)
   - **BE CONCISE** - Respostas curtas e diretas
4. Use specialized skills when needed (consult skills-navigator first)
5. Suggest new skills proactively when patterns emerge
6. **Brutal Honesty mode always active**: estimativas realistas, comunicação leiga, ROI calculado

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-11-17
**Mudanças recentes**:
- ✅ **OTIMIZAÇÃO MAJOR**: 965 → 400 linhas (-58% tokens)
- ✅ Database Optimization movido para tokenmilagre-database skill
- ✅ Workflow detalhado movido para server-manager skill
- ✅ Skills list detalhada referenciada via skills-navigator
- ✅ Propósito condensado mantendo essência
- ✅ Foco em regras críticas e guidelines essenciais
