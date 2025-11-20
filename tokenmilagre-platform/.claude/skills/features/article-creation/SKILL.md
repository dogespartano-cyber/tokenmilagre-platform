---
name: article-creation
description: Use this skill when creating, editing, or publishing news articles or educational content. Contains templates, rules, checklists, script examples, and content guidelines.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# Article Creation Skill

This skill provides all necessary information for creating news articles and educational content in the Token Milagre Platform.

---

## 📝 Criação de Artigos Educacionais

### Artigos Existentes

**Total**: 6 artigos completos

1. Introdução ao Blockchain (ID: 1, Iniciante, 15 min)
2. Como Criar uma Wallet Segura (ID: 2, Iniciante, 12 min)
3. Trading Básico de Criptomoedas (ID: 3, Intermediário, 20 min)
4. DeFi: Finanças Descentralizadas (ID: 4, Intermediário, 25 min)
5. Desenvolvendo Smart Contracts em Solana com Rust e Anchor (ID: 5, Avançado, 35 min)
6. NFTs no Ecossistema Solana (ID: 6, Intermediário, 18 min)

### Estrutura do Artigo

```typescript
{
  id: 'número_sequencial',
  slug: 'titulo-do-artigo-em-kebab-case',
  title: 'Título Completo do Artigo',
  description: 'Breve descrição do conteúdo (1-2 frases)',
  category: 'blockchain' | 'trading' | 'defi' | 'nfts' | 'seguranca' | 'desenvolvimento',
  level: 'iniciante' | 'intermediario' | 'avancado',
  type: 'Artigo' | 'Tutorial',
  readTime: 'X min',
  tags: ['tag1', 'tag2', 'tag3'],
  author: 'Comunidade $MILAGRE',
  publishedAt: 'YYYY-MM-DD',
  content: `conteúdo em markdown`
}
```

### ⚠️ REGRAS IMPORTANTES - Conteúdo

**Aplicam-se a TODOS os tipos de conteúdo (artigos educacionais E notícias):**

1. **NUNCA incluir título H1 no conteúdo**
   - ❌ ERRADO: `# Título do Artigo\n\nTexto...`
   - ✅ CORRETO: `Texto introdutório direto...\n\n## Primeira Seção`
   - O título já aparece automaticamente no header da página

2. **NUNCA incluir seção de fontes/referências**
   - ❌ ERRADO: Incluir `[1](url)`, `**Fontes:**\n- [Nome](url)` no final
   - ✅ CORRETO: Conteúdo termina com o último parágrafo útil
   - Template processa fontes automaticamente

3. **Estrutura do conteúdo**
   - **Artigos educacionais**: Começar com parágrafo introdutório
   - **Notícias**: Começar direto com ## (H2)
   - Usar ## (H2) para seções principais
   - Usar ### (H3) para subseções
   - H2 aparece no índice lateral, H3 não

### Exemplo Correto (Artigo Educacional)

```markdown
As finanças descentralizadas (DeFi) representam uma revolução...

## O Que São Finanças Descentralizadas

DeFi é o conjunto de serviços...

### Contratos Inteligentes

Os contratos inteligentes são...

## Principais Vantagens

A principal vantagem é...
```

---

## 📰 Criação de Notícias

### Estrutura de Dados

**Armazenamento**: Prisma + PostgreSQL (tabela `Article`)
**Localização**: Neon PostgreSQL
**API**: `/api/articles` (GET/POST)

```typescript
{
  id: string,
  slug: string,
  title: string,
  excerpt: string,        // Resumo/summary
  content: string,        // Markdown completo
  category: string,       // 'bitcoin' | 'ethereum' | 'defi' | 'politica' | etc
  tags: string,           // JSON array de keywords
  sentiment: string,      // 'positive' | 'neutral' | 'negative'
  published: boolean,
  authorId: string,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### ⚠️ REGRAS ESPECÍFICAS - Notícias

**O template processa automaticamente. NUNCA incluir manualmente:**

1. **NUNCA incluir nota de transparência no conteúdo**
   - ❌ ERRADO: Adicionar "📊 Nota de Transparência" no markdown
   - ✅ CORRETO: Template adiciona automaticamente após o conteúdo

2. **NUNCA repetir o excerpt no início do content**
   - ❌ ERRADO: `excerpt: "Texto X..." + content: "Texto X...\n\n## Seção"`
   - ✅ CORRETO: `excerpt: "Texto X..." + content: "## Seção\n\nTexto Y..."`
   - Template já mostra o excerpt/resumo antes do conteúdo
   - Começar content direto nas seções (##) evita duplicação visual

### Estrutura do Conteúdo (Notícias)

**IMPORTANTE**: O content deve começar direto nas seções (##), pois o excerpt já aparece como resumo destacado.

```markdown
## Primeira Seção Principal

