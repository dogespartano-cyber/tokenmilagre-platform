---
name: chat-workflow
description: Use esta skill quando trabalhar com o sistema de chat IA para criação de artigos. Contém workflow completo, detecção de intenção, comandos naturais, e arquitetura técnica.
allowed-tools: Read, Edit, Write
---

# Chat Workflow Skill

**⚠️ CRÍTICO**: Use esta skill quando trabalhar com o sistema de chat IA (`/dashboard/criar-artigo` ou AdminChatSidebar).

---

## 🎯 Visão Geral do Sistema

### Sistema de Criação com Chat IA

**Localização**: `/dashboard/criar-artigo`

**Objetivo**: Criar artigos completos via conversa natural com IA (sem formulários).

**Modelo**: Perplexity Sonar (acesso web em tempo real)

---

## 📊 Fluxo Completo de Criação

### 1️⃣ Modo Conversa Livre (sem tipo selecionado)

```
Usuário: "Qual o preço do Bitcoin hoje?"
  ↓
Frontend → /api/chat-perplexity (streaming)
  ↓
Perplexity busca web → Responde em tempo real
  ↓
Chat exibe resposta (streaming)
```

**Características**: Streaming ativado, busca web automática, perguntas sobre mercado

---

### 2️⃣ Modo Criação de Artigo (tipo selecionado)

#### Seleção de Tipo

```jsx
// Botões no footer do chat
- [📰 Notícia]     → selectedType = 'news'
- [📚 Educação]    → selectedType = 'educational'
- [📦 Recurso]     → selectedType = 'resource'
```

#### Fluxo de Geração

```
Usuário seleciona tipo + digita: "Bitcoin atinge $100k"
  ↓
Frontend → /api/chat-perplexity (JSON, não streaming)
  ↓
Perplexity gera artigo JSON + citations
  ↓
Frontend: detectJSON() → processArticleLocally() → validateProcessedArticle()
  ↓
setGeneratedArticle({ ...article, citations })
  ↓
Preview renderizado com ArticlePreview
```

**Arquivo**: `criar-artigo/page.tsx:320-373`

---

### 3️⃣ Processamento e Validação

#### processArticleLocally (instantâneo)

**Local**: `lib/article-processor-client.ts`

**Responsabilidades**:
- Gera slug único (`slugify + timestamp`)
- Calcula readTime (`Math.ceil(words / 200)`)
- Sanitiza conteúdo
- Define categoria, tags, sentiment/level

**NÃO usa**: Gemini (processamento local)

#### validateProcessedArticle

**Valida**: H1 duplicado, estrutura de seções (4-7), campos obrigatórios, tamanho

**Retorna**: `{ valid: boolean, score: 0-100, errors: [], warnings: [] }`

---

### 4️⃣ Ferramentas Opcionais

| Ferramenta | Fluxo | Quando Usar |
|------------|-------|-------------|
| **Refinar com Gemini** | `/api/process-gemini` → Gemini melhora estrutura | Artigo precisa de polish |
| **Criar Capa com IA** | `/api/regenerate-cover` → Gemini 2.0 Image gera PNG | Capa personalizada |
| **Refinar Manual** | `/api/refine-article` → Perplexity aplica edição | Mudança específica |

---

### 5️⃣ Publicação

```
[✅ Publicar Artigo]
  ↓
handlePublish() prepara dados:
  - tags: stringifica se array
  - factCheckSources: JSON.stringify(citations)
  - published: true (exceto resources)
  ↓
POST /api/articles ou /api/resources
  ↓
Salvo no PostgreSQL (Prisma)
  ↓
Redirect: /dashboard/noticias/{slug} ou /educacao/{slug} ou /recursos/{slug}
```

**Citations**: Armazenadas em `factCheckSources` (JSON string) para fontes clicáveis.

---

## 🤖 AdminChatSidebar (Componente Reutilizável)

### Características

**Arquivo**: `components/admin/AdminChatSidebar.tsx`

**Props**:
```typescript
interface AdminChatSidebarProps {
  pageData?: Record<string, any>;      // Dados do artigo atual
  model?: 'sonar' | 'sonar-pro';       // Modelo Perplexity
  onApplyContent?: (content: string) => void; // Callback
}
```

