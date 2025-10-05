# 📰 Guia Completo de Criação de Artigos - TokenMilagre

## 🎯 Workflow Recomendado

### Etapa 1: Pesquisa com Perplexity Pro

**Prompt base para Perplexity:**
```
Pesquise notícias recentes sobre [TEMA] em fontes confiáveis de criptomoedas.
Inclua dados verificáveis, análise detalhada e cite todas as fontes.
Retorne um artigo completo em português brasileiro com:
- Título atrativo
- Resumo executivo (máximo 200 caracteres)
- Desenvolvimento em seções com ## (markdown)
- Análise de impacto e perspectivas
- Lista de fontes consultadas ao final
```

**Características do conteúdo do Perplexity:**
- ✅ Fontes REAIS e verificáveis
- ✅ Fact-checking automático
- ✅ Múltiplas fontes citadas
- ✅ Dados atualizados
- ✅ URLs completas das fontes

### Etapa 2: Formatação com Claude

Cole o texto do Perplexity no Claude e peça:

```
Formate este conteúdo seguindo o template-artigo.md para o $MILAGRE:
- Adicione seção "Contexto para Iniciantes"
- Estruture em seções com ## (H2) e ### (H3)
- Defina sentimento: positive/neutral/negative
- Sugira 5-7 keywords relevantes
- Categorias: [Bitcoin, Ethereum, Solana, DeFi, NFTs, Regulação, Tecnologia, Análise, Exchanges]
- Gere slug amigável para URL
- Liste fontes no formato de array
```

### Etapa 3: Validação e Publicação

Claude irá:
1. ✅ Estruturar o JSON completo
2. ✅ Adicionar metadata (id, slug, publishedAt)
3. ✅ Validar formato markdown
4. ✅ Adicionar ao `data/news.json`
5. ✅ Fazer commit automático
6. ✅ Push para repositório

---

## 📋 Estrutura de Metadados

```json
{
  "id": "slug-url-amigavel",
  "slug": "slug-url-amigavel",
  "title": "Título completo do artigo",
  "summary": "Resumo executivo em até 200 caracteres para SEO",
  "content": "Artigo completo em Markdown (seguir template-artigo.md)",
  "url": "#",
  "source": "$MILAGRE Research",
  "publishedAt": "2025-10-04T21:55:00.000Z",
  "category": ["Bitcoin", "Regulação"],
  "sentiment": "positive",
  "keywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4", "Keyword5"],
  "factChecked": true,
  "sources": [
    "Cointelegraph",
    "Reuters",
    "CoinDesk",
    "Bloomberg Crypto"
  ],
  "lastVerified": "2025-10-04T21:55:00.000Z"
}
```

---

## 🎨 Padrão de Formatação Markdown

### ✅ Elementos OBRIGATÓRIOS

1. **Título H1** (uma vez no início)
   ```markdown
   # Título Principal do Artigo
   ```

2. **Parágrafo Introdutório** (2-3 parágrafos)
   - Contextualizar o tema
   - Explicar a relevância
   - Destacar principais impactos

3. **Seção "Contexto para Iniciantes"**
   ```markdown
   ## Contexto para Iniciantes

   **O que é [conceito]?**
   [Explicação simples]

   **Por que isso importa?**
   [Relevância para iniciantes]
   ```

4. **Seções H2 para estrutura principal**
   - `## O Que Aconteceu`
   - `## [Análise/Estratégia/Contexto]`
   - `## Por Que Isso É Relevante?`
   - `## [Desafios/Perspectivas]`
   - `## Conclusão`

5. **Nota de Transparência no final**
   ```markdown
   ---

   **Nota de Transparência:** Este artigo foi pesquisado via Claude com busca web em tempo real e verificação de fontes primárias, formatado pela equipe $MILAGRE Research. O conteúdo é educacional e informativo, não constituindo aconselhamento financeiro ou de investimento.
   ```

### ❌ Elementos PROIBIDOS

- ❌ **Emojis no corpo do artigo** (usar apenas FontAwesome na UI)
- ❌ **Seção "Fontes Consultadas" no markdown** (usar campo `sources` do JSON)
- ❌ **Links fictícios ou inventados**
- ❌ **Dados sem fonte verificável**
- ❌ **Títulos genéricos tipo "Introdução"**
- ❌ **Mencionar IAs específicas na nota de transparência** (usar apenas "Claude")

### ✅ Boas Práticas de Escrita

1. **Negrito para ênfase:**
   ```markdown
   - **US$ 776 milhões** em valor
   - **6.338 BTC** nas reservas
   ```

2. **Listas com marcadores:**
   ```markdown
   - **Ponto 1:** Descrição
   - **Ponto 2:** Descrição
   - **Ponto 3:** Descrição
   ```

3. **Citações:**
   ```markdown
   > "Texto da citação" - Nome da Fonte
   ```

4. **Seções numeradas quando relevante:**
   ```markdown
   ### 1. Primeira Razão
   ### 2. Segunda Razão
   ### 3. Terceira Razão
   ```

5. **Subtítulos H3 descritivos:**
   ```markdown
   ### Novo Recorde em Valor USD
   ### Compras Recentes
   ### Projeções Futuras
   ```

