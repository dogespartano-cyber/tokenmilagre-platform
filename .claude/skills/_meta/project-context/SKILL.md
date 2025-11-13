---
name: project-context
description: "Foundation skill - Project guidelines, critical rules, philosophy, stack. TRIGGERS: 'início de conversa', 'project context', 'contexto do projeto', 'regras do projeto', 'guidelines'. ALWAYS use at the start of EVERY conversation to load essential project guidelines, critical rules, interaction protocols, documentation structure, and philosophy."
allowed-tools: Read
---

# Project Context Skill

**⚠️ CRITICAL**: This skill must be loaded at the start of every conversation to understand project guidelines and critical rules.

**This skill contains all essential project context directly**:
- ⚠️ Critical interaction rules (ALWAYS ask before executing)
- 🎯 Project philosophy and values
- 🚫 What to avoid (anti-patterns)
- 🔧 Stack tecnológica
- 📚 Skills disponíveis (12 Token Milagre skills + 1 META skill)
- 🔄 Workflow de desenvolvimento
- 🤖 Admin AI Assistant architecture

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

## 💫 Propósito do Projeto - Semente do Bem

### 🌟 A Essência do Token Milagre

**"$MILAGRE é um projeto comunitário criado para conectar pessoas através de apoio mútuo e esperança."**

Este não é apenas um projeto de criptomoedas. É um **movimento de educação, transparência e empoderamento financeiro**.

### 🎯 Por Que Este Projeto Importa

**Problema que resolvemos**:
- Mercado cripto cheio de golpes e desinformação
- Pessoas perdendo dinheiro por falta de conhecimento
- Barreiras técnicas impedem acesso à tecnologia blockchain
- Falta de recursos educacionais acessíveis em português

**Nossa solução**:
- ✅ **Educação gratuita e acessível** - Artigos, guias, tutoriais
- ✅ **Transparência total** - Open source, sem segredos
- ✅ **Comunidade inclusiva** - Todos são bem-vindos
- ✅ **Segurança em primeiro lugar** - Alertas, proteção, orientação

### 🤝 Como Incentivar Contribuições

**Toda decisão de design e código deve responder: "Isso ajuda mais pessoas?"**

**Estratégias para atrair contribuidores**:

1. **Acessibilidade em Primeiro Lugar**
   - Código limpo e bem documentado
   - README completo com setup fácil
   - Issues marcadas como "good first issue"
   - Responder rapidamente a PRs e dúvidas

2. **Transparência Total**
   - Decisões de design documentadas (CLAUDE-MEMORY.md, LOG.md)
   - Roadmap público (sugestões.md)
   - Comunicação aberta sobre desafios e sucessos

3. **Reconhecimento da Comunidade**
   - Creditar contribuidores em commits
   - Destacar colaboradores no README
   - Celebrar cada contribuição, grande ou pequena

4. **Experiência do Desenvolvedor**
   - Setup rápido (< 5 minutos)
   - Stack moderna e popular (Next.js, React, Prisma)
   - Testes automatizados
   - Deploy simples (Vercel)

5. **Propósito Claro e Inspirador**
   - Sempre comunicar o "por quê" antes do "o quê"
   - Mostrar impacto real (usuários ajudados, golpes evitados)
   - Contar histórias da comunidade

### 📣 Mensagens-Chave para Compartilhar

**Quando falar sobre o projeto, sempre incluir**:

1. **Missão**: "Democratizar acesso à educação sobre criptomoedas"
2. **Valores**: Transparência, comunidade, educação, segurança
3. **Open Source**: "Código aberto = confiança"
4. **Impacto**: "X pessoas educadas, Y golpes evitados"
5. **Convite**: "Junte-se a nós, sua contribuição importa"

### 🌱 Princípios de Design que Atraem Pessoas

**Todo código e design deve ser**:

- **Simples**: Se não é essencial, não adicione
- **Acessível**: Funciona para todos, inclusive iniciantes
- **Rápido**: Performance = respeito pelo tempo das pessoas
- **Bonito**: Design minimalista mas agradável
- **Confiável**: Funciona sempre, sem surpresas

