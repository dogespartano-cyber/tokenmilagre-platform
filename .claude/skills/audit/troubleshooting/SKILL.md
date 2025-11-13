# Troubleshooting - Problemas Comuns e Soluções

**Propósito**: Documentação de problemas técnicos resolvidos, suas causas e soluções aplicadas.

**Quando usar**: Consulte ao encontrar bugs similares ou ao implementar funcionalidades relacionadas.

---

## 🧠 INSTRUÇÕES PARA CLAUDE - APRENDIZADO CONTÍNUO

### ⚠️ REGRA CRÍTICA: SEMPRE Consultar Antes de Agir

**ANTES de fazer qualquer mudança significativa no código, SEMPRE:**

1. **Ler esta skill** para verificar se o problema já foi resolvido antes
2. **Procurar por padrões similares** nos problemas documentados
3. **Evitar repetir erros** já conhecidos e catalogados

### 📝 QUANDO Documentar um Novo Problema

**SEMPRE documentar quando:**

- ✅ Resolver um bug que causou erro em build/runtime
- ✅ Corrigir problema de performance significativo
- ✅ Solucionar erro que não era óbvio (debugou >15 minutos)
- ✅ Encontrar configuração incorreta que quebrou funcionalidade
- ✅ Implementar workaround para limitação de biblioteca/framework
- ✅ Resolver erro que pode acontecer novamente (padrão anti-pattern)

**NÃO precisa documentar quando:**

- ❌ Typo simples em código
- ❌ Ajuste de estilo/CSS menor
- ❌ Mudança trivial que não causou erro

### 📋 TEMPLATE para Novo Problema

Ao adicionar novo problema, seguir este template:

```markdown
## Problema X: [Título Descritivo e Específico]

### 🐛 Descrição do Problema
[Explicar o que acontecia, sintomas visíveis, mensagens de erro]

**Severidade**: 🔴 CRÍTICA / 🟡 ALTA / 🟢 MÉDIA / 🔵 BAIXA

### 🔍 Causa Raiz

**Arquivo**: `caminho/do/arquivo.ts` (linha X)

[Explicar a causa técnica do problema]

**Por que aconteceu**:
1. [Razão 1]
2. [Razão 2]
3. [Razão 3]

### ✅ Solução Aplicada

**Mudança feita**:
```[linguagem]
// ❌ ANTES (código com problema)
código antigo

// ✅ DEPOIS (código corrigido)
código novo
```

**Por que funciona**:
[Explicar tecnicamente por que a solução resolve]

### 💡 Lições Aprendidas

1. **[Lição principal]**: [Explicação]
2. **[Lição secundária]**: [Explicação]

### 🔧 Como Evitar no Futuro

- [ ] Checklist item 1
- [ ] Checklist item 2
- [ ] Verificação a fazer antes de mudanças similares

### 📚 Referências

- [Link para documentação]
- [Link para issue/PR]

**Commit da correção**: `hash-do-commit`
```

### 🔄 PROCESSO de Documentação

**Passo a passo:**

1. **Resolver o problema** completamente
2. **Fazer commit** da correção
3. **Adicionar ao índice** (topo do arquivo)
4. **Escrever documentação** seguindo template
5. **Adicionar ao final** do arquivo (antes de "Última atualização")
6. **Atualizar versão** e data no rodapé
7. **Fazer commit separado** da documentação

**Exemplo de commit de documentação:**
```bash
git commit -m "docs: Adicionar Problema X à skill troubleshooting

- Documentar erro [descrição curta]
- Explicar causa raiz: [motivo]
- Detalhar solução aplicada
- Commit de correção: [hash]"
```

### 🎯 BENEFÍCIOS de Manter Esta Skill Atualizada

1. **Evita regressões** - Não repetir erros já resolvidos
2. **Acelera debugging** - Problemas similares resolvem-se mais rápido
3. **Transferência de conhecimento** - Novos desenvolvedores aprendem com erros passados
4. **Base de conhecimento** - Cresce organicamente com o projeto
5. **Qualidade do código** - Padrões anti-pattern ficam documentados

### 🔍 COMO Consultar Esta Skill

**Antes de implementar mudanças em:**

| Área do Código | Problemas Relevantes |
|----------------|---------------------|
| **Build scripts** | Problema 7 (Prisma DB Push) |
| **Navegação/Scroll** | Problema 1 (Scroll Position) |
| **Cache/Performance** | Problema 2, 4 (Flash Visual, Fear & Greed) |
| **Componentes externos** | Problema 3 (Ticker Tape) |
| **Markdown/Regex** | Problema 5 (Quebras de Linha) |
| **APIs externas** | Problema 6 (Gemini) |

**Comando mental antes de codar:**
> "Já resolvemos algo parecido antes? Deixa eu checar a skill troubleshooting..."

---

## 📋 Índice de Problemas

