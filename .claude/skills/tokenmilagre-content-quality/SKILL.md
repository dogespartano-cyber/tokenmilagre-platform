---
name: tokenmilagre-content-quality
description: This skill provides guidelines for maintaining high-quality content standards including SEO optimization, editorial quality checks, fact-checking workflows, readability metrics, and content validation. Use when creating or reviewing articles to ensure professional quality.
license: MIT
---

# Token Milagre - Content Quality & SEO Guide

Complete guide for ensuring high-quality, SEO-optimized content in the Token Milagre Platform.

## Purpose

Establish and maintain professional content standards across all articles, ensuring optimal search engine visibility, user engagement, and editorial credibility.

## When to Use This Skill

Use this skill when:
- Creating new articles
- Reviewing/editing existing content
- Implementing SEO optimizations
- Setting up fact-checking workflows
- Validating content quality before publication
- Analyzing content performance
- Training content creators

## Content Quality Pillars

### 1. Editorial Quality

**Writing Standards:**
- Clear, concise, professional tone
- Proper grammar and spelling
- Logical structure with clear flow
- Accurate information with sources
- Appropriate technical level for audience

**Structure Requirements:**
- Compelling headline (50-60 characters ideal)
- Engaging introduction (100-150 words)
- Clear section headings (H2, H3)
- Scannable paragraphs (3-4 sentences max)
- Strong conclusion with call-to-action

### 2. Fact-Checking

**Verification Process:**
1. All claims must have citations
2. Sources must be authoritative and recent
3. Cross-reference critical information
4. Verify numerical data and statistics
5. Check dates and timelines

**Citation Quality:**
- Primary sources preferred
- Published within last 12 months (news)
- From recognized authorities
- Accessible URLs (not paywalled when possible)
- Diverse source mix

### 3. SEO Optimization

**On-Page SEO:**
- Target keyword in title
- Keyword in first paragraph
- Natural keyword density (1-2%)
- Meta description (150-160 characters)
- URL slug optimization
- Image alt text
- Internal linking

**Technical SEO:**
- Mobile-responsive
- Fast page load (<3 seconds)
- Structured data (Schema.org)
- Canonical URLs
- Proper heading hierarchy

### 4. Readability

**Target Metrics:**
- Flesch Reading Ease: 60-70 (8th-9th grade)
- Average sentence length: 15-20 words
- Paragraph length: 3-5 sentences
- Use of subheadings every 300 words
- Active voice preferred

## Implementation Patterns

### Pattern 1: Article Quality Checklist

```typescript
interface QualityChecklist {
  editorial: {
    hasCompellingHeadline: boolean;
    hasStrongIntro: boolean;
    hasProperStructure: boolean;
    hasClearConclusion: boolean;
    grammarChecked: boolean;
  };
  factChecking: {
    hasCitations: boolean;
    sourcesVerified: boolean;
    dataCrossReferenced: boolean;
    recentSources: boolean;
  };
  seo: {
    hasTargetKeyword: boolean;
    hasMetaDescription: boolean;
    hasOptimizedSlug: boolean;
    hasImageAltText: boolean;
    hasInternalLinks: boolean;
  };
  readability: {
    readingEaseScore: number; // 0-100
    avgSentenceLength: number;
    avgParagraphLength: number;
    technicalLevel: 'iniciante' | 'intermediario' | 'avancado';
  };
}

async function checkArticleQuality(articleId: string): Promise<QualityChecklist> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { author: true }
  });

  if (!article) throw new Error('Article not found');

  return {
    editorial: checkEditorialQuality(article),
    factChecking: checkFactCheckQuality(article),
    seo: checkSEOQuality(article),
    readability: calculateReadability(article.content)
  };
}
```

### Pattern 2: SEO Metadata Generator

```typescript
interface SEOMetadata {
  title: string;           // 50-60 chars
  metaDescription: string; // 150-160 chars
  keywords: string[];      // 5-10 keywords
  slug: string;            // URL-friendly
  ogImage?: string;        // Open Graph image
  canonicalUrl: string;
}

function generateSEOMetadata(article: {
  title: string;
  content: string;
  category: string;
  tags?: string;
}): SEOMetadata {
  // Title optimization
  const title = optimizeTitle(article.title);

  // Extract key points for description
  const keyPoints = extractKeyPoints(article.content);
  const metaDescription = generateMetaDescription(keyPoints);

  // Extract keywords
  const keywords = extractKeywords(article.content, article.category);

  // Generate slug
  const slug = generateSlug(article.title);

  // Build canonical URL
  const canonicalUrl = `https://tokenmilagre.com/${article.category}/${slug}`;

  return {
    title,
    metaDescription,
    keywords,
    slug,
    canonicalUrl
  };
}

