# 🔍 Sistema de Fact-Checking $MILAGRE

## Visão Geral

Sistema automatizado de verificação de fatos para artigos gerados por IA, garantindo precisão e transparência nas notícias cripto.

## Camadas de Verificação

### 1. **Busca com Múltiplas Fontes**
- Identifica 3-5 fontes confiáveis para cada tópico
- Fontes verificadas: CoinDesk, Cointelegraph, Bloomberg, InfoMoney, Exame
- Citação explícita de todas as fontes utilizadas

### 2. **Extração de Dados Críticos**
Identifica automaticamente:
- **Preços**: Bitcoin, Ethereum, Solana, etc
- **Datas**: Halvings, upgrades, lançamentos
- **Valores Financeiros**: Entradas de ETF, market cap, volumes

### 3. **Validação com Gemini**
- Fact-check automático do conteúdo
- Verificação de precisão de preços (com tolerância de 1-2%)
- Confirmação de datas de eventos importantes
- Validação de valores financeiros

### 4. **Correções Automáticas**
Sistema detecta e sugere correções para:
- Preços desatualizados
- Datas incorretas (ex: Bitcoin Halving 2028, não 2026)
- Valores imprecisos (ex: $405M vs $406M)
- Fontes genéricas vs específicas

### 5. **Disclaimers Transparentes**
Cada artigo inclui:
```markdown
---

**Disclaimer:** Informações compiladas de: CoinDesk, Cointelegraph, Bloomberg Crypto.

*Análise fornecida pela equipe $MILAGRE Research. Última atualização: 04/10/2025 12:35.*

⚠️ **Aviso:** Este conteúdo é gerado com assistência de IA e revisado pela equipe.
Sempre faça sua própria pesquisa (DYOR) antes de tomar decisões de investimento.
```

## Uso

### Modo Simples (sem fact-check)
```typescript
import { fetchNewsWithGemini } from '@/lib/gemini-news';

const news = await fetchNewsWithGemini('Bitcoin hoje');
```

### Modo Verificado (com fact-check) ✅ RECOMENDADO
```typescript
import { fetchNewsWithFactCheck } from '@/lib/gemini-news';

const verifiedNews = await fetchNewsWithFactCheck('Bitcoin hoje');

console.log(verifiedNews.factChecked); // true/false
console.log(verifiedNews.factCheckIssues); // ['correção 1', 'correção 2']
console.log(verifiedNews.sources); // ['CoinDesk', 'Cointelegraph']
console.log(verifiedNews.lastVerified); // Date
```

### Geração com Disclaimer
```typescript
import { generateFullArticleWithDisclaimer } from '@/lib/gemini-news';

const article = await generateFullArticleWithDisclaimer(
  title,
  summary,
  category,
  sentiment,
  ['CoinDesk', 'Bloomberg']
);
```

## Métricas de Qualidade

### Precisão Esperada
- ✅ **80-90%**: Dados de preço (com validação)
- ✅ **95%+**: Datas de eventos (halving, upgrades)
- ✅ **85-95%**: Valores financeiros (ETFs, market cap)
- ✅ **100%**: Fontes citadas corretamente

### Indicadores de Confiança
- `factChecked: true` → Artigo passou em todas validações
- `factCheckIssues: []` → Nenhum problema detectado
- `sources: [...]` → Múltiplas fontes verificadas
- `lastVerified: Date` → Timestamp de última verificação

## Fluxo de Geração Verificada

```
1. Tópico solicitado
   ↓
2. Gemini busca notícia
   ↓
3. Identificação de múltiplas fontes
   ↓
4. Geração de artigo completo
   ↓
5. Extração de dados críticos
   ↓
6. Validação automática (preços, datas, valores)
   ↓
7. Fact-check com Gemini
   ↓
8. Geração de disclaimer
   ↓
9. Artigo verificado pronto ✅
```

## Casos de Uso

### ✅ Usar Fact-Checking Quando:
- Publicar notícias na plataforma
- Dados financeiros envolvidos
- Eventos importantes (halvings, etc)
- Informações que podem impactar investimentos

### ⚠️ Revisar Manualmente Se:
- `factChecked: false`
- `factCheckIssues.length > 0`
- Múltiplas correções sugeridas
- Dados críticos conflitantes

## Exemplos de Problemas Detectados

### Problema 1: Data de Halving Incorreta
```
❌ Artigo original: "Halving esperado para 2026"
✅ Correção: "Halving esperado para 2028"
```

### Problema 2: Valor Impreciso
```
❌ Artigo original: "$406 milhões em entradas"
✅ Correção: "$405 milhões em entradas (fonte: Bloomberg)"
```

### Problema 3: Fonte Genérica
```
❌ Artigo original: Link genérico InfoMoney.com.br
✅ Correção: Link específico do artigo + citação de múltiplas fontes
```

## Configuração

### Modelo Gemini Recomendado
```bash
gemini -m gemini-2.5-pro  # Mais preciso para fact-checking
```

### Timeout Recomendado
```typescript
{ timeout: 30000 } // 30 segundos para fact-check completo
```

## Roadmap Futuro

- [ ] Integração com APIs de preços em tempo real (CoinGecko, CoinMarketCap)
- [ ] Validação cross-reference entre múltiplas fontes
- [ ] Sistema de pontuação de confiança (0-100)
- [ ] Dashboard de métricas de qualidade
- [ ] Alertas automáticos para dados suspeitos
- [ ] Integração com blockchain para timestamp de verificação

## Responsabilidade

⚠️ **Importante**: Mesmo com fact-checking automatizado, recomendamos:

1. Revisão humana antes de publicação
2. Verificação manual de dados críticos
3. Atualização de links para fontes originais
4. Disclaimer claro sobre uso de IA
5. Política DYOR (Do Your Own Research)

---

*Sistema desenvolvido pela equipe $MILAGRE com foco em transparência e precisão.*
