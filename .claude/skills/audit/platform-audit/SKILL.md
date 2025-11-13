# Platform Audit - Checklist de Auditoria Completa

**Propósito**: Checklist para auditorias periódicas de segurança, qualidade e performance da plataforma.

**Frequência Recomendada**: Trimestral ou antes de releases importantes

**Quando usar**: Para validar saúde geral do projeto e identificar débitos técnicos.

---

## 🎯 Contexto

Uma auditoria completa foi realizada em **novembro/2025**, mas o trabalho foi perdido quando a build falhou. Esta skill preserva o checklist e findings para futuras auditorias.

**Última auditoria completa**: ⚠️ Pendente (a de nov/2025 foi perdida)

---

## 📊 Estatísticas do Projeto (Nov 2025)

| Métrica | Valor | Status |
|---------|-------|--------|
| Arquivos TS/TSX | 175 | ✅ |
| Linhas de Código | 42.720 | ⚠️ Alto |
| Componentes React | ~50 | ✅ |
| API Routes | 52 | ⚠️ Muitas |
| Prisma Models | 13 | ✅ |
| **Testes Automatizados** | **0** | 🔴 CRÍTICO |
| console.logs | 349 | ⚠️ Alto |
| Type 'any' | 104 | ⚠️ Reduzir |

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS (Nov 2025)

### 1. XSS Potencial - dangerouslySetInnerHTML

**Local**: `app/criptomoedas/[slug]/page.tsx:213`

```tsx
<div
  className="prose prose-lg max-w-none"
  dangerouslySetInnerHTML={{ __html: crypto.description }}
/>
```

**Risco**: 🟡 MÉDIO (apenas admin edita, mas boa prática é sanitizar)

**Fix**:
```bash
npm install dompurify
npm install -D @types/dompurify
```

```tsx
import DOMPurify from 'dompurify';

<div
  className="prose prose-lg max-w-none"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(crypto.description)
  }}
/>
```

**Prioridade**: P1 (importante, mas não emergencial já que só admin edita)

---

### 2. Zero Testes Automatizados

**Status**: 🔴 CRÍTICO

**Impacto**:
- Bugs só descobertos em produção
- Refatorações arriscadas
- Regressões não detectadas
- Confiança baixa em deploys

**Ação Recomendada**: Abordagem incremental

