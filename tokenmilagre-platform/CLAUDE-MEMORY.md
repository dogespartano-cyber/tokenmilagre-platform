# Memória do Projeto - Token Milagre Platform

Este documento contém diretrizes, padrões e decisões de design estabelecidas durante o desenvolvimento do projeto. Consulte sempre que precisar criar novos conteúdos ou fazer alterações.

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

**Armazenamento**: Prisma + SQLite (tabela `Article`)
**Localização**: `prisma/dev.db`
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
   - ✅ CORRETO: `Texto introdutório direto...\n\n## Primeira Seção`
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

### Processamento Automático do Template

O template `ArtigoClient.tsx` automaticamente:
- Remove H1 do início do conteúdo (`removeH1FromContent`)
- Remove seção de fontes (`removeSourcesSection`)
- Adiciona nota de transparência com data formatada
- Gera índice navegável (H2 apenas)
- Calcula tempo de leitura
- Formata data de publicação em português

### Estrutura do Conteúdo (Notícias)

```markdown
Parágrafo introdutório explicando o contexto da notícia...

## Primeira Seção Principal

Conteúdo da primeira seção...

### Subseção (se necessário)

Detalhes adicionais...

## Segunda Seção Principal

Conteúdo continua...

## Conclusão

Parágrafo final sem nota de transparência ou fontes.
```

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

**Template de script para criar notícias:**

```javascript
const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const slug = 'titulo-da-noticia-YYYYMMDD-HHMM';

  // Verificar se já existe
  const existing = await prisma.article.findUnique({
    where: { slug }
  });

  if (existing) {
    console.log('❌ Artigo já existe:', slug);
    return;
  }

  const article = await prisma.article.create({
    data: {
      slug,
      title: 'Título da Notícia',
      excerpt: 'Resumo breve (1-2 frases)',
      content: `Conteúdo sem H1, sem [1][2], sem fontes...`,
      category: 'bitcoin', // bitcoin | ethereum | defi | politica | etc
      tags: JSON.stringify(['tag1', 'tag2', 'tag3']),
      sentiment: 'neutral', // positive | neutral | negative
      published: true,
      authorId: 'cmggcrcr40001ijinifhwp0zq', // Editor
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log('✅ Notícia criada!');
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

---

## 🎨 Padrões de Design

### Espaçamento e Layout

- **Sidebar**: 272px de largura fixa
- **Espaçamento do conteúdo**: 55px à esquerda da sidebar (`paddingLeft: '55px'`)
- **Largura máxima do conteúdo**: `max-w-4xl` (artigos), `max-w-6xl` (recursos)
- **Índice lateral**: 256px (w-64), visível apenas em XL+ screens

### Cores e Temas

- Usar sempre CSS variables para adaptação ao tema:
  - `var(--text-primary)` - Texto principal
  - `var(--text-secondary)` - Texto secundário
  - `var(--text-tertiary)` - Texto terciário
  - `var(--bg-primary)` - Fundo primário
  - `var(--bg-secondary)` - Fundo secundário
  - `var(--bg-elevated)` - Fundos elevados (cards)
  - `var(--brand-primary)` - Cor primária da marca
  - `var(--brand-hover)` - Hover da cor primária
  - `var(--border-light)` - Bordas claras
  - `var(--border-medium)` - Bordas médias

### Ícones

- **Regra geral**: Evitar ícones excessivos, manter design clean
- **Ícones permitidos**:
  - 📖 Tempo de leitura (único ícone nos cards de educação)
  - Ícones de navegação (setas, menu, etc)
- **Ícones removidos**:
  - ❌ Ícones de categorias nos cards
  - ❌ Ícones de níveis (🌱, 🚀, 💎)
  - ❌ Ícones de plataformas nos recursos

### Breadcrumbs

- Adicionar em todas as páginas principais
- Componente: `<Breadcrumbs />`
- Localização: Topo da página, antes do conteúdo

---

## 📚 Páginas Principais

### Educação (`/educacao`)

**Características:**
- Sistema de filtros: Busca + Categorias + Níveis
- Cards de artigos com: Tipo, Tempo de leitura, Título, Descrição, Tags
- Filtros sem ícones (apenas texto)
- Contador de resultados

**Página de Artigo (`/educacao/[slug]`):**
- Layout: Conteúdo principal (esquerda) + Índice lateral (direita)
- Índice mostra apenas H2 (seções principais)
- Destaque da seção ativa com scroll tracking
- Barra de progresso de leitura no topo
- Breadcrumbs + Botão voltar
- Compartilhar: Twitter, Telegram, WhatsApp
- Artigos relacionados por categoria

### Recursos (`/recursos`)

**Características:**
- Galeria de links oficiais verificados
- Categorias: Wallets, Exchanges, Exploradores, DeFi, Ferramentas
- Sistema de busca e filtros
- Badge de verificação em todos os recursos
- URL completa exibida abaixo do botão
- Avisos de segurança destacados

### Notícias (`/dashboard/noticias`)

**Características:**
- Filtro combinado: Ordenação + Sentimento em um único dropdown
- Menu posicionado ao lado das categorias (grid layout)
- Badges de sentimento: 🟢 Positivo, 🟡 Neutro, 🔴 Negativo

---

## 🔧 Componentes e Padrões

### Busca e Filtros (Padrão Unificado)

```jsx
<div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl">
  <div className="flex items-center justify-between mb-4">
    <h3>🔍 Busca e Filtros {badge contador}</h3>
    <div>
      {botão limpar tudo}
      {botão toggle mobile}
    </div>
  </div>

  {campo de busca}

  <div className={mobile toggle}>
    {filtros de categoria}
    {outros filtros específicos}
    {contador de resultados}
  </div>