---

## 🎯 Classificação de Sentimento

### Positive ✅
- Altas de preço, adoção institucional, upgrades
- Aprovações regulatórias, parcerias, recordes
- Inovações tecnológicas, crescimento de mercado
- Adoção em massa, casos de uso bem-sucedidos

### Neutral ⚪
- Análises técnicas equilibradas
- Dados de mercado sem tendência clara
- Mudanças regulatórias em discussão
- Eventos sem impacto definido

### Negative ⚠️
- Quedas de preço, hacks, fraudes
- Multas regulatórias, proibições
- Falências, problemas técnicos
- Críticas fundamentadas, riscos identificados

---

## 📂 Categorias Disponíveis

- `Bitcoin` - Notícias sobre BTC
- `Ethereum` - Notícias sobre ETH
- `Solana` - Notícias sobre SOL
- `DeFi` - Finanças descentralizadas
- `NFTs` - Tokens não fungíveis
- `Regulação` - Leis, SEC, compliance, decisões judiciais
- `Tecnologia` - Upgrades, inovações, melhorias de protocolo
- `Análise` - Análise técnica/fundamental de mercado
- `Exchanges` - Binance, Coinbase, corretoras

**Regra:** Usar 1-3 categorias por artigo (máximo 3)

---

## 🔍 Fontes Mapeadas com URLs

As fontes abaixo já têm URLs mapeadas no componente `ArtigoClient.tsx` (total: 22 fontes):

- `Cointelegraph` → https://cointelegraph.com
- `CoinDesk` → https://www.coindesk.com
- `The Block` → https://www.theblock.co
- `Reuters` → https://www.reuters.com
- `Bloomberg Crypto` → https://www.bloomberg.com/crypto
- `Yahoo Finance` → https://finance.yahoo.com
- `InfoMoney` → https://www.infomoney.com.br
- `PANews` → https://www.panewslab.com
- `Bitbo.io` → https://bitbo.io
- `TicoTimes` → https://ticotimes.net
- `Crystal Intelligence` → https://crystalintelligence.com
- `WebProNews` → https://www.webpronews.com
- `Anadolu Agency` → https://www.aa.com.tr
- `BBC Portuguese` → https://www.bbc.com/portuguese
- `Coinfomania` → https://coinfomania.com
- `99Bitcoins` → https://99bitcoins.com
- `Coin Central` → https://coincentral.com
- `CoinGecko` → https://www.coingecko.com
- `Coin Bureau` → https://www.coinbureau.com
- `Standard Chartered` → https://www.sc.com
- `Morningstar` → https://www.morningstar.com
- `CoinMarketCap` → https://coinmarketcap.com

**Para adicionar nova fonte:** Editar `ArtigoClient.tsx` linha ~511 e adicionar ao objeto `sourceUrls`

---

## 📊 Métricas de Qualidade

### ✅ Checklist Final Antes de Publicar

- [ ] Título atrativo e informativo
- [ ] Resumo tem máximo 200 caracteres
- [ ] Seção "Contexto para Iniciantes" presente
- [ ] Conteúdo usa estrutura ## e ### (H2 e H3)
- [ ] Fontes estão no array `sources` (não no markdown)
- [ ] Todas as fontes são verificáveis
- [ ] Dados têm fontes citadas no texto
- [ ] Sentimento está correto (positive/neutral/negative)
- [ ] Keywords são relevantes (5-7 palavras)
- [ ] Categorias corretas (1-3)
- [ ] Slug é URL-friendly (sem espaços, caracteres especiais)
- [ ] Nota de Transparência presente no final
- [ ] SEM emojis no corpo do artigo
- [ ] SEM seção "Fontes Consultadas" no markdown

---

## 💡 Dicas de Redação

### Linguagem
- ✅ Escrever em português brasileiro formal
- ✅ Usar termos técnicos quando necessário (explicar na primeira vez)
- ✅ Manter tom educacional e informativo
- ✅ Evitar sensacionalismo
- ✅ Usar dados concretos e verificáveis

### Estrutura
- ✅ Parágrafos curtos (3-5 linhas)
- ✅ Usar listas para facilitar leitura
- ✅ Destacar números importantes em negrito
- ✅ Incluir análise, não apenas relatar fatos
- ✅ Conectar o tema com contexto maior do mercado cripto

### Tamanho Ideal
- **Mínimo:** 800 palavras
- **Ideal:** 1.200-1.800 palavras
- **Máximo:** 2.500 palavras

---

## 🚀 Exemplos de Prompts para Perplexity

### Tema: Reservas de Bitcoin de País
```
Pesquise sobre as reservas de Bitcoin de El Salvador em fontes confiáveis.
Inclua:
- Quantidade atual de BTC nas reservas
- Valor em dólares atualizado
- Estratégia de acumulação do governo
- Relação com o FMI
- Opiniões de especialistas
Cite todas as fontes com URLs.
```