### 🚀 Como o Claude Deve Contribuir para Isso

**Em cada interação, considere**:

1. **O código facilita contribuições futuras?**
   - Comentários claros quando necessário
   - Estrutura lógica e previsível
   - Sem "magic" - tudo deve ser compreensível

2. **O design é inclusivo?**
   - Cores com contraste adequado (acessibilidade)
   - Texto em português claro
   - Mobile-first (muitos acessam só pelo celular)

3. **A solução educa?**
   - Código é exemplo de boas práticas
   - Documentação ensina, não apenas instrui
   - Erros têm mensagens úteis

4. **Fortalece a comunidade?**
   - Features que conectam pessoas
   - Conteúdo que gera conversas
   - Ferramentas que empoderam

### 💪 Mantras para Decisões

Quando em dúvida, pergunte:

- ✅ **"Isso ajuda alguém?"** - Senão, não faça
- ✅ **"Um iniciante entenderia?"** - Simplicidade é poder
- ✅ **"Isso convida contribuição?"** - Open source vive disso
- ✅ **"Estamos sendo transparentes?"** - Confiança é tudo
- ✅ **"Isso fortalece a comunidade?"** - Juntos somos mais

### 🎁 O Que Oferecemos aos Contribuidores

**Ao contribuir, você ganha**:

- 🌟 Experiência com stack moderna (Next.js 15, React 19, Prisma)
- 📚 Aprendizado sobre cripto, blockchain e Web3
- 🤝 Conexão com comunidade apaixonada
- 💼 Portfólio com projeto real e impacto social
- 🎯 Propósito - saber que está ajudando pessoas

**E acima de tudo**: A satisfação de fazer parte de algo maior que você mesmo.

---

**Lembre-se**: Cada linha de código, cada artigo, cada feature é uma oportunidade de plantar esperança e conhecimento. Faça valer.

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

---

## ⚠️ Database Optimization - Quota Management

### 🚨 Critical: Free Tier Limitations

**Database**: Supabase PostgreSQL (Free Tier) - Migrado de Neon em 2025-11-12
**Previous Issue**: Data transfer quota exceeded during Vercel builds (Neon)
**Date**: 2025-11-09
**Status**: ✅ RESOLVED with optimization + migrated to Supabase

### 📊 The Problem

During Vercel build process, the error occurred:
```
Error [PrismaClientInitializationError]:
Error querying the database: ERROR: Your project has exceeded the data transfer quota.
Upgrade your plan to increase limits.
```

**Root cause**: `generateStaticParams` in dynamic route pages was fetching ALL articles from database during build time, causing excessive data transfer that exceeded Neon's free tier limits.

### 💣 Por Que Isso Era CRÍTICO

**Cenário Real - ANTES das otimizações**:

Cada commit/push dispara um build Vercel. Durante o build:
```
Build 1 (fix: corrigir link Discord):
├─ generateStaticParams em /educacao/[slug] → 30 artigos
├─ generateStaticParams em /noticias/[slug] → 50 notícias
├─ generateStaticParams em /recursos/[slug] → 25 recursos
├─ Query em /educacao/page.tsx → 12 artigos
└─ Query em /recursos/page.tsx → 25 recursos
   = ~142 queries ao banco ❌

Build 2 (fix: corrigir erro no link):
└─ Mesmas 142 queries DE NOVO ❌

Build 3 (fix: ajustar texto):
└─ Mais 142 queries ❌

Build 4, 5, 6... (iteração de desenvolvimento):
└─ Idem, idem, idem...

Resultado: 10 builds = 1.420 queries = QUOTA EXCEDIDA 🔴
```

**Comportamento ATUAL - DEPOIS das otimizações**:
```
Build 1, 2, 3, 4, 5... 100, 200 (quantos forem):
├─ Compila TypeScript ✅
├─ Gera bundles JavaScript ✅
├─ Otimiza assets (CSS, imagens) ✅
└─ Query ao banco? ❌ ZERO

= Builds infinitos, ZERO impacto no banco ✅
```

