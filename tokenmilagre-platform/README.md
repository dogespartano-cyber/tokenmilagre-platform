# 🌟 TokenMilagre Platform

**Plataforma educacional e de comunidade para o token $MILAGRE (Solana)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dogespartano-cyber/tokenmilagre-platform)

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

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

- **Framework:** Next.js 15.5.4 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS 4
- **Blockchain:** Solana (via @solana/web3.js)
- **Wallet:** Phantom Integration
- **Markdown:** react-markdown para artigos
- **Análise de Mercado:** TradingView Widgets
- **Deploy:** Vercel (CI/CD via GitHub)

## ✨ Features Principais

### 🏠 Homepage
- ✅ Landing page com design celestial (gradiente azul/roxo)
- ✅ Integração Phantom Wallet
- ✅ Sistema de tiers baseado em holdings:
  - 1.000+ $MILAGRE = Apoiador
  - 10.000+ $MILAGRE = Guardião
  - 50.000+ $MILAGRE = Anjo Guardião
- ✅ FAQ interativa com acordeões
- ✅ Links para compra (Pump.fun) e comunidade
- ✅ Design responsivo mobile-first

### 📜 Manifesto
- ✅ Página dedicada ao Manifesto $MILAGRE
- ✅ 12 seções completas renderizadas
- ✅ Seção de resumo na homepage
- ✅ Contador dinâmico de signatários (sincronizado globalmente)
- ✅ Sistema de assinatura do manifesto

### 💼 Dashboard do Holder

#### Portfolio Tracker
- ✅ Conexão segura com Phantom Wallet
- ✅ Exibição de saldo $MILAGRE em tempo real
- ✅ Cálculo automático de tier/nível
- ✅ Badge visual do nível do holder
- ✅ Link direto para Solscan (histórico blockchain)

#### Análise de Mercado
- ✅ 3 Gráficos TradingView ao vivo (BTC, ETH, SOL)
- ✅ 3 Widgets de Análise Técnica (RSI, MACD, Médias Móveis)
- ✅ Crypto Heatmap (visão geral do mercado)
- ✅ Market Screener (tabela de todas criptos)
- ✅ Market Insights em tempo real:
  - Fear & Greed Index (via Alternative.me)
  - Altcoin Season Index
  - Métricas de mercado (Market Cap, Volume 24h, Dominância BTC/ETH)
- ✅ Links úteis (CoinGecko, DeFi Llama, CoinMarketCap)

#### Sistema de Notícias Cripto
- ✅ **Geração automática de artigos completos com IA**
- ✅ Artigos em Markdown com conteúdo extenso (300-500 palavras)
- ✅ Templates profissionais por categoria:
  - Bitcoin: Análise técnica + fundamentos
  - Ethereum: Updates + ecossistema
  - Solana: Performance + crescimento
  - DeFi: Protocolos + inovações
  - NFTs: Mercado + casos de uso
  - Regulação: Framework global
- ✅ Páginas dinâmicas `/dashboard/noticias/[id]`
- ✅ Filtros por categoria (Bitcoin, Ethereum, Solana, DeFi, NFTs, Regulação)
- ✅ Análise de sentimento (🟢 Positivo, 🟡 Neutro, 🔴 Negativo)
- ✅ Extração automática de keywords
- ✅ Sistema de cache (30 minutos)
- ✅ Armazenamento persistente em JSON
- ✅ Interface de leitura otimizada com prose styling

### 🎨 UI/UX
- ✅ Design glassmorphism (backdrop-blur + transparências)
- ✅ Sidebar navegação sticky/fixa
- ✅ Botões de ação estratégicos ("Comprar $MILAGRE")
- ✅ Logos consistentes em todas as páginas
- ✅ Animações suaves e transições
- ✅ Estados de loading e empty states

## 📁 Estrutura do Projeto