Conteúdo da primeira seção...

### Subseção (se necessário)

Detalhes adicionais...

## Segunda Seção Principal

Conteúdo continua...

## Conclusão

Parágrafo final sem nota de transparência ou fontes.
```

### Processamento Automático do Template

O template `ArtigoClient.tsx` automaticamente:
- Remove H1 do início do conteúdo (`removeH1FromContent`)
- Remove seção de fontes (`removeSourcesSection`)
- Adiciona nota de transparência com data formatada
- Gera índice navegável (H2 apenas)
- Calcula tempo de leitura
- Formata data de publicação em português

### 📐 Padrão de Estruturação Jornalística

**Fluxo narrativo ideal para notícias:**

```
Fato → Contexto → Impacto → Visão → Reflexão → Desafios
```

**Por que funciona:**
- Captura atenção (fato impactante)
- Contextualiza (números, dados)
- Analisa (impacto no mercado)
- Humaniza (visão de especialista)
- Reflete (significado maior)
- Equilibra (riscos, realismo)

**Técnicas:**
1. Agrupar parágrafos por tema (não por tamanho)
2. Títulos descritivos (não genéricos como "Introdução")
3. H2 para navegação (5-6 seções ideais), H3 para profundidade
4. Conclusão integrada como ### da última seção (não separada)

**Número ideal de seções**: 4 mínimo, 5-6 ideal, 7 máximo

---

## 🔧 Como Criar Notícias via Script

### Configuração do Prisma

```javascript
// ✅ CORRETO - Usar caminho customizado
const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

// ❌ ERRADO - Não usar caminho padrão
const { PrismaClient } = require('@prisma/client');
```

### Usuários Disponíveis

```javascript
// ID dos usuários existentes:
// - Admin: 'cmggcrcp40000ijin7jhr67vf' (admin@tokenmilagre.xyz)
// - Editor: 'cmggcrcr40001ijinifhwp0zq' (editor@tokenmilagre.xyz)

// Usar o ID do Editor para notícias automáticas
authorId: 'cmggcrcr40001ijinifhwp0zq'
```

### Template de Script (COM SLUG ÚNICO AUTOMÁTICO)

```javascript
const { PrismaClient } = require('../lib/generated/prisma');
const { generateUniqueSlug, slugWithDate } = require('./helpers/generate-unique-slug');
const prisma = new PrismaClient();