function optimizeTitle(rawTitle: string): string {
  // Remove extra whitespace
  let title = rawTitle.trim().replace(/\s+/g, ' ');

  // Add power words if missing
  const powerWords = ['Guia', 'Como', 'Melhor', 'Completo', 'Definitivo'];
  const hasPowerWord = powerWords.some(word =>
    title.toLowerCase().includes(word.toLowerCase())
  );

  // Ensure optimal length (50-60 chars)
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }

  // Add year for freshness (if applicable)
  const currentYear = new Date().getFullYear();
  if (!title.includes(String(currentYear)) && title.length < 55) {
    title = `${title} ${currentYear}`;
  }

  return title;
}

function generateMetaDescription(keyPoints: string[]): string {
  // Combine top 2-3 key points
  let description = keyPoints.slice(0, 3).join('. ') + '.';

  // Ensure optimal length
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  } else if (description.length < 120) {
    description += ' Leia mais no Token Milagre.';
  }

  // Add call-to-action
  if (!description.toLowerCase().includes('leia')) {
    description += ' Clique para saber mais.';
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }
  }

  return description;
}

function extractKeywords(content: string, category: string): string[] {
  const keywords: string[] = [category]; // Start with category

  // Common crypto keywords by category
  const categoryKeywords: Record<string, string[]> = {
    bitcoin: ['BTC', 'blockchain', 'mineração', 'halving'],
    ethereum: ['ETH', 'smart contracts', 'DeFi', 'gas fees'],
    defi: ['finanças descentralizadas', 'yield farming', 'staking', 'liquidity'],
    nft: ['tokens não fungíveis', 'arte digital', 'colecionáveis'],
    altcoins: ['criptomoedas alternativas', 'tokens', 'projetos']
  };

  const categoryKeys = categoryKeywords[category] || [];
  keywords.push(...categoryKeys.slice(0, 3));

  // Extract from content (top mentioned terms)
  const contentKeywords = extractTopTerms(content, 5);
  keywords.push(...contentKeywords);

  // Remove duplicates and limit to 10
  return [...new Set(keywords)].slice(0, 10);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD') // Decompose accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
```

### Pattern 3: Readability Analyzer

```typescript
interface ReadabilityMetrics {
  fleschReadingEase: number;    // 0-100 (higher = easier)
  fleschKincaidGrade: number;   // US grade level
  avgSentenceLength: number;
  avgWordLength: number;
  complexWordCount: number;
  sentenceCount: number;
  wordCount: number;
  paragraphCount: number;
  estimatedReadTime: string;    // "5 min"
}

function calculateReadability(content: string): ReadabilityMetrics {
  // Clean content (remove Markdown, HTML)
  const cleanText = cleanContent(content);

  // Count basic elements
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);

  const sentenceCount = sentences.length;
  const wordCount = words.length;
  const paragraphCount = paragraphs.length;

  // Calculate syllables (approximation for Portuguese)
  const syllableCount = words.reduce((sum, word) =>
    sum + countSyllables(word), 0
  );

  // Flesch Reading Ease (adapted for Portuguese)
  const fleschReadingEase = 206.835
    - (1.015 * (wordCount / sentenceCount))
    - (84.6 * (syllableCount / wordCount));

  // Flesch-Kincaid Grade Level
  const fleschKincaidGrade =
    (0.39 * (wordCount / sentenceCount))
    + (11.8 * (syllableCount / wordCount))
    - 15.59;

  // Average metrics
  const avgSentenceLength = wordCount / sentenceCount;
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / wordCount;

  // Complex words (>3 syllables)
  const complexWordCount = words.filter(w => countSyllables(w) > 3).length;

  // Estimated read time (200 words/min average)
  const readMinutes = Math.ceil(wordCount / 200);
  const estimatedReadTime = `${readMinutes} min`;

  return {
    fleschReadingEase: Math.round(fleschReadingEase),
    fleschKincaidGrade: Math.round(fleschKincaidGrade),
    avgSentenceLength: Math.round(avgSentenceLength),
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    complexWordCount,
    sentenceCount,
    wordCount,
    paragraphCount,
    estimatedReadTime
  };
}

