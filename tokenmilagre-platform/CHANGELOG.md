# Changelog

Todas as mudanças notáveis do **Novo Sistema de Artigos** serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planejado para Semana 3+
- APIs v2 REST completas (`/api/v2/articles`)
- React Query hooks para client-side
- E2E tests com Playwright
- Load tests com k6
- Dashboard de logs em tempo real
- Migração gradual das 3 páginas antigas

---

## [0.2.0] - 2025-11-18 - Semana 2

### Added

#### Dependency Injection
- **DI Container** com tsyringe para gerenciamento de dependências ([#cbd4946](commit))
  - `ServiceLocator` helper class para type-safe resolution
  - Tokens para injeção (`TOKENS.LoggerService`, etc.)
  - Reset/isolation para testes
  - Guia completo de uso (`lib/di/examples.md`)
  - 22 testes (100% coverage)

#### Services Core

- **ErrorService** - Sistema centralizado de tratamento de erros ([#366335f](commit))
  - Hierarquia de 8 classes de erro especializadas:
    - `ValidationError` (400)
    - `AuthenticationError` (401)
    - `AuthorizationError` (403)
    - `NotFoundError` (404)
    - `ConflictError` (409)
    - `RateLimitError` (429)
    - `ExternalAPIError` (502)
    - `DatabaseError` (500)
  - Middleware `errorHandler` para Next.js API routes
  - Integração automática com LoggerService + Sentry
  - Type guards: `assertExists`, `isOperationalError`
  - `handleCriticalError` para erros irrecuperáveis
  - 41 testes (100% coverage)

- **ValidationService** - Validação server-side com Zod ([#9b74eaa](commit))
  - Validação type-safe com Zod schemas
  - Sanitização HTML (XSS prevention com DOMPurify)
  - Geração automática de slugs URL-safe
  - Cálculo automático de tempo de leitura
  - 15+ métodos utilitários:
    - `validate()` / `validateSafe()`
    - `sanitizeHtml()` - Remove scripts/XSS
    - `generateSlug()` - Slugs com acentos/especiais
    - `calculateReadTime()` - 200 palavras/min
    - `isValidEmail()` / `isValidUrl()`
    - `extractDomain()` - Extrai domínio de URLs
    - `normalizeCitation()` - Normaliza citações
    - `validateFile()` - Valida uploads
    - `stripHtml()` / `truncate()`
  - 61 testes (98.03% coverage)

- **ArticleService** - CRUD completo de artigos ([#57db14a](commit))
  - Operações CRUD completas:
    - `create()` - Com slug único, readTime auto
    - `getById()` / `getBySlug()` - Leitura
    - `list()` - Paginação + filtros avançados
    - `update()` - Atualização parcial
    - `delete()` - Soft delete
    - `hardDelete()` - Remoção permanente (admin)
    - `restore()` - Restaurar soft-deleted
  - Operações em lote (bulk) com transações atômicas:
    - `bulkOperation()` - publish/archive/delete/restore
    - Máximo de 50 artigos por operação
  - Gerenciamento de relacionamentos:
    - Tags (M:N via `ArticleTag` pivot)
    - Citations (1:N com normalização de domínio)
    - Related Articles (M:N via `ArticleRelation`)
  - Features avançadas:
    - Auto-geração de slug único
    - Auto-cálculo de readTime
    - Sanitização automática de HTML
    - Validação de relacionamentos antes de persistir
    - Paginação + filtros (type, status, category, tag, search)
    - Estatísticas (`getStats()`)
  - 43 testes (98.58% coverage)

#### Zod Schemas

- **article-schemas.ts** - Schemas completos para Articles ([#9b74eaa](commit))
  - 14 schemas + validações complexas:
    - `articleCreateSchema` - Criação com validações de negócio
    - `articleUpdateSchema` - Atualização parcial
    - `articleQuerySchema` - Filtros/paginação
    - `bulkArticleOperationSchema` - Operações em lote
    - `citationSchema` - Citações de fact-checking
    - Refinements: publishedAt required se PUBLISHED, etc.
  - Type exports para TypeScript

- **category-schemas.ts** - Schemas para Categories e Tags
  - 4 schemas (create/update para cada)
  - Validação de slugs e hierarquia

### Changed

- **tsconfig.json** - Adicionado suporte a decorators ([#cbd4946](commit))
  - `experimentalDecorators: true`
  - `emitDecoratorMetadata: true`

### Dependencies

- Added `tsyringe` - DI container
- Added `reflect-metadata` - Required by tsyringe
- Added `zod` - Validação type-safe
- Added `isomorphic-dompurify` - Sanitização HTML

### Documentation

- **lib/di/examples.md** - Guia completo de uso do DI container
- **ONBOARDING.md** - Guia de onboarding para novos devs

### Tests

- **Total:** 167 testes (100% passando)
- **Coverage:** 98.87% (média)
  - ErrorService: 100%
  - ValidationService: 98.03%
  - ArticleService: 98.58%
  - DI Container: 100%

---

## [0.1.0] - 2025-11-15 - Semana 1

### Added

#### Infrastructure

- **LoggerService** - Logging estruturado com Pino ([#bf73882](commit))
  - JSON structured logging (production)
  - Pretty print em desenvolvimento
  - Integração com Sentry
  - Context management (`setContext`, `clearContext`)
  - Métodos especializados:
    - `logRequest()` / `logResponse()` - HTTP logging
    - `logAction()` - User actions
    - `logMetric()` - Performance metrics
    - `logQuery()` - Database queries
  - Helper `measureTime()` para performance tracking
  - Redação automática de campos sensíveis (password, token, etc.)
  - 35 testes (98.3% coverage)

- **Sentry Configuration** - Error tracking otimizado ([#bf73882](commit))
  - Sample rate: 10% em produção (cost optimization)
  - Filtros de ruído (network errors, console logs)
  - Session Replay com privacidade (mask all text/media)
  - Environment detection (dev/prod)
  - BeforeSend hooks para filtrar erros conhecidos

- **Jest Configuration** - Test framework completo ([#bf73882](commit))
  - Coverage threshold: 80% (branches, functions, lines, statements)
  - Prisma mock com `jest-mock-extended`
  - Setup: TextEncoder, matchMedia, IntersectionObserver
  - Coverage exclusions: `__tests__`, `generated`

#### Database

- **Schema Prisma v2** - Novo schema otimizado ([#9b74eaa](commit))
  - **Category table** - Separate table (antes era string)
    - Hierarquia com `parent/children`
    - Icon + color customizáveis
    - Type: 'news' | 'educational' | 'resource'

  - **Tag table** - M:N com pivot `ArticleTag`
    - Usage count tracking
    - Slug único

  - **Citation table** - Fact-checking sources (antes era JSON)
    - URL + title + domain
    - Verified flag
    - Order para sorting

  - **ArticleRelation** - M:N para related articles (antes era JSON)

  - **8 composite indexes** para queries complexas:
    - `[type, status, publishedAt]`
    - `[type, categoryId, status]`
    - `[authorId, status]`
    - `[status, createdAt]`

  - **Soft deletes** - `deletedAt` column

  - Type-safe relations (sem JSON parsing)

- **Seed v2** - Dados de teste ([#9b74eaa](commit))
  - Admin user
  - 12 categorias hierárquicas (Bitcoin, Ethereum, DeFi, etc.)
  - 20 tags prontas
  - 3 artigos de exemplo completos com tags e citations

#### Mocks

- **Prisma Mock** - Mock para testes ([#bf73882](commit))
  - `jest-mock-extended` para type-safe mocks
  - Auto-reset entre testes
  - Usado em todos os testes de services

### Documentation

- **NEW_SYSTEM_ARCHITECTURE.md** - Arquitetura completa (485 linhas)
  - Clean Architecture (4 layers)
  - 7 core modules detalhados
  - Design principles
  - Referencias técnicas

- **NEW_PRISMA_SCHEMA.md** - Documentação do schema (500 linhas)
  - Schema otimizado com pivot tables
  - Migration strategy
  - Before/after comparison

- **API_V2_SPECIFICATION.md** - Especificação de APIs (650 linhas)
  - REST API completa
  - Todos os endpoints documentados
  - Request/response formats
  - Rate limiting rules
  - Error handling standards

- **LOGGING_MONITORING.md** - Sistema de logs (485 linhas)
  - LoggerService specification
  - Sentry integration
  - Dashboard design
  - Alert configuration
  - Metrics collection

- **TEST_PLAN.md** - Plano de testes (630 linhas)
  - Test pyramid (60% unit, 30% integration, 10% e2e)
  - Coverage thresholds (80%)
  - Test examples completos
  - Load testing strategy

- **IMPLEMENTATION_ROADMAP.md** - Roadmap 6 semanas (601 linhas)
  - Day-by-day task breakdown
  - Migration strategy with feature flags
  - Success criteria

### Tests

- **Total:** 35 testes (100% passando)
- **Coverage:** 98.3%
  - LoggerService: 98.3%

---

## Convenções de Commits

Este projeto usa [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova feature
- `fix:` - Bug fix
- `docs:` - Documentação
- `test:` - Testes
- `refactor:` - Refatoração sem mudança de funcionalidade
- `chore:` - Tarefas de manutenção

**Exemplos:**
```
feat(services): Implementar ArticleService CRUD completo
fix(validation): Corrigir regex de slug
docs(api): Atualizar documentação de endpoints
test(article): Adicionar testes de bulk operations
```

---

## Versioning

- **0.1.x** - Semana 1 (Infrastructure)
- **0.2.x** - Semana 2 (Services Core + DI)
- **0.3.x** - Semana 3 (APIs v2 + React Query)
- **0.4.x** - Semana 4 (Tests E2E + Load)
- **0.5.x** - Semana 5-6 (Migration + Monitoring)
- **1.0.0** - Production Release (após migração completa)

---

## Links

- [Repository](https://github.com/dogespartano-cyber/tokenmilagre-platform)
- [Documentation](./docs/)
- [Onboarding Guide](./ONBOARDING.md)
- [DI Examples](./lib/di/examples.md)
