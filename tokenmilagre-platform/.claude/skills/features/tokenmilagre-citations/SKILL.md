---
name: tokenmilagre-citations
description: "Citation management and fact-check sources. TRIGGERS: 'citações', 'citations', 'fact-check', 'factCheckSources', 'referências', 'fontes'. Use when extracting citations from Perplexity, validating sources, storing in factCheckSources field, displaying references to users."
license: MIT
---

# Token Milagre - Citations & Source Management

Comprehensive guide for managing citations from Perplexity AI and fact-check sources throughout the article lifecycle.

## Purpose

Ensure accurate, reliable citation management from AI-generated content to published articles, maintaining journalistic integrity and providing transparent source attribution.

**Supported Content Types:**
- ✅ **Notícias** (News) - `Article.factCheckSources`
- ✅ **Educação** (Educational) - `Article.factCheckSources`
- ✅ **Recursos** (Resources) - `Resource.sources`

## When to Use This Skill

Use this skill when:
- Processing Perplexity AI responses with citations
- Extracting and validating source URLs
- Storing citations in the `factCheckSources` (Articles) or `sources` (Resources) database fields
- Displaying citations in article/resource views (Notícias, Educação, Recursos)
- Debugging missing or duplicate citations
- Implementing citation-related features across all content types

## Citation Flow Overview

```
Perplexity API Response
         ↓
Extract citations array
         ↓
Validate URLs
         ↓
Deduplicate sources
         ↓
Store as JSON in factCheckSources
         ↓
Display in article view
```

## Perplexity Citation Format

### API Response Structure

```json
{
  "id": "...",
  "model": "sonar",
  "choices": [{
    "index": 0,
    "finish_reason": "stop",
    "message": {
      "role": "assistant",
      "content": "Bitcoin atingiu [1] novo recorde em [2] dezembro de 2024...",
      "citations": [
        "https://coindesk.com/price/bitcoin",
        "https://cointelegraph.com/news/bitcoin-hits-ath"
      ]
    }
  }],
  "usage": { "total_tokens": 1234 }
}
```

### Citation Number Mapping

- **In Content:** `[1]`, `[2]`, `[3]` → Zero-indexed array
- **Example:** `[1]` = `citations[0]`, `[2]` = `citations[1]`

## Extraction Process

### Basic Extraction

**File:** `/lib/citations-processor.tsx`

```typescript
export function extractCitations(response: PerplexityResponse): string[] {
  // Get citations array from response
  const citations = response.choices?.[0]?.message?.citations || [];

  if (citations.length === 0) {
    console.warn('No citations found in Perplexity response');
    return [];
  }

  return citations;
}
```

### URL Validation

**Critical validations:**

```typescript
function isValidCitationUrl(url: string): boolean {
  // 1. Must be HTTP/HTTPS
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }

  // 2. Maximum length
  if (url.length > 500) {
    console.warn(`Citation URL too long: ${url.length} chars`);
    return false;
  }

  // 3. No malicious patterns
  const suspicious = ['javascript:', 'data:', 'file:', 'vbscript:'];
  if (suspicious.some(pattern => url.toLowerCase().includes(pattern))) {
    console.error(`Suspicious URL pattern detected: ${url}`);
    return false;
  }

  // 4. Valid URL format
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

### Deduplication

```typescript
function deduplicateCitations(citations: string[]): string[] {
  // Use Set for dedup
  const unique = [...new Set(citations)];

  // Also check for URL variants (http vs https, www vs non-www)
  const normalized = unique.map(url => {
    try {
      const parsed = new URL(url);
      // Normalize to https and remove www
      parsed.protocol = 'https:';
      parsed.hostname = parsed.hostname.replace(/^www\./, '');
      return parsed.toString();
    } catch {
      return url;
    }
  });

  return [...new Set(normalized)];
}
```

## Storage in Database

### Fields Overview

**For Articles (News & Educational):**
```prisma
model Article {
  id               String   @id @default(uuid())
  title            String
  content          String   @db.Text
  type             String   @default("news") // 'news' | 'educational'
  // ... other fields ...
  factCheckSources String?  @db.Text // JSON array of citation URLs
  // ... more fields ...
}
```

**For Resources:**
```prisma
model Resource {
  id          String   @id @default(cuid())
  name        String
  // ... other fields ...
  sources     String?  // JSON array: URLs das fontes verificadas
  // ... more fields ...
}
```

### Storage Format

**Always store as JSON string:**

```typescript
const citations = [
  "https://coindesk.com/price/bitcoin",
  "https://cointelegraph.com/news/bitcoin-hits-ath",
  "https://bloomberg.com/crypto/market-analysis"
];

