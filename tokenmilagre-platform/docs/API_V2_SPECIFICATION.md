# 🌐 API v2 - ESPECIFICAÇÃO COMPLETA

**Versão**: 2.0.0
**Base URL**: `/api/v2`
**Autenticação**: Bearer Token (NextAuth session)

---

## 📋 ÍNDICE

1. [Princípios de Design](#princípios-de-design)
2. [Autenticação e Autorização](#autenticação-e-autorização)
3. [Formato de Resposta](#formato-de-resposta)
4. [Tratamento de Erros](#tratamento-de-erros)
5. [Paginação](#paginação)
6. [Rate Limiting](#rate-limiting)
7. [Endpoints - Articles](#endpoints---articles)
8. [Endpoints - Bulk Generation](#endpoints---bulk-generation)
9. [Endpoints - Resources](#endpoints---resources)
10. [Webhooks](#webhooks)

---

## 🎯 PRINCÍPIOS DE DESIGN

### 1. RESTful

- **GET**: Buscar dados (idempotente)
- **POST**: Criar recursos
- **PATCH**: Atualizar parcialmente
- **PUT**: Substituir completamente
- **DELETE**: Remover

### 2. Idempotência

- GET, PUT, DELETE são sempre idempotentes
- POST com `Idempotency-Key` header

### 3. Versionamento

- `/api/v2/` (atual)
- `/api/v1/` (mantido para compatibilidade)
- Deprecation warnings nos headers

### 4. HATEOAS

Respostas incluem links para ações disponíveis:

```json
{
  "data": {...},
  "_links": {
    "self": "/api/v2/articles/123",
    "update": "/api/v2/articles/123",
    "delete": "/api/v2/articles/123",
    "publish": "/api/v2/articles/123/publish"
  }
}
```

---

## 🔐 AUTENTICAÇÃO E AUTORIZAÇÃO

### Headers Obrigatórios

```http
Authorization: Bearer <session_token>
Content-Type: application/json
```

### Níveis de Acesso (RBAC)

| Role | Articles | Resources | Users | Bulk Generation |
|------|----------|-----------|-------|-----------------|
| **ADMIN** | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **EDITOR** | ✅ CRUD | ✅ Read/Create | ❌ No | ✅ Limited (5/day) |
| **VIEWER** | ✅ Read | ✅ Read | ❌ No | ❌ No |

---

## 📦 FORMATO DE RESPOSTA

### Sucesso (200 OK)

```json
{
  "success": true,
  "data": {...},
  "meta": {
    "timestamp": "2025-11-18T12:00:00Z",
    "requestId": "req_abc123"
  },
  "_links": {...}
}
```

### Lista com Paginação

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {...}
}
```

---

## ⚠️ TRATAMENTO DE ERROS

### Formato de Erro

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "title",
        "message": "Título é obrigatório"
      }
    ],
    "requestId": "req_abc123"
  }
}
```

### Códigos de Erro

| Código HTTP | Error Code | Descrição |
|-------------|------------|-----------|
| 400 | `VALIDATION_ERROR` | Dados inválidos |
| 401 | `UNAUTHORIZED` | Não autenticado |
| 403 | `FORBIDDEN` | Sem permissão |
| 404 | `NOT_FOUND` | Recurso não encontrado |
| 409 | `CONFLICT` | Conflito (ex: slug duplicado) |
| 422 | `UNPROCESSABLE` | Entidade não processável |
| 429 | `RATE_LIMIT_EXCEEDED` | Muitas requisições |
| 500 | `INTERNAL_ERROR` | Erro do servidor |
| 503 | `SERVICE_UNAVAILABLE` | Serviço temporariamente indisponível |

---

## 📄 PAGINAÇÃO

### Query Parameters

```
?page=1
&limit=20
&sort=createdAt:desc
&filter[status]=published
&filter[type]=news
&search=bitcoin
```

### Sorting

```
?sort=title:asc
?sort=createdAt:desc,title:asc (múltiplos)
```

### Filtering

```
?filter[status]=published
?filter[type]=news
?filter[category]=bitcoin
?filter[createdAt][gte]=2025-01-01 (data maior ou igual)
```

---

## 🚦 RATE LIMITING

### Limites

| Role | Requests/min | Burst |
|------|--------------|-------|
| ADMIN | 300 | 500 |
| EDITOR | 100 | 200 |
| VIEWER | 60 | 100 |

### Headers de Response

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1637000000
Retry-After: 60 (se 429)
```

---

## 📰 ENDPOINTS - ARTICLES

### GET /api/v2/articles

**Descrição**: Lista artigos com filtros

**Autenticação**: Opcional (retorna apenas published se não autenticado)

**Query Parameters**:
```
page, limit, sort, search
filter[type], filter[status], filter[category], filter[level]
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "art_123",
      "slug": "bitcoin-atinge-100k",
      "title": "Bitcoin Atinge US$ 100 mil",
      "excerpt": "Criptomoeda...",
      "type": "news",
      "status": "published",
      "category": {
        "id": "cat_1",
        "slug": "bitcoin",
        "name": "Bitcoin"
      },
      "tags": [
        { "id": "tag_1", "slug": "bitcoin", "name": "Bitcoin" },
        { "id": "tag_2", "slug": "preço", "name": "Preço" }
      ],
      "author": {
        "id": "user_1",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "readTime": "5 min",
      "viewCount": 1250,
      "sentiment": "positive",
      "createdAt": "2025-11-18T10:00:00Z",
      "publishedAt": "2025-11-18T12:00:00Z",
      "_links": {
        "self": "/api/v2/articles/art_123",
        "html": "/dashboard/noticias/bitcoin-atinge-100k"
      }
    }
  ],
  "pagination": {...}
}
```

---

### GET /api/v2/articles/:id

**Descrição**: Busca artigo por ID ou slug

**Autenticação**: Opcional (drafts requerem auth)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "art_123",
    "slug": "bitcoin-atinge-100k",
    "title": "Bitcoin Atinge US$ 100 mil",
    "excerpt": "...",
    "content": "## Fato Central\n\nO Bitcoin...",
    "type": "news",
    "status": "published",
    "category": {...},
    "tags": [...],
    "author": {...},
    "citations": [
      {
        "id": "cit_1",
        "url": "https://example.com/source",
        "title": "Source Title",
        "domain": "example.com",
        "order": 0
      }
    ],
    "relatedArticles": [
      {
        "id": "art_124",
        "slug": "ethereum-supera-5k",
        "title": "Ethereum Supera US$ 5 mil",
        "relationType": "related"
      }
    ],
    "sentiment": "positive",
    "readTime": "5 min",
    "viewCount": 1250,
    "factCheckScore": 85.5,
    "factCheckStatus": "verified",
    "coverImage": "/images/bitcoin-100k.jpg",
    "coverImageAlt": "Bitcoin atingindo 100k",
    "createdAt": "2025-11-18T10:00:00Z",
    "updatedAt": "2025-11-18T11:30:00Z",
    "publishedAt": "2025-11-18T12:00:00Z",
    "_links": {...}
  }
}
```

---

### POST /api/v2/articles

**Descrição**: Cria novo artigo

**Autenticação**: Obrigatória (ADMIN ou EDITOR)

**Request Body**:
```json
{
  "title": "Título do Artigo",
  "slug": "titulo-do-artigo", // opcional (gerado automaticamente)
  "excerpt": "Resumo...",
  "content": "## Seção 1\n\nConteúdo...",
  "type": "news", // ou "educational"
  "categoryId": "cat_1",
  "tagIds": ["tag_1", "tag_2"],
  "sentiment": "positive", // se type=news
  "level": "iniciante", // se type=educational
  "citations": [
    { "url": "https://example.com/source" }
  ],
  "relatedArticleIds": ["art_100", "art_101"],
  "coverImage": "/images/cover.jpg",
  "coverImageAlt": "Alt text",
  "status": "draft" // ou "published"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "art_125",
    "slug": "titulo-do-artigo",
    ...
  },
  "_links": {...}
}
```

**Validation Errors** (400):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      { "field": "title", "message": "Título é obrigatório" },
      { "field": "content", "message": "Conteúdo deve ter pelo menos 500 caracteres" }
    ]
  }
}
```

---

### PATCH /api/v2/articles/:id

**Descrição**: Atualiza artigo parcialmente

**Autenticação**: Obrigatória (ADMIN ou autor)

**Request Body** (campos opcionais):
```json
{
  "title": "Novo Título",
  "content": "Novo conteúdo...",
  "tagIds": ["tag_3", "tag_4"]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {...}
}
```

---

### DELETE /api/v2/articles/:id

**Descrição**: Remove artigo (soft delete)

**Autenticação**: Obrigatória (ADMIN apenas)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Artigo deletado com sucesso"
}
```

---

### POST /api/v2/articles/:id/publish

**Descrição**: Publica artigo (draft → published)

**Autenticação**: Obrigatória (ADMIN ou EDITOR)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "art_123",
    "status": "published",
    "publishedAt": "2025-11-18T12:00:00Z"
  }
}
```

---

### POST /api/v2/articles/:id/unpublish

**Descrição**: Despublica artigo (published → draft)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "art_123",
    "status": "draft",
    "publishedAt": null
  }
}
```

---

## 🚀 ENDPOINTS - BULK GENERATION

### POST /api/v2/bulk/search-topics

**Descrição**: Busca tópicos relevantes via Perplexity

**Autenticação**: Obrigatória (ADMIN ou EDITOR)

**Request Body**:
```json
{
  "type": "news", // ou "educational", "resource"
  "count": 5,
  "excludeExisting": true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "topics": [
      "Bitcoin atinge US$ 100 mil pela primeira vez",
      "Ethereum lança upgrade Dencun",
      "SEC aprova primeiro ETF de Bitcoin spot",
      "Binance enfrenta processo regulatório",
      "DeFi ultrapassa US$ 100 bilhões em TVL"
    ],
    "excluded": 2, // tópicos filtrados por já existirem
    "meta": {
      "searchTime": 1.5,
      "aiCost": 0.008
    }
  }
}
```

---

### POST /api/v2/bulk/generate

**Descrição**: Gera múltiplos artigos em lote

**Autenticação**: Obrigatória (ADMIN ou EDITOR)

**Rate Limit**: ADMIN (ilimitado), EDITOR (5/day)

**Request Body**:
```json
{
  "topics": [
    "Bitcoin atinge US$ 100 mil",
    "Ethereum lança upgrade Dencun"
  ],
  "type": "news",
  "autoPublish": false,
  "callbackUrl": "https://example.com/webhook" // opcional
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "batchId": "batch_abc123",
    "status": "processing",
    "totalTopics": 2,
    "estimatedTime": "2-4 minutos",
    "_links": {
      "status": "/api/v2/bulk/batch_abc123/status",
      "cancel": "/api/v2/bulk/batch_abc123/cancel"
    }
  }
}
```

---

### GET /api/v2/bulk/:batchId/status

**Descrição**: Verifica status de geração em lote

**Autenticação**: Obrigatória

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "batchId": "batch_abc123",
    "status": "processing", // pending, processing, completed, failed
    "progress": {
      "total": 2,
      "completed": 1,
      "failed": 0,
      "inProgress": 1
    },
    "articles": [
      {
        "topic": "Bitcoin atinge US$ 100 mil",
        "status": "success",
        "articleId": "art_125",
        "slug": "bitcoin-atinge-100k"
      },
      {
        "topic": "Ethereum lança upgrade Dencun",
        "status": "processing",
        "progress": 65
      }
    ],
    "startedAt": "2025-11-18T12:00:00Z",
    "estimatedCompletion": "2025-11-18T12:04:00Z"
  }
}
```

---

### POST /api/v2/bulk/:batchId/cancel

**Descrição**: Cancela geração em lote

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Geração cancelada com sucesso",
  "data": {
    "batchId": "batch_abc123",
    "status": "cancelled",
    "completedArticles": 1,
    "cancelledArticles": 1
  }
}
```

