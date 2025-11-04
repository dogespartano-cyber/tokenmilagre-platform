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
Chat exibe resposta (streaming de texto)
```

**Características**:
- Streaming ativado
- Busca web automática
- Perguntas sobre mercado, análises, conceitos
- Sugestões rápidas (12 cards de exemplos)

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
Frontend → /api/chat-perplexity (JSON response, NÃO streaming)
  ↓
Perplexity gera artigo em JSON + citations
  ↓
Frontend detecta JSON → processArticleLocally()
  ↓
validateProcessedArticle() → score 0-100
  ↓
setGeneratedArticle({ ...article, citations })
  ↓
Chat substitui JSON por mensagem: "✅ Artigo gerado!"
  ↓
Preview renderizado com ArticlePreview
```

**Código crítico** (`criar-artigo/page.tsx:320-373`):

```typescript
// Resposta JSON (não streaming quando tipo selecionado)
const jsonResponse = await response.json();
const content = jsonResponse.content;
const citations = jsonResponse.citations || [];

// Detectar JSON no content
const detectedArticle = detectJSON(content);

// Processar localmente (sem Gemini)
const processedArticle = processArticleLocally(detectedArticle, selectedType!);

// Validar
const validation = validateProcessedArticle(processedArticle, selectedType!);

// Adicionar citations ao artigo
setGeneratedArticle({
  ...processedArticle,
  type: selectedType,
  citations // ← Armazenadas aqui para publicação
});
```

---

### 3️⃣ Processamento e Validação

#### processArticleLocally (instantâneo)

**Local**: `lib/article-processor-client.ts`

**O que faz**:
- Gera slug único (`slugify + timestamp`)
- Calcula readTime (`Math.ceil(words / 200)`)
- Sanitiza conteúdo
- Define categoria, tags, sentiment/level

**NÃO usa**: Gemini (processamento local)

#### validateProcessedArticle

**Local**: `lib/article-processor-client.ts`

**Valida**:
- H1 duplicado no content
- Estrutura de seções (mín 4, máx 7)
- Campos obrigatórios
- Tamanho do conteúdo

**Retorna**: `{ valid: boolean, score: 0-100, errors: [], warnings: [] }`

---

### 4️⃣ Ferramentas Opcionais

#### Refinar com Gemini (opcional)

```
Usuário clica: [✨ Refinar com Gemini]
  ↓
Frontend → /api/process-gemini
  ↓
Gemini melhora estrutura, fluidez, formatação
  ↓
Artigo atualizado (preserva capa se existir)
```

**Quando usar**: Artigo precisa de polish, melhor flow, otimização de títulos.

#### Criar Capa com IA (experimental)

```
Usuário clica: [🎨 Gerar Capa] ou [🎨 Nova Capa]
  ↓
Frontend → /api/regenerate-cover
  ↓
Gemini 2.0 Image gera capa em base64
  ↓
Salva em /public/images/covers/{type}/{slug}-{timestamp}.png
  ↓
Artigo atualizado com coverImage path
```

**Arquivo**: `app/api/regenerate-cover/route.ts`

**Modelo**: Gemini 2.0 Flash Experimental (imagen-3.0-generate-001)

#### Refinar Manual (textarea)

```
Usuário digita: "Adicione mais detalhes sobre mineração"
  ↓
Frontend → /api/refine-article
  ↓
Perplexity aplica refinamento
  ↓
Artigo atualizado
```

---

### 5️⃣ Publicação

```
Usuário clica: [✅ Publicar Artigo]
  ↓
handlePublish() em criar-artigo/page.tsx:596
  ↓
Prepara dados:
  - tags: stringifica se for array
  - factCheckSources: JSON.stringify(citations)
  - published: true (se não for resource)
  - authorId: session.user.id (se não for resource)
  ↓
POST /api/articles ou /api/resources
  ↓
Artigo salvo no PostgreSQL (Prisma)
  ↓
Redirect:
  - news → /dashboard/noticias/{slug}
  - educational → /educacao/{slug}
  - resource → /recursos/{slug}
```

**Citations**: Armazenadas em `factCheckSources` (JSON string) para exibir fontes clicáveis.

---

## 🤖 AdminChatSidebar (Componente Reutilizável)

### Características

**Arquivo**: `components/admin/AdminChatSidebar.tsx`

**Estado inicial**: Oculto (botão flutuante 🤖)

**Dimensões**: 420px width, altura 100%

**Posição**: Fixed right, slide in/out

