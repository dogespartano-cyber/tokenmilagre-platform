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
- **Gráficos:** TradingView Widgets + Lightweight Charts
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
- ✅ **TradingView Ticker Tape** horizontal (BTC, ETH, SOL)
- ✅ **Gráfico Bitcoin Avançado** com indicadores técnicos:
  - SMA 20 e SMA 50 (Médias Móveis)
  - Bandas de Bollinger
  - RSI (Relative Strength Index)
- ✅ **3 Gráficos Lightweight Charts** profissionais (BTC, ETH, SOL)
  - Candlesticks com cores fortes (verde/vermelho)
  - Volume bars sincronizados
  - Timeframes: 15m, 4h, 1d
  - Dados em tempo real da Binance API
- ✅ 3 Widgets de Análise Técnica (RSI, MACD, Médias Móveis)
- ✅ Crypto Heatmap (visão geral do mercado)
- ✅ Market Screener (tabela de todas criptos)
- ✅ Market Insights em tempo real:
  - Fear & Greed Index (via Alternative.me)
  - Altcoin Season Index
  - Métricas de mercado (Market Cap, Volume 24h, Dominância BTC/ETH)
- ✅ Links úteis (CoinGecko, DeFi Llama, CoinMarketCap)

#### Sistema de Notícias Cripto
- ✅ **Workflow Perplexity + Claude Code** (conteúdo verificado)
- ✅ Artigos completos em Markdown (500-1500 palavras)
- ✅ Fontes REAIS e verificáveis
- ✅ Páginas dinâmicas `/dashboard/noticias/[slug]`
- ✅ Filtros por categoria (Bitcoin, Ethereum, Solana, DeFi, NFTs, Regulação)
- ✅ Análise de sentimento (🟢 Positivo, 🟡 Neutro, 🔴 Negativo)
- ✅ Cards clicáveis com "Leia mais"
- ✅ URLs amigáveis (slug-based)
- ✅ Interface de leitura otimizada com prose styling
- ✅ Armazenamento em `data/news.json`

### 🎨 UI/UX
- ✅ Design glassmorphism (backdrop-blur + transparências)
- ✅ Sidebar navegação sticky/fixa
- ✅ Botões de ação estratégicos ("Comprar $MILAGRE")
- ✅ Logos consistentes em todas as páginas
- ✅ Animações suaves e transições
- ✅ Estados de loading e empty states
- ✅ Backgrounds transparentes para integração com gradiente

## 📁 Estrutura do Projeto

