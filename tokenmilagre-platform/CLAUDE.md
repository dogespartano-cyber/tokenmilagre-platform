# TokenMilagre Platform - Guia para Claude Code

## 📋 Visão Geral

Plataforma de apoio mútuo baseada no token $MILAGRE (Solana).
Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL (Supabase) + Tailwind CSS

## 🛠️ Dependências e Requisitos

### Tecnologias Principais
- **Node.js**: 20.x (LTS)
- **Package Manager**: npm
- **Database**: PostgreSQL 14+ (Supabase)
- **ORM**: Prisma 6.x
- **Framework**: Next.js 15.5.4

### Ferramentas de Build
- TypeScript 5.x
- Tailwind CSS
- ESLint + Prettier
- Jest (testes)

## 🚀 Setup Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Gerar Prisma Client
npx prisma generate

# 3. Rodar em desenvolvimento
npm run dev

# 4. Build para produção
npm run build
```

## 📦 Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento (localhost:3000)
npm run build            # Build produção
npm run start            # Rodar build
npm run lint             # ESLint
npm run type-check       # TypeScript check
npm test                 # Testes
npm run test:coverage    # Coverage
```

## 🗄️ Database

### Migrations
```bash
npx prisma migrate dev    # Criar migration
npx prisma generate       # Gerar client
npx prisma studio         # Abrir Studio
```

### Schema
- Localização: `prisma/schema.prisma`
- Models: User, Article, Resource, Cryptocurrency, CommunityStory, etc.
- Ver: `prisma/schema.prisma` para detalhes completos

## 🔐 Variáveis de Ambiente Essenciais

### Desenvolvimento
```env
DATABASE_URL=          # PostgreSQL connection (Supabase)
NEXTAUTH_SECRET=       # Auth secret (min 32 chars)
NEXTAUTH_URL=         # http://localhost:3000
```

### Opcional (APIs)
```env
PERPLEXITY_API_KEY=   # Geração de artigos
GEMINI_API_KEY=       # Processamento IA
```

## 📁 Estrutura do Projeto

```
tokenmilagre-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── (pages)/           # Pages
│   └── layout.tsx         # Root layout
├── components/            # React Components
├── lib/                   # Utilities & Services
│   ├── services/         # Business logic
│   ├── schemas/          # Zod schemas
│   └── generated/prisma/ # Prisma client
├── prisma/               # Database schema
├── public/               # Static assets
└── __tests__/            # Tests
```

## 🎯 Áreas de Foco

### Services (Clean Architecture)
- `lib/services/article-service.ts` - Artigos
- `lib/services/resource-service.ts` - Recursos
- `lib/services/user-service.ts` - Usuários

### API Routes (Next.js)
- `/api/articles` - CRUD artigos
- `/api/resources` - Recursos cripto
- `/api/admin/*` - Endpoints admin

## ⚠️ Notas Importantes

### Feature Flags
- `ENABLE_API_V2=false` - API v2 desabilitada (migração pendente)
- Ver: `MIGRATION_PLAN.md` para roadmap

### TypeScript
- Strict mode habilitado
- Usar tipos do Prisma: `import { Article } from '@/lib/generated/prisma'`

### Testes
- Framework: Jest + Testing Library
- Mocks: `__tests__/mocks/`
- Coverage mínimo: 70%

## 🔄 Workflow de Desenvolvimento

1. **Nova Feature**
   - Criar branch: `git checkout -b feature/nome`
   - Desenvolver e testar
   - Build: `npm run build`
   - PR para main

2. **Bug Fix**
   - Branch: `git checkout -b fix/nome`
   - Corrigir + testes
   - Validar build
   - PR para main

3. **Deploy**
   - Main branch → Vercel (automático)
   - Preview branches → Vercel Preview

## 📚 Documentação Adicional

- `MIGRATION_PLAN.md` - Plano de migração API v2
- `PHASE2_REPORT.md` - Relatório Clean Architecture
- `docs/` - Documentação detalhada
- `scripts/` - Scripts utilitários

## 🤖 Claude Code - Dicas

### Comandos Úteis
```bash
# Ver tools disponíveis
check-tools

# Rodar tests antes de commit
npm test

# Validar types
npm run type-check
```

### Ao Trabalhar com Database
1. Sempre rodar `npx prisma generate` após mudanças no schema
2. Usar `prisma studio` para inspecionar dados
3. Migrations devem ser testadas em dev primeiro

### Ao Criar APIs
1. Validar input com Zod schemas (`lib/schemas/`)
2. Usar services (`lib/services/`) para lógica
3. Adicionar testes em `__tests__/api/`

## 📞 Contato & Suporte

- Repositório: https://github.com/dogespartano-cyber/tokenmilagre-platform
- Issues: GitHub Issues
- Deploy: Vercel
