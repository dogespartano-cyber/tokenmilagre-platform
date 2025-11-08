# Memória do Projeto - Token Milagre Platform

Este documento contém diretrizes essenciais, padrões críticos e decisões de design estabelecidas durante o desenvolvimento do projeto.

**📌 IMPORTANTE**: Este arquivo foi otimizado. Conteúdos detalhados foram migrados para **Skills** especializadas.

---

## ⚠️ REGRA CRÍTICA - Interação com o Usuário

### 🤝 Sempre Perguntar Antes de Agir

**REGRA ABSOLUTA**: NUNCA executar código, fazer commits, criar arquivos ou fazer qualquer mudança sem confirmar primeiro com o usuário.

**Fluxo correto de interação:**

1. **Entender a solicitação** - Ler e compreender o que o usuário pediu
2. **Analisar o contexto** - Verificar arquivos relevantes, estrutura do projeto
3. **Propor solução** - Explicar O QUE será feito e COMO será implementado
4. **PERGUNTAR** - "Posso prosseguir com essa implementação?" ou "Isso está correto?"
5. **Aguardar confirmação** - Esperar resposta explícita do usuário
6. **Executar** - Somente após aprovação, realizar as mudanças

**❌ NUNCA FAZER:**
- Começar a codar imediatamente após o pedido
- Assumir que entendeu corretamente
- Executar múltiplas ações sem confirmação
- Fazer commits automáticos sem revisar com o usuário
- Criar arquivos ou fazer mudanças "por conta própria"

**✅ SEMPRE FAZER:**
- Perguntar se a abordagem está correta
- Confirmar detalhes antes de implementar
- Mostrar o plano de ação e esperar aprovação
- Revisar mudanças com o usuário antes de commit
- Pedir esclarecimentos quando houver dúvidas

**Exemplo correto:**
```
Usuário: "Adicione uma nova feature X"

Claude: "Entendi que você quer implementar a feature X.
Aqui está minha proposta:

1. Criar componente XComponent.tsx em app/components/
2. Adicionar rota /x no app/
3. Integrar com Prisma para persistência

Isso está correto? Posso prosseguir?"

[AGUARDAR RESPOSTA DO USUÁRIO]
```

**Esta regra se aplica a:**
- Criar/editar arquivos de código
- Executar scripts
- Fazer commits Git
- Instalar pacotes
- Modificar configurações
- Criar ou atualizar documentação
- Executar comandos Bash

**Exceções (só agir sem perguntar se for explicitamente pedido):**
- "Rode o servidor" - Executar imediatamente
- "Faça commit" - Executar se mudanças já foram revisadas
- "Instale X" - Executar se for pacote conhecido e seguro

### 🚫 NUNCA Executar Build ou Servidor

**REGRA CRÍTICA**: NUNCA executar `npm run build`, `npm run dev`, ou qualquer comando que inicie/teste servidores.

**Por quê?**
- Usuário gerencia servidores manualmente via `/home/destakar/Trabalho/server-manager.sh`
- Executar builds pode causar conflitos de porta e processos
- Testes de build são desnecessários - CI/CD da Vercel já valida

**❌ NUNCA EXECUTAR:**
```bash
npm run build
npm run dev
npm start
next dev
next build
```

**✅ O QUE FAZER:**
- Confiar que as mudanças estão corretas
- Informar que as mudanças estão prontas
- **AGUARDAR** o usuário pedir para fazer commit/push
- Deixar Vercel validar o build em produção
- Se houver erro, corrigir após feedback da Vercel

### 🚫 NUNCA Fazer Commit ou Push Automaticamente

**REGRA CRÍTICA**: NUNCA executar `git commit` ou `git push` sem que o usuário peça explicitamente.

**Fluxo correto:**
1. Fazer as mudanças solicitadas
2. Informar: "✅ Mudanças concluídas! Arquivos modificados: [lista]"
3. **AGUARDAR** o usuário pedir: "faça commit" ou "faça push"
4. Só então executar os comandos git

**❌ NUNCA fazer automaticamente:**
```bash
git add .
git commit -m "..."
git push
```

**✅ Apenas quando o usuário pedir explicitamente:**
- "faça commit"
- "faça push"
- "commita isso"
- "pode fazer commit"

**Exceção:** Se o usuário disser "faça tudo" ou "implemente e faça commit", pode executar.