**Setup Inicial** (1 dia):
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D jest-environment-jsdom
```

**Testes Prioritários** (P0):
1. `/api/auth/*` - Autenticação e segurança
2. `/api/articles/import` - Importação de artigos (complexa)
3. `/api/chat/gemini` - Chat IA
4. `/api/perplexity` - Integração Perplexity
5. `/api/user-progress` - Sistema de gamificação

**Estratégia**:
- ✅ Não tentar cobrir tudo de uma vez
- ✅ Adicionar testes **conforme desenvolve** novas features
- ✅ Meta: 1 teste por API modificada
- ✅ Coverage ideal: 60-70% (não 100%)

**Prioridade**: P0 - Setup, P1 - Testes iniciais

---

### 3. Componentes Gigantes

**Arquivos problemáticos**:

| Arquivo | Linhas | Severidade |
|---------|--------|------------|
| `app/dashboard/criar-artigo/page.tsx` | 1.386 | 🔴 CRÍTICO |
| `app/page.tsx` | 1.092 | 🔴 CRÍTICO |
| `hooks/useAdminChat.ts` | 1.017 | 🔴 CRÍTICO |
| `prisma/additional-resources.ts` | 2.126 | ⚠️ Seed data (ok) |

**Problema**: Difícil manter, testar e debugar.

**Estratégia de Refatoração** (não tudo de uma vez):

**Fase 1** - Extrair Hooks (1 semana):
```
criar-artigo/page.tsx (1.386 linhas)
  ↓ Extrair
  - useArticleForm (form state)
  - useArticleValidation (validação)
  - usePerplexityIntegration (API Perplexity)
  - useGeminiRefine (refinamento)
  ↓ Resultado
  ~400 linhas (componente)
  + 4 hooks (200-300 linhas cada)
```

**Fase 2** - Componentes Pequenos (2 semanas):
- `<ArticleForm />` - Formulário principal
- `<PerplexityPanel />` - Integração Perplexity
- `<GeminiRefinePanel />` - Refinamento Gemini
- `<ArticlePreview />` - Preview do artigo

**Prioridade**: P1 - Fazer gradualmente

---

### 4. 349 console.logs em Produção

**Contexto**: Nem todos são problemáticos.

**Classificação**:

**🔴 REMOVER (Dados Sensíveis)**:
```typescript
// ❌ Expõe secrets
console.log('API Key:', apiKey);
console.log('User credentials:', user);
console.log('Database query:', query);
```

**🟡 REVISAR (Dados Detalhados)**:
```typescript
// ⚠️ Pode ter info sensível
console.log('Resposta Perplexity completa:', JSON.stringify(response));
console.log('User data:', userData);
```

**✅ MANTER (Debug Útil)**:
```typescript
// ✅ Útil para debugging
console.log('Fetching crypto:', slug);
console.log('Article created successfully');
console.error('Failed to connect to DB:', error.message);
```

**Ação**:
1. Auditoria manual (meio dia)
2. Remover apenas logs sensíveis
3. Converter debug detalhado para `if (process.env.NODE_ENV === 'development')`

**Prioridade**: P1 - Auditoria de sensíveis, P2 - Limpeza geral

---

## 🟡 PROBLEMAS MODERADOS

### 1. 104 usos de `any` Type

**Impacto**: Perde type safety, autocomplete, previne bugs.

**Estratégia**:
- ❌ **NÃO** refatorar todos de uma vez (arriscado sem testes)
- ✅ Eliminar `any` **APÓS** ter testes
- ✅ Começar pelas APIs críticas
- ✅ Meta: Reduzir para <20 em 2 meses

**Prioridade**: P2 (fazer após testes)

---

### 2. Falta de Otimizações React

**Findings**:
- Apenas 4 `useCallback` encontrados
- Apenas 6 componentes usam `next/image`
- Widgets usam `innerHTML` em vez de React

**Ações**:
- `useCallback` em props passadas para componentes pesados
- `React.memo` em componentes que re-renderizam frequentemente
- `next/image` para todas as imagens (SEO + performance)

**Prioridade**: P2

---

### 3. Rate Limiting

**Contexto**: Vercel já tem proteções automáticas (100 req/10s por IP).

**APIs que se beneficiariam**:
- `/api/chat/gemini` - Custo por request
- `/api/perplexity` - API externa com rate limits
- `/api/articles/import` - Operação pesada

**Solução**: `upstash/ratelimit` (Redis-based)

**Prioridade**: P2

---

## 🟢 PONTOS FORTES (Manter)

✅ **TypeScript Strict Mode** habilitado
✅ **NextAuth** com bcrypt para senhas
✅ **Prisma ORM** protege contra SQL injection
✅ **Environment variables** bem separadas (sem secrets commitados)
✅ **Validação Zod** em 78 locais (muitas APIs)
✅ **Cache inteligente** (sessionStorage + ISR)
✅ **Error handling** em todas APIs (53 catch blocks)
✅ **Sentry integration** configurado
✅ **Next.js 15 + React 19** (versões atuais)
✅ **Skills organizadas** (10 Token Milagre skills)

---

## 📋 CHECKLIST DE AUDITORIA COMPLETA

Use este checklist em auditorias trimestrais:

### 🔒 Segurança

- [ ] Auditoria de dependências (`npm audit`)
- [ ] Verificar secrets não commitados (`git secrets`)
- [ ] Revisar CORS e headers de segurança
- [ ] Validar sanitização de inputs
- [ ] Checar rate limiting em APIs críticas
- [ ] Revisar autenticação/autorização
- [ ] Scan de vulnerabilidades (Snyk)

### 🧪 Qualidade de Código

- [ ] Coverage de testes (meta: 60-70%)
- [ ] Reduzir `any` types (meta: <20)
- [ ] Componentes <500 linhas
- [ ] Complexidade ciclomática <10
- [ ] Remover código morto
- [ ] Lint warnings = 0
- [ ] TypeScript strict errors = 0

### ⚡ Performance

- [ ] Core Web Vitals (LCP, FID, CLS)
- [ ] Bundle size analysis
- [ ] Lazy loading implementado
- [ ] Images otimizadas (next/image)
- [ ] Cache strategy validada
- [ ] API response times <200ms (p95)
- [ ] Database query optimization

### ♿ Acessibilidade

- [ ] WCAG 2.1 AA compliance
- [ ] Lighthouse accessibility score >90
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast ratios
- [ ] ARIA labels corretos

### 📊 SEO

- [ ] Meta tags completas
- [ ] Structured data (schema.org)
- [ ] Sitemap atualizado
- [ ] robots.txt configurado
- [ ] Lighthouse SEO score >90
- [ ] Mobile-friendly test

### 🗄️ Database

- [ ] Índices otimizados
- [ ] N+1 queries identificadas
- [ ] Schema review (constraints, relations)
- [ ] Backup strategy validada
- [ ] Migration strategy documentada

### 📝 Documentação

- [ ] README atualizado
- [ ] Skills atualizadas
- [ ] API docs completas
- [ ] Troubleshooting atualizado
- [ ] ADRs para decisões importantes

---

## 🎯 PRIORIZAÇÃO AJUSTADA

### 🔴 P0 - URGENTE (< 1 semana)

1. **Setup Jest + 5 testes críticos** (3 dias)
2. **Auditoria console.logs sensíveis** (meio dia)

### 🟡 P1 - IMPORTANTE (2-4 semanas)

3. **Sanitizar XSS com DOMPurify** (1 dia)
4. **Refatorar criar-artigo** - Extrair hooks (3-5 dias)
5. **Remover console.logs não-essenciais** (2 dias)
6. **Reduzir `any` nas APIs** (1 semana)

### 🟢 P2 - MÉDIO PRAZO (1-2 meses)

7. Rate limiting custom (upstash)
8. React.memo otimizações
9. E2E tests com Playwright
10. Eliminar todos `any` restantes
11. Migrar widgets para React

---

## 📅 Roadmap de Auditorias

**Frequência**: Trimestral

**Próximas auditorias**:
- [ ] **Q1 2026** (Fev-Mar) - Foco: Testes e qualidade
- [ ] **Q2 2026** (Mai-Jun) - Foco: Performance
- [ ] **Q3 2026** (Ago-Set) - Foco: Segurança
- [ ] **Q4 2026** (Nov-Dez) - Foco: Escalabilidade

**Template**: Executar checklist completo acima

---

## 🔧 Scripts Úteis para Auditoria

```bash
# Security audit
npm audit --production

# Find console.logs
grep -r "console\." --include="*.ts" --include="*.tsx" app/ lib/ components/ | wc -l

# Find 'any' types
grep -r ": any" --include="*.ts" --include="*.tsx" | wc -l

# Component size
find app/ components/ -name "*.tsx" -exec wc -l {} + | sort -rn | head -20

# Bundle size
npm run build && npx @next/bundle-analyzer

# Lighthouse CI
npx lighthouse https://tokenmilagre.com.br --view
```

---

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Web.dev Performance](https://web.dev/vitals/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-11-10
**Baseada em**: Auditoria Nov 2025 (perdida) + Análise atual
