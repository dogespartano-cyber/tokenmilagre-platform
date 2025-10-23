# 🌟 TokenMilagre Platform

**Plataforma educacional e de comunidade para o token $MILAGRE (Solana)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dogespartano-cyber/tokenmilagre-platform)

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Rodar servidor de desenvolvimento
npm run dev

# Abrir http://localhost:3000
```

### Build para Produção

```bash
# Criar build otimizado
npm run build

# Rodar build localmente
npm start
```

## 🔧 Stack Tecnológico

- **Framework:** Next.js 15.5.4 (App Router + Turbopack)
- **Linguagem:** TypeScript
- **Banco de Dados:** Neon PostgreSQL
- **ORM:** Prisma
- **Estilização:** Tailwind CSS 4 + CSS Variables
- **Blockchain:** Solana (via @solana/web3.js)
- **Markdown:** react-markdown
- **Gráficos:** TradingView Widgets + Lightweight Charts
- **Deploy:** Vercel

## ✨ Features Principais

### 🏠 Homepage
- Hero section com ticker de preços em tempo real
- Dados de mercado (Market Cap, Volume, Dominância BTC/ETH)
- Fear & Greed Index com velocímetro interativo
- Gráfico Bitcoin (TradingView Lightweight Charts)
- Últimas notícias (4 cards)
- Cards de artigos educacionais (carousel 2 slides)
- Ferramentas essenciais (MetaMask, Binance, Uniswap)
- Design minimalista com bordas sutis e sombras harmônicas

### 📚 Educação (`/educacao`)
- Artigos educacionais completos armazenados em PostgreSQL
- Sistema de filtros (Busca + Categorias + Níveis)
- Níveis: Iniciante (1), Intermediário (2), Avançado (3)
- Categorias: Blockchain, Trading, DeFi, NFTs, Segurança, Desenvolvimento
- Artigos com índice lateral e scroll tracking
- Compartilhamento social (Twitter, Telegram, WhatsApp)

### 🔗 Recursos (`/recursos`)
- Links oficiais verificados de ferramentas cripto
- Design com gradientes categorizados:
  - Wallets (laranja), Exchanges (dourado), DeFi (rosa)
  - Explorers (azul), Tools (verde)
- Sistema de busca e filtros por categoria
- Badge de verificação em todos os recursos
- Avisos de segurança destacados

### 📰 Notícias (`/dashboard/noticias`)
- Notícias armazenadas em PostgreSQL via Prisma
- Filtros combinados (Ordenação + Sentimento)
- Análise de sentimento (🟢 Positivo, 🟡 Neutro, 🔴 Negativo)
- Páginas dinâmicas `/dashboard/noticias/[slug]`
- Template com processamento automático (remove H1, fontes, adiciona nota de transparência)
- Índice lateral navegável

### 💝 Doações (`/doacoes`)
- 4 razões para confiar (Transparência, Sem Intermediários, Impacto Real, Comunidade)
- Distribuição de recursos (40% Educação, 30% Dev, 20% Apoio, 10% Crescimento)
- Métodos: Solana (SOL), $MILAGRE Token, PIX
- Botão copiar endereço com feedback visual
- Avisos de segurança

### 📜 Manifesto (`/manifesto`)
- Manifesto completo da comunidade $MILAGRE
- 12 seções com navegação lateral
- Sistema de scroll suave

### ℹ️ Sobre (`/sobre`)
- História e missão do projeto
- Valores da comunidade
- Links sociais e de contato

## 📁 Estrutura do Projeto

```
tokenmilagre-platform/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── articles/             # API de artigos/notícias
│   ├── dashboard/                # Dashboard com sidebar
│   │   └── noticias/             # Sistema de notícias
│   │       ├── page.tsx          # Listagem
│   │       └── [slug]/           # Artigo individual
│   ├── educacao/                 # Artigos educacionais
│   │   ├── page.tsx              # Server Component (Prisma)
│   │   ├── EducacaoClient.tsx    # Client Component
│   │   └── [slug]/               # Artigo individual
│   ├── recursos/                 # Links e ferramentas
│   ├── doacoes/                  # Página de doações
│   ├── manifesto/                # Manifesto
│   ├── sobre/                    # Sobre o projeto
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   └── globals.css               # CSS global + variables
├── components/                   # Componentes React
│   ├── AdvancedChart.tsx         # Gráfico BTC com indicadores
│   ├── LightweightChart.tsx      # Charts profissionais
│   ├── TickerTapeWidget.tsx      # Ticker horizontal
│   ├── Sidebar.tsx               # Navegação lateral
│   ├── Header.tsx                # Header do site
│   └── ...                       # Outros componentes
├── contexts/                     # React Contexts
│   └── ThemeContext.tsx          # Tema claro/escuro
├── hooks/                        # Custom React Hooks
├── lib/                          # Bibliotecas e utilitários
│   ├── prisma.ts                 # Prisma Client singleton
│   └── generated/prisma/         # Prisma Client gerado
├── prisma/                       # Prisma ORM
│   ├── schema.prisma             # Schema do banco
│   └── seed.ts                   # Seed inicial
├── scripts/                      # Scripts utilitários
│   ├── check-*.js                # Scripts de verificação
│   ├── list-*.js                 # Scripts de listagem
│   ├── delete-*.js               # Scripts de remoção
│   └── watch-articles.js         # Watcher de artigos
├── public/                       # Assets estáticos
│   └── images/                   # Imagens
├── types/                        # TypeScript types
└── README.md                     # Este arquivo
```

## 🗄️ Banco de Dados

### PostgreSQL + Prisma

**Banco:** Neon PostgreSQL (Vercel Marketplace)
**Client:** `lib/generated/prisma` (caminho customizado)

```bash
# Gerar Prisma Client
npx prisma generate

