# 📋 Sugestões e Ideias - $MILAGRE Platform

> **Última atualização:** 2025-12-07  
> **Formato:** Use `[ ]`, `[/]`, `[x]` para status de cada item

---

## 🟢 Prioridade Alta (Quick Wins)

### 🏗️ Refatoração Fractal - Fase 2 (Próximos Passos)

- [x] **Mover hooks para domínios** - Relocar hooks específicos
  - `useBinanceData` → `lib/domains/crypto/hooks/`
  - `useHolderCount` → `lib/domains/crypto/hooks/`
  - Esforço: ~1h ✅

- [x] **Criar domínio admin-chat** - Consolidar em `lib/domains/admin-chat/`
  - Mover `hooks/admin-chat/` para `lib/domains/admin-chat/hooks/`
  - Esforço: ~30min ✅

- [x] **Refatorar ArticleService** (733 linhas) - Quebrar em serviços menores ✅
  - Separar: CRUD, Stats, Search, Relationships
  - Seguir padrão fractal
  - Esforço: ~2h

- [x] **Refatorar CustomCryptoScreener** (472 linhas) - Componente muito grande ✅
  - Separar: tabela, filtros, hooks de dados
  - Esforço: ~1.5h

### Documentação & GitHub

- [x] **README em Inglês** - Criada versão EN do README para adoção internacional ✅
  - Arquivo: `README.en.md`
  - Links cruzados entre versões

- [x] **GitHub Issues Templates** - Facilitar contribuições ✅
  - Criado: `.github/ISSUE_TEMPLATE/bug_report.md`
  - Criado: `.github/ISSUE_TEMPLATE/feature_request.md`

- [x] **Melhorar descrição do repo GitHub** - Preparado ✅
  - Topics sugeridos: nextjs, crypto, education, web3, blockchain, solana, typescript, prisma
  - Website: tokenmilagre.xyz
  - **Ação manual necessária**: Configurar no GitHub → Settings → About

---

## 🟡 Prioridade Média

### Marketing & Comunidade

- [ ] **Melhorar presença no X/Twitter** (@TokenMilagre)
  - Postar threads educacionais
  - Divulgar novos artigos automaticamente
  - Engajar com comunidade crypto BR

- [ ] **YouTube/Shorts** - Conteúdo em vídeo
  - Tutoriais sobre crypto
  - Análises de mercado

### Funcionalidades

- [ ] **Sistema de Gamificação** - Em progresso
  - XP por leitura de artigos
  - Badges por conquistas
  - Leaderboard de usuários

- [ ] **Newsletter** - Cadastro de emails
  - Resumo semanal
  - Alertas de mercado

- [ ] **PWA completo** - App instalável
  - Push notifications
  - Offline mode para artigos

---

## 🔴 Prioridade Baixa / Futuro

### Web3 & Token

- [ ] **Smart Contract $MILAGRE** - Token ERC-20/SPL
  - Requer: Decisão estratégica sobre blockchain
  - Requer: Auditoria de segurança
  - Estimativa: 1-2 meses

- [ ] **DAO para Governança** - Votação de holders
  - Depende de: Token existir
  - Ferramenta: Snapshot.org

- [ ] **NFT Badges** - Certificados on-chain
  - Para: Conclusão de cursos
  - Para: Contribuidores

- [ ] **Integração com Wallets** - Phantom, MetaMask
  - Login via wallet
  - Verificação de holdings

---

## ✅ Concluídas

### 2025-12-07 - Refatoração Fractal (Fase 1)

**Objetivo:** Aplicar arquitetura fractal e Lei de Potência ao código

#### 1. Quebrar `hooks/useAdminChat.ts` (1018 → 270 linhas, -74%)
- [x] Criar `hooks/admin-chat/types.ts` - tipos e interfaces
- [x] Criar `hooks/admin-chat/utils.ts` - helpers de storage/mensagens
- [x] Criar `hooks/admin-chat/api.ts` - comunicação com backend
- [x] Criar `hooks/admin-chat/handlers.ts` - action handlers
- [x] Criar `hooks/admin-chat/useAdminChat.ts` - hook orquestrador
- [x] Re-export de compatibilidade no arquivo original

#### 2. Organizar `components/` por domínio
- [x] Criar estrutura: `crypto/`, `widgets/`, `education/`, `layout/`, `shared/`
- [x] Mover 34 componentes para domínios apropriados
- [x] Criar `index.ts` para cada domínio com re-exports
- [x] Atualizar 23+ imports quebrados em 15+ arquivos

#### 3. Quebrar `layout-root.tsx` (591 → 220 linhas, -63%)
- [x] Extrair `app/components/layout/Sidebar.tsx`
- [x] Extrair `app/components/layout/FearGreedGaugeNavbar.tsx`
- [x] Extrair `app/components/layout/Footer.tsx`
- [x] Criar `app/components/layout/useFearGreedNavbar.ts` hook