### Erros de Deploy (Vercel/Build)
1. [6 Erros Sequenciais de Deploy - Novembro 2025](#erros-de-deploy-no-vercel-novembro-2025)
2. [Build Vercel Falhando - Prisma DB Push](#problema-8-build-vercel-falhando---prisma-db-push)

### Problemas de UX/Performance
3. [Scroll Position Bug - Páginas /criptomoedas](#problema-1-scroll-position-bug)
4. [Flash Visual ao Navegar - Cache](#problema-2-flash-visual-ao-navegar)
5. [Ticker Tape Recarregando](#problema-3-ticker-tape-recarregando)
6. [Fear & Greed Cache Inteligente](#problema-4-fear--greed-cache-inteligente)

### Problemas de Código
7. [Regex Removendo Quebras de Linha - Markdown](#problema-5-regex-removendo-quebras-de-linha)
8. [API Gemini - Nomes Corretos dos Modelos](#problema-6-api-gemini---nomes-corretos-dos-modelos)

---

## Erros de Deploy no Vercel (Novembro 2025)

### 📋 Contexto

Durante a implementação das **Fases 1-4 de expansão de conteúdo** (novembro 2025), encontramos **6 erros sequenciais** de deploy no Vercel. Cada erro só aparecia depois que o anterior era corrigido, criando um processo de debugging em cascata.

**Por que aconteceu em cascata?**
```
1. npm install
   ↓
2. prisma generate (postinstall)
   ↓
3. prisma db push (build script) ← Erro 5
   ↓
4. next build (compila TypeScript) ← Erros 1, 2, 3, 4
   ↓
5. Geração de páginas estáticas ← Erro 6
```

Cada etapa só executa se a anterior funcionar. Por isso descobrimos um erro de cada vez.

---

### 🔴 Erro 1: Importação Incorreta do Prisma

**Severidade**: 🔴 CRÍTICA

**Sintomas**:
```
Error: Attempted import error: '@/lib/prisma' does not contain a default export
```

**Causa Raiz**: O arquivo `/lib/prisma.ts` exporta o Prisma Client como **named export** (`export const prisma`), mas os novos arquivos de API estavam tentando importá-lo como **default export**.

**Código Incorreto**:
```typescript
// ❌ ERRADO
import prisma from '@/lib/prisma';
```

**Solução**:
```typescript
// ✅ CORRETO
import { prisma } from '@/lib/prisma';
```

**Arquivos Afetados**:
- `app/api/community-stories/route.ts`
- `app/api/community-stories/[slug]/route.ts`
- `app/api/social-projects/route.ts`
- `app/api/social-projects/[slug]/route.ts`
- `app/api/project-map/route.ts`
- `app/api/gamification/award-points/route.ts`
- `app/api/user-progress/route.ts`

**Lição Aprendida**:
- ✅ Sempre verificar se a exportação é default ou named antes de importar
- ✅ Manter consistência no padrão de exportação em toda a codebase
- ✅ Usar ESLint rule `import/no-default-export` em arquivos de utilitários

---

### 🔴 Erro 2: Parâmetros de Rota do Next.js 15

**Severidade**: 🔴 CRÍTICA

**Sintomas**:
```
Type error: Type "{ params: { slug: string; }; }" is not a valid type
for the function's second argument
```

**Causa Raiz**: O Next.js 15 mudou a API de rotas dinâmicas. Os parâmetros agora são uma **Promise** que precisa ser aguardada com `await`.

**Código Incorreto** (Next.js 14):
```typescript
// ❌ ERRADO (padrão antigo)
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params; // Acesso direto
}
```

**Solução** (Next.js 15):
```typescript
// ✅ CORRETO (padrão novo)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Precisa de await
}
```

**Arquivos Afetados**:
- `app/api/community-stories/[slug]/route.ts`
- `app/api/social-projects/[slug]/route.ts`

**Lição Aprendida**:
- ✅ No Next.js 15+, sempre usar `await params` em rotas dinâmicas
- ✅ Consultar a documentação oficial quando atualizar major versions
- ✅ SearchParams também são Promise no Next.js 15

**Referência**:
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [Dynamic Routes Migration](https://nextjs.org/docs/app/api-reference/file-conventions/route)

---

### 🔴 Erro 3: Dependência Faltando (lucide-react)

**Severidade**: 🔴 CRÍTICA

**Sintomas**:
```
Error: Cannot find module 'lucide-react' or its corresponding type declarations
```

**Causa Raiz**: Componentes usavam ícones do pacote `lucide-react`, mas o pacote não estava listado em `package.json`.

**Código com Erro**:
```typescript
import { Heart, CheckCircle2, TrendingUp } from 'lucide-react';
// ❌ Erro: módulo não encontrado
```

**Solução**:
```bash
npm install lucide-react@^0.468.0
```

Ou adicionar manualmente ao `package.json`:
```json
{
  "dependencies": {
    "lucide-react": "^0.468.0"
  }
}
```

**Arquivos Afetados**:
- `components/CommunityStoryCard.tsx`
- `components/SocialProjectCard.tsx`
- `components/InteractiveTool.tsx`

**Lição Aprendida**:
- ✅ Sempre adicionar pacotes ao package.json imediatamente após usá-los
- ✅ Verificar imports antes de fazer commit
- ✅ Usar `npm install <pacote>` em vez de só importar
- ✅ Rodar `npm run build` localmente antes de push

---

### 🔴 Erro 4: Prop Inválido em Componentes lucide-react

**Severidade**: 🟡 ALTA

**Sintomas**:
```
Type error: Type '{ className: string; title: string; }' is not assignable to type...
Property 'title' does not exist
```

**Causa Raiz**: Os componentes SVG do `lucide-react` não aceitam o atributo HTML `title`. Eles têm um conjunto restrito de props permitidas.

**Código Incorreto**:
```typescript
// ❌ ERRADO
<CheckCircle2 className="w-4 h-4 text-blue-500" title="Verificado" />
```

**Solução**:
```typescript
// ✅ CORRETO - usar aria-label para acessibilidade
<CheckCircle2 className="w-4 h-4 text-blue-500" aria-label="Verificado" />

// OU envolver em um elemento com title
<span title="Verificado">
  <CheckCircle2 className="w-4 h-4 text-blue-500" />
</span>
```

**Arquivo Afetado**:
- `components/CommunityStoryCard.tsx:83`

**Lição Aprendida**:
- ✅ Componentes de bibliotecas têm suas próprias restrições de props
- ✅ Usar `aria-label` em vez de `title` para acessibilidade em SVGs
- ✅ Consultar a documentação da biblioteca antes de usar atributos HTML padrão
- ✅ TypeScript strict mode ajuda a pegar esses erros localmente

**Referência**:
- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)
- [ARIA Labels Best Practices](https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html)

---

### 🔴 Erro 5: Variável de Ambiente DIRECT_URL Não Configurada

**Severidade**: 🔴 CRÍTICA

**Sintomas**:
```
Error: Environment variable not found: DIRECT_URL.
  -->  prisma/schema.prisma:13
   |
12 |   url      = env("DATABASE_URL")
13 |   directUrl = env("DIRECT_URL")
   |
Error code: P1012
```

**Causa Raiz**: O Prisma schema exigia a variável de ambiente `DIRECT_URL` que não estava configurada no Vercel. O `directUrl` é opcional e usado apenas para connection pooling avançado.

**Código Incorreto**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // ❌ Variável não configurada
}
```

**Solução**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ✅ Apenas DATABASE_URL
}
```

**Quando Usar directUrl**:
O `directUrl` só é necessário quando você usa **connection pooling** como PgBouncer:
- `url`: Aponta para a conexão pooled (para queries)
- `directUrl`: Aponta para a conexão direta (para migrações)

**Lição Aprendida**:
- ✅ Não adicionar configurações opcionais sem necessidade
- ✅ Documentar quando `directUrl` é realmente necessário
- ✅ Verificar variáveis de ambiente antes de fazer deploy
- ✅ Manter `.env.example` atualizado com todas as variáveis necessárias

**Referência**:
- [Prisma Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

### 🔴 Erro 6: Database Schema Não Sincronizado

**Severidade**: 🔴 CRÍTICA

**Sintomas (6a: Coluna Inexistente)**:
```
Error [PrismaClientKnownRequestError]:
Invalid `prisma.article.findFirst()` invocation:

The column `Article.warningLevel` does not exist in the current database.
Code: P2022
```

**Sintomas (6b: Baseline Migration)**:
```
Error: P3005
The database schema is not empty. Read more about how to baseline
an existing production database: https://pris.ly/d/migrate-baseline
```

**Causa Raiz**: O código esperava colunas novas (como `Article.warningLevel`) que foram adicionadas ao Prisma schema, mas nunca foram criadas no banco de dados de produção. O banco foi criado com `prisma db push` em vez de migrations, então não tinha histórico de migração rastreado.

**Tentativa de Solução (Falhou)**:
```json
// ❌ Tentativa 1: usar prisma migrate deploy
{
  "scripts": {
    "build": "prisma migrate deploy && next build"
  }
}
```
**Resultado:** Erro P3005 (schema não vazio, precisa de baseline)

**Solução Final**:
```json
// ✅ Solução: usar prisma db push
{
  "scripts": {
    "build": "prisma db push --accept-data-loss && next build"
  }
}
```

**Por Que Funciona**:

**prisma migrate deploy:**
- Executa migrações rastreadas em `prisma/migrations`
- Exige que o banco esteja "limpo" ou tenha baseline configurado
- Mantém histórico completo de mudanças
- Ideal para projetos que usaram Prisma Migrate desde o início

**prisma db push:**
- Sincroniza o schema diretamente com o banco
- Não requer histórico de migrações
- Idempotente (pode executar múltiplas vezes)
- Adiciona novas colunas/tabelas sem perder dados existentes
- Ideal para bancos sem histórico de migração rastreado

**Lição Aprendida**:
- ✅ Usar `prisma db push` quando o banco não tem histórico de migrações
- ✅ Usar `prisma migrate deploy` apenas em projetos com migrations desde o início
- ✅ O flag `--accept-data-loss` permite execução não-interativa
- ✅ Documentar qual estratégia de migração o projeto usa
- ✅ Considerar baseline se projeto cresceu sem migrations

**Referência**:
- [Prisma Migrate vs DB Push](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push)
- [Baseline Existing Database](https://www.prisma.io/docs/guides/migrate/production-troubleshooting)

---

### 📊 Resumo dos 6 Erros

| # | Erro | Severidade | Tempo para Resolver |
|---|------|------------|---------------------|
| 1 | Importação Prisma | 🔴 Crítica | ~15 min |
| 2 | Params Next.js 15 | 🔴 Crítica | ~20 min |
| 3 | lucide-react missing | 🔴 Crítica | ~5 min |
| 4 | lucide props | 🟡 Alta | ~10 min |
| 5 | DIRECT_URL | 🔴 Crítica | ~15 min |
| 6 | Schema sync | 🔴 Crítica | ~45 min |
| **Total** | | | **~2 horas** |

### 🎯 Top 5 Ações Preventivas

1. **✅ Verificar Importações**: Named vs default exports
2. **✅ Consultar Docs da Versão**: Next.js 15 mudou APIs importantes
3. **✅ Adicionar Dependências**: Sempre usar npm install, não só importar
4. **✅ Testar Localmente**: Executar `npm run build` antes de deploy
5. **✅ Sincronizar Schema**: Usar `prisma db push` em bancos sem histórico

---

## Problema 1: Scroll Position Bug

### 🐛 Descrição do Bug
Ao navegar de qualquer página (com scroll para baixo) para páginas da hierarquia `/criptomoedas/*`, a página abria na posição de scroll **anterior** ao invés do topo.

**Afetava:**
- `/criptomoedas` (página principal)
- `/criptomoedas/[slug]` (páginas individuais das moedas)

### 🔍 Causa Raiz
As páginas de criptomoedas **não tinham** código para forçar scroll para o topo ao montar. O Next.js App Router scroll restoration estava falhando especificamente nesta hierarquia.

### ✅ Solução Aplicada

**Arquivo**: `app/criptomoedas/page.tsx`
```typescript
export default function CriptomoedasPage() {
  // Forçar scroll para o topo ao montar
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // resto do componente...
}
```

**Arquivo**: `app/criptomoedas/[slug]/page.tsx`
```typescript
export default function CryptoPage() {
  // Forçar scroll para o topo ao montar ou mudar de moeda
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  // resto do componente...
}
```

### 📝 Detalhes
- **`behavior: 'instant'`**: Scroll sem animação (imperceptível)
- **`top: 0, left: 0`**: Posição exata do topo
- **Dependências**: `[]` (página principal) | `[slug]` (página da moeda)

### ⚠️ Tentativas que NÃO Funcionaram
1. ❌ `useLayoutEffect` global no layout root → quebrou todas as páginas
2. ❌ `scroll={false}` nos Links → não resolveu
3. ❌ `window.history.scrollRestoration = 'manual'` → piorou

### 💡 Lição Aprendida
**Controle local > Controle global**: Quando o problema afeta apenas uma hierarquia específica de rotas, aplique a solução **localmente** naquelas páginas.

---

## Problema 2: Flash Visual ao Navegar

### 🐛 Descrição do Bug
Ao navegar entre páginas, elementos que dependiam de fetch (Market Data, Notícias, Educação, Fear & Greed) **"piscavam"** ou apareciam vazios antes de carregar.

**Manifestação:**
- Velocímetro sumia e reaparecia
- Cards de notícias/educação pulavam na tela
- Market stats "tremiam"

### 🔍 Causa Raiz
Componentes começavam com estado vazio (`null` ou `[]`) e só populavam **após** o fetch completar. Isso criava um "flash" visual onde o conteúdo sumia e reaparecia.

### ✅ Solução: Cache Client-Side em Duas Camadas

**Padrão aplicado em todos os componentes afetados:**

```typescript
const fetchData = async () => {
  const CACHE_KEY = 'unique_cache_key';

  // 1. Carregar do cache IMEDIATAMENTE (elimina flash)
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const cachedData = JSON.parse(cached);
      setData(cachedData);
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
    }
  }

  // 2. Buscar dados atualizados em background
  try {
    const response = await fetch('/api/endpoint');
    const result = await response.json();

    if (result.success) {
      setData(result.data);
      // Salvar no cache
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    // Manter dados em cache se houver erro
  }
};
```

### Arquivos Modificados

| Componente | Cache Key | Duração |
|------------|-----------|---------|
| `DashboardHeader.tsx` | `fear_greed_index` | Sessão |
| `app/page.tsx` | `home_market_data`, `home_news_list`, `home_education_list` | Sessão |
| `criptomoedas/[slug]/page.tsx` | `crypto_${slug}` | 1 hora |
| `TopCryptosList.tsx` | `crypto_top_list` | 30 minutos |

### 📊 Resultados
- ✅ **Zero flash visual** ao navegar
- ⚡ **Carregamento instantâneo** de dados em cache
- 🔄 **Atualização silenciosa** em background
- 💾 **Cache persistente** durante toda a sessão

### 💡 Lição Aprendida
**Cache duplo** (carregar imediatamente + atualizar em background) elimina flash visual sem sacrificar dados atualizados.

---

## Problema 3: Ticker Tape Recarregando

### 🐛 Descrição do Bug
O Ticker Tape (widget TradingView) **recarregava completamente** ao voltar para páginas que o continham, causando:
- Flash branco
- Delay de 1-2 segundos
- Perda de estado (posição do scroll horizontal do ticker)

### 🔍 Causa Raiz
O Ticker estava dentro do `DashboardHeader`, que era **desmontado** ao navegar para páginas sem header, destruindo o widget e seu iframe/script.

### ✅ Solução: Elevação do Componente

**Estratégia**: Mover o Ticker para o **layout root** (sempre montado) e controlar visibilidade via CSS.

**Mudanças:**

1. **Remover do DashboardHeader** (`app/components/DashboardHeader.tsx`)
2. **Adicionar ao Layout Root** (`app/layout-root.tsx`):

```typescript
import dynamic from 'next/dynamic';

const TickerTapeWidget = dynamic(() => import('@/components/TickerTapeWidget'), {
  ssr: false,
});

// Ticker Tape - Sempre montado
<div
  className="container mx-auto px-4"
  style={{
    display: headerConfig ? 'block' : 'none',
  }}
>
  <div className="rounded-2xl overflow-hidden shadow-md border">
    <TickerTapeWidget />
  </div>
</div>
```

### 📊 Como Funciona

**Antes:**
- Ticker dentro do DashboardHeader
- Desmontado ao sair de páginas com header
- Remontado ao voltar (recarrega script TradingView)

**Depois:**
- Ticker no layout root (nível superior)
- **Sempre montado** em background
- Apenas oculto/exibido via CSS (`display: none/block`)
- Widget continua funcionando mesmo quando oculto

### 📊 Resultados
- 🎯 **Sem recarregamento** - Widget permanece ativo
- ⚡ **Transição instantânea** - Apenas exibe/oculta
- 📊 **Preços sempre atualizados** - Continua funcionando oculto
- ✨ **Sem flash visual** - Aparece imediatamente

### 💡 Lição Aprendida
Widgets externos (TradingView, iframes) devem ser **elevados para um nível que nunca desmonta** quando precisam persistir estado.

---

## Problema 4: Fear & Greed Cache Inteligente

### 🐛 Descrição do Problema
O Fear & Greed Index estava configurado para **NUNCA usar cache** (`revalidate = 0`), fazendo uma requisição à API externa toda vez, mesmo sabendo que o índice atualiza apenas **1x por dia**.

**Problemas:**
- Requisições desnecessárias
- Risco de rate limits
- Latência desnecessária

### 🔍 Análise
A API do alternative.me retorna um campo `time_until_update` (em segundos) que indica **exatamente** quando será a próxima atualização.

**Exemplo de resposta:**
```json
{
  "data": [{
    "value": "50",
    "value_classification": "Neutral",
    "timestamp": "1761609600",
    "time_until_update": "77937"  // ~21.6 horas
  }]
}
```

### ✅ Solução: Cache Dinâmico

**Arquivo**: `app/api/fear-greed/route.ts`

```typescript
// Cache em memória
let cachedData = null;
let cacheExpiry = 0;

export async function GET() {
  try {
    // Verificar cache válido
    const now = Date.now();
    if (cachedData && now < cacheExpiry) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
      });
    }

    // Buscar dados frescos
    const response = await fetch('https://api.alternative.me/fng/');
    const data = await response.json();
    const fearGreedData = data.data[0];

    // Calcular expiração baseado no time_until_update
    const timeUntilUpdate = parseInt(fearGreedData.time_until_update);
    cachedData = fearGreedData;
    cacheExpiry = now + (timeUntilUpdate * 1000);

    return NextResponse.json({
      success: true,
      data: fearGreedData,
      cached: false,
    });
  } catch (error) {
    // Fallback: retornar cache antigo se houver erro
    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
        stale: true,
      });
    }

    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
```

### 📊 Benefícios

1. **Cache Dinâmico**: Duração baseada no tempo real de atualização da API
2. **Redução de Requisições**: De ~1440 req/dia → 1 req/dia
3. **Sempre Atualizado**: Cache expira exatamente quando API atualiza
4. **Fallback Resiliente**: Retorna cache antigo se API falhar

### 💡 Lição Aprendida
Quando uma API fornece informação sobre seu próprio ciclo de atualização, use isso para criar um **cache dinâmico inteligente**.

---

## Problema 5: Regex Removendo Quebras de Linha

### 🐛 Descrição do Bug
Artigos markdown tinham **todas as quebras de linha removidas**, causando formatação completamente quebrada:
- Títulos grudados no texto
- Parágrafos sem separação
- Leitura impossível

**Severidade**: 🔴 CRÍTICA

### 📋 Sintomas

1. **Conteúdo markdown sem separação:**
   ```
   ## Título A exchange anunciou...## Outro Título Mais texto...
   ```

2. **Logs mostravam quebras antes, mas sumiam depois:**
   ```javascript
   // ANTES (OK): Content original: ## Título\n\nTexto...
   // DEPOIS (QUEBRADO): Content processado: ## Título Texto...
   ```

### 🔍 Causa Raiz

**Arquivo**: `lib/article-processor-client.ts:23`
**Função**: `cleanReferences()`

```typescript
// ❌ CÓDIGO PROBLEMÁTICO
export function cleanReferences(text: string): string {
  return text
    .replace(/\[\d+\]/g, '')
    .replace(/(?:\[\d+\])+/g, '')
    .replace(/\[\s*\d+\s*\]/g, '')
    .replace(/\s{2,}/g, ' ')  // 🔴 Remove quebras de linha!
    .trim();
}
```

**Explicação técnica:**

| Regex | Significado | Problema |
|-------|-------------|----------|
| `\s{2,}` | Qualquer espaço em branco (2+) | Remove `\n`, `\r`, `\t`, espaços |
| `[ \t]{2,}` | Apenas espaços e tabs (2+) | **NÃO** remove `\n` ✅ |

- `\s` inclui `\n` (line feed), `\r` (carriage return), `\t` (tab), espaços
- `\s{2,}` substituía `\n\n` (separador de parágrafos markdown) por espaço simples
- Resultado: markdown perdia toda estrutura

### ✅ Solução Aplicada

```typescript
// ✅ CÓDIGO CORRIGIDO
export function cleanReferences(text: string): string {
  return text
    .replace(/\[\d+\]/g, '')
    .replace(/(?:\[\d+\])+/g, '')
    .replace(/\[\s*\d+\s*\]/g, '')
    .replace(/[ \t]{2,}/g, ' ')  // ✅ Preserva \n
    .trim();
}
```

**Mudança**: `\s{2,}` → `[ \t]{2,}`

**Efeito**: Preserva quebras de linha enquanto normaliza espaços/tabs

### 🧪 Teste de Validação

**Arquivo**: `scripts/test-line-breaks.js`

```javascript
const test = `## Título\n\nParágrafo[1].\n\n## Outro`;
const result = cleanReferences(test);

// ✅ Resultado esperado:
// "## Título\n\nParágrafo.\n\n## Outro"
```

**Resultados:**
- ✅ Teste 1: Quebras preservadas + Referências removidas
- ✅ Teste 2: `[1][2][3]` removidas corretamente
- ✅ Teste 3: 3 quebras duplas entrada = 3 quebras duplas saída

### 🚨 Como Diagnosticar

**Sinais de alerta:**
1. Logs mostram `\n` sumindo entre ANTES/DEPOIS
2. Preview/renderização grudada
3. Função usa `\s` em regex de limpeza

**Como investigar:**
```typescript
// Adicionar logs comparativos
console.log('ANTES:', text.substring(0, 200));
const result = cleanReferences(text);
console.log('DEPOIS:', result.substring(0, 200));
```

```bash
# Procurar regex suspeitas
grep -r "replace.*\\s" lib/
```

### 💡 Lições Aprendidas

1. **`\s` é perigosa para markdown** - sempre avaliar se precisa preservar `\n`
2. **Logs comparativos são essenciais** - ANTES/DEPOIS mostram onde quebras somem
3. **Testes isolados economizam tempo** - testar função fora do fluxo completo
4. **Comentários explicativos previnem regressões**

### 📊 Classes de Caracteres Úteis

| Classe | Inclui | Quando usar |
|--------|--------|-------------|
| `\s` | `\n`, `\r`, `\t`, espaços | Quando QUER remover quebras |
| `[ \t]` | Apenas espaços e tabs | Quando QUER preservar `\n` |

---

## Problema 6: API Gemini - Nomes Corretos dos Modelos

### 🐛 Descrição do Problema
Ao tentar usar a API Gemini com nomes de modelos incorretos ou desatualizados, a API retorna erro:

```
Gemini API error: models/gemini-2.5-pro-latest is not found for API version v1beta,
or is not supported for generateContent.
```

**Causa comum**: Usar nomes de modelos que não existem ou sufixos incorretos como `-latest`.

### 🔍 Nomes Corretos dos Modelos (2025)

**⚠️ IMPORTANTE**: A API Gemini **NÃO** usa sufixo `-latest` nos nomes de modelos.

#### ✅ Modelos Gemini 2.5 (Mais Recentes)

| Nome do Modelo | Tipo | Uso Recomendado |
|----------------|------|-----------------|
| `gemini-2.5-pro` | Pro (Estável) | ⭐ **Tarefas complexas, raciocínio avançado** |
| `gemini-2.5-pro-preview-tts` | Pro Preview | Text-to-Speech experimental |
| `gemini-2.5-flash` | Flash (Estável) | Respostas rápidas, custo-benefício |
| `gemini-2.5-flash-lite` | Flash Lite | Tarefas simples, ultra rápido |

#### ✅ Modelos Gemini 2.0

| Nome do Modelo | Tipo | Uso Recomendado |
|----------------|------|-----------------|
| `gemini-2.0-flash` | Latest | Versão mais recente do 2.0 |
| `gemini-2.0-flash-001` | Estável | Versão estável específica |
| `gemini-2.0-flash-exp` | Experimental | Testes, features experimentais |
| `gemini-2.0-flash-lite` | Lite | Tarefas simples |

### 📝 Uso na API

**Formato da URL:**
```typescript
const url = `https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key=${API_KEY}`;
```

**Exemplos corretos:**
```typescript
// ✅ CORRETO - Gemini 2.5 Pro (mais poderoso)
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${API_KEY}`

// ✅ CORRETO - Gemini 2.5 Flash (mais rápido)
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`

// ❌ ERRADO - Sufixo -latest não existe
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-latest:generateContent?key=${API_KEY}`

// ❌ ERRADO - Nome de modelo inválido
`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`
```

### 🎯 Qual Modelo Usar?

**Para o Editor de Artigos (`/api/editor-chat`):**
- ✅ **`gemini-2.5-pro`** - Máxima qualidade, raciocínio complexo
- Ideal para edições de texto, análises, sugestões avançadas

**Para Chat Geral (`/api/chat/gemini`):**
- ✅ **`gemini-2.5-flash`** - Bom equilíbrio velocidade/qualidade
- Ideal para conversas rápidas, respostas diretas

**Para Tarefas Simples:**
- ✅ **`gemini-2.5-flash-lite`** - Máxima velocidade
- Ideal para validações simples, formatações

### 🔍 Como Verificar Modelos Disponíveis

**Endpoint para listar modelos:**
```
GET https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}
```

**Ou use o endpoint local:**
```
GET http://localhost:3000/api/list-gemini-models
```

Este endpoint retorna apenas modelos que suportam `generateContent`.

### ⚠️ Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `models/gemini-2.5-pro-latest is not found` | Sufixo `-latest` incorreto | Remover `-latest`, usar `gemini-2.5-pro` |
| `models/gemini-pro is not found` | Nome antigo/incompleto | Usar `gemini-2.5-pro` ou `gemini-1.5-pro` |
| `not supported for generateContent` | Modelo não suporta geração | Usar modelos da lista acima |

### 📊 Comparação de Modelos

| Feature | 2.5 Pro | 2.5 Flash | 2.0 Flash Exp |
|---------|---------|-----------|---------------|
| **Poder** | 🏆 Máximo | ⚡ Alto | 🧪 Médio |
| **Velocidade** | Moderada | Rápida | Muito rápida |
| **Contexto** | 1M tokens | 1M tokens | 32k tokens |
| **Custo** | Mais alto | Moderado | Baixo |
| **Estabilidade** | ✅ Estável | ✅ Estável | ⚠️ Experimental |
| **Uso Recomendado** | Produção crítica | Produção geral | Testes/dev |

### 💡 Lições Aprendidas

1. **Nunca use `-latest` no nome do modelo** - A API Gemini não usa este sufixo
2. **Consulte a documentação oficial** regularmente - Modelos novos são lançados frequentemente
3. **Use o endpoint de listagem** para verificar modelos disponíveis na sua API key
4. **Gemini 2.5 > Gemini 2.0** - Sempre prefira a versão mais recente quando disponível
5. **Pro vs Flash** - Pro para qualidade, Flash para velocidade

### 📚 Referências

- [Documentação oficial dos modelos Gemini](https://ai.google.dev/gemini-api/docs/models)
- [Lista completa de modelos disponíveis](https://ai.google.dev/api/models)
- [Changelog da API Gemini](https://ai.google.dev/gemini-api/docs/changelog)

### 🔧 Implementação no Projeto

**Arquivo**: `app/api/editor-chat/route.ts`

```typescript
// ✅ Implementação correta
const geminiResponse = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: geminiMessages,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    })
  }
);
```

**Configuração de ambiente** (`.env`):
```bash
GEMINI_API_KEY=your-api-key-from-google-ai-studio
```

---

## 📋 Checklist de Debug para Problemas Similares

### Scroll Issues
- [ ] Verificar `useEffect` com scroll nas páginas afetadas
- [ ] Testar `behavior: 'instant'` vs `'smooth'`
- [ ] Identificar se é global ou local (hierarquia específica)
- [ ] Evitar controle global se problema é local

### Flash Visual / Recarregamento
- [ ] Identificar se componente está sendo desmontado/remontado
- [ ] Implementar cache client-side (sessionStorage/localStorage)
- [ ] Padrão: carregar cache imediato + fetch background
- [ ] Para widgets externos: elevar para layout que não desmonta

### Cache / Performance
- [ ] Verificar se API fornece informação sobre ciclo de atualização
- [ ] Implementar cache em dois níveis (server + client)
- [ ] Adicionar fallback para dados em cache quando API falhar
- [ ] Usar `sessionStorage` para dados que mudam raramente

### Markdown / Regex Issues
- [ ] Verificar se regex usa `\s` que pode remover quebras de linha
- [ ] Adicionar logs ANTES/DEPOIS de funções de limpeza de texto
- [ ] Testar com conteúdo markdown real (`## Título\n\nTexto`)
- [ ] Usar `[ \t]` em vez de `\s` quando precisar preservar `\n`
- [ ] Validar que `\n\n` (separador de parágrafos) está preservado

### API Gemini Issues
- [ ] Verificar nome do modelo (não usar `-latest`)
- [ ] Confirmar que modelo está na lista de 2025
- [ ] Usar `gemini-2.5-pro` para tarefas complexas
- [ ] Usar `gemini-2.5-flash` para respostas rápidas
- [ ] Testar com endpoint `/api/list-gemini-models` se houver dúvidas
- [ ] Verificar que API key tem acesso ao modelo escolhido

---

## 🛠️ Padrões Estabelecidos

### Pattern 1: Cache Client-Side com Background Update
```typescript
const fetchData = async () => {
  const CACHE_KEY = 'unique_key';

  // Imediato: carregar cache
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) setData(JSON.parse(cached));

  // Background: atualizar
  const response = await fetch('/api/endpoint');
  const result = await response.json();

  setData(result.data);
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
};
```

### Pattern 2: Scroll Reset em Páginas Específicas
```typescript
export default function ProblematicPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []); // ou [dependencia] se precisar resetar em mudanças

  // resto do componente...
}
```

### Pattern 3: Widget Persistence (Elevação)
```typescript
// layout-root.tsx
<div style={{ display: condition ? 'block' : 'none' }}>
  <PersistentWidget />
</div>
```

---

## Problema 8: Build Vercel Falhando - Prisma DB Push

### 🐛 Descrição do Problema
Build na Vercel falha com erro de conexão ao banco de dados durante o processo de build:

```
Error: P1001: Can't reach database server at ep-rapid-paper-adrzxy4v-pooler.c-2.us-east-1.aws.neon.tech:5432

Please make sure your database server is running
Error: Command "npm run build" exited with 1
```

**Severidade**: 🔴 CRÍTICA - Impede deploy

### 🔍 Causa Raiz

**Arquivo**: `package.json`

```json
{
  "scripts": {
    "build": "prisma db push --accept-data-loss && next build"
  }
}
```

**Problema**: O comando `prisma db push` está no script de **build**, mas:

1. **`prisma db push`** precisa de **conexão ativa** com o banco de dados
2. Durante builds na Vercel, o acesso ao banco pode não estar disponível ou credenciais podem estar incorretas
3. **`db push`** é para **desenvolvimento/migrações**, não para builds de produção
4. O Prisma Client já é gerado no `postinstall` via `prisma generate`

**Fluxo incorreto**:
```
npm run build
  ↓
prisma db push (tenta conectar ao banco)
  ↓
❌ ERRO: Can't reach database server
  ↓
Build falha antes mesmo de compilar o Next.js
```

### ✅ Solução Aplicada

**Remover `prisma db push` do script de build**:

```json
{
  "scripts": {
    "build": "next build",  // ✅ Apenas build do Next.js
    "postinstall": "prisma generate",  // ✅ Já gera Prisma Client
    "db:push": "npx prisma db push"  // ✅ Separado para uso manual
  }
}
```

**Por que funciona**:

1. **`prisma generate`** (no `postinstall`):
   - Roda automaticamente ao instalar dependências
   - Gera o Prisma Client em `lib/generated/prisma`
   - **NÃO precisa** de conexão com banco
   - Suficiente para o código TypeScript compilar

2. **`next build`**:
   - Compila código TypeScript/React
   - **NÃO acessa** o banco (apenas em runtime)
   - Gera build otimizado

3. **Runtime** (quando app roda):
   - Aí sim o código acessa o banco via Prisma Client
   - Variáveis `DATABASE_URL` e `DIRECT_URL` são usadas

### 📊 Quando Usar `prisma db push`

**✅ CORRETO - Desenvolvimento Local**:
```bash
npm run db:push  # Script separado para desenvolvimento
```

**❌ ERRADO - Build de Produção**:
```json
"build": "prisma db push && next build"  // NÃO fazer isso
```

### 💡 Lições Aprendidas

1. **Separar concerns de build-time vs runtime**:
   - Build-time: Apenas geração de código (Prisma Client)
   - Runtime: Acesso ao banco de dados

2. **Scripts de build devem ser agnósticos de infraestrutura**:
   - Não assumir acesso a banco, variáveis de ambiente específicas, etc.
   - Build deve funcionar offline (exceto download de deps)

3. **Usar scripts separados para operações de banco**:
   - `db:push` - Push schema para dev
   - `db:migrate` - Migrations para produção
   - `db:studio` - Prisma Studio
   - `build` - Apenas compilação

### 🔧 Debug Similar

**Se build falhar com erros de Prisma**:

1. Verificar `package.json` → `scripts.build`
2. Garantir que **não** tem `prisma db push`, `prisma migrate`, ou similar
3. Confirmar que `postinstall` tem `prisma generate`
4. Testar build localmente:
   ```bash
   npm run build
   # Não deve acessar banco
   ```

### 📚 Referências

- [Prisma Docs: Generating Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)
- [Vercel Docs: Build Step](https://vercel.com/docs/deployments/configure-a-build#build-step)

**Commit da correção**: `3f47f68`

---

## 🔍 Tarefas Futuras de Manutenção

### 📊 Auditoria Completa do Projeto (Pendente)

**Status**: ⚠️ Necessária

**Contexto**: Uma auditoria completa foi realizada em novembro/2025 (`AUDITORIA_COMPLETA_2025.md`), mas o trabalho foi perdido quando a build falhou e acabou sendo mesclada incorretamente com a build anterior.

**Ações Recomendadas**:

1. **Realizar nova auditoria completa incluindo**:
   - [ ] Análise de segurança (dependencies vulneráveis, secrets exposure)
   - [ ] Performance audit (Core Web Vitals, bundle size)
   - [ ] Acessibilidade (WCAG compliance)
   - [ ] SEO (meta tags, structured data, sitemap)
   - [ ] Code quality (type safety, dead code, duplicação)
   - [ ] Database schema review (índices, relacionamentos, constraints)
   - [ ] API routes audit (error handling, validation, rate limiting)

2. **Documentar resultados**:
   - Criar nova skill `platform-audit` com checklist permanente
   - Ou adicionar seção dedicada nesta skill
   - Manter registro de auditorias periódicas (trimestral recomendado)

3. **Automatizar onde possível**:
   - CI/CD checks para segurança (npm audit, Snyk)
   - Lighthouse CI para performance
   - ESLint + TypeScript strict mode
   - Testes automatizados

**Frequência Recomendada**: Trimestral ou antes de releases importantes

**Responsável**: Próximo Claude Code session ou desenvolvedor

---

**Última atualização**: 2025-11-10
**Versão**: 2.3 (adicionada seção de Auditoria Futura)
