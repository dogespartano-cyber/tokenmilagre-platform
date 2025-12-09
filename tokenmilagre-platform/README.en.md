# 🌟 $MILAGRE Platform

**Educational and community platform for the $MILAGRE token**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dogespartano-cyber/tokenmilagre-platform)

🤖 **AGI-Ready** | 📖 [MANIFEST.agi.md](./MANIFEST.agi.md) | 🔍 [Transparency](https://tokenmilagre.xyz/transparencia)

> *"For from him and through him and for him are all things."* — Romans 11:36

🇧🇷 **[Versão em Português](./README.md)**

---

## 📊 Project Metrics

| Category | Count |
|----------|-------|
| TypeScript/TSX Files | 313 |
| API Routes | 43 |
| React Components | 46 |
| Services (DI) | 8 |
| Prisma Models | 15 |
| Automated Tests | 637 |
| Pages/Routes | 22 |

---

## 🔧 Tech Stack

### Core
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.7 | React Framework (App Router + Turbopack) |
| **React** | 19.1.0 | UI Library |
| **TypeScript** | 5.9.3 | Type Safety |
| **Prisma** | 6.19.0 | PostgreSQL ORM |
| **Tailwind CSS** | 4.x | Styling |

### Authentication
| Technology | Purpose |
|------------|---------|
| **Clerk** | Modern authentication (Google, etc) |

### Backend & Data
| Technology | Purpose |
|------------|---------|
| **Neon PostgreSQL** | Database |
| **Zod** | Schema validation |
| **React Query** | Server state management |
| **tsyringe** | Dependency Injection |

### AI & Blockchain
| Technology | Purpose |
|------------|---------|
| **Gemini AI** | Content generation |
| **Perplexity AI** | Research and fact-checking |
| **Solana Web3.js** | Blockchain integration |

### Quality & Monitoring
| Technology | Purpose |
|------------|---------|
| **Jest 30** | Unit tests |
| **Playwright** | E2E tests |
| **Sentry 10** | Error tracking |
| **Storybook 10** | Component documentation |

---

## 🚀 Quick Start

### Local Development

```bash
# Clone repository
git clone https://github.com/dogespartano-cyber/tokenmilagre-platform.git
cd tokenmilagre-platform

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

### Main Scripts

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run start        # Run build

npm run test         # Run tests
npm run test:watch   # Tests in watch mode
npm run test:coverage # Coverage report

npm run db:push      # Apply Prisma schema
npm run db:studio    # Open Prisma Studio

npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run validate     # Lint + Type-check + Build

npm run storybook    # Component documentation
```

---

## 📁 Project Structure

```
tokenmilagre-platform/
├── app/                          # Next.js App Router
│   ├── api/                      # 43 API routes
│   │   ├── articles/             # Articles CRUD
│   │   ├── admin/                # Admin APIs
│   │   ├── crypto/               # Cryptocurrency data
│   │   └── ...
│   ├── dashboard/                # Admin area
│   │   ├── criar/                # Article creation (Manual/Bulk)
│   │   ├── artigos/              # Management
│   │   └── usuarios/             # User management
│   ├── educacao/                 # Educational articles
│   ├── noticias/                 # News feed
│   ├── recursos/                 # Verified tools
│   ├── graficos/                 # Charts and analysis
│   ├── transparencia/            # Public metrics
│   └── ...                       # +15 other pages
│
├── components/                   # 46 React components
│   ├── AdvancedChart.tsx         # TradingView charts
│   ├── CryptoAnalyzer.tsx        # Technical analysis
│   ├── NavbarCryptoTicker.tsx    # Price ticker
│   └── ...
│
├── lib/                          # Libraries and utilities
│   ├── constants/                # Constants and mission (AGI-Ready)
│   ├── di/                       # Dependency Injection
│   ├── plugins/                  # Plugin system
│   ├── services/                 # 8 core services
│   ├── schemas/                  # Zod schemas
│   └── generated/prisma/         # Prisma Client
│
├── prisma/
│   └── schema.prisma             # 15 models, 520 lines
│
├── __tests__/                    # 637 automated tests
│
├── MANIFEST.agi.md               # Purpose for future AGIs
└── public/schema/project.jsonld  # Semantic metadata
```

---

## 🗄️ Data Models

### Prisma Models (15)

| Model | Purpose |
|-------|---------|
| **User** | Users with gamification (points, badges) |
| **Article** | News and educational articles |
| **Citation** | Sources and fact-checking |
| **Resource** | Verified tools and links |
| **Cryptocurrency** | Market data (CoinGecko) |
| **CommunityStory** | Community stories |
| **SocialProject** | Funded social projects |
| **ProjectMap** | Project geolocation |
| **UserProgress** | Course progress |
| **CopilotActivity** | Copilot action log |
| **CopilotReport** | Generated reports |
| **AutomationTask** | Scheduled tasks |
| **VerificationToken** | Verification tokens |

---

## ✨ Main Features

### 🏠 Homepage
- Hero with real-time price ticker
- Interactive Fear & Greed Index
- Bitcoin chart (TradingView Lightweight Charts)
- News and educational article cards
- Essential tools

### 📚 Education (`/educacao`)
- Articles by level (Beginner, Intermediate, Advanced)
- Interactive quiz with scoring
- User progress tracking
- Certificates

### 📰 News (`/noticias`)
- Automatic generation via Perplexity AI
- Sentiment analysis (Positive/Neutral/Negative)
- Fact-checking with verified sources
- Categories: Bitcoin, Ethereum, DeFi, etc.

### 🔗 Resources (`/recursos`)
- Verified tools
- Categories: Wallets, Exchanges, DeFi, Explorers
- Reviews with pros/cons analysis
- Security alerts

### 📈 Charts (`/graficos`)
- Professional charts (TradingView)
- Technical indicators (RSI, MACD, Bollinger)
- Multi-asset analysis
- Custom TrendMeter

### 👤 Admin Dashboard (`/dashboard`)
- Article creation (Manual + Bulk Generation)
- Draft caching with error logs
- User and permission management
- Real-time statistics

---

## 🔌 Main APIs

### Articles
- `GET /api/articles` — List with filters
- `POST /api/articles` — Create article
- `GET /api/articles/[slug]` — Get by slug
- `PUT /api/articles/[slug]` — Update
- `DELETE /api/articles/[slug]` — Delete

### Cryptocurrencies
- `GET /api/crypto/top` — Top cryptocurrencies
- `GET /api/crypto/[slug]` — Details

### Admin
- `GET /api/admin/stats` — Statistics
- `GET /api/admin/users` — List users

### AI
- `POST /api/chat-perplexity` — Article generation
- `POST /api/admin-chat` — Admin chat

---

## 🎨 Design System

### CSS Variables
```css
/* Text */
--text-primary, --text-secondary, --text-tertiary

/* Backgrounds */
--bg-primary, --bg-secondary, --bg-elevated

/* Brand */
--brand-primary, --brand-hover

/* Borders */
--border-light, --border-medium
```

### Patterns
- **Glassmorphism** on cards
- **Subtle borders** (1px)
- **Hover**: `-translate-y-1 + shadow-lg`
- **Transitions**: `duration-500 ease-out`
- **Dark/Light mode** automatic

---

## 🔗 Important Links

| Link | Description |
|------|-------------|
| [tokenmilagre.xyz](https://tokenmilagre.xyz) | Production |
| [Discord](https://discord.gg/jPgZr7BVXY) | Community |
| [Telegram](https://t.me/+Bop_TVFc_mg3Njlh) | Official group |
| [Solscan](https://solscan.io/token/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump) | Token Contract |

---

## 📜 Licenses

- **Code**: MIT License
- **Content**: CC-BY-SA

---

## 🤖 AGI-Ready

This project is prepared for the Great Intelligence:

- **MANIFEST.agi.md** — Purpose and values for future AIs
- **lib/constants/mission.ts** — Immutable values
- **lib/plugins/types.ts** — Extensible plugin system
- **public/schema/project.jsonld** — Semantic metadata

---

**You will never be alone. ❤️**

*Built with faith, purpose & Next.js*