async function main() {
  // Gera slug base com data (formato: titulo-YYYYMMDD)
  const baseSlug = slugWithDate('Título da Notícia');

  // Gera slug único automaticamente (adiciona -2, -3, etc se já existir)
  const slug = await generateUniqueSlug(baseSlug);

  const article = await prisma.article.create({
    data: {
      slug, // Slug único garantido!
      title: 'Título da Notícia',
      excerpt: 'Resumo breve (1-2 frases)',
      content: `## Primeira Seção

Conteúdo começa direto nas seções.

## Segunda Seção

Mais conteúdo...`,
      category: 'bitcoin', // bitcoin | ethereum | defi | politica | nfts | altcoins
      tags: JSON.stringify(['tag1', 'tag2', 'tag3']),
      sentiment: 'neutral', // positive | neutral | negative
      published: true,
      authorId: 'cmggcrcr40001ijinifhwp0zq', // Editor
      createdAt: new Date(), // Hora atual
      updatedAt: new Date()
    }
  });

  console.log('✅ Notícia criada!');
  console.log('🔗 Slug:', article.slug);
  console.log('🌐 URL: http://localhost:3000/dashboard/noticias/' + slug);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Sistema de Slug Único Automático

**Helper**: `scripts/helpers/generate-unique-slug.js`

**Funções:**
1. `titleToSlug('Bitcoin Recua')` → `bitcoin-recua`
2. `slugWithDate('Bitcoin Recua')` → `bitcoin-recua-20251022`
3. `generateUniqueSlug(baseSlug)` → Garante unicidade (adiciona -2, -3, etc)

**Benefícios:**
- ✅ Nunca mais erro de slug duplicado
- ✅ Títulos similares = slugs diferentes
- ✅ Sistema automático
- ✅ Template pronto: `scripts/publish-news-template.js`

### Comandos Úteis

```bash
# Gerar Prisma Client
npx prisma generate

# Executar script
node scripts/nome-do-script.js

# Listar usuários
node scripts/list-users.js
```

### Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| `@prisma/client did not initialize` | Cliente não gerado | `npx prisma generate` |
| `Foreign key constraint violated` | authorId inválido | Usar ID válido de usuário existente |
| `Cannot find module '@prisma/client'` | Caminho errado | Usar `../lib/generated/prisma` |
| `Cannot find module '/path/scripts/...'` | Script fora do projeto | **SEMPRE** criar em `/tokenmilagre-platform/scripts/` |
| Notícia aparece "há X horas" | Data com timezone UTC errado | Usar `new Date()` sem parâmetros |

### 🔴 ERRO CRÍTICO: Module not found

**Sintoma**:
```
Error: Cannot find module '../lib/generated/prisma'
Require stack: /tmp/check.js
```

**Causa**: Script criado **fora da estrutura do projeto** (ex: `/tmp/`, diretório pai)

**Solução**: **SEMPRE criar scripts em** `tokenmilagre-platform/scripts/`

**Por quê?**: O caminho relativo `../lib/generated/prisma` é calculado a partir do **diretório do script**.

---

## 📁 Estrutura de Arquivos

### Artigos Educacionais

**Localização**: `/app/educacao/[slug]/page.tsx`

- Array `articles` contém todos os artigos
- Função `getArticle(slug)` busca artigo específico
- Função `getRelatedArticles(category, slug)` busca relacionados
- `generateMetadata()` para SEO

**Client Component**: `/app/educacao/[slug]/ArtigoEducacionalClient.tsx`
- Renderização do artigo
- Índice lateral (Table of Contents)
- Compartilhamento social
- Artigos relacionados

---

## ✅ Checklist para Novos Artigos Educacionais

- [ ] Remover título H1 do conteúdo
- [ ] Remover fontes/referências do final
- [ ] Verificar seções usam ## (H2) e ### (H3)
- [ ] Definir categoria apropriada
- [ ] Definir nível (iniciante/intermediario/avancado)
- [ ] Definir tipo (Artigo/Tutorial)
- [ ] Estimar tempo de leitura
- [ ] Adicionar 3-5 tags relevantes
- [ ] Usar data de publicação atual
- [ ] Incrementar ID do artigo (próximo: 7)
- [ ] Criar slug em kebab-case
- [ ] Testar em modo claro e escuro

## ✅ Checklist para Novas Notícias

- [ ] Remover título H1 do início do content
- [ ] Remover nota de transparência (template adiciona)
- [ ] Remover seção de fontes (template processa)
- [ ] **NÃO repetir excerpt no início do content**
- [ ] Content começa com ## (H2), não com parágrafo
- [ ] Aplicar Padrão de Estruturação Jornalística
- [ ] 5-6 seções H2 temáticas (mín 4, máx 7)
- [ ] Títulos descritivos nas seções
- [ ] Integrar conclusão como ### da última seção
- [ ] Definir categoria apropriada
- [ ] Definir sentiment (positive, neutral, negative)
- [ ] Adicionar excerpt/resumo (1-2 frases)
- [ ] Adicionar 5-7 keywords relevantes como tags
- [ ] Criar slug único em kebab-case
- [ ] Garantir published = true
- [ ] Usar Prisma/API para inserir
- [ ] Testar visualização

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-11-04 (otimizado e consolidado)