# Aplicar mudanças no schema
npx prisma db push

# Abrir Prisma Studio
npm run db:studio
```

### Schema Principal

```prisma
model Article {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  excerpt     String
  content     String
  category    String
  tags        String   // JSON array
  sentiment   String?
  type        String   // 'news' | 'educational'
  level       String?  // 'iniciante' | 'intermediario' | 'avancado'
  contentType String?  // 'Artigo' | 'Tutorial'
  readTime    String?
  published   Boolean  @default(false)
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  author      User     @relation(fields: [authorId], references: [id])
}
```

## 🔌 APIs e Integrações

### Blockchain
- **Solana Web3.js**: Conexão com blockchain Solana
- **Token Address**: `3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump`

### Dados de Mercado
- **Binance API**: Candlesticks e volume em tempo real
- **CoinGecko API**: Market cap, volume, dominância
- **Alternative.me API**: Fear & Greed Index
- **TradingView**: Gráficos embarcados

## 📝 Configuração

### Variáveis de Ambiente

Crie `.env` na raiz do projeto (copiar de `.env.example`):

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_TOKEN_ADDRESS=3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Dev server (Turbopack)
npm run build            # Build produção
npm start                # Rodar build

# Banco de Dados
npm run db:push          # Aplicar schema
npm run db:studio        # Prisma Studio
npm run db:seed          # Seed inicial

# Utilitários
npm run lint             # ESLint
npm run watch            # Watcher de artigos
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte o repositório GitHub à Vercel
2. Integre Neon PostgreSQL via Vercel Marketplace
3. Variáveis de ambiente são configuradas automaticamente
4. Deploy automático a cada push em `main`

**IMPORTANTE**:
- Manter script `postinstall: "prisma generate"` no package.json
- Configurar `eslint.ignoreDuringBuilds: true` no next.config.ts

## 🎨 Design System

### CSS Variables

Modo claro e escuro via CSS Variables:

```css
--text-primary, --text-secondary, --text-tertiary
--bg-primary, --bg-secondary, --bg-elevated
--brand-primary, --brand-hover
--border-light, --border-medium
--shadow-md, --shadow-lg
```

### Padrões

- **Bordas**: 1px quase invisíveis (`--border-light`)
- **Sombras**: Sutis e harmônicas
- **Hover**: `-translate-y-1` + `shadow-lg`
- **Transições**: `duration-500 ease-out`
- **Fundo claro**: `#f5f4f6` (off-white confortável)

## 🛠️ Scripts Utilitários

### Verificação
- `check-article-content.js` - Valida conteúdo
- `check-duplicates.js` - Verifica duplicatas
- `check-educational.js` - Verifica artigos educacionais

### Listagem
- `list-articles.js` - Lista todos os artigos
- `list-users.js` - Lista usuários do sistema

### Outros
- `count-articles.js` - Conta artigos por tipo
- `delete-article.js` - Remove artigo do banco
- `test-api-sentiment.js` - Testa API de sentimento
- `watch-articles.js` - Watcher de mudanças

## 🔗 Links Importantes

- **Token Contract**: [3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump](https://solscan.io/token/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump)
- **Discord**: [discord.gg/skaX8bFY](https://discord.gg/skaX8bFY)
- **Telegram**: [t.me/+Bop_TVFc_mg3Njlh](https://t.me/+Bop_TVFc_mg3Njlh)
- **Pump.fun**: [pump.fun/coin/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump](https://pump.fun/coin/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump)

## 📜 Licença

© 2025 by $MILAGRE Community. Projeto 100% comunitário e sem fins lucrativos.

---

**Nunca estarás sozinho. ❤️**

*Desenvolvido com Claude Code & Next.js*