function countSyllables(word: string): number {
  // Simplified syllable counting for Portuguese
  const vowels = 'aeiouáéíóúâêôãõ';
  let count = 0;
  let lastWasVowel = false;

  for (const char of word.toLowerCase()) {
    const isVowel = vowels.includes(char);
    if (isVowel && !lastWasVowel) {
      count++;
    }
    lastWasVowel = isVowel;
  }

  return Math.max(1, count); // Minimum 1 syllable
}

function cleanContent(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to text
    .replace(/#+ /g, '') // Remove headings
    .replace(/[*_~]/g, '') // Remove formatting
    .replace(/\n+/g, ' ') // Replace newlines
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}
```

### Pattern 4: Fact-Check Score Calculator

```typescript
interface FactCheckScore {
  score: number;          // 0-100
  citationCount: number;
  qualitySources: number; // Authoritative sources
  recentSources: number;  // Within 12 months
  diverseSources: number; // Different domains
  status: 'verified' | 'partial' | 'unverified';
  issues: string[];
}

function calculateFactCheckScore(article: {
  content: string;
  factCheckSources?: string;
}): FactCheckScore {
  const citations = article.factCheckSources
    ? JSON.parse(article.factCheckSources)
    : [];

  const citationCount = citations.length;

  // Check source quality
  const qualityDomains = [
    'coindesk.com',
    'cointelegraph.com',
    'decrypt.co',
    'theblock.co',
    'bloomberg.com',
    'reuters.com',
    'bitcoin.org',
    'ethereum.org'
  ];

  const qualitySources = citations.filter((c: any) =>
    qualityDomains.some(domain => c.url?.includes(domain))
  ).length;

  // Check recency (within 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const recentSources = citations.filter((c: any) => {
    const date = c.publishedDate ? new Date(c.publishedDate) : null;
    return date && date > twelveMonthsAgo;
  }).length;

  // Check diversity (unique domains)
  const domains = citations.map((c: any) => {
    try {
      return new URL(c.url).hostname;
    } catch {
      return null;
    }
  }).filter(Boolean);

  const diverseSources = new Set(domains).size;

  // Calculate score
  let score = 0;
  const issues: string[] = [];

  // Citation count (0-40 points)
  if (citationCount >= 5) {
    score += 40;
  } else if (citationCount >= 3) {
    score += 30;
  } else if (citationCount >= 1) {
    score += 20;
  } else {
    issues.push('Sem citações');
  }

  // Quality sources (0-30 points)
  const qualityRatio = qualitySources / Math.max(citationCount, 1);
  score += Math.round(qualityRatio * 30);

  if (qualityRatio < 0.3) {
    issues.push('Poucas fontes de qualidade');
  }

  // Recent sources (0-20 points)
  const recencyRatio = recentSources / Math.max(citationCount, 1);
  score += Math.round(recencyRatio * 20);

  if (recencyRatio < 0.5) {
    issues.push('Fontes desatualizadas');
  }

  // Source diversity (0-10 points)
  if (diverseSources >= 3) {
    score += 10;
  } else if (diverseSources >= 2) {
    score += 5;
  } else {
    issues.push('Falta diversidade de fontes');
  }

  // Determine status
  let status: 'verified' | 'partial' | 'unverified';
  if (score >= 80) {
    status = 'verified';
  } else if (score >= 50) {
    status = 'partial';
  } else {
    status = 'unverified';
  }

  return {
    score,
    citationCount,
    qualitySources,
    recentSources,
    diverseSources,
    status,
    issues
  };
}
```

### Pattern 5: Content Validation

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateArticleBeforePublish(article: {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string;
  coverImage?: string;
  factCheckSources?: string;
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!article.title || article.title.length < 10) {
    errors.push('Título muito curto (mínimo 10 caracteres)');
  }

  if (!article.content || article.content.length < 300) {
    errors.push('Conteúdo muito curto (mínimo 300 caracteres)');
  }

  if (!article.category) {
    errors.push('Categoria obrigatória');
  }

  // Title length
  if (article.title.length > 100) {
    warnings.push('Título muito longo (recomendado: 50-60 caracteres)');
  }

  // Excerpt
  if (!article.excerpt || article.excerpt.length < 100) {
    warnings.push('Resumo muito curto (recomendado: 100-150 palavras)');
  }

  // Content length
  const wordCount = article.content.split(/\s+/).length;
  if (wordCount < 500) {
    warnings.push('Artigo curto (recomendado: 500+ palavras)');
  }

  // Tags
  if (!article.tags || JSON.parse(article.tags || '[]').length < 3) {
    warnings.push('Adicione pelo menos 3 tags para melhor SEO');
  }

  // Cover image
  if (!article.coverImage) {
    warnings.push('Adicione uma imagem de capa');
  }

  // Citations
  const citations = article.factCheckSources
    ? JSON.parse(article.factCheckSources)
    : [];

  if (citations.length === 0) {
    errors.push('Artigos devem ter pelo menos 1 citação');
  } else if (citations.length < 3) {
    warnings.push('Recomendado: 3+ citações');
  }

  // Readability check
  const readability = calculateReadability(article.content);
  if (readability.fleschReadingEase < 30) {
    warnings.push('Texto muito difícil - simplifique para melhor leitura');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
```