**Features**:
- Histórico persistente (localStorage, 50 msgs)
- Streaming de respostas
- Markdown rendering (ReactMarkdown + remarkGfm)
- Comandos rápidos (/create, /validate, /publish)
- Copiar mensagens
- Exportar histórico (JSON)
- Limpar histórico

### Props

```typescript
interface AdminChatSidebarProps {
  pageData?: Record<string, any>;  // Dados do artigo atual
  model?: 'sonar' | 'sonar-pro';   // Modelo Perplexity
  onApplyContent?: (content: string) => void; // Callback para aplicar sugestões
}
```

### Uso em Layouts

**Exemplo** (`app/dashboard/layout.tsx`):

```tsx
import AdminChatSidebar from '@/components/admin/AdminChatSidebar';
import { AdminChatProvider } from '@/contexts/AdminChatContext';

<AdminChatProvider>
  {children}
  <AdminChatSidebar /> {/* Disponível em todas as páginas do dashboard */}
</AdminChatProvider>
```

---

## 🧠 Sistema de Detecção de Intenção

### Arquivo: `lib/intent-detector.ts`

**Função**: Detectar intenção em linguagem natural (português brasileiro)

### Intenções Detectadas

#### CREATE (criar artigo)
```
Padrões: "crie", "criar", "gere", "gerar", "escreva", "faça"
Subtypes: news, educational, resource
Confiança: 0.9

Exemplos:
- "Crie uma notícia sobre Bitcoin"
- "Faça um artigo educacional sobre DeFi"
- "Gere um recurso sobre MetaMask"
```

#### VALIDATE (validar)
```
Padrões: "valide", "validar", "verifique", "analise"
Confiança: 0.95

Exemplos:
- "Valide este artigo"
- "Verifique a qualidade"
- "Analise o conteúdo"
```

#### PUBLISH (publicar)
```
Padrões: "publique", "publicar", "envie", "salve"
Confiança: 0.95

Exemplos:
- "Publique o artigo"
- "Salve no banco"
```

#### LIST (listar artigos)
```
Padrões: "liste", "mostre", "exiba"
Confiança: 0.8

Exemplos:
- "Liste os últimos artigos"
- "Mostre os artigos publicados"
```

#### SEARCH (buscar artigos)
```
Padrões: "busque", "procure", "encontre"
Confiança: 0.85

Exemplos:
- "Busque artigos sobre Ethereum"
- "Encontre posts sobre NFT"
```

#### DELETE (deletar)
```
Padrões: "delete", "remova", "apague"
Confiança: 0.9

Exemplos:
- "Delete o artigo sobre Solana"
- "Remova o post de ontem"
```

#### EDIT (editar)
```
Padrões: "edite", "corrija", "mude", "altere"
Confiança: 0.85

Exemplos:
- "Edite o artigo X"
- "Corrija os erros do post sobre Bitcoin"
```

#### STATS (estatísticas)
```
Padrões: "estatísticas", "quantos", "total"
Confiança: 0.8

Exemplos:
- "Mostre as estatísticas"
- "Quantos artigos temos?"
```

#### RESEARCH (pesquisa web)
```
Padrões: "pesquise", "qual", "o que", "como"
Confiança: 0.7

Exemplos:
- "Pesquise sobre airdrop Solana"
- "Qual o preço do Bitcoin?"
- "O que há de novo sobre Ethereum?"
```

### Código de Detecção

**Localização**: `app/api/admin-chat/route.ts:91-207`

```typescript
const intentResult = processIntent(lastMessage.content, pageData);

// String: resposta pronta (ex: validação)
if (typeof intentResult === 'string') {
  return NextResponse.json({
    success: true,
    content: intentResult,
    isDirectResponse: true
  });
}

// Objeto: ação especial (ex: gerar artigo, listar, deletar)
if (typeof intentResult === 'object' && intentResult.action) {
  return NextResponse.json({
    success: true,
    action: intentResult.action, // 'generate-article-request', 'list-articles', etc
    data: intentResult.data
  });
}

// null: conversa normal (deixa IA responder)
```

---

## 🔧 Hook useAdminChat

### Arquivo: `hooks/useAdminChat.ts`

### Responsabilidades

1. **Gerenciar estado do chat** (messages, loading, error)
2. **Enviar mensagens** → `/api/admin-chat`
3. **Processar respostas**:
   - Streaming (conversa normal)
   - JSON direto (ações especiais)
4. **Detectar ações especiais** e executar:
   - `generate-article-request` → chama `/api/generate-article`
   - `list-articles` → chama `/api/articles?limit=10`
   - `search-articles` → chama `/api/articles?query=...`
   - `delete-article` → mostra lista → pede confirmação → DELETE
   - `edit-article` → busca artigo → dispara evento `open-article-canvas`
   - `publish-article` → dispara evento → página publica
   - `show-stats` → busca e calcula estatísticas