**Features**:
- Estado inicial: Oculto (botão flutuante 🤖)
- Dimensões: 420px width
- Histórico persistente (localStorage, 50 msgs)
- Streaming de respostas
- Markdown rendering (ReactMarkdown + remarkGfm)
- Comandos rápidos (/create, /validate, /publish)
- Exportar histórico (JSON)

### Uso em Layouts

```tsx
import AdminChatSidebar from '@/components/admin/AdminChatSidebar';
import { AdminChatProvider } from '@/contexts/AdminChatContext';

<AdminChatProvider>
  {children}
  <AdminChatSidebar />
</AdminChatProvider>
```

---

## 🧠 Sistema de Detecção de Intenção

### Arquivo: `lib/intent-detector.ts`

**Função**: Detectar intenção em linguagem natural (português brasileiro)

### Intenções Principais

| Intenção | Padrões | Confiança | Exemplos |
|----------|---------|-----------|----------|
| **CREATE** | crie, criar, gere, gerar, escreva | 0.9 | "Crie uma notícia sobre Bitcoin" |
| **VALIDATE** | valide, validar, verifique | 0.95 | "Valide este artigo" |
| **PUBLISH** | publique, publicar, envie, salve | 0.95 | "Publique o artigo" |
| **LIST** | liste, mostre, exiba | 0.8 | "Liste os últimos artigos" |
| **SEARCH** | busque, procure, encontre | 0.85 | "Busque artigos sobre Ethereum" |
| **DELETE** | delete, remova, apague | 0.9 | "Delete o artigo X" |
| **EDIT** | edite, corrija, mude, altere | 0.85 | "Edite o artigo X" |
| **STATS** | estatísticas, quantos, total | 0.8 | "Quantos artigos temos?" |
| **RESEARCH** | pesquise, qual, o que, como | 0.7 | "Qual o preço do Bitcoin?" |

### Processamento de Intenções

**Localização**: `app/api/admin-chat/route.ts:91-207`

```typescript
const intentResult = processIntent(lastMessage.content, pageData);

// String: resposta pronta (validação)
if (typeof intentResult === 'string') {
  return JSON { content: intentResult, isDirectResponse: true };
}

// Objeto: ação especial (gerar artigo, listar, deletar)
if (intentResult?.action) {
  return JSON { action: 'generate-article-request', data: {...} };
}

// null: conversa normal (IA responde)
```

---

## 🔧 Hook useAdminChat

### Arquivo: `hooks/useAdminChat.ts`

### Responsabilidades

1. **Gerenciar estado** (messages, loading, error)
2. **Enviar mensagens** → `/api/admin-chat`
3. **Processar respostas** (streaming ou JSON)
4. **Detectar ações especiais**:
   - `generate-article-request` → `/api/generate-article`
   - `list-articles` → `/api/articles?limit=10`
   - `search-articles` → `/api/articles?query=...`
   - `delete-article` → DELETE após confirmação
   - `edit-article` → evento `open-article-canvas`
   - `publish-article` → evento customizado
   - `show-stats` → calcula estatísticas
5. **Persistir histórico** (localStorage, max 50)
6. **Exportar histórico** (JSON download)

### Eventos Customizados

```typescript
window.dispatchEvent(new CustomEvent('article-generated', { detail: data }));
window.dispatchEvent(new CustomEvent('publish-article', { detail: data }));
window.dispatchEvent(new CustomEvent('article-published', { detail: result }));
window.dispatchEvent(new CustomEvent('open-article-canvas', { detail: { article } }));
window.dispatchEvent(new CustomEvent('apply-canvas-edit', { detail: { content } }));
window.dispatchEvent(new CustomEvent('canvas-article-changed', { detail: { article } }));
```

### Edição de Artigos com Canvas

**Fluxo Resumido**:
1. Usuário: "Edite o artigo sobre Bitcoin"
2. Hook detecta `edit-article` action
3. Busca artigo (`/api/articles/{slug}`)
4. Dispara evento `open-article-canvas`
5. Canvas abre à direita com editor
6. Usuário edita manualmente OU digita instrução
7. IA processa edição → `apply-canvas-edit`
8. Canvas atualiza sem salvar
9. Usuário clica "Salvar" quando satisfeito

**Código**: `useAdminChat.ts:778-858`

---

## 📡 API /api/admin-chat

### Arquivo: `app/api/admin-chat/route.ts`

### Segurança (4 Camadas)