</div>
```

### Scroll to Top Button

- Aparece após 400px de scroll
- Posição: `fixed bottom-8 right-8`
- Cor: `var(--brand-primary)`
- Ícone: Seta para cima

### Theme Toggle

- Ícone: 🌙 (modo escuro) / ☀️ (modo claro)
- Localização: Sidebar + Header desktop
- Sempre usar CSS variables para cores

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

## 🎯 Filosofia do Projeto

### Valores

- **Minimalismo**: Design clean, sem elementos desnecessários
- **Acessibilidade**: Todos devem poder acessar o conteúdo facilmente
- **Open Source**: Espírito comunitário e transparente
- **Educação**: Foco em ensinar, não em impressionar
- **Segurança**: Proteger usuários de golpes e sites falsos

### Texto do Footer

"$MILAGRE é um projeto comunitário criado para conectar pessoas através de apoio mútuo e esperança."

Copyright: "© 2025 $MILAGRE Community"

---

## 🚫 O Que Evitar

1. **Ícones excessivos**: Manter apenas essenciais
2. **Títulos duplicados**: Nunca repetir H1 no conteúdo (artigos e notícias)
3. **Notas de transparência manuais**: Template adiciona automaticamente (notícias)
4. **Seções de fontes no markdown**: Template processa automaticamente (notícias)
5. **Complexidade visual**: Preferir design simples e minimalista
6. **Textos brancos no modo claro**: Sempre usar CSS variables
7. **Criar arquivos desnecessários**: Editar existentes quando possível
8. **Emojis sem solicitação**: Usar apenas quando pedido

---

## 📞 Links Oficiais

- Token Address: `3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump`
- Discord: `https://discord.gg/skaX8bFY`
- Telegram: `https://t.me/+Bop_TVFc_mg3Njlh`
- Pump.fun: `https://pump.fun/coin/{TOKEN_ADDRESS}`

---

## 🔄 Atualizações Futuras

Este documento deve ser atualizado sempre que:
- Novos padrões forem estabelecidos
- Decisões importantes de design forem tomadas
- Novas convenções de código forem adotadas
- Problemas recorrentes forem identificados e solucionados

---

## 📝 Histórico de Atualizações

**2025-10-19 (tarde)**: Adicionada seção "Como Criar Notícias via Script" com configuração correta do Prisma, IDs de usuários, template completo de script, comandos úteis e tabela de erros comuns.

**2025-10-19 (manhã)**: Adicionadas diretrizes completas para criação de notícias, template automático, processamento de conteúdo, lista de artigos educacionais existentes, e checklists separados para artigos e notícias.

**2025-01-19**: Criação do documento inicial com diretrizes para artigos educacionais, padrões de design, e filosofia do projeto.

**Última atualização**: 2025-10-19
