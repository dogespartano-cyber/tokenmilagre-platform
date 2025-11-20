# 🚀 Quick Start - Token Milagre Platform

**Tempo estimado:** 15-20 minutos

Guia rápido para configurar seu ambiente de desenvolvimento e começar a contribuir.

---

## 📋 Checklist Inicial

- [ ] Node.js 18+ instalado
- [ ] npm 9+ instalado
- [ ] Git configurado
- [ ] Editor de código (VS Code recomendado)
- [ ] Acesso ao repositório GitHub

---

## 1️⃣ Setup do Ambiente (5 min)

### Clone e Instale

```bash
# Clone o repositório
git clone https://github.com/dogespartano-cyber/tokenmilagre-platform.git
cd tokenmilagre-platform

# Instale as dependências
npm install
```

### Configure Variáveis de Ambiente

```bash
# Copie o exemplo
cp .env.example .env.local

# Edite .env.local com suas credenciais
# Mínimo necessário:
DATABASE_URL="postgresql://user:password@localhost:5432/tokenmilagre"
DIRECT_URL="postgresql://user:password@localhost:5432/tokenmilagre"
```

**Alternativa Cloud (Recomendado):**
Use Neon PostgreSQL (grátis): https://neon.tech

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require"
```

---

## 2️⃣ Database Setup (3 min)

```bash
# Gere o Prisma Client
npx prisma generate

# Aplique o schema ao banco
npx prisma db push

# (Opcional) Popule com dados de exemplo
npx tsx prisma/seed.ts
```

**Verifique se funcionou:**
```bash
# Abra o Prisma Studio
npm run db:studio
```

Você deve ver as tabelas: `User`, `Article`, `Category`, `Tag`

---

## 3️⃣ Rode o Servidor (2 min)

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

**Acesse:** http://localhost:3000

Você deve ver a homepage do Token Milagre Platform.

---

## 4️⃣ Rode os Testes (3 min)

```bash
# Rode todos os testes
npm test

# Esperado:
# Test Suites: 5 passed
# Tests: 167 passed
# Coverage: 98%+
```

Se os testes passarem, seu ambiente está 100% configurado! ✅

---

## 5️⃣ Primeiro Commit (5 min)

### Crie uma Branch

```bash
# Padrão: tipo/descricao-curta
git checkout -b feat/minha-primeira-feature
```

**Tipos de branch:**
- `feat/` - Nova funcionalidade
- `fix/` - Correção de bug
- `docs/` - Documentação
- `refactor/` - Refatoração
- `test/` - Testes
- `chore/` - Tarefas de manutenção

### Faça uma Mudança Simples

```bash
# Exemplo: Adicione um comentário em um arquivo
echo "// Minha contribuição" >> lib/constants/pagination.ts

# Verifique a mudança
git diff
```

### Commit

```bash
# Adicione as mudanças
git add .

# Commit seguindo o padrão
git commit -m "docs: Add comment to pagination constants"
```

**Padrão de commit:**
```
tipo(escopo): descrição curta

[corpo opcional]

[footer opcional]
```

**Exemplos:**
```bash
git commit -m "feat(articles): Add bulk delete operation"
git commit -m "fix(auth): Resolve session timeout issue"
git commit -m "docs(readme): Update architecture diagram"
```

### Push

```bash
# Push para o remote
git push -u origin feat/minha-primeira-feature
```

---

## 6️⃣ Estrutura do Projeto (Referência Rápida)

```
tokenmilagre-platform/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── articles/       # Artigos (v1 - legado)
│   │   └── admin/          # Admin endpoints
│   ├── dashboard/          # Dashboard pages
│   ├── educacao/           # Educação
│   └── page.tsx            # Homepage
│
├── lib/                     # Lógica de negócio
│   ├── services/           # Services (Clean Architecture)
│   │   ├── logger-service.ts
│   │   ├── error-service.ts
│   │   ├── validation-service.ts
│   │   └── article-service.ts
│   ├── di/                 # Dependency Injection
│   │   └── container.ts
│   ├── helpers/            # Helpers reutilizáveis
│   │   ├── auth-helpers.ts
│   │   └── response-helpers.ts
│   ├── adapters/           # External API adapters
│   ├── schemas/            # Zod validation schemas
│   └── constants/          # Constantes centralizadas
│
├── components/              # React Components
├── prisma/                  # Prisma ORM
│   └── schema.prisma       # Database schema
│
├── docs/                    # Documentação
│   ├── ARCHITECTURE.md
│   ├── NEW_SYSTEM_ARCHITECTURE.md
│   ├── TEST_PLAN.md
│   └── ...
│
└── scripts/                 # Utility scripts
    └── quality/            # Quality checks
```

---

## 7️⃣ Comandos Essenciais

### Desenvolvimento
```bash
npm run dev              # Dev server (http://localhost:3000)
npm run build            # Build para produção
npm start                # Roda o build
```

### Database
```bash
npm run db:push          # Aplica schema ao banco
npm run db:studio        # Abre Prisma Studio (GUI)
npm run db:seed          # Popula com dados de exemplo
```

### Qualidade
```bash
npm run lint             # ESLint
npm run lint:fix         # Fix automático
npm run type-check       # TypeScript check
npm test                 # Roda testes
npm test -- --coverage   # Testes com coverage
npm run check:all        # Roda todas as verificações
```

---

## 8️⃣ Fluxo de Desenvolvimento

```mermaid
graph LR
    A[Criar Branch] --> B[Fazer Mudanças]
    B --> C[Rodar Testes]
    C --> D{Passaram?}
    D -->|Não| B
    D -->|Sim| E[Commit]
    E --> F[Push]
    F --> G[Abrir PR]
    G --> H[Code Review]
    H --> I{Aprovado?}
    I -->|Não| B
    I -->|Sim| J[Merge]

    style A fill:#e3f2fd
    style J fill:#c8e6c9
    style D fill:#fff3e0
    style I fill:#fff3e0
