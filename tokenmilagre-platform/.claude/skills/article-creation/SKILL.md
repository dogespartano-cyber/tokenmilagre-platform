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

1. **NUNCA incluir título H1 no conteúdo**
   - ❌ ERRADO: `# Título do Artigo\n\nTexto...`
   - ✅ CORRETO: `Texto introdutório direto...\n\n## Primeira Seção`
   - O título já aparece automaticamente no header da página

2. **NUNCA incluir seção de fontes/referências**
   - ❌ ERRADO: Incluir `[1](url)`, `[2](url)` no final do artigo
   - ✅ CORRETO: Conteúdo termina com o último parágrafo útil
   - Fontes devem ser removidas do texto fornecido

3. **Estrutura do conteúdo**
   - Começar direto com parágrafo introdutório
   - Usar ## (H2) para seções principais
   - Usar ### (H3) para subseções
   - H2 aparece no índice lateral, H3 não (design compacto)

### Exemplo Correto

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

### ⚠️ REGRAS IMPORTANTES - Conteúdo de Notícias

**O template processa automaticamente o conteúdo. NUNCA incluir manualmente:**

1. **NUNCA incluir título H1 no início do conteúdo**
   - ❌ ERRADO: `# Família Trump Lucra...\n\nTexto...`
   - ✅ CORRETO: `## Primeira Seção\n\nTexto...`
   - Template remove automaticamente H1 duplicado
   - Título já aparece no header da página

2. **NUNCA incluir nota de transparência no conteúdo**
   - ❌ ERRADO: Adicionar "📊 Nota de Transparência" no markdown
   - ✅ CORRETO: Conteúdo termina com último parágrafo útil
   - Template adiciona automaticamente após o conteúdo
   - Data de atualização é calculada dinamicamente

3. **NUNCA incluir seção de fontes no final**
   - ❌ ERRADO: `**Fontes:**\n- [Nome](url)\n- [Nome](url)`
   - ✅ CORRETO: Fontes são removidas automaticamente
   - Template extrai e processa fontes separadamente