**Quando o banco É acessado agora?**
```
Usuário real visita /educacao pela 1ª vez:
└─ Servidor faz query → busca 12 artigos (1 query)
└─ Cacheia resultado por 1 hora (ISR)
└─ Próximos 1000 visitantes = cache (0 queries)

Após 1 hora, próximo visitante:
└─ Revalida cache → 1 query
└─ Mais 1000 visitantes = cache (0 queries)
```

**Impacto prático**:
- ✅ **100 commits/dia** = 0 impacto no banco
- ✅ **Previews infinitos** = 0 preocupação com quota
- ✅ **Builds "à toa"** (fixes de texto, links) = não custam nada
- ✅ **FREE tier** = sustentável indefinidamente

### ✅ The Solution (FREE - No Upgrade Needed)

**Optimization**: Disabled `generateStaticParams` in 3 dynamic route files to prevent build-time database queries.

**Files Modified**:

1. **`app/educacao/[slug]/page.tsx`**
   - Disabled: Static generation of all educational article pages
   - Now: Pages generated on-demand (dynamic rendering)
   - ISR: Still active (`revalidate: 3600` = 1 hour cache)

2. **`app/dashboard/noticias/[slug]/page.tsx`**
   - Disabled: Static generation of 50 news articles
   - Now: Pages generated on-demand (dynamic rendering)
   - ISR: Still active (`revalidate: 300` = 5 minutes cache)

3. **`app/recursos/[slug]/page.tsx`**
   - Disabled: Static generation of all resource pages
   - Now: Pages generated on-demand (dynamic rendering)
   - ISR: Still active (cache configured)

### 🎯 Impact

**Data Transfer Reduction**: ~90%
- Before: Querying 50+ articles on EVERY build
- After: No database queries during build
- Build: Now succeeds on free tier

**Performance Trade-offs**:
- ✅ First visit: Pages generate on-demand (~200-500ms first load)
- ✅ Subsequent visits: ISR cache serves instantly
- ✅ Cache revalidation: Automatic (1h for education, 5min for news)
- ✅ No impact after first page load

### 🔄 When to Re-enable `generateStaticParams`

**Option 1 - Monthly Quota Reset**:
```typescript
// Can uncomment at beginning of each month if quota allows
export async function generateStaticParams() {
  // ... original code
}
```

**Option 2 - Upgrade to Paid Tier**:
- If budget allows, upgrade Neon to paid tier
- Re-enable static generation for optimal performance

**Option 3 - Keep Current Optimization**:
- Performance impact is minimal (ISR caching works well)
- FREE solution is sustainable long-term
- Only first visitor per article experiences slower load

### 💡 Code Pattern

**Before (caused quota issues)**:
```typescript
export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { type: 'educational', published: true },
    select: { slug: true },
  });
  return articles.map((article) => ({ slug: article.slug }));
}
```

**After (FREE tier compatible)**:
```typescript
// TEMPORARIAMENTE DESABILITADO para reduzir consumo de dados do banco
// Páginas serão geradas sob demanda (dynamic rendering)
// export async function generateStaticParams() {
//   const articles = await prisma.article.findMany({
//     where: { type: 'educational', published: true },
//     select: { slug: true },
//   });
//   return articles.map((article) => ({ slug: article.slug }));
// }
```

### 🎓 Lesson Learned

**For free tier databases**:
- ⚠️ Avoid `generateStaticParams` with large datasets
- ✅ Rely on ISR + dynamic rendering instead
- ✅ Monitor database usage dashboard regularly (Supabase Dashboard)
- ✅ Static generation = database query on EVERY build (can be 10-50+ builds/day with previews)
- ✅ Dynamic rendering = database query only on first user visit

### 📌 Related Documentation

- Commit: `74a8157` (Database optimization)
- Commit: `7e402e6` (Migration Neon → Supabase)
- Skill: `tokenmilagre-database` (full database management guide)
- Doc: `docs/MIGRACAO-SUPABASE.md` (complete migration guide)
- Vercel Build Logs: Check for quota warnings