---

## 📦 ENDPOINTS - RESOURCES

### GET /api/v2/resources

Similaridade com `/articles`, mas para recursos.

### POST /api/v2/resources

Criação de recursos com validação específica.

---

## 🔔 WEBHOOKS

### Eventos Disponíveis

- `article.created`
- `article.updated`
- `article.published`
- `article.deleted`
- `bulk.completed`
- `bulk.failed`

### Payload de Webhook

```json
{
  "event": "article.published",
  "timestamp": "2025-11-18T12:00:00Z",
  "data": {
    "id": "art_123",
    "slug": "bitcoin-atinge-100k",
    "title": "Bitcoin Atinge US$ 100 mil",
    "publishedAt": "2025-11-18T12:00:00Z"
  }
}
```

### Assinatura HMAC

```http
X-Webhook-Signature: sha256=...
```

---

## 📚 EXEMPLOS DE USO

### cURL - Listar Artigos

```bash
curl -X GET "https://api.example.com/api/v2/articles?page=1&limit=10&filter[type]=news" \
  -H "Authorization: Bearer <token>"
```

### cURL - Criar Artigo

```bash
curl -X POST "https://api.example.com/api/v2/articles" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bitcoin Atinge US$ 100 mil",
    "excerpt": "Criptomoeda alcança marco histórico...",
    "content": "## Fato Central\n\nO Bitcoin...",
    "type": "news",
    "categoryId": "cat_1",
    "tagIds": ["tag_1", "tag_2"],
    "sentiment": "positive"
  }'
```

### JavaScript - Geração em Massa

```javascript
const response = await fetch('/api/v2/bulk/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    topics: ['Bitcoin atinge 100k', 'Ethereum upgrade'],
    type: 'news',
    autoPublish: false
  })
})

const { data } = await response.json()
console.log('Batch ID:', data.batchId)

// Poll status
const interval = setInterval(async () => {
  const statusRes = await fetch(`/api/v2/bulk/${data.batchId}/status`)
  const status = await statusRes.json()

  if (status.data.status === 'completed') {
    clearInterval(interval)
    console.log('Todos os artigos gerados!', status.data.articles)
  }
}, 2000)
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar routes `/api/v2/articles/*`
- [ ] Implementar validação Zod server-side
- [ ] Middleware de autenticação
- [ ] Middleware de rate limiting
- [ ] Error handling middleware
- [ ] Logging de todas as requisições
- [ ] Testes de integração para cada endpoint
- [ ] Documentação OpenAPI/Swagger
- [ ] Monitoramento de latência
- [ ] Cache headers apropriados

---

**Status**: 📝 AGUARDANDO APROVAÇÃO

**Última Atualização**: 2025-11-18 11:30 BRT