5. **Persistir histórico** (localStorage, max 50 msgs)
6. **Exportar histórico** (JSON download)

### Eventos Customizados

```typescript
// Artigo gerado
window.dispatchEvent(new CustomEvent('article-generated', {
  detail: generateData.data
}));

// Publicar artigo
window.dispatchEvent(new CustomEvent('publish-article', {
  detail: data.data
}));

// Artigo publicado (resposta)
window.dispatchEvent(new CustomEvent('article-published', {
  detail: { success, error }
}));

// Abrir canvas de edição
window.dispatchEvent(new CustomEvent('open-article-canvas', {
  detail: { article, instruction }
}));

// Aplicar edição no canvas
window.dispatchEvent(new CustomEvent('apply-canvas-edit', {
  detail: { content }
}));

// Mudança no artigo do canvas
window.dispatchEvent(new CustomEvent('canvas-article-changed', {
  detail: { article }
}));
```

### Edição de Artigos com Canvas

**Fluxo**:
1. Usuário: "Edite o artigo sobre Bitcoin"
2. Hook detecta `edit-article` action
3. Busca artigos com query "Bitcoin"
4. Se múltiplos: mostra lista, pede seleção
5. Se único: busca conteúdo completo (`/api/articles/{slug}`)
6. Dispara evento `open-article-canvas`
7. Página abre canvas à direita com editor
8. Usuário edita manualmente OU
9. Usuário digita instrução: "Remova as referências [1][2]"
10. Hook detecta que há artigo no canvas + instrução de edição
11. Chama IA para processar edição
12. Dispara evento `apply-canvas-edit`
13. Canvas atualiza conteúdo (sem salvar)
14. Usuário clica "Salvar" quando satisfeito

**Código** (`useAdminChat.ts:778-858`):

```typescript
// Detectar se há artigo no canvas E mensagem é instrução de edição
const canvasArticle = currentCanvasArticleRef.current;
const isEditInstruction = /^(remov[ae]|corrij[ae]|adicion[e]|mud[e]|alter[e])/i.test(content);

if (canvasArticle && isEditInstruction) {
  // Chamar IA para editar
  const editResponse = await fetch('/api/admin-chat', {
    method: 'POST',
    body: JSON.stringify({
      messages: [{
        role: 'user',
        content: `Você é um editor. Edite seguindo: ${content}\n\nConteúdo:\n${canvasArticle.content}`
      }]
    })
  });

  // Ler stream
  const editedContent = await readStream(editResponse);

  // Aplicar no canvas
  window.dispatchEvent(new CustomEvent('apply-canvas-edit', {
    detail: { content: editedContent }
  }));
}
```

---

## 📡 API /api/admin-chat

### Arquivo: `app/api/admin-chat/route.ts`

### Segurança

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

// 2. Se for resposta direta (validação)
if (typeof intentResult === 'string') {
  return JSON { content: intentResult, isDirectResponse: true };
}

// 3. Se for ação especial
if (intentResult?.action) {
  return JSON { action: 'generate-article-request', data: {...} };
}

// 4. Se for conversa normal, adicionar contexto
const context = extractPageContext(pathname, pageData);
const systemPrompt = context.systemPrompt;

// 5. Selecionar modelo otimizado
const modelConfig = selectOptimalModel(userMessage, intent);

// 6. Chamar Perplexity
const stream = await callPerplexityStreaming({
  model: 'sonar',
  messages: [{ role: 'system', content: systemPrompt }, ...messages],
  search_recency_filter: 'day' | 'week' | undefined,
  return_citations: false // ← Desativa [1][2][3]
});

// 7. Retornar streaming
return new Response(parsedStream, {
  headers: { 'Content-Type': 'text/event-stream' }
});
```

### selectOptimalModel

**Lógica** (`route.ts:17-54`):

```typescript
// Criar notícia → sonar + search_recency_filter: 'day'
if (intent.action === 'CREATE' && intent.subtype === 'news') {
  return { model: 'sonar', search_recency_filter: 'day' };
}

// Pesquisa atual (preço, valor, hoje) → 'week'
if (message.includes('preço') || message.includes('hoje')) {
  return { model: 'sonar', search_recency_filter: 'week' };
}

// Padrão: sonar sem filtro
return { model: 'sonar' };
```

---

## 🎨 Sistema de Contexto Automático

### Arquivo: `lib/admin-chat-context.ts`

### Função: Adaptar prompt do sistema baseado na página

### Prompts por Página

#### `/dashboard/criar-artigo`

```
**CONTEXTO ATUAL**: Dashboard - Área de Criação de Conteúdo