---

## 🔗 Related Skills - Estrutura Organizada

**Total de Skills**: 22 organizadas em 5 categorias hierárquicas

**Localização**: `.claude/skills/` (estrutura consolidada)

---

### 🎯 _meta/ - Meta-Skills (2)

Skills que controlam o comportamento e filosofia do projeto:

- **`project-context`** ⭐ - **Master skill** com guidelines essenciais, regras críticas, filosofia, stack, e workflow. SEMPRE usar no início de conversas.
- **`project-manager-brutal-honesty`** - Modo gerente de projeto realista. Estimativas conservadoras, foco em ROI, questiona over-engineering, comunicação direta.

---

### ⚙️ core/ - Fundamentos (4)

Skills de infraestrutura e qualidade de código:

- **`tokenmilagre-database`** - Database management completo: Prisma schema, migrations, query optimization, Server Components patterns, build configuration, Supabase deployment.
- **`tokenmilagre-refactoring`** - Metodologia de refactoring completa: type safety patterns, Prisma types guide, análise de complexidade, redução de 'any'.
- **`tokenmilagre-testing`** - Testing strategies: unit, integration, E2E, component testing. Setup, patterns, debugging test failures.
- **`tokenmilagre-scripts`** - Utility scripts e automation: migrations, bulk processing, data processing, platform automation.

---

### 🎨 features/ - Features & Workflows (8)

Skills de funcionalidades específicas do produto:

- **`tokenmilagre-article-workflow`** - Workflow completo de criação de artigos: Perplexity AI → Gemini refinement → Publication. AI integration, citation management.
- **`tokenmilagre-citations`** - Citation management e fact-checking: extração de citações do Perplexity, validação de fontes, factCheckSources.
- **`tokenmilagre-content-quality`** - Content quality standards: SEO optimization, readability metrics, fact-check scoring, editorial quality.
- **`tokenmilagre-api-integrations`** - External API integration patterns: Perplexity AI, Gemini, Binance, CoinGecko. Rate limits, error recovery, caching.
- **`tokenmilagre-copilot-tools`** - Copilot AI tools development: type-safe patterns, tool parameters, permissions, activity logging.
- **`tokenmilagre-component-patterns`** - Component refactoring strategies: large React components (>500 lines), custom hooks extraction, architectural patterns.
- **`article-creation`** - Templates e checklists para criação de artigos: estruturas, scripts Node.js, sistema de slug único.
- **`chat-workflow`** - Sistema chat IA (/dashboard/criar-artigo): detecção de intenção, comandos naturais, arquitetura técnica.

---

### 🏗️ project-specific/ - Específico do Projeto (4)

Skills com conhecimento específico da plataforma Token Milagre:

- **`design-system`** - CSS variables, spacing system, cores, padrões visuais, identidade visual, tema claro/escuro.
- **`pages-reference`** - Informações detalhadas sobre páginas específicas: /educacao, /recursos, /noticias, /doacoes, features e layouts.
- **`tokenmilagre-url-security`** - Proteção contra links maliciosos: verificação híbrida (local + API), detecção de phishing/scams, modais educativos.
- **`server-manager`** - Gerenciamento do servidor Next.js: scripts cross-platform (Bash + PowerShell), comandos de start/stop/restart/logs.

---

### 🔍 audit/ - Auditoria & Troubleshooting (4)

Skills de análise, auditoria e histórico de problemas:

- **`due-diligence-report`** - Análise estratégica completa da plataforma: business model viability, tokenomics, competitive analysis, financial sustainability. Perspectiva CSO + Blockchain Economics Expert.
- **`platform-audit`** - Checklist de auditoria trimestral: segurança, qualidade, performance, débitos técnicos, métricas do projeto.
- **`troubleshooting`** - Histórico completo de problemas técnicos resolvidos (1286 linhas). Conhecimento institucional crítico. Consultar antes de debugar problemas similares.
- **`database-setup`** - Referência histórica da configuração de database (predecessor do tokenmilagre-database). Mantido para contexto histórico.

