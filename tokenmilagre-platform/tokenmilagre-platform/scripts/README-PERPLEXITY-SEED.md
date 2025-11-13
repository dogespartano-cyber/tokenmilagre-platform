# 🤖 Script de Automação - Seed com Perplexity API

Gera e publica automaticamente artigos usando a **mesma lógica do /dashboard/criar-artigo**.

## ✨ Features

- ✅ Reutiliza prompts e configurações do dashboard
- ✅ Gera 10 artigos por categoria (notícias, educação, recursos)
- ✅ Salva automaticamente no banco com citations/sources
- ✅ Rate limiting automático (evita bater limites da API)
- ✅ Retry logic com backoff exponencial
- ✅ Logs detalhados de progresso
- ✅ Modo dry-run para testes

## 📋 Pré-requisitos

1. **Perplexity API Key**:
   ```bash
   PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxx
   ```
   Adicione no `.env`

2. **Usuário ADMIN no banco**:
   - O script precisa de um usuário com role ADMIN
   - Artigos serão criados com esse authorId

3. **Dependências**:
   ```bash
   npm install
   # ou
   yarn install
   ```

## 🚀 Uso

### Opção 1: NPM Script (Recomendado)

Adicione ao `package.json`:
```json
{
  "scripts": {
    "seed:perplexity": "ts-node --project tsconfig.json scripts/seed-with-perplexity.ts"
  }
}
```

Execute:
```bash
npm run seed:perplexity
```

### Opção 2: Direto com ts-node

```bash
npx ts-node scripts/seed-with-perplexity.ts
```

### Opção 3: Dry Run (Testa sem salvar)

```bash
npm run seed:perplexity -- --dry-run
```

## ⚙️ Configuração

Edite as constantes no início do script:

```typescript
const config: Config = {
  perplexityApiKey: process.env.PERPLEXITY_API_KEY || '',
  model: 'sonar',  // ou 'sonar-pro' para melhor qualidade
  delayBetweenRequests: 2000,  // ms entre requisições
  maxRetries: 3,
  dryRun: process.argv.includes('--dry-run')
};
```

### Modelos Disponíveis

| Modelo | Custo (Input) | Custo (Output) | Qualidade | Uso |
|--------|--------------|----------------|-----------|-----|
| `sonar` | $1/M tokens | $1/M tokens | Boa | Desenvolvimento |
| `sonar-pro` | $3/M tokens | $15/M tokens | Excelente | Produção |

## 📝 O Que é Gerado

### 10 Notícias

Tópicos incluem:
- Bitcoin ultrapassando $100k
- Ethereum 2.0 upgrades
- Regulamentação no Brasil
- NFTs e música
- Solana recordes
- Bancos tradicionais adotando cripto
- DeFi TVL milestones
- Hacks e segurança
- Stablecoins dominância
- Web3 investimentos

**Campos salvos**:
```typescript
{
  type: 'news',
  title, slug, content, excerpt,
  category, tags, sentiment,
  readTime, published: true,
  factCheckSources: JSON.stringify(citations)
}
```

### 10 Artigos Educacionais

Tópicos incluem:
- Como comprar primeira cripto
- Blockchain explicado
- Hot vs Cold wallets
- Smart Contracts
- DeFi para iniciantes
- Análise técnica
- Identificar golpes
- NFTs casos de uso
- Tokenomics
- Layer 2 solutions

**Campos salvos**:
```typescript
{
  type: 'educational',
  title, slug, content, excerpt,
  category, tags, level,
  contentType, readTime,
  published: true,
  factCheckSources: JSON.stringify(citations)
}
```

### 10 Recursos

Recursos incluem:
- MetaMask, Ledger, Phantom (wallets)
- Binance (exchange)
- Etherscan (explorer)
- Uniswap, Aave (DeFi)
- Brave Browser
- CoinGecko, DexScreener (tools)

**Campos salvos**:
```typescript
{
  name, slug, category,
  shortDescription, officialUrl,
  platforms, tags,
  verified: true,
  sources: JSON.stringify(citations)
}
```

## 🎯 Fluxo de Execução

```
1. Validar PERPLEXITY_API_KEY
   ↓
2. Buscar usuário ADMIN no banco
   ↓
3. Para cada categoria:
   ├─ Gerar artigo via Perplexity API
   │  ├─ Montar prompt específico
   │  ├─ Chamar API com return_citations: true
   │  ├─ Extrair JSON da resposta
   │  └─ Extrair citations
   ├─ Processar localmente
   │  ├─ Gerar slug único
   │  ├─ Calcular readTime
   │  └─ Validar campos
   ├─ Salvar no banco (Prisma)
   │  └─ factCheckSources/sources como JSON
   ├─ Log de sucesso
   └─ Delay (2s padrão)
```

