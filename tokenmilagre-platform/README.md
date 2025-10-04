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

#### Sistema de Notícias Cripto com IA (Gemini 2.5 Pro)
- ✅ **Integração completa com Google Gemini 2.5 Pro**
- ✅ **Geração de notícias REAIS do mercado cripto**
- ✅ Busca automática de notícias atualizadas via Gemini
- ✅ Artigos completos em Markdown (500-800 palavras)
- ✅ Templates profissionais por categoria:
  - Bitcoin: Análise técnica + fundamentos + previsões
  - Ethereum: Updates + ecossistema + próximos upgrades
  - Solana: Performance + crescimento + TVL
  - DeFi: Protocolos + inovações + yields
  - NFTs: Mercado + casos de uso + vendas recordes
  - Regulação: Framework global + SEC + compliance
- ✅ Páginas dinâmicas `/dashboard/noticias/[id]`
- ✅ Filtros por categoria (Bitcoin, Ethereum, Solana, DeFi, NFTs, Regulação)
- ✅ Análise de sentimento automática (🟢 Positivo, 🟡 Neutro, 🔴 Negativo)
- ✅ Extração inteligente de keywords com IA
- ✅ Sistema de cache (30 minutos)
- ✅ Armazenamento persistente em `data/news.json`
- ✅ Interface de leitura otimizada com prose styling
- ✅ Fontes verificadas (CoinDesk, Cointelegraph, Exame, InfoMoney)

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
│   │   ├── generate-news/route.ts     # Gerador com Gemini 2.5 Pro
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
├── lib/
│   └── gemini-news.ts                 # 🆕 Integração Gemini CLI
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

### Inteligência Artificial (Gemini)
- **Google Gemini 2.5 Pro**: Modelo principal para geração de conteúdo
- **Gemini CLI**: Integração via linha de comando
- **Busca de notícias reais**: Pesquisa automática no mercado cripto
- **Geração de artigos**: Conteúdo markdown estruturado e profissional
- **Análise de sentimento**: Classificação automática (positivo/neutro/negativo)
- **Extração de keywords**: Identificação inteligente de termos relevantes
- **Múltiplas fontes**: CoinDesk, Cointelegraph, Exame, InfoMoney, The Block

### Geração de Conteúdo
- **Templates em Markdown**: Artigos estruturados por categoria
- **Sistema de IDs únicos**: timestamp + random (base36)
- **Cache em memória**: 30 minutos de duração
- **Fallback inteligente**: Templates padrão caso IA falhe

## 🎯 Sistema de Geração de Artigos com IA

### Como Funciona

1. **Seleção de Tópicos**: Escolhe aleatoriamente tópicos do mercado cripto
2. **Busca com Gemini**: Pesquisa notícias reais usando Gemini 2.5 Pro
3. **Geração de Artigo**: Cria conteúdo completo em markdown
4. **Persistência**: Salva em `data/news.json`
5. **Cache**: Armazena por 30 minutos

### Tópicos Suportados

- Bitcoin: análises de preço e tendências
- Ethereum: atualizações e upgrades
- Solana: desenvolvimentos no ecossistema
- DeFi: protocolos e inovações
- NFTs: tendências de mercado
- Regulação: novidades regulatórias
- Blockchain: avanços tecnológicos
- Altcoins: análise de mercado

### Como Gerar Novos Artigos

**Via API (POST):**
```bash
curl -X POST https://tokenmilagre.xyz/api/generate-news \
  -H "Content-Type: application/json" \
  -d '{"count": 6}'
```

**Via Gemini CLI (direto):**
```bash
gemini -m gemini-2.5-pro -p "Busque uma notícia sobre Bitcoin de hoje"
```

### Resposta de Exemplo

```json
{
  "success": true,
  "message": "6 artigos gerados com sucesso",
  "articles": [
    {
      "id": "unique_id",
      "title": "Bitcoin ultrapassa $120K com previsão do Citi...",
      "summary": "Resumo do artigo...",
      "content": "# Artigo completo em markdown...",
      "source": "CoinDesk",
      "sentiment": "positive",
      "keywords": ["Bitcoin", "Citi", "ETF"]
    }
  ],
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

### Requisitos para IA (Gemini)

Para usar o gerador de notícias com Gemini, você precisa:

1. **Instalar Gemini CLI**:
```bash
npm install -g @google/gemini-cli
```

2. **Autenticar**:
```bash
gemini
# Seguir fluxo OAuth
```

3. **Configurar modelo padrão** (opcional):
```bash
# Editar ~/.gemini/settings.json
{
  "model": "gemini-2.5-pro"
}
```

4. **Testar integração**:
```bash
gemini -m gemini-2.5-pro -p "Olá, teste"
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

## 📋 Histórico de Implementações

### Últimas Atualizações (Outubro 2025)

#### ✅ **Integração Gemini 2.5 Pro** (04/10/2025)
- Criado módulo `lib/gemini-news.ts` para integração com Gemini CLI
- Substituído gerador mock por IA real
- Função `fetchNewsWithGemini()` busca notícias atualizadas
- Função `generateFullArticle()` cria conteúdo markdown completo
- Suporte a múltiplas fontes verificadas
- Análise automática de sentimento e keywords

#### ✅ **Sistema de Notícias Completo** (03/10/2025)
- API `/api/generate-news` para geração automática
- API `/api/news` com cache de 30 minutos
- Páginas dinâmicas `/dashboard/noticias/[id]`
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