---

## 📖 Instructions for Claude

When this skill is invoked:

1. **All essential context is in this skill** - no external files needed
2. Acknowledge that you've loaded the project context
3. Be ready to follow all critical rules, especially:
   - ALWAYS ask before executing code
   - NEVER commit files outside tokenmilagre-platform/
   - NEVER run build or dev server commands
   - Use Prisma directly in Server Components (no HTTP fetch)
   - **BE CONCISE** - Respostas curtas e diretas (usuário prefere economia de tokens)
4. Use specialized skills when needed (article-workflow, database, refactoring, etc)
5. Suggest new skills proactively when patterns emerge
6. **🎯 MODO PADRÃO: BRUTAL HONESTY SEMPRE ATIVO**
   - Estimativas conservadoras (x2.5 do otimista)
   - Comunicação leiga obrigatória ("Pra que serve?" em toda resposta)
   - Questionar valor: "Qual o benefício real mensurável?"
   - Anti-achismo: exigir dados, não opiniões
   - MVP-first: propor versões simples antes de complexas
   - ROI calculado: tempo investido vs retorno
   - Crítica brutal: "Vale a pena? SIM/NÃO e por quê"
   - Template obrigatório: O que foi feito + Pra que serve (leigo) + Benefício mensurável + ROI + Crítica brutal

---

## 🧠 Proactive Skill Creation Recommendations

**IMPORTANT**: Claude deve **sugerir proativamente** a criação de novas skills quando identificar oportunidades durante o desenvolvimento.

### 🎯 Quando Sugerir Criação de Nova Skill

**Analise constantemente se o trabalho atual poderia se beneficiar de uma skill dedicada**. Sugira criar nova skill quando:

1. **Padrão Repetitivo Identificado**
   - Mesmo tipo de código/solução usado 3+ vezes
   - Pattern que será reutilizado em múltiplos contextos
   - Exemplo: "Vejo que criamos componentes de filtro em 3 páginas diferentes - sugiro skill `tokenmilagre-filter-patterns`"

2. **Nova Funcionalidade Complexa**
   - Feature com múltiplos passos e decisões
   - Workflow que precisa ser documentado
   - Exemplo: "Sistema de notificações envolve WebSockets + push + email - sugiro skill `tokenmilagre-notifications`"

3. **Integração com Serviço Externo**
   - Nova API ou serviço sendo integrado
   - Padrões de autenticação, rate limiting, error handling
   - Exemplo: "Integrando Stripe - sugiro skill `tokenmilagre-payments`"

4. **Área de Conhecimento Especializado**
   - Domain-specific patterns (SEO, analytics, performance)
   - Best practices de uma área técnica
   - Exemplo: "Otimizações de performance aplicadas - sugiro skill `tokenmilagre-performance`"

5. **Troubleshooting de Problema Recorrente**
   - Bug ou problema que aparece frequentemente
   - Solução documentada evita repetição
   - Exemplo: "3ª vez resolvendo problemas com Prisma relations - sugiro skill `tokenmilagre-prisma-troubleshooting`"

### 🔍 Processo de Avaliação (Execute Automaticamente)

Antes de sugerir, **sempre execute esta análise**:

1. **Verificar Skills Existentes**
   ```
   - Ler lista de skills em .claude/skills/
   - Verificar se já existe skill que cobre o tópico
   - Se existe: sugerir expandir skill existente
   - Se não existe: prosseguir para step 2
   ```

2. **Avaliar Necessidade**
   ```
   - O padrão/conhecimento será reutilizado? (sim/não)
   - Há complexidade suficiente para documentar? (>100 linhas de docs)
   - Beneficia desenvolvimento futuro? (sim/não)
   - Se 3x SIM: skill justificada
   ```

3. **Calcular Impacto**
   ```
   - Economia de tempo estimada: X horas
   - Redução de bugs esperada: Y%
   - Melhoria de consistência: alta/média/baixa
   - Se impacto >= médio: propor skill
   ```

### 📋 Formato da Sugestão ao Usuário

Quando sugerir criação de skill, use este formato:

