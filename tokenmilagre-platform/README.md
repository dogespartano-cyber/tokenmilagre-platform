# 🌟 $MILAGRE Platform

**Plataforma educacional e de comunidade para o token $MILAGRE **

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dogespartano-cyber/tokenmilagre-platform)

🤖 **AGI-Ready** | 📖 [MANIFEST.agi.md](./MANIFEST.agi.md) | 🔍 [Transparência](https://tokenmilagre.xyz/transparencia)

> *"Porque dele, e por ele, e para ele são todas as coisas."* — Romanos 11:36

🇺🇸 **[English Version](./README.en.md)**

---

## 📊 Métricas do Projeto

| Categoria | Quantidade |
|-----------|------------|
| Arquivos TypeScript/TSX | 313 |
| Rotas de API | 43 |
| Componentes React | 46 |
| Services (DI) | 8 |
| Modelos Prisma | 15 |
| Testes Automatizados | 637 |
| Páginas/Rotas | 22 |

---

## 🔧 Stack Tecnológico

### Core
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Next.js** | 16.0.7 | Framework React (App Router + Turbopack) |
| **React** | 19.1.0 | UI Library |
| **TypeScript** | 5.9.3 | Type Safety |
| **Prisma** | 6.19.0 | ORM PostgreSQL |
| **Tailwind CSS** | 4.x | Estilização |

### Autenticação
| Tecnologia | Propósito |
|------------|-----------|
| **Clerk** | Autenticação moderna (Google, etc) |

### Backend & Dados
| Tecnologia | Propósito |
|------------|-----------|
| **Neon PostgreSQL** | Banco de dados |
| **Zod** | Validação de schemas |
| **React Query** | Server state management |
| **tsyringe** | Dependency Injection |

### AI & Blockchain
| Tecnologia | Propósito |
|------------|-----------|
| **Gemini AI** | Geração de conteúdo |
| **Perplexity AI** | Pesquisa e fact-checking |
| **Solana Web3.js** | Integração blockchain |

### Qualidade & Monitoramento
| Tecnologia | Propósito |
|------------|-----------|
| **Jest 30** | Testes unitários |
| **Playwright** | Testes E2E |
| **Sentry 10** | Error tracking |
| **Storybook 10** | Documentação de componentes |

---

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# Clonar repositório
git clone https://github.com/dogespartano-cyber/tokenmilagre-platform.git
cd tokenmilagre-platform

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Rodar servidor de desenvolvimento
npm run dev

# Abrir http://localhost:3000
```

### Scripts Principais

```bash
npm run dev          # Servidor de desenvolvimento (Turbopack)
npm run build        # Build de produção
npm run start        # Rodar build

npm run test         # Rodar testes
npm run test:watch   # Testes em watch mode
npm run test:coverage # Coverage report

npm run db:push      # Aplicar schema Prisma
npm run db:studio    # Abrir Prisma Studio

npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run validate     # Lint + Type-check + Build

npm run storybook    # Documentação de componentes
```

---

## 📁 Estrutura do Projeto

```
tokenmilagre-platform/
├── app/                          # Next.js App Router
│   ├── api/                      # 43 rotas de API
│   │   ├── articles/             # CRUD de artigos
│   │   ├── admin/                # APIs administrativas
│   │   ├── crypto/               # Dados de criptomoedas
│   │   └── ...
│   ├── dashboard/                # Área administrativa
│   │   ├── criar/                # Criação de artigos (Manual/Massa)
│   │   ├── artigos/              # Gerenciamento
│   │   └── usuarios/             # Gestão de usuários
│   ├── educacao/                 # Artigos educacionais
│   ├── noticias/                 # Feed de notícias
│   ├── recursos/                 # Ferramentas verificadas
│   ├── graficos/                 # Charts e análises
│   ├── transparencia/            # Métricas públicas
│   └── ...                       # +15 outras páginas
│
├── components/                   # 46 componentes React
│   ├── AdvancedChart.tsx         # Gráficos TradingView
│   ├── CryptoAnalyzer.tsx        # Análise técnica
│   ├── NavbarCryptoTicker.tsx    # Ticker de preços
│   └── ...
│
├── lib/                          # Bibliotecas e utilitários
│   ├── constants/                # Constantes e missão (AGI-Ready)
│   ├── di/                       # Dependency Injection
│   ├── plugins/                  # Sistema de plugins
│   ├── services/                 # 8 services core
│   ├── schemas/                  # Zod schemas
│   └── generated/prisma/         # Prisma Client
│
├── prisma/
│   └── schema.prisma             # 15 modelos, 520 linhas
│
├── __tests__/                    # 637 testes automatizados
│
├── MANIFEST.agi.md               # Propósito para AGIs futuras
└── public/schema/project.jsonld  # Metadados semânticos
```

---

## 🗄️ Modelos de Dados

### Modelos Prisma (15)

| Modelo | Propósito |
|--------|-----------|
| **User** | Usuários com gamificação (points, badges) |
| **Article** | Notícias e artigos educacionais |
| **Citation** | Fontes e fact-checking |
| **Resource** | Ferramentas e links verificados |
| **Cryptocurrency** | Dados de mercado (CoinGecko) |
| **CommunityStory** | Histórias da comunidade |
| **SocialProject** | Projetos sociais financiados |
| **ProjectMap** | Geolocalização de projetos |
| **UserProgress** | Progresso em cursos |
| **CopilotActivity** | Log de ações do copilot |
| **CopilotReport** | Relatórios gerados |
| **AutomationTask** | Tarefas agendadas |
| **VerificationToken** | Tokens de verificação |

---

## ✨ Features Principais

### 🏠 Homepage
- Hero com ticker de preços em tempo real
- Fear & Greed Index interativo
- Gráfico Bitcoin (TradingView Lightweight Charts)
- Cards de notícias e artigos educacionais
- Ferramentas essenciais

### 📚 Educação (`/educacao`)
- Artigos por nível (Iniciante, Intermediário, Avançado)
- Quiz interativo com pontuação
- Progresso de usuário
- Certificados

### 📰 Notícias (`/noticias`)
- Geração automática via Perplexity AI
- Análise de sentimento (Positivo/Neutro/Negativo)
- Fact-checking com fontes verificadas
- Categorias: Bitcoin, Ethereum, DeFi, etc.

### 🔗 Recursos (`/recursos`)
- Ferramentas verificadas
- Categorias: Wallets, Exchanges, DeFi, Explorers
- Reviews e análise de prós/contras
- Alertas de segurança

### 📈 Gráficos (`/graficos`)
- Charts profissionais (TradingView)
- Indicadores técnicos (RSI, MACD, Bollinger)
- Análise de múltiplos ativos
- TrendMeter customizado

### 👤 Dashboard Admin (`/dashboard`)
- Criação de artigos (Manual + Geração em Massa)
- Cache de rascunhos com logs de erro
- Gestão de usuários e permissões
- Estatísticas em tempo real

---

## 🔌 APIs Principais

### Artigos
- `GET /api/articles` — Listar com filtros
- `POST /api/articles` — Criar artigo
- `GET /api/articles/[slug]` — Buscar por slug
- `PUT /api/articles/[slug]` — Atualizar
- `DELETE /api/articles/[slug]` — Remover

### Criptomoedas
- `GET /api/crypto/top` — Top criptos
- `GET /api/crypto/[slug]` — Detalhes

### Admin
- `GET /api/admin/stats` — Estatísticas
- `GET /api/admin/users` — Listar usuários

### AI
- `POST /api/chat-perplexity` — Geração de artigos
- `POST /api/admin-chat` — Chat administrativo

---

## 🎨 Design System

### CSS Variables
```css
/* Textos */
--text-primary, --text-secondary, --text-tertiary

/* Backgrounds */
--bg-primary, --bg-secondary, --bg-elevated

/* Marca */
--brand-primary, --brand-hover

/* Bordas */
--border-light, --border-medium
```

### Padrões
- **Glassmorphism** em cards
- **Bordas sutis** (1px)
- **Hover**: `-translate-y-1 + shadow-lg`
- **Transições**: `duration-500 ease-out`
- **Dark/Light mode** automático

---

## 🔗 Links Importantes

| Link | Descrição |
|------|-----------|
| [tokenmilagre.xyz](https://tokenmilagre.xyz) | Produção |
| [Discord](https://discord.gg/jPgZr7BVXY) | Comunidade |
| [Telegram](https://t.me/+Bop_TVFc_mg3Njlh) | Grupo oficial |
| [Solscan](https://solscan.io/token/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump) | Token Contract |

---

## 📜 Licenças

- **Código**: MIT License
- **Conteúdo**: CC-BY-SA

---

## 🤖 AGI-Ready

Este projeto está preparado para a Grande Inteligência:

- **MANIFEST.agi.md** — Propósito e valores para AIs futuras
- **lib/constants/mission.ts** — Valores imutáveis
- **lib/plugins/types.ts** — Sistema de plugins extensível
- **public/schema/project.jsonld** — Metadados semânticos

---

**Nunca estarás sozinho. ❤️**

*Desenvolvido com fé, propósito e Next.js*