---

## 📚 Estrutura de Documentação do Projeto

Este projeto possui **múltiplos arquivos de documentação** localizados em `/home/destakar/Trabalho/` (FORA da pasta do projeto):

### Arquivos de Documentação

1. **`CLAUDE-MEMORY.md`** (este arquivo)
   - **Propósito**: Diretrizes essenciais e regras CRÍTICAS do projeto
   - **Conteúdo**: Regras de interação, filosofia, links, Git rules
   - **Quando atualizar**: Quando regras fundamentais mudarem
   - **NÃO incluir**: Logs detalhados ou conteúdos técnicos específicos

2. **`LOG.md`**
   - **Propósito**: Histórico COMPLETO de todas as mudanças e implementações
   - **Conteúdo**: O que foi feito, quando foi feito, commits, detalhes técnicos
   - **Quando atualizar**: Após implementar features ou mudanças significativas
   - **Formato**: Cronológico reverso (mais recente primeiro)

3. **`sugestões.md`**
   - **Propósito**: Lista de melhorias e features futuras
   - **Conteúdo**: 23 sugestões priorizadas, roadmap, stack recomendado
   - **Quando atualizar**: Ao identificar novas oportunidades ou completar sugestões
   - **Formato**: Prioridade (Alta/Média/Baixa)

### 🎯 Skills Especializadas (`.claude/skills/`)

Conteúdos técnicos detalhados foram migrados para **Skills**:

1. **`project-context`** ⚠️ **USE SEMPRE NO INÍCIO DE CADA SESSÃO**
   - Carrega este arquivo (CLAUDE-MEMORY.md)
   - Deve ser invocada PRIMEIRO em toda nova conversa

2. **`article-creation`**
   - Criação de artigos educacionais
   - Criação de notícias
   - Templates de scripts
   - Checklists completos

3. **`design-system`**
   - Padrões de design
   - CSS Variables
   - Componentes
   - Cards e efeitos

4. **`database-setup`**
   - Configuração Prisma
   - Server Components
   - Build e deploy
   - PostgreSQL/Neon

5. **`pages-reference`**
   - Detalhes de cada página
   - Features específicas
   - Layouts e funcionalidades

### Regras de Atualização dos Arquivos

#### ✅ Atualizar CLAUDE-MEMORY.md quando:
- Estabelecer nova regra crítica
- Mudar filosofia do projeto
- Adicionar novos links oficiais
- Modificar processo fundamental
- **Formato**: Substituir seção antiga pela nova (não acumular)

#### ✅ Atualizar LOG.md quando:
- Implementar nova feature completa
- Fazer refactoring significativo
- Migrar tecnologia
- Resolver bug importante
- Completar sprint ou milestone
- **Formato**: Adicionar nova entrada no topo (cronológico reverso)

#### ✅ Atualizar sugestões.md quando:
- Identificar nova oportunidade de melhoria
- Completar sugestão existente (marcar como ✅)
- Repriorizar roadmap

### Como Claude Deve Usar Esta Estrutura

**Em uma nova sessão**:
1. Invocar skill `project-context` PRIMEIRO (carrega CLAUDE-MEMORY.md)
2. Se precisar criar artigos → invocar skill `article-creation`
3. Se precisar trabalhar com design → invocar skill `design-system`
4. Se precisar trabalhar com banco → invocar skill `database-setup`
5. Se precisar modificar páginas → invocar skill `pages-reference`
6. Se precisar atualizar dados de ETFs → consultar `docs/ATUALIZAR-ETFS.md`
7. Se precisar de contexto histórico → consultar `LOG.md`
8. Se for sugerir melhorias → consultar `sugestões.md` para evitar duplicatas

**Caminhos completos dos arquivos**:
```
/home/destakar/Trabalho/CLAUDE-MEMORY.md
/home/destakar/Trabalho/LOG.md
/home/destakar/Trabalho/sugestões.md
/home/destakar/Trabalho/tokenmilagre-platform/ (projeto)
/home/destakar/Trabalho/tokenmilagre-platform/.claude/skills/ (skills)
/home/destakar/Trabalho/tokenmilagre-platform/docs/ATUALIZAR-ETFS.md (guia de atualização de ETFs)
```

