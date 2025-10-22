# Scripts de Publicação - Token Milagre Platform

## 📋 Índice

- [Criar Notícias](#criar-notícias)
- [Sistema de Slug Único](#sistema-de-slug-único)
- [Helpers Disponíveis](#helpers-disponíveis)
- [Exemplos Práticos](#exemplos-práticos)

## 🆕 Criar Notícias

### Método Recomendado (Com Slug Único Automático)

Use o template `publish-news-template.js` como base:

```bash
# 1. Copiar template
cp scripts/publish-news-template.js scripts/publish-minha-noticia.js

# 2. Editar dados da notícia
nano scripts/publish-minha-noticia.js

# 3. Executar
node scripts/publish-minha-noticia.js
```

### Estrutura Básica

```javascript
const { PrismaClient } = require('../lib/generated/prisma');
const { generateUniqueSlug, slugWithDate } = require('./helpers/generate-unique-slug');
const prisma = new PrismaClient();

async function main() {
  const newsData = {
    title: 'Título da Notícia',
    excerpt: 'Resumo em 1-2 frases',
    content: `Conteúdo completo em markdown...`,
    category: 'bitcoin', // bitcoin | ethereum | defi | politica | nfts | altcoins
    tags: ['Tag1', 'Tag2', 'Tag3'],
    sentiment: 'neutral', // positive | neutral | negative
  };

  // Gera slug único automaticamente
  const baseSlug = slugWithDate(newsData.title);
  const slug = await generateUniqueSlug(baseSlug);

  const article = await prisma.article.create({
    data: {
      slug,
      title: newsData.title,
      excerpt: newsData.excerpt,
      content: newsData.content,
      category: newsData.category,
      tags: JSON.stringify(newsData.tags),
      sentiment: newsData.sentiment,
      published: true,
      authorId: 'cmggcrcr40001ijinifhwp0zq', // Editor
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log('✅ Criado:', article.slug);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## 🔄 Sistema de Slug Único

### Como Funciona

O sistema detecta automaticamente slugs duplicados e adiciona sufixos incrementais:

```javascript
// Primeira publicação
'bitcoin-recua-107-mil-20251022'

// Segunda publicação com mesmo título
'bitcoin-recua-107-mil-20251022-2'

// Terceira publicação
'bitcoin-recua-107-mil-20251022-3'
```

### Benefícios

- ✅ **Zero conflitos:** Nunca mais erro de slug duplicado
- ✅ **Títulos similares:** Mesmo título em contextos diferentes = OK
- ✅ **Automático:** Não precisa pensar em sufixos manualmente
- ✅ **Consistente:** Padrão uniforme em todas as notícias

### Testar Slug Único

```bash
# Testar se slug está disponível
node scripts/helpers/generate-unique-slug.js meu-slug-teste-20251022

# Saída esperada:
# ✅ Slug disponível: meu-slug-teste-20251022
# OU
# ⚠️  Slug já existe: meu-slug-teste-20251022
# ✅ Slug único gerado: meu-slug-teste-20251022-2
```

## 🛠️ Helpers Disponíveis

### `generate-unique-slug.js`

Localização: `scripts/helpers/generate-unique-slug.js`

**Funções exportadas:**

#### `generateUniqueSlug(baseSlug)`

Verifica se slug existe e adiciona sufixo se necessário.

```javascript
const { generateUniqueSlug } = require('./helpers/generate-unique-slug');

const slug = await generateUniqueSlug('bitcoin-atinge-100-mil-20251022');
// Retorna: 'bitcoin-atinge-100-mil-20251022' (se disponível)
// Ou: 'bitcoin-atinge-100-mil-20251022-2' (se já existir)
```

#### `titleToSlug(title)`

Converte título em slug (kebab-case).

```javascript
const { titleToSlug } = require('./helpers/generate-unique-slug');

titleToSlug('Bitcoin Atinge US$ 100 Mil!');
// Retorna: 'bitcoin-atinge-us-100-mil'
```

#### `slugWithDate(title, date?)`

Gera slug com data no formato YYYYMMDD.

```javascript
const { slugWithDate } = require('./helpers/generate-unique-slug');

slugWithDate('Bitcoin Atinge US$ 100 Mil');
// Retorna: 'bitcoin-atinge-us-100-mil-20251022'

slugWithDate('Bitcoin Atinge US$ 100 Mil', new Date('2025-10-20'));
// Retorna: 'bitcoin-atinge-us-100-mil-20251020'
```

## 📝 Exemplos Práticos

### Exemplo 1: Notícia com Título Repetido

```javascript
// Cenário: "Bitcoin Recua" acontece 2x no mesmo dia

// Primeira notícia (manhã)
const slug1 = await generateUniqueSlug('bitcoin-recua-20251022');
// Resultado: 'bitcoin-recua-20251022'

// Segunda notícia (tarde, contexto diferente)
const slug2 = await generateUniqueSlug('bitcoin-recua-20251022');
// Resultado: 'bitcoin-recua-20251022-2'
```

### Exemplo 2: Série de Notícias Relacionadas

```javascript
// Acompanhamento de um evento ao longo do dia

const baseSlug = 'mercado-cripto-volatilidade-20251022';

// Notícia 1 (8h)
const slug1 = await generateUniqueSlug(baseSlug);
// 'mercado-cripto-volatilidade-20251022'

// Notícia 2 (12h)
const slug2 = await generateUniqueSlug(baseSlug);
// 'mercado-cripto-volatilidade-20251022-2'

// Notícia 3 (18h)
const slug3 = await generateUniqueSlug(baseSlug);
// 'mercado-cripto-volatilidade-20251022-3'
```

### Exemplo 3: Uso Completo do Template

```bash
# 1. Copiar template
cp scripts/publish-news-template.js scripts/publish-ethereum-upgrade.js

# 2. Editar apenas a seção newsData
nano scripts/publish-ethereum-upgrade.js

# Alterar:
const newsData = {
  title: 'Ethereum Completa Upgrade Dencun com Sucesso',
  excerpt: 'A rede Ethereum concluiu com sucesso o upgrade Dencun, reduzindo taxas em até 90%.',
  content: `A rede Ethereum...`,
  category: 'ethereum',
  tags: ['Ethereum', 'ETH', 'Dencun', 'Upgrade'],
  sentiment: 'positive',
};

# 3. Executar
node scripts/publish-ethereum-upgrade.js
```

## ⚠️ Regras Importantes

1. **SEMPRE usar `new Date()`** para createdAt/updatedAt (hora atual)
2. **NUNCA incluir H1** no conteúdo markdown (template adiciona automaticamente)
3. **REMOVER fontes** do texto (ex: `[1](url)`, `[2](url)`)
4. **Usar helper de slug único** para evitar duplicatas
5. **Estar no diretório correto:** `pwd` deve mostrar `.../tokenmilagre-platform`

## 🔧 Comandos Úteis

```bash
# Gerar Prisma Client (se necessário)
npx prisma generate

# Listar artigos no banco
node scripts/list-articles.js

# Deletar artigo específico
node scripts/delete-article.js slug-do-artigo

# Testar slug único
node scripts/helpers/generate-unique-slug.js meu-slug-teste

# Atualizar data de artigo
node scripts/update-article-date.js
```

## 📚 Mais Informações

Consulte `CLAUDE-MEMORY.md` na raiz do projeto para diretrizes completas sobre:
- Estrutura de conteúdo
- Padrões de design
- Categorias e sentimentos
- Boas práticas
