# 📋 Sugestões e Ideias - $MILAGRE Platform

> **Última atualização:** 2025-12-06  
> **Formato:** Use `[ ]`, `[/]`, `[x]` para status de cada item

---

## 🟢 Prioridade Alta (Quick Wins)

### Documentação & GitHub

- [ ] **README em Inglês** - Criar versão EN do README para adoção internacional
  - Esforço: ~2h
  - Arquivo: `README.en.md` ou seção bilíngue

- [ ] **GitHub Issues Templates** - Facilitar contribuições
  - Esforço: ~30min
  - Criar: `.github/ISSUE_TEMPLATE/bug_report.md`
  - Criar: `.github/ISSUE_TEMPLATE/feature_request.md`

- [ ] **Melhorar descrição do repo GitHub** - Muito genérica atualmente
  - Adicionar: Topics (nextjs, crypto, education, web3)
  - Adicionar: Website link (tokenmilagre.xyz)
  - Adicionar: Social previews

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
│   ├── articles/              # Fase 2
│   └── users/                 # Fase 3
```

---

### ✅ Concluído (Sessões Anteriores)
- [x] Correção do schema Prisma (enums → Strings para compatibilidade)
- [x] Relação ProjectMap → SocialProject com onDelete Cascade
- [x] Remoção de arquivos backup `_BACKUP-*.ORIGINAL.txt`
- [x] Limpeza do jest.setup.js

---

### 🔴 Alta Prioridade (Próximos)

- [ ] **Corrigir testes MSW** - Testes de API/adapters falham por falta de polyfills Node
  - Solução: Criar config jest separada com `testEnvironment: 'node'` para testes MSW
  - Arquivos: `__tests__/api/*`, `lib/adapters/__tests__/*`

- [ ] **Consolidar lib/core/** — Completar núcleo fractal
  - Mover `lib/prisma.ts` → `lib/core/prisma.ts`
  - Mover `lib/constants/*.ts` → `lib/core/constants/`
  - Criar `lib/core/index.ts` com re-exports
  - Risco: 🟡 Médio — requer atualização de imports

---

### 🟠 Média Prioridade  

- [ ] **Dividir `app/page.tsx`** (1073 linhas) em componentes menores
  - Extrair: Hero, LatestNews, Features, Community, etc
  - Benefício: manutenibilidade + performance (lazy loading)

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