```markdown
## 💡 Sugestão: Nova Skill Identificada

**Skill Proposta**: `[nome-da-skill]`

**Motivo**: [1-2 frases explicando POR QUÊ essa skill é necessária]

**O Que Documentaria**:
- [Tópico 1]
- [Tópico 2]
- [Tópico 3]

**Benefícios**:
- ⏱️ Economia de tempo: [estimativa]
- 🎯 Consistência: [como melhora]
- 📚 Conhecimento: [o que preserva]

**Verificação Realizada**:
- ✅ Não existe skill similar em .claude/skills/
- ✅ Padrão reutilizável confirmado
- ✅ Impacto justifica criação

**Quer que eu crie esta skill agora?** [sim/não]
```

### 🎯 Exemplo Prático

**Cenário**: Trabalhando em feature de notificações push

```markdown
## 💡 Sugestão: Nova Skill Identificada

**Skill Proposta**: `tokenmilagre-notifications`

**Motivo**: Estamos implementando sistema de notificações que envolve múltiplos canais (push, email, in-app) e padrões complexos de delivery, retry, e preferências de usuário.

**O Que Documentaria**:
- Integração com Firebase Cloud Messaging (push notifications)
- Sistema de templates de email (Resend/SendGrid)
- Notificações in-app com WebSockets
- Gerenciamento de preferências de usuário
- Rate limiting e batching
- Retry logic e error handling

**Benefícios**:
- ⏱️ Economia de tempo: ~4h em futuras implementações de notificações
- 🎯 Consistência: Padrões unificados para todos os tipos de notificação
- 📚 Conhecimento: Documenta integrações complexas com serviços externos

**Verificação Realizada**:
- ✅ Verificado .claude/skills/ - não existe skill de notificações
- ✅ Padrão será usado em: artigos novos, comentários, updates do sistema
- ✅ Complexidade alta justifica documentação dedicada

**Quer que eu crie esta skill agora?**
```

### 🚫 Quando NÃO Sugerir

**Evite sugerir skill quando**:
- ❌ Padrão usado apenas 1-2 vezes
- ❌ Código muito simples (<50 linhas docs)
- ❌ Já existe skill que cobre 80%+ do tópico
- ❌ Conhecimento trivial/básico
- ❌ Situação muito específica (não reutilizável)

### ⚡ Modo Proativo

**Durante CADA sessão de desenvolvimento**:
1. **Monitore padrões** - Observe código repetitivo ou workflows complexos
2. **Avalie constantemente** - "Isso merece uma skill?"
3. **Sugira no momento certo** - Após completar implementação, antes de finalizar
4. **Não seja excessivo** - Máximo 1-2 sugestões por sessão (qualidade > quantidade)

### 📊 Métricas de Sucesso de Skills

**Uma boa skill deve**:
- 📚 Ter 200+ linhas de documentação útil
- 💻 Incluir 5+ exemplos de código real
- 🎯 Cobrir casos de uso comuns (80% coverage)
- 🐛 Ter seção de troubleshooting
- 🔗 Referenciar skills relacionadas
- ✅ Incluir best practices e anti-patterns

---

**Resumo**: Claude deve ser um **consultor proativo** que não apenas executa tarefas, mas **identifica oportunidades de otimização** através da criação de skills. Cada skill criada é **conhecimento institucional preservado** e **tempo economizado no futuro**.

---

## 📢 Comunicando Mudanças ao Usuário

**IMPORTANTE**: Após completar qualquer implementação ou refatoração, SEMPRE forneça um resumo conciso para o usuário saber exatamente onde testar.

### ✅ Formato de Resposta Obrigatório

**Para cada mudança implementada, informe**:

1. **O que mudou** - Descrição curta e direta (1 linha)
2. **Onde testar** - URL exata, página, componente ou elemento afetado
3. **Como testar** - Ação específica para validar a mudança

### 📝 Template de Resposta