4. **NUNCA repetir o excerpt no início do content**
   - ❌ ERRADO: `excerpt: "Texto X..." + content: "Texto X...\n\n## Seção"`
   - ✅ CORRETO: `excerpt: "Texto X..." + content: "## Seção\n\nTexto Y..."`
   - Template já mostra o excerpt/resumo antes do conteúdo
   - Começar content direto nas seções (##) evita duplicação visual
   - O excerpt serve como resumo destacado, não como primeiro parágrafo

### Processamento Automático do Template

O template `ArtigoClient.tsx` automaticamente:
- Remove H1 do início do conteúdo (`removeH1FromContent`)
- Remove seção de fontes (`removeSourcesSection`)
- Adiciona nota de transparência com data formatada
- Gera índice navegável (H2 apenas)
- Calcula tempo de leitura
- Formata data de publicação em português

### Estrutura do Conteúdo (Notícias)

**IMPORTANTE**: O content deve começar direto nas seções (##), pois o excerpt já aparece como resumo destacado no template.

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

**Por que não incluir parágrafo introdutório?**
- O template já renderiza o `excerpt` como resumo antes do `content`
- Se o `content` começar com texto = duplicação visual
- Começar direto com ## evita repetição e melhora a estrutura

### Template de Notícias - Características

**Design**: Minimalista, idêntico aos artigos educacionais
**Layout**: Conteúdo principal (`max-w-4xl`) + Sidebar lateral (w-64, apenas XL+)
**Espaçamento**: `paddingLeft: '55px'` (mesmo dos artigos)

**Elementos automáticos:**
- Breadcrumbs
- Botão "Voltar para Notícias"
- Meta info: Sentimento, Fonte, Tempo de leitura, "Há Xh/Xd"
- Título principal (H1)
- Data de publicação formatada (PT-BR com hora/minuto BRT)
- Resumo
- Keywords/Tags clicáveis
- Conteúdo processado (sem H1/fontes)
- 📊 Nota de Transparência
- Compartilhar: X (Twitter), Telegram, WhatsApp
- Notícias Relacionadas
- Índice lateral com seção ativa destacada
- Navegação anterior/próxima
- Scroll to top button

### 🔧 Como Criar Notícias via Script

**Configuração correta do Prisma neste projeto:**

```javascript
// ✅ CORRETO - Usar caminho customizado
const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

// ❌ ERRADO - Não usar caminho padrão
const { PrismaClient } = require('@prisma/client');
```

**Por quê?** Este projeto configura o Prisma para gerar em pasta customizada (`lib/generated/prisma`).

**Usuários disponíveis no banco:**

```javascript
// ID dos usuários existentes:
// - Admin: 'cmggcrcp40000ijin7jhr67vf' (admin@tokenmilagre.xyz)
// - Editor: 'cmggcrcr40001ijinifhwp0zq' (editor@tokenmilagre.xyz)

// Usar o ID do Editor para notícias automáticas
authorId: 'cmggcrcr40001ijinifhwp0zq'
```

**Template de script para criar notícias (COM SLUG ÚNICO AUTOMÁTICO):**

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
      excerpt: 'Resumo breve (1-2 frases) - Este texto aparece como destaque',
      content: `## Primeira Seção

Conteúdo começa direto nas seções. NÃO repetir o excerpt aqui!

## Segunda Seção

Mais conteúdo...`,
      category: 'bitcoin', // bitcoin | ethereum | defi | politica | nfts | altcoins
      tags: JSON.stringify(['tag1', 'tag2', 'tag3']),
      sentiment: 'neutral', // positive | neutral | negative
      published: true,
      authorId: 'cmggcrcr40001ijinifhwp0zq', // Editor
      createdAt: new Date(), // Hora atual do sistema
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

**✨ Sistema de Slug Único Automático:**

O projeto possui um helper em `scripts/helpers/generate-unique-slug.js` que:

1. **Gera slugs a partir de títulos:** `titleToSlug('Bitcoin Recua')` → `bitcoin-recua`
2. **Adiciona data automática:** `slugWithDate('Bitcoin Recua')` → `bitcoin-recua-20251022`
3. **Garante unicidade:** Se slug existir, adiciona sufixo incremental (`-2`, `-3`, etc)
4. **Previne duplicatas:** Mesmo título em dias diferentes = slugs diferentes

**Exemplo de uso:**
```javascript
const { generateUniqueSlug, slugWithDate } = require('./helpers/generate-unique-slug');

// Título igual em dias diferentes
const slug1 = await generateUniqueSlug('bitcoin-recua-107-mil-20251022');
// Resultado: 'bitcoin-recua-107-mil-20251022'

const slug2 = await generateUniqueSlug('bitcoin-recua-107-mil-20251022');
// Resultado: 'bitcoin-recua-107-mil-20251022-2' (adiciona -2 automaticamente)

const slug3 = await generateUniqueSlug('bitcoin-recua-107-mil-20251022');
// Resultado: 'bitcoin-recua-107-mil-20251022-3' (adiciona -3 automaticamente)
```

**Benefícios:**
- ✅ Nunca mais erro de slug duplicado
- ✅ Títulos similares em contextos diferentes = OK
- ✅ Sistema automático, não precisa pensar em sufixos
- ✅ Template pronto em `scripts/publish-news-template.js`

**Comandos úteis:**

```bash
# Gerar Prisma Client (se necessário)
npx prisma generate

# Executar script
node scripts/nome-do-script.js

# Listar usuários (para obter IDs)
node scripts/list-users.js
```

**Erros comuns e soluções:**

| Erro | Causa | Solução |
|------|-------|---------|
| `@prisma/client did not initialize` | Cliente não gerado | `npx prisma generate` |
| `Foreign key constraint violated` | authorId inválido | Usar ID válido de usuário existente |
| `Cannot find module '@prisma/client'` | Caminho errado | Usar `../lib/generated/prisma` |
| `Cannot find module '/path/scripts/...'` | Script criado fora do projeto | **SEMPRE** criar em `/tokenmilagre-platform/scripts/` |
| Notícia aparece "há X horas" | Data com timezone UTC errado | Usar `new Date()` sem parâmetros para hora atual |

### 🔴 ERRO CRÍTICO: Module not found

**Sintoma mais comum**:
```
Error: Cannot find module '../lib/generated/prisma'
Require stack: /tmp/check.js
```

**Causa raiz**: Script criado **fora da estrutura do projeto**

**Por que acontece?**

Quando você cria um script em `/tmp/` ou fora do projeto:

```javascript
// ❌ Script em /tmp/verify.js
const { PrismaClient } = require('../lib/generated/prisma');
//                                   ^^^ caminho relativo

// Node.js procura em: /tmp/../lib/generated/prisma
// Resultado: /lib/generated/prisma ← NÃO EXISTE!
```

**Solução**:

```javascript
// ✅ Script em tokenmilagre-platform/scripts/verify.js
const { PrismaClient } = require('../lib/generated/prisma');
//                                   ^^^ caminho relativo

// Node.js procura em: scripts/../lib/generated/prisma
// Resultado: /home/destakar/Trabalho/tokenmilagre-platform/lib/generated/prisma ✅
```

**Regra de ouro**:
- ✅ **SEMPRE criar scripts em** `tokenmilagre-platform/scripts/`
- ❌ **NUNCA criar em** `/tmp/`, `/home/destakar/Trabalho/`, ou diretórios pai

**Motivo técnico**: O caminho relativo `../lib/generated/prisma` é calculado a partir do **diretório do script**, não do diretório de execução.

---

**⚠️ REGRAS CRÍTICAS ao Criar Scripts:**

1. **Caminho correto do script:**
   - ✅ CORRETO: `/home/destakar/Trabalho/tokenmilagre-platform/scripts/nome-do-script.js`
   - ❌ ERRADO: `/home/destakar/Trabalho/scripts/nome-do-script.js` (diretório pai)

2. **Data/Hora de publicação:**
   - ✅ CORRETO: `createdAt: new Date()` (hora atual do sistema)
   - ❌ ERRADO: `new Date('2025-10-22T00:00:00.000Z')` (meia-noite UTC, aparecerá como horas atrás)

3. **Antes de executar script:**
   - Verificar se Prisma Client está gerado: `npx prisma generate`
   - Estar no diretório correto: `pwd` deve mostrar `.../tokenmilagre-platform`

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

Ao criar um novo artigo educacional:

- [ ] Remover título H1 do conteúdo (título já aparece no header)
- [ ] Remover todas as fontes/referências do final
- [ ] Verificar se as seções usam ## (H2) e ### (H3) corretamente
- [ ] Definir categoria apropriada
- [ ] Definir nível (iniciante/intermediario/avancado)
- [ ] Definir tipo (Artigo/Tutorial)
- [ ] Estimar tempo de leitura realista
- [ ] Adicionar 3-5 tags relevantes
- [ ] Usar data de publicação atual
- [ ] Incrementar ID do artigo (próximo: 7)
- [ ] Criar slug em kebab-case
- [ ] Testar o artigo em modo claro e escuro

## ✅ Checklist para Novas Notícias

Ao criar uma nova notícia:

- [ ] Remover título H1 do início do conteúdo markdown
- [ ] Remover nota de transparência (template adiciona automaticamente)
- [ ] Remover seção de fontes do final (template processa)
- [ ] **NÃO repetir excerpt no início do content (começar direto com ##)**
- [ ] Verificar se content começa com ## (H2), não com parágrafo
- [ ] Verificar se as seções usam ## (H2) e ### (H3) corretamente
- [ ] Definir categoria apropriada (bitcoin, ethereum, defi, politica, etc)
- [ ] Definir sentiment (positive, neutral, negative)
- [ ] Adicionar excerpt/resumo (1-2 frases)
- [ ] Adicionar 5-7 keywords relevantes como tags
- [ ] Criar slug único em kebab-case
- [ ] Garantir que published = true para publicação
- [ ] Usar Prisma/API para inserir no banco de dados
- [ ] Testar visualização da notícia

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-10-24 (adicionada regra 4: anti-duplicação excerpt/content)
