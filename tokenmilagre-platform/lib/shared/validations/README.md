# 🛡️ Sistema de Validação com Zod

Este diretório contém schemas de validação usando Zod para garantir integridade de dados em toda a aplicação.

## 📁 Arquivos

- **`article.ts`**: Schemas para validação de artigos e notícias
- **`validate.ts`**: Helpers para facilitar validação em API routes

## 🎯 Como Usar

### 1. Validação em API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createNewsSchema } from '@/lib/validations/article';
import { validateOrRespond } from '@/lib/validations/validate';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Valida os dados
  const validation = validateOrRespond(createNewsSchema, body);

  // Se retornou NextResponse, é porque falhou
  if (validation instanceof NextResponse) {
    return validation;
  }

  // Dados validados e type-safe!
  const { data } = validation;

  // Usar 'data' com segurança - TypeScript sabe os tipos
  const article = await prisma.article.create({
    data: {
      ...data,
      tags: JSON.stringify(data.tags),
      authorId: 'user-id',
    },
  });

  return NextResponse.json(article);
}
```

### 2. Validação de Query Parameters

```typescript
import { articleQuerySchema } from '@/lib/validations/article';
import { validateSearchParams } from '@/lib/validations/validate';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Valida query params
  const validation = validateSearchParams(searchParams, articleQuerySchema);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.message, details: validation.errors },
      { status: 400 }
    );
  }

  const { type, category, page, limit } = validation.data;

  // Buscar com parâmetros validados
  const articles = await prisma.article.findMany({
    where: {
      type: type === 'all' ? undefined : type,
      category,
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json(articles);
}
```

### 3. Validação em Server Actions

```typescript
'use server';

import { createArticleSchema } from '@/lib/validations/article';
import { validateData } from '@/lib/validations/validate';

export async function createArticle(formData: FormData) {
  const data = {
    slug: formData.get('slug'),
    title: formData.get('title'),
    // ... outros campos
  };

  const validation = validateData(createArticleSchema, data);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  // Criar artigo com dados validados
  const article = await prisma.article.create({
    data: validation.data,
  });

  return { success: true, article };
}
```

### 4. Validação em Scripts

```typescript
// scripts/publish-news.js
const { createNewsSchema } = require('../lib/validations/article');
const { validateData } = require('../lib/validations/validate');

async function publishNews() {
  const newsData = {
    slug: 'bitcoin-ultrapassa-100k',
    title: 'Bitcoin Ultrapassa $100k pela Primeira Vez',
    excerpt: 'Marco histórico...',
    content: 'Conteúdo completo...',
    category: 'bitcoin',
    sentiment: 'positive',
    tags: ['bitcoin', 'preço', 'marco-histórico'],
    type: 'news',
  };

  // Validar antes de inserir no banco
  const validation = validateData(createNewsSchema, newsData);

  if (!validation.success) {
    console.error('❌ Dados inválidos:');
    validation.errors.forEach((err) => {
      console.error(`  - ${err.field}: ${err.message}`);
    });
    process.exit(1);
  }

  console.log('✅ Dados válidos! Publicando...');
  // Inserir no banco...
}
```

## 📋 Schemas Disponíveis

### `createArticleSchema`
Validação geral para criar artigos (news ou educational)

### `updateArticleSchema`
Validação para atualizar artigos (campos parciais)

### `createNewsSchema`
Validação específica para notícias (requer `sentiment`)

### `createEducationalSchema`
Validação específica para artigos educacionais (requer `level`, `contentType`, `readTime`)

### `articleQuerySchema`
Validação de parâmetros de busca/filtro

## ✨ Benefícios

### 1. Type Safety
```typescript
// TypeScript sabe exatamente os tipos após validação
const validation = validateData(createNewsSchema, data);
if (validation.success) {
  validation.data.sentiment; // Type: 'positive' | 'neutral' | 'negative'
  validation.data.title; // Type: string
}
```

### 2. Erros Claros
```json
{
  "error": "Validação falhou",
  "details": [
    { "field": "title", "message": "Título deve ter pelo menos 10 caracteres" },
    { "field": "tags", "message": "Adicione pelo menos 3 tags" }
  ]
}
```

### 3. Previne Dados Corrompidos
- Slugs sempre no formato correto (`[a-z0-9-]+`)
- Categorias sempre válidas (enum)
- Tags sempre array com 3-10 itens
- Conteúdo sempre entre 100-50.000 caracteres

### 4. Autocomplete no Editor
TypeScript infere tipos automaticamente, dando autocomplete completo

## 🔧 Customização

### Adicionar Novo Campo

```typescript
// lib/validations/article.ts
export const createArticleSchema = z.object({
  // ... campos existentes ...
  featuredImage: z.string().url('URL da imagem inválida').optional(),
});
```

### Adicionar Nova Categoria

```typescript
category: z.enum([
  'bitcoin',
  'ethereum',
  'defi',
  'politica',
  'nfts',
  'altcoins',
  'blockchain',
  'trading',
  'seguranca',
  'desenvolvimento',
  'nova-categoria', // Adicionar aqui
]),
```

### Customizar Mensagens de Erro

```typescript
title: z
  .string()
  .min(10, 'Ei! O título precisa ter pelo menos 10 caracteres')
  .max(200, 'Ops! Título muito longo, máximo de 200 caracteres'),
```

## 📊 Exemplos de Validação

### ✅ Dados Válidos
```json
{
  "slug": "bitcoin-100k",
  "title": "Bitcoin Atinge $100k",
  "excerpt": "Marco histórico para a criptomoeda mais valiosa do mundo.",
  "content": "Lorem ipsum... (100+ caracteres)",
  "category": "bitcoin",
  "sentiment": "positive",
  "tags": ["bitcoin", "preço", "marco"],
  "type": "news"
}
```

### ❌ Dados Inválidos
```json
{
  "slug": "Bitcoin_100K",  // ❌ Contém maiúsculas e underscore
  "title": "Curto",        // ❌ Menos de 10 caracteres
  "excerpt": "X",          // ❌ Menos de 20 caracteres
  "content": "Pequeno",    // ❌ Menos de 100 caracteres
  "category": "crypto",    // ❌ Categoria não existe
  "sentiment": "great",    // ❌ Deve ser positive/neutral/negative
  "tags": ["btc"],         // ❌ Menos de 3 tags
  "type": "blog"           // ❌ Deve ser news ou educational
}
```

## 🎯 Próximos Passos

1. Aplicar validação em **todas as API routes**
2. Adicionar validação em **Server Actions**
3. Usar em **scripts de publicação**
4. Criar schemas para **usuários** e **comentários** (futuro)

---

**Criado por**: Claude Code
**Data**: 2025-10-23
**Versão**: 1.0