await prisma.article.create({
  data: {
    title: "Bitcoin Hits New ATH",
    content: "...",
    factCheckSources: JSON.stringify(citations), // ✅ JSON string
    // ... other fields
  }
});
```

### Retrieval and Parsing

```typescript
const article = await prisma.article.findUnique({
  where: { id: articleId }
});

const citations: string[] = article.factCheckSources
  ? JSON.parse(article.factCheckSources)
  : [];
```

## Display Patterns

### Universal SourcesSection Component

**Component:** `/lib/citations-processor.tsx` - **Used by all content types**

```tsx
import { SourcesSection } from '@/lib/citations-processor';

// In any page (News, Education, Resources):
<SourcesSection citations={citations} />
```

### In Article View (News & Educational)

**Components:**
- `/app/dashboard/noticias/[slug]/ArtigoClient.tsx` (News)
- `/app/educacao/[slug]/EducacaoClient.tsx` (Educational)

```tsx
function CitationsList({ sources }: { sources: string[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold mb-3">📚 Fontes e Referências</h3>
      <ol className="space-y-2">
        {sources.map((url, index) => (
          <li key={index} className="text-sm">
            <span className="text-yellow-500">[{index + 1}]</span>{' '}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {extractDomain(url)}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  } catch {
    return url;
  }
}
```

### In Article Card Preview

```tsx
function ArticleCard({ article }: { article: Article }) {
  const sourcesCount = article.factCheckSources
    ? JSON.parse(article.factCheckSources).length
    : 0;

  return (
    <div className="article-card">
      {/* ... article content ... */}
      {sourcesCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
          <span>{sourcesCount} fontes verificadas</span>
        </div>
      )}
    </div>
  );
}
```

## Citation Quality Metrics

### Calculate Citation Quality

```typescript
function calculateCitationQuality(citations: string[]): {
  score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 100;

  // No citations
  if (citations.length === 0) {
    issues.push('Nenhuma fonte citada');
    score = 0;
    return { score, issues };
  }

  // Too few citations
  if (citations.length < 3) {
    issues.push('Poucas fontes (mínimo recomendado: 3)');
    score -= 20;
  }

  // Check domain diversity
  const domains = citations.map(url => {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  });

  const uniqueDomains = new Set(domains);
  if (uniqueDomains.size < citations.length * 0.5) {
    issues.push('Baixa diversidade de fontes');
    score -= 15;
  }

  // Check for authoritative domains
  const authoritative = [
    'coindesk.com',
    'cointelegraph.com',
    'bloomberg.com',
    'reuters.com',
    'cnbc.com'
  ];

  const hasAuthoritativeSource = citations.some(url =>
    authoritative.some(domain => url.includes(domain))
  );

  if (!hasAuthoritativeSource) {
    issues.push('Nenhuma fonte de alta autoridade');
    score -= 10;
  }

  return { score: Math.max(0, score), issues };
}
```

## Common Issues & Solutions

### Issue 1: Citations Not Extracted

**Symptom:** `factCheckSources` is null even though Perplexity returned citations

**Causes:**
1. Citations array empty in response
2. Extraction logic not called
3. Error during JSON.stringify

**Solution:**
```typescript
// ✅ Always check and log
const citations = extractCitations(perplexityResponse);
console.log('Extracted citations:', citations.length);

if (citations.length === 0) {
  console.warn('No citations extracted from:', perplexityResponse);
}
```

### Issue 2: Duplicate Citations

**Symptom:** Same URL appears multiple times

**Solution:**
```typescript
// ✅ Use deduplication
const uniqueCitations = deduplicateCitations(rawCitations);
```

### Issue 3: Invalid URLs Stored

**Symptom:** Broken links in citations list

**Solution:**
```typescript
// ✅ Validate before storage
const validCitations = rawCitations.filter(isValidCitationUrl);

if (validCitations.length < rawCitations.length) {
  console.warn(
    `Filtered out ${rawCitations.length - validCitations.length} invalid URLs`
  );
}
```

### Issue 4: Citation Numbers Mismatch

**Symptom:** `[1]` in content doesn't match first citation

**Root Cause:** Citations array is zero-indexed

**Solution:**
```tsx
// ✅ Display with correct mapping
{citations.map((url, index) => (
  <li key={index}>
    <span>[{index + 1}]</span> {/* Display as 1-indexed */}
    <a href={url}>{url}</a>
  </li>
))}
```

## Using Bundled Resources

### Scripts

**`scripts/extract_citations.py`** - Extract and validate
```bash
python scripts/extract_citations.py perplexity_response.json
```

**`scripts/validate_sources.py`** - Check URL validity
```bash
python scripts/validate_sources.py citations.json
```

### References

```
Read references/citation-standards.md         # Standards and best practices
Read references/factCheckSources-schema.md    # Database schema details
Read references/citation-display-patterns.md  # Frontend patterns
```

## Best Practices

### Do's ✅
- Always validate URLs before storing
- Deduplicate citations
- Store as JSON string in factCheckSources
- Display citation count to users
- Log extraction failures
- Check Perplexity API response structure
- Handle missing citations gracefully

### Don'ts ❌
- Never store citations as plain text
- Don't skip URL validation
- Don't ignore extraction errors
- Don't hard-code citation numbers
- Don't modify citation URLs
- Never skip deduplication

## Integration Checklist

When implementing citation features:

- [ ] Extract citations from Perplexity response
- [ ] Validate all URLs
- [ ] Deduplicate citations
- [ ] Store as JSON in factCheckSources
- [ ] Parse JSON when retrieving
- [ ] Display citations in article view
- [ ] Show citation count in previews
- [ ] Handle missing citations gracefully
- [ ] Log extraction metrics
- [ ] Test with edge cases (0 citations, invalid URLs, etc.)

## Quick Reference

**Extract:**
```typescript
const citations = response.choices?.[0]?.message?.citations || [];
```

**Validate:**
```typescript
const valid = citations.filter(isValidCitationUrl);
```

**Deduplicate:**
```typescript
const unique = deduplicateCitations(valid);
```

**Store:**
```typescript
factCheckSources: JSON.stringify(unique)
```

**Retrieve:**
```typescript
const citations = JSON.parse(article.factCheckSources || '[]');
```

## Related Skills

- `tokenmilagre-article-workflow` - Overall article creation
- `tokenmilagre-api-integrations` - Perplexity API details
- `tokenmilagre-content-quality` - Quality standards

## Implementation Status

| Content Type | Database Field | Display Component | Status |
|--------------|----------------|-------------------|--------|
| **Notícias** (News) | `Article.factCheckSources` | `ArtigoClient.tsx` | ✅ Live |
| **Educação** (Educational) | `Article.factCheckSources` | `EducacaoClient.tsx` | ✅ Live |
| **Recursos** (Resources) | `Resource.sources` | `RecursoClient.tsx` | ✅ Live |

All three content types use the same **SourcesSection** component for consistent UX:
- Collapsible "📚 X fontes ▼" button
- Clickable source links
- Domain extraction
- Responsive design

---

**Last Updated:** 2025-11-13
**Version:** 1.1.0