## Editorial Workflow

### Pre-Publication Checklist

```typescript
interface PublicationChecklist {
  stage: 'draft' | 'review' | 'approved' | 'published';
  checks: {
    contentComplete: boolean;
    factsVerified: boolean;
    seoOptimized: boolean;
    readabilityGood: boolean;
    imagesAdded: boolean;
    linksWorking: boolean;
    grammarChecked: boolean;
  };
  approvedBy?: string;
  approvedAt?: Date;
}

async function performPrePublicationReview(articleId: string): Promise<PublicationChecklist> {
  const article = await prisma.article.findUnique({
    where: { id: articleId }
  });

  if (!article) throw new Error('Article not found');

  // Run all checks
  const validation = validateArticleBeforePublish(article);
  const readability = calculateReadability(article.content);
  const factCheck = calculateFactCheckScore(article);
  const seoCheck = generateSEOMetadata(article);

  return {
    stage: 'review',
    checks: {
      contentComplete: article.content.length >= 500,
      factsVerified: factCheck.score >= 70,
      seoOptimized: !!seoCheck.metaDescription && seoCheck.keywords.length >= 5,
      readabilityGood: readability.fleschReadingEase >= 50,
      imagesAdded: !!article.coverImage,
      linksWorking: true, // Would need to check URLs
      grammarChecked: validation.errors.length === 0
    }
  };
}
```

## SEO Best Practices

### On-Page Optimization

```markdown
✅ **Title Tag:**
- 50-60 characters
- Include main keyword
- Add power words
- Include year if relevant

✅ **Meta Description:**
- 150-160 characters
- Compelling summary
- Include call-to-action
- Natural keyword usage

✅ **URL Structure:**
- Keep short (3-5 words)
- Use hyphens (not underscores)
- Include target keyword
- Lowercase only
- No special characters

✅ **Heading Structure:**
- One H1 (title)
- Multiple H2s (sections)
- H3s for subsections
- Logical hierarchy
- Include keywords naturally

✅ **Content:**
- Keyword in first 100 words
- Keyword density 1-2%
- Use LSI keywords
- Long-form (>1000 words)
- Break up with subheadings
- Use bullet points/lists
- Include images with alt text

✅ **Internal Linking:**
- Link to related articles
- Use descriptive anchor text
- 2-5 internal links per article
- Link to category pages

✅ **External Linking:**
- Link to authoritative sources
- Open in new tab
- Use nofollow for untrusted sources
```

### Schema Markup

```typescript
interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'NewsArticle' | 'TechArticle';
  headline: string;
  description: string;
  image: string[];
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
}

function generateArticleSchema(article: any): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': article.type === 'news' ? 'NewsArticle' : 'TechArticle',
    headline: article.title,
    description: article.excerpt || '',
    image: article.coverImage ? [article.coverImage] : [],
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name || 'Token Milagre'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Token Milagre',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tokenmilagre.com/logo.png'
      }
    }
  };
}
```

## Quality Metrics

### Target Scores

| Metric | Minimum | Target | Excellent |
|--------|---------|--------|-----------|
| Fact-check score | 50 | 70 | 90+ |
| Flesch Reading Ease | 40 | 60 | 70+ |
| Word count | 300 | 800 | 1500+ |
| Citation count | 1 | 3 | 5+ |
| Keyword density | 0.5% | 1.5% | 2% |
| Internal links | 1 | 3 | 5+ |
| Time to read | 2 min | 4 min | 7+ min |

## Related Skills

- `tokenmilagre-article-workflow` - Content creation process
- `tokenmilagre-citations` - Source verification
- `tokenmilagre-api-integrations` - SEO tools integration

---

**Last Updated:** 2025-01-09
**Version:** 1.0.0