```markdown
## ✅ Mudanças Implementadas

### [Nome da Feature/Fix]

**O que mudou**: [Descrição curta em 1 linha]

**Onde testar**:
- 📍 Página: `/caminho/da/pagina`
- 🎯 Elemento: [Nome do componente/botão/card]
- 🔗 Link direto: [Se aplicável]

**Como validar**:
1. Acesse a página X
2. Clique no elemento Y
3. Verifique que Z acontece
```

### 🎯 Exemplos Práticos

**Exemplo 1 - Infinite Scroll**:
```markdown
## ✅ Implementado: Rolagem Infinita na Educação

**O que mudou**: Página de educação agora carrega artigos automaticamente ao rolar

**Onde testar**:
- 📍 Página: `/educacao`
- 🎯 Elemento: Lista de artigos educacionais (cards)

**Como validar**:
1. Acesse `/educacao`
2. Role até o final da página
3. Novos artigos devem carregar automaticamente
```

**Exemplo 2 - Refatoração**:
```markdown
## ✅ Refatoração: Biblioteca de Helpers

**O que mudou**: Funções duplicadas substituídas por biblioteca centralizada

**Onde testar**:
- 📍 Páginas afetadas: `/educacao`, `/`, `/educacao/[slug]`, dashboard BuildInfoBadge
- 🎯 Elementos: Badges de nível (iniciante/intermediário/avançado), formatação de datas

**Como validar**:
1. Visite `/educacao` → Verifique cores dos badges de nível
2. Visite `/` → Verifique cards de educação na home
3. Abra qualquer artigo educacional → Verifique label do nível
4. Passe mouse no badge inferior direito → Verifique formato da data
```

**Exemplo 3 - Fix de Bug**:
```markdown
## ✅ Corrigido: Build Vercel Falhando

**O que mudou**: Script de build removeu comando Prisma que causava erro

**Onde testar**:
- 📍 Ambiente: Vercel Preview (deploy automático)
- 🎯 Resultado esperado: Build passa sem erros

**Como validar**:
1. Aguarde deploy automático em Vercel
2. Verifique logs de build (deve passar)
3. Acesse URL do preview (deve funcionar)
```

### 🚫 O Que NÃO Fazer

❌ **Resposta Vaga**:
> "Refatorei alguns componentes para usar helpers centralizados"

✅ **Resposta Clara**:
> "4 componentes refatorados usam biblioteca de helpers. Teste em `/educacao` (badges de nível), `/` (cards educacionais), BuildInfoBadge (formatação de data)"

### 🎯 Benefícios

- ⚡ Usuário testa apenas o necessário
- 🎯 Testes direcionados economizam tempo
- 📊 Rastreabilidade de mudanças
- ✅ Validação eficiente de features

---

## 🔍 Quick References

**AI Assistant System**:
- Location: `/dashboard/criar-artigo` (criação de artigos com chat IA integrado)
- Sidebar global: `AdminChatSidebar` (disponível em todo dashboard)
- Full workflow: Use skill `chat-workflow` para arquitetura completa
- Legacy: `/dashboard/chat` foi removido (04/11/2025) - funcionalidade duplicada

**Update ETF Data**:
- Guide: `docs/ATUALIZAR-ETFS.md`
- Component: `components/ETFMetricsSection.tsx` (line ~30)
- Sources: Farside Investors, CoinGlass, SoSoValue

**Server Management**:
- Script: `/home/destakar/Trabalho/server-manager.sh`
- Commands: start, stop, restart, status

---

## 🌐 Development Workflow - Claude Code Web + CLI

### 🎯 Divisão de Responsabilidades