### Tema: Decisão Judicial sobre NFTs
```
Pesquise decisões judiciais recentes sobre NFTs como valores mobiliários
nos EUA em fontes confiáveis. Inclua:
- Decisões de cortes federais
- Aplicação do Howey Test
- Impacto para projetos NFT
- Reação do mercado e SEC
Cite todas as fontes com URLs.
```

### Tema: ETF de Bitcoin
```
Pesquise sobre entradas de capital em ETFs de Bitcoin à vista nos EUA
em fontes confiáveis. Inclua:
- Volume de entrada recente
- Principais ETFs (BlackRock, Fidelity)
- Impacto no preço do BTC
- Análise institucional
Cite todas as fontes com URLs.
```

### Tema: Upgrade de Ethereum
```
Pesquise sobre o upgrade [nome] do Ethereum em fontes técnicas confiáveis.
Inclua:
- Mudanças técnicas implementadas
- Impacto na escalabilidade
- Redução de custos esperada
- Reação da comunidade
- Timeline de implementação
Cite todas as fontes com URLs.
```

---

## 📈 Comparação de Métodos

| Método | Tokens Claude | Fontes | Fact-check | Custo | Recomendado |
|--------|---------------|--------|------------|-------|-------------|
| **Perplexity + Claude** | ~10k | ✅ Reais | ✅ Auto | $ | ✅ SIM |
| Claude + Gemini MCP | ~41k | ❌ Fictícias | ❌ Não | $$$ | ❌ NÃO |
| Manual | ~8k | ✅ Reais | Manual | $ | ⚠️ Trabalhoso |

**Melhor custo-benefício:** Perplexity Pro + Claude

## 🎨 Padrão de Design Visual

### Ícones FontAwesome (NÃO usar emojis)

**Ícones implementados na UI:**
- 📅 Data: `faCalendar`
- 💬 Comentários: `faComments`
- 🎓 Educação: `faGraduationCap`
- 🔗 Link externo: `faExternalLinkAlt`
- 📖 Livro/Índice: `faBook`
- 📚 Leitura: `faBookOpen`
- ⬅️ Voltar: `faChevronLeft`
- ➡️ Avançar: `faChevronRight`
- 🟢 Positivo: `faCircle` (verde)
- 🔴 Negativo: `faCircle` (vermelho)
- 🟡 Neutro: `faCircle` (amarelo)
- 📈 Alta: `faArrowUp`
- 📉 Baixa: `faArrowDown`
- ➖ Neutro: `faMinus`

**Redes sociais:**
- Discord: `faDiscord`
- Telegram: `faTelegram`
- Twitter/X: `faXTwitter`
- WhatsApp: `faWhatsapp`

### Links das Fontes

Todos os links de fontes consultadas são:
- ✅ Clicáveis com `target="_blank"`
- ✅ Hover amarelo (`hover:text-yellow-300`)
- ✅ Ícone de link externo (`faExternalLinkAlt`)
- ✅ Mapeados no objeto `sourceUrls` (ArtigoClient.tsx:511)

### CTAs Comunitários

Cada artigo inclui seção "Participe da Discussão" com:
- Discord: https://discord.gg/ybJ4Mgxu
- Telegram: https://t.me/+Bop_TVFc_mg3Njlh
- Link biblioteca educacional: /educacao

---

## 🔄 Fluxo de Trabalho Visual

```
┌─────────────────────┐
│  Perplexity Pro    │
│  (Pesquisa)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Claude Code       │
│  (Formatação)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  data/news.json    │
│  (Publicação)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Git Commit/Push   │
│  (Deploy Auto)     │
└─────────────────────┘
```

---

## 📞 Suporte

Para dúvidas sobre a criação de artigos:
- Template: `/docs/template-artigo.md`
- Exemplos: Verificar artigos em `/data/news.json`
- Componente: `/app/dashboard/noticias/[slug]/ArtigoClient.tsx`

---

## 📝 Checklist Final Atualizado

Antes de publicar, verificar:

- [ ] **Conteúdo**
  - [ ] Título atrativo e descritivo
  - [ ] Resumo com máximo 200 caracteres
  - [ ] Seção "Contexto para Iniciantes" presente
  - [ ] Estrutura H2/H3 bem definida
  - [ ] Dados verificáveis com fontes
  - [ ] Conclusão forte

- [ ] **Metadata**
  - [ ] Slug URL-friendly
  - [ ] Sentimento correto (positive/neutral/negative)
  - [ ] 5-7 keywords relevantes
  - [ ] 1-3 categorias apropriadas
  - [ ] Campo `sources` preenchido (array)
  - [ ] `factChecked: true`
  - [ ] `lastVerified` com timestamp

- [ ] **Design**
  - [ ] SEM emojis no corpo do artigo
  - [ ] SEM seção "Fontes Consultadas" no markdown
  - [ ] Nota de transparência padrão (mencionar apenas "Claude")
  - [ ] Links das fontes mapeados em `sourceUrls`

- [ ] **Git**
  - [ ] Commit com mensagem descritiva
  - [ ] Push para repositório
  - [ ] Verificar deploy automático

---

**Última atualização:** 04 de outubro de 2025 (23:30 BRT)
**Versão:** 2.0 - Atualizado com FontAwesome, nota de transparência padrão e 22 fontes mapeadas