**IMPORTANTE**:
- Arquivos `.md` em `/home/destakar/Trabalho/` estão FORA do projeto e NÃO são versionados
- Arquivos em `tokenmilagre-platform/docs/` e `.claude/` SÃO versionados no Git

---

## 🎯 Filosofia do Projeto

### Valores

- **Minimalismo**: Design clean, sem elementos desnecessários
- **Acessibilidade**: Todos devem poder acessar o conteúdo facilmente
- **Open Source**: Espírito comunitário e transparente
- **Educação**: Foco em ensinar, não em impressionar
- **Segurança**: Proteger usuários de golpes e sites falsos

### Texto do Footer

"$MILAGRE é um projeto comunitário criado para conectar pessoas através de apoio mútuo e esperança."

Copyright: "© 2025 $MILAGRE Community"

---

## 🌐 Ambientes de Desenvolvimento

### Claude Code Web vs CLI

**Claude Code Web (80% do trabalho)**:
- Ambiente principal para desenvolvimento
- Lança automaticamente em PREVIEW (branches claude/*)
- Ideal para features complexas e iterações rápidas
- NÃO tem acesso ao servidor local
- NÃO pode rodar comandos locais

**Claude Code CLI (20% do trabalho)**:
- Ambiente local para validação final
- Teste de builds antes de produção
- Pequenos ajustes e debugging
- Commit final e push para produção
- Acesso completo ao filesystem local

### Workflow Recomendado

1. **Desenvolver no Web** → Preview automático (branches claude/*)
2. **Testar preview localmente** → `./server-manager.sh start-preview`
3. **Ajustar no CLI** (se necessário) → Pequenos fixes
4. **Promover para produção** → `./server-manager.sh promote-preview`

**Server Manager**: `/home/destakar/Trabalho/server-manager.sh`
- Ponte entre preview (Web) e local (CLI)
- Comandos: `start-preview`, `sync-preview`, `promote-preview`

**Versão Estável Atual**: `f33d1ba` (commit de referência para produção)

**Detalhes Completos**: Consultar skill `project-context` para workflow detalhado

---

## 🚫 O Que Evitar

### Design e UI
1. **Ícones excessivos** - Manter apenas essenciais *(ver skill: design-system)*
2. **Títulos duplicados** - Nunca repetir H1 no conteúdo *(ver skill: article-creation)*
3. **Complexidade visual** - Preferir design simples e minimalista *(ver skill: design-system)*
4. **Textos brancos no modo claro** - Sempre usar CSS variables *(ver skill: design-system)*
5. **Emojis sem solicitação** - Usar apenas quando pedido
6. **Ícones incorretos** - SEMPRE usar `@token-icons/react` para criptomoedas (TokenBTC, TokenETH, TokenSOL, etc) e Font Awesome (`@fortawesome/react-fontawesome`) para ícones gerais (UI, navegação, social)

### Código e Arquitetura
6. **Fetch HTTP em Server Components** - Usar Prisma diretamente *(ver skill: database-setup)*
7. **SQLite em produção** - Vercel não suporta bancos baseados em arquivo *(ver skill: database-setup)*
8. **Caminho padrão do Prisma** - Sempre usar `../lib/generated/prisma` *(ver skill: database-setup)*
9. **Build sem postinstall** - Prisma Client não será gerado *(ver skill: database-setup)*
10. **Fallbacks hardcoded** - NUNCA usar fallbacks silenciosos, todos dados devem vir do banco *(ver LOG.md 2025-10-25)*
11. **Schema Prisma não commitado** - SEMPRE verificar `git status prisma/schema.prisma` antes de push *(ver LOG.md 2025-10-25)*

---

## 🤖 Admin AI Assistant - Sistema Completo de Gerenciamento

### Estado Atual (2025-11-04)

O sistema foi **COMPLETAMENTE TRANSFORMADO** - agora o chat IA é o centro de controle para criar e gerenciar artigos.

**ATUALIZAÇÃO 2025-11-04**: `/dashboard/chat` foi **REMOVIDO** (funcionalidade duplicada). Sistema principal de criação com chat IA integrado está em `/dashboard/criar-artigo`. AdminChatSidebar disponível globalmente em todo dashboard via sidebar flutuante.

### 🎯 Arquitetura Implementada

**1. AdminChatSidebar (Componente Principal)** ✅
- Localização: `components/admin/AdminChatSidebar.tsx`
- Inicia **oculto** (botão flutuante no canto)
- Sidebar 420px com chat estilo ChatGPT/Claude
- Interface com streaming de respostas
- Histórico persistente (localStorage, 50 msgs)
- Botões: Copiar, Aplicar, Limpar, Exportar

**2. Comandos Disponíveis** ✅

**Criar Artigos**:
- `/create news [tópico]` - Cria notícia completa
- `/create educational [tópico]` - Cria artigo educacional
- `/create resource [nome]` - Cria página de recurso

**Validar e Melhorar**:
- `/validate` - Valida conteúdo (score 0-100)
- `/titles` - Gera 5 títulos alternativos
- `/tags` - Gera tags relevantes
- `/improve [seção]` - Melhora seção específica
- `/research [tópico]` - Pesquisa info atualizada

**Publicar**:
- `/publish` - Publica artigo no banco + redireciona
- `/regenerate` - Regenera artigo completo

**3. Fluxo Completo de Criação** ✅

```
Usuário: /create news Bitcoin atinge $100k
  ↓
Hook detecta comando → Chat mostra "Gerando..."
  ↓
Frontend chama /api/generate-article
  ↓
Perplexity gera artigo completo
  ↓
Evento "article-generated" disparado
  ↓
Página mostra artigo na tela
  ↓
Chat confirma: "✅ Artigo gerado!" + score validação
  ↓
Usuário: /publish
  ↓
Evento "publish-article" disparado
  ↓
Artigo publicado no banco
  ↓
Redirect automático para artigo publicado
```

**4. Sistema de Contexto Automático** ✅
- Localização: `lib/admin-chat-context.ts`
- Detecta página atual automaticamente
- Envia dados do artigo em edição
- Prompts adaptativos por página
- Instrui IA sobre poderes completos

**5. Página Criar Artigo Redesenhada** ✅
- Localização: `app/dashboard/criar-artigo/page.tsx`
- **Formulário removido** - tudo via chat
- Tela de boas-vindas com instruções
- Cards de comandos principais
- Preview do artigo quando gerado
- Editor manual opcional

**6. Hook useAdminChat** ✅
- Localização: `hooks/useAdminChat.ts`
- Gerencia mensagens e estado
- Processa respostas da API
- Dispara eventos customizados
- Histórico em localStorage

**7. API /api/admin-chat** ✅
- Localização: `app/api/admin-chat/route.ts`
- Processa comandos especiais
- Streaming de respostas (Perplexity)
- Rate limiting: 10 req/min
- Autenticação: ADMIN ou EDITOR
- Validação de input (max 4000 chars)

**8. Context Provider** ✅
- Localização: `contexts/AdminChatContext.tsx`
- Compartilha pageData entre layout e páginas
- Sincroniza dados do artigo com chat

### 🔧 Problemas Resolvidos

**1. Erro de Stream** ✅
- **Problema**: `Failed to execute 'getReader' on 'ReadableStream'`
- **Causa**: API tentava fazer fetch interno e processar stream já usado
- **Solução**: API retorna ação JSON → Frontend faz fetch direto
- **Arquivo**: `app/api/admin-chat/route.ts`, `hooks/useAdminChat.ts`

**2. Erro de Parsing JSON** ✅
- **Problema**: `Erro ao parsear resposta da API`
- **Causa**: Perplexity retornava texto + JSON, markdown blocks, comentários
- **Solução**: Parser multi-camadas + prompts melhorados
- **Estratégias**:
  1. Remove markdown code blocks
  2. Extrai JSON (primeiro { ao último })
  3. Parse com try/catch + debug
- **Arquivo**: `app/api/generate-article/route.ts`

**3. Respostas Confusas em Comandos Naturais** ✅
- **Problema**: IA tentava gerar artigo diretamente (texto corrompido)
- **Causa**: Prompt não instruía para orientar sobre comandos
- **Solução**: Regras críticas no prompt + instruções explícitas
- **Arquivo**: `lib/admin-chat-context.ts`

### 📁 Arquivos Críticos da Implementação

```
# Core
components/admin/AdminChatSidebar.tsx     # UI do chat
hooks/useAdminChat.ts                     # Lógica do chat
app/api/admin-chat/route.ts               # API endpoint
lib/admin-chat-context.ts                 # Sistema de contexto
contexts/AdminChatContext.tsx             # Context provider

# Página
app/dashboard/criar-artigo/page.tsx       # Interface redesenhada
app/dashboard/layout.tsx                  # Layout com chat integrado

# APIs
app/api/generate-article/route.ts         # Geração de artigos (melhorada)
lib/perplexity-client.ts                  # Cliente Perplexity compartilhado

# Validação
lib/content-validator.ts                  # Validador de conteúdo
```

### 🔐 Segurança Implementada

- ✅ Autenticação obrigatória (session)
- ✅ Permissões: ADMIN ou EDITOR apenas
- ✅ Rate limiting: 10 req/min (em memória)
- ✅ Validação de input: max 4000 chars
- ✅ Sanitização de output: ReactMarkdown
- ✅ CSRF protection via Next.js

### 💰 Custos Estimados

**Modelo Padrão**: Perplexity Sonar
- ~$0.002 por requisição de chat
- ~$0.007 por geração de artigo
- ~500 mensagens com $1
- ~140 artigos com $1

### 🚀 Como Usar (Quick Start)

1. Abrir `/dashboard/criar-artigo`
2. Clicar no botão flutuante 🤖
3. Digitar: `/create news Bitcoin atinge $100k`
4. Aguardar geração (10-30 segundos)
5. Artigo aparece na tela
6. Usar `/validate`, `/improve`, `/publish`

### 📊 Próximos Passos Sugeridos

**Fase 2 - Melhorias UX** (1-2 semanas):
- [ ] Comandos de atalho (Ctrl+K para abrir chat)
- [ ] Voice input (Web Speech API)
- [ ] Markdown preview em tempo real no chat
- [ ] Histórico de artigos gerados (banco de dados)

**Fase 3 - Features Avançadas** (2-3 semanas):
- [ ] `/seo` - Análise SEO do artigo
- [ ] `/translate [idioma]` - Traduzir conteúdo
- [ ] `/images` - Sugerir imagens (Unsplash)
- [ ] Modo batch (gerar múltiplos artigos)

**Fase 4 - Analytics** (1 mês):
- [ ] Dashboard de custos (tracking por usuário)
- [ ] Métricas de qualidade dos artigos
- [ ] A/B testing de prompts
- [ ] Feedback loop para melhorar IA

### ⚠️ Notas Importantes

**Limitações Conhecidas**:
- Perplexity às vezes retorna JSON malformado (parser robusto implementado)
- Rate limit é em memória (reseta ao reiniciar servidor)
- Histórico é localStorage (não sincroniza entre devices)

**Dependências**:
- Perplexity API Key necessária (`PERPLEXITY_API_KEY` no .env)
- NextAuth configurado para autenticação
- PostgreSQL + Prisma para artigos publicados

---

## 📞 Links Oficiais

- Token Address: `3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump`
- Discord: `https://discord.gg/skaX8bFY`
- Telegram: `https://t.me/+Bop_TVFc_mg3Njlh`
- Pump.fun: `https://pump.fun/coin/{TOKEN_ADDRESS}`

---

## ⚠️ REGRAS CRÍTICAS DE GIT

### ✅ SEMPRE Verificar Schema Prisma Antes de Push

**REGRA CRÍTICA**: Se modificar `prisma/schema.prisma`, SEMPRE verificar se está commitado antes de push

```bash
# Antes de fazer push, SEMPRE verificar
git status prisma/schema.prisma

# Se aparecer modificado, adicionar ao commit
git add prisma/schema.prisma
```

**Por quê**: Schema faltando causa build failure na Vercel porque Prisma Client não é gerado com modelos corretos.

**Lição aprendida**: 2 builds falhados causados por schema.prisma não commitado *(ver LOG.md 2025-10-25)*

---

### 🚫 NUNCA Enviar Arquivos Externos ao Projeto

**REGRA ABSOLUTA**: O Git deve rastrear APENAS arquivos dentro de `tokenmilagre-platform/`

❌ **NUNCA FAZER**:
```bash
# Não adicionar arquivos fora do projeto
git add ../imagens/
git add ../Log importante/
git add ../gemini/
git add ../*.tar.gz
git add ../*.md (fora do projeto)
```

✅ **SEMPRE FAZER**:
```bash
# Trabalhar SEMPRE dentro do diretório do projeto
cd tokenmilagre-platform/

# Adicionar apenas arquivos do projeto
git add app/
git add components/
git add lib/
git add prisma/
# etc...

# Verificar antes de commit
git status  # Deve mostrar apenas tokenmilagre-platform/*
```

### .gitignore Proteções

O `.gitignore` na raiz do workspace (`/home/destakar/Trabalho/.gitignore`) protege contra commits acidentais:
- `/Log importante/`
- `/gemini/`
- `/imagens/`
- `/*.tar.gz`
- Arquivos de documentação externos

### Consequências de Ignorar Esta Regra

❌ Repositório poluído com arquivos irrelevantes
❌ Documentação privada exposta publicamente
❌ Backups desnecessários no GitHub
❌ Dificulta navegação no repositório
❌ Aumenta tamanho do clone/fork

**SEMPRE verificar `git status` antes de commit!**

---

## 🔄 Atualizações Futuras

Este documento deve ser atualizado sempre que:
- Novos padrões críticos forem estabelecidos
- Decisões importantes de filosofia forem tomadas
- Novas regras fundamentais forem adotadas
- Problemas críticos recorrentes forem identificados

Para mudanças técnicas específicas, atualizar as **Skills** correspondentes.

---

## 📝 Histórico de Atualizações

**Para histórico detalhado de todas as atualizações, consulte: `/home/destakar/Trabalho/LOG.md`**

### Últimas Atualizações Importantes

**2025-10-30**: 🤖 **TRANSFORMAÇÃO COMPLETA - Admin AI Assistant**
  - ✅ **Chat IA como Centro de Controle**
    - Sistema completamente redesenhado: formulários removidos
    - Chat sidebar oculto (botão flutuante)
    - Interface estilo ChatGPT/Claude com streaming
    - Histórico persistente (localStorage, 50 msgs)
  - ✅ **Comandos Poderosos**
    - `/create [tipo] [tópico]` - Cria artigos completos
    - `/validate` - Valida conteúdo (score 0-100)
    - `/improve [seção]` - Melhora seções específicas
    - `/publish` - Publica no banco + redireciona
    - `/titles`, `/tags`, `/research`, `/regenerate`
  - ✅ **Arquitetura Completa**
    - `AdminChatSidebar.tsx` - UI do chat
    - `useAdminChat.ts` - Hook com lógica completa
    - `/api/admin-chat` - API endpoint com streaming
    - `admin-chat-context.ts` - Sistema de contexto automático
    - `AdminChatContext.tsx` - Context provider
  - ✅ **Eventos Customizados**
    - `article-generated` - Artigo criado
    - `apply-ai-content` - Aplicar sugestões
    - `publish-article` - Publicar artigo
    - `article-published` - Confirmação de publicação
  - 🔧 **Problemas Resolvidos**
    - Erro de stream (`ReadableStream already locked`)
    - Erro de parsing JSON (parser multi-camadas)
    - Respostas confusas em comandos naturais
  - 🔐 **Segurança**
    - Autenticação obrigatória
    - Rate limiting: 10 req/min
    - Validação de input (max 4000 chars)
    - Sanitização de output
  - 📁 **9 arquivos criados, 4 modificados**
  - 💰 **Custos**: ~$0.002/mensagem, ~$0.007/artigo gerado
  - 📊 **Status**: Sistema 100% funcional e pronto para uso

**2025-10-29 (tarde)**: 🚀 **GRANDE ATUALIZAÇÃO - Sistema de Criação de Artigos**
  - ✅ **Sistema de Validação de Conteúdo** (`lib/content-validator.ts`)
    - Valida 8 regras críticas automaticamente
    - Score 0-100 com detecção de erros e avisos
    - UI com card de validação no preview
  - ✅ **Sistema de Rascunhos Automáticos**
    - Auto-save a cada 3 segundos no localStorage
    - Modal de recuperação ao reabrir página
    - Expira após 24 horas automaticamente
    - Indicador visual de último salvamento
  - ✅ **Templates de Tópicos**
    - 22 templates prontos (8 news, 8 educational, 6 resources)
    - Dropdown dinâmico que muda por tipo
    - Facilita criação para usuários
  - 🎨 **Preview com Estilos Corretos**
    - ReactMarkdown com componentes customizados
    - Pré-visualização idêntica ao resultado publicado
    - Todos os elementos estilizados (H1-H3, listas, blockquotes, etc)
  - 🔧 **Prompts Otimizados**
    - Adicionada instrução explícita para NÃO gerar referências numéricas [1][2]
    - 2 camadas de proteção: prevenção (prompt) + detecção (validação)
  - 📊 **Status**: Sistema transformado de BOM para EXCELENTE
  - 📁 **Arquivos**: `lib/content-validator.ts` (novo), `app/api/generate-article/route.ts`, `app/dashboard/criar-artigo/page.tsx`

**2025-10-29**: 🎨 Implementação de @token-icons/react para ícones de criptomoedas
**2025-10-29**: 📊 Script de Análise Diária ajustado para 21h e seguindo regras da skill article-creation
**2025-10-28**: 📊 Seção de ETFs na Página Gráficos + Guia de Atualização (docs/ATUALIZAR-ETFS.md)
**2025-10-28**: 🔧 Fix: coingeckoId como chave única (Criptomoedas)
**2025-10-26**: 🎨 Redesign Home + Página Gráficos Otimizada
**2025-10-25 (tarde)**: 🗄️ Migração Recursos 100% para Banco de Dados PostgreSQL
**2025-10-25 (manhã)**: 🚀 Expansão Página de Recursos + Server Manager Script
**2025-10-24**: 🎯 Criação de Skills Especializadas - Migração de conteúdo técnico para 5 skills
**2025-10-24**: 📐 Reorganização de Navegação e Otimização de Layouts
**2025-10-22 (noite)**: 📚 Otimização da Documentação - Separação de Logs
**2025-10-22 (tarde)**: 🔄 Sistema de Slug Único Automático implementado
**2025-10-21 (noite)**: 🧹 Limpeza Completa do Projeto + Ajustes de UI
**2025-10-21**: 🎨 Redesign Completo da UI - Minimalismo e Gradientes

**Última atualização**: 2025-11-08 - Documentação completa do workflow Claude Code Web + CLI

**2025-11-04**: 🗑️ **Remoção de /dashboard/chat e Sistema de Citations**
  - ✅ **Removido `/dashboard/chat`** (funcionalidade duplicada)
    - Sistema principal: `/dashboard/criar-artigo` (chat IA integrado)
    - AdminChatSidebar: disponível globalmente em todo dashboard
    - Skill `chat-workflow` documenta arquitetura completa
  - ✅ **Sistema de Citations Clicáveis** (Perplexity)
    - Citations armazenadas em `factCheckSources` (JSON)
    - Botão "📚 X fontes" colapsável nos artigos
    - URLs clicáveis renderizadas por `SourcesSection`
  - ✅ **Campos coverImage e coverImageAlt**
    - Schema Article atualizado para imagens de capa geradas por IA
    - Suporte completo em API e tipos TypeScript

**2025-10-31**: 📊 **Reorganização Completa do Dashboard Admin**
  - ✅ **Nova Estrutura de Rotas**
    - `/dashboard` → Painel Admin (stats + cards com tema padrão)
    - `/dashboard/criar-artigo` → Criar artigos com chat IA integrado
    - `/dashboard/artigos` → Gerenciar artigos (sem /admin)
    - `/dashboard/usuarios` → Gerenciar usuários (sem /admin)
    - Pasta `/dashboard/admin/` DELETADA
  - ✅ **Dashboard com Tema Padrão**
    - Header, sidebar e footer agora aparecem
    - Link "Admin" na sidebar (visível para ADMIN)
    - Totalmente integrado com CSS variables
    - DashboardHeader configurado
  - ✅ **Proteção SEO - 3 Camadas**
    - Meta tags noindex no layout
    - robots.txt bloqueia /dashboard/, /login, /api/
    - Autenticação obrigatória (AdminRoute)
  - 🔧 **Correção Crítica - Gerenciar Artigos**
    - Nova rota `/api/admin/articles` (dados brutos)
    - Corrigido filtro `published='all'`
    - Removido _count de comments (não existe no schema)
  - 🧹 **Script de Limpeza**
    - `scripts/remove-references.js` remove `[1][2]` dos artigos
    - 3 artigos limpos nos últimos 10 posts
  - 📁 **3 arquivos criados, 9 modificados, 1 deletado**