#### 4. Correções de Build
- [x] Fix: `NavbarCryptoTicker.tsx` - prevenir `undefined.split()` no SSR
- [x] Fix: `TopCryptosList` import quebrado em `criptomoedas/[slug]/page.tsx`
- [x] Build Vercel passando ✅
#### 5. Refatoração ArticleService (Fase 2A)
- [x] Facade Pattern: ArticleService agora é um facade
- [x] ArticleCrudService: CRUD operations
- [x] ArticleQueryService: Listagem e filtros
- [x] ArticleStatsService: Estatísticas
- [x] ArticleBulkService: Operações em massa
- [x] Schema: Adaptação para Zod Types
- [x] Testes: 35/35 testes passando ✅

#### 6. Refatoração CustomCryptoScreener (Fase 2B)
- [x] Hooks específicos: `useCryptoData` (Sentry, Cache, Fetching)
- [x] Hooks UI: `useCryptoTable` (TanStack config)
- [x] Componentes Fractal:
  - `CryptoTable`: UI Pura
  - `CryptoSearch`: UI Pura
  - `CryptoPagination`: UI Pura
- [x] Controller Pattern: `CustomCryptoScreener` orquestrando tudo
- [x] Build: Passando ✅

### 2025-12-06
- [x] Prompt educacional melhorado (~9.5/10)
- [x] Sistema de fallback de modelos Gemini
- [x] Script interativo externo para importação
- [x] Corrigir links /dashboard/noticias → /noticias
- [x] Atualizar nome do criador (dogespartano)
- [x] Consistência de licença MIT em todo projeto
- [x] Manifesto reescrito para filosofia MIT

---

## 💡 Ideias para Avaliar

> Ideias que surgiram mas precisam de análise antes de decidir

- [ ] **Airdrop para contribuidores** - Tokens para quem fizer PRs
- [ ] **Parceria com exchanges** - Binance Academy, etc.
- [ ] **Tradução automática de artigos** - Multi-idioma
- [ ] **API pública** - Para desenvolvedores terceiros
- [ ] **Modo escuro/claro por artigo** - Preferência individual

---

## 🔧 Manutenção

### Como usar este arquivo:

1. **Adicionar ideia:** Coloque na seção apropriada com `[ ]`
2. **Em progresso:** Mude para `[/]`
3. **Concluída:** Mude para `[x]` e mova para seção "Concluídas" com data
4. **Remover:** Delete a linha ou mova para "Descartadas" (se quiser manter histórico)

### Sessões de Trabalho:

```
// Copie este template no início de cada sessão:
## Sessão YYYY-MM-DD
- Foco: [descreva]
- Implementado:
  - Item 1
  - Item 2
```

---

## 📝 Notas

- **Grok Analysis (06/12/2025):** Analisou repo superficialmente, não viu conteúdo real. Sugestões de smart contracts e bonding curves não são prioridade - projeto é focado em **educação**, não trading.

- **Filosofia:** Transparência radical, MIT License, sem promessas de ganhos fáceis.

---

## 📋 Sugestões para Próximas Sessões (Atualizado 07/12/2025)

### ✅ Concluído (Sessão 07/12/2025)

#### Arquitetura Fractal & Leis de Potência
- [x] Criar `ARCHITECTURE.fractal.md` — filosofia e princípios
- [x] Criar `lib/core/constants/architecture.ts` — constantes com AGI hints
- [x] Migrar domínio `resources/` para `lib/domains/resources/`
- [x] Migrar domínio `articles/` para `lib/domains/articles/`
- [x] Migrar domínio `users/` para `lib/domains/users/`
- [x] Atualizar `MANIFEST.agi.md` com estrutura fractal
- [x] Criar registry central `lib/domains/index.ts`

#### Estrutura Final Criada
```
lib/
├── core/
│   └── constants/
│       └── architecture.ts    # Princípios fractais
├── domains/
│   ├── index.ts               # Registry
│   ├── resources/             # Fase 1
│   ├── articles/              # Fase 2A
│   ├── users/                 # Fase 3
│   ├── crypto/                # Fase 2B (Novo)
│   └── admin-chat/            # Fase 2C (Novo)
```

#### ✅ Concluído (Fase 2 - Crypto & Admin Chat)
- [x] **Domínio Crypto:** `lib/domains/crypto/` criado com hooks (`useBinanceData`, `useHolderCount`).
- [x] **Domínio Admin-Chat:** `lib/domains/admin-chat/` criado.
- [x] **Compatibilidade:** Re-exports criados em `hooks/` para evitar breaking changes.
- [x] **Verificação:** Testado em localhost (Ticker, HolderCount, AIAssistant).

### ✅ Concluído (Sessão 08/12/2025)

#### 🌳 Zen Garden Cleanup (Refatoração de Infraestrutura)
- [x] **Limpeza de Raiz:** Remoção de arquivos soltos em `lib/` para `lib/domains/` ou `lib/shared/`.
- [x] **Criação de Shared:** Consolidação de infraestrutura em `lib/shared/` (`adapters`, `middleware`, `hooks`, `utils`, `ai`).
- [x] **Unificação do Prisma:** Remoção de duplicados. Única fonte da verdade em `@/lib/core/prisma`.
- [x] **Consistência de Imports:** Atualização massiva de imports para refletir nova estrutura.