```typescript
// 1. Autenticação obrigatória
const session = await getServerSession(authOptions);
if (!session) return 401;

// 2. Permissão: ADMIN ou EDITOR
if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') return 403;

// 3. Rate limiting: 10 req/min (em memória)
if (!checkRateLimit(session.user.id)) return 429;

// 4. Validação de input
if (lastMessage.content.length > 4000) return 400;
```

### Processamento

```typescript
// 1. Detectar intenção
const intentResult = processIntent(lastMessage.content, pageData);

// 2. Se resposta direta → retorna JSON
// 3. Se ação especial → retorna JSON com action
// 4. Se conversa normal → adiciona contexto + chama Perplexity

// 5. Selecionar modelo otimizado
const modelConfig = selectOptimalModel(userMessage, intent);

// 6. Chamar Perplexity com streaming
const stream = await callPerplexityStreaming({
  model: 'sonar',
  messages: [systemPrompt, ...messages],
  search_recency_filter: 'day' | 'week' | undefined,
  return_citations: false // Desativa [1][2][3]
});
```

### selectOptimalModel

**Lógica** (`route.ts:17-54`):

| Cenário | Modelo | Filtro | Motivo |
|---------|--------|--------|--------|
| Criar notícia | sonar | day | Busca info mais recente |
| Pesquisa atual (preço, hoje) | sonar | week | Info atualizada |
| Padrão | sonar | - | Conversação geral |

---

## 🎨 Sistema de Contexto Automático

### Arquivo: `lib/admin-chat-context.ts`

**Função**: Adaptar prompt do sistema baseado na página

### Prompts por Página

#### `/dashboard/criar-artigo`

```
**CONTEXTO ATUAL**: Dashboard - Área de Criação de Conteúdo

**O QUE VOCÊ PODE FAZER**:
- Criar artigos completos (notícias, educacionais, recursos)
- Validar conteúdo (score 0-100)
- Editar e melhorar textos
- Publicar no banco de dados

**REGRAS DE ESTRUTURA** (CRÍTICO):
- Notícias DEVEM começar com ## (H2), NÃO com parágrafo
- Artigos educacionais PODEM começar com parágrafo
- NUNCA incluir H1 no conteúdo
- NUNCA incluir fontes/referências
- Notícias: 5-6 seções H2 (mín 4, máx 7)
```

#### `/dashboard` (geral)

```
**CONTEXTO ATUAL**: Dashboard Principal

**O QUE VOCÊ PODE FAZER**:
- Criar conteúdo (notícias, artigos, recursos)
- Gerenciar artigos existentes (listar, buscar, deletar)
- Analisar estatísticas da plataforma
- Pesquisar informações atualizadas sobre crypto

**REGRA CRÍTICA - BANCO vs WEB**:
- "Listar artigos" → Sistema busca NO BANCO
- "Pesquisar sobre X na web" → Você busca NA WEB
```

### Contexto do Artigo

Se há artigo em edição (`pageData.content` ou `pageData.title`), adiciona ao prompt:

```
**Artigo Atual**:
- Título: {title}
- Tipo: {type}
- Categoria: {category}
- Tags: {tags}
- Tamanho: {length} caracteres

**Conteúdo**:
"""
{content}
"""
```

---

## 💾 Persistência e Estado

### localStorage

```typescript
// Key: 'admin-chat-history'
// Max: 50 mensagens
// Estrutura:
[
  {
    id: 'user-1234567890',
    role: 'user',
    content: 'Crie uma notícia sobre Bitcoin',
    timestamp: '2025-11-03T10:30:00.000Z'
  },
  {
    id: 'assistant-1234567891',
    role: 'assistant',
    content: '✅ Artigo gerado!',
    timestamp: '2025-11-03T10:30:15.000Z',
    metadata: {
      canvasArticle?: { slug, title, content },
      instruction?: 'Remova as referências'
    }
  }
]
```

### Context Provider

**Arquivo**: `contexts/AdminChatContext.tsx`

**Função**: Compartilhar `pageData` entre layout e páginas

```tsx
const [pageData, setPageData] = useState<Record<string, any>>({});

// Página seta dados
setPageData({ title, content, type, category });

// Chat consome via context
```

---

## 🔍 Debugging

### Logs de Development

```typescript
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  console.log('🖼️ [DEBUG] coverImage:', generatedArticle.coverImage);
  console.log('📝 Artigo detectado, processando...');
  console.log('✅ Validação:', validation);
}
```

### Problemas Comuns e Soluções

