# 🗄️ NOVO SCHEMA PRISMA OTIMIZADO

**Versão**: 2.0.0
**Data**: 2025-11-18

---

## 🎯 OBJETIVOS DAS MUDANÇAS

### Problemas do Schema Atual

1. ❌ **JSON como String**: `tags String // JSON array`
2. ❌ **Sem tabelas pivot**: `relatedArticles String? // JSON de slugs`
3. ❌ **Índices inadequados**: Falta índices compostos
4. ❌ **Sem soft deletes**: Delete permanente
5. ❌ **Sem auditoria**: Falta tracking de mudanças

### Melhorias Propostas

1. ✅ **Relacionamentos M:N** via tabelas pivot
2. ✅ **Índices compostos** para queries complexas
3. ✅ **Soft deletes** com `deletedAt`
4. ✅ **Audit trail** completo
5. ✅ **Type-safe** sem JSON strings

---

## 📋 NOVO SCHEMA

```prisma
// ============================================================================
// ENUMS (mantidos + novos)
// ============================================================================

enum Role {
  ADMIN
  EDITOR
  VIEWER
}

enum ArticleType {
  news
  educational
}

enum ArticleStatus {
  draft
  published
  archived
  deleted // soft delete
}

enum Sentiment {
  positive
  neutral
  negative
}

enum Level {
  iniciante
  intermediario
  avancado
}

enum ContentType {
  artigo
  tutorial
  curso
}

enum ResourceCategory {
  exchange
  wallet
  defi_protocol
  analytics
  portfolio_tracker
  news
  education
  development_tools
  explorers
  browsers
}

// ============================================================================
// TABELAS PRINCIPAIS
// ============================================================================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String
  image         String?
  role          Role      @default(VIEWER)

  // Gamificação
  points        Int       @default(0)
  badges        Badge[]   // Relacionamento M:N

  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime? // Soft delete

  // Relações
  accounts            Account[]
  sessions            Session[]
  articles            Article[]
  copilotActivities   CopilotActivity[]
  communityStories    CommunityStory[]
  userProgress        UserProgress[]
  auditLogs           AuditLog[]

  @@index([email])
  @@index([role])
  @@index([deletedAt])
}

// ============================================================================
// ARTICLES (OTIMIZADO)
// ============================================================================

model Article {
  id          String        @id @default(cuid())
  slug        String        @unique
  title       String
  excerpt     String        @db.Text
  content     String        @db.Text

  // Tipo e Status
  type        ArticleType   @default(news)
  status      ArticleStatus @default(draft)

  // Metadados
  readTime    String?
  viewCount   Int           @default(0)

  // Relacionamentos
  authorId    String
  author      User          @relation(fields: [authorId], references: [id], onDelete: Cascade)

  categoryId  String
  category    Category      @relation(fields: [categoryId], references: [id])

  // Tags (M:N via pivot)
  tags        ArticleTag[]

  // Artigos relacionados (M:N via pivot)
  relatedFrom ArticleRelation[] @relation("ArticleFrom")
  relatedTo   ArticleRelation[] @relation("ArticleTo")

  // Campos específicos de NOTÍCIAS
  sentiment   Sentiment?

  // Fact-checking
  factCheckScore    Float?
  factCheckDate     DateTime?
  factCheckStatus   String?
  citations         Citation[]

  // Campos específicos de EDUCACIONAIS
  level       Level?
  contentType ContentType?

  // Segurança
  warningLevel      String?
  securityTips      SecurityTip[]

  // Curso
  courseSequence    Int?
  projectHighlight  Boolean       @default(false)

  // Imagem de capa
  coverImage        String?
  coverImageAlt     String?

  // Quiz (se houver)
  quiz              Quiz?

  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  publishedAt DateTime?
  deletedAt   DateTime? // Soft delete

  // Auditoria
  auditLogs   AuditLog[]

  @@index([slug])
  @@index([authorId])
  @@index([categoryId])
  @@index([type])
  @@index([status])
  @@index([deletedAt])
  @@index([publishedAt])

  // Índices compostos para queries combinadas
  @@index([type, status, publishedAt])
  @@index([type, categoryId, status])
  @@index([authorId, status])
  @@index([status, createdAt])
}

// ============================================================================
// CATEGORIES (Nova tabela)
// ============================================================================

model Category {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  description String?
  type        String    // 'news' | 'educational' | 'resource'

  // Hierarchy (para subcategorias futuras)
  parentId    String?
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")

  // Relações
  articles    Article[]
  resources   Resource[]

  // Metadados
  icon        String?
  color       String?
  order       Int       @default(0)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([slug])
  @@index([type])
  @@index([parentId])
}

// ============================================================================
// TAGS (M:N com Articles)
// ============================================================================

model Tag {
  id          String      @id @default(cuid())
  slug        String      @unique
  name        String

  // Relações
  articles    ArticleTag[]

  // Metadados
  usageCount  Int         @default(0)

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([slug])
  @@index([usageCount])
}

model ArticleTag {
  articleId   String
  article     Article   @relation(fields: [articleId], references: [id], onDelete: Cascade)

  tagId       String
  tag         Tag       @relation(fields: [tagId], references: [id], onDelete: Cascade)

  // Quando foi adicionada
  createdAt   DateTime  @default(now())

  @@id([articleId, tagId])
  @@index([articleId])
  @@index([tagId])
}

// ============================================================================
// ARTICLE RELATIONS (M:N para artigos relacionados)
// ============================================================================

model ArticleRelation {
  fromArticleId String
  fromArticle   Article   @relation("ArticleFrom", fields: [fromArticleId], references: [id], onDelete: Cascade)

  toArticleId   String
  toArticle     Article   @relation("ArticleTo", fields: [toArticleId], references: [id], onDelete: Cascade)

  // Tipo de relação (similar, sequência, referência)
  relationType  String    @default("related")
  order         Int?      // Para sequências de curso

  createdAt     DateTime  @default(now())

  @@id([fromArticleId, toArticleId])
  @@index([fromArticleId])
  @@index([toArticleId])
}

// ============================================================================
// CITATIONS (Fact-checking sources)
// ============================================================================

model Citation {
  id          String    @id @default(cuid())
  url         String
  title       String?
  domain      String?   // Extraído da URL

  articleId   String
  article     Article   @relation(fields: [articleId], references: [id], onDelete: Cascade)

  // Metadados
  order       Int       @default(0)
  verified    Boolean   @default(false)

  createdAt   DateTime  @default(now())

  @@index([articleId])
  @@index([domain])
}

// ============================================================================
// SECURITY TIPS
// ============================================================================

model SecurityTip {
  id          String    @id @default(cuid())
  icon        String
  title       String
  description String    @db.Text

  articleId   String
  article     Article   @relation(fields: [articleId], references: [id], onDelete: Cascade)

  order       Int       @default(0)

  createdAt   DateTime  @default(now())

  @@index([articleId])
}

// ============================================================================
// QUIZ (Cursos interativos)
// ============================================================================

model Quiz {
  id          String        @id @default(cuid())
  title       String
  description String?

  articleId   String        @unique
  article     Article       @relation(fields: [articleId], references: [id], onDelete: Cascade)

  // Configuração
  passingScore Float        @default(70) // Porcentagem
  timeLimit    Int?         // Minutos

  // Questões
  questions   QuizQuestion[]

  // Estatísticas
  totalAttempts Int         @default(0)
  avgScore      Float?

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([articleId])
}

model QuizQuestion {
  id          String        @id @default(cuid())
  question    String        @db.Text
  explanation String?       @db.Text

  quizId      String
  quiz        Quiz          @relation(fields: [quizId], references: [id], onDelete: Cascade)

  // Opções (sempre 4)
  options     QuizOption[]

  // Metadados
  order       Int
  points      Int           @default(1)

  createdAt   DateTime      @default(now())

  @@index([quizId])
  @@index([order])
}

model QuizOption {
  id          String        @id @default(cuid())
  text        String
  isCorrect   Boolean       @default(false)

  questionId  String
  question    QuizQuestion  @relation(fields: [questionId], references: [id], onDelete: Cascade)

  order       Int

  createdAt   DateTime      @default(now())

  @@index([questionId])
}

// ============================================================================
// RESOURCES (mantido com melhorias)
// ============================================================================

model Resource {
  id          String           @id @default(cuid())
  slug        String           @unique
  name        String

  categoryId  String
  category    Category         @relation(fields: [categoryId], references: [id])

  verified    Boolean          @default(true)
  status      String           @default("active") // active, archived, deleted

  // Básico
  shortDescription String        @db.Text
  officialUrl      String

  // Platforms (M:N)
  platforms        ResourcePlatform[]

  // Tags (M:N)
  tags             ResourceTag[]

  // Hero
  heroTitle       String
  heroDescription String        @db.Text
  heroGradient    String

  // Why good
  whyGoodTitle    String
  whyGoodParagraphs WhyGoodParagraph[]

  // Features
  features        ResourceFeature[]

  // How to start
  howToStartTitle String
  howToStartSteps HowToStartStep[]

  // Pros/Cons
  pros            ResourcePro[]
  cons            ResourceCon[]

  // FAQ
  faq             ResourceFAQ[]

  // Security
  securityTips    ResourceSecurityTip[]

  // Audit
  securityAudit     String?
  securityAuditDate DateTime?
  auditedByCommunity Boolean  @default(false)

  // Interactive
  toolConfig        String?       @db.Text
  interactiveType   String?

  // Relacionamentos
  relatedFrom       ResourceRelation[] @relation("ResourceFrom")
  relatedTo         ResourceRelation[] @relation("ResourceTo")

  // Metadados
  views             Int           @default(0)
  showCompatibleWallets Boolean   @default(false)

  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  lastVerified      DateTime      @default(now())
  deletedAt         DateTime?

  @@index([slug])
  @@index([categoryId])
  @@index([verified])
  @@index([status])
  @@index([deletedAt])
}

// ============================================================================
// RESOURCE RELATED TABLES
// ============================================================================

model Platform {
  id        String             @id @default(cuid())
  slug      String             @unique
  name      String             // Web, iOS, Android, Desktop, Extension, Hardware
  icon      String?

  resources ResourcePlatform[]

  @@index([slug])
}

model ResourcePlatform {
  resourceId String
  resource   Resource  @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  platformId String
  platform   Platform  @relation(fields: [platformId], references: [id], onDelete: Cascade)

  createdAt  DateTime  @default(now())

  @@id([resourceId, platformId])
}

model ResourceTag {
  resourceId String
  resource   Resource  @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  tagId      String
  tag        Tag       @relation(fields: [tagId], references: [id], onDelete: Cascade)

  createdAt  DateTime  @default(now())

  @@id([resourceId, tagId])
}

model WhyGoodParagraph {
  id         String    @id @default(cuid())
  content    String    @db.Text
  order      Int

  resourceId String
  resource   Resource  @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  @@index([resourceId, order])
}

model ResourceFeature {
  id          String    @id @default(cuid())
  icon        String
  title       String
  description String    @db.Text
  order       Int

  resourceId  String
  resource    Resource  @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  @@index([resourceId, order])
}

model HowToStartStep {
  id          String    @id @default(cuid())
  number      Int
  title       String
  description String    @db.Text

  resourceId  String
  resource    Resource  @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  @@index([resourceId, number])
}

model ResourcePro {
  id         String    @id @default(cuid())
  content    String
  order      Int

  resourceId String
  resource   Resource  @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  @@index([resourceId, order])
}

model ResourceCon {
  id         String    @id @default(cuid())
  content    String
  order      Int

  resourceId String
  resource   Resource  @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  @@index([resourceId, order])
}

model ResourceFAQ {
  id         String    @id @default(cuid())
  question   String
  answer     String    @db.Text
  order      Int

  resourceId String
  resource   Resource  @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  @@index([resourceId, order])
}

model ResourceSecurityTip {
  id          String    @id @default(cuid())
  icon        String
  title       String
  description String    @db.Text
  order       Int

  resourceId  String
  resource    Resource  @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  @@index([resourceId, order])
}

model ResourceRelation {
  fromResourceId String
  fromResource   Resource  @relation("ResourceFrom", fields: [fromResourceId], references: [id], onDelete: Cascade)

  toResourceId   String
  toResource     Resource  @relation("ResourceTo", fields: [toResourceId], references: [id], onDelete: Cascade)

  createdAt      DateTime  @default(now())

  @@id([fromResourceId, toResourceId])
}

// ============================================================================
// GAMIFICAÇÃO
// ============================================================================

model Badge {
  id          String      @id @default(cuid())
  slug        String      @unique
  name        String
  description String
  icon        String
  color       String

  // Critério para ganhar
  criteria    String      @db.Text
  pointsRequired Int?

  // Usuários que possuem
  users       UserBadge[]

  createdAt   DateTime    @default(now())

  @@index([slug])
}

model UserBadge {
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  badgeId   String
  badge     Badge     @relation(fields: [badgeId], references: [id], onDelete: Cascade)

  earnedAt  DateTime  @default(now())

  @@id([userId, badgeId])
}

// ============================================================================
// AUDIT LOG (Nova tabela)
// ============================================================================

model AuditLog {
  id          String    @id @default(cuid())

  // Quem fez
  userId      String?
  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)

  // O que foi feito
  action      String    // create, update, delete, publish, etc
  entity      String    // article, resource, user, etc
  entityId    String

  // Mudanças (JSON diff)
  changes     String?   @db.Text

  // Metadados
  ipAddress   String?
  userAgent   String?

  // Referências (polimórfico)
  articleId   String?
  article     Article?  @relation(fields: [articleId], references: [id], onDelete: SetNull)

  createdAt   DateTime  @default(now())

  @@index([userId])
  @@index([entity, entityId])
  @@index([articleId])
  @@index([createdAt])
}

// ============================================================================
// (Demais models mantidos: Account, Session, etc)
// ============================================================================
```

