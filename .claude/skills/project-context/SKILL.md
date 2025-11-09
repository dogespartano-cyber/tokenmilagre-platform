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

**File**: `/home/destakar/Trabalho/tokenmilagre-platform/docs-local/CLAUDE-MEMORY.md`

**Location**: Inside project directory, but excluded from Git (`.gitignore`)

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
6. **AI Assistant system** - Chat IA em `/dashboard/criar-artigo` com detecção de intenção natural

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

## 🔗 Related Skills

After loading project context, use these specialized skills when needed:

### 📚 Legacy Skills (Old Structure)
- **`article-creation`** - When creating/editing articles or news
- **`chat-workflow`** - When working with AI chat system (creation, intent detection, architecture)
- **`design-system`** - When working with design, CSS, or components
- **`database-setup`** - When working with Prisma, database, or deployment
- **`pages-reference`** - When modifying or understanding page-specific features
- **`troubleshooting`** - When encountering bugs or performance issues (regex removing line breaks, scroll, cache, flash visual)

### 💎 Token Milagre Skills (New - Comprehensive Platform Skills)

**TIER 1 - Fundamentos**:
- **`tokenmilagre-article-workflow`** - Complete article creation workflow (Perplexity AI → Gemini refinement → Publication). Use when creating/editing articles with AI integration, managing citations, or setting up content pipelines.
- **`tokenmilagre-citations`** - Citation management and fact-checking system. Use when extracting citations from Perplexity, validating sources, storing in factCheckSources, or implementing citation display patterns.
- **`tokenmilagre-component-patterns`** - Component refactoring strategies for large React components (>500 lines). Use when breaking down components, extracting custom hooks, or applying architectural patterns.

**TIER 2 - Integrações**:
- **`tokenmilagre-api-integrations`** - External API integration patterns (Perplexity AI, Gemini, Binance, CoinGecko). Use when integrating APIs, handling rate limits, implementing caching, or troubleshooting API errors.
- **`tokenmilagre-copilot-tools`** - Copilot AI tool development with type-safe patterns. Use when creating new tools, implementing tool parameters, managing permissions, or setting up activity logging.
- **`tokenmilagre-content-quality`** - Content quality standards, SEO optimization, readability metrics, and fact-check scoring. Use when creating/reviewing articles, implementing SEO, or setting up quality validation.

**TIER 3 - Infraestrutura**:
- **`tokenmilagre-database`** - Prisma schema design, migrations, query optimization, and database maintenance. Use when modifying schema, creating migrations, optimizing queries, or troubleshooting database issues.
- **`tokenmilagre-scripts`** - Utility scripts and automation patterns (migrations, bulk processing, analytics). Use when building scripts for data processing, content migration, or platform automation.
- **`tokenmilagre-testing`** - Testing strategies (unit, integration, E2E, component testing). Use when setting up tests, writing test cases, or debugging test failures.

**Metodologia**:
- **`tokenmilagre-refactoring`** - Complete refactoring methodology with type safety patterns, Prisma types guide, and analysis scripts. Use when reducing 'any' usage, improving code quality, or analyzing codebase complexity.

**TIER 4 - Estratégia & Análise**:
- **`due-diligence-report`** - Complete due diligence analysis of Token Milagre Platform from a Chief Strategy Officer & Blockchain Economics Expert perspective. Brutally realistic assessment without hype - covering business model viability, tokenomics, competitive analysis, financial sustainability, and strategic recommendations. Use when performing strategic analysis, evaluating business model, or assessing project viability.

---

## 📖 Instructions for Claude

When this skill is invoked:

1. Read `/home/destakar/Trabalho/tokenmilagre-platform/docs-local/CLAUDE-MEMORY.md` completely
2. Acknowledge that you've loaded the project context
3. Be ready to follow all critical rules, especially:
   - ALWAYS ask before executing code
   - NEVER commit files outside tokenmilagre-platform/
   - NEVER run build or dev server commands
   - Use Prisma directly in Server Components (no HTTP fetch)
   - **BE CONCISE** - Respostas curtas e diretas (usuário prefere economia de tokens)
4. Consult `docs-local/LOG.md` when historical context is needed
5. Consult `docs-local/sugestões.md` before suggesting improvements

**Note**: Documentation files are inside the project (`docs-local/`) but not versioned (in `.gitignore`).

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
**Última atualização**: 2025-11-09
**Mudanças recentes**:
- ✅ Adicionadas 10 skills Token Milagre (article-workflow, citations, components, api-integrations, copilot-tools, content-quality, database, scripts, testing, refactoring)
- ✅ Implementado sistema de sugestão proativa de novas skills
- ✅ Processo de avaliação automático antes de sugerir skills