### ✅ Concluído (Sessão 08/12/2025) - Parte 2

#### 🧟 Exorcizando Zombies (Consolidação de Serviços & Schemas)
- [x] **Migração de Serviços:** Mover `lib/services/*` para `lib/domains/*/services` ou `lib/shared/services`.
    - `ArticleService` → `domains/articles`
    - `UserService` → `domains/users`
    - `ResourceService` → `domains/resources`
    - `Logger`, `Error`, `Validation` → `shared/services`
- [x] **Migração de Schemas:** Mover `lib/schemas/*` para `lib/domains/*/schemas` ou `lib/shared/schemas`.
- [x] **Resolução de Dependências Circulares:** Correção crítica em `domains/users` e `domains/resources` (Tipos ↔ Serviços).
- [x] **Compatibilidade:** Criação de Facades Estritos em `lib/services` e `lib/schemas` para manter compatibilidade com códigos legados.
- [x] **Verificação:** `npm run build` passando com sucesso (Zero erros de tipo).

### ✅ Concluído (Sessão 08/12/2025) - Parte 3

#### 🌿 Zen Garden Cleanup (Final)
- [x] **Limpeza Final da Raiz:** Movidos `resources.ts`, `draft-storage.ts`, `category-helpers.ts` e `utils.ts` para domínios/shared.
- [x] **Aderência Fractal:** 100% dos arquivos agora residem em containers apropriados (Domains ou Shared).
- [x] **Integridade:** Validado com `type-check` (Imports atualizados em 15+ arquivos).

### ✅ Concluído (Sessão 08/12/2025) - Parte 4

#### 💎 Core Consolidation (Remoção de Duplicatas Reais)
- [x] **Análise Profunda:** Detectado que `lib/constants/*` eram duplicatas (código repetido) e não apenas fachadas.
- [x] **Conversão para Facades:** Convertidos `mission.ts`, `pricing.ts`, `time.ts`, `validation.ts` e `pagination.ts` em `lib/constants/` para re-exports simples de `@/lib/core/constants/*`.
- [x] **Migração de Dados:** `lib/data/*.json` movidos para `lib/domains/crypto/data/`.
- [x] **Limpeza:** Removida pasta `lib/data` e arquivo de backup `lib/constants.ts.bak`.
- [x] **Verificação:** Build verificado e imports corrigidos em `lib/url-security`.

### ✅ Concluído (Sessão 08/12/2025) - Parte 5

#### 🧹 Fractal Polish (Helpers Refactor)
- [x] **Relocação de Helpers:** Movido `lib/helpers/*` (código ativo) para `lib/shared/helpers/`.
- [x] **Correção de Imports:** Atualizadas 38+ referências de `@/lib/helpers` para `@/lib/shared/helpers`.
- [x] **Auditoria:** O projeto atingiu ~95% de aderência à arquitetura fractal (apenas facades restaram na raiz).
- [x] **Verificação:** Testado localmente (Auth, Resources, Admin) e Build Vercel validado.

---


### ✅ Concluído (Sessões Anteriores)
- [x] Correção do schema Prisma (enums → Strings para compatibilidade)
- [x] Relação ProjectMap → SocialProject com onDelete Cascade
- [x] Remoção de arquivos backup `_BACKUP-*.ORIGINAL.txt`
- [x] Limpeza do jest.setup.js

---

### 🔴 Alta Prioridade (Próximos)

- [x] **Consolidar lib/core/** — ✅ Concluído (07/12/2025)
  - [x] Mover `lib/prisma.ts` → `lib/core/prisma.ts`
  - [x] Mover `lib/constants/*.ts` → `lib/core/constants/`
  - [x] Re-exports criados para compatibilidade (zero breaking changes)
  - Resultado: 27+ arquivos usando prisma e 11+ usando constants continuam funcionando

---

### 🟠 Média Prioridade  

- [x] **Dividir `app/page.tsx`** — ✅ Concluído (07/12/2025)
  - Reduzido de 1074 → 70 linhas
  - Criados 12 componentes em `app/components/home/`
  - Hooks: `useHomeData`, `useFearGreed`
  - Componentes: `MarketDataCards`, `FearGreedGauge`, `DailyAnalysisCard`, `QuickStartGrid`, `LatestNewsGrid`, `LearnCryptoSection`, `PriceChartSection`, `LoadingSkeleton`


- [ ] **Adicionar OpenAPI spec** para documentação de APIs
  - Usar `next-swagger-doc` ou `@asteasolutions/zod-to-openapi`

- [ ] **Atualizar imports gradualmente** para usar domínios
  - Exemplo: `import { Resource } from '@/lib/domains/resources'`
  - Pode ser feito aos poucos, re-exports mantêm compatibilidade

---

### 🟡 Baixa Prioridade

- [ ] **Migração String→Json** nos campos Prisma (tags, features, pros, cons)
  - Requer script de migração de dados existentes
  
- [ ] **i18n** - apenas se expansão global

- [ ] **PWA** - tornar app instalável

