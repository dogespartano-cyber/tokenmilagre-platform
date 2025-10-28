# Troubleshooting - Problemas Comuns e Soluções

**Propósito**: Documentação de problemas técnicos resolvidos, suas causas e soluções aplicadas.

**Quando usar**: Consulte ao encontrar bugs similares ou ao implementar funcionalidades relacionadas.

---

## 📋 Índice de Problemas

1. [Scroll Position Bug - Páginas /criptomoedas](#problema-1-scroll-position-bug)
2. [Flash Visual ao Navegar - Cache](#problema-2-flash-visual-ao-navegar)
3. [Ticker Tape Recarregando](#problema-3-ticker-tape-recarregando)
4. [Fear & Greed Cache Inteligente](#problema-4-fear--greed-cache-inteligente)

---

## Problema 1: Scroll Position Bug

### 🐛 Descrição do Bug
Ao navegar de qualquer página (com scroll para baixo) para páginas da hierarquia `/criptomoedas/*`, a página abria na posição de scroll **anterior** ao invés do topo.

**Afetava:**
- `/criptomoedas` (página principal)
- `/criptomoedas/[slug]` (páginas individuais das moedas)

**Não afetava:** Outras rotas funcionavam normalmente.

### 🔍 Causa Raiz
As páginas de criptomoedas **não tinham** código para forçar scroll para o topo ao montar. O Next.js App Router tem comportamento de scroll restoration que tentava manter a posição, mas estava falhando especificamente nesta hierarquia.

### ✅ Solução Aplicada

**Arquivo**: `app/criptomoedas/page.tsx`
```typescript
export default function CriptomoedasPage() {
  // Forçar scroll para o topo ao montar (fix para bug de scroll)
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

### 📝 Detalhes da Implementação
- **`behavior: 'instant'`**: Scroll sem animação (imperceptível)
- **`top: 0, left: 0`**: Posição exata do topo
- **Dependências**:
  - Página principal: `[]` (executa ao montar)
  - Página da moeda: `[slug]` (executa ao mudar de moeda)

### ⚠️ Tentativas que NÃO Funcionaram
1. ❌ `useLayoutEffect` global no layout root → quebrou todas as páginas
2. ❌ `scroll={false}` nos Links → não resolveu
3. ❌ `window.history.scrollRestoration = 'manual'` → piorou o problema
4. ❌ Múltiplos métodos de scroll (`document.documentElement.scrollTop`) → não ajudou

### 💡 Lição Aprendida
**Controle local > Controle global**: Quando o problema afeta apenas uma hierarquia específica de rotas, aplique a solução **localmente** naquelas páginas ao invés de tentar controlar globalmente no layout.

---

## Problema 2: Flash Visual ao Navegar

### 🐛 Descrição do Bug
Ao navegar entre páginas, elementos que dependiam de fetch (Market Data, Notícias, Educação, Fear & Greed) **"piscavam"** ou apareciam vazios antes de carregar, causando uma experiência visual ruim.

**Manifestação:**
- Velocímetro sumia e reaparecia
- Cards de notícias/educação pulavam na tela
- Market stats "tremiam"

### 🔍 Causa Raiz
Componentes começavam com estado vazio (`null` ou `[]`) e só populavam **após** o fetch completar. Isso criava um "flash" visual onde o conteúdo sumia e reaparecia.

### ✅ Solução Aplicada: Cache Client-Side em Duas Camadas

#### **1. Cache no Componente (sessionStorage)**

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

#### **2. Arquivos Modificados**

**`app/components/DashboardHeader.tsx`**
- Cache key: `fear_greed_index`
- Velocímetro aparece instantaneamente

**`app/page.tsx`**
- Cache keys: `home_market_data`, `home_news_list`, `home_education_list`
- Market Data, Últimas Notícias, Aprenda sobre Cripto

**`app/criptomoedas/[slug]/page.tsx`**
- Cache key: `crypto_${slug}`
- Dados da moeda carregam instantaneamente
- Cache de 1 hora

**`components/TopCryptosList.tsx`**
- Cache key: `crypto_top_list`
- Lista de top 10 moedas
- Cache de 30 minutos

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

### ✅ Solução Aplicada: Elevação do Componente

**Estratégia**: Mover o Ticker para o **layout root** (sempre montado) e controlar visibilidade via CSS.

#### **Mudanças Realizadas**

**1. Remover do DashboardHeader**
```typescript
// app/components/DashboardHeader.tsx
// ❌ REMOVIDO:
import TickerTapeWidget from '@/components/TickerTapeWidget';

// ❌ REMOVIDO:
<TickerTapeWidget />
```

**2. Adicionar ao Layout Root**
```typescript
// app/layout-root.tsx
import dynamic from 'next/dynamic';

const TickerTapeWidget = dynamic(() => import('@/components/TickerTapeWidget'), {
  ssr: false,
});

// Ticker Tape - Sempre montado para evitar recarregamento
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
O Fear & Greed Index estava configurado para **NUNCA usar cache** (`revalidate = 0`), fazendo uma requisição à API externa toda vez que o header era renderizado, mesmo sabendo que o índice atualiza apenas **1x por dia**.

**Problemas:**
- Requisições desnecessárias à API externa
- Risco de atingir rate limits
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

### ✅ Solução Aplicada: Cache Dinâmico

**Arquivo**: `app/api/fear-greed/route.ts`

```typescript
// Cache em memória
let cachedData = null;
let cacheExpiry = 0;

export async function GET() {
  try {
    // Verificar se temos cache válido
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

    // Calcular quando o cache expira baseado no time_until_update
    const timeUntilUpdate = parseInt(fearGreedData.time_until_update);
    cachedData = fearGreedData;
    cacheExpiry = now + (timeUntilUpdate * 1000); // Converter para ms

    return NextResponse.json({
      success: true,
      data: fearGreedData,
      cached: false,
    });
  } catch (error) {
    // Se temos cache antigo, retornar mesmo que expirado
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
Quando uma API fornece informação sobre seu próprio ciclo de atualização (`time_until_update`), use isso para criar um **cache dinâmico inteligente**.

---

## 📋 Checklist de Debug para Problemas Similares

### Scroll Issues
- [ ] Verificar se há `useEffect` com scroll nas páginas afetadas
- [ ] Testar com `behavior: 'instant'` vs `behavior: 'smooth'`
- [ ] Identificar se é problema global (todas as páginas) ou local (hierarquia específica)
- [ ] Evitar controle global se o problema é local

### Flash Visual / Recarregamento
- [ ] Identificar se componente está sendo desmontado/remontado
- [ ] Implementar cache client-side (sessionStorage/localStorage)
- [ ] Padrão: carregar cache imediato + fetch background
- [ ] Para widgets externos: considerar elevação para layout que não desmonta

### Cache / Performance
- [ ] Verificar se API fornece informação sobre ciclo de atualização
- [ ] Implementar cache em dois níveis (server + client)
- [ ] Adicionar fallback para dados em cache quando API falhar
- [ ] Usar `sessionStorage` para dados que mudam raramente na sessão

---

## 🛠️ Padrões Estabelecidos

### Pattern 1: Cache Client-Side com Background Update
```typescript
const fetchData = async () => {
  const CACHE_KEY = 'unique_key';

  // Imediato: carregar cache
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    setData(JSON.parse(cached));
  }

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

**Última atualização**: 2025-10-28
**Versão**: 1.0
