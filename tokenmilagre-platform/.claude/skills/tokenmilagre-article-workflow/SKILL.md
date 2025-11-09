---
name: tokenmilagre-article-workflow
description: This skill should be used when working with article creation, editing, and publishing workflows in Token Milagre Platform. Use this skill for Perplexity AI integration, Gemini refinement, citation management, content processing, and the criar-artigo component.
license: MIT
---

# Token Milagre - Article Workflow Management

Comprehensive guide for managing article creation, processing, and publishing workflows with AI integrations.

## Purpose

Streamline and standardize the complex article creation workflow that integrates multiple AI services (Perplexity, Gemini), processes citations, validates content, and manages the complete publication pipeline.

## When to Use This Skill

Use this skill when:
- Creating new articles through the `/dashboard/criar-artigo` interface
- Integrating Perplexity AI for research and content generation
- Using Gemini for article refinement and cover image generation
- Processing and validating AI-generated content
- Managing citations and fact-check sources
- Debugging issues in the article creation workflow
- Optimizing or refactoring the criar-artigo component

## Article Workflow Overview

### Complete Flow Diagram

```
User Input (Type + Prompt)
         ↓
Perplexity AI API (sonar/sonar-pro)
         ↓
Stream Response → Parse JSON
         ↓
Article Processor (Client-side)
         ↓
Content Validator
         ↓
[Optional] Gemini Refinement
         ↓
[Optional] AI Cover Generation
         ↓
Citation Extraction
         ↓
Manual Editing (ReactMarkdown Preview)
         ↓
Validation & Publish
```

### Key Components

1. **Type Selection** → 3 types: news | educational | resource
2. **AI Generation** → Perplexity with structured prompts
3. **Processing** → Client-side JSON parsing and validation
4. **Refinement** → Optional Gemini improvement
5. **Citations** → Perplexity sources → factCheckSources field
6. **Cover Image** → AI generation or manual upload
7. **Publication** → Database storage with metadata

## Perplexity Integration Patterns

### Prompt Engineering

**News Article Prompt Structure:**
```javascript
const newsPrompt = `Crie um artigo de notícia sobre ${topic} em português brasileiro.

ESTRUTURA OBRIGATÓRIA:
- Título chamativo (máx 100 chars)
- Slug (kebab-case)
- Resumo (150-200 chars)
- 5-6 seções H2 com conteúdo jornalístico
- Sentimento: positive/neutral/negative
- 5-8 tags relevantes
- Categoria: ${category}

FORMATO JSON:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "# Título\n\n## Seção 1\n...",
  "category": "bitcoin",
  "tags": ["tag1", "tag2"],
  "sentiment": "positive"
}

IMPORTANTE:
- Use sources recentes (últimas 24h)
- Inclua dados de mercado reais
- Estilo jornalístico objetivo
- Citations entre [1], [2], etc.`;
```

**Educational Article Prompt:**
```javascript
const educationalPrompt = `Crie um artigo educacional sobre ${topic}.

ESTRUTURA:
- Título didático
- Nível: iniciante/intermediario/avancado
- Resumo educativo
- Conteúdo progressivo com H2
- Read time estimado
- 5-8 tags
- Categoria: ${category}

FORMATO JSON:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "...",
  "category": "blockchain",
  "level": "iniciante",
  "readTime": "8 min",
  "tags": [...]
}`;
```

### API Configuration

**File:** `/lib/perplexity-client.ts`

```typescript
const config = {
  model: isPro ? 'sonar-pro' : 'sonar',
  temperature: 0.7,
  max_tokens: streaming ? 4000 : 2000,
  search_recency_filter: 'day', // Para news
  return_citations: true,
  stream: streaming
};
```

**Cost Tracking:**
- sonar: ~$5/1M tokens
- sonar-pro: ~$30/1M tokens
- Always prefer 'sonar' unless high accuracy needed

## Content Processing Pipeline

### Client-Side Processing

**File:** `/lib/article-processor-client.ts`

**Key Functions:**