---

## 🔄 MIGRAÇÃO DO SCHEMA ATUAL

### Estratégia

1. **Criar novas tabelas** sem afetar as antigas
2. **Migrar dados** gradualmente via script
3. **Validar integridade** dos dados migrados
4. **Switchover** com feature flag
5. **Remover tabelas antigas** após 30 dias

### Script de Migração

```typescript
// scripts/migrate-to-new-schema.ts

async function migrateArticles() {
  const oldArticles = await prisma.article.findMany()

  for (const old of oldArticles) {
    // 1. Migrar categoria
    const category = await findOrCreateCategory(old.category, old.type)

    // 2. Migrar tags (JSON → relações)
    const tags = JSON.parse(old.tags || '[]')
    const tagRelations = await findOrCreateTags(tags)

    // 3. Migrar citations (JSON → tabela)
    const citations = old.factCheckSources
      ? JSON.parse(old.factCheckSources)
      : []

    // 4. Criar novo artigo
    await prisma.article.create({
      data: {
        ...old,
        categoryId: category.id,
        status: old.published ? 'published' : 'draft',
        tags: {
          create: tagRelations
        },
        citations: {
          create: citations.map((url, i) => ({
            url,
            order: i
          }))
        }
      }
    })
  }
}
```

---

## 📊 COMPARAÇÃO: ANTES vs DEPOIS

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Tags** | `tags String` (JSON) | Tabela `Tag` + pivot `ArticleTag` |
| **Categorias** | `category String` | Tabela `Category` com hierarquia |
| **Artigos Relacionados** | `relatedArticles String` | Tabela `ArticleRelation` |
| **Citations** | `factCheckSources String` | Tabela `Citation` |
| **Security Tips** | JSON string | Tabela `SecurityTip` |
| **Quiz** | `quizData String` | Tabelas `Quiz`, `QuizQuestion`, `QuizOption` |
| **Soft Delete** | ❌ | ✅ `deletedAt` |
| **Audit Trail** | ❌ | ✅ Tabela `AuditLog` |
| **Índices Compostos** | ❌ | ✅ 6 índices compostos |

---

## ✅ VANTAGENS

1. **Type-Safe**: Relações explícitas, sem parsing de JSON
2. **Performance**: Índices otimizados para queries reais
3. **Integridade**: Foreign keys garantem consistência
4. **Escalável**: Suporta milhões de registros
5. **Auditável**: Histórico completo de mudanças
6. **Flexível**: Fácil adicionar features (hierarquia, etc)

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Review do schema (você está aqui)
2. ⏳ Criar migration files
3. ⏳ Testar migração em dev
4. ⏳ Criar seed data para testes
5. ⏳ Validar performance com 10k+ registros
6. ⏳ Migração em staging
7. ⏳ Migração em produção

---

**Status**: 📝 AGUARDANDO APROVAÇÃO

**Última Atualização**: 2025-11-18 11:00 BRT