```

### Passo a Passo

1. **Crie uma branch** (`git checkout -b feat/minha-feature`)
2. **Faça suas mudanças**
3. **Rode os testes** (`npm test`)
4. **Rode type-check** (`npm run type-check`)
5. **Commit** (seguindo padrão)
6. **Push** (`git push -u origin feat/minha-feature`)
7. **Abra um Pull Request** no GitHub
8. **Aguarde code review**
9. **Faça ajustes** se necessário
10. **Merge!** 🎉

---

## 9️⃣ Primeiros Passos no Código

### Exemplo 1: Usar um Service

```typescript
// app/api/exemplo/route.ts
import { ServiceLocator } from '@/lib/di/container'
import { NextResponse } from 'next/server'

export async function GET() {
  // 1. Get service via DI
  const articleService = ServiceLocator.getArticle()
  const logger = ServiceLocator.getLogger()

  try {
    // 2. Use service methods
    const articles = await articleService.list({
      page: 1,
      limit: 10,
      type: 'NEWS',
      status: 'PUBLISHED'
    })

    // 3. Log success
    logger.info('Articles fetched', { count: articles.data.length })

    // 4. Return response
    return NextResponse.json(articles)
  } catch (error) {
    logger.error('Failed to fetch articles', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Exemplo 2: Criar um Artigo

```typescript
import { ServiceLocator } from '@/lib/di/container'

const articleService = ServiceLocator.getArticle()

const article = await articleService.create({
  title: 'Bitcoin Atinge US$ 100 mil',
  slug: 'bitcoin-atinge-us-100-mil',
  content: '<p>Conteúdo do artigo...</p>',
  excerpt: 'Bitcoin atingiu US$ 100 mil pela primeira vez.',
  type: 'NEWS',
  status: 'DRAFT',
  categoryId: 'cat-bitcoin',
  authorId: 'user-123',
  tagIds: ['tag-bitcoin', 'tag-crypto']
}, 'user-123')

console.log(`Artigo criado: ${article.id}`)
```

### Exemplo 3: Validar Dados

```typescript
import { ServiceLocator } from '@/lib/di/container'
import { articleCreateSchema } from '@/lib/schemas/article-schemas'

const validation = ServiceLocator.getValidation()

// Validação (throws ValidationError se inválido)
const validated = validation.validate(articleCreateSchema, {
  title: 'Meu Artigo',
  content: '<p>Conteúdo...</p>',
  type: 'NEWS',
  // ...
})

// Validação segura (retorna result)
const result = validation.validateSafe(articleCreateSchema, data)
if (!result.success) {
  console.log('Erros:', result.errors.fieldErrors)
}
```

---

## 🔟 Próximos Passos

Agora que você está configurado:

1. 📖 **Leia a documentação completa:**
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura detalhada
   - [ONBOARDING.md](../ONBOARDING.md) - Onboarding completo
   - [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Guia de desenvolvimento

2. 🧪 **Explore os testes:**
   - Veja `lib/services/__tests__/` para exemplos
   - Rode `npm test -- --watch` para desenvolvimento

3. 🔍 **Explore o código:**
   - Comece pelos services em `lib/services/`
   - Veja exemplos de DI em `lib/di/examples.md`

4. 🎯 **Pegue uma tarefa:**
   - Veja issues no GitHub
   - Converse no canal #dev-platform
   - Comece por issues marcadas como `good first issue`

---

## ❓ FAQ Rápido

### Como rodar apenas os testes de um service?

```bash
npm test -- lib/services/__tests__/article-service.test.ts
```

### Como fazer lint automático?

```bash
npm run lint:fix
```

### O build falhou, o que fazer?

```bash
# 1. Rode type-check
npm run type-check

# 2. Rode lint
npm run lint

# 3. Rode testes
npm test

# 4. Tente o build novamente
npm run build
```

### Como ver os logs do servidor?

Logs aparecem no terminal onde você rodou `npm run dev`

### Onde estão os dados do banco local?

Se você usou Prisma Studio: http://localhost:5555

### Como resetar o banco de dados?

```bash
# CUIDADO: Isso apaga TODOS os dados
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

---

## 🆘 Precisa de Ajuda?

- **Documentação:** Veja `docs/` para guias detalhados
- **Issues:** Abra uma issue no GitHub
- **Chat:** Canal #dev-platform no Discord
- **Code Review:** Peça ajuda no seu Pull Request

---

## ✅ Checklist Final

Antes de fazer seu primeiro PR, certifique-se de que:

- [ ] Testes passam (`npm test`)
- [ ] Type check passa (`npm run type-check`)
- [ ] Lint passa (`npm run lint`)
- [ ] Build funciona (`npm run build`)
- [ ] Branch está atualizada com `main`
- [ ] Commit message segue o padrão
- [ ] Código está documentado (comentários JSDoc)
- [ ] PR tem descrição clara

---

**Bem-vindo ao time!** 🎉

Pronto para começar? Pegue uma issue e mãos à obra! 💪

*"Nunca estarás sozinho." ❤️*