```typescript
// 1. Parse AI response
function extractJsonFromResponse(content: string): ProcessedArticle {
  // Remove markdown code blocks
  const cleaned = content.replace(/```json\n?/g, '').replace(/```/g, '');

  // Find JSON block
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found');

  return JSON.parse(jsonMatch[0]);
}

// 2. Validate structure
function validateProcessedArticle(article: ProcessedArticle): boolean {
  if (!article.title || article.title.length > 200) return false;
  if (!article.slug || !/^[a-z0-9-]+$/.test(article.slug)) return false;
  if (!article.content || article.content.length < 500) return false;
  if (!article.category) return false;

  return true;
}

// 3. Clean content
function cleanContent(content: string): string {
  return content
    .replace(/\[\d+\]/g, '') // Remove citation numbers
    .replace(/[ \t]{2,}/g, ' ') // Collapse spaces (preserve \n!)
    .trim();
}
```

### Content Validation

**File:** `/lib/content-validator.ts`

**Validation Rules:**

| Field | Validation | Error Message |
|-------|------------|---------------|
| title | 10-200 chars | "Título muito curto/longo" |
| slug | kebab-case, unique | "Slug inválido ou duplicado" |
| excerpt | 100-300 chars | "Resumo deve ter 100-300 caracteres" |
| content | >500 chars | "Conteúdo muito curto" |
| tags | 3-8 tags | "Artigo deve ter entre 3-8 tags" |
| category | Valid category | "Categoria inválida" |

## Gemini Refinement

### When to Use Refinement

Use Gemini refinement for:
- ✅ Improving clarity and readability
- ✅ Fixing grammatical errors
- ✅ Enhancing SEO optimization
- ✅ Adding missing sections
- ❌ Not for fact-checking (use Perplexity sources)
- ❌ Not for complete rewrites

### Refinement API

**File:** `/app/api/process-gemini/route.ts`

```typescript
const refinementPrompt = `Melhore este artigo mantendo o conteúdo original:

ARTIGO ATUAL:
${article.content}

MELHORIAS SOLICITADAS:
${userInstruction}

REGRAS:
- Mantenha a estrutura H2
- Preserve citations [1], [2]
- Melhore clareza e SEO
- Retorne JSON completo
`;
```

## Citation Management

### Perplexity Citation Format

**Response Structure:**
```json
{
  "choices": [{
    "message": {
      "content": "Artigo com [1] citações [2]",
      "citations": [
        "https://source1.com",
        "https://source2.com"
      ]
    }
  }]
}
```

### Extraction Process

**Script:** `scripts/extract_citations.py`

```python
def extract_citations(response: dict) -> list[str]:
    """Extract citations from Perplexity response."""
    citations = response.get('citations', [])

    # Validate URLs
    valid_citations = []
    for url in citations:
        if url.startswith('http') and len(url) < 500:
            valid_citations.append(url)

    return valid_citations
```

### Storage in Database

**Field:** `factCheckSources` (String, JSON array)

```typescript
const article = await prisma.article.create({
  data: {
    // ... other fields
    factCheckSources: JSON.stringify(citations), // Array of URLs
  }
});
```

## Cover Image Generation

### AI Cover Generation

**API:** Gemini 2.0 Flash Image Generation

```typescript
const imagePrompt = `Create a professional cover image for crypto article:
Topic: ${article.title}
Category: ${article.category}
Style: Modern, clean, professional
Colors: Blue/gold gradient
Include: Crypto symbols relevant to ${article.category}`;

const response = await fetch('/api/generate-cover-image', {
  method: 'POST',
  body: JSON.stringify({ prompt: imagePrompt })
});
```

**Important:** Check quota limits (see `/docs-local/PROBLEMA-QUOTA-GEMINI-IMAGE.md`)

### Fallback Strategy

1. Try AI generation first
2. If quota exceeded → Use placeholder
3. Allow manual upload
4. Suggest free stock images (Unsplash API)

## Criar-Artigo Component Architecture

### Current Structure (Needs Refactoring)

**File:** `/app/dashboard/criar-artigo/page.tsx` (1,387 lines)

**Major Sections:**
- Lines 1-73: Imports, types, helpers
- Lines 74-400: Main component with 15+ useState hooks
- Lines 400-800: Event handlers
- Lines 800-1200: ReactMarkdown components
- Lines 1200-1387: JSX render

### Refactoring Strategy

**Goal:** Break into modular components (~400 lines main file)

**Recommended Structure:**
```
criar-artigo/
├── page.tsx (main entry, ~400 lines)
├── _components/
│   ├── types.ts (shared types)
│   ├── TypeSelector.tsx (✅ already created)
│   ├── ChatInterface.tsx (conversation UI)
│   ├── ArticlePreviewPanel.tsx (preview + edit)
│   ├── RefinementPanel.tsx (Gemini refinement)
│   ├── CoverImageGenerator.tsx (image gen)
│   └── MarkdownRenderer.tsx (markdown components)
├── _hooks/
│   ├── usePerplexityChat.ts (Perplexity integration)
│   ├── useArticleProcessor.ts (processing logic)
│   ├── useChatScroll.ts (auto-scroll logic)
│   └── useArticlePublish.ts (publish workflow)
└── _lib/
    ├── prompts.ts (AI prompts)
    └── validators.ts (validation functions)
```

## Common Issues & Solutions

### Issue 1: Citation Numbers Lost

**Problem:** `[1], [2]` removed during processing

**Solution:** Preserve in `cleanContent()`:
```typescript
// ❌ Wrong
content.replace(/\[\d+\]/g, '')

// ✅ Correct (when needed)
// Store raw content WITH citations
// Clean only for display, not storage
```

### Issue 2: JSON Parsing Failures

**Problem:** Perplexity returns incomplete JSON

**Solution:**
```typescript
try {
  const article = JSON.parse(jsonString);
} catch (e) {
  // Fallback: Extract fields manually
  const title = extractField(content, 'title');
  const slug = extractField(content, 'slug');
  // Build article object manually
}
```

### Issue 3: Streaming Response Truncated

**Problem:** Stream cuts off mid-content

**Solution:**
- Increase `max_tokens` from 2000 → 4000
- Handle incomplete responses gracefully
- Show partial content with "Continue generating..." button

### Issue 4: Memory Leak (MutationObserver)

**Problem:** Observer not cleaned up

**Solution:**
```typescript
useEffect(() => {
  let observer: MutationObserver | null = null;

  if (loading && container) {
    observer = new MutationObserver(scrollToBottom);
    observer.observe(container, { /* config */ });
  }

  // ✅ Cleanup!
  return () => {
    if (observer) observer.disconnect();
  };
}, [loading]); // Optimize dependencies
```

## Using Bundled Resources

### Scripts

**`validate_article_structure.py`** - Validate AI-generated JSON
```bash
python scripts/validate_article_structure.py article.json
```

**`extract_citations.py`** - Extract and validate citations
```bash
python scripts/extract_citations.py perplexity_response.json
```

### References

**Load as needed:**
```
Read references/perplexity-patterns.md    # Prompt patterns
Read references/content-types-specs.md    # Type specifications
Read references/citation-standards.md     # Citation handling
```

## Best Practices

### Prompt Engineering
- ✅ Always specify output format (JSON)
- ✅ Include structure requirements
- ✅ Provide examples when possible
- ✅ Use `search_recency_filter` for news
- ❌ Don't exceed 4000 tokens in prompts

### Error Handling
- ✅ Always validate AI responses before using
- ✅ Provide fallbacks for API failures
- ✅ Log errors for debugging
- ✅ Show user-friendly error messages
- ❌ Never save invalid data to database

### Performance
- ✅ Use streaming for better UX
- ✅ Debounce user inputs
- ✅ Optimize re-renders with useMemo
- ✅ Clean up subscriptions/observers
- ❌ Don't block UI during processing

### Citations
- ✅ Always preserve Perplexity citations
- ✅ Validate URLs before storage
- ✅ Display sources to users
- ✅ Track citation quality
- ❌ Never modify citation URLs

## Quick Reference

**Perplexity Client:**
```typescript
import { PerplexityClient } from '@/lib/perplexity-client';

const client = new PerplexityClient();
const response = await client.chat({
  messages: [{ role: 'user', content: prompt }],
  model: 'sonar',
  stream: true
});
```

**Article Processor:**
```typescript
import { processArticleLocally } from '@/lib/article-processor-client';

const article = processArticleLocally(aiResponse);
```

**Validator:**
```typescript
import { validateProcessedArticle } from '@/lib/article-processor-client';

if (!validateProcessedArticle(article)) {
  throw new Error('Invalid article structure');
}
```

## Related Skills

- `tokenmilagre-citations` - Deep dive into citation management
- `tokenmilagre-api-integrations` - Perplexity/Gemini integration details
- `tokenmilagre-component-patterns` - Refactoring criar-artigo
- `tokenmilagre-content-quality` - Content standards and SEO

---

**Last Updated:** 2025-01-09
**Maintained By:** Claude AI Sessions
**Version:** 1.0.0