```
tokenmilagre-platform/
├── app/
│   ├── api/
│   │   ├── news/route.ts              # API de notícias com cache
│   │   ├── generate-news/route.ts     # Gerador de artigos com IA
│   │   └── process-news/route.ts      # Processamento de notícias
│   ├── dashboard/
│   │   ├── layout.tsx                 # Layout com sidebar
│   │   ├── page.tsx                   # Portfolio tracker
│   │   ├── mercado/page.tsx           # Análise de mercado
│   │   ├── noticias/
│   │   │   ├── page.tsx               # Listagem de notícias
│   │   │   └── [id]/page.tsx          # Artigo completo
│   ├── manifesto/page.tsx             # Página do manifesto
│   ├── page.tsx                       # Homepage
│   └── layout.tsx                     # Root layout
├── components/
│   ├── TradingViewWidget.tsx          # Gráfico TradingView
│   ├── TechnicalAnalysisWidget.tsx    # Análise técnica
│   ├── CryptoHeatmapWidget.tsx        # Heatmap
│   └── CryptoScreenerWidget.tsx       # Screener
├── data/
│   └── news.json                      # Artigos persistidos
├── public/
│   └── images/                        # Assets
└── README.md
```

## 🔌 APIs e Integrações

### Blockchain
- **Solana Web3.js**: Conexão com blockchain Solana
- **Phantom Wallet**: Autenticação e transações
- **Token Address**: `3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump`

### Dados de Mercado
- **CoinGecko API**: Market cap, volume, dominância
- **Alternative.me API**: Fear & Greed Index
- **TradingView**: Gráficos e análise técnica embarcada

### Geração de Conteúdo
- **Templates em Markdown**: Artigos estruturados por categoria
- **Sistema de IDs únicos**: timestamp + random (base36)
- **Análise de sentimento**: Detecção automática de palavras-chave
- **Cache em memória**: 30 minutos de duração

## 🎯 Sistema de Geração de Artigos

### Como Gerar Novos Artigos

Para gerar artigos automaticamente, faça uma requisição POST:

```bash
curl -X POST https://tokenmilagre.xyz/api/generate-news \
  -H "Content-Type: application/json" \
  -d '{"count": 6}'
```

### Resposta de Exemplo

```json
{
  "success": true,
  "message": "6 artigos gerados com sucesso",
  "articles": [...],
  "total": 6
}
```

### Estrutura de um Artigo

```typescript
{
  id: string;              // ID único
  title: string;           // Título dinâmico
  summary: string;         // Resumo (200 chars)
  content: string;         // Artigo completo em Markdown
  url: string;             // URL fonte
  source: string;          // Nome da fonte
  publishedAt: string;     // ISO timestamp
  category: string[];      // Categorias
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];      // Keywords extraídas
}
```

## 📝 Configuração

### Variáveis de Ambiente

Copie `.env.local.example` para `.env.local`:

```bash
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_TOKEN_ADDRESS=3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump
```

### Dependências Principais

```json
{
  "next": "15.5.4",
  "react": "^19.0.0",
  "typescript": "^5",
  "@solana/web3.js": "^1.99.5",
  "react-markdown": "^9.0.1",
  "tailwindcss": "^4.1.0"
}
```

## 🚀 Deploy

### Vercel (Recomendado)

Este projeto está configurado para deploy automático via Vercel:

1. Conecte o repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push na branch `main`

### Build Manual

```bash
npm run build
npm start
```

## 📊 Métricas do Projeto

- **First Load JS**: ~102 KB (otimizado)
- **Rotas estáticas**: 9 páginas
- **Rotas dinâmicas**: 3 APIs
- **Tempo de build**: ~15-20s
- **Lighthouse Score**: 90+ (Performance, A11y, Best Practices)

## 🔗 Links Importantes

- **Token Contract**: [3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump](https://solscan.io/token/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump)
- **Website**: [tokenmilagre.xyz](https://tokenmilagre.xyz)
- **Comprar**: [Pump.fun](https://pump.fun/coin/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump)
- **Rede**: Solana Mainnet
- **Explorer**: Solscan

## 🛠️ Desenvolvimento

### Comandos Úteis

```bash
# Instalar dependências
npm install

# Dev server com hot reload
npm run dev

# Build de produção
npm run build

# Verificar tipos TypeScript
npm run type-check

# Lint do código
npm run lint

# Limpar cache
npm cache clean --force
```

### Estrutura de Commits

Este projeto segue conventional commits:

```
feat: Nova funcionalidade
fix: Correção de bug
docs: Atualização de documentação
style: Formatação de código
refactor: Refatoração
test: Testes
chore: Manutenção
```

## 📜 Licença

© 2025 by $MILAGRE Community. Todos os direitos reservados.

---

**Nunca estarás sozinho. ❤️**

*Desenvolvido com Claude Code & Next.js*