```
tokenmilagre-platform/
├── app/
│   ├── api/
│   │   ├── news/route.ts              # API de notícias com cache
│   │   └── process-news/route.ts      # Processamento de notícias
│   ├── dashboard/
│   │   ├── layout.tsx                 # Layout com sidebar
│   │   ├── page.tsx                   # Portfolio tracker
│   │   ├── mercado/page.tsx           # Análise de mercado
│   │   ├── noticias/
│   │   │   ├── page.tsx               # Listagem de notícias
│   │   │   └── [slug]/page.tsx        # Artigo completo
│   ├── manifesto/page.tsx             # Página do manifesto
│   ├── page.tsx                       # Homepage
│   └── layout.tsx                     # Root layout
├── components/
│   ├── AdvancedChart.tsx              # 🆕 Chart BTC com indicadores
│   ├── LightweightChart.tsx           # 🆕 Charts profissionais
│   ├── TickerTapeWidget.tsx           # 🆕 Ticker horizontal
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
- **Binance API**: Dados de candlesticks e volume em tempo real
- **CoinGecko API**: Market cap, volume, dominância
- **Alternative.me API**: Fear & Greed Index
- **TradingView**: Gráficos e análise técnica embarcada

### Gráficos Profissionais
- **Lightweight Charts v5.0.9**: Biblioteca TradingView para gráficos avançados
- **Indicadores Técnicos**:
  - SMA (Simple Moving Average) 20 e 50 períodos
  - Bollinger Bands (20 períodos, 2 desvios padrão)
  - RSI (Relative Strength Index, 14 períodos)
- **Timeframes**: 15 minutos, 4 horas, 1 dia
- **Fonte de Dados**: Binance Klines API

## 🎯 Sistema de Criação de Artigos

### Workflow Recomendado (Perplexity + Claude Code)

Este é o método mais eficiente e confiável para criar artigos de notícias:

#### 1. Pesquisa com Perplexity Pro
```
Prompt: "Pesquise notícias recentes sobre [tema] em fontes confiáveis de criptomoedas.
Inclua dados verificáveis e cite as fontes."
```

**Vantagens:**
- ✅ Fontes REAIS e verificáveis
- ✅ Fact-checking automático
- ✅ Múltiplas fontes citadas
- ✅ Dados atualizados

#### 2. Formatação com Claude Code

Cole o texto do Perplexity no Claude Code e peça:
```
"Formate este conteúdo como artigo para o $MILAGRE seguindo o padrão:
- Sentimento: [positive/neutral/negative]
- Keywords: [lista]
- Categorias: [Bitcoin, Ethereum, etc]"
```

Claude irá:
- ✅ Estruturar o JSON
- ✅ Adicionar metadata
- ✅ Gerar slug amigável
- ✅ Fazer commit automático

#### 3. Commit & Deploy
```bash
# Claude Code faz automaticamente:
git add data/news.json
git commit -m "feat: Novo artigo sobre [tema]"
git push
```

### Estrutura de um Artigo

```typescript
{
  id: string;              // ID único
  slug: string;            // URL amigável
  title: string;           // Título
  summary: string;         // Resumo (200 chars)
  content: string;         // Artigo em Markdown
  url: string;             // "#" para artigos próprios
  source: string;          // "$MILAGRE Research"
  publishedAt: string;     // ISO timestamp
  category: string[];      // Categorias
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];      // Keywords extraídas
}
```

### Comparação de Métodos

| Método | Tokens Claude | Fontes | Fact-check | Custo |
|--------|---------------|--------|------------|-------|
| **Perplexity + Claude** | ~10k | ✅ Reais | ✅ Auto | $ |
| Claude + Gemini MCP | ~41k | ❌ Fictícias | ❌ Não | $$ |
| Manual | ~8k | ✅ Reais | Manual | $ |

**Recomendado**: Perplexity + Claude (melhor custo-benefício + fontes verificáveis)

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
  "tailwindcss": "^4.1.0",
  "lightweight-charts": "^5.0.9"
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

- **First Load JS**: ~120 KB (com lightweight-charts)
- **Rotas estáticas**: 9 páginas
- **Rotas dinâmicas**: 2 APIs
- **Tempo de build**: ~15-20s
- **Lighthouse Score**: 90+ (Performance, A11y, Best Practices)

## 🔗 Links Importantes

- **Token Contract**: [3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump](https://solscan.io/token/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump)
- **Website**: [tokenmilagre.xyz](https://tokenmilagre.xyz)
- **Comprar**: [Pump.fun](https://pump.fun/coin/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump)
- **Rede**: Solana Mainnet
- **Explorer**: Solscan

## 📋 Histórico de Implementações

### Últimas Atualizações (Outubro 2025)

#### ✅ **Remoção do Gemini + Workflow Perplexity** (04/10/2025)
- Removido sistema de geração com Gemini MCP
- Implementado workflow Perplexity + Claude Code
- Redução de ~70% no consumo de tokens
- Fontes REAIS e verificáveis
- Documentação atualizada

#### ✅ **Gráficos Profissionais com Lightweight Charts** (04/10/2025)
- AdvancedChart com SMA 20/50, Bollinger Bands e RSI
- LightweightChart para BTC, ETH, SOL
- TickerTapeWidget horizontal
- Integração com Binance API
- Backgrounds transparentes
- Timeframes múltiplos (15m, 4h, 1d)

#### ✅ **UX de Notícias Melhorada** (04/10/2025)
- URLs amigáveis com slugs
- Cards clicáveis
- Sentimento em português ("Notícia otimista/pessimista/neutra")
- Fonte "$MILAGRE Research" transparente
- Nota de transparência em artigos gerados por IA

#### ✅ **Sistema de Notícias Completo** (03/10/2025)
- API `/api/news` com cache
- Páginas dinâmicas `/dashboard/noticias/[slug]`
- Filtros por categoria
- Interface de leitura otimizada

#### ✅ **Dashboard de Mercado** (02/10/2025)
- 3 Gráficos TradingView (BTC, ETH, SOL)
- 3 Widgets de Análise Técnica
- Crypto Heatmap e Screener
- Fear & Greed Index
- Métricas de mercado em tempo real

#### ✅ **Manifesto $MILAGRE** (01/10/2025)
- Página dedicada com 12 seções
- Sistema de assinatura
- Contador de signatários
- Navegação lateral com scroll

#### ✅ **Portfolio Tracker** (30/09/2025)
- Integração Phantom Wallet
- Sistema de tiers/badges
- Exibição de saldos $MILAGRE e SOL
- Link para Solscan

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