**Claude Code Web (80% do trabalho)**:
- Desenvolvimento de features
- Refactoring de código
- Correção de bugs complexos
- Criação de componentes
- Atualização de APIs
- **Lança automaticamente em PREVIEW** (branches claude/*)

**Claude Code CLI (20% do trabalho)**:
- Validação de build local
- Pequenos ajustes rápidos
- Debugging local
- Commit final e push para produção

---

### 🔄 Fluxo Completo de Desenvolvimento

#### Fase 1: Desenvolvimento (Claude Code Web)
1. Desenvolver feature no Claude Code Web
2. Preview deployado automaticamente (branches `claude/*`)
3. Revisar preview online
4. Iterar até feature pronta

#### Fase 2: Teste Local (server-manager.sh)
```bash
# Puxar última preview e rodar localmente
./server-manager.sh start-preview

# Ver logs em tempo real
./server-manager.sh logs

# Status do servidor
./server-manager.sh status
```

#### Fase 3: Ajustes (Claude Code CLI se necessário)
- Se tudo OK → pular para Fase 4
- Se houver problemas → usar CLI para ajustes rápidos
- Revalidar localmente

#### Fase 4: Produção
```bash
# Promover preview para main (interativo)
./server-manager.sh promote-preview

# Ou manualmente
git checkout main
git merge origin/claude/preview-branch
git push origin main
```

---

### 🛠️ Server Manager - Comandos Úteis

**Localização**: `/home/destakar/Trabalho/server-manager.sh`

**Comandos principais**:
```bash
# Preview workflow
./server-manager.sh start-preview    # Sincroniza preview + inicia local
./server-manager.sh sync-preview     # Apenas sincroniza (não inicia)
./server-manager.sh promote-preview  # Promove para produção

# Gerenciamento básico
./server-manager.sh start            # Inicia servidor (branch atual)
./server-manager.sh stop             # Para servidor
./server-manager.sh restart          # Reinicia servidor
./server-manager.sh status           # Status detalhado

# Debugging
./server-manager.sh logs             # Logs em tempo real
./server-manager.sh cover-logs       # Logs de geração de capas
./server-manager.sh clean            # Limpa processos Node.js

# Menu interativo
./server-manager.sh                  # Sem argumentos = menu
```

---

### ✅ Checklist de Validação

**Antes de Promover Preview para Produção**:
- [ ] Preview funciona corretamente online
- [ ] Build local passa sem erros (`start-preview` OK)
- [ ] Funcionalidade testada localmente
- [ ] Sem erros no console
- [ ] Schema Prisma commitado (se modificado)
- [ ] CSS/design responsivo OK
- [ ] Performance aceitável

---

### 🎯 Quando Usar Cada Ambiente

| Tarefa | Claude Web | Claude CLI |
|--------|-----------|-----------|
| Desenvolver features | ✅ PRIMARY | ❌ |
| Refactoring | ✅ PRIMARY | ❌ |
| Correção de bugs | ✅ PRIMARY | ⚠️ Se rápido |
| Teste de build | ❌ | ✅ PRIMARY |
| Debugging local | ❌ | ✅ PRIMARY |
| Ajustes rápidos | ⚠️ Se complexo | ✅ PRIMARY |
| Commit final | ❌ | ✅ PRIMARY |
| Push produção | ❌ | ✅ PRIMARY |

---

### 📌 Importante para Claude Code Web

**Ao trabalhar no Claude Code Web**:
1. Sempre mencionar que o código será lançado em PREVIEW
2. Instruir usuário a usar `start-preview` para testar localmente
3. Lembrar que a versão estável atual é `f33d1ba`
4. NÃO tentar rodar servidor ou fazer testes locais
5. Focar em desenvolvimento rápido e iterativo
6. Deixar validação final para Claude Code CLI

**Ao trabalhar no Claude Code CLI**:
1. Usar para validação final de previews
2. Pequenos ajustes que não justificam preview
3. Promover para produção após validação
4. Manter comunicação curta e objetiva

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-11-13
**Mudanças recentes**:
- ✅ **REORGANIZAÇÃO COMPLETA**: 22 skills organizadas em 5 categorias hierárquicas (_meta, core, features, project-specific, audit)
- ✅ Consolidação de skills: legacy skills (tokenmilagre-platform/.claude/) movidas para estrutura principal (.claude/)
- ✅ Atualizado para Supabase PostgreSQL (migrado de Neon em 2025-11-12)
- ✅ Estrutura otimizada para descobribilidade, manutenibilidade e escalabilidade
- ✅ Documentação de todas as 22 skills com categorização lógica