**O QUE VOCÊ PODE FAZER AQUI**:
- Criar artigos completos (notícias, educacionais, recursos)
- Validar conteúdo (score 0-100)
- Editar e melhorar textos
- Publicar no banco de dados
- Pesquisar informações atualizadas

**REGRAS DE ESTRUTURA** (CRÍTICO):
- Notícias DEVEM começar com ## (H2), NÃO com parágrafo
- Artigos educacionais PODEM começar com parágrafo introdutório
- NUNCA incluir H1 (# Título) no conteúdo
- NUNCA incluir seção de fontes/referências
- Notícias devem ter 5-6 seções H2 (mínimo 4, máximo 7)
```

#### `/dashboard` (geral)

```
**CONTEXTO ATUAL**: Dashboard Principal

**O QUE VOCÊ PODE FAZER**:
- Criar conteúdo (notícias, artigos, recursos)
- Gerenciar artigos existentes NO SITE (listar, buscar, deletar)
- Analisar estatísticas da plataforma
- Pesquisar informações atualizadas DA WEB sobre crypto

**REGRA CRÍTICA - BANCO vs WEB**:
Quando usuário pedir:
- "Listar artigos" → Sistema busca NO BANCO (não responda!)
- "Pesquisar sobre X na web" → Você busca NA WEB
```

### Contexto do Artigo

```typescript
// Se há artigo em edição, adiciona ao prompt
if (pageData?.content || pageData?.title) {
  systemPrompt += '\n\n' + formatArticleContext(pageData);
}

// formatArticleContext retorna:
/**
 * **Artigo Atual**:
 * - Título: Bitcoin atinge $100k
 * - Tipo: news
 * - Categoria: Notícias
 * - Tags: bitcoin, preço, mercado
 * - Tamanho: 1500 caracteres
 *
 * **Conteúdo**:
 * """
 * ## Bitcoin quebra barreira histórica
 * ...
 * """
 */
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
    content: '✅ Artigo gerado e processado!...',
    timestamp: '2025-11-03T10:30:15.000Z',
    metadata: {
      canvasArticle?: { slug, title, content, ... },
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

// Página seta dados do artigo
setPageData({
  title: 'Bitcoin atinge $100k',
  content: '## Bitcoin quebra...',
  type: 'news',
  category: 'Notícias'
});

// Chat consome pageData via context
```

---

## 🔍 Debugging

### Logs de Development

```typescript
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  console.log('🖼️ [DEBUG RENDER] generatedArticle.coverImage:', ...);
  console.log('📝 Artigo detectado, processando localmente...');
  console.log('🔧 Artigo processado:', processedArticle);
  console.log('✅ Validação:', validation);
}
```

### Problemas Comuns

#### 1. Artigo não aparece no preview

**Causa**: `generatedArticle` não foi setado

**Debug**:
```typescript
console.log('🎯 Definindo generatedArticle...');
setGeneratedArticle({ ...processedArticle, type: selectedType, citations });
console.log('✅ generatedArticle definido!', citations);
```

#### 2. Citations não salvam

**Causa**: `factCheckSources` não foi stringificado

**Fix** (`criar-artigo/page.tsx:610-613`):
```typescript
const citationsToSend = generatedArticle.citations?.length > 0
  ? JSON.stringify(generatedArticle.citations)
  : undefined;

// No body do POST
factCheckSources: citationsToSend
```

#### 3. Chat não responde (loading infinito)

**Causa**: Streaming quebrado ou erro não tratado

**Debug**:
```typescript
// Verificar network tab no DevTools
// Procurar por erro 500, 429 (rate limit), 403 (permissão)

// Verificar console:
// - "Error in admin chat:"
// - "Erro ao enviar mensagem:"
```

#### 4. Detecção de JSON falha

**Causa**: Perplexity retornou JSON malformado

**Debug** (`criar-artigo/page.tsx:258-294`):
```typescript
const detectJSON = (text: string): any | null => {
  console.log('🔍 [detectJSON] Tentando detectar JSON...');
  console.log('📄 Primeiros 200 chars:', text.substring(0, 200));

  // Estratégia 1: Markdown code blocks
  let jsonMatch = text.match(/```json\n?([\s\S]*?)```/);

  // Estratégia 2: Extrair do primeiro { ao último }
  const extracted = text.substring(firstBrace, lastBrace + 1);

  // Se falhar, retorna null
  return null;
};
```

---

## 📋 Checklist de Criação de Artigo

### Fluxo Ideal

- [ ] Selecionar tipo (Notícia, Educação ou Recurso)
- [ ] Digitar tópico claro: "Bitcoin atinge $100k após aprovação de ETF"
- [ ] Aguardar geração (10-30 segundos)
- [ ] Verificar preview renderizado
- [ ] (Opcional) Refinar com Gemini
- [ ] (Opcional) Gerar capa com IA
- [ ] (Opcional) Editar manualmente seções específicas
- [ ] Publicar artigo
- [ ] Verificar redirect automático para artigo publicado

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

- [ ] Comandos de atalho (Ctrl+K para abrir chat)
- [ ] Voice input (Web Speech API)
- [ ] Markdown preview em tempo real no chat
- [ ] Histórico de artigos gerados (banco)

### Fase 3 - Avançado

- [ ] `/seo` - Análise SEO do artigo
- [ ] `/translate [idioma]` - Traduzir conteúdo
- [ ] `/images` - Sugerir imagens (Unsplash)
- [ ] Modo batch (gerar múltiplos artigos)

### Fase 4 - Analytics

- [ ] Dashboard de custos (tracking por usuário)
- [ ] Métricas de qualidade dos artigos
- [ ] A/B testing de prompts
- [ ] Feedback loop para melhorar IA

---

## 📁 Arquivos Críticos da Implementação

```
# Core Chat
components/admin/AdminChatSidebar.tsx     # UI sidebar chat
hooks/useAdminChat.ts                     # Lógica + eventos
app/api/admin-chat/route.ts               # API endpoint

# Criação de Artigos
app/dashboard/criar-artigo/page.tsx       # Interface principal
app/api/chat-perplexity/route.ts          # Proxy Perplexity

# Processamento
lib/article-processor-client.ts           # Processar + validar artigos
lib/admin-chat-context.ts                 # Sistema de contexto
lib/intent-detector.ts                    # Detecção de intenção
lib/perplexity-client.ts                  # Cliente Perplexity compartilhado

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

**Modelo Padrão**: Perplexity Sonar

- Mensagem chat: ~$0.002
- Gerar artigo: ~$0.007
- 500 mensagens: ~$1
- 140 artigos: ~$1

**Gemini** (opcional):
- Refinar artigo: ~$0.001
- Gerar capa: ~$0.05

---

## ⚠️ Limitações Conhecidas

1. **Perplexity às vezes retorna JSON malformado**
   - Mitigação: Parser multi-camadas robusto

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

---

## 🚧 FUNCIONALIDADES REMOVIDAS (Para trabalho futuro)

### `/dashboard/chat` - Chat IA Full Screen (REMOVIDO em 04/11/2025)

**Motivo da remoção**: Funcionalidade duplicada - substituída por `/dashboard/criar-artigo`

**O que era**:
- Página dedicada ao chat IA em tela cheia
- Interface simplificada sem editor de artigos
- Menu lateral com links para dashboard, artigos, usuários
- ArticleCanvas integrado para edição lateral
- Proteção AdminRoute (apenas ADMIN)

**Arquivos removidos**:
- `app/dashboard/chat/page.tsx` (165 linhas)

**Componentes que ainda existem** (podem ser reutilizados):
- `AIAssistant` (usado em `/dashboard/criar-artigo`)
- `ArticleCanvas` (usado globalmente)
- `AdminChatSidebar` (sidebar reutilizável)

**Funcionalidades que foram preservadas**:
- ✅ Chat IA completo em `/dashboard/criar-artigo`
- ✅ AdminChatSidebar (sidebar global no dashboard)
- ✅ ArticleCanvas (edição lateral de artigos)
- ✅ Sistema de eventos (open-article-canvas, etc)

**Possível retorno futuro**:
- Se precisarmos de chat IA **sem contexto de criação de artigos**
- Para conversas gerais sobre crypto (análises, pesquisas)
- Para assistente de administração geral do site
- Para dashboard de métricas + chat integrado

**Código salvo para referência** (caso precisemos restaurar):
```tsx
// app/dashboard/chat/page.tsx (backup)
'use client';
import AdminRoute from '@/components/AdminRoute';
import AIAssistant from '../_components/AIAssistant';
import ArticleCanvas from '@/components/admin/ArticleCanvas';

export default function ChatPage() {
  // Interface minimalista: Header + AIAssistant full screen + Canvas lateral
  // Eventos: open-article-canvas, save article via PATCH /api/articles/[slug]
}
```

**Decisão**: Manter apenas `/dashboard/criar-artigo` como interface principal do chat IA.

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-11-04
**Baseado em**: Sistema completo de chat IA do Token Milagre Platform
