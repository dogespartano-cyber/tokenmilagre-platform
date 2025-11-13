# 🌱 Script de Seed - TokenMilagre Platform

## ✅ Implementado

Este projeto inclui um script de seed completo que popula o banco de dados com:

- **10 Notícias** com fontes verificadas
- **10 Artigos Educacionais** (iniciante, intermediário, avançado)
- **10 Recursos** (wallets, exchanges, explorers, DeFi, browsers, tools)

## 📝 Estrutura dos Dados

### Notícias (type: 'news')
- Bitcoin atin ge recorde histórico
- Ethereum completa merge
- Regulação cripto no Brasil
- NFTs ganham utilidade real
- Solana processa recordes
- Bancos oferecem custódia
- DeFi ultrapassa $150B
- Hack em exchange descentralizada
- Stablecoins atingem $180B
- Web3 e Metaverso recebem $10B

### Educação (type: 'educational')
- Como Comprar Sua Primeira Criptomoeda (iniciante)
- Entendendo Blockchain (iniciante)
- Carteiras: Hot vs Cold Wallets (iniciante)
- O que são Smart Contracts (intermediário)
- DeFi: Empréstimos e Staking (intermediário)
- Análise Técnica (intermediário)
- Como Identificar Golpes (iniciante)
- NFTs além da Arte (intermediário)
- Tokenomics (avançado)
- Layer 2: Escalabilidade Ethereum (avançado)

### Recursos
- MetaMask (wallet)
- Ledger (wallet)
- Binance (exchange)
- Etherscan (explorer)
- Uniswap (DeFi)
- Brave Browser (browser)
- Aave (DeFi)
- CoinGecko (tool)
- Phantom (wallet)
- DexScreener (tool)

## 🚀 Como Executar

### 1. Certifique-se de ter um usuário ADMIN

```bash
npm run seed:create-admin  # Se necessário
```

### 2. Execute o seed

```bash
npx ts-node prisma/seed.ts
# ou
npm run seed
```

### 3. Verifique no banco

```bash
npx prisma studio
```

## 📊 Fontes Incluídas

Cada item inclui **5 fontes verificadas** de sites confiáveis:
- CoinDesk, CoinTelegraph, Bloomberg (notícias)
- Ethereum.org, Bitcoin.org (documentação oficial)
- Academy sites (educação)
- Sites oficiais dos recursos

## 🎯 Template de Fontes

Todos os itens usam o componente `SourcesSection`:
- Botão "📚 5 fontes ▼"
- Links clicáveis
- Extração automática de domínio

## 📝 Formato dos Dados

### Citations/Sources Format
```json
[
  "https://coindesk.com/...",
  "https://cointelegraph.com/...",
  "https://ethereum.org/...",
  "https://bitcoin.org/...",
  "https://academy.binance.com/..."
]
```

Armazenado como:
- **Articles**: `factCheckSources` (JSON string)
- **Resources**: `sources` (JSON string)

## 🔧 Troubleshooting

### "Nenhum usuário ADMIN encontrado"
Crie um usuário admin primeiro no sistema.

### Erro de type mismatch
Verifique se o Prisma client foi regenerado:
```bash
npx prisma generate
```

### Migration pendente
Execute:
```bash
npx prisma migrate dev
```

## 📚 Documentação

Ver também:
- `/.claude/skills/features/tokenmilagre-citations/SKILL.md`
- `/prisma/schema.prisma`
- `/lib/citations-processor.tsx`

---

**Status**: ✅ Implementado e pronto para uso
**Última atualização**: 2025-11-13