| Problema | Causa | Debug | Solução |
|----------|-------|-------|---------|
| Artigo não aparece no preview | `generatedArticle` não foi setado | `console.log` antes/depois de `setGeneratedArticle` | Verificar fluxo de detecção JSON |
| Citations não salvam | `factCheckSources` não stringificado | Verificar `JSON.stringify(citations)` | Stringificar antes do POST |
| Chat não responde (loading infinito) | Streaming quebrado ou erro | Network tab: erro 500/429/403 | Verificar auth, rate limit, API |
| Detecção de JSON falha | Perplexity retornou JSON malformado | Logs em `detectJSON()` | Parser multi-camadas robusto já implementado |

**Arquivo de Debug**: `criar-artigo/page.tsx:258-294`

---

## 📋 Checklist de Criação de Artigo

### Fluxo Ideal

- [ ] Selecionar tipo (Notícia, Educação ou Recurso)
- [ ] Digitar tópico claro: "Bitcoin atinge $100k após aprovação de ETF"
- [ ] Aguardar geração (10-30 segundos)
- [ ] Verificar preview renderizado
- [ ] (Opcional) Refinar com Gemini
- [ ] (Opcional) Gerar capa com IA
- [ ] (Opcional) Editar manualmente
- [ ] Publicar artigo
- [ ] Verificar redirect automático

### Validação Antes de Publicar

- [ ] Score > 80 (bom), > 90 (excelente)
- [ ] Sem H1 duplicado no content
- [ ] 4-7 seções H2 (notícias)
- [ ] Conteúdo > 500 caracteres
- [ ] Tags relevantes
- [ ] Categoria definida
- [ ] Citations salvas (se houver)

---

## 🚀 Próximas Features (Sugeridas)

### Fase 2 - UX

- [ ] Comandos de atalho (Ctrl+K)
- [ ] Voice input (Web Speech API)
- [ ] Markdown preview em tempo real
- [ ] Histórico de artigos gerados (banco)

### Fase 3 - Avançado

- [ ] `/seo` - Análise SEO do artigo
- [ ] `/translate [idioma]` - Traduzir
- [ ] `/images` - Sugerir imagens (Unsplash)
- [ ] Modo batch (múltiplos artigos)

### Fase 4 - Analytics

- [ ] Dashboard de custos
- [ ] Métricas de qualidade
- [ ] A/B testing de prompts
- [ ] Feedback loop para melhorar IA

---

## 📁 Arquivos Críticos da Implementação

```
# Core Chat
components/admin/AdminChatSidebar.tsx     # UI sidebar
hooks/useAdminChat.ts                     # Lógica + eventos
app/api/admin-chat/route.ts               # API endpoint

# Criação de Artigos
app/dashboard/criar-artigo/page.tsx       # Interface principal
app/api/chat-perplexity/route.ts          # Proxy Perplexity

# Processamento
lib/article-processor-client.ts           # Processar + validar
lib/admin-chat-context.ts                 # Sistema de contexto
lib/intent-detector.ts                    # Detecção de intenção
lib/perplexity-client.ts                  # Cliente Perplexity

# Context
contexts/AdminChatContext.tsx             # Context provider

# APIs auxiliares
app/api/generate-article/route.ts         # Geração de artigos
app/api/process-gemini/route.ts           # Refinar com Gemini
app/api/refine-article/route.ts           # Refinamento manual
app/api/regenerate-cover/route.ts         # Gerar capa com IA
```

---

## 💰 Custos Estimados

**Perplexity Sonar**:
- Mensagem chat: ~$0.002
- Gerar artigo: ~$0.007
- 500 mensagens: ~$1
- 140 artigos: ~$1

**Gemini (opcional)**:
- Refinar artigo: ~$0.001
- Gerar capa: ~$0.05

---

## ⚠️ Limitações Conhecidas

1. **Perplexity às vezes retorna JSON malformado**
   - Mitigação: Parser multi-camadas robusto implementado

2. **Rate limit em memória**
   - Reseta ao reiniciar servidor
   - Considerar Redis para produção

3. **Histórico em localStorage**
   - Não sincroniza entre devices
   - Considerar banco para histórico persistente

4. **Citations em factCheckSources**
   - Schema atual não tem campo dedicado
   - Usando campo genérico como workaround

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-11-04
**Baseado em**: Sistema completo de chat IA do Token Milagre Platform