## 💰 Estimativa de Custos

Assumindo:
- 30 artigos total
- ~1000 tokens input por artigo
- ~2000 tokens output por artigo
- Modelo: `sonar`

**Cálculo**:
```
Input:  30 × 1000 = 30,000 tokens = $0.03
Output: 30 × 2000 = 60,000 tokens = $0.06
Requests: 30 × $0.005 = $0.15
-------------------------------------------
TOTAL: ~$0.24 USD
```

Com `sonar-pro` seria ~$1.05 USD (melhor qualidade).

## ⚠️ Limitações da API Perplexity

- **Rate Limit**: ~20 requests/minuto (free tier)
- **Concurrent**: 1 request por vez recomendado
- **Timeout**: 60 segundos por request
- **Max Tokens**: 4096 output tokens

O script já inclui:
- Delay de 2s entre requisições
- Retry com backoff exponencial
- Tratamento de erros

## 🔍 Logs de Exemplo

```
🤖 Script de Automação - Seed com Perplexity API

✓ Usando usuário: admin@tokenmilagre.xyz
✓ Modelo: sonar
✓ Dry run: NÃO

📰 Gerando 10 notícias...

[1/10] Bitcoin ultrapassa $100.000 pela primeira vez na história
   🔄 Gerando notícia: "Bitcoin ultrapassa $100.000 pela primeira vez..."
   ✓ Gerado: "Bitcoin Atinge Marco Histórico de $100k"
   📚 5 fontes encontradas
   💾 Salvo no banco: ID clw1x2y3z4
   ✅ Completo

[2/10] Ethereum 2.0 completa upgrade...
   ...

============================================================
✅ Seed concluído!

📊 Resumo:
   • Sucesso: 30/30
   • Erros: 0/30
   • Dry run: NÃO

🎉 Todos os artigos foram salvos no banco de dados!
```

## 🛠️ Troubleshooting

### "PERPLEXITY_API_KEY não configurada"
```bash
echo "PERPLEXITY_API_KEY=pplx-xxxxx" >> .env
```

### "Nenhum usuário ADMIN encontrado"
Crie um usuário admin via:
```bash
npm run seed:create-admin
```

### "Rate limit exceeded"
Aumente `delayBetweenRequests` no config:
```typescript
delayBetweenRequests: 5000  // 5 segundos
```

### "Perplexity API error: 429"
Você atingiu o rate limit. Espere 1 minuto e tente novamente.

### "Slug já existe"
O script adiciona data ao slug de notícias automaticamente. Se persistir:
- Verifique se não há artigos duplicados no banco
- Limpe o banco antes de rodar seed

### Erro de parsing JSON
A Perplexity às vezes retorna markdown em vez de JSON. O script tenta extrair JSON de code blocks. Se falhar:
- Use modelo `sonar-pro` (mais confiável)
- Ajuste os prompts para enfatizar JSON

## 📚 Arquivos Relacionados

- `/app/dashboard/criar-artigo` - Dashboard que serve de base
- `/app/api/generate-article` - API de geração (não usada pelo script)
- `/app/api/chat-perplexity` - API de chat (não usada pelo script)
- `/app/api/articles` - API para salvar artigos
- `/app/api/resources` - API para salvar recursos
- `/lib/citations-processor.tsx` - Processa citations no frontend
- `/.claude/skills/features/tokenmilagre-citations` - Documentação de citations

## 🚦 Status

- [x] Script criado
- [x] Prompts configurados
- [x] Rate limiting implementado
- [x] Retry logic com backoff
- [x] Dry run mode
- [x] Logs detalhados
- [x] Salvamento no banco
- [ ] Testes automatizados
- [ ] Suporte a CLI args (--type, --count)
- [ ] Progress bar visual

## 🤝 Contribuindo

Para adicionar novos tópicos:

1. Edite as constantes:
```typescript
const NEWS_TOPICS = [
  'Seu novo tópico aqui',
  ...
];
```

2. Execute novamente:
```bash
npm run seed:perplexity
```

---

**Criado**: 2025-11-13  
**Versão**: 1.0.0  
**Mantido por**: TokenMilagre Team
